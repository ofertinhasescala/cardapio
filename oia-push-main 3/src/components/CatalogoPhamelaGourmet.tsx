import { useState } from "react";
import { CategoriasNav } from "./CategoriasNav";
import { FrutasDoAmorSection } from "./FrutasDoAmorSection";
import { BolosDocesSection } from "./BolosDocesSection";
import { PromocoesEspeciaisSection } from "./PromocoesEspeciaisSection";
import { TortasSection } from "./TortasSection";
import { SalgadosSection } from "./SalgadosSection";
import { type CategoriasProduto } from "@/types/products";

interface CatalogoPhamelaGourmetProps {
  onViewDetails: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export function CatalogoPhamelaGourmet({ onViewDetails, onAddToCart }: CatalogoPhamelaGourmetProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriasProduto | 'todas'>('todas');

  const renderSecaoAtiva = () => {
    switch (categoriaAtiva) {
      case 'frutas-do-amor':
        return (
          <FrutasDoAmorSection 
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
          />
        );
      
      case 'bolos-vulcao':
      case 'bolos-caseiros':
      case 'sobremesas':
        return (
          <BolosDocesSection 
            onViewDetails={onViewDetails}
          />
        );
      
      case 'tortas':
        return (
          <TortasSection 
            onViewDetails={onViewDetails}
          />
        );
      
      case 'salgados':
        return (
          <SalgadosSection 
            onViewDetails={onViewDetails}
          />
        );
      
      case 'promocoes':
        return (
          <PromocoesEspeciaisSection 
            onViewDetails={onViewDetails}
          />
        );
      
      case 'combos':
        return (
          <FrutasDoAmorSection 
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
          />
        );
      
      default: // 'todas'
        return (
          <>
            <FrutasDoAmorSection 
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
            <BolosDocesSection 
              onViewDetails={onViewDetails}
            />
            <PromocoesEspeciaisSection 
              onViewDetails={onViewDetails}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">


      {/* Navegação por categorias */}
      <CategoriasNav 
        categoriaAtiva={categoriaAtiva}
        onCategoriaChange={setCategoriaAtiva}
      />

      {/* Conteúdo das seções */}
      <main>
        {renderSecaoAtiva()}
      </main>

      {/* Footer promocional */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            💝 Presentes que Demonstram Carinho
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nossas Frutas do Amor são perfeitas para presentear pessoas especiais. 
            Cada produto é embalado com cuidado e carinho para criar momentos inesquecíveis.
          </p>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎀</span>
              <span>Embalagem especial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span>Pedido pelo WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span>Entrega no mesmo dia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💳</span>
              <span>PIX com desconto</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}