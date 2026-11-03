require('dotenv').config();
const { Client } = require('pg');

async function run() {
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
      v_auto_token TEXT;
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
        v_auto_token := 'TK-GO-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
        INSERT INTO public.tokens_seguranca (cliente_id, token_codigo, desconto_solicitado, expira_em)
        VALUES (v_cliente.id, v_auto_token, 0.00, NOW() + INTERVAL '30 minutes');

        RETURN jsonb_build_object(
          'encontrado', true,
          'origem', 'cartao',
          'token_codigo', v_auto_token,
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
  `;

  await client.query(sql);
  console.log('✅ buscar_cliente_para_abastecimento atualizado com sucesso!');
  await client.end();
}

run().catch(console.error);
