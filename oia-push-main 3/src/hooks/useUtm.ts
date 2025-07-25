import { useState, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  [key: string]: string | undefined;
}

interface UtmStore {
  utmParams: UtmParams;
  setUtmParams: (params: UtmParams) => void;
  clearUtmParams: () => void;
}

// Cria um store persistente para os parâmetros UTM
export const useUtmStore = create<UtmStore>()(
  persist(
    (set) => ({
      utmParams: {},
      setUtmParams: (params) => set({ utmParams: params }),
      clearUtmParams: () => set({ utmParams: {} }),
    }),
    {
      name: 'utm-storage', // nome para o armazenamento local
    }
  )
);

/**
 * Hook para capturar e gerenciar parâmetros UTM da URL
 * @returns Objeto com parâmetros UTM e funções para gerenciá-los
 */
export function useUtm() {
  const { utmParams, setUtmParams, clearUtmParams } = useUtmStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttemptedRef = useRef(false);

  // Captura os parâmetros UTM da URL quando o componente é montado
  useEffect(() => {
    if (!isInitialized && !initializationAttemptedRef.current) {
      initializationAttemptedRef.current = true;
      
      try {
        const captureUtmParams = () => {
          try {
            const url = new URL(window.location.href);
            const params: UtmParams = {};
            
            // Lista de parâmetros UTM para capturar
            const utmKeys = [
              'utm_source',
              'utm_medium',
              'utm_campaign',
              'utm_term',
              'utm_content',
              'utm_id',
            ];
            
            // Captura cada parâmetro UTM da URL
            utmKeys.forEach((key) => {
              const value = url.searchParams.get(key);
              if (value) {
                params[key] = value;
              }
            });
            
            // Só atualiza se encontrou algum parâmetro UTM
            if (Object.keys(params).length > 0) {
              console.log('UTM params captured:', params);
              setUtmParams(params);
            } else if (Object.keys(utmParams).length === 0) {
              // Se não há parâmetros na URL e o store está vazio, define valores padrão
              const defaultParams: UtmParams = {
                utm_source: 'direct',
                utm_medium: 'none'
              };
              setUtmParams(defaultParams);
            }
          } catch (error) {
            console.error('Error capturing UTM params:', error);
          }
          
          setIsInitialized(true);
        };
        
        captureUtmParams();
        
        // Adiciona listener para capturar UTMs em mudanças de história
        const handleRouteChange = () => {
          captureUtmParams();
        };
        
        window.addEventListener('popstate', handleRouteChange);
        
        return () => {
          window.removeEventListener('popstate', handleRouteChange);
        };
      } catch (error) {
        console.error('Error in useUtm hook:', error);
        setIsInitialized(true); // Marca como inicializado mesmo em caso de erro para evitar loops
      }
    }
  }, [isInitialized, setUtmParams, utmParams]);

  /**
   * Obtém todos os parâmetros UTM como um objeto
   */
  const getAllUtmParams = (): UtmParams => {
    return utmParams;
  };

  /**
   * Obtém todos os parâmetros UTM como uma string de query
   */
  const getUtmQueryString = (): string => {
    try {
      return Object.entries(utmParams)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&');
    } catch (error) {
      console.error('Error generating UTM query string:', error);
      return '';
    }
  };

  /**
   * Adiciona os parâmetros UTM a uma URL
   */
  const appendUtmToUrl = (url: string): string => {
    try {
      // Verificar se é uma URL relativa
      const isRelativeUrl = !url.includes('://') && !url.startsWith('//');
      
      // Criar objeto URL para manipulação
      const urlObj = new URL(url, window.location.origin);
      
      // Verificar se a URL já tem parâmetros UTM
      const hasUtmParams = Array.from(urlObj.searchParams.keys()).some(key => 
        key.startsWith('utm_')
      );
      
      if (hasUtmParams) {
        return url;
      }
      
      // Adicionar parâmetros UTM
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
          urlObj.searchParams.set(key, value);
        }
      });
      
      // Se a URL original era relativa, retornar apenas o pathname + search
      if (isRelativeUrl) {
        return urlObj.pathname + urlObj.search + urlObj.hash;
      }
      
      return urlObj.toString();
    } catch (error) {
      console.error('Error appending UTM to URL:', error);
      return url;
    }
  };

  return {
    utmParams,
    setUtmParams,
    clearUtmParams,
    getAllUtmParams,
    getUtmQueryString,
    appendUtmToUrl,
  };
} 