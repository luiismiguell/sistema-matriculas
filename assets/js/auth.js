/* ── auth.js ── */
initToggleSenha();

/* Força da senha */
const inputSenha = document.getElementById('cad-senha');
const barraForca = document.getElementById('barra-forca');
const forcaSenhaContainer = document.querySelector('.forca-senha');
if (inputSenha && barraForca && forcaSenhaContainer) {
  inputSenha.addEventListener('input', () => {
    const v = inputSenha.value;
    let p = 0;
    if (v.length >= 8)          p++;
    if (/[A-Z]/.test(v))        p++;
    if (/[0-9]/.test(v))        p++;
    if (/[^A-Za-z0-9]/.test(v)) p++;
    barraForca.style.width      = ['0%','25%','50%','75%','100%'][p];
    barraForca.style.background = ['transparent','#ef4444','#f59e0b','#3b82f6','#10b981'][p];
    // Atualizar ARIA
    forcaSenhaContainer.setAttribute('aria-valuenow', p * 25);
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
    if (!ok) {
      // Focar no primeiro campo inválido
      const primeiroInvalido = formLogin.querySelector('[aria-invalid="true"]');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }
    setCarregando(btn, true);
    try {
      /* TODO: integrar com o endpoint de autenticação após definição do contrato da API. */
      await new Promise(r => setTimeout(r, 1200));
      // MODO DEMONSTRATIVO: o login é simulado. Nenhum token ou sessão real é criado.
      // O redirecionamento é apenas visual; a autenticação real depende do back-end.
      exibirFeedback('msg-login', 'Demonstração: validação de campos concluída. Autenticação real pendente do back-end.', 'aviso');
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
    const email     = document.getElementById('cad-email');
    const curso     = document.getElementById('cad-curso');
    const senha     = document.getElementById('cad-senha');
    const confirmar = document.getElementById('cad-confirmar');
    const btn       = document.getElementById('btn-cadastro');

    let ok = validarCampo(nome,  'Informe seu nome.') &
             validarCampo(email, 'Informe seu e-mail.') &
             validarEmail(email) &
             validarCampo(curso, 'Selecione seu curso.') &
             validarCampo(senha, 'Crie uma senha.');

    if (senha.value.length < 8) {
      marcarInvalido(senha, 'Mínimo 8 caracteres.');
      ok = false;
    } else {
      marcarValido(senha);
    }
    if (senha.value !== confirmar.value) {
      marcarInvalido(confirmar, 'As senhas não coincidem.');
      ok = false;
    } else {
      marcarValido(confirmar);
    }
    if (!ok) {
      // Focar no primeiro campo inválido
      const primeiroInvalido = formCadastro.querySelector('[aria-invalid="true"]');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    setCarregando(btn, true);
    try {
      /* TODO: integrar com o endpoint de cadastro após definição do contrato da API. */
      await new Promise(r => setTimeout(r, 1200));
      exibirFeedback('msg-cadastro', 'Demonstração: dados validados. A conta real será criada pelo back-end.', 'aviso');
      formCadastro.reset();
      if (barraForca) barraForca.style.width = '0';
      if (forcaSenhaContainer) forcaSenhaContainer.setAttribute('aria-valuenow', 0);
    } catch (err) {
      exibirFeedback('msg-cadastro', err.message || 'Erro ao criar conta.', 'erro');
    } finally {
      setCarregando(btn, false);
    }
  });
}