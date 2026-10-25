/* ── matricula.js ── */
initSidebar();

let cursos = [];
let carrinho = [];

const cursosMock = [
  { id:1, codigo:'CC101', nome:'Algoritmos e Estruturas de Dados', periodo:1, vagas:5,  horario:'Seg/Qua 08h–10h' },
  { id:2, codigo:'CC102', nome:'Cálculo I',                        periodo:1, vagas:12, horario:'Ter/Qui 10h–12h' },
  { id:3, codigo:'CC103', nome:'Introdução à Programação',         periodo:1, vagas:0,  horario:'Seg/Qua 14h–16h' },
  { id:4, codigo:'CC201', nome:'Programação Orientada a Objetos',  periodo:2, vagas:8,  horario:'Ter/Qui 08h–10h' },
  { id:5, codigo:'CC202', nome:'Banco de Dados I',                 periodo:2, vagas:3,  horario:'Sex 08h–12h' },
  { id:6, codigo:'CC301', nome:'Engenharia de Software',           periodo:3, vagas:15, horario:'Seg/Qua 16h–18h' },
  { id:7, codigo:'CC302', nome:'Redes de Computadores',            periodo:3, vagas:7,  horario:'Ter/Qui 14h–16h' },
  { id:8, codigo:'CC401', nome:'Inteligência Artificial',          periodo:4, vagas:10, horario:'Sex 14h–18h' },
];

function renderizarTabela(lista) {
  const corpo = document.getElementById('lista-cursos');
  if (!lista.length) {
    corpo.innerHTML = '<tr><td colspan="6" class="tabela__vazio">Nenhuma disciplina encontrada.</td></tr>';
    return;
  }
  corpo.innerHTML = lista.map(d => {
    const noCarrinho = carrinho.some(c => c.id === d.id);
    const semVaga = d.vagas === 0;
    return `<tr>
      <td><input type="checkbox" class="disc-check" data-id="${d.id}" ${noCarrinho ? 'checked' : ''} ${semVaga && !noCarrinho ? 'disabled' : ''}></td>
      <td><span class="badge badge--azul">${escaparHTML(d.codigo)}</span></td>
      <td>${escaparHTML(d.nome)}</td>
      <td>${escaparHTML(d.periodo)}º</td>
      <td><span class="badge ${d.vagas === 0 ? 'badge--vermelho' : d.vagas <= 5 ? 'badge--laranja' : 'badge--verde'}">${d.vagas === 0 ? 'Esgotado' : d.vagas + ' vagas'}</span></td>
      <td style="font-size:.78rem;color:var(--texto-sec)">${escaparHTML(d.horario)}</td>
    </tr>`;
  }).join('');

  document.querySelectorAll('.disc-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const disc = cursos.find(d => d.id === +cb.dataset.id);
      if (!disc) return;
      if (cb.checked) {
        if (!carrinho.some(c => c.id === disc.id)) carrinho.push(disc);
      } else {
        carrinho = carrinho.filter(c => c.id !== disc.id);
      }
      renderizarCarrinho();
    });
  });
}

function renderizarCarrinho() {
  const container = document.getElementById('carrinho-itens');
  const resumo    = document.getElementById('carrinho-resumo');
  const btnConf   = document.getElementById('btn-confirmar');

  if (!carrinho.length) {
    container.innerHTML = '<p class="carrinho__vazio">Nenhuma disciplina selecionada.</p>';
    resumo.style.display = 'none';
    btnConf.disabled = true;
    return;
  }

  container.innerHTML = carrinho.map(d => `
    <div class="carrinho__item">
      <div>
        <p class="carrinho__item-nome">${escaparHTML(d.nome)}</p>
        <p class="carrinho__item-info">${escaparHTML(d.codigo)}</p>
      </div>
      <button class="carrinho__remover" data-id="${d.id}" aria-label="Remover">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.carrinho__remover').forEach(btn => {
    btn.addEventListener('click', () => {
      carrinho = carrinho.filter(c => c.id !== +btn.dataset.id);
      renderizarCarrinho();
      renderizarTabela(filtrarcursos());
    });
  });

  document.getElementById('carr-qtd').textContent = carrinho.length;
  resumo.style.display = 'flex';
  btnConf.disabled = false;
}

function filtrarcursos() {
  const busca   = document.getElementById('busca-disciplina').value.toLowerCase();
  const periodo = document.getElementById('filtro-periodo').value;
  return cursos.filter(d => {
    const matchBusca   = !busca   || d.nome.toLowerCase().includes(busca) || d.codigo.toLowerCase().includes(busca);
    const matchPeriodo = !periodo || d.periodo === +periodo;
    return matchBusca && matchPeriodo;
  });
}

document.getElementById('busca-disciplina').addEventListener('input', () => renderizarTabela(filtrarcursos()));
document.getElementById('filtro-periodo').addEventListener('change', () => renderizarTabela(filtrarcursos()));

document.getElementById('btn-confirmar').addEventListener('click', async () => {
  const btn = document.getElementById('btn-confirmar');
  setCarregando(btn, true);
  try {
    /* TODO: confirmar a matrícula pela API após definição do contrato do backend. */
    await new Promise(r => setTimeout(r, 1200));
    // MODO DEMONSTRATIVO: a matrícula é apenas simulada. Nenhuma vaga é reservada
    // e nenhuma inscrição é persistida. A confirmação real depende do back-end.
    exibirFeedback('msg-matricula', `Demonstração: ${carrinho.length} disciplina(s) selecionadas. A matrícula real será confirmada pelo back-end.`, 'aviso');
    carrinho = [];
    renderizarCarrinho();
    renderizarTabela(filtrarcursos());
  } catch (err) {
    exibirFeedback('msg-matricula', 'Erro ao confirmar matrícula.', 'erro');
  } finally {
    setCarregando(btn, false);
  }
});

async function init() {
  /* TODO: carregar cursos pela API após definição do contrato do backend. */
  await new Promise(r => setTimeout(r, 600));
  cursos = cursosMock;
  renderizarTabela(cursos);
}

init();