/**
 * ENHANCE SCHEMA & RLS POLICIES — GRUPO OLIVEIRA
 * Aplica políticas RLS completas e procedimentos armazenados RPC no Supabase
 */

require('dotenv').config();
const { Client } = require('pg');

async function enhanceSchema() {
  console.log('='.repeat(70));
  console.log('  APLICANDO POLÍTICAS RLS E FUNÇÕES RPC NO SUPABASE');
  console.log('='.repeat(70));

  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.vujsdddnlbwytpscdtmd.supabase.co',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const sql = `
    -- 1. Políticas para USUARIOS_PERFIS
    DROP POLICY IF EXISTS "Usuarios podem ver seu proprio perfil" ON public.usuarios_perfis;
    CREATE POLICY "Usuarios podem ver seu proprio perfil"
      ON public.usuarios_perfis FOR SELECT TO authenticated
      USING (
        id = auth.uid() 
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
      );

    DROP POLICY IF EXISTS "Owner pode atualizar perfis" ON public.usuarios_perfis;
    CREATE POLICY "Owner pode atualizar perfis"
      ON public.usuarios_perfis FOR UPDATE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin')));

    -- 2. Políticas para POSTOS
    DROP POLICY IF EXISTS "Qualquer usuario pode consultar postos ativos" ON public.postos;
    CREATE POLICY "Qualquer usuario pode consultar postos ativos"
      ON public.postos FOR SELECT
      USING (ativo = TRUE);

    -- 3. Políticas para CLIENTES
    DROP POLICY IF EXISTS "Owner tem visibilidade de todos os clientes" ON public.clientes;
    CREATE POLICY "Owner tem visibilidade de todos os clientes"
      ON public.clientes FOR SELECT TO authenticated
      USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
        OR EXISTS (SELECT 1 FROM public.funcionarios WHERE user_id = auth.uid())
      );

    -- 4. Políticas para CARTOES DIGITAIS
    ALTER TABLE public.cartoes_digitais ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Customer e Owner consultam cartoes" ON public.cartoes_digitais;
    CREATE POLICY "Customer e Owner consultam cartoes"
      ON public.cartoes_digitais FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
        OR EXISTS (SELECT 1 FROM public.funcionarios WHERE user_id = auth.uid())
      );

    -- 5. Políticas para FUNCIONARIOS
    DROP POLICY IF EXISTS "Funcionarios e Owner consultam funcionarios" ON public.funcionarios;
    CREATE POLICY "Funcionarios e Owner consultam funcionarios"
      ON public.funcionarios FOR SELECT TO authenticated
      USING (
        user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
      );

    -- 6. Políticas para MOVIMENTACOES DE CASHBACK E PONTOS
    DROP POLICY IF EXISTS "Customer e Owner consultam movimentacoes cashback" ON public.movimentacoes_cashback;
    CREATE POLICY "Customer e Owner consultam movimentacoes cashback"
      ON public.movimentacoes_cashback FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
      );

    DROP POLICY IF EXISTS "Customer e Owner consultam movimentacoes pontos" ON public.movimentacoes_pontos;
    CREATE POLICY "Customer e Owner consultam movimentacoes pontos"
      ON public.movimentacoes_pontos FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
      );

    DROP POLICY IF EXISTS "Customer e Owner consultam resgates" ON public.resgates_cashback;
    CREATE POLICY "Customer e Owner consultam resgates"
      ON public.resgates_cashback FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
      );

    -- 7. FUNÇÃO RPC: BUSCAR CLIENTE PARA ABASTECIMENTO (SEGURA PARA O FRENTISTA)
    CREATE OR REPLACE FUNCTION public.buscar_cliente_para_abastecimento(p_token_ou_cartao TEXT)
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
      v_token RECORD;
      v_cliente RECORD;
      v_clean_search TEXT;
    BEGIN
      v_clean_search := TRIM(p_token_ou_cartao);

      -- 1. Tentar localizar por Token de Segurança Ativo
      SELECT * INTO v_token
      FROM public.tokens_seguranca
      WHERE token_codigo = v_clean_search
        AND NOT utilizado
        AND expira_em > NOW()
      ORDER BY created_at DESC
      LIMIT 1;

      IF FOUND THEN
        SELECT * INTO v_cliente FROM public.clientes WHERE id = v_token.cliente_id;
        IF FOUND THEN
          RETURN jsonb_build_object(
            'encontrado', true,
            'origem', 'token',
            'token_codigo', v_token.token_codigo,
            'cliente_id', v_cliente.id,
            'nome', v_cliente.nome,
            'numero_cartao', v_cliente.numero_cartao,
            'saldo_cashback', v_cliente.saldo_cashback,
            'pontos_acumulados', v_cliente.pontos_acumulados,
            'veiculo_padrao', COALESCE(v_cliente.veiculo_padrao, 'Não informado'),
            'placa_padrao', COALESCE(v_cliente.placa_padrao, 'Não informada'),
            'desconto_solicitado', v_token.desconto_solicitado
          );
        END IF;
      END IF;

      -- 2. Tentar localizar por Número de Cartão Fidelidade
      SELECT * INTO v_cliente
      FROM public.clientes
      WHERE REPLACE(numero_cartao, ' ', '') = REPLACE(v_clean_search, ' ', '')
         OR numero_cartao = v_clean_search;

      IF FOUND THEN
        RETURN jsonb_build_object(
          'encontrado', true,
          'origem', 'cartao',
          'token_codigo', NULL,
          'cliente_id', v_cliente.id,
          'nome', v_cliente.nome,
          'numero_cartao', v_cliente.numero_cartao,
          'saldo_cashback', v_cliente.saldo_cashback,
          'pontos_acumulados', v_cliente.pontos_acumulados,
          'veiculo_padrao', COALESCE(v_cliente.veiculo_padrao, 'Não informado'),
          'placa_padrao', COALESCE(v_cliente.placa_padrao, 'Não informada'),
          'desconto_solicitado', 0.00
        );
      END IF;

      RETURN jsonb_build_object(
        'encontrado', false,
        'mensagem', 'Cliente não localizado. Verifique se o QR Code expirou ou digite o número do cartão.'
      );
    END;
    $$;

    -- 8. FUNÇÃO RPC: GERAR TOKEN DE ABASTECIMENTO (CLIENTE)
    CREATE OR REPLACE FUNCTION public.gerar_token_abastecimento(p_desconto_solicitado NUMERIC DEFAULT 0.00)
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
      v_cliente RECORD;
      v_token_codigo TEXT;
      v_token_id UUID;
      v_expira_em TIMESTAMPTZ;
      v_desconto_valido NUMERIC(10,2) := 0.00;
    BEGIN
      -- Obter cliente do usuário autenticado
      SELECT * INTO v_cliente FROM public.clientes WHERE user_id = auth.uid();
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Cliente não encontrado para o usuário logado.';
      END IF;

      IF p_desconto_solicitado > 0 THEN
        IF p_desconto_solicitado > v_cliente.saldo_cashback THEN
          v_desconto_valido := v_cliente.saldo_cashback;
        ELSE
          v_desconto_valido := p_desconto_solicitado;
        END IF;
      END IF;

      v_token_codigo := 'TK-GO-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
      v_expira_em := NOW() + INTERVAL '15 minutes';

      INSERT INTO public.tokens_seguranca (cliente_id, token_codigo, desconto_solicitado, expira_em)
      VALUES (v_cliente.id, v_token_codigo, v_desconto_valido, v_expira_em)
      RETURNING id INTO v_token_id;

      RETURN jsonb_build_object(
        'sucesso', true,
        'token_id', v_token_id,
        'token_codigo', v_token_codigo,
        'cliente_id', v_cliente.id,
        'cliente_nome', v_cliente.nome,
        'numero_cartao', v_cliente.numero_cartao,
        'desconto_solicitado', v_desconto_valido,
        'expira_em', v_expira_em
      );
    END;
    $$;

    -- 9. FUNÇÃO RPC: OBTER MÉTRICAS REAIS CONSOLIDADAS DO PROPRIETÁRIO
    CREATE OR REPLACE FUNCTION public.obter_metricas_proprietario(
      p_posto_id UUID DEFAULT NULL,
      p_periodo TEXT DEFAULT 'today'
    )
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
      v_data_inicio TIMESTAMPTZ;
      v_faturamento NUMERIC(12,2) := 0.00;
      v_total_abastecimentos INTEGER := 0;
      v_clientes_ativos INTEGER := 0;
      v_cashback_emitido NUMERIC(12,2) := 0.00;
      v_cashback_utilizado NUMERIC(12,2) := 0.00;
      v_saldo_carteiras NUMERIC(12,2) := 0.00;
      v_abastecimentos_recentes JSONB;
      v_postos_stats JSONB;
      v_historico_7dias JSONB;
    BEGIN
      -- Definir intervalo de data
      IF p_periodo = 'today' THEN
        v_data_inicio := DATE_TRUNC('day', NOW());
      ELSIF p_periodo = '7days' THEN
        v_data_inicio := NOW() - INTERVAL '7 days';
      ELSIF p_periodo = '30days' THEN
        v_data_inicio := NOW() - INTERVAL '30 days';
      ELSIF p_periodo = 'month' THEN
        v_data_inicio := DATE_TRUNC('month', NOW());
      ELSE
        v_data_inicio := DATE_TRUNC('day', NOW());
      END IF;

      -- 1. Faturamento, abastecimentos, cashback emitido e utilizado (Status CONCLUIDO)
      SELECT
        COALESCE(SUM(valor_total_bruto), 0.00),
        COUNT(*),
        COUNT(DISTINCT cliente_id),
        COALESCE(SUM(cashback_creditado), 0.00),
        COALESCE(SUM(cashback_utilizado), 0.00)
      INTO
        v_faturamento,
        v_total_abastecimentos,
        v_clientes_ativos,
        v_cashback_emitido,
        v_cashback_utilizado
      FROM public.abastecimentos
      WHERE status = 'CONCLUIDO'
        AND created_at >= v_data_inicio
        AND (p_posto_id IS NULL OR posto_id = p_posto_id);

      -- 2. Saldo total em carteiras de clientes no banco
      SELECT COALESCE(SUM(saldo_cashback), 0.00) INTO v_saldo_carteiras FROM public.clientes;

      -- 3. Lista de abastecimentos recentes (Últimos 15)
      SELECT COALESCE(jsonb_agg(ab), '[]'::jsonb) INTO v_abastecimentos_recentes
      FROM (
        SELECT 
          a.id,
          a.codigo_transacao,
          a.created_at,
          a.confirmado_em,
          a.tipo_combustivel,
          a.litros,
          a.valor_litro,
          a.valor_total_bruto,
          a.cashback_utilizado,
          a.valor_pago_liquido,
          a.cashback_creditado,
          a.forma_pagamento,
          a.status,
          p.nome as posto_nome,
          p.cidade as posto_cidade,
          c.nome as cliente_nome,
          c.numero_cartao as cliente_cartao,
          f.nome as funcionario_nome
        FROM public.abastecimentos a
        JOIN public.postos p ON p.id = a.posto_id
        JOIN public.clientes c ON c.id = a.cliente_id
        LEFT JOIN public.funcionarios f ON f.id = a.funcionario_id
        WHERE (p_posto_id IS NULL OR a.posto_id = p_posto_id)
        ORDER BY a.created_at DESC
        LIMIT 15
      ) ab;

      -- 4. Breakdown por posto
      SELECT COALESCE(jsonb_agg(pst), '[]'::jsonb) INTO v_postos_stats
      FROM (
        SELECT 
          p.id,
          p.nome,
          p.cidade,
          p.uf,
          COALESCE(SUM(a.valor_total_bruto) FILTER (WHERE a.status = 'CONCLUIDO' AND a.created_at >= v_data_inicio), 0.00) as faturamento,
          COUNT(a.id) FILTER (WHERE a.status = 'CONCLUIDO' AND a.created_at >= v_data_inicio) as total_abastecimentos,
          COALESCE(SUM(a.cashback_utilizado) FILTER (WHERE a.status = 'CONCLUIDO' AND a.created_at >= v_data_inicio), 0.00) as cashback_utilizado
        FROM public.postos p
        LEFT JOIN public.abastecimentos a ON a.posto_id = p.id
        WHERE p.ativo = TRUE
        GROUP BY p.id, p.nome, p.cidade, p.uf
        ORDER BY faturamento DESC
      ) pst;

      -- 5. Série temporal dos últimos 7 dias
      SELECT COALESCE(jsonb_agg(serie), '[]'::jsonb) INTO v_historico_7dias
      FROM (
        SELECT 
          TO_CHAR(d.dia, 'DD/MM') as dia_label,
          TO_CHAR(d.dia, 'YYYY-MM-DD') as dia_data,
          COALESCE(SUM(a.valor_total_bruto) FILTER (WHERE a.status = 'CONCLUIDO'), 0.00) as faturamento,
          COUNT(a.id) FILTER (WHERE a.status = 'CONCLUIDO') as abastecimentos
        FROM (
          SELECT (NOW()::date - s.a * '1 day'::interval)::date as dia
          FROM generate_series(6, 0, -1) as s(a)
        ) d
        LEFT JOIN public.abastecimentos a ON a.created_at::date = d.dia 
          AND (p_posto_id IS NULL OR a.posto_id = p_posto_id)
        GROUP BY d.dia
        ORDER BY d.dia ASC
      ) serie;

      RETURN jsonb_build_object(
        'faturamento_total', v_faturamento,
        'quantidade_abastecimentos', v_total_abastecimentos,
        'clientes_ativos', v_clientes_ativos,
        'cashback_emitido', v_cashback_emitido,
        'cashback_utilizado', v_cashback_utilizado,
        'saldo_total_carteiras', v_saldo_carteiras,
        'postos_breakdown', v_postos_stats,
        'abastecimentos_recentes', v_abastecimentos_recentes,
        'historico_7dias', v_historico_7dias,
        'periodo_selecionado', p_periodo
      );
    END;
    $$;

    -- Conceder permissões de execução para roles autenticadas e anônimas
    GRANT EXECUTE ON FUNCTION public.buscar_cliente_para_abastecimento(TEXT) TO authenticated, anon;
    GRANT EXECUTE ON FUNCTION public.gerar_token_abastecimento(NUMERIC) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.iniciar_abastecimento_pendente(TEXT, UUID, UUID, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.confirmar_abastecimento_final(UUID, TEXT) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.cancelar_abastecimento_pendente(UUID) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.obter_metricas_proprietario(UUID, TEXT) TO authenticated;

    -- Habilitar Realtime para public.abastecimentos e public.clientes
    DO $$ BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.abastecimentos;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.clientes;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `;

  try {
    await client.query(sql);
    console.log('✅ Políticas RLS, Funções RPC e Realtime aplicados com sucesso no Supabase!');
  } finally {
    await client.end();
  }
}

enhanceSchema().catch(err => {
  console.error('ERRO AO ATUALIZAR SCHEMA:', err);
  process.exit(1);
});
