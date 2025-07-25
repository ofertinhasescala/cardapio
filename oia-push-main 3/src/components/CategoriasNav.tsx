import { useState } from "react";
import { Button } from "./ui/button";
import { type CategoriasProduto, getColorByCategory } from "@/types/products";

interface CategoriasNavProps {
  categoriaAtiva: CategoriasProduto | 'todas';
  onCategoriaChange: (categoria: CategoriasProduto | 'todas') => void;
}

const CATEGORIAS_CONFIG = [
  { 
    id: 'todas' as const, 
    nome: 'Todas', 
    icone: '🏠', 
    cor: '#FECEE5',
    descricao: 'Ver todos os produtos'
  },
  { 
    id: 'frutas-do-amor' as const, 
    nome: 'Frutas do Amor', 
    icone: '🍓🍇🥭🍍🍫', 
    cor: '#FECEE5',
    descricao: 'Nosso destaque principal - 6 sabores especiais'
  },
  { 
    id: 'combos' as const, 
    nome: 'Combos', 
    icone: '🎁', 
    cor: '#C8A364',
    descricao: 'Mais economia, mais sabor'
  },
  { 
    id: 'bolos-vulcao' as const, 
    nome: 'Bolos Vulcão', 
    icone: '🌋', 
    cor: '#C8A364',
    descricao: 'Recheio cremoso irresistível'
  },
  { 
    id: 'bolos-caseiros' as const, 
    nome: 'Bolos Caseiros', 
    icone: '🍰', 
    cor: '#8B4513',
    descricao: 'Tradição e sabor'
  },
  { 
    id: 'tortas' as const, 
    nome: 'Tortas Gourmet', 
    icone: '🎂', 
    cor: '#E91E63',
    descricao: 'Sofisticação em cada fatia'
  },
  { 
    id: 'sobremesas' as const, 
    nome: 'Sobremesas', 
    icone: '🍮', 
    cor: '#4CAF50',
    descricao: 'Doces especiais e bombons'
  },
  { 
    id: 'salgados' as const, 
    nome: 'Salgados', 
    icone: '🥟', 
    cor: '#FF9800',
    descricao: 'Para acompanhar os doces'
  },
  { 
    id: 'promocoes' as const, 
    nome: 'Promoções', 
    icone: '🔥', 
    cor: '#FF6B6B',
    descricao: 'Ofertas limitadas e especiais'
  }
];

export function CategoriasNav({ categoriaAtiva, onCategoriaChange }: CategoriasNavProps) {
  const [hoveredCategoria, setHoveredCategoria] = useState<string | null>(null);

  return (
    <div className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIAS_CONFIG.map((categoria) => {
            const isActive = categoriaAtiva === categoria.id;
            const isHovered = hoveredCategoria === categoria.id;
            
            return (
              <Button
                key={categoria.id}
                variant={isActive ? "frutas-amor" : "ghost"}
                size="default"
                className={`
                  flex-shrink-0 transition-all duration-300 group relative
                  ${isActive ? 'shadow-lg scale-105' : 'hover:scale-102'}
                  ${isHovered ? 'shadow-md' : ''}
                `}
                style={{
                  backgroundColor: isActive ? categoria.cor : undefined,
                  borderColor: isActive ? categoria.cor : undefined,
                }}
                onClick={() => onCategoriaChange(categoria.id)}
                onMouseEnter={() => setHoveredCategoria(categoria.id)}
                onMouseLeave={() => setHoveredCategoria(null)}
              >
                <span className="text-lg mr-2">{categoria.icone}</span>
                <span className="font-semibold">{categoria.nome}</span>
                
                {/* Tooltip */}
                {isHovered && !isActive && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-50">
                    {categoria.descricao}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black/80"></div>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Indicador da categoria ativa */}
        <div className="mt-3 text-center">
          <p className="text-small text-muted-foreground">
            {categoriaAtiva === 'todas' 
              ? 'Explore todos os nossos produtos deliciosos' 
              : `Categoria: ${CATEGORIAS_CONFIG.find(c => c.id === categoriaAtiva)?.nome}`
            }
          </p>
        </div>
      </div>
    </div>
  );
}