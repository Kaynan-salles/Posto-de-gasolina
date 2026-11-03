/**
 * SCRIPT DE MIGRAÇÃO DO BANCO DE DADOS SUPABASE — GRUPO OLIVEIRA
 * Conecta via PostgreSQL administrativo e executa o supabase_schema.sql
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function migrateDatabase() {
  console.log('='.repeat(70));
  console.log('  APLICANDO SCHEMA COMPLETO NO SUPABASE POSTGRESQL');
  console.log('='.repeat(70));

  const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Arquivo supabase_schema.sql não encontrado.');
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf8');

  // Configuração do cliente Postgres direto via variáveis de ambiente
  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.vujsdddnlbwytpscdtmd.supabase.co',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Conectando ao banco de dados PostgreSQL do Supabase...');
    await client.connect();
    console.log('Conexão estabelecida com sucesso!');

    console.log('Executando migração do schema completo (tabelas, tipos, triggers, RLS)...');
    await client.query(sqlContent);
    console.log('✅ Migração do schema executada com sucesso!');

    // Inserir os 6 postos padrão da rede se a tabela estiver vazia
    const { rows: postosExistentes } = await client.query('SELECT COUNT(*) FROM public.postos;');
    if (parseInt(postosExistentes[0].count, 10) === 0) {
      console.log('Cadastrando as 6 unidades oficiais do Grupo Oliveira...');
      const postos = [
        {
          id: 'a1b2c3d4-0001-4000-8000-000000000001',
          nome: 'Posto Marcos Zagury (Matriz)',
          cidade: 'Parintins',
          uf: 'AM',
          endereco: 'Av. Amazonas, 1200 - Centro',
          telefone: '(92) 3533-1001'
        },
        {
          id: 'a1b2c3d4-0002-4000-8000-000000000002',
          nome: 'Posto Grupo Oliveira Barreirinha',
          cidade: 'Barreirinha',
          uf: 'AM',
          endereco: 'Rua do Porto, 45 - Centro',
          telefone: '(92) 3544-2002'
        },
        {
          id: 'a1b2c3d4-0003-4000-8000-000000000003',
          nome: 'Posto Grupo Oliveira Nhamundá',
          cidade: 'Nhamundá',
          uf: 'AM',
          endereco: 'Av. Beira Rio, 310 - Centro',
          telefone: '(92) 3555-3003'
        },
        {
          id: 'a1b2c3d4-0004-4000-8000-000000000004',
          nome: 'Posto Grupo Oliveira Terra Santa',
          cidade: 'Terra Santa',
          uf: 'PA',
          endereco: 'Rodovia PA-257, Km 2 - Industrial',
          telefone: '(93) 3566-4004'
        },
        {
          id: 'a1b2c3d4-0005-4000-8000-000000000005',
          nome: 'Posto Fluvial Grupo Oliveira',
          cidade: 'Parintins',
          uf: 'AM',
          endereco: 'Orla do Rio Amazonas (Fluvial)',
          telefone: '(92) 3533-5005'
        },
        {
          id: 'a1b2c3d4-0006-4000-8000-000000000006',
          nome: 'Posto Oliveira Express',
          cidade: 'Parintins',
          uf: 'AM',
          endereco: 'Estrada Odovaldo Novo, 890 - Itaúna',
          telefone: '(92) 3533-6006'
        }
      ];

      for (const p of postos) {
        await client.query(
          `INSERT INTO public.postos (id, nome, cidade, uf, endereco, telefone, taxa_cashback_padrao, pontos_por_real, minimo_resgate_cashback, ativo)
           VALUES ($1, $2, $3, $4, $5, $6, 3.00, 1, 10.00, true)
           ON CONFLICT (id) DO NOTHING;`,
          [p.id, p.nome, p.cidade, p.uf, p.endereco, p.telefone]
        );
      }
      console.log('✅ 6 Unidades da Rede cadastradas com sucesso!');
    } else {
      console.log(`Unidades já existentes no banco (${postosExistentes[0].count} postos).`);
    }

  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  migrateDatabase().then(() => {
    console.log('Migração concluída com sucesso!');
    process.exit(0);
  }).catch(e => {
    console.error('Falha fatal na migração:', e);
    process.exit(1);
  });
}

module.exports = { migrateDatabase };
