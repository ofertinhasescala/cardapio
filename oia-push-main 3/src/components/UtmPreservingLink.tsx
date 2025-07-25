import React from 'react';
import { Link, LinkProps, To } from 'react-router-dom';
import { useUtm } from '@/hooks/useUtm';

interface UtmPreservingLinkProps extends LinkProps {
  children: React.ReactNode;
}

/**
 * Componente de link que preserva os parâmetros UTM nas navegações internas
 */
export function UtmPreservingLink({ to, children, ...props }: UtmPreservingLinkProps) {
  const utm = useUtm();
  
  // Função para adicionar UTM params ao link
  const getUrlWithUtm = (url: To): To => {
    // Verificar se temos parâmetros UTM para adicionar
    const utmParams = utm.getAllUtmParams();
    if (Object.keys(utmParams).length === 0) {
      return url;
    }
    
    // Se o link for uma string, adicionar UTM params
    if (typeof url === 'string') {
      // Verificar se é uma URL absoluta ou relativa
      const isAbsoluteUrl = url.includes('://') || url.startsWith('//');
      
      // Verificar se já contém parâmetros UTM
      if (url.includes('utm_')) {
        return url;
      }
      
      // Para URLs relativas simples, podemos adicionar os parâmetros diretamente
      if (!isAbsoluteUrl && !url.includes('?')) {
        const queryString = utm.getUtmQueryString();
        return `${url}?${queryString}`;
      }
      
      return utm.appendUtmToUrl(url);
    }
    
    // Se for um objeto de localização, adicionar UTM params ao pathname
    if (typeof url === 'object' && url !== null) {
      // Criar uma cópia do objeto para não modificar o original
      const newUrl = { ...url };
      
      // Se tiver search, adicionar UTM params ao search
      if (newUrl.search) {
        const searchParams = new URLSearchParams(newUrl.search);
        
        // Verificar se já tem parâmetros UTM
        const hasUtmParams = Array.from(searchParams.keys()).some(key => 
          key.startsWith('utm_')
        );
        
        if (hasUtmParams) {
          return url;
        }
        
        // Adicionar UTM params
        Object.entries(utmParams).forEach(([key, value]) => {
          if (value) {
            searchParams.set(key, value);
          }
        });
        
        newUrl.search = searchParams.toString();
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
          newUrl.search = searchParams.toString();
        }
      }
      
      return newUrl;
    }
    
    return url;
  };
  
  return (
    <Link to={getUrlWithUtm(to)} {...props}>
      {children}
    </Link>
  );
} 