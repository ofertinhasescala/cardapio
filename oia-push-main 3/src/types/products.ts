// Tipos para produtos Phamela Gourmet - Frutas do Amor

export type TipoFrutaDoAmor = 'morango' | 'uva' | 'maracuja' | 'abacaxi' | 'morango-pistache' | 'brownie';

export type CategoriasProduto = 
  | 'frutas-do-amor' 
  | 'bolos-vulcao' 
  | 'bolos-caseiros' 
  | 'tortas' 
  | 'sobremesas' 
  | 'salgados' 
  | 'combos'
  | 'promocoes';

export type BadgeType = 'mais-vendido' | 'combo-especial' | 'novo' | 'promocao' | 'limitado';

// Interface base para todos os produtos
export interface ProdutoGourmet {
  id: string;
  nome: string;
  categoria: CategoriasProduto;
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
  badge?: string;
  badgeType?: BadgeType;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface específica para Frutas do Amor
export interface FrutaDoAmor extends ProdutoGourmet {
  categoria: 'frutas-do-amor';
  tipo: TipoFrutaDoAmor;
  tamanho: 'Grande';
  quantidade: number; // 3, 4, 6, etc.
}

// Interface para Combos Especiais
export interface ComboEspecial extends ProdutoGourmet {
  categoria: 'combos';
  produtos: string[]; // IDs dos produtos inclusos
  desconto: number; // percentual
  motivoEscolha?: string; // "melhor custo-benefício"
  tempoLimitado?: Date;
  estoqueRestante?: number;
}

// Interface para Promoções Especiais
export interface PromocaoEspecial extends ProdutoGourmet {
  categoria: 'promocoes';
  tipoPromocao: 'compre-x-leve-y' | 'desconto-percentual' | 'preco-especial';
  condicoes?: string; // "Compre 3, leve 4"
}

// Dados específicos das Frutas do Amor conforme design
export const FRUTAS_DO_AMOR_DATA: FrutaDoAmor[] = [
  // MORANGOS DO AMOR
  {
    id: 'kit-3-morangos',
    nome: 'Kit 3 morangos do amor',
    categoria: 'frutas-do-amor',
    tipo: 'morango',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99,
    descricao: 'Deliciosos morangos cobertos com chocolate nobre, perfeitos para momentos especiais.',
    imagem: '/images/frutas-amor/kit-3-morangos.jpg',
    disponivel: true,
    maisVendido: true,
    badge: 'MAIS VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'kit-6-morangos',
    nome: 'Kit 6 morangos do amor',
    categoria: 'frutas-do-amor',
    tipo: 'morango',
    tamanho: 'Grande',
    quantidade: 6,
    precoOriginal: 45.80,
    precoPromocional: 29.99,
    descricao: 'Kit generoso de morangos do amor para compartilhar com quem você ama.',
    imagem: '/images/frutas-amor/kit-6-morangos.jpg',
    disponivel: true,
    destaque: true
  },

  // UVAS DO AMOR
  {
    id: 'kit-3-uvas',
    nome: 'Kit 3 uvas do amor',
    categoria: 'frutas-do-amor',
    tipo: 'uva',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99,
    descricao: 'Uvas selecionadas cobertas com chocolate especial, uma experiência única.',
    imagem: '/images/frutas-amor/kit-3-uvas.jpg',
    disponivel: true
  },
  {
    id: 'kit-4-uvas',
    nome: 'Kit 4 uvas do amor',
    categoria: 'frutas-do-amor',
    tipo: 'uva',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 45.80,
    precoPromocional: 24.99,
    descricao: 'Combinação perfeita de uvas doces com cobertura de chocolate premium.',
    imagem: '/images/frutas-amor/kit-4-uvas.jpg',
    disponivel: true
  },

  // MARACUJÁ DO AMOR
  {
    id: 'kit-3-maracuja',
    nome: 'Kit 3 maracujá do amor',
    categoria: 'frutas-do-amor',
    tipo: 'maracuja',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99,
    descricao: 'Sabor tropical único com cobertura de chocolate branco especial.',
    imagem: '/images/frutas-amor/kit-3-maracuja.jpg',
    disponivel: true,
    badge: 'TROPICAL',
    badgeType: 'novo'
  },
  {
    id: 'kit-4-maracuja',
    nome: 'Kit 4 maracujá do amor',
    categoria: 'frutas-do-amor',
    tipo: 'maracuja',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 45.80,
    precoPromocional: 24.99,
    descricao: 'Experiência tropical intensificada com nosso maracujá do amor premium.',
    imagem: '/images/frutas-amor/kit-4-maracuja.jpg',
    disponivel: true
  },

  // ABACAXI DO AMOR
  {
    id: 'kit-3-abacaxi',
    nome: 'Kit 3 abacaxi do amor',
    categoria: 'frutas-do-amor',
    tipo: 'abacaxi',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 29.80,
    precoPromocional: 19.99,
    descricao: 'Doçura tropical do abacaxi harmonizada com chocolate especial.',
    imagem: '/images/frutas-amor/kit-3-abacaxi.jpg',
    disponivel: true,
    badge: 'TROPICAL',
    badgeType: 'novo'
  },
  {
    id: 'kit-4-abacaxi',
    nome: 'Kit 4 abacaxi do amor',
    categoria: 'frutas-do-amor',
    tipo: 'abacaxi',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 45.80,
    precoPromocional: 24.99,
    descricao: 'Kit tropical perfeito para quem busca sabores exóticos e refinados.',
    imagem: '/images/frutas-amor/kit-4-abacaxi.jpg',
    disponivel: true
  },

  // MORANGO DO AMOR DE PISTACHE
  {
    id: 'kit-3-morango-pistache',
    nome: 'Kit 3 morango do amor de pistache',
    categoria: 'frutas-do-amor',
    tipo: 'morango-pistache',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 32.80,
    precoPromocional: 22.99,
    descricao: 'Sofisticação única: morangos com cobertura de chocolate e pistache.',
    imagem: '/images/frutas-amor/kit-3-morango-pistache.jpg',
    disponivel: true,
    badge: 'PREMIUM',
    badgeType: 'combo-especial'
  },
  {
    id: 'kit-4-morango-pistache',
    nome: 'Kit 4 morango do amor de pistache',
    categoria: 'frutas-do-amor',
    tipo: 'morango-pistache',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 48.80,
    precoPromocional: 27.99,
    descricao: 'Experiência gourmet premium com pistache e chocolate nobre.',
    imagem: '/images/frutas-amor/kit-4-morango-pistache.jpg',
    disponivel: true,
    destaque: true
  },

  // BROWNIE DO AMOR
  {
    id: 'kit-3-brownie',
    nome: 'Kit 3 brownie do amor',
    categoria: 'frutas-do-amor',
    tipo: 'brownie',
    tamanho: 'Grande',
    quantidade: 3,
    precoOriginal: 32.90,
    precoPromocional: 17.90,
    descricao: 'Brownies artesanais cobertos com chocolate especial, irresistíveis.',
    imagem: '/images/frutas-amor/kit-3-brownie.jpg',
    disponivel: true,
    badge: 'CHOCOLATE',
    badgeType: 'mais-vendido'
  },
  {
    id: 'kit-4-brownie',
    nome: 'Kit 4 brownie do amor',
    categoria: 'frutas-do-amor',
    tipo: 'brownie',
    tamanho: 'Grande',
    quantidade: 4,
    precoOriginal: 48.90,
    precoPromocional: 27.90,
    descricao: 'Para os amantes de chocolate: brownies premium com cobertura especial.',
    imagem: '/images/frutas-amor/kit-4-brownie.jpg',
    disponivel: true,
    maisVendido: true
  }
];

// Dados dos Combos Especiais
export const COMBOS_ESPECIAIS_DATA: ComboEspecial[] = [
  {
    id: 'combo-12-morangos-4-uvas',
    nome: '12 morangos do amor + 4 Uvas do amor',
    categoria: 'combos',
    produtos: ['kit-12-morangos', 'kit-4-uvas'],
    precoOriginal: 75.90,
    precoPromocional: 49.99,
    desconto: 20,
    descricao: 'Perfeito para galera com 20% de desconto. O combo mais queridinho da casa!',
    motivoEscolha: 'A maioria dos clientes escolhe esse porque é o melhor custo-benefício!',
    imagem: '/images/combos/combo-mais-vendido.jpg',
    disponivel: true,
    maisVendido: true,
    destaque: true,
    badge: 'MAIS VENDIDO',
    badgeType: 'mais-vendido',
    estoqueRestante: 8
  },
  {
    id: 'combo-frutas-completo',
    nome: 'Combo Completo Frutas do Amor',
    categoria: 'combos',
    produtos: ['kit-3-morangos', 'kit-3-uvas', 'kit-3-maracuja', 'kit-3-abacaxi', 'kit-3-morango-pistache', 'kit-3-brownie'],
    precoOriginal: 181.90,
    precoPromocional: 99.99,
    desconto: 45,
    descricao: '3 morangos + 3 uvas + 3 maracujá + 3 abacaxi + 3 morango pistache + 3 brownie - Todos os sabores!',
    motivoEscolha: 'Perfeito para quem quer experimentar todos os sabores das frutas do amor!',
    imagem: '/images/combos/combo-completo.jpg',
    disponivel: true,
    destaque: true,
    badge: 'COMPLETO',
    badgeType: 'combo-especial'
  },
  {
    id: 'combo-trio-classico',
    nome: 'Trio Clássico Frutas do Amor',
    categoria: 'combos',
    produtos: ['kit-3-morangos', 'kit-3-uvas', 'kit-3-maracuja'],
    precoOriginal: 89.40,
    precoPromocional: 54.99,
    desconto: 25,
    descricao: '3 morangos + 3 uvas + 3 maracujá do amor - Os sabores mais pedidos!',
    motivoEscolha: 'Ideal para experimentar os sabores clássicos!',
    imagem: '/images/combos/trio-classico.jpg',
    disponivel: true,
    badge: 'CLÁSSICO',
    badgeType: 'combo-especial'
  },
  {
    id: 'combo-tropical',
    nome: 'Combo Tropical Frutas do Amor',
    categoria: 'combos',
    produtos: ['kit-4-abacaxi', 'kit-3-maracuja'],
    precoOriginal: 69.60,
    precoPromocional: 42.99,
    desconto: 25,
    descricao: '4 abacaxi + 3 maracujá do amor - Sabores tropicais irresistíveis!',
    motivoEscolha: 'Para quem ama sabores tropicais!',
    imagem: '/images/combos/tropical.jpg',
    disponivel: true,
    badge: 'TROPICAL',
    badgeType: 'novo'
  },
  {
    id: 'combo-premium-pistache',
    nome: 'Combo Premium Pistache',
    categoria: 'combos',
    produtos: ['kit-4-morango-pistache', 'kit-3-morangos'],
    precoOriginal: 78.60,
    precoPromocional: 47.99,
    desconto: 25,
    descricao: '4 morango pistache + 3 morangos tradicionais - Sofisticação e tradição!',
    motivoEscolha: 'Combinação perfeita entre sofisticação e tradição!',
    imagem: '/images/combos/premium-pistache.jpg',
    disponivel: true,
    badge: 'PREMIUM',
    badgeType: 'combo-especial'
  },
  {
    id: 'combo-chocolate-lovers',
    nome: 'Combo Chocolate Lovers',
    categoria: 'combos',
    produtos: ['kit-4-brownie', 'kit-3-morango-pistache'],
    precoOriginal: 81.70,
    precoPromocional: 42.99,
    desconto: 30,
    descricao: '4 brownie do amor + 3 morango pistache - Para os amantes de chocolate!',
    motivoEscolha: 'Irresistível para quem ama chocolate!',
    imagem: '/images/combos/chocolate-lovers.jpg',
    disponivel: true,
    badge: 'CHOCOLATE',
    badgeType: 'mais-vendido'
  }
];

// Dados dos Bolos e Doces
export const BOLOS_DOCES_DATA: ProdutoGourmet[] = [
  // Bolos Vulcão
  {
    id: 'chocolate-com-morango',
    nome: 'CHOCOLATE COM MORANGO',
    categoria: 'bolos-vulcao',
    precoOriginal: 34.99,
    precoPromocional: 29.99,
    descricao: 'Bolo vulcão com chocolate e morangos frescos, uma combinação irresistível.',
    imagem: '/images/bolos/chocolate-morango.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'vulcao-ninho-nutella',
    nome: 'VULCÃO NINHO NUTELLA',
    categoria: 'bolos-vulcao',
    precoOriginal: 34.99,
    precoPromocional: 29.99,
    descricao: 'Bolo vulcão com recheio cremoso de ninho e nutella, pura indulgência.',
    imagem: '/images/bolos/vulcao-ninho-nutella.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias',
    maisVendido: true,
    badge: 'MAIS VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'bolo-vulcao-ninho-morango',
    nome: 'BOLO VULCÃO NINHO E MORANGO 1KG',
    categoria: 'bolos-vulcao',
    precoOriginal: 54.99,
    precoPromocional: 49.99,
    descricao: 'PESO APROX 1KG - MASSA BRANCA. DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/vulcao-ninho-morango.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'mini-vulcao-dois-amores',
    nome: 'MINI VULCÃO DOIS AMORES 550g',
    categoria: 'bolos-vulcao',
    precoOriginal: 34.99,
    precoPromocional: 29.99,
    descricao: 'PESO APROX 600 GRAMAS MASSA MESCLADO. DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/mini-vulcao-dois-amores.jpg',
    disponivel: true,
    peso: '550g',
    porcoes: '4 a 6 fatias'
  },
  {
    id: 'bolo-surpresa-uva',
    nome: 'BOLO SURPRESA DE UVA 1KG',
    categoria: 'bolos-vulcao',
    precoOriginal: 54.99,
    precoPromocional: 49.99,
    descricao: 'PESO APROX 1KG 8 A 10 FATIAS MASSA BRANCA (SERVE DE 8 A 10 FATIAS). DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/bolo-surpresa-uva.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'chocolatudo-ao-leite',
    nome: 'CHOCOLATUDO AO LEITE 1KG',
    categoria: 'bolos-vulcao',
    precoOriginal: 49.99,
    precoPromocional: 46.99,
    descricao: 'MASSA CHOCOLATE PESO APROX 1KG (SERVE DE 8 A 10 FATIAS). DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/chocolatudo-ao-leite.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'dois-amores-crocante-morango',
    nome: 'DOIS AMORES CROCANTE E MORANGO 1KG',
    categoria: 'bolos-vulcao',
    precoOriginal: 54.99,
    precoPromocional: 49.99,
    descricao: 'MASSA MESCLADA PESO APROX 1KG (SERVE DE 8 A 10 FATIAS). DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/dois-amores-crocante-morango.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'dois-amores-ninho-nutella-morangos',
    nome: 'DOIS AMORES NINHO, NUTELLA E MORANGOS 1KG',
    categoria: 'bolos-vulcao',
    precoOriginal: 54.99,
    precoPromocional: 49.99,
    descricao: 'PESO APROX 1KG (SERVE DE 8 A 10 FATIAS) MASSA - MESCLADA. DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/dois-amores-ninho-nutella-morangos.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'dois-amores-tradicional',
    nome: 'DOIS AMORES TRADICIONAL 1KG',
    categoria: 'bolos-vulcao',
    precoOriginal: 49.99,
    precoPromocional: 44.99,
    descricao: 'MASSA MESCLADA PESO APROX 1KG (SERVE DE 8 A 10 FATIAS). DICA IMPORTANTE! BOLOS VULCAO REFRIGERADO PARA TRANSPORTAR NO DELIVERY! DICA: ESQUENTA NO MICROONDAS POR 1 MINUTO E MEIO, FICA BEM QUENTINHO.',
    imagem: '/images/bolos/dois-amores-tradicional.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  
  // Bolos Caseiros
  {
    id: 'bolo-baeta',
    nome: 'BOLO BAETA - COD 1510',
    categoria: 'bolos-caseiros',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Bolo caseiro tradicional com sabor único e textura macia.',
    imagem: '/images/bolos/bolo-baeta.jpg',
    disponivel: true
  },
  {
    id: 'bolo-fofo-formigueiro',
    nome: 'BOLO FOFO FORMIGUEIRO',
    categoria: 'bolos-caseiros',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Bolo caseiro com chocolate granulado, macio e delicioso.',
    imagem: '/images/bolos/bolo-fofo-formigueiro.jpg',
    disponivel: true
  },
  {
    id: 'bolo-fofo-laranja',
    nome: 'BOLO FOFO LARANJA',
    categoria: 'bolos-caseiros',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Bolo caseiro de laranja, aromático e com sabor cítrico.',
    imagem: '/images/bolos/bolo-fofo-laranja.jpg',
    disponivel: true
  },
  {
    id: 'bolo-fofo-amanteigado',
    nome: 'BOLO FOFO AMANTEIGADO - COD 1514',
    categoria: 'bolos-caseiros',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Bolo caseiro amanteigado, macio e com sabor tradicional.',
    imagem: '/images/bolos/bolo-fofo-amanteigado.jpg',
    disponivel: true
  },
  {
    id: 'bolo-fofo-chocolate',
    nome: 'BOLO FOFO CHOCOLATE 50% CACAU',
    categoria: 'bolos-caseiros',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Bolo caseiro de chocolate com 50% de cacau, intenso e saboroso.',
    imagem: '/images/bolos/bolo-fofo-chocolate.jpg',
    disponivel: true
  },
  {
    id: 'bolo-fofo-mesclado',
    nome: 'BOLO FOFO MESCLADO',
    categoria: 'bolos-caseiros',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Bolo caseiro mesclado de chocolate e baunilha, combinação perfeita.',
    imagem: '/images/bolos/bolo-fofo-mesclado.jpg',
    disponivel: true
  },
  
  // Menu Kids
  {
    id: 'bolo-vulcao-chocolatudo-kids',
    nome: 'BOLO VULCÃO CHOCOLATUDO KIDS',
    categoria: 'bolos-vulcao',
    subcategoria: 'menu-kids',
    precoOriginal: 49.99,
    precoPromocional: 46.99,
    descricao: 'PESO APROX 1KG (SERVE DE 8 A 10 FATIAS). Bolo vulcão especial para crianças com chocolate e confeitos coloridos.',
    imagem: '/images/bolos/bolo-vulcao-chocolatudo-kids.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias',
    badge: 'KIDS',
    badgeType: 'novo'
  },
  {
    id: 'combo-doce-aventura',
    nome: 'COMBO DOCE AVENTURA (BOLO - BRIGADEIROS - SALGADOS)',
    categoria: 'combos',
    subcategoria: 'menu-kids',
    precoOriginal: 119.99,
    precoPromocional: 99.99,
    descricao: '1 BOLO VULCÃO CHOCOTATUDO GRANULADO COLORIDOS + 20 SALGADOS (COXINHA DE FRANGO, BOLINHA DE QUEIJO, PASTEL DE CARNE) + 10 BRIGADEIROS TRADICIONAIS',
    imagem: '/images/combos/combo-doce-aventura.jpg',
    disponivel: true,
    badge: 'KIDS',
    badgeType: 'combo-especial'
  },
  
  // Sobremesas
  {
    id: 'pudim-de-leite',
    nome: 'PUDIM DE LEITE',
    categoria: 'sobremesas',
    peso: '150 Gr',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    descricao: 'Pudim cremoso tradicional, feito com muito carinho e ingredientes selecionados.',
    imagem: '/images/sobremesas/pudim-leite.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'mini-naked-brownie',
    nome: 'MINI NAKED BROWNIE',
    categoria: 'sobremesas',
    descricao: 'RECHEIO BRIGADEIRO CHOCOLATE + NUTELLA + MORANGO + KINDER BUENO',
    peso: '235 GR',
    precoOriginal: 24.99,
    precoPromocional: 19.99,
    imagem: '/images/sobremesas/mini-naked-brownie.jpg',
    disponivel: true,
    maisVendido: true,
    badge: 'MAIS VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'copo-da-felicidade-ninho-nutella',
    nome: 'COPO DA FELICIDADE NINHO E NUTELLA',
    categoria: 'sobremesas',
    precoOriginal: 29.99,
    precoPromocional: 24.99,
    descricao: 'PESO APROX 300 ML BROWNIE + BRIGADEIRO DE NINHO + NUTELLA',
    imagem: '/images/sobremesas/copo-felicidade-ninho-nutella.jpg',
    disponivel: true,
    peso: '300 ML'
  },
  {
    id: 'coxinha-de-morango',
    nome: 'COXINHA DE MORANGO',
    categoria: 'sobremesas',
    precoOriginal: 12.99,
    precoPromocional: 9.99,
    descricao: 'Sobremesa criativa em formato de coxinha com recheio de morango e chocolate.',
    imagem: '/images/sobremesas/coxinha-morango.jpg',
    disponivel: true,
    badge: 'NOVO',
    badgeType: 'novo'
  },
  {
    id: 'brigadeiro-gourmet-especial',
    nome: 'BRIGADEIRO GOURMET ESPECIAL',
    categoria: 'sobremesas',
    precoOriginal: 7.99,
    precoPromocional: 5.99,
    descricao: '1 UNIDADE de brigadeiro gourmet premium, feito com chocolate nobre.',
    imagem: '/images/sobremesas/brigadeiro-gourmet.jpg',
    disponivel: true
  },
  {
    id: 'tartalete-bannofe',
    nome: 'TARTALETE BANNOFE',
    categoria: 'sobremesas',
    precoOriginal: 16.99,
    precoPromocional: 14.99,
    descricao: '1 UNIDADE de tartalete com banana, doce de leite e chantilly.',
    imagem: '/images/sobremesas/tartalete-bannofe.jpg',
    disponivel: true
  },
  {
    id: 'tartalete-limao',
    nome: 'TARTALETE LIMÃO',
    categoria: 'sobremesas',
    precoOriginal: 16.99,
    precoPromocional: 14.99,
    descricao: 'UNIDADE de tartalete com creme de limão e merengue.',
    imagem: '/images/sobremesas/tartalete-limao.jpg',
    disponivel: true
  },
  {
    id: 'tartalete-morango-amendoim',
    nome: 'TARTALETE MORANGO COM AMENDOIM',
    categoria: 'sobremesas',
    precoOriginal: 18.99,
    precoPromocional: 16.99,
    descricao: '1 UNIDADE de tartalete com morango fresco e creme de amendoim.',
    imagem: '/images/sobremesas/tartalete-morango-amendoim.jpg',
    disponivel: true
  },
  {
    id: 'copo-felicidade-ninho-nutella-morangos',
    nome: 'COPO DA FELICIDADE NINHO, NUTELLA E MORANGOS',
    categoria: 'sobremesas',
    precoOriginal: 29.99,
    precoPromocional: 24.99,
    descricao: 'COPO DA FELICIDADE BROWNIE, NUTELLA, MORANGO FRESCO, BRIGADEIRO NINHO! PESO APROX 300 GRAMAS',
    imagem: '/images/sobremesas/copo-felicidade-ninho-nutella-morangos.jpg',
    disponivel: true
  },
  {
    id: 'copo-felicidade-ninho-duplo-morango',
    nome: 'COPO DA FELICIDADE NINHO DUPLO E MORANGO',
    categoria: 'sobremesas',
    precoOriginal: 29.99,
    precoPromocional: 24.99,
    descricao: '-- NINHO E MORANGO ----- PESO APROX 300 GRAMAS',
    imagem: '/images/sobremesas/copo-felicidade-ninho-duplo-morango.jpg',
    disponivel: true
  }
];

// Dados das Promoções Especiais
export const PROMOCOES_ESPECIAIS_DATA: PromocaoEspecial[] = [
  // Bombons e Chocolates
  {
    id: 'bombom-morango-compre-3-leve-4',
    nome: 'Bombom de Morango Compre 3, leve 4',
    categoria: 'promocoes',
    subcategoria: 'bombons',
    tipoPromocao: 'compre-x-leve-y',
    condicoes: 'Compre 3, leve 4',
    descricao: 'Kit com 4 Bombons, um dos mais queridos por aqui e o mais pedido. São quatro irresistíveis bombons de morango, cobertos com chocolate nobre ao leite, recheados com um delicioso brigadeiro branco cremoso.',
    peso: '82g (média)',
    precoOriginal: 23.88,
    precoPromocional: 19.90,
    imagem: '/images/promocoes/bombom-morango-kit.jpg',
    disponivel: true,
    maisVendido: true,
    destaque: true,
    badge: 'COMPRE 3 LEVE 4',
    badgeType: 'promocao'
  },
  {
    id: 'bombom-coracao-morango',
    nome: 'Bombom Coração de Morango - 120g',
    categoria: 'promocoes',
    subcategoria: 'bombons',
    tipoPromocao: 'preco-especial',
    descricao: 'Bombonzão de morango ao leite para presentear a sua pessoa especial.',
    peso: '120g',
    precoOriginal: 9.48,
    precoPromocional: 7.90,
    imagem: '/images/promocoes/bombom-coracao.jpg',
    disponivel: true,
    destaque: true,
    badge: 'PRESENTE',
    badgeType: 'novo'
  },
  {
    id: 'coxinha-brigadeiro',
    nome: 'Coxinha de Brigadeiro',
    categoria: 'promocoes',
    subcategoria: 'especiais',
    tipoPromocao: 'preco-especial',
    descricao: 'Uma delicada combinação de brigadeiro gourmet e morangos frescos. Morangos envoltos em uma camada cremosa de brigadeiro e finalizados com um toque especial de granulado belga.',
    precoOriginal: 5.88,
    precoPromocional: 4.90,
    imagem: '/images/promocoes/coxinha-brigadeiro.jpg',
    disponivel: true,
    destaque: true,
    badge: 'ESPECIAL',
    badgeType: 'novo'
  },
  
  // Combos Promocionais
  {
    id: 'kit-confra-20-salgados-coca',
    nome: 'KIT CONFRA 20 UNIDADES SALGADOS - COCA COLA 2L',
    categoria: 'promocoes',
    subcategoria: 'combos',
    tipoPromocao: 'preco-especial',
    descricao: '01 TORTA DE PRESTÍGIO OU DOIS AMORES 1KG + 20 SALGADOS SORTIDOS + COCA COLA 2 LITROS',
    precoOriginal: 99.99,
    precoPromocional: 89.99,
    imagem: '/images/promocoes/kit-confra-20-salgados.jpg',
    disponivel: true,
    badge: 'COMBO',
    badgeType: 'combo-especial'
  },
  {
    id: 'kit-feliz-mini-vulcao',
    nome: 'KIT FELIZ MINI VULCÃO 10 UNIDADES / GUARANÁ 1L',
    categoria: 'promocoes',
    subcategoria: 'combos',
    tipoPromocao: 'preco-especial',
    descricao: '01 MINI VULCÃO 550g + 10 SALGADOS SORTIDOS + 01 GUARANÁ 1L',
    precoOriginal: 59.99,
    precoPromocional: 54.99,
    imagem: '/images/promocoes/kit-feliz-mini-vulcao.jpg',
    disponivel: true,
    badge: 'COMBO',
    badgeType: 'combo-especial'
  },
  
  // Salgados Promocionais
  {
    id: '30-unidades-salgados-sortidos',
    nome: '30 UNIDADES SALGADOS - SORTIDOS 2- Opções de salgados',
    categoria: 'promocoes',
    subcategoria: 'salgados',
    tipoPromocao: 'preco-especial',
    descricao: '30 Salgados Sortido 30 Unidades (Pode Escolher Ate 02 Opções) Opções: Sortidos, Bolinha De Queijo, Coxinha De Frango, Pastel de Carne, Pastel Carne Com Açucar, Travesseiro Misto, Cornoscopio frango, Empada frango, Empada de queijo, Pãozinho queijo',
    precoOriginal: 54.99,
    precoPromocional: 49.99,
    imagem: '/images/promocoes/30-salgados-sortidos.jpg',
    disponivel: true,
    badge: 'FESTA',
    badgeType: 'promocao'
  },
  {
    id: '50-unidades-salgados-sortidos',
    nome: '50 UNIDADES SALGADOS - SORTIDOS 50 UNIDADES Até 3 opções de salgados',
    categoria: 'promocoes',
    subcategoria: 'salgados',
    tipoPromocao: 'preco-especial',
    descricao: '50 Salgados Sortido 50 Unidades (Pode Escolher Ate 03 Opções) Opções: Sortidos, Bolinha De Queijo, Coxinha De Frango, Pastel de Carne, Pastel Carne Com Açucar, Travesseiro Misto, Cornoscopio frango, Empada frango, Empada de queijo, Pãozinho queijo',
    precoOriginal: 79.99,
    precoPromocional: 74.99,
    imagem: '/images/promocoes/50-salgados-sortidos.jpg',
    disponivel: true,
    badge: 'FESTA',
    badgeType: 'promocao'
  },
  
  // Docinhos de Festa
  {
    id: '50-docinhos-festa-tradicionais',
    nome: '50 DOCINHOS DE FESTA TRADICIONAIS',
    categoria: 'promocoes',
    subcategoria: 'docinhos',
    tipoPromocao: 'preco-especial',
    descricao: 'BEM CASADO / BRIGADEIRO / BEIJINHO / AMENDOIM 50 UNIDADES',
    precoOriginal: 109.99,
    precoPromocional: 99.99,
    imagem: '/images/promocoes/50-docinhos-festa.jpg',
    disponivel: true,
    badge: 'FESTA',
    badgeType: 'promocao'
  },
  {
    id: 'combo-docinho-festa-10-unidades',
    nome: 'COMBO DOCINHO DE FESTA 10 UNIDADES - SORTIDOS IGUAL FOTO',
    categoria: 'promocoes',
    subcategoria: 'docinhos',
    tipoPromocao: 'preco-especial',
    descricao: '15 GRAMAS CADA SABORES: BRIGADEIRO/BEIJINHO/BEM CASADO/ SURPRESA DE UVA',
    precoOriginal: 29.99,
    precoPromocional: 24.99,
    imagem: '/images/promocoes/combo-docinho-festa-10.jpg',
    disponivel: true,
    badge: 'FESTA',
    badgeType: 'promocao'
  }
];

// Função helper para obter emoji baseado no tipo
export function getEmojiByType(tipo: TipoFrutaDoAmor): string {
  const emojiMap: Record<TipoFrutaDoAmor, string> = {
    'morango': '🍓',
    'uva': '🍇',
    'maracuja': '🥭',
    'abacaxi': '🍍',
    'morango-pistache': '🍓🌰',
    'brownie': '🍫'
  };
  return emojiMap[tipo] || '❤️';
}

// Dados das Tortas
export const TORTAS_DATA: ProdutoGourmet[] = [
  {
    id: 'torta-acetato-ninho-morango',
    nome: 'TORTA ACETATO NINHO E MORANGO',
    categoria: 'tortas',
    precoOriginal: 129.99,
    precoPromocional: 119.99,
    descricao: '2 CAMADAS DE RECHEIO NINHO + MORANGO FRESCO / MASSA BRANCA',
    imagem: '/images/tortas/torta-acetato-ninho-morango.jpg',
    disponivel: true,
    peso: '1.500KG',
    porcoes: '12 a 15 fatias'
  },
  {
    id: 'torta-acetato-chocolatudo',
    nome: 'TORTA ACETATO CHOCOLATUDO AO LEITE - PESO 1.500KG',
    categoria: 'tortas',
    precoOriginal: 149.99,
    precoPromocional: 139.99,
    descricao: 'MASSA CHOCOLATE - RECHEIO BRIGADEIRO CHOCOLATE - PESO 1.500KG',
    imagem: '/images/tortas/torta-acetato-chocolatudo.jpg',
    disponivel: true,
    peso: '1.500KG',
    porcoes: '12 a 15 fatias'
  },
  {
    id: 'torta-acetato-dois-amores',
    nome: 'TORTA ACETATO DOIS AMORES - PESO 1.500KG',
    categoria: 'tortas',
    precoOriginal: 134.99,
    precoPromocional: 124.99,
    descricao: 'MASSA MISTA + RECHEIO DOIS AMORES - DUAS CAMADA DE RECHEIO DOIS AMORES',
    imagem: '/images/tortas/torta-acetato-dois-amores.jpg',
    disponivel: true,
    peso: '1.500KG',
    porcoes: '12 a 15 fatias'
  },
  {
    id: 'torta-acetato-dois-amores-1kg',
    nome: 'TORTA ACETATO DOIS AMORES 1KG !',
    categoria: 'tortas',
    precoOriginal: 99.99,
    precoPromocional: 89.99,
    descricao: '2 CAMADAS DE RECHEIO DOIS AMORES / MASSA MISTA',
    imagem: '/images/tortas/torta-acetato-dois-amores-1kg.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'torta-acetato-uvinha',
    nome: 'TORTA ACETATO UVINHA - 1.500KG',
    categoria: 'tortas',
    precoOriginal: 159.99,
    precoPromocional: 149.99,
    descricao: 'MASSA BRANCA + RECHEIO BRIGADEIRO UVINHA + UVAS',
    imagem: '/images/tortas/torta-acetato-uvinha.jpg',
    disponivel: true,
    peso: '1.500KG',
    porcoes: '12 a 15 fatias'
  },
  {
    id: 'torta-acetato-uvinha-1kg',
    nome: 'TORTA ACETATO UVINHA 1 KG !',
    categoria: 'tortas',
    precoOriginal: 129.99,
    precoPromocional: 119.99,
    descricao: 'MASSA BRANCA + RECHEIO BRIGADEIRO UVINHA + UVAS',
    imagem: '/images/tortas/torta-acetato-uvinha-1kg.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'torta-aniversario-chantininho-chocolate-1kg',
    nome: 'TORTA ANIVERSÁRIO CHANTININHO COM GANACHE DE CHOCOLATE 1 KG',
    categoria: 'tortas',
    precoOriginal: 109.99,
    precoPromocional: 99.99,
    descricao: '2 CAMADAS DE RECHEIO DOIS AMORES / MASSA MISTA - PESO 1 KG',
    imagem: '/images/tortas/torta-aniversario-chantininho-chocolate-1kg.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  },
  {
    id: 'torta-aniversario-chantininho-chocolate-2kg',
    nome: 'TORTA ANIVERSÁRIO CHATININHO COM GANACHE DE CHOCOLATE 2KG',
    categoria: 'tortas',
    precoOriginal: 199.99,
    precoPromocional: 189.99,
    descricao: '2 CAMADAS DE RECHEIO DOIS AMORES / MASSA MISTA - PESO 2 KG',
    imagem: '/images/tortas/torta-aniversario-chantininho-chocolate-2kg.jpg',
    disponivel: true,
    peso: '2KG',
    porcoes: '16 a 20 fatias'
  },
  {
    id: 'torta-dois-amores-tradicional-1kg',
    nome: 'TORTA DOIS AMORES TRADICIONAL 1KG',
    categoria: 'tortas',
    precoOriginal: 54.99,
    precoPromocional: 49.99,
    descricao: 'PESO 1 KG 1 CAMADA DE RECHEIO BEM GENEROSA',
    imagem: '/images/tortas/torta-dois-amores-tradicional-1kg.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'torta-redvelvet-morango-1kg',
    nome: 'TORTA REDVELVET COM MORANGO 1KG',
    categoria: 'tortas',
    precoOriginal: 59.99,
    precoPromocional: 56.99,
    descricao: 'PESO 1KG 1 CAMADA DE RECHEIO BEM GENEROSA BRIGADEIRO BRANCO + GELEIA DE MORANGO',
    imagem: '/images/tortas/torta-redvelvet-morango-1kg.jpg',
    disponivel: true,
    peso: '1KG',
    porcoes: '8 a 10 fatias'
  }
];

// Dados das Super Fatias
export const SUPER_FATIAS_DATA: ProdutoGourmet[] = [
  {
    id: 'fatia-abacaxi-coco-cremoso',
    nome: 'FATIA ABACAXI COM COCO CREMOSO',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 24.99,
    precoPromocional: 22.99,
    descricao: 'PESO APROX 250 GRAMAS',
    imagem: '/images/fatias/fatia-abacaxi-coco-cremoso.jpg',
    disponivel: true,
    peso: '250g',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'fatia-bolo-noiva',
    nome: 'FATIA BOLO DE NOIVA',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 26.99,
    precoPromocional: 24.99,
    descricao: '01 (UNIDADE) FATIA.',
    imagem: '/images/fatias/fatia-bolo-noiva.jpg',
    disponivel: true
  },
  {
    id: 'fatia-dois-amores-tradicional',
    nome: 'FATIA DOIS AMORES TRADICIONAL',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 22.99,
    precoPromocional: 19.99,
    descricao: 'PESO APROX 250 GRAMAS',
    imagem: '/images/fatias/fatia-dois-amores-tradicional.jpg',
    disponivel: true,
    peso: '250g',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'fatia-ninho-morango-fresco',
    nome: 'FATIA NINHO E MORANGO FRESCO',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 24.99,
    precoPromocional: 22.99,
    descricao: 'Fatia generosa de torta com recheio de ninho e morangos frescos.',
    imagem: '/images/fatias/fatia-ninho-morango-fresco.jpg',
    disponivel: true
  },
  {
    id: 'fatia-torta-alema',
    nome: 'FATIA TORTA ALEMÃ - PESO 100 GRAMAS',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 16.99,
    precoPromocional: 14.99,
    descricao: 'CREME BAUNILHA CREMOSO - BISCOITO MARIA - CHOCOLATE SICÃO AO LEITE',
    imagem: '/images/fatias/fatia-torta-alema.jpg',
    disponivel: true,
    peso: '100g'
  },
  {
    id: 'super-fatia-chocolatudo-meio-amargo',
    nome: 'SUPER FATIA CHOCOLATUDO MEIO AMARGO',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 24.99,
    precoPromocional: 22.99,
    descricao: 'Fatia generosa de torta com chocolate meio amargo intenso.',
    imagem: '/images/fatias/super-fatia-chocolatudo-meio-amargo.jpg',
    disponivel: true
  },
  {
    id: 'super-fatia-uvinha',
    nome: 'SUPER FATIA UVINHA',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 24.99,
    precoPromocional: 22.99,
    descricao: 'Fatia generosa de torta com recheio de brigadeiro de uva e uvas frescas.',
    imagem: '/images/fatias/super-fatia-uvinha.jpg',
    disponivel: true
  },
  {
    id: 'fatia-red-velvet-morango',
    nome: 'FATIA RED VELVET COM MORANGO',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 22.99,
    precoPromocional: 19.99,
    descricao: 'PESO APROX 250 GRAMAS',
    imagem: '/images/fatias/fatia-red-velvet-morango.jpg',
    disponivel: true,
    peso: '250g',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'super-fatia-brownie-dois-amores',
    nome: 'SUPER FATIA DE BROWNIE DOIS AMORES',
    categoria: 'tortas',
    subcategoria: 'fatias',
    precoOriginal: 26.99,
    precoPromocional: 24.99,
    descricao: 'Fatia generosa de brownie com recheio dois amores.',
    imagem: '/images/fatias/super-fatia-brownie-dois-amores.jpg',
    disponivel: true
  }
];

// Dados dos Salgados
export const SALGADOS_DATA: ProdutoGourmet[] = [
  {
    id: '100-unidades-salgados-sortidos',
    nome: '100 UNIDADES SALGADOS - SORTIDOS Até 4 opções de salgados',
    categoria: 'salgados',
    precoOriginal: 159.99,
    precoPromocional: 149.99,
    descricao: '100 Salgados Sortido 100 Unidades (Pode Escolher Ate 04 Opções) Opções: Sortidos, Bolinha De Queijo, Coxinha De Frango, Pastel de Carne, Pastel Carne Com Açucar, Travesseiro Misto, Cornoscopio frango, Empada frango, Empada de queijo, Pãozinho queijo',
    imagem: '/images/salgados/100-unidades-salgados-sortidos.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'combo-salgados-sortido-16-unidades',
    nome: 'COMBO SALGADOS SORTIDO 16 UNIDADES',
    categoria: 'salgados',
    precoOriginal: 32.99,
    precoPromocional: 28.99,
    descricao: '1 COMBO 28,99 - / COXINHA FRANGO / PASTEL DE CARNE / PASTEL DE CARNE COM AÇUCAR / BOLINHA DE QUEIJO',
    imagem: '/images/salgados/combo-salgados-sortido-16-unidades.jpg',
    disponivel: true
  },
  {
    id: 'combo-empadinha-frango',
    nome: 'COMBO EMPADINHA DE FRANGO',
    categoria: 'salgados',
    precoOriginal: 16.99,
    precoPromocional: 14.99,
    descricao: '5 UNIDADES UNIDADE PESA APROX 40 GRAMAS',
    imagem: '/images/salgados/combo-empadinha-frango.jpg',
    disponivel: true
  },
  {
    id: 'combo-empadinha-queijo',
    nome: 'COMBO EMPADINHA DE QUEIJO',
    categoria: 'salgados',
    precoOriginal: 16.99,
    precoPromocional: 14.99,
    descricao: '5 UNIDADES',
    imagem: '/images/salgados/combo-empadinha-queijo.jpg',
    disponivel: true
  },
  {
    id: 'coxao-camarao-catupiry',
    nome: 'COXÃO CAMARÃO COM CATUPIRY ORIGINAL',
    categoria: 'salgados',
    precoOriginal: 20.99,
    precoPromocional: 18.99,
    descricao: 'PESO APROX 200 gramas UNIDADE R$ 18,99',
    imagem: '/images/salgados/coxao-camarao-catupiry.jpg',
    disponivel: true,
    peso: '200g',
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'coxao-carne-sol-catupiry',
    nome: 'COXÃO DE CARNE DE SOL COM CATUPIRY ORIGINAL',
    categoria: 'salgados',
    precoOriginal: 18.99,
    precoPromocional: 16.99,
    descricao: 'Coxão recheado com carne de sol e catupiry original.',
    imagem: '/images/salgados/coxao-carne-sol-catupiry.jpg',
    disponivel: true,
    peso: '200g'
  },
  {
    id: 'coxao-frango-catupiry',
    nome: 'COXÃO DE FRANGO COM CATUPIRY ORIGINAL',
    categoria: 'salgados',
    precoOriginal: 17.99,
    precoPromocional: 15.99,
    descricao: 'PESO 200 GRAMAS - UNIDADE R$ 15,99',
    imagem: '/images/salgados/coxao-frango-catupiry.jpg',
    disponivel: true,
    peso: '200g'
  },
  {
    id: 'empadao-camarao-cremoso',
    nome: 'EMPADÃO DE CAMARÃO CREMOSO',
    categoria: 'salgados',
    precoOriginal: 18.99,
    precoPromocional: 16.99,
    descricao: 'Unidade R$ 16,99',
    imagem: '/images/salgados/empadao-camarao-cremoso.jpg',
    disponivel: true
  },
  {
    id: 'empadao-frango-cremoso',
    nome: 'EMPADÃO DE FRANGO CREMOSO',
    categoria: 'salgados',
    precoOriginal: 17.99,
    precoPromocional: 15.99,
    descricao: 'unidade R$ 15,99',
    imagem: '/images/salgados/empadao-frango-cremoso.jpg',
    disponivel: true
  },
  {
    id: 'paozinho-queijo-reino',
    nome: 'PÃOZINHO DE QUEIJO DO REINO',
    categoria: 'salgados',
    precoOriginal: 13.99,
    precoPromocional: 11.99,
    descricao: '1 UNIDADE 11,99',
    imagem: '/images/salgados/paozinho-queijo-reino.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'paozinho-frango-queijo-parmesao',
    nome: 'PÃOZINHO FRANGO COM QUEIJO PARMESÃO',
    categoria: 'salgados',
    precoOriginal: 13.99,
    precoPromocional: 11.99,
    descricao: '1 UNIDADE 11,99',
    imagem: '/images/salgados/paozinho-frango-queijo-parmesao.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'pastel-carne-acucar',
    nome: 'PASTEL DE CARNE COM AÇUCAR (UNIDADE)',
    categoria: 'salgados',
    precoOriginal: 8.00,
    precoPromocional: 7.00,
    descricao: 'O FAMOSO PASTEL DE CARNE COM AÇUCAR AGORA VENDIDO POR UNIDADE EM TAMANHO GRANDE',
    imagem: '/images/salgados/pastel-carne-acucar.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  }
];

// Dados dos Kits Festa
export const KITS_FESTA_DATA: ProdutoGourmet[] = [
  {
    id: 'kit-festa-10-pessoas',
    nome: 'KIT FESTA 10 PESSOAS 1 KG / 50 SALGADOS COCA 2 LITROS',
    categoria: 'combos',
    subcategoria: 'kits-festa',
    precoOriginal: 189.99,
    precoPromocional: 179.99,
    descricao: '01 TORTA CHANTILLY 1KG + 50 SALGADOS (SORTIDOS OU ESCOLHIDOS 03 OPÇÕES) + COCA COLA 2 LITROS',
    imagem: '/images/kits-festa/kit-festa-10-pessoas.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'kit-festa-20-pessoas',
    nome: 'KIT FESTA 20 PESSOAS 2KG / 100 SALGADOS',
    categoria: 'combos',
    subcategoria: 'kits-festa',
    precoOriginal: 349.99,
    precoPromocional: 339.99,
    descricao: 'TORTA CHANTILLY 2KG + 100 SALGADOS (SORTIDOS OU ESCOLHIDOS 04 OPÇÕES) + COCA COLA 2 LITROS',
    imagem: '/images/kits-festa/kit-festa-20-pessoas.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'kit-festa-feliz-50-salgados',
    nome: 'KIT FESTA FELIZ 50 UNIDADES DE SALGADOS - COCA COLA 2 LITRO',
    categoria: 'combos',
    subcategoria: 'kits-festa',
    precoOriginal: 139.99,
    precoPromocional: 129.99,
    descricao: '01 TORTA PRESTÍGIO OU DOIS AMORES + 50 SALGADOS (SORTIDOS OU ESCOLHIDOS 03 OPÇÕES) + COCA COLA 2 LITROS',
    imagem: '/images/kits-festa/kit-festa-feliz-50-salgados.jpg',
    disponivel: true,
    maisVendido: true,
    badge: '+ VENDIDO',
    badgeType: 'mais-vendido'
  },
  {
    id: 'kit-hora-lanche-30-salgados',
    nome: 'KIT HORA DO LANCHE 30 SALGADOS SORTIDOS',
    categoria: 'combos',
    subcategoria: 'kits-festa',
    precoOriginal: 79.99,
    precoPromocional: 74.99,
    descricao: '01 MINI VULCÃO DOIS AMORES 550g + 30 SALGADOS (SORTIDOS OU ESCOLHIDOS 02 OPÇÕES)',
    imagem: '/images/kits-festa/kit-hora-lanche-30-salgados.jpg',
    disponivel: true
  }
];

// Função helper para obter cor baseada na categoria
export function getColorByCategory(categoria: CategoriasProduto): string {
  const colorMap: Record<CategoriasProduto, string> = {
    'frutas-do-amor': '#FECEE5',
    'bolos-vulcao': '#C8A364',
    'bolos-caseiros': '#8B4513',
    'tortas': '#E91E63',
    'sobremesas': '#4CAF50',
    'salgados': '#FF9800',
    'combos': '#C8A364',
    'promocoes': '#FF6B6B'
  };
  return colorMap[categoria] || '#FECEE5';
}

// Função helper para calcular desconto
export function calculateDiscount(precoOriginal: number, precoPromocional: number): number {
  return Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100);
}