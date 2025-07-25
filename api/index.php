<?php
// Verificador de status da API
header('Content-Type: application/json');

$response = [
    'status' => 'online',
    'message' => 'Atelier Phamela Gourmet API está funcionando!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'environment' => getenv('ENVIRONMENT') ?: 'development'
];

echo json_encode($response, JSON_PRETTY_PRINT); 