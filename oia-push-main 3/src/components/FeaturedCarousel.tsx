import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string;
  categoryId: string;
}

interface FeaturedCarouselProps {
  products: Product[];
  onViewDetails: (id: string) => void;
}

export function FeaturedCarousel({ products, onViewDetails }: FeaturedCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-4 bg-background">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
        <span>Os mais pedidos 😍</span>
      </h2>
      
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div 
            key={product.id}
            className="snap-start flex-shrink-0 w-[260px]"
            onClick={() => onViewDetails(product.id)}
          >
            <Card className="overflow-hidden border border-border hover:shadow-md transition-smooth cursor-pointer group">
              {/* Imagem em destaque */}
              <div className="w-full h-36 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
              </div>
              
              {/* Conteúdo */}
              <div className="p-3">
                <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-smooth">
                  {product.name}
                </h3>
                
                <div className="mb-2">
                  {product.discountedPrice && (
                    <div className="bg-yellow-400 text-black px-2 py-0.5 rounded-md text-xs font-bold mb-1 w-fit">
                      40% OFF
                    </div>
                  )}
                  <span className="text-xs font-semibold text-muted-foreground">A PARTIR DE</span>
                  <div className="text-xl flex items-center gap-2 flex-wrap">
                    {product.price && product.discountedPrice && (
                      <span className="text-red-500 line-through text-sm font-medium">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="font-bold text-green-500">
                      R$ {(product.discountedPrice || product.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-2">
                  {product.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Montar o seu
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 