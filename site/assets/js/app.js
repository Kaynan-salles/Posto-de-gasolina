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

// Local Storage & State Management
const STORAGE_KEY = 'grupo-oliveira-fidelidade-v2';

let state = null;
try {
  state = JSON.parse(localStorage.getItem(STORAGE_KEY));
  // check if legacy data exists
  if (!state) {
    const legacy = JSON.parse(localStorage.getItem('kclube-personal-v1'));
    if (legacy) {
      state = {
        name: legacy.name || 'Kaynã Viana',
        clientId: 'CLI-0824',
        cardNumber: '4589 8210 3349 1204',
        vehicle: legacy.vehicle || 'Chevrolet Onix 1.0',
        plate: 'PHN-4B20',
        balance: legacy.balance || 48.5,
        points: legacy.points || 850,
        cashbackUsed: legacy.cashbackUsed || 0,
        fills: legacy.fills || [],
        vouchers: legacy.vouchers || [],
        redemptions: legacy.redemptions || [],
        vehicles: legacy.vehicles && legacy.vehicles.length ? legacy.vehicles : [{ model: 'Chevrolet Onix 1.0', plate: 'PHN-4B20' }]
      };
    }
  }
} catch (e) {}

if (!state) {
  state = {
    name: 'Kaynã Viana',
    clientId: 'CLI-0824',
    cardNumber: '4589 8210 3349 1204',
    vehicle: 'Chevrolet Onix 1.0',
    plate: 'PHN-4B20',
    balance: 48.50,
    points: 850,
    cashbackUsed: 0,
    fills: [
      {
        id: 'GO-849201',
        station: 'Posto Marcos Zagury (Matriz)',
        city: 'Parintins - AM',
        attendant: 'Carlos Silva (Matrícula #1042)',
        date: '2026-10-28',
        time: '14:35',
        fuel: 'Gasolina Comum',
        liters: 35.5,
        pricePerLiter: 6.59,
        amount: 233.95,
        cashbackUsed: 0,
        netPaid: 233.95,
        cashbackEarned: 7.02,
        pointsEarned: 233,
        paymentMethod: 'Cartão de Crédito',
        status: 'Concluído'
      },
      {
        id: 'GO-739105',
        station: 'Posto Grupo Oliveira Nhamundá',
        city: 'Nhamundá - AM',
        attendant: 'Marcos Santos (Matrícula #1088)',
        date: '2026-10-19',
        time: '10:15',
        fuel: 'Gasolina Aditivada',
        liters: 28.0,
        pricePerLiter: 6.79,
        amount: 190.12,
        cashbackUsed: 15.00,
        netPaid: 175.12,
        cashbackEarned: 5.25,
        pointsEarned: 175,
        paymentMethod: 'PIX',
        status: 'Concluído'
      }
    ],
    vouchers: [],
    redemptions: [],
    vehicles: [
      { model: 'Chevrolet Onix 1.0', plate: 'PHN-4B20' },
      { model: 'Honda CG 160 Titan', plate: 'QZO-9J12' }
    ]
  };
}

// Ensure required fields exist in state
state.clientId = state.clientId || 'CLI-0824';
state.cardNumber = state.cardNumber || '4589 8210 3349 1204';
state.cashbackUsed = Number(state.cashbackUsed) || 0;

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

// Resumo do Dia do Frentista (Requirement 2)
state.attendantDailyStats = state.attendantDailyStats || {
  date: new Date().toISOString().split('T')[0],
  fillsCount: 14,
  totalAmount: 2150.80,
  totalCashback: 64.52
};

// Histórico Recente de Abastecimentos do Frentista (Requirement 2)
state.attendantFills = state.attendantFills || [
  {
    id: 'GO-849201',
    time: '14:35',
    date: 'Hoje',
    customerName: 'Kaynã Viana',
    cardNumber: '4589 •••• •••• 1204',
    fuel: 'Gasolina Comum',
    liters: 35.5,
    amount: 233.95,
    cashbackEarned: 7.02,
    discountUsed: 0.00,
    status: 'Concluído'
  },
  {
    id: 'GO-742190',
    time: '13:10',
    date: 'Hoje',
    customerName: 'Mariana Duarte',
    cardNumber: '5120 •••• •••• 7741',
    fuel: 'Gasolina Aditivada',
    liters: 22.1,
    amount: 150.00,
    cashbackEarned: 4.50,
    discountUsed: 10.00,
    status: 'Concluído'
  },
  {
    id: 'GO-629108',
    time: '11:42',
    date: 'Hoje',
    customerName: 'Roberto Nogueira',
    cardNumber: '4912 •••• •••• 3309',
    fuel: 'Diesel S10',
    liters: 50.0,
    amount: 344.50,
    cashbackEarned: 10.33,
    discountUsed: 0.00,
    status: 'Concluído'
  }
];

state.pendingOperation = state.pendingOperation || null;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Ensure default notifications exist
if (!state.notifications || !state.notifications.length) {
  state.notifications = [
    {
      id: 1,
      title: 'Bem-vindo ao Clube Grupo Oliveira! ⛽',
      desc: 'Sua carteira já possui R$ 48,50 de cashback simulado e 850 pontos de boas-vindas. Aproveite em qualquer unidade!',
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
              <span class="user-avatar-circle">${state.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
              <span>${esc(state.name.split(' ')[0])}</span>
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
  return `
    <div class="loyalty-card-container">
      <div class="virtual-card" onclick="openAbastecerModal()">
        <div class="virtual-card-bg"></div>
        <div class="virtual-card-head">
          <img src="assets/img/brand/clean_logo_white.png" class="virtual-card-logo" alt="Grupo Oliveira">
          <span class="card-tier-pill">MEMBRO OURO</span>
        </div>
        <div class="virtual-card-chip"></div>
        <div class="virtual-card-number">${cardNum}</div>
        <div class="virtual-card-foot">
          <div>
            <div class="card-holder-name">${esc(state.name)}</div>
            <div class="card-holder-sub">Veículo: ${esc(state.vehicle)} (${esc(state.plate)})</div>
          </div>
          <div style="text-align:right">
            <span style="font-size:10px;display:block;opacity:0.8">PONTOS</span>
            <strong style="font-size:17px">${state.points}</strong>
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
        <div class="user-avatar-circle" style="width:56px;height:56px;font-size:22px">
          ${state.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
        </div>
        <div>
          <h2 style="font-family:var(--font-heading);font-size:18px;font-weight:800;color:#0f172a">${esc(state.name)}</h2>
          <span style="font-size:12px;color:var(--primary);font-weight:700">Membro Ouro • Grupo Oliveira</span>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">Veículo: ${esc(state.vehicle)} (${esc(state.plate)})</div>
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
  const current = state.currentRole || 'customer';
  let roleTitle = 'Cliente';
  let roleIcon = '👤';
  let badgeColor = '#0082ca';

  if (current === 'attendant') {
    roleTitle = `Frentista: ${state.attendantUser ? state.attendantUser.name : 'Operador'}`;
    roleIcon = '⛽';
    badgeColor = '#16a34a';
  } else if (current === 'owner') {
    roleTitle = 'Proprietário: Grupo Oliveira';
    roleIcon = '🏢';
    badgeColor = '#f59e0b';
  }

  return `
    <div class="role-switcher-banner">
      <div style="display:flex;align-items:center;gap:6px">
        <span class="role-live-dot" style="background:${badgeColor}"></span>
        <span style="font-size:11px">Perfil: <b>${roleIcon} ${roleTitle}</b></span>
      </div>
      <button class="role-switch-badge" onclick="openRoleSwitcherModal()" aria-label="Alternar Perfil de Acesso">
        <span>🔄 Alternar Perfil ▾</span>
      </button>
    </div>
  `;
}

function switchRole(newRole) {
  state.currentRole = newRole;
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
                Kaynã Viana • Cartão 4589 •••• 1204 • Onix PHN-4B20
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

      <div style="margin-top:12px;text-align:center">
        <button class="btn btn-outline btn-close-modal-sm" onclick="closeModal()">Fechar</button>
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
    fillsCount: 14,
    totalAmount: 2150.80,
    totalCashback: 64.52
  };

  const fills = state.attendantFills || [];

  return `
    <div class="attendant-dashboard">
      <!-- 1. Cabeçalho do Frentista -->
      <header class="attendant-header">
        <div class="attendant-top-row">
          <img src="assets/img/brand/clean_logo_white.png" class="attendant-brand-logo" alt="Grupo Oliveira">
          <button class="attendant-exit-btn" onclick="openRoleSwitcherModal()" aria-label="Sair ou Alternar Perfil">
            <span>🚪 Sair / Trocar</span>
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

function setOwnerPeriodFilter(period) {
  state.ownerFilterPeriod = period;
  saveState();
  render();
}

// Cálculo Dinâmico de Métricas da Rede com base nos Filtros (Requisitos 4, 8 & 9)
function getNetworkAnalytics(filterStation, filterPeriod) {
  // Coeficientes por período
  const periodMultipliers = {
    today: { factor: 1.0, label: 'Hoje', sub: 'vs ontem', diff: '+12.4%' },
    '7days': { factor: 6.8, label: 'Últimos 7 dias', sub: 'vs semana anterior', diff: '+8.7%' },
    '30days': { factor: 28.5, label: 'Últimos 30 dias', sub: 'vs mês anterior', diff: '+15.2%' },
    month: { factor: 26.0, label: 'Mês Atual', sub: 'meta atingida: 94%', diff: '+11.0%' }
  };

  const periodCfg = periodMultipliers[filterPeriod] || periodMultipliers.today;
  const mult = periodCfg.factor;

  // Base estatística por unidade da rede
  const baseStations = [
    {
      id: 'matriz-parintins',
      name: 'Posto Marcos Zagury (Matriz)',
      city: 'Parintins - AM',
      address: 'Av. Marcos Zagury, 455 — Parintins, AM',
      baseRevenue: 8450.00,
      baseFills: 58,
      baseClients: 52,
      baseCashbackUsed: 62.00,
      share: 34,
      attendants: ['Carlos Silva (#1042)', 'Marcos Santos (#1088)', 'Luciana Castro (#1090)'],
      fuelsBreakdown: [
        { name: 'Gasolina Comum', liters: 850, price: 6.59 },
        { name: 'Gasolina Aditivada', liters: 320, price: 6.79 },
        { name: 'Diesel S10', liters: 410, price: 6.89 },
        { name: 'Etanol', liters: 180, price: 5.29 }
      ]
    },
    {
      id: 'posto-barreirinha',
      name: 'Posto Grupo Oliveira Barreirinha',
      city: 'Barreirinha - AM',
      address: 'Área Central / Orla — Barreirinha, AM',
      baseRevenue: 5220.00,
      baseFills: 36,
      baseClients: 32,
      baseCashbackUsed: 42.00,
      share: 21,
      attendants: ['Fernanda Lima (#1105)', 'João Batista (#1108)'],
      fuelsBreakdown: [
        { name: 'Gasolina Comum', liters: 520, price: 6.69 },
        { name: 'Gasolina Aditivada', liters: 180, price: 6.89 },
        { name: 'Diesel S10', liters: 210, price: 6.95 }
      ]
    },
    {
      id: 'posto-nhamunda',
      name: 'Posto Grupo Oliveira Nhamundá',
      city: 'Nhamundá - AM',
      address: 'Orla Principal Fluvial — Nhamundá, AM',
      baseRevenue: 3980.00,
      baseFills: 28,
      baseClients: 25,
      baseCashbackUsed: 31.00,
      share: 16,
      attendants: ['Raimundo Nonato (#1019)', 'Aldo Souza (#1033)'],
      fuelsBreakdown: [
        { name: 'Gasolina Comum', liters: 390, price: 6.75 },
        { name: 'Gasolina Aditivada', liters: 140, price: 6.95 },
        { name: 'Diesel S10', liters: 180, price: 6.99 }
      ]
    },
    {
      id: 'posto-terrasanta',
      name: 'Posto Grupo Oliveira Terra Santa',
      city: 'Terra Santa - PA',
      address: 'Av. Central de Acesso — Terra Santa, PA',
      baseRevenue: 3480.00,
      baseFills: 24,
      baseClients: 22,
      baseCashbackUsed: 26.00,
      share: 14,
      attendants: ['Paulo Guimarães (#1120)'],
      fuelsBreakdown: [
        { name: 'Gasolina Comum', liters: 350, price: 6.65 },
        { name: 'Gasolina Aditivada', liters: 120, price: 6.85 },
        { name: 'Diesel S10', liters: 160, price: 6.89 }
      ]
    },
    {
      id: 'posto-fluvial',
      name: 'Posto Fluvial Grupo Oliveira',
      city: 'Parintins - AM',
      address: 'Orla Fluvial do Porto — Parintins, AM',
      baseRevenue: 2240.00,
      baseFills: 14,
      baseClients: 14,
      baseCashbackUsed: 14.00,
      share: 9,
      attendants: ['Manoel Barreto (#1055)'],
      fuelsBreakdown: [
        { name: 'Gasolina Comum', liters: 210, price: 6.70 },
        { name: 'Diesel Marítimo', liters: 340, price: 6.85 },
        { name: 'Diesel S10', liters: 90, price: 6.92 }
      ]
    },
    {
      id: 'posto-express',
      name: 'Posto Grupo Oliveira Express',
      city: 'Parintins - AM',
      address: 'Av. Amazonas, 1280 — Parintins, AM',
      baseRevenue: 1480.00,
      baseFills: 18,
      baseClients: 17,
      baseCashbackUsed: 10.00,
      share: 6,
      attendants: ['Jéssica Castro (#1142)'],
      fuelsBreakdown: [
        { name: 'Gasolina Comum', liters: 190, price: 6.59 },
        { name: 'Gasolina Aditivada', liters: 85, price: 6.79 },
        { name: 'Etanol', liters: 65, price: 5.29 }
      ]
    }
  ];

  // Adicionar dados reais registrados nesta sessão pelo frentista
  const attendantExtraRev = state.attendantDailyStats ? (state.attendantDailyStats.totalAmount - 2150.80) : 0;
  const attendantExtraFills = state.attendantDailyStats ? (state.attendantDailyStats.fillsCount - 14) : 0;
  if (attendantExtraRev > 0) {
    baseStations[0].baseRevenue += attendantExtraRev;
    baseStations[0].baseFills += attendantExtraFills;
  }

  // Filtrar unidades selecionadas
  const filteredStations = filterStation === 'all' 
    ? baseStations 
    : baseStations.filter(s => s.id === filterStation);

  // Calcular agregados
  let totalRevenue = 0;
  let totalFills = 0;
  let totalClients = 0;
  let cashbackUsed = 0;

  const stationsData = filteredStations.map(st => {
    const rev = Math.round(st.baseRevenue * mult * 100) / 100;
    const fills = Math.round(st.baseFills * mult);
    const clients = Math.round(st.baseClients * (filterPeriod === 'today' ? 1 : mult * 0.7));
    const cbEarned = Math.round(rev * 0.03 * 100) / 100;
    const cbUsed = Math.round(st.baseCashbackUsed * mult * 100) / 100;

    totalRevenue += rev;
    totalFills += fills;
    totalClients += clients;
    cashbackUsed += cbUsed;

    return {
      ...st,
      revenue: rev,
      fills: fills,
      clients: clients,
      cashbackEarned: cbEarned,
      cashbackUsed: cbUsed
    };
  });

  totalRevenue = Math.round(totalRevenue * 100) / 100;
  const totalCashback = Math.round(totalRevenue * 0.03 * 100) / 100;
  cashbackUsed = Math.round(cashbackUsed * 100) / 100;

  // Base global de clientes cadastrados no clube (1.420)
  const baseClientsRegistered = filterStation === 'all' ? 1420 : Math.round(1420 * (filteredStations[0].share / 100));
  // Saldo de cashback em circulação retido nas carteiras dos clientes
  const cashbackInCirculation = filterStation === 'all' ? 8920.40 : Math.round(8920.40 * (filteredStations[0].share / 100) * 100) / 100;

  // Série para gráfico de 7 dias
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje'];
  const dayRatios = [0.85, 0.92, 0.98, 0.94, 1.12, 1.25, 1.05];
  const chart7Days = dayNames.map((day, idx) => {
    const dayFills = Math.max(8, Math.round((totalFills / (filterPeriod === 'today' ? 1 : mult)) * (dayRatios[idx] / 1.05)));
    const dayRev = Math.round(dayFills * 148.50);
    return { day, fills: dayFills, revenue: dayRev };
  });

  // Série para evolução de cashback (Gerado vs Utilizado)
  const chartCashback = dayNames.map((day, idx) => {
    const generated = Math.round((chart7Days[idx].revenue * 0.03) * 100) / 100;
    const used = Math.round(generated * 0.26 * 100) / 100;
    return { day, generated, used };
  });

  // Transações recentes auditáveis
  const networkMockTxs = [
    { customer: 'Kaynã Viana', station: 'Posto Marcos Zagury (Matriz)', stationId: 'matriz-parintins', fuel: 'Gasolina Comum', liters: 35.5, amount: 233.95, cashback: 7.02, time: 'Hoje, 14:35', status: 'Concluído' },
    { customer: 'Mariana Duarte', station: 'Posto Grupo Oliveira Barreirinha', stationId: 'posto-barreirinha', fuel: 'Gasolina Aditivada', liters: 22.1, amount: 150.00, cashback: 4.50, time: 'Hoje, 13:10', status: 'Concluído' },
    { customer: 'Roberto Nogueira', station: 'Posto Grupo Oliveira Nhamundá', stationId: 'posto-nhamunda', fuel: 'Diesel S10', liters: 50.0, amount: 344.50, cashback: 10.33, time: 'Hoje, 11:42', status: 'Concluído' },
    { customer: 'Anderson Picanço', station: 'Posto Grupo Oliveira Terra Santa', stationId: 'posto-terrasanta', fuel: 'Gasolina Comum', liters: 18.0, amount: 119.70, cashback: 3.59, time: 'Hoje, 10:15', status: 'Concluído' },
    { customer: 'Luciana Farias', station: 'Posto Fluvial Grupo Oliveira', stationId: 'posto-fluvial', fuel: 'Diesel Marítimo', liters: 80.0, amount: 548.00, cashback: 16.44, time: 'Hoje, 09:20', status: 'Concluído' },
    { customer: 'Thiago Menezes', station: 'Posto Grupo Oliveira Express', stationId: 'posto-express', fuel: 'Gasolina Comum', liters: 12.0, amount: 79.08, cashback: 2.37, time: 'Hoje, 08:45', status: 'Concluído' }
  ];

  // Integrar transações dinâmicas do frentista ativo se houver
  const liveTxs = (state.fills || []).slice(0, 3).map(f => ({
    customer: f.customerName || state.name,
    station: f.station,
    stationId: 'matriz-parintins',
    fuel: f.fuel,
    liters: f.liters,
    amount: f.amount,
    cashback: f.cashbackEarned,
    time: f.time ? `Hoje, ${f.time}` : 'Hoje',
    status: f.status || 'Concluído'
  }));

  const allRecentTxs = [...liveTxs, ...networkMockTxs];
  const recentFills = filterStation === 'all'
    ? allRecentTxs.slice(0, 6)
    : allRecentTxs.filter(t => t.stationId === filterStation);

  return {
    periodCfg,
    totalRevenue,
    totalFills,
    activeClients: totalClients,
    clientsRegistered: baseClientsRegistered,
    totalCashback,
    cashbackUsed,
    cashbackInCirculation,
    stationsData,
    chart7Days,
    chartCashback,
    recentFills
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
            <button class="attendant-exit-btn" onclick="openRoleSwitcherModal()" aria-label="Sair ou Alternar Perfil">
              <span>🚪 Sair / Trocar</span>
            </button>
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
        </section>

        <!-- 4. Indicadores Principais (6 Cards Compactos - Requisito 4) -->
        <section class="owner-metrics-grid" aria-label="Indicadores da Rede">
          <!-- 1. Valor Faturado -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Faturamento Total</span>
              <div class="owner-metric-icon green">💰</div>
            </div>
            <div class="owner-metric-value">${money(data.totalRevenue)}</div>
            <div class="owner-metric-trend trend-up">
              <span>↑ ${data.periodCfg.diff}</span>
              <span style="font-weight:500;color:var(--text-muted)">${data.periodCfg.sub}</span>
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
              <span>● ${Math.round(data.totalFills / (currentStation === 'all' ? 6 : 1))} por posto</span>
            </div>
          </div>

          <!-- 3. Clientes Cadastrados -->
          <div class="owner-metric-card">
            <div class="owner-metric-head">
              <span class="owner-metric-sublabel">Clientes Ativos</span>
              <div class="owner-metric-icon purple">👥</div>
            </div>
            <div class="owner-metric-value">${data.clientsRegistered.toLocaleString('pt-BR')}</div>
            <div class="owner-metric-trend trend-up">
              <span>+ 18 hoje</span>
              <span style="font-weight:500;color:var(--text-muted)">no Clube</span>
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
              <span>${data.totalCashback > 0 ? ((data.cashbackUsed / data.totalCashback) * 100).toFixed(1) : '24.8'}%</span>
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

        <!-- 7. Movimentações Recentes (Abastecimentos Recentes - Requisito 7) -->
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

  const roleBanner = renderRoleSwitcherBanner();

  if (state.currentRole === 'attendant') {
    view.innerHTML = roleBanner + renderAttendantDashboard();
    return;
  }

  if (state.currentRole === 'owner') {
    view.innerHTML = roleBanner + renderOwnerDashboard();
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

  view.innerHTML = roleBanner + content + renderBottomNav();
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
    clientName: state.name,
    cardNumber: state.cardNumber || '4589 8210 3349 1204',
    discountRequested: selectedCashbackDiscount,
    expiresAt: tokenExpiresAt,
    used: false
  };
  return currentFuelToken;
}

function renderFuelQRCode() {
  const container = document.querySelector('#abastecer-qr-box');
  if (!container || !currentFuelToken) return;

  // Carga protegida sem dados sensíveis (sem CPF, telefone ou dados privados)
  const qrData = `GO-AUTH:CID=${encodeURIComponent(currentFuelToken.clientId)}&TK=${encodeURIComponent(currentFuelToken.code)}&DISC=${encodeURIComponent(currentFuelToken.discountRequested || 0)}&EXP=${currentFuelToken.expiresAt}`;

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

  if (typeof rawData === 'string' && rawData.includes('GO-AUTH:')) {
    const params = new URLSearchParams(rawData.replace('GO-AUTH:', ''));
    tokenCode = params.get('TK') || '';
    clientId = params.get('CID') || '';
    discountRequested = parseFloat(params.get('DISC') || '0');
  } else if (typeof rawData === 'string' && (rawData.startsWith('TK-') || rawData.startsWith('GO-'))) {
    tokenCode = rawData.trim();
  } else {
    try {
      const obj = JSON.parse(rawData);
      tokenCode = obj.code || obj.token || rawData;
      clientId = obj.clientId || '';
      discountRequested = obj.discountRequested || 0;
    } catch (e) {
      tokenCode = String(rawData).trim();
    }
  }

  processScannedToken(tokenCode, { clientId, discountRequested });
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

function processScannedToken(tokenCode, extra = {}) {
  stopScannerCamera();

  // Validar código no servidor simulado
  if (!currentFuelToken || currentFuelToken.code !== tokenCode) {
    currentFuelToken = {
      code: tokenCode,
      clientId: extra.clientId || state.clientId || 'CLI-0824',
      clientName: state.name || 'Kaynã Viana',
      cardNumber: state.cardNumber || '4589 8210 3349 1204',
      discountRequested: extra.discountRequested || selectedCashbackDiscount || 0,
      expiresAt: Date.now() + 90000,
      used: false
    };
  } else if (extra.discountRequested !== undefined) {
    currentFuelToken.discountRequested = extra.discountRequested;
  }

  // Prepara dados sanitizados do cliente (SEM CPF, SEM TELEFONE - Requisito 3)
  const maskedCard = (state.cardNumber || '4589 8210 3349 1204').replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');
  const identifiedCustomer = {
    name: state.name || 'Kaynã Viana',
    maskedCard: maskedCard,
    balance: Number(state.balance) || 0,
    points: Number(state.points) || 0,
    discountRequested: Number(currentFuelToken.discountRequested) || 0,
    tokenCode: currentFuelToken.code
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
function handleRegistrarContinuar(e) {
  e.preventDefault();
  const fuelSel = document.querySelector('#reg-fuel');
  const amountInput = document.querySelector('#reg-amount');
  const litersInput = document.querySelector('#reg-liters');
  const discountInput = document.querySelector('#reg-discount');

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

  // Cria operação pendente (NÃO credita cashback neste momento - Requisito 4)
  state.pendingOperation = {
    id: 'GO-' + Math.floor(100000 + Math.random() * 900000),
    status: 'PENDENTE',
    customerName: currentCustomerSession.name,
    maskedCard: currentCustomerSession.maskedCard,
    station: state.attendantUser ? state.attendantUser.stationName : 'Posto Marcos Zagury (Matriz)',
    stationCity: state.attendantUser ? state.attendantUser.stationCity : 'Parintins - AM',
    attendant: `${state.attendantUser ? state.attendantUser.name : 'Carlos Silva'} (Matrícula #${state.attendantUser ? state.attendantUser.registration : '1042'})`,
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

// Confirmação atômica no servidor simulado (Requisito 5)
function confirmarAbastecimentoFinal() {
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
    btn.textContent = 'Processando no Servidor...';
  }

  const paymentSelect = document.querySelector('#confirm-payment-method');
  if (paymentSelect) {
    op.paymentMethod = paymentSelect.value;
  }

  // 1. Atualizar Saldo do Cliente Atomicamente
  state.balance = Math.round((state.balance - op.cashbackUsed + op.cashbackEarned) * 100) / 100;
  state.cashbackUsed = Math.round(((state.cashbackUsed || 0) + op.cashbackUsed) * 100) / 100;
  state.points = (state.points || 0) + op.pointsEarned;

  // 2. Atualizar Estatísticas Diárias do Frentista
  state.attendantDailyStats = state.attendantDailyStats || { fillsCount: 0, totalAmount: 0, totalCashback: 0 };
  state.attendantDailyStats.fillsCount += 1;
  state.attendantDailyStats.totalAmount = Math.round((state.attendantDailyStats.totalAmount + op.amount) * 100) / 100;
  state.attendantDailyStats.totalCashback = Math.round((state.attendantDailyStats.totalCashback + op.cashbackEarned) * 100) / 100;

  // 3. Montar Objeto da Transação Concluída
  const tx = {
    id: op.id,
    station: op.station,
    city: op.stationCity,
    attendant: op.attendant,
    customerName: op.customerName,
    cardNumber: op.maskedCard,
    fuel: op.fuel,
    amount: op.amount,
    liters: op.liters,
    pricePerLiter: op.pricePerLiter,
    cashbackUsed: op.cashbackUsed,
    netPaid: op.netPaid,
    cashbackEarned: op.cashbackEarned,
    pointsEarned: op.pointsEarned,
    paymentMethod: op.paymentMethod,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: 'Concluído'
  };

  // 4. Adicionar ao Histórico do Frentista e do Cliente
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

  state.fills = state.fills || [];
  state.fills.unshift(tx);

  // 5. Gerar Notificações Oficiais para o Cliente (Requisito 6)
  state.notifications = state.notifications || [];
  state.notifications.unshift({
    id: Date.now(),
    title: 'Abastecimento concluído! ⛽',
    desc: `Abastecimento concluído!\nVocê ganhou ${money(tx.cashbackEarned)} de cashback.`,
    time: 'Agora mesmo',
    cat: 'Cashback',
    icon: 'fuel',
    color: 'purple',
    read: false,
    action: "go('Histórico')",
    btnText: "Ver no Histórico"
  });

  if (tx.cashbackUsed > 0) {
    state.notifications.unshift({
      id: Date.now() + 1,
      title: 'Cashback Utilizado 💳',
      desc: `Você utilizou ${money(tx.cashbackUsed)} de cashback no seu abastecimento.`,
      time: 'Agora mesmo',
      cat: 'Cashback',
      icon: 'coin',
      color: 'red',
      read: false,
      action: "go('Histórico')",
      btnText: "Ver no Histórico"
    });
  }

  // 6. Limpar operação pendente e invalidar token
  state.pendingOperation = null;
  if (currentFuelToken) {
    currentFuelToken.used = true;
  }
  saveState();

  isConfirmingOperation = false;

  // Exibir Recibo de Sucesso
  showReceiptModal(tx);
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

// Initial Run
render();
