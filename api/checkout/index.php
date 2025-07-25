<?php
// Definir qual arquivo PHP chamar com base no método HTTP e parâmetros
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

// Handle preflight OPTIONS request
if ($request_method === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Parse the URI path to determine which script to execute
$path = parse_url($request_uri, PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// O último segmento deve ser 'pagamento' ou 'verificar'
$action = end($segments);

if ($action === 'pagamento' || strpos($path, 'pagamento') !== false) {
    // Redirecionar para o script de pagamento
    include_once __DIR__ . '/pagamento.php';
    exit;
} else if ($action === 'verificar' || strpos($path, 'verificar') !== false) {
    // Redirecionar para o script de verificação
    include_once __DIR__ . '/verificar.php';
    exit;
} else {
    // Endpoint não encontrado
    http_response_code(404);
    echo json_encode([
        'error' => 'Endpoint não encontrado',
        'path' => $path,
        'segments' => $segments,
        'action' => $action
    ]);
    exit;
} 