import { useState, useCallback } from 'react';
import { locationService, AddressData, DeliveryInfo } from '@/services/locationService';

interface UseAddressReturn {
  addressData: AddressData | null;
  deliveryInfo: DeliveryInfo | null;
  isLoading: boolean;
  error: string | null;
  getAddressByCEP: (cep: string) => Promise<void>;
  updateAddressField: (field: keyof AddressData, value: string) => void;
  calculateDeliveryDetails: (address: AddressData) => Promise<void>;
  saveAddress: (address: AddressData) => void;
}

export function useAddress(): UseAddressReturn {
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar endereço por CEP
  const getAddressByCEP = useCallback(async (cep: string) => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      setError('CEP inválido. Digite um CEP com 8 dígitos.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const address = await locationService.searchAddressByCEP(cep);
      setAddressData(prevAddress => ({
        ...prevAddress || {},
        ...address
      }) as AddressData);
    } catch (err: any) {
      // Diferentes tipos de erro com mensagens específicas
      if (err.message.includes('CEP inválido') || err.message.includes('CEP não encontrado')) {
        setError('CEP não encontrado. Verifique se o CEP está correto.');
      } else if (err.message.includes('timeout') || err.message.includes('Network Error')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError('Erro ao buscar CEP. Verifique se o CEP está correto e tente novamente.');
      }
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar um campo do endereço
  const updateAddressField = useCallback((field: keyof AddressData, value: string) => {
    setAddressData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  // Calcular detalhes de entrega
  const calculateDeliveryDetails = useCallback(async (address: AddressData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar endereço antes de calcular
      if (!locationService.validateAddress(address)) {
        setError('Endereço incompleto. Preencha todos os campos obrigatórios.');
        return;
      }
      
      const info = await locationService.calculateDeliveryInfo(address);
      setDeliveryInfo(info);
    } catch (err: any) {
      setError(`Erro ao calcular informações de entrega: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar endereço
  const saveAddress = useCallback((address: AddressData) => {
    locationService.saveAddressToLocalStorage(address);
    setAddressData(address);
  }, []);

  return {
    addressData,
    deliveryInfo,
    isLoading,
    error,
    getAddressByCEP,
    updateAddressField,
    calculateDeliveryDetails,
    saveAddress
  };
} 