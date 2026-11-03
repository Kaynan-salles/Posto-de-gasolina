try {
  require('dotenv').config();
} catch (e) {}

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const CACHED_FILES = {};

function registerFile(route, filePath) {
  try {
    if (!fs.existsSync(filePath)) return;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) return;

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);

    CACHED_FILES[route] = {
      content,
      gzipContent: zlib.gzipSync(content),
      type
    };
  } catch (e) {
    console.warn('Erro ao registrar:', route, e.message);
  }
}

function scanDir(dir, basePath = '') {
  try {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'scratch') continue;
      const fullPath = path.join(dir, entry.name);
      const relRoute = (basePath + '/' + entry.name).replace(/\\/g, '/').replace(/\/+/g, '/');
      if (entry.isDirectory()) {
        scanDir(fullPath, relRoute);
      } else {
        registerFile(relRoute, fullPath);
      }
    }
  } catch (e) {
    console.warn('Erro ao escanear dir:', dir, e.message);
  }
}

scanDir(PUBLIC_DIR);

const ROUTE_ALIASES = {
  '/': '/index.html',
  '/index': '/index.html',
  '/index.html': '/index.html',
  '/app': '/index.html',
  '/clube': '/index.html',
  '/login': '/login.html',
  '/entrar': '/login.html',
  '/cadastro': '/cadastro.html',
  '/cadastrar': '/cadastro.html',
  '/recuperar-senha': '/recuperar-senha.html',
  '/recuperar': '/recuperar-senha.html',
  '/convite': '/index.html',
  '/indicar': '/index.html',
  '/boas-vindas': '/index.html',
  '/instalar': '/instalar.html',
  '/manifest.json': '/manifest.json',
  '/sw.js': '/sw.js',
  '/site': '/site/index.html',
  '/site/': '/site/index.html'
};

function sendCachedResponse(req, res, fileObj, isSw = false) {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': fileObj.type,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': isSw ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600',
    'Vary': 'Accept-Encoding'
  };
  if (isSw) {
    headers['Service-Worker-Allowed'] = '/';
  }

  if (acceptEncoding.includes('gzip') && fileObj.gzipContent) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers);
    res.end(fileObj.gzipContent);
  } else {
    res.writeHead(200, headers);
    res.end(fileObj.content);
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // API pública de configuração do Supabase (Apenas URL e Chave Anon pública)
  if (req.method === 'GET' && req.url === '/api/auth/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }));
  }

  // API administrativa de provisionamento de contas demo
  if (req.method === 'POST' && req.url === '/api/auth/provision-demo') {
    try {
      const { provisionAccounts } = require('./scripts/provision_accounts.js');
      provisionAccounts().then(result => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      }).catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API para salvar imagens geradas (ícones PWA em alta definição)
  if (req.method === 'POST' && req.url === '/api/save-image') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const targetPath = path.normalize(path.join(PUBLIC_DIR, data.targetPath));
        if (!targetPath.startsWith(PUBLIC_DIR)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Caminho proibido' }));
        }
        const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
        registerFile(data.targetPath.startsWith('/') ? data.targetPath : '/' + data.targetPath, targetPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, path: targetPath }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  let safePath = decodeURI(req.url.split('?')[0]);
  if (ROUTE_ALIASES[safePath]) {
    safePath = ROUTE_ALIASES[safePath];
  }

  let resolvedPath = path.normalize(path.join(PUBLIC_DIR, safePath));
  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Proibido');
  }

  if (fs.existsSync(resolvedPath)) {
    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      const idx = path.join(resolvedPath, 'index.html');
      if (fs.existsSync(idx)) {
        return serveDiskFile(req, res, idx);
      }
    } else {
      return serveDiskFile(req, res, resolvedPath);
    }
  }

  const isSw = safePath === '/sw.js';

  if (CACHED_FILES[safePath] && !isSw) {
    return sendCachedResponse(req, res, CACHED_FILES[safePath]);
  }

  if (CACHED_FILES[safePath + '.html']) {
    return sendCachedResponse(req, res, CACHED_FILES[safePath + '.html']);
  }

  if (!path.extname(safePath) && CACHED_FILES['/index.html']) {
    return sendCachedResponse(req, res, CACHED_FILES['/index.html']);
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<h1>404 Nao Encontrado</h1><p>O arquivo ${safePath} nao foi localizado.</p><p><a href="/index.html">Voltar ao Inicio</a></p>`);
});

function serveDiskFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Erro interno: ' + err.message);
    }
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    };

    if (acceptEncoding.includes('gzip')) {
      zlib.gzip(content, (zErr, gzipped) => {
        if (!zErr && gzipped) {
          headers['Content-Encoding'] = 'gzip';
          res.writeHead(200, headers);
          res.end(gzipped);
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    } else {
      res.writeHead(200, headers);
      res.end(content);
    }
  });
}

module.exports = server;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Clube Fidelidade] Rodando em http://localhost:${PORT}`);
  });
}
