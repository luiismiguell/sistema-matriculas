/* ── dashboard-aluno.js ── */
initSidebar();

async function carregarDados() {
  try {
    /* TODO: const dados = await fetch('/api/estudante/perfil').then(r => r.json()); */
    await new Promise(r => setTimeout(r, 800));
    const dados = {
      nomeCompleto: 'Estudante Teste',
      primeiroNome: 'Estudante',
      matricula: '2024001234',
      curso: 'Ciência da Computação',
      periodoLetivo: '2025 / 1º Semestre',
      cursosMatriculadas: 5,
      creditosAprovados: 72,
      creditosRequeridos: 240,
      proximaAula: 'Seg 08h — Algoritmos',
      cr: '8.4'
    };

    document.getElementById('sidebar-nome').textContent      = dados.nomeCompleto;
    document.getElementById('sidebar-matricula').textContent = dados.matricula;
    document.getElementById('banner-saudacao').textContent   = `${saudacao()}, ${dados.primeiroNome}!`;
    document.getElementById('banner-curso').textContent      = dados.curso;
    document.getElementById('periodo-texto').textContent     = dados.periodoLetivo;
    document.getElementById('val-matriculados').textContent  = dados.cursosMatriculadas;
    document.getElementById('val-creditos').textContent      = `${dados.creditosAprovados} / ${dados.creditosRequeridos}`;
    document.getElementById('val-proxima-aula').textContent  = dados.proximaAula;
    document.getElementById('val-cr').textContent            = dados.cr;

    const pct = Math.min(100, Math.round((dados.creditosAprovados / dados.creditosRequeridos) * 100));
    document.getElementById('barra-creditos').style.width = pct + '%';
  } catch (err) {
    console.error(err);
  }
}

carregarDados();
