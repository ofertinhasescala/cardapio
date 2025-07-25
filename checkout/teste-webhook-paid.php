<?php
header('Content-Type: text/html; charset=utf-8');

// Pegar ID da transação da URL ou usar um padrão
$transactionId = $_GET['id'] ?? '12070542'; // ID de exemplo

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste Webhook - Pagamento Aprovado</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .info { background-color: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        button { padding: 10px 20px; margin: 5px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #218838; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Teste Webhook - Pagamento Aprovado</h1>
        
        <div class="section info">
            <h3>📋 Sobre este Teste</h3>
            <p>Este teste simula um webhook da Monetrix informando que um pagamento foi aprovado.</p>
            <p><strong>Data/Hora:</strong> <?= date('d/m/Y H:i:s') ?></p>
        </div>

        <div class="section">
            <h3>🔧 Configuração do Teste</h3>
            <label>ID da Transação:</label>
            <input type="text" id="transactionId" value="<?= htmlspecialchars($transactionId) ?>" placeholder="12070542">
            <br><br>
            <label>Status do Pagamento:</label>
            <select id="paymentStatus">
                <option value="paid">paid</option>
                <option value="approved">approved</option>
                <option value="pago">pago</option>
                <option value="PAID">PAID</option>
            </select>
        </div>

        <div class="section">
            <h3>🚀 Simular Webhook</h3>
            <button onclick="simularWebhookPaid()">Simular Pagamento Aprovado</button>
            <button onclick="simularWebhookMonetrix()">Simular Webhook Monetrix Completo</button>
            <div id="resultado-webhook"></div>
        </div>

        <div class="section">
            <h3>📊 Logs do Webhook</h3>
            <button onclick="verLogsWebhook()">Ver Logs do Webhook</button>
            <div id="logs-webhook"></div>
        </div>
    </div>

    <script>
        async function simularWebhookPaid() {
            const resultDiv = document.getElementById('resultado-webhook');
            const transactionId = document.getElementById('transactionId').value;
            const status = document.getElementById('paymentStatus').value;
            
            resultDiv.innerHTML = '<p>🔄 Simulando webhook de pagamento aprovado...</p>';

            // Webhook simples
            const webhookData = {
                id: transactionId,
                status: status,
                paidAt: new Date().toISOString(),
                amount: 4998,
                paidAmount: 4998
            };

            try {
                const response = await fetch('./webhook.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(webhookData)
                });

                const data = await response.json();
                
                let html = '';
                if (response.ok && data.success) {
                    html = '<div class="success">';
                    html += '<h4>✅ Webhook Processado com Sucesso!</h4>';
                    html += '<p>O pagamento foi processado e enviado para o UTMify.</p>';
                    html += '</div>';
                } else {
                    html = '<div class="error">';
                    html += '<h4>❌ Erro no Webhook</h4>';
                    html += `<p><strong>Status HTTP:</strong> ${response.status}</p>`;
                    html += `<p><strong>Resposta:</strong> ${JSON.stringify(data)}</p>`;
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
                
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ Erro ao Simular Webhook</h4>
                        <p><strong>Erro:</strong> ${error.message}</p>
                    </div>
                `;
            }
        }

        async function simularWebhookMonetrix() {
            const resultDiv = document.getElementById('resultado-webhook');
            const transactionId = document.getElementById('transactionId').value;
            const status = document.getElementById('paymentStatus').value;
            
            resultDiv.innerHTML = '<p>🔄 Simulando webhook completo da Monetrix...</p>';

            // Webhook no formato completo da Monetrix
            const webhookData = {
                type: 'transaction',
                data: {
                    id: transactionId,
                    status: status,
                    paidAt: new Date().toISOString(),
                    amount: 4998,
                    paidAmount: 4998,
                    customer: {
                        name: 'Cliente Teste Webhook',
                        email: 'teste.webhook@email.com',
                        phone: '11999999999',
                        document: {
                            type: 'cpf',
                            number: '12345678901'
                        }
                    },
                    items: [{
                        title: 'Kit 3 morangos do amor',
                        quantity: 1,
                        unitPrice: 1999
                    }, {
                        title: 'Kit 6 morangos do amor',
                        quantity: 1,
                        unitPrice: 2999
                    }],
                    metadata: JSON.stringify({
                        utm_source: 'teste_webhook',
                        utm_campaign: 'webhook_paid',
                        utm_medium: 'teste'
                    }),
                    fee: {
                        fixedAmount: 249,
                        netAmount: 4749
                    }
                }
            };

            try {
                const response = await fetch('./webhook.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(webhookData)
                });

                const data = await response.json();
                
                let html = '';
                if (response.ok && data.success) {
                    html = '<div class="success">';
                    html += '<h4>✅ Webhook Monetrix Processado com Sucesso!</h4>';
                    html += '<p>O pagamento foi processado no formato completo da Monetrix.</p>';
                    html += '</div>';
                } else {
                    html = '<div class="error">';
                    html += '<h4>❌ Erro no Webhook Monetrix</h4>';
                    html += `<p><strong>Status HTTP:</strong> ${response.status}</p>`;
                    html += `<p><strong>Resposta:</strong> ${JSON.stringify(data)}</p>`;
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
                
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ Erro ao Simular Webhook Monetrix</h4>
                        <p><strong>Erro:</strong> ${error.message}</p>
                    </div>
                `;
            }
        }

        async function verLogsWebhook() {
            const logsDiv = document.getElementById('logs-webhook');
            logsDiv.innerHTML = '<p>🔄 Carregando logs do webhook...</p>';

            try {
                // Simular visualização de logs
                const hoje = new Date().toISOString().split('T')[0];
                const html = `
                    <div class="info">
                        <h4>📋 Logs do Webhook</h4>
                        <p>Para ver os logs detalhados do webhook, verifique:</p>
                        <ul>
                            <li><strong>Logs do Webhook:</strong> checkout/logs/webhook-${hoje}.log</li>
                            <li><strong>Logs UTMify:</strong> checkout/logs/utmify-${hoje}.log</li>
                            <li><strong>Logs PHP:</strong> Verifique o error_log do servidor</li>
                        </ul>
                        <p><strong>Comando para acompanhar:</strong></p>
                        <pre>tail -f checkout/logs/webhook-${hoje}.log</pre>
                    </div>
                `;
                
                logsDiv.innerHTML = html;
                
            } catch (error) {
                logsDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ Erro ao Carregar Logs</h4>
                        <p><strong>Erro:</strong> ${error.message}</p>
                    </div>
                `;
            }
        }
    </script>
</body>
</html>