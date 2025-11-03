// js/scriptcin.js - Sistema CineManager Simplificado e Funcional

// ==================== DECLARAÇÃO DE VARIÁVEIS GLOBAIS ====================
window.filmes = [];
window.salas = [];
window.sessoes = [];

// ==================== CLASSES PRINCIPAIS ====================
class Filme {
    constructor(id, titulo, descricao, genero, classificacao, duracao, dataEstreia, imagem = null) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.classificacao = classificacao;
        this.duracao = duracao;
        this.dataEstreia = dataEstreia;
        this.imagem = imagem;
    }
}

class Sala {
    constructor(id, nome, capacidade, tipo, recursos = []) {
        this.id = id;
        this.nome = nome;
        this.capacidade = capacidade;
        this.tipo = tipo;
        this.recursos = recursos;
    }
}

class Sessao {
    constructor(id, filmeId, salaId, dataHora, preco, idioma, formato) {
        this.id = id;
        this.filmeId = filmeId;
        this.salaId = salaId;
        this.dataHora = dataHora;
        this.preco = preco;
        this.idioma = idioma;
        this.formato = formato;
        this.assentosDisponiveis = 0;
    }
}

// ==================== CONFIGURAÇÕES ====================
const CONFIG = {
    generos: {
        'acao': 'Ação',
        'aventura': 'Aventura', 
        'comedia': 'Comédia',
        'drama': 'Drama',
        'ficcao': 'Ficção Científica',
        'terror': 'Terror',
        'romance': 'Romance',
        'suspense': 'Suspense',
        'animacao': 'Animação',
        'documentario': 'Documentário',
        'fantasia': 'Fantasia',
        'musical': 'Musical'
    },
    tiposSala: {
        '2D': 'bg-secondary',
        '3D': 'bg-info', 
        'IMAX': 'bg-warning text-dark',
        '4DX': 'bg-success',
        'VIP': 'bg-purple text-white'
    }
};

// ==================== FUNÇÕES BÁSICAS DO SISTEMA ====================
function carregarDados() {
    try {
        const filmesSalvos = localStorage.getItem('filmes');
        const salasSalvas = localStorage.getItem('salas');
        const sessoesSalvas = localStorage.getItem('sessoes');
        
        window.filmes = filmesSalvos ? JSON.parse(filmesSalvos) : [];
        window.salas = salasSalvas ? JSON.parse(salasSalvas) : [];
        window.sessoes = sessoesSalvas ? JSON.parse(sessoesSalvas) : [];
        
        console.log('✅ Dados carregados:', { 
            filmes: window.filmes.length, 
            salas: window.salas.length, 
            sessoes: window.sessoes.length 
        });
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        window.filmes = [];
        window.salas = [];
        window.sessoes = [];
    }
}

function salvarDados() {
    try {
        localStorage.setItem('filmes', JSON.stringify(window.filmes));
        localStorage.setItem('salas', JSON.stringify(window.salas));
        localStorage.setItem('sessoes', JSON.stringify(window.sessoes));
        console.log('💾 Dados salvos com sucesso');
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        alert('Erro ao salvar dados!');
    }
}

// js/scriptcin.js - Corrigir a criação de sessões com assentos disponíveis
function criarDadosExemplo() {
    console.log('🎬 Criando dados de exemplo...');
    
    if (window.filmes.length === 0) {
        window.filmes = [
            new Filme('filme-1', 'O Poderoso Chefão', 'Drama familiar sobre o crime organizado.', 'drama', '14', 175, '2024-01-15', 'https://www.quadrorama.com.br/wp-content/uploads/2017/07/36-3.png'),
            new Filme('filme-2', 'Matrix', 'O jovem programador Thomas Anderson é atormentado por estranhos pesadelos em que está sempre conectado por cabos a um imenso sistema de computadores do futuro.', 'ficcao', '14', 136, '2024-01-10', 'https://uauposters.com.br/media/catalog/product/3/4/347120140406-uau-posters-filmes-matrix.jpg'),
            new Filme('filme-3', 'Vingadores: Ultimato', 'Após Thanos eliminar metade das criaturas vivas, os Vingadores têm de lidar com a perda de amigos e entes queridos. Com Tony Stark vagando perdido no espaço sem água e comida, Steve Rogers e Natasha Romanov lideram a resistência contra o titã louco.', 'acao', '12', 181, '2024-01-20', 'https://img.elo7.com.br/product/zoom/266036C/big-poster-filme-vingadores-ultimato-lo47-tamanho-90x60-cm-vingadores.jpg'),
            new Filme('filme-4', 'Superman', 'Superman embarca em uma jornada para reconciliar sua herança kryptoniana com sua criação humana.', 'acao', '14', 100, '2025-07-10', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS5kpHGfBNwXEl1mnr2LkSRjRIe1oqKe5VxbbVk42niymTQVzYR'),
            new Filme('filme-5', 'Interestelar', 'Uma equipe de exploradores viaja por um buraco de minhoca no espaço.', 'ficcao', '10', 169, '2024-02-15', 'https://br.web.img3.acsta.net/pictures/14/10/31/20/39/476171.jpg'),
            new Filme('filme-6', 'O Rei Leão', 'O ciclo da vida na savana africana.', 'animacao', 'L', 118, '2024-01-25', 
                'https://images.justwatch.com/poster/115572244/s718/o-rei-leao.jpg'),
            new Filme('filme-7', 'The Batman', 'Após dois anos espreitando as ruas como Batman, Bruce Wayne se encontra nas profundezas mais sombrias de Gotham City. Com poucos aliados confiáveis, o vigilante solitário se estabelece como a personificação da vingança para a população.'
                , 'drama', '16', 122, '2022-02-10', 'https://upload.wikimedia.org/wikipedia/pt/3/38/The_Batman_poster.jpg'),
            new Filme('filme-8', 'Parasita', 'Duas famílias de classes sociais diferentes se entrelaçam.',
                 'drama', '14', 132, '2024-02-20', 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png'),
            new Filme('filme-9', 'Avatar: O Caminho da Água', 'A continuação da aventura em Pandora.',
                 'ficcao', '12', 192, '2024-03-01', 'https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg'),
            new Filme('filme-10', 'Top Gun: Maverick', 'Depois de mais de 30 anos de serviço como um dos principais aviadores da Marinha, Pete "Maverick" Mitchell está de volta, rompendo os limites como um piloto de testes corajoso. No mundo contemporâneo das guerras tecnológicas, Maverick enfrenta drones e prova que o fator humano ainda é essencial.',
                 'acao', '12', 130, '2024-02-05', 'https://translate.google.com/website?sl=en&tl=pt&hl=pt&client=srp&u=https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg')
        ];
        console.log('✅ 10 filmes de exemplo criados');
    }
    
    if (window.salas.length === 0) {
        window.salas = [
            new Sala('sala-1', 'Sala IMAX', 200, 'IMAX', ['Dolby Sound', 'Ar Condicionado', 'Tela Gigante']),
            new Sala('sala-2', 'Sala 3D', 150, '3D', ['Ar Condicionado', 'Óculos 3D Inclusos']),
            new Sala('sala-3', 'Sala Standard', 120, '2D', ['Ar Condicionado']),
            new Sala('sala-4', 'Sala 4DX', 80, '4DX', ['Efeitos Especiais', 'Movimento', 'Ar Condicionado', 'Aromas']),
            new Sala('sala-5', 'Sala VIP', 60, 'VIP', ['Poltronas Reclináveis', 'Serviço de Bebidas', 'Atendimento Personalizado']),
            new Sala('sala-6', 'Sala Premium', 100, '2D', ['Som Surround', 'Poltronas Confortáveis', 'Ar Condicionado']),
            new Sala('sala-7', 'Sala 3D Premium', 130, '3D', ['Dolby Atmos', 'Óculos 3D Reutilizáveis', 'Ar Condicionado'])
        ];
        console.log('✅ 7 salas de exemplo criadas');
    }
    
    if (window.sessoes.length === 0) {
        // Criar datas variadas
        const hoje = new Date();
        
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        
        const depoisAmanha = new Date(hoje);
        depoisAmanha.setDate(hoje.getDate() + 2);
        
        const semanaQueVem = new Date(hoje);
        semanaQueVem.setDate(hoje.getDate() + 7);
        
        const fimDeSemana = new Date(hoje);
        fimDeSemana.setDate(hoje.getDate() + 5);
        
        const duasSemanas = new Date(hoje);
        duasSemanas.setDate(hoje.getDate() + 14);
        
        window.sessoes = [
            // Sessões para amanhã
            new Sessao('sessao-1', 'filme-1', 'sala-1', new Date(amanha.setHours(14, 0, 0, 0)).toISOString(), 25.00, 'dublado', '2D'),
            new Sessao('sessao-2', 'filme-2', 'sala-2', new Date(amanha.setHours(16, 30, 0, 0)).toISOString(), 35.00, 'legendado', '3D'),
            new Sessao('sessao-3', 'filme-3', 'sala-3', new Date(amanha.setHours(19, 0, 0, 0)).toISOString(), 30.00, 'dublado', '2D'),
            new Sessao('sessao-4', 'filme-4', 'sala-4', new Date(amanha.setHours(20, 30, 0, 0)).toISOString(), 45.00, 'dublado', '4DX'),
            
            // Sessões para depois de amanhã
            new Sessao('sessao-5', 'filme-5', 'sala-5', new Date(depoisAmanha.setHours(15, 0, 0, 0)).toISOString(), 50.00, 'legendado', 'VIP'),
            new Sessao('sessao-6', 'filme-6', 'sala-6', new Date(depoisAmanha.setHours(17, 0, 0, 0)).toISOString(), 28.00, 'dublado', '2D'),
            new Sessao('sessao-7', 'filme-7', 'sala-7', new Date(depoisAmanha.setHours(21, 0, 0, 0)).toISOString(), 32.00, 'legendado', '3D'),
            
            // Sessões para fim de semana
            new Sessao('sessao-8', 'filme-8', 'sala-1', new Date(fimDeSemana.setHours(13, 0, 0, 0)).toISOString(), 26.00, 'legendado', '2D'),
            new Sessao('sessao-9', 'filme-9', 'sala-2', new Date(fimDeSemana.setHours(16, 0, 0, 0)).toISOString(), 38.00, 'dublado', '3D'),
            new Sessao('sessao-10', 'filme-10', 'sala-3', new Date(fimDeSemana.setHours(19, 30, 0, 0)).toISOString(), 29.00, 'dublado', '2D'),
            
            // Sessões para semana que vem
            new Sessao('sessao-11', 'filme-1', 'sala-4', new Date(semanaQueVem.setHours(20, 0, 0, 0)).toISOString(), 45.00, 'dublado', '4DX'),
            new Sessao('sessao-12', 'filme-2', 'sala-5', new Date(semanaQueVem.setHours(18, 0, 0, 0)).toISOString(), 55.00, 'legendado', 'VIP'),
            
            // Sessões para duas semanas
            new Sessao('sessao-13', 'filme-9', 'sala-1', new Date(duasSemanas.setHours(15, 30, 0, 0)).toISOString(), 40.00, 'dublado', 'IMAX'),
            new Sessao('sessao-14', 'filme-10', 'sala-2', new Date(duasSemanas.setHours(21, 0, 0, 0)).toISOString(), 42.00, 'legendado', '3D')
        ];
        
        console.log('✅ 14 sessões de exemplo criadas com datas variadas');
    }
    
    // GARANTIR que todas as sessões tenham assentos disponíveis
    window.sessoes = window.sessoes.map(sessao => {
        const sala = window.salas.find(s => s.id === sessao.salaId);
        return {
            ...sessao,
            assentosDisponiveis: sala ? sala.capacidade : 50
        };
    });
    
    salvarDados();
    console.log('✅ Assentos disponíveis garantidos para todas as sessões');
    console.log('📊 Resumo final:', {
        filmes: window.filmes.length,
        salas: window.salas.length,
        sessoes: window.sessoes.length
    });
}

// ==================== FUNÇÕES UTILITÁRIAS ====================
function obterTextoGenero(genero) {
    return CONFIG.generos[genero] || genero;
}

function obterBadgeTipo(tipo) {
    return CONFIG.tiposSala[tipo] || 'bg-secondary';
}

function formatarData(dataString) {
    try {
        return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
        return dataString;
    }
}

function formatarDataHora(dataHoraString) {
    try {
        return new Date(dataHoraString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dataHoraString;
    }
}

function gerarId(prefixo) {
    return `${prefixo}-${Date.now()}`;
}

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
// ==================== INICIALIZAÇÃO DO SISTEMA ====================
function inicializarSistema() {
    console.log('🚀 Inicializando sistema CineManager...');
    carregarDados();
    //criarDadosExemplo();
    console.log('✅ Sistema CineManager inicializado com sucesso!');
}

// Inicializar imediatamente
inicializarSistema();