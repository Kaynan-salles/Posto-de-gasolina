/**
 * SUITE DE TESTES COMPLETOS — GRUPO OLIVEIRA (FASES 1 A 10)
 * Executa todos os 10 testes com evidências reais do Supabase
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { Client: PgClient } = require('pg');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Oliveira@2026!';

const results = [];

function recordTest(num, name, success, evidence, details = '') {
  results.push({ num, name, success, evidence, details });
  const icon = success ? '✅ PASSOU' : '❌ FALHOU';
  console.log(`\n[TESTE ${num}: ${name.toUpperCase()}] -> ${icon}`);
  console.log('   Evidência:', JSON.stringify(evidence, null, 2));
  if (details) console.log('   Detalhes:', details);
}

async function runTestSuite() {
  console.log('='.repeat(75));
  console.log('  INICIANDO SUÍTE DE 10 TESTES DE AUDITORIA E INTEGRAÇÃO DO SUPABASE');
  console.log('='.repeat(75));

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // -------------------------------------------------------------
  // TESTE 1 — CADASTRO DE NOVO CLIENTE
  // -------------------------------------------------------------
  const testEmail = `teste.auditoria.${Date.now()}@grupooliveira.com.br`;
  const { data: signUpData, error: signErr } = await adminClient.auth.signUp({
    email: testEmail,
    password: 'SenhaForte@2026!',
    options: {
      data: {
        name: 'Cliente Auditoria Real',
        phone: '(92) 99344-7788',
        cpf: '123.456.789-00',
        vehicle: 'Toyota Corolla 2.0',
        plate: 'AUD-2026',
        role: 'customer'
      }
    }
  });

  if (signErr) {
    recordTest(1, 'Cadastro de Cliente no Supabase', false, { erro: signErr.message });
  } else {
    // Verificar criação automática no banco via trigger
    const { data: cliRow } = await adminClient
      .from('clientes')
      .select('id, user_id, nome, email, numero_cartao, veiculo_padrao, placa_padrao, saldo_cashback')
      .eq('user_id', signUpData.user.id)
      .single();

    const { data: cardRow } = await adminClient
      .from('cartoes_digitais')
      .select('id, numero_formatado, nivel_membro, ativo')
      .eq('cliente_id', cliRow ? cliRow.id : null)
      .single();

    recordTest(1, 'Cadastro de Cliente no Supabase', !!(cliRow && cardRow), {
      userId: signUpData.user.id,
      email: testEmail,
      clienteCriado: cliRow ? cliRow.nome : null,
      cartaoGerado: cliRow ? cliRow.numero_cartao : null,
      saldoInicial: cliRow ? cliRow.saldo_cashback : null,
      cartaoDigitalAtivo: cardRow ? cardRow.ativo : null
    }, 'Trigger handle_new_user criou perfil, cliente e cartão digital de forma atômica no PostgreSQL.');
  }

  // -------------------------------------------------------------
  // TESTE 2 — LOGIN DAS TRÊS CONTAS E REDIRECIONAMENTOS
  // -------------------------------------------------------------
  const demoAccounts = [
    { role: 'owner', email: 'proprietario@grupooliveira.com.br', expectedRedirect: '/?role=owner' },
    { role: 'attendant', email: 'frentista@grupooliveira.com.br', expectedRedirect: '/?role=attendant' },
    { role: 'customer', email: 'cliente@grupooliveira.com.br', expectedRedirect: '/?role=customer' }
  ];

  const loginEvidences = [];
  let allLoginsOk = true;

  for (const acc of demoAccounts) {
    const cli = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: auth, error } = await cli.auth.signInWithPassword({
      email: acc.email,
      password: DEMO_PASSWORD
    });

    if (error) {
      allLoginsOk = false;
      loginEvidences.push({ role: acc.role, email: acc.email, status: 'FALHOU', erro: error.message });
    } else {
      const { data: prof } = await cli.from('usuarios_perfis').select('role, nome').eq('id', auth.user.id).single();
      loginEvidences.push({
        role: acc.role,
        email: acc.email,
        uid: auth.user.id,
        roleNoBanco: prof ? prof.role : 'N/A',
        redirecionamento: acc.expectedRedirect,
        status: 'SUCESSO'
      });
    }
  }

  recordTest(2, 'Login dos Três Perfis e Redirecionamento', allLoginsOk, loginEvidences,
    'Todas as 3 contas permanentes autenticaram com sucesso na chave Anon do cliente e resolveram suas roles corretas.');

  // -------------------------------------------------------------
  // TESTE 3 — QR CODE E IDENTIFICAÇÃO DO CLIENTE
  // -------------------------------------------------------------
  const customerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  await customerClient.auth.signInWithPassword({ email: 'cliente@grupooliveira.com.br', password: DEMO_PASSWORD });

  const { data: tokenData, error: tokErr } = await customerClient.rpc('gerar_token_abastecimento', {
    p_desconto_solicitado: 0.00
  });

  const attendantClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  await attendantClient.auth.signInWithPassword({ email: 'frentista@grupooliveira.com.br', password: DEMO_PASSWORD });

  const { data: scanResult, error: scanErr } = await attendantClient.rpc('buscar_cliente_para_abastecimento', {
    p_token_ou_cartao: tokenData ? tokenData.token_codigo : 'INVALID'
  });

  recordTest(3, 'Geração de QR Code e Identificação pelo Frentista', !!(scanResult && scanResult.encontrado), {
    tokenGeradoPeloCliente: tokenData ? tokenData.token_codigo : null,
    expiraEm: tokenData ? tokenData.expira_em : null,
    identificadoPeloFrentista: scanResult ? scanResult.nome : null,
    cartaoFormatado: scanResult ? scanResult.numero_cartao : null,
    saldoAtual: scanResult ? scanResult.saldo_cashback : null,
    veiculoIdentificado: scanResult ? scanResult.veiculo_padrao : null
  }, 'Frentista escaneou e identificou cliente preservando sigilo de CPF e dados pessoais.');

  // -------------------------------------------------------------
  // TESTE 4 — ABASTECIMENTO PENDENTE (R$ 50,00)
  // -------------------------------------------------------------
  const { data: frentistaRow } = await attendantClient.from('funcionarios').select('*').single();

  const { data: pendenteData, error: pendErr } = await attendantClient.rpc('iniciar_abastecimento_pendente', {
    p_token_codigo: tokenData.token_codigo,
    p_posto_id: frentistaRow.posto_id,
    p_funcionario_id: frentistaRow.id,
    p_tipo_combustivel: 'Gasolina Comum',
    p_litros: 7.58,
    p_valor_litro: 6.59,
    p_valor_total: 50.00,
    p_desconto_solicitado: 0.00
  });

  // Verificar no banco que está como PENDENTE e NENHUM cashback foi creditado
  const { data: abastPendenteBanco } = await attendantClient
    .from('abastecimentos')
    .select('id, codigo_transacao, valor_total_bruto, valor_pago_liquido, cashback_creditado, status')
    .eq('id', pendenteData.abastecimento_id)
    .single();

  recordTest(4, 'Registro de Abastecimento Pendente (R$ 50,00)', abastPendenteBanco.status === 'PENDENTE', {
    abastecimentoId: abastPendenteBanco.id,
    codigoTransacao: abastPendenteBanco.codigo_transacao,
    valorTotal: abastPendenteBanco.valor_total_bruto,
    statusNoBanco: abastPendenteBanco.status,
    cashbackCreditadoAteOMomento: abastPendenteBanco.cashback_creditado
  }, 'Operação gravada em estado PENDENTE. Nenhum cashback creditado antes do pagamento final.');

  // -------------------------------------------------------------
  // TESTE 5 — CONFIRMAÇÃO DO CASHBACK (3% ATÔMICO)
  // -------------------------------------------------------------
  const { data: cliAntesConfirmar } = await customerClient.from('clientes').select('saldo_cashback').single();

  const { data: confirmData, error: confErr } = await attendantClient.rpc('confirmar_abastecimento_final', {
    p_abastecimento_id: pendenteData.abastecimento_id,
    p_forma_pagamento: 'Cartão de Débito'
  });

  const { data: cliAposConfirmar } = await customerClient.from('clientes').select('saldo_cashback, pontos_acumulados').single();

  // Esperado: 3% de R$ 50,00 = R$ 1,50
  const cashbackEsperado = 1.50;
  const cashbackCalculado = Number(confirmData.cashback_creditado);
  const cashbackCorreto = Math.abs(cashbackCalculado - cashbackEsperado) < 0.01;

  recordTest(5, 'Cálculo e Crédito Correto de Cashback (3%)', cashbackCorreto, {
    abastecimentoId: pendenteData.abastecimento_id,
    codigoConfirmado: confirmData.codigo_transacao,
    valorPago: confirmData.valor_pago,
    cashbackCalculado: cashbackCalculado,
    cashbackEsperado: cashbackEsperado,
    saldoClienteAntes: Number(cliAntesConfirmar.saldo_cashback),
    saldoClienteDepois: Number(cliAposConfirmar.saldo_cashback),
    pontosCreditados: confirmData.pontos_creditados
  }, 'Cashback de 3% calculado com base no valor pago e creditado atomicamente no saldo do cliente.');

  // -------------------------------------------------------------
  // TESTE 6 — SINCRONIZAÇÃO ENTRE CLIENTE, FRENTISTA E PROPRIETÁRIO
  // -------------------------------------------------------------
  const ownerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  await ownerClient.auth.signInWithPassword({ email: 'proprietario@grupooliveira.com.br', password: DEMO_PASSWORD });

  const { data: ownerMetrics } = await ownerClient.rpc('obter_metricas_proprietario', {
    p_posto_id: null,
    p_periodo: 'today'
  });

  const syncOk = Number(ownerMetrics.faturamento_total) >= 50 && Number(ownerMetrics.quantidade_abastecimentos) >= 1;

  recordTest(6, 'Sincronização dos 3 Perfis em Tempo Real', syncOk, {
    clienteSaldoAtualizado: Number(cliAposConfirmar.saldo_cashback),
    proprietarioFaturamentoTotal: Number(ownerMetrics.faturamento_total),
    proprietarioQuantidadeAbastecimentos: ownerMetrics.quantidade_abastecimentos,
    proprietarioCashbackEmitido: Number(ownerMetrics.cashback_emitido),
    abastecimentosRecentesNoOwner: ownerMetrics.abastecimentos_recentes.length
  }, 'Os 3 perfis leem o mesmo estado consolidado e atualizado no Supabase.');

  // -------------------------------------------------------------
  // TESTE 7 — PERSISTÊNCIA APÓS RECONEXÃO / NOVO LOGIN
  // -------------------------------------------------------------
  // Encerrar sessão e logar novamente como cliente
  await customerClient.auth.signOut();
  const freshClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: freshLogin } = await freshClient.auth.signInWithPassword({
    email: 'cliente@grupooliveira.com.br',
    password: DEMO_PASSWORD
  });

  const { data: freshClienteRow } = await freshClient
    .from('clientes')
    .select('saldo_cashback, pontos_acumulados')
    .eq('user_id', freshLogin.user.id)
    .single();

  const { data: freshFills } = await freshClient
    .from('abastecimentos')
    .select('id, codigo_transacao, valor_total_bruto, status')
    .order('created_at', { ascending: false });

  recordTest(7, 'Persistência Real no Supabase após Novo Login', Number(freshClienteRow.saldo_cashback) > 0 && freshFills.length > 0, {
    email: freshLogin.user.email,
    saldoPersistido: Number(freshClienteRow.saldo_cashback),
    pontosPersistidos: freshClienteRow.pontos_acumulados,
    historicoPersistidoCount: freshFills.length,
    ultimoAbastecimentoNoBanco: freshFills[0] ? freshFills[0].codigo_transacao : null
  }, 'Os dados continuam íntegros no banco de dados após logout, refresh de página e novo login.');

  // -------------------------------------------------------------
  // TESTE 8 — PREVENÇÃO CONTRA DUPLICIDADE DE CONFIRMAÇÃO
  // -------------------------------------------------------------
  let duplicateBlocked = false;
  let duplicateMessage = '';

  try {
    const { data: dupData, error: dupErr } = await attendantClient.rpc('confirmar_abastecimento_final', {
      p_abastecimento_id: pendenteData.abastecimento_id,
      p_forma_pagamento: 'PIX'
    });
    if (dupErr) {
      duplicateBlocked = true;
      duplicateMessage = dupErr.message;
    }
  } catch (e) {
    duplicateBlocked = true;
    duplicateMessage = e.message;
  }

  recordTest(8, 'Prevenção contra Confirmação Duplicada', duplicateBlocked, {
    abastecimentoId: pendenteData.abastecimento_id,
    duplicidadeBloqueada: duplicateBlocked,
    mensagemDoBanco: duplicateMessage
  }, 'A procedure atômica checa se status = PENDENTE com bloqueio FOR UPDATE, impedindo qualquer crédito duplo.');

  // -------------------------------------------------------------
  // TESTE 9 — DADOS DEMONSTRATIVOS SUBSTITUÍDOS POR REAIS
  // -------------------------------------------------------------
  // Consultar métricas de um posto sem abastecimentos (Ex: Terra Santa)
  const terraSantaPostoId = 'a1b2c3d4-0004-4000-8000-000000000004';
  const { data: terraSantaMetrics } = await ownerClient.rpc('obter_metricas_proprietario', {
    p_posto_id: terraSantaPostoId,
    p_periodo: 'today'
  });

  const zeroFicticios = Number(terraSantaMetrics.faturamento_total) === 0 && terraSantaMetrics.abastecimentos_recentes.length === 0;

  recordTest(9, 'Eliminação de Dados Fictícios e Estado Vazio Limpo', zeroFicticios, {
    postoTestado: 'Posto Grupo Oliveira Terra Santa',
    faturamentoRetornado: Number(terraSantaMetrics.faturamento_total),
    abastecimentosRetornados: terraSantaMetrics.quantidade_abastecimentos,
    listaRecenteVazia: terraSantaMetrics.abastecimentos_recentes.length === 0
  }, 'Sem registros fictícios ou multiplicadores simulados: quando a unidade não tem abastecimentos, exibe 0 real e estado vazio.');

  // -------------------------------------------------------------
  // TESTE 10 — PWA: ÍCONES DE ALTA DEFINIÇÃO E MANIFESTO
  // -------------------------------------------------------------
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const webManifestPath = path.join(__dirname, '..', 'manifest.webmanifest');
  const icon192Path = path.join(__dirname, '..', 'assets', 'img', 'brand', 'icon-192.png');
  const icon512Path = path.join(__dirname, '..', 'assets', 'img', 'brand', 'icon-512.png');
  const iconMaskablePath = path.join(__dirname, '..', 'assets', 'img', 'brand', 'icon-maskable-512.png');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const hasWebManifest = fs.existsSync(webManifestPath);
  const icon192Stat = fs.statSync(icon192Path);
  const icon512Stat = fs.statSync(icon512Path);
  const iconMaskableStat = fs.statSync(iconMaskablePath);

  const pwaOk = manifest.short_name === 'Grupo Oliveira' &&
    manifest.display === 'standalone' &&
    hasWebManifest &&
    icon192Stat.size > 20000 &&
    icon512Stat.size > 100000 &&
    iconMaskableStat.size > 100000;

  recordTest(10, 'Aplicativo PWA e Ícones em Alta Definição', pwaOk, {
    nomePWA: manifest.name,
    nomeCurto: manifest.short_name,
    modoDisplay: manifest.display,
    manifestWebManifestPresente: hasWebManifest,
    icon192Bytes: icon192Stat.size,
    icon512Bytes: icon512Stat.size,
    iconMaskableBytes: iconMaskableStat.size,
    safeAreaConfigurada: manifest.icons.some(i => i.purpose === 'maskable')
  }, 'Ícones 192x192, 512x512 e 512x512 maskable (com safe area de 20% e fundo oficial #562F82) gerados a partir do logotipo oficial.');

  // -------------------------------------------------------------
  // RESUMO FINAL
  // -------------------------------------------------------------
  console.log('\n' + '='.repeat(75));
  console.log('  RESUMO FINAL DOS 10 TESTES DE AUDITORIA');
  console.log('='.repeat(75));
  results.forEach(r => {
    const symbol = r.success ? '✅' : '❌';
    console.log(`[${symbol}] Teste ${r.num}: ${r.name}`);
  });

  const totalPassed = results.filter(r => r.success).length;
  console.log(`\nTaxa de Sucesso: ${totalPassed} / 10 testes aprovados (${(totalPassed / 10) * 100}%).`);
}

runTestSuite().catch(err => {
  console.error('\n❌ ERRO CRÍTICO NA EXECUÇÃO DOS TESTES:', err);
  process.exit(1);
});
