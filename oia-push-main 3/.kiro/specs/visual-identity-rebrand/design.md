# Documento de Design

## Visão Geral

O design da nova identidade visual das "Frutas do Amor" será centrado em uma estética fofa e delicada, utilizando uma paleta de cores suaves que transmita elegância, carinho e qualidade premium. A transformação visual manterá a funcionalidade existente enquanto cria uma experiência completamente nova e encantadora para os usuários. Além disso, implementaremos uma arquitetura robusta de webhooks PIX para garantir rastreamento preciso das conversões na Utmify.

## Arquitetura Visual

### Paleta de Cores Principal

**Cores Primárias:**
- `#FECEE5` - Rosa suave (cor principal para backgrounds e elementos delicados)
- `#C8A364` - Dourado elegante (para acentos, botões e elementos premium)

**Cores Complementares:**
- `#FFFFFF` - Branco puro (para contraste e limpeza visual)
- `#F8F8F8` - Cinza muito claro (para backgrounds secundários)
- `#8B4513` - Marrom chocolate (para textos e detalhes que remetem ao chocolate)
- `#E91E63` - Rosa mais vibrante (para CTAs e elementos de destaque)
- `#4CAF50` - Verde suave (para elementos de sucesso e frescor)

### Tipografia

**Fonte Principal:** 
- Família: Inter ou similar (moderna, limpa, legível)
- Pesos: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Hierarquia Tipográfica:**
- H1: 32px, peso 700, cor #C8A364
- H2: 24px, peso 600, cor #8B4513
- H3: 20px, peso 500, cor #8B4513
- Body: 16px, peso 400, cor #333333
- Small: 14px, peso 400, cor #666666

## Arquitetura de Webhooks PIX

### Problema Identificado
O sistema atual tem falhas no envio de webhooks para Utmify quando pagamentos PIX são aprovados, resultando em perda de rastreamento de conversões e comissões.

### Solução Proposta

**Arquitetura de Múltiplas Camadas:**
1. **Webhook Imediato:** Tentativa de envio instantâneo quando o pagamento é detectado
2. **Sistema de Retry:** Backoff exponencial para tentativas falhadas
3. **Armazenamento Local:** Persistência de webhooks não enviados
4. **Monitoramento Ativo:** Verificação contínua de status de pagamentos
5. **Fallback de Recuperação:** Reenvio automático de webhooks pendentes

## Componentes e Interfaces

### Header/Navegação
- Background: `#FECEE5` com gradiente sutil
- Logo: Novo design com elementos de frutas estilizadas
- Navegação: Ícones delicados com hover em `#C8A364`
- Carrinho: Ícone de coração ou cesta fofa

### Cards de Produto
- Background: `#FFFFFF` com sombra suave
- Bordas: Arredondadas (12px) para suavidade
- Hover: Elevação sutil com borda em `#C8A364`
- Imagens: Formato circular ou com cantos muito arredondados
- Preços: Destaque em `#C8A364` com fonte semibold

### Botões
**Botão Primário:**
- Background: `#C8A364`
- Texto: `#FFFFFF`
- Hover: Escurecimento de 10%
- Bordas arredondadas: 8px

**Botão Secundário:**
- Background: transparente
- Borda: 2px solid `#FECEE5`
- Texto: `#C8A364`
- Hover: Background `#FECEE5`

### Modais e Overlays
- Background: `#FFFFFF` com overlay `rgba(254, 206, 229, 0.8)`
- Bordas muito arredondadas (16px)
- Sombras suaves e delicadas

### Badges e Tags
- Promoções: Background `#E91E63` com texto branco
- Disponibilidade: Background `#4CAF50` com texto branco
- Categorias: Background `#FECEE5` com texto `#C8A364`

## Modelos de Dados

### Produto Gourmet
```typescript
interface ProdutoGourmet {
  id: string;
  nome: string;
  categoria: 'frutas-do-amor' | 'bolos-vulcao' | 'bolos-caseiros' | 'tortas' | 'sobremesas' | 'salgados' | 'combos';
  subcategoria?: string;
  precoOriginal: number;
  precoPromocional?: number;
  descricao: string;
  imagem: string;
  peso?: string; // "1KG", "550g", "235g"
  porcoes?: string; // "8 a 10 fatias"
  disponivel: boolean;
  estoqueLimitado?: number;
  maisVendido?: boolean;
  destaque?: boolean;
}
```

### Frutas do Amor (Categoria Principal)
```typescript
interface FrutaDoAmor extends ProdutoGourmet {
  categoria: 'frutas-do-amor';
  tipo: 'morango' | 'uva' | 'maracuja' | 'abacaxi' | 'morango-pistache' | 'brownie';
  tamanho: 'Grande';
  quantidade: number; // 3, 6, 4, etc.
}

// Exemplos específicos:
const frutasDoAmor = [
  // MORANGOS DO AMOR
  {
    id: 'kit-3-morangos',
    nome: 'Kit 3 morangos do amor',
    tipo: 'morango',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99
  },
  {
    id: 'kit-6-morangos',
    nome: 'Kit 6 morangos do amor',
    tipo: 'morango',
    tamanho: 'Grande',
    quantidade: 6,
    precoOriginal: 45.80,
    precoPromocional: 29.99
  },
  
  // UVAS DO AMOR
  {
    id: 'kit-3-uvas',
    nome: 'Kit 3 uvas do amor',
    tipo: 'uva',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99
  },
  {
    id: 'kit-4-uvas',
    nome: 'Kit 4 uvas do amor',
    tipo: 'uva',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 45.80,
    precoPromocional: 24.99
  },
  
  // MARACUJÁ DO AMOR
  {
    id: 'kit-3-maracuja',
    nome: 'Kit 3 maracujá do amor',
    tipo: 'maracuja',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99
  },
  {
    id: 'kit-4-maracuja',
    nome: 'Kit 4 maracujá do amor',
    tipo: 'maracuja',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 45.80,
    precoPromocional: 24.99
  },
  
  // ABACAXI DO AMOR
  {
    id: 'kit-3-abacaxi',
    nome: 'Kit 3 abacaxi do amor',
    tipo: 'abacaxi',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99
  },
  {
    id: 'kit-4-abacaxi',
    nome: 'Kit 4 abacaxi do amor',
    tipo: 'abacaxi',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 45.80,
    precoPromocional: 24.99
  },
  
  // MORANGO DO AMOR DE PISTACHE
  {
    id: 'kit-3-morango-pistache',
    nome: 'Kit 3 morango do amor de pistache',
    tipo: 'morango-pistache',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 32.80,
    precoPromocional: 22.99
  },
  {
    id: 'kit-4-morango-pistache',
    nome: 'Kit 4 morango do amor de pistache',
    tipo: 'morango-pistache',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 48.80,
    precoPromocional: 27.99
  },
  
  // BROWNIE DO AMOR
  {
    id: 'kit-3-brownie',
    nome: 'Kit 3 brownie do amor',
    tipo: 'brownie',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 32.90,
    precoPromocional: 17.90
  },
  {
    id: 'kit-4-brownie',
    nome: 'Kit 4 brownie do amor',
    tipo: 'brownie',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 48.90,
    precoPromocional: 27.90
  }
];
```

### Combo Especial (Mais Vendido)
```typescript
interface ComboEspecial extends ProdutoGourmet {
  categoria: 'combos';
  produtos: string[]; // IDs dos produtos inclusos
  desconto: number; // percentual
  motivoEscolha: string; // "melhor custo-benefício"
  maisVendido: true;
}

// COMBOS ESPECIAIS
const combosEspeciais = [
  // COMBO MAIS VENDIDO ATUAL
  {
    id: 'combo-12-morangos-4-uvas',
    nome: '12 morangos do amor + 4 Uvas do amor',
    descricao: 'Perfeito para galera com 20% de desconto. O combo mais queridinho da casa!',
    produtos: ['kit-12-morangos', 'kit-4-uvas'],
    precoOriginal: 75.90,
    precoPromocional: 49.99,
    desconto: 20,
    motivoEscolha: 'A maioria dos clientes escolhe esse porque é o melhor custo-benefício!',
    maisVendido: true,
    destaque: true
  },
  
  // COMBO COMPLETO TODAS AS FRUTAS
  {
    id: 'combo-frutas-completo',
    nome: 'Combo Completo Frutas do Amor',
    descricao: '3 morangos + 3 uvas + 3 maracujá + 3 abacaxi + 3 morango pistache + 3 brownie - Todos os sabores!',
    produtos: ['kit-3-morangos', 'kit-3-uvas', 'kit-3-maracuja', 'kit-3-abacaxi', 'kit-3-morango-pistache', 'kit-3-brownie'],
    precoOriginal: 181.90,
    precoPromocional: 99.99,
    desconto: 45,
    motivoEscolha: 'Perfeito para quem quer experimentar todos os sabores das frutas do amor!',
    destaque: true
  },
  
  // COMBO TRIO CLÁSSICO
  {
    id: 'combo-trio-classico',
    nome: 'Trio Clássico Frutas do Amor',
    descricao: '3 morangos + 3 uvas + 3 maracujá do amor - Os sabores mais pedidos!',
    produtos: ['kit-3-morangos', 'kit-3-uvas', 'kit-3-maracuja'],
    precoOriginal: 89.40,
    precoPromocional: 54.99,
    desconto: 25,
    motivoEscolha: 'Ideal para experimentar os sabores clássicos!'
  },
  
  // COMBO TROPICAL
  {
    id: 'combo-tropical',
    nome: 'Combo Tropical Frutas do Amor',
    descricao: '4 abacaxi + 3 maracujá do amor - Sabores tropicais irresistíveis!',
    produtos: ['kit-4-abacaxi', 'kit-3-maracuja'],
    precoOriginal: 69.60,
    precoPromocional: 42.99,
    desconto: 25,
    motivoEscolha: 'Para quem ama sabores tropicais!'
  },
  
  // COMBO PREMIUM PISTACHE
  {
    id: 'combo-premium-pistache',
    nome: 'Combo Premium Pistache',
    descricao: '4 morango pistache + 3 morangos tradicionais - Sofisticação e tradição!',
    produtos: ['kit-4-morango-pistache', 'kit-3-morangos'],
    precoOriginal: 78.60,
    precoPromocional: 47.99,
    desconto: 25,
    motivoEscolha: 'Combinação perfeita entre sofisticação e tradição!'
  },
  
  // COMBO CHOCOLATE LOVERS
  {
    id: 'combo-chocolate-lovers',
    nome: 'Combo Chocolate Lovers',
    descricao: '4 brownie do amor + 3 morango pistache - Para os amantes de chocolate!',
    produtos: ['kit-4-brownie', 'kit-3-morango-pistache'],
    precoOriginal: 81.70,
    precoPromocional: 42.99,
    desconto: 30,
    motivoEscolha: 'Irresistível para quem ama chocolate!'
  }
];
```

### Produtos Bolos e Doces (Seção Especial)
```typescript
const bolosEDoces = [
  {
    id: 'chocolate-com-morango',
    nome: 'CHOCOLATE COM MORANGO',
    categoria: 'bolos-vulcao',
    precoPromocional: 29.99,
    imagem: '/images/chocolate-morango.jpg',
    disponivel: true
  },
  {
    id: 'vulcao-ninho-nutella',
    nome: 'VULCÃO NINHO NUTELLA',
    categoria: 'bolos-vulcao',
    precoPromocional: 29.99,
    imagem: '/images/vulcao-ninho-nutella.jpg',
    disponivel: true
  },
  {
    id: 'pudim-de-leite',
    nome: 'PUDIM DE LEITE',
    categoria: 'sobremesas',
    peso: '150 Gr',
    precoPromocional: 19.99,
    imagem: '/images/pudim-leite.jpg',
    disponivel: true
  },
  {
    id: 'mini-naked-brownie',
    nome: 'MINI NAKED BROWNIE',
    categoria: 'sobremesas',
    descricao: 'RECHEIO BRIGADEIRO CHOCOLATE + NUTELLA + MORANGO + KINDER BUENO',
    peso: '235 GR',
    precoPromocional: 19.99,
    imagem: '/images/mini-naked-brownie.jpg',
    disponivel: true,
    maisVendido: true
  }
];

### Produtos Promocionais Especiais
```typescript
const promocoesEspeciais = [
  {
    id: 'bombom-morango-compre-3-leve-4',
    nome: 'Bombom de Morango Compre 3, leve 4',
    categoria: 'sobremesas',
    subcategoria: 'bombons',
    descricao: 'Kit com 4 Bombons, um dos mais queridos por aqui e o mais pedido. São quatro irresistíveis bombons de morango, cobertos com chocolate nobre ao leite, recheados com um delicioso brigadeiro branco cremoso.',
    peso: '82g (média)',
    precoOriginal: 23.88,
    precoPromocional: 19.90,
    promocao: 'Compre 3, leve 4',
    maisVendido: true,
    destaque: true
  },
  {
    id: 'bombom-coracao-morango',
    nome: 'Bombom Coração de Morango - 120g',
    categoria: 'sobremesas',
    subcategoria: 'bombons',
    descricao: 'Bombonzão de morango ao leite para presentear a sua pessoa especial.',
    peso: '120g',
    precoOriginal: 9.48,
    precoPromocional: 7.90,
    destaque: true
  },
  {
    id: 'coxinha-brigadeiro',
    nome: 'Coxinha de Brigadeiro',
    categoria: 'sobremesas',
    subcategoria: 'especiais',
    descricao: 'Uma delicada combinação de brigadeiro gourmet e morangos frescos. Morangos envoltos em uma camada cremosa de brigadeiro e finalizados com um toque especial de granulado belga.',
    precoOriginal: 5.88,
    precoPromocional: 4.90,
    destaque: true
  }
];
```

### Categorias de Produtos
```typescript
interface CategoriasProdutos {
  'frutas-do-amor': {
    nome: 'Frutas do Amor';
    destaque: true;
    cor: '#FECEE5';
    icone: '🍓🍇🥭🍍🍫'; // morango, uva, maracujá, abacaxi, brownie
    subtipos: ['morango', 'uva', 'maracuja', 'abacaxi', 'morango-pistache', 'brownie'];
  };
  'bolos-vulcao': {
    nome: 'Bolos Vulcão';
    cor: '#C8A364';
    icone: '🌋';
  };
  'bolos-caseiros': {
    nome: 'Bolos Caseiros';
    cor: '#8B4513';
    icone: '🍰';
  };
  'tortas': {
    nome: 'Tortas Gourmet';
    cor: '#E91E63';
    icone: '🎂';
  };
  'sobremesas': {
    nome: 'Sobremesas';
    cor: '#4CAF50';
    icone: '🍮';
  };
  'salgados': {
    nome: 'Salgados';
    cor: '#FF9800';
    icone: '🥟';
  };
}
```

### Webhook PIX
```typescript
interface WebhookPIX {
  id: string;
  orderId: string;
  status: 'waiting_payment' | 'paid' | 'expired' | 'failed';
  payload: UtmifyWebhookPayload;
  attempts: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

interface UtmifyWebhookPayload {
  orderId: string;
  platform: string;
  paymentMethod: 'pix';
  status: string;
  createdAt: string;
  approvedDate?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    country: 'BR';
    ip: string;
  };
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    priceInCents: number;
  }>;
  trackingParameters: {
    src?: string;
    sck?: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
    utm_id?: string;
  };
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
    currency: 'BRL';
  };
}
```

## Tratamento de Erros

### Estados de Erro Visual
- Cores: Usar `#FF6B6B` (vermelho suave) para erros
- Ícones: Delicados e não agressivos
- Mensagens: Tom amigável e acolhedor

### Estados de Carregamento
- Skeleton: Background `#FECEE5` com animação suave
- Spinners: Cor `#C8A364` com animação delicada

### Tratamento de Erros de Webhook
**Estratégia de Retry:**
- Tentativa 1: Imediata
- Tentativa 2: Após 30 segundos
- Tentativa 3: Após 2 minutos
- Tentativa 4: Após 5 minutos
- Tentativa 5: Após 15 minutos
- Tentativa 6+: A cada 30 minutos até 24 horas

**Tipos de Erro:**
- `NETWORK_ERROR`: Problema de conectividade
- `API_ERROR`: Erro da API Utmify (4xx, 5xx)
- `TIMEOUT_ERROR`: Timeout na requisição
- `VALIDATION_ERROR`: Dados inválidos no payload
- `AUTH_ERROR`: Problema de autenticação

**Logging e Monitoramento:**
- Log detalhado de cada tentativa
- Métricas de sucesso/falha
- Alertas para falhas críticas

## Estratégia de Testes

### Testes Visuais
1. **Consistência de Cores:** Verificar se todas as cores estão sendo aplicadas corretamente
2. **Responsividade:** Testar em diferentes tamanhos de tela
3. **Acessibilidade:** Garantir contraste adequado entre texto e background
4. **Interações:** Testar todos os estados de hover, focus e active

### Testes de Usabilidade
1. **Navegação:** Verificar se a nova identidade não prejudica a usabilidade
2. **Reconhecimento de Marca:** Testar se usuários identificam o novo conceito
3. **Conversão:** Monitorar se a nova identidade mantém ou melhora as taxas de conversão

### Testes de Webhook PIX
1. **Testes de Integração:**
   - Simular pagamentos PIX aprovados
   - Verificar envio imediato de webhooks
   - Testar cenários de falha de rede
   - Validar sistema de retry

2. **Testes de Carga:**
   - Múltiplos pagamentos simultâneos
   - Verificar performance do sistema de retry
   - Testar limites de armazenamento local

3. **Testes de Recuperação:**
   - Simular falhas prolongadas da API Utmify
   - Verificar recuperação automática
   - Testar integridade dos dados após falhas

4. **Testes End-to-End:**
   - Fluxo completo: geração PIX → pagamento → webhook → Utmify
   - Verificar rastreamento UTM correto
   - Validar cálculos de comissão

## Elementos Específicos da Marca

### Ícones e Ilustrações
- Estilo: Linha fina, delicado, minimalista
- Elementos: Corações pequenos, estrelas, elementos florais sutis
- Frutas: Representações estilizadas e fofas das frutas
- Categorias: Ícones específicos para cada tipo de produto (🍓🌋🍰🎂🍮🥟)

### Padrões e Texturas
- Backgrounds: Gradientes suaves entre `#FECEE5` e branco
- Padrões: Pontos delicados ou elementos florais muito sutis
- Texturas: Evitar texturas pesadas, manter leveza visual

### Animações e Transições
- Duração: 200-300ms para suavidade
- Easing: ease-out para naturalidade
- Elementos: Hover suave, fade-ins delicados, micro-interações charmosas

### Layout de Produtos

**Seção "Frutas do Amor" (Destaque Principal):**
```
┌─────────────────────────────────────────────────────────────────┐
│  🍓🍇🥭🍍🍫 FRUTAS DO AMOR - NOSSO DESTAQUE                     │
├─────────────────────────────────────────────────────────────────┤
│ KITS INDIVIDUAIS:                                               │
│ [Kit 3 morangos] [Kit 6 morangos] [Kit 3 uvas] [Kit 4 uvas]    │
│ [Kit 3 maracujá] [Kit 4 maracujá] [Kit 3 abacaxi]             │
│ [Kit 4 abacaxi] [Kit 3 morango pistache] [Kit 4 morango pistache]│
│ [Kit 3 brownie] [Kit 4 brownie]                               │
├─────────────────────────────────────────────────────────────────┤
│ COMBOS ESPECIAIS:                                               │
│ [COMBO MAIS VENDIDO: 12 morangos + 4 uvas]                    │
│ [COMBO COMPLETO: Todos os 6 sabores - 18 unidades]            │
│ [TRIO CLÁSSICO: morango + uva + maracujá]                     │
│ [COMBO TROPICAL: abacaxi + maracujá]                          │
│ [COMBO PREMIUM: morango pistache + morango tradicional]        │
│ [COMBO CHOCOLATE LOVERS: brownie + morango pistache]           │
└─────────────────────────────────────────────────────────────────┘
```

**Seção "Bolos e Doces" (Destaque Secundário):**
```
┌─────────────────────────────────────────┐
│  � BOLOOS E DOCES                       │
├─────────────────────────────────────────┤
│ [Chocolate Morango] [Vulcão Ninho]     │
│ [Pudim de Leite]    [Mini Naked Brownie]│
└─────────────────────────────────────────┘
```

**Outras Categorias:**
```
┌─────────────────────────────────────────┐
│  🌋 BOLOS VULCÃO COMPLETOS              │
│  🍰 BOLOS CASEIROS                      │
│  🎂 TORTAS GOURMET                      │
│  🍮 SOBREMESAS ESPECIAIS                │
│  🥟 SALGADOS                            │
└─────────────────────────────────────────┘
```

### Badges e Indicadores
- **"MAIS VENDIDO"**: Background `#E91E63`, texto branco
- **"COMBO ESPECIAL"**: Background `#C8A364`, texto branco
- **"NOVO"**: Background `#4CAF50`, texto branco
- **Desconto**: Badge circular com "20% OFF" em `#FF6B6B`
- **Estoque Limitado**: "Apenas X unidades" em `#FF9800`

## Implementação por Seções

### 1. Header e Navegação
- Substituir logo do burger por logo das "Frutas do Amor"
- Aplicar nova paleta de cores
- Ajustar ícones para estética mais delicada

### 2. Catálogo de Produtos

**Hierarquia Visual:**
1. **Frutas do Amor (Destaque Principal):**
   - Seção em destaque no topo
   - Cards maiores com bordas em `#FECEE5`
   - Badges "MAIS VENDIDO" em `#E91E63`
   - Preços promocionais em `#C8A364`

2. **Outras Categorias:**
   - Bolos Vulcão: Cards com accent em marrom chocolate
   - Tortas: Cards elegantes com detalhes dourados
   - Sobremesas: Cards delicados com tons pastéis
   - Salgados: Cards com cores mais neutras

**Elementos Visuais:**
- Substituir imagens de hambúrgueres por fotos dos doces gourmet
- Cards arredondados (12px) com sombras suaves
- Badges promocionais: "MAIS VENDIDO", "COMBO ESPECIAL", "NOVO"
- Indicadores de peso/porções em fonte pequena
- Preços com destaque visual (original riscado, promocional em destaque)

### 3. Carrinho e Checkout
- Redesenhar ícones e elementos visuais
- Aplicar nova linguagem visual
- Manter funcionalidade com nova estética

### 4. Páginas de Conteúdo
- Atualizar todas as cores e tipografia
- Substituir textos relacionados a hambúrgueres
- Implementar nova identidade em todos os elementos

### 5. Sistema de Webhook PIX Robusto

**Componentes Principais:**
- `WebhookManager`: Gerenciador central de webhooks
- `RetryService`: Sistema de retry com backoff exponencial
- `WebhookStorage`: Persistência local de webhooks pendentes
- `UtmifyClient`: Cliente HTTP otimizado para API Utmify

**Fluxo de Implementação:**
1. **Interceptação de Pagamentos:** Capturar eventos de pagamento PIX
2. **Webhook Imediato:** Tentativa de envio instantâneo
3. **Armazenamento Seguro:** Persistir webhooks não enviados
4. **Sistema de Retry:** Implementar tentativas automáticas
5. **Monitoramento:** Logs e métricas de performance
6. **Recuperação:** Reenvio automático de webhooks pendentes

**Integração com Utmify:**
- Endpoint: `https://api.utmify.com.br/api-credentials/orders`
- Autenticação: `x-api-token: VXP780tVat6jiScL4tmxBsf61Z1tvMQgDyaP`
- Formato: JSON com estrutura específica da Utmify
- Timeout: 10 segundos por requisição
- Retry: Até 6 tentativas com backoff exponencial