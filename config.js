// ===== CONFIGURAÇÃO DA LOJA =====
const LOJA_CONFIG = {
    nome: "Atelier Phamela Gourmet",
    logo: "images/produtos/logo.png",
    banner: "images/produtos/banner_de_morango.png", // Nova imagem de morangos brilhantes enviada pelo usuário
    tempoEntrega: "30-45 min",
    taxaEntrega: "R$ 15,00",
    entregaGratis: "Grátis",
    descricao: "Doces artesanais feitos com muito carinho",
    avaliacao: 4.9,
    totalAvaliacoes: 939,
    distancia: "2,3 km",
    nivel: "Nível 4 de 5",
    instagram: "https://www.instagram.com/phamela.gourmetofc/",
    cores: {
        primaria: "#FECEE5",
        secundaria: "#CDAD73",
        destaque: "#FFFFFF"
    }
};

// ===== CATEGORIAS DE PRODUTOS =====
const CATEGORIAS_CONFIG = [
    {
        id: 'frutasDoAmor',
        nome: 'Frutas do Amor',
        icone: '🍓',
        ativo: true
    },
    {
        id: 'combosEspeciais',
        nome: 'Combos Especiais',
        icone: '🎁',
        ativo: true,
        destaque: true
    },
    {
        id: 'bolosEDoces',
        nome: 'Bolos & Doces',
        icone: '🍰',
        ativo: true
    },
    {
        id: 'promocoesEspeciais',
        nome: 'Promoções Especiais',
        icone: '🔥',
        ativo: true,
        destaque: true
    }
];

// ===== PRODUTOS REAIS =====
const PRODUTOS_CONFIG = {
    // FRUTAS DO AMOR
    frutasDoAmor: [
        // MORANGOS DO AMOR
        {
            id: 'kit-3-morangos',
            nome: 'Kit 3 morangos do amor',
            tipo: 'morango',
            tamanho: 'Grande',
            quantidade: 3,
            precoOriginal: 29.80,
            precoPromocional: 19.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_3morangos.png',
            disponivel: true,
            descricao: 'Deliciosos morangos do amor cobertos com chocolate'
        },
        {
            id: 'kit-6-morangos',
            nome: 'Kit 6 morangos do amor',
            tipo: 'morango',
            tamanho: 'Grande',
            quantidade: 6,
            precoOriginal: 45.80,
            precoPromocional: 29.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_6morangos.png',
            disponivel: true,
            descricao: 'Kit com 6 deliciosos morangos do amor cobertos com chocolate'
        },
        // UVAS DO AMOR
        {
            id: 'kit-3-uvas',
            nome: 'Kit 3 uvas do amor',
            tipo: 'uva',
            tamanho: 'Grande',
            quantidade: 3,
            precoOriginal: 29.80,
            precoPromocional: 19.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_4uvas.png', // Usando a imagem de 4 uvas disponível
            disponivel: true,
            descricao: 'Uvas do amor cobertas com chocolate especial'
        },
        {
            id: 'kit-4-uvas',
            nome: 'Kit 4 uvas do amor',
            tipo: 'uva',
            tamanho: 'Grande',
            quantidade: 4,
            precoOriginal: 45.80,
            precoPromocional: 24.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_4uvas.png',
            disponivel: true,
            descricao: 'Kit com 4 uvas do amor cobertas com chocolate especial'
        },
        // MARACUJÁ DO AMOR
        {
            id: 'kit-3-maracuja',
            nome: 'Kit 3 maracujá do amor',
            tipo: 'maracuja',
            tamanho: 'Grande',
            quantidade: 3,
            precoOriginal: 29.80,
            precoPromocional: 19.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/Kit_3Maracujas.jpeg',
            disponivel: true,
            descricao: 'Maracujá do amor com cobertura de chocolate'
        },
        {
            id: 'kit-4-maracuja',
            nome: 'Kit 4 maracujá do amor',
            tipo: 'maracuja',
            tamanho: 'Grande',
            quantidade: 4,
            precoOriginal: 45.80,
            precoPromocional: 24.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_4maracuja.jpg',
            disponivel: true,
            descricao: 'Kit com 4 maracujá do amor com cobertura de chocolate'
        },
        // ABACAXI DO AMOR
        {
            id: 'kit-3-abacaxi',
            nome: 'Kit 3 abacaxi do amor',
            tipo: 'abacaxi',
            tamanho: 'Grande',
            quantidade: 3,
            precoOriginal: 29.80,
            precoPromocional: 19.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_3abacaxi.jpg',
            disponivel: true,
            descricao: 'Abacaxi do amor coberto com chocolate tropical'
        },
        {
            id: 'kit-4-abacaxi',
            nome: 'Kit 4 abacaxi do amor',
            tipo: 'abacaxi',
            tamanho: 'Grande',
            quantidade: 4,
            precoOriginal: 45.80,
            precoPromocional: 24.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_4abacaxi.jpg',
            disponivel: true,
            descricao: 'Kit com 4 abacaxi do amor coberto com chocolate tropical'
        },
        // MORANGO DO AMOR DE PISTACHE
        {
            id: 'kit-3-morango-pistache',
            nome: 'Kit 3 morango do amor de pistache',
            tipo: 'morango-pistache',
            tamanho: 'Grande',
            quantidade: 3,
            precoOriginal: 32.80,
            precoPromocional: 22.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/kit_3morango_de_pistache.jpg',
            disponivel: true,
            destaque: true,
            descricao: 'Morangos do amor com cobertura especial de pistache'
        },
        {
            id: 'kit-4-morango-pistache',
            nome: 'Kit 4 morango do amor de pistache',
            tipo: 'morango-pistache',
            tamanho: 'Grande',
            quantidade: 4,
            precoOriginal: 48.80,
            precoPromocional: 27.99,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/Kit_4pistache.jpg',
            disponivel: true,
            destaque: true,
            descricao: 'Kit com 4 morangos do amor com cobertura especial de pistache'
        },
        // BROWNIE DO AMOR
        {
            id: 'kit-3-brownie',
            nome: 'Kit 3 brownie do amor',
            tipo: 'brownie',
            tamanho: 'Grande',
            quantidade: 3,
            precoOriginal: 32.90,
            precoPromocional: 17.90,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/Kit_3brownie.jpg',
            disponivel: true,
            descricao: 'Brownies do amor com chocolate especial'
        },
        {
            id: 'kit-4-brownie',
            nome: 'Kit 4 brownie do amor',
            tipo: 'brownie',
            tamanho: 'Grande',
            quantidade: 4,
            precoOriginal: 48.90,
            precoPromocional: 27.90,
            categoria: 'frutas-do-amor',
            imagem: 'images/produtos/Kit_4Brownie.PNG',
            disponivel: true,
            descricao: 'Kit com 4 brownies do amor com chocolate especial'
        }
    ],

    // COMBOS ESPECIAIS
    combosEspeciais: [
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
            destaque: true,
            categoria: 'combos',
            imagem: 'images/produtos/kit_12morangos_kit_4uvas.png', // Atualizado para imagem local
            disponivel: true
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
            destaque: true,
            categoria: 'combos',
            imagem: 'images/produtos/combo_completo.jpg', // Atualizado para imagem local
            disponivel: true
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
            motivoEscolha: 'Ideal para experimentar os sabores clássicos!',
            categoria: 'combos',
            imagem: 'images/produtos/trio_classico_frutasdo_amor.jpg', // Atualizado para imagem local
            disponivel: true
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
            motivoEscolha: 'Para quem ama sabores tropicais!',
            categoria: 'combos',
            imagem: 'images/produtos/kit_4maracuja.jpg', // Atualizado para imagem local
            disponivel: true
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
            motivoEscolha: 'Combinação perfeita entre sofisticação e tradição!',
            categoria: 'combos',
            imagem: 'images/produtos/Combo_premium_pistache.jpg', // Atualizado para imagem local
            disponivel: true
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
            motivoEscolha: 'Irresistível para quem ama chocolate!',
            categoria: 'combos',
            imagem: 'images/produtos/Kit_4Brownie.PNG', // Atualizado para imagem local
            disponivel: true
        }
    ],

    // BOLOS & DOCES
    bolosEDoces: [
        {
            id: 'chocolate-com-morango',
            nome: 'CHOCOLATE COM MORANGO',
            categoria: 'bolos-vulcao',
            precoPromocional: 29.99,
            imagem: 'images/produtos/bolo_chocolate_com_morango.png', // Atualizado para imagem local
            disponivel: true,
            descricao: 'Delicioso bolo vulcão de chocolate com morango'
        },
        {
            id: 'vulcao-ninho-nutella',
            nome: 'VULCÃO NINHO NUTELLA',
            categoria: 'bolos-vulcao',
            precoPromocional: 29.99,
            imagem: 'images/produtos/Ninho_vulcao.png', // Atualizado para imagem local
            disponivel: true,
            descricao: 'Bolo vulcão com recheio de ninho e nutella'
        },
        {
            id: 'pudim-de-leite',
            nome: 'PUDIM DE LEITE',
            categoria: 'sobremesas',
            peso: '150 Gr',
            precoPromocional: 19.99,
            imagem: 'images/produtos/Pudim.jpg', // Atualizado para imagem local
            disponivel: true,
            descricao: 'Pudim de leite cremoso tradicional'
        },
        {
            id: 'mini-naked-brownie',
            nome: 'MINI NAKED BROWNIE',
            categoria: 'sobremesas',
            descricao: 'RECHEIO BRIGADEIRO CHOCOLATE + NUTELLA + MORANGO + KINDER BUENO',
            peso: '235 GR',
            precoPromocional: 19.99,
            imagem: 'images/produtos/mini_naked.png', // Atualizado para imagem local
            disponivel: true,
            maisVendido: true
        }
    ],

    // PROMOÇÕES ESPECIAIS
    promocoesEspeciais: [
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
            destaque: true,
            imagem: 'images/produtos/BomBom_de_morango_compre3_leve4.jpg', // Atualizado para imagem local
            disponivel: true
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
            destaque: true,
            imagem: 'images/produtos/BomBom_coração_de_morango.PNG', // Atualizado para imagem local
            disponivel: true
        },
        {
            id: 'coxinha-brigadeiro',
            nome: 'Coxinha de Brigadeiro',
            categoria: 'sobremesas',
            subcategoria: 'especiais',
            descricao: 'Uma delicada combinação de brigadeiro gourmet e morangos frescos. Morangos envoltos em uma camada cremosa de brigadeiro e finalizados com um toque especial de granulado belga.',
            precoOriginal: 5.88,
            precoPromocional: 4.90,
            destaque: true,
            imagem: 'images/produtos/coxinha_de_morango.jpg', // Atualizado para imagem local
            disponivel: true
        }
    ]
};

// ===== LOCALIZAÇÃO =====
const LOCALIZACAO_CONFIG = {
    estados: [
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'SC', nome: 'Santa Catarina' }
    ],
    cidades: {
        'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
        'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Friburgo'],
        'MG': ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem'],
        'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria'],
        'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa'],
        'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó']
    }
};

// ===== FUNÇÃO PARA ADICIONAR PRODUTOS DINAMICAMENTE =====
function adicionarProdutos(categoria, novosProdutos) {
    if (PRODUTOS_CONFIG[categoria]) {
        PRODUTOS_CONFIG[categoria] = [...PRODUTOS_CONFIG[categoria], ...novosProdutos];
    } else {
        console.warn(`Categoria ${categoria} não encontrada`);
    }
}

// ===== FUNÇÃO PARA SUBSTITUIR PRODUTOS DE UMA CATEGORIA =====
function substituirProdutos(categoria, novosProdutos) {
    if (PRODUTOS_CONFIG[categoria]) {
        PRODUTOS_CONFIG[categoria] = novosProdutos;
    } else {
        console.warn(`Categoria ${categoria} não encontrada`);
    }
}

// ===== FUNÇÃO PARA OBTER TODOS OS PRODUTOS =====
function obterTodosProdutos() {
    return Object.values(PRODUTOS_CONFIG).flat();
}

// ===== FUNÇÃO PARA OBTER PRODUTOS POR CATEGORIA =====
function obterProdutosPorCategoria(categoria) {
    return PRODUTOS_CONFIG[categoria] || [];
}