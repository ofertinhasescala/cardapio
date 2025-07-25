import { FC } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Loader2, MapPin, Instagram, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AddressData, DeliveryInfo } from '@/services/locationService';

interface AddressConfirmationProps {
  address: AddressData;
  deliveryInfo: DeliveryInfo;
  onConfirm: () => void;
  onEdit: () => void;
  isLoading: boolean;
}

export const AddressConfirmation: FC<AddressConfirmationProps> = ({
  address,
  deliveryInfo,
  onConfirm,
  onEdit,
  isLoading
}) => {
  const formatAddress = (address: AddressData): string => {
    let formatted = `${address.rua}, ${address.numero}, ${address.bairro}, ${address.cidade} - ${address.estado}, ${address.cep}`;
    return formatted;
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Título */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
        Confirme sua localização:
      </h3>

      {/* Card do endereço - MOBILE FIRST */}
      <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-r-lg mb-3 sm:mb-4">
        <p className="text-green-800 font-medium leading-relaxed text-sm sm:text-base break-words">
          📍 {formatAddress(address)}
        </p>
      </div>

      {/* Informação sobre loja próxima */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-r-lg mb-4 sm:mb-6">
        <div className="flex items-start sm:items-center">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
          <p className="text-blue-800 font-medium text-sm sm:text-base leading-relaxed">
            <strong>Loja encontrada a 4,3 km</strong> bem próxima da sua localização!
          </p>
        </div>
      </div>

      {/* Informações de entrega - MOBILE OPTIMIZED */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {/* Taxa de entrega */}
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          </div>
          <span className="text-gray-900 text-sm sm:text-base font-medium">
            <strong>Entrega grátis</strong>
          </span>
        </div>

        {/* Tempo estimado */}
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <span className="text-gray-900 text-sm sm:text-base font-medium">
            <strong>Tempo estimado: 20-40 min</strong>
          </span>
        </div>
      </div>

      {/* Seção Instagram - MOBILE OPTIMIZED */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100 mb-3 sm:mb-4">
        <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-3">
          Nos siga no Instagram:
        </h4>
        <a 
          href="https://www.instagram.com/phamellagourmet/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm sm:text-base transform hover:scale-105 active:scale-95 w-full sm:w-auto justify-center sm:justify-start"
        >
          <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>@phamellagourmet</span>
        </a>
      </div>

      {/* Aviso sobre contato telefônico - MOBILE OPTIMIZED */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-r-lg mb-4 sm:mb-6">
        <div className="flex items-start">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-800 text-sm sm:text-base leading-relaxed">
            <strong>Atenção:</strong> Te chamaremos no número solicitado no final do pedido assim que for finalizado o pedido.
          </p>
        </div>
      </div>

      {/* Botões - MOBILE FIRST */}
      <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
        {/* Botão Editar - outline */}
        <Button 
          onClick={onEdit} 
          variant="outline" 
          className="w-full h-12 sm:h-14 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-50 active:bg-gray-100 text-sm sm:text-base transition-all"
          disabled={isLoading}
        >
          Editar
        </Button>
        
        {/* Botão Acessar Cardápio - principal */}
        <Button 
          onClick={onConfirm} 
          className="w-full h-12 sm:h-14 bg-orange-500 text-white font-semibold hover:bg-orange-600 active:bg-orange-700 flex items-center justify-center text-sm sm:text-base transition-all shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <span>Acessar Cardápio</span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}; 