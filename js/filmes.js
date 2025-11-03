// js/filmes.js
function inicializarPaginaFilmes() {
    console.log('🎞️ Inicializando página de filmes...');
    
    // Configurar data mínima
    const hoje = new Date().toISOString().split('T')[0];
    const dataEstreiaInput = document.getElementById('dataEstreia');
    if (dataEstreiaInput) {
        dataEstreiaInput.min = hoje;
    }

    // Configurar evento do formulário
    const formFilme = document.getElementById('formFilme');
    if (formFilme) {
        formFilme.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarFilme();
        });
        console.log('✅ Event listener do formulário configurado');
    }

    // Carregar lista inicial
    carregarListaFilmes();
    
    console.log('✅ Página de filmes inicializada');
}

function carregarListaFilmes() {
    const tbody = document.getElementById('listaFilmes');
    const mensagemVazio = document.getElementById('mensagemVazio');
    const totalFilmes = document.getElementById('totalFilmes');
    
    if (!tbody) {
        console.error('❌ Elemento listaFilmes não encontrado');
        return;
    }
    
    console.log('📋 Carregando filmes:', filmes.length);
    
    tbody.innerHTML = '';
    
    if (filmes.length === 0) {
        if (mensagemVazio) mensagemVazio.style.display = 'block';
        if (totalFilmes) totalFilmes.textContent = '0 filmes';
        return;
    }
    
    if (mensagemVazio) mensagemVazio.style.display = 'none';
    if (totalFilmes) totalFilmes.textContent = `${filmes.length} ${filmes.length === 1 ? 'filme' : 'filmes'}`;
    
    filmes.forEach((filme, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${filme.imagem ? 
                    `<img src="${filme.imagem}" alt="${filme.titulo}" class="img-thumbnail" style="width: 60px; height: 90px; object-fit: cover;">` : 
                    `<div class="bg-light d-flex align-items-center justify-content-center" style="width: 60px; height: 90px;">
                        <i class="bi bi-image text-muted"></i>
                    </div>`
                }
            </td>
            <td>
                <strong>${filme.titulo}</strong>
                <br><small class="text-muted">${filme.descricao.substring(0, 50)}...</small>
            </td>
            <td>${obterTextoGenero(filme.genero)}</td>
            <td><span class="badge bg-secondary">${filme.classificacao}</span></td>
            <td>${filme.duracao} min</td>
            <td>${formatarData(filme.dataEstreia)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirFilme('${filme.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('✅ Lista de filmes carregada');
}

async function salvarFilme() {
    try {
        console.log('💾 Tentando salvar filme...');
        
        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const genero = document.getElementById('genero').value;
        const classificacao = document.getElementById('classificacao').value;
        const duracao = parseInt(document.getElementById('duracao').value);
        const dataEstreia = document.getElementById('dataEstreia').value;
        const imagemInput = document.getElementById('imagemFilme');
        const imagemFile = imagemInput.files[0];
        
        console.log('📝 Dados do formulário:', { titulo, descricao, genero, classificacao, duracao, dataEstreia });
        
        // Validação básica
        if (!titulo || !descricao || !genero || !classificacao || !duracao || !dataEstreia) {
            alert('❌ Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        let imagemBase64 = null;
        if (imagemFile) {
            console.log('🖼️ Convertendo imagem para Base64...');
            imagemBase64 = await imageToBase64(imagemFile);
        }
        
        // Criar novo filme
        const novoFilme = new Filme(
            gerarId('filme'),
            titulo,
            descricao,
            genero,
            classificacao,
            duracao,
            dataEstreia,
            imagemBase64
        );
        
        console.log('🎬 Novo filme criado:', novoFilme);
        
        // Adicionar ao array e salvar
        filmes.push(novoFilme);
        salvarDados();
        carregarListaFilmes();
        limparFormularioFilme();
        
        alert('✅ Filme cadastrado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao salvar filme:', error);
        alert('❌ Erro ao salvar filme: ' + error.message);
    }
}

function excluirFilme(id) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        // Encontrar o nome do filme para a mensagem
        const filme = window.filmes.find(f => f.id === id);
        const nomeFilme = filme ? filme.titulo : 'Este filme';
        
        // Verificar se o filme está sendo usado em alguma sessão
        const sessoesComFilme = window.sessoes.filter(sessao => sessao.filmeId === id);
        
        if (sessoesComFilme.length > 0) {
            const confirmarExclusao = confirm(
                `${nomeFilme} possui ${sessoesComFilme.length} sessão(ões) vinculada(s).\n\n` +
                'Deseja excluir o filme E TODAS as sessões relacionadas?'
            );
            
            if (confirmarExclusao) {
                // Excluir o filme e todas as sessões vinculadas
                window.filmes = window.filmes.filter(filme => filme.id !== id);
                window.sessoes = window.sessoes.filter(sessao => sessao.filmeId !== id);
                
                salvarDados();
                carregarListaFilmes();
                alert(`✅ Filme e ${sessoesComFilme.length} sessão(ões) excluídas com sucesso!`);
            }
        } else {
            // Não há sessões vinculadas, apenas excluir o filme
            window.filmes = window.filmes.filter(filme => filme.id !== id);
            
            salvarDados();
            carregarListaFilmes();
            alert('✅ Filme excluído com sucesso!');
        }
    }
}

function limparFormularioFilme() {
    const form = document.getElementById('formFilme');
    if (form) form.reset();
    
    // Limpar preview de imagem
    const previewContainer = document.getElementById('imagePreviewContainer');
    const placeholder = document.getElementById('imagePlaceholder');
    if (previewContainer && placeholder) {
        previewContainer.style.display = 'none';
        placeholder.style.display = 'block';
    }
    
    console.log('🧹 Formulário limpo');
}
function previewImage(input) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('imagePlaceholder');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
            placeholder.style.display = 'none';
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        previewContainer.style.display = 'none';
        placeholder.style.display = 'block';
    }
}
// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarPaginaFilmes);