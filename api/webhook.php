<?php
// Webhook para receber notificações da Monetrix (PIX)
header('Content-Type: application/json');

// Habilita o log de erros
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Log para depuração
error_log("[Webhook] 🔔 Webhook recebido");
error_log("[Webhook] 📝 Método: " . $_SERVER['REQUEST_METHOD']);
error_log("[Webhook] 📦 Input bruto: " . file_get_contents('php://input'));

// Verificar se é uma solicitação POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Receber dados do webhook
$payload = json_decode(file_get_contents('php://input'), true);
if (!$payload) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido']);
    exit;
}

error_log("[Webhook] 📊 Payload decodificado: " . json_encode($payload, JSON_UNESCAPED_UNICODE));

// Verificar se tem as informações necessárias
if (!isset($payload['event']) || !isset($payload['data']) || !isset($payload['data']['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido - dados insuficientes']);
    exit;
}

$event = $payload['event'];
$data = $payload['data'];
$transaction_id = $data['id'];

// Validar o webhook (opcional, mas recomendado)
$webhookSecret = getenv('PIX_WEBHOOK_SECRET') ?: 'seu_secret_de_webhook';
$signature = $_SERVER['HTTP_X_SIGNATURE'] ?? null;

if ($signature) {
    $computedSignature = hash_hmac('sha256', file_get_contents('php://input'), $webhookSecret);
    if ($signature !== $computedSignature) {
        error_log("[Webhook] ⚠️ Assinatura inválida");
        http_response_code(401);
        echo json_encode(['error' => 'Assinatura inválida']);
        exit;
    }
    error_log("[Webhook] ✅ Assinatura validada com sucesso");
}

// Processar o evento com base no tipo
try {
    // Caminho do banco de dados - Usando variáveis de ambiente para Vercel
    $dbPath = getenv('DB_PATH') ?: '/tmp/database.sqlite';
    
    // Conecta ao SQLite (arquivo de banco de dados)
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se a tabela 'pedidos' existe e cria se necessário
    $db->exec("CREATE TABLE IF NOT EXISTS pedidos (
        transaction_id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        valor INTEGER NOT NULL,
        nome TEXT,
        email TEXT,
        cpf TEXT,
        utm_params TEXT,
        created_at TEXT,
        updated_at TEXT
    )");

    // Processar eventos de pagamento
    if ($event === 'transaction.updated' || $event === 'pix.updated') {
        $status = $data['status'] ?? 'unknown';
        
        // Mapear status da transação
        $mappedStatus = match($status) {
            'pending' => 'pending',
            'processing' => 'pending',
            'approved', 'paid', 'completed' => 'paid',
            'failed', 'canceled', 'rejected', 'error' => 'failed',
            default => 'unknown'
        };
        
        error_log("[Webhook] 🔄 Status da transação: $status => $mappedStatus");

        // Verificar se a transação já existe
        $stmt = $db->prepare("SELECT * FROM pedidos WHERE transaction_id = :transaction_id");
        $stmt->execute(['transaction_id' => $transaction_id]);
        $pedido = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($pedido) {
            // Atualizar registro existente
            $stmt = $db->prepare("UPDATE pedidos SET status = :status, updated_at = :updated_at WHERE transaction_id = :transaction_id");
            $stmt->execute([
                'status' => $mappedStatus,
                'updated_at' => date('Y-m-d H:i:s'),
                'transaction_id' => $transaction_id
            ]);
            error_log("[Webhook] ✏️ Registro atualizado no banco de dados");
        } else {
            // Criar novo registro
            $stmt = $db->prepare("INSERT INTO pedidos (transaction_id, status, valor, nome, email, cpf, created_at, updated_at) VALUES (:transaction_id, :status, :valor, :nome, :email, :cpf, :created_at, :updated_at)");
            $stmt->execute([
                'transaction_id' => $transaction_id,
                'status' => $mappedStatus,
                'valor' => $data['amount'] ?? 0,
                'nome' => $data['customer']['name'] ?? '',
                'email' => $data['customer']['email'] ?? '',
                'cpf' => $data['customer']['document'] ?? '',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
            error_log("[Webhook] 📝 Novo registro criado no banco de dados");
        }
        
        // Responder ao webhook
        echo json_encode([
            'success' => true,
            'message' => 'Webhook processado com sucesso',
            'processed_event' => $event,
            'transaction_id' => $transaction_id,
            'status' => $mappedStatus
        ]);
    } else {
        // Evento desconhecido ou não processado
        error_log("[Webhook] ⚠️ Evento desconhecido: $event");
        echo json_encode([
            'success' => true,
            'message' => 'Evento não processado',
            'event' => $event
        ]);
    }
} catch (Exception $e) {
    error_log("[Webhook] ❌ Erro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno ao processar webhook',
        'message' => getenv('ENVIRONMENT') === 'development' ? $e->getMessage() : 'Erro interno'
    ]);
} 