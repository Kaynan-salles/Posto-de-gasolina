/**
 * GRUPO OLIVEIRA — HUB DE SINCRONIZAÇÃO EM TEMPO REAL
 * Suporta sincronização instantânea entre múltiplos dispositivos (Celulares, Tablets, PC):
 * - Cliente (Gera QR Code / solicita desconto de cashback)
 * - Frentista (Lê QR Code / registra abastecimento / confirma pagamento)
 * - Proprietário (Dashboard executivo consolidado em tempo real)
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'sync_db.json');

// Garante que o diretório de dados exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Conjunto de clientes conectados ao Server-Sent Events (SSE)
const sseClients = new Set();

// Estado padrão robusto e realista para demonstração executiva
function getDefaultDatabase() {
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return {
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    customers: {
      'CLI-0824': {
        id: 'CLI-0824',
        name: 'Kaynã Viana',
        email: 'cliente@grupooliveira.com.br',
        cardNumber: '4589 8210 3349 1204',
        balance: 38.50,
        points: 520,
        cashbackUsed: 15.00,
        vehicle: 'Honda Civic',
        plate: 'PHK-8291',
        phone: '(92) 99123-4567',
        fills: [
          {
            id: 'GO-TX-99410',
            stationId: 'posto-planetaboi',
            station: 'Posto Oliveira Planeta Boi',
            city: 'Parintins - AM',
            attendant: 'Carlos Silva',
            customerName: 'Kaynã Viana',
            cardNumber: '4589 •••• •••• 1204',
            fuel: 'Gasolina Aditivada',
            liters: 14.73,
            pricePerLiter: 6.79,
            amount: 100.00,
            cashbackUsed: 0.00,
            netPaid: 100.00,
            cashbackEarned: 3.00,
            pointsEarned: 100,
            paymentMethod: 'Cartão de Crédito',
            date: today,
            time: '14:20',
            status: 'Concluído'
          },
          {
            id: 'GO-TX-88312',
            stationId: 'posto-express',
            station: 'Posto Grupo Oliveira Express',
            city: 'Parintins - AM',
            attendant: 'Lucas Mendes',
            customerName: 'Kaynã Viana',
            cardNumber: '4589 •••• •••• 1204',
            fuel: 'Gasolina Comum',
            liters: 12.14,
            pricePerLiter: 6.59,
            amount: 80.00,
            cashbackUsed: 15.00,
            netPaid: 65.00,
            cashbackEarned: 1.95,
            pointsEarned: 65,
            paymentMethod: 'PIX',
            date: today,
            time: '10:05',
            status: 'Concluído'
          }
        ]
      }
    },
    activeTokens: {},
    attendants: {
      'fc7afcfe-fcde-4250-8efe-520b3d455b02': {
        id: 'fc7afcfe-fcde-4250-8efe-520b3d455b02',
        name: 'Carlos Silva',
        registration: '01',
        stationId: 'posto-planetaboi',
        stationName: 'Posto Oliveira Planeta Boi',
        stationCity: 'Parintins - AM',
        todayStats: {
          fillsCount: 16,
          totalAmount: 1845.50,
          totalCashback: 55.37
        }
      }
    },
    stations: {
      'posto-planetaboi': {
        id: 'posto-planetaboi',
        name: 'Posto Oliveira Planeta Boi',
        city: 'Parintins - AM',
        revenue: 4250.00,
        fills: 52,
        cashbackUsed: 45.00,
        cashbackEmitted: 127.50
      },
      'posto-uniao': {
        id: 'posto-uniao',
        name: 'Fábrica de Gelo e Posto União',
        city: 'Parintins - AM',
        revenue: 2450.00,
        fills: 31,
        cashbackUsed: 20.00,
        cashbackEmitted: 73.50
      },
      'posto-ponte': {
        id: 'posto-ponte',
        name: 'Posto Oliveira Ponte',
        city: 'Parintins - AM',
        revenue: 2180.00,
        fills: 28,
        cashbackUsed: 15.00,
        cashbackEmitted: 65.40
      },
      'posto-sham': {
        id: 'posto-sham',
        name: 'Posto Oliveira Sham',
        city: 'Parintins - AM',
        revenue: 2890.00,
        fills: 36,
        cashbackUsed: 30.00,
        cashbackEmitted: 86.70
      },
      'posto-francesa': {
        id: 'posto-francesa',
        name: 'Posto Oliveira Francesa',
        city: 'Parintins - AM',
        revenue: 3650.00,
        fills: 22,
        cashbackUsed: 35.00,
        cashbackEmitted: 109.50
      },
      'posto-vilacristina': {
        id: 'posto-vilacristina',
        name: 'Posto Oliveira — Vila Cristina',
        city: 'Parintins - AM',
        revenue: 1980.00,
        fills: 38,
        cashbackUsed: 19.00,
        cashbackEmitted: 59.40
      }
    },
    recentTransactions: [
      {
        id: 'GO-TX-99410',
        stationId: 'posto-planetaboi',
        station: 'Posto Oliveira Planeta Boi',
        customer: 'Kaynã Viana',
        fuel: 'Gasolina Aditivada',
        liters: 14.73,
        amount: 100.00,
        cashback: 3.00,
        time: '14:20',
        status: 'Concluído'
      },
      {
        id: 'GO-TX-99388',
        stationId: 'posto-planetaboi',
        station: 'Posto Oliveira Planeta Boi',
        customer: 'Marcos Vinicius',
        fuel: 'Gasolina Comum',
        liters: 22.76,
        amount: 150.00,
        cashback: 4.50,
        time: '13:55',
        status: 'Concluído'
      },
      {
        id: 'GO-TX-99342',
        stationId: 'posto-uniao',
        station: 'Fábrica de Gelo e Posto União',
        customer: 'Renata Albuquerque',
        fuel: 'Diesel S10',
        liters: 43.16,
        amount: 300.00,
        cashback: 9.00,
        time: '13:10',
        status: 'Concluído'
      },
      {
        id: 'GO-TX-99301',
        stationId: 'posto-ponte',
        station: 'Posto Oliveira Ponte',
        customer: 'João Paulo Tavares',
        fuel: 'Gasolina Comum',
        liters: 18.21,
        amount: 120.00,
        cashback: 3.60,
        time: '12:40',
        status: 'Concluído'
      }
    ]
  };
}

let db = null;

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(raw);
    } else {
      db = getDefaultDatabase();
      saveDatabase();
    }
  } catch (e) {
    console.warn('[Sync Hub] Erro ao ler sync_db.json, criando padrão:', e.message);
    db = getDefaultDatabase();
    saveDatabase();
  }
  return db;
}

function saveDatabase() {
  try {
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Sync Hub] Erro ao salvar sync_db.json:', e.message);
  }
}

// Inicializa o banco em memória
loadDatabase();

// Heartbeat SSE a cada 20 segundos para manter conexões ativas
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': heartbeat\n\n');
    } catch (e) {
      sseClients.delete(client);
    }
  }
}, 20000);

/**
 * Transmite evento em tempo real para todos os clientes conectados (SSE)
 */
function broadcastEvent(eventName, payload) {
  const dataStr = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(dataStr);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

/**
 * Helper para leitura de JSON de requisições POST
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Manipula rotas de sincronização
 * Retorna true se a rota foi tratada, false caso contrário
 */
async function handleSyncRoutes(req, res) {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = parsedUrl.pathname;

  // 1. SSE Stream: Conexão em tempo real de clientes, frentistas e proprietário
  if (req.method === 'GET' && pathname === '/api/sync/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(': connected\n\n');

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return true;
  }

  // 2. POST /api/sync/token: Registra ou atualiza token gerado pelo cliente
  if (req.method === 'POST' && pathname === '/api/sync/token') {
    try {
      const data = await readJsonBody(req);
      const code = data.code || `TK-GO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const clientId = data.clientId || 'CLI-0824';

      // Atualiza ou cria cliente se fornecido
      if (!db.customers[clientId]) {
        db.customers[clientId] = {
          id: clientId,
          name: data.clientName || 'Kaynã Viana',
          email: 'cliente@grupooliveira.com.br',
          cardNumber: data.cardNumber || '4589 8210 3349 1204',
          balance: Number(data.balance !== undefined ? data.balance : 38.50),
          points: Number(data.points !== undefined ? data.points : 520),
          cashbackUsed: 0.00,
          vehicle: data.vehicle || 'Honda Civic',
          plate: data.plate || 'PHK-8291',
          fills: []
        };
      } else {
        if (data.clientName) db.customers[clientId].name = data.clientName;
        if (data.cardNumber) db.customers[clientId].cardNumber = data.cardNumber;
        if (data.vehicle) db.customers[clientId].vehicle = data.vehicle;
        if (data.plate) db.customers[clientId].plate = data.plate;
      }

      const client = db.customers[clientId];

      const tokenRecord = {
        code: code,
        clientId: clientId,
        clientName: client.name,
        cardNumber: client.cardNumber,
        balance: Number(client.balance),
        points: Number(client.points),
        discountRequested: Number(data.discountRequested || 0),
        vehicle: client.vehicle,
        plate: client.plate,
        expiresAt: data.expiresAt || (Date.now() + 90000),
        used: false,
        createdAt: new Date().toISOString()
      };

      db.activeTokens[code] = tokenRecord;
      saveDatabase();

      // Notifica terminais de frentistas
      broadcastEvent('TOKEN_CREATED', { token: tokenRecord });

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, token: tokenRecord }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return true;
  }

  // 3. GET /api/sync/token/:code: Busca token ativo ou busca cliente pelo código/cartão
  if (req.method === 'GET' && pathname.startsWith('/api/sync/token/')) {
    const code = decodeURIComponent(pathname.replace('/api/sync/token/', '')).trim().toUpperCase();
    let token = db.activeTokens[code];

    // Se não encontrou pelo token exato, tenta localizar cliente por ID, cartão ou nome
    if (!token) {
      let foundClient = db.customers[code];
      if (!foundClient) {
        foundClient = Object.values(db.customers).find(c => 
          c.cardNumber.replace(/\s+/g, '') === code.replace(/\s+/g, '') ||
          c.id.toUpperCase() === code
        );
      }

      if (foundClient) {
        token = {
          code: code,
          clientId: foundClient.id,
          clientName: foundClient.name,
          cardNumber: foundClient.cardNumber,
          balance: Number(foundClient.balance),
          points: Number(foundClient.points),
          discountRequested: 0,
          vehicle: foundClient.vehicle,
          plate: foundClient.plate,
          expiresAt: Date.now() + 90000,
          used: false
        };
      }
    }

    if (token) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, found: true, token }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, found: false, message: 'Token ou cliente não localizado' }));
    }
    return true;
  }

  // 4. GET /api/sync/customer/:clientId: Consulta saldo e histórico do cliente
  if (req.method === 'GET' && pathname.startsWith('/api/sync/customer/')) {
    const cid = decodeURIComponent(pathname.replace('/api/sync/customer/', '')).trim();
    let customer = db.customers[cid] || db.customers['CLI-0824'];

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, customer }));
    return true;
  }

  // 5. POST /api/sync/abastecimento/confirmar: Confirmação atômica de abastecimento
  if (req.method === 'POST' && pathname === '/api/sync/abastecimento/confirmar') {
    try {
      const data = await readJsonBody(req);
      const op = data.op || {};
      const paymentMethod = data.paymentMethod || op.paymentMethod || 'Cartão de Crédito';
      const tokenCode = data.tokenCode || op.tokenCode;

      const clientId = op.clientId || (db.activeTokens[tokenCode] ? db.activeTokens[tokenCode].clientId : 'CLI-0824');
      let customer = db.customers[clientId] || db.customers['CLI-0824'];

      if (!customer) {
        customer = {
          id: clientId,
          name: op.customerName || 'Kaynã Viana',
          email: 'cliente@grupooliveira.com.br',
          cardNumber: op.maskedCard || '4589 8210 3349 1204',
          balance: 38.50,
          points: 520,
          cashbackUsed: 0,
          fills: []
        };
        db.customers[clientId] = customer;
      }

      const grossAmount = Number(op.amount || 0);
      const usedCashback = Math.min(Number(op.cashbackUsed || 0), customer.balance);
      const netPaid = Math.max(0, grossAmount - usedCashback);
      const earnedCashback = Math.round(netPaid * 0.03 * 100) / 100;
      const earnedPoints = Math.floor(netPaid);

      // Atualização atômica dos saldos do cliente
      customer.balance = Math.round((customer.balance - usedCashback + earnedCashback) * 100) / 100;
      customer.points = (customer.points || 0) + earnedPoints;
      customer.cashbackUsed = Math.round(((customer.cashbackUsed || 0) + usedCashback) * 100) / 100;

      const txId = op.id && !op.id.startsWith('GO-PEND-') ? op.id : `GO-TX-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const tx = {
        id: txId,
        stationId: op.stationId || 'matriz-parintins',
        station: op.station || 'Posto Marcos Zagury (Matriz)',
        city: op.stationCity || 'Parintins - AM',
        attendant: op.attendant || 'Carlos Silva (Matrícula #01)',
        customerId: customer.id,
        customerName: customer.name,
        cardNumber: customer.cardNumber.replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4'),
        fuel: op.fuel || 'Gasolina Comum',
        liters: Number(op.liters || 0),
        pricePerLiter: Number(op.pricePerLiter || 6.59),
        amount: grossAmount,
        cashbackUsed: usedCashback,
        netPaid: netPaid,
        cashbackEarned: earnedCashback,
        pointsEarned: earnedPoints,
        paymentMethod: paymentMethod,
        date: dateStr,
        time: timeStr,
        status: 'Concluído'
      };

      // Adiciona ao histórico do cliente
      customer.fills = customer.fills || [];
      customer.fills.unshift(tx);

      // Invalida token se existir
      if (tokenCode && db.activeTokens[tokenCode]) {
        db.activeTokens[tokenCode].used = true;
      }

      // Atualiza métricas do posto
      const stationKey = op.stationId || 'matriz-parintins';
      if (db.stations[stationKey]) {
        db.stations[stationKey].revenue = Math.round((db.stations[stationKey].revenue + grossAmount) * 100) / 100;
        db.stations[stationKey].fills += 1;
        db.stations[stationKey].cashbackUsed = Math.round((db.stations[stationKey].cashbackUsed + usedCashback) * 100) / 100;
        db.stations[stationKey].cashbackEmitted = Math.round((db.stations[stationKey].cashbackEmitted + earnedCashback) * 100) / 100;
      }

      // Atualiza histórico do frentista
      const attendantId = op.attendantId || 'fc7afcfe-fcde-4250-8efe-520b3d455b02';
      if (db.attendants[attendantId]) {
        const attStats = db.attendants[attendantId].todayStats;
        attStats.fillsCount += 1;
        attStats.totalAmount = Math.round((attStats.totalAmount + grossAmount) * 100) / 100;
        attStats.totalCashback = Math.round((attStats.totalCashback + earnedCashback) * 100) / 100;
      }

      // Adiciona ao topo das transações recentes da rede (Owner Feed)
      db.recentTransactions.unshift({
        id: tx.id,
        stationId: tx.stationId,
        station: tx.station,
        customer: tx.customerName,
        fuel: tx.fuel,
        liters: tx.liters,
        amount: tx.amount,
        cashback: tx.cashbackEarned,
        time: tx.time,
        status: 'Concluído'
      });
      if (db.recentTransactions.length > 50) {
        db.recentTransactions.pop();
      }

      saveDatabase();

      // Transmissão em tempo real para TODOS os dispositivos e abas conectadas!
      broadcastEvent('ABASTECIMENTO_CONFIRMADO', {
        tx: tx,
        clientId: customer.id,
        customer: {
          balance: customer.balance,
          points: customer.points,
          cashbackUsed: customer.cashbackUsed,
          fills: customer.fills
        },
        stationId: tx.stationId
      });

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        ok: true,
        tx: tx,
        customer: {
          balance: customer.balance,
          points: customer.points,
          cashbackUsed: customer.cashbackUsed
        }
      }));
    } catch (e) {
      console.error('[Sync Hub Confirmar Error]', e);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return true;
  }

  // 6. GET /api/sync/owner: Analítica consolidada da rede para o painel do proprietário
  if (req.method === 'GET' && pathname === '/api/sync/owner') {
    const stationFilter = parsedUrl.searchParams.get('station') || 'all';
    const periodFilter = parsedUrl.searchParams.get('period') || 'today';

    let totalRev = 0;
    let totalFills = 0;
    let totalCashback = 0;
    let totalCbUsed = 0;

    const stationsBreakdown = Object.values(db.stations).map(st => {
      totalRev += st.revenue;
      totalFills += st.fills;
      totalCashback += st.cashbackEmitted;
      totalCbUsed += st.cashbackUsed;

      return {
        id: st.id,
        name: st.name,
        city: st.city,
        revenue: st.revenue,
        fills: st.fills,
        clients: st.fills,
        cashbackUsed: st.cashbackUsed,
        share: 0
      };
    });

    stationsBreakdown.forEach(st => {
      st.share = totalRev > 0 ? Math.round((st.revenue / totalRev) * 100) : 0;
    });

    let displayRev = totalRev;
    let displayFills = totalFills;
    let displayCb = totalCashback;
    let displayCbUsed = totalCbUsed;

    if (stationFilter !== 'all' && db.stations[stationFilter]) {
      const st = db.stations[stationFilter];
      displayRev = st.revenue;
      displayFills = st.fills;
      displayCb = st.cashbackEmitted;
      displayCbUsed = st.cashbackUsed;
    }

    const metrics = {
      faturamento_total: displayRev,
      quantidade_abastecimentos: displayFills,
      clientes_ativos: Math.max(348, totalFills + 20),
      cashback_emitido: displayCb,
      cashback_utilizado: displayCbUsed,
      saldo_total_carteiras: 1840.00,
      postos_breakdown: stationsBreakdown.map(st => ({
        id: st.id,
        nome: st.name,
        cidade: st.city.split(' - ')[0],
        uf: st.city.split(' - ')[1] || 'AM',
        faturamento: st.revenue,
        total_abastecimentos: st.fills,
        cashback_utilizado: st.cashbackUsed
      })),
      historico_7dias: [
        { dia_label: 'Seg', abastecimentos: 185, faturamento: 15400 },
        { dia_label: 'Ter', abastecimentos: 198, faturamento: 16800 },
        { dia_label: 'Qua', abastecimentos: 210, faturamento: 17200 },
        { dia_label: 'Qui', abastecimentos: 190, faturamento: 16100 },
        { dia_label: 'Sex', abastecimentos: 245, faturamento: 21300 },
        { dia_label: 'Sáb', abastecimentos: 260, faturamento: 22900 },
        { dia_label: 'Hoje', abastecimentos: displayFills, faturamento: displayRev }
      ],
      abastecimentos_recentes: db.recentTransactions.map(tx => ({
        cliente_nome: tx.customer,
        posto_nome: tx.station,
        posto_id: tx.stationId,
        tipo_combustivel: tx.fuel,
        litros: tx.liters,
        valor_total_bruto: tx.amount,
        cashback_creditado: tx.cashback,
        created_at: new Date().toISOString(),
        status: 'CONCLUIDO'
      }))
    };

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, metrics }));
    return true;
  }

  // 7. GET /api/sync/attendant: Dados do frentista
  if (req.method === 'GET' && pathname.startsWith('/api/sync/attendant')) {
    const att = db.attendants['fc7afcfe-fcde-4250-8efe-520b3d455b02'];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, attendant: att }));
    return true;
  }

  // 8. POST /api/sync/reset-demo: Restaura dados limpos de demonstração
  if (req.method === 'POST' && pathname === '/api/sync/reset-demo') {
    db = getDefaultDatabase();
    saveDatabase();
    broadcastEvent('DEMO_RESET', {});
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: 'Dados de demonstração restaurados com sucesso!' }));
    return true;
  }

  return false;
}

module.exports = {
  handleSyncRoutes,
  broadcastEvent,
  loadDatabase,
  saveDatabase
};
