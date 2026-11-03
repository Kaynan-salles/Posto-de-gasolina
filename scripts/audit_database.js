require('dotenv').config();
const { Client } = require('pg');

async function audit() {
  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.vujsdddnlbwytpscdtmd.supabase.co',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('--- CONEXAO COM BANCO ESTABELECIDA ---');

  // 1. Tabelas
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('\n[TABELAS PUBLIC]:', tables.rows.map(r => r.table_name));

  // 2. Postos
  const postos = await client.query(`SELECT id, nome, cidade, uf, taxa_cashback_padrao, ativo FROM public.postos;`);
  console.log('\n[POSTOS]:', postos.rows);

  // 3. Usuarios Perfis
  const perfis = await client.query(`SELECT id, role, nome, email, ativo FROM public.usuarios_perfis;`);
  console.log('\n[USUARIOS PERFIS]:', perfis.rows);

  // 4. Funcionarios
  const funcs = await client.query(`SELECT id, user_id, posto_id, nome, matricula FROM public.funcionarios;`);
  console.log('\n[FUNCIONARIOS]:', funcs.rows);

  // 5. Clientes
  const clientes = await client.query(`SELECT id, user_id, nome, email, numero_cartao, saldo_cashback, saldo_cashback_reservado, pontos_acumulados FROM public.clientes;`);
  console.log('\n[CLIENTES]:', clientes.rows);

  // 6. Cartões
  const cartoes = await client.query(`SELECT id, cliente_id, numero_formatado, nivel_membro, ativo FROM public.cartoes_digitais;`);
  console.log('\n[CARTOES]:', cartoes.rows);

  // 7. Abastecimentos
  const abasts = await client.query(`SELECT COUNT(*) as total, status FROM public.abastecimentos GROUP BY status;`);
  console.log('\n[ABASTECIMENTOS POR STATUS]:', abasts.rows);

  // 8. RLS Policies
  const rls = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `);
  console.log('\n[POLITICAS RLS]:', rls.rows.map(r => `${r.tablename} -> ${r.policyname} (${r.cmd})`));

  // 9. Funcoes RPC
  const rpcs = await client.query(`
    SELECT routine_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
    ORDER BY routine_name;
  `);
  console.log('\n[FUNCOES / RPCS]:', rpcs.rows.map(r => r.routine_name));

  await client.end();
}

audit().catch(err => {
  console.error('ERRO NA AUDITORIA:', err);
  process.exit(1);
});
