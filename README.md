# 🍓 Cardápio Digital - Estilo iFood/Anota.ai

Cardápio digital simples, direto e elegante, inspirado nos apps mais famosos do nicho como iFood e Anota.ai.

## ✨ Características

- **Design Limpo**: Interface minimalista focada nos produtos
- **Mobile-First**: Otimizado para dispositivos móveis
- **Sem Distrações**: Sem barras de busca ou elementos desnecessários
- **Fácil Navegação**: Scroll direto pelos produtos
- **Header Moderno**: Estilo idêntico aos apps famosos

## 🎯 Funcionalidades Principais

### ✅ **Implementadas**
- [x] Header elegante com logo circular
- [x] Informações da loja (avaliação, tempo, distância)
- [x] Cards de produtos estilo iFood
- [x] Preços com desconto visual
- [x] Badges (Mais vendido, Destaque, Promoção)
- [x] Carrinho fixo na parte inferior
- [x] Modal de localização
- [x] Design responsivo

### 🔄 **Próximas**
- [ ] Modal detalhado do produto
- [ ] Checkout completo
- [ ] Integração com pagamento

## 📱 Interface

### Header Moderno
- Banner com imagem da loja
- Logo circular sobreposta
- Informações organizadas (distância, pedido mínimo)
- Avaliações com estrelas
- Tempo de entrega destacado

### Produtos Simples
- Layout estilo lista (como iFood)
- Imagem + informações + preço
- Tags visuais para promoções
- Sem elementos que distraem
- Foco total nos produtos

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos customizados + Tailwind CSS
- **JavaScript**: Funcionalidades essenciais
- **Feather Icons**: Ícones modernos

## 📂 Estrutura

```
├── index.html              # Página principal
├── config.js              # Configurações da loja
├── data.js                # Importação dos dados
├── app.js                 # Lógica da aplicação
├── styles.css             # Estilos visuais
├── PERSONALIZACAO.md      # Guia de personalização
└── README.md              # Esta documentação
```

## 🚀 Como Personalizar

### 1. Informações da Loja
Edite `config.js`:
```javascript
const LOJA_CONFIG = {
    nome: "Sua Loja",
    logo: "caminho/para/logo.jpg",
    banner: "caminho/para/banner.jpg",
    // ... outras configurações
};
```

### 2. Adicionar Produtos
```javascript
const PRODUTOS_CONFIG = {
    categoria1: [
        {
            id: 'produto-1',
            nome: 'Seu Produto',
            descricao: 'Descrição do produto',
            preco: 19.99,
            imagem: 'caminho/para/imagem.jpg',
            maisVendido: true,
            // ... outras opções
        }
    ]
};
```

### 3. Personalizar Cores
No `styles.css`, altere as variáveis CSS ou use as classes do Tailwind.

## 🎨 Design Inspirado

Este cardápio foi inspirado nos melhores apps do mercado:
- **iFood**: Layout limpo e direto
- **Anota.ai**: Simplicidade e foco nos produtos
- **Uber Eats**: Header moderno e elegante

## 📋 Vantagens do Design Simples

1. **Carregamento Rápido**: Menos elementos = mais velocidade
2. **Foco nos Produtos**: Cliente não se distrai
3. **Fácil Navegação**: Scroll natural e intuitivo
4. **Conversão Maior**: Menos barreiras para compra
5. **Mobile Otimizado**: Perfeito para smartphones

## 🔧 Instalação

1. Clone ou baixe os arquivos
2. Personalize o `config.js` com seus dados
3. Adicione suas imagens na pasta `/images/`
4. Abra o `index.html` no navegador
5. Teste em dispositivos móveis

## 📞 Suporte

Para dúvidas sobre personalização, consulte o arquivo `PERSONALIZACAO.md` ou entre em contato.

---

**💡 Dica**: Mantenha o design simples e direto. Os melhores cardápios digitais são aqueles que não distraem o cliente do objetivo principal: fazer o pedido!