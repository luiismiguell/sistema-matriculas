/* ── shared.js — utilitários globais ── */

/* Menu mobile (sidebar) */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btnMenu = document.getElementById('btn-menu');
  if (!sidebar || !btnMenu) return;
  const toggle = () => { sidebar.classList.toggle('aberta'); overlay.classList.toggle('ativo'); };
  btnMenu.addEventListener('click', toggle);
  overlay?.addEventListener('click', toggle);
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
