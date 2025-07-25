import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AddressData } from '@/services/locationService';

// Schema para validação do endereço
const addressSchema = z.object({
  cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
  rua: z.string().min(3, 'Informe o nome da rua'),
  numero: z.string().min(1, 'Informe o número'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Informe o bairro'),
  cidade: z.string().min(2, 'Informe a cidade'),
  estado: z.string().min(2, 'Informe o estado'),
});

interface AddressFormProps {
  initialAddress: AddressData | null;
  onNext: (address: AddressData) => void;
  onBack: () => void;
  onCepSearch: (cep: string) => Promise<void>;
  isLoading: boolean;
}

export const AddressForm: FC<AddressFormProps> = ({
  initialAddress,
  onNext,
  onBack,
  onCepSearch,
  isLoading
}) => {
  const [isCepSearching, setIsCepSearching] = useState(false);
  
  // Configuração do formulário com react-hook-form
  const form = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialAddress || {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
  });

  // Atualizar formulário quando initialAddress mudar
  useEffect(() => {
    if (initialAddress) {
      form.reset(initialAddress);
    }
  }, [initialAddress, form]);

  // Lidar com a pesquisa de CEP
  const handleCepSearch = async () => {
    const cep = form.getValues('cep').replace(/\D/g, '');
    
    if (cep.length === 8) {
      setIsCepSearching(true);
      await onCepSearch(cep);
      setIsCepSearching(false);
    }
  };

  // Lidar com a submissão do formulário
  const onSubmit = (data: AddressData) => {
    onNext(data);
  };

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>
      
      {initialAddress?.rua && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800 flex items-center">
            <span className="bg-green-100 rounded-full p-1 mr-2">✓</span>
            Endereço detectado automaticamente
          </p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {/* CEP */}
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>CEP</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="00000-000"
                        disabled={isLoading || isCepSearching}
                        onChange={(e) => {
                          // Formatar CEP: 00000-000
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 8) value = value.substring(0, 8);
                          
                          if (value.length > 5) {
                            value = `${value.substring(0, 5)}-${value.substring(5)}`;
                          }
                          
                          field.onChange(value.replace('-', ''));
                        }}
                        onBlur={() => {
                          field.onBlur();
                          handleCepSearch();
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={handleCepSearch}
                      disabled={isLoading || isCepSearching || form.getValues('cep').length !== 8}
                    >
                      {isCepSearching ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Rua */}
          <FormField
            control={form.control}
            name="rua"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome da rua" disabled={isLoading || isCepSearching} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Número e Complemento */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123" disabled={isLoading || isCepSearching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Apto, bloco..." disabled={isLoading || isCepSearching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Bairro */}
          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do bairro" disabled={isLoading || isCepSearching} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Cidade e Estado */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Cidade" disabled={isLoading || isCepSearching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="UF" disabled={isLoading || isCepSearching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isLoading || isCepSearching}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processando...
              </>
            ) : 'Confirmar Endereço'}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}; 