// js/salas.js - Versão corrigida
function inicializarPaginaSalas() {
    console.log('🏢 Inicializando página de salas...');
    
    // Configurar evento do formulário
    const formSala = document.getElementById('formSala');
    if (formSala) {
        formSala.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarSala();
        });
        console.log('✅ Event listener do formulário de salas configurado');
    }

    // Carregar lista inicial
    carregarListaSalas();
    
    console.log('✅ Página de salas inicializada');
}

function carregarListaSalas() {
    const tbody = document.getElementById('listaSalas');
    const mensagemVazio = document.getElementById('mensagemVazio');
    const totalSalas = document.getElementById('totalSalas');
    
    if (!tbody) {
        console.error('❌ Elemento listaSalas não encontrado');
        return;
    }
    
    console.log('📋 Carregando salas:', salas.length);
    
    tbody.innerHTML = '';
    
    if (salas.length === 0) {
        if (mensagemVazio) mensagemVazio.style.display = 'block';
        if (totalSalas) totalSalas.textContent = '0 salas';
        return;
    }
    
    if (mensagemVazio) mensagemVazio.style.display = 'none';
    if (totalSalas) totalSalas.textContent = `${salas.length} ${salas.length === 1 ? 'sala' : 'salas'}`;
    
    salas.forEach((sala, index) => {
        // Garantir que recursos seja um array
        const recursos = Array.isArray(sala.recursos) ? sala.recursos : [];
        const recursosTexto = recursos.length > 0 ? recursos.join(', ') : 'Nenhum recurso';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${sala.nome}</strong>
            </td>
            <td>
                <span class="badge ${obterBadgeTipo(sala.tipo)}">${sala.tipo}</span>
            </td>
            <td>${sala.capacidade} assentos</td>
            <td>
                <small>${recursosTexto}</small>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirSala('${sala.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('✅ Lista de salas carregada');
}

function salvarSala() {
    try {
        console.log('💾 Tentando salvar sala...');
        
        const nome = document.getElementById('nomeSala').value.trim();
        const capacidade = parseInt(document.getElementById('capacidade').value);
        const tipo = document.getElementById('tipo').value;
        
        // Coletar recursos selecionados - garantir que seja sempre um array
        const recursos = [];
        if (document.getElementById('recursoSom')?.checked) recursos.push('Dolby Sound');
        if (document.getElementById('recursoAr')?.checked) recursos.push('Ar Condicionado');
        if (document.getElementById('recursoAcessibilidade')?.checked) recursos.push('Acessível');
        if (document.getElementById('recursoLancheria')?.checked) recursos.push('Lancheria Próxima');
        
        console.log('📝 Dados do formulário:', { nome, capacidade, tipo, recursos });
        
        // Validação básica
        if (!nome || !capacidade || !tipo) {
            alert('❌ Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        if (capacidade < 1 || capacidade > 500) {
            alert('❌ Capacidade deve ser entre 1 e 500 assentos!');
            return;
        }
        
        // Verificar se já existe sala com mesmo nome
        const salaExistente = salas.find(sala => sala.nome.toLowerCase() === nome.toLowerCase());
        if (salaExistente) {
            alert('❌ Já existe uma sala com este nome!');
            return;
        }
        
        // Criar nova sala - garantir que recursos seja sempre um array
        const novaSala = new Sala(
            gerarId('sala'),
            nome,
            capacidade,
            tipo,
            recursos // Já é um array garantido acima
        );
        
        console.log('🏢 Nova sala criada:', novaSala);
        
        // Adicionar ao array e salvar
        salas.push(novaSala);
        salvarDados();
        carregarListaSalas();
        limparFormularioSala();
        
        alert('✅ Sala cadastrada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao salvar sala:', error);
        alert('❌ Erro ao salvar sala: ' + error.message);
    }
}

function excluirSala(id) {
    // Encontrar a sala e sessões vinculadas
    const sala = window.salas.find(s => s.id === id);
    const nomeSala = sala ? sala.nome : 'Esta sala';
    const sessoesComSala = window.sessoes.filter(sessao => sessao.salaId === id);
    
    if (sessoesComSala.length > 0) {
        const confirmarExclusao = confirm(
            `${nomeSala} possui ${sessoesComSala.length} sessão(ões) vinculada(s).\n\n` +
            'Deseja excluir a sala E TODAS as sessões relacionadas?'
        );
        
        if (confirmarExclusao) {
            // Excluir a sala e todas as sessões vinculadas
            window.salas = window.salas.filter(sala => sala.id !== id);
            window.sessoes = window.sessoes.filter(sessao => sessao.salaId !== id);
            
            salvarDados();
            carregarListaSalas();
            alert(`✅ Sala e ${sessoesComSala.length} sessão(ões) excluídas com sucesso!`);
        }
    } else {
        // Não há sessões vinculadas, apenas excluir a sala
        if (confirm('Tem certeza que deseja excluir esta sala?')) {
            window.salas = window.salas.filter(sala => sala.id !== id);
            
            salvarDados();
            carregarListaSalas();
            alert('✅ Sala excluída com sucesso!');
        }
    }
}

function limparFormularioSala() {
    const form = document.getElementById('formSala');
    if (form) form.reset();
    console.log('🧹 Formulário de sala limpo');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarPaginaSalas);