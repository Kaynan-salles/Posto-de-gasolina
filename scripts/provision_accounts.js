/**
 * PROVISIONAMENTO SEGURO DE CONTAS DE DEMONSTRAÇÃO — GRUPO OLIVEIRA
 * Cria e atualiza as 3 contas permanentes de teste no Supabase Auth:
 * 1. Proprietário (owner): proprietario@grupooliveira.com.br
 * 2. Frentista (attendant): frentista@grupooliveira.com.br
 * 3. Cliente (customer): cliente@grupooliveira.com.br
 *
 * Utiliza SUPABASE_SERVICE_ROLE_KEY de forma administrativa estritamente no servidor.
 * NUNCA exponha esta chave ou as senhas no cliente web ou em repositórios públicos.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Oliveira@2026!';

const DEMO_USERS = [
  {
    role: 'owner',
    email: 'proprietario@grupooliveira.com.br',
    name: 'Roberto Oliveira',
    title: 'Proprietário Geral da Rede',
    phone: '(92) 99155-0010',
    stationId: null,
    stationName: 'Rede Grupo Oliveira (Todas as 6 Unidades)'
  },
  {
    role: 'attendant',
    email: 'frentista@grupooliveira.com.br',
    name: 'Carlos Silva',
    title: 'Operador de Pista / Frentista',
    phone: '(92) 98412-3344',
    registration: '1042',
    stationId: 'matriz-parintins',
    stationName: 'Posto Marcos Zagury (Matriz - Parintins)'
  },
  {
    role: 'customer',
    email: 'cliente@grupooliveira.com.br',
    name: 'Kaynã Viana',
    title: 'Cliente VIP Clube Grupo Oliveira',
    phone: '(92) 99124-5500',
    cpf: '782.459.202-00',
    cardNumber: '4589 8210 3349 1204',
    vehicle: 'Chevrolet Onix 1.0',
    plate: 'PHN-4B20',
    stationId: 'matriz-parintins',
    stationName: 'Posto Marcos Zagury (Matriz)',
    balance: 0.00,
    points: 0
  }
];

async function provisionAccounts() {
  console.log('='.repeat(70));
  console.log('  PROVISIONAMENTO ADMINISTRATIVO DE CONTAS — GRUPO OLIVEIRA');
  console.log('='.repeat(70));

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_URL.includes('seu-projeto')) {
    console.warn('\n[AVISO] Credenciais do Supabase não configuradas no arquivo .env');
    console.log('Para conectar ao Supabase real, configure as seguintes variáveis no .env:');
    console.log('  - SUPABASE_URL (Ex.: https://xyzproject.supabase.co)');
    console.log('  - SUPABASE_ANON_KEY (Chave pública anônima)');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY (Chave secreta de administração)');
    console.log('  - DEMO_PASSWORD (Opcional, padrão seguro)');
    console.log('\nAs contas preparadas para provisionamento são:');
    DEMO_USERS.forEach((u, i) => {
      console.log(`  ${i + 1}. [${u.role.toUpperCase()}] ${u.email} — ${u.name}`);
    });
    console.log('='.repeat(70));
    return { success: false, reason: 'missing_credentials' };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = [];

  for (const userDef of DEMO_USERS) {
    try {
      console.log(`\nProcessando [${userDef.role.toUpperCase()}]: ${userDef.email}...`);

      // 1. Verificar se o usuário já existe no Supabase Auth
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      const existingUser = (listData.users || []).find(
        u => u.email && u.email.toLowerCase() === userDef.email.toLowerCase()
      );

      let authUser = null;

      if (existingUser) {
        console.log(`  -> Usuário existente encontrado (ID: ${existingUser.id}). Atualizando senha e metadados...`);
        const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: DEMO_PASSWORD,
            email_confirm: true,
            user_metadata: {
              name: userDef.name,
              role: userDef.role,
              phone: userDef.phone,
              stationId: userDef.stationId,
              cardNumber: userDef.cardNumber || null,
              cpf: userDef.cpf || null
            }
          }
        );
        if (updateError) throw updateError;
        authUser = updated.user;
        console.log('  -> Senha atualizada com sucesso sem perder relacionamentos.');
      } else {
        console.log(`  -> Criando novo usuário no Supabase Auth...`);
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email: userDef.email,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: {
            name: userDef.name,
            role: userDef.role,
            phone: userDef.phone,
            stationId: userDef.stationId,
            cardNumber: userDef.cardNumber || null,
            cpf: userDef.cpf || null
          }
        });
        if (createError) throw createError;
        authUser = created.user;
        console.log(`  -> Conta criada com sucesso (ID: ${authUser.id}).`);
      }

      // 2. Atualizar ou inserir na tabela public.usuarios_perfis
      const { error: profileError } = await supabase
        .from('usuarios_perfis')
        .upsert({
          id: authUser.id,
          role: userDef.role,
          nome: userDef.name,
          email: userDef.email,
          ativo: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (profileError) {
        console.warn(`  [Aviso Perfil] Não foi possível sincronizar usuarios_perfis:`, profileError.message);
      } else {
        console.log(`  -> Tabela public.usuarios_perfis sincronizada (Perfil: ${userDef.role}).`);
      }

      // 3. Se for Cliente, sincronizar public.clientes
      if (userDef.role === 'customer') {
        const { error: clientError } = await supabase
          .from('clientes')
          .upsert({
            user_id: authUser.id,
            nome: userDef.name,
            email: userDef.email,
            telefone: userDef.phone,
            numero_cartao: userDef.cardNumber,
            veiculo_padrao: userDef.vehicle,
            placa_padrao: userDef.plate,
            saldo_cashback: userDef.balance,
            pontos_acumulados: userDef.points,
            status: 'ATIVO',
            updated_at: new Date().toISOString()
          }, { onConflict: 'numero_cartao' });

        if (clientError) {
          console.warn(`  [Aviso Cliente] Não foi possível sincronizar public.clientes:`, clientError.message);
        } else {
          console.log(`  -> Tabela public.clientes sincronizada (Cartão: ${userDef.cardNumber}).`);
        }
      }

      // 4. Se for Frentista, sincronizar public.funcionarios
      if (userDef.role === 'attendant') {
        // Tentar obter ID de posto da matriz
        const { data: postos } = await supabase.from('postos').select('id, nome').limit(1);
        const postoId = postos && postos.length > 0 ? postos[0].id : null;

        if (postoId) {
          const { error: funcError } = await supabase
            .from('funcionarios')
            .upsert({
              user_id: authUser.id,
              posto_id: postoId,
              nome: userDef.name,
              matricula: userDef.registration,
              cargo: 'Frentista',
              ativo: true
            }, { onConflict: 'matricula' });

          if (funcError) {
            console.warn(`  [Aviso Funcionário] Não foi possível sincronizar public.funcionarios:`, funcError.message);
          } else {
            console.log(`  -> Tabela public.funcionarios sincronizada (Matrícula: ${userDef.registration}).`);
          }
        }
      }

      results.push({
        role: userDef.role,
        email: userDef.email,
        name: userDef.name,
        userId: authUser.id,
        status: 'Configurada e Ativa'
      });
    } catch (err) {
      console.error(`  [ERRO] Falha ao processar ${userDef.email}:`, err.message);
      results.push({
        role: userDef.role,
        email: userDef.email,
        name: userDef.name,
        error: err.message
      });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('  RESUMO DO PROVISIONAMENTO SUPABASE AUTH');
  console.log('='.repeat(70));
  results.forEach(r => {
    if (r.error) {
      console.log(`  ❌ [${r.role.toUpperCase()}] ${r.email} — ERRO: ${r.error}`);
    } else {
      console.log(`  ✅ [${r.role.toUpperCase()}] ${r.email} — ${r.name}`);
      console.log(`     Status: ${r.status} | ID: ${r.userId}`);
    }
  });
  console.log('='.repeat(70));

  return { success: true, results };
}

if (require.main === module) {
  provisionAccounts().then(() => process.exit(0)).catch(e => {
    console.error('Erro fatal:', e);
    process.exit(1);
  });
}

module.exports = { provisionAccounts, DEMO_USERS };
