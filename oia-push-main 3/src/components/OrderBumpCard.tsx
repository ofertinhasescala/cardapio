import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface OrderBumpCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
  index?: number;
}

export function OrderBumpCard({ product, index = 0 }: OrderBumpCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const addToCart = useCart(state => state.addToCart);
  
  useEffect(() => {
    // Animação de entrada com delay baseado no índice
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 * (index + 1));
    
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAdded) {
      timer = setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isAdded]);

  const handleAddToCart = () => {
    // Criar um objeto CartItem simplificado para o produto sugerido
    const item = {
      id: `${product.id}-${new Date().getTime()}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      quantity: 1,
      unitPrice: product.price,
      addons: [],
      totalPrice: product.price,
      finalPrice: product.price // Adicionando o campo finalPrice
    };
    
    addToCart(item);
    setIsAdded(true);
  };

  return (
    <div 
      className={`flex-shrink-0 w-[140px] border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-900 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Imagem do produto com overlay de gradiente */}
      <div className="relative h-[100px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105" 
          style={{ backgroundImage: `url(${product.image})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50" />
      </div>
      
      {/* Detalhes do produto */}
      <div className="p-3 flex flex-col justify-between h-[90px]">
        <div>
          <h4 className="text-sm font-medium line-clamp-1 mb-1">{product.name}</h4>
          <p className="text-sm text-primary font-bold">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        
        {/* Botão de adicionar */}
        <Button
          size="sm"
          variant={isAdded ? "secondary" : "default"}
          className={`w-full mt-auto h-8 transition-all duration-300 ${
            isAdded 
              ? 'bg-green-100 text-green-700 hover:bg-green-100 border border-green-300' 
              : 'bg-primary hover:bg-primary/90 text-white hover:scale-105'
          }`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <span className="flex items-center justify-center text-xs w-full">
              <Check className="h-3 w-3 mr-1 animate-bounce" /> Adicionado!
            </span>
          ) : (
            <span className="flex items-center justify-center text-xs w-full">
              <Plus className="h-3 w-3 mr-1" /> Adicionar
            </span>
          )}
        </Button>
      </div>
    </div>
  );
} 