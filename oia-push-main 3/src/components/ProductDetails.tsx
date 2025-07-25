import { X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/types/checkout";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { debounce } from "lodash";
// Removendo a importação não utilizada
// import { OptimizedImage } from "./OptimizedImage";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    image: string;
    categoryId?: string;
    adicionais?: { name: string; price: number; }[];
    opcionais?: { name: string; price: number; }[];
  } | any; // Adicionando any para evitar erros de tipagem
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export function ProductDetails({ product, onClose, onAddToCart }: ProductDetailsProps) {
  // Ativar scroll lock quando o modal estiver aberto
  useScrollLock(!!product);
  
  const [observacao, setObservacao] = useState("");
  
  // Calcula o preço base do produto (com ou sem desconto)
  const finalPrice = product.discountedPrice || product.price;
  
  // Função para adicionar ao carrinho com micro-animação
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      unitPrice: finalPrice,
      totalPrice: finalPrice * 1, // Multiplicado pela quantidade (que é sempre 1 neste caso)
      finalPrice: finalPrice,
      quantity: 1,
      addons: [], // Mantendo para compatibilidade
      image: product.image,
      observacao: observacao.trim() || undefined
    };
    
    onAddToCart(cartItem);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div 
            className="w-full bg-gradient-delicate rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-lg border-t-2 border-accent"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            onClick={(e) => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={(event, info: PanInfo) => {
              // Fechar se arrastar mais de 150px para baixo
              if (info.offset.y > 150) {
                onClose();
              }
            }}
          >
            {/* Indicador visual de drag */}
            <motion.div 
              className="w-12 h-1 bg-primary/40 rounded-full mx-auto mt-2 mb-2"
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2 }}
            />

            {/* Header com imagem do produto */}
            <motion.div 
              className="relative h-48 bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${product.image})` }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-t-2xl" />
              
              {/* Botão fechar com animação */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-accent/30"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <X className="h-5 w-5 text-primary" />
              </motion.button>
              
              {/* Badge do produto com animação */}
              <motion.div 
                className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <span className="font-bold text-sm text-primary-foreground">{product.name}</span>
              </motion.div>
            </motion.div>

            {/* Conteúdo com animação escalonada */}
            <motion.div 
              className="p-4 max-h-[60vh] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Preço */}
              <motion.div 
                className="mb-6"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <span className="text-xs text-muted-foreground">PREÇO</span>
                <motion.div 
                  className="flex items-center gap-2 flex-wrap"
                  key={finalPrice} // Re-animar quando preço mudar
                  initial={{ scale: 1.1, color: "#C8A364" }}
                  animate={{ scale: 1, color: "#C8A364" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-2xl font-bold text-frutas-amor-dourado">
                    R$ {finalPrice.toFixed(2).replace('.', ',')}
                  </div>
                  {product.price && product.discountedPrice && (
                    <div className="text-lg text-frutas-amor-vermelho-suave line-through font-medium">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-sm text-muted-foreground mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.description}
              </motion.p>

              {/* Observações - Simplificado para todos os produtos */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-4 bg-accent px-4 py-2 rounded-full text-sm font-bold inline-block text-accent-foreground">
                  Observações
                </div>
                <textarea
                  className="w-full p-3 border border-accent/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Alguma observação sobre este produto?"
                  rows={3}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </motion.div>

              {/* Add to cart button */}
              <div className="sticky bottom-0 bg-background pt-4 pb-2">
                <motion.button
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-3 rounded-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Adicionar ao Pedido
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}