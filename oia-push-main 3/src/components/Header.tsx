import { ShoppingCart, Info, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoModal } from "@/components/InfoModal";
import { ShoppingCart as Cart } from "@/components/ShoppingCart";
import { useCart } from "@/hooks/useCart";

interface HeaderProps {
  onLocationClick?: () => void;
}

export function Header({ onLocationClick }: HeaderProps = {}) {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo-pamella.jpg" 
            alt="Phamela Gourmet" 
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Phamela Gourmet
            </h1>
            <p className="text-xs text-gray-500">
              Frutas do Amor & Doces Especiais
            </p>
          </div>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-3">
          {/* Botão de Localização */}
          {onLocationClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLocationClick}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-medium">LOCAL</span>
            </Button>
          )}

          {/* Info Modal */}
          <InfoModal>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <Info className="h-4 w-4" />
              <span className="text-xs font-medium">INFO</span>
            </Button>
          </InfoModal>
        </div>
      </div>

      {/* Botão do carrinho flutuante */}
      <Cart>
        <Button 
          variant="default" 
          size="icon" 
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
        </Button>
      </Cart>
    </header>
  );
}