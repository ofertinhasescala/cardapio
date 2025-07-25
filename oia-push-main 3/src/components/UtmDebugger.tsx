import { useUtm } from '@/hooks/useUtm';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

/**
 * Componente para depuração dos parâmetros UTM
 * Exibe os parâmetros UTM atuais e permite verificar se estão sendo preservados
 */
export function UtmDebugger() {
  const utm = useUtm();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  
  // Verificar se estamos em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Extrair parâmetros UTM da URL atual
  const urlUtmParams: Record<string, string> = {};
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
  
  utmKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      urlUtmParams[key] = value;
    }
  });
  
  // Obter parâmetros UTM do store
  const storeUtmParams = utm.getAllUtmParams();
  
  return (
    <div style={{
      position: 'fixed',
      bottom: isVisible ? '20px' : '-1px',
      right: '20px',
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: isVisible ? '15px' : '5px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '400px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
    }}
    onClick={() => setIsVisible(!isVisible)}
    >
      {isVisible ? (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
            UTM Debugger
          </h4>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>URL UTM Params:</strong>
            {Object.keys(urlUtmParams).length > 0 ? (
              <pre style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(urlUtmParams, null, 2)}
              </pre>
            ) : (
              <p style={{ margin: '5px 0', opacity: 0.7 }}>Nenhum parâmetro UTM na URL</p>
            )}
          </div>
          
          <div>
            <strong>Store UTM Params:</strong>
            {Object.keys(storeUtmParams).length > 0 ? (
              <pre style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(storeUtmParams, null, 2)}
              </pre>
            ) : (
              <p style={{ margin: '5px 0', opacity: 0.7 }}>Nenhum parâmetro UTM no store</p>
            )}
          </div>
          
          <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
            Clique para fechar
          </div>
        </div>
      ) : (
        <div style={{ padding: '5px 10px' }}>UTM Debug</div>
      )}
    </div>
  );
} 