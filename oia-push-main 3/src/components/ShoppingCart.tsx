import { useState, useEffect } from "react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { CartItem } from "@/types/checkout";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useUtmNavigate } from "@/hooks/useUtmNavigate";
import { useUtm } from "@/hooks/useUtm";

interface ShoppingCartProps {
  children: React.ReactNode;
}

export function ShoppingCart({ children }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const { toast } = useToast();
  const navigate = useUtmNavigate();
  const utm = useUtm();

  const handleNavigateToCart = () => {
    console.log('Navegando para carrinho com UTM params:', utm.getAllUtmParams());
    setIsOpen(false);
    navigate('/carrinho');
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    
    toast({
      title: "Item removido",
      description: "O item foi removido do seu pedido",
      duration: 2000,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Pedido
          </SheetTitle>
        </SheetHeader>

        {/* Lista de itens do carrinho */}
        <div className="flex-1 overflow-y-auto mb-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-center">Seu carrinho está vazio.</p>
              <p className="text-center text-sm mt-1">Adicione alguns produtos para continuar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Resumo do pedido e botão de finalização */}
        {cartItems.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto">
            {/* Resumo financeiro */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa de entrega</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span className="text-primary">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Botão para ver carrinho completo */}
            <SheetFooter>
              <Button
                onClick={handleNavigateToCart}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-full"
              >
                Ver carrinho
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Componente para exibir um item no carrinho
interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) {
  return (
    <div className="flex gap-3 border-b border-border pb-4">
      {/* Imagem do produto */}
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Detalhes do produto */}
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Opcionais selecionados */}
        {item.addons.length > 0 && (
          <div className="mt-1 space-y-1">
            {item.addons.map((addon, index) => (
              <div key={`${item.id}-addon-${index}`} className="text-xs text-muted-foreground flex justify-between">
                <span>{addon.name}</span>
                <span>+ R$ {addon.price.toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Controle de quantidade e preço */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm w-4 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="font-medium text-sm">
            R$ {item.totalPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
} 