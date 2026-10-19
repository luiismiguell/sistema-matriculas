/* ── gestao-disciplinas.js ── */
initSidebar();

let cursos = [
  { id:1, codigo:'CC101', nome:'Algoritmos e Estruturas de Dados', curso:'Ciência da Computação', professor:'Marcos Oliveira', vagas:40, matriculados:34, horario:'Seg/Qua · 19:00', status:'ativa' },
  { id:2, codigo:'CC102', nome:'Cálculo I', curso:'Ciência da Computação', professor:'Ana Souza', vagas:45, matriculados:41, horario:'Ter/Qui · 19:00', status:'ativa' },
  { id:3, codigo:'ES201', nome:'Engenharia de Requisitos', curso:'Engenharia de Software', professor:'Carlos Mendes', vagas:35, matriculados:30, horario:'Seg/Qua · 20:50', status:'ativa' },
  { id:4, codigo:'SI202', nome:'Banco de Dados II', curso:'Sistemas de Informação', professor:'Fernanda Lima', vagas:30, matriculados:22, horario:'Ter/Qui · 20:50', status:'ativa' },
  { id:5, codigo:'AD101', nome:'Fundamentos de Administração', curso:'Administração', professor:'Roberto Alves', vagas:50, matriculados:45, horario:'Sáb · 08:00', status:'inativa' }
];
let proximoId = 6;

const svgEdit = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';

function render() {
  const q = document.getElementById('busca-disciplina-admin').value.toLowerCase();
  const curso = document.getElementById('filtro-curso').value;
  const status = document.getElementById('filtro-status').value;
  const lista = cursos.filter(d =>
    (!q || `${d.codigo} ${d.nome} ${d.professor}`.toLowerCase().includes(q)) &&
    (!curso || d.curso === curso) &&
    (!status || d.status === status)
  );

  document.getElementById('tabela-cursos').innerHTML = lista.length ? lista.map(d => `
    <tr>
      <td><span class="badge badge--azul">${d.codigo}</span></td>
      <td><strong>${d.nome}</strong></td>
      <td>${d.curso}</td>
      <td>${d.professor}</td>
      <td>${d.matriculados}/${d.vagas}</td>
      <td>${d.horario}</td>
      <td><span class="badge ${d.status === 'ativa' ? 'badge--verde' : 'badge--vermelho'}">${d.status === 'ativa' ? 'Ativa' : 'Inativa'}</span></td>
      <td>
        <button class="btn-acao btn-acao--editar" data-edit="${d.id}">${svgEdit}</button>
        <button class="btn-acao btn-acao--excluir" data-del="${d.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" class="tabela__vazio">Nenhuma disciplina encontrada.</td></tr>';

  document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => abrir(+b.dataset.edit));
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    if (confirm('Excluir esta disciplina?')) {
      cursos = cursos.filter(d => d.id !== +b.dataset.del);
      render();
    }
  });
}

function abrir(id = null) {
  const d = id ? cursos.find(x => x.id === id) : null;
  document.getElementById('modal-disciplina-titulo').textContent = d ? 'Editar Disciplina' : 'Nova Disciplina';
  document.getElementById('disc-id').value = d?.id || '';
  ['codigo', 'nome', 'curso', 'professor', 'vagas', 'horario', 'status'].forEach(k => {
    const el = document.getElementById('disc-' + k);
    if (el) el.value = d?.[k] ?? (k === 'status' ? 'ativa' : '');
  });
  document.getElementById('modal-disciplina').classList.remove('oculto');
}

function fechar() {
  document.getElementById('modal-disciplina').classList.add('oculto');
  document.getElementById('form-disciplina').reset();
}

document.getElementById('btn-nova-disciplina').onclick = () => abrir();
document.getElementById('fechar-disciplina').onclick = fechar;
document.getElementById('cancelar-disciplina').onclick = fechar;
document.getElementById('modal-disciplina').onclick = e => { if (e.target.id === 'modal-disciplina') fechar(); };

['busca-disciplina-admin', 'filtro-curso', 'filtro-status'].forEach(id =>
  document.getElementById(id).addEventListener('input', render)
);

document.getElementById('form-disciplina').onsubmit = e => {
  e.preventDefault();
  const id = +document.getElementById('disc-id').value;
  const d = {
    id: id || proximoId++,
    codigo: document.getElementById('disc-codigo').value.trim(),
    nome: document.getElementById('disc-nome').value.trim(),
    curso: document.getElementById('disc-curso').value,
    professor: document.getElementById('disc-professor').value.trim(),
    vagas: +document.getElementById('disc-vagas').value,
    matriculados: id ? (cursos.find(x => x.id === id)?.matriculados || 0) : 0,
    horario: document.getElementById('disc-horario').value.trim(),
    status: document.getElementById('disc-status').value
  };

  if (id) {
    cursos = cursos.map(x => x.id === id ? d : x);
  } else {
    cursos.push(d);
  }

  fechar();
  render();
  exibirFeedback('msg-disciplina', 'Disciplina salva com sucesso.', 'sucesso');
};

render();