require('dotenv').config();
const { Client } = require('pg');

async function test() {
  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.vujsdddnlbwytpscdtmd.supabase.co',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const res1 = await client.query("SELECT public.buscar_cliente_para_abastecimento('4589 8210 3349 1204') as cli;");
  console.log('[TESTE RPC 1 - BUSCA CLIENTE]:', res1.rows[0].cli);

  const res2 = await client.query("SELECT public.obter_metricas_proprietario(null, 'today') as metrics;");
  console.log('[TESTE RPC 2 - METRICAS PROPRIETARIO]:', res2.rows[0].metrics);

  await client.end();
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
