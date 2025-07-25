import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users, TrendingUp, AlertTriangle, Heart } from "lucide-react";

export interface ComboSpecialCardProps {
  combo: {
    id: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    image: string;
    badge?: string;
    urgency?: string;
    socialProof?: string;
    scarcity?: string;
    maisVendido?: boolean;
    destaque?: boolean;
    motivoEscolha?: string;
    produtos?: string[];
  };
  onViewDetails: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export function ComboSpecialCard({ combo, onViewDetails, onAddToCart }: ComboSpecialCardProps) {
  // Calcular desconto percentual
  const discountPercentage = combo.discountedPrice
    ? Math.round(((combo.price - combo.discountedPrice) / combo.price) * 100)
    : 0;

  // Handler para adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(combo.id);
    }
  };

  return (
    <Card 
      variant={combo.destaque ? "highlight" : "elegant"}
      className={`overflow-hidden cursor-pointer group relative ${combo.maisVendido ? 'animate-pulse-glow' : ''} ${combo.destaque ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onClick={() => onViewDetails(combo.id)}
    >
      <div className="relative">
        {/* Imagem do produto */}
        <div 
          className="h-56 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: `url(${combo.image})` }}
        />
        
        {/* Overlay delicado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badge de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full font-bold text-sm shadow-lg">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Badge "Mais Vendido" */}
        {combo.maisVendido && (
          <div className="absolute top-4 left-4 badge-mais-vendido shadow-lg">
            🔥 MAIS VENDIDO
          </div>
        )}
        
        {/* Badge personalizado */}
        {combo.badge && !combo.maisVendido && (
          <div className="absolute top-4 left-4 badge-combo-especial shadow-lg">
            {combo.badge}
          </div>
        )}
        
        {/* Preços flutuantes */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            {combo.discountedPrice && (
              <span className="price-original text-sm">
                R$ {combo.price.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="price-promocional text-lg">
              R$ {(combo.discountedPrice || combo.price).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Nome do combo */}
        <h3 className="text-h2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {combo.name}
        </h3>
        
        {/* Descrição */}
        <p className="text-body text-muted-foreground mb-4 line-clamp-2">
          {combo.description}
        </p>
        
        {/* Motivo de escolha */}
        {combo.motivoEscolha && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-accent/30 rounded-lg">
            <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-small text-primary font-medium">
              {combo.motivoEscolha}
            </span>
          </div>
        )}
        
        {/* Indicadores */}
        <div className="space-y-2 mb-4">
          {combo.urgency && (
            <div className="flex items-center gap-2 text-small text-red-600 font-medium">
              <Clock className="h-4 w-4" />
              <span>{combo.urgency}</span>
            </div>
          )}
          
          {combo.socialProof && (
            <div className="flex items-center gap-2 text-small text-primary font-medium">
              <Star className="h-4 w-4" />
              <span>{combo.socialProof}</span>
            </div>
          )}
          
          {combo.scarcity && (
            <div className="flex items-center gap-2 text-small text-amber-600 font-medium">
              <AlertTriangle className="h-4 w-4" />
              <span>{combo.scarcity}</span>
            </div>
          )}
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="default"
            onClick={() => onViewDetails(combo.id)}
            className="flex-1"
          >
            Ver Detalhes
          </Button>
          {onAddToCart && (
            <Button 
              variant="frutas-amor"
              size="default"
              onClick={handleAddToCart}
              className="flex-1"
            >
              ❤️ Adicionar
            </Button>
          )}
        </div>
      </div>

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </Card>
  );
} 