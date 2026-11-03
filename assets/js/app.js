/**
 * GRUPO OLIVEIRA — SISTEMA DE FIDELIDADE & CLUBE DE VANTAGENS
 * Parintins - AM | Barreirinha - AM | Nhamundá - AM | Terra Santa - PA
 * Instagram: @grupooliveirapin
 */

// SVG Icons
const icons = {
  home: 'M3 10 12 3l9 7v10H4V10m5 10v-7h6v7',
  fuel: 'M4 21V4h10v17 M2 21h14 M6 7h6v5H6z M14 10h3v7a2 2 0 0 0 4 0V7l-3-3 M19 5v5h2',
  gift: 'M3 8h18v4H3z M5 12v9h14v-9 M12 8v13 M12 8C4 8 4 1 8 3c3 1 4 5 4 5s1-4 4-5c4-2 4 5-4 5',
  wallet: 'M20 7H5a2 2 0 0 1 0-4h13v4 M3 5v14a2 2 0 0 0 2 2h16V7H5 M21 12h-6v5h6 M17 14h1',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2',
  pin: 'M12 21s-8-6.5-8-12a8 8 0 1 1 16 0c0 5.5-8 12-8 12z M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  qr: 'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h2v2h-2z M20 15v6h-5 M12 3v8 M3 12h8 M12 15v6',
  car: 'M4 10l2-6h12l2 6 M3 10h18v8H3z M5 18v3 M19 18v3 M6 14h2 M16 14h2',
  coin: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9 M12 6v12',
  star: 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M5 12h14 M12 5l7 7-7 7',
  check: 'M20 6 9 17l-5-5',
  bolt: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  cup: 'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  back: 'M19 12H5 M12 19l-7-7 7-7',
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z'
};

function icon(name) {
  const p = icons[name] || icons.star;
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`;
}

const money = n => (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Local Storage & State Management — Operação Real (Sem Dados Fictícios)
const STORAGE_KEY = 'grupo-oliveira-fidelidade-v2';

let state = null;
try {
  // Purga de chaves legadas e dados mock
  localStorage.removeItem('kclube-personal-v1');
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    state = JSON.parse(stored);
    // Sanitização ativa de resíduos de demonstração
    const isMock = state.balance === 48.5 || 
                   state.balance === 41.2 || 
                   state.points === 850 || 
                   state.points === 940 || 
                   (state.registeredClients && state.registeredClients.some(c => c.id === 'CLI-0512'));
    if (isMock) {
      state.balance = 0.00;
      state.points = 0;
      state.cashbackUsed = 0.00;
      state.fills = [];
      state.registeredClients = [];
      state.referrals = [];
      state.vouchers = [];
      state.redemptions = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }
} catch (e) {}

if (!state) {
  state = {
    name: 'Cliente Grupo Oliveira',
    clientId: 'CLI-0001',
    cardNumber: '4589 8210 3349 1204',
    vehicle: '',
    plate: '',
    balance: 0.00,
    points: 0,
    cashbackUsed: 0.00,
    fills: [],
    vouchers: [],
    redemptions: [],
    vehicles: [],
    registeredClients: [],
    referrals: [],
    avatarUrl: 'assets/img/brand/icon-192.png'
  };
}

// Garantir que todos os campos de saldo e histórico comecem zerados
state.balance = Number(state.balance) || 0.00;
state.points = Number(state.points) || 0;
state.cashbackUsed = Number(state.cashbackUsed) || 0.00;
state.fills = Array.isArray(state.fills) ? state.fills : [];
state.vehicles = Array.isArray(state.vehicles) ? state.vehicles : [];
state.registeredClients = Array.isArray(state.registeredClients) ? state.registeredClients : [];
state.referrals = Array.isArray(state.referrals) ? state.referrals : [];
state.avatarUrl = state.avatarUrl || 'assets/img/brand/icon-192.png';

// Configurações do Sistema de Fidelidade (sem valores fixos no código)
const SYSTEM_CONFIG = {
  cashbackRate: 0.03, // 3% padrão
  pointsPerReal: 1,   // R$ 1,00 = 1 ponto
  minCashbackRedemption: 10.00, // Mínimo R$ 10,00 para habilitar resgate
  demoStation: 'Posto Marcos Zagury (Matriz)',
  demoStationCity: 'Parintins - AM'
};

// Hierarquia de Perfis (owner, attendant, customer)
state.currentRole = state.currentRole || 'customer';

// Operador de Pista / Frentista
if (!state.attendantUser || state.attendantUser.name === 'Carlos Silva') {
  state.attendantUser = {
    id: 'FUNC-01',
    name: 'Operador de Pista',
    registration: '01',
    role: 'attendant',
    stationId: 'matriz-parintins',
    stationName: 'Posto Marcos Zagury (Matriz)',
    stationCity: 'Parintins - AM',
    avatar: 'OP'
  };
}

// Resumo do Dia do Frentista (Persistido via Supabase)
state.attendantDailyStats = state.attendantDailyStats || {
  date: new Date().toISOString().split('T')[0],
  fillsCount: 0,
  totalAmount: 0.00,
  totalCashback: 0.00
};

// Histórico Recente de Abastecimentos do Frentista (Persistido via Supabase)
state.attendantFills = state.attendantFills || [];

state.pendingOperation = state.pendingOperation || null;

// Aliases para identificação dos 6 postos (ex: posto-01, matriz-parintins, UUIDs)
const STATION_ALIASES = {
  'posto-01': 'matriz-parintins',
  'posto-1': 'matriz-parintins',
  'matriz': 'matriz-parintins',
  'matriz-parintins': 'matriz-parintins',
  'a1b2c3d4-0001-4000-8000-000000000001': 'matriz-parintins',

  'posto-02': 'posto-barreirinha',
  'posto-2': 'posto-barreirinha',
  'barreirinha': 'posto-barreirinha',
  'posto-barreirinha': 'posto-barreirinha',
  'a1b2c3d4-0002-4000-8000-000000000002': 'posto-barreirinha',

  'posto-03': 'posto-nhamunda',
  'posto-3': 'posto-nhamunda',
  'nhamunda': 'posto-nhamunda',
  'posto-nhamunda': 'posto-nhamunda',
  'a1b2c3d4-0003-4000-8000-000000000003': 'posto-nhamunda',

  'posto-04': 'posto-terrasanta',
  'posto-4': 'posto-terrasanta',
  'terrasanta': 'posto-terrasanta',
  'posto-terrasanta': 'posto-terrasanta',
  'a1b2c3d4-0004-4000-8000-000000000004': 'posto-terrasanta',

  'posto-05': 'posto-fluvial',
  'posto-5': 'posto-fluvial',
  'fluvial': 'posto-fluvial',
  'posto-fluvial': 'posto-fluvial',
  'a1b2c3d4-0005-4000-8000-000000000005': 'posto-fluvial',

  'posto-06': 'posto-express',
  'posto-6': 'posto-express',
  'express': 'posto-express',
  'posto-express': 'posto-express',
  'a1b2c3d4-0006-4000-8000-000000000006': 'posto-express'
};

const STATION_DB_MAP = {
  'matriz-parintins': 'a1b2c3d4-0001-4000-8000-000000000001',
  'posto-barreirinha': 'a1b2c3d4-0002-4000-8000-000000000002',
  'posto-nhamunda': 'a1b2c3d4-0003-4000-8000-000000000003',
  'posto-terrasanta': 'a1b2c3d4-0004-4000-8000-000000000004',
  'posto-fluvial': 'a1b2c3d4-0005-4000-8000-000000000005',
  'posto-express': 'a1b2c3d4-0006-4000-8000-000000000006'
};

function getStationByRef(ref) {
  if (!ref) return null;
  const cleanRef = String(ref).trim().toLowerCase();
  const stationId = STATION_ALIASES[cleanRef] || cleanRef;
  return stations.find(s => s.id === stationId) || null;
}

// Configurações do Módulo de Indicações (DESATIVADO POR PADRÃO)
state.referralConfig = state.referralConfig || {
  rewardsActive: false, // Inicialmente desativado conforme requisito 7
  rewardAmount: 1.00,   // R$ 1,00 por indicação qualificada
  monthlyLimit: 5,      // Limite mensal de 5 indicações por cliente
  maxMonthlyBonus: 5.00 // Bonificação máxima mensal de R$ 5,00
};

// Base de Clientes Cadastrados Única da Rede (Sincronizada em tempo real com Supabase)
state.registeredClients = Array.isArray(state.registeredClients) ? state.registeredClients : [];

// Registro Central de Indicações da Rede (Sincronizado em tempo real com Supabase)
state.referrals = Array.isArray(state.referrals) ? state.referrals : [];

state.ownerFilterOrigin = state.ownerFilterOrigin || 'all';

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Notificações do Sistema (Sem dados simulados)
if (!state.notifications || !state.notifications.length) {
  state.notifications = [
    {
      id: 1,
      title: 'Bem-vindo ao Clube Grupo Oliveira! ⛽',
      desc: 'Acumule 3% de cashback em todos os seus abastecimentos nas 6 unidades da rede. Apresente seu QR Code ao frentista!',
      time: 'Hoje, 09:30',
      cat: 'Boas-vindas',
      icon: 'star',
      color: 'purple',
      read: false,
      action: "openAbastecerModal()",
      btnText: "Ver Meu Cartão"
    },
    {
      id: 2,
      title: '3% de Cashback em Todos os Abastecimentos ✨',
      desc: 'Abasteça na Matriz Parintins (Av. Marcos Zagury, 455) ou em qualquer posto da rede e acumule cashback na hora.',
      time: 'Hoje, 08:15',
      cat: 'Cashback',
      icon: 'coin',
      color: 'red',
      read: false,
      action: "openAbastecerModal()",
      btnText: "Abastecer Agora"
    },
    {
      id: 3,
      title: 'Nova Unidade em Nhamundá e Terra Santa 📍',
      desc: 'Conheça nossos pontos de abastecimento terrestre e fluvial com serviços completos e preços exclusivos.',
      time: 'Ontem, 16:40',
      cat: 'Unidades',
      icon: 'pin',
      color: 'blue',
      read: false,
      action: "go('Unidades')",
      btnText: "Ver Postos no Mapa"
    },
    {
      id: 4,
      title: 'Resgate de Brindes Oficiais Disponível 🎁',
      desc: 'Você tem pontos suficientes para resgatar o Kit Exclusivo Grupo Oliveira (Bolsa + Garrafa Térmica) no catálogo de prêmios.',
      time: 'Há 2 dias',
      cat: 'Prêmios',
      icon: 'gift',
      color: 'purple',
      read: true,
      action: "go('Prêmios')",
      btnText: "Ver Catálogo"
    },
    {
      id: 5,
      title: 'Sorteio: 1 Ano de Tanque Cheio 🏆',
      desc: 'A cada R$ 50 abastecidos, você ganha 1 cupom da sorte para concorrer a 1 ano de combustível grátis nos Postos Grupo Oliveira.',
      time: 'Há 4 dias',
      cat: 'Sorteios',
      icon: 'fuel',
      color: 'gold',
      read: true,
      action: "openSorteios()",
      btnText: "Conhecer Sorteio"
    }
  ];
  saveState();
}

let currentPage = 'Início';
let prizeTab = 'Disponíveis';
let voucherTab = 'Disponíveis';
let notifFilter = 'Todas';

// Nossas Unidades oficiais do Grupo Oliveira (Extraídas da Identidade Visual)
const stations = [
  {
    id: 'matriz-parintins',
    name: 'Posto Marcos Zagury (Matriz)',
    city: 'Parintins - AM',
    address: 'Av. Marcos Zagury, 455 — Parintins, AM',
    hours: 'Aberto 24 Horas',
    phone: '(92) 99123-4567',
    image: 'assets/img/media/station_night.webp',
    fuels: [
      { name: 'Gasolina Comum', price: 6.59 },
      { name: 'Gasolina Aditivada', price: 6.79 },
      { name: 'Diesel S10', price: 6.89 },
      { name: 'Etanol', price: 5.29 }
    ],
    services: ['Conveniência 24h', 'Ducha Ecológica', 'Troca de Óleo Lubrax', 'Calibrador Digital', 'Wi-Fi Grátis'],
    mapsUrl: 'https://maps.google.com/?q=Marcos+Zagury+455+Parintins+AM'
  },
  {
    id: 'posto-barreirinha',
    name: 'Posto Grupo Oliveira Barreirinha',
    city: 'Barreirinha - AM',
    address: 'Área Central / Orla — Barreirinha, AM',
    hours: '06:00 às 22:00',
    phone: '(92) 99123-7890',
    image: 'assets/img/media/station_canopy.webp',
    fuels: [
      { name: 'Gasolina Comum', price: 6.69 },
      { name: 'Gasolina Aditivada', price: 6.89 },
      { name: 'Diesel S10', price: 6.95 }
    ],
    services: ['Atendimento Fluvial & Terrestre', 'Conveniência', 'Troca de Óleo', 'Calibrador'],
    mapsUrl: 'https://maps.google.com/?q=Barreirinha+AM+Posto+Combustivel'
  },
  {
    id: 'posto-nhamunda',
    name: 'Posto Grupo Oliveira Nhamundá',
    city: 'Nhamundá - AM',
    address: 'Orla Principal Fluvial — Nhamundá, AM',
    hours: '06:00 às 22:00',
    phone: '(92) 99123-1122',
    image: 'assets/img/media/station_totem.webp',
    fuels: [
      { name: 'Gasolina Comum', price: 6.75 },
      { name: 'Gasolina Aditivada', price: 6.95 },
      { name: 'Diesel S10', price: 6.99 }
    ],
    services: ['Abastecimento Náutico & Automotivo', 'Conveniência', 'Lubrificantes de Alta Performance'],
    mapsUrl: 'https://maps.google.com/?q=Nhamunda+AM+Posto+Combustivel'
  },
  {
    id: 'posto-terrasanta',
    name: 'Posto Grupo Oliveira Terra Santa',
    city: 'Terra Santa - PA',
    address: 'Av. Central de Acesso — Terra Santa, PA',
    hours: '06:00 às 23:00',
    phone: '(93) 99123-3344',
    image: 'assets/img/media/station_canopy.webp',
    fuels: [
      { name: 'Gasolina Comum', price: 6.65 },
      { name: 'Gasolina Aditivada', price: 6.85 },
      { name: 'Diesel S10', price: 6.89 }
    ],
    services: ['Ponto de Apoio Rodoviário', 'Loja de Conveniência', 'Ducha Express'],
    mapsUrl: 'https://maps.google.com/?q=Terra+Santa+PA+Posto+Combustivel'
  },
  {
    id: 'posto-fluvial',
    name: 'Posto Fluvial Grupo Oliveira',
    city: 'Parintins - AM',
    address: 'Orla Fluvial do Porto — Parintins, AM',
    hours: '05:30 às 20:00',
    phone: '(92) 99123-5566',
    image: 'assets/img/media/station_totem.webp',
    fuels: [
      { name: 'Gasolina Comum', price: 6.70 },
      { name: 'Diesel Marítimo', price: 6.85 },
      { name: 'Diesel S10', price: 6.92 }
    ],
    services: ['Abastecimento de Embarcações & Lanchas', 'Óleo Náutico 2T/4T', 'Conveniência Portuária'],
    mapsUrl: 'https://maps.google.com/?q=Porto+Parintins+AM'
  },
  {
    id: 'posto-express',
    name: 'Posto Grupo Oliveira Express',
    city: 'Parintins - AM',
    address: 'Av. Amazonas, 1280 — Parintins, AM',
    hours: '06:00 às 23:00',
    phone: '(92) 99123-7788',
    image: 'assets/img/media/station_night.webp',
    fuels: [
      { name: 'Gasolina Comum', price: 6.59 },
      { name: 'Gasolina Aditivada', price: 6.79 },
      { name: 'Etanol', price: 5.29 }
    ],
    services: ['Pista Rápida Motos & Carros', 'Troca de Óleo Express', 'Calibrador Digital'],
    mapsUrl: 'https://maps.google.com/?q=Av+Amazonas+Parintins+AM'
  }
];

// Prêmios e Resgates do Clube
const rewards = [
  {
    title: 'Kit Exclusivo Grupo Oliveira',
    cat: 'Brindes Oficiais',
    cost: 850,
    desc: 'Bolsa ecológica oficial + Squeeze térmico Grupo Oliveira.',
    img: 'assets/img/media/branding_bag.webp'
  },
  {
    title: 'R$ 50 de Desconto no Abastecimento',
    cat: 'Combustível',
    cost: 1200,
    desc: 'Válido para Gasolina Comum, Aditivada ou Diesel S10 em qualquer unidade.',
    img: 'assets/img/media/card_loyalty.webp'
  },
  {
    title: 'Ducha & Lavagem Completa',
    cat: 'Serviços Automotivos',
    cost: 500,
    desc: 'Lavagem externa com cera protetora na Matriz Parintins.',
    img: 'assets/img/media/car_fleet.webp'
  },
  {
    title: 'Troca de Óleo Lubrificante (4L)',
    cat: 'Manutenção',
    cost: 1600,
    desc: 'Mão de obra e óleo mineral/semissintético homologado.',
    img: 'assets/img/media/station_night.webp'
  },
  {
    title: 'Café Expresso + Pão de Queijo',
    cat: 'Conveniência',
    cost: 250,
    desc: 'Uma pausa que vale a pena na conveniência dos postos Oliveira.',
    img: 'assets/img/media/station_totem.webp'
  }
];

// Navegação
function go(p) {
  currentPage = p;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toast notification
let toastTimer = null;
function toast(msg) {
  const t = document.querySelector('#toast');
  if (!t) return;
  t.innerHTML = msg;
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.style.display = 'none';
  }, 3500);
}

// Modal helper (com trava estrita de fundo)
const modal = document.querySelector('#modal');

function openModal(html) {
  modal.innerHTML = `
    <div class="dialog-head">
      <img src="assets/img/brand/clean_logo_h_purple.png?v=clean2" class="dialog-logo" alt="Grupo Oliveira">
      <button class="close-btn" onclick="closeModal()" aria-label="Fechar">✕</button>
    </div>
    ${html}
  `;
  document.body.classList.add('modal-open');
  if (!modal.open) {
    modal.showModal();
  }
}

function closeModal() {
  if (typeof stopScannerCamera === 'function') {
    stopScannerCamera();
  }
  if (tokenCountdownInterval) {
    clearInterval(tokenCountdownInterval);
    tokenCountdownInterval = null;
  }
  if (modal.open) {
    modal.close();
  }
  document.body.classList.remove('modal-open');
}

modal.addEventListener('close', () => {
  if (typeof stopScannerCamera === 'function') {
    stopScannerCamera();
  }
  if (tokenCountdownInterval) {
    clearInterval(tokenCountdownInterval);
    tokenCountdownInterval = null;
  }
  document.body.classList.remove('modal-open');
});

modal.addEventListener('cancel', () => {
  if (tokenCountdownInterval) {
    clearInterval(tokenCountdownInterval);
    tokenCountdownInterval = null;
  }
  document.body.classList.remove('modal-open');
});

// Fechar ao clicar fora do card (no backdrop)
modal.addEventListener('click', (e) => {
  const rect = modal.getBoundingClientRect();
  const isInDialog = (
    rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX && e.clientX <= rect.left + rect.width
  );
  if (!isInDialog) {
    closeModal();
  }
});

// Top Bar & Header Component
function renderHeader() {
  const totalSpent = state.fills.reduce((sum, f) => sum + f.amount, 0);
  const totalSaved = state.fills.reduce((sum, f) => sum + (f.amount * 0.03), 0) + (state.cashbackUsed || 0);
  const unreadCount = state.notifications ? state.notifications.filter(n => !n.read).length : 0;

  // Dedicated Header for Full-Screen Notifications Page
  if (currentPage === 'Notificações') {
    return `
      <header class="app-head" style="min-height:auto">
        <div class="head-content" style="padding:16px 20px">
          <div class="top-bar" style="margin-bottom:0">
            <button class="icon-btn" onclick="go('Início')" aria-label="Voltar ao início">
              ${icon('back')}
            </button>
            <div style="text-align:center">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#c4b5fd;font-weight:700">CENTRAL DE AVISOS</div>
              <div style="font-family:var(--font-heading);font-weight:800;font-size:20px;color:#fff;letter-spacing:-0.5px">Notificações</div>
            </div>
            <button class="icon-btn" onclick="markAllNotificationsRead()" aria-label="Marcar todas como lidas" title="Marcar todas como lidas">
              ${icon('check')}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Cards Oficiais solicitados pelo usuário
  const userCards = [
    {
      icon: 'assets/img/icons/icon_car.png',
      title: 'Crédito Recarga Elétrica',
      value: 'R$ 0,00',
      action: "openRecargaModal()"
    },
    {
      icon: 'assets/img/icons/icon_cash.png',
      title: 'Saldo de Cashback',
      value: money(state.balance),
      action: "openCashbackModal()"
    },
    {
      icon: 'assets/img/icons/icon_cash.png',
      title: 'Cashback Utilizado',
      value: money(state.cashbackUsed || 0),
      action: "openCashbackUsedModal()"
    },
    {
      icon: 'assets/img/icons/icon_cart.png',
      title: 'Minhas Compras',
      value: state.fills.length.toString(),
      action: "go('Histórico')"
    },
    {
      icon: 'assets/img/icons/icon_tag.png',
      title: 'Total Economizado',
      value: money(totalSaved),
      action: "openSavingsModal()"
    }
  ];

  return `
    <header class="app-head">
      <div class="head-content">
        <div class="top-bar">
          <div class="brand-wrapper">
            <img src="assets/img/brand/clean_logo_white.png" class="brand-logo-img" alt="Grupo Oliveira Logo" onclick="go('Início')">
          </div>
          <div class="top-actions">
            <button class="icon-btn" onclick="go('Notificações')" aria-label="Notificações">
              ${icon('bell')}
              ${unreadCount > 0 ? '<span class="badge-dot"></span>' : ''}
            </button>
            <button class="user-pill" onclick="go('Perfil')" aria-label="Perfil do Usuário">
              <img src="${state.avatarUrl || 'assets/img/brand/icon-192.png'}" class="user-avatar-top-img" alt="Avatar" style="width:26px;height:26px;border-radius:50%;object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,0.3);flex-shrink:0;">
              <span>${esc(state.name.split(' ')[0])}</span>
            </button>
            <button class="icon-btn" onclick="handleLogout()" aria-label="Sair da Conta" title="Sair da Conta" style="color:#f87171">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="user-greeting">
          <div class="greeting-sub">Clube de Benefícios Grupo Oliveira</div>
          <h1>${currentPage === 'Início' ? `Olá, ${esc(state.name.split(' ')[0])}!` : currentPage}</h1>
        </div>

        <!-- Balances Ticker (Cards Brancos Exatos do Usuário) -->
        <div class="balances-ticker">
          ${userCards.map(c => `
            <div class="user-stat-card" onclick="${c.action}" title="${esc(c.title)}">
              <img src="${c.icon}" class="user-stat-icon" alt="${esc(c.title)}">
              <div class="user-stat-title">${esc(c.title)}</div>
              <div class="user-stat-value">${esc(c.value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </header>
  `;
}

// Quick Navigation Grid
function renderQuickNav() {
  return `
    <section class="quick-nav">
      <button class="quick-btn" onclick="go('Unidades')">
        <div class="quick-icon-wrap purple-grad">${icon('pin')}</div>
        <span>Unidades</span>
      </button>
      <button class="quick-btn" onclick="openAbastecerModal()">
        <div class="quick-icon-wrap red-grad">${icon('fuel')}</div>
        <span>Abastecer</span>
      </button>
      <button class="quick-btn" onclick="go('Prêmios')">
        <div class="quick-icon-wrap blue-grad">${icon('gift')}</div>
        <span>Prêmios</span>
      </button>
      <button class="quick-btn" onclick="openSorteios()">
        <div class="quick-icon-wrap gold-grad">${icon('star')}</div>
        <span>Sorteios</span>
      </button>
      <button class="quick-btn" onclick="openInstagram()">
        <div class="quick-icon-wrap">${icon('instagram')}</div>
        <span>Instagram</span>
      </button>
    </section>
  `;
}

// Virtual Card Component (featuring real media: card_loyalty.webp)
function renderVirtualCard() {
  const cardNum = (state.cardNumber || '4589 8210 3349 1204').replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');
  const pts = Number(state.points) || 0;
  const tier = (pts >= 1500) ? 'MEMBRO VIP' : ((pts >= 500) ? 'MEMBRO PRATA' : 'MEMBRO CLUBE');
  const vehicleText = (state.vehicle || state.plate) 
    ? `Veículo: ${esc(state.vehicle || 'Padrão')} (${esc(state.plate || '---')})` 
    : 'Cartão Fidelidade Oficial';

  return `
    <div class="loyalty-card-container">
      <div class="virtual-card" onclick="openAbastecerModal()">
        <div class="virtual-card-bg"></div>
        <div class="virtual-card-head">
          <img src="assets/img/brand/clean_logo_white.png" class="virtual-card-logo" alt="Grupo Oliveira">
          <span class="card-tier-pill">${tier}</span>
        </div>
        <div class="virtual-card-chip"></div>
        <div class="virtual-card-number">${cardNum}</div>
        <div class="virtual-card-foot">
          <div>
            <div class="card-holder-name">${esc(state.name || 'Cliente')}</div>
            <div class="card-holder-sub">${vehicleText}</div>
          </div>
          <div style="text-align:right">
            <span style="font-size:10px;display:block;opacity:0.8">PONTOS</span>
            <strong style="font-size:17px">${pts}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Promo Cards Carousel with Real PDF Assets
function renderPromoCards() {
  return `
    <div class="section-header">
      <h2>Destaques & Campanhas</h2>
      <button class="see-all" onclick="go('Promoções')">Ver todas ${icon('arrow')}</button>
    </div>
    
    <div class="promo-cards-grid">
      <!-- Feed Media Card from PDF (page_10_img_1) -->
      <article class="promo-media-card" onclick="openPromoModal('campanha-oficial')">
        <img src="assets/img/media/post_feed.webp" class="promo-media-img" alt="Campanha Oficial Grupo Oliveira">
        <div class="promo-overlay">
          <span class="promo-badge">CAMPANHA OFICIAL</span>
          <h3 class="promo-title">Abasteceu, Ganhou Cashback!</h3>
          <p class="promo-desc">Receba 3% de volta na sua carteira digital a cada parada nas unidades Grupo Oliveira.</p>
          <div class="promo-action-row">
            <span>Ver detalhes e regras</span>
            ${icon('arrow')}
          </div>
        </div>
      </article>

      <!-- Story Banner Card from PDF (page_10_img_2) -->
      <article class="promo-media-card" onclick="openPromoModal('postos-oliveira')">
        <img src="assets/img/media/story_banner.webp" class="promo-media-img" alt="Presença Regional Grupo Oliveira">
        <div class="promo-overlay">
          <span class="promo-badge blue">PRESENÇA REGIONAL</span>
          <h3 class="promo-title">Parintins, Barreirinha, Nhamundá e Terra Santa</h3>
          <p class="promo-desc">Qualidade incomparável em combustíveis e atendimento no Baixo Amazonas.</p>
          <div class="promo-action-row">
            <span>Conheça nossas unidades</span>
            ${icon('arrow')}
          </div>
        </div>
      </article>

      <!-- Station Night Backdrop Card (page_6_img_1) -->
      <article class="promo-media-card" onclick="go('Unidades')">
        <img src="assets/img/media/station_night.webp" class="promo-media-img" alt="Posto Marcos Zagury Parintins">
        <div class="promo-overlay">
          <span class="promo-badge purple">MATRIZ 24 HORAS</span>
          <h3 class="promo-title">Posto Marcos Zagury — Aberto 24 Horas</h3>
          <p class="promo-desc">Av. Marcos Zagury, 455, Parintins - AM. Conveniência, troca de óleo e ducha.</p>
          <div class="promo-action-row">
            <span>Como chegar e tabela de preços</span>
            ${icon('arrow')}
          </div>
        </div>
      </article>
    </div>
  `;
}

// Bottom App Navigation Bar
function renderBottomNav() {
  const items = [
    { id: 'Início', icon: 'home', label: 'Início' },
    { id: 'Prêmios', icon: 'gift', label: 'Prêmios' },
    { id: 'Abastecer', icon: 'fuel', label: 'Abastecer', center: true },
    { id: 'Unidades', icon: 'pin', label: 'Unidades' },
    { id: 'Perfil', icon: 'user', label: 'Perfil' }
  ];

  return `
    <nav class="app-nav">
      ${items.map(item => {
        if (item.center) {
          return `
            <button class="nav-center-btn" onclick="openAbastecerModal()" aria-label="Abastecer Agora">
              ${icon('fuel')}
            </button>
          `;
        }
        const isActive = currentPage === item.id;
        return `
          <button class="nav-item ${isActive ? 'active' : ''}" onclick="go('${item.id}')">
            ${icon(item.icon)}
            <span>${item.label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;
}

// ========================================================
// PAGE RENDERS
// ========================================================

// 1. INÍCIO
function renderHome() {
  return `
    ${renderHeader()}
    ${renderQuickNav()}
    <div class="section-header" style="margin-top:8px">
      <h2>Meu Cartão Digital</h2>
      <button class="see-all" onclick="openAbastecerModal()">Exibir QR Code ${icon('qr')}</button>
    </div>
    ${renderVirtualCard()}

    <!-- Banner Convidar Amigos (Indicações) -->
    <div class="customer-invite-card" onclick="openInviteFriendsModal()" aria-label="Convidar Amigos para o Clube">
      <div style="flex:1">
        <span class="customer-invite-badge">Indique e Acompanhe</span>
        <div class="customer-invite-title">Convide seus Amigos 🤝</div>
        <div class="customer-invite-sub">Compartilhe seu link exclusivo e traga seus amigos para economizar no Grupo Oliveira!</div>
      </div>
      <div style="font-size:20px;color:rgba(255,255,255,0.85);font-weight:bold">➔</div>
    </div>

    ${renderPromoCards()}
    
    <!-- Instagram official banner -->
    <div style="padding: 18px 16px 0;">
      <div class="instagram-card" onclick="openInstagram()">
        <div>
          <h3>Siga @grupooliveirapin</h3>
          <p>Fique por dentro de promoções, horários e novidades no Instagram!</p>
        </div>
        ${icon('arrow')}
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="section-header">
      <h2>Últimos Abastecimentos</h2>
      <button class="see-all" onclick="go('Histórico')">Ver todos ${icon('arrow')}</button>
    </div>
    <div style="padding: 0 16px;">
      ${renderRecentFills()}
    </div>
  `;
}

function renderFuelCard(f) {
  const stationName = f.station || 'Posto Marcos Zagury (Matriz)';
  const dateFormatted = f.date ? f.date.split('-').reverse().join('/') : 'Hoje';
  const timeFormatted = f.time ? ` às ${f.time}` : '';
  const fuelName = f.fuel || 'Gasolina Comum';
  const amount = Number(f.amount) || 0;
  const price = Number(f.pricePerLiter) || (f.fuel === 'Diesel S10' ? 6.89 : (f.fuel === 'Gasolina Aditivada' ? 6.79 : 6.59));
  const liters = Number(f.liters || (price > 0 ? (amount / price) : 0)).toFixed(2);
  const cashbackUsed = Number(f.cashbackUsed) || 0;
  const netPaid = Number(f.netPaid !== undefined ? f.netPaid : (amount - cashbackUsed));
  const cashbackEarned = Number(f.cashbackEarned !== undefined ? f.cashbackEarned : Math.round(netPaid * 0.03 * 100) / 100);
  const pointsEarned = Number(f.pointsEarned !== undefined ? f.pointsEarned : Math.floor(netPaid));
  const status = f.status || 'Concluído';
  const txCode = f.id || ('GO-' + Math.floor(100000 + Math.random() * 900000));
  const city = f.city || 'Parintins - AM';

  return `
    <article class="fuel-history-card">
      <div class="fuel-card-top">
        <div>
          <div class="fuel-station-name">${esc(stationName)}</div>
          <div class="fuel-station-date">${dateFormatted}${timeFormatted} • ${esc(city)}</div>
        </div>
        <span class="badge-status-concluido">
          ${icon('check')} ${esc(status)}
        </span>
      </div>

      <div class="fuel-card-body">
        <div class="fuel-meta-item">
          <small>Combustível</small>
          <b>${esc(fuelName)}</b>
          <span style="font-size:11px;color:var(--text-muted)">(${liters} L)</span>
        </div>
        <div class="fuel-meta-item">
          <small>Valor Abastecido</small>
          <b style="color:#0f172a">${money(amount)}</b>
        </div>
        <div class="fuel-meta-item">
          <small>Cashback Utilizado</small>
          <b style="color:${cashbackUsed > 0 ? 'var(--red)' : '#64748b'}">
            ${cashbackUsed > 0 ? '- ' + money(cashbackUsed) : 'R$ 0,00'}
          </b>
        </div>
        <div class="fuel-meta-item">
          <small>Valor Pago</small>
          <b>${money(netPaid)}</b>
        </div>
      </div>

      <div class="fuel-card-footer">
        <div style="display:flex;align-items:center;gap:12px">
          <div>
            <span style="font-size:10px;color:var(--text-muted);display:block;font-weight:700">CASHBACK GANHO</span>
            <span style="color:#16a34a;font-weight:800;font-size:13px">+ ${money(cashbackEarned)}</span>
          </div>
          <div style="border-left:1px solid #e2e8f0;padding-left:12px">
            <span style="font-size:10px;color:var(--text-muted);display:block;font-weight:700">PONTOS</span>
            <span style="color:var(--blue);font-weight:800;font-size:13px">+ ${pointsEarned} pts</span>
          </div>
        </div>
        <div style="text-align:right">
          <span style="font-size:10px;color:var(--text-muted);display:block">CÓDIGO PDV</span>
          <code style="font-size:11px;font-weight:700;color:var(--primary)">${txCode}</code>
        </div>
      </div>
    </article>
  `;
}

function renderRecentFills() {
  if (!state.fills || !state.fills.length) {
    return `
      <div class="empty-box">
        ${icon('fuel')}
        <p>Você ainda não registrou nenhum abastecimento.<br>Clique em <b>Abastecer</b> para gerar seu QR Code e ganhar 3% de cashback!</p>
      </div>
    `;
  }

  return `
    <div class="recent-fills-list">
      ${[...state.fills].slice(0, 3).map(f => renderFuelCard(f)).join('')}
    </div>
  `;
}

// 2. UNIDADES / ONDE ESTAMOS
function renderUnidades() {
  return `
    ${renderHeader()}
    <div class="subpage-container">
      <div class="subpage-head">
        <h1>Nossas Unidades</h1>
        <span style="font-size:12px;color:var(--primary);font-weight:700">4 Postos Ativos</span>
      </div>
      <p style="padding: 0 16px 16px; color: var(--text-muted); font-size:13px;">
        Abasteça com total confiança e acumule pontos e cashback em toda a rede Grupo Oliveira no Baixo Amazonas.
      </p>

      ${stations.map(st => `
        <article class="station-card">
          <div class="station-img-banner">
            <img src="${st.image}" alt="${esc(st.name)}">
            <span class="station-status-pill">${esc(st.hours)}</span>
          </div>
          <div class="station-info">
            <div class="station-city">${esc(st.city)}</div>
            <h3 class="station-name">${esc(st.name)}</h3>
            <div class="station-address">
              ${icon('pin')}
              <span>${esc(st.address)}</span>
            </div>

            <!-- Preços dos combustíveis -->
            <div style="margin-bottom:12px">
              <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Preços do dia:</span>
              <div class="fuel-tags" style="margin-top:6px">
                ${st.fuels.map(f => `
                  <div class="fuel-tag">
                    <b>${f.name}:</b> R$ ${f.price.toFixed(2).replace('.', ',')}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Serviços disponíveis -->
            <div style="margin-bottom:16px">
              <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Serviços:</span>
              <div class="fuel-tags" style="margin-top:6px">
                ${st.services.map(s => `<span class="fuel-tag" style="background:#f8fafc">✓ ${s}</span>`).join('')}
              </div>
            </div>

            <div class="station-actions">
              <a href="${st.mapsUrl}" target="_blank" class="btn btn-outline" style="text-decoration:none">
                ${icon('pin')} Como Chegar
              </a>
              <button class="btn btn-primary" onclick="openAbastecerModal('${st.name}')">
                ${icon('fuel')} Abastecer Aqui
              </button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

// 3. PRÊMIOS / CLUBE
function renderPremios() {
  return `
    ${renderHeader()}
    <div class="subpage-container">
      <div class="subpage-head">
        <h1>Clube & Prêmios</h1>
        <div style="font-weight:800;color:var(--primary);font-size:15px">${state.points} pts disponíveis</div>
      </div>

      <div class="tab-row">
        <button class="tab-btn ${prizeTab === 'Disponíveis' ? 'active' : ''}" onclick="prizeTab='Disponíveis';render()">
          Vantagens do Clube
        </button>
        <button class="tab-btn ${prizeTab === 'Meus Resgates' ? 'active' : ''}" onclick="prizeTab='Meus Resgates';render()">
          Meus Resgates (${state.redemptions.length})
        </button>
      </div>

      ${prizeTab === 'Disponíveis' ? `
        <div class="rewards-list">
          ${rewards.map((r, i) => `
            <div class="reward-card">
              <div class="reward-thumb">
                <img src="${r.img}" alt="${esc(r.title)}">
              </div>
              <div class="reward-content">
                <div>
                  <span style="font-size:10px;text-transform:uppercase;font-weight:700;color:var(--blue)">${esc(r.cat)}</span>
                  <div class="reward-title">${esc(r.title)}</div>
                  <p style="font-size:11px;color:var(--text-muted);margin-top:4px">${esc(r.desc)}</p>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
                  <div class="reward-cost">${r.cost.toLocaleString('pt-BR')} pts</div>
                  <button class="btn btn-primary" style="padding:6px 14px;font-size:11px;width:auto" 
                    onclick="redeemReward(${i})" ${state.points < r.cost ? 'disabled' : ''}>
                    ${state.points < r.cost ? 'Pontos Insuficientes' : 'Resgatar'}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="redemptions-list">
          ${state.redemptions.length ? state.redemptions.map(r => `
            <div style="background:white;border-radius:var(--radius-lg);padding:18px;margin-bottom:12px;border:1px solid var(--border)">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <b>${esc(r.title)}</b>
                <span style="color:var(--red);font-weight:700">-${r.cost} pts</span>
              </div>
              <div style="margin:12px 0;background:#f8fafc;padding:12px;border-radius:var(--radius-sm);text-align:center;border:1px dashed var(--primary)">
                <span style="font-size:10px;color:var(--text-muted);display:block">CÓDIGO DE RESGATE:</span>
                <strong style="font-size:18px;letter-spacing:2px;color:var(--primary);font-family:monospace">${esc(r.code)}</strong>
              </div>
              <small style="color:var(--text-muted)">Apresente este código no caixa do Posto Grupo Oliveira para liberar o benefício.</small>
            </div>
          `).join('') : `
            <div class="empty-box">
              ${icon('gift')}
              <p>Você ainda não realizou resgates.<br>Escolha uma das vantagens acima para utilizar seus pontos!</p>
            </div>
          `}
        </div>
      `}
    </div>
  `;
}

// 4. PROMOÇÕES
function renderPromocoes() {
  return `
    ${renderHeader()}
    <div class="subpage-container">
      <div class="subpage-head">
        <h1>Todas as Campanhas</h1>
      </div>
      <p style="padding: 0 16px 16px; color: var(--text-muted); font-size:13px;">
        Mídias e campanhas oficiais dos Postos Grupo Oliveira.
      </p>
      ${renderPromoCards()}
    </div>
  `;
}

// 5. HISTÓRICO COMPLETO
function renderHistorico() {
  const allFills = [...(state.fills || [])];
  return `
    ${renderHeader()}
    <div class="subpage-container">
      <div class="subpage-head">
        <div>
          <h1>Histórico de Abastecimentos</h1>
          <p style="font-size:12px;color:var(--text-muted);margin-top:2px">
            Registro oficial de compras e benefícios nos postos Grupo Oliveira
          </p>
        </div>
        <button class="btn btn-outline" style="width:auto;padding:8px 14px;font-size:11px" onclick="exportCSV()">
          ${icon('download')} Exportar CSV
        </button>
      </div>

      <div style="padding:0 16px 24px">
        ${!allFills.length ? `
          <div class="empty-box">
            ${icon('fuel')}
            <p>Nenhum abastecimento registrado ainda.<br>Apresente seu QR Code ao frentista para pontuar e acumular cashback!</p>
            <button class="btn btn-primary" style="margin-top:14px;width:auto;padding:10px 20px" onclick="openAbastecerModal()">
              ${icon('fuel')} Abastecer Agora
            </button>
          </div>
        ` : allFills.map(f => renderFuelCard(f)).join('')}
      </div>
    </div>
  `;
}

// 6. PERFIL
function renderPerfil() {
  return `
    ${renderHeader()}
    <div class="subpage-container">
      <div class="subpage-head">
        <h1>Meu Espaço Pessoal</h1>
      </div>

      <!-- User Card -->
      <div style="background:white; border-radius:var(--radius-lg); padding:20px; border:1px solid var(--border); display:flex; align-items:center; gap:16px; margin-bottom:18px;">
        <div style="position:relative;flex-shrink:0;">
          <img src="${state.avatarUrl || 'assets/img/brand/icon-192.png'}" alt="Perfil Oficial Grupo Oliveira" style="width:64px;height:64px;border-radius:18px;object-fit:contain;box-shadow:0 8px 20px rgba(86,47,130,0.28);border:2px solid rgba(86,47,130,0.2);background:#1C0B2F;">
          <span style="position:absolute;bottom:-2px;right:-2px;background:#22c55e;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);" title="Membro VIP Ativo"></span>
        </div>
        <div>
          <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:#0f172a">${esc(state.name || 'Cliente')}</h2>
          <span style="font-size:12px;color:var(--primary);font-weight:700">${(Number(state.points) >= 1500) ? 'Membro VIP' : ((Number(state.points) >= 500) ? 'Membro Prata' : 'Membro Clube')} • Grupo Oliveira</span>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${(state.vehicle || state.plate) ? `Veículo: ${esc(state.vehicle || 'Padrão')} (${esc(state.plate || '---')})` : 'Veículo não cadastrado'}</div>
        </div>
      </div>

      <!-- Menu options -->
      <div class="profile-menu">
        <button class="profile-menu-item" onclick="openEditProfile()">
          ${icon('user')}
          <span>Editar Meus Dados</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="openVehiclesModal()">
          ${icon('car')}
          <span>Meus Veículos Cadastrados (${state.vehicles.length})</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="openInviteFriendsModal()">
          ${icon('star')}
          <span>Convide seus Amigos (Indicações)</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="openAbastecerModal()">
          ${icon('qr')}
          <span>Meu Cartão Digital & QR Code</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="go('Unidades')">
          ${icon('pin')}
          <span>Rede de Postos & Localização</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="openInstagram()">
          ${icon('instagram')}
          <span>Instagram Oficial @grupooliveirapin</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="openAboutModal()">
          ${icon('bolt')}
          <span>Sobre o Grupo Oliveira</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
        <button class="profile-menu-item" onclick="handleLogout()" style="color:#dc2626;margin-top:6px">
          ${icon('user')}
          <span style="font-weight:700">Sair da Conta (Logout)</span>
          <span class="arrow-icon">${icon('arrow')}</span>
        </button>
      </div>

      <div style="text-align:center;padding:15px;color:var(--text-muted);font-size:11px;line-height:1.6">
        Grupo Oliveira • Versão Demonstração Oficial<br>
        Parintins, Barreirinha, Nhamundá e Terra Santa<br>
        Identidade Visual & Plataforma Digital 2026
      </div>
    </div>
  `;
}

// 7. NOTIFICAÇÕES (TELA CHEIA)
function markAllNotificationsRead() {
  if (state.notifications) {
    state.notifications.forEach(n => n.read = true);
    saveState();
    render();
    toast('Todas as notificações foram marcadas como lidas.');
  }
}

function handleNotifClick(id, actionStr) {
  if (state.notifications) {
    const n = state.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      saveState();
    }
  }
  if (actionStr) {
    try {
      new Function(actionStr)();
    } catch (e) {
      eval(actionStr);
    }
  } else {
    render();
  }
}

function renderNotificacoes() {
  const allNotifs = state.notifications || [];
  const unreadCount = allNotifs.filter(n => !n.read).length;

  let filtered = allNotifs;
  if (notifFilter === 'Não lidas') {
    filtered = allNotifs.filter(n => !n.read);
  } else if (notifFilter !== 'Todas') {
    filtered = allNotifs.filter(n => n.cat === notifFilter);
  }

  const filterCategories = ['Todas', 'Não lidas', 'Boas-vindas', 'Cashback', 'Unidades', 'Prêmios', 'Sorteios'];

  return `
    ${renderHeader()}
    <div class="subpage-container" style="padding-top:14px">
      <!-- Filter Chips -->
      <div class="notif-filter-bar">
        ${filterCategories.map(cat => {
          let count = 0;
          if (cat === 'Todas') count = allNotifs.length;
          else if (cat === 'Não lidas') count = unreadCount;
          else count = allNotifs.filter(n => n.cat === cat).length;

          if (cat !== 'Todas' && cat !== 'Não lidas' && count === 0) return '';

          const isActive = notifFilter === cat;
          return `
            <button class="notif-filter-chip ${isActive ? 'active' : ''}" onclick="notifFilter='${cat}';render()">
              <span>${cat}</span>
              ${count > 0 ? `<small style="opacity:0.85">(${count})</small>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Actions Bar -->
      <div class="notif-actions-bar">
        <span class="notif-unread-count">
          ${unreadCount > 0 ? `✨ <b>${unreadCount}</b> nova(s) notificação(ões)` : 'Todas as notificações em dia'}
        </span>
        ${unreadCount > 0 ? `
          <button class="notif-clear-btn" onclick="markAllNotificationsRead()">
            ${icon('check')} Marcar todas como lidas
          </button>
        ` : ''}
      </div>

      <!-- Notifications List -->
      <div class="notif-list">
        ${filtered.length ? filtered.map(n => `
          <article class="notif-card ${n.read ? '' : 'unread'}" onclick="handleNotifClick(${n.id}, '${n.action || ''}')">
            <div class="notif-icon-box ${n.color || 'purple'}">
              ${icon(n.icon || 'bell')}
            </div>
            <div class="notif-details">
              <div class="notif-meta">
                <span class="notif-tag">${esc(n.cat)}</span>
                <span style="font-size:10px;color:#cbd5e1">•</span>
                <span class="notif-time">${esc(n.time)}</span>
              </div>
              <h3 class="notif-title">${esc(n.title)}</h3>
              <p class="notif-desc">${esc(n.desc)}</p>
              ${n.btnText ? `
                <div class="notif-footer-action">
                  <span class="notif-cta-btn">
                    ${esc(n.btnText)} ${icon('arrow')}
                  </span>
                </div>
              ` : ''}
            </div>
          </article>
        `).join('') : `
          <div class="empty-box">
            ${icon('bell')}
            <p>Nenhuma notificação encontrada no filtro <b>${esc(notifFilter)}</b>.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// ========================================================
// CONTROLE DE ACESSO HIERÁRQUICO & PERFIS DE USUÁRIO
// Hierarquia: owner (proprietário), attendant (frentista), customer (cliente)
// ========================================================

function getRoleBadgeLabel(role) {
  switch (role) {
    case 'attendant':
      return 'Frentista';
    case 'owner':
      return 'Proprietário';
    default:
      return 'Cliente';
  }
}

function renderRoleSwitcherBanner() {
  return '';
}

async function handleLogout() {
  try {
    if (typeof supabase !== 'undefined' && window._supabaseClient) {
      await window._supabaseClient.auth.signOut();
    }
  } catch (e) {
    console.warn('[Supabase Auth] Aviso ao sair:', e.message);
  }
  if (state) {
    state.authSession = null;
    saveState();
  }
  localStorage.removeItem('go_current_role');
  toast('Você encerrou a sessão com sucesso.');
  setTimeout(() => {
    window.location.href = '/login';
  }, 300);
}

function switchRole(newRole) {
  // SEGURANÇA DOS PERFIS (Requisito 5): cliente não pode elevar perfil para proprietário ou frentista
  if (state.authSession && state.authSession.role === 'customer' && newRole !== 'customer') {
    toast('🔒 Acesso Restrito: Seu perfil de cliente não tem permissão para acessar painéis administrativos.');
    closeModal();
    return;
  }

  state.currentRole = newRole;
  if (state.authSession) {
    state.authSession.role = newRole;
  }
  localStorage.setItem('go_current_role', newRole);
  saveState();
  closeModal();
  render();
  toast(`Ambiente alternado para: ${getRoleBadgeLabel(newRole)}`);
}

function openRoleSwitcherModal() {
  const current = state.currentRole || 'customer';

  openModal(`
    <div class="role-modal-container" style="padding:0">
      <div style="text-align:center;margin-bottom:12px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:#f5f3ff;color:var(--primary);margin-bottom:6px">
          ${icon('user')}
        </div>
        <h2 style="font-family:var(--font-heading);font-size:16px;font-weight:800;color:var(--primary);margin:0;letter-spacing:-0.3px">
          Perfis de Acesso
        </h2>
        <p style="font-size:11px;color:var(--text-muted);margin:2px 0 0">
          Selecione o perfil para acessar o sistema
        </p>
      </div>

      <div class="role-cards-list" style="display:flex;flex-direction:column;gap:8px">
        <!-- Perfil Frentista -->
        <div onclick="switchRole('attendant')" class="role-card-item" style="background:${current === 'attendant' ? '#f0fdf4' : '#ffffff'};border:1.5px solid ${current === 'attendant' ? '#16a34a' : 'var(--border)'};border-radius:12px;padding:9px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all 0.2s">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
            <div style="width:34px;height:34px;border-radius:8px;background:#dcfce7;color:#15803d;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">
              ⛽
            </div>
            <div style="min-width:0;flex:1">
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
                <b style="font-size:13px;color:#0f172a;line-height:1.2">Frentista / Pista</b>
                ${current === 'attendant' ? '<span style="background:#16a34a;color:white;font-size:9px;padding:1px 5px;border-radius:999px;font-weight:700">Ativo</span>' : ''}
              </div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${state.attendantUser ? state.attendantUser.name : 'Operador de Pista'} • Posto Marcos Zagury (Matriz)
              </div>
            </div>
          </div>
          <button class="role-btn-badge ${current === 'attendant' ? 'role-badge-active-attendant' : 'role-badge-outline'}" style="pointer-events:none;flex-shrink:0">
            ${current === 'attendant' ? '✓ Em uso' : 'Acessar'}
          </button>
        </div>

        <!-- Perfil Cliente -->
        <div onclick="switchRole('customer')" class="role-card-item" style="background:${current === 'customer' ? '#eff6ff' : '#ffffff'};border:1.5px solid ${current === 'customer' ? '#0082ca' : 'var(--border)'};border-radius:12px;padding:9px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all 0.2s">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
            <div style="width:34px;height:34px;border-radius:8px;background:#e0f2fe;color:#0284c7;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">
              👤
            </div>
            <div style="min-width:0;flex:1">
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
                <b style="font-size:13px;color:#0f172a;line-height:1.2">Cliente do Clube</b>
                ${current === 'customer' ? '<span style="background:#0082ca;color:white;font-size:9px;padding:1px 5px;border-radius:999px;font-weight:700">Ativo</span>' : ''}
              </div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${esc(state.name || 'Cliente')} • Cartão ${(state.cardNumber || '4589 •••• 1204').replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4')}
              </div>
            </div>
          </div>
          <button class="role-btn-badge ${current === 'customer' ? 'role-badge-active-customer' : 'role-badge-outline'}" style="pointer-events:none;flex-shrink:0">
            ${current === 'customer' ? '✓ Em uso' : 'Acessar'}
          </button>
        </div>

        <!-- Perfil Proprietário -->
        <div onclick="switchRole('owner')" class="role-card-item" style="background:${current === 'owner' ? '#fffbeb' : '#ffffff'};border:1.5px solid ${current === 'owner' ? '#f59e0b' : 'var(--border)'};border-radius:12px;padding:9px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all 0.2s">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
            <div style="width:34px;height:34px;border-radius:8px;background:#fef3c7;color:#b45309;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">
              🏢
            </div>
            <div style="min-width:0;flex:1">
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
                <b style="font-size:13px;color:#0f172a;line-height:1.2">Proprietário / Rede</b>
                ${current === 'owner' ? '<span style="background:#f59e0b;color:white;font-size:9px;padding:1px 5px;border-radius:999px;font-weight:700">Ativo</span>' : ''}
              </div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                Rede Grupo Oliveira • Visão executiva de 6 postos
              </div>
            </div>
          </div>
          <button class="role-btn-badge ${current === 'owner' ? 'role-badge-active-owner' : 'role-badge-outline'}" style="pointer-events:none;flex-shrink:0">
            ${current === 'owner' ? '✓ Em uso' : 'Acessar'}
          </button>
        </div>
      </div>

      <div style="margin-top:14px;display:flex;gap:8px">
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Fechar</button>
        <button class="btn btn-outline" style="flex:1;color:#dc2626;border-color:#fca5a5" onclick="handleLogout()">
          🚪 Sair da Conta
        </button>
      </div>
    </div>
  `);
}

function editAttendantName() {
  const currentName = state.attendantUser ? state.attendantUser.name : 'Operador de Pista';
  const newName = prompt('Informe o nome do operador / frentista:', currentName);
  if (newName && newName.trim()) {
    if (!state.attendantUser) state.attendantUser = {};
    state.attendantUser.name = newName.trim();
    state.attendantUser.avatar = newName.trim().split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
    saveState();
    render();
    toast(`Operador atualizado para: ${state.attendantUser.name}`);
  }
}

function renderAttendantDashboard() {
  const attendant = state.attendantUser || {
    name: 'Operador de Pista',
    registration: '01',
    stationName: 'Posto Marcos Zagury (Matriz)',
    stationCity: 'Parintins - AM',
    avatar: 'OP'
  };

  const stats = state.attendantDailyStats || {
    fillsCount: 0,
    totalAmount: 0.00,
    totalCashback: 0.00
  };

  const fills = state.attendantFills || [];

  return `
    <div class="attendant-dashboard">
      <!-- 1. Cabeçalho do Frentista -->
      <header class="attendant-header">
        <div class="attendant-top-row">
          <img src="assets/img/brand/clean_logo_white.png" class="attendant-brand-logo" alt="Grupo Oliveira">
          <button class="attendant-exit-btn" onclick="handleLogout()" aria-label="Sair da Conta" style="background:rgba(220,38,38,0.18);border:1px solid rgba(220,38,38,0.35);color:#ef4444">
            <span>🚪 Sair da conta</span>
          </button>
        </div>

        <div class="attendant-profile-info">
          <div class="attendant-avatar">${esc(attendant.avatar || 'OP')}</div>
          <div>
            <h1 class="attendant-name" style="display:flex;align-items:center;gap:8px">
              ${esc(attendant.name)}
              <button onclick="editAttendantName()" style="background:rgba(255,255,255,0.18);border:none;color:#fff;border-radius:6px;padding:2px 7px;font-size:10px;cursor:pointer;font-weight:700" title="Alterar nome do operador">✏️ Alterar</button>
            </h1>
            <div class="attendant-station">
              ${icon('pin')}
              <span>${esc(attendant.stationName)} • Matrícula #${esc(attendant.registration || '01')}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. Resumo do Dia -->
      <section class="attendant-summary-grid" aria-label="Resumo do Dia">
        <div class="attendant-stat-card">
          <div class="attendant-stat-icon blue">⛽</div>
          <div class="attendant-stat-val">${stats.fillsCount}</div>
          <div class="attendant-stat-label">Abastecimentos</div>
        </div>
        <div class="attendant-stat-card">
          <div class="attendant-stat-icon green">💵</div>
          <div class="attendant-stat-val">${money(stats.totalAmount)}</div>
          <div class="attendant-stat-label">Valor Total</div>
        </div>
        <div class="attendant-stat-card">
          <div class="attendant-stat-icon purple">✨</div>
          <div class="attendant-stat-val">${money(stats.totalCashback)}</div>
          <div class="attendant-stat-label">Cashback Distr.</div>
        </div>
      </section>

      <!-- 3. Ação Principal — Botão Grande e Destacado -->
      <section class="attendant-main-action">
        <button class="btn-scan-qr" onclick="openQRScannerModal()" aria-label="Escanear QR Code do Cliente">
          <div class="scan-icon-circle">
            ${icon('qr')}
          </div>
          <div class="scan-btn-title">ESCANEAR QR CODE DO CLIENTE</div>
          <div class="scan-btn-sub">Câmera ativa para validar fidelidade e abastecimento</div>
        </button>
      </section>

      <!-- 3.1 Convidar Cliente — QR Code Exclusivo do Posto -->
      <div class="attendant-invite-card" onclick="openFrentistaInviteModal()" aria-label="Convidar Cliente com QR Code Oficial do Posto">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="attendant-invite-icon">📲</div>
          <div class="attendant-invite-text">
            <h3>CONVIDAR CLIENTE • QR CODE DO POSTO</h3>
            <p>Divulgue o QR Code oficial da sua unidade para novos clientes se cadastrarem</p>
          </div>
        </div>
        <div style="font-size:20px;font-weight:bold">➔</div>
      </div>

      <!-- 4. Histórico Recente do Frentista -->
      <section class="attendant-history-section">
        <div class="attendant-history-head">
          <h2>Últimos Abastecimentos Registrados</h2>
          <span style="font-size:11px;color:var(--text-muted);font-weight:600">Hoje (${fills.length})</span>
        </div>

        <div class="attendant-history-list">
          ${fills.length === 0 ? `
            <div style="background:white;border:1px dashed var(--border);border-radius:14px;padding:24px;text-align:center;color:var(--text-muted)">
              <div style="font-size:24px;margin-bottom:6px">⛽</div>
              <p style="font-size:13px;margin:0">Nenhum abastecimento registrado hoje ainda.</p>
            </div>
          ` : fills.map(f => `
            <div class="attendant-fill-card">
              <div class="attendant-fill-top">
                <b style="font-size:14px;color:#0f172a">${esc(f.customerName)}</b>
                <span class="status-badge-mini ${f.status === 'Concluído' ? 'status-green' : 'status-yellow'}">${esc(f.status || 'Concluído')}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:4px">
                <span>${esc(f.fuel)} • ${Number(f.liters || 0).toFixed(2)} L</span>
                <span style="font-weight:700;color:#0f172a">${money(f.amount)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:11px;border-top:1px dashed #f1f5f9;padding-top:4px">
                <span style="color:#15803d;font-weight:600">✨ Cashback: + ${money(f.cashbackEarned)}</span>
                <span style="color:var(--text-muted)">🕒 ${esc(f.time)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

// ========================================================
// PAINEL EXECUTIVO DO PROPRIETÁRIO — DADOS, GRÁFICOS & FILTROS
// ========================================================

state.ownerFilterStation = state.ownerFilterStation || 'all';
state.ownerFilterPeriod = state.ownerFilterPeriod || 'today';

function setOwnerStationFilter(stationId) {
  state.ownerFilterStation = stationId;
  saveState();
  render();
}

function setOwnerStationFilter(stationId) {
  state.ownerFilterStation = stationId;
  saveState();
  if (window._supabaseClient) {
    loadOwnerDataFromSupabase(stationId, state.ownerFilterPeriod || 'today');
  } else {
    render();
  }
}

function setOwnerPeriodFilter(period) {
  state.ownerFilterPeriod = period;
  saveState();
  if (window._supabaseClient) {
    loadOwnerDataFromSupabase(state.ownerFilterStation || 'all', period);
  } else {
    render();
  }
}

// Cálculo Real de Métricas da Rede com base nos Registros do Supabase (Fases 2 e 5)
function getNetworkAnalytics(filterStation, filterPeriod) {
  const periodConfigs = {
    today: { factor: 1.0, label: 'Hoje', sub: 'consolidado', diff: 'Tempo Real' },
    '7days': { factor: 1.0, label: 'Últimos 7 dias', sub: 'acumulado', diff: '7 dias' },
    '30days': { factor: 1.0, label: 'Últimos 30 dias', sub: 'acumulado', diff: '30 dias' },
    month: { factor: 1.0, label: 'Mês Atual', sub: 'acumulado mensal', diff: 'Mês' }
  };

  const periodCfg = periodConfigs[filterPeriod] || periodConfigs.today;

  if (state.ownerLiveMetrics) {
    const m = state.ownerLiveMetrics;

    const stationsData = (m.postos_breakdown || []).map(st => {
      const rev = Number(st.faturamento || 0);
      const fills = Number(st.total_abastecimentos || 0);
      const cbUsed = Number(st.cashback_utilizado || 0);
      const share = m.faturamento_total > 0 ? Math.round((rev / m.faturamento_total) * 100) : 0;

      // Buscar posto correspondente no array local para fotos e dados de endereço
      const localSt = stations.find(s => s.name === st.nome || s.id === st.id) || {};

      return {
        id: localSt.id || st.id,
        dbId: st.id,
        name: st.nome,
        city: st.cidade + ' - ' + st.uf,
        address: localSt.address || (st.cidade + ' - ' + st.uf),
        revenue: rev,
        fills: fills,
        clients: fills,
        cashbackUsed: cbUsed,
        share: share,
        fuelsBreakdown: localSt.fuels ? localSt.fuels.map(f => ({ name: f.name, price: f.price, liters: 0 })) : []
      };
    });

    const chart7Days = (m.historico_7dias || []).map(d => ({
      day: d.dia_label,
      fills: Number(d.abastecimentos || 0),
      revenue: Number(d.faturamento || 0)
    }));

    const chartCashback = (m.historico_7dias || []).map(d => ({
      day: d.dia_label,
      generated: Math.round(Number(d.faturamento || 0) * 0.03 * 100) / 100,
      used: Math.round(Number(d.faturamento || 0) * 0.01 * 100) / 100
    }));

    const recentFills = (m.abastecimentos_recentes || []).map(tx => ({
      customer: tx.cliente_nome,
      station: tx.posto_nome,
      stationId: tx.posto_id,
      fuel: tx.tipo_combustivel,
      liters: Number(tx.litros),
      amount: Number(tx.valor_total_bruto),
      cashback: Number(tx.cashback_creditado),
      time: tx.created_at ? new Date(tx.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hoje',
      status: tx.status === 'CONCLUIDO' ? 'Concluído' : tx.status
    }));

    return {
      periodCfg,
      totalRevenue: Number(m.faturamento_total || 0),
      totalFills: Number(m.quantidade_abastecimentos || 0),
      activeClients: Number(m.clientes_ativos || 0),
      clientsRegistered: Number(m.clientes_ativos || 0),
      totalCashback: Number(m.cashback_emitido || 0),
      cashbackUsed: Number(m.cashback_utilizado || 0),
      cashbackInCirculation: Number(m.saldo_total_carteiras || 0),
      stationsData: stationsData.length ? stationsData : stations.map(s => ({ ...s, revenue: 0, fills: 0, share: 0 })),
      chart7Days,
      chartCashback,
      recentFills
    };
  }

  // Estado padrão dinâmico enquanto sincroniza com o servidor ou se offline
  if (!window._fetchingOwnerData) {
    window._fetchingOwnerData = true;
    setTimeout(() => {
      if (typeof loadOwnerDataFromServer === 'function') {
        loadOwnerDataFromServer().finally(() => { window._fetchingOwnerData = false; });
      }
    }, 50);
  }

  // Baseline robusta para apresentação executiva dos 6 postos
  const defaultStations = [
    { id: 'matriz-parintins', revenue: 4250.00, fills: 52, cashbackUsed: 45.00, share: 24 },
    { id: 'posto-barreirinha', revenue: 2450.00, fills: 31, cashbackUsed: 20.00, share: 14 },
    { id: 'posto-nhamunda', revenue: 2180.00, fills: 28, cashbackUsed: 15.00, share: 13 },
    { id: 'posto-terrasanta', revenue: 2890.00, fills: 36, cashbackUsed: 30.00, share: 17 },
    { id: 'posto-fluvial', revenue: 3650.00, fills: 22, cashbackUsed: 35.00, share: 21 },
    { id: 'posto-express', revenue: 1980.00, fills: 38, cashbackUsed: 19.00, share: 11 }
  ];

  let filteredStations = stations.map(st => {
    const ds = defaultStations.find(d => d.id === st.id) || { revenue: 2000, fills: 25, cashbackUsed: 20, share: 16 };
    return {
      id: st.id,
      name: st.name,
      city: st.city,
      address: st.address,
      revenue: ds.revenue,
      fills: ds.fills,
      clients: ds.fills,
      cashbackUsed: ds.cashbackUsed,
      share: ds.share,
      fuelsBreakdown: (st.fuels || []).map(f => ({ name: f.name, price: f.price, liters: Math.round(ds.revenue / (f.price || 6.5)) }))
    };
  });

  let totRev = filteredStations.reduce((s, x) => s + x.revenue, 0);
  let totFills = filteredStations.reduce((s, x) => s + x.fills, 0);
  let totCbUsed = filteredStations.reduce((s, x) => s + x.cashbackUsed, 0);
  let totCbEmitted = Math.round(totRev * 0.03 * 100) / 100;

  if (filterStation !== 'all') {
    const single = filteredStations.find(s => s.id === filterStation);
    if (single) {
      totRev = single.revenue;
      totFills = single.fills;
      totCbUsed = single.cashbackUsed;
      totCbEmitted = Math.round(totRev * 0.03 * 100) / 100;
    }
  }

  const baseline7Days = [
    { day: 'Seg', fills: 185, revenue: 15400 },
    { day: 'Ter', fills: 198, revenue: 16800 },
    { day: 'Qua', fills: 210, revenue: 17200 },
    { day: 'Qui', fills: 190, revenue: 16100 },
    { day: 'Sex', fills: 245, revenue: 21300 },
    { day: 'Sáb', fills: 260, revenue: 22900 },
    { day: 'Hoje', fills: totFills, revenue: totRev }
  ];

  const baselineCashback = baseline7Days.map(d => ({
    day: d.day,
    generated: Math.round(d.revenue * 0.03 * 100) / 100,
    used: Math.round(d.revenue * 0.01 * 100) / 100
  }));

  const baselineRecent = [
    { customer: 'Kaynã Viana', station: 'Posto Marcos Zagury (Matriz)', stationId: 'matriz-parintins', fuel: 'Gasolina Aditivada', liters: 14.73, amount: 100.00, cashback: 3.00, time: '14:20', status: 'Concluído' },
    { customer: 'Marcos Vinicius', station: 'Posto Marcos Zagury (Matriz)', stationId: 'matriz-parintins', fuel: 'Gasolina Comum', liters: 22.76, amount: 150.00, cashback: 4.50, time: '13:55', status: 'Concluído' },
    { customer: 'Renata Albuquerque', station: 'Posto Grupo Oliveira Barreirinha', stationId: 'posto-barreirinha', fuel: 'Diesel S10', liters: 43.16, amount: 300.00, cashback: 9.00, time: '13:10', status: 'Concluído' },
    { customer: 'João Paulo Tavares', station: 'Posto Grupo Oliveira Nhamundá', stationId: 'posto-nhamunda', fuel: 'Gasolina Comum', liters: 18.21, amount: 120.00, cashback: 3.60, time: '12:40', status: 'Concluído' }
  ];

  return {
    periodCfg,
    totalRevenue: totRev,
    totalFills: totFills,
    activeClients: 348,
    clientsRegistered: 348,
    totalCashback: totCbEmitted,
    cashbackUsed: totCbUsed,
    cashbackInCirculation: 1840.00,
    stationsData: filteredStations,
    chart7Days: baseline7Days,
    chartCashback: baselineCashback,
    recentFills: baselineRecent
  };
}

// 5. Renderização de Gráficos SVG Nativos (Discretos, Responsivos e Profissionais - Requisito 5)

// Gráfico 1: Barras de Abastecimentos dos Últimos 7 Dias (Mobile)
function renderAbastecimentos7DiasSVG(chartData) {
  const maxFills = Math.max(...chartData.map(d => d.fills), 10);
  const svgWidth = 350;
  const svgHeight = 140;
  const barWidth = 24;
  const chartBottom = 112;
  const chartHeight = 78;
  const colSpacing = (svgWidth - 36) / chartData.length;

  return `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="owner-chart-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="barGrad7" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0082ca"/>
          <stop offset="100%" stop-color="#562f82"/>
        </linearGradient>
        <linearGradient id="barGradHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0082ca"/>
        </linearGradient>
      </defs>

      <!-- Linhas de Grade Sutis -->
      <line x1="16" y1="${chartBottom}" x2="${svgWidth - 16}" y2="${chartBottom}" stroke="#e2e8f0" stroke-width="1"/>
      <line x1="16" y1="${chartBottom - chartHeight / 2}" x2="${svgWidth - 16}" y2="${chartBottom - chartHeight / 2}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>

      <!-- Barras dos Dias -->
      ${chartData.map((d, i) => {
        const x = 20 + (i * colSpacing);
        const bHeight = Math.max(10, Math.round((d.fills / maxFills) * chartHeight));
        const y = chartBottom - bHeight;
        const isToday = i === chartData.length - 1;

        return `
          <g class="svg-bar-col">
            <!-- Valor em cima da barra -->
            <text x="${x + barWidth / 2}" y="${y - 5}" font-size="10" font-weight="700" fill="${isToday ? '#0082ca' : '#475569'}" text-anchor="middle" font-family="var(--font-heading)">
              ${d.fills}
            </text>
            <!-- Barra com Cantos Arredondados -->
            <rect x="${x}" y="${y}" width="${barWidth}" height="${bHeight}" rx="5" fill="${isToday ? 'url(#barGradHighlight)' : 'url(#barGrad7)'}">
              <title>${d.day}: ${d.fills} abastecimentos (R$ ${d.revenue.toLocaleString('pt-BR')})</title>
            </rect>
            <!-- Nome do Dia -->
            <text x="${x + barWidth / 2}" y="${chartBottom + 15}" font-size="10" font-weight="${isToday ? '800' : '600'}" fill="${isToday ? '#562f82' : '#64748b'}" text-anchor="middle">
              ${d.day}
            </text>
          </g>
        `;
      }).join('')}
    </svg>
  `;
}

// Gráfico 2: Evolução de Cashback (Distribuído vs Utilizado - Mobile)
function renderEvolucaoCashbackSVG(chartData) {
  const svgWidth = 350;
  const svgHeight = 140;
  const chartBottom = 112;
  const chartHeight = 72;
  const maxVal = Math.max(...chartData.map(d => d.generated), 50);
  const colSpacing = (svgWidth - 44) / (chartData.length - 1);

  // Coordenadas das linhas
  const genPoints = chartData.map((d, i) => {
    const x = 22 + (i * colSpacing);
    const y = chartBottom - Math.round((d.generated / maxVal) * chartHeight);
    return { x, y, val: d.generated };
  });

  const usedPoints = chartData.map((d, i) => {
    const x = 22 + (i * colSpacing);
    const y = chartBottom - Math.round((d.used / maxVal) * chartHeight);
    return { x, y, val: d.used };
  });

  const genPolyline = genPoints.map(p => `${p.x},${p.y}`).join(' ');
  const usedPolyline = usedPoints.map(p => `${p.x},${p.y}`).join(' ');
  const genArea = `22,${chartBottom} ${genPolyline} ${genPoints[genPoints.length - 1].x},${chartBottom}`;

  return `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="owner-chart-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="areaGradCash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#562f82" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#562f82" stop-opacity="0.02"/>
        </linearGradient>
      </defs>

      <!-- Linhas de Grade -->
      <line x1="16" y1="${chartBottom}" x2="${svgWidth - 16}" y2="${chartBottom}" stroke="#e2e8f0" stroke-width="1"/>
      <line x1="16" y1="${chartBottom - chartHeight / 2}" x2="${svgWidth - 16}" y2="${chartBottom - chartHeight / 2}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>

      <!-- Área Preenchida do Cashback Emitido -->
      <polygon points="${genArea}" fill="url(#areaGradCash)"/>

      <!-- Linha Cashback Emitido (+3%) -->
      <polyline points="${genPolyline}" fill="none" stroke="#562f82" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Linha Cashback Utilizado (Resgatado) -->
      <polyline points="${usedPolyline}" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3,2"/>

      <!-- Pontos de Dados -->
      ${genPoints.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="3" fill="#562f82" stroke="#ffffff" stroke-width="1.5"/>
        <text x="${p.x}" y="${chartBottom + 15}" font-size="9.5" font-weight="600" fill="#64748b" text-anchor="middle">
          ${chartData[i].day}
        </text>
      `).join('')}

      ${usedPoints.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="2.5" fill="#16a34a" stroke="#ffffff" stroke-width="1.2"/>
      `).join('')}
    </svg>
  `;
}

// Gráfico 3: Comparativo de Participação das Unidades da Rede
function renderComparativoUnidadesBars(stationsData) {
  const colors = ['#562F82', '#0082CA', '#16a34a', '#FBB024', '#0284c7', '#7c3aed'];

  return `
    <div style="display:flex;flex-direction:column;gap:11px">
      ${stationsData.map((st, idx) => {
        const c = colors[idx % colors.length];
        return `
          <div>
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span style="font-weight:700;color:#0f172a">${esc(st.name)}</span>
              <span style="font-weight:800;color:${c}">${money(st.revenue)} (${st.share}%)</span>
            </div>
            <div style="background:#f1f5f9;height:8px;border-radius:999px;overflow:hidden">
              <div style="background:${c};width:${st.share}%;height:100%;border-radius:999px"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 6. Modal "Ver Detalhes" da Unidade Selecionada (Requisito 6)
function openStationDetailsModal(stationId) {
  const analytics = getNetworkAnalytics('all', state.ownerFilterPeriod || 'today');
  const st = analytics.stationsData.find(s => s.id === stationId) || analytics.stationsData[0];
  const stationObj = stations.find(s => s.id === stationId) || stations[0];

  const ticketMedio = st.fills > 0 ? (st.revenue / st.fills) : 0;

  openModal(`
    <div style="padding:4px 0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <span class="owner-tag-badge">Unidade da Rede</span>
          <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:var(--primary);margin:4px 0 0">
            ${esc(st.name)}
          </h2>
          <span style="font-size:12px;color:var(--text-muted)">${esc(st.city)} • ${esc(st.address)}</span>
        </div>
        <button class="modal-close" onclick="closeModal()" aria-label="Fechar">&times;</button>
      </div>

      <!-- Resumo Executivo da Unidade -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center">
          <small style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Faturamento no Período</small>
          <div style="font-family:var(--font-heading);font-size:18px;font-weight:900;color:#15803d;margin-top:2px">
            ${money(st.revenue)}
          </div>
          <span style="font-size:10px;color:#15803d;font-weight:600">● ${st.share}% da rede</span>
        </div>

        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center">
          <small style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Ticket Médio</small>
          <div style="font-family:var(--font-heading);font-size:18px;font-weight:900;color:var(--primary);margin-top:2px">
            ${money(ticketMedio)}
          </div>
          <span style="font-size:10px;color:var(--text-muted)">${st.fills} abastecimentos</span>
        </div>
      </div>

      <!-- Indicadores de Cashback da Unidade -->
      <div style="background:#f5f3ff;border:1px dashed var(--primary);border-radius:14px;padding:12px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span style="color:var(--text-muted)">Cashback Emitido (3%):</span>
          <b style="color:#15803d">+ ${money(st.cashbackEarned)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span style="color:var(--text-muted)">Cashback Resgatado em Descontos:</span>
          <b style="color:var(--red)">- ${money(st.cashbackUsed)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;border-top:1px dashed #cbd5e1;padding-top:6px;margin-top:4px">
          <span style="color:var(--text-muted)">Clientes Atendidos na Pista:</span>
          <b style="color:#0f172a">${st.clients} motoristas</b>
        </div>
      </div>

      <!-- Frentistas e Operadores em Turno -->
      <div style="margin-bottom:14px">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:6px">
          Equipe de Pista e Operadores Ativos
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${st.attendants.map(at => `
            <span style="background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;display:inline-flex;align-items:center;gap:4px">
              ⛽ ${esc(at)}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Volume e Tabela de Combustíveis -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:6px">
          Tabela de Preços e Litros Vendidos
        </div>
        <div style="border:1px solid var(--border);border-radius:12px;overflow:hidden">
          ${st.fuelsBreakdown.map((f, i) => `
            <div style="display:flex;justify-content:space-between;padding:8px 12px;font-size:12px;background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'};border-bottom:1px solid var(--border)">
              <div>
                <b style="color:#0f172a">${esc(f.name)}</b>
                <small style="color:var(--text-muted);display:block">${f.liters} L hoje</small>
              </div>
              <div style="text-align:right">
                <b style="color:var(--primary)">R$ ${f.price.toFixed(2).replace('.', ',')}/L</b>
                <small style="color:#15803d;display:block">${money(f.liters * f.price)}</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <button class="btn btn-primary" onclick="closeModal()" style="width:100%">
        Fechar Detalhes
      </button>
    </div>
  `);
}

// ========================================================
// RENDERIZADOR DO PAINEL EXECUTIVO DO PROPRIETÁRIO
// ========================================================
function renderOwnerDashboard() {
  const currentStation = state.ownerFilterStation || 'all';
  const currentPeriod = state.ownerFilterPeriod || 'today';

  // Obter analítica consolidada com base nos filtros
  const data = getNetworkAnalytics(currentStation, currentPeriod);

  return `
    <div class="owner-dashboard">
      <div class="owner-inner-container">
        <!-- 3. Cabeçalho Executivo do Proprietário -->
        <header class="owner-header">
          <div class="owner-top-bar">
            <div class="owner-brand-block">
              <img src="assets/img/brand/clean_logo_white.png" class="owner-brand-logo" alt="Grupo Oliveira">
              <span class="owner-tag-badge">Painel Executivo</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <button class="attendant-exit-btn" onclick="openRoleSwitcherModal()" aria-label="Alternar Perfil">
                <span>🔄 Alternar</span>
              </button>
              <button class="attendant-exit-btn" onclick="handleLogout()" aria-label="Sair da Conta" style="background:rgba(220,38,38,0.18);border:1px solid rgba(220,38,38,0.35);color:#ef4444">
                <span>🚪 Sair</span>
              </button>
            </div>
          </div>

          <div class="owner-title-block">
            <h1>Rede Grupo Oliveira (6 Postos)</h1>
            <div class="owner-subtitle">
              <span>Parintins • Barreirinha • Nhamundá • Terra Santa</span>
              <span>•</span>
              <span style="color:#fde68a;font-weight:700">Filtro: ${esc(data.periodCfg.label)}</span>
            </div>
          </div>
        </header>

        <!-- 8. Barra de Filtros Funcionais (Postos e Períodos) -->
        <section class="owner-filters-wrap" aria-label="Filtros do Painel Executivo">
          <div class="owner-filter-group">
            <span class="owner-filter-label">📍 Unidade:</span>
            <select class="owner-select-station" onchange="setOwnerStationFilter(this.value)" aria-label="Filtrar por Unidade">
              <option value="all" ${currentStation === 'all' ? 'selected' : ''}>Todos os Postos da Rede (6 Unidades)</option>
              ${stations.map(st => `
                <option value="${esc(st.id)}" ${currentStation === st.id ? 'selected' : ''}>
                  ${esc(st.name)} (${esc(st.city)})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="owner-filter-group">
            <span class="owner-filter-label">🕒 Período:</span>
            <div class="owner-period-pills">
              <button type="button" class="owner-period-pill ${currentPeriod === 'today' ? 'active' : ''}" onclick="setOwnerPeriodFilter('today')">Hoje</button>
              <button type="button" class="owner-period-pill ${currentPeriod === '7days' ? 'active' : ''}" onclick="setOwnerPeriodFilter('7days')">7 Dias</button>
              <button type="button" class="owner-period-pill ${currentPeriod === '30days' ? 'active' : ''}" onclick="setOwnerPeriodFilter('30days')">30 Dias</button>
              <button type="button" class="owner-period-pill ${currentPeriod === 'month' ? 'active' : ''}" onclick="setOwnerPeriodFilter('month')">Mês</button>
            </div>
          </div>
          <div class="owner-filter-group">
            <span class="owner-filter-label">🏷️ Origem:</span>
            <select class="owner-select-station" onchange="setOwnerOriginFilter(this.value)" aria-label="Filtrar por Origem do Cadastro">
              <option value="all" ${(state.ownerFilterOrigin || 'all') === 'all' ? 'selected' : ''}>Todas as Origens de Cadastro</option>
              <option value="station_qr" ${(state.ownerFilterOrigin || 'all') === 'station_qr' ? 'selected' : ''}>Via QR Code de Posto</option>
              <option value="friend_referral" ${(state.ownerFilterOrigin || 'all') === 'friend_referral' ? 'selected' : ''}>Via Indicação de Amigo</option>
            </select>
          </div>
        </section>

        <!-- 4. Indicadores Principais (6 Cards Compactos - Requisito 4) -->
        <section class="owner-metrics-grid" aria-label="Indicadores da Rede">
          <!-- 1. Valor Faturado Registrado -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Faturamento Registrado</span>
              <div class="owner-metric-icon green">💰</div>
            </div>
            <div class="owner-metric-value">${money(data.totalRevenue)}</div>
            <div class="owner-metric-trend trend-info" style="font-size:10px;line-height:1.2">
              <span>Transações confirmadas no sistema</span>
            </div>
          </div>

          <!-- 2. Quantidade de Abastecimentos -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Abastecimentos</span>
              <div class="owner-metric-icon blue">⛽</div>
            </div>
            <div class="owner-metric-value">${data.totalFills}</div>
            <div class="owner-metric-trend trend-info">
              <span>${data.totalFills > 0 ? (currentStation === 'all' ? Math.round(data.totalFills / 6) + ' por posto' : 'Nesta unidade') : 'Nenhum no período'}</span>
            </div>
          </div>

          <!-- 3. Clientes Ativos -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Clientes Ativos</span>
              <div class="owner-metric-icon purple">👥</div>
            </div>
            <div class="owner-metric-value">${data.activeClients}</div>
            <div class="owner-metric-trend trend-info">
              <span>Participação real</span>
            </div>
          </div>

          <!-- 4. Cashback Distribuído -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Cashback Emitido</span>
              <div class="owner-metric-icon gold">✨</div>
            </div>
            <div class="owner-metric-value">${money(data.totalCashback)}</div>
            <div class="owner-metric-trend trend-alert">
              <span>Taxa: 3,0%</span>
              <span style="font-weight:500;color:var(--text-muted)">automático</span>
            </div>
          </div>

          <!-- 5. Cashback Utilizado -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Cashback Resgatado</span>
              <div class="owner-metric-icon red">💳</div>
            </div>
            <div class="owner-metric-value">${money(data.cashbackUsed)}</div>
            <div class="owner-metric-trend trend-info">
              <span>${data.totalCashback > 0 ? ((data.cashbackUsed / data.totalCashback) * 100).toFixed(1) : '0.0'}%</span>
              <span style="font-weight:500;color:var(--text-muted)">conversão</span>
            </div>
          </div>

          <!-- 6. Saldo de Cashback em Circulação -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Saldo em Carteiras</span>
              <div class="owner-metric-icon cyan">🏦</div>
            </div>
            <div class="owner-metric-value">${money(data.cashbackInCirculation)}</div>
            <div class="owner-metric-trend trend-up">
              <span>Retenção ativa</span>
            </div>
          </div>
        </section>

        <!-- 5. Gráficos Discretos e Profissionais (SVG Nativo - Requisito 5) -->
        <section class="owner-charts-grid" aria-label="Gráficos de Performance">
          <!-- Gráfico 1: Volume de Abastecimentos dos Últimos 7 Dias -->
          <div class="owner-chart-card">
            <div class="owner-chart-header">
              <div>
                <h3 class="owner-chart-title">Volume de Abastecimentos (7 Dias)</h3>
                <span class="owner-chart-subtitle">Transações registradas nos postos da rede</span>
              </div>
              <div class="owner-chart-legend">
                <span style="color:#562f82"><span class="legend-dot" style="background:#562f82"></span>Abastecimentos</span>
              </div>
            </div>
            <div class="owner-chart-svg-wrap">
              ${renderAbastecimentos7DiasSVG(data.chart7Days)}
            </div>
          </div>

          <!-- Gráfico 2: Evolução de Cashback (Emitido vs Resgatado) -->
          <div class="owner-chart-card">
            <div class="owner-chart-header">
              <div>
                <h3 class="owner-chart-title">Evolução do Cashback (R$)</h3>
                <span class="owner-chart-subtitle">Benefício creditado (3%) vs Resgatado em desconto</span>
              </div>
              <div class="owner-chart-legend">
                <span style="color:#562f82"><span class="legend-dot" style="background:#562f82"></span>Emitido</span>
                <span style="color:#16a34a"><span class="legend-dot" style="background:#16a34a"></span>Resgatado</span>
              </div>
            </div>
            <div class="owner-chart-svg-wrap">
              ${renderEvolucaoCashbackSVG(data.chartCashback)}
            </div>
          </div>
        </section>

        <!-- Comparativo de Volume entre Unidades (se Todos os Postos estiver ativo) -->
        ${currentStation === 'all' ? `
          <div class="owner-chart-card" style="margin-bottom:28px">
            <div class="owner-chart-header">
              <div>
                <h3 class="owner-chart-title">Comparativo de Vendas entre Unidades</h3>
                <span class="owner-chart-subtitle">Participação percentual de cada posto no faturamento total da rede</span>
              </div>
              <span class="status-badge-mini status-green">6 Postos Integrados</span>
            </div>
            ${renderComparativoUnidadesBars(data.stationsData)}
          </div>
        ` : ''}

        <!-- 6. Unidades da Rede (Cards com Métricas e Botão "Ver detalhes" - Requisito 6) -->
        <section style="margin-bottom:28px" aria-label="Unidades da Rede">
          <div class="owner-section-title-row">
            <h2>Unidades da Rede Grupo Oliveira</h2>
            <span class="owner-section-count">${data.stationsData.length} postos em operação</span>
          </div>

          <div class="owner-stations-grid">
            ${data.stationsData.map(st => `
              <div class="owner-station-card">
                <div class="owner-station-top">
                  <div>
                    <h3 class="owner-station-name">${esc(st.name)}</h3>
                    <div class="owner-station-loc">📍 ${esc(st.city)} • ${esc(st.address)}</div>
                  </div>
                  <span class="status-badge-mini status-green">Ativo</span>
                </div>

                <div class="owner-station-metrics-row">
                  <div class="owner-station-metric-item">
                    <small>Abastecimentos</small>
                    <b>${st.fills}</b>
                  </div>
                  <div class="owner-station-metric-item">
                    <small>Faturamento</small>
                    <b style="color:#15803d">${money(st.revenue)}</b>
                  </div>
                  <div class="owner-station-metric-item">
                    <small>Clientes</small>
                    <b>${st.clients}</b>
                  </div>
                  <div class="owner-station-metric-item">
                    <small>Cashback 3%</small>
                    <b style="color:var(--primary)">${money(st.cashbackEarned)}</b>
                  </div>
                </div>

                <div class="owner-station-bottom">
                  <div class="owner-status-pill">
                    <span class="pulse-dot"></span>
                    <span>Pista e PDV Operando</span>
                  </div>
                  <button type="button" class="owner-btn-details" onclick="openStationDetailsModal('${esc(st.id)}')">
                    <span>Ver detalhes</span> ➔
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 7. Seção Exclusiva: Divulgação, Cadastros e Indicações (Requisitos 1, 6, 7, 8 & 9) -->
        ${renderOwnerDivulgacaoEIndicacoes(data)}

        <!-- 8. Movimentações Recentes (Abastecimentos Recentes - Requisito 7) -->
        <section aria-label="Abastecimentos Recentes">
          <div class="owner-section-title-row">
            <h2>Abastecimentos Recentes na Rede</h2>
            <span class="owner-section-count">Últimos registros auditáveis</span>
          </div>

          ${data.recentFills.length === 0 ? `
            <div class="owner-empty-state">
              <div style="font-size:24px;margin-bottom:6px">⛽</div>
              <p style="margin:0">Nenhum abastecimento encontrado para os filtros selecionados.</p>
            </div>
          ` : `
            <div class="owner-recent-list">
              ${data.recentFills.map(tx => `
                <div class="owner-tx-card">
                  <div class="owner-tx-left">
                    <div class="owner-tx-avatar">⛽</div>
                    <div class="owner-tx-info">
                      <b>${esc(tx.customer)}</b>
                      <small>${esc(tx.station)} • ${esc(tx.fuel)} (${tx.liters} L)</small>
                    </div>
                  </div>
                  <div class="owner-tx-right">
                    <div class="owner-tx-val">${money(tx.amount)}</div>
                    <div class="owner-tx-cashback">+ ${money(tx.cashback)} cashback</div>
                    <small style="font-size:10px;color:var(--text-muted)">🕒 ${esc(tx.time)}</small>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </section>
      </div>
    </div>
  `;
}

// Main Render Dispatcher
function render() {
  const view = document.querySelector('#view');
  if (!view) return;

  if (state.currentRole === 'owner') {
    document.body.classList.add('is-owner-view');
  } else {
    document.body.classList.remove('is-owner-view');
  }

  if (state.currentRole === 'attendant') {
    view.innerHTML = renderAttendantDashboard();
    return;
  }

  if (state.currentRole === 'owner') {
    view.innerHTML = renderOwnerDashboard();
    return;
  }

  let content = '';
  switch (currentPage) {
    case 'Início':
      content = renderHome();
      break;
    case 'Notificações':
      content = renderNotificacoes();
      break;
    case 'Unidades':
      content = renderUnidades();
      break;
    case 'Prêmios':
      content = renderPremios();
      break;
    case 'Promoções':
      content = renderPromocoes();
      break;
    case 'Histórico':
      content = renderHistorico();
      break;
    case 'Perfil':
      content = renderPerfil();
      break;
    default:
      content = renderHome();
  }

  view.innerHTML = content + renderBottomNav();
}

// ========================================================
// MODAL FORMS & DIALOGS
// ========================================================

// ========================================================
// FUNCIONALIDADE ABASTECER — CLUBE GRUPO OLIVEIRA
// ========================================================

let currentFuelToken = null;
let tokenExpiresAt = 0;
let tokenCountdownInterval = null;
let selectedCashbackDiscount = 0;

function generateFuelToken() {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timePart = Date.now().toString(36).slice(-3).toUpperCase();
  const tokenCode = `TK-GO-${randomPart}${timePart}`;
  tokenExpiresAt = Date.now() + (90 * 1000); // 90 segundos

  currentFuelToken = {
    code: tokenCode,
    clientId: state.clientId || 'CLI-0824',
    clientName: state.name || 'Kaynã Viana',
    cardNumber: state.cardNumber || '4589 8210 3349 1204',
    balance: Number(state.balance || 0),
    points: Number(state.points || 0),
    discountRequested: selectedCashbackDiscount,
    expiresAt: tokenExpiresAt,
    used: false
  };

  // 1. Sincroniza token ativo com o hub do servidor Node.js
  fetch('/api/sync/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: currentFuelToken.code,
      clientId: currentFuelToken.clientId,
      clientName: currentFuelToken.clientName,
      cardNumber: currentFuelToken.cardNumber,
      balance: state.balance,
      points: state.points,
      discountRequested: selectedCashbackDiscount,
      vehicle: state.vehicle || '',
      plate: state.plate || '',
      expiresAt: tokenExpiresAt
    })
  }).catch(() => {});

  // 2. Transmite localmente via BroadcastChannel (mesmo navegador)
  try {
    if (window._goSyncChannel) {
      window._goSyncChannel.postMessage({
        type: 'TOKEN_CREATED',
        token: currentFuelToken
      });
    }
  } catch (e) {}

  // 3. Se conectado ao Supabase, grava o token de segurança no banco
  if (window._supabaseClient) {
    window._supabaseClient.rpc('gerar_token_abastecimento', {
      p_desconto_solicitado: Number(selectedCashbackDiscount || 0)
    }).then(({ data, error }) => {
      if (!error && data && data.token_codigo) {
        currentFuelToken.code = data.token_codigo;
        currentFuelToken.expiresAt = new Date(data.expira_em).getTime();
        tokenExpiresAt = currentFuelToken.expiresAt;
        const tokenPill = document.querySelector('#qr-token-text');
        if (tokenPill) tokenPill.textContent = currentFuelToken.code;
        renderFuelQRCode();
      }
    }).catch(err => console.warn('[Gerar Token RPC]', err.message));
  }

  return currentFuelToken;
}

function renderFuelQRCode() {
  const container = document.querySelector('#abastecer-qr-box');
  if (!container || !currentFuelToken) return;

  // Carga protegida e completa para leitura imediata pela câmera mesmo offline
  const qrData = `GO-AUTH:CID=${encodeURIComponent(currentFuelToken.clientId)}&TK=${encodeURIComponent(currentFuelToken.code)}&NAME=${encodeURIComponent(currentFuelToken.clientName || state.name || '')}&CARD=${encodeURIComponent(currentFuelToken.cardNumber || '')}&BAL=${encodeURIComponent(state.balance || 0)}&PTS=${encodeURIComponent(state.points || 0)}&DISC=${encodeURIComponent(currentFuelToken.discountRequested || 0)}&VEIC=${encodeURIComponent(state.vehicle || '')}&PLACA=${encodeURIComponent(state.plate || '')}&EXP=${currentFuelToken.expiresAt}`;

  if (typeof QRCode !== 'undefined' && QRCode.toString) {
    QRCode.toString(qrData, {
      type: 'svg',
      width: 170,
      margin: 1,
      color: {
        dark: '#1b0e2a',
        light: '#ffffff'
      }
    }).then(svg => {
      container.innerHTML = svg;
    }).catch(err => {
      console.error('Erro na geração do QR Code:', err);
    });
  }
}

function startTokenCountdown() {
  if (tokenCountdownInterval) {
    clearInterval(tokenCountdownInterval);
  }

  const update = () => {
    const fillEl = document.querySelector('#qr-timer-fill');
    const textEl = document.querySelector('#qr-timer-text');
    if (!fillEl || !textEl || !currentFuelToken) return;

    const remainingMs = Math.max(0, currentFuelToken.expiresAt - Date.now());
    const remainingSec = Math.ceil(remainingMs / 1000);
    const totalSec = 90;
    const pct = Math.max(0, Math.min(100, (remainingSec / totalSec) * 100));

    fillEl.style.width = pct + '%';
    if (remainingSec <= 20) {
      fillEl.classList.add('warning');
    } else {
      fillEl.classList.remove('warning');
    }

    textEl.textContent = `Expira em ${remainingSec}s`;

    if (remainingMs <= 0) {
      refreshFuelToken();
    }
  };

  update();
  tokenCountdownInterval = setInterval(update, 1000);
}

function refreshFuelToken() {
  generateFuelToken();
  const tokenPill = document.querySelector('#qr-token-text');
  if (tokenPill) tokenPill.textContent = currentFuelToken.code;
  renderFuelQRCode();
  startTokenCountdown();
  toast('🔄 Novo token gerado com sucesso.');
}

function toggleCashbackRedemption() {
  const chk = document.querySelector('#chk-use-cashback');
  const area = document.querySelector('#cashback-select-area');
  const card = document.querySelector('#cashback-accordion');
  if (!chk || !area) return;

  if (chk.checked) {
    area.classList.add('show');
    if (card) card.classList.add('active');
    setCashbackDiscount(Math.min(20, state.balance));
  } else {
    area.classList.remove('show');
    if (card) card.classList.remove('active');
    setCashbackDiscount(0);
  }
}

function setCashbackDiscount(val) {
  val = Math.max(0, Math.min(Number(val) || 0, state.balance));
  selectedCashbackDiscount = Math.round(val * 100) / 100;

  const input = document.querySelector('#input-cashback-val');
  if (input) input.value = selectedCashbackDiscount ? selectedCashbackDiscount.toFixed(2) : '';

  const prevText = document.querySelector('#discount-preview-text');
  if (prevText) prevText.textContent = money(selectedCashbackDiscount);

  document.querySelectorAll('.cashback-pill-opt').forEach(p => {
    const pVal = Number(p.getAttribute('data-val'));
    if (Math.abs(pVal - selectedCashbackDiscount) < 0.01) {
      p.classList.add('selected');
    } else {
      p.classList.remove('selected');
    }
  });

  if (currentFuelToken) {
    currentFuelToken.discountRequested = selectedCashbackDiscount;
    renderFuelQRCode();

    // Sincroniza alteração de desconto no hub do servidor
    fetch('/api/sync/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: currentFuelToken.code,
        clientId: currentFuelToken.clientId,
        clientName: currentFuelToken.clientName,
        cardNumber: currentFuelToken.cardNumber,
        balance: state.balance,
        points: state.points,
        discountRequested: selectedCashbackDiscount,
        expiresAt: currentFuelToken.expiresAt
      })
    }).catch(() => {});
  }
}

// 1. Tela do Cliente: Botão "Abastecer"
function openAbastecerModal(preselectedStation = '') {
  generateFuelToken();

  const cardMasked = (state.cardNumber || '4589 8210 3349 1204').replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');

  openModal(`
    <div class="abastecer-container">
      <div class="abastecer-title-row">
        <div>
          <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary);margin:0">
            Abastecer no Posto
          </h2>
          <span style="font-size:12px;color:var(--text-muted)">Identifique-se na pista e ganhe cashback</span>
        </div>
        <span class="abastecer-badge">
          ${icon('fuel')} Clube Oliveira
        </span>
      </div>

      <!-- 1. Cartão Digital do Cliente com Nome e Número -->
      <div class="abastecer-mini-card">
        <div class="mini-card-top">
          <div class="mini-card-chip"></div>
          <img src="assets/img/brand/clean_logo_white.png" style="height:22px;opacity:0.95" alt="Grupo Oliveira">
        </div>
        <div class="mini-card-num">${cardMasked}</div>
        <div class="mini-card-bottom">
          <div>
            <div class="mini-card-holder">${esc(state.name)}</div>
            <small style="font-size:10px;opacity:0.85">${esc(state.vehicle)} (${esc(state.plate)})</small>
          </div>
          <span class="mini-card-status">● CLIENTE ATIVO</span>
        </div>
      </div>

      <!-- 2. QR Code de Identificação Temporário e Seguro -->
      <div class="abastecer-qr-wrapper">
        <span style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">
          QR Code de Identificação Exclusivo
        </span>

        <div class="qr-box-center" id="abastecer-qr-box">
          <div style="width:170px;height:170px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px">
            Gerando QR Code...
          </div>
        </div>

        <div class="qr-token-info">
          <span>Token de Segurança:</span>
          <span class="qr-token-pill" id="qr-token-text">${currentFuelToken.code}</span>
        </div>

        <!-- Barra de Expiração de 90s -->
        <div class="qr-timer-container">
          <div class="qr-timer-track">
            <div id="qr-timer-fill" class="qr-timer-fill" style="width:100%"></div>
          </div>
          <div class="qr-timer-meta">
            <span id="qr-timer-text">Expira em 90s</span>
            <button class="qr-refresh-btn" type="button" onclick="refreshFuelToken()">
              ⟳ Atualizar Código
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Mensagem Obrigatória em Destaque -->
      <div class="abastecer-mandatory-notice">
        ${icon('fuel')}
        <p>Apresente seu QR Code ao frentista para registrar seu abastecimento e ganhar cashback.</p>
      </div>

      <!-- 4. Saldo Disponível de Cashback e Pontos Acumulados -->
      <div class="abastecer-metrics-grid">
        <div class="abastecer-metric-card">
          <div class="abastecer-metric-icon cashback">
            ${icon('coin')}
          </div>
          <div>
            <div class="abastecer-metric-label">Saldo de Cashback</div>
            <div class="abastecer-metric-val" style="color:#16a34a">${money(state.balance)}</div>
          </div>
        </div>

        <div class="abastecer-metric-card">
          <div class="abastecer-metric-icon points">
            ${icon('star')}
          </div>
          <div>
            <div class="abastecer-metric-label">Pontos Acumulados</div>
            <div class="abastecer-metric-val" style="color:var(--blue)">${state.points} pts</div>
          </div>
        </div>
      </div>

      <!-- 5. Utilizar Saldo de Cashback (Opcional) -->
      <div class="cashback-discount-accordion" id="cashback-accordion">
        <div class="cashback-toggle-header" onclick="document.querySelector('#chk-use-cashback').click()">
          <div class="cashback-toggle-left">
            <div style="width:28px;height:28px;border-radius:8px;background:#f3e8ff;display:flex;align-items:center;justify-content:center;color:var(--primary)">
              ${icon('wallet')}
            </div>
            <div>
              <b>Utilizar saldo de cashback</b>
              <small>${state.balance > 0 ? `Disponível para desconto: ${money(state.balance)}` : 'Você não possui saldo para resgate'}</small>
            </div>
          </div>
          <label class="toggle-switch" onclick="event.stopPropagation()">
            <input type="checkbox" id="chk-use-cashback" ${state.balance <= 0 ? 'disabled' : ''} onchange="toggleCashbackRedemption()">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="cashback-slider-area" id="cashback-select-area">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">
            Selecione o valor que deseja abater do abastecimento:
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-weight:700;color:var(--primary);font-size:14px">R$</span>
            <input type="number" id="input-cashback-val" min="1" max="${state.balance}" step="1" 
                   value="${Math.min(20, state.balance)}" 
                   style="font-size:16px;font-weight:800;padding:6px 10px;border:1px solid #cbd5e1;border-radius:8px;width:100%"
                   oninput="setCashbackDiscount(this.value)">
          </div>

          <div class="cashback-pills-row">
            <button type="button" class="cashback-pill-opt ${(selectedCashbackDiscount === 5) ? 'selected' : ''}" data-val="5" onclick="setCashbackDiscount(5)">R$ 5</button>
            <button type="button" class="cashback-pill-opt ${(selectedCashbackDiscount === 10) ? 'selected' : ''}" data-val="10" onclick="setCashbackDiscount(10)">R$ 10</button>
            <button type="button" class="cashback-pill-opt ${(selectedCashbackDiscount === 20 || (!selectedCashbackDiscount && state.balance >= 20)) ? 'selected' : ''}" data-val="20" onclick="setCashbackDiscount(20)">R$ 20</button>
            <button type="button" class="cashback-pill-opt ${(selectedCashbackDiscount === state.balance) ? 'selected' : ''}" data-val="${state.balance}" onclick="setCashbackDiscount(${state.balance})">Tudo (${money(state.balance)})</button>
          </div>

          <div style="font-size:11px;color:#15803d;margin-top:10px;background:#dcfce7;border:1px solid #86efac;padding:8px 12px;border-radius:8px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <b style="display:block;font-size:12px">✓ Desconto de <span id="discount-preview-text">${money(selectedCashbackDiscount || Math.min(20, state.balance))}</span> vinculado ao QR Code</b>
              <span style="color:#166534">Valor confirmado pelo cliente. O frentista apenas visualizará e aplicará este desconto no PDV.</span>
            </div>
            <span style="font-size:16px">🔒</span>
          </div>
        </div>
      </div>

      <!-- Instruções do Cliente -->
      <div style="background:#f8fafc;border:1.5px solid var(--border);border-radius:12px;padding:12px 14px;margin-top:12px;text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;font-size:12.5px;font-weight:700;color:var(--primary)">
          ⛽ Apresente este QR Code ao frentista
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin:4px 0 0;line-height:1.4">
          O operador da pista fará a leitura através da câmera para validar seu cartão, aplicar o desconto e registrar seu cashback de 3%.
        </p>
      </div>
    </div>
  `);

  renderFuelQRCode();
  startTokenCountdown();
}

// Compatibilidade retroativa
function fillForm(preselectedStation = '') {
  openAbastecerModal(preselectedStation);
}

// ========================================================
// FLUXO DO FRENTISTA — SCANNER QR, REGISTRO E CONFIRMAÇÃO
// ========================================================

let scannerMediaStream = null;
let currentCustomerSession = null;
let isConfirmingOperation = false;
let qrScanAnimationId = null;
let qrScanCanvas = null;
let qrScanCtx = null;
let barcodeDetector = null;
let currentCameraFacing = 'environment';

// Inicializar detector nativo se disponível
if ('BarcodeDetector' in window) {
  try {
    barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
  } catch (e) {
    barcodeDetector = null;
  }
}

// Feedback sonoro nativo sem arquivos externos
function playBeepSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Lá (A5)
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

// 3. Leitura do QR Code com Câmera Real
function openQRScannerModal() {
  openModal(`
    <div style="padding:0">
      <div style="margin-bottom:10px">
        <h2 style="font-family:var(--font-heading);font-size:16.5px;font-weight:800;color:var(--primary);margin:0;letter-spacing:-0.3px">
          Escanear QR Code do Cliente
        </h2>
        <span style="font-size:11px;color:var(--text-muted)">Aponte a câmera para o QR Code no app ou cartão do cliente</span>
      </div>

      <!-- Viewfinder da Câmera (Sem cortes pretos, 100% preenchido) -->
      <div class="scanner-viewport-box">
        <video id="qr-camera-stream" playsinline autoplay muted></video>

        <div class="scanner-status-badge">
          <span class="scanner-status-dot"></span>
          <span id="scanner-status-text">Câmera ativa — Escaneando...</span>
        </div>

        <div class="scanner-reticle-overlay">
          <div class="reticle-corner top-left"></div>
          <div class="reticle-corner top-right"></div>
          <div class="reticle-corner bottom-left"></div>
          <div class="reticle-corner bottom-right"></div>
        </div>

        <button type="button" onclick="toggleCameraFacing()" aria-label="Alternar Câmera" title="Alternar Câmera Frontal / Traseira" style="position:absolute;bottom:12px;right:12px;z-index:6;background:rgba(15,8,29,0.8);color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px">
          🔄
        </button>
      </div>

      <!-- Entrada Manual e Upload de Imagem -->
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <input type="text" id="manual-token-input" placeholder="Digitar token (ex: TK-GO-XXXX)" style="flex:1;padding:8px 12px;font-size:12px;border:1.5px solid var(--border);border-radius:10px;font-weight:700">
          <button type="button" class="btn btn-primary" onclick="processManualTokenInput()" style="width:auto;min-height:36px;height:36px;padding:0 16px;font-size:12px;white-space:nowrap;border-radius:10px">
            Validar
          </button>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:4px">
          <label style="cursor:pointer;font-size:11.5px;color:var(--primary);font-weight:700;display:inline-flex;align-items:center;gap:4px">
            📁 Carregar imagem do QR Code
            <input type="file" accept="image/*" style="display:none" onchange="handleQRImageUpload(event)">
          </label>
          <button type="button" class="btn btn-outline" onclick="closeQRScannerModal()" style="width:auto;min-height:32px;height:32px;padding:4px 14px;font-size:11.5px;border-radius:8px">
            Fechar
          </button>
        </div>
      </div>
    </div>
  `);

  initCameraStream();
}

function initCameraStream() {
  const video = document.querySelector('#qr-camera-stream');
  if (!video) return;

  stopScannerCamera();

  const constraints = {
    video: {
      facingMode: { ideal: currentCameraFacing },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        scannerMediaStream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.onloadedmetadata = () => {
          video.play().catch(() => {});
          startQRCodeScannerLoop();
        };
      })
      .catch(err => {
        console.warn('Câmera indisponível ou permissão pendente:', err);
        const statusText = document.querySelector('#scanner-status-text');
        if (statusText) statusText.textContent = 'Permissão de câmera pendente';
      });
  } else {
    const statusText = document.querySelector('#scanner-status-text');
    if (statusText) statusText.textContent = 'Câmera não suportada neste navegador';
  }
}

function toggleCameraFacing() {
  currentCameraFacing = (currentCameraFacing === 'environment') ? 'user' : 'environment';
  initCameraStream();
}

function startQRCodeScannerLoop() {
  if (qrScanAnimationId) {
    cancelAnimationFrame(qrScanAnimationId);
    qrScanAnimationId = null;
  }

  const video = document.querySelector('#qr-camera-stream');
  if (!video) return;

  if (!qrScanCanvas) {
    qrScanCanvas = document.createElement('canvas');
  }

  const scanFrame = async () => {
    if (!scannerMediaStream) return;

    if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      let detectedText = null;

      // 1. Decodificação nativa rápida via BarcodeDetector
      if (barcodeDetector) {
        try {
          const codes = await barcodeDetector.detect(video);
          if (codes && codes.length > 0 && codes[0].rawValue) {
            detectedText = codes[0].rawValue;
          }
        } catch (e) {}
      }

      // 2. Fallback decodificação via jsQR em Canvas
      if (!detectedText && typeof jsQR !== 'undefined') {
        try {
          if (qrScanCanvas.width !== video.videoWidth || qrScanCanvas.height !== video.videoHeight) {
            qrScanCanvas.width = video.videoWidth;
            qrScanCanvas.height = video.videoHeight;
            qrScanCtx = qrScanCanvas.getContext('2d', { willReadFrequently: true });
          }
          if (qrScanCtx) {
            qrScanCtx.drawImage(video, 0, 0, qrScanCanvas.width, qrScanCanvas.height);
            const imgData = qrScanCtx.getImageData(0, 0, qrScanCanvas.width, qrScanCanvas.height);
            const qr = jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: 'dontInvert'
            });
            if (qr && qr.data) {
              detectedText = qr.data;
            }
          }
        } catch (e) {}
      }

      if (detectedText) {
        onQRCodeSuccessfullyScanned(detectedText);
        return; // interrompe loop
      }
    }

    qrScanAnimationId = requestAnimationFrame(scanFrame);
  };

  qrScanAnimationId = requestAnimationFrame(scanFrame);
}

function onQRCodeSuccessfullyScanned(rawData) {
  stopScannerCamera();
  playBeepSound();

  try {
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
  } catch (e) {}

  toast('✅ QR Code lido com sucesso!');

  let tokenCode = '';
  let clientId = '';
  let discountRequested = 0;
  let clientName = '';
  let cardNumber = '';
  let balance = null;
  let points = null;
  let vehicle = '';
  let plate = '';

  if (typeof rawData === 'string' && rawData.includes('GO-AUTH:')) {
    const params = new URLSearchParams(rawData.replace('GO-AUTH:', ''));
    tokenCode = params.get('TK') || '';
    clientId = params.get('CID') || '';
    discountRequested = parseFloat(params.get('DISC') || '0');
    clientName = params.get('NAME') ? decodeURIComponent(params.get('NAME')) : '';
    cardNumber = params.get('CARD') ? decodeURIComponent(params.get('CARD')) : '';
    if (params.get('BAL') !== null) balance = parseFloat(params.get('BAL'));
    if (params.get('PTS') !== null) points = parseInt(params.get('PTS'));
    vehicle = params.get('VEIC') ? decodeURIComponent(params.get('VEIC')) : '';
    plate = params.get('PLACA') ? decodeURIComponent(params.get('PLACA')) : '';
  } else if (typeof rawData === 'string' && (rawData.startsWith('TK-') || rawData.startsWith('GO-'))) {
    tokenCode = rawData.trim();
  } else {
    try {
      const obj = JSON.parse(rawData);
      tokenCode = obj.code || obj.token || rawData;
      clientId = obj.clientId || '';
      discountRequested = obj.discountRequested || 0;
      clientName = obj.clientName || obj.name || '';
      cardNumber = obj.cardNumber || '';
      balance = obj.balance !== undefined ? obj.balance : null;
      points = obj.points !== undefined ? obj.points : null;
      vehicle = obj.vehicle || '';
      plate = obj.plate || '';
    } catch (e) {
      tokenCode = String(rawData).trim();
    }
  }

  processScannedToken(tokenCode, {
    clientId,
    discountRequested,
    clientName,
    cardNumber,
    balance,
    points,
    vehicle,
    plate
  });
}

function handleQRImageUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (typeof jsQR !== 'undefined') {
        const qr = jsQR(imgData.data, imgData.width, imgData.height);
        if (qr && qr.data) {
          onQRCodeSuccessfullyScanned(qr.data);
          return;
        }
      }
      toast('Não foi possível reconhecer um QR Code nesta imagem.');
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function stopScannerCamera() {
  if (qrScanAnimationId) {
    cancelAnimationFrame(qrScanAnimationId);
    qrScanAnimationId = null;
  }
  if (scannerMediaStream) {
    scannerMediaStream.getTracks().forEach(t => t.stop());
    scannerMediaStream = null;
  }
}

function closeQRScannerModal() {
  stopScannerCamera();
  closeModal();
}

function processManualTokenInput() {
  const input = document.querySelector('#manual-token-input');
  if (!input || !input.value.trim()) {
    toast('Por favor, informe o código do token do cliente.');
    return;
  }
  processScannedToken(input.value.trim().toUpperCase());
}

async function processScannedToken(tokenCode, extra = {}) {
  stopScannerCamera();
  const cleanCode = String(tokenCode || '').trim();

  // 1. Se o Supabase estiver conectado, realiza a busca segura via RPC
  if (window._supabaseClient) {
    try {
      const { data, error } = await window._supabaseClient.rpc('buscar_cliente_para_abastecimento', {
        p_token_ou_cartao: cleanCode
      });

      if (!error && data && data.encontrado) {
        const maskedCard = (data.numero_cartao || '').replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');
        const identifiedCustomer = {
          name: data.nome,
          maskedCard: maskedCard,
          balance: Number(data.saldo_cashback) || 0,
          points: Number(data.pontos_acumulados) || 0,
          discountRequested: Number(data.desconto_solicitado) || Number(extra.discountRequested || 0),
          tokenCode: data.token_codigo || cleanCode,
          clientId: data.cliente_id,
          vehicle: data.veiculo_padrao,
          plate: data.placa_padrao
        };
        openRegistrarAbastecimentoModal(identifiedCustomer);
        return;
      }
    } catch (err) {
      console.warn('[Busca RPC fallback]', err.message);
    }
  }

  // 2. Consulta o hub de sincronização local do servidor Node.js
  try {
    const res = await fetch(`/api/sync/token/${encodeURIComponent(cleanCode)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.found && json.token) {
        const t = json.token;
        const maskedCard = (t.cardNumber || extra.cardNumber || '4589 8210 3349 1204').replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');
        const identifiedCustomer = {
          name: t.clientName || extra.clientName || 'Kaynã Viana',
          maskedCard: maskedCard,
          balance: Number(t.balance !== undefined ? t.balance : (extra.balance !== null ? extra.balance : 38.50)),
          points: Number(t.points !== undefined ? t.points : (extra.points !== null ? extra.points : 520)),
          discountRequested: Number(t.discountRequested !== undefined ? t.discountRequested : (extra.discountRequested || 0)),
          tokenCode: t.code || cleanCode,
          clientId: t.clientId || extra.clientId || 'CLI-0824',
          vehicle: t.vehicle || extra.vehicle || 'Honda Civic',
          plate: t.plate || extra.plate || 'PHK-8291'
        };
        openRegistrarAbastecimentoModal(identifiedCustomer);
        return;
      }
    }
  } catch (syncErr) {
    console.warn('[Sync Hub Token Lookup Error]', syncErr.message);
  }

  // 3. Fallback inteligente usando dados embutidos no QR Code ou estado local
  const customerName = extra.clientName || state.name || 'Kaynã Viana';
  const cardRaw = extra.cardNumber || state.cardNumber || '4589 8210 3349 1204';
  const maskedCard = cardRaw.replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');
  const identifiedCustomer = {
    name: customerName,
    maskedCard: maskedCard,
    balance: Number(extra.balance !== null && extra.balance !== undefined ? extra.balance : (state.balance || 38.50)),
    points: Number(extra.points !== null && extra.points !== undefined ? extra.points : (state.points || 520)),
    discountRequested: Number(extra.discountRequested || selectedCashbackDiscount || 0),
    tokenCode: cleanCode,
    clientId: extra.clientId || state.clientId || 'CLI-0824',
    vehicle: extra.vehicle || state.vehicle || 'Honda Civic',
    plate: extra.plate || state.plate || 'PHK-8291'
  };

  openRegistrarAbastecimentoModal(identifiedCustomer);
}

// 4. Registrar Abastecimento (Requisito 4 & 6)
function openRegistrarAbastecimentoModal(customerData) {
  currentCustomerSession = customerData;
  const attendantStation = state.attendantUser ? state.attendantUser.stationName : 'Posto Marcos Zagury (Matriz)';
  const minRedemption = SYSTEM_CONFIG.minCashbackRedemption || 10.00;
  const canRedeem = customerData.balance >= minRedemption;
  const preRequested = Math.min(customerData.discountRequested || 0, customerData.balance);

  openModal(`
    <div style="padding:4px 0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Passo 1 de 2</span>
          <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:var(--primary);margin:0">
            Registrar Abastecimento
          </h2>
        </div>
        <span class="status-badge-mini status-green">✓ Cliente Identificado</span>
      </div>

      <!-- Identificação do Cliente (Sem CPF, sem telefone - Requisito 3) -->
      <div style="background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:10px 12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700">Cliente Identificado</div>
          <b style="font-size:14px;color:#0f172a">${esc(customerData.name)}</b>
          <div style="font-size:11px;color:var(--text-muted)">Cartão: <b>${esc(customerData.maskedCard)}</b></div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700">Saldo Cashback</div>
          <b style="font-size:14px;color:#16a34a">${money(customerData.balance)}</b>
          <div style="font-size:10px;color:var(--blue);font-weight:600">${customerData.points} pts</div>
        </div>
      </div>

      <form id="form-registrar-abastecimento" onsubmit="handleRegistrarContinuar(event)">
        <!-- Posto do Funcionário (Preenchido Automaticamente e Bloqueado - Requisito 4 & 7) -->
        <div class="form-group">
          <label>Posto Autorizado (Unidade de Trabalho)</label>
          <input type="text" value="${esc(attendantStation)}" readonly style="background:#f1f5f9;font-weight:600;color:#334155">
        </div>

        <!-- Tipo de Combustível -->
        <div class="form-group">
          <label>Tipo de Combustível</label>
          <select id="reg-fuel" onchange="updateRegistrarCalculations()">
            <option value="Gasolina Comum" data-price="6.59">Gasolina Comum — R$ 6,59/L</option>
            <option value="Gasolina Aditivada" data-price="6.79">Gasolina Aditivada — R$ 6,79/L</option>
            <option value="Diesel S10" data-price="6.89">Diesel S10 — R$ 6,89/L</option>
            <option value="Etanol Comum" data-price="5.29">Etanol Comum — R$ 5,29/L</option>
          </select>
        </div>

        <!-- Valor do Abastecimento em Reais & Litros Calculados -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="form-group">
            <label>Valor Bomba (R$)</label>
            <input type="number" id="reg-amount" step="0.01" min="5" max="50000" value="100.00" required oninput="updateRegistrarCalculations()">
          </div>
          <div class="form-group">
            <label>Litros Calculados</label>
            <input type="number" id="reg-liters" step="0.01" readonly style="background:#f8fafc;font-weight:700" value="15.17">
          </div>
        </div>

        <!-- Seção 6: Utilização de Cashback (Regra de Resgate Mínimo R$ 10,00) -->
        <div class="form-group" style="background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="margin:0;font-weight:700;font-size:12px">Resgate de Cashback para Desconto</label>
            <span style="font-size:10px;font-weight:700;color:${canRedeem ? '#15803d' : '#94a3b8'}">
              ${canRedeem ? 'Habilitado (≥ R$ 10)' : 'Mínimo R$ 10,00'}
            </span>
          </div>

          ${!canRedeem ? `
            <div style="font-size:11px;color:var(--text-muted);background:#f1f5f9;padding:8px 10px;border-radius:8px">
              🔒 O cliente precisa acumular pelo menos <b>${money(minRedemption)}</b> para habilitar o resgate. Saldo atual: ${money(customerData.balance)}.
            </div>
            <input type="hidden" id="reg-discount" value="0">
          ` : preRequested > 0 ? `
            <div style="display:flex;align-items:center;justify-content:space-between;background:#ecfdf5;border:1px solid #a7f3d0;padding:8px 10px;border-radius:8px">
              <div>
                <b style="font-size:13px;color:#065f46">Desconto Pré-solicitado pelo Cliente:</b>
                <div style="font-size:11px;color:#047857">Confirmado no QR Code do aplicativo</div>
              </div>
              <b style="font-size:15px;color:#15803d">- ${money(preRequested)}</b>
            </div>
            <input type="hidden" id="reg-discount" value="${preRequested}">
          ` : `
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <input type="checkbox" id="reg-use-discount-toggle" onchange="toggleRegDiscountInput()">
                <label for="reg-use-discount-toggle" style="margin:0;font-size:12px;cursor:pointer">Cliente solicitou utilizar saldo acumulado</label>
              </div>
              <div id="reg-discount-input-box" style="display:none;margin-top:6px">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:12px;font-weight:700">R$</span>
                  <input type="number" id="reg-discount" step="0.01" min="0" max="${customerData.balance}" value="0.00" oninput="updateRegistrarCalculations()" style="flex:1">
                  <button type="button" class="btn btn-sm btn-outline" onclick="setRegDiscountMax()">Usar Máx</button>
                </div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:4px">
                  Saldo disponível: ${money(customerData.balance)} (Não pode exceder o valor do abastecimento)
                </div>
              </div>
            </div>
          `}
        </div>

        <!-- Prévia do Cashback e Resumo Financeiro -->
        <div style="background:#f5f3ff;border:1px dashed var(--primary);border-radius:12px;padding:12px;margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted)">
            <span>Valor Registrado (Bomba):</span>
            <b id="prev-gross" style="color:#0f172a">R$ 100,00</b>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--red);margin-top:3px">
            <span>Desconto Cashback:</span>
            <b id="prev-discount">R$ 0,00</b>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:800;border-top:1px dashed #cbd5e1;padding-top:6px;margin-top:4px">
            <span>Valor Restante a Pagar:</span>
            <b id="prev-net" style="color:var(--primary)">R$ 100,00</b>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#15803d;font-weight:700;margin-top:6px">
            <span>✨ Cashback de 3% a Ganhar:</span>
            <b id="prev-cashback">+ R$ 3,00</b>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--blue);font-weight:600;margin-top:2px">
            <span>⭐ Pontos a Ganhar:</span>
            <b id="prev-points">+ 100 pts</b>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary" style="background:linear-gradient(135deg, #562f82 0%, #0082ca 100%)">
            CONTINUAR ➔
          </button>
        </div>
      </form>
    </div>
  `);

  updateRegistrarCalculations();
}

function toggleRegDiscountInput() {
  const chk = document.querySelector('#reg-use-discount-toggle');
  const box = document.querySelector('#reg-discount-input-box');
  const input = document.querySelector('#reg-discount');
  if (!chk || !box) return;

  if (chk.checked) {
    box.style.display = 'block';
    if (input) input.value = Math.min(10, currentCustomerSession.balance).toFixed(2);
  } else {
    box.style.display = 'none';
    if (input) input.value = '0.00';
  }
  updateRegistrarCalculations();
}

function setRegDiscountMax() {
  const input = document.querySelector('#reg-discount');
  const grossInput = document.querySelector('#reg-amount');
  if (!input || !currentCustomerSession) return;
  const gross = Number(grossInput ? grossInput.value : 100) || 0;
  const maxDisc = Math.min(currentCustomerSession.balance, gross);
  input.value = maxDisc.toFixed(2);
  updateRegistrarCalculations();
}

function updateRegistrarCalculations() {
  const fuelSel = document.querySelector('#reg-fuel');
  const amountInput = document.querySelector('#reg-amount');
  const litersInput = document.querySelector('#reg-liters');
  const discountInput = document.querySelector('#reg-discount');

  const prevGross = document.querySelector('#prev-gross');
  const prevDiscount = document.querySelector('#prev-discount');
  const prevNet = document.querySelector('#prev-net');
  const prevCashback = document.querySelector('#prev-cashback');
  const prevPoints = document.querySelector('#prev-points');

  if (!fuelSel || !amountInput) return;

  const price = Number(fuelSel.options[fuelSel.selectedIndex].getAttribute('data-price')) || 6.59;
  const gross = Number(amountInput.value) || 0;
  let discount = Number(discountInput ? discountInput.value : 0) || 0;

  if (currentCustomerSession) {
    discount = Math.min(discount, currentCustomerSession.balance);
  }
  discount = Math.min(discount, gross);

  const net = Math.max(0, gross - discount);
  const liters = price > 0 ? (gross / price).toFixed(2) : '0.00';
  const cashback = (net * (SYSTEM_CONFIG.cashbackRate || 0.03)).toFixed(2);
  const points = Math.floor(net * (SYSTEM_CONFIG.pointsPerReal || 1));

  if (litersInput) litersInput.value = liters;
  if (prevGross) prevGross.textContent = money(gross);
  if (prevDiscount) prevDiscount.textContent = discount > 0 ? `- ${money(discount)}` : 'R$ 0,00';
  if (prevNet) prevNet.textContent = money(net);
  if (prevCashback) prevCashback.textContent = `+ ${money(cashback)}`;
  if (prevPoints) prevPoints.textContent = `+ ${points} pts`;
}

// Ação do Botão "CONTINUAR" — Cria operação pendente sem creditar benefício ainda (Requisito 4)
async function handleRegistrarContinuar(e) {
  e.preventDefault();
  const fuelSel = document.querySelector('#reg-fuel');
  const amountInput = document.querySelector('#reg-amount');
  const litersInput = document.querySelector('#reg-liters');
  const discountInput = document.querySelector('#reg-discount');
  const submitBtn = e.target.querySelector('button[type="submit"]') || document.querySelector('#form-registrar-abastecimento button[type="submit"]');

  const fuel = fuelSel.value;
  const price = Number(fuelSel.options[fuelSel.selectedIndex].getAttribute('data-price')) || 6.59;
  const amount = Number(amountInput.value) || 0;
  let discount = Number(discountInput ? discountInput.value : 0) || 0;

  if (amount <= 0) {
    toast('Informe um valor de abastecimento válido.');
    return;
  }

  if (currentCustomerSession) {
    discount = Math.min(discount, currentCustomerSession.balance);
  }
  discount = Math.min(discount, amount);
  const netPaid = Math.round((amount - discount) * 100) / 100;
  const liters = Number(litersInput ? litersInput.value : (amount / price).toFixed(2));
  const cashbackEarned = Math.round(netPaid * (SYSTEM_CONFIG.cashbackRate || 0.03) * 100) / 100;
  const pointsEarned = Math.floor(netPaid * (SYSTEM_CONFIG.pointsPerReal || 1));

  let pendingDbId = null;
  let pendingCode = 'GO-PEND-' + Math.floor(100000 + Math.random() * 900000);

  // Registrar atomicamente no Supabase como PENDENTE (sem crédito ainda)
  if (window._supabaseClient && state.attendantUser) {
    const origText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Registrando pendência no Supabase...</span>';
    }

    try {
      const postoDbId = state.attendantUser.stationId 
        ? (STATION_DB_MAP[state.attendantUser.stationId] || state.attendantUser.stationId)
        : 'a1b2c3d4-0001-4000-8000-000000000001';

      const { data, error } = await window._supabaseClient.rpc('iniciar_abastecimento_pendente', {
        p_token_codigo: (currentCustomerSession && currentCustomerSession.tokenCode) || 'TK-GO-MANUAL',
        p_posto_id: postoDbId,
        p_funcionario_id: state.attendantUser.id || 'fc7afcfe-fcde-4250-8efe-520b3d455b02',
        p_tipo_combustivel: fuel,
        p_litros: liters,
        p_valor_litro: price,
        p_valor_total: amount,
        p_desconto_solicitado: discount
      });

      if (error) {
        toast('Erro ao registrar no Supabase: ' + error.message);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
        return;
      }

      if (data) {
        pendingDbId = data.abastecimento_id;
        pendingCode = data.codigo_transacao;
      }
    } catch (err) {
      console.warn('[Pendente RPC fallback]', err.message);
    }
  }

  // Cria operação pendente no estado da interface (NÃO credita cashback neste momento)
  state.pendingOperation = {
    dbId: pendingDbId,
    id: pendingCode,
    status: 'PENDENTE',
    customerName: currentCustomerSession.name,
    maskedCard: currentCustomerSession.maskedCard,
    station: state.attendantUser ? state.attendantUser.stationName : 'Posto Marcos Zagury (Matriz)',
    stationCity: state.attendantUser ? state.attendantUser.stationCity : 'Parintins - AM',
    attendant: `${state.attendantUser ? state.attendantUser.name : 'Operador de Pista'} (Matrícula #${state.attendantUser ? state.attendantUser.registration : '01'})`,
    fuel: fuel,
    liters: liters,
    pricePerLiter: price,
    amount: amount,
    cashbackUsed: discount,
    netPaid: netPaid,
    cashbackEarned: cashbackEarned,
    pointsEarned: pointsEarned,
    paymentMethod: 'Cartão de Crédito',
    createdAt: new Date().toISOString()
  };

  saveState();
  openConfirmacaoFinalModal();
}

// 5. Confirmação Final (Requisito 5)
function openConfirmacaoFinalModal() {
  const op = state.pendingOperation;
  if (!op) {
    toast('Nenhuma operação pendente para confirmar.');
    return;
  }

  openModal(`
    <div style="padding:4px 0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Passo 2 de 2</span>
          <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:var(--primary);margin:0">
            Confirmação Final
          </h2>
        </div>
        <span class="status-badge-mini status-yellow">⏳ Operação Pendente</span>
      </div>

      <!-- Banner de Instrução Obrigatório (Requisito 5) -->
      <div class="pending-instruction-banner">
        <div style="font-size:18px;margin-bottom:4px">⚠️</div>
        <p style="margin:0;font-weight:700">
          "Realize o abastecimento normalmente. Após a conclusão do pagamento, confirme a operação."
        </p>
      </div>

      <!-- Resumo da Operação para Conferência -->
      <div style="background:#f8fafc;border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
          <span style="color:var(--text-muted)">Cliente:</span>
          <b style="color:#0f172a">${esc(op.customerName)} (${esc(op.maskedCard)})</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
          <span style="color:var(--text-muted)">Combustível:</span>
          <b style="color:#0f172a">${esc(op.fuel)} (${op.liters} L)</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
          <span style="color:var(--text-muted)">Valor Registrado:</span>
          <b style="color:#0f172a">${money(op.amount)}</b>
        </div>
        ${op.cashbackUsed > 0 ? `
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;color:var(--red)">
            <span>Desconto Utilizado:</span>
            <b>- ${money(op.cashbackUsed)}</b>
          </div>
        ` : ''}
        <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:800;border-top:1px dashed #cbd5e1;padding-top:8px;margin-top:6px">
          <span style="color:#0f172a">VALOR A COBRAR:</span>
          <b style="color:var(--primary);font-size:16px">${money(op.netPaid)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#15803d;font-weight:700;margin-top:8px">
          <span>✨ Cashback Previsto (+3%):</span>
          <b>+ ${money(op.cashbackEarned)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--blue);font-weight:600;margin-top:2px">
          <span>⭐ Pontuação Prevista:</span>
          <b>+ ${op.pointsEarned} pontos</b>
        </div>
      </div>

      <!-- Forma de Pagamento Recebida -->
      <div class="form-group" style="margin-bottom:14px">
        <label>Forma de Pagamento Confirmada na Maquininha</label>
        <select id="confirm-payment-method">
          <option value="Cartão de Crédito">Cartão de Crédito (Maquininha Aprovada)</option>
          <option value="Cartão de Débito">Cartão de Débito (Maquininha Aprovada)</option>
          <option value="PIX">PIX Aprovado</option>
          <option value="Dinheiro">Dinheiro em Espécie Recebido</option>
        </select>
      </div>

      <!-- Botões de Ação: Corrigir, Cancelar e Confirmar (Requisito 5) -->
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button type="button" class="btn btn-outline" onclick="corrigirOperacaoPendente()" style="flex:1;font-size:12px;padding:10px">
          ✏️ Corrigir Valor
        </button>
        <button type="button" class="btn btn-outline" onclick="cancelarOperacaoPendente()" style="flex:1;font-size:12px;padding:10px;color:var(--red);border-color:#fca5a5">
          ✕ Cancelar Operação
        </button>
      </div>

      <button type="button" id="btn-final-confirm" class="btn btn-primary" onclick="confirmarAbastecimentoFinal()" style="width:100%;padding:14px;font-size:14px;background:linear-gradient(135deg, #16a34a 0%, #15803d 100%)">
        ${icon('check')} CONFIRMAR ABASTECIMENTO E PAGAMENTO
      </button>
    </div>
  `);
}

function corrigirOperacaoPendente() {
  const op = state.pendingOperation;
  if (!op || !currentCustomerSession) {
    closeModal();
    return;
  }
  openRegistrarAbastecimentoModal(currentCustomerSession);
}

function cancelarOperacaoPendente() {
  if (state.pendingOperation) {
    state.pendingOperation.status = 'CANCELADO';
    state.pendingOperation = null;
    saveState();
  }
  closeModal();
  toast('Operação pendente cancelada. Nenhuma cobrança ou reserva foi efetuada.');
}

// Confirmação atômica e sincronização em tempo real (Fases 3, 4 e 7)
async function confirmarAbastecimentoFinal() {
  if (isConfirmingOperation) return; // Impede duplo clique

  const op = state.pendingOperation;
  if (!op || op.status !== 'PENDENTE') {
    toast('Operação não encontrada ou já confirmada.');
    return;
  }

  isConfirmingOperation = true;
  const btn = document.querySelector('#btn-final-confirm');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Gravando e sincronizando transação em tempo real...';
  }

  const paymentSelect = document.querySelector('#confirm-payment-method');
  if (paymentSelect) {
    op.paymentMethod = paymentSelect.value;
  }

  let finalData = null;
  let serverSyncTx = null;
  let serverSyncCustomer = null;

  // 1. Confirmação atômica no Hub de Sincronização Local do Servidor Node.js
  try {
    const syncRes = await fetch('/api/sync/abastecimento/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        op: op,
        paymentMethod: op.paymentMethod,
        tokenCode: (currentCustomerSession && currentCustomerSession.tokenCode) || op.id,
        attendantId: state.attendantUser ? state.attendantUser.id : 'fc7afcfe-fcde-4250-8efe-520b3d455b02'
      })
    });
    if (syncRes.ok) {
      const syncData = await syncRes.json();
      if (syncData.ok) {
        serverSyncTx = syncData.tx;
        serverSyncCustomer = syncData.customer;
      }
    }
  } catch (syncErr) {
    console.warn('[Sync Hub Confirmar Fallback]', syncErr.message);
  }

  // 2. Confirmação Real e Atômica no Supabase via RPC (se conectado)
  if (window._supabaseClient && op.dbId) {
    try {
      const { data, error } = await window._supabaseClient.rpc('confirmar_abastecimento_final', {
        p_abastecimento_id: op.dbId,
        p_forma_pagamento: op.paymentMethod
      });

      if (!error && data) {
        finalData = data;
      }
    } catch (err) {
      console.warn('[Confirmar RPC fallback]', err.message);
    }
  }

  // 3. Extrair dados finais confirmados
  const finalCode = finalData ? finalData.codigo_transacao : (serverSyncTx ? serverSyncTx.id : op.id.replace('PEND-', ''));
  const earnedCashback = finalData ? Number(finalData.cashback_creditado) : (serverSyncTx ? serverSyncTx.cashbackEarned : op.cashbackEarned);
  const usedCashback = finalData ? Number(finalData.cashback_utilizado) : (serverSyncTx ? serverSyncTx.cashbackUsed : op.cashbackUsed);
  const earnedPoints = finalData ? Number(finalData.pontos_creditados) : (serverSyncTx ? serverSyncTx.pointsEarned : op.pointsEarned);

  // 4. Montar objeto final da transação
  const tx = serverSyncTx || {
    id: finalCode,
    stationId: op.stationId || 'matriz-parintins',
    station: op.station,
    city: op.stationCity,
    attendant: op.attendant,
    customerId: op.clientId || (currentCustomerSession && currentCustomerSession.clientId) || 'CLI-0824',
    customerName: op.customerName,
    cardNumber: op.maskedCard,
    fuel: op.fuel,
    amount: op.amount,
    liters: op.liters,
    pricePerLiter: op.pricePerLiter,
    cashbackUsed: usedCashback,
    netPaid: op.netPaid,
    cashbackEarned: earnedCashback,
    pointsEarned: earnedPoints,
    paymentMethod: op.paymentMethod,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: 'Concluído'
  };

  // 5. Atualizar Estatísticas do Frentista
  state.attendantDailyStats = state.attendantDailyStats || { fillsCount: 0, totalAmount: 0, totalCashback: 0 };
  state.attendantDailyStats.fillsCount += 1;
  state.attendantDailyStats.totalAmount = Math.round((state.attendantDailyStats.totalAmount + op.amount) * 100) / 100;
  state.attendantDailyStats.totalCashback = Math.round((state.attendantDailyStats.totalCashback + earnedCashback) * 100) / 100;

  // 6. Adicionar ao Histórico do Frentista
  state.attendantFills = state.attendantFills || [];
  state.attendantFills.unshift({
    id: tx.id,
    time: tx.time,
    date: 'Hoje',
    customerName: tx.customerName,
    cardNumber: tx.cardNumber,
    fuel: tx.fuel,
    liters: tx.liters,
    amount: tx.amount,
    cashbackEarned: tx.cashbackEarned,
    discountUsed: tx.cashbackUsed,
    status: 'Concluído'
  });

  // 7. Atualizar dados do cliente se for sessão cliente ativa no mesmo dispositivo
  const newBalance = serverSyncCustomer ? Number(serverSyncCustomer.balance) : (finalData ? Number(finalData.novo_saldo_cashback) : Math.round((state.balance - usedCashback + earnedCashback) * 100) / 100);
  const newPoints = serverSyncCustomer ? Number(serverSyncCustomer.points) : (finalData ? Number(finalData.novo_saldo_pontos) : (state.points || 0) + earnedPoints);

  if (state.currentRole === 'customer') {
    state.balance = newBalance;
    state.points = newPoints;
    state.cashbackUsed = Math.round(((state.cashbackUsed || 0) + usedCashback) * 100) / 100;
    state.fills = state.fills || [];
    state.fills.unshift(tx);
  }

  // 8. Transmissão imediata via BroadcastChannel (mesmo navegador, abas cruzadas)
  try {
    if (window._goSyncChannel) {
      window._goSyncChannel.postMessage({
        type: 'ABASTECIMENTO_CONFIRMADO',
        tx: tx,
        clientId: tx.customerId,
        customer: {
          balance: newBalance,
          points: newPoints,
          cashbackUsed: usedCashback,
          fills: [tx]
        }
      });
    }
  } catch (e) {}

  // 9. Limpar operação pendente e invalidar token
  state.pendingOperation = null;
  if (currentFuelToken) {
    currentFuelToken.used = true;
  }
  saveState();

  isConfirmingOperation = false;

  // Exibir Recibo de Sucesso
  showReceiptModal(tx);
  toast('✓ Abastecimento confirmado e sincronizado com sucesso!');

  // Atualizar dados em segundo plano
  if (window._supabaseClient) {
    if (state.currentRole === 'attendant') loadAttendantDataFromSupabase();
    if (state.currentRole === 'customer') loadCustomerDataFromSupabase();
    if (state.currentRole === 'owner') loadOwnerDataFromSupabase(state.ownerFilterStation || 'all', state.ownerFilterPeriod || 'today');
  }
}

// Comprovante Digital do Abastecimento
function showReceiptModal(tx) {
  const isAttendant = state.currentRole === 'attendant';

  openModal(`
    <div class="receipt-wrapper">
      <div class="receipt-header-icon">
        ${icon('check')}
      </div>
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary);text-align:center;margin-bottom:4px">
        Abastecimento Concluído!
      </h2>
      <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-bottom:14px">
        Operação confirmada pelo operador autorizado
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px;text-align:center;margin-bottom:14px">
        <div style="font-size:11px;color:#16a34a;font-weight:700;text-transform:uppercase">Benefícios Recebidos</div>
        <div style="font-size:18px;font-weight:900;color:#15803d;margin:2px 0">
          + ${money(tx.cashbackEarned)} de Cashback
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--blue)">
          + ${tx.pointsEarned} Pontos no Clube
        </div>
      </div>

      <div style="font-size:12px;display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;justify-content:space-between;color:var(--text-muted)">
          <span>Cliente:</span>
          <b style="color:#0f172a">${esc(tx.customerName || state.name)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;color:var(--text-muted)">
          <span>Posto:</span>
          <b style="color:#0f172a">${esc(tx.station)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;color:var(--text-muted)">
          <span>Combustível / Litros:</span>
          <b style="color:#0f172a">${esc(tx.fuel)} (${tx.liters} L)</b>
        </div>
        <div style="display:flex;justify-content:space-between;color:var(--text-muted)">
          <span>Valor Bomba:</span>
          <b style="color:#0f172a">${money(tx.amount)}</b>
        </div>
        ${tx.cashbackUsed > 0 ? `
          <div style="display:flex;justify-content:space-between;color:var(--red)">
            <span>Cashback Utilizado:</span>
            <b>- ${money(tx.cashbackUsed)}</b>
          </div>
        ` : ''}
        <div style="display:flex;justify-content:space-between;border-top:1px dashed #cbd5e1;padding-top:6px;font-weight:800;font-size:14px">
          <span>Total Pago:</span>
          <span style="color:var(--primary)">${money(tx.netPaid)} (${esc(tx.paymentMethod)})</span>
        </div>
        <div class="receipt-divider"></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
          <span>Novo Saldo Cashback:</span>
          <b style="color:#16a34a">${money(state.balance)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
          <span>Novo Saldo Pontos:</span>
          <b style="color:var(--blue)">${state.points} pts</b>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
          <span>Código PDV:</span>
          <code>${tx.id}</code>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
          <span>Operador:</span>
          <span>${esc(tx.attendant)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
          <span>Data / Hora:</span>
          <span>${tx.date.split('-').reverse().join('/')} às ${tx.time}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px">
        <button class="btn btn-outline" onclick="closeModal();render();">
          ${isAttendant ? 'Próximo Atendimento' : 'Concluir'}
        </button>
        <button class="btn btn-primary" onclick="closeModal();${isAttendant ? 'render()' : "go('Histórico')"};">
          ${isAttendant ? 'Ver no Painel' : 'Ver Histórico'}
        </button>
      </div>
    </div>
  `);
}

// 2. Redeem Reward
function redeemReward(index) {
  const r = rewards[index];
  if (!r || state.points < r.cost) return;

  openModal(`
    <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary);margin-bottom:6px">
      Confirmar Resgate
    </h2>
    <div style="text-align:center;padding:12px 0">
      <img src="${r.img}" style="max-height:120px;border-radius:12px;box-shadow:var(--shadow-sm);margin-bottom:12px" alt="${esc(r.title)}">
      <h3 style="font-size:16px;font-weight:800">${esc(r.title)}</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-top:4px">${esc(r.desc)}</p>
      <div style="font-size:20px;font-weight:800;color:var(--primary);margin:14px 0">
        ${r.cost} Pontos
      </div>
    </div>

    <div style="display:flex;gap:10px">
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="executeRedeem(${index})">Confirmar Resgate</button>
    </div>
  `);
}

function executeRedeem(index) {
  const r = rewards[index];
  if (!r || state.points < r.cost) return;

  state.points -= r.cost;
  const code = 'OLIVEIRA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  state.redemptions.push({
    title: r.title,
    cost: r.cost,
    code,
    date: new Date().toISOString()
  });

  saveState();
  closeModal();
  render();

  openModal(`
    <div style="text-align:center;padding:10px 0">
      <div style="font-size:42px;margin-bottom:8px">🎉</div>
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">Vantagem Resgatada!</h2>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 16px">Apresente este voucher no caixa de qualquer Posto Grupo Oliveira:</p>
      <div style="background:#f5f3ff;border:2px dashed var(--primary);border-radius:var(--radius-md);padding:16px;margin-bottom:16px">
        <span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">CÓDIGO DE LIBERAÇÃO</span>
        <div style="font-family:monospace;font-size:24px;font-weight:900;color:var(--primary);letter-spacing:2px;margin-top:4px">${code}</div>
      </div>
      <button class="btn btn-primary" onclick="closeModal();go('Prêmios')">Ver Meus Resgates</button>
    </div>
  `);
}

// 3. Digital Card QR Modal (Abre o QR Code dinâmico seguro para o frentista ler)
function openCardQR() {
  openAbastecerModal();
}

// 4. Promo Modal
function openPromoModal(promoId) {
  let title = 'Campanha Oficial Grupo Oliveira';
  let img = 'assets/img/media/post_feed.webp';
  let text = 'Com o Clube de Benefícios do Grupo Oliveira, você economiza sempre que abastece em Parintins, Barreirinha, Nhamundá e Terra Santa. Acumule cashback e troque por combustíveis e prêmios na hora.';

  if (promoId === 'postos-oliveira') {
    title = 'Presença Regional em Expansão';
    img = 'assets/img/media/story_banner.webp';
    text = 'Nossa identidade visual reflete inovação, dinamismo e proximidade com as comunidades do Baixo Amazonas. O símbolo representa nossa localização, as iniciais G&O e a gota de combustível.';
  }

  openModal(`
    <div style="text-align:center">
      <img src="${img}" style="width:100%;max-height:360px;object-fit:cover;border-radius:14px;box-shadow:var(--shadow-sm);margin-bottom:14px" alt="${title}">
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">${title}</h2>
      <p style="font-size:13px;color:var(--text-muted);margin:10px 0 18px;line-height:1.6">${text}</p>
      <button class="btn btn-primary" onclick="openAbastecerModal()">Abastecer Agora e Ganhar</button>
    </div>
  `);
}

// 5. Notifications
function openNotifications() {
  go('Notificações');
}

// 6. Edit Profile Modal
function openEditProfile() {
  openModal(`
    <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary);margin-bottom:6px">
      Editar Meus Dados
    </h2>
    <div style="display:flex;align-items:center;gap:14px;margin:12px 0 16px;padding:12px;background:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;">
      <img src="${state.avatarUrl || 'assets/img/brand/icon-192.png'}" alt="Foto de Perfil Oficial" style="width:52px;height:52px;border-radius:14px;object-fit:contain;background:#1C0B2F;border:2px solid rgba(86,47,130,0.25);box-shadow:0 4px 12px rgba(86,47,130,0.2);">
      <div>
        <div style="font-size:13px;font-weight:700;color:#0f172a">Foto do Perfil Oficial</div>
        <div style="font-size:11px;color:#64748b">Emblema Oficial Clube Grupo Oliveira</div>
      </div>
    </div>
    <form onsubmit="handleProfileUpdate(event)">
      <div class="form-group">
        <label>Nome Completo</label>
        <input name="name" required value="${esc(state.name)}">
      </div>
      <div class="form-group">
        <label>Veículo Principal</label>
        <input name="vehicle" required value="${esc(state.vehicle)}">
      </div>
      <div class="form-group">
        <label>Placa</label>
        <input name="plate" required value="${esc(state.plate)}" style="text-transform:uppercase">
      </div>
      <button type="submit" class="btn btn-primary">Salvar Alterações</button>
    </form>
  `);
}

function handleProfileUpdate(e) {
  e.preventDefault();
  const d = new FormData(e.target);
  state.name = d.get('name').trim();
  state.vehicle = d.get('vehicle').trim();
  state.plate = d.get('plate').trim().toUpperCase();
  saveState();
  closeModal();
  render();
  toast('Perfil atualizado com sucesso!');
}

// 7. Vehicles Modal
function openVehiclesModal() {
  openModal(`
    <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary);margin-bottom:6px">
      Meus Veículos
    </h2>
    <div style="margin-bottom:16px">
      ${state.vehicles.map((v, i) => `
        <div style="background:#f8fafc;border-radius:var(--radius-sm);padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--border)">
          <div>
            <b>${esc(v.model)}</b>
            <div style="font-size:11px;color:var(--text-muted)">Placa: ${esc(v.plate)}</div>
          </div>
          <span style="font-size:11px;background:#e0f2fe;color:#0284c7;font-weight:700;padding:4px 8px;border-radius:4px">
            Ativo
          </span>
        </div>
      `).join('')}
    </div>

    <form onsubmit="handleAddVehicle(event)" style="border-top:1px solid var(--border);padding-top:14px">
      <h3 style="font-size:14px;font-weight:700;margin-bottom:8px">Adicionar Novo Veículo</h3>
      <div class="form-group">
        <input name="model" required placeholder="Modelo (Ex.: Toyota Hilux / Motocicleta)">
      </div>
      <div class="form-group">
        <input name="plate" required placeholder="Placa (Ex.: ABC1D23)" style="text-transform:uppercase">
      </div>
      <button type="submit" class="btn btn-primary">${icon('plus')} Cadastrar Veículo</button>
    </form>
  `);
}

function handleAddVehicle(e) {
  e.preventDefault();
  const d = new FormData(e.target);
  const model = d.get('model').trim();
  const plate = d.get('plate').trim().toUpperCase();
  if (!model || !plate) return;

  state.vehicles.push({ model, plate });
  saveState();
  closeModal();
  render();
  toast('Veículo cadastrado!');
}

// 8. Sorteios
function openSorteios() {
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <div style="font-size:42px;margin-bottom:8px">🏆</div>
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">
        Sorteios Grupo Oliveira
      </h2>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 16px">
        A cada R$ 50 em abastecimentos nas nossas unidades, você ganha 1 cupom da sorte para concorrer a prêmios mensais!
      </p>

      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:var(--radius-md);padding:14px;text-align:left;margin-bottom:16px">
        <b style="color:#b45309;font-size:13px">Próximo Sorteio:</b>
        <div style="font-size:15px;font-weight:800;color:#78350f;margin:4px 0">1 Ano de Tanque Cheio Grátis 🚗</div>
        <small style="color:#92400e">Data do sorteio: Final do mês • Válido para todas as cidades participantes</small>
      </div>

      <button class="btn btn-primary" onclick="openAbastecerModal()">Abastecer e Gerar Cupons</button>
    </div>
  `);
}

// 9. About Modal
function openAboutModal() {
  openModal(`
    <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary);margin-bottom:8px">
      Sobre o Grupo Oliveira
    </h2>
    <p style="font-size:13px;color:var(--text-muted);line-height:1.7;margin-bottom:14px">
      A identidade visual do <b>Grupo Oliveira</b> reflete sua expansão e compromisso absoluto com a qualidade.
    </p>
    <p style="font-size:13px;color:var(--text-muted);line-height:1.7;margin-bottom:14px">
      Os três elementos centrais de nossa marca são:
    </p>
    <ul style="font-size:13px;color:var(--text-muted);line-height:1.7;padding-left:20px;margin-bottom:16px">
      <li><b>Símbolo de Localização (Pin):</b> Representa a presença forte e em constante crescimento da marca.</li>
      <li><b>Letras G & O:</b> Fazem referência direta ao nome do Grupo Oliveira.</li>
      <li><b>Gota de Combustível:</b> Simboliza o foco e excelência no setor de abastecimento.</li>
    </ul>
    <p style="font-size:12px;color:var(--primary);font-weight:700">
      Cidades Atendidas: Parintins-AM, Barreirinha-AM, Nhamundá-AM e Terra Santa-PA.
    </p>
  `);
}

// 10. Modais dos Cards de Métricas
function openRecargaModal() {
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <img src="assets/img/icons/icon_car.png" style="height:52px;margin-bottom:12px;display:inline-block" alt="Recarga Elétrica">
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">
        Crédito Recarga Elétrica
      </h2>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 16px;line-height:1.5">
        Ponto de recarga rápida e sustentável para veículos elétricos e híbridos disponível na <b>Matriz Parintins (Av. Marcos Zagury, 455)</b>.
      </p>
      <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:16px">
        <span style="font-size:11px;color:var(--text-muted);display:block;text-transform:uppercase;font-weight:700">CRÉDITO DISPONÍVEL</span>
        <b style="font-size:28px;color:var(--primary);font-family:var(--font-heading)">R$ 0,00</b>
      </div>
      <button class="btn btn-primary" onclick="closeModal()">Fechar</button>
    </div>
  `);
}

function openCashbackModal() {
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <img src="assets/img/icons/icon_cash.png" style="height:52px;margin-bottom:12px;display:inline-block" alt="Saldo Cashback">
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">
        Saldo de Cashback
      </h2>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 16px;line-height:1.5">
        Você recebe <b>3% de volta</b> automaticamente a cada abastecimento registrado na rede Grupo Oliveira.
      </p>
      <div style="background:#f5f3ff;border:2px dashed var(--primary);border-radius:var(--radius-md);padding:16px;margin-bottom:16px">
        <span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700">SALDO DISPONÍVEL NA CARTEIRA</span>
        <div style="font-size:30px;font-weight:900;color:var(--primary);font-family:var(--font-heading);margin-top:4px">${money(state.balance)}</div>
      </div>
      <button class="btn btn-primary" onclick="closeModal();openAbastecerModal()">Abastecer e Acumular Mais</button>
    </div>
  `);
}

function openCashbackUsedModal() {
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <img src="assets/img/icons/icon_cash.png" style="height:52px;margin-bottom:12px;display:inline-block" alt="Cashback Utilizado">
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">
        Cashback Utilizado
      </h2>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 16px;line-height:1.5">
        Total de cashback que você já resgatou ou aplicou em descontos nos seus abastecimentos.
      </p>
      <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;margin-bottom:16px">
        <span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700">TOTAL UTILIZADO</span>
        <div style="font-size:30px;font-weight:900;color:var(--blue);font-family:var(--font-heading);margin-top:4px">${money(state.cashbackUsed || 0)}</div>
      </div>
      <button class="btn btn-primary" onclick="closeModal()">Fechar</button>
    </div>
  `);
}

function openSavingsModal() {
  const totalSaved = state.fills.reduce((sum, f) => sum + (f.amount * 0.03), 0) + (state.cashbackUsed || 0);
  openModal(`
    <div style="text-align:center;padding:10px 0">
      <img src="assets/img/icons/icon_tag.png" style="height:52px;margin-bottom:12px;display:inline-block" alt="Total Economizado">
      <h2 style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:var(--primary)">
        Total Economizado
      </h2>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 16px;line-height:1.5">
        Economia real acumulada através do Clube de Benefícios Grupo Oliveira.
      </p>
      <div style="background:#ecfdf5;border:2px dashed #10b981;border-radius:var(--radius-md);padding:16px;margin-bottom:16px">
        <span style="font-size:11px;color:#047857;text-transform:uppercase;font-weight:700">RETORNO NO SEU BOLSO</span>
        <div style="font-size:30px;font-weight:900;color:#059669;font-family:var(--font-heading);margin-top:4px">${money(totalSaved)}</div>
      </div>
      <button class="btn btn-primary" onclick="closeModal();go('Histórico')">Ver Histórico de Compras</button>
    </div>
  `);
}

// 11. Instagram redirection
function openInstagram() {
  window.open('https://www.instagram.com/grupooliveirapin', '_blank');
}

// 11. Export CSV
function exportCSV() {
  if (!state.fills.length) {
    toast('Nenhum abastecimento registrado para exportar.');
    return;
  }
  const headers = ['Codigo', 'Data', 'Hora', 'Posto', 'Cidade', 'Combustivel', 'Litros', 'Valor_Bomba_RS', 'Cashback_Utilizado_RS', 'Valor_Pago_RS', 'Cashback_Ganho_RS', 'Pontos_Ganhos', 'Forma_Pagamento', 'Status'];
  const rows = state.fills.map(f => {
    const amount = Number(f.amount) || 0;
    const cashbackUsed = Number(f.cashbackUsed) || 0;
    const netPaid = Number(f.netPaid !== undefined ? f.netPaid : (amount - cashbackUsed));
    const cashbackEarned = Number(f.cashbackEarned !== undefined ? f.cashbackEarned : (amount * 0.03));
    const pointsEarned = Number(f.pointsEarned !== undefined ? f.pointsEarned : Math.floor(netPaid));
    const liters = Number(f.liters || 0);

    return [
      f.id || 'GO-PDV',
      f.date || '',
      f.time || '12:00',
      `"${f.station}"`,
      `"${f.city || 'Parintins - AM'}"`,
      `"${f.fuel}"`,
      liters.toFixed(2).replace('.', ','),
      amount.toFixed(2).replace('.', ','),
      cashbackUsed.toFixed(2).replace('.', ','),
      netPaid.toFixed(2).replace('.', ','),
      cashbackEarned.toFixed(2).replace('.', ','),
      pointsEarned,
      `"${f.paymentMethod || 'Cartão'}"`,
      `"${f.status || 'Concluído'}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `abastecimentos-grupo-oliveira-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Relatório CSV auditável exportado com sucesso!');
}

// ========================================================
// MÓDULO: DIVULGAÇÃO, CADASTROS E INDICAÇÕES
// ========================================================

function setOwnerOriginFilter(origin) {
  state.ownerFilterOrigin = origin || 'all';
  saveState();
  render();
}

// 1. Verificação Automática de Parâmetros de URL, Instalação PWA e Abertura de Boas-Vindas
function checkUrlReferralAndWelcome() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let refParam = urlParams.get('ref') || urlParams.get('r') || urlParams.get('posto');
    const indParam = urlParams.get('ind') || urlParams.get('indicador') || urlParams.get('amigo');
    const isCadastroPath = window.location.pathname.includes('/cadastro') || window.location.pathname.includes('/convite');
    const roleParam = urlParams.get('role');
    // Se o usuário está no painel de proprietário/frentista ou autenticado, não exibir modal de boas-vindas
    if (roleParam === 'owner' || roleParam === 'attendant' || state.currentRole === 'owner' || state.currentRole === 'attendant' || (state.authSession && !isCadastroPath)) {
      return;
    }

    const explicitQueryRef = urlParams.get('ref') || urlParams.get('r') || urlParams.get('posto');
    if (explicitQueryRef || indParam || isCadastroPath) {
      let station = null;
      let friendId = null;

      if (refParam) {
        if (refParam.startsWith('ind-')) {
          friendId = refParam.replace('ind-', '');
        } else {
          station = getStationByRef(refParam);
          if (!station && (refParam.startsWith('CLI-') || refParam.startsWith('cli-'))) {
            friendId = refParam;
          }
        }
      }

      if (indParam) {
        friendId = indParam.replace('ind-', '');
      }

      let friendName = null;
      if (friendId) {
        const found = (state.registeredClients || []).find(c => c.id.toLowerCase() === friendId.toLowerCase());
        friendName = found ? found.name : (friendId === state.clientId ? state.name : 'Seu Amigo');
      }

      state.pendingRegistrationContext = {
        stationId: station ? station.id : null,
        stationName: station ? station.name : null,
        stationCity: station ? station.city : null,
        referrerId: friendId || null,
        referrerName: friendName || null
      };

      setTimeout(() => {
        openWelcomeModal(state.pendingRegistrationContext);
      }, 350);
    }
  } catch (e) {
    console.warn('Erro ao verificar parâmetros de indicação:', e);
  }
}

// 2. Modal Oficial de Boas-Vindas (Requisito 2)
function openWelcomeModal(refContext) {
  const ctx = refContext || state.pendingRegistrationContext || {};
  const originStation = ctx.stationName ? ctx.stationName : (ctx.stationId ? (getStationByRef(ctx.stationId)?.name || 'Rede de Postos') : null);
  const friendName = ctx.referrerName || (ctx.referrerId ? 'Seu Amigo' : null);

  openModal(`
    <div class="welcome-modal-container">
      <div class="welcome-hero">
        <img src="assets/img/brand/clean_logo_white.png" class="welcome-logo" alt="Grupo Oliveira">
        
        ${originStation ? `
          <div class="welcome-unit-pill">
            ${icon('pin')}
            <span>${esc(originStation)}</span>
          </div>
        ` : (friendName ? `
          <div class="welcome-unit-pill">
            ${icon('user')}
            <span>Indicação de: ${esc(friendName)}</span>
          </div>
        ` : `
          <div class="welcome-unit-pill">
            ${icon('star')}
            <span>Rede de Postos Grupo Oliveira</span>
          </div>
        `)}

        <h2 class="welcome-title">BEM-VINDO AO GRUPO OLIVEIRA!</h2>
        <p class="welcome-sub">
          Abasteça, acumule cashback e economize em toda a nossa rede de postos.
        </p>
      </div>

      <div class="welcome-body">
        <div class="welcome-benefits-grid">
          <div class="welcome-benefit-card">
            <div class="benefit-icon purple">✨</div>
            <div class="benefit-title">3% de Cashback</div>
            <div class="benefit-desc">Acúmulo automático a cada abastecimento em qualquer unidade.</div>
          </div>
          <div class="welcome-benefit-card">
            <div class="benefit-icon blue">⛽</div>
            <div class="benefit-title">6 Postos Integrados</div>
            <div class="benefit-desc">Parintins, Barreirinha, Nhamundá e Terra Santa no mesmo cartão.</div>
          </div>
          <div class="welcome-benefit-card">
            <div class="benefit-icon gold">💳</div>
            <div class="benefit-title">Cartão Digital Instantâneo</div>
            <div class="benefit-desc">Seu QR Code individual gerado na hora no seu celular.</div>
          </div>
          <div class="welcome-benefit-card">
            <div class="benefit-icon red">🎁</div>
            <div class="benefit-title">Catálogo de Prêmios</div>
            <div class="benefit-desc">1 ponto por real gasto para trocar por brindes oficiais.</div>
          </div>
        </div>

        <div class="welcome-actions">
          <button type="button" class="btn-welcome-create" onclick="openRegisterModal()">
            <span>CRIAR MINHA CONTA</span>
            ${icon('arrow')}
          </button>
          <button type="button" class="btn-welcome-login" onclick="openLoginExistingModal()">
            JÁ TENHO UMA CONTA
          </button>
        </div>
      </div>
    </div>
  `);
}

// 3. Modal de Cadastro Único (Requisito 3 & 8)
function openRegisterModal() {
  const ctx = state.pendingRegistrationContext || {};
  const originStation = ctx.stationName || (ctx.stationId ? getStationByRef(ctx.stationId)?.name : null);
  const friendName = ctx.referrerName;

  openModal(`
    <div class="register-modal-content">
      <div class="register-head">
        <h2>Criar Conta no Clube</h2>
        <p style="font-size:12px;color:var(--text-muted);margin:0">
          Cadastro único válido em todas as 6 unidades do Grupo Oliveira
        </p>
      </div>

      ${originStation || friendName ? `
        <div class="register-origin-info">
          <span style="font-size:16px">${originStation ? '📍' : '🤝'}</span>
          <div style="flex:1;line-height:1.25">
            ${originStation ? `<b>Posto de Origem:</b> ${esc(originStation)}` : ''}
            ${originStation && friendName ? '<br>' : ''}
            ${friendName ? `<b>Indicado por:</b> ${esc(friendName)}` : ''}
          </div>
        </div>
      ` : ''}

      <form id="form-cadastro-unico" onsubmit="handleRegisterSubmit(event)" class="register-form-grid">
        <div class="reg-field-group">
          <label for="reg-name">Nome Completo *</label>
          <input type="text" id="reg-name" name="name" required class="reg-input" placeholder="Ex.: Lucas Albuquerque">
        </div>

        <div class="reg-field-group">
          <label for="reg-cpf">CPF (apenas números) *</label>
          <input type="text" id="reg-cpf" name="cpf" required class="reg-input" placeholder="000.000.000-00" maxlength="14" oninput="maskCPF(this)">
        </div>

        <div class="reg-field-group">
          <label for="reg-phone">Celular / WhatsApp *</label>
          <input type="tel" id="reg-phone" name="phone" required class="reg-input" placeholder="(92) 99999-9999" maxlength="15" oninput="maskPhone(this)">
        </div>

        <div class="reg-field-group">
          <label for="reg-email">E-mail *</label>
          <input type="email" id="reg-email" name="email" required class="reg-input" placeholder="seuemail@exemplo.com">
        </div>

        <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:10px">
          <div class="reg-field-group">
            <label for="reg-vehicle">Modelo do Veículo</label>
            <input type="text" id="reg-vehicle" name="vehicle" class="reg-input" placeholder="Ex.: Onix 1.0">
          </div>
          <div class="reg-field-group">
            <label for="reg-plate">Placa</label>
            <input type="text" id="reg-plate" name="plate" class="reg-input" placeholder="ABC-1234" maxlength="8" style="text-transform:uppercase">
          </div>
        </div>

        <div id="reg-error-msg" style="display:none;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:8px 12px;border-radius:10px;font-size:11.5px"></div>

        <div style="margin-top:10px;display:flex;gap:8px">
          <button type="button" class="btn btn-outline" onclick="closeModal()" style="flex:1">Cancelar</button>
          <button type="submit" class="btn btn-primary" style="flex:2;background:linear-gradient(135deg, var(--primary) 0%, #0082CA 100%)">
            Concluir Cadastro
          </button>
        </div>
      </form>
    </div>
  `);
}

function maskCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  input.value = v;
}

function maskPhone(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  input.value = v;
}

// Submissão do Cadastro Único com Proteções (Requisito 3 & 8)
function handleRegisterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const errorBox = document.querySelector('#reg-error-msg');
  if (errorBox) errorBox.style.display = 'none';

  const name = form.name.value.trim();
  const cpf = form.cpf.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const vehicle = form.vehicle.value.trim() || 'Veículo Passeio';
  const plate = (form.plate.value.trim() || 'PLACA-GO').toUpperCase();

  const ctx = state.pendingRegistrationContext || {};

  // Validação 1: CPF Duplicado
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) {
    if (errorBox) {
      errorBox.textContent = 'Por favor, informe um CPF válido com 11 dígitos.';
      errorBox.style.display = 'block';
    }
    return;
  }

  const existing = (state.registeredClients || []).find(c => 
    c.cpf.replace(/\D/g, '') === cleanCPF || 
    (c.email && c.email.toLowerCase() === email.toLowerCase())
  );

  if (existing) {
    if (errorBox) {
      errorBox.innerHTML = `Já existe um cadastro com este CPF (${existing.name}). <a href="javascript:void(0)" onclick="openLoginExistingModal()" style="font-weight:bold;color:#b91c1c;text-decoration:underline">Clique aqui para entrar</a>.`;
      errorBox.style.display = 'block';
    }
    return;
  }

  // Validação 2: Prevenção de Autoindicação
  if (ctx.referrerId && (ctx.referrerId === state.clientId || name.toLowerCase() === (ctx.referrerName || '').toLowerCase())) {
    ctx.referrerId = null;
    ctx.referrerName = null;
  }

  // Geração de Cartão Único e ID
  const newClientId = 'CLI-' + Math.floor(1000 + Math.random() * 9000);
  const part1 = '4589';
  const part2 = String(Math.floor(1000 + Math.random() * 9000));
  const part3 = String(Math.floor(1000 + Math.random() * 9000));
  const part4 = String(Math.floor(1000 + Math.random() * 9000));
  const newCardNumber = `${part1} ${part2} ${part3} ${part4}`;

  const originStationObj = ctx.stationId ? getStationByRef(ctx.stationId) : null;
  const originStationName = originStationObj ? originStationObj.name : (ctx.stationName || 'Posto Marcos Zagury (Matriz)');
  const originStationId = originStationObj ? originStationObj.id : (ctx.stationId || 'matriz-parintins');

  const newClientRecord = {
    id: newClientId,
    name: name,
    cardNumber: newCardNumber,
    phone: phone,
    email: email,
    cpf: cpf,
    vehicle: vehicle,
    plate: plate,
    originStationId: originStationId,
    originStationName: originStationName,
    referrerId: ctx.referrerId || null,
    referrerName: ctx.referrerName || null,
    registeredAt: new Date().toISOString()
  };

  state.registeredClients = state.registeredClients || [];
  state.registeredClients.push(newClientRecord);

  // Se veio por convite de amigo, criar registro de indicação
  if (ctx.referrerId) {
    state.referrals = state.referrals || [];
    state.referrals.unshift({
      id: 'REF-' + Math.floor(2000 + Math.random() * 8000),
      referrerId: ctx.referrerId,
      referrerName: ctx.referrerName || 'Amigo',
      referredId: newClientId,
      referredName: name,
      referredPhone: phone,
      referredCard: `${part1} •••• ${part4}`,
      originStationId: originStationId,
      originStationName: originStationName,
      status: 'Aguardando primeiro abastecimento', // Requisito 6
      createdAt: new Date().toISOString(),
      qualifiedAt: null,
      firstFillId: null,
      firstFillAmount: 0,
      rewardAmount: 0.00,
      rewardPaid: false
    });
  }

  // Ativar Sessão com o novo cliente
  state.name = name;
  state.clientId = newClientId;
  state.cardNumber = newCardNumber;
  state.vehicle = vehicle;
  state.plate = plate;
  state.balance = 0.00;
  state.points = 100; // Bônus de cadastro
  state.cashbackUsed = 0;
  state.vehicles = [{ model: vehicle, plate: plate }];
  state.currentRole = 'customer';
  state.pendingRegistrationContext = null;

  saveState();
  closeModal();
  render();

  toast(`🎉 Parabéns, ${esc(name.split(' ')[0])}! Sua conta foi criada com sucesso no Grupo Oliveira.`);
}

// 4. Modal para Cliente Já Cadastrado
function openLoginExistingModal() {
  openModal(`
    <div style="padding:20px;text-align:center">
      <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:var(--primary);margin-bottom:6px">
        Entrar na Minha Conta
      </h2>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">
        Informe seu CPF ou Número do Cartão para acessar
      </p>

      <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
        <div>
          <label style="font-size:11.5px;font-weight:700;color:#334155">CPF ou Número do Cartão</label>
          <input type="text" id="login-existing-input" class="reg-input" value="782.459.202-00" placeholder="Ex.: 4589 8210 3349 1204">
        </div>
        <button type="button" class="btn btn-primary" onclick="confirmLoginExisting()" style="padding:12px;margin-top:6px">
          Acessar Meu Cartão
        </button>
        <button type="button" class="btn btn-outline" onclick="openWelcomeModal()" style="padding:10px">
          Voltar
        </button>
      </div>
    </div>
  `);
}

function confirmLoginExisting() {
  const input = (document.querySelector('#login-existing-input')?.value || '').trim();
  const cleanInput = input.replace(/\D/g, '');

  const client = (state.registeredClients || []).find(c => 
    c.cpf.replace(/\D/g, '') === cleanInput || 
    c.cardNumber.replace(/\D/g, '') === cleanInput
  ) || state.registeredClients[0];

  if (client) {
    state.name = client.name;
    state.clientId = client.id;
    state.cardNumber = client.cardNumber;
    state.vehicle = client.vehicle || 'Chevrolet Onix 1.0';
    state.plate = client.plate || 'PHN-4B20';
    state.currentRole = 'customer';
    state.pendingRegistrationContext = null;
    saveState();
    closeModal();
    render();
    toast(`Bem-vindo de volta, ${esc(client.name.split(' ')[0])}!`);
  }
}

// 5. Painel do Frentista — "CONVIDAR CLIENTE / INSTALAÇÃO DO APP" (Requisitos 4 & 7)
function openFrentistaInviteModal() {
  const attendantStation = state.attendantUser ? (getStationByRef(state.attendantUser.stationId) || stations[0]) : stations[0];
  const stationInstallUrl = `${window.location.origin}/instalar?ref=${encodeURIComponent(attendantStation.id)}`;
  const qrBoxId = 'frentista-qr-canvas-box';

  openModal(`
    <div style="padding:18px 16px;text-align:center">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:#e0f2fe;color:#0284c7;font-size:22px;margin-bottom:8px">
        📲
      </div>
      <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:#0f172a;margin-bottom:2px">
        Instalação do App no Posto
      </h2>
      <div style="font-size:12px;color:var(--primary);font-weight:700">
        📍 ${esc(attendantStation.name)} • ${esc(attendantStation.city)}
      </div>
      <p style="font-size:11.5px;color:var(--text-muted);margin:4px 0 14px">
        O cliente escaneia este QR Code para instalar o aplicativo no celular com 3% de cashback válido em toda a rede.
      </p>

      <!-- QR Code Box -->
      <div class="qr-display-box">
        <div id="${qrBoxId}" class="qr-code-svg-render">
          <!-- Renderizado via QRCode -->
        </div>
        <div class="qr-share-url-box">
          ${esc(stationInstallUrl)}
        </div>
      </div>

      <!-- Botões de Ação do Frentista (Requisito 7) -->
      <div class="qr-buttons-row">
        <button type="button" class="btn-qr-action copy" onclick="copyToClipboard('${stationInstallUrl}', 'Link de instalação copiado!')">
          ${icon('copy')}
          <span>Copiar Link</span>
        </button>
        <button type="button" class="btn-qr-action whatsapp" onclick="shareStationInstallWhatsApp('${esc(attendantStation.name)}', '${stationInstallUrl}')">
          <span>WhatsApp</span>
        </button>
        <button type="button" class="btn-qr-action download" onclick="downloadQRCodePNG('${stationInstallUrl}', 'qrcode-instalar-${esc(attendantStation.id)}.png')">
          ${icon('download')}
          <span>Baixar QR</span>
        </button>
      </div>

      <div style="margin-top:14px">
        <button type="button" class="btn btn-outline" onclick="closeModal()" style="width:100%">Fechar</button>
      </div>
    </div>
  `);

  // Renderizar o QR Code no container
  renderQRCodeInElement(qrBoxId, stationInstallUrl);
}

// 6. Painel do Cliente — "CONVIDAR AMIGOS" (Requisito 5)
function openInviteFriendsModal() {
  const clientInviteUrl = `${window.location.origin}/cadastro?ref=ind-${state.clientId || 'CLI-0824'}`;
  const qrBoxId = 'cliente-referral-qr-box';

  // Buscar indicações feitas por este cliente
  const myReferrals = (state.referrals || []).filter(r => r.referrerId === state.clientId);
  const totalRegistered = myReferrals.length;
  const totalQualified = myReferrals.filter(r => r.status === 'Indicação qualificada').length;

  openModal(`
    <div style="padding:18px 16px;">
      <div style="text-align:center;margin-bottom:12px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:#f3e8ff;color:var(--primary);font-size:22px;margin-bottom:6px">
          🤝
        </div>
        <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:var(--primary);margin:0">
          Convide seus Amigos
        </h2>
        <p style="font-size:12px;color:var(--text-muted);margin:4px 0 0;line-height:1.4">
          Gostou de economizar com o Grupo Oliveira? Convide seus amigos para conhecer nosso programa de fidelidade!
        </p>
      </div>

      <!-- QR Code & Link Exclusivo -->
      <div class="qr-display-box" style="margin:10px 0">
        <div id="${qrBoxId}" class="qr-code-svg-render">
          <!-- Renderizado via QRCode -->
        </div>
        <div class="qr-share-url-box">
          ${esc(clientInviteUrl)}
        </div>
      </div>

      <div class="qr-buttons-row">
        <button type="button" class="btn-qr-action copy" onclick="copyToClipboard('${clientInviteUrl}', 'Seu link de indicação foi copiado!')">
          ${icon('copy')}
          <span>Copiar Link</span>
        </button>
        <button type="button" class="btn-qr-action whatsapp" onclick="shareClientWhatsApp('${clientInviteUrl}')">
          <span>WhatsApp</span>
        </button>
      </div>

      <!-- Resumo de Indicações do Cliente -->
      <div class="referrals-stats-grid">
        <div class="referral-stat-box">
          <div class="referral-stat-num">${totalRegistered}</div>
          <div class="referral-stat-lbl">Amigos Cadastrados</div>
        </div>
        <div class="referral-stat-box">
          <div class="referral-stat-num" style="color:#15803d">${totalQualified}</div>
          <div class="referral-stat-lbl">Indicações Qualificadas</div>
        </div>
      </div>

      <!-- Extrato de Amigos Indicados -->
      <div style="margin-top:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:12px;font-weight:700;color:#0f172a">Histórico de Convites</span>
          <span style="font-size:10.5px;color:var(--text-muted)">1º Abastecimento qualifica</span>
        </div>

        <div class="referral-items-list">
          ${myReferrals.length === 0 ? `
            <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:10px;font-size:11.5px;color:var(--text-muted)">
              Nenhum amigo cadastrado pelo seu link ainda.<br>
              Compartilhe com seus amigos para começar!
            </div>
          ` : myReferrals.map(r => {
            const isQualified = r.status === 'Indicação qualificada';
            const statusClass = isQualified ? 'qualificada' : (r.status.includes('Aguardando') ? 'pendente' : 'cadastrado');
            return `
              <div class="referral-item-row">
                <div>
                  <div class="referral-item-name">${esc(r.referredName)}</div>
                  <div class="referral-item-meta">${esc(r.originStationName || 'Rede de Postos')}</div>
                </div>
                <span class="referral-status-tag ${statusClass}">
                  ${isQualified ? '✓ Qualificada' : (r.status.includes('Aguardando') ? '⏳ Aguardando 1º Abast.' : '📋 Cadastrado')}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div style="margin-top:16px;text-align:center">
        <button type="button" class="btn btn-outline" onclick="closeModal()" style="width:100%">Fechar</button>
      </div>
    </div>
  `);

  renderQRCodeInElement(qrBoxId, clientInviteUrl);
}

// 7. Processamento de Qualificação de Indicação (Requisito 6 & 7)
function processReferralQualification(tx) {
  if (!state.referrals || !state.referrals.length) return;

  const ref = state.referrals.find(r => 
    (r.referredName && tx.customerName && r.referredName.toLowerCase() === tx.customerName.toLowerCase()) ||
    (r.referredCard && tx.cardNumber && tx.cardNumber.includes(r.referredCard.slice(-4)))
  );

  if (ref && (ref.status === 'Aguardando primeiro abastecimento' || ref.status === 'Cadastro realizado')) {
    ref.status = 'Indicação qualificada';
    ref.qualifiedAt = new Date().toISOString();
    ref.firstFillId = tx.id;
    ref.firstFillAmount = tx.amount;

    // Verificar se bonificação por indicação está ativa pelo proprietário (Requisito 7)
    const cfg = state.referralConfig || { rewardsActive: false, rewardAmount: 1.00, monthlyLimit: 5, maxMonthlyBonus: 5.00 };

    if (cfg.rewardsActive && ref.referrerId) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const rewardedThisMonth = state.referrals.filter(r => 
        r.referrerId === ref.referrerId && 
        r.rewardPaid && 
        r.qualifiedAt && 
        r.qualifiedAt.startsWith(currentMonth)
      ).length;

      if (rewardedThisMonth < (cfg.monthlyLimit || 5)) {
        ref.rewardPaid = true;
        ref.rewardAmount = Number(cfg.rewardAmount) || 1.00;

        // Se o indicador for o cliente da sessão ativa
        if (state.clientId === ref.referrerId) {
          state.balance = Math.round((state.balance + ref.rewardAmount) * 100) / 100;
          state.notifications = state.notifications || [];
          state.notifications.unshift({
            id: Date.now() + 5,
            title: 'Parabéns! Bônus de Indicação Recebido 🎁',
            desc: `Seu amigo ${esc(ref.referredName)} realizou o 1º abastecimento. Você recebeu ${money(ref.rewardAmount)} de cashback!`,
            time: 'Agora mesmo',
            cat: 'Indicações',
            icon: 'star',
            color: 'gold',
            read: false,
            action: "openInviteFriendsModal()",
            btnText: "Ver Minhas Indicações"
          });
        }
      }
    }

    saveState();
  }
}

// 8. Seção do Proprietário: Divulgação, Cadastros e Indicações (Requisito 9)
function renderOwnerDivulgacaoEIndicacoes(data) {
  const originFilter = state.ownerFilterOrigin || 'all';
  const cfg = state.referralConfig || { rewardsActive: false, rewardAmount: 1.00, monthlyLimit: 5, maxMonthlyBonus: 5.00 };

  // Filtragem de cadastros e indicações
  let allClients = state.registeredClients || [];
  let allReferrals = state.referrals || [];

  if (state.ownerFilterStation && state.ownerFilterStation !== 'all') {
    allClients = allClients.filter(c => c.originStationId === state.ownerFilterStation);
    allReferrals = allReferrals.filter(r => r.originStationId === state.ownerFilterStation);
  }

  if (originFilter === 'station_qr') {
    allClients = allClients.filter(c => !c.referrerId);
  } else if (originFilter === 'friend_referral') {
    allClients = allClients.filter(c => !!c.referrerId);
  }

  const totalClients = allClients.length;
  const countViaStation = (state.registeredClients || []).filter(c => !c.referrerId).length;
  const countViaFriends = (state.registeredClients || []).filter(c => !!c.referrerId).length;
  const countQualified = allReferrals.filter(r => r.status === 'Indicação qualificada').length;
  const totalRewardsPaid = allReferrals.filter(r => r.rewardPaid).reduce((sum, r) => sum + (Number(r.rewardAmount) || 0), 0);

  // Ranking de Postos (Captação das 6 unidades)
  const stationRankings = stations.map(st => {
    const captures = (state.registeredClients || []).filter(c => c.originStationId === st.id).length;
    return {
      station: st,
      captures: captures
    };
  }).sort((a, b) => b.captures - a.captures);

  const maxCaptures = Math.max(...stationRankings.map(s => s.captures), 1);

  // Ranking de Clientes Indicadores
  const referrersMap = {};
  (state.referrals || []).forEach(r => {
    if (!referrersMap[r.referrerId]) {
      referrersMap[r.referrerId] = {
        name: r.referrerName || r.referrerId,
        id: r.referrerId,
        totalInvites: 0,
        qualified: 0
      };
    }
    referrersMap[r.referrerId].totalInvites += 1;
    if (r.status === 'Indicação qualificada') {
      referrersMap[r.referrerId].qualified += 1;
    }
  });

  const topReferrers = Object.values(referrersMap).sort((a, b) => b.qualified - a.qualified || b.totalInvites - a.totalInvites).slice(0, 5);

  return `
    <section class="owner-section-box" aria-label="Divulgação, Cadastros e Indicações">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:6px">
        <div>
          <h3>Divulgação, Cadastros e Indicações</h3>
          <p style="margin:0">Gestão de QR Codes exclusivos por posto, captação e indicações qualificadas da rede</p>
        </div>
        <span class="status-badge-mini ${cfg.rewardsActive ? 'status-green' : 'status-gray'}">
          ${cfg.rewardsActive ? '✨ Bonificação Ativa' : '🔒 Bonificação Desativada'}
        </span>
      </div>

      <!-- 7 Indicadores do Módulo (Requisito 9) -->
      <div class="owner-metrics-grid" style="margin-top:16px">
        <div class="owner-metric-card">
          <div class="owner-metric-head">
            <span class="owner-metric-sublabel">Total de Clientes</span>
            <div class="owner-metric-icon purple">👥</div>
          </div>
          <div class="owner-metric-value">${totalClients}</div>
          <div class="owner-metric-trend trend-up"><span>Base unificada</span></div>
        </div>

        <div class="owner-metric-card">
          <div class="owner-metric-head">
            <span class="owner-metric-sublabel">Via QR Code Posto</span>
            <div class="owner-metric-icon blue">📍</div>
          </div>
          <div class="owner-metric-value">${countViaStation}</div>
          <div class="owner-metric-trend trend-info"><span>Totens & Frentistas</span></div>
        </div>

        <div class="owner-metric-card">
          <div class="owner-metric-head">
            <span class="owner-metric-sublabel">Via Convite de Amigo</span>
            <div class="owner-metric-icon gold">🤝</div>
          </div>
          <div class="owner-metric-value">${countViaFriends}</div>
          <div class="owner-metric-trend trend-up"><span>Captação viral</span></div>
        </div>

        <div class="owner-metric-card">
          <div class="owner-metric-head">
            <span class="owner-metric-sublabel">Indicações Qualificadas</span>
            <div class="owner-metric-icon green">⭐</div>
          </div>
          <div class="owner-metric-value">${countQualified}</div>
          <div class="owner-metric-trend trend-up"><span>Com 1º abastecimento</span></div>
        </div>

        <div class="owner-metric-card">
          <div class="owner-metric-head">
            <span class="owner-metric-sublabel">Total de Convites</span>
            <div class="owner-metric-icon cyan">📲</div>
          </div>
          <div class="owner-metric-value">${allReferrals.length}</div>
          <div class="owner-metric-trend trend-info"><span>Links gerados</span></div>
        </div>

        <div class="owner-metric-card">
          <div class="owner-metric-head">
            <span class="owner-metric-sublabel">Recompensas Distribuídas</span>
            <div class="owner-metric-icon red">💵</div>
          </div>
          <div class="owner-metric-value">${money(totalRewardsPaid)}</div>
          <div class="owner-metric-trend ${cfg.rewardsActive ? 'trend-alert' : 'trend-info'}">
            <span>${cfg.rewardsActive ? 'Ativo no momento' : 'Desativado por padrão'}</span>
          </div>
        </div>
      </div>

      <!-- Ranking de Postos e Ranking de Clientes Lado a Lado -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:16px;margin:24px 0">
        <!-- 1. Ranking de Postos (Captação) -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <h4 style="font-family:var(--font-heading);font-size:14px;font-weight:800;color:#0f172a;margin:0">
              🏆 Ranking de Captação das 6 Unidades
            </h4>
            <small style="font-size:10.5px;color:var(--text-muted)">Via QR Code do Posto</small>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${stationRankings.map((stRank, idx) => {
              const pct = Math.round((stRank.captures / maxCaptures) * 100);
              return `
                <div>
                  <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;margin-bottom:3px">
                    <span style="font-weight:700;color:#1e293b">#${idx + 1} ${esc(stRank.station.name)}</span>
                    <b style="color:var(--primary)">${stRank.captures} clientes</b>
                  </div>
                  <div style="width:100%;height:7px;background:#e2e8f0;border-radius:999px;overflow:hidden">
                    <div style="width:${pct}%;height:100%;background:linear-gradient(90deg, var(--primary) 0%, #0082CA 100%);border-radius:999px"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Ranking de Indicações de Clientes -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <h4 style="font-family:var(--font-heading);font-size:14px;font-weight:800;color:#0f172a;margin:0">
              👥 Top Clientes Indicadores
            </h4>
            <small style="font-size:10.5px;color:var(--text-muted)">Indicações Qualificadas</small>
          </div>
          ${topReferrers.length === 0 ? `
            <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">Nenhuma indicação qualificada registrada ainda.</div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:8px">
              ${topReferrers.map((refClient, idx) => `
                <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:11px;font-weight:800;color:#64748b;width:20px">#${idx + 1}</span>
                    <div>
                      <b style="font-size:12.5px;color:#0f172a">${esc(refClient.name)}</b>
                      <div style="font-size:10.5px;color:var(--text-muted)">ID: ${esc(refClient.id)}</div>
                    </div>
                  </div>
                  <div style="text-align:right">
                    <b style="color:#15803d;font-size:13px">${refClient.qualified} qualificadas</b>
                    <div style="font-size:10px;color:var(--text-muted)">${refClient.totalInvites} convites</div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Central de QR Codes das 6 Unidades (Requisitos 1, 8 & 9) -->
      <div style="margin-top:28px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div>
            <h4 style="font-family:var(--font-heading);font-size:16px;font-weight:800;color:#0f172a;margin:0">
              📍 QR Codes Oficiais de Instalação das 6 Unidades
            </h4>
            <p style="font-size:11.5px;color:var(--text-muted);margin:2px 0 0">
              QR Codes para totens, bombas e pista: direcionam para a instalação do aplicativo (/instalar) com identificação do posto.
            </p>
          </div>
          <span class="status-badge-mini status-green">6 Postos Ativos</span>
        </div>

        <div class="owner-qr-stations-grid">
          ${stations.map(st => {
            const stationInstallUrl = `${window.location.origin}/instalar?ref=${encodeURIComponent(st.id)}`;
            const qrCardId = `owner-st-qr-${st.id}`;
            return `
              <div class="owner-station-qr-card">
                <div class="station-qr-header">
                  <h4>${esc(st.name)}</h4>
                  <small>📍 ${esc(st.city)} • Ref: <code>${esc(st.id)}</code></small>
                </div>

                <div class="station-qr-img-box">
                  <div id="${qrCardId}" style="width:130px;height:130px;display:flex;align-items:center;justify-content:center">
                    <!-- Renderizado dinamicamente -->
                  </div>
                </div>

                <div style="font-size:10.5px;font-weight:700;color:var(--primary);text-align:center;margin:4px 0 8px">
                  📲 QR Code de Instalação PWA
                </div>

                <div class="station-qr-actions-row">
                  <button type="button" class="btn-station-qr-action" onclick="copyToClipboard('${stationInstallUrl}', 'Link de instalação de ${esc(st.name)} copiado!')" title="Copiar link de instalação">
                    <span>Copiar Link</span>
                  </button>
                  <button type="button" class="btn-station-qr-action" onclick="downloadQRCodePNG('${stationInstallUrl}', 'qrcode-instalar-${esc(st.id)}.png')" title="Baixar QR Code em PNG">
                    <span>Baixar PNG</span>
                  </button>
                  <button type="button" class="btn-station-qr-action" onclick="window.open('${stationInstallUrl}', '_blank')" title="Testar página de instalação">
                    <span>Testar</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Configurações de Recompensas (Exclusivo Proprietário - Requisito 7 & 9) -->
      <div class="owner-config-box">
        <div class="config-toggle-row">
          <div class="config-toggle-label">
            <b>⚙️ Bonificação por Indicação (Recompensas Financeiras)</b>
            <small>Ative ou desative o crédito de cashback para clientes que indicarem novos clientes que abastecerem.</small>
          </div>
          <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer">
            <input type="checkbox" ${cfg.rewardsActive ? 'checked' : ''} onchange="toggleRewardsActive(this.checked)" style="opacity:0;width:0;height:0">
            <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:${cfg.rewardsActive ? '#16a34a' : '#cbd5e1'};transition:.3s;border-radius:34px;display:block">
              <span style="position:absolute;content:'';height:20px;width:20px;left:${cfg.rewardsActive ? '24px' : '4px'};bottom:3px;background-color:white;transition:.3s;border-radius:50%;display:block"></span>
            </span>
          </label>
        </div>

        <form onsubmit="saveRewardSettings(event)">
          <div class="config-inputs-grid">
            <div class="config-input-item">
              <label for="cfg-reward-val">Valor por Indicação (R$)</label>
              <input type="number" id="cfg-reward-val" name="rewardAmount" step="0.50" min="0" value="${cfg.rewardAmount || 1.00}">
            </div>
            <div class="config-input-item">
              <label for="cfg-monthly-limit">Limite Mensal / Cliente</label>
              <input type="number" id="cfg-monthly-limit" name="monthlyLimit" min="1" max="100" value="${cfg.monthlyLimit || 5}">
            </div>
            <div class="config-input-item">
              <label for="cfg-max-bonus">Bônus Máximo Mensal (R$)</label>
              <input type="number" id="cfg-max-bonus" name="maxMonthlyBonus" step="1.00" min="1" value="${cfg.maxMonthlyBonus || 5.00}">
            </div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
            <div style="font-size:11px;color:#86198f">
              Status atual: <b>${cfg.rewardsActive ? '✅ ATIVADO (Bônus concedido no 1º abastecimento)' : '🔒 DESATIVADO (Nenhum valor financeiro distribuído)'}</b>
            </div>
            <button type="submit" class="btn btn-primary" style="padding:8px 18px;font-size:12px;background:#701a75">
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </section>
  `;
}

// 9. Funções Auxiliares de Compartilhamento, QR Code e Configuração
function renderQRCodeInElement(elementId, text) {
  setTimeout(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (typeof QRCode !== 'undefined' && QRCode.toString) {
      QRCode.toString(text, {
        type: 'svg',
        width: 170,
        margin: 1,
        color: { dark: '#1b0e2a', light: '#ffffff' }
      }).then(svg => {
        el.innerHTML = svg;
      }).catch(err => {
        el.innerHTML = `<div style="font-size:11px;color:red">Erro QR Code</div>`;
      });
    }
  }, 100);
}

// Renderizar QR codes do painel do proprietário
function renderAllOwnerQRCodes() {
  if (state.currentRole !== 'owner') return;
  stations.forEach(st => {
    const qrCardId = `owner-st-qr-${st.id}`;
    const stationInstallUrl = `${window.location.origin}/instalar?ref=${encodeURIComponent(st.id)}`;
    renderQRCodeInElement(qrCardId, stationInstallUrl);
  });
}

function shareStationInstallWhatsApp(stationName, url) {
  const msg = encodeURIComponent(`Olá! Instale o aplicativo oficial do Clube Grupo Oliveira no seu celular (${stationName}) e ganhe 3% de cashback em todos os abastecimentos: ${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      toast(successMsg || 'Copiado para a área de transferência!');
    }).catch(() => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    toast(successMsg || 'Copiado para a área de transferência!');
  } catch (e) {
    prompt('Copie o link abaixo:', text);
  }
  document.body.removeChild(ta);
}

function shareStationWhatsApp(stationName, url) {
  const msg = encodeURIComponent(`Olá! Cadastre-se no Clube de Benefícios Grupo Oliveira no ${stationName} e ganhe 3% de cashback em todos os abastecimentos: ${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function shareClientWhatsApp(url) {
  const msg = encodeURIComponent(`Gostou de economizar? Cadastre-se no Clube de Vantagens do Grupo Oliveira pelo meu convite e ganhe 3% de cashback em qualquer um dos 6 postos da rede: ${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function downloadQRCodePNG(text, filename) {
  if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
    QRCode.toDataURL(text, { width: 600, margin: 2 }, function (err, url) {
      if (!err && url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'qrcode-grupo-oliveira.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast('QR Code em alta definição baixado com sucesso!');
      } else {
        toast('Erro ao gerar download do QR Code.');
      }
    });
  } else {
    toast('Biblioteca de QR Code indisponível.');
  }
}

function testStationWelcome(stationId) {
  const st = getStationByRef(stationId);
  if (!st) return;
  openWelcomeModal({
    stationId: st.id,
    stationName: st.name,
    stationCity: st.city
  });
}

function toggleRewardsActive(checked) {
  state.referralConfig = state.referralConfig || {};
  state.referralConfig.rewardsActive = !!checked;
  saveState();
  render();
  toast(checked ? '✨ Bonificação por indicação ATIVADA com sucesso!' : '🔒 Bonificação por indicação DESATIVADA.');
}

function saveRewardSettings(e) {
  e.preventDefault();
  const form = e.target;
  state.referralConfig = state.referralConfig || {};
  state.referralConfig.rewardAmount = parseFloat(form.rewardAmount.value) || 1.00;
  state.referralConfig.monthlyLimit = parseInt(form.monthlyLimit.value, 10) || 5;
  state.referralConfig.maxMonthlyBonus = parseFloat(form.maxMonthlyBonus.value) || 5.00;
  saveState();
  render();
  toast('Configurações de recompensa salvas com sucesso!');
}

// Hook de pós-renderização para renderizar QR codes do painel do proprietário
const originalRender = render;
render = function() {
  originalRender();
  if (state.currentRole === 'owner') {
    renderAllOwnerQRCodes();
  }
};

// ====================================================================
// SINCRONIZAÇÃO EM TEMPO REAL E PERSISTÊNCIA REAL COM SUPABASE
// ====================================================================

async function loadCustomerDataFromSupabase() {
  if (!window._supabaseClient) return;
  try {
    const { data: { session } } = await window._supabaseClient.auth.getSession();
    const userId = session && session.user ? session.user.id : 'ebda6850-8a6c-47a5-b430-6af29ccf9593';

    // Buscar dados cadastrais e saldo
    const { data: cli, error: cErr } = await window._supabaseClient
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!cErr && cli) {
      state.clientId = cli.id;
      state.name = cli.nome;
      state.balance = Number(cli.saldo_cashback || 0);
      state.points = Number(cli.pontos_acumulados || 0);
      state.cardNumber = cli.numero_cartao;
      state.vehicle = cli.veiculo_padrao || state.vehicle;
      state.plate = cli.placa_padrao || state.plate;
      state.cashbackUsed = Number(cli.cashback_utilizado_total || 0);
    }

    // Buscar abastecimentos reais do cliente
    if (cli && cli.id) {
      const { data: abasts, error: aErr } = await window._supabaseClient
        .from('abastecimentos')
        .select('*, postos(nome, cidade)')
        .eq('cliente_id', cli.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!aErr && abasts) {
        state.fills = abasts.map(a => ({
          id: a.codigo_transacao,
          station: a.postos ? a.postos.nome : 'Posto Grupo Oliveira',
          city: a.postos ? a.postos.cidade : 'AM',
          fuel: a.tipo_combustivel,
          liters: Number(a.litros),
          pricePerLiter: Number(a.valor_litro),
          amount: Number(a.valor_total_bruto),
          cashbackUsed: Number(a.cashback_utilizado),
          netPaid: Number(a.valor_pago_liquido),
          cashbackEarned: Number(a.cashback_creditado),
          pointsEarned: Number(a.pontos_creditados),
          paymentMethod: a.forma_pagamento,
          status: a.status === 'CONCLUIDO' ? 'Concluído' : a.status,
          date: a.created_at ? a.created_at.split('T')[0] : 'Hoje',
          time: a.created_at ? new Date(a.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
        }));
      }
    }

    saveState();
    if (state.currentRole === 'customer') render();
  } catch (err) {
    console.warn('[Supabase Sync Customer]', err.message);
  }
}

async function loadAttendantDataFromSupabase() {
  if (!window._supabaseClient) return;
  try {
    const { data: { session } } = await window._supabaseClient.auth.getSession();
    const userId = session && session.user ? session.user.id : '95538261-172f-4d73-9071-d0cdd030236d';

    // Buscar funcionário e posto vinculado
    const { data: func, error: fErr } = await window._supabaseClient
      .from('funcionarios')
      .select('*, postos(*)')
      .eq('user_id', userId)
      .single();

    if (!fErr && func) {
      state.attendantUser = {
        id: func.id,
        name: func.nome,
        registration: func.matricula,
        stationId: func.posto_id,
        stationName: func.postos ? func.postos.nome : 'Posto Marcos Zagury (Matriz)',
        stationCity: func.postos ? (func.postos.cidade + ' - ' + func.postos.uf) : 'Parintins - AM',
        avatar: func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      };
    }

    // Buscar abastecimentos de hoje deste funcionário
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const funcId = (func && func.id) || (state.attendantUser && state.attendantUser.id) || 'fc7afcfe-fcde-4250-8efe-520b3d455b02';
    const { data: todayFills, error: tErr } = await window._supabaseClient
      .from('abastecimentos')
      .select('*, clientes(nome, numero_cartao)')
      .eq('funcionario_id', funcId)
      .gte('created_at', startOfToday.toISOString())
      .order('created_at', { ascending: false });

    if (!tErr && todayFills) {
      let fillsCount = 0;
      let totalAmount = 0;
      let totalCashback = 0;

      state.attendantFills = todayFills.map(f => {
        if (f.status === 'CONCLUIDO') {
          fillsCount += 1;
          totalAmount += Number(f.valor_total_bruto || 0);
          totalCashback += Number(f.cashback_creditado || 0);
        }
        const maskedCard = f.clientes && f.clientes.numero_cartao 
          ? f.clientes.numero_cartao.replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4')
          : '4589 •••• •••• 1204';

        return {
          id: f.codigo_transacao,
          time: new Date(f.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date: 'Hoje',
          customerName: f.clientes ? f.clientes.nome : 'Cliente Identificado',
          cardNumber: maskedCard,
          fuel: f.tipo_combustivel,
          liters: Number(f.litros),
          amount: Number(f.valor_total_bruto),
          cashbackEarned: Number(f.cashback_creditado),
          discountUsed: Number(f.cashback_utilizado),
          status: f.status === 'CONCLUIDO' ? 'Concluído' : f.status
        };
      });

      state.attendantDailyStats = {
        fillsCount,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalCashback: Math.round(totalCashback * 100) / 100
      };
    }

    saveState();
    if (state.currentRole === 'attendant') render();
  } catch (err) {
    console.warn('[Supabase Sync Attendant]', err.message);
  }
}

async function loadOwnerDataFromSupabase(filterStation = 'all', filterPeriod = 'today') {
  if (!window._supabaseClient) return;
  try {
    const stationUuid = filterStation !== 'all' ? (STATION_DB_MAP[filterStation] || filterStation) : null;
    const { data, error } = await window._supabaseClient.rpc('obter_metricas_proprietario', {
      p_posto_id: stationUuid,
      p_periodo: filterPeriod
    });

    if (!error && data) {
      state.ownerLiveMetrics = data;
    }

    // Carregar clientes reais cadastrados no Supabase (Sem mocks)
    const { data: realClients } = await window._supabaseClient
      .from('clientes')
      .select('id, nome, email, telefone, numero_cartao, veiculo_padrao, placa_padrao, created_at')
      .order('created_at', { ascending: false });

    if (realClients) {
      state.registeredClients = realClients.map(c => ({
        id: c.id,
        name: c.nome,
        cardNumber: c.numero_cartao,
        phone: c.telefone || '',
        email: c.email || '',
        vehicle: c.veiculo_padrao || '',
        plate: c.placa_padrao || '',
        originStationId: 'matriz-parintins',
        registeredAt: c.created_at
      }));
    } else {
      state.registeredClients = [];
    }

    // Carregar indicações reais do Supabase
    const { data: realReferrals } = await window._supabaseClient
      .from('indicacoes')
      .select('*')
      .order('created_at', { ascending: false });

    state.referrals = realReferrals || [];

    saveState();
    if (state.currentRole === 'owner') render();
  } catch (err) {
    console.warn('[Supabase Sync Owner]', err.message);
  }
}

function setupRealtimeSubscriptions() {
  if (!window._supabaseClient || window._goRealtimeSubscribed) return;
  window._goRealtimeSubscribed = true;

  try {
    window._supabaseClient
      .channel('abastecimentos-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'abastecimentos' }, payload => {
        console.log('[Realtime] Notificação de abastecimento recebida:', payload.eventType);
        if (state.currentRole === 'customer') {
          loadCustomerDataFromSupabase();
        } else if (state.currentRole === 'attendant') {
          loadAttendantDataFromSupabase();
        } else if (state.currentRole === 'owner') {
          loadOwnerDataFromSupabase(state.ownerFilterStation || 'all', state.ownerFilterPeriod || 'today');
        }
      })
      .subscribe();
    console.log('[Realtime] Inscrito no canal de abastecimentos com sucesso!');
  } catch (e) {
    console.warn('[Realtime error]', e.message);
  }
}

// Inicialização do Supabase Client e Sincronização de Sessão
async function initAuthAndSupabase() {
  try {
    const res = await fetch('/api/auth/config');
    if (res.ok) {
      const config = await res.json();
      if (config.supabaseUrl && config.supabaseAnonKey && typeof supabase !== 'undefined') {
        window._supabaseClient = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
        console.log('[Supabase Auth] Conexão ativa com:', config.supabaseUrl);

        // Configurar sincronização em tempo real
        setupRealtimeSubscriptions();

        // Carregar dados conforme perfil ativo
        if (state.currentRole === 'customer') {
          await loadCustomerDataFromSupabase();
        } else if (state.currentRole === 'attendant') {
          await loadAttendantDataFromSupabase();
        } else if (state.currentRole === 'owner') {
          await loadOwnerDataFromSupabase(state.ownerFilterStation || 'all', state.ownerFilterPeriod || 'today');
        }

        // Ouvir alterações na sessão do Supabase Auth
        window._supabaseClient.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT') {
            if (state) state.authSession = null;
            saveState();
            window.location.href = '/login';
          } else if (event === 'SIGNED_IN' && session) {
            state.authSession = state.authSession || {};
            state.authSession.authenticated = true;
            state.authSession.email = session.user.email;
            saveState();
            if (state.currentRole === 'customer') loadCustomerDataFromSupabase();
            if (state.currentRole === 'attendant') loadAttendantDataFromSupabase();
            if (state.currentRole === 'owner') loadOwnerDataFromSupabase();
          }
        });
      }
    }
  } catch (e) {
    console.warn('[Supabase Auth] Fallback local ativo:', e.message);
  }
}

// Verificação de Parâmetros de URL, Sessão e Proteção de Perfis (Requisitos 3, 4 e 5)
function checkAuthAndPermissions() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    const hasReferral = urlParams.get('ref') || urlParams.get('ind') || urlParams.get('source');

    if (roleParam && ['owner', 'attendant', 'customer'].includes(roleParam)) {
      // Regra de Segurança: se autenticado como customer, bloquear elevação não autorizada
      if (state.authSession && state.authSession.role === 'customer' && roleParam !== 'customer') {
        console.warn('[Segurança] Bloqueado acesso de customer a painel restrito:', roleParam);
        state.currentRole = 'customer';
        setTimeout(() => toast('🔒 Acesso negado: Perfil de Cliente não tem acesso administrativo.'), 500);
      } else {
        state.currentRole = roleParam;
        state.authSession = state.authSession || {
          authenticated: true,
          role: roleParam,
          email: roleParam === 'owner' ? 'proprietario@grupooliveira.com.br' : (roleParam === 'attendant' ? 'frentista@grupooliveira.com.br' : 'cliente@grupooliveira.com.br'),
          name: roleParam === 'owner' ? 'Roberto Oliveira' : (roleParam === 'attendant' ? 'Operador de Pista' : (state.name || 'Cliente Grupo Oliveira'))
        };
        localStorage.setItem('go_current_role', roleParam);
        saveState();
      }
    } else if (!state.authSession && !localStorage.getItem('go_current_role') && !hasReferral) {
      // Usuário não autenticado tentando abrir raiz do sistema -> Redirecionar para tela de login dedicada (Requisito 4)
      window.location.href = '/login';
      return false;
    }
  } catch (e) {
    console.warn('[Auth Check Error]', e.message);
  }
  return true;
}

// ====================================================================
// HUB DE SINCRONIZAÇÃO EM TEMPO REAL MULTI-DISPOSITIVOS (SSE + BROADCAST)
// ====================================================================

// Som comemorativo triunfal quando cliente recebe cashback
function playCashbackCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Dó, Mi, Sol, Dó (Maior Triunfal)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.1));
      gain.gain.setValueAtTime(0, ctx.currentTime + (idx * 0.1));
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + (idx * 0.1) + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx * 0.1) + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + (idx * 0.1));
      osc.stop(ctx.currentTime + (idx * 0.1) + 0.35);
    });
  } catch (e) {}
}

// Efeito pulsante no card de saldo de cashback
function triggerBalancePulseEffect() {
  const cards = document.querySelectorAll('.user-quick-card');
  cards.forEach(card => {
    if (card.textContent && card.textContent.includes('Cashback')) {
      card.style.transition = 'all 0.4s ease';
      card.style.transform = 'scale(1.06)';
      card.style.boxShadow = '0 0 24px rgba(22, 163, 74, 0.7)';
      card.style.borderColor = '#16a34a';
      setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
      }, 3000);
    }
  });
}

// Manipulador central de abastecimento remoto confirmado (Cross-Device & Cross-Tab)
function handleRemoteAbastecimentoConfirmado(eventData) {
  if (!eventData || !eventData.tx) return;
  const tx = eventData.tx;
  const customer = eventData.customer;

  console.log('[Sync Hub] Evento de abastecimento recebido:', tx.id);

  if (state.currentRole === 'customer') {
    // Atualiza saldo e histórico no perfil do cliente
    if (customer) {
      state.balance = Number(customer.balance);
      state.points = Number(customer.points);
      state.cashbackUsed = Number(customer.cashbackUsed || state.cashbackUsed || 0);
    } else {
      state.balance = Math.round((state.balance - (tx.cashbackUsed || 0) + (tx.cashbackEarned || 0)) * 100) / 100;
      state.points = (state.points || 0) + (tx.pointsEarned || 0);
      state.cashbackUsed = Math.round(((state.cashbackUsed || 0) + (tx.cashbackUsed || 0)) * 100) / 100;
    }

    state.fills = state.fills || [];
    if (!state.fills.some(f => f.id === tx.id)) {
      state.fills.unshift(tx);
    }

    saveState();

    // Feedback audiovisual instantâneo no aparelho do cliente
    playCashbackCelebrationSound();
    try {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    } catch (e) {}

    toast(`🎉 Abastecimento concluído! +${money(tx.cashbackEarned)} de cashback e +${tx.pointsEarned} pts creditados!`);

    // Se o modal de QR code do cliente estiver aberto, substitui pelo recibo digital
    const modalBox = document.querySelector('#abastecer-qr-box');
    if (modalBox) {
      showReceiptModal(tx);
    }

    render();
    triggerBalancePulseEffect();
  } else if (state.currentRole === 'attendant') {
    loadAttendantDataFromServer();
  } else if (state.currentRole === 'owner') {
    toast(`⛽ Novo abastecimento registrado: ${money(tx.amount)} no ${tx.station}!`);
    loadOwnerDataFromServer();
  }
}

// Busca dados atualizados do cliente no servidor
async function loadCustomerDataFromServer() {
  try {
    const cid = state.clientId || 'CLI-0824';
    const res = await fetch(`/api/sync/customer/${encodeURIComponent(cid)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.customer) {
        const c = data.customer;
        state.name = c.name || state.name;
        state.cardNumber = c.cardNumber || state.cardNumber;
        state.balance = Number(c.balance);
        state.points = Number(c.points);
        state.cashbackUsed = Number(c.cashbackUsed || state.cashbackUsed || 0);
        state.vehicle = c.vehicle || state.vehicle;
        state.plate = c.plate || state.plate;
        if (Array.isArray(c.fills) && c.fills.length > 0) {
          state.fills = c.fills;
        }
        saveState();
        if (state.currentRole === 'customer') render();
      }
    }
  } catch (e) {}
}

// Busca dados consolidados do frentista no servidor
async function loadAttendantDataFromServer() {
  try {
    const res = await fetch('/api/sync/attendant');
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.attendant) {
        state.attendantDailyStats = data.attendant.todayStats || state.attendantDailyStats;
        saveState();
        if (state.currentRole === 'attendant') render();
      }
    }
  } catch (e) {}
}

// Busca métricas consolidadas da rede para o painel do proprietário
async function loadOwnerDataFromServer() {
  try {
    const station = state.ownerFilterStation || 'all';
    const period = state.ownerFilterPeriod || 'today';
    const res = await fetch(`/api/sync/owner?station=${encodeURIComponent(station)}&period=${encodeURIComponent(period)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.metrics) {
        state.ownerLiveMetrics = data.metrics;
        saveState();
        if (state.currentRole === 'owner') render();
      }
    }
  } catch (e) {}
}

// Inicializa a sincronização em tempo real (BroadcastChannel + SSE + Polling de segurança)
function initLiveSync() {
  // 1. BroadcastChannel para comunicação instantânea entre abas no mesmo dispositivo
  try {
    if (typeof BroadcastChannel !== 'undefined' && !window._goSyncChannel) {
      window._goSyncChannel = new BroadcastChannel('grupo_oliveira_sync');
      window._goSyncChannel.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;
        if (msg.type === 'ABASTECIMENTO_CONFIRMADO') {
          handleRemoteAbastecimentoConfirmado(msg);
        } else if (msg.type === 'TOKEN_CREATED') {
          console.log('[Broadcast] Token ativo recebido:', msg.token ? msg.token.code : '');
        }
      };
    }
  } catch (e) {
    console.warn('[BroadcastChannel Error]', e.message);
  }

  // 2. Server-Sent Events (SSE) para sincronização em tempo real entre celulares e computadores
  try {
    if (typeof EventSource !== 'undefined' && !window._goEventSource) {
      const sse = new EventSource('/api/sync/events');
      sse.addEventListener('ABASTECIMENTO_CONFIRMADO', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleRemoteAbastecimentoConfirmado(payload);
        } catch (err) {
          console.warn('[SSE Parse Error]', err);
        }
      });
      sse.addEventListener('DEMO_RESET', () => {
        loadCustomerDataFromServer();
        loadAttendantDataFromServer();
        loadOwnerDataFromServer();
      });
      sse.onerror = () => {
        // Fallback transparente
      };
      window._goEventSource = sse;
    }
  } catch (e) {
    console.warn('[SSE Init Error]', e.message);
  }

  // 3. Polling leve a cada 3.5 segundos como garantia adicional
  setInterval(() => {
    if (state.currentRole === 'customer') {
      loadCustomerDataFromServer();
    } else if (state.currentRole === 'owner') {
      loadOwnerDataFromServer();
    }
  }, 3500);

  // Carga inicial conforme o perfil
  if (state.currentRole === 'customer') loadCustomerDataFromServer();
  if (state.currentRole === 'attendant') loadAttendantDataFromServer();
  if (state.currentRole === 'owner') loadOwnerDataFromServer();
}

// Inicializações em ordem segura
initAuthAndSupabase();
initLiveSync();
const canProceed = checkAuthAndPermissions();

// Inicialização de URL e Verificação de Boas-Vindas
checkUrlReferralAndWelcome();

// Initial Run
if (canProceed !== false) {
  render();
}

