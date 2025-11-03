// Classe Funcionario
class Funcionario {
    constructor(id, nome, idade, cargo, salario) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.cargo = cargo;
        this.salario = salario;
    }
    
    getFaixaSalarial() {
        if (this.salario <= 3000) return '<span class="status-aprovado">🟢 Básico</span>';
        if (this.salario <= 7000) return '<span class="status-recuperacao">🟡 Intermediário</span>';
        return '<span class="status-reprovado">🔴 Alto</span>';
    }
}

// Array para armazenar os funcionários
let funcionarios = [];
let funcionarioEditando = null;
let funcionarioParaExcluir = null;

// Filtros ativos
let filtrosAtivos = {
    nome: null,
    idade: null,
    cargo: null,
    salario: null
};

// Configurações
const CONFIG = {
    icones: {
        nome: 'bi-person-fill',
        idade: 'bi-calendar3',
        cargo: 'bi-briefcase',
        salario: 'bi-currency-dollar'
    },
    textos: {
        nome: 'Nome',
        idade: 'Idade', 
        cargo: 'Cargo',
        salario: 'Salário'
    },
    cargos: {
        'dev': 'Desenvolvedor',
        'design': 'Designer',
        'gerente': 'Gerente',
        'analista': 'Analista'
    }
};

// ==================== FUNÇÕES DE ARMAZENAMENTO ====================
function salvarNoLocalStorage() {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

function carregarDoLocalStorage() {
    const dados = localStorage.getItem('funcionarios');
    if (dados) {
        const funcionariosData = JSON.parse(dados);
        funcionarios = funcionariosData.map(funcData => 
            new Funcionario(funcData.id, funcData.nome, funcData.idade, funcData.cargo, funcData.salario)
        );
    }
}

// ==================== FUNÇÕES DE MODAL ====================
function abrirModalCriar() {
    document.getElementById('modalTitulo').textContent = 'Criar Funcionário';
    document.getElementById('modalTexto').textContent = 'Preencha os dados para criar um novo funcionário';
    document.getElementById('modalIcon').className = 'bi bi-plus-circle-fill bi-icon-white';
    document.getElementById('modoEdicao').value = 'criar';
    limparCampos();
    
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
}

function abrirModalEditar() {
    const radioSelecionado = document.querySelector('input[name="funcionarioRadio"]:checked');
    
    if (!radioSelecionado) {
        alert('Selecione um funcionário para editar!');
        return;
    }

    const funcionarioId = radioSelecionado.value;
    funcionarioEditando = funcionarios.find(func => func.id === funcionarioId);
    
    if (!funcionarioEditando) {
        alert('Funcionário não encontrado!');
        return;
    }
    
    document.getElementById('modalTitulo').textContent = 'Editar Funcionário';
    document.getElementById('modalTexto').textContent = 'Editar dados do funcionário';
    document.getElementById('modalIcon').className = 'bi bi-pencil-square bi-icon-white';
    document.getElementById('modoEdicao').value = 'editar';
    document.getElementById('funcionarioId').value = funcionarioEditando.id;
    document.getElementById('nomeInput').value = funcionarioEditando.nome;
    document.getElementById('idadeInput').value = funcionarioEditando.idade;
    document.getElementById('cargoSelect').value = funcionarioEditando.cargo;
    document.getElementById('salarioInput').value = funcionarioEditando.salario;
    
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
}

// ==================== FUNÇÕES DE CRUD ====================
function salvarFuncionario() {
    const modo = document.getElementById('modoEdicao').value;
    const nome = document.getElementById('nomeInput').value.trim();
    const idade = parseInt(document.getElementById('idadeInput').value);
    const cargo = document.getElementById('cargoSelect').value;
    const salario = parseFloat(document.getElementById('salarioInput').value);
    
    if (!validarCampos(nome, idade, cargo, salario)) {
        return;
    }
    
    if (modo === 'criar') {
        criarFuncionario(nome, idade, cargo, salario);
    } else {
        editarFuncionario(nome, idade, cargo, salario);
    }
}

function criarFuncionario(nome, idade, cargo, salario) {
    const novoFuncionario = new Funcionario(
        'func-' + Date.now(), 
        nome, 
        idade, 
        cargo, 
        salario
    );
    
    funcionarios.push(novoFuncionario);
    salvarNoLocalStorage();
    atualizarListaFuncionarios();
    fecharModal();
    alert('Funcionário criado com sucesso!');
}

function editarFuncionario(nome, idade, cargo, salario) {
    if (!funcionarioEditando) {
        alert('Nenhum funcionário selecionado para edição!');
        return;
    }
    
    funcionarioEditando.nome = nome;
    funcionarioEditando.idade = idade;
    funcionarioEditando.cargo = cargo;
    funcionarioEditando.salario = salario;
    
    salvarNoLocalStorage();
    atualizarListaFuncionarios();
    fecharModal();
    funcionarioEditando = null;
    alert('Funcionário editado com sucesso!');
}

function excluirSelecionado() {
    const radioSelecionado = document.querySelector('input[name="funcionarioRadio"]:checked');
    
    if (!radioSelecionado) {
        alert('Selecione um funcionário para excluir!');
        return;
    }

    const funcionarioId = radioSelecionado.value;
    funcionarioParaExcluir = funcionarios.find(func => func.id === funcionarioId);
    
    if (!funcionarioParaExcluir) {
        alert('Funcionário não encontrado!');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusao'));
    modal.show();
}

function confirmarExclusao() {
    if (!funcionarioParaExcluir) {
        alert('Nenhum funcionário selecionado para exclusão!');
        return;
    }
    
    funcionarios = funcionarios.filter(func => func.id !== funcionarioParaExcluir.id);
    salvarNoLocalStorage();
    atualizarListaFuncionarios();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarExclusao'));
    modal.hide();
    
    funcionarioParaExcluir = null;
    alert('Funcionário excluído com sucesso!');
}

// ==================== VALIDAÇÃO ====================
function validarCampos(nome, idade, cargo, salario) {
    if (!nome || nome.trim() === '') {
        alert('O nome é obrigatório!');
        return false;
    }
    
    if (!idade || isNaN(idade) || idade < 18 || idade > 70) {
        alert('Idade deve ser entre 18 e 70 anos!');
        return false;
    }
    
    if (!cargo) {
        alert('O cargo é obrigatório!');
        return false;
    }
    
    if (!salario || isNaN(salario) || salario < 0) {
        alert('Salário deve ser um número positivo!');
        return false;
    }
    
    if (nome.length < 3 || nome.length > 100) {
        alert('Nome deve ter entre 3 e 100 caracteres!');
        return false;
    }

    return true;   
}

// ==================== FILTROS E PESQUISA ====================
function aplicarFiltros() {
    let funcionariosFiltrados = [...funcionarios];

    // Filtro de nome
    if (filtrosAtivos.nome === 'az') {
        funcionariosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (filtrosAtivos.nome === 'za') {
        funcionariosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    // Filtro de idade
    const filtrosIdade = {
        'menor25': func => func.idade < 25,
        '25a40': func => func.idade >= 25 && func.idade <= 40,
        'maior40': func => func.idade > 40
    };
    if (filtrosIdade[filtrosAtivos.idade]) {
        funcionariosFiltrados = funcionariosFiltrados.filter(filtrosIdade[filtrosAtivos.idade]);
    }

    // Filtro de cargo
    if (filtrosAtivos.cargo) {
        funcionariosFiltrados = funcionariosFiltrados.filter(func => func.cargo === filtrosAtivos.cargo);
    }

    // Filtro de salário
    const filtrosSalario = {
        'baixo': func => func.salario <= 3000,
        'medio': func => func.salario > 3000 && func.salario <= 7000,
        'alto': func => func.salario > 7000
    };
    if (filtrosSalario[filtrosAtivos.salario]) {
        funcionariosFiltrados = funcionariosFiltrados.filter(filtrosSalario[filtrosAtivos.salario]);
    }

    // Pesquisa
    const termoPesquisa = document.getElementById('campoPesquisa').value.toLowerCase().trim();
    if (termoPesquisa) {
        funcionariosFiltrados = funcionariosFiltrados.filter(func => 
            func.nome.toLowerCase().includes(termoPesquisa) ||
            obterTextoCargo(func.cargo).toLowerCase().includes(termoPesquisa) ||
            func.idade.toString().includes(termoPesquisa) ||
            func.salario.toString().includes(termoPesquisa)
        );
    }

    atualizarTabelaComDados(funcionariosFiltrados);
}

function filtrarPesquisa() {
    aplicarFiltros();
}

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
    const textos = { 'menor25': '<25', '25a40': '25-40', 'maior40': '>40' };
    atualizarTextoDropdown('idade', textos[tipo]);
}

function filtrarPorCargo(cargo) {
    filtrosAtivos.cargo = cargo;
    aplicarFiltros();
    atualizarTextoDropdown('cargo', obterTextoCargo(cargo));
}

function filtrarPorSalario(tipo) {
    filtrosAtivos.salario = tipo;
    aplicarFiltros();
    const textos = { 'baixo': '≤3k', 'medio': '3-7k', 'alto': '>7k' };
    atualizarTextoDropdown('salario', textos[tipo]);
}

function limparFiltro(tipo) {
    filtrosAtivos[tipo] = null;
    aplicarFiltros();
    atualizarTextoDropdown(tipo, CONFIG.textos[tipo]);
}

function atualizarTextoDropdown(tipo, textoFiltro) {
    const dropdown = document.getElementById(tipo + 'Filter');
    const botao = dropdown.querySelector('.dropdown-toggle');
    const iconClass = CONFIG.icones[tipo];
    
    if (textoFiltro === CONFIG.textos[tipo]) {
        botao.innerHTML = `<i class="bi ${iconClass} bi-icon-blue"></i>${CONFIG.textos[tipo]}`;
    } else {
        botao.innerHTML = `<i class="bi ${iconClass} bi-icon-blue"></i>${CONFIG.textos[tipo]} (${textoFiltro})`;
    }
}

// ==================== FUNÇÕES DE UI ====================
function atualizarListaFuncionarios() {
    aplicarFiltros();
    calcularEstatisticas();
}

function atualizarTabelaComDados(dados) {
    const tbody = document.getElementById('tabelaFuncionarios');
    tbody.innerHTML = '';
    
    dados.forEach((funcionario, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">
                <input class="form-check-input me-1" type="radio" name="funcionarioRadio" value="${funcionario.id}" id="${funcionario.id}">
                ${index + 1}
            </th>
            <td>${funcionario.nome}</td>
            <td>${funcionario.idade}</td>
            <td>${obterTextoCargo(funcionario.cargo)}</td>
            <td>R$ ${funcionario.salario.toFixed(2)} ${funcionario.getFaixaSalarial()}</td>
        `;
        tbody.appendChild(row);
    });
}

function calcularEstatisticas() {
    if (funcionarios.length === 0) {
        ['idadeMedia', 'idadeMin', 'idadeMax', 'totalFuncionarios', 'totalCargos', 'salarioMedia', 'salarioMin', 'salarioMax'].forEach(id => {
            document.getElementById(id).textContent = '0';
        });
        return;
    }
    
    const idades = funcionarios.map(func => func.idade);
    const salarios = funcionarios.map(func => func.salario);
    
    document.getElementById('idadeMedia').textContent = (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1);
    document.getElementById('idadeMin').textContent = Math.min(...idades);
    document.getElementById('idadeMax').textContent = Math.max(...idades);
    document.getElementById('salarioMedia').textContent = (salarios.reduce((a, b) => a + b, 0) / salarios.length).toFixed(2);
    document.getElementById('salarioMin').textContent = Math.min(...salarios).toFixed(2);
    document.getElementById('salarioMax').textContent = Math.max(...salarios).toFixed(2);
    document.getElementById('totalFuncionarios').textContent = funcionarios.length;
    document.getElementById('totalCargos').textContent = new Set(funcionarios.map(func => func.cargo)).size;
}

// ==================== FUNÇÕES AUXILIARES ====================
function obterTextoCargo(valor) {
    return CONFIG.cargos[valor] || valor;
}

function limparCampos() {
    document.getElementById('nomeInput').value = '';
    document.getElementById('idadeInput').value = '';
    document.getElementById('cargoSelect').value = '';
    document.getElementById('salarioInput').value = '';
    document.getElementById('funcionarioId').value = '';
    document.getElementById('modoEdicao').value = 'criar';
}

function fecharModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
    modal?.hide();
}

// ==================== INICIALIZAÇÃO ====================
function carregarDadosIniciais() {
    carregarDoLocalStorage();
    
    if (funcionarios.length === 0) {
        funcionarios = [
            new Funcionario('func-1', 'João Silva', 28, 'dev', 5500),
            new Funcionario('func-2', 'Maria Santos', 32, 'design', 4200),
            new Funcionario('func-3', 'Pedro Oliveira', 45, 'gerente', 8500),
            new Funcionario('func-4', 'Ana Costa', 24, 'analista', 3800),
            new Funcionario('func-5', 'Carlos Lima', 29, 'dev', 6200)
        ];
        salvarNoLocalStorage();
    }
    
    atualizarListaFuncionarios();
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosIniciais();
    document.getElementById('formModal').addEventListener('hidden.bs.modal', limparCampos);
});