function criarBloco(titulo = 'Novo Bloco') {
    const area = document.getElementById('area-tarefas');

    const bloco = document.createElement('div');
    bloco.className = 'card mb-3 p-3';
    bloco.style.width = '350px';
    bloco.style.minHeight = '150px';
    bloco.style.position = 'relative';
    bloco.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    // título
    const tituloEl = document.createElement('h5');
    tituloEl.contentEditable = 'true';
    tituloEl.innerText = titulo;
    tituloEl.className = 'card-title mb-3';

    // container das tarefas
    const lista = document.createElement('div');
    lista.className = 'lista-tarefas mb-2';

    // botões do bloco
    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn btn-sm btn-success me-2';
    btnAdd.innerText = '+ Tarefa';
    btnAdd.onclick = () => addTarefa(lista);

    const btnDel = document.createElement('button');
    btnDel.className = 'btn btn-sm btn-danger';
    btnDel.innerText = 'Excluir Bloco';
    btnDel.onclick = () => bloco.remove();

    // adiciona tudo no bloco
    bloco.appendChild(tituloEl);
    bloco.appendChild(lista);
    bloco.appendChild(btnAdd);
    bloco.appendChild(btnDel);
    area.appendChild(bloco);
}


function addTarefa(valor = ''){
    const area  = document.getElementById('tarefa-pendente');
    const tarefap = document.createElement('textarea');
    tarefap.className = 'tarefap form-control';
    tarefap.placeholder = 'Digite aqui....';
    tarefap.style.width = '300px';
    tarefap.style.height = '200px'; 
    tarefap.style.border = '1px black solid'; 
    tarefap.value = valor;

    area.appendChild(tarefap)
    
}