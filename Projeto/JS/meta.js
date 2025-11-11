function abrirModalMeta() {
  const modal = new bootstrap.Modal(document.getElementById('modalMeta'));
  modal.show();
}

function criarMeta() {
  const nome = document.getElementById('nomeMeta').value.trim();
  const total = parseInt(document.getElementById('totalMeta').value);

  if (!nome) return alert("Digite o nome da meta.");
  if (!total || total <= 0) return alert("Número inválido.");

  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const novaMeta = { id: Date.now(), nome, total, tarefas: [] };

  metas.push(novaMeta);
  localStorage.setItem("metas", JSON.stringify(metas));

  const pVazio = document.getElementById("texto-vazio");
  if (pVazio) pVazio.remove();

  mostrarMeta(novaMeta);

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalMeta'));
  if (modal) modal.hide();

  document.getElementById('nomeMeta').value = '';
  document.getElementById('totalMeta').value = '';
}


// Exibe uma meta na tela
function mostrarMeta(meta) {
  const container = document.getElementById("area-metas");

  const metaDiv = document.createElement("div");
  metaDiv.classList.add("meta", "border", "p-3", "rounded", "mb-3", "bg-white", "shadow-sm");
  metaDiv.id = `meta-${meta.id}`;

  const progresso = 0;

  metaDiv.innerHTML = `
    <h4 class="text-success fw-bold">${meta.nome}</h4>
    <p>0 de ${meta.total} tarefas concluídas</p>
    <div class="progress mt-2" style="height: 20px;">
      <div class="progress-bar bg-success" style="width: ${progresso}%"></div>
    </div>
    <div class="meta-tarefas mt-3"></div> <!-- CONTÊINER PARA AS TAREFAS -->
    <div class="d-flex justify-content-start gap-2 mt-3">
      <button class="btn btn-sm btn-success" onclick="adicionarConcluida(${meta.id})">
        <i class="fa-solid fa-plus"></i> Adicionar Tarefa
      </button>
      <button class="btn btn-sm btn-danger" onclick="excluirMeta(${meta.id})">
        <i class="fa-solid fa-trash"></i> Excluir
      </button>
    </div>
  `;

  container.appendChild(metaDiv);

  atualizarMetaVisual(meta.id);
}

function adicionarConcluida(id) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find(m => m.id === id);
  if (!meta) return;

  const titulo = prompt("Digite o título da tarefa:");
  if (!titulo) return;

  const novaTarefa = {
    id: Date.now(),
    titulo,
    concluida: false
  };

  meta.tarefas.push(novaTarefa);
  localStorage.setItem("metas", JSON.stringify(metas));

  atualizarMetaVisual(id);
}

// Atualiza visualmente uma meta (mostrando tarefas)
function atualizarMetaVisual(id) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find(m => m.id === id);
  if (!meta) return;

  const metaDiv = document.getElementById(`meta-${id}`);
  if (!metaDiv) return;

  const tarefasConcluidas = meta.tarefas.filter(t => t.concluida).length;

  metaDiv.querySelector("p").textContent = `${tarefasConcluidas} de ${meta.total} tarefas concluídas`;

  const progresso = Math.min((tarefasConcluidas / meta.total) * 100, 100);
  metaDiv.querySelector(".progress-bar").style.width = progresso + "%";


  if (progresso === 100 && tarefasConcluidas >= meta.total) {
    confeteSimples();
    const botoes = metaDiv.querySelectorAll("button.btn.btn-sm.btn-success");
    const botaoAdicionar = Array.from(botoes).find(btn =>
      btn.innerText.includes("Adicionar") || btn.textContent.includes("Adicionar")
    );

    if (botaoAdicionar) botaoAdicionar.remove();


  }

  const tarefasContainer = metaDiv.querySelector(".meta-tarefas");
  tarefasContainer.innerHTML = "";

  meta.tarefas.forEach(tarefa => {
    const tarefaDiv = document.createElement("div");
    tarefaDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-1", "p-2", "border", "rounded");

    tarefaDiv.innerHTML = `
      <span contenteditable="${!tarefa.concluida}">${tarefa.titulo}</span>
      <div>
        <button class="btn btn-sm btn-success me-1" ${tarefa.concluida ? "disabled" : ""}>
          <i class="fa-solid fa-check"></i>
        </button>
        <button class="btn btn-sm btn-warning me-1" ${tarefa.concluida ? "disabled" : ""}>
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-danger">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    tarefasContainer.appendChild(tarefaDiv);

    const btnConcluir = tarefaDiv.querySelector(".btn-success");
    const btnEditar = tarefaDiv.querySelector(".btn-warning");
    const btnExcluir = tarefaDiv.querySelector(".btn-danger");
    btnConcluir.addEventListener("click", () => concluirTarefa(id, tarefa.id));
    btnEditar.addEventListener("click", () => editarTarefa(id, tarefa.id));
    btnExcluir.addEventListener("click", () => excluirTarefa(id, tarefa.id));

    if (tarefa.concluida) {
      tarefaDiv.style.opacity = "0.5";
    }
  });
}

function concluirTarefa(idMeta, idTarefa) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find(m => m.id === idMeta);
  const tarefa = meta.tarefas.find(t => t.id === idTarefa);
  if (!tarefa || tarefa.concluida) return;

  tarefa.concluida = true;
  localStorage.setItem("metas", JSON.stringify(metas));
  atualizarMetaVisual(idMeta);
}

function editarTarefa(idMeta, idTarefa) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find(m => m.id === idMeta);
  const tarefa = meta.tarefas.find(t => t.id === idTarefa);
  if (!tarefa || tarefa.concluida) return;

  const novoTitulo = prompt("Editar tarefa:", tarefa.titulo);
  if (novoTitulo) {
    tarefa.titulo = novoTitulo.trim();
    localStorage.setItem("metas", JSON.stringify(metas));
    atualizarMetaVisual(idMeta);
  }
}

function excluirTarefa(idMeta, idTarefa) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find(m => m.id === idMeta);
  meta.tarefas = meta.tarefas.filter(t => t.id !== idTarefa);
  localStorage.setItem("metas", JSON.stringify(metas));
  atualizarMetaVisual(idMeta);
}

function excluirMeta(id) {
  const confirmar = confirm("Deseja excluir esta meta?");
  if (!confirmar) return;

  let metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas = metas.filter(m => m.id !== id);
  localStorage.setItem("metas", JSON.stringify(metas));

  const metaDiv = document.getElementById(`meta-${id}`);
  if (metaDiv) metaDiv.remove();
}

function atualizarMetas() {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const container = document.getElementById("area-metas");
  container.innerHTML = "";

  if (metas.length === 0) {
    document.getElementById("texto-vazio").style.display;
  }
}

function confeteSimples() {
  confetti();
}

function salvarTudo() {
  const metas = [];

  document.querySelectorAll(".meta").forEach(metaDiv => {
    const id = parseInt(metaDiv.id.replace("meta-", ""));
    const nome = metaDiv.querySelector("h4").textContent.trim();

    const texto = metaDiv.querySelector("p").textContent;
    const total = parseInt(texto.match(/\d+/g)?.pop() || 0);

    const tarefas = [];

    metaDiv.querySelectorAll(".meta-tarefas div").forEach(div => {
      const titulo = div.querySelector("span").textContent.trim();
      const concluida = div.style.opacity === "0.5"; // mesma lógica visual
      tarefas.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        titulo,
        concluida
      });
    });

    metas.push({ id, nome, total, tarefas });
  });

  if (metas.length === 0) {
    alert("Não há metas para salvar!");
    return;
  }

  // salva tudo localmente
  localStorage.setItem("metas", JSON.stringify(metas));
  alert(" Todas as metas foram salvas localmente!");
}

function carregarTudo() {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const container = document.getElementById("area-metas");
  container.innerHTML = "";

  // se houver metas remove o texto "nenhuma meta"
  const pVazio = document.getElementById("texto-vazio");
  if (metas.length > 0 && pVazio) pVazio.remove();

  metas.forEach(meta => mostrarMeta(meta));
}





