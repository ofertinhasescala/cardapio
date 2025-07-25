import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/checkout';
import { trackAddToCart } from '@/services/facebookPixelService';
import { useUtmStore } from '@/hooks/useUtm';

interface CartState {
  cartItems: CartItem[];
  totalPrice: number;
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
}

// Cria a store com persistência no localStorage
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      totalPrice: 0,
      cartCount: 0,
      
      addToCart: (item: CartItem) => {
        const utmParams = useUtmStore.getState().utmParams;
        set(state => {
          const newCartItems = [...state.cartItems, item];
          // Usa finalPrice para calcular o total
          const newTotalPrice = newCartItems.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
          const newCartCount = newCartItems.reduce((count, item) => count + item.quantity, 0);

          // Disparar evento AddToCart do Facebook Pixel
          trackAddToCart({
            content_type: 'product',
            content_ids: [item.id],
            content_name: item.name,
            currency: 'BRL',
            value: item.finalPrice,
            quantity: item.quantity,
            ...item
          }, utmParams);

          return {
            cartItems: newCartItems,
            totalPrice: newTotalPrice,
            cartCount: newCartCount
          };
        });
      },
      
      removeFromCart: (itemId: string) => {
        set(state => {
          const newCartItems = state.cartItems.filter(item => item.id !== itemId);
          // Usa finalPrice para calcular o total
          const newTotalPrice = newCartItems.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
          const newCartCount = newCartItems.reduce((count, item) => count + item.quantity, 0);
          
          return {
            cartItems: newCartItems,
            totalPrice: newTotalPrice,
            cartCount: newCartCount
          };
        });
      },
      
      updateQuantity: (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        set(state => {
          const newCartItems = state.cartItems.map(item => {
            if (item.id === itemId) {
              // Calcula o preço total baseado no finalPrice
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: item.finalPrice * newQuantity,
              };
            }
            return item;
          });
          
          // Usa finalPrice para calcular o total
          const newTotalPrice = newCartItems.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
          const newCartCount = newCartItems.reduce((count, item) => count + item.quantity, 0);
          
          return {
            cartItems: newCartItems,
            totalPrice: newTotalPrice,
            cartCount: newCartCount
          };
        });
      },
      
      clearCart: () => {
        set({ cartItems: [], totalPrice: 0, cartCount: 0 });
      }
    }),
    {
      name: 'phamela-gourmet-cart', // nome para o armazenamento no localStorage
      partialize: (state) => ({ cartItems: state.cartItems }), // salva apenas os itens do carrinho
    }
  )
); 