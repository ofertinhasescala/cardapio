<?php
/**
 * Facebook Conversions API Implementation
 * Pixel ID: 1404066580873208
 * Access Token: EAAiRE5K8xWsBPMFziWRfy0NKYPvqhzAmMuqGGTdfQRPikqRlXFRDmRRTcL3xD6vjbcQ6zXQZB1ViKHx6GvUSiExWHksTiZBiPYJAVcBJXpmEnkOEMQrjYVRLFFn83iOiKTAx77uoyOqIDt619kSnzXIlZBLKJf9ezmGLOYuwPnfnAiefOdElfBmJJOp1AZDZD
 */

// Headers para permitir solicitações de origem cruzada (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Responder a solicitações OPTIONS sem processar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configurações do Facebook
define('FB_PIXEL_ID', '1404066580873208');
define('FB_ACCESS_TOKEN', 'EAAiRE5K8xWsBPMFziWRfy0NKYPvqhzAmMuqGGTdfQRPikqRlXFRDmRRTcL3xD6vjbcQ6zXQZB1ViKHx6GvUSiExWHksTiZBiPYJAVcBJXpmEnkOEMQrjYVRLFFn83iOiKTAx77uoyOqIDt619kSnzXIlZBLKJf9ezmGLOYuwPnfnAiefOdElfBmJJOp1AZDZD');
define('FB_API_VERSION', 'v18.0');

// Obter dados JSON da solicitação POST
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Verificar dados necessários
if (empty($data) || empty($data['eventName'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required data']);
    exit;
}

// Coletar dados do evento
$eventName = $data['eventName'];
$eventData = $data['eventData'] ?? [];
$quantity = $data['quantity'] ?? null;
$userData = $data['userData'] ?? [];
$url = $data['url'] ?? '';
$userAgent = $data['userAgent'] ?? '';
$fbp = $data['fbp'] ?? null; // Facebook Browser ID
$fbc = $data['fbc'] ?? null; // Facebook Click ID

// Gerar um ID de evento exclusivo
$eventId = uniqid('event_', true);

// Preparar dados do cliente para correspondência aprimorada
$userData = prepareUserData($userData);

// Obter informações sobre o evento de visualização/origem
$sourceData = [
    'url' => $url,
    'user_agent' => $userAgent,
    'fbp' => $fbp,
    'fbc' => $fbc,
];

// Preparar dados específicos do evento com base no tipo de evento
$customData = prepareCustomData($eventName, $eventData, $quantity);

// Preparar o payload do evento
$eventPayload = [
    'event_name' => $eventName,
    'event_time' => time(),
    'event_id' => $eventId,
    'event_source_url' => $url,
    'action_source' => 'website',
    'user_data' => $userData,
    'custom_data' => $customData
];

// Preparar o payload completo da API
$apiPayload = [
    'data' => [$eventPayload],
    'test_event_code' => 'TEST72973', // Remover esta linha para eventos reais
    'partner_agent' => 'phamela-gourmet-store-capi',
];

// Enviar o evento para a API do Facebook
$response = sendEventToFacebook($apiPayload);

// Registrar para depuração
logEvent($eventName, $eventId, $response);

// Responder ao cliente
echo json_encode([
    'success' => true,
    'event_id' => $eventId,
    'response' => $response
]);
exit;

/**
 * Preparar dados do usuário para correspondência aprimorada
 */
function prepareUserData($userData) {
    // Dados básicos do usuário
    $result = [
        'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'client_ip_address' => getClientIp(),
    ];
    
    // Adicionar dados específicos do usuário se disponíveis
    if (!empty($userData['em'])) {
        $result['em'] = hash('sha256', strtolower(trim($userData['em'])));
    }
    
    if (!empty($userData['ph'])) {
        // Telefone no formato internacional (somente números)
        $result['ph'] = hash('sha256', preg_replace('/[^0-9]/', '', $userData['ph']));
    }
    
    if (!empty($userData['fn'])) {
        $result['fn'] = hash('sha256', strtolower(trim($userData['fn'])));
    }
    
    if (!empty($userData['ln'])) {
        $result['ln'] = hash('sha256', strtolower(trim($userData['ln'])));
    }
    
    // Adicionar FBP (Facebook Browser ID) se disponível
    if (!empty($userData['fbp'])) {
        $result['fbp'] = $userData['fbp'];
    }
    
    // Adicionar FBC (Facebook Click ID) se disponível
    if (!empty($userData['fbc'])) {
        $result['fbc'] = $userData['fbc'];
    }
    
    return $result;
}

/**
 * Preparar dados personalizados com base no tipo de evento
 */
function prepareCustomData($eventName, $eventData, $quantity) {
    $customData = [
        'currency' => 'BRL',
    ];
    
    switch ($eventName) {
        case 'ViewContent':
            $customData['content_name'] = $eventData['nome'] ?? '';
            $customData['content_category'] = $eventData['categoria'] ?? '';
            $customData['content_ids'] = [$eventData['id']];
            $customData['content_type'] = 'product';
            $customData['value'] = $eventData['precoPromocional'] ?? $eventData['precoOriginal'] ?? 0;
            break;
            
        case 'AddToCart':
            $customData['content_name'] = $eventData['nome'] ?? '';
            $customData['content_category'] = $eventData['categoria'] ?? '';
            $customData['content_ids'] = [$eventData['id']];
            $customData['content_type'] = 'product';
            $customData['value'] = ($eventData['precoPromocional'] ?? $eventData['precoOriginal'] ?? 0) * ($quantity ?? 1);
            $customData['contents'] = [
                [
                    'id' => $eventData['id'],
                    'quantity' => $quantity ?? 1,
                    'item_price' => $eventData['precoPromocional'] ?? $eventData['precoOriginal'] ?? 0
                ]
            ];
            break;
            
        case 'InitiateCheckout':
            $customData['content_ids'] = array_map(function($item) {
                return $item['id'];
            }, $eventData['items'] ?? []);
            
            $customData['contents'] = array_map(function($item) {
                return [
                    'id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'item_price' => $item['price']
                ];
            }, $eventData['items'] ?? []);
            
            $customData['num_items'] = count($eventData['items'] ?? []);
            $customData['value'] = $eventData['total'] ?? 0;
            break;
            
        case 'AddPaymentInfo':
            $customData['content_category'] = 'checkout';
            $customData['payment_type'] = $eventData['method'] ?? 'pix';
            $customData['value'] = $eventData['total'] ?? 0;
            break;
            
        case 'Purchase':
            $customData['content_ids'] = array_map(function($item) {
                return $item['id'];
            }, $eventData['items'] ?? []);
            
            $customData['contents'] = array_map(function($item) {
                return [
                    'id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'item_price' => $item['price']
                ];
            }, $eventData['items'] ?? []);
            
            $customData['num_items'] = array_reduce($eventData['items'] ?? [], function($carry, $item) {
                return $carry + ($item['quantity'] ?? 1);
            }, 0);
            
            $customData['value'] = $eventData['total'] ?? 0;
            $customData['transaction_id'] = $eventData['orderId'] ?? '';
            break;
    }
    
    return $customData;
}

/**
 * Enviar evento para a API de Conversões do Facebook
 */
function sendEventToFacebook($payload) {
    $url = 'https://graph.facebook.com/' . FB_API_VERSION . '/' . FB_PIXEL_ID . '/events';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . FB_ACCESS_TOKEN,
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['error' => $error, 'http_code' => $httpCode];
    }
    
    return ['response' => json_decode($response, true), 'http_code' => $httpCode];
}

/**
 * Obter o endereço IP do cliente
 */
function getClientIp() {
    $ipAddresses = [
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR'
    ];
    
    foreach ($ipAddresses as $key) {
        if (array_key_exists($key, $_SERVER)) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                
                // Validar IP
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return hash('sha256', $ip); // Retornar IP com hash
                }
            }
        }
    }
    
    return hash('sha256', '127.0.0.1'); // IP padrão com hash
}

/**
 * Registrar evento para depuração
 */
function logEvent($eventName, $eventId, $response) {
    $logFile = __DIR__ . '/fb-conversions-log.txt';
    $timestamp = date('Y-m-d H:i:s');
    
    $logEntry = "[{$timestamp}] Event: {$eventName}, ID: {$eventId}, Response: " . json_encode($response) . PHP_EOL;
    
    // Criar o arquivo se não existir
    if (!file_exists($logFile)) {
        file_put_contents($logFile, "=== Facebook Conversions API Log ===\n\n");
    }
    
    // Adicionar a entrada de log
    file_put_contents($logFile, $logEntry, FILE_APPEND);
} 