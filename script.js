const formularioContagemJogadores = document.getElementById('formularioContagemJogadores');
const formularioNomes = document.getElementById('formularioNomes');
const resultadosTorneio = document.getElementById('resultadosTorneio');
const secaoHistoricoPartidas = document.getElementById('historicoPartidas');
const tabela = document.getElementById('tabela');
const vencedorDiv = document.getElementById('vencedor');
const MAX_PARTICIPANTES = 20;
const historicoPartidas = [];
const botaoMostrarHistorico = document.getElementById('botaoMostrarHistorico');

const botaoVoltar = document.getElementById('botaoVoltar');
botaoVoltar.addEventListener('click', function() {
  if (!formularioContagemJogadores.classList.contains('hidden')) {
    // Se o formulário de contagem de jogadores estiver visível, não há nada para voltar.
    return;
  }

  if (!formularioNomes.classList.contains('hidden')) {
    // Se o formulário de nomes de times estiver visível, volte para o formulário de contagem de jogadores.
    formularioNomes.classList.add('hidden');
    formularioContagemJogadores.classList.remove('hidden');
  } else if (!resultadosTorneio.classList.contains('hidden')) {
    // Se os resultados do torneio estiverem visíveis, volte para o formulário de nomes de times.
    resultadosTorneio.classList.add('hidden');
    formularioNomes.classList.remove('hidden');
  } else if (!secaoHistoricoPartidas.classList.contains('hidden')) {
    // Se o histórico de partidas estiver visível, volte para os resultados do torneio.
    secaoHistoricoPartidas.classList.add('hidden');
    resultadosTorneio.classList.remove('hidden');
  }
});

botaoMostrarHistorico.addEventListener('click', function() {
  if (secaoHistoricoPartidas.classList.contains('hidden')) {
    secaoHistoricoPartidas.classList.remove('hidden');
    botaoMostrarHistorico.textContent = 'Ocultar Histórico';
  } else {
    secaoHistoricoPartidas.classList.add('hidden');
    botaoMostrarHistorico.textContent = 'Exibir Histórico';
  }
});

formularioContagemJogadores.addEventListener('submit', function(event) {
  event.preventDefault();
  const contagemJogadores = parseInt(document.getElementById('contagemJogadores').value);

  if (contagemJogadores > 0 && contagemJogadores <= MAX_PARTICIPANTES) {
    // Mostrar formulário de nomes e ocultar formulário de contagem de jogadores
    formularioContagemJogadores.classList.add('hidden');
    formularioNomes.classList.remove('hidden');

    // Criar campos de entrada para os nomes dos jogadores
    const entradaNomes = document.getElementById('entradaNomes');
    entradaNomes.innerHTML = '';
    for (let i = 1; i <= contagemJogadores; i++) {
      const label = document.createElement('label');
      label.textContent = `Nome do time ${i}: `;
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('required', true);
      input.setAttribute('name', `jogador${i}`);
      entradaNomes.appendChild(label);
      entradaNomes.appendChild(input);
      entradaNomes.appendChild(document.createElement('br'));
    }
  } else {
    if (contagemJogadores <= 0) {
      alert('Por favor, insira um número válido de times.');
    } else {
      alert(`O número máximo de times participantes é ${MAX_PARTICIPANTES}.`);
    }
  }
});

formularioNomes.addEventListener('submit', function(event) {
  event.preventDefault();

  // Obter os nomes dos jogadores
  const nomesJogadores = [];
  const entradas = formularioNomes.querySelectorAll('input');
  entradas.forEach(entrada => {
    nomesJogadores.push(entrada.value);
  });

  // Ocultar formulário de nomes e mostrar resultados do torneio
  formularioNomes.classList.add('hidden');
  resultadosTorneio.classList.remove('hidden');

  simularTorneio(nomesJogadores);
  exibirHistoricoPartidas();
});

function simularTorneio(jogadores) {
  const numJogadores = jogadores.length;

  // Criar uma matriz para armazenar os resultados de cada jogo e inicializar pontos
  const resultados = [];
  const pontos = {};

  for (let i = 0; i < numJogadores; i++) {
    resultados[i] = [];
    for (let j = 0; j < numJogadores; j++) {
      if (i === j) {
        resultados[i][j] = '-';
      } else {
        if (!resultados[j] || resultados[j][i] === undefined) {
          resultados[i][j] = Math.random() < 0.33 ? ' | DERROTA PARA O TIME ' + jogadores[i] : Math.random() < 0.66 ? '|EMPATE' : ' | VITÓRIA  PARA O TIME ' + jogadores[i];

          if (resultados[i][j] === ' | VITÓRIA  PARA O TIME ' ) {
            pontos[jogadores[i]] = (pontos[jogadores[i]] || 0) + 3;
          } else if (resultados[i][j] === '|EMPATE') {
            pontos[jogadores[i]] = (pontos[jogadores[i]] || 0) + 1;
            pontos[jogadores[j]] = (pontos[jogadores[j]] || 0) + 1;
          } else if (resultados[i][j] === ' | DERROTA PARA O TIME ') {
            pontos[jogadores[j]] = (pontos[jogadores[j]] || 0) + 3;
          }

          // Adicionar a partida ao histórico de partidas
          historicoPartidas.push({
            time1: jogadores[i],
            time2: jogadores[j],
            resultado: resultados[i][j],
          });
        } else {
          resultados[i][j] = resultados[j][i] === ' | VITÓRIA  PARA O TIME ' ? ' | DERROTA PARA O TIME ' : ' | VITÓRIA  PARA O TIME ';
        }
      }
    }
  }

  exibirResultados(jogadores, resultados, pontos);
}

function exibirResultados(jogadores, resultados, pontos) {
  const numJogadores = jogadores.length;

  jogadores.sort((a, b) => (pontos[b] || 0) - (pontos[a] || 0));

  const vencedor = jogadores[0];
  vencedorDiv.textContent = `O VENCEDOR DO TORNEIO FOI: TIME ${vencedor} COM ${pontos[vencedor] || 0} pontos`;

  const linhaCabecalho = tabela.insertRow();
  linhaCabecalho.insertCell().textContent = 'TIMES  ';
  linhaCabecalho.insertCell().textContent = '| PONTOS';

  for (let i = 0; i < numJogadores; i++) {
    const linha = tabela.insertRow();
    const nomeJogador = jogadores[i];
    linha.insertCell().textContent = nomeJogador;
    linha.insertCell().textContent = pontos[nomeJogador] || 0;
  }
}

function exibirHistoricoPartidas() {
  const tabelaHistoricoPartidas = document.createElement('table');

  historicoPartidas.forEach((partida, index) => {
    const linha = tabelaHistoricoPartidas.insertRow();
    const celulaNumeroPartida = linha.insertCell();
    celulaNumeroPartida.textContent = `PARTIDA ${index + 1}`;
    const celulaTimes = linha.insertCell();
    celulaTimes.textContent = `${partida.time1} vs ${partida.time2}`;
    const celulaResultado = linha.insertCell();
    celulaResultado.textContent = partida.resultado;
  });

  secaoHistoricoPartidas.appendChild(tabelaHistoricoPartidas);
}
