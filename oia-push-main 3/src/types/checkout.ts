// Tipos para o carrinho
export interface CartAddon {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  totalPrice: number;
  finalPrice: number;
  quantity: number;
  addons?: { name: string; price: number }[];
  image: string;
  observacao?: string;
  selectedAdicionais?: { name: string; price: number }[];
  selectedOpcionais?: { name: string; price: number }[];
}

// Tipos para o formulário de checkout
export interface CheckoutFormData {
  // Etapa 1
  nome: string;
  telefone: string;
  
  // Etapa 2
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  pontoReferencia?: string;
  bairro: string;
  cidade: string;
  estado: string;
} 