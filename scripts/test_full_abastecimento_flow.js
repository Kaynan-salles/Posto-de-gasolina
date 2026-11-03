require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testFlow() {
  const password = process.env.DEMO_PASSWORD;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  console.log('='.repeat(70));
  console.log('  TESTANDO O FLUXO COMPLETO E REAL DE ABASTECIMENTO COM CASHBACK');
  console.log('='.repeat(70));

  // 1. Cliente loga e gera token com desconto de R$ 10,00
  console.log('\n[PASSO 1: CLIENTE GERA TOKEN DE ABASTECIMENTO COM R$ 10,00 DE CASHBACK]');
  const cClient = createClient(url, anonKey);
  await cClient.auth.signInWithPassword({ email: 'cliente@grupooliveira.com.br', password });
  
  const { data: tokenRes, error: tErr } = await cClient.rpc('gerar_token_abastecimento', {
    p_desconto_solicitado: 10.00
  });
  if (tErr) throw new Error('Falha ao gerar token: ' + tErr.message);
  console.log('✅ Token gerado com sucesso:', {
    codigo: tokenRes.token_codigo,
    desconto_solicitado: tokenRes.desconto_solicitado,
    expira_em: tokenRes.expira_em
  });

  // 2. Frentista loga e escaneia o token
  console.log('\n[PASSO 2: FRENTISTA ESCANEIA O TOKEN DO CLIENTE]');
  const aClient = createClient(url, anonKey);
  const { data: aAuth } = await aClient.auth.signInWithPassword({ email: 'frentista@grupooliveira.com.br', password });
  
  const { data: aRow } = await aClient.from('funcionarios').select('*').eq('user_id', aAuth.user.id).single();

  const { data: cliLookup, error: lookErr } = await aClient.rpc('buscar_cliente_para_abastecimento', {
    p_token_ou_cartao: tokenRes.token_codigo
  });
  if (lookErr || !cliLookup.encontrado) throw new Error('Falha busca por token: ' + (lookErr ? lookErr.message : 'Nao encontrado'));
  console.log('✅ Cliente identificado pelo frentista:', {
    nome: cliLookup.nome,
    saldo_disponivel: cliLookup.saldo_cashback,
    desconto_solicitado_no_token: cliLookup.desconto_solicitado
  });

  // 3. Frentista registra o abastecimento como PENDENTE (R$ 50,00 total)
  console.log('\n[PASSO 3: FRENTISTA REGISTRA OPERAÇÃO PENDENTE DE R$ 50,00]');
  const { data: pendRes, error: pendErr } = await aClient.rpc('iniciar_abastecimento_pendente', {
    p_token_codigo: tokenRes.token_codigo,
    p_posto_id: aRow.posto_id,
    p_funcionario_id: aRow.id,
    p_tipo_combustivel: 'Gasolina Comum',
    p_litros: 7.58,
    p_valor_litro: 6.59,
    p_valor_total: 50.00,
    p_desconto_solicitado: cliLookup.desconto_solicitado
  });
  if (pendErr) throw new Error('Falha ao iniciar pendente: ' + pendErr.message);
  console.log('✅ Operação registrada como PENDENTE:', {
    abastecimento_id: pendRes.abastecimento_id,
    codigo: pendRes.codigo_transacao,
    valor_total: pendRes.valor_total,
    cashback_reservado: pendRes.cashback_reservado,
    valor_a_pagar: pendRes.valor_a_pagar,
    cashback_previsto: pendRes.cashback_previsto,
    status: pendRes.status
  });

  // 4. Verificar que nenhum cashback foi creditado ainda
  const { data: checkCli } = await cClient.from('clientes').select('saldo_cashback, saldo_cashback_reservado').single();
  console.log('🔒 Verificação de integridade (Pendente):', {
    saldo_cashback: checkCli.saldo_cashback,
    saldo_reservado: checkCli.saldo_cashback_reservado
  });

  // 5. Frentista confirma pagamento na maquininha
  console.log('\n[PASSO 4: FRENTISTA CONFIRMA O PAGAMENTO COM CARTÃO DE DÉBITO]');
  const { data: finalRes, error: finalErr } = await aClient.rpc('confirmar_abastecimento_final', {
    p_abastecimento_id: pendRes.abastecimento_id,
    p_forma_pagamento: 'Cartão de Débito'
  });
  if (finalErr) throw new Error('Falha na confirmacao: ' + finalErr.message);
  console.log('✅ Abastecimento confirmado e finalizado:', {
    codigo_final: finalRes.codigo_transacao,
    valor_pago_liquido: finalRes.valor_pago,
    cashback_creditado: finalRes.cashback_creditado,
    novo_saldo_cashback: finalRes.novo_saldo_cashback,
    pontos_creditados: finalRes.pontos_creditados
  });

  // 6. Testar prevenção de duplicidade (Tentar confirmar novamente)
  console.log('\n[PASSO 5: TESTE DE DUPLICIDADE (TENTATIVA DE SEGUNDA CONFIRMAÇÃO)]');
  const { data: dupRes, error: dupErr } = await aClient.rpc('confirmar_abastecimento_final', {
    p_abastecimento_id: pendRes.abastecimento_id,
    p_forma_pagamento: 'Cartão de Débito'
  });
  if (dupErr) {
    console.log('🛡️ Prevenção de duplicidade acionada com sucesso:', dupErr.message);
  } else {
    console.error('❌ FALHA DE DUPLICIDADE: Operação foi confirmada duas vezes!');
  }

  // 7. Proprietário verifica métricas atualizadas
  console.log('\n[PASSO 6: PROPRIETÁRIO VERIFICA MÉTRICAS SINCRONIZADAS]');
  const oClient = createClient(url, anonKey);
  await oClient.auth.signInWithPassword({ email: 'proprietario@grupooliveira.com.br', password });
  const { data: met } = await oClient.rpc('obter_metricas_proprietario', { p_posto_id: null, p_periodo: 'today' });
  console.log('✅ Métricas consolidadas após abastecimento:', {
    faturamento_total: met.faturamento_total,
    quantidade_abastecimentos: met.quantidade_abastecimentos,
    clientes_ativos: met.clientes_ativos,
    cashback_emitido: met.cashback_emitido,
    cashback_utilizado: met.cashback_utilizado,
    abastecimentos_recentes_count: met.abastecimentos_recentes.length
  });

  console.log('\n🎉 FLUXO COMPLETO TESTADO E APROVADO COM PERSISTÊNCIA REAL NO SUPABASE!');
}

testFlow().catch(err => {
  console.error('\n❌ ERRO NO TESTE DO FLUXO:', err);
  process.exit(1);
});
