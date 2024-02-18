// Inicialização de variáveis globais
var dados = [];
// Variável global para armazenar a soma dos valores positivos por mês e dia
var somaPorMesDia = {};
var subtracaoPorMesDia = {};

// Função para converter um número para o formato de moeda brasileira
function formatarNumeroParaBRL(valor) {
  var numeroFormatado = valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return numeroFormatado;
}

// Função para converter a matriz de texto em um formato adequado
function converterMatriz() {
  // Torna a div do gráfico visível
  document.getElementById("div_grafico").style.display = "block";
  // Obtém o valor do textarea e divide em linhas
  var texto = document.getElementById("inputTextArea").value;
  var linhas = texto.split("\n");

  // Inicializa o saldo como 0
  var saldo = 0;

  // Cria a tabela HTML
  var tableHtml = '<table class="table table-bordered " border="1"  >';

  // Itera sobre as linhas da matriz
  linhas.forEach(function (linha) {
    // Divide a linha em colunas
    var colunas = linha.split("\t");

    // Verifica se a linha tem as colunas esperadas
    if (colunas.length >= 3) {
      // Converte o valor e o saldo para números
      var valor = parseFloat(colunas[3].replace(",", "."));
      saldo += parseFloat(colunas[3].replace(",", "."));

      // Adiciona a linha à tabela HTML
      tableHtml += "<tr>";
      tableHtml += "<td>" + colunas[0] + "</td>";
      tableHtml += "<td>" + colunas[1] + "</td>";
      tableHtml += "<td>" + colunas[2] + "</td>";
      tableHtml += "<td>" + formatarNumeroParaBRL(valor) + "</td>";
      tableHtml += "<td>" + formatarNumeroParaBRL(saldo) + "</td>";
      tableHtml += "</tr>";

      // Obtém a data da linha
      var data = colunas[0].split("/");
      var mes = parseInt(data[1]);
      var ano = parseInt(data[2]);
      var chave = mes + "/" + ano;

      // Verifica se o valor é positivo
      // Adiciona o valor à soma do mês e ano correspondentes no dicionário
      if (!somaPorMesDia[chave]) {
        somaPorMesDia[chave] = 0;
      }
      if (!subtracaoPorMesDia[chave]) {
        subtracaoPorMesDia[chave] = 0;
      }

      if (valor >= 0) {
        somaPorMesDia[chave] += valor;
      } else {
        // Adiciona o valor à soma do mês e ano correspondentes no dicionário
        subtracaoPorMesDia[chave] += Math.abs(valor);
      }
    }
  });

  // Fecha a tabela HTML
  tableHtml += "</table>";

  // Exibe a tabela HTML na div de saída
  document.getElementById("outputDiv").innerHTML = tableHtml;

  // Salva os dados no LocalStorage
  localStorage.setItem("matriz", JSON.stringify(linhas));
}

// Verifica se há dados no LocalStorage ao carregar a página
window.onload = function () {
  dados = localStorage.getItem("matriz");
  if (dados) {
    var linhas = JSON.parse(dados);
    var texto = linhas.join("\n");
    document.getElementById("inputTextArea").value = texto;
    converterMatriz();
  }
};

// Função para converter uma string de data no formato "DD/MM/YYYY" para um objeto Date
function converterStringParaData(stringData) {
  var partes = stringData.split("/");
  var dataFormatada = partes[2] + "-" + partes[1] + "-" + partes[0];
  var data = new Date(dataFormatada);
  return data;
}

// Funções para tornar a saída invisível e visível
function tornarOutputInvisivel() {
  var outputDiv = document.getElementById("fomulario_tabela");
  outputDiv.style.display = "none";
}

function tornarGraficoInvisivel() {
  var outputDiv = document.getElementById("div_grafico");
  outputDiv.style.display = "none";
}

function tornarGraficoVisivel() {
  var outputDiv = document.getElementById("div_grafico");
  outputDiv.style.visibility = "visible";
}

// Função para renderizar os dados na tabela
function renderizarDados(somaPorMesDia) {
  var elementoDados = document.getElementById("dados");
  var htmlTabela = '<table border="1">';
  htmlTabela += "<tr><th>Mês/Ano</th><th>Total de Valores Positivos</th></tr>";

  for (var mesAno in somaPorMesDia) {
    var totalAno = 0;
    for (var ano in somaPorMesDia[mesAno]) {
      totalAno += somaPorMesDia[mesAno][ano];
    }

    var [mes, ano] = mesAno.split("/");
    var chave = mes + "/" + ano;
    var valor_mes = somaPorMesDia[chave].toFixed(2);

    htmlTabela += "<tr>";
    htmlTabela += "<td>" + chave + "</td>";
    htmlTabela += "<td>" + valor_mes + "</td>";
    htmlTabela += "</tr>";
  }

  htmlTabela += "</table>";
  elementoDados.innerHTML = htmlTabela;
}

// Função para criar o gráfico
function criarGrafico() {
  tornarOutputInvisivel();
  renderizarGrafico(somaPorMesDia, subtracaoPorMesDia);
}

// Função para renderizar o gráfico
function renderizarGrafico(somaPorMesDia, subtracaoPorMesDia) {
  tornarGraficoVisivel();
  var ctx = document.getElementById("grafico").getContext("2d");
  var meses = [];
  var valores = [];
  var valoresSaidas = [];

  for (var mesAno in somaPorMesDia) {
    var [mes, ano] = mesAno.split("/");
    meses.push(mes + "/" + ano);
    valores.push(somaPorMesDia[mesAno].toFixed(2));
  }

  for (var mesAno in subtracaoPorMesDia) {
    var [mes, ano] = mesAno.split("/");
    valoresSaidas.push(subtracaoPorMesDia[mesAno].toFixed(2));
  }

  var grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: meses,
      datasets: [
        {
          label: "Total de Valores Positivos",
          data: valores,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Total de Valores Negativos",
          data: valoresSaidas,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Armazene os dicionários no localStorage
  localStorage.setItem("meses", JSON.stringify(meses));
  localStorage.setItem("somaPorMesDia", JSON.stringify(somaPorMesDia));
  localStorage.setItem(
    "subtracaoPorMesDia",
    JSON.stringify(subtracaoPorMesDia)
  );
}

// Torna o gráfico invisível ao carregar a página
tornarGraficoInvisivel();
