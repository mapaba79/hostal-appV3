document.addEventListener('DOMContentLoaded', () => {
    const listaHospedes = document.getElementById('lista-hospedes');
    const adicionarHospedeBtn = document.getElementById('adicionar-hospede-btn');
    const modalAdicionarHospede = document.getElementById('modal-adicionar-hospede');
    const fecharModalHospede = modalAdicionarHospede.querySelector('.fechar-modal');
    const formAdicionarHospede = document.getElementById('form-adicionar-hospede');

    const listaQuartos = document.getElementById('lista-quartos');
    const quartos = [
        { id: 1, nome: 'Quarto Privado 1', tipo: 'privado' },
        { id: 2, nome: 'Quarto Privado 2', tipo: 'privado' },
        { id: 3, nome: 'Quarto Privado 3', tipo: 'privado' },
        { id: 4, nome: 'Quarto Privado 4', tipo: 'privado' },
        { id: 5, nome: 'Quarto Privado 5', tipo: 'privado' },
        { id: 6, nome: 'Quarto Privado 6', tipo: 'privado' },
        { id: 7, nome: 'Quarto Compartilhado', tipo: 'compartilhado', camas: ['1s', 
            '1m', '1i', '2s', '2m', '2i', '3s', '3m', '3i', '4s', '4m', '4i', '5s', 
            '5m', '5i', '6s', '6m', '6i'] },
        { id: 8, nome: 'Quarto dos Voluntários', tipo: 'voluntarios', camas: ['1s', 
            '1m', '1i', '2s', '2m', '2i', '3s', '3m', '3i'] }
    ];

    const listaReservas = document.getElementById('lista-reservas');
    const adicionarReservaBtn = document.getElementById('adicionar-reserva-btn');
    const modalAdicionarReserva = document.getElementById('modal-adicionar-reserva');
    const fecharModalReserva = modalAdicionarReserva.querySelector('.fechar-modal');
    const formAdicionarReserva = document.getElementById('form-adicionar-reserva');
    const hospedeReservaSelect = document.getElementById('hospede-reserva');
    const quartoReservaSelect = document.getElementById('quarto-reserva');
    const camasContainer = document.getElementById('camas-container');
    const camaReservaSelect = document.getElementById('cama-reserva');

    let hospedes = carregarHospedes();
    renderizarHospedes();
    renderizarOpcoesHospedes();
    let reservas = carregarReservas();
    renderizarReservas();
    renderizarQuartos();

    // --- Funcionalidades para Hóspedes ---
    adicionarHospedeBtn.addEventListener('click', () => {
        modalAdicionarHospede.style.display = 'block';
    });

    fecharModalHospede.addEventListener('click', () => {
        modalAdicionarHospede.style.display = 'none';
    });

    formAdicionarHospede.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = document.getElementById('nome-hospede').value;
        const email = document.getElementById('email-hospede').value;
        const telefone = document.getElementById('telefone-hospede').value;
        const nacionalidade = document.getElementById('nacionalidade-hospede').value;
        const documento = document.getElementById('documento-hospede').value;
        const novoHospede = { id: Date.now(), nome, email, telefone, 
            nacionalidade, documento };
        hospedes.push(novoHospede);
        salvarHospedes();
        renderizarHospedes();
        renderizarOpcoesHospedes();
        formAdicionarHospede.reset();
        modalAdicionarHospede.style.display = 'none';
    });

    function renderizarHospedes() {
        listaHospedes.innerHTML = '';
        hospedes.forEach(hospede => {
            const li = document.createElement('li');
            let detalhes = `${hospede.nome}`;
            if (hospede.email) detalhes += ` (${hospede.email})`;
            if (hospede.telefone) detalhes += ` - Tel: ${hospede.telefone}`;
            if (hospede.nacionalidade) detalhes += ` - Nac: ${hospede.nacionalidade}`;
            if (hospede.documento) detalhes += ` - Doc: ${hospede.documento}`;
            li.textContent = detalhes;
            listaHospedes.appendChild(li);
        });
    }

    function salvarHospedes() {
        localStorage.setItem('hospedes', JSON.stringify(hospedes));
    }

    function carregarHospedes() {
        const hospedesSalvos = localStorage.getItem('hospedes');
        return hospedesSalvos ? JSON.parse(hospedesSalvos) : [];
    }

    function renderizarOpcoesHospedes() {
        hospedeReservaSelect.innerHTML = 
            '<option value="" disabled selected>Selecione um hóspede</option>';
        hospedes.forEach(hospede => {
            const option = document.createElement('option');
            option.value = hospede.id;
            option.textContent = hospede.nome;
            hospedeReservaSelect.appendChild(option);
        });
    }

    // --- Funcionalidades para Quartos ---
    function renderizarQuartos() {
        listaQuartos.innerHTML = '';
        quartos.forEach(quarto => {
            const li = document.createElement('li');
            li.textContent = quarto.nome;

            if (quarto.tipo === 'privado' && isQuartoOcupado(quarto.nome)) {
                li.innerHTML = `<span class="ocupado">${quarto.nome} (Ocupado)</span>`;
            } else if (quarto.camas) {
                const camasOcupadas = reservas.filter(reserva => reserva.quarto === 
                    quarto.nome).map(reserva => reserva.quartoCama ? 
                    reserva.quartoCama.split('-')[1] : null).filter(cama => cama);
                const camasLivres = quarto.camas.filter(cama => 
                    !camasOcupadas.includes(cama));

                const spanCamas = document.createElement('span');
                spanCamas.style.display = 'block';
                spanCamas.style.marginLeft = '10px';
                spanCamas.style.fontSize = '0.9em';

                if (camasLivres.length > 0) {
                    const spanLivres = document.createElement('span');
                    spanLivres.className = 'livre';
                    spanLivres.textContent = `Livres: ${camasLivres.join(', ')}`;
                    spanCamas.appendChild(spanLivres);
                }

                if (camasOcupadas.length > 0) {
                    const spanOcupadas = document.createElement('span');
                    spanOcupadas.className = 'ocupado';
                    spanOcupadas.textContent = `Ocupadas: ${camasOcupadas.join(', ')}`;
                    if (camasLivres.length > 0) {
                        const separator = document.createElement('span');
                        separator.textContent = ' | ';
                        spanCamas.appendChild(separator);
                    }
                    spanCamas.appendChild(spanOcupadas);
                }
                li.appendChild(spanCamas);
            }
            listaQuartos.appendChild(li);
        });
    }

    function isQuartoOcupado(nomeQuarto) {
        return reservas.some(reserva => reserva.quarto === 
            nomeQuarto && !reserva.quartoCama);
    }

    // --- Funcionalidades para Reservas ---
    adicionarReservaBtn.addEventListener('click', () => {
        modalAdicionarReserva.style.display = 'block';
    });

    fecharModalReserva.addEventListener('click', () => {
        modalAdicionarReserva.style.display = 'none';
    });

    quartoReservaSelect.addEventListener('change', () => {
        const quartoId = parseInt(quartoReservaSelect.value);
        const quartoSelecionado = quartos.find(q => q.id === quartoId);

        if (quartoSelecionado && (quartoSelecionado.tipo === 'compartilhado' || 
            quartoSelecionado.tipo === 'voluntarios')) {
            camasContainer.style.display = 'block';
            camaReservaSelect.innerHTML = 
                '<option value="" disabled selected>Selecione uma cama</option>';
            const camasOcupadasNoQuarto = reservas.filter(reserva => 
                reserva.quarto === quartoSelecionado.nome).map(reserva => 
                reserva.quartoCama ? reserva.quartoCama.split('-')[1] : 
                    null).filter(cama => cama);

            quartoSelecionado.camas.forEach(cama => {
                const option = document.createElement('option');
                option.value = `${quartoSelecionado.nome}-${cama}`;
                option.textContent = cama;
                option.disabled = camasOcupadasNoQuarto.includes(cama);
                camaReservaSelect.appendChild(option);
            });
        } else {
            camasContainer.style.display = 'none';
            camaReservaSelect.innerHTML = '';
        }
    });

    formAdicionarReserva.addEventListener('submit', (event) => {
        event.preventDefault();
        const hospedeId = parseInt(hospedeReservaSelect.value);
        const quartoId = parseInt(quartoReservaSelect.value);
        const valorPago = document.getElementById('valor-pago').value ? 
            parseFloat(document.getElementById('valor-pago').value) : 0;
        const dataCheckin = document.getElementById('data-checkin').value;
        const dataCheckout = document.getElementById('data-checkout').value;
        const camaSelecionada = camasContainer.style.display === 'block' ? 
            camaReservaSelect.value : null;

        const hospede = hospedes.find(h => h.id === hospedeId);
        const quarto = quartos.find(q => q.id === quartoId);

        if (hospede && quarto) {
            const novaReserva = {
                id: Date.now(),
                hospede: hospede.nome,
                quarto: quarto.nome,
                quartoCama: camaSelecionada,
                checkin: dataCheckin,
                checkout: dataCheckout,
                valorPago: valorPago
            };
            reservas.push(novaReserva);
            salvarReservas();
            renderizarReservas();
            renderizarQuartos();
            formAdicionarReserva.reset();
            camasContainer.style.display = 'none';
            modalAdicionarReserva.style.display = 'none';
        } else {
            alert('Erro ao adicionar reserva. Hóspede ou quarto não encontrados.');
        }
    });

    function renderizarReservas() {
        listaReservas.innerHTML = '';
        reservas.forEach((reserva, index) => {
            const li = document.createElement('li');
            let detalhesReserva = `${reserva.hospede} | ${reserva.quarto}`;
            if (reserva.quartoCama) {
                detalhesReserva += ` (Cama: ${reserva.quartoCama.split('-')[1]})`;
            }
            detalhesReserva += ` - (${reserva.checkin} - ${reserva.checkout})`;
            // Adiciona o valor paga
            detalhesReserva += ` | Pago: PYG ${reserva.valorPago.toFixed(2)}`;

            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.classList.add('excluir-reserva-btn');
            botaoExcluir.dataset.reservaId = index;
            botaoExcluir.addEventListener('click', excluirReserva);

            li.textContent = detalhesReserva;
            li.appendChild(botaoExcluir);
            listaReservas.appendChild(li);
        });
    }

    function excluirReserva(event) {
        const reservaId = parseInt(event.target.dataset.reservaId);
        if (confirm('Tem certeza que deseja excluir esta reserva?')) {
            reservas.splice(reservaId, 1);
            salvarReservas();
            renderizarReservas();
            renderizarQuartos();
            if (modalAdicionarReserva.style.display === 'block' && 
                quartoReservaSelect.value) {
                quartoReservaSelect.dispatchEvent(new Event('change'));
            }
        }
    }

    function salvarReservas() {
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }

    function carregarReservas() {
        const reservasSalvas = localStorage.getItem('reservas');
        return reservasSalvas ? JSON.parse(reservasSalvas) : [];
    }

    function salvarHospedes() {
        localStorage.setItem('hospedes', JSON.stringify(hospedes));
    }

    function carregarHospedes() {
        const hospedesSalvos = localStorage.getItem('hospedes');
        return hospedesSalvos ? JSON.parse(hospedesSalvos) : [];
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target == modalAdicionarHospede) {
            modalAdicionarHospede.style.display = 'none';
        }
        if (event.target == modalAdicionarReserva) {
            modalAdicionarReserva.style.display = 'none';
        }
    });

    const usuarios = [
        { usuario: 'adm', senha: 'adm', tipo: 'admin' },
        { usuario: 'user', senha: 'user', tipo: 'comum' }
    ];

    // Referências
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const erroLogin = document.getElementById('login-erro');
    const body = document.body;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        const user = usuarios.find(u => u.usuario === 
            usuario && u.senha === senha);
        if (user) {
            localStorage.setItem('usuarioLogado', JSON.stringify(user));
            aplicarPermissoes(user.tipo);
            loginContainer.style.display = 'none';
        } else {
            erroLogin.style.display = 'block';
        }
    });

    function aplicarPermissoes(tipo) {
        if (tipo === 'admin') {
            document.body.classList.add('admin');
        } else {
            document.body.classList.remove('admin');
            document.body.classList.add('comum');

            // Esconde botões de adição
            document.getElementById('adicionar-hospede-btn').style.display = 'none';
            document.getElementById('adicionar-reserva-btn').style.display = 'none';

            // Desabilita botões de exclusão se houver
            document.querySelectorAll('.excluir-reserva-btn').
                forEach(btn => btn.style.display = 'none');
        }
    }

    // Carregar login salvo (se houver)
    window.addEventListener('DOMContentLoaded', () => {
        const usuarioSalvo = localStorage.getItem('usuarioLogado');
        if (usuarioSalvo) {
            const user = JSON.parse(usuarioSalvo);
            aplicarPermissoes(user.tipo);
            loginContainer.style.display = 'none';
        }
    });
});
