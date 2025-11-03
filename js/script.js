// Classe Aluno
class Aluno {
    constructor(id, nome, idade, nota, curso) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.nota = nota;
        this.curso = curso;
    }
    
    toString() {
        return `${this.nome} - Idade: ${this.idade} - Curso: ${this.curso} - Nota: ${this.nota}`;
    }
    
    isAprovado() {
        return this.nota >= 7;
    }
    
    getStatus() {
        if (this.nota >= 7) return '<span class="status-aprovado">✅ Aprovado</span>';
        if (this.nota >= 5) return '<span class="status-recuperacao">⚠️ Recuperação</span>';
        return '<span class="status-reprovado">❌ Reprovado</span>';
    }
}

// Array para armazenar os alunos
let alunos = [];
let alunoEditando = null;
let filtrosAtivos = {
    nome: null,
    idade: null,
    nota: null,
    curso: null
};

// Configurações de ícones
const ICONES = {
    nome: 'bi-person-fill',
    idade: 'bi-calendar3',
    nota: 'bi-graph-up',
    curso: 'bi-book-half',
    criar: 'bi-plus-circle-fill',
    editar: 'bi-pencil-fill',
    excluir: 'bi-trash-fill',
    salvar: 'bi-check-circle-fill',
    cancelar: 'bi-x-circle-fill'
};

const TEXTOS_BASE = {
    nome: 'Nome',
    idade: 'Idade', 
    nota: 'Nota',
    curso: 'Curso'
};

// Funções para salvar e carregar do localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('alunos', JSON.stringify(alunos));
}

function carregarDoLocalStorage() {
    const dados = localStorage.getItem('alunos');
    if (dados) {
        const alunosData = JSON.parse(dados);
        alunos = alunosData.map(alunoData => 
            new Aluno(alunoData.id, alunoData.nome, alunoData.idade, alunoData.nota, alunoData.curso)
        );
    }
}

// Funções de Modal
function abrirModalCriar() {
    configurarModal('criar', 'Criar Novo Aluno');
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
}

function abrirModalEditar() {
    const radioSelecionado = document.querySelector('input[name="alunoRadio"]:checked');
    
    if (!radioSelecionado) {
        alert('Selecione um aluno para editar!');
        return;
    }

    const alunoId = radioSelecionado.value;
    alunoEditando = alunos.find(aluno => aluno.id === alunoId);
    
    if (!alunoEditando) {
        alert('Aluno não encontrado!');
        return;
    }
    
    configurarModal('editar', 'Editar Aluno');
    preencherCamposModal(alunoEditando);
    
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
}

function configurarModal(modo, titulo) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modoEdicao').value = modo;
    if (modo === 'criar') limparCampos();
}

function preencherCamposModal(aluno) {
    document.getElementById('alunoId').value = aluno.id;
    document.getElementById('nomeInput').value = aluno.nome;
    document.getElementById('idadeInput').value = aluno.idade;
    document.getElementById('notaInput').value = aluno.nota;
    document.getElementById('cursoSelect').value = aluno.curso;
}

// Funções de CRUD
function salvarAluno() {
    const modo = document.getElementById('modoEdicao').value;
    const nome = document.getElementById('nomeInput').value.trim();
    const idade = parseInt(document.getElementById('idadeInput').value);
    const nota = parseFloat(document.getElementById('notaInput').value);
    const curso = document.getElementById('cursoSelect').value;
    
    if (!validarCampos(nome, idade, nota, curso)) return;
    
    modo === 'criar' ? criarAluno(nome, idade, nota, curso) : editarAluno(nome, idade, nota, curso);
}

function criarAluno(nome, idade, nota, curso) {
    const novoAluno = new Aluno('aluno-' + Date.now(), nome, idade, nota, curso);
    alunos.push(novoAluno);
    finalizarOperacao('Aluno criado com sucesso!');
}

function editarAluno(nome, idade, nota, curso) {
    if (!alunoEditando) return;
    
    Object.assign(alunoEditando, { nome, idade, nota, curso });
    finalizarOperacao('Aluno editado com sucesso!');
    alunoEditando = null;
}

function finalizarOperacao(mensagem) {
    salvarNoLocalStorage();
    atualizarListaAlunos();
    limparCampos();
    fecharModal();
    alert(mensagem);
}

function excluirSelecionado() {
    const radioSelecionado = document.querySelector('input[name="alunoRadio"]:checked');
    
    if (!radioSelecionado) {
        alert('Selecione um aluno para excluir!');
        return;
    }

    const alunoId = radioSelecionado.value;
    
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        alunos = alunos.filter(aluno => aluno.id !== alunoId);
        salvarNoLocalStorage();
        atualizarListaAlunos();
        alert('Aluno excluído com sucesso!');
    }
}

// Validação
function validarCampos(nome, idade, nota, curso) {
    if (!nome || !idade || !nota || !curso) {
        alert('Preencha todos os campos!');
        return false;
    }
    
    if (idade <= 0 || idade > 120) {
        alert('Idade deve ser entre 1 e 120 anos!');
        return false;
    }
    
    if (nota < 0 || nota > 10) {
        alert('Nota deve ser entre 0 e 10!');
        return false;
    }
    
    if (nome.length < 3 || nome.length > 100) {
        alert('Nome deve ter entre 3 e 100 caracteres!');
        return false;
    }

    return true;   
}

// Funções de Filtro e Pesquisa
function aplicarFiltros() {
    let alunosFiltrados = [...alunos];

    // Filtro de nome (ordenação)
    if (filtrosAtivos.nome === 'az') {
        alunosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (filtrosAtivos.nome === 'za') {
        alunosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    // Filtro de idade
    if (filtrosAtivos.idade === 'menor18') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.idade < 18);
    } else if (filtrosAtivos.idade === '18a30') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.idade >= 18 && aluno.idade <= 30);
    } else if (filtrosAtivos.idade === 'maior30') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.idade > 30);
    }

    // Filtro de nota
    if (filtrosAtivos.nota === 'aprovados') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.nota >= 7);
    } else if (filtrosAtivos.nota === 'recuperacao') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.nota >= 5 && aluno.nota < 7);
    } else if (filtrosAtivos.nota === 'reprovados') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.nota < 5);
    }

    // Filtro de curso
    if (filtrosAtivos.curso) {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.curso === filtrosAtivos.curso);
    }

    // Aplicar pesquisa se houver termo de busca
    const termoPesquisa = document.getElementById('campoPesquisa').value.toLowerCase().trim();
    if (termoPesquisa) {
        alunosFiltrados = alunosFiltrados.filter(aluno => 
            aluno.nome.toLowerCase().includes(termoPesquisa) ||
            aluno.idade.toString().includes(termoPesquisa) ||
            obterTextoCurso(aluno.curso).toLowerCase().includes(termoPesquisa) ||
            aluno.nota.toString().includes(termoPesquisa)
        );
    }

    atualizarTabelaComDados(alunosFiltrados);
}

// Função de pesquisa em tempo real
function filtrarPesquisa() {
    aplicarFiltros();
}

// Função para limpar a pesquisa
function limparPesquisa() {
    document.getElementById('campoPesquisa').value = '';
    aplicarFiltros();
}

function filtrarPorNome(tipo) {
    filtrosAtivos.nome = tipo;
    aplicarFiltros();
    atualizarTextoDropdown('nome', tipo === 'az' ? 'A-Z' : 'Z-A');
}

function filtrarPorIdade(tipo) {
    filtrosAtivos.idade = tipo;
    aplicarFiltros();
    const textos = { menor18: '<18', '18a30': '18-30', maior30: '>30' };
    atualizarTextoDropdown('idade', textos[tipo]);
}

function filtrarPorNota(tipo) {
    filtrosAtivos.nota = tipo;
    aplicarFiltros();
    const textos = { aprovados: 'Aprov', recuperacao: 'Recup', reprovados: 'Reprov' };
    atualizarTextoDropdown('nota', textos[tipo]);
}

function filtrarPorCurso(curso) {
    filtrosAtivos.curso = curso;
    aplicarFiltros();
    atualizarTextoDropdown('curso', obterTextoCurso(curso));
}

function limparFiltro(tipo) {
    filtrosAtivos[tipo] = null;
    aplicarFiltros();
    atualizarTextoDropdown(tipo, TEXTOS_BASE[tipo]);
}

function atualizarTextoDropdown(tipo, textoFiltro) {
    const dropdown = document.getElementById(tipo + 'Filter');
    const botao = dropdown.querySelector('.dropdown-toggle');
    const iconClass = ICONES[tipo];
    
    if (textoFiltro === TEXTOS_BASE[tipo]) {
        botao.innerHTML = `<i class="bi ${iconClass} bi-icon-blue"></i>${TEXTOS_BASE[tipo]}`;
    } else {
        botao.innerHTML = `<i class="bi ${iconClass} bi-icon-blue"></i>${TEXTOS_BASE[tipo]} (${textoFiltro})`;
    }
}

// Funções de UI
function atualizarListaAlunos() {
    aplicarFiltros();
    calcularEstatisticas();
    atualizarCartoesEstatisticas();
}

function atualizarTabelaComDados(dados) {
    const tbody = document.getElementById('tabelaAlunos');
    tbody.innerHTML = '';
    
    dados.forEach((aluno, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">
                <input class="form-check-input me-1" type="radio" name="alunoRadio" value="${aluno.id}" id="${aluno.id}">
                ${index + 1}
            </th>
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.nota} ${aluno.getStatus()}</td>
            <td>${obterTextoCurso(aluno.curso)}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function calcularEstatisticas() {
    if (alunos.length === 0) {
        ['idadeMedia', 'notaMedia', 'totalAlunos', 'idadeMin', 'idadeMax', 'notaMin', 'notaMax', 'aprovados', 'recuperacao'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0';
        });
        return;
    }
    
    const idades = alunos.map(aluno => aluno.idade);
    const notas = alunos.map(aluno => aluno.nota);
    
    const idadeMedia = idades.reduce((a, b) => a + b) / idades.length;
    const notaMedia = notas.reduce((a, b) => a + b) / notas.length;
    const idadeMin = Math.min(...idades);
    const idadeMax = Math.max(...idades);
    const notaMin = Math.min(...notas);
    const notaMax = Math.max(...notas);
    const aprovados = alunos.filter(aluno => aluno.nota >= 7).length;
    const recuperacao = alunos.filter(aluno => aluno.nota >= 5 && aluno.nota < 7).length;
    
    // Atualizar rodapé da tabela
    document.getElementById('idadeMedia').textContent = idadeMedia.toFixed(1);
    document.getElementById('notaMedia').textContent = notaMedia.toFixed(1);
    document.getElementById('totalAlunos').textContent = alunos.length;
    document.getElementById('idadeMin').textContent = idadeMin;
    document.getElementById('idadeMax').textContent = idadeMax;
    document.getElementById('notaMin').textContent = notaMin.toFixed(1);
    document.getElementById('notaMax').textContent = notaMax.toFixed(1);
    document.getElementById('aprovados').textContent = aprovados;
    document.getElementById('recuperacao').textContent = recuperacao;
}

function atualizarCartoesEstatisticas() {
    // Verificar se os elementos existem antes de acessá-los
    const elementos = {
        totalAlunosCard: document.getElementById('totalAlunosCard'),
        idadeMediaCard: document.getElementById('idadeMediaCard'),
        notaMediaCard: document.getElementById('notaMediaCard'),
        taxaAprovacaoCard: document.getElementById('taxaAprovacaoCard')
    };
    
    // Se algum elemento não existir, sair da função
    if (Object.values(elementos).some(element => !element)) {
        console.warn('Elementos de estatísticas não encontrados no DOM');
        return;
    }
    
    if (alunos.length === 0) {
        elementos.totalAlunosCard.textContent = '0';
        elementos.idadeMediaCard.textContent = '0';
        elementos.notaMediaCard.textContent = '0';
        elementos.taxaAprovacaoCard.textContent = '0%';
        return;
    }
    
    const idadeMedia = alunos.reduce((soma, aluno) => soma + aluno.idade, 0) / alunos.length;
    const notaMedia = alunos.reduce((soma, aluno) => soma + aluno.nota, 0) / alunos.length;
    const taxaAprovacao = (alunos.filter(aluno => aluno.nota >= 7).length / alunos.length * 100);
    
    elementos.totalAlunosCard.textContent = alunos.length;
    elementos.idadeMediaCard.textContent = idadeMedia.toFixed(1);
    elementos.notaMediaCard.textContent = notaMedia.toFixed(1);
    elementos.taxaAprovacaoCard.textContent = taxaAprovacao.toFixed(1) + '%';
}
// Funções auxiliares
function obterTextoCurso(valor) {
    const cursos = { 
        'js': '<i class="bi bi-code-slash bi-icon-cyan"></i> JavaScript',
        'py': '<i class="bi bi-code-square bi-icon-blue"></i> Python', 
        'java': '<i class="bi bi-cup-hot-fill bi-icon-cyan"></i> Java'
    };
    return cursos[valor] || valor;
}

function limparCampos() {
    ['nomeInput', 'idadeInput', 'notaInput'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('cursoSelect').selectedIndex = 0;
    document.getElementById('alunoId').value = '';
    document.getElementById('modoEdicao').value = 'criar';
}

function fecharModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
    modal && modal.hide();
}

// Inicialização
function carregarDadosIniciais() {
    carregarDoLocalStorage();
    
    if (alunos.length === 0) {
        alunos = [
            new Aluno('aluno-1', 'João Silva', 25, 8.5, 'js'),
            new Aluno('aluno-2', 'Maria Santos', 22, 9.0, 'py'),
            new Aluno('aluno-3', 'Pedro Oliveira', 30, 4.5, 'java'),
            new Aluno('aluno-4', 'Ana Costa', 19, 6.8, 'js'),
            new Aluno('aluno-5', 'Carlos Lima', 17, 7.2, 'py')
        ];
        salvarNoLocalStorage();
    }
    
    atualizarListaAlunos();
}

document.addEventListener('DOMContentLoaded', carregarDadosIniciais);