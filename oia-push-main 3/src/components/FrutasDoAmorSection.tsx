import { FrutasDoAmorCard } from "./FrutasDoAmorCard";
import { ComboSpecialCard } from "./ComboSpecialCard";
import { FRUTAS_DO_AMOR_DATA, COMBOS_ESPECIAIS_DATA, type FrutaDoAmor, type ComboEspecial } from "@/types/products";

interface FrutasDoAmorSectionProps {
  onViewDetails: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export function FrutasDoAmorSection({ onViewDetails, onAddToCart }: FrutasDoAmorSectionProps) {
  // Filtrar produtos em destaque
  const produtosDestaque = FRUTAS_DO_AMOR_DATA.filter(produto => produto.maisVendido || produto.destaque);
  const combosDestaque = COMBOS_ESPECIAIS_DATA.filter(combo => combo.maisVendido || combo.destaque);

  return (
    <section className="py-12 bg-gradient-delicate">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 px-6 py-2 rounded-full mb-4">
            <span className="text-2xl">🍓🍇🥭🍍🍫</span>
            <span className="text-small font-semibold text-primary">NOSSO DESTAQUE</span>
          </div>
          <h2 className="text-h1 mb-4">
            Frutas do Amor
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa coleção especial de frutas gourmet cobertas com chocolate premium. 
            Cada fruta é cuidadosamente selecionada e preparada com muito amor para momentos únicos.
          </p>
        </div>

        {/* Kits Individuais */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-h2">Kits Individuais</h3>
            <div className="flex-1 h-px bg-accent"></div>
            <span className="text-small text-muted-foreground">Escolha seu sabor favorito</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FRUTAS_DO_AMOR_DATA.map((fruta) => (
              <FrutasDoAmorCard
                key={fruta.id}
                id={fruta.id}
                nome={fruta.nome}
                tipo={fruta.tipo}
                quantidade={fruta.quantidade}
                tamanho={fruta.tamanho}
                precoOriginal={fruta.precoOriginal}
                precoPromocional={fruta.precoPromocional || fruta.precoOriginal}
                imagem={fruta.imagem}
                maisVendido={fruta.maisVendido}
                destaque={fruta.destaque}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Combos Especiais */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-h2">Combos Especiais</h3>
            <div className="flex-1 h-px bg-accent"></div>
            <span className="text-small text-muted-foreground">Mais economia, mais sabor</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMBOS_ESPECIAIS_DATA.map((combo) => (
              <ComboSpecialCard
                key={combo.id}
                combo={{
                  id: combo.id,
                  name: combo.nome,
                  description: combo.descricao,
                  price: combo.precoOriginal,
                  discountedPrice: combo.precoPromocional,
                  image: combo.imagem,
                  badge: combo.badge,
                  maisVendido: combo.maisVendido,
                  destaque: combo.destaque,
                  motivoEscolha: combo.motivoEscolha,
                  produtos: combo.produtos,
                  scarcity: combo.estoqueRestante ? `Apenas ${combo.estoqueRestante} combo(s) com esse preço especial` : undefined
                }}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <h4 className="text-h3 mb-4">
              ✨ Experimente Todos os Sabores
            </h4>
            <p className="text-body text-muted-foreground mb-6">
              Não consegue escolher? Nosso <strong>Combo Completo</strong> tem todos os 6 sabores 
              das Frutas do Amor com 45% de desconto!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="inline-flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-small">
                🍓 Morango
              </span>
              <span className="inline-flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-small">
                🍇 Uva
              </span>
              <span className="inline-flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-small">
                🥭 Maracujá
              </span>
              <span className="inline-flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-small">
                🍍 Abacaxi
              </span>
              <span className="inline-flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-small">
                🍓🌰 Pistache
              </span>
              <span className="inline-flex items-center gap-1 bg-accent px-3 py-1 rounded-full text-small">
                🍫 Brownie
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}