# Grupo Oliveira — Clube de Vantagens e Fidelidade

Plataforma mobile-first de fidelidade, cashback e gestão para a rede de postos do **Grupo Oliveira** (Parintins - AM, Barreirinha - AM, Nhamundá - AM e Terra Santa - PA).

---

## 🎨 Identidade Visual e Diretrizes de Marca

- **Cores Oficiais:**
  - **Roxo Primário:** `#562F82` (e roxo profundo `#1C0B2F`)
  - **Azul Primário:** `#0082CA`
  - **Vermelho Vibrante:** `#D40023`
- **Tipografia:** `Outfit` e `Plus Jakarta Sans`
- **Presença Regional / 6 Unidades da Rede:**
  - **Parintins - AM:** Posto Marcos Zagury (Matriz — Av. Marcos Zagury, 455 — 24 Horas)
  - **Barreirinha - AM:** Posto Grupo Oliveira Barreirinha (Área Central / Orla)
  - **Nhamundá - AM:** Posto Grupo Oliveira Nhamundá (Abastecimento terrestre e fluvial)
  - **Terra Santa - PA:** Posto Grupo Oliveira Terra Santa (Av. Central de Acesso)
  - **Parintins - AM:** Posto Fluvial Grupo Oliveira (Orla Fluvial do Porto)
  - **Parintins - AM:** Posto Grupo Oliveira Express (Av. Amazonas, 1280)
- **Instagram Oficial:** [@grupooliveirapin](https://www.instagram.com/grupooliveirapin)

---

## 👥 Perfis e Hierarquia de Acesso

O sistema conta com 3 perfis integrados, com alternador rápido de demonstração no topo da interface:

1. **👤 Perfil do Cliente (`customer`):**
   - Cartão digital dinâmico com QR Code seguro e número exclusivo.
   - Saldo de cashback em tempo real e extrato de pontos.
   - Botão **"Abastecer"** com pré-seleção de desconto e token temporário (`TK-GO-XXXX`).
   - Catálogo de prêmios e resgate de vouchers.
   - Histórico completo de abastecimentos e central de notificações.

2. **⛽ Perfil do Frentista (`attendant`):**
   - Terminal de pista mobile-first (Conta demo: *Carlos Silva • Matrícula #1042*).
   - Resumo do dia: abastecimentos realizados, faturamento do turno e cashback emitido.
   - Leitor de QR Code integrado via câmera e validação de token dinâmico.
   - Registro de abastecimento com posto travado, seleção de combustível e cálculo de litros.
   - Trava de segurança: resgate de cashback habilitado apenas a partir de R$ 10,00 de saldo acumulado.
   - Confirmação final em 2 etapas com o banner de instrução obrigatório:
     > *"Realize o abastecimento normalmente. Após a conclusão do pagamento, confirme a operação."*
   - Gravação atômica da transação, atualização de saldo e emissão de comprovante digital.

3. **🏢 Painel Executivo do Proprietário (`owner`):**
   - Interface 100% mobile-first com padrão de cartões brancos sobre fundo azul-marinho.
   - 6 indicadores consolidados da rede: *Faturamento Total, Abastecimentos, Clientes Ativos, Cashback Emitido, Cashback Resgatado e Saldo Retido em Carteiras*.
   - Gráficos discretos em SVG nativo: volume de abastecimentos dos últimos 7 dias, evolução de cashback e comparativo entre as 6 unidades.
   - Visão detalhada de cada unidade com equipe em turno, litros vendidos por combustível e ticket médio.
   - Filtros dinâmicos por posto e por período (*Hoje, 7 Dias, 30 Dias, Mês*).
   - Histórico recente de movimentações auditáveis da rede.

---

## 📁 Estrutura do Projeto

```text
POSTO DE GASOLINA/
├── IDENTIDADE VISUAL GRUPO OLIVEIRA.pdf   # Guia oficial de marca do Grupo Oliveira
├── supabase_schema.sql                    # Modelagem relacional, funções atômicas e políticas RLS
├── README.md                              # Documentação oficial
└── site/
    ├── index.html                         # Estrutura principal mobile
    ├── gallery.html                       # Galeria de mídias e assets oficiais
    └── assets/
        ├── css/
        │   └── styles.css                 # Identidade visual, temas e responsividade
        ├── js/
        │   ├── app.js                     # Lógica da aplicação, perfis, regras e estado
        │   └── qrcode.min.js              # Biblioteca para renderização de QR Code
        └── img/
            ├── brand/                     # Logotipos oficiais (branco, roxo, favicon)
            ├── icons/                     # Ícones padronizados de benefícios e métricas
            └── media/                     # Mídias e fotos reais da rede de postos
```

---

## 🚀 Como Executar Localmente

1. No terminal do projeto:
   ```bash
   python -m http.server 8000 --directory "site"
   ```

2. Acesse no navegador:
   - **Aplicativo:** [http://localhost:8000/](http://localhost:8000/)
   - **Alternar Perfil:** Use o botão superior **"🔄 Alternar Perfil ▾"** para navegar entre Cliente, Frentista e Proprietário.
