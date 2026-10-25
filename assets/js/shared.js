/* ── shared.js — utilitários globais ── */

/* ── TEMA: inicialização anti-flash (deve rodar o quanto antes) ── */
(function initThemeEarly() {
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = 'light';
    if (saved === 'dark' || saved === 'light') {
      theme = saved;
    } else if (saved === 'system' || saved === null) {
      theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // Falha silenciosa: localStorage indisponível
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

/* ── TEMA: API pública ── */
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // Falha silenciosa
  }
  updateThemeButtons(theme);
  // Disparar evento para componentes reagirem
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

function toggleTheme() {
  const current = getCurrentTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeButtons(theme) {
  const isDark = theme === 'dark';
  document.querySelectorAll('.btn-tema').forEach(btn => {
    btn.setAttribute('aria-pressed', isDark);
    btn.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
    const icon = btn.querySelector('.btn-tema__icone');
    if (icon) {
      // SVG icons: moon for light mode (action: enable dark), sun for dark mode (action: enable light)
      icon.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  });
}

/* Inicialização completa do tema (chamada após DOM ready) */
function initTheme() {
  const theme = getCurrentTheme();
  updateThemeButtons(theme);

  // Botões de tema
  document.querySelectorAll('.btn-tema').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Listener para mudança de preferência do sistema
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const saved = localStorage.getItem('theme');
      if (saved === null || saved === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  } catch (e) {
    // Ignorar erros
  }
}

/* Menu mobile (sidebar) */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btnMenu = document.getElementById('btn-menu');
  if (!sidebar || !btnMenu) return;
  const toggle = () => {
    const isOpen = sidebar.classList.toggle('aberta');
    overlay.classList.toggle('ativo');
    btnMenu.setAttribute('aria-expanded', isOpen);
    // Focus management: quando abre, foco no primeiro link da sidebar
    if (isOpen) {
      const firstLink = sidebar.querySelector('.sidebar__link');
      if (firstLink) firstLink.focus();
    }
  };
  btnMenu.addEventListener('click', toggle);
  overlay?.addEventListener('click', toggle);
  // Fechar com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('aberta')) {
      toggle();
      btnMenu.focus();
    }
  });
  // Inicializar estado ARIA
  btnMenu.setAttribute('aria-expanded', 'false');
  btnMenu.setAttribute('aria-controls', 'sidebar');
}

/* Saudação por horário */
function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/* Mostrar/ocultar senha */
function initToggleSenha() {
  document.querySelectorAll('.campo__olho').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.alvo);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });
}

/* Feedback visual */
function exibirFeedback(idMsg, texto, tipo) {
  const el = document.getElementById(idMsg);
  if (!el) return;
  el.textContent = texto;
  el.className = 'feedback feedback--' + tipo;
  el.classList.remove('oculto');
  setTimeout(() => el.classList.add('oculto'), 4000);
}

/* Estado de carregamento em botão */
function setCarregando(btn, estado) {
  btn.disabled = estado;
  btn.querySelector('.btn__texto')?.classList.toggle('oculto', estado);
  btn.querySelector('.btn__spinner')?.classList.toggle('oculto', !estado);
}

/* Validação de campo */
function validarCampo(input, msg) {
  const erro = document.getElementById('erro-' + input.id);
  if (!input.value.trim()) {
    input.classList.add('invalido');
    if (erro) erro.textContent = msg;
    return false;
  }
  input.classList.remove('invalido');
  if (erro) erro.textContent = '';
  return true;
}

function validarEmail(input) {
  const erro = document.getElementById('erro-' + input.id);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  if (!ok) {
    input.classList.add('invalido');
    if (erro) erro.textContent = 'Informe um e-mail válido.';
    return false;
  }
  input.classList.remove('invalido');
  if (erro) erro.textContent = '';
  return true;
}

/* Cor por ocupação */
function corOcupacao(pct) {
  if (pct >= 90) return '#10B981';
  if (pct >= 70) return '#F59E0B';
  return '#EF4444';
}

/* Ano atual no rodapé */
document.querySelectorAll('.ano-atual').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── MODAL ACESSÍVEL ── */
/**
 * Abre um modal acessível com focus trap
 * @param {string} modalId - ID do elemento .modal-overlay
 * @param {HTMLElement} trigger - Elemento que abriu o modal (para devolver foco)
 */
function abrirModal(modalId, trigger) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.remove('oculto');
  overlay.setAttribute('aria-hidden', 'false');

  // Salvar trigger para devolver foco
  overlay.dataset.triggerId = trigger?.id || '';
  overlay.dataset.triggerSelector = trigger ? getUniqueSelector(trigger) : '';

  // Focus trap
  const modal = overlay.querySelector('.modal');
  if (modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const titulo = modal.querySelector('.modal__titulo, h3, h2');
    if (titulo && titulo.id) {
      modal.setAttribute('aria-labelledby', titulo.id);
    }

    // Foco no primeiro elemento focável
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  // Bloquear scroll do body
  document.body.style.overflow = 'hidden';

  // Fechar com Escape
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      fecharModal(modalId);
    }
  };
  overlay._handleKeydown = handleKeydown;
  document.addEventListener('keydown', handleKeydown);

  // Focus trap dentro do modal
  const handleFocus = (e) => {
    const modal = overlay.querySelector('.modal');
    if (!modal || !overlay.contains(e.target)) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  overlay._handleFocus = handleFocus;
  document.addEventListener('keydown', handleFocus);
}

/**
 * Fecha um modal acessível
 * @param {string} modalId - ID do elemento .modal-overlay
 */
function fecharModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.add('oculto');
  overlay.setAttribute('aria-hidden', 'true');

  // Remover listeners
  if (overlay._handleKeydown) {
    document.removeEventListener('keydown', overlay._handleKeydown);
  }
  if (overlay._handleFocus) {
    document.removeEventListener('keydown', overlay._handleFocus);
  }

  // Restaurar scroll
  document.body.style.overflow = '';

  // Devolver foco ao trigger
  const triggerId = overlay.dataset.triggerId;
  const triggerSelector = overlay.dataset.triggerSelector;
  let trigger = null;
  if (triggerId) trigger = document.getElementById(triggerId);
  if (!trigger && triggerSelector) {
    try { trigger = document.querySelector(triggerSelector); } catch (e) {}
  }
  if (trigger) trigger.focus();

  // Reset form se houver
  const form = overlay.querySelector('form');
  if (form) form.reset();
}

/**
 * Gera seletor único para um elemento
 */
function getUniqueSelector(el) {
  if (el.id) return '#' + el.id;
  let path = [];
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.className) {
      const classes = el.className.split(' ').filter(c => c).join('.');
      if (classes) selector += '.' + classes;
    }
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(' > ');
}

/* Inicialização genérica de modais com data-modal-trigger */
function initModals() {
  document.querySelectorAll('[data-modal-trigger]').forEach(btn => {
    const modalId = btn.dataset.modalTrigger;
    btn.addEventListener('click', () => abrirModal(modalId, btn));
  });

  document.querySelectorAll('.modal__fechar, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) fecharModal(overlay.id);
    });
  });

  // Fechar clicando no overlay (fora do modal)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        fecharModal(overlay.id);
      }
    });
  });
}

/* ── SEGURANÇA: escape de HTML ── */
/**
 * Escapa caracteres especiais de HTML para evitar injeção (XSS).
 * Usado em textos dinâmicos que podem vir de dados do usuário ou da API.
 * @param {string} str - Texto a ser escapado
 * @returns {string} Texto seguro para inserção como texto
 */
function escaparHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── FORMULÁRIOS: validação acessível ── */
/**
 * Marca campo como inválido e associa mensagem de erro via aria-describedby
 */
function marcarInvalido(input, mensagem) {
  input.classList.add('invalido');
  input.setAttribute('aria-invalid', 'true');
  const erroId = 'erro-' + input.id;
  const erroEl = document.getElementById(erroId);
  if (erroEl) {
    erroEl.textContent = mensagem;
    input.setAttribute('aria-describedby', erroId);
  }
}

/**
 * Marca campo como válido
 */
function marcarValido(input) {
  input.classList.remove('invalido');
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  const erroEl = document.getElementById('erro-' + input.id);
  if (erroEl) erroEl.textContent = '';
}

/**
 * Valida formulário e foca no primeiro campo inválido
 * @returns {boolean} true se válido
 */
function validarFormulario(form) {
  const invalidos = form.querySelectorAll('.invalido, [aria-invalid="true"]');
  if (invalidos.length > 0) {
    invalidos[0].focus();
    return false;
  }
  return true;
}

/* Expor funções globalmente para uso nos scripts específicos */
window.initTheme = initTheme;
window.initSidebar = initSidebar;
window.initToggleSenha = initToggleSenha;
window.initModals = initModals;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.exibirFeedback = exibirFeedback;
window.setCarregando = setCarregando;
window.validarCampo = validarCampo;
window.validarEmail = validarEmail;
window.marcarInvalido = marcarInvalido;
window.marcarValido = marcarValido;
window.validarFormulario = validaFormulario;
window.saudacao = saudacao;
window.escaparHTML = escaparHTML;
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
window.setTheme = setTheme;
