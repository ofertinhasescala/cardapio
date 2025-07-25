# Sistema de Rastreamento de Pixel do Facebook

Este projeto implementa um sistema avançado de rastreamento do Facebook Pixel, que inclui tanto o rastreamento do lado do cliente (Meta Pixel) quanto o rastreamento do lado do servidor (Conversions API).

## Configuração

- **Pixel ID:** 1404066580873208
- **API Access Token:** EAAiRE5K8xWsBPMFziWRfy0NKYPvqhzAmMuqGGTdfQRPikqRlXFRDmRRTcL3xD6vjbcQ6zXQZB1ViKHx6GvUSiExWHksTiZBiPYJAVcBJXpmEnkOEMQrjYVRLFFn83iOiKTAx77uoyOqIDt619kSnzXIlZBLKJf9ezmGLOYuwPnfnAiefOdElfBmJJOp1AZDZD

## Arquivos Implementados

1. **fb-pixel.js**: Implementa o rastreamento do lado do cliente (browser) e a integração com a Conversions API.
2. **fb-conversions-api.php**: Implementa o rastreamento do lado do servidor para maior precisão e confiabilidade dos dados.

## Eventos Rastreados

O sistema rastreia os seguintes eventos do fluxo de compra:

1. **PageView**: Visualização de qualquer página
2. **ViewContent**: Visualização de detalhes de um produto
3. **AddToCart**: Adição de produtos ao carrinho
4. **InitiateCheckout**: Início do processo de checkout
5. **AddPaymentInfo**: Adição de informações de pagamento
6. **Purchase**: Conclusão de compra

## Recursos Avançados Implementados

### Enhanced Matching

O sistema coleta automaticamente e processa com hash os seguintes dados para melhorar a precisão do rastreamento:

- Email
- Telefone
- Nome
- Sobrenome
- Endereço IP (com hash)
- User agent

### Deduplicação de Eventos

Para evitar contagem duplicada de eventos, cada evento recebe um ID único que é enviado tanto para o Pixel quanto para a Conversions API.

### Rastreamento de Parâmetros de UTM

O sistema captura automaticamente parâmetros UTM para melhorar a atribuição de campanhas.

### FBP e FBC

O sistema rastreia cookies _fbp (Facebook Browser ID) e _fbc (Facebook Click ID) para melhorar a correspondência de eventos entre browser e servidor.

## Como Funciona

1. **Lado do Cliente (fb-pixel.js)**:
   - Inicializa o Meta Pixel standard
   - Intercepta eventos do site (cliques em botões, visualizações de produto, etc.)
   - Envia eventos para o Facebook via Pixel
   - Envia eventos para o backend para processamento pela Conversions API

2. **Lado do Servidor (fb-conversions-api.php)**:
   - Recebe eventos do frontend
   - Aplica hash nos dados pessoais conforme exigido pelo Facebook
   - Envia eventos para o Facebook via API HTTP
   - Registra eventos para depuração

## Logs e Depuração

O sistema mantém logs detalhados de todos os eventos enviados para a Conversions API no arquivo `fb-conversions-log.txt`.

## Modo de Teste

O sistema está configurado com o parâmetro `test_event_code: 'TEST72973'` para facilitar a depuração no Facebook Events Manager. **Remova este parâmetro antes de colocar em produção.**

## Segurança

- Os dados pessoais (email, telefone, etc.) são processados com hash SHA-256 conforme exigido pelo Facebook
- Os IPs são anonimizados com hash antes de serem enviados
- Nenhuma informação sensível é armazenada localmente

## Integrações Feitas

1. **app.js**: Interceptação de ações gerais do site
2. **carrinho-page.js**: Rastreamento de eventos de carrinho e início de checkout
3. **checkout-page.js**: Rastreamento de eventos de pagamento e conclusão de compra
4. **index.html**, **carrinho.html**, **checkout.html**: Inclusão do código base do Pixel e do script avançado de rastreamento 