import { useEffect } from 'react';
import { useUtm } from '@/hooks/useUtm';

/**
 * Componente que adiciona um interceptador global para navegação
 * Garante que todos os links internos preservem os parâmetros UTM
 */
export function UtmNavigation() {
  const utm = useUtm();
  
  useEffect(() => {
    // Função para adicionar UTM params a um link
    const addUtmToLink = (url: string): string => {
      try {
        // Verificar se temos parâmetros UTM para adicionar
        const utmParams = utm.getAllUtmParams();
        if (Object.keys(utmParams).length === 0) {
          return url;
        }
        
        // Verificar se é uma URL relativa ou absoluta
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
        
        // Para URLs mais complexas, usar a função appendUtmToUrl
        return utm.appendUtmToUrl(url);
      } catch (error) {
        console.error('Erro ao processar URL:', error);
        return url;
      }
    };
    
    // Interceptar cliques em links
    const handleLinkClick = (event: MouseEvent) => {
      try {
        // Verificar se é um clique em um link
        const target = event.target as HTMLElement;
        const link = target.closest('a');
        
        if (!link) return;
        
        // Verificar se é um link interno
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Ignorar links externos, âncoras, javascript: e mailto:
        if (
          href.startsWith('http') ||
          href.startsWith('#') ||
          href.startsWith('javascript:') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:')
        ) {
          return;
        }
        
        // Adicionar UTM params ao link
        const newHref = addUtmToLink(href);
        
        // Só modificar se for diferente
        if (newHref !== href) {
          link.setAttribute('href', newHref);
        }
      } catch (error) {
        console.error('Erro no interceptador de links:', error);
      }
    };
    
    // Adicionar listener para capturar cliques em links
    document.addEventListener('click', handleLinkClick, true);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [utm]);
  
  return null;
} 