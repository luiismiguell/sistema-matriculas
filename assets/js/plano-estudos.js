/* ── plano-estudos.js ── */
initSidebar();

const historico = [
  {
    periodo: '2024 / 1º Semestre', status: 'concluido',
    cursos: [
      { codigo:'CC101', nome:'Algoritmos e Estruturas de Dados', creditos:4, nota:8.5, status:'aprovado' },
      { codigo:'CC102', nome:'Cálculo I',                        creditos:4, nota:7.2, status:'aprovado' },
      { codigo:'CC103', nome:'Introdução à Programação',         creditos:4, nota:9.1, status:'aprovado' },
      { codigo:'CC104', nome:'Álgebra Linear',                   creditos:4, nota:6.8, status:'aprovado' },
    ]
  },
  {
    periodo: '2024 / 2º Semestre', status: 'concluido',
    cursos: [
      { codigo:'CC201', nome:'Programação Orientada a Objetos',  creditos:4, nota:8.8, status:'aprovado' },
      { codigo:'CC202', nome:'Banco de Dados I',                 creditos:4, nota:7.5, status:'aprovado' },
      { codigo:'CC203', nome:'Cálculo II',                       creditos:4, nota:5.2, status:'reprovado' },
      { codigo:'CC204', nome:'Probabilidade e Estatística',      creditos:4, nota:8.0, status:'aprovado' },
    ]
  },
  {
    periodo: '2025 / 1º Semestre', status: 'andamento',
    cursos: [
      { codigo:'CC301', nome:'Engenharia de Software',           creditos:4, nota:null, status:'andamento' },
      { codigo:'CC302', nome:'Redes de Computadores',            creditos:4, nota:null, status:'andamento' },
      { codigo:'CC203', nome:'Cálculo II (Recuperação)',         creditos:4, nota:null, status:'andamento' },
      { codigo:'CC303', nome:'Sistemas Operacionais',            creditos:4, nota:null, status:'andamento' },
      { codigo:'CC304', nome:'Teoria da Computação',             creditos:4, nota:null, status:'andamento' },
    ]
  },
];

function badgeStatus(s) {
  if (s === 'aprovado')  return '<span class="badge badge--verde">Aprovado</span>';
  if (s === 'reprovado') return '<span class="badge badge--vermelho">Reprovado</span>';
  return '<span class="badge badge--laranja">Em andamento</span>';
}

function renderizar() {
  const container = document.getElementById('periodos-lista');
  container.innerHTML = historico.map((p, i) => `
    <div class="periodo-card ${i === historico.length - 1 ? 'aberto' : ''}">
      <div class="periodo-card__header">
        <span class="periodo-card__titulo">${p.periodo}</span>
        <div class="periodo-card__meta">
          <span class="badge ${p.status === 'concluido' ? 'badge--verde' : 'badge--laranja'}">${p.status === 'concluido' ? 'Concluído' : 'Em andamento'}</span>
          <span style="font-size:.78rem;color:var(--texto-sec)">${p.cursos.length} cursos</span>
          <svg class="periodo-card__seta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="periodo-card__corpo">
        <div class="tabela-wrapper">
          <table class="tabela">
            <thead><tr><th>Código</th><th>Disciplina</th><th>Créditos</th><th>Nota</th><th>Situação</th></tr></thead>
            <tbody>
              ${p.cursos.map(d => `<tr>
                <td><span class="badge badge--azul">${d.codigo}</span></td>
                <td>${d.nome}</td>
                <td>${d.creditos}</td>
                <td>${d.nota !== null ? d.nota.toFixed(1) : '—'}</td>
                <td>${badgeStatus(d.status)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.periodo-card__header').forEach(h => {
    h.addEventListener('click', () => h.closest('.periodo-card').classList.toggle('aberto'));
  });
}

renderizar();
