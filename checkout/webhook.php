<?php
header('Content-Type: application/json');

// Habilita o log de erros
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Criar sistema de log específico para webhook
$logDir = __DIR__ . '/logs';
if (!file_exists($logDir)) {
    mkdir($logDir, 0777, true);
}
$webhookLogFile = $logDir . '/webhook-' . date('Y-m-d') . '.log';

function writeWebhookLog($message, $data = null) {
    global $webhookLogFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    if ($data !== null) {
        $logMessage .= "Dados: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }
    $logMessage .= "----------------------------------------\n";
    file_put_contents($webhookLogFile, $logMessage, FILE_APPEND);
}

// Recebe o payload do webhook
$payload = file_get_contents('php://input');
$headers = getallheaders();

writeWebhookLog("🔄 Webhook recebido", [
    'method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'N/A',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'N/A',
    'headers' => $headers,
    'payload_raw' => $payload
]);

error_log("[Webhook] 🔄 Iniciando processamento do webhook");
error_log("[Webhook] 📦 Payload recebido: " . $payload);

// Tentar decodificar o payload
try {
    $event = json_decode($payload, true);
    
    writeWebhookLog("📋 Tentativa de decodificação JSON", [
        'json_error' => json_last_error(),
        'json_error_msg' => json_last_error_msg(),
        'decoded_event' => $event
    ]);
    
    // Se o payload não puder ser decodificado como JSON normal, tentar outras abordagens
    if (json_last_error() !== JSON_ERROR_NONE) {
        writeWebhookLog("⚠️ Erro na decodificação JSON, tentando alternativas");
        
        // Tentar payload bruto com prefixo b'
        if (strpos($payload, "b'") === 0) {
            writeWebhookLog("🔍 Tentando processar como payload bruto com prefixo b'");
            $cleanPayload = substr($payload, 2, -1);
            $cleanPayload = str_replace("\'", "'", $cleanPayload);
            $cleanPayload = str_replace('\"', '"', $cleanPayload);
            $event = json_decode($cleanPayload, true);
        }
        // Tentar payload URL encoded
        elseif (strpos($payload, '=') !== false) {
            writeWebhookLog("🔍 Tentando processar como payload URL encoded");
            parse_str($payload, $parsedData);
            if (isset($parsedData['data'])) {
                $event = json_decode($parsedData['data'], true);
            } else {
                $event = $parsedData;
            }
        }
        // Tentar payload com escape de caracteres
        else {
            writeWebhookLog("🔍 Tentando processar payload com unescape");
            $unescapedPayload = stripslashes($payload);
            $event = json_decode($unescapedPayload, true);
        }
        
        writeWebhookLog("📋 Resultado após processamento alternativo", [
            'json_error' => json_last_error(),
            'json_error_msg' => json_last_error_msg(),
            'decoded_event' => $event
        ]);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            writeWebhookLog("❌ Falha em todas as tentativas de decodificação");
            throw new Exception("Falha ao decodificar payload: " . json_last_error_msg());
        }
    }
} catch (Exception $e) {
    writeWebhookLog("❌ Erro crítico no processamento", ['error' => $e->getMessage()]);
    error_log("[Webhook] ❌ Erro ao processar payload: " . $e->getMessage());
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido']);
    exit;
}

// Log do evento decodificado
error_log("[Webhook] 📊 Evento decodificado: " . print_r($event, true));

// Verifica se o payload contém dados válidos
if (!$event) {
    error_log("[Webhook] ❌ Payload vazio ou inválido");
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido']);
    exit;
}

// A Monetrix pode enviar diferentes estruturas, vamos tentar identificar
$transactionId = null;
$status = null;
$transactionData = null;

// Estrutura 1: Webhook direto da Monetrix com type=transaction
if (isset($event['type']) && $event['type'] === 'transaction' && isset($event['data'])) {
    $transactionId = $event['data']['id'] ?? null;
    $status = $event['data']['status'] ?? null;
    $transactionData = $event['data'];
    error_log("[Webhook] 📋 Estrutura tipo 1 detectada (type=transaction)");
}
// Estrutura 2: Dados diretos da transação
elseif (isset($event['id']) && isset($event['status'])) {
    $transactionId = $event['id'];
    $status = $event['status'];
    $transactionData = $event;
    error_log("[Webhook] 📋 Estrutura tipo 2 detectada (dados diretos)");
}
// Estrutura 3: Tentar extrair de outros campos possíveis
elseif (isset($event['transaction_id']) || isset($event['orderId'])) {
    $transactionId = $event['transaction_id'] ?? $event['orderId'] ?? null;
    $status = $event['transaction_status'] ?? $event['status'] ?? 'unknown';
    $transactionData = $event;
    error_log("[Webhook] 📋 Estrutura tipo 3 detectada (campos alternativos)");
}

if (!$transactionId || !$status) {
    error_log("[Webhook] ❌ Dados essenciais não encontrados no payload");
    error_log("[Webhook] 🔍 Campos disponíveis: " . print_r(array_keys($event), true));
    error_log("[Webhook] 📄 Payload completo: " . print_r($event, true));
    http_response_code(400);
    echo json_encode(['error' => 'Dados da transação inválidos - ID ou status não encontrados']);
    exit;
}

error_log("[Webhook] ✅ Dados extraídos - ID: $transactionId, Status: $status");

try {
    // Normalizar status
    $status = strtolower($status);
    
    error_log("[Webhook] ℹ️ Processando pagamento ID: " . $transactionId . " com status: " . $status);
    
    // Conecta ao SQLite
    $dbPath = __DIR__ . '/database.sqlite';
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("[Webhook] ✅ Conexão com banco de dados estabelecida");

    // Atualiza o status do pagamento no banco de dados
    $stmt = $db->prepare("UPDATE pedidos SET status = :status, updated_at = :updated_at WHERE transaction_id = :transaction_id");
    
    // Mapeia o status da Monetrix para nosso formato (aceitar múltiplas variações)
    $statusLower = strtolower($status);
    if (in_array($statusLower, ['paid', 'approved', 'pago', 'aprovado'])) {
        $novoStatus = 'paid';
    } else if (in_array($statusLower, ['waiting_payment', 'pending', 'aguardando_pagamento', 'pendente'])) {
        $novoStatus = 'pending';
    } else if (in_array($statusLower, ['canceled', 'cancelled', 'refunded', 'cancelado', 'estornado'])) {
        $novoStatus = 'canceled';
    } else {
        $novoStatus = $statusLower;
    }
    
    writeWebhookLog("📊 Mapeamento de status", [
        'status_original' => $status,
        'status_lower' => $statusLower,
        'novo_status' => $novoStatus
    ]);
    
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
    if ($novoStatus === 'paid') {
        writeWebhookLog("✅ Pagamento aprovado detectado", [
            'status_original' => $status,
            'novo_status' => $novoStatus,
            'transaction_id' => $transactionId
        ]);
        error_log("[Webhook] ✅ Pagamento aprovado, iniciando processamento em background");

        // Busca os dados do pedido
        $stmt = $db->prepare("SELECT * FROM pedidos WHERE transaction_id = :transaction_id");
        $stmt->execute(['transaction_id' => $transactionId]);
        $pedido = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($pedido) {
            error_log("[Webhook] ✅ Dados do pedido recuperados do banco");
            error_log("[Webhook] 📊 Dados do pedido: " . print_r($pedido, true));

            // Para Monetrix, primeiro tenta extrair UTMs da metadata do webhook
            $metadata = null;
            
            // Tentar diferentes locais para metadata
            $metadataRaw = $transactionData['metadata'] ?? 
                          $event['metadata'] ?? 
                          null;
            
            if ($metadataRaw) {
                if (is_string($metadataRaw)) {
                    $metadata = json_decode($metadataRaw, true);
                } else {
                    $metadata = $metadataRaw;
                }
                error_log("[Webhook] 📊 Metadata encontrada no webhook: " . print_r($metadata, true));
            }
            
            // Se não houver metadata no webhook, usa os dados salvos no banco
            if (!$metadata) {
                $metadata = json_decode($pedido['utm_params'], true);
                error_log("[Webhook] 📊 UTM Params do banco: " . print_r($metadata, true));
            } else {
                error_log("[Webhook] 📊 UTM Params da metadata do webhook: " . print_r($metadata, true));
            }
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("[Webhook] ⚠️ Erro ao decodificar UTM params: " . json_last_error_msg());
                $metadata = [];
            }

            // Extrai os parâmetros UTM, garantindo que todos os campos necessários existam
            $trackingParameters = [
                'src' => $metadata['utm_source'] ?? null,
                'sck' => $metadata['sck'] ?? null,
                'utm_source' => $metadata['utm_source'] ?? null,
                'utm_campaign' => $metadata['utm_campaign'] ?? null,
                'utm_medium' => $metadata['utm_medium'] ?? null,
                'utm_content' => $metadata['utm_content'] ?? null,
                'utm_term' => $metadata['utm_term'] ?? null,
                'fbclid' => $metadata['fbclid'] ?? null,
                'gclid' => $metadata['gclid'] ?? null,
                'ttclid' => $metadata['ttclid'] ?? null,
                'xcod' => $metadata['xcod'] ?? null
            ];

            // Remove valores null para manter apenas os parâmetros que existem
            $trackingParameters = array_filter($trackingParameters, function($value) {
                return $value !== null;
            });

            error_log("[Webhook] 📊 Tracking Parameters processados: " . print_r($trackingParameters, true));

            // Extrair dados do cliente do payload da Monetrix se disponíveis
            $customerData = $transactionData['customer'] ?? null;
            $customerName = $customerData['name'] ?? $pedido['nome'];
            $customerEmail = $customerData['email'] ?? $pedido['email'];
            $customerPhone = $customerData['phone'] ?? null;
            $customerDocument = ($customerData['document']['number'] ?? null) ?: $pedido['cpf'];
            
            // Extrair informações de fee se disponíveis (Monetrix pode ter estrutura diferente)
            $paidAmount = $transactionData['paidAmount'] ?? 
                         $transactionData['amount'] ?? 
                         $pedido['valor'];
            
            $fixedAmount = 0;
            $netAmount = $paidAmount;
            
            if (isset($transactionData['fee'])) {
                $fixedAmount = $transactionData['fee']['fixedAmount'] ?? 0;
                $netAmount = $transactionData['fee']['netAmount'] ?? $paidAmount;
            }

            // Estrutura do payload utmify adaptada para Monetrix
            $utmifyData = [
                'orderId' => $transactionId,
                'platform' => 'Monetrix',
                'paymentMethod' => 'pix',
                'status' => 'paid',
                'createdAt' => gmdate('Y-m-d H:i:s', strtotime($pedido['created_at'])),
                'approvedDate' => gmdate('Y-m-d H:i:s', strtotime($transactionData['paidAt'] ?? 'now')),
                'paidAt' => gmdate('Y-m-d H:i:s', strtotime($transactionData['paidAt'] ?? 'now')),
                'refundedAt' => null,
                'customer' => [
                    'name' => $customerName,
                    'email' => $customerEmail,
                    'phone' => $customerPhone,
                    'document' => [
                        'number' => $customerDocument,
                        'type' => 'CPF'
                    ],
                    'country' => 'BR',
                    'ip' => $_SERVER['REMOTE_ADDR'] ?? null
                ],
                'items' => isset($transactionData['items']) ? $transactionData['items'] : [
                    [
                        'id' => uniqid('PROD_'),
                        'title' => 'Liberação de Benefício',
                        'quantity' => 1,
                        'unitPrice' => $pedido['valor']
                    ]
                ],
                'amount' => $paidAmount,
                'fee' => [
                    'fixedAmount' => $fixedAmount,
                    'netAmount' => $netAmount
                ],
                'trackingParameters' => $trackingParameters,
                'isTest' => false
            ];

            writeWebhookLog("📦 Dados preparados para UTMify", $utmifyData);
            error_log("[Webhook] 📦 Payload completo para utmify: " . json_encode($utmifyData));

            // Envia para utmify.php
            $serverUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            $utmifyUrl = $serverUrl . "/checkout/utmify.php";
            writeWebhookLog("🌐 Enviando para UTMify", ['url' => $utmifyUrl]);
            error_log("[Webhook] 🌐 Enviando dados para URL: " . $utmifyUrl);

            $ch = curl_init($utmifyUrl);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($utmifyData),
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_TIMEOUT => 10, // Timeout de 10 segundos
                CURLOPT_CONNECTTIMEOUT => 5 // Timeout de conexão de 5 segundos
            ]);

            $utmifyResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            
            curl_close($ch);
            
            writeWebhookLog("📤 Resposta do UTMify", [
                'http_code' => $httpCode,
                'curl_error' => $curlError,
                'response' => $utmifyResponse,
                'response_decoded' => json_decode($utmifyResponse, true)
            ]);
            
            error_log("[Webhook] 📤 Resposta do utmify (HTTP $httpCode): " . $utmifyResponse);
            if ($curlError) {
                error_log("[Webhook] ❌ Erro ao enviar para utmify: " . $curlError);
            } else {
                error_log("[Webhook] 📊 Resposta decodificada: " . print_r(json_decode($utmifyResponse, true), true));
            }
            
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