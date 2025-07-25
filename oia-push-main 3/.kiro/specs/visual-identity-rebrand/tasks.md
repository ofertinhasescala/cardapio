on# Plano de Implementação

- [x] 1. Configurar nova paleta de cores e tipografia
  - Atualizar arquivo de configuração de cores CSS/Tailwind com as cores das "Frutas do Amor"
  - Implementar cores primárias: `#FECEE5` (rosa suave) e `#C8A364` (dourado elegante)
  - Adicionar cores complementares para diferentes categorias de produtos
  - Configurar hierarquia tipográfica com pesos e tamanhos definidos
  - _Requisitos: 1.2, 1.3_

- [x] 2. Atualizar componentes visuais básicos
  - [x] 2.1 Redesenhar componentes de botão com nova identidade
    - Implementar botão primário com background `#C8A364` e bordas arredondadas
    - Criar botão secundário com borda `#FECEE5` e hover suave
    - Adicionar estados de hover, focus e disabled com transições delicadas
    - _Requisitos: 1.4_

  - [x] 2.2 Atualizar componentes de card de produto
    - Implementar cards arredondados (12px) com sombras suaves
    - Adicionar sistema de badges para "MAIS VENDIDO", "COMBO ESPECIAL", "NOVO"
    - Criar layout específico para produtos de frutas do amor com destaque visual
    - Implementar indicadores de preço promocional vs original
    - _Requisitos: 2.1, 2.3_

- [ ] 3. Implementar sistema robusto de webhook PIX
  - [ ] 3.1 Criar WebhookManager para gerenciar envios
    - Implementar classe WebhookManager com métodos de envio e retry
    - Adicionar sistema de filas para webhooks pendentes
    - Criar interface para diferentes tipos de webhook (gerado, pago, expirado)
    - _Requisitos: 7.1, 7.2_

  - [ ] 3.2 Implementar sistema de retry com backoff exponencial
    - Criar RetryService com estratégia de tentativas progressivas
    - Implementar timeouts configuráveis (30s, 2min, 5min, 15min, 30min)
    - Adicionar logging detalhado para cada tentativa de envio
    - Criar sistema de alertas para falhas críticas
    - _Requisitos: 7.3, 7.5_

  - [ ] 3.3 Criar armazenamento local para webhooks pendentes
    - Implementar WebhookStorage usando localStorage com backup
    - Adicionar sistema de limpeza automática de webhooks expirados
    - Criar interface para visualizar e gerenciar webhooks pendentes
    - Implementar recuperação automática após falhas de rede
    - _Requisitos: 7.5, 7.6_

  - [ ] 3.4 Otimizar cliente HTTP para API Utmify
    - Melhorar UtmifyClient com timeout de 10 segundos
    - Implementar headers corretos e autenticação robusta
    - Adicionar validação de payload antes do envio
    - Criar sistema de métricas de sucesso/falha
    - _Requisitos: 7.1, 7.2_

- [x] 4. Transformar catálogo de produtos para "Frutas do Amor"
  - [x] 4.1 Implementar modelos de dados para frutas do amor
    - Criar interface ProdutoGourmet com categorias específicas
    - Implementar tipos para 6 sabores: morango, uva, maracujá, abacaxi, morango-pistache, brownie
    - Adicionar campos para peso, porções, promoções e estoque limitado
    - Criar sistema de combos especiais com cálculo automático de desconto
    - _Requisitos: 2.1, 2.2, 2.5_

  - [x] 4.2 Criar seção destacada "Frutas do Amor"
    - Implementar layout especial para seção principal de frutas do amor
    - Adicionar kits individuais (3 e 4 unidades) para cada sabor
    - Criar combos especiais: Mais Vendido, Completo, Clássico, Tropical, Premium, Chocolate Lovers
    - Implementar badges de destaque e indicadores de "mais vendido"
    - _Requisitos: 2.1, 2.3, 4.3_

  - [x] 4.3 Adicionar outras categorias de produtos
    - Implementar seção "Bolos e Doces" com produtos específicos
    - Adicionar seção "Promoções Especiais" com bombons e coxinha de brigadeiro
    - Criar categorias para bolos vulcão, tortas, sobremesas e salgados
    - Implementar sistema de ícones específicos para cada categoria
    - _Requisitos: 2.1, 2.4, 4.1_

- [x] 5. Atualizar header e navegação
  - [x] 5.1 Substituir logo e branding
    - Remover elementos relacionados a hambúrgueres ("Oia Burger")
    - Implementar novo logo "Phamela Gourmet" com estética fofa e delicada
    - Criar identidade visual focada em "Frutas do Amor" como produto principal
    - Atualizar favicon e meta tags com nova identidade "Phamela Gourmet"
    - Aplicar nova paleta de cores no header
    - _Requisitos: 1.1, 1.3, 5.2_

  - [x] 5.2 Redesenhar navegação e categorias
    - Atualizar menu de navegação com categorias de frutas do amor
    - Implementar ícones delicados para cada seção
    - Adicionar filtros específicos para tipos de frutas do amor
    - Criar breadcrumbs com nova terminologia
    - _Requisitos: 4.1, 4.2, 5.1_

- [ ] 6. Atualizar experiência de carrinho e checkout
  - [ ] 6.1 Redesenhar interface do carrinho
    - Aplicar nova identidade visual aos componentes do carrinho
    - Atualizar linguagem para produtos de frutas do amor
    - Implementar cálculos corretos para combos e promoções
    - Adicionar validações específicas para produtos gourmet
    - _Requisitos: 6.1, 6.3_

  - [ ] 6.2 Melhorar integração PIX com rastreamento
    - Integrar novo sistema de webhook no fluxo de pagamento PIX
    - Garantir envio imediato de webhook quando PIX é gerado
    - Implementar rastreamento correto de parâmetros UTM
    - Adicionar logs detalhados para debugging de pagamentos
    - _Requisitos: 7.1, 7.2, 6.2_

- [ ] 7. Implementar componente PixPayment otimizado
  - [ ] 7.1 Melhorar detecção de pagamentos aprovados
    - Otimizar PixStatusService para verificações mais frequentes
    - Implementar polling inteligente com intervalos adaptativos
    - Adicionar fallbacks para diferentes cenários de falha
    - Melhorar tratamento de timeouts e erros de rede
    - _Requisitos: 7.2, 7.6_

  - [ ] 7.2 Integrar sistema de webhook no componente
    - Conectar PixPayment com novo WebhookManager
    - Garantir envio de webhook quando pagamento é detectado
    - Implementar feedback visual para status de envio de webhook
    - Adicionar retry automático em caso de falha
    - _Requisitos: 7.1, 7.2, 7.3_

- [ ] 8. Atualizar textos e conteúdo
  - [ ] 8.1 Substituir terminologia de hambúrgueres
    - Atualizar todos os textos da interface de "Oia Burger" para "Phamela Gourmet"
    - Modificar linguagem para focar em frutas gourmet e doces especiais
    - Atualizar mensagens de erro e confirmação com nova identidade
    - Revisar meta descriptions e conteúdo SEO para "Phamela Gourmet"
    - Atualizar textos de ajuda e instruções
    - _Requisitos: 5.1, 5.3, 5.4_

  - [ ] 8.2 Implementar linguagem promocional específica
    - Criar textos promocionais para combos de frutas do amor
    - Adicionar descrições detalhadas para cada produto
    - Implementar mensagens de urgência e escassez
    - Criar copy persuasivo para conversão
    - _Requisitos: 2.4, 3.3_

- [ ] 9. Implementar sistema de monitoramento e logs
  - [ ] 9.1 Criar dashboard de webhooks
    - Implementar interface para visualizar status de webhooks
    - Adicionar métricas de sucesso/falha de envios
    - Criar alertas para problemas críticos
    - Implementar relatórios de performance
    - _Requisitos: 7.3, 7.5_

  - [ ] 9.2 Adicionar logging detalhado
    - Implementar logs estruturados para todos os eventos PIX
    - Adicionar rastreamento de conversões e UTM
    - Criar sistema de debug para problemas de webhook
    - Implementar métricas de performance da aplicação
    - _Requisitos: 7.1, 7.2, 7.6_

- [ ] 10. Testes e validação
  - [ ] 10.1 Testar fluxo completo de pagamento PIX
    - Validar geração de PIX com novos produtos
    - Testar envio de webhooks em cenários reais
    - Verificar sistema de retry em caso de falhas
    - Validar rastreamento UTM correto
    - _Requisitos: 7.1, 7.2, 7.3_

  - [ ] 10.2 Testar nova identidade visual
    - Verificar consistência de cores em todos os componentes
    - Testar responsividade em diferentes dispositivos
    - Validar acessibilidade e contraste de cores
    - Testar interações e micro-animações
    - _Requisitos: 1.1, 1.2, 1.4_

  - [ ] 10.3 Testar experiência do usuário
    - Validar fluxo de compra com novos produtos
    - Testar navegação e busca por categorias
    - Verificar clareza das informações de produto
    - Validar processo de checkout e confirmação
    - _Requisitos: 2.1, 4.1, 6.1_

- [x] 11. Implementar catálogo completo de produtos Phamela Gourmet
  - [x] 11.1 Estruturar todos os produtos das "Frutas do Amor"
    - Implementar dados completos para 6 sabores com preços corretos
    - Adicionar todos os kits (3 e 4 unidades) com preços promocionais específicos
    - Criar todos os combos especiais com descrições e preços exatos
    - Configurar badges e indicadores de estoque limitado
    - _Requisitos: 2.1, 2.2, 2.5_

  - [x] 11.2 Implementar produtos "Bolos e Doces" completos
    - Adicionar Chocolate com Morango (R$ 29,99), Vulcão Ninho Nutella (R$ 29,99)
    - Implementar Pudim de Leite 150g (R$ 19,99), Mini Naked Brownie 235g (R$ 19,99)
    - Adicionar todos os bolos vulcão 1KG com descrições e preços
    - Criar bolos caseiros com preços uniformes de R$ 19,99
    - _Requisitos: 2.1, 2.4_

  - [x] 11.3 Implementar seção "Promoções Especiais" completa
    - Bombom de Morango "Compre 3, leve 4" - 82g (de R$ 23,88 por R$ 19,90)
    - Bombom Coração de Morango 120g (de R$ 9,48 por R$ 7,90)
    - Coxinha de Brigadeiro (de R$ 5,88 por R$ 4,90)
    - Configurar badges promocionais e descrições detalhadas
    - _Requisitos: 2.3, 3.3_

  - [x] 11.4 Implementar todas as categorias restantes
    - Tortas: Acetato, Aniversário, Dois Amores, Bentô Cake, etc.
    - Super Fatias: Abacaxi com Coco, Dois Amores, Red Velvet, etc.
    - Sobremesas: Brigadeiro Gourmet, Copo da Felicidade, Tartaletes
    - Salgados: Combos 30/50/100 unidades, Coxões, Empadões
    - Kits Festa: Para 10/20 pessoas com salgados e bebidas
    - _Requisitos: 2.1, 4.1, 4.2_

  - [x] 11.5 Simplificar modal de produtos
    - Remover campos desnecessários do modal de detalhes
    - Manter apenas: imagem, nome, descrição, preço, observação, botão carrinho
    - Implementar design limpo focado na conversão
    - Aplicar nova identidade visual Phamela Gourmet
    - _Requisitos: 6.1, 6.2_