/**
 * SCRIPT DE LIMPEZA COMPLETA DE DADOS DEMONSTRATIVOS E TESTES — GRUPO OLIVEIRA
 * Reseta o banco de dados Supabase para produção real (Zero dados fictícios)
 */

require('dotenv').config();
const { Client } = require('pg');

async function cleanAllDemoData() {
  console.log('='.repeat(70));
  console.log('  INICIANDO LIMPEZA TOTAL DE DADOS DEMO NO SUPABASE POSTGRESQL');
  console.log('='.repeat(70));

  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.vujsdddnlbwytpscdtmd.supabase.co',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado ao Supabase PostgreSQL.');

    // 1. Remover abastecimentos de teste e histórico financeiro simulado
    console.log('1. Limpando movimentações financeiras de teste...');
    await client.query('DELETE FROM public.resgates_cashback');
    await client.query('DELETE FROM public.movimentacoes_cashback');
    await client.query('DELETE FROM public.movimentacoes_pontos');
    await client.query('DELETE FROM public.abastecimentos');
    await client.query('DELETE FROM public.tokens_seguranca');
    await client.query('DELETE FROM public.auditoria_indicacoes');
    await client.query('DELETE FROM public.indicacoes');

    // 2. Limpar clientes de teste gerados pela auditoria
    console.log('2. Removendo clientes de auditoria temporários...');
    await client.query("DELETE FROM public.clientes WHERE email LIKE 'teste.auditoria%'");
    await client.query("DELETE FROM public.usuarios_perfis WHERE email LIKE 'teste.auditoria%'");

    // 3. Resetar saldos de cashback e pontuação de TODOS os clientes para R$ 0,00 e 0 pontos reais
    console.log('3. Zerando saldo de cashback e pontuação para início real...');
    await client.query(`
      UPDATE public.clientes 
      SET 
        saldo_cashback = 0.00,
        pontos_acumulados = 0,
        cashback_utilizado_total = 0.00,
        updated_at = NOW()
    `);

    // 4. Atualizar cartões digitais para nível inicial CLUBE
    console.log('4. Atualizando cartões digitais para nível inicial CLUBE...');
    await client.query(`
      UPDATE public.cartoes_digitais
      SET 
        nivel_membro = 'CLUBE'
    `);

    // 5. Verificar estado pós-limpeza
    console.log('\n--- VERIFICAÇÃO PÓS-LIMPEZA ---');
    const tables = [
      'abastecimentos',
      'movimentacoes_cashback',
      'resgates_cashback',
      'tokens_seguranca',
      'indicacoes'
    ];

    for (const t of tables) {
      const res = await client.query('SELECT count(*) as count FROM public.' + t);
      console.log(`Tabela public.${t}: ${res.rows[0].count} registros (Esperado: 0)`);
    }

    const cliRes = await client.query('SELECT nome, email, saldo_cashback, pontos_acumulados, numero_cartao FROM public.clientes');
    console.log('\nClientes ativos no sistema (com saldos zerados para operação real):');
    console.table(cliRes.rows);

    const postosRes = await client.query('SELECT id, nome, cidade, uf FROM public.postos ORDER BY nome');
    console.log('\nPostos da rede ativos (preservados):');
    console.table(postosRes.rows);

    console.log('='.repeat(70));
    console.log('  BANCO DE DADOS LIMPO E PRONTO PARA OPERAÇÃO 100% REAL!');
    console.log('='.repeat(70));
  } catch (err) {
    console.error('Erro na limpeza do banco:', err);
  } finally {
    await client.end();
  }
}

cleanAllDemoData();
