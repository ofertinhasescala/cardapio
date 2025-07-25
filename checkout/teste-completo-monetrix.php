<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste Completo - Monetrix</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .info { background-color: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        .warning { background-color: #fff3cd; border-color: #ffeaa7; color: #856404; }
        button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #0056b3; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .qr-code { text-align: center; margin: 20px 0; }
        .qr-code img { max-width: 300px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Teste Completo - Integração Monetrix</h1>
        
        <div class="section info">
            <h3>📋 Informações do Teste</h3>
            <p><strong>Data/Hora:</strong> <?= date('d/m/Y H:i:s') ?></p>
            <p><strong>Servidor:</strong> <?= $_SERVER['HTTP_HOST'] ?></p>
            <p><strong>IP:</strong> <?= $_SERVER['REMOTE_ADDR'] ?? 'N/A' ?></p>
        </div>

        <div class="section">
            <h3>🚀 Etapa 1: Teste de Criação de PIX</h3>
            <button onclick="testarCriacaoPix()">Criar PIX de Teste</button>
            <div id="resultado-pix"></div>
        </div>

        <div class="section">
            <h3>🔄 Etapa 2: Simulação de Webhook</h3>
            <button onclick="simularWebhook()" id="btn-webhook" disabled>Simular Webhook de Pagamento</button>
            <div id="resultado-webhook"></div>
        </div>

        <div class="section">
            <h3>✅ Etapa 3: Verificação de Status</h3>
            <button onclick="verificarStatus()" id="btn-verificar" disabled>Verificar Status do Pagamento</button>
            <div id="resultado-verificar"></div>
        </div>

        <div class="section">
            <h3>📊 Logs do Sistema</h3>
            <button onclick="verLogs()">Ver Logs Recentes</button>
            <div id="logs-sistema"></div>
        </div>
    </div>

    <script>
        let transactionId = null;

        async function testarCriacaoPix() {
            const resultDiv = document.getElementById('resultado-pix');
            resultDiv.innerHTML = '<p>🔄 Criando PIX de teste...</p>';

            try {
                // Simular carrinho com produtos reais
                const carrinhoTeste = [
                    {
                        id: 'kit-3-morangos',
                        nome: 'Kit 3 morangos do amor',
                        quantidade: 1,
                        precoPromocional: 19.99
                    },
                    {
                        id: 'kit-6-morangos', 
                        nome: 'Kit 6 morangos do amor',
                        quantidade: 1,
                        precoPromocional: 29.99
                    }
                ];

                const total = carrinhoTeste.reduce((sum, item) => {
                    return sum + (item.precoPromocional * item.quantidade);
                }, 0);

                const dadosTeste = {
                    nome: 'Cliente Teste Monetrix',
                    telefone: '11999999999',
                    email: 'teste.monetrix@email.com',
                    cpf: '12345678901',
                    valor: Math.round(total * 100), // Converter para centavos
                    itens: carrinhoTeste,
                    utm_source: 'teste_completo',
                    utm_campaign: 'monetrix_integration',
                    utm_medium: 'teste',
                    sck: 'SCK123TEST',
                    xcod: 'XCOD456TEST'
                };

                const response = await fetch('./pagamento.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosTeste)
                });

                const data = await response.json();
                
                if (data.success) {
                    transactionId = data.token;
                    
                    let html = '<div class="success">';
                    html += '<h4>✅ PIX Criado com Sucesso!</h4>';
                    html += `<p><strong>ID da Transação:</strong> ${data.token}</p>`;
                    html += `<p><strong>Valor:</strong> R$ ${(data.valor / 100).toFixed(2)}</p>`;
                    html += `<p><strong>Status:</strong> ${data.status || 'Pendente'}</p>`;
                    
                    if (data.pixCode) {
                        html += `<p><strong>Código PIX:</strong> <code>${data.pixCode.substring(0, 50)}...</code></p>`;
                    }
                    
                    if (data.qrCodeUrl) {
                        html += '<div class="qr-code">';
                        html += '<h5>QR Code:</h5>';
                        html += `<img src="${data.qrCodeUrl}" alt="QR Code PIX">`;
                        html += '</div>';
                    }
                    
                    html += '<h5>📊 Logs da Transação:</h5>';
                    html += `<pre>${JSON.stringify(data.logs, null, 2)}</pre>`;
                    html += '</div>';
                    
                    // Habilitar próximos botões
                    document.getElementById('btn-webhook').disabled = false;
                    document.getElementById('btn-verificar').disabled = false;
                    
                } else {
                    html = '<div class="error">';
                    html += '<h4>❌ Erro ao Criar PIX</h4>';
                    html += `<p><strong>Mensagem:</strong> ${data.message}</p>`;
                    if (data.error_details) {
                        html += '<h5>Detalhes do Erro:</h5>';
                        html += `<pre>${JSON.stringify(data.error_details, null, 2)}</pre>`;
                    }
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
                
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ Erro de Conexão</h4>
                        <p><strong>Erro:</strong> ${error.message}</p>
                    </div>
                `;
            }
        }

        async function simularWebhook() {
            if (!transactionId) {
                alert('Primeiro crie um PIX de teste!');
                return;
            }

            const resultDiv = document.getElementById('resultado-webhook');
            resultDiv.innerHTML = '<p>🔄 Simulando webhook de pagamento aprovado...</p>';

            try {
                // Simular webhook da Monetrix
                const webhookData = {
                    type: 'transaction',
                    data: {
                        id: transactionId,
                        status: 'paid',
                        paidAt: new Date().toISOString(),
                        amount: 1000,
                        paidAmount: 1000,
                        customer: {
                            name: 'Cliente Teste Monetrix',
                            email: 'teste.monetrix@email.com',
                            phone: '11999999999',
                            document: {
                                type: 'cpf',
                                number: '12345678901'
                            }
                        },
                        items: [{
                            id: 'PROD_TEST',
                            title: 'Liberação de Benefício',
                            quantity: 1,
                            unitPrice: 1000
                        }],
                        metadata: JSON.stringify({
                            utm_source: 'teste_completo',
                            utm_campaign: 'monetrix_integration',
                            utm_medium: 'teste',
                            sck: 'SCK123TEST',
                            xcod: 'XCOD456TEST'
                        }),
                        fee: {
                            fixedAmount: 50,
                            netAmount: 950
                        }
                    }
                };

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
                    html += '<p>O pagamento foi marcado como aprovado e os dados foram enviados para o UTMify.</p>';
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

        async function verificarStatus() {
            if (!transactionId) {
                alert('Primeiro crie um PIX de teste!');
                return;
            }

            const resultDiv = document.getElementById('resultado-verificar');
            resultDiv.innerHTML = '<p>🔄 Verificando status do pagamento...</p>';

            try {
                const response = await fetch(`./verificar.php?id=${transactionId}`);
                const data = await response.json();
                
                let html = '';
                if (data.success) {
                    html = '<div class="success">';
                    html += '<h4>✅ Status Verificado</h4>';
                    html += `<p><strong>Status:</strong> ${data.status}</p>`;
                    html += `<p><strong>ID:</strong> ${data.transaction_id}</p>`;
                    html += '<h5>📊 Dados Completos:</h5>';
                    html += `<pre>${JSON.stringify(data.data, null, 2)}</pre>`;
                    html += '</div>';
                } else {
                    html = '<div class="error">';
                    html += '<h4>❌ Erro na Verificação</h4>';
                    html += `<p><strong>Mensagem:</strong> ${data.message}</p>`;
                    html += '</div>';
                }
                
                resultDiv.innerHTML = html;
                
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ Erro de Conexão</h4>
                        <p><strong>Erro:</strong> ${error.message}</p>
                    </div>
                `;
            }
        }

        async function verLogs() {
            const resultDiv = document.getElementById('logs-sistema');
            resultDiv.innerHTML = '<p>🔄 Carregando logs do sistema...</p>';

            try {
                // Simular visualização de logs (você pode implementar um endpoint específico)
                const html = `
                    <div class="info">
                        <h4>📋 Logs do Sistema</h4>
                        <p>Para ver os logs detalhados, verifique:</p>
                        <ul>
                            <li><strong>Logs PHP:</strong> Verifique o error_log do servidor</li>
                            <li><strong>Logs UTMify:</strong> checkout/logs/utmify-${new Date().toISOString().split('T')[0]}.log</li>
                            <li><strong>Logs UTMify Pendente:</strong> checkout/logs/utmify-pendente-${new Date().toISOString().split('T')[0]}.log</li>
                        </ul>
                        <p><strong>Dica:</strong> Use <code>tail -f</code> nos arquivos de log para acompanhar em tempo real.</p>
                    </div>
                `;
                
                resultDiv.innerHTML = html;
                
            } catch (error) {
                resultDiv.innerHTML = `
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