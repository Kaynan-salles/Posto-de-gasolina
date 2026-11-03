require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testProfiles() {
  const password = process.env.DEMO_PASSWORD;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  console.log('='.repeat(70));
  console.log('  TESTANDO OS TRÊS PERFIS COM CHAVE ANON (CLIENTE WEB)');
  console.log('='.repeat(70));

  // --- 1. CLIENTE ---
  console.log('\n[1. TESTANDO LOGIN DO CLIENTE]');
  const cClient = createClient(url, anonKey);
  const { data: cAuth, error: cErr } = await cClient.auth.signInWithPassword({
    email: 'cliente@grupooliveira.com.br',
    password
  });
  if (cErr) throw new Error('Falha login cliente: ' + cErr.message);
  console.log('✅ Cliente autenticado com UID:', cAuth.user.id);

  const { data: cRow, error: cRowErr } = await cClient
    .from('clientes')
    .select('*')
    .eq('user_id', cAuth.user.id)
    .single();
  if (cRowErr) throw new Error('Falha busca cliente: ' + cRowErr.message);
  console.log('✅ Dados reais do cliente carregados:', {
    nome: cRow.nome,
    cartao: cRow.numero_cartao,
    saldo: cRow.saldo_cashback,
    pontos: cRow.pontos_acumulados
  });

  // --- 2. FRENTISTA ---
  console.log('\n[2. TESTANDO LOGIN DO FRENTISTA]');
  const aClient = createClient(url, anonKey);
  const { data: aAuth, error: aErr } = await aClient.auth.signInWithPassword({
    email: 'frentista@grupooliveira.com.br',
    password
  });
  if (aErr) throw new Error('Falha login frentista: ' + aErr.message);
  console.log('✅ Frentista autenticado com UID:', aAuth.user.id);

  const { data: aRow, error: aRowErr } = await aClient
    .from('funcionarios')
    .select('*, postos(*)')
    .eq('user_id', aAuth.user.id)
    .single();
  if (aRowErr) throw new Error('Falha busca frentista: ' + aRowErr.message);
  console.log('✅ Vínculo do frentista com o posto carregado:', {
    nome: aRow.nome,
    matricula: aRow.matricula,
    posto: aRow.postos ? aRow.postos.nome : null
  });

  // Testar busca de cliente pelo frentista
  const { data: cliLookup, error: lookErr } = await aClient.rpc('buscar_cliente_para_abastecimento', {
    p_token_ou_cartao: cRow.numero_cartao
  });
  if (lookErr) throw new Error('Falha RPC busca: ' + lookErr.message);
  console.log('✅ Frentista identificou cliente com sucesso:', cliLookup.nome, '(Saldo: R$ ' + cliLookup.saldo_cashback + ')');

  // --- 3. PROPRIETÁRIO ---
  console.log('\n[3. TESTANDO LOGIN DO PROPRIETÁRIO]');
  const oClient = createClient(url, anonKey);
  const { data: oAuth, error: oErr } = await oClient.auth.signInWithPassword({
    email: 'proprietario@grupooliveira.com.br',
    password
  });
  if (oErr) throw new Error('Falha login proprietario: ' + oErr.message);
  console.log('✅ Proprietário autenticado com UID:', oAuth.user.id);

  const { data: metrics, error: metErr } = await oClient.rpc('obter_metricas_proprietario', {
    p_posto_id: null,
    p_periodo: 'today'
  });
  if (metErr) throw new Error('Falha RPC metricas: ' + metErr.message);
  console.log('✅ Métricas reais consolidadas carregadas do Supabase:', {
    faturamento_total: metrics.faturamento_total,
    quantidade_abastecimentos: metrics.quantidade_abastecimentos,
    clientes_ativos: metrics.clientes_ativos,
    saldo_total_carteiras: metrics.saldo_total_carteiras,
    postos_cadastrados: metrics.postos_breakdown.length
  });

  console.log('\n🎉 TODOS OS 3 PERFIS AUDITADOS E FUNCIONANDO COM PERMISSÕES REAIS NO SUPABASE!');
}

testProfiles().catch(err => {
  console.error('\n❌ ERRO NO TESTE DOS PERFIS:', err);
  process.exit(1);
});
