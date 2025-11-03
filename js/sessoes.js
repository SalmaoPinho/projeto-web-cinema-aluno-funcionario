// js/sessoes.js
function inicializarPaginaSessoes() {
    console.log('🎭 Inicializando página de sessões...');
    
    // Carregar selects
    carregarSelects();
    
    // Configurar data mínima
    const dataHoraInput = document.getElementById('dataHora');
    if (dataHoraInput) {
        const agora = new Date();
        agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
        dataHoraInput.min = agora.toISOString().slice(0, 16);
        console.log('📅 Data mínima configurada');
    }

    // Configurar evento do formulário
    const formSessao = document.getElementById('formSessao');
    if (formSessao) {
        formSessao.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarSessao();
        });
        console.log('✅ Event listener do formulário de sessões configurado');
    }

    // Carregar lista inicial
    carregarListaSessoes();
    
    console.log('✅ Página de sessões inicializada');
}

function carregarSelects() {
    console.log('🔄 Carregando selects...');
    
    // Carregar select de filmes
    const selectFilme = document.getElementById('filme');
    if (selectFilme) {
        selectFilme.innerHTML = '<option value="">Selecione um filme</option>';
        filmes.forEach(filme => {
            const option = document.createElement('option');
            option.value = filme.id;
            option.textContent = filme.titulo;
            selectFilme.appendChild(option);
        });
        console.log(`🎬 ${filmes.length} filmes carregados no select`);
    }
    
    // Carregar select de salas
    const selectSala = document.getElementById('sala');
    if (selectSala) {
        selectSala.innerHTML = '<option value="">Selecione uma sala</option>';
        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id;
            option.textContent = `${sala.nome} (${sala.tipo} - ${sala.capacidade} assentos)`;
            selectSala.appendChild(option);
        });
        console.log(`🏢 ${salas.length} salas carregadas no select`);
    }
}

function carregarListaSessoes() {
    const tbody = document.getElementById('listaSessoes');
    const mensagemVazio = document.getElementById('mensagemVazio');
    const totalSessoes = document.getElementById('totalSessoes');
    
    if (!tbody) {
        console.error('❌ Elemento listaSessoes não encontrado');
        return;
    }
    
    console.log('📋 Carregando sessões:', sessoes.length);
    
    tbody.innerHTML = '';
    
    if (sessoes.length === 0) {
        if (mensagemVazio) mensagemVazio.style.display = 'block';
        if (totalSessoes) totalSessoes.textContent = '0 sessões';
        return;
    }
    
    if (mensagemVazio) mensagemVazio.style.display = 'none';
    if (totalSessoes) totalSessoes.textContent = `${sessoes.length} ${sessoes.length === 1 ? 'sessão' : 'sessões'}`;
    
    // Ordenar por data
    sessoes.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
    
    sessoes.forEach((sessao, index) => {
        const filme = filmes.find(f => f.id === sessao.filmeId);
        const sala = salas.find(s => s.id === sessao.salaId);

        if (!filme || !sala) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${filme.titulo}</strong>
                <br><small class="text-muted">${filme.classificacao} anos</small>
            </td>
            <td>${sala.nome}</td>
            <td>${formatarDataHora(sessao.dataHora)}</td>
            <td>R$ ${sessao.preco.toFixed(2)}</td>
            <td>
                <span class="badge ${sessao.idioma === 'dublado' ? 'bg-info' : 'bg-warning text-dark'}">
                    ${sessao.idioma}
                </span>
            </td>
            <td>
                <span class="badge ${sessao.formato === '2D' ? 'bg-secondary' : 'bg-success'}">
                    ${sessao.formato}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirSessao('${sessao.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('✅ Lista de sessões carregada');
}

function salvarSessao() {
    try {
        console.log('💾 Tentando salvar sessão...');
        
        const filmeId = document.getElementById('filme').value;
        const salaId = document.getElementById('sala').value;
        const dataHora = document.getElementById('dataHora').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const idioma = document.getElementById('idioma').value;
        const formato = document.getElementById('formato').value;
        
        console.log('📝 Dados do formulário:', { filmeId, salaId, dataHora, preco, idioma, formato });
        
        // Validação básica
        if (!filmeId || !salaId || !dataHora || !preco || !idioma || !formato) {
            alert('❌ Por favor, preencha todos os campos!');
            return;
        }
        
        if (preco < 0) {
            alert('❌ Preço não pode ser negativo!');
            return;
        }
        
        // Verificar conflito de horário
        if (!validarConflitoHorario(null, filmeId, salaId, dataHora)) {
            alert('❌ Conflito de horário! Já existe uma sessão programada nesta sala neste horário.');
            return;
        }
        
        // Criar nova sessão
        const novaSessao = new Sessao(
            gerarId('sessao'),
            filmeId,
            salaId,
            dataHora,
            preco,
            idioma,
            formato
        );
        
        // Calcular assentos disponíveis
        const sala = salas.find(s => s.id === salaId);
        novaSessao.assentosDisponiveis = sala ? sala.capacidade : 0;
        
        console.log('🎭 Nova sessão criada:', novaSessao);
        
        // Adicionar ao array e salvar
        sessoes.push(novaSessao);
        salvarDados();
        carregarListaSessoes();
        limparFormularioSessao();
        
        alert('✅ Sessão cadastrada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao salvar sessão:', error);
        alert('❌ Erro ao salvar sessão: ' + error.message);
    }
}

function validarConflitoHorario(sessaoId, filmeId, salaId, novaDataHora) {
    const filme = filmes.find(f => f.id === filmeId);
    if (!filme) return true;
    
    const novaSessaoInicio = new Date(novaDataHora);
    const novaSessaoFim = new Date(novaSessaoInicio.getTime() + filme.duracao * 60000);
    
    return !sessoes.some(sessao => {
        if (sessao.id === sessaoId || sessao.salaId !== salaId) return false;
        
        const sessaoFilme = filmes.find(f => f.id === sessao.filmeId);
        if (!sessaoFilme) return false;
        
        const sessaoInicio = new Date(sessao.dataHora);
        const sessaoFim = new Date(sessaoInicio.getTime() + sessaoFilme.duracao * 60000);
        
        return novaSessaoInicio < sessaoFim && novaSessaoFim > sessaoInicio;
    });
}

function excluirSessao(id) {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
        sessoes = sessoes.filter(sessao => sessao.id !== id);
        salvarDados();
        carregarListaSessoes();
        alert('✅ Sessão excluída com sucesso!');
    }
}

function limparFormularioSessao() {
    const form = document.getElementById('formSessao');
    if (form) form.reset();
    
    // Reconfigurar data mínima
    const dataHoraInput = document.getElementById('dataHora');
    if (dataHoraInput) {
        const agora = new Date();
        agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
        dataHoraInput.min = agora.toISOString().slice(0, 16);
    }
    
    console.log('🧹 Formulário de sessão limpo');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarPaginaSessoes);