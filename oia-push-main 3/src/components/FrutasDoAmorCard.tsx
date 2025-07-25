import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trackViewContent } from '@/services/facebookPixelService';
import { useUtm } from '@/hooks/useUtm';

export interface FrutasDoAmorCardProps {
  id: string;
  nome: string;
  tipo: 'morango' | 'uva' | 'maracuja' | 'abacaxi' | 'morango-pistache' | 'brownie';
  quantidade: number;
  tamanho: string;
  precoOriginal: number;
  precoPromocional: number;
  imagem: string;
  maisVendido?: boolean;
  destaque?: boolean;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

export function FrutasDoAmorCard({ 
  id, 
  nome, 
  tipo,
  quantidade,
  tamanho,
  precoOriginal, 
  precoPromocional, 
  imagem, 
  maisVendido = false,
  destaque = false,
  onAddToCart,
  onViewDetails 
}: FrutasDoAmorCardProps) {
  // Calcular desconto percentual
  const desconto = Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100);

  // Obter emoji baseado no tipo
  const getEmoji = () => {
    switch (tipo) {
      case 'morango': return '🍓';
      case 'uva': return '🍇';
      case 'maracuja': return '🥭';
      case 'abacaxi': return '🍍';
      case 'morango-pistache': return '🍓🌰';
      case 'brownie': return '🍫';
      default: return '❤️';
    }
  };

  const utm = useUtm();

  // Handler para visualizar detalhes
  const handleViewDetails = () => {
    trackViewContent({
      content_type: 'product',
      content_ids: [id],
      content_name: nome,
      currency: 'BRL',
      value: precoPromocional,
      utm: utm.getAllUtmParams(),
    }, utm.getAllUtmParams());
    onViewDetails(id);
  };

  // Handler para adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(id);
  };

  return (
    <Card 
      variant="frutas-amor"
      className={`cursor-pointer group relative overflow-hidden ${destaque ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onClick={handleViewDetails}
    >
      {/* Badge de desconto */}
      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        -{desconto}%
      </div>

      {/* Badge "Mais Vendido" */}
      {maisVendido && (
        <div className="absolute top-3 right-3 z-10 badge-mais-vendido shadow-lg">
          🔥 MAIS VENDIDO
        </div>
      )}

      {/* Imagem */}
      <div className="relative w-full h-56 overflow-hidden bg-gradient-delicate">
        <img 
          src={imagem} 
          alt={nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay com emoji */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <span className="text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce">
            {getEmoji()}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        {/* Nome do produto */}
        <h3 className="text-h3 mb-2 group-hover:text-primary transition-colors duration-300">
          {nome}
        </h3>

        {/* Detalhes */}
        <div className="flex items-center gap-2 mb-3 text-small text-muted-foreground">
          <span>{quantidade} unidades</span>
          <span>•</span>
          <span>Tamanho {tamanho}</span>
        </div>

        {/* Preços */}
        <div className="flex items-center gap-3 mb-4">
          <span className="price-original">
            R$ {precoOriginal.toFixed(2).replace('.', ',')}
          </span>
          <span className="price-promocional text-xl">
            R$ {precoPromocional.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Botão de adicionar ao carrinho */}
        <Button 
          variant="frutas-amor" 
          size="full"
          onClick={handleAddToCart}
          className="group-hover:scale-105 transition-transform duration-200"
        >
          {getEmoji()} Adicionar ao Carrinho
        </Button>
      </div>

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </Card>
  );
}