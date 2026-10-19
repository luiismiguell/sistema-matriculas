/* ── dashboard-aluno.js ── */
initSidebar();

async function carregarDados() {
  try {
    /* TODO: carregar o perfil pela API após definição do contrato do backend. */
    await new Promise(r => setTimeout(r, 800));
    const dados = {
      nomeCompleto: 'Estudante Teste',
      primeiroNome: 'Estudante',
      matricula: '2024001234',
      curso: 'Ciência da Computação',
      periodoLetivo: '2025 / 1º Semestre',
      cursosMatriculadas: 5,
      cursosAprovadas: 18,
      cursosAndamento: 5,
      proximaAula: 'Seg 08h — Algoritmos',
      cr: '8.4'
    };

    document.getElementById('sidebar-nome').textContent      = dados.nomeCompleto;
    document.getElementById('sidebar-matricula').textContent = dados.matricula;
    document.getElementById('banner-saudacao').textContent   = `${saudacao()}, ${dados.primeiroNome}!`;
    document.getElementById('banner-curso').textContent      = dados.curso;
    document.getElementById('periodo-texto').textContent     = dados.periodoLetivo;
    document.getElementById('val-cursos-aprovadas').textContent  = dados.cursosAprovadas;
    document.getElementById('val-cursos-andamento').textContent  = dados.cursosAndamento;
    document.getElementById('val-proxima-aula').textContent  = dados.proximaAula;
    document.getElementById('val-cr').textContent            = dados.cr;

    // Barra de progresso para cursos aprovados (ex: de 40 cursos do currículo)
    const pct = Math.min(100, Math.round((dados.cursosAprovadas / 40) * 100));
    document.getElementById('barra-cursos-aprovadas').style.width = pct + '%';
  } catch (err) {
    console.error(err);
  }
}

carregarDados();