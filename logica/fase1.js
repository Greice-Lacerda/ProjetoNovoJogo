let numVertices = 0;
      // Função para exibir a mensagem temporária no meio da tela
      function exibirMensagemTemporaria(mensagem, classe = "") {
        const mensagensDiv = document.getElementById("mensagens");

        if (!mensagensDiv) {
            console.error("Elemento com id 'mensagens' não encontrado.");
            return;
        }

        // Limpa o conteúdo anterior da div
        mensagensDiv.innerHTML = "";

        // Adiciona a mensagem principal
        const mensagemTexto = document.createElement("p");
        mensagemTexto.textContent = mensagem;
        mensagemTexto.className = `mensagem-texto ${classe}`;

        // Adiciona a mensagem à div
        mensagensDiv.appendChild(mensagemTexto);

        // Aplica os estilos na div mensagens
        mensagensDiv.style.display = "flex"; // Exibe a janela de mensagens        
    }

      const mensagem = "Escolha o número de vértices (mínimo 3): ";
      exibirMensagemTemporaria(mensagem, "mensagem-piscar"); 
      setTimeout(() => {
        exibirMensagemTemporaria(mensagem, "mensagem-vermelha");
        iniciarJogo();
      }, 2000);

      const mensagem1 = "Clique no botão Adicionar Vértice e na malha para inserir os vértices."
      setTimeout(() => {
        exibirMensagemTemporaria(mensagem1, "mensagem-vermelha");
        iniciarJogo();
      }, 2000);

function iniciarJogo() {
  let numVertices = parseInt(prompt("Escolha o número de vértices (mínimo 3):", 3));

  while (isNaN(numVertices) || numVertices < 3) {
    exibirMensagemTemporaria("Número inválido! Tente novamente.");
    numVertices = parseInt(prompt("Escolha o número de vértices (mínimo 3):", 3));
  }  
}

function voltar() {
  window.location.href = "paginas/instrucao.html";
}

function imprimirJogo() {
  window.open("paginas/imprimir.html", "_blank");
}

function sairJogo() {
  window.location.href = "http://www.google.com/"; // Sai do jogo
}

// Configuração do Canvas
let vertices = [];
let arestas = [];
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;
canvas.style.background = "white";
canvas.style.border = "1px solid black";
canvas.style.borderRadius = "10px";
canvas.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
canvas.style.backgroundColor = "white";
canvas.style.backgroundImage = "linear-gradient(lightgray 1px, transparent 1px), linear-gradient(90deg, lightgray 1px, transparent 1px)";
canvas.style.backgroundSize = "20px 20px";
canvas.style.backgroundRepeat = "repeat";

ctx.lineWidth = 3; // Aumenta a espessura da aresta

// Função para iniciar o jogo ao clicar no canvas pela primeira vez
function iniciarJogo(event) {
  numVertices = parseInt(prompt("Escolha o número de vértices (mínimo 3):", 3));

  if (isNaN(numVertices) || numVertices < 3) {
    alert("Número inválido! Tente novamente.");
    return;
  }
  canvas.addEventListener("click", addVertice);
}

// Função para adicionar vértices ao canvas
document.getElementById('addVertex').addEventListener('click', function() {
  if (vertices.length < numVertices) {
      canvas.addEventListener('click', addVertice);
  }
});

function addVertice(event) {
  let x = event.offsetX;
  let y = event.offsetY;
  vertices.push({ x, y });
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  if (vertices.length >= numVertices) {
      canvas.removeEventListener('click', addVertice);
      
      const mensagem2 = "Clique no botão Adicionar Arestas para ligar dois vértices."
      setTimeout(() => {
        exibirMensagemTemporaria(mensagem2, "mensagem-amarela");
      }, 2000);
  }
}

document.getElementById('addEdge').addEventListener('click', function() {
  canvas.addEventListener('click', selectVertices);
});

let selectedVertices = [];

function selectVertices(event) {
  let x = event.offsetX;
  let y = event.offsetY;
  let vertex = vertices.find(v => Math.hypot(v.x - x, v.y - y) < 5);
  if (vertex && selectedVertices.length < 2) {
      selectedVertices.push(vertex);
      if (selectedVertices.length === 2) {
          addAresta();
      }
  }
}

function addAresta() {
  let v1 = selectedVertices[0];
  let v2 = selectedVertices[1];

  if (!edgeExists(v1, v2) && !linesIntersect(v1, v2)) {
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.stroke();
      arestas.push({ v1, v2 });
  }

  selectedVertices = [];

  if (arestas.length < numVertices * (numVertices - 1) / 2) {
      canvas.addEventListener('click', selectVertices);
  } else {
      canvas.removeEventListener('click', selectVertices);
      document.getElementById('addEdge').disabled = true;
      const mensagem3 = "Clique no botão Pintar Elementos para pintar os triângulos."
      setTimeout(() => {
        exibirMensagemTemporaria(mensagem3, "mensagem-azul");
      }, 2000);
  }
}
  

function edgeExists(v1, v2) {
  return arestas.some(aresta => 
      (aresta.v1 === v1 && aresta.v2 === v2) || 
      (aresta.v1 === v2 && aresta.v2 === v1)
  );
}

function linesIntersect(v1, v2) {
  for (let aresta of arestas) {
      if (doLinesIntersect(v1, v2, aresta.v1, aresta.v2)) {
          return true;
      }
  }
  return false;
}

function doLinesIntersect(p1, p2, p3, p4) {
  function ccw(A, B, C) {
      return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
}
ctx.lineWidth = 3; // Aumentar a espessura da aresta
function areAllVerticesConnected() {
  if (vertices.length === 0) return true;

  let visited = new Set();
  let stack = [vertices[0]];

  while (stack.length > 0) {
      let vertex = stack.pop();
      visited.add(vertex);

      arestas.forEach(aresta => {
          if (aresta.v1 === vertex && !visited.has(aresta.v2)) {
              stack.push(aresta.v2);
          } else if (aresta.v2 === vertex && !visited.has(aresta.v1)) {
              stack.push(aresta.v1);
          }
      });
  }

  return visited.size === vertices.length;
}