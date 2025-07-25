<?php
header('Content-Type: application/json');

// Habilita o log de erros
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Recebe o payload do webhook
$payload = file_get_contents('php://input');
error_log("[Webhook] 🔄 Iniciando processamento do webhook");
error_log("[Webhook] 📦 Payload recebido: " . $payload);

// Tentar decodificar o payload
try {
    $event = json_decode($payload, true);
    
    // Se o payload não puder ser decodificado como JSON normal, pode ser um payload bruto
    if (json_last_error() !== JSON_ERROR_NONE && strpos($payload, "b'") === 0) {
        error_log("[Webhook] 🔍 Tentando processar como payload bruto");
        // Remove o prefixo b' e o sufixo ' se existirem
        $cleanPayload = substr($payload, 2, -1);
        // Substitui aspas simples escapadas por aspas duplas
        $cleanPayload = str_replace("\'", "'", $cleanPayload);
        // Substitui aspas duplas escapadas por aspas duplas
        $cleanPayload = str_replace('\"', '"', $cleanPayload);
        // Tenta decodificar novamente
        $event = json_decode($cleanPayload, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("[Webhook] ❌ Falha ao decodificar payload bruto: " . json_last_error_msg());
            throw new Exception("Falha ao decodificar payload: " . json_last_error_msg());
        }
    }
} catch (Exception $e) {
    error_log("[Webhook] ❌ Erro ao processar payload: " . $e->getMessage());
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido']);
    exit;
}

// Log do evento decodificado
error_log("[Webhook] 📊 Evento decodificado: " . print_r($event, true));

// Verifica se o payload contém a estrutura esperada
if (!$event || !isset($event['type']) || !isset($event['data']) || !isset($event['data']['id']) || !isset($event['data']['status'])) {
    error_log("[Webhook] ❌ Payload inválido recebido. Campos necessários não encontrados");
    error_log("[Webhook] 🔍 Campos disponíveis: " . print_r(array_keys($event ?? []), true));
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido - estrutura não reconhecida']);
    exit;
}

try {
    // Extrair dados do evento
    $transactionId = $event['data']['id'];
    $status = strtolower($event['data']['status']);
    
    error_log("[Webhook] ℹ️ Processando pagamento ID: " . $transactionId . " com status: " . $status);
    
    // Conecta ao SQLite
    $dbPath = __DIR__ . '/database.sqlite';
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("[Webhook] ✅ Conexão com banco de dados estabelecida");

    // Atualiza o status do pagamento no banco de dados
    $stmt = $db->prepare("UPDATE pedidos SET status = :status, updated_at = :updated_at WHERE transaction_id = :transaction_id");
    
    // Mapeia o status da PayHub para nosso formato
    if ($status === 'paid' || $status === 'approved') {
        $novoStatus = 'paid';
    } else if ($status === 'pending') {
        $novoStatus = 'pending';
    } else if ($status === 'refused' || $status === 'canceled') {
        $novoStatus = 'canceled';
    } else {
        $novoStatus = $status;
    }
    
    error_log("[Webhook] 🔄 Atualizando status para: " . $novoStatus);
    
    $result = $stmt->execute([
        'status' => $novoStatus,
        'updated_at' => date('c'),
        'transaction_id' => $transactionId
    ]);

    if ($stmt->rowCount() === 0) {
        error_log("[Webhook] ⚠️ Nenhum pedido encontrado com o ID: " . $transactionId);
        error_log("[Webhook] 🔍 Verificando se o pedido existe no banco...");
        
        // Verifica se o pedido existe
        $checkStmt = $db->prepare("SELECT * FROM pedidos WHERE transaction_id = :transaction_id");
        $checkStmt->execute(['transaction_id' => $transactionId]);
        $pedidoExiste = $checkStmt->fetch();
        
        if ($pedidoExiste) {
            error_log("[Webhook] ℹ️ Pedido encontrado mas status não foi alterado. Status atual: " . $pedidoExiste['status']);
        } else {
            error_log("[Webhook] ❌ Pedido não existe no banco de dados");
        }
        
        http_response_code(404);
        echo json_encode(['error' => 'Pedido não encontrado']);
        exit;
    }

    error_log("[Webhook] ✅ Status atualizado com sucesso no banco de dados");

    // Responde imediatamente ao webhook
    http_response_code(200);
    echo json_encode(['success' => true]);
    
    // Fecha a conexão com o cliente
    if (function_exists('fastcgi_finish_request')) {
        error_log("[Webhook] 📤 Fechando conexão com o cliente via fastcgi_finish_request");
        fastcgi_finish_request();
    } else {
        error_log("[Webhook] ⚠️ fastcgi_finish_request não disponível");
    }
    
    // Continua o processamento em background se for pagamento aprovado
    if ($status === 'paid' || $status === 'approved') {
        error_log("[Webhook] ✅ Pagamento aprovado, iniciando processamento em background");

        // Busca os dados do pedido
        $stmt = $db->prepare("SELECT * FROM pedidos WHERE transaction_id = :transaction_id");
        $stmt->execute(['transaction_id' => $transactionId]);
        $pedido = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($pedido) {
            error_log("[Webhook] ✅ Dados do pedido recuperados do banco");
            error_log("[Webhook] 📊 Dados do pedido: " . print_r($pedido, true));

            // Decodifica os parâmetros UTM do banco
            $utmParams = json_decode($pedido['utm_params'], true);
            error_log("[Webhook] 📊 UTM Params brutos do banco: " . print_r($utmParams, true));
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("[Webhook] ⚠️ Erro ao decodificar UTM params: " . json_last_error_msg());
            }

            // Extrai os parâmetros UTM, garantindo que todos os campos necessários existam
            $trackingParameters = [
                'src' => $utmParams['utm_source'] ?? null,
                'sck' => $utmParams['sck'] ?? null,
                'utm_source' => $utmParams['utm_source'] ?? null,
                'utm_campaign' => $utmParams['utm_campaign'] ?? null,
                'utm_medium' => $utmParams['utm_medium'] ?? null,
                'utm_content' => $utmParams['utm_content'] ?? null,
                'utm_term' => $utmParams['utm_term'] ?? null,
                'fbclid' => $utmParams['fbclid'] ?? null,
                'gclid' => $utmParams['gclid'] ?? null,
                'ttclid' => $utmParams['ttclid'] ?? null,
                'xcod' => $utmParams['xcod'] ?? null
            ];

            // Remove valores null para manter apenas os parâmetros que existem
            $trackingParameters = array_filter($trackingParameters, function($value) {
                return $value !== null;
            });

            error_log("[Webhook] 📊 Tracking Parameters processados: " . print_r($trackingParameters, true));

            // Extrair dados do cliente do payload da PayHub se disponíveis
            $customerData = isset($event['data']['customer']) ? $event['data']['customer'] : null;
            $customerName = $customerData && isset($customerData['name']) ? $customerData['name'] : $pedido['nome'];
            $customerEmail = $customerData && isset($customerData['email']) ? $customerData['email'] : $pedido['email'];
            $customerPhone = $customerData && isset($customerData['phone']) ? $customerData['phone'] : null;
            $customerDocument = $customerData && isset($customerData['document']['number']) ? $customerData['document']['number'] : $pedido['cpf'];
            
            // Extrair informações de fee se disponíveis
            $fixedAmount = 0;
            $netAmount = $pedido['valor'];
            
            if (isset($event['data']['fee'])) {
                $fixedAmount = $event['data']['fee']['fixedAmount'] ?? 0;
                $netAmount = $event['data']['fee']['netAmount'] ?? $pedido['valor'];
            }

            // Estrutura original do payload utmify que funcionava antes
            $utmifyData = [
                'orderId' => $transactionId,
                'platform' => 'PayHubr',
                'paymentMethod' => 'pix',
                'status' => 'paid',
                'createdAt' => $pedido['created_at'],
                'approvedDate' => date('Y-m-d H:i:s'),
                'paidAt' => date('Y-m-d H:i:s'),
                'refundedAt' => null,
                'customer' => [
                    'name' => $pedido['nome'],
                    'email' => $pedido['email'],
                    'phone' => null,
                    'document' => [
                        'number' => $pedido['cpf'],
                        'type' => 'CPF'
                    ],
                    'country' => 'BR',
                    'ip' => $_SERVER['REMOTE_ADDR'] ?? null
                ],
                'items' => [
                    [
                        'id' => uniqid('PROD_'),
                        'title' => 'Liberação de Benefício',
                        'quantity' => 1,
                        'unitPrice' => $pedido['valor']
                    ]
                ],
                'amount' => $pedido['valor'],
                'fee' => [
                    'fixedAmount' => $fixedAmount,
                    'netAmount' => $netAmount
                ],
                'trackingParameters' => $trackingParameters,
                'isTest' => false
            ];

            error_log("[Webhook] 📦 Payload completo para utmify: " . json_encode($utmifyData));

            // Envia para utmify.php
            $serverUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            $utmifyUrl = $serverUrl . "/app-cnh/checkout/utmify.php";
            error_log("[Webhook] 🌐 Enviando dados para URL: " . $utmifyUrl);

            $ch = curl_init($utmifyUrl);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($utmifyData),
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_TIMEOUT => 30
            ]);

            $utmifyResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            
            error_log("[Webhook] 📤 Resposta do utmify (HTTP $httpCode): " . $utmifyResponse);
            if ($curlError) {
                error_log("[Webhook] ❌ Erro ao enviar para utmify: " . $curlError);
            } else {
                error_log("[Webhook] 📊 Resposta decodificada: " . print_r(json_decode($utmifyResponse, true), true));
            }
            
            curl_close($ch);
            error_log("[Webhook] ✅ Processamento em background concluído");
        } else {
            error_log("[Webhook] ❌ Não foi possível recuperar os dados do pedido do banco");
        }
    } else {
        error_log("[Webhook] ℹ️ Status não é paid ou approved, pulando processamento em background");
    }

} catch (Exception $e) {
    error_log("[Webhook] ❌ Erro: " . $e->getMessage());
    error_log("[Webhook] 🔍 Stack trace: " . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor']);
} 