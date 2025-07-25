import { Card } from "@/components/ui/card";
import { trackViewContent } from '@/services/facebookPixelService';
import { useUtm } from '@/hooks/useUtm';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: 'mais-vendido' | 'combo-especial' | 'novo' | 'promocao';
  categoria?: 'frutas-do-amor' | 'bolos-doces' | 'promocoes' | 'outros';
  peso?: string;
  onViewDetails: (productId: string) => void;
}

export function ProductCard({ 
  id, 
  name, 
  description, 
  price, 
  discountedPrice, 
  image, 
  badge,
  badgeColor = "novo",
  categoria = "outros",
  peso,
  onViewDetails 
}: ProductCardProps) {
  // Calcular desconto percentual
  const discountPercentage = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  // Determinar a cor do badge baseado na nova identidade Phamela Gourmet
  const getBadgeClasses = () => {
    switch (badgeColor) {
      case 'mais-vendido': return 'badge-mais-vendido';
      case 'combo-especial': return 'badge-combo-especial';
      case 'novo': return 'badge-novo';
      case 'promocao': return 'bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold';
      default: return 'badge-novo';
    }
  };

  // Determinar variante do card baseado na categoria
  const getCardVariant = () => {
    switch (categoria) {
      case 'frutas-do-amor': return 'frutas-amor';
      case 'bolos-doces': return 'elegant';
      case 'promocoes': return 'highlight';
      default: return 'default';
    }
  };

  const utm = useUtm();

  // Handler para visualizar detalhes do produto e disparar evento ViewContent
  const handleViewDetails = (productId: string) => {
    trackViewContent({
      content_type: 'product',
      content_ids: [id],
      content_name: name,
      currency: 'BRL',
      value: discountedPrice || price,
      utm: utm.getAllUtmParams(),
    }, utm.getAllUtmParams());
    onViewDetails(productId);
  };

  return (
    <Card 
      variant={getCardVariant()}
      className="overflow-hidden cursor-pointer group animate-float-delicate"
      onClick={() => handleViewDetails(id)}
    >
      <div className="relative">
        {/* Badge de desconto (se houver) */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Imagem do produto */}
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Conteúdo */}
        <div className="p-4">
          {/* Badge principal (se existir) */}
          {badge && (
            <div className={`${getBadgeClasses()} mb-2 inline-block`}>
              {badge}
            </div>
          )}
          
          {/* Nome do produto */}
          <h3 className="text-h3 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {/* Peso (se existir) */}
          {peso && (
            <p className="text-small text-muted-foreground mb-1">
              {peso}
            </p>
          )}
          
          {/* Descrição */}
          {description && (
            <p className="text-small text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Preços */}
          <div className="flex items-center gap-2 flex-wrap">
            {discountedPrice ? (
              <>
                <span className="price-original">
                  R$ {price.toFixed(2).replace('.', ',')}
                </span>
                <span className="price-promocional">
                  R$ {discountedPrice.toFixed(2).replace('.', ',')}
                </span>
              </>
            ) : (
              <span className="price-promocional">
                R$ {price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}