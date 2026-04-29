// ============================================
//  NEXUM - script.js
//  Lógica principal: dados, auth, UI, navegação
// ============================================

'use strict';

/* ─── DADOS SIMULADOS ─── */

const EQUIPAMENTOS = [
  {
    id: 1,
    nome: 'Escavadeira Hidráulica',
    categoria: 'escavadeira',
    desc: 'Escavadeira hidráulica de grande porte, ideal para obras de terraplanagem e escavações profundas. Motor turbinado com 220 CV.',
    preco: 1800,
    status: 'disponivel',
    src: 'images/escavadeira_hidraulica.jpeg',
    specs: { peso: '22 ton', alcance: '9,8 m', potencia: '220 CV', cap_cacamba: '1,2 m³' },
    tags: ['terraplanagem', 'escavação', 'fundação'],
    destaque: true
  },
  {
    id: 2,
    nome: 'Betoneira Elétrica 400L',
    categoria: 'betoneira',
    desc: 'Betoneira elétrica de alta capacidade com tambor de 400 litros. Perfeita para obras de médio e grande porte.',
    preco: 280,
    status: 'disponivel',
    src: 'images/betoneira_eletrica_400.png',
    specs: { capacidade: '400 L', tensao: '220V/380V', motor: '2 CV', peso: '180 kg' },
    tags: ['concreto', 'alvenaria'],
    destaque: false
  },
  {
    id: 3,
    nome: 'Compactador de Solo',
    categoria: 'compactador',
    desc: 'Compactador vibratório para solo e base de pavimentação. Excelente desempenho em terrenos irregulares.',
    preco: 320,
    status: 'disponivel',
    src: 'images/compactador_solo.png',
    specs: { forca: '25 kN', frequencia: '75 Hz', motor: 'Honda GX160', peso: '92 kg' },
    tags: ['pavimentação', 'base'],
    destaque: false
  },
  {
    id: 4,
    nome: 'Guindaste Telescópico',
    categoria: 'guindaste',
    desc: 'Guindaste telescópico com lança de 40 metros e capacidade de carga de 25 toneladas. Ideal para construções verticais.',
    preco: 3500,
    status: 'disponivel',
    src: 'images/guindaste_telescopico.png',
    specs: { cap_carga: '25 ton', alcance: '40 m', altura_max: '38 m', peso: '65 ton' },
    tags: ['içamento', 'vertical', 'estrutura'],
    destaque: true
  },
  {
    id: 5,
    nome: 'Retroescavadeira',
    categoria: 'escavadeira',
    desc: 'Retroescavadeira versátil com concha frontal e caçamba traseira. Ideal para pequenas obras e serviços urbanos.',
    preco: 950,
    status: 'indisponivel',
    src: 'images/retroescavadeira.png',
    specs: { potencia: '95 CV', prof_max: '5,5 m', cap_concha: '1,1 m³', peso: '8 ton' },
    tags: ['urbano', 'escavação', 'movimentação'],
    destaque: false
  },
  {
    id: 6,
    nome: 'Rolo Compactador',
    categoria: 'compactador',
    desc: 'Rolo compactador tandem de duplos tambores vibratórios. Perfeito para compactação de asfalto e bases granulares.',
    preco: 1200,
    status: 'disponivel',
    src: 'images/Rolo_compactador.png',
    specs: { largura: '1,2 m', peso_op: '12 ton', amplitude: '0,5 mm', motor: '116 CV' },
    tags: ['asfalto', 'pavimentação'],
    destaque: false
  },
  {
    id: 7,
    nome: 'Andaime Suspenso',
    categoria: 'andaime',
    desc: 'Sistema de andaime suspenso motorizado para fachadas e trabalhos em altura. Capacidade para 2 operadores.',
    preco: 420,
    status: 'disponivel',
    src: 'images/andaime-suspenso.jpg',
    specs: { cap_carga: '300 kg', comprimento: '3,6 m', velocidade: '6 m/min', altura_max: '150 m' },
    tags: ['fachada', 'altura', 'reforma'],
    destaque: false
  },
  {
    id: 8,
    nome: 'Perfuratriz Rotativa',
    categoria: 'perfuratriz',
    desc: 'Perfuratriz rotativa hidráulica para fundações com trado contínuo. Alta produtividade em solo argiloso e arenoso.',
    preco: 2400,
    status: 'disponivel',
    src: 'images/perfuratriz_rotativa.png',
    specs: { diametro: '300-800 mm', profundidade: '20 m', torque: '50 kNm', peso: '18 ton' },
    tags: ['fundação', 'estaca', 'trado'],
    destaque: true
  },
  {
    id: 9,
    nome: 'Minicarregadeira Skid Steer',
    categoria: 'minicarregadeira',
    desc: 'Minicarregadeira compacta e ágil, ideal para espaços restritos. Diversos implementos disponíveis.',
    preco: 680,
    status: 'disponivel',
    src: 'images/minicarregadeira_skid_steer.png',
    specs: { cap_carga: '760 kg', potencia: '74 CV', altura_desc: '2,8 m', peso: '3,4 ton' },
    tags: ['compacto', 'versátil', 'obra'],
    destaque: false
  }
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'escavadeira', label: 'Escavadeiras' },
  { id: 'betoneira', label: 'Betoneiras' },
  { id: 'compactador', label: 'Compactadores' },
  { id: 'guindaste', label: 'Guindastes' },
  { id: 'andaime', label: 'Andaimes' },
  { id: 'perfuratriz', label: 'Perfuratriz' },
  { id: 'minicarregadeira', label: 'Minicarregadeiras' },
];

/* ─── UTILITÁRIOS ─── */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function storageGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* silent */ }
}

function getUsuarios() { return storageGet('nexum_usuarios') || []; }
function setUsuarios(list) { storageSet('nexum_usuarios', list); }

function getUsuarioAtual() { return storageGet('nexum_usuario_atual'); }
function setUsuarioAtual(user) { storageSet('nexum_usuario_atual', user); }

function getAlugueis() { return storageGet('nexum_alugueis') || []; }
function setAlugueis(list) { storageSet('nexum_alugueis', list); }

function formatBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

/* ─── TOAST ─── */

function showToast(msg, type = 'info', duration = 3500) {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse both';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── NAVBAR ─── */

function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  // Scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger
  const ham = $('.nav-hamburger');
  const mobileMenu = $('.nav-mobile');

  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Marca link ativo
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Atualiza navbar com usuário logado
  updateNavUser();
}

function updateNavUser() {
  const user = getUsuarioAtual();
  const actionsEl = $('.nav-actions');
  if (!actionsEl) return;

  if (user) {
    const nome = user.nome || user.nomeEmpresa || 'Usuário';
    const inicial = nome.charAt(0).toUpperCase();
    actionsEl.innerHTML = `
      <div class="nav-user">
        <a href="painel.html" class="btn btn-ghost btn-sm">Painel</a>
        <div class="nav-avatar" title="${nome}">${inicial}</div>
        <button onclick="logout()" class="btn btn-ghost btn-sm">Sair</button>
      </div>
    `;
  } else {
    actionsEl.innerHTML = `
      <a href="login.html" class="btn btn-ghost btn-sm">Login</a>
      <a href="cadastro.html" class="btn btn-primary btn-sm">Cadastrar</a>
    `;
  }
}

function logout() {
  setUsuarioAtual(null);
  showToast('Você saiu da conta.', 'info');
  setTimeout(() => window.location.href = 'index.html', 800);
}

/* ─── LOADING ─── */

function initLoading() {
  const el = $('#loading');
  if (!el) return;
  setTimeout(() => el.classList.add('hidden'), 1200);
}

/* ─── SCROLL REVEAL ─── */

function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ─── CARD DE EQUIPAMENTO ─── */

function criarCardEquipamento(eq, delay = 0) {
  const disponivel = eq.status === 'disponivel';
  const card = document.createElement('div');
  card.className = 'equip-card';
  card.style.animationDelay = `${delay}ms`;
  card.innerHTML = `
    <div class="equip-card-img"><img src=${eq.src}></div>
    <div class="equip-card-body">
      <span class="equip-card-category">${eq.categoria}</span>
      <h3 class="equip-card-name">${eq.nome}</h3>
      <p class="equip-card-desc">${eq.desc.substring(0, 90)}...</p>
      <div class="equip-card-footer">
        <div class="equip-card-price">
          ${formatBRL(eq.preco)} <small>/ dia</small>
        </div>
        <span class="status-badge ${disponivel ? 'status-available' : 'status-unavailable'}">
          ${disponivel ? 'Disponível' : 'Indisponível'}
        </span>
      </div>
      <a href="detalhes.html?id=${eq.id}" class="btn btn-outline btn-sm" style="margin-top:14px; width:100%; justify-content:center;">
        Ver Detalhes →
      </a>
    </div>
  `;
  return card;
}

/* ═══════════════════════════════════════════
   HOME — index.html
   ═══════════════════════════════════════════ */

function initHome() {
  const grid = $('#destaque-grid');
  if (!grid) return;

  const destaques = EQUIPAMENTOS.filter(e => e.destaque).slice(0, 4);
  destaques.forEach((eq, i) => {
    grid.appendChild(criarCardEquipamento(eq, i * 80));
  });

  // Número animado
  animateNumbers();
}

function animateNumbers() {
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString('pt-BR') + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 24);
  });
}

/* ═══════════════════════════════════════════
   EQUIPAMENTOS — equipamentos.html
   ═══════════════════════════════════════════ */

let filtroAtual = 'todos';
let buscaAtual = '';

function initEquipamentos() {
  const grid = $('#equip-grid');
  if (!grid) return;

  // Filtros
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtroAtual = btn.dataset.cat;
      renderEquipamentos();
    });
  });

  // Busca
  const searchInput = $('#equip-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      buscaAtual = e.target.value.toLowerCase();
      renderEquipamentos();
    });
  }

  renderEquipamentos();
}

function renderEquipamentos() {
  const grid = $('#equip-grid');
  if (!grid) return;

  let lista = EQUIPAMENTOS;

  if (filtroAtual !== 'todos') {
    lista = lista.filter(e => e.categoria === filtroAtual);
  }

  if (buscaAtual) {
    lista = lista.filter(e =>
      e.nome.toLowerCase().includes(buscaAtual) ||
      e.desc.toLowerCase().includes(buscaAtual) ||
      e.categoria.toLowerCase().includes(buscaAtual)
    );
  }

  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">🔍</div>
        <p class="title">Nenhum equipamento encontrado</p>
        <p class="desc">Tente outra busca ou categoria</p>
      </div>
    `;
    return;
  }

  lista.forEach((eq, i) => {
    grid.appendChild(criarCardEquipamento(eq, i * 60));
  });
}

/* ═══════════════════════════════════════════
   DETALHES — detalhes.html
   ═══════════════════════════════════════════ */

function initDetalhes() {
  const container = $('#detalhe-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const eq = EQUIPAMENTOS.find(e => e.id === id);

  if (!eq) {
    container.innerHTML = `
      <div class="empty-state" style="padding:120px 0">
        <div class="icon">😕</div>
        <p class="title">Equipamento não encontrado</p>
        <p class="desc"><a href="equipamentos.html" style="color:var(--orange)">Voltar aos equipamentos</a></p>
      </div>
    `;
    return;
  }

  document.title = `${eq.nome} — Nexum`;

  const disponivel = eq.status === 'disponivel';

  container.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Home</a>
      <span class="sep">/</span>
      <a href="equipamentos.html">Equipamentos</a>
      <span class="sep">/</span>
      <span>${eq.nome}</span>
    </div>

    <div class="detail-grid">
      <div>
        <img src="${eq.src}">
      </div>
      <div class="detail-info">
        <p class="detail-category">${eq.categoria}</p>
        <h1 class="detail-name">${eq.nome}</h1>
        <div>
          <span class="status-badge ${disponivel ? 'status-available' : 'status-unavailable'}">
            ${disponivel ? '✓ Disponível' : '✗ Indisponível'}
          </span>
        </div>

        <div style="margin: 24px 0;">
          <div class="detail-price">${formatBRL(eq.preco)} <small>/ dia</small></div>
        </div>

        <p class="detail-desc">${eq.desc}</p>

        <div class="detail-specs">
          ${Object.entries(eq.specs).map(([k, v]) => `
            <div class="spec-item">
              <div class="spec-label">${k.replace('_', ' ')}</div>
              <div class="spec-val">${v}</div>
            </div>
          `).join('')}
        </div>

        <div class="detail-actions">
          ${disponivel
            ? `<button onclick="solicitarAluguel(${eq.id})" class="btn btn-primary btn-lg">
                 🔑 Solicitar Aluguel
               </button>`
            : `<button class="btn btn-ghost btn-lg" disabled style="opacity:.5;cursor:not-allowed">
                 Indisponível no momento
               </button>`
          }
          <a href="equipamentos.html" class="btn btn-outline btn-lg">← Voltar</a>
        </div>

        <div style="margin-top:24px; display:flex; gap:10px; flex-wrap:wrap;">
          ${eq.tags.map(t => `<span style="
            background:rgba(255,255,255,0.05);
            border:1px solid rgba(255,255,255,0.08);
            border-radius:100px;
            padding:4px 12px;
            font-size:0.75rem;
            color:var(--gray-400);
          ">#${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function solicitarAluguel(id) {
  const user = getUsuarioAtual();
  if (!user) {
    showToast('Faça login para solicitar um aluguel.', 'error');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  openModalAluguel(id);
}

function openModalAluguel(id) {
  const eq = EQUIPAMENTOS.find(e => e.id === id);
  if (!eq) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="position:relative">
      <div class="modal-header">
        <div>
          <p class="modal-title">Solicitar Aluguel</p>
          <p class="modal-sub">${eq.nome} — ${formatBRL(eq.preco)}/dia</p>
        </div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Data de Início</label>
        <input type="date" id="modal-inicio" class="form-input" min="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label class="form-label">Data de Fim</label>
        <input type="date" id="modal-fim" class="form-input">
      </div>
      <div id="modal-total" style="
        background:rgba(242,101,34,0.08);
        border:1px solid rgba(242,101,34,0.2);
        border-radius:8px;
        padding:14px;
        margin-bottom:20px;
        font-size:0.88rem;
        color:var(--gray-200);
        display:none;
      "></div>
      <button onclick="confirmarAluguel(${id})" class="btn btn-primary btn-full btn-lg">
        Confirmar Solicitação
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('open'), 10);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  // Calcular total ao mudar datas
  ['modal-inicio', 'modal-fim'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => calcularTotal(eq.preco));
  });
}

function calcularTotal(precoDia) {
  const inicio = document.getElementById('modal-inicio')?.value;
  const fim = document.getElementById('modal-fim')?.value;
  const totalEl = document.getElementById('modal-total');
  if (!inicio || !fim || !totalEl) return;

  const dias = Math.ceil((new Date(fim) - new Date(inicio)) / 86400000);
  if (dias <= 0) {
    totalEl.style.display = 'none';
    return;
  }

  const total = dias * precoDia;
  totalEl.style.display = 'block';
  totalEl.innerHTML = `
    <span style="color:var(--gray-400)">Duração:</span> <strong style="color:var(--white)">${dias} dia${dias > 1 ? 's' : ''}</strong>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <span style="color:var(--gray-400)">Total estimado:</span> <strong style="color:var(--orange)">${formatBRL(total)}</strong>
  `;
}

function confirmarAluguel(id) {
  const inicio = document.getElementById('modal-inicio')?.value;
  const fim = document.getElementById('modal-fim')?.value;

  if (!inicio || !fim) {
    showToast('Selecione as datas de início e fim.', 'error');
    return;
  }

  if (new Date(fim) <= new Date(inicio)) {
    showToast('A data de fim deve ser após a de início.', 'error');
    return;
  }

  const user = getUsuarioAtual();
  const eq = EQUIPAMENTOS.find(e => e.id === id);
  const dias = Math.ceil((new Date(fim) - new Date(inicio)) / 86400000);
  const total = dias * eq.preco;

  const aluguel = {
    id: Date.now(),
    equipamentoId: id,
    equipamentoNome: eq.nome,
    equipamentoImagem: eq.src,
    userEmail: user.email,
    inicio,
    fim,
    dias,
    total,
    status: 'ativo',
    criadoEm: new Date().toISOString()
  };

  const alugueis = getAlugueis();
  alugueis.push(aluguel);
  setAlugueis(alugueis);

  // Fechar modal
  document.querySelector('.modal-overlay')?.remove();

  showToast(`✅ Aluguel solicitado com sucesso! Total: ${formatBRL(total)}`, 'success', 4000);
}

/* ═══════════════════════════════════════════
   LOGIN — login.html
   ═══════════════════════════════════════════ */

function initLogin() {
  const form = $('#login-form');
  if (!form) return;

  // Redireciona se já logado
  if (getUsuarioAtual()) {
    window.location.href = 'painel.html';
    return;
  }

  // Tabs
  $$('.form-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.form-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    fazerLogin();
  });
}

function fazerLogin() {
  const email = $('#login-email');
  const senha = $('#login-senha');
  const alertEl = $('#login-alert');

  // Limpa erros
  [email, senha].forEach(el => el.classList.remove('error'));
  alertEl.classList.remove('show', 'alert-error', 'alert-success');

  let valido = true;

  if (!validarEmail(email.value)) {
    email.classList.add('error');
    showFieldError('login-email-err', 'E-mail inválido');
    valido = false;
  }

  if (senha.value.length < 6) {
    senha.classList.add('error');
    showFieldError('login-senha-err', 'Senha deve ter ao menos 6 caracteres');
    valido = false;
  }

  if (!valido) return;

  const usuarios = getUsuarios();
  const user = usuarios.find(u => u.email === email.value && u.senha === senha.value);

  if (!user) {
    alertEl.textContent = '✕ E-mail ou senha incorretos.';
    alertEl.className = 'alert alert-error show';
    return;
  }

  setUsuarioAtual(user);
  alertEl.textContent = '✓ Login realizado! Redirecionando...';
  alertEl.className = 'alert alert-success show';

  setTimeout(() => window.location.href = 'painel.html', 1000);
}

/* ═══════════════════════════════════════════
   CADASTRO — cadastro.html
   ═══════════════════════════════════════════ */

let tipoCadastro = 'cliente';

function initCadastro() {
  const form = $('#cadastro-form');
  if (!form) return;

  if (getUsuarioAtual()) {
    window.location.href = 'painel.html';
    return;
  }

  // Tabs
  $$('.form-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.form-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      tipoCadastro = tab.dataset.type;
      alternarCamposCadastro();
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    fazerCadastro();
  });

  alternarCamposCadastro();
}

function alternarCamposCadastro() {
  const camposCliente = $('#campos-cliente');
  const camposEmpresa = $('#campos-empresa');

  if (camposCliente) camposCliente.style.display = tipoCadastro === 'cliente' ? 'block' : 'none';
  if (camposEmpresa) camposEmpresa.style.display = tipoCadastro === 'empresa' ? 'block' : 'none';
}

function fazerCadastro() {
  const email = $('#cad-email');
  const senha = $('#cad-senha');
  const confirmSenha = $('#cad-confirma-senha');
  const alertEl = $('#cad-alert');

  // Limpa
  $$('#cadastro-form .form-input').forEach(el => el.classList.remove('error'));
  $$('#cadastro-form .form-error').forEach(el => el.classList.remove('show'));
  alertEl.classList.remove('show');

  let valido = true;
  let userData = { tipo: tipoCadastro };

  if (tipoCadastro === 'cliente') {
    const nome = $('#cad-nome');
    if (!nome.value.trim() || nome.value.trim().length < 3) {
      nome.classList.add('error');
      showFieldError('cad-nome-err', 'Nome deve ter ao menos 3 caracteres');
      valido = false;
    } else {
      userData.nome = nome.value.trim();
    }
  } else {
    const nomeEmpresa = $('#cad-nome-empresa');
    const cnpj = $('#cad-cnpj');

    if (!nomeEmpresa.value.trim()) {
      nomeEmpresa.classList.add('error');
      showFieldError('cad-empresa-err', 'Nome da empresa obrigatório');
      valido = false;
    } else {
      userData.nomeEmpresa = nomeEmpresa.value.trim();
    }

    if (!validarCNPJ(cnpj.value)) {
      cnpj.classList.add('error');
      showFieldError('cad-cnpj-err', 'CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)');
      valido = false;
    } else {
      userData.cnpj = cnpj.value;
    }
  }

  if (!validarEmail(email.value)) {
    email.classList.add('error');
    showFieldError('cad-email-err', 'E-mail inválido');
    valido = false;
  }

  if (senha.value.length < 6) {
    senha.classList.add('error');
    showFieldError('cad-senha-err', 'Mínimo 6 caracteres');
    valido = false;
  }

  if (senha.value !== confirmSenha.value) {
    confirmSenha.classList.add('error');
    showFieldError('cad-confirma-err', 'As senhas não coincidem');
    valido = false;
  }

  if (!valido) return;

  const usuarios = getUsuarios();
  if (usuarios.find(u => u.email === email.value)) {
    alertEl.textContent = '✕ Este e-mail já está cadastrado.';
    alertEl.className = 'alert alert-error show';
    return;
  }

  userData.email = email.value;
  userData.senha = senha.value;
  userData.criadoEm = new Date().toISOString();
  userData.id = Date.now();

  usuarios.push(userData);
  setUsuarios(usuarios);
  setUsuarioAtual(userData);

  alertEl.textContent = '✓ Conta criada com sucesso! Redirecionando...';
  alertEl.className = 'alert alert-success show';

  setTimeout(() => window.location.href = 'painel.html', 1200);
}

/* ═══════════════════════════════════════════
   PAINEL — painel.html
   ═══════════════════════════════════════════ */

function initPainel() {
  const user = getUsuarioAtual();
  if (!user) {
    showToast('Faça login para acessar o painel.', 'error');
    setTimeout(() => window.location.href = 'login.html', 800);
    return;
  }

  // Preenche dados
  const nome = user.nome || user.nomeEmpresa || 'Usuário';
  const inicial = nome.charAt(0).toUpperCase();

  setEl('#dash-avatar', inicial);
  setEl('#dash-nome', nome);
  setEl('#dash-email', user.email);
  setEl('#dash-type', user.tipo === 'empresa' ? '🏢 Empresa' : '👤 Cliente');
  setEl('#dash-nome-info', nome);
  setEl('#dash-email-info', user.email);
  setEl('#dash-tipo-info', user.tipo === 'empresa' ? 'Empresa' : 'Cliente');
  setEl('#dash-membro-desde', formatDate(user.criadoEm));

  if (user.tipo === 'empresa') {
    const cnpjEl = $('#dash-cnpj-row');
    if (cnpjEl) { cnpjEl.style.display = 'flex'; }
    setEl('#dash-cnpj-info', user.cnpj || '—');
  }

  // Alugueis do usuário
  const meusAlugueis = getAlugueis().filter(a => a.userEmail === user.email);

  // Stats
  setEl('#dash-total-alugueis', meusAlugueis.length);
  const totalGasto = meusAlugueis.reduce((acc, a) => acc + a.total, 0);
  setEl('#dash-total-gasto', formatBRL(totalGasto));
  const ativos = meusAlugueis.filter(a => a.status === 'ativo').length;
  setEl('#dash-ativos', ativos);

  // Renderiza lista
  const listaEl = $('#dash-alugueis-lista');
  if (listaEl) {
    if (meusAlugueis.length === 0) {
      listaEl.innerHTML = `
        <div class="empty-state">
          <div class="icon">📦</div>
          <p class="title">Nenhum aluguel ainda</p>
          <p class="desc"><a href="equipamentos.html" style="color:var(--orange)">Explore nossos equipamentos</a></p>
        </div>
      `;
    } else {
      meusAlugueis.forEach(a => {
        const card = document.createElement('div');
        card.className = 'rental-card';
        card.innerHTML = `
          <div class="rental-icon"><img src=${a.equipamentoImagem}></div>
          <div class="rental-info">
            <p class="rental-name">${a.equipamentoNome}</p>
            <p class="rental-dates">📅 ${formatDate(a.inicio)} → ${formatDate(a.fim)} (${a.dias} dia${a.dias > 1 ? 's' : ''})</p>
          </div>
          <div class="rental-status">
            <p class="rental-price">${formatBRL(a.total)}</p>
            <span class="status-badge status-available">Ativo</span>
          </div>
        `;
        listaEl.appendChild(card);
      });
    }
  }

  // Navegação do painel
  $$('.dash-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      $$('.dash-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const target = item.dataset.section;
      $$('.dash-section').forEach(s => s.classList.remove('active'));
      const section = $(`#dash-${target}`);
      if (section) section.classList.add('active');
    });
  });
}

/* ─── HELPERS ─── */

function setEl(sel, val) {
  const el = $(sel);
  if (el) el.textContent = val;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCNPJ(cnpj) {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
}

function formatarCNPJ(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
  v = v.replace(/(\d{4})(\d)/, '$1-$2');
  input.value = v.slice(0, 18);
}

/* ─── INIT GERAL ─── */

document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initNavbar();
  initReveal();

  const page = window.location.pathname.split('/').pop();

  if (!page || page === 'index.html') initHome();
  else if (page === 'equipamentos.html') initEquipamentos();
  else if (page === 'detalhes.html') initDetalhes();
  else if (page === 'login.html') initLogin();
  else if (page === 'cadastro.html') initCadastro();
  else if (page === 'painel.html') initPainel();

  // Animação de entrada de página
  document.body.classList.add('page-enter');
});
// seu código atual...

// 🔹 CARREGAR DADOS NO PERFIL
if (window.location.pathname.includes("perfil.html")) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
  }

  document.getElementById("nome").value = user.nome || "";
  document.getElementById("email").value = user.email || "";
}

// 🔹 SALVAR PERFIL
const form = document.getElementById("perfilForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // aqui você coloca lógica de submit
    console.log("Form enviado");
  });
}

// 🔹 CARREGAR DADOS DO PERFIL (fora do submit)
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const perfilForm = document.getElementById("perfilForm");

if (nomeInput && emailInput) {
  const user = getUsuarioAtual();

  if (!user) {
    showToast('Faça login primeiro.', 'error');
    setTimeout(() => window.location.href = 'login.html', 800);
  } else {
    nomeInput.value = user.nome || user.nomeEmpresa || "";
    emailInput.value = user.email || "";
  }
}

// 🔹 SALVAR PERFIL
if (perfilForm) {
  perfilForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = getUsuarioAtual();
    if (!user) return;

    const nome = nomeInput.value;
    const email = emailInput.value;
    const senha = senhaInput.value;

    // Atualiza usuário atual
    user.nome = nome;
    user.email = email;

    if (senha && senha.trim() !== "") {
      user.senha = senha;
    }

    // Atualiza lista de usuários
    let usuarios = getUsuarios();
    usuarios = usuarios.map(u => u.id === user.id ? user : u);

    setUsuarios(usuarios);
    setUsuarioAtual(user);

    showToast('Perfil atualizado com sucesso!', 'success');

    setTimeout(() => {
      window.location.href = "painel.html";
    }, 800);
  });
}