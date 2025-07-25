#!/bin/bash

echo "🚀 Iniciando servidor PHP local..."
echo "📍 Host: http://localhost:8000"
echo "📁 Diretório: $(pwd)"
echo "🔗 Teste: http://localhost:8000/teste-pagamento.html"
echo "💳 Checkout: http://localhost:8000/index.html"
echo ""
echo "Para parar o servidor, pressione Ctrl+C"
echo ""

# Iniciar servidor PHP
php -S localhost:8000 -t .