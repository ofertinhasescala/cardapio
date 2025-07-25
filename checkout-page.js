// JavaScript para a página de checkout
let etapaAtualCheckoutPage = 1;
let intervalVerificacaoPage = null;

document.addEventListener('DOMContentLoaded', function () {
    feather.replace();
    
    console.log("Checkout inicializado, carregando carrinho...");
    
    // Garantir que o carrinho seja carregado corretamente do localStorage
    try {
        const carrinhoSalvo = localStorage.getItem('carrinho_produtos');
        console.log("Carrinho encontrado no localStorage:", carrinhoSalvo ? "sim" : "não");
        
        if (carrinhoSalvo) {
            try {
                carrinho = JSON.parse(carrinhoSalvo);
                console.log("Carrinho carregado com sucesso:", carrinho.length, "itens");
                
                // Verificar se os itens têm as propriedades esperadas
                if (carrinho.length > 0 && (!carrinho[0].id || !carrinho[0].nome)) {
                    console.warn("Carrinho com formato inesperado:", carrinho);
                    alert("Ocorreu um erro ao carregar seu carrinho. Redirecionando para o carrinho...");
                    window.location.href = 'carrinho.html';
                    return;
                }
            } catch (error) {
                console.error('Erro ao converter carrinho do localStorage:', error);
                carrinho = [];
            }
        } else {
            console.warn("Nenhum carrinho encontrado no localStorage");
            carrinho = [];
        }
    } catch (error) {
        console.error('Erro ao acessar localStorage:', error);
        carrinho = [];
    }

    // Verificar se há itens no carrinho
    if (!carrinho || carrinho.length === 0) {
        console.warn("Carrinho vazio, redirecionando para carrinho.html");
        alert('Seu carrinho está vazio!');
        window.location.href = 'carrinho.html';
        return;
    }

    console.log("Inicializando checkout com", carrinho.length, "itens");
    inicializarCheckoutPage();
});

// Função para inicializar a página de checkout
function inicializarCheckoutPage() {
    etapaAtualCheckoutPage = 1;
    mostrarEtapaCheckoutPage(1);
    configurarMascaraTelefonePage();
    atualizarResumoCheckoutPage();

    // Focar no primeiro campo
    setTimeout(() => {
        document.getElementById('nomeClientePage').focus();
    }, 100);
}

// Função para mostrar etapa específica
function mostrarEtapaCheckoutPage(etapa) {
    // Ocultar todas as etapas
    document.getElementById('checkoutEtapa1Page').classList.add('hidden');
    document.getElementById('checkoutEtapa2Page').classList.add('hidden');
    document.getElementById('checkoutEtapa3Page').classList.add('hidden');

    // Mostrar etapa atual
    document.getElementById(`checkoutEtapa${etapa}Page`).classList.remove('hidden');

    // Atualizar indicadores visuais
    atualizarIndicadoresEtapaPage(etapa);

    // Atualizar texto do botão
    const btnProxima = document.getElementById('btnProximaEtapaPage');
    const textoBotao = document.getElementById('textoBotaoEtapa');

    if (etapa === 1) {
        textoBotao.textContent = 'Continuar';
        btnProxima.onclick = () => proximaEtapaCheckoutPage();
    } else if (etapa === 2) {
        textoBotao.textContent = 'Finalizar Pedido';
        btnProxima.onclick = () => proximaEtapaCheckoutPage();
    } else if (etapa === 3) {
        textoBotao.textContent = 'Aguardando Pagamento...';
        btnProxima.disabled = true;
        btnProxima.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Atualizar resumo
    atualizarResumoCheckoutPage();

    feather.replace();
}

// Função para atualizar indicadores de etapa
function atualizarIndicadoresEtapaPage(etapaAtiva) {
    for (let i = 1; i <= 3; i++) {
        const indicador = document.getElementById(`etapa${i}Indicator`);
        const circulo = indicador.querySelector('div');
        const texto = indicador.querySelector('span');

        if (i <= etapaAtiva) {
            // Etapa ativa ou concluída
            indicador.classList.remove('opacity-50');
            circulo.classList.remove('bg-gray-300', 'text-gray-600');
            circulo.classList.add('bg-red-600', 'text-white');
            texto.classList.remove('text-gray-600');
            texto.classList.add('text-gray-900', 'font-medium');
        } else {
            // Etapa futura
            indicador.classList.add('opacity-50');
            circulo.classList.remove('bg-red-600', 'text-white');
            circulo.classList.add('bg-gray-300', 'text-gray-600');
            texto.classList.remove('text-gray-900', 'font-medium');
            texto.classList.add('text-gray-600');
        }
    }
}

// Função para avançar para próxima etapa
function proximaEtapaCheckoutPage() {
    if (etapaAtualCheckoutPage === 1) {
        if (validarEtapa1Page()) {
            salvarDadosEtapa1Page();
            etapaAtualCheckoutPage = 2;
            mostrarEtapaCheckoutPage(2);
            carregarEnderecoEtapa2Page();
        }
    } else if (etapaAtualCheckoutPage === 2) {
        if (validarEtapa2Page()) {
            etapaAtualCheckoutPage = 3;
            mostrarEtapaCheckoutPage(3);
            iniciarPagamentoPixPage();
        }
    }
}

// Função para configurar máscara de telefone
function configurarMascaraTelefonePage() {
    const inputTelefone = document.getElementById('telefoneClientePage');
    inputTelefone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });
}

// Função para validar etapa 1
function validarEtapa1Page() {
    const nome = document.getElementById('nomeClientePage').value.trim();
    const telefone = document.getElementById('telefoneClientePage').value.trim();

    let valido = true;

    // Validar nome
    if (!nome) {
        mostrarErroPage('erroNomePage', 'Nome é obrigatório');
        valido = false;
    } else if (nome.length < 2) {
        mostrarErroPage('erroNomePage', 'Nome deve ter pelo menos 2 caracteres');
        valido = false;
    } else {
        ocultarErroPage('erroNomePage');
    }

    // Validar telefone
    if (!telefone) {
        mostrarErroPage('erroTelefonePage', 'Telefone é obrigatório');
        valido = false;
    } else if (telefone.length < 14) {
        mostrarErroPage('erroTelefonePage', 'Telefone deve estar completo');
        valido = false;
    } else {
        ocultarErroPage('erroTelefonePage');
    }

    return valido;
}

// Função para salvar dados da etapa 1
function salvarDadosEtapa1Page() {
    dadosCliente = {
        nome: document.getElementById('nomeClientePage').value.trim(),
        telefone: document.getElementById('telefoneClientePage').value.trim(),
        email: 'clienteteste@gmail.com', // Necessário para a API PIX
        cpf: gerarCPF() // Necessário para a API PIX
    };
}

// Função para gerar CPF válido para API PIX
function gerarCPF() {
    // Gera um CPF aleatório válido para testes
    const n = 9;
    const n1 = Math.floor(Math.random() * n);
    const n2 = Math.floor(Math.random() * n);
    const n3 = Math.floor(Math.random() * n);
    const n4 = Math.floor(Math.random() * n);
    const n5 = Math.floor(Math.random() * n);
    const n6 = Math.floor(Math.random() * n);
    const n7 = Math.floor(Math.random() * n);
    const n8 = Math.floor(Math.random() * n);
    const n9 = Math.floor(Math.random() * n);
    
    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    
    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;
    
    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
}

// Função para carregar endereço na etapa 2
function carregarEnderecoEtapa2Page() {
    const enderecoSalvoDiv = document.getElementById('enderecoSalvoPage');
    const semEnderecoDiv = document.getElementById('semEnderecoPage');

    if (enderecoCliente) {
        enderecoSalvoDiv.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start">
                    <i data-feather="check-circle" class="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"></i>
                    <div class="flex-1">
                        <h5 class="font-semibold text-green-800 mb-2">Endereço Confirmado</h5>
                        <div class="text-sm text-green-700 space-y-1">
                            <p><strong>${enderecoCliente.logradouro}, ${enderecoCliente.numero}</strong></p>
                            <p>${enderecoCliente.bairro}</p>
                            <p>${enderecoCliente.cidade} - ${enderecoCliente.uf}</p>
                            <p>CEP: ${enderecoCliente.cep}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        enderecoSalvoDiv.classList.remove('hidden');
        semEnderecoDiv.classList.add('hidden');
    } else {
        enderecoSalvoDiv.classList.add('hidden');
        semEnderecoDiv.classList.remove('hidden');
    }

    feather.replace();
}

// Função para validar etapa 2
function validarEtapa2Page() {
    if (!enderecoCliente) {
        alert('Por favor, informe seu endereço de entrega');
        return false;
    }
    return true;
}

async function iniciarPagamentoPixPage() {
    try {
        console.log("Iniciando processo de pagamento PIX");
        
        // Verificar e manipular elementos com segurança
        const dadosClienteEl = document.getElementById('dadosClientePage');
        const enderecoEl = document.getElementById('enderecoPage');
        const gerandoPixEl = document.getElementById('gerandoPixPage');
        
        // Ocultar elementos da etapa anterior e mostrar elemento de carregamento
        if (dadosClienteEl) dadosClienteEl.classList.add('hidden');
        if (enderecoEl) enderecoEl.classList.add('hidden');
        if (gerandoPixEl) gerandoPixEl.classList.remove('hidden');
        
        // Dados do pedido
        const dadosPedido = {
            nome: document.getElementById('nomeClientePage')?.value || 'Cliente',
            telefone: document.getElementById('telefoneClientePage')?.value || '0000000000',
            email: "cliente@exemplo.com", // Email de exemplo para teste
            endereco: enderecoCliente || {},
            produtos: carrinho,
            valor: calcularResumoCompleto().total * 100, // em centavos
            utm_params: capturarParametrosUTM() // Captura parâmetros UTM usando a função correta
        };

        console.log("Dados do pedido preparados:", dadosPedido);
        
        // Rastrear evento de método de pagamento (AddPaymentInfo)
        if (typeof fbPixelTracker !== 'undefined') {
            console.log("Rastreando evento de AddPaymentInfo");
            fbPixelTracker.addPaymentInfo({
                method: 'pix',
                total: calcularResumoCompleto().total,
                items: carrinho
            });
        }

        // Enviar dados para API
        console.log("Enviando dados para API PIX:", dadosPedido);
        
        // Verificar a URL da API de acordo com o ambiente
        const isProduction = window.location.hostname.includes('vercel.app') || 
                         !window.location.hostname.includes('localhost');
        
        let apiUrl = isProduction ? 
            window.location.origin + '/api/checkout/pagamento.php' : 
            'checkout/pagamento.php';
            
        console.log("URL da API PIX:", apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dadosPedido),
            mode: 'cors',
            credentials: 'omit'
        });

        console.log("Resposta da API PIX - Status:", response.status);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        // Processar resposta da API
        const dadosPagamento = await response.json();
        console.log("Dados do pagamento recebidos:", dadosPagamento);
        
        if (!dadosPagamento.success) {
            throw new Error(dadosPagamento.message || "Erro ao gerar PIX");
        }
        
        // Exibir PIX
        exibirPixGeradoPage(dadosPagamento);
        
        // Iniciar verificação de pagamento
        setTimeout(() => {
            iniciarVerificacaoPagamentoPage(dadosPagamento);
        }, 5000);
        
    } catch (error) {
        console.error("Erro ao gerar PIX:", error);
        alert(`Erro ao gerar PIX. Tente novamente: ${error.message}`);
        
        // Voltar para a etapa anterior - verificar elementos primeiro
        const gerandoPixEl = document.getElementById('gerandoPixPage');
        const metodosPageEl = document.getElementById('metodosPagamentoPage');
        
        if (gerandoPixEl) gerandoPixEl.classList.add('hidden');
        
        // Se o elemento de métodos de pagamento não existir, voltar para a etapa anterior
        if (metodosPageEl) {
            metodosPageEl.classList.remove('hidden');
        } else {
            // Voltar para etapa 2 como fallback
            etapaAtualCheckoutPage = 2;
            mostrarEtapaCheckoutPage(2);
        }
    }
}

// Função para exibir PIX gerado
function exibirPixGeradoPage(dadosPix) {
    console.log("Exibindo dados PIX:", dadosPix);

    // Verificar e manipular elementos com segurança
    const gerandoPixEl = document.getElementById('gerandoPixPage');
    const pixGeradoEl = document.getElementById('pixGeradoPage');
    
    // Alternar visibilidade dos elementos
    if (gerandoPixEl) gerandoPixEl.classList.add('hidden');
    if (pixGeradoEl) pixGeradoEl.classList.remove('hidden');

    // Preencher dados do PIX
    const qrCodeImage = document.getElementById('qrCodeImagePage');
    const codigoPixInput = document.getElementById('codigoPixPage');
    
    // Definir QR Code se disponível e o elemento existir
    if (dadosPix.qrCodeUrl && qrCodeImage) {
        qrCodeImage.src = dadosPix.qrCodeUrl;
        qrCodeImage.alt = "QR Code PIX para pagamento";
    }
    
    // O código PIX pode estar em campos diferentes dependendo da API
    const pixCode = dadosPix.pixCode || dadosPix.code || 
                   (dadosPix.pix && dadosPix.pix.code) || 
                   dadosPix.qrCode || dadosPix.qrcode;
    
    // Definir código PIX se disponível e o elemento existir
    if (pixCode && codigoPixInput) {
        codigoPixInput.value = pixCode;
    } else if (codigoPixInput) {
        codigoPixInput.value = "Erro ao gerar código PIX";
        console.error("Código PIX não encontrado na resposta", dadosPix);
    }

    // Atualizar os ícones feather se disponível
    if (typeof feather !== 'undefined' && feather.replace) {
        feather.replace();
    }
}

// Função para copiar código PIX
function copiarCodigoPixPage() {
    const codigoPix = document.getElementById('codigoPixPage');
    codigoPix.select();
    document.execCommand('copy');

    // Feedback visual
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    feedback.innerHTML = `
        <div class="flex items-center">
            <i data-feather="check" class="w-4 h-4 mr-2"></i>
            <span>Código PIX copiado!</span>
        </div>
    `;

    document.body.appendChild(feedback);
    feather.replace();

    setTimeout(() => {
        feedback.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        feedback.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 3000);
}

// Função para iniciar verificação de pagamento
function iniciarVerificacaoPagamentoPage(transactionId) {
    let tentativas = 0;
    const maxTentativas = 60; // 5 minutos (5 segundos * 60)

    console.log(`Iniciando verificação do pagamento: ${transactionId}`);
    
    intervalVerificacaoPage = setInterval(async () => {
        tentativas++;
        console.log(`Verificando pagamento (tentativa ${tentativas}/${maxTentativas})`);

        try {
            // URL da API de verificação de acordo com o ambiente
            const isProduction = window.location.hostname.includes('vercel.app') || 
                             !window.location.hostname.includes('localhost');
            
            const verificarUrl = isProduction ? 
                `${window.location.origin}/api/checkout/verificar.php?id=${transactionId}` : 
                `checkout/verificar.php?id=${transactionId}`;
                
            console.log(`URL de verificação: ${verificarUrl}`);
            
            // Fazer chamada real para API de verificação
            const response = await fetch(verificarUrl);
            if (!response.ok) {
                throw new Error(`Erro na API de verificação: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Status do pagamento: ${data.status}`, data);
            
            // Atualizar status na interface
            const statusElement = document.getElementById('statusPagamentoPage');
            
            if (data.status === 'paid' || data.status === 'approved') {
                // Pagamento aprovado
                clearInterval(intervalVerificacaoPage);
                exibirPagamentoConfirmadoPage({
                    transactionId: transactionId,
                    status: 'paid',
                    paidAt: new Date().toISOString()
                });
            } 
            else if (data.status === 'pending') {
                // Ainda aguardando pagamento
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="flex items-center">
                            <div class="animate-pulse w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                            <span class="text-sm font-medium text-yellow-800">Aguardando pagamento... (${tentativas})</span>
                        </div>
                    `;
                }
            } 
            else if (data.status === 'error' || data.status === 'failed' || data.status === 'canceled') {
                // Pagamento falhou
                clearInterval(intervalVerificacaoPage);
                
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                            <span class="text-sm font-medium text-red-800">Pagamento falhou: ${data.message || 'Erro desconhecido'}</span>
                        </div>
                    `;
                }
            }
            
            // Verificar timeout
            if (tentativas >= maxTentativas) {
                clearInterval(intervalVerificacaoPage);
                alert('Tempo limite para pagamento excedido. Você pode tentar escanear o código novamente ou iniciar um novo pedido.');
            }

        } catch (error) {
            console.error('Erro ao verificar pagamento:', error);
            
            // Se houver muitos erros consecutivos, podemos parar de verificar
            if (tentativas >= 10) {
                clearInterval(intervalVerificacaoPage);
                alert('Não foi possível verificar o status do pagamento. Por favor, atualize a página ou entre em contato com o suporte.');
            }
        }
    }, 5000); // Verificar a cada 5 segundos
}

// Função para exibir confirmação de pagamento
function exibirPagamentoConfirmadoPage(dadosPagamento) {
    console.log("Exibindo confirmação de pagamento:", dadosPagamento);

    // Verificar e manipular elementos com segurança
    const gerandoPixEl = document.getElementById('gerandoPixPage');
    const pixGeradoEl = document.getElementById('pixGeradoPage');
    const pagamentoConfirmadoEl = document.getElementById('pagamentoConfirmadoPage');
    
    // Alternar visibilidade dos elementos
    if (gerandoPixEl) gerandoPixEl.classList.add('hidden');
    if (pixGeradoEl) pixGeradoEl.classList.add('hidden');
    if (pagamentoConfirmadoEl) pagamentoConfirmadoEl.classList.remove('hidden');

    // Salvar o ID da transação para referência
    window.transactionId = dadosPagamento.id || dadosPagamento.transactionId || dadosPagamento.token;

    // Rastrear evento de compra (Purchase)
    if (typeof fbPixelTracker !== 'undefined') {
        fbPixelTracker.purchase({
            items: carrinho.map(item => ({
                id: item.id,
                quantity: item.quantidade,
                price: item.preco
            })),
            total: calcularResumoCompleto().total,
            orderId: window.transactionId || `order_${Date.now()}`
        });
    }

    // Limpar carrinho após pagamento confirmado
    setTimeout(() => {
        try {
            localStorage.removeItem('carrinho_produtos');
            carrinho = [];
            console.log("Carrinho limpo após confirmação de pagamento");
        } catch (error) {
            console.error("Erro ao limpar carrinho:", error);
        }
    }, 1000); // Aguardar um pouco para garantir que o usuário veja a mensagem

    // Exibir resumo final
    exibirResumoFinalPedidoPage();

    // Gerar protocolo
    const protocolo = `PG${Date.now().toString().slice(-6)}`;
    const protocoloEl = document.getElementById('protocoloPedidoPage');
    if (protocoloEl) protocoloEl.textContent = protocolo;

    // Atualizar endereço de entrega
    const enderecoEntregaEl = document.getElementById('enderecoEntregaPage');
    if (enderecoEntregaEl && enderecoCliente) {
        enderecoEntregaEl.textContent =
            `${enderecoCliente.logradouro}, ${enderecoCliente.numero}, ${enderecoCliente.bairro}, ${enderecoCliente.cidade} - ${enderecoCliente.uf}`;
    }

    // Atualizar botão
    const btnProxima = document.getElementById('btnProximaEtapaPage');
    const textoBotao = document.getElementById('textoBotaoEtapa');
    
    if (textoBotao) textoBotao.textContent = 'Finalizar';
    
    if (btnProxima) {
        btnProxima.disabled = false;
        btnProxima.classList.remove('opacity-50', 'cursor-not-allowed');
        btnProxima.onclick = () => {
            // Limpar carrinho e voltar para início
            limparCarrinho();
            window.location.href = 'index.html';
        };
    }

    // Atualizar os ícones feather se disponível
    if (typeof feather !== 'undefined' && feather.replace) {
        feather.replace();
    }
}

// Função para exibir resumo final do pedido
function exibirResumoFinalPedidoPage() {
    const resumoContainer = document.getElementById('resumoFinalPedidoPage');
    const resumoPedido = calcularResumoCompleto();

    resumoContainer.innerHTML = `
        <div class="space-y-3">
            <div class="space-y-2">
                ${resumoPedido.itens.map(item => `
                    <div class="flex justify-between items-center py-1 border-b border-green-100 last:border-b-0">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="font-medium text-green-800">${item.quantidade}x</span>
                                <span class="text-green-700">${item.nome}</span>
                            </div>
                            <div class="text-xs text-green-600">
                                Unit: R$ ${item.precoUnitario.toFixed(2).replace('.', ',')}
                                ${item.economiaItem > 0 ? ` • Economia: R$ ${item.economiaItem.toFixed(2).replace('.', ',')}` : ''}
                            </div>
                        </div>
                        <div class="font-semibold text-green-800">
                            R$ ${item.subtotalItem.toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="border-t border-green-300 pt-3 space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-green-700">Subtotal:</span>
                    <span class="text-green-800">R$ ${resumoPedido.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                
                ${resumoPedido.economiaTotal > 0 ? `
                    <div class="flex justify-between text-sm">
                        <span class="text-green-600">Desconto aplicado:</span>
                        <span class="text-green-600 font-medium">-R$ ${resumoPedido.economiaTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                ` : ''}
                
                <div class="flex justify-between text-sm">
                    <span class="text-green-700">Taxa de entrega:</span>
                    <span class="text-green-800 font-medium">${resumoPedido.taxaEntrega === 0 ? 'Grátis' : 'R$ ' + resumoPedido.taxaEntrega.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div class="flex justify-between font-bold text-base border-t border-green-400 pt-2 bg-green-50 -mx-2 px-2 py-2 rounded">
                    <span class="text-green-800">Total Pago:</span>
                    <span class="text-green-800 text-lg">R$ ${resumoPedido.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    `;
}

// Função para atualizar resumo do checkout
function atualizarResumoCheckoutPage() {
    const resumoContainer = document.getElementById('resumoCheckoutPage');
    const totalElement = document.getElementById('totalCheckoutPage');

    if (carrinho.length === 0) {
        resumoContainer.innerHTML = '<p class="text-gray-500 text-sm">Nenhum item no carrinho</p>';
        totalElement.textContent = 'R$ 0,00';
        return;
    }

    const resumoPedido = calcularResumoCompleto();

    resumoContainer.innerHTML = `
        <div class="space-y-3">
            <div class="space-y-2 max-h-32 overflow-y-auto">
                ${resumoPedido.itens.slice(0, 3).map(item => `
                    <div class="flex justify-between text-sm">
                        <span class="truncate pr-2">${item.quantidade}x ${item.nome}</span>
                        <span class="flex-shrink-0">R$ ${item.subtotalItem.toFixed(2).replace('.', ',')}</span>
                    </div>
                `).join('')}
                ${resumoPedido.itens.length > 3 ? `
                    <div class="text-xs text-gray-500 text-center">
                        +${resumoPedido.itens.length - 3} ${resumoPedido.itens.length - 3 === 1 ? 'item' : 'itens'} adicional${resumoPedido.itens.length - 3 === 1 ? '' : 'is'}
                    </div>
                ` : ''}
            </div>
            
            <div class="space-y-1 pt-2 border-t border-gray-200 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal:</span>
                    <span>R$ ${resumoPedido.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                ${resumoPedido.economiaTotal > 0 ? `
                    <div class="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span>-R$ ${resumoPedido.economiaTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between">
                    <span class="text-gray-600">Entrega:</span>
                    <span class="text-green-600">${resumoPedido.taxaEntrega === 0 ? 'Grátis' : 'R$ ' + resumoPedido.taxaEntrega.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    `;

    totalElement.textContent = `R$ ${resumoPedido.total.toFixed(2).replace('.', ',')}`;
}

// Funções auxiliares
function mostrarErroPage(elementoId, mensagem) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = mensagem;
    elemento.classList.remove('hidden');
}

function ocultarErroPage(elementoId) {
    const elemento = document.getElementById(elementoId);
    elemento.classList.add('hidden');
}

function capturarParametrosUTM() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || ''
    };
}

// Funções de navegação
function voltarParaCarrinho() {
    window.location.href = 'carrinho.html';
}

function solicitarNovoEndereco() {
    window.location.href = 'index.html#endereco';
}

function alterarEndereco() {
    if (confirm('Deseja alterar seu endereço? Você será redirecionado para a página inicial.')) {
        localStorage.removeItem('endereco_cliente');
        window.location.href = 'index.html';
    }
}

// Limpar intervalo quando sair da página
window.addEventListener('beforeunload', function () {
    if (intervalVerificacaoPage) {
        clearInterval(intervalVerificacaoPage);
    }
});