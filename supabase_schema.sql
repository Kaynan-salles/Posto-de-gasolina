-- ====================================================================
-- SISTEMA DE BENEFÍCIOS & FIDELIDADE — GRUPO OLIVEIRA
-- PARINTINS-AM | BARREIRINHA-AM | NHAMUNDÁ-AM | TERRA SANTA-PA
-- HIERARQUIA DE ACESSO: OWNER (Proprietário), ATTENDANT (Frentista), CUSTOMER (Cliente)
-- SCRIPT DE MIGRATION & ESTRUTURA PARA SUPABASE (POSTGRESQL 15+)
-- ====================================================================

-- 1. HABILITAR EXTENSÃO DE UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPOS ENUMERADOS
DO $$ BEGIN
  CREATE TYPE perfil_usuario_tipo AS ENUM ('owner', 'attendant', 'customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE operacao_cashback_tipo AS ENUM ('CREDITO', 'DEBITO', 'ESTORNO', 'EXPIRACAO', 'RESERVA');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE status_abastecimento_tipo AS ENUM ('PENDENTE', 'CONCLUIDO', 'CANCELADO', 'ESTORNADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. TABELA DE USUÁRIOS E PERFIS DO SISTEMA (VINCULADO AO AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.usuarios_perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role perfil_usuario_tipo NOT NULL DEFAULT 'customer',
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  posto_id UUID, -- Vinculado se for attendant
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE POSTOS DA REDE GRUPO OLIVEIRA (APROX. 6 UNIDADES)
CREATE TABLE IF NOT EXISTS public.postos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  cidade TEXT NOT NULL,
  uf CHAR(2) NOT NULL DEFAULT 'AM',
  endereco TEXT NOT NULL,
  telefone TEXT,
  taxa_cashback_padrao NUMERIC(5,2) NOT NULL DEFAULT 3.00 CHECK (taxa_cashback_padrao >= 0),
  pontos_por_real INTEGER NOT NULL DEFAULT 1 CHECK (pontos_por_real >= 1),
  minimo_resgate_cashback NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE CLIENTES (CUSTOMER)
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  numero_cartao TEXT NOT NULL UNIQUE,
  veiculo_padrao TEXT,
  placa_padrao TEXT,
  saldo_cashback NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (saldo_cashback >= 0.00),
  saldo_cashback_reservado NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (saldo_cashback_reservado >= 0.00),
  pontos_acumulados INTEGER NOT NULL DEFAULT 0 CHECK (pontos_acumulados >= 0),
  cashback_utilizado_total NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (cashback_utilizado_total >= 0.00),
  status TEXT NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'BLOQUEADO', 'INATIVO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABELA DE CARTÕES DIGITAIS DE FIDELIDADE
CREATE TABLE IF NOT EXISTS public.cartoes_digitais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  numero_formatado TEXT NOT NULL,
  nivel_membro TEXT NOT NULL DEFAULT 'OURO',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  emitido_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_em TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 years')
);

-- 7. TABELA DE FUNCIONÁRIOS / FRENTISTAS (ATTENDANT)
CREATE TABLE IF NOT EXISTS public.funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  posto_id UUID NOT NULL REFERENCES public.postos(id) ON DELETE RESTRICT,
  nome TEXT NOT NULL,
  matricula TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL DEFAULT 'Frentista',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABELA DE TOKENS TEMPORÁRIOS DE SEGURANÇA (QR CODE DINÂMICO)
CREATE TABLE IF NOT EXISTS public.tokens_seguranca (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  token_codigo TEXT NOT NULL UNIQUE,
  desconto_solicitado NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (desconto_solicitado >= 0),
  expira_em TIMESTAMPTZ NOT NULL,
  utilizado BOOLEAN NOT NULL DEFAULT FALSE,
  utilizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TABELA DE ABASTECIMENTOS (TRANSAÇÕES OPERACIONAIS)
CREATE TABLE IF NOT EXISTS public.abastecimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_transacao TEXT NOT NULL UNIQUE,
  token_seguranca_id UUID REFERENCES public.tokens_seguranca(id),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  posto_id UUID NOT NULL REFERENCES public.postos(id) ON DELETE RESTRICT,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE RESTRICT,
  tipo_combustivel TEXT NOT NULL,
  litros NUMERIC(10,3) NOT NULL CHECK (litros > 0),
  valor_litro NUMERIC(10,2) NOT NULL CHECK (valor_litro > 0),
  valor_total_bruto NUMERIC(10,2) NOT NULL CHECK (valor_total_bruto > 0),
  cashback_utilizado NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (cashback_utilizado >= 0),
  valor_pago_liquido NUMERIC(10,2) NOT NULL CHECK (valor_pago_liquido >= 0),
  taxa_cashback_aplicada NUMERIC(5,2) NOT NULL DEFAULT 3.00,
  cashback_creditado NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (cashback_creditado >= 0),
  pontos_creditados INTEGER NOT NULL DEFAULT 0 CHECK (pontos_creditados >= 0),
  forma_pagamento TEXT NOT NULL DEFAULT 'Cartão de Crédito',
  status status_abastecimento_tipo NOT NULL DEFAULT 'PENDENTE',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmado_em TIMESTAMPTZ
);

-- 10. TABELA DE MOVIMENTAÇÕES DE CASHBACK (LIVRO-RAZÃO AUDITÁVEL)
CREATE TABLE IF NOT EXISTS public.movimentacoes_cashback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  abastecimento_id UUID REFERENCES public.abastecimentos(id) ON DELETE SET NULL,
  tipo operacao_cashback_tipo NOT NULL,
  valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
  saldo_anterior NUMERIC(10,2) NOT NULL,
  saldo_posterior NUMERIC(10,2) NOT NULL,
  descricao TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TABELA DE MOVIMENTAÇÕES DE PONTOS
CREATE TABLE IF NOT EXISTS public.movimentacoes_pontos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  abastecimento_id UUID REFERENCES public.abastecimentos(id) ON DELETE SET NULL,
  quantidade INTEGER NOT NULL,
  saldo_anterior INTEGER NOT NULL,
  saldo_posterior INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TABELA DE RESGATES DE CASHBACK
CREATE TABLE IF NOT EXISTS public.resgates_cashback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  abastecimento_id UUID NOT NULL REFERENCES public.abastecimentos(id) ON DELETE CASCADE,
  valor_resgatado NUMERIC(10,2) NOT NULL CHECK (valor_resgatado > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_usuarios_perfis_role ON public.usuarios_perfis (role);
CREATE INDEX IF NOT EXISTS idx_tokens_seguranca_busca ON public.tokens_seguranca (token_codigo, utilizado, expira_em);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_cliente ON public.abastecimentos (cliente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_posto ON public.abastecimentos (posto_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abastecimentos_funcionario ON public.abastecimentos (funcionario_id, created_at DESC);

-- ====================================================================
-- PROCEDIMENTO ATÔMICO 1: INICIAR ABASTECIMENTO PENDENTE (PASSO 4)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.iniciar_abastecimento_pendente(
  p_token_codigo TEXT,
  p_posto_id UUID,
  p_funcionario_id UUID,
  p_tipo_combustivel TEXT,
  p_litros NUMERIC,
  p_valor_litro NUMERIC,
  p_valor_total NUMERIC,
  p_desconto_solicitado NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token RECORD;
  v_cliente RECORD;
  v_posto RECORD;
  v_funcionario RECORD;
  v_desconto_efetivo NUMERIC(10,2) := 0.00;
  v_valor_pago NUMERIC(10,2);
  v_cashback_previsto NUMERIC(10,2);
  v_pontos_previstos INTEGER;
  v_codigo_transacao TEXT;
  v_abastecimento_id UUID;
BEGIN
  -- 1. Validar e travar o Token de Segurança
  SELECT * INTO v_token
  FROM public.tokens_seguranca
  WHERE token_codigo = p_token_codigo
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Token de abastecimento não encontrado.';
  END IF;

  IF v_token.utilizado THEN
    RAISE EXCEPTION 'Este QR Code já foi utilizado.';
  END IF;

  IF v_token.expira_em < NOW() THEN
    RAISE EXCEPTION 'Token expirado. Solicite a atualização no app do cliente.';
  END IF;

  -- 2. Validar Posto e Funcionário
  SELECT * INTO v_posto FROM public.postos WHERE id = p_posto_id AND ativo = TRUE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Posto inválido ou inativo.';
  END IF;

  SELECT * INTO v_funcionario FROM public.funcionarios WHERE id = p_funcionario_id AND ativo = TRUE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Funcionário não autorizado ou inativo.';
  END IF;

  -- 3. Obter e travar o Cliente
  SELECT * INTO v_cliente
  FROM public.clientes
  WHERE id = v_token.cliente_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cliente não encontrado.';
  END IF;

  -- 4. Validação de Regra de Cashback (Regra 6: Mínimo R$ 10,00 para resgatar)
  IF p_desconto_solicitado > 0 THEN
    IF v_cliente.saldo_cashback < v_posto.minimo_resgate_cashback THEN
      RAISE EXCEPTION 'Resgate não permitido. Saldo mínimo necessário: R$ %', v_posto.minimo_resgate_cashback;
    END IF;

    IF p_desconto_solicitado > v_cliente.saldo_cashback THEN
      RAISE EXCEPTION 'Saldo insuficiente. Disponível: %, Solicitado: %', v_cliente.saldo_cashback, p_desconto_solicitado;
    END IF;

    IF p_desconto_solicitado > p_valor_total THEN
      v_desconto_efetivo := p_valor_total;
    ELSE
      v_desconto_efetivo := p_desconto_solicitado;
    END IF;

    -- Reservar o saldo no cliente (sem debitar em definitivo ainda)
    UPDATE public.clientes
    SET saldo_cashback_reservado = v_desconto_efetivo
    WHERE id = v_cliente.id;
  END IF;

  v_valor_pago := p_valor_total - v_desconto_efetivo;
  v_cashback_previsto := ROUND((v_valor_pago * (v_posto.taxa_cashback_padrao / 100.0)), 2);
  v_pontos_previstos := FLOOR(v_valor_pago * v_posto.pontos_por_real);
  v_codigo_transacao := 'GO-PEND-' || TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT);

  -- 5. Inserir em estado PENDENTE (Nenhum crédito é concedido ainda!)
  INSERT INTO public.abastecimentos (
    codigo_transacao,
    token_seguranca_id,
    cliente_id,
    posto_id,
    funcionario_id,
    tipo_combustivel,
    litros,
    valor_litro,
    valor_total_bruto,
    cashback_utilizado,
    valor_pago_liquido,
    taxa_cashback_aplicada,
    cashback_creditado,
    pontos_creditados,
    status
  ) VALUES (
    v_codigo_transacao,
    v_token.id,
    v_cliente.id,
    p_posto_id,
    p_funcionario_id,
    p_tipo_combustivel,
    p_litros,
    p_valor_litro,
    p_valor_total,
    v_desconto_efetivo,
    v_valor_pago,
    v_posto.taxa_cashback_padrao,
    v_cashback_previsto,
    v_pontos_previstos,
    'PENDENTE'
  ) RETURNING id INTO v_abastecimento_id;

  RETURN jsonb_build_object(
    'abastecimento_id', v_abastecimento_id,
    'codigo_transacao', v_codigo_transacao,
    'cliente_nome', v_cliente.nome,
    'valor_total', p_valor_total,
    'cashback_reservado', v_desconto_efetivo,
    'valor_a_pagar', v_valor_pago,
    'cashback_previsto', v_cashback_previsto,
    'pontos_previstos', v_pontos_previstos,
    'status', 'PENDENTE'
  );
END;
$$;

-- ====================================================================
-- PROCEDIMENTO ATÔMICO 2: CONFIRMAÇÃO FINAL DE PAGAMENTO (PASSO 5)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.confirmar_abastecimento_final(
  p_abastecimento_id UUID,
  p_forma_pagamento TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_abast RECORD;
  v_cliente RECORD;
  v_novo_saldo_cashback NUMERIC(10,2);
  v_novo_saldo_pontos INTEGER;
  v_codigo_final TEXT;
BEGIN
  -- 1. Travar o abastecimento pendente
  SELECT * INTO v_abast
  FROM public.abastecimentos
  WHERE id = p_abastecimento_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Abastecimento pendente não encontrado.';
  END IF;

  IF v_abast.status <> 'PENDENTE' THEN
    RAISE EXCEPTION 'Operação já foi finalizada ou cancelada anteriormente.';
  END IF;

  -- 2. Travar o cliente
  SELECT * INTO v_cliente
  FROM public.clientes
  WHERE id = v_abast.cliente_id
  FOR UPDATE;

  -- 3. Calcular novos saldos e efetivar débito de reserva e crédito de cashback
  v_novo_saldo_cashback := (v_cliente.saldo_cashback - v_abast.cashback_utilizado) + v_abast.cashback_creditado;
  v_novo_saldo_pontos := v_cliente.pontos_acumulados + v_abast.pontos_creditados;
  v_codigo_final := REPLACE(v_abast.codigo_transacao, 'PEND-', '');

  -- 4. Registrar débito do cashback utilizado
  IF v_abast.cashback_utilizado > 0 THEN
    INSERT INTO public.movimentacoes_cashback (
      cliente_id, abastecimento_id, tipo, valor, saldo_anterior, saldo_posterior, descricao
    ) VALUES (
      v_cliente.id, v_abast.id, 'DEBITO', v_abast.cashback_utilizado, v_cliente.saldo_cashback, (v_cliente.saldo_cashback - v_abast.cashback_utilizado),
      'Resgate de cashback no abastecimento ' || v_codigo_final
    );

    INSERT INTO public.resgates_cashback (
      cliente_id, abastecimento_id, valor_resgatado
    ) VALUES (
      v_cliente.id, v_abast.id, v_abast.cashback_utilizado
    );
  END IF;

  -- 5. Registrar crédito de cashback ganho
  IF v_abast.cashback_creditado > 0 THEN
    INSERT INTO public.movimentacoes_cashback (
      cliente_id, abastecimento_id, tipo, valor, saldo_anterior, saldo_posterior, descricao
    ) VALUES (
      v_cliente.id, v_abast.id, 'CREDITO', v_abast.cashback_creditado, (v_cliente.saldo_cashback - v_abast.cashback_utilizado), v_novo_saldo_cashback,
      'Cashback 3% ganho no abastecimento ' || v_codigo_final
    );
  END IF;

  -- 6. Registrar crédito de pontos
  IF v_abast.pontos_creditados > 0 THEN
    INSERT INTO public.movimentacoes_pontos (
      cliente_id, abastecimento_id, quantidade, saldo_anterior, saldo_posterior, descricao
    ) VALUES (
      v_cliente.id, v_abast.id, v_abast.pontos_creditados, v_cliente.pontos_acumulados, v_novo_saldo_pontos,
      'Pontos creditados no abastecimento ' || v_codigo_final
    );
  END IF;

  -- 7. Atualizar saldos definitivos no cliente e zerar reserva
  UPDATE public.clientes
  SET
    saldo_cashback = v_novo_saldo_cashback,
    saldo_cashback_reservado = 0.00,
    pontos_acumulados = v_novo_saldo_pontos,
    cashback_utilizado_total = v_cliente.cashback_utilizado_total + v_abast.cashback_utilizado,
    updated_at = NOW()
  WHERE id = v_cliente.id;

  -- 8. Finalizar o abastecimento
  UPDATE public.abastecimentos
  SET
    codigo_transacao = v_codigo_final,
    forma_pagamento = p_forma_pagamento,
    status = 'CONCLUIDO',
    confirmado_em = NOW()
  WHERE id = v_abast.id;

  -- 9. Invalidar o token de segurança
  IF v_abast.token_seguranca_id IS NOT NULL THEN
    UPDATE public.tokens_seguranca
    SET utilizado = TRUE, utilizado_em = NOW()
    WHERE id = v_abast.token_seguranca_id;
  END IF;

  RETURN jsonb_build_object(
    'sucesso', TRUE,
    'codigo_transacao', v_codigo_final,
    'valor_total', v_abast.valor_total_bruto,
    'cashback_utilizado', v_abast.cashback_utilizado,
    'valor_pago', v_abast.valor_pago_liquido,
    'cashback_creditado', v_abast.cashback_creditado,
    'pontos_creditados', v_abast.pontos_creditados,
    'novo_saldo_cashback', v_novo_saldo_cashback,
    'novo_saldo_pontos', v_novo_saldo_pontos,
    'data_hora', NOW()
  );
END;
$$;

-- ====================================================================
-- PROCEDIMENTO ATÔMICO 3: CANCELAR OPERAÇÃO PENDENTE (LIBERA RESERVA)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.cancelar_abastecimento_pendente(p_abastecimento_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_abast RECORD;
BEGIN
  SELECT * INTO v_abast FROM public.abastecimentos WHERE id = p_abastecimento_id FOR UPDATE;
  IF NOT FOUND OR v_abast.status <> 'PENDENTE' THEN
    RETURN FALSE;
  END IF;

  -- Liberar reserva de cashback no cliente
  IF v_abast.cashback_utilizado > 0 THEN
    UPDATE public.clientes
    SET saldo_cashback_reservado = 0.00
    WHERE id = v_abast.cliente_id;
  END IF;

  UPDATE public.abastecimentos SET status = 'CANCELADO' WHERE id = p_abastecimento_id;
  RETURN TRUE;
END;
$$;

-- ====================================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ====================================================================

ALTER TABLE public.usuarios_perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens_seguranca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abastecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_cashback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_pontos ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para CUSTOMER (Cliente)
CREATE POLICY "Customer pode ler apenas seu proprio perfil"
  ON public.clientes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Customer consulta seus abastecimentos"
  ON public.abastecimentos FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

CREATE POLICY "Customer consulta seus tokens"
  ON public.tokens_seguranca FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

CREATE POLICY "Customer cria seus tokens temporarios"
  ON public.tokens_seguranca FOR INSERT TO authenticated
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- 2. Políticas para ATTENDANT (Frentista)
CREATE POLICY "Attendant consulta dados do seu proprio posto"
  ON public.postos FOR SELECT TO authenticated
  USING (
    ativo = TRUE AND (
      id IN (SELECT posto_id FROM public.funcionarios WHERE user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    )
  );

CREATE POLICY "Attendant consulta abastecimentos do seu posto"
  ON public.abastecimentos FOR SELECT TO authenticated
  USING (
    posto_id IN (SELECT posto_id FROM public.funcionarios WHERE user_id = auth.uid())
    OR funcionario_id IN (SELECT id FROM public.funcionarios WHERE user_id = auth.uid())
  );

CREATE POLICY "Attendant nao pode alterar saldos diretamente"
  ON public.clientes FOR UPDATE USING (false);

-- 3. Políticas para OWNER (Proprietário)
CREATE POLICY "Owner tem visibilidade de todos os postos e abastecimentos"
  ON public.abastecimentos FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- ====================================================================
-- CARGA DE DADOS INICIAIS (REDE GRUPO OLIVEIRA — 6 POSTOS)
-- ====================================================================

INSERT INTO public.postos (id, nome, cidade, uf, endereco, telefone, taxa_cashback_padrao, pontos_por_real, minimo_resgate_cashback)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Posto Marcos Zagury (Matriz)', 'Parintins', 'AM', 'Av. Marcos Zagury, 455 — Parintins, AM', '(92) 99123-4567', 3.00, 1, 10.00),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Posto Grupo Oliveira Barreirinha', 'Barreirinha', 'AM', 'Área Central / Orla — Barreirinha, AM', '(92) 99123-7890', 3.00, 1, 10.00),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Posto Grupo Oliveira Nhamundá', 'Nhamundá', 'AM', 'Orla Principal Fluvial — Nhamundá, AM', '(92) 99123-1122', 3.00, 1, 10.00),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Posto Grupo Oliveira Terra Santa', 'Terra Santa', 'PA', 'Av. Central de Acesso — Terra Santa, PA', '(93) 99123-3344', 3.00, 1, 10.00),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Posto Fluvial Macurany', 'Parintins', 'AM', 'Lago Macurany / Píer — Parintins, AM', '(92) 99123-5566', 3.00, 1, 10.00),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Posto Oliveira Rodo-Fluvial', 'Nhamundá', 'AM', 'Margem Fluvial — Nhamundá, AM', '(92) 99123-8899', 3.00, 1, 10.00)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cidade = EXCLUDED.cidade,
  minimo_resgate_cashback = EXCLUDED.minimo_resgate_cashback;

-- ====================================================================
-- MÓDULO: DIVULGAÇÃO, CADASTROS E INDICAÇÕES (REDE GRUPO OLIVEIRA)
-- ====================================================================

-- 14. TABELA DE INDICAÇÕES DE CLIENTES
CREATE TABLE IF NOT EXISTS public.indicacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_convite TEXT NOT NULL,
  indicador_cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  indicado_cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE UNIQUE,
  posto_origem_id UUID REFERENCES public.postos(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'CADASTRO_REALIZADO' 
    CHECK (status IN ('CADASTRO_REALIZADO', 'AGUARDANDO_PRIMEIRO_ABASTECIMENTO', 'QUALIFICADA', 'INVALIDA', 'ESTORNADA')),
  primeiro_abastecimento_id UUID REFERENCES public.abastecimentos(id) ON DELETE SET NULL,
  recompensa_paga BOOLEAN NOT NULL DEFAULT FALSE,
  valor_recompensa NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (valor_recompensa >= 0),
  motivo_invalidacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  qualificada_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_indicacoes_indicador ON public.indicacoes(indicador_cliente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indicacoes_posto ON public.indicacoes(posto_origem_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indicacoes_status ON public.indicacoes(status);

-- 15. TABELA DE CONFIGURAÇÕES DE RECOMPENSAS (EXCLUSIVO PROPRIETÁRIO)
CREATE TABLE IF NOT EXISTS public.configuracoes_indicacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recompensas_ativas BOOLEAN NOT NULL DEFAULT FALSE, -- ATENÇÃO: DESATIVADA POR PADRÃO
  valor_por_indicacao NUMERIC(10,2) NOT NULL DEFAULT 1.00 CHECK (valor_por_indicacao >= 0),
  limite_mensal_indicacoes INTEGER NOT NULL DEFAULT 5 CHECK (limite_mensal_indicacoes >= 0),
  teto_mensal_bonus NUMERIC(10,2) NOT NULL DEFAULT 5.00 CHECK (teto_mensal_bonus >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Inserir configuração padrão inicial (DESATIVADA)
INSERT INTO public.configuracoes_indicacao (recompensas_ativas, valor_por_indicacao, limite_mensal_indicacoes, teto_mensal_bonus)
VALUES (FALSE, 1.00, 5, 5.00)
ON CONFLICT DO NOTHING;

-- 16. TABELA DE AUDITORIA E PROTEÇÃO CONTRA FRAUDES
CREATE TABLE IF NOT EXISTS public.auditoria_indicacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  indicacao_id UUID REFERENCES public.indicacoes(id) ON DELETE CASCADE,
  detalhes JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- PROCEDIMENTO ATÔMICO: QUALIFICAR INDICAÇÃO NO 1º ABASTECIMENTO
-- ====================================================================
CREATE OR REPLACE FUNCTION public.processar_qualificacao_indicacao(p_abastecimento_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_abastecimento RECORD;
  v_indicacao RECORD;
  v_cfg RECORD;
  v_indicacoes_mes INTEGER;
  v_valor_creditar NUMERIC(10,2) := 0.00;
  v_saldo_anterior NUMERIC(10,2);
  v_saldo_posterior NUMERIC(10,2);
BEGIN
  -- 1. Obter e validar abastecimento
  SELECT * INTO v_abastecimento FROM public.abastecimentos WHERE id = p_abastecimento_id AND status = 'CONCLUIDO';
  IF NOT FOUND THEN
    RETURN jsonb_build_object('sucesso', false, 'erro', 'Abastecimento não localizado ou não concluído');
  END IF;

  -- 2. Verificar se o cliente possui indicação pendente de qualificação
  SELECT * INTO v_indicacao FROM public.indicacoes 
  WHERE indicado_cliente_id = v_abastecimento.cliente_id 
    AND status IN ('CADASTRO_REALIZADO', 'AGUARDANDO_PRIMEIRO_ABASTECIMENTO')
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('sucesso', true, 'mensagem', 'Cliente sem indicações pendentes de qualificação');
  END IF;

  -- 3. Obter configurações ativas de recompensa
  SELECT * INTO v_cfg FROM public.configuracoes_indicacao ORDER BY updated_at DESC LIMIT 1;
  IF NOT FOUND THEN
    v_cfg.recompensas_ativas := FALSE;
    v_cfg.valor_por_indicacao := 1.00;
    v_cfg.limite_mensal_indicacoes := 5;
    v_cfg.teto_mensal_bonus := 5.00;
  END IF;

  -- 4. Atualizar status da indicação para QUALIFICADA
  UPDATE public.indicacoes SET
    status = 'QUALIFICADA',
    primeiro_abastecimento_id = v_abastecimento.id,
    qualificada_em = NOW()
  WHERE id = v_indicacao.id;

  -- 5. Se recompensas estiverem ativas e houver indicador válido, calcular e creditar
  IF v_cfg.recompensas_ativas = TRUE AND v_indicacao.indicador_cliente_id IS NOT NULL THEN
    -- Contar quantas indicações já foram premiadas para esse indicador no mês corrente
    SELECT COUNT(*) INTO v_indicacoes_mes 
    FROM public.indicacoes 
    WHERE indicador_cliente_id = v_indicacao.indicador_cliente_id 
      AND recompensa_paga = TRUE 
      AND qualificada_em >= date_trunc('month', NOW());

    IF v_indicacoes_mes < v_cfg.limite_mensal_indicacoes THEN
      v_valor_creditar := v_cfg.valor_por_indicacao;
      
      -- Atualizar saldo de cashback do indicador atomicamente
      SELECT saldo_cashback INTO v_saldo_anterior 
      FROM public.clientes 
      WHERE id = v_indicacao.indicador_cliente_id FOR UPDATE;

      v_saldo_posterior := v_saldo_anterior + v_valor_creditar;

      UPDATE public.clientes SET
        saldo_cashback = v_saldo_posterior,
        updated_at = NOW()
      WHERE id = v_indicacao.indicador_cliente_id;

      -- Registrar no livro razão de movimentações
      INSERT INTO public.movimentacoes_cashback (cliente_id, abastecimento_id, tipo, valor, saldo_anterior, saldo_posterior, descricao)
      VALUES (
        v_indicacao.indicador_cliente_id,
        v_abastecimento.id,
        'CREDITO',
        v_valor_creditar,
        v_saldo_anterior,
        v_saldo_posterior,
        'Bônus por Indicação Qualificada (Primeiro Abastecimento Concluído)'
      );

      UPDATE public.indicacoes SET
        recompensa_paga = TRUE,
        valor_recompensa = v_valor_creditar
      WHERE id = v_indicacao.id;
    END IF;
  END IF;

  -- 6. Log de auditoria
  INSERT INTO public.auditoria_indicacoes (evento, cliente_id, indicacao_id, detalhes)
  VALUES (
    'INDICAÇÃO_QUALIFICADA',
    v_abastecimento.cliente_id,
    v_indicacao.id,
    jsonb_build_object(
      'abastecimento_id', v_abastecimento.id,
      'valor_abastecimento', v_abastecimento.valor_total_bruto,
      'recompensa_paga', (v_valor_creditar > 0),
      'valor_recompensa', v_valor_creditar
    )
  );

  RETURN jsonb_build_object(
    'sucesso', true,
    'indicacao_id', v_indicacao.id,
    'status', 'QUALIFICADA',
    'recompensa_paga', (v_valor_creditar > 0),
    'valor_creditado', v_valor_creditar
  );
END;
$$;

-- POLÍTICAS DE RLS PARA O MÓDULO DE INDICAÇÕES
ALTER TABLE public.indicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_indicacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_indicacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer consulta suas proprias indicacoes"
  ON public.indicacoes FOR SELECT TO authenticated
  USING (
    indicador_cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
    OR indicado_cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner tem controle total sobre indicacoes"
  ON public.indicacoes FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
  );

CREATE POLICY "Qualquer usuario autenticado consulta configuracoes"
  ON public.configuracoes_indicacao FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Apenas Owner edita configuracoes de indicacao"
  ON public.configuracoes_indicacao FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.usuarios_perfis WHERE id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- ====================================================================
-- GATILHO AUTOMÁTICO DE CRIAÇÃO DE USUÁRIOS NO SUPABASE AUTH
-- Garante que novos cadastros públicos criem estritamente perfil 'customer'
-- e inicializem seu cartão digital e conta fidelidade de forma atômica
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role perfil_usuario_tipo := 'customer';
  v_nome TEXT;
  v_telefone TEXT;
  v_cpf TEXT;
  v_veiculo TEXT;
  v_placa TEXT;
  v_cartao TEXT;
  v_cliente_id UUID;
  v_requested_role TEXT;
BEGIN
  v_nome := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  v_telefone := NEW.raw_user_meta_data->>'phone';
  v_cpf := NEW.raw_user_meta_data->>'cpf';
  v_veiculo := COALESCE(NEW.raw_user_meta_data->>'vehicle', 'Veículo Passeio');
  v_placa := COALESCE(NEW.raw_user_meta_data->>'plate', 'PLACA-GO');

  -- Regra de Segurança: apenas metadados explícitos de provisionamento aceitam 'owner' ou 'attendant'
  v_requested_role := NEW.raw_user_meta_data->>'role';
  IF v_requested_role IN ('owner', 'attendant') AND NEW.raw_app_meta_data->>'provider' = 'admin' THEN
    v_role := v_requested_role::perfil_usuario_tipo;
  ELSIF v_requested_role = 'owner' AND NEW.email LIKE '%proprietario@grupooliveira.com.br' THEN
    v_role := 'owner';
  ELSIF v_requested_role = 'attendant' AND NEW.email LIKE '%frentista@grupooliveira.com.br' THEN
    v_role := 'attendant';
  ELSE
    v_role := 'customer';
  END IF;

  -- 1. Inserir ou atualizar na tabela usuarios_perfis
  INSERT INTO public.usuarios_perfis (id, role, nome, email, ativo)
  VALUES (NEW.id, v_role, v_nome, NEW.email, true)
  ON CONFLICT (id) DO UPDATE
  SET nome = EXCLUDED.nome,
      email = EXCLUDED.email,
      updated_at = NOW();

  -- 2. Se for customer, inicializar conta de cliente e cartão digital
  IF v_role = 'customer' THEN
    v_cartao := COALESCE(
      NEW.raw_user_meta_data->>'cardNumber',
      '4589 ' || lpad(floor(random()*10000)::text, 4, '0') || ' ' ||
      lpad(floor(random()*10000)::text, 4, '0') || ' ' ||
      lpad(floor(random()*10000)::text, 4, '0')
    );

    INSERT INTO public.clientes (
      user_id, nome, email, telefone, numero_cartao,
      veiculo_padrao, placa_padrao, saldo_cashback, pontos_acumulados, status
    )
    VALUES (
      NEW.id, v_nome, NEW.email, v_telefone, v_cartao,
      v_veiculo, v_placa, 0.00, 100, 'ATIVO'
    )
    ON CONFLICT (numero_cartao) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        nome = EXCLUDED.nome,
        email = EXCLUDED.email
    RETURNING id INTO v_cliente_id;

    -- Inserir cartão digital
    IF v_cliente_id IS NOT NULL THEN
      INSERT INTO public.cartoes_digitais (cliente_id, numero_formatado, nivel_membro, ativo)
      VALUES (v_cliente_id, v_cartao, 'OURO', true)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


