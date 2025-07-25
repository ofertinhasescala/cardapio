<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste - Produtos no PIX</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .info { background-color: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #0056b3; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .produto { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .produto h4 { margin: 0 0 10px 0; color: #333; }
        .produto .preco { font-weight: bold; color: #28a745; }
        .produto .quantidade { color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Teste - Nomes dos Produtos no PIX</h1>
        
        <div class="section info">
            <h3>📋 Sobre este Teste</h3>
            <p>Este teste verifica se os nomes dos produtos do carrinho aparecem corretamente na geração do PIX.</p>
            <p><strong>Data/Hora:</strong> <?= date('d/m/Y H:i:s') ?></p>
        </div>

        <div class="section">
            <h3>🛒 Carrinho de Teste</h3>
            <div id="carrinho-produtos">
                <div class="produto">
                    <h4>Kit 3 morangos do amor</h4>
                    <div class="preco">R$ 19,99</div>
                    <div class="quantidade">Quantidade: 2</div>
                </div>
                <div class="produto">
                    <h4>Kit 6 morangos do amor</h4>
                    <div class="preco">R$ 29,99</div>
                    <div class="quantidade">Quantidade: 1</div>
                </div>
                <div class="produto">
                    <h4>Kit 3 uvas do amor</h4>
                    <div class="preco">R$ 19,99</div>
                    <div class="quantidade">Quantidade: 1</div>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <strong>Total: R$ 89,97</strong>
            </div>
        </div>

        <div class="section">
            <h3>🚀 Teste de Geração de PIX</h3>
            <button onclick="testarPixComProdutos()">Gerar PIX com Produtos</button>
            <div id="resultado-pix"></div>
        </div>

        <div class="section">
            <h3>📊 Dados Enviados</h3>
            <div id="dados-enviados"></div>
        </div>
    </div>

    <script>
        async function testarPixComProdutos() {
            const resultDiv = document.getElementById('resultado-pix');
            const dadosDiv = document.getElementById('dados-enviados');
            
            resultDiv.innerHTML = '<p>🔄 Gerando PIX com produtos do carrinho...</p>';

            // Simular carrinho com produtos reais
            const carrinhoTeste = [
                {
                    id: 'kit-3-morangos',
                    nome: 'Kit 3 morangos do amor',
                    tipo: 'morango',
                    quantidade: 2,
                    precoOriginal: 29.80,
                    precoPromocional: 19.99,
                    categoria: 'frutas-do-amor'
                },
                {
                    id: 'kit-6-morangos',
                    nome: 'Kit 6 morangos do amor',
                    tipo: 'morango',
                    quantidade: 1,
                    precoOriginal: 45.80,
                    precoPromocional: 29.99,
                    categoria: 'frutas-do-amor'
                },
                {
                    id: 'kit-3-uvas',
                    nome: 'Kit 3 uvas do amor',
                    tipo: 'uva',
                    quantidade: 1,
                    precoOriginal: 29.80,
                    precoPromocional: 19.99,
                    categoria: 'frutas-do-amor'
                }
            ];

            // Calcular total
            const total = carrinhoTeste.reduce((sum, item) => {
                const preco = item.precoPromocional || item.precoOriginal;
                return sum + (preco * item.quantidade);
            }, 0);

            const dadosEnvio = {
                nome: 'Cliente Teste Produtos',
                telefone: '11999999999',
                email: 'teste.produtos@email.com',
                cpf: '12345678901',
                valor: Math.round(total * 100), // Converter para centavos
                itens: carrinhoTeste,
                utm_source: 'teste_produtos',
                utm_campaign: 'teste_nomes_produtos',
                utm_medium: 'teste'
            };

            // Mostrar dados que serão enviados
            dadosDiv.innerHTML = `
                <div class="info">
                    <h4>📦 Dados que serão enviados para pagamento.php:</h4>
                    <pre>${JSON.stringify(dadosEnvio, null, 2)}</pre>
                </div>
            `;

            try {
                const response = await fetch('./pagamento.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosEnvio)
                });

                const data = await response.json();
                
                if (data.success) {
                    let html = '<div class="success">';
                    html += '<h4>✅ PIX Gerado com Sucesso!</h4>';
                    html += `<p><strong>ID da Transação:</strong> ${data.token}</p>`;
                    html += `<p><strong>Valor Total:</strong> R$ ${(data.valor / 100).toFixed(2)}</p>`;
                    
                    if (data.pixCode) {
                        html += `<p><strong>Código PIX:</strong> <code>${data.pixCode.substring(0, 50)}...</code></p>`;
                    }
                    
                    if (data.qrCodeUrl) {
                        html += '<div style="text-align: center; margin: 20px 0;">';
                        html += '<h5>QR Code:</h5>';
                        html += `<img src="${data.qrCodeUrl}" alt="QR Code PIX" style="max-width: 300px;">`;
                        html += '</div>';
                    }
                    
                    // Mostrar logs da transação para verificar se os produtos foram processados
                    if (data.logs && data.logs.monetrixResponse) {
                        html += '<h5>📋 Dados Enviados para Monetrix:</h5>';
                        html += `<pre>${JSON.stringify(data.logs.monetrixResponse, null, 2)}</pre>`;
                    }
                    
                    html += '<h5>📊 Logs Completos:</h5>';
                    html += `<pre>${JSON.stringify(data.logs, null, 2)}</pre>`;
                    html += '</div>';
                    
                } else {
                    html = '<div class="error">';
                    html += '<h4>❌ Erro ao Gerar PIX</h4>';
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
    </script>
</body>
</html>