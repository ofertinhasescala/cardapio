# Requirements Document

## Introduction

Este documento define os requisitos para criar uma página de produto completa e funcional para um e-commerce de frutas gourmet, incluindo sistema de localização por CEP, checkout em 3 etapas e integração com pagamento PIX. O sistema deve ser visualmente atraente, fluido e funcional, oferecendo uma experiência de compra simplificada para produtos entregues por motoboys.

## Requirements

### Requirement 1 - Sistema de Localização por CEP (Evolução do Sistema Atual)

**User Story:** Como um usuário, eu quero informar meu CEP para que o sistema identifique minha localização e calcule a distância do restaurante mais próximo, substituindo o sistema atual de estado/cidade.

#### Acceptance Criteria

1. WHEN o usuário acessa a página THEN o sistema SHALL exibir um modal solicitando o CEP (substituindo o modal de estado)
2. WHEN o usuário informa um CEP válido THEN o sistema SHALL consultar a API ViaCEP para obter os dados de endereço
3. WHEN os dados do endereço são obtidos THEN o sistema SHALL exibir um modal da etapa 2 solicitando apenas o número da residência
4. WHEN o usuário informa o número THEN o sistema SHALL salvar o endereço completo no localStorage do navegador
5. WHEN o endereço é salvo THEN o sistema SHALL exibir um modal da etapa 3 mostrando "Restaurante encontrado a X,Xkm de você"
6. IF o CEP for inválido THEN o sistema SHALL exibir uma mensagem de erro clara
7. WHEN o usuário retorna ao site THEN o sistema SHALL verificar se há endereço salvo no cache e pular os modais se existir

### Requirement 2 - Página de Produtos

**User Story:** Como um usuário, eu quero visualizar todos os produtos disponíveis organizados por categorias para facilitar minha escolha.

#### Acceptance Criteria

1. WHEN a página carrega THEN o sistema SHALL exibir todos os produtos das categorias: Frutas do Amor, Combos Especiais, Bolos e Doces, e Promoções Especiais
2. WHEN um produto tem desconto THEN o sistema SHALL exibir o preço original riscado e o preço promocional em destaque
3. WHEN um produto é "mais vendido" THEN o sistema SHALL exibir uma badge indicativa
4. WHEN um produto está em promoção especial THEN o sistema SHALL destacar a oferta (ex: "Compre 3, leve 4")
5. WHEN o usuário clica em um produto THEN o sistema SHALL permitir adicionar ao carrinho
6. WHEN produtos são adicionados ao carrinho THEN o sistema SHALL atualizar o contador do carrinho em tempo real

### Requirement 3 - Carrinho de Compras

**User Story:** Como um usuário, eu quero gerenciar os produtos no meu carrinho para revisar minha compra antes de finalizar.

#### Acceptance Criteria

1. WHEN o usuário adiciona um produto THEN o sistema SHALL incluir o item no carrinho com quantidade padrão 1
2. WHEN o usuário quer alterar quantidade THEN o sistema SHALL permitir aumentar/diminuir a quantidade
3. WHEN o usuário quer remover um item THEN o sistema SHALL permitir exclusão do produto do carrinho
4. WHEN o carrinho é modificado THEN o sistema SHALL recalcular automaticamente o total
5. WHEN o usuário finaliza a seleção THEN o sistema SHALL permitir prosseguir para o checkout

### Requirement 4 - Checkout Etapa 1 (Dados Pessoais)

**User Story:** Como um usuário, eu quero informar apenas meu nome e telefone para identificação do pedido, enquanto email e CPF são gerados automaticamente pelo sistema.

#### Acceptance Criteria

1. WHEN o usuário inicia o checkout THEN o sistema SHALL exibir formulário solicitando apenas nome e telefone
2. WHEN o usuário preenche os campos obrigatórios THEN o sistema SHALL validar o formato do telefone
3. WHEN os dados são válidos THEN o sistema SHALL gerar automaticamente email e CPF aleatórios válidos
4. WHEN o sistema gera os dados THEN o sistema SHALL permitir avançar para a etapa 2
5. IF algum campo obrigatório estiver vazio THEN o sistema SHALL exibir mensagem de erro
6. IF o formato do telefone for inválido THEN o sistema SHALL exibir mensagem de erro específica
7. WHEN o sistema gera CPF THEN o sistema SHALL usar a função gerarCPF() existente no pagamento.php
8. WHEN o sistema gera email THEN o sistema SHALL usar email padrão "clienteteste@gmail.com"

### Requirement 5 - Checkout Etapa 2 (Confirmação de Endereço)

**User Story:** Como um usuário, eu quero confirmar meu endereço de entrega que foi salvo anteriormente para finalizar o pedido.

#### Acceptance Criteria

1. WHEN o usuário chega na etapa 2 THEN o sistema SHALL exibir o endereço salvo no cache preenchido automaticamente
2. WHEN o endereço está preenchido THEN o sistema SHALL exibir o botão "Finalizar Pedido"
3. WHEN o usuário clica em "Finalizar Pedido" THEN o sistema SHALL processar o pedido e avançar para etapa 3
4. WHEN o usuário quer alterar o endereço THEN o sistema SHALL permitir edição dos campos
5. IF não houver endereço no cache THEN o sistema SHALL redirecionar para o modal de CEP

### Requirement 6 - Checkout Etapa 3 (Pagamento PIX com UTMify)

**User Story:** Como um usuário, eu quero pagar meu pedido via PIX de forma instantânea para concluir a compra, com rastreamento completo via UTMify.

#### Acceptance Criteria

1. WHEN o pedido é processado THEN o sistema SHALL gerar um código PIX instantaneamente via API PayHubr
2. WHEN o PIX é gerado THEN o sistema SHALL exibir o QR Code e código para cópia
3. WHEN o sistema exibe o pagamento THEN o sistema SHALL mostrar o resumo completo do pedido
4. WHEN o PIX é gerado THEN o sistema SHALL enviar dados para utmify-pendente.php com status "waiting_payment"
5. WHEN o pagamento é realizado THEN o sistema SHALL receber webhook e atualizar status no banco SQLite
6. WHEN o webhook confirma pagamento THEN o sistema SHALL enviar dados para utmify.php com status "paid"
7. WHEN o pagamento é confirmado THEN o sistema SHALL exibir confirmação do pedido
8. WHEN há parâmetros UTM THEN o sistema SHALL preservá-los durante todo o fluxo de pagamento

### Requirement 7 - Resumo do Pedido

**User Story:** Como um usuário, eu quero visualizar um resumo detalhado do meu pedido em todas as etapas do checkout.

#### Acceptance Criteria

1. WHEN o usuário está no checkout THEN o sistema SHALL exibir resumo com todos os itens selecionados
2. WHEN há descontos aplicados THEN o sistema SHALL mostrar o valor original, desconto e valor final
3. WHEN há taxa de entrega THEN o sistema SHALL incluir no cálculo total
4. WHEN o resumo é exibido THEN o sistema SHALL mostrar: subtotal, descontos, taxa de entrega e total final
5. WHEN o pedido é finalizado THEN o sistema SHALL manter o resumo visível na confirmação

### Requirement 8 - Cache, Persistência e Rastreamento

**User Story:** Como um usuário, eu quero que meus dados de endereço sejam lembrados para facilitar compras futuras, e como administrador, eu quero rastrear todas as transações via UTMify.

#### Acceptance Criteria

1. WHEN o endereço é informado pela primeira vez THEN o sistema SHALL salvar no localStorage do navegador
2. WHEN o usuário retorna ao site THEN o sistema SHALL recuperar o endereço salvo
3. WHEN o usuário quer alterar o endereço THEN o sistema SHALL atualizar o cache
4. WHEN o cache expira ou é limpo THEN o sistema SHALL solicitar o CEP novamente
5. WHEN há dados no cache THEN o sistema SHALL pular o modal inicial de CEP
6. WHEN uma transação é criada THEN o sistema SHALL salvar no banco SQLite com parâmetros UTM
7. WHEN o status da transação muda THEN o sistema SHALL atualizar o banco via webhook
8. WHEN há parâmetros UTM na URL THEN o sistema SHALL capturá-los e associá-los à transação

### Requirement 9 - Design e Experiência Visual

**User Story:** Como um usuário, eu quero uma interface visualmente atraente e fluida para ter uma experiência agradável de compra.

#### Acceptance Criteria

1. WHEN a página carrega THEN o sistema SHALL apresentar design responsivo e moderno
2. WHEN há transições entre telas THEN o sistema SHALL aplicar animações suaves
3. WHEN elementos são interativos THEN o sistema SHALL fornecer feedback visual claro
4. WHEN há estados de loading THEN o sistema SHALL exibir indicadores apropriados
5. WHEN há erros THEN o sistema SHALL apresentar mensagens claras e amigáveis

### Requirement 10 - Integração de Dados dos Produtos

**User Story:** Como um administrador, eu quero que todos os produtos fornecidos sejam integrados corretamente no sistema, substituindo os produtos de exemplo atuais.

#### Acceptance Criteria

1. WHEN o sistema carrega THEN o sistema SHALL exibir todos os produtos das Frutas do Amor (kits de 3 e 4/6 morangos, uvas, maracujá, abacaxi, morango pistache, brownie)
2. WHEN há combos especiais THEN o sistema SHALL destacar o combo "12 morangos + 4 uvas" como mais vendido
3. WHEN há bolos e doces THEN o sistema SHALL exibir chocolate com morango, vulcão ninho nutella, pudim de leite e mini naked brownie
4. WHEN há promoções especiais THEN o sistema SHALL aplicar as regras como "Compre 3, leve 4" para bombons de morango
5. WHEN produtos têm preços promocionais THEN o sistema SHALL exibir preço original riscado e preço promocional destacado
6. WHEN produtos são "mais vendidos" THEN o sistema SHALL exibir badge correspondente
7. WHEN o sistema substitui produtos de exemplo THEN o sistema SHALL manter a estrutura de categorias existente

### Requirement 11 - Integração com Sistema de Pagamento Existente

**User Story:** Como um desenvolvedor, eu quero integrar o novo sistema de produtos com a infraestrutura de pagamento PIX e UTMify já existente.

#### Acceptance Criteria

1. WHEN o checkout é finalizado THEN o sistema SHALL usar a API PayHubr existente (pagamento.php)
2. WHEN uma transação é criada THEN o sistema SHALL salvar no banco SQLite existente (database.sqlite)
3. WHEN o pagamento é processado THEN o sistema SHALL usar o webhook.php existente para atualizações
4. WHEN há mudança de status THEN o sistema SHALL comunicar com utmify.php e utmify-pendente.php
5. WHEN o sistema processa pagamentos THEN o sistema SHALL manter compatibilidade com verificar.php
6. WHEN há parâmetros UTM THEN o sistema SHALL usar o token UTMify existente (7uICYFeg4zAj4ZbDzK6DDnGyBxHbce92BaVd)
7. WHEN o sistema é integrado THEN o sistema SHALL manter os logs existentes na pasta /logs/