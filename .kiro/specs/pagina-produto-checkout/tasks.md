# Implementation Plan

- [x] 1. Atualizar Sistema de Localização para CEP
  - Substituir modal de estado/cidade por modal de CEP único
  - Implementar integração com ViaCEP API para consulta de endereço
  - Criar modal para solicitar número da residência após consulta do CEP
  - Implementar cache no localStorage para salvar endereço completo
  - Adicionar validação de CEP com máscara de entrada
  - Criar função para exibir "Restaurante encontrado a X,Xkm de você"
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. Integrar Produtos Reais no Sistema
  - Substituir produtos de exemplo por dados reais das Frutas do Amor
  - Implementar todos os kits de morangos, uvas, maracujá, abacaxi, morango pistache e brownie
  - Adicionar combos especiais com destaque para o combo mais vendido
  - Integrar produtos de bolos e doces (chocolate com morango, vulcão ninho nutella, etc.)
  - Implementar promoções especiais como "Compre 3, leve 4" para bombons
  - Configurar badges de "Mais vendido", "Destaque" e promoções
  - Ajustar exibição de preços originais riscados e preços promocionais
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 3. Implementar Modal de Produto Detalhado
  - Criar modal que abre ao clicar em um produto
  - Exibir informações completas do produto (nome, descrição, preço, imagem)
  - Adicionar controles de quantidade no modal
  - Implementar botão "Adicionar ao Carrinho" funcional
  - Adicionar animações de transição suaves
  - Garantir responsividade do modal em dispositivos móveis
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 4. Aprimorar Sistema de Carrinho
  - Implementar funcionalidade completa de adicionar/remover produtos
  - Criar controles de quantidade (+/-) para cada item
  - Implementar cálculo automático de totais com descontos
  - Adicionar persistência do carrinho no localStorage
  - Melhorar exibição do resumo do carrinho na barra inferior
  - Implementar função de limpar carrinho
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Criar Checkout Etapa 1 - Dados Pessoais
  - Implementar formulário solicitando apenas nome e telefone
  - Adicionar máscara de telefone com validação
  - Implementar geração automática de email padrão "clienteteste@gmail.com"
  - Integrar função gerarCPF() existente para gerar CPF válido automaticamente
  - Adicionar validações de campos obrigatórios
  - Implementar navegação para próxima etapa
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 6. Criar Checkout Etapa 2 - Confirmação de Endereço
  - Exibir endereço salvo no cache preenchido automaticamente
  - Permitir edição dos campos de endereço se necessário
  - Implementar botão "Finalizar Pedido" para prosseguir
  - Adicionar validação de endereço completo
  - Implementar redirecionamento para modal de CEP se não houver endereço no cache
  - Criar resumo do pedido visível nesta etapa
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. Criar Checkout Etapa 3 - Pagamento PIX
  - Integrar com sistema PayHubr existente (pagamento.php)
  - Implementar geração instantânea de código PIX e QR Code
  - Exibir QR Code e código para cópia de forma clara
  - Adicionar funcionalidade de copiar código PIX
  - Implementar verificação automática de status do pagamento
  - Integrar com webhook.php existente para atualizações de status
  - Exibir confirmação de pagamento quando aprovado
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 8. Implementar Resumo do Pedido Completo
  - Criar componente de resumo visível em todas as etapas do checkout
  - Exibir todos os itens selecionados com quantidades e preços
  - Calcular e mostrar subtotal, descontos aplicados e total final
  - Incluir informações de entrega (grátis/taxa)
  - Manter resumo atualizado em tempo real
  - Exibir resumo final na confirmação do pedido
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 9. Implementar Sistema de Cache e Persistência
  - Configurar localStorage para salvar endereço do cliente
  - Implementar recuperação automática de endereço em visitas futuras
  - Adicionar funcionalidade para atualizar endereço salvo
  - Integrar com banco SQLite existente para salvar transações
  - Implementar captura e preservação de parâmetros UTM durante todo o fluxo
  - Garantir que dados sejam mantidos entre as etapas do checkout
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 10. Implementar Integração Completa com UTMify
  - Integrar captura de parâmetros UTM da URL (utm_source, utm_medium, etc.)
  - Implementar envio para utmify-pendente.php quando PIX é gerado
  - Configurar envio para utmify.php quando pagamento é confirmado
  - Garantir preservação de parâmetros UTM durante todo o fluxo de compra
  - Testar integração com token UTMify existente
  - Implementar logs de rastreamento para debug
  - _Requirements: 6.4, 6.5, 6.6, 8.6, 8.7, 8.8_

- [ ] 11. Aprimorar Design e Experiência Visual
  - Implementar animações suaves entre transições de modais
  - Adicionar estados de loading com indicadores visuais apropriados
  - Criar feedback visual claro para interações do usuário
  - Implementar mensagens de erro amigáveis e informativas
  - Garantir design responsivo em todos os componentes novos
  - Adicionar micro-interações para melhorar a experiência
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 12. Integrar com Sistema de Pagamento Existente
  - Manter compatibilidade com pagamento.php existente
  - Utilizar banco SQLite (database.sqlite) para persistência
  - Integrar com webhook.php para atualizações de status
  - Manter comunicação com utmify.php e utmify-pendente.php
  - Preservar compatibilidade com verificar.php
  - Manter sistema de logs existente na pasta /logs/
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 13. Implementar Testes e Validações
  - Criar testes para validação de CEP e telefone
  - Implementar testes de integração com ViaCEP API
  - Testar fluxo completo de compra end-to-end
  - Validar geração de CPF e funcionamento do sistema de pagamento
  - Testar responsividade em diferentes dispositivos
  - Implementar tratamento de erros robusto em todas as etapas
  - _Requirements: Todos os requirements de validação e tratamento de erro_

- [ ] 14. Otimizações e Finalização
  - Implementar lazy loading para imagens de produtos
  - Otimizar performance do carregamento de produtos
  - Adicionar debounce na validação de CEP
  - Implementar limpeza automática de cache quando necessário
  - Realizar testes finais de integração com todos os sistemas
  - Documentar configurações e dependências
  - _Requirements: Performance e otimizações gerais_