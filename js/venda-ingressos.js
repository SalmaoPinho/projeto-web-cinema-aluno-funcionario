// js/venda-ingressos.js
function inicializarPaginaVendaIngressos() {
    console.log('🎫 Inicializando página de venda de ingressos...');
    
    // Carregar select de sessões
    carregarSelectSessoes();
    
    // Configurar máscara de CPF
    const cpfInput = document.getElementById('cpfCliente');
    if (cpfInput) {
        cpfInput.addEventListener('input', formatarCPF);
    }
    
    // Configurar evento do formulário
    const formVenda = document.getElementById('formVenda');
    if (formVenda) {
        formVenda.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarVenda();
        });
        console.log('✅ Event listener do formulário de venda configurado');
    }
    
    // Verificar se há sessão pré-selecionada
    verificarSessaoPreSelecionada();
    
    console.log('✅ Página de venda de ingressos inicializada');
}

// js/venda-ingressos.js - Versão com debug completo
function carregarSelectSessoes() {
    console.log('🔄 Carregando select de sessões...');
    
    const selectSessao = document.getElementById('sessao');
    if (!selectSessao) {
        console.error('❌ Elemento sessao não encontrado');
        return;
    }
    
    console.log('✅ Elemento select encontrado:', selectSessao);
    
    // Limpar select
    selectSessao.innerHTML = '<option value="">Selecione uma sessão</option>';
    console.log('🧹 Select limpo');
    
    console.log('📊 Total de sessões no sistema:', sessoes.length);
    console.log('📊 Sessões:', sessoes);
    
    // Filtrar sessões disponíveis
    const sessoesDisponiveis = sessoes.filter(sessao => {
        return sessao.assentosDisponiveis > 0;
    });
    
    console.log('🎯 Sessões disponíveis:', sessoesDisponiveis.length, sessoesDisponiveis);
    
    if (sessoesDisponiveis.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhuma sessão disponível';
        option.disabled = true;
        selectSessao.appendChild(option);
        console.log('ℹ️ Nenhuma sessão disponível - option adicionada');
        return;
    }
    
    // Adicionar cada sessão ao select
    sessoesDisponiveis.forEach((sessao, index) => {
        const filme = filmes.find(f => f.id === sessao.filmeId);
        const sala = salas.find(s => s.id === sessao.salaId);
        
        console.log(`📝 Processando sessão ${index + 1}:`, { sessao, filme, sala });
        
        if (!filme || !sala) {
            console.warn('⚠️ Sessão sem filme ou sala:', sessao);
            return;
        }
        
        const option = document.createElement('option');
        option.value = sessao.id;
        option.textContent = `${filme.titulo} - ${formatarDataHora(sessao.dataHora)} - ${sala.nome} (${sessao.assentosDisponiveis} assentos)`;
        option.dataset.preco = sessao.preco;
        option.dataset.filme = filme.titulo;
        option.dataset.sala = sala.nome;
        option.dataset.dataHora = sessao.dataHora;
        
        console.log('➕ Adicionando option:', option);
        selectSessao.appendChild(option);
    });
    
    console.log('✅ Select após adicionar options:', selectSessao.innerHTML);
    console.log(`✅ ${sessoesDisponiveis.length} sessões carregadas no select`);
    
    // Verificar se o select está visível e habilitado
    console.log('🔍 Estado do select:', {
        display: selectSessao.style.display,
        visibility: selectSessao.style.visibility,
        disabled: selectSessao.disabled,
        parentDisplay: selectSessao.parentElement?.style.display
    });
    
    selectSessao.addEventListener('change', atualizarInformacoesSessao);
}
function verificarSessaoPreSelecionada() {
    const sessaoSelecionada = localStorage.getItem('sessaoSelecionada');
    if (sessaoSelecionada) {
        const selectSessao = document.getElementById('sessao');
        if (selectSessao) {
            selectSessao.value = sessaoSelecionada;
            atualizarInformacoesSessao();
            localStorage.removeItem('sessaoSelecionada'); // Limpar após usar
            console.log('✅ Sessão pré-selecionada carregada:', sessaoSelecionada);
        }
    }
}

function atualizarInformacoesSessao() {
    const selectSessao = document.getElementById('sessao');
    const infoSessao = document.getElementById('infoSessao');
    const precoIngresso = document.getElementById('precoIngresso');
    
    if (!selectSessao || !infoSessao || !precoIngresso) return;
    
    const sessaoSelecionada = selectSessao.options[selectSessao.selectedIndex];
    
    if (sessaoSelecionada.value) {
        const preco = parseFloat(sessaoSelecionada.dataset.preco);
        const filme = sessaoSelecionada.dataset.filme;
        const sala = sessaoSelecionada.dataset.sala;
        const dataHora = sessaoSelecionada.dataset.dataHora;
        
        infoSessao.innerHTML = `
            <div class="alert alert-info">
                <h6 class="alert-heading">📋 Informações da Sessão</h6>
                <p class="mb-1"><strong>Filme:</strong> ${filme}</p>
                <p class="mb-1"><strong>Sala:</strong> ${sala}</p>
                <p class="mb-1"><strong>Data/Hora:</strong> ${formatarDataHora(dataHora)}</p>
                <p class="mb-0"><strong>Idioma/Formato:</strong> ${obterSessaoPorId(selectSessao.value)?.idioma || 'N/A'} / ${obterSessaoPorId(selectSessao.value)?.formato || 'N/A'}</p>
            </div>
        `;
        infoSessao.style.display = 'block';
        
        precoIngresso.textContent = `R$ ${preco.toFixed(2)}`;
        precoIngresso.parentElement.style.display = 'block';
    } else {
        infoSessao.style.display = 'none';
        precoIngresso.parentElement.style.display = 'none';
    }
}

function obterSessaoPorId(id) {
    return sessoes.find(sessao => sessao.id === id);
}

function formatarCPF(e) {
    let cpf = e.target.value.replace(/\D/g, '');
    
    if (cpf.length > 11) {
        cpf = cpf.substring(0, 11);
    }
    
    // Aplicar máscara: 000.000.000-00
    if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = cpf;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verificação simples de CPF (pode ser implementada uma validação mais robusta)
    return /^\d{11}$/.test(cpf);
}

function validarAssento(assento) {
    // Formato esperado: Letra + Número (ex: A10, B5, C12)
    return /^[A-Za-z]\d{1,2}$/.test(assento);
}

function verificarAssentoOcupado(sessaoId, assento) {
    const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');
    return ingressos.some(ingresso => 
        ingresso.sessaoId === sessaoId && ingresso.assento === assento.toUpperCase()
    );
}

async function confirmarVenda() {
    try {
        console.log('💾 Confirmando venda de ingresso...');
        
        const sessaoId = document.getElementById('sessao').value;
        const nomeCliente = document.getElementById('nomeCliente').value.trim();
        const cpfCliente = document.getElementById('cpfCliente').value;
        const assento = document.getElementById('assento').value.trim().toUpperCase();
        const tipoPagamento = document.getElementById('tipoPagamento').value;
        
        console.log('📝 Dados do formulário:', { 
            sessaoId, nomeCliente, cpfCliente, assento, tipoPagamento 
        });
        
        // Validações
        if (!sessaoId || !nomeCliente || !cpfCliente || !assento || !tipoPagamento) {
            alert('❌ Por favor, preencha todos os campos!');
            return;
        }
        
        if (!validarCPF(cpfCliente)) {
            alert('❌ CPF inválido! Digite um CPF válido com 11 dígitos.');
            return;
        }
        
        if (!validarAssento(assento)) {
            alert('❌ Formato de assento inválido! Use o formato: Letra + Número (ex: A10, B5)');
            return;
        }
        
        // Verificar se o assento já está ocupado
        if (verificarAssentoOcupado(sessaoId, assento)) {
            alert('❌ Este assento já está ocupado! Por favor, escolha outro assento.');
            return;
        }
        
        // Verificar se ainda há assentos disponíveis na sessão
        const sessao = obterSessaoPorId(sessaoId);
        if (!sessao || sessao.assentosDisponiveis <= 0) {
            alert('❌ Não há mais assentos disponíveis para esta sessão!');
            return;
        }
        
        // Criar objeto do ingresso
        const novoIngresso = {
            id: gerarId('ingresso'),
            sessaoId: sessaoId,
            nomeCliente: nomeCliente,
            cpfCliente: cpfCliente.replace(/\D/g, ''),
            assento: assento,
            tipoPagamento: tipoPagamento,
            dataVenda: new Date().toISOString(),
            preco: parseFloat(document.getElementById('sessao').options[document.getElementById('sessao').selectedIndex].dataset.preco)
        };
        
        console.log('🎫 Novo ingresso criado:', novoIngresso);
        
        // Salvar ingresso
        salvarIngresso(novoIngresso);
        
        // Atualizar assentos disponíveis na sessão
        atualizarAssentosDisponiveis(sessaoId);
        
        // Limpar formulário
        limparFormularioVenda();
        
        // Mostrar comprovante
        mostrarComprovante(novoIngresso);
        
    } catch (error) {
        console.error('❌ Erro ao confirmar venda:', error);
        alert('❌ Erro ao processar a venda: ' + error.message);
    }
}

function salvarIngresso(ingresso) {
    const ingressos = JSON.parse(localStorage.getItem('ingressos') || '[]');
    ingressos.push(ingresso);
    localStorage.setItem('ingressos', JSON.stringify(ingressos));
    console.log('✅ Ingresso salvo com sucesso');
}

function atualizarAssentosDisponiveis(sessaoId) {
    const sessaoIndex = sessoes.findIndex(s => s.id === sessaoId);
    if (sessaoIndex !== -1) {
        sessoes[sessaoIndex].assentosDisponiveis -= 1;
        salvarDados();
        console.log('✅ Assentos disponíveis atualizados');
    }
}

function mostrarComprovante(ingresso) {
    const sessao = obterSessaoPorId(ingresso.sessaoId);
    const filme = filmes.find(f => f.id === sessao.filmeId);
    const sala = salas.find(s => s.id === sessao.salaId);
    
    const comprovanteHTML = `
        <div class="card border-success">
            <div class="card-header bg-success text-white">
                <h4 class="card-title mb-0">
                    <i class="bi bi-check-circle-fill me-2"></i>Venda Confirmada!
                </h4>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h5>📋 Comprovante de Ingresso</h5>
                        <p><strong>ID do Ingresso:</strong> ${ingresso.id}</p>
                        <p><strong>Cliente:</strong> ${ingresso.nomeCliente}</p>
                        <p><strong>CPF:</strong> ${ingresso.cpfCliente.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
                        <p><strong>Assento:</strong> ${ingresso.assento}</p>
                        <p><strong>Pagamento:</strong> ${ingresso.tipoPagamento}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>🎬 Informações da Sessão</h5>
                        <p><strong>Filme:</strong> ${filme?.titulo || 'N/A'}</p>
                        <p><strong>Sala:</strong> ${sala?.nome || 'N/A'}</p>
                        <p><strong>Data/Hora:</strong> ${formatarDataHora(sessao.dataHora)}</p>
                        <p><strong>Valor:</strong> R$ ${ingresso.preco.toFixed(2)}</p>
                    </div>
                </div>
                <div class="alert alert-warning mt-3">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Importante:</strong> Apresente este comprovante na entrada do cinema.
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-success me-2" onclick="imprimirComprovante()">
                    <i class="bi bi-printer me-2"></i>Imprimir
                </button>
                <button class="btn btn-outline-secondary" onclick="fecharComprovante()">
                    <i class="bi bi-x-circle me-2"></i>Fechar
                </button>
            </div>
        </div>
    `;
    
    const comprovanteDiv = document.getElementById('comprovanteVenda');
    if (comprovanteDiv) {
        comprovanteDiv.innerHTML = comprovanteHTML;
        comprovanteDiv.style.display = 'block';
    }
}

function imprimirComprovante() {
    window.print();
}

function fecharComprovante() {
    const comprovanteDiv = document.getElementById('comprovanteVenda');
    if (comprovanteDiv) {
        comprovanteDiv.style.display = 'none';
    }
}

function limparFormularioVenda() {
    const form = document.getElementById('formVenda');
    if (form) form.reset();
    
    const infoSessao = document.getElementById('infoSessao');
    const precoIngresso = document.getElementById('precoIngresso');
    
    if (infoSessao) infoSessao.style.display = 'none';
    if (precoIngresso) precoIngresso.parentElement.style.display = 'none';
    
    console.log('🧹 Formulário de venda limpo');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarPaginaVendaIngressos);