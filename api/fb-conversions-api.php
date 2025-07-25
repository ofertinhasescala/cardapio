<?php
/**
 * Facebook Conversions API Implementation - Vercel API Version
 * Pixel ID: 1404066580873208
 * Access Token: EAAiRE5K8xWsBPMFziWRfy0NKYPvqhzAmMuqGGTdfQRPikqRlXFRDmRRTcL3xD6vjbcQ6zXQZB1ViKHx6GvUSiExWHksTiZBiPYJAVcBJXpmEnkOEMQrjYVRLFFn83iOiKTAx77uoyOqIDt619kSnzXIlZBLKJf9ezmGLOYuwPnfnAiefOdElfBmJJOp1AZDZD
 */

// Headers para permitir solicitações de origem cruzada (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Access-Control-Max-Age: 86400"); // Cache preflight por 24 horas
header("Content-Type: application/json");

// Responder a solicitações OPTIONS sem processar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Log da requisição para debug
error_log("[FB Conversions API] 📝 Método: " . $_SERVER['REQUEST_METHOD']);
error_log("[FB Conversions API] 📦 Input bruto: " . file_get_contents('php://input'));

// Configurações do Facebook - Usar variáveis de ambiente para Vercel
define('FB_PIXEL_ID', getenv('FB_PIXEL_ID') ?: '1404066580873208');
define('FB_ACCESS_TOKEN', getenv('FB_ACCESS_TOKEN') ?: 'EAAiRE5K8xWsBPMFziWRfy0NKYPvqhzAmMuqGGTdfQRPikqRlXFRDmRRTcL3xD6vjbcQ6zXQZB1ViKHx6GvUSiExWHksTiZBiPYJAVcBJXpmEnkOEMQrjYVRLFFn83iOiKTAx77uoyOqIDt619kSnzXIlZBLKJf9ezmGLOYuwPnfnAiefOdElfBmJJOp1AZDZD');
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
    'test_event_code' => 'TEST72973', // Remover esta linha para eventos reais em produção
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
    
    // Adicionar dados adicionais se fornecidos
    if (!empty($userData['email'])) {
        $result['em'] = hash('sha256', strtolower(trim($userData['email'])));
    }
    
    if (!empty($userData['phone'])) {
        // Normalizar telefone para E.164 (remover todos os não dígitos)
        $phone = preg_replace('/[^0-9]/', '', $userData['phone']);
        if (strlen($phone) >= 8) {
            $result['ph'] = hash('sha256', $phone);
        }
    }
    
    if (!empty($userData['name'])) {
        $result['fn'] = hash('sha256', strtolower(trim($userData['name'])));
    }
    
    if (!empty($userData['city'])) {
        $result['ct'] = hash('sha256', strtolower(trim($userData['city'])));
    }
    
    if (!empty($userData['state'])) {
        $result['st'] = hash('sha256', strtolower(trim($userData['state'])));
    }
    
    if (!empty($userData['zip'])) {
        $result['zp'] = hash('sha256', trim($userData['zip']));
    }
    
    // IDs externos
    if (!empty($userData['external_id'])) {
        $result['external_id'] = $userData['external_id'];
    }
    
    // IDs do Facebook
    if (!empty($userData['fbp'])) {
        $result['fbp'] = $userData['fbp'];
    }
    
    if (!empty($userData['fbc'])) {
        $result['fbc'] = $userData['fbc'];
    }
    
    return $result;
}

/**
 * Preparar dados específicos do evento com base no tipo
 */
function prepareCustomData($eventName, $eventData, $quantity = null) {
    $customData = [
        'currency' => 'BRL',
    ];
    
    switch ($eventName) {
        case 'ViewContent':
            if (isset($eventData['id'])) {
                $customData['content_ids'] = [$eventData['id']];
            }
            if (isset($eventData['categoria'])) {
                $customData['content_category'] = $eventData['categoria'];
            }
            if (isset($eventData['precoPromocional']) || isset($eventData['precoOriginal'])) {
                $customData['value'] = $eventData['precoPromocional'] ?? $eventData['precoOriginal'];
            }
            $customData['content_type'] = 'product';
            break;
            
        case 'AddToCart':
            if (isset($eventData['id'])) {
                $customData['content_ids'] = [$eventData['id']];
            }
            if (isset($eventData['precoPromocional']) || isset($eventData['precoOriginal'])) {
                $customData['value'] = ($eventData['precoPromocional'] ?? $eventData['precoOriginal']) * ($quantity ?: 1);
            }
            $customData['content_type'] = 'product';
            
            // Adicionar informações de conteúdo
            if (isset($eventData['id']) && (isset($eventData['precoPromocional']) || isset($eventData['precoOriginal']))) {
                $customData['contents'] = [[
                    'id' => $eventData['id'],
                    'quantity' => $quantity ?: 1,
                    'item_price' => $eventData['precoPromocional'] ?? $eventData['precoOriginal']
                ]];
            }
            break;
            
        case 'InitiateCheckout':
            if (isset($eventData['items']) && is_array($eventData['items'])) {
                $contentIds = array_map(function($item) {
                    return $item['id'];
                }, $eventData['items']);
                
                $contents = array_map(function($item) {
                    return [
                        'id' => $item['id'],
                        'quantity' => $item['quantity'] ?? 1,
                        'item_price' => $item['price'] ?? 0
                    ];
                }, $eventData['items']);
                
                $customData['content_ids'] = $contentIds;
                $customData['contents'] = $contents;
                $customData['num_items'] = count($eventData['items']);
            }
            
            if (isset($eventData['total'])) {
                $customData['value'] = $eventData['total'];
            }
            break;
            
        case 'AddPaymentInfo':
            if (isset($eventData['method'])) {
                $customData['payment_type'] = $eventData['method'];
            }
            if (isset($eventData['total'])) {
                $customData['value'] = $eventData['total'];
            }
            $customData['content_category'] = 'checkout';
            break;
            
        case 'Purchase':
            if (isset($eventData['items']) && is_array($eventData['items'])) {
                $contentIds = array_map(function($item) {
                    return $item['id'];
                }, $eventData['items']);
                
                $contents = array_map(function($item) {
                    return [
                        'id' => $item['id'],
                        'quantity' => $item['quantity'] ?? 1,
                        'item_price' => $item['price'] ?? 0
                    ];
                }, $eventData['items']);
                
                $customData['content_ids'] = $contentIds;
                $customData['contents'] = $contents;
                $customData['num_items'] = array_sum(array_map(function($item) {
                    return $item['quantity'] ?? 1;
                }, $eventData['items']));
            }
            
            if (isset($eventData['total'])) {
                $customData['value'] = $eventData['total'];
            }
            
            if (isset($eventData['orderId'])) {
                $customData['transaction_id'] = $eventData['orderId'];
            }
            break;
    }
    
    return $customData;
}

/**
 * Enviar evento para a API do Facebook
 */
function sendEventToFacebook($payload) {
    $url = 'https://graph.facebook.com/' . FB_API_VERSION . '/' . FB_PIXEL_ID . '/events';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . FB_ACCESS_TOKEN
    ]);
    
    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("[FB Conversions API] ❌ cURL Error: " . $error);
        return ['error' => $error];
    }
    
    return [
        'status_code' => $info['http_code'],
        'response' => $response ? json_decode($response, true) : null
    ];
}

/**
 * Obter o IP do cliente
 */
function getClientIp() {
    if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (isset($_SERVER['HTTP_X_REAL_IP'])) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // X-Forwarded-For pode conter múltiplos IPs
        $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ipList[0]);
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }
    
    // Remover porta, se houver
    $ip = preg_replace('/:\d+$/', '', $ip);
    
    // Fazer hash do IP para conformidade com GDPR
    return hash('sha256', $ip);
}

/**
 * Registrar evento para depuração
 */
function logEvent($eventName, $eventId, $response) {
    error_log("[FB Conversions API] 📊 Evento: {$eventName} | ID: {$eventId}");
    error_log("[FB Conversions API] 📊 Resposta: " . json_encode($response));
} 