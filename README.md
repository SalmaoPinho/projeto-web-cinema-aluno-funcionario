# 🎬 123 Filmes - Sistema de Gerenciamento de Cinema

Um sistema web completo para gerenciamento de cinema, desenvolvido com HTML, CSS, JavaScript e Bootstrap. O sistema permite o controle total de filmes, salas, sessões e vendas de ingressos.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Uso do Sistema](#uso-do-sistema)
- [Docker](#docker)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **123 Filmes** é um sistema de gerenciamento de cinema desenvolvido para facilitar a administração de salas de cinema, filmes em cartaz, programação de sessões e venda de ingressos. O sistema utiliza `localStorage` do navegador para persistência de dados, tornando-o leve e fácil de usar.

## ✨ Funcionalidades

### 📽️ Gerenciamento de Filmes
- Cadastro de filmes com informações completas:
  - Título, descrição e gênero
  - Classificação indicativa
  - Duração e data de estreia
  - Imagem do pôster
- Listagem e visualização de filmes cadastrados
- Edição e exclusão de filmes

### 🏢 Gerenciamento de Salas
- Cadastro de salas de cinema com:
  - Nome e capacidade
  - Tipo (IMAX, 3D, 4DX, VIP, etc.)
  - Recursos especiais (Dolby Sound, Ar Condicionado, etc.)
- Controle de disponibilidade de assentos
- Edição e exclusão de salas

### 📅 Gerenciamento de Sessões
- Programação de sessões vinculando:
  - Filme e sala
  - Data e horário
  - Preço do ingresso
  - Idioma (dublado/legendado)
  - Formato de exibição
- Visualização de sessões disponíveis
- Controle de assentos disponíveis por sessão

### 🎫 Venda de Ingressos
- Sistema de venda de ingressos com:
  - Seleção de sessão
  - Escolha de tipo de ingresso (inteira/meia)
  - Informações do comprador
  - Seleção de lanches (combo)
- Cálculo automático do valor total
- Controle de assentos vendidos

### 🍿 Lanches
- Catálogo de lanches disponíveis:
  - Pipoca
  - Refrigerantes
  - Combos
  - Salgadinhos
- Integração com venda de ingressos

### 📊 Dashboard
- Estatísticas em tempo real:
  - Total de filmes em cartaz
  - Salas disponíveis
  - Sessões do dia
  - Ingressos vendidos

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização
- **JavaScript (ES6+)** - Lógica da aplicação
- **Bootstrap 5.3** - Framework CSS responsivo
- **Bootstrap Icons** - Ícones
- **LocalStorage API** - Persistência de dados
- **Docker** - Containerização
- **Node.js** - Servidor HTTP (via http-server)

## 📁 Estrutura do Projeto

```
projeto-web-cinema-aluno-funcionario/
├── css/                          # Arquivos de estilo
│   └── stylescin.css            # Estilos personalizados
├── js/                          # Scripts JavaScript
│   ├── filmes.js               # Lógica de gerenciamento de filmes
│   ├── salas.js                # Lógica de gerenciamento de salas
│   ├── sessoes.js              # Lógica de gerenciamento de sessões
│   ├── sessoes-disponiveis.js  # Listagem de sessões
│   ├── venda-ingressos.js      # Sistema de venda
│   ├── scriptcine.js           # Scripts auxiliares (alunos)
│   ├── scriptfun.js            # Scripts auxiliares (funcionários)
│   └── script.js               # Scripts gerais
├── index.html                   # Página inicial
├── cadastro-filmes.html        # Cadastro de filmes
├── cadastro-salas.html         # Cadastro de salas
├── cadastro-sessoes.html       # Cadastro de sessões
├── venda-ingressos.html        # Venda de ingressos
├── sessoes-disponiveis.html    # Visualização de sessões
├── alunos.html                 # Interface para alunos
├── funcionarios.html           # Interface para funcionários
├── data.json                   # Dados iniciais do sistema
├── Dockerfile                  # Configuração Docker
├── docker-compose.yml          # Orquestração Docker
├── build.sh                    # Script de build
├── LICENSE                     # Licença do projeto
└── README.md                   # Este arquivo
```

## 🚀 Como Executar

### Opção 1: Executar Localmente (Simples)

1. Clone o repositório:
```bash
git clone https://github.com/SalmaoPinho/projeto-web-cinema-aluno-funcionario.git
cd projeto-web-cinema-aluno-funcionario
```

2. Abra o arquivo `index.html` diretamente no navegador ou use um servidor local:

**Usando Python:**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Usando Node.js:**
```bash
npx http-server -p 8080
```

3. Acesse no navegador:
```
http://localhost:8080
```

### Opção 2: Executar com Docker

1. Clone o repositório:
```bash
git clone https://github.com/SalmaoPinho/projeto-web-cinema-aluno-funcionario.git
cd projeto-web-cinema-aluno-funcionario
```

2. Execute com Docker Compose:
```bash
docker-compose up -d
```

3. Acesse no navegador:
```
http://localhost:7272
```

### Opção 3: Build Manual com Docker

```bash
# Build da imagem
docker build -t 123-filmes .

# Executar o container
docker run -d -p 8080:8080 --name cinema-app 123-filmes
```

## 📖 Uso do Sistema

### Primeiro Acesso

1. **Carregar Dados Iniciais**: O sistema vem com dados de exemplo em `data.json`. Para carregar esses dados no localStorage, você pode usar o console do navegador ou criar uma função de importação.

2. **Navegação**: Use o menu superior para acessar as diferentes funcionalidades:
   - **Início**: Dashboard com estatísticas
   - **Cadastros**: Gerenciamento de filmes, salas e sessões
   - **Venda de Ingressos**: Sistema de vendas
   - **Sessões Disponíveis**: Visualização da programação

### Fluxo de Trabalho Recomendado

1. **Cadastrar Salas** → Defina as salas disponíveis no cinema
2. **Cadastrar Filmes** → Adicione os filmes em cartaz
3. **Criar Sessões** → Programe as exibições
4. **Vender Ingressos** → Realize as vendas

## 🐳 Docker

O projeto inclui configuração completa para Docker:

### Dockerfile
- Baseado em `node:18-alpine`
- Usa `http-server` para servir os arquivos estáticos
- Expõe a porta 8080

### Docker Compose
- Mapeia a porta 7272 do host para 8080 do container
- Volume montado para desenvolvimento
- Restart automático

### Comandos Úteis

```bash
# Iniciar o serviço
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar o serviço
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Mantenha o código limpo e bem documentado
- Siga os padrões de código existentes
- Teste suas alterações antes de enviar
- Atualize a documentação quando necessário

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Salmão Pinho** - [GitHub](https://github.com/SalmaoPinho)

## 🙏 Agradecimentos

- Bootstrap pela framework CSS
- Bootstrap Icons pelos ícones
- Comunidade open source

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de cinemas**
