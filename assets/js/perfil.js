/* ── perfil.js ── */
initSidebar();

/**
 * Gerenciador de persistência local para perfil
 * Em produção, substituir por API calls reais
 * Chave isolada por tipo de usuário para evitar sobrescrita
 */
const PerfilStorage = {
  KEY_BASE: 'portal-vivencia-perfil',

  _getKey(tipo) {
    return `${this.KEY_BASE}-${tipo}`;
  },

  carregar(tipo) {
    try {
      const raw = localStorage.getItem(this._getKey(tipo));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao carregar perfil:', e);
      return null;
    }
  },

  salvar(tipo, dados) {
    try {
      localStorage.setItem(this._getKey(tipo), JSON.stringify(dados));
      return true;
    } catch (e) {
      console.error('Erro ao salvar perfil:', e);
      return false;
    }
  },

  limpar(tipo) {
    localStorage.removeItem(this._getKey(tipo));
  }
};

/**
 * Dados mock para demonstração
 * Reutiliza estrutura existente do projeto
 * ATENÇÃO: Dados fictícios apenas para demonstração visual
 */
function dadosMock(tipoUsuario) {
  const base = {
    nome: 'Estudante Teste (Demo)',
    email: 'estudante@teste.edu.br',
    telefone: '(11) 99999-9999',
    dataCadastro: '2024-01-15',
    statusConta: 'ativa',
    ultimoAcesso: new Date().toISOString()
  };

  if (tipoUsuario === 'admin') {
    return {
      ...base,
      nome: 'Administrador (Demo)',
      email: 'admin@universidade.edu.br',
      telefone: '(11) 98888-8888',
      dataCadastro: '2023-06-01',
      cargo: 'Administrador',
      departamento: 'TI Acadêmica'
    };
  }

  // Aluno padrão
  return {
    ...base,
    matricula: '2024001234',
    curso: 'Ciência da Computação',
    turma: 'CC-01',
    periodoLetivo: '2025 / 1º Semestre',
    // Dados acadêmicos existentes
    cursosAprovados: 18,
    cursosEmAndamento: 5,
    cargaHoraria: 360
  };
}

/**
 * Detecta tipo de usuário baseado no contexto da página
 * MODO DE DEMONSTRAÇÃO: sem autenticação real integrada
 * Futuro: substituir por getCurrentUser() que consome API de sessão
 */
function detectarTipoUsuario() {
  // 1. Tentar ler de localStorage (perfil já salvo)
  const perfilSalvo = PerfilStorage.carregar('aluno') || PerfilStorage.carregar('admin');
  if (perfilSalvo?.tipo) {
    return perfilSalvo.tipo;
  }

  // 2. Verificar URL atual (mais confiável que referrer)
  // document.referrer pode ser vazio/bloqueado por políticas de privacidade
  const url = window.location.href;
  if (url.includes('admin') || url.includes('dashboard-admin')) {
    return 'admin';
  }

  // 3. Default para aluno (padrão do projeto)
  return 'aluno';
}

/**
 * Função isolada para futura integração com API de autenticação
 * Substituir implementação quando backend estiver disponível
 * @returns {Promise<{tipo: string, dados: object} | null>}
 */
async function obterUsuarioAutenticado() {
  // TODO: Implementar chamada real à API de sessão/autenticação
  // Exemplo futuro:
  // try {
  //   const response = await fetch('/api/auth/me');
  //   if (response.ok) return await response.json();
  // } catch (e) { console.error(e); }
  // return null;
  return null; // Sem backend integrado
}

/**
 * Gera iniciais para avatar
 */
function gerarIniciais(nome) {
  return nome
    .split(' ')
    .filter(p => p.length > 0)
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Formata data para exibição
 */
function formatarData(dataStr) {
  if (!dataStr) return '—';
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Renderiza navegação baseada no tipo de usuário
 */
function renderizarNavegacao(tipo) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  const linksAluno = [
    { href: 'dashboard-aluno.html', icon: 'grid', label: 'Início' },
    { href: 'plano-estudos.html', icon: 'book', label: 'Plano de Estudos' },
    { href: 'matricula.html', icon: 'edit', label: 'Matrícula' },
    { href: 'horario.html', icon: 'calendar', label: 'Meu Horário' },
    { href: 'perfil.html', icon: 'user', label: 'Meu Perfil', ativo: true },
    { href: 'reporte-matricula.html', icon: 'bar-chart', label: 'Relatórios' }
  ];

  const linksAdmin = [
    { href: 'dashboard-admin.html', icon: 'grid', label: 'Painel' },
    { href: 'gestao-cursos.html', icon: 'book', label: 'Cursos e Carreiras' },
    { href: 'gestao-disciplinas.html', icon: 'file-text', label: 'Disciplinas' },
    { href: 'reporte-matricula.html', icon: 'bar-chart', label: 'Relatórios' },
    { href: 'perfil.html', icon: 'user', label: 'Meu Perfil', ativo: true }
  ];

  const links = tipo === 'admin' ? linksAdmin : linksAluno;

  const icones = {
    grid: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    book: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  };

  nav.innerHTML = links.map(link => `
    <a href="${link.href}" class="sidebar__link ${link.ativo ? 'sidebar__link--ativo' : ''}" ${link.ativo ? 'aria-current="page"' : ''}>
      ${icones[link.icon] || ''}
      ${link.label}
    </a>
  `).join('') + (tipo === 'aluno' ? '<span class="sidebar__sep">Ferramentas</span>' : '');
}

/**
 * Atualiza avatar com iniciais
 */
function atualizarAvatar(elementId, nome) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Limpar conteúdo
  el.innerHTML = '';

  // Verifica se há imagem (mock: sempre usar iniciais por enquanto)
  const iniciais = gerarIniciais(nome);
  el.innerHTML = `<span style="font-weight:600;font-size:1.2rem;color:var(--sidebar-link);">${iniciais}</span>`;
}

/**
 * Gera pendências baseadas no tipo de usuário
 * Usa dados existentes do projeto
 * NOTA: Pendências são exemplos ilustrativos (modo demo)
 */
function gerarPendencias(tipo) {
  const pendencias = [];

  if (tipo === 'admin') {
    // Pendências administrativas baseadas nas funcionalidades existentes
    pendencias.push({
      titulo: 'Cursos aguardando aprovação (demo)',
      descricao: 'Exemplo: novos cursos cadastrados aguardam revisão administrativa',
      situacao: 'em-analise',
      icone: 'alerta',
      acao: { label: 'Revisar cursos', href: 'gestao-cursos.html' },
      demo: true
    });

    pendencias.push({
      titulo: 'Relatórios de matrícula pendentes (demo)',
      descricao: 'Exemplo: relatórios mensais de ocupação a serem gerados',
      situacao: 'pendente',
      icone: 'info',
      acao: { label: 'Gerar relatórios', href: 'reporte-matricula.html' },
      demo: true
    });

    return pendencias;
  }

  // Pendências do aluno baseadas em funcionalidades existentes
  pendencias.push({
    titulo: 'Matrícula do período aguardando confirmação (demo)',
    descricao: 'Exemplo: matrícula para 2025/1º Semestre em análise',
    situacao: 'em-analise',
    icone: 'info',
    acao: { label: 'Ver matrícula', href: 'matricula.html' },
    demo: true
  });

  pendencias.push({
    titulo: 'Horário com possível conflito (demo)',
    descricao: 'Exemplo: verifique sobreposição entre suas aulas',
    situacao: 'pendente',
    icone: 'alerta',
    acao: { label: 'Ver horário', href: 'horario.html' },
    demo: true
  });

  pendencias.push({
    titulo: 'Plano de estudos atualizado (demo)',
    descricao: 'Exemplo: disciplinas do seu plano com status alterado',
    situacao: 'pendente',
    icone: 'info',
    acao: { label: 'Ver plano', href: 'plano-estudos.html' },
    demo: true
  });

  return pendencias;
}

/**
 * Renderiza lista de pendências
 */
function renderizarPendencias(tipo) {
  const container = document.getElementById('pendencias-lista');
  const vazio = document.getElementById('pendencias-vazio');

  if (!container) return;

  const pendencias = gerarPendencias(tipo);

  if (pendencias.length === 0) {
    vazio.textContent = tipo === 'admin'
      ? 'Nenhuma pendência administrativa encontrada'
      : 'Nenhuma pendência acadêmica encontrada';
    vazio.style.display = 'block';
    return;
  }

  vazio.style.display = 'none';

  const icones = {
    alerta: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    sucesso: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  container.innerHTML = pendencias.map(p => `
    <article class="pendencia-item">
      <div class="pendencia-item__icone pendencia-item__icone--${p.icone}">
        ${icones[p.icone] || icones.info}
      </div>
      <div class="pendencia-item__conteudo">
        <h4 class="pendencia-item__titulo">${p.titulo}</h4>
        <p class="pendencia-item__descricao">${p.descricao}</p>
        <div class="pendencia-item__meta">
          <span class="pendencia-item__status pendencia-item__status--${p.situacao}">
            ${p.situacao === 'pendente' ? 'Pendente' : p.situacao === 'em-analise' ? 'Em análise' : 'Concluído'}
          </span>
        </div>
      </div>
      ${p.acao ? `
        <div class="pendencia-item__acao">
          <a href="${p.acao.href}" class="btn btn--outline btn--sm">${p.acao.label}</a>
        </div>
      ` : ''}
    </article>
  `).join('');
}

/**
 * Renderiza perfil na tela
 */
function renderizarPerfil(perfil, tipo) {
  // Header
  document.getElementById('perfil-nome').textContent = perfil.nome;
  document.getElementById('perfil-email').textContent = perfil.email;

  const badge = document.getElementById('perfil-tipo-badge');
  badge.textContent = tipo === 'admin' ? 'Administrador' : 'Aluno';
  badge.className = 'badge ' + (tipo === 'admin' ? 'badge--roxo' : 'badge--azul');

  // Status
  if (perfil.statusConta) {
    const statusEl = document.getElementById('perfil-status');
    statusEl.textContent = perfil.statusConta === 'ativa' ? 'Conta ativa' : 'Conta inativa';
    statusEl.className = 'perfil-cabecalho__status perfil-cabecalho__status--' + perfil.statusConta;
    statusEl.removeAttribute('aria-hidden');
  }

  // Data de cadastro
  if (perfil.dataCadastro) {
    const cadastroEl = document.getElementById('perfil-cadastro');
    cadastroEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Membro desde ${formatarData(perfil.dataCadastro)}`;
    cadastroEl.removeAttribute('aria-hidden');
  }

  // Sidebar
  document.getElementById('sidebar-nome').textContent = perfil.nome.split(' ')[0];
  document.getElementById('sidebar-email').textContent = perfil.email;
  document.getElementById('sidebar-badge').textContent = tipo === 'admin' ? 'Admin' : 'Aluno';
  document.getElementById('sidebar-badge').className = 'sidebar__badge ' + (tipo === 'admin' ? 'sidebar__badge--admin' : '');

  // Avatar
  atualizarAvatar('perfil-avatar', perfil.nome);
  atualizarAvatar('sidebar-avatar', perfil.nome);

  // Dados visuais
  document.getElementById('view-nome').textContent = perfil.nome;
  document.getElementById('view-email').textContent = perfil.email;
  document.getElementById('view-telefone').textContent = perfil.telefone || 'Não informado';

  if (tipo === 'aluno') {
    // Mostrar campos específicos do aluno
    const campos = ['matricula', 'curso', 'turma', 'periodo'];
    campos.forEach(campo => {
      const el = document.getElementById(`dado-${campo}`);
      if (el) {
        const valor = perfil[campo];
        if (valor) {
          el.hidden = false;
          document.getElementById(`view-${campo}`).textContent = valor;
        }
      }

      const campoEdit = document.getElementById(`campo-${campo}`);
      if (campoEdit && perfil[campo]) {
        campoEdit.hidden = false;
      }
    });

    // Preencher formulário
    document.getElementById('edit-matricula').value = perfil.matricula || '';
    document.getElementById('edit-curso').value = perfil.curso || '';
    document.getElementById('edit-turma').value = perfil.turma || '';
    document.getElementById('edit-periodo').value = perfil.periodoLetivo || '';
  } else {
    // Campos admin
    if (perfil.cargo) {
      document.getElementById('view-telefone').textContent = perfil.departamento || perfil.telefone || '—';
    }
  }

  // Navegação
  renderizarNavegacao(tipo);

  // Pendências
  renderizarPendencias(tipo);
}

/**
 * Carrega perfil (com mock por enquanto)
 */
async function carregarPerfil() {
  try {
    // Simular carregamento
    await new Promise(r => setTimeout(r, 600));

    // Detectar tipo
    const tipo = detectarTipoUsuario();

    // Tentar carregar perfil salvo (com tipo)
    let perfil = PerfilStorage.carregar(tipo);

    // Se não existe, usar dados mock
    if (!perfil) {
      perfil = dadosMock(tipo);
      perfil.tipo = tipo;
      PerfilStorage.salvar(tipo, perfil);
    } else if (!perfil.tipo) {
      perfil.tipo = tipo;
      PerfilStorage.salvar(tipo, perfil);
    }

    renderizarPerfil(perfil, tipo);
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    exibirFeedback('msg-perfil', 'Erro ao carregar perfil. Tente novamente.', 'erro');
  }
}

/* ── CONTROLES DE EDIÇÃO ── */

const btnEditar = document.getElementById('btn-editar-perfil');
const btnCancelar = document.getElementById('btn-cancelar-edicao');
const formPerfil = document.getElementById('form-perfil');
const visualizacao = document.getElementById('visualizacao-perfil');

btnEditar?.addEventListener('click', () => {
  const tipo = detectarTipoUsuario();
  const perfilSalvo = PerfilStorage.carregar(tipo);
  if (!perfilSalvo) return;

  // Preencher formulário com dados atuais
  document.getElementById('edit-nome').value = perfilSalvo.nome || '';
  document.getElementById('edit-email').value = perfilSalvo.email || '';
  document.getElementById('edit-telefone').value = perfilSalvo.telefone || '';

  // Alternar modos
  visualizacao.classList.add('oculto');
  formPerfil.classList.remove('oculto');
  btnEditar.setAttribute('aria-expanded', 'true');
});

btnCancelar?.addEventListener('click', () => {
  // Alternar modos de volta
  visualizacao.classList.remove('oculto');
  formPerfil.classList.add('oculto');
  btnEditar.setAttribute('aria-expanded', 'false');
  // Limpar erros
  formPerfil.querySelectorAll('.campo__erro').forEach(el => el.textContent = '');
  formPerfil.querySelectorAll('.campo__input').forEach(input => input.classList.remove('invalido'));
});

/* Validação e salvamento */
formPerfil?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('edit-nome');
  const email = document.getElementById('edit-email');
  const telefone = document.getElementById('edit-telefone');
  const btnSalvar = document.getElementById('btn-salvar-perfil');
  const tipo = detectarTipoUsuario();

  // Validar
  let valido = true;

  if (!validarCampo(nome, 'Informe seu nome completo.')) {
    valido = false;
  }

  if (!validarCampo(email, 'Informe seu e-mail.')) {
    valido = false;
  } else if (!validarEmail(email)) {
    valido = false;
  }

  if (!valido) return;

  // Salvar
  setCarregando(btnSalvar, true);

  try {
    await new Promise(r => setTimeout(r, 800));

    const perfilAtual = PerfilStorage.carregar(tipo);
    if (perfilAtual) {
      perfilAtual.nome = nome.value.trim();
      perfilAtual.email = email.value.trim();
      perfilAtual.telefone = telefone.value.trim();
      PerfilStorage.salvar(tipo, perfilAtual);
    }

    // Voltar para visualização
    visualizacao.classList.remove('oculto');
    formPerfil.classList.add('oculto');
    btnEditar.setAttribute('aria-expanded', 'false');

    // Recarregar para mostrar mudanças
    renderizarPerfil(PerfilStorage.carregar(tipo), tipo);

    exibirFeedback('msg-perfil', 'Perfil atualizado com sucesso!', 'sucesso');
  } catch (err) {
    exibirFeedback('msg-perfil', 'Erro ao salvar. Tente novamente.', 'erro');
  } finally {
    setCarregando(btnSalvar, false);
  }
});

/* Inicializar */
carregarPerfil();