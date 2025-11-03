    // Dados (serão carregados do localStorage)
    let sessoes = [];
    let filmes = [];
    let salas = [];

    // Carregar dados do localStorage
    function carregarDados() {
        // Carregar sessões
        const dadosSessoes = localStorage.getItem('sessoes');
        if (dadosSessoes) {
            sessoes = JSON.parse(dadosSessoes);
            console.log('Sessões carregadas:', sessoes.length);
        }

        // Carregar filmes
        const dadosFilmes = localStorage.getItem('filmes');
        if (dadosFilmes) {
            filmes = JSON.parse(dadosFilmes);
            console.log('Filmes carregados:', filmes.length);
        }

        // Carregar salas
        const dadosSalas = localStorage.getItem('salas');
        if (dadosSalas) {
            salas = JSON.parse(dadosSalas);
            console.log('Salas carregadas:', salas.length);
        }

        atualizarListaSessoes();
    }

    // Obter filme por ID
    function obterFilmePorId(id) {
        const filme = filmes.find(filme => filme.id === id);
        if (!filme) {
            console.log('Filme não encontrado para ID:', id);
        }
        return filme;
    }

    // Obter sala por ID
    function obterSalaPorId(id) {
        const sala = salas.find(sala => sala.id === id);
        if (!sala) {
            console.log('Sala não encontrada para ID:', id);
        }
        return sala;
    }

    // Obter texto do gênero
    function obterTextoGenero(valor) {
        const generos = {
            'acao': 'Ação',
            'aventura': 'Aventura',
            'comedia': 'Comédia',
            'drama': 'Drama',
            'ficcao': 'Ficção Científica',
            'terror': 'Terror',
            'romance': 'Romance',
            'suspense': 'Suspense',
            'animacao': 'Animação'
        };
        return generos[valor] || valor;
    }

// Formatar data no formato 30/10/2025, 11:27 a partir do ISO string
function formatarDataCompleta(dataHoraISO) {
    try {
        if (!dataHoraISO) return 'Data/horário não informados';
        
        const data = new Date(dataHoraISO);
        if (isNaN(data.getTime())) {
            return 'Data inválida';
        }
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        
        return `${dia}/${mes}/${ano}, ${horas}:${minutos}`;
    } catch (e) {
        return 'Erro na data';
    }
}

// Extrair apenas a data para filtros (formato YYYY-MM-DD)
function extrairData(dataHoraISO) {
    try {
        if (!dataHoraISO) return '';
        const data = new Date(dataHoraISO);
        if (isNaN(data.getTime())) return '';
        return data.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
}

// Extrair apenas o horário
function extrairHorario(dataHoraISO) {
    try {
        if (!dataHoraISO) return '';
        const data = new Date(dataHoraISO);
        if (isNaN(data.getTime())) return '';
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        return `${horas}:${minutos}`;
    } catch (e) {
        return '';
    }
}
    // Limpar filtros
    function limparFiltros() {
        document.getElementById('filtroFilme').value = '';
        document.getElementById('filtroData').value = '';
        document.getElementById('filtroGenero').value = '';
        aplicarFiltros();
    }

    // Adicionar eventos de input para filtro em tempo real
    function configurarFiltros() {
        document.getElementById('filtroFilme').addEventListener('input', aplicarFiltros);
        document.getElementById('filtroData').addEventListener('change', aplicarFiltros);
        document.getElementById('filtroGenero').addEventListener('change', aplicarFiltros);
    }

    // Aplicar filtros
    function aplicarFiltros() {
        atualizarListaSessoes();
    }

    // Comprar ingresso
    function comprarIngresso(sessaoId) {
        // Verificar se há assentos disponíveis
        const sessao = sessoes.find(s => s.id === sessaoId);
        if (!sessao) {
            alert('Sessão não encontrada!');
            return;
        }
        
        if (sessao.assentosDisponiveis <= 0) {
            alert('Não há assentos disponíveis para esta sessão!');
            return;
        }
        
        // Salvar a sessão selecionada no localStorage para a página de venda
        localStorage.setItem('sessaoSelecionada', sessaoId);
        
        // Redirecionar para a página de venda de ingressos
        window.location.href = 'venda-ingressos.html';
    }

// Atualizar lista de sessões
function atualizarListaSessoes() {
    const container = document.getElementById('listaSessoes');
    const mensagemVazio = document.getElementById('mensagemVazio');
    const totalSessoes = document.getElementById('totalSessoes');

    container.innerHTML = '';
    console.log('Total de sessões:', sessoes.length);

    // Aplicar filtros - MOSTRAR TODAS AS SESSÕES independente da data
    let sessoesFiltradas = [...sessoes];

    const filtroFilme = document.getElementById('filtroFilme').value.toLowerCase();
    const filtroData = document.getElementById('filtroData').value;
    const filtroGenero = document.getElementById('filtroGenero').value;

    if (filtroFilme) {
        sessoesFiltradas = sessoesFiltradas.filter(sessao => {
            const filme = obterFilmePorId(sessao.filmeId);
            return filme && filme.titulo && filme.titulo.toLowerCase().includes(filtroFilme);
        });
    }

    if (filtroData) {
        sessoesFiltradas = sessoesFiltradas.filter(sessao => {
            const dataSessao = extrairData(sessao.dataHora);
            return dataSessao === filtroData;
        });
    }

    if (filtroGenero) {
        sessoesFiltradas = sessoesFiltradas.filter(sessao => {
            const filme = obterFilmePorId(sessao.filmeId);
            return filme && filme.genero === filtroGenero;
        });
    }

    console.log('Sessões após filtros:', sessoesFiltradas.length);

    // Atualizar contador
    totalSessoes.textContent = `${sessoesFiltradas.length} ${sessoesFiltradas.length === 1 ? 'sessão' : 'sessões'}`;

    if (sessoesFiltradas.length === 0) {
        mensagemVazio.style.display = 'block';
        
        if (sessoes.length === 0) {
            mensagemVazio.innerHTML = `
                <i class="bi bi-calendar-x display-1 text-muted"></i>
                <h3 class="text-muted mt-3">Nenhuma sessão cadastrada</h3>
                <p class="text-muted">Não há sessões cadastradas no sistema.</p>
                <a href="cadastro-sessoes.html" class="btn btn-primary mt-3">
                    <i class="bi bi-plus-circle me-2"></i>Cadastrar Primeira Sessão
                </a>
            `;
        } else {
            mensagemVazio.innerHTML = `
                <i class="bi bi-funnel display-1 text-muted"></i>
                <h3 class="text-muted mt-3">Nenhuma sessão encontrada</h3>
                <p class="text-muted">Não há sessões que correspondam aos filtros aplicados.</p>
                <button class="btn btn-primary mt-3" onclick="limparFiltros()">
                    <i class="bi bi-arrow-clockwise me-2"></i>Limpar Filtros
                </button>
            `;
        }
        return;
    }

    mensagemVazio.style.display = 'none';

    // Ordenar por data e horário
    sessoesFiltradas.sort((a, b) => {
        try {
            const dataA = new Date(a.dataHora);
            const dataB = new Date(b.dataHora);
            return dataA - dataB;
        } catch (e) {
            return 0;
        }
    });

    // Criar cards para cada sessão
    sessoesFiltradas.forEach(sessao => {
        const filme = obterFilmePorId(sessao.filmeId);
        const sala = obterSalaPorId(sessao.salaId);

        console.log('Processando sessão:', sessao.id, 'DataHora:', sessao.dataHora, 'Filme:', filme, 'Sala:', sala);

        if (!filme || !sala) {
            console.log('Sessão ignorada - filme ou sala não encontrado:', sessao.id);
            return;
        }

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card session-card h-100">
                <div class="position-relative">
                    <div class="movie-poster-container">
                        ${filme.imagem ? 
                            `<img src="${filme.imagem}" class="movie-poster" alt="${filme.titulo}">` :
                            `<div class="movie-poster-placeholder d-flex align-items-center justify-content-center">
                                <i class="bi bi-film display-4 text-muted"></i>
                            </div>`
                        }
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge ${sessao.assentosDisponiveis > 20 ? 'bg-success' : sessao.assentosDisponiveis > 0 ? 'bg-warning' : 'bg-danger'} session-badge">
                                ${sessao.assentosDisponiveis || 0} assentos
                            </span>
                        </div>
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="badge bg-dark session-badge">${filme.classificacao || 'L'} anos</span>
                        </div>
                        <div class="position-absolute bottom-0 start-0 m-2">
                            <span class="badge bg-info session-badge">${sessao.idioma || 'Legendado'}</span>
                        </div>
                        <div class="position-absolute bottom-0 end-0 m-2">
                            <span class="badge bg-secondary session-badge">${sessao.formato || '2D'}</span>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${filme.titulo || 'Filme sem título'}</h5>
                    <p class="card-text text-muted small">${filme.descricao ? (filme.descricao.substring(0, 80) + (filme.descricao.length > 80 ? '...' : '')) : 'Sem descrição'}</p>
                    
                    <div class="row small text-muted mb-3">
                        <div class="col-6">
                            <i class="bi bi-clock me-1"></i>${filme.duracao || 'N/A'} min
                        </div>
                        <div class="col-6">
                            <i class="bi bi-tag me-1"></i>${obterTextoGenero(filme.genero) || 'Sem gênero'}
                        </div>
                    </div>

                    <div class="session-info mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span><i class="bi bi-building me-1"></i>${sala.nome || 'Sala não encontrada'}</span>
                            <span class="badge bg-primary">${sala.tipo || 'Standard'}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-calendar-event me-1"></i>${formatarDataCompleta(sessao.dataHora)}</span>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="price-tag">R$ ${sessao.preco ? sessao.preco.toFixed(2) : '0.00'}</div>
                        <button class="btn btn-primary" onclick="comprarIngresso('${sessao.id}')" ${(sessao.assentosDisponiveis || 0) <= 0 ? 'disabled' : ''}>
                            <i class="bi bi-ticket-perforated me-2"></i>${(sessao.assentosDisponiveis || 0) <= 0 ? 'Esgotado' : 'Comprar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

    // Inicializar
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Iniciando página de sessões disponíveis...');
        
        // Verificar dados no localStorage antes de carregar
        const filmesStorage = JSON.parse(localStorage.getItem('filmes') || '[]');
        const salasStorage = JSON.parse(localStorage.getItem('salas') || '[]');
        const sessoesStorage = JSON.parse(localStorage.getItem('sessoes') || '[]');
        
        console.log('Dados no localStorage:');
        console.log('- Filmes:', filmesStorage.length, filmesStorage);
        console.log('- Salas:', salasStorage.length, salasStorage);
        console.log('- Sessões:', sessoesStorage.length, sessoesStorage);
        
        carregarDados();
        configurarFiltros();
        
        // Definir data mínima como hoje para o filtro
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('filtroData').min = hoje;
    });
