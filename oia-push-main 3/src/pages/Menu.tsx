import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CatalogoPhamelaGourmet } from "@/components/CatalogoPhamelaGourmet";
import { ProductDetails } from "@/components/ProductDetails";
import { ReviewsSection } from "@/components/ReviewsSection";
import { MenuSkeleton } from "@/components/MenuSkeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { ModernLocationModal } from "@/components/ModernLocationModal";
import { AddressData } from "@/services/locationService";
import { 
  FRUTAS_DO_AMOR_DATA, 
  COMBOS_ESPECIAIS_DATA, 
  BOLOS_DOCES_DATA, 
  PROMOCOES_ESPECIAIS_DATA, 
  TORTAS_DATA,
  type ProdutoGourmet 
} from "@/types/products";

export default function Menu() {
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(true); // Inicia com modal aberto
  const [userAddress, setUserAddress] = useState<AddressData | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Combinar todos os produtos da Phamela Gourmet
  const allProducts = [
    ...FRUTAS_DO_AMOR_DATA,
    ...COMBOS_ESPECIAIS_DATA,
    ...BOLOS_DOCES_DATA,
    ...PROMOCOES_ESPECIAIS_DATA,
    ...TORTAS_DATA
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLocationConfirm = (address: AddressData) => {
    setUserAddress(address);
    setShowLocationModal(false);
    
    toast({
      title: "Localização confirmada! 📍",
      description: `Entregamos em ${address.neighborhood}. Agora você pode fazer seu pedido!`,
      duration: 3000,
    });
  };

  const handleViewDetails = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleAddToCart = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.nome,
        price: product.precoPromocional || product.precoOriginal,
        image: product.imagem,
        quantity: 1
      });
      
      toast({
        title: "Produto adicionado! 🛒",
        description: `${product.nome} foi adicionado ao seu carrinho.`,
        duration: 2000,
      });
    }
  };

  const selectedProductData = selectedProduct 
    ? allProducts.find(p => p.id === selectedProduct)
    : null;

  if (loading) {
    return <MenuSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLocationClick={() => setShowLocationModal(true)} />
      
      <ModernLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onConfirm={handleLocationConfirm}
      />

      <CatalogoPhamelaGourmet
        onViewDetails={handleViewDetails}
        onAddToCart={handleAddToCart}
      />

      <ReviewsSection />

      {selectedProductData && (
        <ProductDetails
          product={{
            id: selectedProductData.id,
            name: selectedProductData.nome,
            description: selectedProductData.descricao,
            price: selectedProductData.precoOriginal,
            discountedPrice: selectedProductData.precoPromocional,
            image: selectedProductData.imagem,
            categoryId: selectedProductData.categoria,
            featured: selectedProductData.destaque || selectedProductData.maisVendido,
            badge: selectedProductData.badge
          }}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}