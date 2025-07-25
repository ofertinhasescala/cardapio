import { ProductCard } from "./ProductCard";
import { SALGADOS_DATA, KITS_FESTA_DATA } from "@/types/products";

interface SalgadosSectionProps {
  onViewDetails: (productId: string) => void;
}

export function SalgadosSection({ onViewDetails }: SalgadosSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-2 rounded-full mb-4">
            <span className="text-2xl">🥟</span>
            <span className="text-small font-semibold text-orange-600">SALGADOS</span>
          </div>
          <h2 className="text-h1 mb-4 text-orange-700">
            Salgados e Kits Festa
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Salgados artesanais e kits especiais para suas festas e eventos. 
            Perfeitos para acompanhar nossos doces ou para momentos de confraternização.
          </p>
        </div>

        {/* Salgados Individuais */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-h2">Salgados Especiais</h3>
            <div className="flex-1 h-px bg-orange-200"></div>
            <span className="text-small text-muted-foreground">Feitos com carinho</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SALGADOS_DATA.map((salgado) => (
              <ProductCard
                key={salgado.id}
                id={salgado.id}
                name={salgado.nome}
                description={salgado.descricao}
                price={salgado.precoOriginal}
                discountedPrice={salgado.precoPromocional}
                image={salgado.imagem}
                badge={salgado.badge}
                badgeColor={salgado.maisVendido ? 'mais-vendido' : 'novo'}
                categoria="salgados"
                peso={salgado.peso}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Kits Festa */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-h2">Kits Festa</h3>
            <div className="flex-1 h-px bg-orange-200"></div>
            <span className="text-small text-muted-foreground">Para suas celebrações</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {KITS_FESTA_DATA.map((kit) => (
              <div key={kit.id} className="relative">
                {/* Badge de festa */}
                <div className="absolute -top-3 -right-3 z-10 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🎉 FESTA
                </div>
                
                <ProductCard
                  id={kit.id}
                  name={kit.nome}
                  description={kit.descricao}
                  price={kit.precoOriginal}
                  discountedPrice={kit.precoPromocional}
                  image={kit.imagem}
                  badge={kit.badge}
                  badgeColor="combo-especial"
                  categoria="salgados"
                  onViewDetails={onViewDetails}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto shadow-xl border border-orange-200">
            <h4 className="text-h2 mb-4 text-orange-700">
              🎉 Perfeito para Suas Festas
            </h4>
            <p className="text-body text-muted-foreground mb-6">
              Nossos salgados e kits festa são ideais para aniversários, confraternizações e eventos especiais. 
              Combine com nossos doces para uma festa completa e inesquecível!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl mb-2">🥟</div>
                <h5 className="font-semibold text-orange-700 mb-1">Salgados Artesanais</h5>
                <p className="text-small text-orange-600">Coxinhas, empadões, pãezinhos especiais</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl mb-2">🎁</div>
                <h5 className="font-semibold text-orange-700 mb-1">Kits Completos</h5>
                <p className="text-small text-orange-600">Tudo que você precisa para sua festa</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl mb-2">🚚</div>
                <h5 className="font-semibold text-orange-700 mb-1">Entrega Especial</h5>
                <p className="text-small text-orange-600">Cuidado extra para eventos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}