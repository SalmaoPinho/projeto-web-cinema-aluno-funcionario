# Dockerfile com Node.js (mais simples)
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala um servidor HTTP simples
RUN npm install -g http-server

# Expõe a porta 8080
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["http-server", "-p", "8080", "-a", "0.0.0.0"]