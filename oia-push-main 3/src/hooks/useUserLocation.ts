import { useState, useEffect } from 'react';
import axios from 'axios';

interface LocationData {
  city: string;
  region: string; // estado
  country_name: string;
}

interface UseUserLocationReturn {
  city: string | null;
  state: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface CachedLocation {
  city: string;
  state: string;
  timestamp: number;
}

const CACHE_KEY = 'phamela_gourmet_user_location';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

const useUserLocation = (): UseUserLocationReturn => {
  const [city, setCity] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    // Verificar cache
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData) as CachedLocation;
        const now = Date.now();
        
        // Se o cache ainda for válido, use-o
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          setCity(parsedCache.city);
          setState(parsedCache.state);
          setLoading(false);
          return;
        }
      }
    } catch (cacheError) {
      console.error('Erro ao ler cache:', cacheError);
      // Continua para buscar dados da API
    }

    try {
      // Usando ipapi.co como API principal (limite gratuito de 1000 requisições/dia)
      const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      const data: LocationData = response.data;
      
      if (!data.city || !data.region) {
        throw new Error('Dados de localização incompletos');
      }
      
      setCity(data.city);
      setState(data.region);
      
      // Salvar no cache
      const cacheData: CachedLocation = {
        city: data.city,
        state: data.region,
        timestamp: Date.now()
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (primaryError) {
      console.error('Erro na API primária de geolocalização:', primaryError);
      
      try {
        // Fallback para ip-api.com se a primeira API falhar
        const fallbackResponse = await axios.get('https://ip-api.com/json/?fields=city,region,status', { timeout: 5000 });
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData.status === 'success' && fallbackData.city && fallbackData.region) {
          setCity(fallbackData.city);
          setState(fallbackData.region);
          
          // Salvar no cache
          const cacheData: CachedLocation = {
            city: fallbackData.city,
            state: fallbackData.region,
            timestamp: Date.now()
          };
          
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } else {
          throw new Error('Falha na API de fallback ou dados incompletos');
        }
      } catch (fallbackError) {
        console.error('Erro na API de fallback:', fallbackError);
        setError(fallbackError as Error);
        
        // Usar dados de fallback genéricos após várias tentativas
        if (retryCount >= 2) {
          setCity(null);
          setState(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar a localização na montagem do componente
  useEffect(() => {
    fetchLocation();
  }, [retryCount]);

  // Função para tentar novamente
  const refetch = async () => {
    setRetryCount(prev => prev + 1);
  };

  return { city, state, loading, error, refetch };
};

export default useUserLocation; 