/* ── gestao-cursos.js ── */
initSidebar();

let cursos = [
  { id:1, codigo:'CC001', nome:'Ciência da Computação',  duracao:8, status:'ativo' },
  { id:2, codigo:'ES002', nome:'Engenharia de Software', duracao:8, status:'ativo' },
  { id:3, codigo:'SI003', nome:'Sistemas de Informação', duracao:8, status:'ativo' },
  { id:4, codigo:'AD004', nome:'Administração',          duracao:8, status:'ativo' },
  { id:5, codigo:'DI005', nome:'Direito',                duracao:10, status:'ativo' },
];
let proximoId = 6;

function renderizarTabela() {
  const corpo = document.getElementById('tabela-cursos');
  corpo.innerHTML = cursos.map(c => `<tr>
    <td><span class="badge badge--azul">${escaparHTML(c.codigo)}</span></td>
    <td>${escaparHTML(c.nome)}</td>
    <td>${escaparHTML(c.duracao)} semestres</td>
    <td><span class="badge ${c.status === 'ativo' ? 'badge--verde' : 'badge--vermelho'}">${c.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
    <td>
      <button class="btn-acao btn-acao--editar" data-id="${c.id}" title="Editar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button class="btn-acao btn-acao--excluir" data-id="${c.id}" title="Excluir">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
    </td>
  </tr>`).join('');

  document.querySelectorAll('.btn-acao--editar').forEach(btn => {
    btn.addEventListener('click', () => abrirModal(+btn.dataset.id));
  });
  document.querySelectorAll('.btn-acao--excluir').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Excluir este curso?')) {
        cursos = cursos.filter(c => c.id !== +btn.dataset.id);
        renderizarTabela();
      }
    });
  });
}

function abrirModal(id = null) {
  const curso = id ? cursos.find(c => c.id === id) : null;
  document.getElementById('modal-titulo').textContent = curso ? 'Editar Curso' : 'Novo Curso';
  document.getElementById('curso-id').value       = curso?.id ?? '';
  document.getElementById('curso-codigo').value   = curso?.codigo ?? '';
  document.getElementById('curso-nome').value     = curso?.nome ?? '';
  document.getElementById('curso-duracao').value  = curso?.duracao ?? '';
  document.getElementById('curso-status').value   = curso?.status ?? 'ativo';
  document.getElementById('modal-overlay').classList.remove('oculto');
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.add('oculto');
  document.getElementById('form-curso').reset();
}

document.getElementById('btn-novo-curso').addEventListener('click', () => abrirModal());
document.getElementById('modal-fechar').addEventListener('click', fecharModal);
document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) fecharModal();
});

document.getElementById('form-curso').addEventListener('submit', async e => {
  e.preventDefault();
  const id       = document.getElementById('curso-id').value;
  const codigo   = document.getElementById('curso-codigo').value.trim();
  const nome     = document.getElementById('curso-nome').value.trim();
  const duracao  = +document.getElementById('curso-duracao').value;
  const status   = document.getElementById('curso-status').value;

  if (!codigo || !nome || !duracao) return;

  /* TODO: integrar a persistência pela API após definição do contrato do backend. */
  await new Promise(r => setTimeout(r, 600));

  if (id) {
    const idx = cursos.findIndex(c => c.id === +id);
    cursos[idx] = { id: +id, codigo, nome, duracao, status };
  } else {
    cursos.push({ id: proximoId++, codigo, nome, duracao, status });
  }

  fecharModal();
  renderizarTabela();
});

renderizarTabela();