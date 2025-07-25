import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationRequestProps {
  onNext: () => void;
  onUseCurrentLocation: () => void; // Mantido para compatibilidade
  onAddressSearch: (address: string) => void;
  isLoading: boolean;
  error?: string | null;
  addressData?: any | null; // Para verificar se temos dados de endereço
}

export const LocationRequest: FC<LocationRequestProps> = ({
  onNext,
  onAddressSearch,
  isLoading,
  error,
  addressData
}) => {
  const [cepValue, setCepValue] = useState('');
  const [cepSearched, setCepSearched] = useState(false);

  // Reset o estado de busca quando o componente é montado
  useEffect(() => {
    setCepSearched(false);
  }, []);

  // Verifica se o endereço foi encontrado após busca
  useEffect(() => {
    if (addressData && cepSearched) {
      // Se temos dados de endereço e o CEP foi buscado, significa que a busca foi bem-sucedida
      setCepSearched(true);
    }
  }, [addressData, cepSearched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAddress();
  };

  const searchAddress = () => {
    if (cepValue.trim()) {
      const cleanCep = cepValue.replace(/\D/g, '');
      console.log('Buscando endereço para CEP:', cleanCep);
      console.log('CEP original:', cepValue);
      
      if (cleanCep.length !== 8) {
        console.error('CEP inválido:', cleanCep);
        return;
      }
      
      onAddressSearch(cleanCep);
      setCepSearched(true);
    }
  };

  // Formatar o CEP enquanto o usuário digita
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    setCepSearched(false); // Reset o estado de busca quando o usuário altera o CEP
    
    if (value.length <= 8) {
      // Formata como 00000-000
      if (value.length > 5) {
        setCepValue(`${value.slice(0, 5)}-${value.slice(5)}`);
      } else {
        setCepValue(value);
      }
    }
  };

  // Verificar se o botão deve estar habilitado
  const isButtonEnabled = cepValue.replace(/\D/g, '').length === 8 && !isLoading;

  return (
    <motion.div 
      className="text-center p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Ícone de localização animado */}
      <motion.div 
        className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <MapPin className="w-8 h-8 text-primary" />
      </motion.div>
      
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        📍 Onde você está?
      </h2>
      
      <p className="text-muted-foreground mb-6">
        Digite seu CEP para calcularmos o frete e tempo de entrega
      </p>

      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive" className="mb-4 text-left">
          <AlertDescription className="text-sm">
            <strong>Ops!</strong> {error}
            <br />
            <span className="text-xs mt-1 block">
              Dica: Verifique se o CEP tem 8 dígitos e tente novamente.
            </span>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Formulário de busca por CEP */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <Input 
            name="cep"
            value={cepValue}
            onChange={handleCepChange}
            placeholder="Digite seu CEP (ex: 01234-567)"
            className="mb-4 pr-10 text-center text-lg"
            maxLength={9}
            disabled={isLoading}
            autoComplete="postal-code"
          />
          <Button 
            type="submit" 
            size="sm" 
            variant="ghost" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={isLoading || cepValue.replace(/\D/g, '').length !== 8}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center items-center text-primary mt-4">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Buscando endereço...</span>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground space-y-1 mb-6">
          <p>Não sabe seu CEP? <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-primary underline">Consulte aqui</a></p>
        </div>
      )}

      {/* Botão para buscar CEP (mesma ação da lupa) */}
      <Button
        onClick={searchAddress}
        disabled={!isButtonEnabled}
        className="w-full bg-primary hover:bg-primary/90 mt-4"
      >
        Buscar endereço
        <Search className="ml-2 h-4 w-4" />
      </Button>

      {/* Mensagem de ajuda */}
      {cepSearched && !addressData && !isLoading && (
        <p className="text-xs text-amber-600 mt-2">
          Digite um CEP válido e clique no botão para buscar o endereço
        </p>
      )}
    </motion.div>
  );
}; 