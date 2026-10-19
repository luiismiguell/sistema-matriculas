/* ── horario.js ── */
initSidebar();

const HORARIOS = ['08h–10h','10h–12h','14h–16h','16h–18h'];
const DIAS = ['seg','ter','qua','qui','sex'];
const CORES = ['azul','verde','roxo','laranja','rosa'];

const aulas = [
  { nome:'Algoritmos', codigo:'CC101', sala:'Lab 01', dias:['seg','qua'], horario:'08h–10h', cor:'azul' },
  { nome:'Cálculo I',  codigo:'CC102', sala:'Sala 12', dias:['ter','qui'], horario:'10h–12h', cor:'verde' },
  { nome:'POO',        codigo:'CC201', sala:'Lab 02', dias:['ter','qui'], horario:'08h–10h', cor:'roxo' },
  { nome:'Banco de Dados', codigo:'CC202', sala:'Sala 08', dias:['sex'], horario:'08h–10h', cor:'laranja' },
  { nome:'Eng. Software',  codigo:'CC301', sala:'Sala 15', dias:['seg','qua'], horario:'16h–18h', cor:'rosa' },
];

function renderizarGrade() {
  const corpo = document.getElementById('grade-corpo');
  corpo.innerHTML = HORARIOS.map(h => {
    const colunas = DIAS.map(dia => {
      const aula = aulas.find(a => a.horario === h && a.dias.includes(dia));
      if (!aula) return '<td></td>';
      return `<td><div class="aula-bloco aula--${aula.cor}">
        <span class="aula-bloco__nome">${aula.nome}</span>
        <span class="aula-bloco__sala">${aula.sala}</span>
      </div></td>`;
    }).join('');
    return `<tr><td>${h}</td>${colunas}</tr>`;
  }).join('');
}

function renderizarLista() {
  const lista = document.getElementById('disc-lista');
  lista.innerHTML = aulas.map(a => `
    <div class="disc-card">
      <div class="disc-card__cor" style="background:var(--${a.cor === 'azul' ? 'azul-medio' : a.cor === 'verde' ? 'verde' : a.cor === 'roxo' ? 'roxo' : a.cor === 'laranja' ? 'laranja' : 'vermelho'})"></div>
      <div>
        <p class="disc-card__nome">${a.nome}</p>
        <p class="disc-card__info">${a.codigo} · ${a.dias.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join('/')} ${a.horario} · ${a.sala}</p>
      </div>
    </div>
  `).join('');
}

renderizarGrade();
renderizarLista();
