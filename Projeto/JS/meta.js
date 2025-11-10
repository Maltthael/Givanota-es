// Função para criar uma nova meta
function criarMeta() {
    const nome = prompt("Digite o nome da meta:");
    if (!nome) return;

    const total = parseInt(prompt("Quantas tarefas (post-its) precisa concluir para completar a meta?"));
    if (!total || total <= 0) return alert("Número inválido.");

    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const novaMeta = {
        id: Date.now(),
        nome,
        total,
        concluidas: 0,
        tarefas: []
    };

    metas.push(novaMeta);
    localStorage.setItem("metas", JSON.stringify(metas));

    const pVazio = document.getElementById("texto-vazio");
    if (pVazio) pVazio.remove();

    mostrarMeta(novaMeta);
    confeteSimples();
}

// Exibe uma meta na tela
function mostrarMeta(meta) {
    const container = document.getElementById("area-metas");

    const metaDiv = document.createElement("div");
    metaDiv.classList.add("meta", "border", "p-3", "rounded", "mb-3", "bg-white", "shadow-sm");
    metaDiv.id = `meta-${meta.id}`; // importante para atualizar tarefas

    const progresso = Math.min((meta.concluidas / meta.total) * 100, 100);

    metaDiv.innerHTML = `
    <h4 class="text-success fw-bold">${meta.nome}</h4>
    <p>${meta.concluidas} de ${meta.total} tarefas concluídas</p>
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

    // Atualiza tarefas caso já existam
    atualizarMetaVisual(meta.id);
}

// Adicionar tarefa dentro de uma meta
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

    // Atualiza progresso
    const progresso = Math.min(
        (meta.tarefas.filter(t => t.concluida).length / meta.total) * 100,
        100
    );
    metaDiv.querySelector(".progress-bar").style.width = progresso + "%";

    const tarefasContainer = metaDiv.querySelector(".meta-tarefas");
    tarefasContainer.innerHTML = "";

    // renderiza tarefas
    meta.tarefas.forEach(tarefa => {
        const tarefaDiv = document.createElement("div");
        tarefaDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-1", "p-2", "border", "rounded");
        if (tarefa.concluida) tarefaDiv.classList.add("opacity-50");

        tarefaDiv.innerHTML = `
        <span contenteditable="${!tarefa.concluida}">${tarefa.titulo}</span>
        <div>
          <button class="btn btn-sm btn-success me-1" ${tarefa.concluida ? "disabled" : ""} onclick="concluirTarefa(${id}, ${tarefa.id})">
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="btn btn-sm btn-warning me-1" ${tarefa.concluida ? "disabled" : ""} onclick="editarTarefa(${id}, ${tarefa.id})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="excluirTarefa(${id}, ${tarefa.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

        tarefasContainer.appendChild(tarefaDiv);
    });
}

// concluir tarefa
function concluirTarefa(idMeta, idTarefa) {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const meta = metas.find(m => m.id === idMeta);
    const tarefa = meta.tarefas.find(t => t.id === idTarefa);
    if (!tarefa || tarefa.concluida) return;

    tarefa.concluida = true;
    localStorage.setItem("metas", JSON.stringify(metas));
    atualizarMetaVisual(idMeta);
}

// editar tarefa
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

// excluir tarefa
function excluirTarefa(idMeta, idTarefa) {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const meta = metas.find(m => m.id === idMeta);
    meta.tarefas = meta.tarefas.filter(t => t.id !== idTarefa);
    localStorage.setItem("metas", JSON.stringify(metas));
    atualizarMetaVisual(idMeta);
}

// excluir meta
function excluirMeta(id) {
    const confirmar = confirm("Deseja excluir esta meta?");
    if (!confirmar) return;

    let metas = JSON.parse(localStorage.getItem("metas")) || [];
    metas = metas.filter(m => m.id !== id);
    localStorage.setItem("metas", JSON.stringify(metas));

    atualizarMetas();
}

// Atualiza todas as metas
function atualizarMetas() {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const container = document.getElementById("area-metas");
    container.innerHTML = "";

    if (metas.length === 0) {
        document.getElementById("texto-vazio").style.display = "block";
        return;
    } else {
        const pVazio = document.getElementById("texto-vazio");
        if (pVazio) pVazio.style.display = "none";
    }

    metas.forEach(mostrarMeta);
}

// Efeito de confete
function confeteSimples() {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
        const colors = ['#22c55e', '#16a34a', '#4ade80', '#86efac'];
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.width = "8px";
        particle.style.height = "8px";
        particle.style.borderRadius = "50%";
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.top = Math.random() * window.innerHeight + "px";
        particle.style.opacity = "0.8";
        particle.style.transition = "transform 1s ease-out, opacity 1s";
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.style.transform = `translateY(${100 + Math.random() * 100}px)`;
            particle.style.opacity = "0";
        }, 50);

        setTimeout(() => particle.remove(), 1000);

        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

// Carrega as metas salvas ao abrir a página
window.onload = atualizarMetas;
