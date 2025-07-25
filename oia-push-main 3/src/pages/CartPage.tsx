import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useUtmNavigate } from "@/hooks/useUtmNavigate";
import { CartItem } from "@/types/checkout";
import { OrderBumpCard } from "@/components/OrderBumpCard";
import { useUtm } from "@/hooks/useUtm";
import { useEffect } from "react";
import { To } from "react-router-dom";

// Produtos para order bump - Phamela Gourmet
const orderBumpProducts = [
  { 
    id: "kit-3-morangos", 
    name: "Kit 3 morangos do amor", 
    price: 19.99, 
    image: "/images/frutas-amor/kit-3-morangos.jpg",
    description: "Deliciosos morangos cobertos com chocolate nobre, perfeitos para momentos especiais." 
  },
  { 
    id: "combo-12-morangos-4-uvas", 
    name: "12 morangos do amor + 4 Uvas do amor", 
    price: 49.99, 
    image: "/images/combos/combo-mais-vendido.jpg",
    description: "Perfeito para galera com 20% de desconto. O combo mais queridinho da casa!" 
  },
  { 
    id: "pudim-de-leite", 
    name: "Pudim de Leite", 
    price: 19.99, 
    image: "/images/sobremesas/pudim-leite.jpg",
    description: "Pudim cremoso tradicional, feito com muito carinho e ingredientes selecionados." 
  },
  { 
    id: "mini-naked-brownie", 
    name: "Mini Naked Brownie", 
    price: 19.99, 
    image: "/images/sobremesas/mini-naked-brownie.jpg",
    description: "Recheio brigadeiro chocolate + nutella + morango + kinder bueno" 
  }
];

export default function CartPage() {
  const cartItems = useCart(state => state.cartItems);
  const totalPrice = useCart(state => state.totalPrice);
  const updateQuantity = useCart(state => state.updateQuantity);
  const removeFromCart = useCart(state => state.removeFromCart);
  const navigate = useUtmNavigate();
  const utm = useUtm();
  
  // Log dos parâmetros UTM ao montar o componente
  useEffect(() => {
    console.log('CartPage - UTM Params:', utm.getAllUtmParams());
  }, [utm]);

  const handleNavigateBack = () => {
    navigate(-1 as To);
  };

  const handleNavigateToCheckout = () => {
    console.log('Navegando para checkout com UTM params:', utm.getAllUtmParams());
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  // Filtra os produtos sugeridos para não mostrar os que já estão no carrinho
  const filteredOrderBumps = orderBumpProducts.filter(product => 
    !cartItems.some(item => item.id === product.id)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 bg-background border-b border-border p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNavigateBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Meu Pedido</h1>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 pb-40">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-center text-lg font-medium mb-2">Seu carrinho está vazio</p>
            <p className="text-center text-sm mb-6">Adicione alguns produtos para continuar</p>
            <Button 
              onClick={handleContinueShopping}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <CartItemDetailed
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Seção de Order Bumps */}
            {filteredOrderBumps.length > 0 && (
              <div className="mb-20 bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-amber-50/80 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 rounded-xl p-5 shadow-sm border border-amber-100/80 dark:border-amber-900/30">
                <h3 className="text-lg font-bold mb-2 flex items-center text-amber-800 dark:text-amber-400">
                  <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                  Que tal completar seu pedido?
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-5">
                  Sugestões especiais para tornar sua experiência ainda melhor
                </p>
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 -mx-1 px-1 snap-x scrollbar-hide">
                  {filteredOrderBumps.map((product, index) => (
                    <div key={product.id} className="snap-start">
                      <OrderBumpCard product={product} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer fixo com resumo e botão de ação */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pt-5 pb-6 px-4 shadow-lg before:absolute before:top-0 before:left-0 before:right-0 before:h-8 before:bg-gradient-to-t before:from-background/0 before:to-background/80 before:-translate-y-full before:pointer-events-none">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxa de entrega</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-primary">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleNavigateToCheckout}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-full"
          >
            Finalizar Compra
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente para exibir um item detalhado no carrinho
interface CartItemDetailedProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

function CartItemDetailed({ item, onUpdateQuantity, onRemove }: CartItemDetailedProps) {
  return (
    <div className="flex gap-4 border-b border-border pb-6">
      {/* Imagem do produto */}
      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Detalhes do produto */}
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Preço unitário */}
        <div className="text-sm text-muted-foreground mt-1">
          R$ {item.unitPrice.toFixed(2).replace(".", ",")} cada
        </div>

        {/* Opcionais selecionados */}
        {item.addons.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-medium">Opcionais:</p>
            {item.addons.map((addon, index) => (
              <div key={`${item.id}-addon-${index}`} className="text-sm text-foreground flex justify-between">
                <span>{addon.name}</span>
                <span className="text-muted-foreground">+ R$ {addon.price.toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Controle de quantidade e preço */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-base w-6 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="font-bold">
            R$ {item.totalPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
} 