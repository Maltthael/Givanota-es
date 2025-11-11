window.onload = function() {
  carregarTarefas();
  configurarModal();
};

function criarTarefa(titulo = '', descricao = '') {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  const novaTarefa = {
    id: Date.now(),
    titulo: titulo,
    descricao: descricao,
    concluida: false
  };

  tarefas.push(novaTarefa);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  carregarTarefas();
}

function carregarTarefas() {
  const pendenteArea = document.getElementById('tarefa-pendente');
  const concluidaArea = document.getElementById('tarefa-concluida');

  pendenteArea.querySelectorAll('.tarefa-card').forEach(el => el.remove());
  concluidaArea.querySelectorAll('.tarefa-card').forEach(el => el.remove());

  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  tarefas.forEach(tarefa => {
    const card = document.createElement('div');
    card.className = 'tarefa-card border p-3 rounded mb-3 bg-white shadow-sm';
    card.style.position = 'relative';

    const tituloEl = document.createElement('h5');
    tituloEl.contentEditable = !tarefa.concluida;
    tituloEl.innerText = tarefa.titulo;
    tituloEl.className = 'card-title mb-1';

    const descEl = document.createElement('p');
    descEl.contentEditable = !tarefa.concluida;
    descEl.innerText = tarefa.descricao;
    descEl.className = 'card-text';

    const btnConcluir = document.createElement('button');
    btnConcluir.className = 'btn btn-success btn-sm me-1';
    btnConcluir.innerText = 'Concluir';
    btnConcluir.onclick = () => concluirTarefa(tarefa.id);

    const btnSalvar = document.createElement('button');
    btnSalvar.className = 'btn btn-primary btn-sm me-1';
    btnSalvar.innerText = 'Salvar';
    btnSalvar.onclick = () => salvarTarefa(tarefa.id, tituloEl.innerText, descEl.innerText);

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn btn-danger btn-sm';
    btnExcluir.innerText = 'Excluir';
    btnExcluir.onclick = () => excluirTarefa(tarefa.id);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'mt-2';
    if (!tarefa.concluida) {
      btnContainer.appendChild(btnConcluir);
      btnContainer.appendChild(btnSalvar);
    }
    btnContainer.appendChild(btnExcluir);

    card.appendChild(tituloEl);
    card.appendChild(descEl);
    card.appendChild(btnContainer);

    if (tarefa.concluida) {
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'auto';
    }

    if (tarefa.concluida) {
      concluidaArea.appendChild(card);
    } else {
      pendenteArea.appendChild(card);
    }
  });
}

function concluirTarefa(id) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  tarefa.concluida = true;
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  carregarTarefas();
}

function salvarTarefa(id, novoTitulo, novaDescricao) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  tarefa.titulo = novoTitulo.trim();
  tarefa.descricao = novaDescricao.trim();
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  carregarTarefas();
}

function excluirTarefa(id) {
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas = tarefas.filter(t => t.id !== id);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  carregarTarefas();
}

function abrirNovaTarefa() {
  const modal = new bootstrap.Modal(document.getElementById('modalTarefa'));
  modal.show();
  document.getElementById('tituloTarefa').value = '';
  document.getElementById('descricaoTarefa').value = '';
  modal.show();
}

document.getElementById('btnSalvarTarefa').addEventListener('click', () => {
  const titulo = document.getElementById('tituloTarefa').value.trim();
  const descricao = document.getElementById('descricaoTarefa').value.trim();

  if (!titulo) {
    alert("Digite um título para a tarefa!");
    return;
  }

  criarTarefa(titulo, descricao);

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalTarefa'));
  modal.hide();
});

function atualizarMensagemVazia() {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const msg = document.getElementById('mensagem-vazia');
  const container = document.querySelector('.container');

  if (tarefas.length === 0) {
    msg.style.display = 'block';
    container.style.display = 'none';
  } else {
    msg.style.display = 'none';
    container.style.display = 'block';
  }
}

const _carregarTarefasOriginal = carregarTarefas;
carregarTarefas = function() {
  _carregarTarefasOriginal();
  atualizarMensagemVazia();
};

window.onload = function() {
  carregarTarefas();
};
