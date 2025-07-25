# 🎨 Guia de Personalização - Cardápio Digital

Este guia mostra como personalizar completamente seu cardápio digital.

## 📋 Estrutura de Arquivos

```
├── index.html          # Página principal
├── config.js          # Configurações da loja e produtos
├── data.js            # Importação das configurações
├── app.js             # Lógica da aplicação
├── styles.css         # Estilos visuais
└── README.md          # Documentação
```

## 🏪 Personalizando a Loja

### 1. Informações Básicas
Edite o arquivo `config.js`:

```javascript
const LOJA_CONFIG = {
    nome: "Sua Loja",
    logo: "caminho/para/logo.jpg",
    banner: "caminho/para/banner.jpg",
    tempoEntrega: "30-45 min",
    entregaGratis: "Grátis",
    avaliacao: 4.9,
    totalAvaliacoes: 939,
    distancia: "2,3 km"
};
```

### 2. Categorias de Produtos
```javascript
const CATEGORIAS_CONFIG = [
    {
        id: 'frutas-do-amor',
        nome: 'Frutas do Amor',
        icone: '🍓',
        ativo: true,
        destaque: true  // Adiciona badge "Popular"
    }
];
```

## 🛍️ Adicionando Produtos

### Estrutura Básica de Produto
```javascript
{
    id: 'produto-unico-id',
    nome: 'Nome do Produto',
    descricao: 'Descrição detalhada',
    preco: 19.99,                    // Preço normal
    precoOriginal: 29.99,            // Preço original (para promoções)
    precoPromocional: 19.99,         // Preço promocional
    imagem: 'caminho/para/imagem.jpg',
    categoria: 'categoria-id',
    disponivel: true,
    
    // Opcionais
    maisVendido: true,               // Badge "Mais vendido"
    destaque: true,                  // Badge "🔥 Destaque"
    desconto: 25,                    // Percentual de desconto
    peso: '150g',                    // Peso do produto
    quantidade: 3,                   // Quantidade de unidades
    promocao: 'Compre 3, leve 4',   // Texto da promoção
    motivoEscolha: 'Melhor custo-benefício!' // Motivação de compra
}
```

### Exemplo Prático - Frutas do Amor
```javascript
const frutasDoAmor = [
    {
        id: 'kit-3-morangos',
        nome: 'Kit 3 morangos do amor',
        descricao: 'Deliciosos morangos cobertos com chocolate ao leite',
        tipo: 'morango',
        tamanho: 'Grande',
        quantidade: 3,
        precoOriginal: 29.80,
        precoPromocional: 19.99,
        categoria: 'frutas-do-amor',
        imagem: '/images/kit-3-morangos.jpg',
        disponivel: true,
        maisVendido: true,
        desconto: 33
    }
];
```

### Exemplo - Combos Especiais
```javascript
const combosEspeciais = [
    {
        id: 'combo-12-morangos-4-uvas',
        nome: '12 morangos do amor + 4 Uvas do amor',
        descricao: 'Perfeito para galera com 20% de desconto',
        produtos: ['kit-12-morangos', 'kit-4-uvas'],
        precoOriginal: 75.90,
        precoPromocional: 49.99,
        desconto: 20,
        motivoEscolha: 'A maioria dos clientes escolhe esse porque é o melhor custo-benefício!',
        maisVendido: true,
        destaque: true,
        categoria: 'combos',
        imagem: '/images/combo-especial.jpg'
    }
];
```

## 🎨 Personalizando Cores e Estilos

### 1. Cores Principais
No arquivo `styles.css`, você pode alterar as variáveis CSS:

```css
:root {
    --cor-primaria: #D4A574;
    --cor-secundaria: #8B4513;
    --cor-destaque: #22c55e;
    --cor-fundo: #F8FAFC;
}
```

### 2. Badges e Tags
```css
.tag-mais-vendido {
    background-color: #fef3c7;
    color: #d97706;
}

.tag-promocao {
    background-color: #fee2e2;
    color: #dc2626;
}
```

## 📱 Funcionalidades Disponíveis

### ✅ Implementadas
- [x] Layout responsivo mobile-first
- [x] Sistema de busca em tempo real
- [x] Carrinho de compras
- [x] Modal de localização
- [x] Categorias dinâmicas
- [x] Produtos com promoções
- [x] Badges e tags
- [x] Preços promocionais

### 🔄 Em Desenvolvimento
- [ ] Modal detalhado do produto
- [ ] Checkout completo
- [ ] Integração com pagamento
- [ ] Sistema de pedidos

## 🚀 Como Adicionar Seus Produtos

### Passo 1: Prepare suas imagens
- Tamanho recomendado: 400x300px
- Formato: JPG ou PNG
- Coloque na pasta `/images/`

### Passo 2: Edite o config.js
```javascript
// Substitua os produtos de exemplo pelos seus
PRODUTOS_CONFIG.frutasDoAmor = [
    {
        id: 'meu-produto-1',
        nome: 'Meu Produto',
        // ... suas configurações
    }
];
```

### Passo 3: Teste no navegador
Abra o `index.html` e verifique se tudo está funcionando.

## 💡 Dicas Importantes

1. **IDs únicos**: Cada produto deve ter um ID único
2. **Imagens**: Use URLs completas ou caminhos relativos
3. **Preços**: Use números decimais (19.99, não "R$ 19,99")
4. **Disponibilidade**: Produtos indisponíveis ficam acinzentados
5. **Performance**: Otimize imagens para web

## 🆘 Solução de Problemas

### Produto não aparece
- Verifique se o ID é único
- Confirme se `disponivel: true`
- Verifique se a categoria existe

### Imagem não carrega
- Confirme o caminho da imagem
- Teste a URL diretamente no navegador
- Verifique permissões de arquivo

### Preço não aparece corretamente
- Use números, não strings
- Formato: `19.99` não `"19,99"`
- Para promoções, defina `precoOriginal` e `precoPromocional`

## 📞 Suporte

Para dúvidas sobre personalização, consulte os exemplos no `config.js` ou abra uma issue no repositório.