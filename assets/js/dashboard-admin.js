/* ── dashboard-admin.js ── */
initSidebar();

async function carregarDados() {
  try {
    /* TODO: const dados = await fetch('/api/admin/resumo').then(r => r.json()); */
    await new Promise(r => setTimeout(r, 800));
    const cursos = [
      { codigo: 'CC001', nome: 'Ciência da Computação', vagas: 40, matriculados: 38 },
      { codigo: 'ES002', nome: 'Engenharia de Software', vagas: 35, matriculados: 30 },
      { codigo: 'SI003', nome: 'Sistemas de Informação', vagas: 30, matriculados: 22 },
      { codigo: 'AD004', nome: 'Administração',          vagas: 50, matriculados: 45 },
      { codigo: 'DI005', nome: 'Direito',                vagas: 60, matriculados: 58 },
    ];

    const totalAlunos = cursos.reduce((s, c) => s + c.matriculados, 0);
    const totalVagas  = cursos.reduce((s, c) => s + c.vagas, 0);
    const ocupMedia   = Math.round((totalAlunos / totalVagas) * 100);

    document.getElementById('val-cursos').textContent      = cursos.length;
    document.getElementById('val-alunos').textContent      = totalAlunos;
    document.getElementById('val-ocupacao').textContent    = ocupMedia + '%';
    document.getElementById('val-cursos').textContent = 42;

    const corpo = document.getElementById('tabela-resumo');
    corpo.innerHTML = cursos.map(c => {
      const pct = Math.round((c.matriculados / c.vagas) * 100);
      const cor = corOcupacao(pct);
      return `<tr>
        <td><span class="badge badge--azul">${c.codigo}</span></td>
        <td>${c.nome}</td>
        <td>${c.vagas}</td>
        <td>${c.matriculados}</td>
        <td>
          <div class="barra-mini-wrapper">
            <div class="barra-mini"><div class="barra-mini__fill" style="width:${pct}%;background:${cor}"></div></div>
            <span class="barra-mini__pct" style="color:${cor}">${pct}%</span>
          </div>
        </td>
      </tr>`;
    }).join('');
  } catch (err) {
    console.error(err);
  }
}

carregarDados();
