// Inicialização de variáveis globais
var dados = [];
// Variável global para armazenar a soma dos valores positivos por mês e dia
var somaPorMesDia = {};
var subtracaoPorMesDia = {};
// Inicialização de variáveis globais
var somaPorMesDia = {}; // Criando um objeto vazio para armazenar a soma dos valores positivos por mês e dia
var subtracaoPorMesDia = {}; // Criando um objeto vazio para armazenar a subtração dos valores negativos por mês e dia
var faturamentoTotal = 0; // Variável global para armazenar o faturamento total
var minimoDoMes = Infinity; // Variável global para armazenar o mínimo do mês
var maximoDoMes = -Infinity; // Variável global para armazenar o máximo do mês
var mediaDoMes = 0; // Variável global para armazenar a média do mês
var faturamentoTotalSaida = 0; // Variável global para armazenar o faturamento total de saídas
var minimoDoMesSaida = Infinity; // Variável global para armazenar o mínimo do mês de saídas
var maximoDoMesSaida = -Infinity; // Variável global para armazenar o máximo do mês de saídas
var mediaDoMesSaida = 0; // Variável global para armazenar a média do mês de saídas

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
  var tableHtml = '<div class="table-responsive" ><table class="table table-striped table-borderless table-sm">';
  tableHtml += '<tr><td>Mês</td> <td>Classificação</td> <td>Descrição</td> <td>Valor</td><td>Saldo</td> </tr>';

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
  tableHtml += "</table></div>";

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
  var htmlTabela = '<table border="1" class="table">';
  var htmlTabela = '<div class="table-responsive" ><table class="table table-striped table-borderless  table-sm">';
  htmlTabela += '<tr><td>Mês</td> <td>Entrada</td> <td>Saida</td> <td>Saldo</td> </tr>';

  for (var mesAno in somaPorMesDia) {
    var totalAno = 0;
    for (var ano in somaPorMesDia[mesAno]) {
      totalAno += somaPorMesDia[mesAno][ano];
    }

    var [mes, ano] = mesAno.split("/");
    var chave = mes + "/" + ano;
    var valor_mes = somaPorMesDia[chave];
    var saida_mes = subtracaoPorMesDia[chave];

    htmlTabela += "<tr>";
    htmlTabela += "<td>" + chave + "</td>";
    htmlTabela += "<td>" + formatarNumeroParaBRL(valor_mes) + "</td>";
    htmlTabela += "<td>" + formatarNumeroParaBRL(saida_mes) + "</td>";
    htmlTabela += "<td>" + formatarNumeroParaBRL(valor_mes-saida_mes) + "</td>";
    htmlTabela += "</tr>";
  }

  htmlTabela += "</table></div>";
  elementoDados.innerHTML = htmlTabela;
}

// Função para criar o gráfico
function criarGrafico() {
  tornarOutputInvisivel();
  renderizarGrafico(somaPorMesDia, subtracaoPorMesDia);
  renderizarDados(somaPorMesDia)
}

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
  gerarTabela(valores);
  gerarTabelaSaidas(valoresSaidas)
}


// Torna o gráfico invisível ao carregar a página
tornarGraficoInvisivel();


function gerarTabela(valores) {
  // Calcula a soma de todos os valores
  var soma = valores.reduce((acc, curr) => acc + Number(curr), 0);
  
  
    // Calcula o maior e o menor valor
    var maior = Math.max(...valores);// Filtra os valores para remover os zeros
  var valoresDiferentesDeZero = valores.filter(valor => valor !== 0);
  
  // Calcula o menor valor diferente de zero
  var menor = Math.min(...valoresDiferentesDeZero);
  
    // Calcula a média dos valores
    var media = soma / valores.length;
    var elementoDados = document.getElementById("tabela2");
    var htmlTabela = '<div class="table-responsive" ><table class="table table-striped table-borderless table-sm">';
  
  
      htmlTabela += "<tr>";
      htmlTabela += "<td> Total </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(soma) + "</td>";
      htmlTabela += "</tr>";
      htmlTabela += "<tr>";
      htmlTabela += "<td> Maior </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(maior) + "</td>";
      htmlTabela += "</tr>";
      htmlTabela += "<tr>";
      htmlTabela += "<td> Menor </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(menor) + "</td>";
      htmlTabela += "</tr>";
      htmlTabela += "<tr>";
      htmlTabela += "<td> Média </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(media) + "</td>";
      htmlTabela += "</tr>";
  
    htmlTabela += "</table></div>";
    elementoDados.innerHTML = htmlTabela;
  }
  function gerarTabelaSaidas(valores) {
  // Calcula a soma de todos os valores
  var soma = valores.reduce((acc, curr) => acc + Number(curr), 0);
  
  
    // Calcula o maior e o menor valor
    var maior = Math.max(...valores);// Filtra os valores para remover os zeros
  var valoresDiferentesDeZero = valores.filter(valor => valor !== 0);
  
  // Calcula o menor valor diferente de zero
  var menor = Math.min(...valoresDiferentesDeZero);
  
    // Calcula a média dos valores
    var media = soma / valores.length;
    var elementoDados = document.getElementById("tabela3");
    var htmlTabela = '<div class="table-responsive" ><table class="table table-striped table-borderless table-sm">';
  
  
      htmlTabela += "<tr>";
      htmlTabela += "<td> Total </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(soma) + "</td>";
      htmlTabela += "</tr>";
      htmlTabela += "<tr>";
      htmlTabela += "<td> Maior </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(maior) + "</td>";
      htmlTabela += "</tr>";
      htmlTabela += "<tr>";
      htmlTabela += "<td> Menor </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(menor) + "</td>";
      htmlTabela += "</tr>";
      htmlTabela += "<tr>";
      htmlTabela += "<td> Média </td>";
      htmlTabela += "<td>" + formatarNumeroParaBRL(media) + "</td>";
      htmlTabela += "</tr>";
  
    htmlTabela += "</table></div>";
    elementoDados.innerHTML = htmlTabela;
  }
