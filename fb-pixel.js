// Meta Pixel Code - ID: 1404066580873208
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Inicializar o Pixel com o ID
fbq('init', '1404066580873208');

// Rastrear a visualização da página
fbq('track', 'PageView');

// Funções para rastrear eventos avançados
const fbPixelTracker = {
    pixelId: '1404066580873208',
    
    // Inicializar o pixel
    initialize: function() {
        // A inicialização já foi feita no head da página
        console.log('[FB Pixel] Inicializado');
        
        // Registrar PageView
        this.trackPageView();
    },
    
    // Acompanhar visualização de página
    trackPageView: function() {
        this.sendEvent('PageView');
        this.sendServerEvent('PageView');
    },
    
    // Acompanhar visualização de conteúdo
    viewContent: function(data) {
        this.sendEvent('ViewContent', {
            content_ids: [data.id],
            content_type: 'product',
            value: data.precoPromocional || data.precoOriginal,
            currency: 'BRL'
        });
        
        this.sendServerEvent('ViewContent', data);
    },
    
    // Acompanhar adição ao carrinho
    addToCart: function(data) {
        this.sendEvent('AddToCart', {
            content_ids: [data.id],
            content_type: 'product',
            value: (data.precoPromocional || data.precoOriginal) * (data.quantidade || 1),
            currency: 'BRL'
        });
        
        this.sendServerEvent('AddToCart', data, data.quantidade);
    },
    
    // Acompanhar início de checkout
    initiateCheckout: function(data) {
        this.sendEvent('InitiateCheckout', {
            content_type: 'product',
            contents: data.items,
            value: data.total,
            currency: 'BRL'
        });
        
        this.sendServerEvent('InitiateCheckout', data);
    },
    
    // Acompanhar adição de método de pagamento
    addPaymentInfo: function(data) {
        this.sendEvent('AddPaymentInfo', {
            content_type: 'product',
            contents: data.items,
            value: data.total,
            currency: 'BRL',
            payment_type: data.method
        });
        
        this.sendServerEvent('AddPaymentInfo', data);
    },
    
    // Acompanhar conclusão de compra
    purchase: function(data) {
        this.sendEvent('Purchase', {
            contents: data.items,
            content_type: 'product',
            value: data.total,
            currency: 'BRL',
            transaction_id: data.orderId || ''
        });
        
        this.sendServerEvent('Purchase', data);
    },
    
    // Enviar evento para o pixel
    sendEvent: function(eventName, params = {}) {
        if (typeof fbq !== 'function') {
            console.error('[FB Pixel] fbq não está definido');
            return;
        }
        
        try {
            console.log(`[FB Pixel] Enviando evento ${eventName}`, params);
            fbq('track', eventName, params);
        } catch (e) {
            console.error(`[FB Pixel] Erro ao enviar evento ${eventName}:`, e);
        }
    },
    
    // Enviar evento para o servidor (Conversions API)
    sendServerEvent: function(eventName, eventData = {}, quantity = null) {
        // URL para a API serverless (sem extensão .php)
        const baseUrl = '/api/fb-conversions-api';
        
        // Preparar payload para a API
        const payload = {
            eventName,
            eventData,
            quantity,
            url: window.location.href,
            userAgent: navigator.userAgent,
            fbp: this.getFbp(),
            fbc: this.getFbc()
        };
        
        // Enviar via fetch
        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            mode: 'cors',
            credentials: 'omit'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`CAPI Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`[FB CAPI] Evento ${eventName} enviado com sucesso:`, data);
        })
        .catch(error => {
            console.error(`[FB CAPI] Erro ao enviar evento ${eventName}:`, error);
            
            // Envio de backup para o Pixel se o servidor falhar
            console.log(`[FB Pixel] Enviando evento de backup para ${eventName}`);
            
            // Já temos o evento sendo enviado via Pixel padrão no código principal
        });
    },
    
    // Coletar dados do usuário para enhanced matching
    collectUserData: function() {
        // Tentar obter de campos de formulário ou localStorage
        const userData = {};
        
        // Tentar obter email do cliente salvo
        const clientData = localStorage.getItem('dados_cliente');
        if (clientData) {
            try {
                const parsedData = JSON.parse(clientData);
                if (parsedData.email) userData.em = parsedData.email;
                if (parsedData.telefone) {
                    // Limpar telefone para formato internacional
                    const phone = parsedData.telefone.replace(/\D/g, '');
                    if (phone.length >= 10) userData.ph = phone;
                }
                if (parsedData.nome) {
                    const nameParts = parsedData.nome.split(' ');
                    userData.fn = nameParts[0];
                    if (nameParts.length > 1) userData.ln = nameParts[nameParts.length - 1];
                }
            } catch (e) {
                console.error('Error parsing client data:', e);
            }
        }
        
        return userData;
    },
    
    // Obter o cookie Facebook Browser ID (fbp)
    getFbp: function() {
        const cookies = document.cookie.split(';');
        let fbp = null;
        cookies.forEach(cookie => {
            if (cookie.trim().startsWith('_fbp=')) {
                fbp = cookie.trim().substring(5);
            }
        });
        return fbp;
    },
    
    // Obter o cookie Facebook Click ID (fbc)
    getFbc: function() {
        const cookies = document.cookie.split(';');
        let fbc = null;
        cookies.forEach(cookie => {
            if (cookie.trim().startsWith('_fbc=')) {
                fbc = cookie.trim().substring(5);
            }
        });
        
        // Se não houver fbc, verificar se há fbclid na URL
        if (!fbc) {
            const params = new URLSearchParams(window.location.search);
            const fbclid = params.get('fbclid');
            if (fbclid) {
                fbc = `fb.1.${Date.now()}.${fbclid}`;
            }
        }
        
        return fbc;
    }
};

// Interceptar adição ao carrinho
document.addEventListener('DOMContentLoaded', function() {
    // Rastrear cliques no botão de adicionar ao carrinho
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'textoBotaoAdicionar' || e.target.closest('button[onclick="adicionarProdutoAoCarrinho()"]'))) {
            // Obter dados do produto atual e quantidade
            const produto = window.produtoAtual;
            const quantidade = parseInt(document.getElementById('quantidadeProduto').textContent);
            
            if (produto) {
                setTimeout(() => {
                    // Aguardar um momento para garantir que o produto foi adicionado
                    fbPixelTracker.addToCart(produto, quantidade);
                }, 100);
            }
        }
    });
    
    // Monitorar clique no botão de ir para o checkout
    const checkoutButtons = document.querySelectorAll('button[onclick="abrirCheckout()"]');
    checkoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carrinho = window.carrinho || [];
            if (carrinho.length > 0) {
                const cartData = {
                    items: carrinho.map(item => ({
                        id: item.id,
                        quantity: item.quantidade,
                        price: item.preco
                    })),
                    total: calcularTotalCarrinho()
                };
                
                fbPixelTracker.initiateCheckout(cartData);
            }
        });
    });
    
    // Interceptar visualização de produto
    const originalAbrirModalProduto = window.abrirModalProduto;
    if (originalAbrirModalProduto) {
        window.abrirModalProduto = function(produto) {
            originalAbrirModalProduto(produto);
            fbPixelTracker.viewProduct(produto);
        };
    }
    
    // Interceptar finalização do pagamento
    const pixObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.target && mutation.target.id === 'statusPagamentoPage') {
                const status = mutation.target.textContent;
                if (status && status.includes('Pagamento confirmado')) {
                    // Obter dados do pedido
                    const orderData = {
                        items: window.carrinho || [],
                        total: calcularTotalCarrinho(),
                        orderId: window.transactionId || `order_${Date.now()}`
                    };
                    
                    fbPixelTracker.purchase(orderData);
                }
            }
        });
    });
    
    // Monitorar alterações no elemento de status do pagamento
    const statusElement = document.getElementById('statusPagamentoPage');
    if (statusElement) {
        pixObserver.observe(statusElement, { childList: true, subtree: true, characterData: true });
    }
}); 