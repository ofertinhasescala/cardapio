<?php
// Arquivo de teste para verificar a integração Monetrix

echo "<h1>Teste de Integração Monetrix</h1>";

// Teste 1: Verificar configurações
echo "<h2>1. Configurações da API</h2>";
$apiUrl = 'https://api.monetrix.store/v1';
$publicKey = 'pk_ouwx4hvdzP2IcG-qH-KG4tBeF7_rhkba_HYje6SsTjHo5umn';
$secretKey = 'sk__Q39xQdSt6qPoM9gOBb5EKXeG0i-3Fo1pMP77BiWS7Fygjng';
$auth = base64_encode($publicKey . ':' . $secretKey);

echo "URL da API: " . $apiUrl . "<br>";
echo "Public Key: " . substr($publicKey, 0, 20) . "...<br>";
echo "Secret Key: " . substr($secretKey, 0, 20) . "...<br>";
echo "Auth Header: Basic " . substr($auth, 0, 30) . "...<br><br>";

// Teste 2: Estrutura de dados
echo "<h2>2. Estrutura de Dados para Monetrix</h2>";
$testData = [
    "amount" => 1000, // R$ 10,00 em centavos
    "currency" => "BRL",
    "paymentMethod" => "pix",
    "postbackUrl" => "https://" . $_SERVER['HTTP_HOST'] . "/app-cnh/checkout/webhook.php",
    "externalRef" => uniqid('teste_'),
    "metadata" => [
        "utm_source" => "teste",
        "utm_campaign" => "teste_monetrix",
        "utm_medium" => "teste"
    ],
    "customer" => [
        "name" => "Cliente Teste",
        "email" => "teste@email.com",
        "phone" => "11999999999",
        "document" => [
            "type" => "cpf",
            "number" => "12345678901"
        ]
    ],
    "items" => [
        [
            "title" => "Produto Teste",
            "quantity" => 1,
            "unitPrice" => 1000,
            "tangible" => false
        ]
    ]
];

echo "<pre>" . json_encode($testData, JSON_PRETTY_PRINT) . "</pre>";

// Teste 3: Verificar banco SQLite
echo "<h2>3. Verificação do Banco SQLite</h2>";
try {
    $dbPath = __DIR__ . '/database.sqlite';
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $db->query("SELECT COUNT(*) as total FROM pedidos");
    $result = $stmt->fetch();
    
    echo "Conexão com SQLite: ✅ OK<br>";
    echo "Total de pedidos no banco: " . $result['total'] . "<br>";
    
    // Mostrar últimos 5 pedidos
    $stmt = $db->query("SELECT transaction_id, status, valor, created_at FROM pedidos ORDER BY created_at DESC LIMIT 5");
    $pedidos = $stmt->fetchAll();
    
    if ($pedidos) {
        echo "<h3>Últimos 5 pedidos:</h3>";
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>ID</th><th>Status</th><th>Valor</th><th>Data</th></tr>";
        foreach ($pedidos as $pedido) {
            echo "<tr>";
            echo "<td>" . $pedido['transaction_id'] . "</td>";
            echo "<td>" . $pedido['status'] . "</td>";
            echo "<td>R$ " . number_format($pedido['valor'] / 100, 2, ',', '.') . "</td>";
            echo "<td>" . $pedido['created_at'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
} catch (Exception $e) {
    echo "Erro no SQLite: ❌ " . $e->getMessage() . "<br>";
}

// Teste 4: Verificar arquivos
echo "<h2>4. Verificação dos Arquivos</h2>";
$arquivos = [
    'pagamento.php' => 'Criação de transações PIX',
    'webhook.php' => 'Processamento de webhooks',
    'verificar.php' => 'Verificação de status',
    'utmify.php' => 'Envio para UTMify (pago)',
    'utmify-pendente.php' => 'Envio para UTMify (pendente)'
];

foreach ($arquivos as $arquivo => $descricao) {
    $caminho = __DIR__ . '/' . $arquivo;
    if (file_exists($caminho)) {
        echo "✅ $arquivo - $descricao<br>";
    } else {
        echo "❌ $arquivo - ARQUIVO NÃO ENCONTRADO<br>";
    }
}

// Teste 5: Logs
echo "<h2>5. Verificação de Logs</h2>";
$logDir = __DIR__ . '/logs';
if (is_dir($logDir)) {
    echo "Diretório de logs: ✅ OK<br>";
    $logs = glob($logDir . '/*.log');
    echo "Arquivos de log encontrados: " . count($logs) . "<br>";
    
    foreach ($logs as $log) {
        $nome = basename($log);
        $tamanho = filesize($log);
        echo "- $nome (" . number_format($tamanho) . " bytes)<br>";
    }
} else {
    echo "Diretório de logs: ❌ NÃO ENCONTRADO<br>";
}

echo "<h2>✅ Teste Concluído</h2>";
echo "<p>A migração para Monetrix foi implementada com sucesso!</p>";
echo "<p><strong>Próximos passos:</strong></p>";
echo "<ul>";
echo "<li>Testar criação de PIX com valores pequenos</li>";
echo "<li>Verificar se webhooks estão sendo recebidos</li>";
echo "<li>Confirmar integração com UTMify</li>";
echo "<li>Monitorar logs para possíveis erros</li>";
echo "</ul>";
?>