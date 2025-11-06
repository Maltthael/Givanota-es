let tipoAtual = '';

        function criarBloco(valor = '') {
            const area = document.getElementById('area-blocos');
            const bloco = document.createElement('textarea');
            bloco.className = 'bloco form-control';
            bloco.placeholder = 'Digite aqui...';
            bloco.style.width = '300px';
            bloco.style.height = '200px';
            bloco.style.border = '1px black solid';
            bloco.value = valor;
            bloco.draggable = true;
            bloco.id = 'bloco-' + Date.now();

            bloco.addEventListener('dragstart', e => {
                e.dataTransfer.setData('id', bloco.id);
            });

            area.appendChild(bloco);
        }


        function criarCategoria(titulo = 'Nova Categoria', corFundo = 'red', corTexto = '#000000') {
            const area = document.getElementById('area-categoria');
            const cat = document.createElement('div');
            cat.className = 'categoria';
            cat.contentEditable = 'true';
            cat.style.width = '300px';
            cat.style.height = '200px';
            cat.style.backgroundColor = corFundo;
            cat.style.color = corTexto;
            cat.style.padding = '10px';
            cat.style.border = '1px solid #ccc';
            cat.style.borderRadius = '8px';
            cat.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
            cat.style.overflow = 'auto';
            cat.dataset.nome = titulo; // importante: nome interno da categoria

            // --- título visível ---
            const tituloEl = document.createElement('div');
            tituloEl.className = 'categoria-titulo';
            tituloEl.contentEditable = 'true';
            tituloEl.textContent = titulo;
            tituloEl.style.fontSize = '20px';
            tituloEl.style.fontWeight = 'bold';
            tituloEl.style.fontFamily = '"Segoe UI", sans-serif';
            tituloEl.style.textAlign = 'center';
            tituloEl.style.marginBottom = '8px';
            tituloEl.style.borderBottom = '2px solid rgba(0,0,0,0.15)';
            tituloEl.style.paddingBottom = '3px';

            // evento: atualizar nome interno quando o título mudar
            tituloEl.addEventListener('input', () => {
                cat.dataset.nome = tituloEl.textContent.trim();
            });

            // --- corpo do conteúdo ---
            const conteudo = document.createElement('div');
            conteudo.className = 'categoria-conteudo';
            conteudo.style.flex = '1';
            conteudo.style.minHeight = '100px';

            // Permitir soltar itens dentro
            cat.addEventListener('dragover', e => e.preventDefault());
            cat.addEventListener('drop', e => {
                e.preventDefault();
                const id = e.dataTransfer.getData('id');
                const item = document.getElementById(id);
                if (item) {
                    cat.appendChild(item);
                    item.setAttribute('data-categoria', titulo);
                    cat.classList.add('tem-conteudo');
                }
            });

            // Tornar clicável se tiver conteúdo
            cat.addEventListener('click', () => {
                if (cat.classList.contains('tem-conteudo')) {
                    abrirCategoria(cat);
                }
            });

            // Montagem final
            cat.appendChild(tituloEl);
            cat.appendChild(conteudo);
            area.appendChild(cat);
        }



        function criarPostIt(titulo = 'Novo Post-it', corFundo = '#fff35c', corTexto = '#000000') {
            const area = document.getElementById('area-blocos');
            const postIt = document.createElement('div');
            postIt.className = 'postit';
            postIt.contentEditable = 'true';
            postIt.textContent = titulo;
            postIt.draggable = true;
            postIt.id = 'postit-' + Date.now();


            //  aparência do post-it
            postIt.style.width = '150px';
            postIt.style.height = '150px';
            postIt.style.padding = '10px';
            postIt.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
            postIt.style.display = 'inline-block';
            postIt.style.margin = '10px';
            postIt.style.overflow = 'hidden';
            postIt.style.color = corTexto;

            //  rotação aleatória leve
            const rotacao = (Math.random() * 6 - 3).toFixed(1); // -3° a +3°
            postIt.style.transform = `rotate(${rotacao}deg)`;
            postIt.style.transition = 'transform 0.2s ease';

            //  permitir arrastar
            postIt.addEventListener('dragstart', e => {
                e.dataTransfer.setData('id', postIt.id);
            });


            // limite de caractter
            const limiteCaracteres = 80;
            postIt.addEventListener('input', () => {
                if (postIt.textContent.length > limiteCaracteres) {
                    postIt.textContent = postIt.textContent.slice(0, limiteCaracteres);
                    // move o cursor para o fim após truncar
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(postIt);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });



            area.appendChild(postIt);
        }




        function abrirModal(tipo) {
            tipoAtual = tipo;
            document.getElementById('tituloInput').value = '';
            document.getElementById('corInput').value = tipo === 'categoria' ? '#ff0000' : '#ffff00';
            document.getElementById('modalPersonalizarLabel').textContent =
                tipo === 'categoria' ? 'Criar Categoria' : 'Criar Post-it';

            const modal = new bootstrap.Modal(document.getElementById('modalPersonalizar'));
            modal.show();

            // Armazena o modal em variável global para fechar depois
            window.modalAtivo = modal;
        }


        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('btnCriarItem').addEventListener('click', () => {
                const titulo = document.getElementById('tituloInput').value ||
                    (tipoAtual === 'categoria' ? 'Nova Categoria' : 'Novo Post-it');
                const corFundo = document.getElementById('corInput').value;
                const corTexto = document.getElementById('corTextoInput').value;

                if (tipoAtual === 'categoria') criarCategoria(titulo, corFundo, corTexto);
                else if (tipoAtual === 'postit') criarPostIt(titulo, corFundo, corTexto);

                if (window.modalAtivo) window.modalAtivo.hide();
            });
        });

        // Atualiza a pré-visualização em tempo real
        document.getElementById('tituloInput').addEventListener('input', () => {
            document.getElementById('previewTitulo').textContent =
                document.getElementById('tituloInput').value || 'Pré-visualização do título';
        });

        document.getElementById('corInput').addEventListener('input', () => {
            document.getElementById('previewBox').style.backgroundColor =
                document.getElementById('corInput').value;
        });

        document.getElementById('corTextoInput').addEventListener('input', () => {
            document.getElementById('previewBox').style.color =
                document.getElementById('corTextoInput').value;
        });


        function salvarTudo() {
            const blocos = [];
            document.querySelectorAll('.bloco').forEach(el => {
                blocos.push({ tipo: 'bloco', conteudo: el.value });
            });
            document.querySelectorAll('.postit').forEach(el => {
                blocos.push({ tipo: 'postit', conteudo: el.textContent, corFundo: el.style.backgroundColor, corTexto: el.style.color });
            });
            document.querySelectorAll('.categoria').forEach(el => {
                blocos.push({ tipo: 'categoria', conteudo: el.textContent, corFundo: el.style.backgroundColor, corTexto: el.style.color });
            });

            if (blocos.length === 0) {
                alert('Não há nada para salvar!');
                return;
            }

            localStorage.setItem('blocos', JSON.stringify(blocos));
            alert('Tudo foi salvo localmente!');
        }

        function carregarTudo() {
            const areaBlocos = document.getElementById('area-blocos');
            const areaCat = document.getElementById('area-categoria');
            areaBlocos.innerHTML = '';
            areaCat.innerHTML = '';

            const dados = JSON.parse(localStorage.getItem('blocos')) || [];
            dados.forEach(item => {
                if (item.tipo === 'bloco') criarBloco(item.conteudo, item.cor);
                if (item.tipo === 'postit') criarPostIt(item.conteudo, item.corFundo, item.corTexto);
                if (item.tipo === 'categoria') criarCategoria(item.conteudo, item.corFundo, item.corTexto);
            });

            if (dados.length === 0) alert('Não há dados salvos!');
        }

        function DeletarTudo() {

            const dados = JSON.parse(localStorage.getItem('blocos')) || [];

            // Se não houver dados, mostra o alerta e sai da função
            if (dados.length === 0) {
                alert('Não há dados para deletar!');
                return;
            }
            // Exibe confirmação
            const confirmar = confirm("Tem certeza que deseja deletar tudo? Essa ação não pode ser desfeita.");

            if (!confirmar) return; // Se cancelar, não faz nada

            // Limpa as áreas visuais
            document.getElementById('area-blocos').innerHTML = '';
            document.getElementById('area-categoria').innerHTML = '';
            // Remove os dados salvos
            localStorage.removeItem('blocos'); // apaga só os blocos

            // Mostra uma mensagem opcional
            alert('Todos os blocos, post-its e categorias foram deletados!');

            if (dados.length === 0) alert('Não há dados para deletar !');
        }

        let modoSelecao = false;

        function ativarModoSelecao() {
            modoSelecao = !modoSelecao;
            const todosItens = document.querySelectorAll('.bloco, .postit, .categoria');

            todosItens.forEach(item => {
                if (modoSelecao) {
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', toggleSelecionado);
                } else {
                    item.style.cursor = 'default';
                    item.removeEventListener('click', toggleSelecionado);
                    item.classList.remove('selecionado');
                }
            });

            document.getElementById('btnConfirmarSelecao').style.display = modoSelecao ? 'inline-block' : 'none';

            alert(modoSelecao
                ? 'Modo de seleção ativado! Clique nos itens que deseja deletar.'
                : 'Modo de seleção desativado.');
        }

        function toggleSelecionado(event) {
            event.currentTarget.classList.toggle('selecionado');
        }

        function deletarSelecionados() {
            const selecionados = document.querySelectorAll('.selecionado');
            if (selecionados.length === 0) {
                alert('Nenhum item selecionado!');
                return;
            }

            if (!confirm('Tem certeza que deseja deletar os itens selecionados?')) return;

            // Remove os itens da tela
            selecionados.forEach(el => el.remove());

            // Atualiza localStorage, removendo os itens deletados
            const dados = JSON.parse(localStorage.getItem('blocos')) || [];
            const novosDados = dados.filter(item => {
                return ![...selecionados].some(sel => sel.textContent === item.conteudo);
            });

            localStorage.setItem('blocos', JSON.stringify(novosDados));

            document.getElementById('btnConfirmarSelecao').style.display = 'none';
            modoSelecao = false;

            alert('Itens selecionados foram deletados!');
        }

        function abrirCategoria(cat) {
            const titulo = cat.dataset.nome;
            const conteudo = Array.from(cat.querySelectorAll('.bloco, .postit'));

            if (conteudo.length === 0) {
                alert('Essa categoria está vazia!');
                return;
            }

            // Esconde áreas principais
            document.querySelector('.container').style.display = 'none';
            document.querySelector('#area-categoria').style.display = 'none';

            // Cria uma área temporária para mostrar os itens
            const areaTemp = document.createElement('div');
            areaTemp.id = 'area-temp';
            areaTemp.className = 'container mt-5 text-center';
            areaTemp.innerHTML = `
                < h3 > ${titulo}</h3 >  <button class="btn btn-secondary mb-3" onclick="voltarPrincipal()">Voltar</button><div class="d-flex flex-wrap gap-3 justify-content-center"></div>`;

            document.body.appendChild(areaTemp);

            const areaConteudo = areaTemp.querySelector('div');
            conteudo.forEach(item => areaConteudo.appendChild(item));
        }

        function voltarPrincipal() {
            const temp = document.getElementById('area-temp');
            if (!temp) return;

            // Recoloca os elementos na área principal
            const itens = temp.querySelectorAll('.bloco, .postit');
            itens.forEach(item => {
                const categoria = item.getAttribute('data-categoria');
                if (categoria) {
                    const cat = [...document.querySelectorAll('.categoria')]
                        .find(c => c.dataset.nome === categoria);
                    if (cat) cat.appendChild(item);
                } else {
                    document.getElementById('area-blocos').appendChild(item);
                }
            });

            temp.remove();

            document.querySelector('.container').style.display = '';
            document.querySelector('#area-categoria').style.display = '';
        }
