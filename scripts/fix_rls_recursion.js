/**
 * FIX RLS RECURSION & POLICIES — GRUPO OLIVEIRA
 */

require('dotenv').config();
const { Client } = require('pg');

async function fixRls() {
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
    -- 1. Funções Auxiliares SECURITY DEFINER para checagem de privilégios sem recursão
    CREATE OR REPLACE FUNCTION public.check_is_owner()
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.usuarios_perfis
        WHERE id = auth.uid() AND role IN ('owner', 'admin')
      );
    END;
    $$;

    CREATE OR REPLACE FUNCTION public.check_is_attendant()
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.funcionarios
        WHERE user_id = auth.uid() AND ativo = TRUE
      );
    END;
    $$;

    GRANT EXECUTE ON FUNCTION public.check_is_owner() TO authenticated, anon;
    GRANT EXECUTE ON FUNCTION public.check_is_attendant() TO authenticated, anon;

    -- 2. Políticas para USUARIOS_PERFIS (SEM RECURSÃO)
    DROP POLICY IF EXISTS "Usuarios podem ver seu proprio perfil" ON public.usuarios_perfis;
    CREATE POLICY "Usuarios podem ver seu proprio perfil"
      ON public.usuarios_perfis FOR SELECT TO authenticated
      USING (id = auth.uid() OR public.check_is_owner());

    DROP POLICY IF EXISTS "Owner pode atualizar perfis" ON public.usuarios_perfis;
    CREATE POLICY "Owner pode atualizar perfis"
      ON public.usuarios_perfis FOR UPDATE TO authenticated
      USING (public.check_is_owner());

    -- 3. Políticas para CLIENTES
    DROP POLICY IF EXISTS "Customer pode ler apenas seu proprio perfil" ON public.clientes;
    DROP POLICY IF EXISTS "Owner tem visibilidade de todos os clientes" ON public.clientes;
    CREATE POLICY "Acesso a clientes por perfil"
      ON public.clientes FOR SELECT TO authenticated
      USING (
        auth.uid() = user_id
        OR public.check_is_owner()
        OR public.check_is_attendant()
      );

    -- 4. Políticas para ABASTECIMENTOS
    DROP POLICY IF EXISTS "Customer consulta seus abastecimentos" ON public.abastecimentos;
    DROP POLICY IF EXISTS "Attendant consulta abastecimentos do seu posto" ON public.abastecimentos;
    DROP POLICY IF EXISTS "Owner tem visibilidade de todos os postos e abastecimentos" ON public.abastecimentos;
    CREATE POLICY "Acesso a abastecimentos por perfil"
      ON public.abastecimentos FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR funcionario_id IN (SELECT id FROM public.funcionarios WHERE user_id = auth.uid())
        OR public.check_is_owner()
      );

    -- 5. Políticas para CARTOES DIGITAIS
    DROP POLICY IF EXISTS "Customer e Owner consultam cartoes" ON public.cartoes_digitais;
    CREATE POLICY "Customer e Owner consultam cartoes"
      ON public.cartoes_digitais FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR public.check_is_owner()
        OR public.check_is_attendant()
      );

    -- 6. Políticas para FUNCIONARIOS
    DROP POLICY IF EXISTS "Funcionarios e Owner consultam funcionarios" ON public.funcionarios;
    CREATE POLICY "Funcionarios e Owner consultam funcionarios"
      ON public.funcionarios FOR SELECT TO authenticated
      USING (
        user_id = auth.uid()
        OR public.check_is_owner()
      );

    -- 7. Políticas para MOVIMENTACOES DE CASHBACK E PONTOS
    DROP POLICY IF EXISTS "Customer e Owner consultam movimentacoes cashback" ON public.movimentacoes_cashback;
    CREATE POLICY "Customer e Owner consultam movimentacoes cashback"
      ON public.movimentacoes_cashback FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR public.check_is_owner()
      );

    DROP POLICY IF EXISTS "Customer e Owner consultam movimentacoes pontos" ON public.movimentacoes_pontos;
    CREATE POLICY "Customer e Owner consultam movimentacoes pontos"
      ON public.movimentacoes_pontos FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR public.check_is_owner()
      );

    DROP POLICY IF EXISTS "Customer e Owner consultam resgates" ON public.resgates_cashback;
    CREATE POLICY "Customer e Owner consultam resgates"
      ON public.resgates_cashback FOR SELECT TO authenticated
      USING (
        cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
        OR public.check_is_owner()
      );
  `;

  await client.query(sql);
  console.log('✅ RLS atualizado sem recursão!');
  await client.end();
}

fixRls().catch(console.error);
