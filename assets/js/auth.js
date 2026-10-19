/* ── auth.js ── */
initToggleSenha();

/* Força da senha */
const inputSenha = document.getElementById('cad-senha');
const barraForca = document.getElementById('barra-forca');
if (inputSenha && barraForca) {
  inputSenha.addEventListener('input', () => {
    const v = inputSenha.value;
    let p = 0;
    if (v.length >= 8)          p++;
    if (/[A-Z]/.test(v))        p++;
    if (/[0-9]/.test(v))        p++;
    if (/[^A-Za-z0-9]/.test(v)) p++;
    barraForca.style.width      = ['0%','25%','50%','75%','100%'][p];
    barraForca.style.background = ['transparent','#ef4444','#f59e0b','#3b82f6','#10b981'][p];
  });
}

/* ── LOGIN ── */
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email');
    const senha = document.getElementById('login-senha');
    const btn   = document.getElementById('btn-login');
    const ok = validarCampo(email, 'Informe seu e-mail.') &
               validarEmail(email) &
               validarCampo(senha, 'Informe sua senha.');
    if (!ok) return;
    setCarregando(btn, true);
    try {
      /* TODO: await fetch('/api/auth/login', { method:'POST', ... }) */
      await new Promise(r => setTimeout(r, 1200));
      exibirFeedback('msg-login', 'Login realizado! Redirecionando…', 'sucesso');
      setTimeout(() => { window.location.href = 'dashboard-aluno.html'; }, 1500);
    } catch (err) {
      exibirFeedback('msg-login', err.message || 'Erro ao realizar login.', 'erro');
    } finally {
      setCarregando(btn, false);
    }
  });
}

/* ── CADASTRO ── */
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', async e => {
    e.preventDefault();
    const nome      = document.getElementById('cad-nome');
    const matricula = document.getElementById('cad-matricula');
    const email     = document.getElementById('cad-email');
    const curso     = document.getElementById('cad-curso');
    const senha     = document.getElementById('cad-senha');
    const confirmar = document.getElementById('cad-confirmar');
    const btn       = document.getElementById('btn-cadastro');

    let ok = validarCampo(nome,      'Informe seu nome.') &
             validarCampo(matricula, 'Informe sua matrícula.') &
             validarCampo(email,     'Informe seu e-mail.') &
             validarEmail(email) &
             validarCampo(curso,     'Selecione seu curso.') &
             validarCampo(senha,     'Crie uma senha.');

    if (senha.value.length < 8) {
      senha.classList.add('invalido');
      document.getElementById('erro-cad-senha').textContent = 'Mínimo 8 caracteres.';
      ok = false;
    }
    if (senha.value !== confirmar.value) {
      confirmar.classList.add('invalido');
      document.getElementById('erro-cad-confirmar').textContent = 'As senhas não coincidem.';
      ok = false;
    } else {
      confirmar.classList.remove('invalido');
      document.getElementById('erro-cad-confirmar').textContent = '';
    }
    if (!ok) return;

    setCarregando(btn, true);
    try {
      /* TODO: await fetch('/api/auth/cadastro', { method:'POST', ... }) */
      await new Promise(r => setTimeout(r, 1200));
      exibirFeedback('msg-cadastro', 'Conta criada! Faça login para continuar.', 'sucesso');
      formCadastro.reset();
      if (barraForca) barraForca.style.width = '0';
    } catch (err) {
      exibirFeedback('msg-cadastro', err.message || 'Erro ao criar conta.', 'erro');
    } finally {
      setCarregando(btn, false);
    }
  });
}
