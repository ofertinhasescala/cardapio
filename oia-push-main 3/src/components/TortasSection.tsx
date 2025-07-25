import { ProductCard } from "./ProductCard";
import { TORTAS_DATA, SUPER_FATIAS_DATA } from "@/types/products";

interface TortasSectionProps {
  onViewDetails: (productId: string) => void;
}

export function TortasSection({ onViewDetails }: TortasSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 px-6 py-2 rounded-full mb-4">
            <span className="text-2xl">🎂</span>
            <span className="text-small font-semibold text-pink-600">TORTAS GOURMET</span>
          </div>
          <h2 className="text-h1 mb-4 text-pink-700">
            Tortas e Fatias Especiais
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Tortas artesanais e fatias generosas feitas com ingredientes premium. 
            Perfeitas para celebrações especiais ou para saborear a qualquer momento.
          </p>
        </div>

        {/* Tortas Completas */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-h2">Tortas Completas</h3>
            <div className="flex-1 h-px bg-pink-200"></div>
            <span className="text-small text-muted-foreground">Para compartilhar</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TORTAS_DATA.map((torta) => (
              <ProductCard
                key={torta.id}
                id={torta.id}
                name={torta.nome}
                description={torta.descricao}
                price={torta.precoOriginal}
                discountedPrice={torta.precoPromocional}
                image={torta.imagem}
                badge={torta.badge}
                badgeColor={torta.maisVendido ? 'mais-vendido' : 'novo'}
                categoria="tortas"
                peso={torta.peso}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Super Fatias */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-h2">Super Fatias</h3>
            <div className="flex-1 h-px bg-pink-200"></div>
            <span className="text-small text-muted-foreground">Porções individuais</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUPER_FATIAS_DATA.map((fatia) => (
              <ProductCard
                key={fatia.id}
                id={fatia.id}
                name={fatia.nome}
                description={fatia.descricao}
                price={fatia.precoOriginal}
                discountedPrice={fatia.precoPromocional}
                image={fatia.imagem}
                badge={fatia.badge}
                badgeColor={fatia.maisVendido ? 'mais-vendido' : 'novo'}
                categoria="tortas"
                peso={fatia.peso}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-12 bg-pink-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🎂</div>
              <h4 className="text-h3 mb-2">Tortas Artesanais</h4>
              <p className="text-small text-muted-foreground">
                Feitas com ingredientes premium e muito carinho
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🍰</div>
              <h4 className="text-h3 mb-2">Fatias Generosas</h4>
              <p className="text-small text-muted-foreground">
                Porções individuais perfeitas para qualquer ocasião
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎉</div>
              <h4 className="text-h3 mb-2">Celebrações</h4>
              <p className="text-small text-muted-foreground">
                Ideais para aniversários, comemorações e momentos especiais
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}