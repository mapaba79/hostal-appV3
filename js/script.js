document.addEventListener('DOMContentLoaded', () => {
    const listaHospedes = document.getElementById('lista-hospedes');
    const adicionarHospedeBtn = document.getElementById('adicionar-hospede-btn');
    const modalAdicionarHospede = document.getElementById('modal-adicionar-hospede');
    const fecharModalHospede = modalAdicionarHospede.querySelector('.fechar-modal');
    const formAdicionarHospede = document.getElementById('form-adicionar-hospede');

    const listaQuartos = document.getElementById('lista-quartos');
    // Dados fixos para quartos (poderiam vir de alguma forma de armazenamento local)
    const quartos = [
        { id: 1, nome: 'Quarto Privado 1' },
        { id: 2, nome: 'Quarto Privado 2' },
        { id: 3, nome: 'Quarto Privado 3' },
        { id: 4, nome: 'Quarto Privado 4' },
        { id: 5, nome: 'Quarto Privado 5' },
        { id: 6, nome: 'Quarto Privado 6' },
        { id: 7, nome: 'Quarto Compartilhado', tipo: 'compartilhado', camas: ['1s', '1m', '1i', '2s', '2m', '2i', '3s', '3m', '3i', '4s', '4m', '4i', '5s', '5m', '5i', '6s', '6m', '6i'] },
        { id: 8, nome: 'Quarto dos Voluntários', tipo: 'voluntarios', camas: ['1s', '1m', '1i', '2s', '2m', '2i', '3s', '3m', '3i'] }
    ];
    renderizarQuartos();

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
        const novoHospede = { id: Date.now(), nome, email };
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
            li.textContent = `${hospede.nome} (${hospede.email || 'Sem email'})`;
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
        hospedeReservaSelect.innerHTML = '<option value="" disabled selected>Selecione um hóspede</option>';
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
            listaQuartos.appendChild(li);
        });
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

        if (quartoSelecionado && (quartoSelecionado.tipo === 'compartilhado' || quartoSelecionado.tipo === 'voluntarios')) {
            camasContainer.style.display = 'block';
            camaReservaSelect.innerHTML = '<option value="" disabled selected>Selecione uma cama</option>';
            quartoSelecionado.camas.forEach(cama => {
                const option = document.createElement('option');
                option.value = `${quartoSelecionado.nome}-${cama}`;
                option.textContent = cama;
                // Desabilitar camas já reservadas
                const camaReservada = reservas.some(reserva => reserva.quartoCama === `${quartoSelecionado.nome}-${cama}`);
                option.disabled = camaReservada;
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
        const dataCheckin = document.getElementById('data-checkin').value;
        const dataCheckout = document.getElementById('data-checkout').value;
        const camaSelecionada = camasContainer.style.display === 'block' ? camaReservaSelect.value : null;

        const hospede = hospedes.find(h => h.id === hospedeId);
        const quarto = quartos.find(q => q.id === quartoId);

        if (hospede && quarto) {
            const novaReserva = {
                id: Date.now(),
                hospede: hospede.nome,
                quarto: quarto.nome,
                quartoCama: camaSelecionada,
                checkin: dataCheckin,
                checkout: dataCheckout
            };
            reservas.push(novaReserva);
            salvarReservas();
            renderizarReservas();
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
            let detalhesReserva = `${reserva.hospede} - ${reserva.quarto}`;
            if (reserva.quartoCama) {
                detalhesReserva += ` (Cama: ${reserva.quartoCama.split('-')[1]})`;
            }
            detalhesReserva += ` (${reserva.checkin} até ${reserva.checkout})`;

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
            // Atualizar as opções de camas no modal de reserva se estiver aberto
            if (modalAdicionarReserva.style.display === 'block' && quartoReservaSelect.value) {
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

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target == modalAdicionarHospede) {
            modalAdicionarHospede.style.display = 'none';
        }
        if (event.target == modalAdicionarReserva) {
            modalAdicionarReserva.style.display = 'none';
        }
    });
});
