function hashPin(pin) {
            const encoder = new TextEncoder();
            const data = encoder.encode(pin);
            return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
                return Array.from(new Uint8Array(hashBuffer))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
            });
        }

        // Salvar o PIN
        async function salvarPin() {
            const novoPin = document.getElementById('novoPin').value;
            if (novoPin.length < 4) return alert('O PIN precisa ter ao menos 4 dígitos.');

            const hash = await hashPin(novoPin);
            localStorage.setItem('pinHash', hash);
            alert('PIN criado com sucesso!');

            // Troca de abas
            document.getElementById('criarPin').classList.add('d-none');
            document.getElementById('loginPin').classList.remove('d-none');
        }

        // Verificar o PIN
        async function verificarPin() {
            const pinHashSalvo = localStorage.getItem('pinHash');
            const pinDigitado = document.getElementById('pinLogin').value;
            const hashDigitado = await hashPin(pinDigitado);

            if (hashDigitado === pinHashSalvo) {
                window.location.href = "index.html";
            } else {
                alert('PIN incorreto!');
            }
        }


        function resetarPin() {
            if (confirm('Tem certeza que deseja redefinir o PIN?')) {
                localStorage.removeItem('pinHash');
                alert('PIN removido. Crie um novo PIN.');


                document.getElementById('loginPin').classList.add('d-none');
                document.getElementById('criarPin').classList.remove('d-none');
            }
        }


        if (localStorage.getItem('pinHash')) {
            document.getElementById('criarPin').classList.add('d-none');
            document.getElementById('loginPin').classList.remove('d-none');
        }