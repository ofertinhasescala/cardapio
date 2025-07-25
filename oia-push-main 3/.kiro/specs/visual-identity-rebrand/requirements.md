# Documento de Requisitos

## Introdução

Este projeto envolve uma transformação completa da identidade visual da aplicação de delivery de hambúrgueres existente para se tornar um serviço de delivery de "Frutas do Amor" gourmet. O rebranding converterá a marca atual "Oia Burger" para uma loja premium especializada em morangos do amor, uvas do amor, maracujá do amor e outras frutas gourmet cobertas com chocolate, mantendo a arquitetura técnica existente e os padrões de experiência do usuário.

## Requisitos

### Requisito 1

**História do Usuário:** Como cliente, quero ver uma identidade visual coesa das "Frutas do Amor" em toda a aplicação, para que eu entenda que este é um serviço premium de delivery de frutas gourmet.

#### Critérios de Aceitação

1. QUANDO um usuário visita a aplicação ENTÃO o sistema DEVE exibir branding temático de frutas do amor consistentemente em todas as páginas
2. QUANDO um usuário visualiza qualquer página ENTÃO o sistema DEVE usar uma paleta de cores que reflita a estética premium das frutas (vermelhos de morango, roxos de uva, amarelos de maracujá, dourados elegantes)
3. QUANDO um usuário vê o logo ENTÃO o sistema DEVE exibir branding de "Frutas do Amor" ao invés de branding de hambúrguer
4. QUANDO um usuário navega pelo app ENTÃO o sistema DEVE manter consistência visual com o novo tema de frutas gourmet

### Requisito 2

**História do Usuário:** Como cliente, quero navegar pelos produtos de "Frutas do Amor" ao invés de produtos de hambúrguer, para que eu possa selecionar as frutas gourmet que desejo comprar.

#### Critérios de Aceitação

1. QUANDO um usuário visualiza o catálogo de produtos ENTÃO o sistema DEVE exibir produtos de frutas do amor (morangos, uvas, maracujá) ao invés de itens de hambúrguer
2. QUANDO um usuário visualiza imagens de produtos ENTÃO o sistema DEVE mostrar fotografia de alta qualidade das frutas gourmet
3. QUANDO um usuário lê nomes de produtos ENTÃO o sistema DEVE exibir nomenclatura específica das frutas (ex: "Kit 3 morangos do amor", "Kit 6 morangos do amor", "Kit 4 uvas do amor")
4. QUANDO um usuário visualiza descrições de produtos ENTÃO o sistema DEVE usar linguagem e terminologia apropriada para frutas gourmet
5. QUANDO um usuário vê preços ENTÃO o sistema DEVE refletir estrutura de preços de produtos de frutas premium com ofertas promocionais

### Requisito 3

**História do Usuário:** Como cliente, quero ver conteúdo promocional e combos das "Frutas do Amor", para que eu possa aproveitar ofertas especiais.

#### Critérios de Aceitação

1. QUANDO um usuário visualiza banners promocionais ENTÃO o sistema DEVE exibir ofertas de combos de frutas (ex: "12 morangos do amor + 4 uvas do amor")
2. QUANDO um usuário vê produtos em destaque ENTÃO o sistema DEVE destacar combinações populares de frutas do amor
3. QUANDO um usuário visualiza mensagens de desconto ENTÃO o sistema DEVE usar linguagem promocional apropriada para frutas gourmet
4. QUANDO um usuário vê indicadores de urgência ENTÃO o sistema DEVE exibir limitações de estoque para combos de frutas

### Requisito 4

**História do Usuário:** Como cliente, quero que a navegação e categorias reflitam produtos de "Frutas do Amor", para que eu possa encontrar facilmente o que estou procurando.

#### Critérios de Aceitação

1. QUANDO um usuário visualiza navegação de categorias ENTÃO o sistema DEVE exibir categorias baseadas em frutas do amor ao invés de categorias de hambúrguer
2. QUANDO um usuário usa busca ou filtros ENTÃO o sistema DEVE fornecer opções relevantes para frutas gourmet
3. QUANDO um usuário visualiza seções do menu ENTÃO o sistema DEVE organizar conteúdo em torno de tipos de frutas do amor
4. SE um usuário acessa páginas de categoria ENTÃO o sistema DEVE mostrar subcategorias apropriadas de frutas

### Requisito 5

**História do Usuário:** Como proprietário do negócio, quero que todo conteúdo de texto reflita o novo modelo de negócio de "Frutas do Amor", para que os clientes entendam nossa nova oferta de produtos.

#### Critérios de Aceitação

1. QUANDO conteúdo é exibido ENTÃO o sistema DEVE usar terminologia de delivery de frutas gourmet ao invés de delivery de comida
2. QUANDO usuários veem informações da empresa ENTÃO o sistema DEVE refletir a nova identidade do negócio
3. QUANDO mensagens de erro ou texto do sistema aparecem ENTÃO o sistema DEVE manter consistência com tema de frutas do amor
4. QUANDO usuários veem informações de entrega ENTÃO o sistema DEVE usar linguagem apropriada para produtos de frutas gourmet (frescor, manuseio delicado, etc.)

### Requisito 6

**História do Usuário:** Como cliente, quero que a experiência do carrinho de compras e checkout reflita compras de "Frutas do Amor", para que o processo de compra seja apropriado para os produtos.

#### Critérios de Aceitação

1. QUANDO um usuário adiciona itens ao carrinho ENTÃO o sistema DEVE exibir detalhes dos produtos de frutas do amor apropriadamente
2. QUANDO um usuário prossegue para checkout ENTÃO o sistema DEVE usar linguagem apropriada para checkout de frutas gourmet
3. QUANDO um usuário vê resumos de pedido ENTÃO o sistema DEVE formatar pedidos de frutas claramente
4. QUANDO um usuário recebe confirmações ENTÃO o sistema DEVE usar mensagens apropriadas para delivery de frutas do amor

### Requisito 7

**História do Usuário:** Como proprietário do negócio, quero que todos os pagamentos PIX sejam corretamente rastreados pela Utmify, para que eu possa acompanhar as conversões e comissões de forma precisa.

#### Critérios de Aceitação

1. QUANDO um pagamento PIX é gerado ENTÃO o sistema DEVE enviar webhook para Utmify com status "waiting_payment"
2. QUANDO um pagamento PIX é aprovado ENTÃO o sistema DEVE enviar webhook para Utmify com status "paid" imediatamente
3. QUANDO um webhook falha ENTÃO o sistema DEVE implementar retry automático com backoff exponencial
4. QUANDO um pagamento expira ENTÃO o sistema DEVE enviar webhook para Utmify com status "expired"
5. SE o webhook não conseguir ser enviado ENTÃO o sistema DEVE armazenar localmente para reenvio posterior
6. QUANDO há webhooks pendentes ENTÃO o sistema DEVE tentar reenviar automaticamente em intervalos regulares