import { FC, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { LocationRequest } from '@/components/LocationSteps/LocationRequest';
import { AddressForm } from '@/components/LocationSteps/AddressForm';
import { AddressConfirmation } from '@/components/LocationSteps/AddressConfirmation';
import { useAddress } from '@/hooks/useAddress';
import { AddressData, DeliveryInfo } from '@/services/locationService';

// Tipos
type LocationStep = 'request' | 'form' | 'confirmation';

interface ModernLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationConfirmed: (addressData: AddressData) => void;
}

export const ModernLocationModal: FC<ModernLocationModalProps> = ({
  isOpen,
  onClose,
  onLocationConfirmed
}) => {
  const [currentStep, setCurrentStep] = useState<LocationStep>('request');
  
  const {
    addressData,
    deliveryInfo,
    isLoading,
    error,
    getAddressByCEP,
    updateAddressField,
    calculateDeliveryDetails,
    saveAddress
  } = useAddress();

  // Reset step quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('request');
    }
  }, [isOpen]);

  // Gerenciar erros - voltar para formulário em caso de erros
  useEffect(() => {
    if (error && currentStep === 'confirmation') {
      setCurrentStep('form');
    }
  }, [error]);

  // Lidar com busca por CEP
  const handleAddressSearch = async (cep: string) => {
    try {
      // Remover caracteres não numéricos
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        console.error('CEP inválido');
        return;
      }
      
      // Buscar endereço pelo CEP
      await getAddressByCEP(cleanCep);
      
      // Avançar para o formulário se encontrou o CEP
      setCurrentStep('form');
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  // Função vazia para compatibilidade com a interface
  const handleUseCurrentLocation = () => {
    // Não faz nada, mantida apenas para compatibilidade
  };

  // Avançar para confirmação após formulário
  const handleAddressFormSubmit = async (address: AddressData) => {
    // Salvar o endereço
    saveAddress(address);
    
    // Calcular informações de entrega
    await calculateDeliveryDetails(address);
    
    // Avançar para confirmação
    setCurrentStep('confirmation');
  };

  // Finalizar o fluxo
  const handleConfirmLocation = () => {
    if (addressData) {
      onLocationConfirmed(addressData);
    }
  };

  // Voltar para o passo anterior
  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep('request');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('form');
    }
  };

  // Obter título e descrição com base na etapa atual
  const getStepInfo = () => {
    switch (currentStep) {
      case 'request':
        return {
          title: "Informe seu CEP",
          description: "Digite seu CEP para entregarmos seu pedido"
        };
      case 'form':
        return {
          title: "Endereço de entrega",
          description: "Complete seu endereço para entrega"
        };
      case 'confirmation':
        return {
          title: "Confirmar localização",
          description: "Verifique se o endereço está correto"
        };
      default:
        return {
          title: "Informe seu CEP",
          description: "Digite seu CEP para entregarmos seu pedido"
        };
    }
  };

  // Renderizar o conteúdo baseado na etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 'request':
        return (
          <LocationRequest
            onNext={() => setCurrentStep('form')}
            onUseCurrentLocation={handleUseCurrentLocation}
            onAddressSearch={handleAddressSearch}
            isLoading={isLoading}
            error={error}
            addressData={addressData}
          />
        );
      
      case 'form':
        return (
          <AddressForm
            initialAddress={addressData}
            onNext={handleAddressFormSubmit}
            onBack={handleBack}
            onCepSearch={handleAddressSearch}
            isLoading={isLoading}
          />
        );
      
      case 'confirmation':
        if (!addressData || !deliveryInfo) return null;
        
        return (
          <AddressConfirmation
            address={addressData}
            deliveryInfo={deliveryInfo}
            onConfirm={handleConfirmLocation}
            onEdit={() => setCurrentStep('form')}
            isLoading={isLoading}
          />
        );
      
      default:
        return null;
    }
  };

  const { title, description } = getStepInfo();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent 
        className="w-[95vw] max-w-[425px] sm:max-w-[425px] rounded-xl p-0 border-0 shadow-2xl mx-4 sm:mx-auto"
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby="location-modal-description"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <p id="location-modal-description" className="sr-only">{description}</p>
        
        <motion.div 
          className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl relative overflow-hidden border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Botão de fechar */}
          {currentStep !== 'request' && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors z-10"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {/* Indicador de progresso */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '33.333%' }}
              animate={{ 
                width: currentStep === 'request' ? '33.333%' : 
                       currentStep === 'form' ? '66.666%' : '100%'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Conteúdo das etapas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Mensagem de erro */}
          {error && (
            <div className="px-4 sm:px-6 pb-4 -mt-2">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 