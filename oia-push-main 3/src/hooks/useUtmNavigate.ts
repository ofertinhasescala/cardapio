import { useNavigate, NavigateOptions, To } from 'react-router-dom';
import { useUtm } from './useUtm';
import { useCallback } from 'react';

/**
 * Hook que retorna uma função de navegação que preserva os parâmetros UTM
 * Similar ao useNavigate do react-router-dom, mas adiciona os parâmetros UTM
 */
export function useUtmNavigate() {
  const navigate = useNavigate();
  const utm = useUtm();
  
  /**
   * Função de navegação que preserva os parâmetros UTM
   */
  const navigateWithUtm = useCallback((to: To, options?: NavigateOptions) => {
    try {
      // Verificar se temos parâmetros UTM para adicionar
      const utmParams = utm.getAllUtmParams();
      if (Object.keys(utmParams).length === 0) {
        // Se não tiver UTM params, usar navegação normal
        return navigate(to, options);
      }
      
      // Se o destino for um número (navegação relativa), usar navegação normal
      if (typeof to === 'number') {
        return navigate(to, options);
      }
      
      // Se o destino for uma string, verificar se já tem UTM params
      if (typeof to === 'string') {
        try {
          // Verificar se é uma URL absoluta ou relativa
          const isAbsoluteUrl = to.includes('://') || to.startsWith('//');
          
          // Para URLs relativas, simplificar o processamento
          if (!isAbsoluteUrl) {
            // Verificar se já tem parâmetros UTM
            if (to.includes('utm_')) {
              return navigate(to, options);
            }
            
            // Adicionar UTM params à URL relativa
            const urlWithUtm = utm.appendUtmToUrl(to);
            return navigate(urlWithUtm, options);
          }
          
          // Para URLs absolutas, usar URL API
          const urlObj = new URL(to, window.location.origin);
          const hasUtmParams = Array.from(urlObj.searchParams.keys()).some(key => 
            key.startsWith('utm_')
          );
          
          if (hasUtmParams) {
            return navigate(to, options);
          }
          
          return navigate(utm.appendUtmToUrl(to), options);
        } catch (error) {
          console.error('Erro ao processar URL:', error);
          return navigate(to, options);
        }
      }
      
      // Se for um objeto de localização, adicionar UTM params ao search
      if (typeof to === 'object' && to !== null) {
        // Verificar se já tem parâmetros UTM
        if (to.search) {
          const searchParams = new URLSearchParams(to.search);
          const hasUtmParams = Array.from(searchParams.keys()).some(key => 
            key.startsWith('utm_')
          );
          
          if (hasUtmParams) {
            return navigate(to, options);
          }
        }
        
        // Criar uma cópia do objeto para não modificar o original
        const newTo = { ...to };
        
        // Se tiver search, adicionar UTM params ao search
        if (newTo.search) {
          const searchParams = new URLSearchParams(newTo.search);
          
          // Adicionar UTM params
          Object.entries(utmParams).forEach(([key, value]) => {
            if (value) {
              searchParams.set(key, value);
            }
          });
          
          newTo.search = searchParams.toString();
        } else {
          // Criar search com UTM params
          const searchParams = new URLSearchParams();
          
          // Adicionar UTM params
          Object.entries(utmParams).forEach(([key, value]) => {
            if (value) {
              searchParams.set(key, value);
            }
          });
          
          if (searchParams.toString()) {
            newTo.search = searchParams.toString();
          }
        }
        
        return navigate(newTo, options);
      }
      
      // Fallback para navegação normal
      return navigate(to, options);
    } catch (error) {
      console.error('Erro na navegação com UTM:', error);
      return navigate(to, options);
    }
  }, [navigate, utm]);
  
  return navigateWithUtm;
} 