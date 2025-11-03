#!/bin/bash
# build.sh

echo "🛠️  Construindo a imagem Docker..."
docker build -t cine-manager:latest .

echo "🚀 Iniciando os containers..."
docker-compose up -d

echo "✅ Aplicação rodando em:"
echo "   🌐 Site principal: http://localhost:7272"
