import { ProductCard } from "./ProductCard";
import { PROMOCOES_ESPECIAIS_DATA } from "@/types/products";

interface PromocoesEspeciaisSectionProps {
  onViewDetails: (productId: string) => void;
}

export function PromocoesEspeciaisSection({ onViewDetails }: PromocoesEspeciaisSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 px-6 py-2 rounded-full mb-4">
            <span className="text-2xl">🎁</span>
            <span className="text-small font-semibold text-red-600">PROMOÇÕES ESPECIAIS</span>
          </div>
          <h2 className="text-h1 mb-4 text-red-700">
            Ofertas Imperdíveis
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Aproveite nossas promoções exclusivas! Bombons especiais, ofertas limitadas 
            e produtos únicos com preços que você não pode perder.
          </p>
        </div>

        {/* Grid de promoções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROMOCOES_ESPECIAIS_DATA.map((promocao) => (
            <div key={promocao.id} className="relative">
              {/* Badge de promoção especial */}
              <div className="absolute -top-3 -right-3 z-10 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                {promocao.condicoes || 'OFERTA ESPECIAL'}
              </div>
              
              <ProductCard
                id={promocao.id}
                name={promocao.nome}
                description={promocao.descricao}
                price={promocao.precoOriginal}
                discountedPrice={promocao.precoPromocional}
                image={promocao.imagem}
                badge={promocao.badge}
                badgeColor="promocao"
                categoria="promocoes"
                peso={promocao.peso}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto shadow-xl border border-red-200">
            <h4 className="text-h2 mb-4 text-red-700">
              🔥 Ofertas por Tempo Limitado
            </h4>
            <p className="text-body text-muted-foreground mb-6">
              Essas promoções especiais são válidas apenas enquanto durarem os estoques. 
              Não perca a oportunidade de experimentar nossos produtos premium com preços únicos!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl mb-2">🍓</div>
                <h5 className="font-semibold text-red-700 mb-1">Bombons Premium</h5>
                <p className="text-small text-red-600">Chocolate nobre + brigadeiro branco</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl mb-2">💝</div>
                <h5 className="font-semibold text-red-700 mb-1">Presentes Especiais</h5>
                <p className="text-small text-red-600">Perfeitos para demonstrar carinho</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h5 className="font-semibold text-red-700 mb-1">Entrega Rápida</h5>
                <p className="text-small text-red-600">Receba em casa rapidamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}