import { ProductCard } from "./ProductCard";
import { BOLOS_DOCES_DATA } from "@/types/products";

interface BolosDocesSectionProps {
  onViewDetails: (productId: string) => void;
}

export function BolosDocesSection({ onViewDetails }: BolosDocesSectionProps) {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
            <span className="text-2xl">🍰</span>
            <span className="text-small font-semibold text-primary">BOLOS E DOCES</span>
          </div>
          <h2 className="text-h1 mb-4">
            Bolos e Doces Especiais
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Deliciosos bolos vulcão e sobremesas artesanais feitos com ingredientes selecionados 
            e muito carinho para adoçar seus momentos especiais.
          </p>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOLOS_DOCES_DATA.map((produto) => (
            <ProductCard
              key={produto.id}
              id={produto.id}
              name={produto.nome}
              description={produto.descricao}
              price={produto.precoOriginal}
              discountedPrice={produto.precoPromocional}
              image={produto.imagem}
              badge={produto.badge}
              badgeColor={produto.maisVendido ? 'mais-vendido' : 'novo'}
              categoria="bolos-doces"
              peso={produto.peso}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Informações adicionais */}
        <div className="mt-12 bg-accent/20 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🌋</div>
              <h4 className="text-h3 mb-2">Bolos Vulcão</h4>
              <p className="text-small text-muted-foreground">
                Bolos especiais com recheio cremoso que derrete na boca
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🍮</div>
              <h4 className="text-h3 mb-2">Sobremesas</h4>
              <p className="text-small text-muted-foreground">
                Pudins, brownies e doces artesanais irresistíveis
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔥</div>
              <h4 className="text-h3 mb-2">Aquecimento</h4>
              <p className="text-small text-muted-foreground">
                Dica: Aqueça no microondas por 1min30s para melhor experiência
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}