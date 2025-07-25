<?php
// Script para iniciar servidor PHP local para desenvolvimento

$host = 'localhost';
$port = 8000;
$docroot = __DIR__;

echo "🚀 Iniciando servidor PHP local...\n";
echo "📍 Host: http://{$host}:{$port}\n";
echo "📁 Diretório: {$docroot}\n";
echo "🔗 Teste: http://{$host}:{$port}/teste-pagamento.html\n";
echo "💳 Checkout: http://{$host}:{$port}/index.html\n\n";

echo "Para parar o servidor, pressione Ctrl+C\n\n";

// Iniciar servidor
$command = "php -S {$host}:{$port} -t {$docroot}";
passthru($command);
?>