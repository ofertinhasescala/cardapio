import axios from 'axios';

export interface AddressData {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryInfo {
  distance: string;
  deliveryTime: string; 
  deliveryFee: number;
  storeFound: boolean;
}

// Padrão Singleton para o serviço de localização
class LocationService {
  private static instance: LocationService;
  
  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Busca localização atual pelo IP
  async getCurrentLocationByIP(): Promise<AddressData> {
    try {
      // Usando ipapi.co como API principal
      const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      const data = response.data;
      
      if (!data.city || !data.postal) {
        throw new Error('Dados de localização incompletos');
      }
      
      // Formatar a resposta para nosso padrão AddressData
      const addressData: AddressData = {
        cep: data.postal || '',
        rua: data.street || '',
        numero: '',
        bairro: data.district || '',
        cidade: data.city || '',
        estado: data.region_code || '',
        latitude: data.latitude,
        longitude: data.longitude
      };
      
      // Se temos CEP, vamos complementar com dados da API ViaCEP
      if (addressData.cep) {
        try {
          const detailedAddress = await this.searchAddressByCEP(addressData.cep);
          return {
            ...addressData,
            rua: detailedAddress.rua || addressData.rua,
            bairro: detailedAddress.bairro || addressData.bairro,
            latitude: addressData.latitude || detailedAddress.latitude,
            longitude: addressData.longitude || detailedAddress.longitude
          };
        } catch (error) {
          console.error('Erro ao buscar detalhes do CEP:', error);
          // Continua com os dados do IP se o CEP falhar
        }
      }
      
      // Garantir que temos coordenadas (usar fallback se necessário)
      if (!addressData.latitude || !addressData.longitude) {
        addressData.latitude = -23.6746; // Coordenadas da Av. Guarapiranga como fallback
        addressData.longitude = -46.7357;
      }
      
      return addressData;
    } catch (primaryError) {
      console.error('Erro na API primária de geolocalização:', primaryError);
      
      try {
        // Fallback para ip-api.com se a primeira API falhar
        const fallbackResponse = await axios.get('https://ip-api.com/json/?fields=lat,lon,city,region,zip,country,district', { timeout: 5000 });
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData.status === 'success' && fallbackData.city) {
          const addressData: AddressData = {
            cep: fallbackData.zip || '',
            rua: '',
            numero: '',
            bairro: fallbackData.district || '',
            cidade: fallbackData.city || '',
            estado: fallbackData.region || '',
            latitude: fallbackData.lat,
            longitude: fallbackData.lon
          };
          
          // Tentar complementar com ViaCEP se tiver CEP
          if (addressData.cep) {
            try {
              const detailedAddress = await this.searchAddressByCEP(addressData.cep);
              return {
                ...addressData,
                rua: detailedAddress.rua || addressData.rua,
                bairro: detailedAddress.bairro || addressData.bairro,
                latitude: addressData.latitude || detailedAddress.latitude,
                longitude: addressData.longitude || detailedAddress.longitude
              };
            } catch (error) {
              console.error('Erro ao buscar detalhes do CEP:', error);
            }
          }
          
          return addressData;
        } else {
          throw new Error('Falha na API de fallback ou dados incompletos');
        }
      } catch (fallbackError) {
        console.error('Erro na API de fallback:', fallbackError);
        
        // Retornar um endereço com coordenadas de fallback
        return {
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: 'São Paulo',
          estado: 'SP',
          latitude: -23.6746, // Coordenadas da Av. Guarapiranga como fallback
          longitude: -46.7357
        };
      }
    }
  }

  // Busca localização atual pelo navegador
  async getCurrentLocationByGeolocation(): Promise<AddressData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolocalização não suportada pelo navegador');
        // Fallback para IP se geolocalização não for suportada
        this.getCurrentLocationByIP()
          .then(resolve)
          .catch(reject);
        return;
      }
      
      const geolocationSuccess = async (position: GeolocationPosition) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('Geolocalização obtida com sucesso:', { latitude, longitude });
          
          try {
            // Usar Nominatim (OpenStreetMap) para geocoding reverso
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { 
                timeout: 8000,
                headers: {
                  'User-Agent': 'OiaPush-App/1.0'
                }
              }
            );
            
            const data = response.data;
            const address = data.address;
            
            const addressData: AddressData = {
              cep: address.postcode || '',
              rua: address.road || address.street || '',
              numero: address.house_number || '',
              bairro: address.suburb || address.neighbourhood || '',
              cidade: address.city || address.town || address.municipality || '',
              estado: address.state || '',
              latitude,
              longitude
            };
            
            // Se temos CEP, complementar com API do ViaCEP
            if (addressData.cep) {
              try {
                const detailedAddress = await this.searchAddressByCEP(addressData.cep);
                resolve({
                  ...addressData,
                  rua: addressData.rua || detailedAddress.rua,
                  bairro: addressData.bairro || detailedAddress.bairro,
                  cidade: addressData.cidade || detailedAddress.cidade,
                  estado: addressData.estado || detailedAddress.estado
                });
                return;
              } catch (error) {
                console.error('Erro ao buscar detalhes do CEP:', error);
                // Continua com os dados da geolocalização se o CEP falhar
              }
            }
            
            resolve(addressData);
          } catch (error) {
            console.error('Erro ao converter coordenadas em endereço:', error);
            
            // Se falhar a conversão de coordenadas para endereço, criar um endereço básico com as coordenadas
            resolve({
              cep: '',
              rua: 'Localização atual',
              numero: '',
              bairro: '',
              cidade: '',
              estado: '',
              latitude,
              longitude
            });
          }
        } catch (error) {
          console.error('Erro ao processar coordenadas:', error);
          // Tentar fallback para IP
          this.getCurrentLocationByIP()
            .then(resolve)
            .catch(reject);
        }
      };
      
      const geolocationError = (error: GeolocationPositionError) => {
        console.error('Erro de geolocalização:', error.code, error.message);
        
        let errorMessage = 'Erro ao obter geolocalização';
        
        // Mensagens de erro mais específicas
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de geolocalização negada pelo usuário';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao obter localização';
            break;
        }
        
        // Tentar fallback para IP em caso de erro
        console.log('Usando fallback de localização por IP');
        this.getCurrentLocationByIP()
          .then(resolve)
          .catch((ipError) => {
            console.error('Falha também no fallback por IP:', ipError);
            reject(new Error(errorMessage));
          });
      };
      
      // Tentar obter a geolocalização com timeout mais curto e alta precisão
      const options = { 
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      };
      
      // Mostrar mensagem no console para debug
      console.log('Solicitando permissão de geolocalização...');
      
      // Solicitar geolocalização
      navigator.geolocation.getCurrentPosition(
        geolocationSuccess,
        geolocationError,
        options
      );
    });
  }

  // Busca endereço pelo CEP usando múltiplas APIs como fallback
  async searchAddressByCEP(cep: string): Promise<AddressData> {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        throw new Error('CEP inválido');
      }
      
      console.log(`Buscando endereço para CEP: ${cleanCep}`);
      
      let addressData: AddressData | null = null;
      
      // Lista de APIs para tentar em ordem de prioridade
      const apis = [
        {
          name: 'ViaCEP',
          url: `https://viacep.com.br/ws/${cleanCep}/json/`,
          parser: (data: any) => ({
            cep: data.cep?.replace('-', '') || '',
            rua: data.logradouro || '',
            numero: '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          })
        },
        {
          name: 'CEP Aberto',
          url: `https://www.cepaberto.com/api/v3/cep?cep=${cleanCep}`,
          parser: (data: any) => ({
            cep: data.postal_code?.replace('-', '') || '',
            rua: data.address || '',
            numero: '',
            bairro: data.district || '',
            cidade: data.city?.name || '',
            estado: data.state?.short || '',
          })
        },
        {
          name: 'PostMon',
          url: `https://api.postmon.com.br/v1/cep/${cleanCep}`,
          parser: (data: any) => ({
            cep: data.cep?.replace('-', '') || '',
            rua: data.logradouro || '',
            numero: '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
          })
        },
        {
          name: 'BrasilAPI',
          url: `https://brasilapi.com.br/api/cep/v1/${cleanCep}`,
          parser: (data: any) => ({
            cep: data.cep?.replace('-', '') || '',
            rua: data.street || '',
            numero: '',
            bairro: data.neighborhood || '',
            cidade: data.city || '',
            estado: data.state || '',
          })
        }
      ];
      
      // Tentar cada API até uma funcionar
      for (const api of apis) {
        try {
          console.log(`Tentando API: ${api.name}`);
          
          const response = await fetch(api.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: 'cors'
          });
          
          if (!response.ok) {
            console.log(`${api.name} falhou com status:`, response.status);
            continue;
          }
          
          const data = await response.json();
          console.log(`Resposta da ${api.name}:`, data);
          
          // Verificar se a resposta indica erro (específico para ViaCEP)
          if (data.erro || data.error) {
            console.log(`${api.name} retornou erro:`, data);
            continue;
          }
          
          // Verificar se temos dados mínimos necessários
          const parsed = api.parser(data);
          if (!parsed.cidade || !parsed.estado) {
            console.log(`${api.name} retornou dados incompletos:`, parsed);
            continue;
          }
          
          addressData = parsed;
          console.log(`Sucesso com ${api.name}:`, addressData);
          break;
          
        } catch (apiError) {
          console.log(`Erro na API ${api.name}:`, apiError);
          continue;
        }
      }
      
      if (!addressData) {
        throw new Error('CEP não encontrado em nenhuma API');
      }
      
      // Adicionar geocodificação para obter latitude e longitude
      try {
        const address = `${addressData.rua}, ${addressData.bairro}, ${addressData.cidade}, ${addressData.estado}, Brasil`;
        const encodedAddress = encodeURIComponent(address);
        
        // Usar Nominatim (OpenStreetMap) para geocoding
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
          { 
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            mode: 'cors'
          }
        );
        
        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
          if (geocodeData && geocodeData.length > 0) {
            const location = geocodeData[0];
            addressData.latitude = parseFloat(location.lat);
            addressData.longitude = parseFloat(location.lon);
            console.log('Coordenadas obtidas com sucesso:', { lat: addressData.latitude, lng: addressData.longitude });
          } else {
            // Fallback para coordenadas baseadas no CEP
            console.log('Usando coordenadas de fallback para o CEP:', cep);
            addressData.latitude = -23.6746;
            addressData.longitude = -46.7357;
          }
        } else {
          console.log('Erro ao geocodificar, usando coordenadas de fallback');
          addressData.latitude = -23.6746;
          addressData.longitude = -46.7357;
        }
      } catch (geocodeError) {
        console.error('Erro ao obter coordenadas do endereço:', geocodeError);
        // Usar coordenadas de fallback
        addressData.latitude = -23.6746;
        addressData.longitude = -46.7357;
      }
      
      return addressData;
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Tratamento específico para diferentes tipos de erro
      if (error.message === 'CEP inválido') {
        throw new Error('CEP inválido');
      } else if (error.message === 'CEP não encontrado') {
        throw new Error('CEP não encontrado');
      } else if (error.response?.status === 404) {
        throw new Error('CEP não encontrado');
      } else if (error.response?.status >= 500) {
        throw new Error('Serviço temporariamente indisponível. Tente novamente.');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tempo limite excedido. Verifique sua conexão.');
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else if (error.message.includes('CORS') || error.message.includes('blocked')) {
        throw new Error('Erro de segurança. Recarregue a página.');
      } else {
        throw new Error('Erro ao buscar endereço. Tente novamente.');
      }
    }
  }

  // Validação básica do endereço
  validateAddress(address: AddressData): boolean {
    if (!address.cep || address.cep.replace(/\D/g, '').length !== 8) {
      return false;
    }
    
    if (!address.rua || address.rua.trim().length < 3) {
      return false;
    }
    
    if (!address.numero) {
      return false;
    }
    
    if (!address.bairro || address.bairro.trim().length < 2) {
      return false;
    }
    
    if (!address.cidade || address.cidade.trim().length < 2) {
      return false;
    }
    
    if (!address.estado || address.estado.trim().length < 2) {
      return false;
    }
    
    return true;
  }

  // Calcular informações de entrega (simulado)
  async calculateDeliveryInfo(address: AddressData): Promise<DeliveryInfo> {
    // Aqui implementaríamos a lógica real de cálculo de distância, frete, etc.
    // Por enquanto é simulado com valores fixos
    
    // Simular um delay para parecer que está processando
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      distance: "3,8km",
      deliveryTime: "20-40 min",
      deliveryFee: 0, // Grátis
      storeFound: true
    };
  }
  
  // Salvar endereço no localStorage
  saveAddressToLocalStorage(address: AddressData): void {
    // Garantir que o endereço tem coordenadas antes de salvar
    if (!address.latitude || !address.longitude) {
      address.latitude = -23.6746;
      address.longitude = -46.7357;
    }
    
    localStorage.setItem('user_address', JSON.stringify({
      ...address,
      timestamp: Date.now()
    }));
  }
  
  // Recuperar endereço do localStorage
  getAddressFromLocalStorage(): AddressData | null {
    const savedData = localStorage.getItem('user_address');
    if (!savedData) return null;
    
    try {
      const parsed = JSON.parse(savedData);
      const address = {
        cep: parsed.cep || '',
        rua: parsed.rua || '',
        numero: parsed.numero || '',
        complemento: parsed.complemento || '',
        bairro: parsed.bairro || '',
        cidade: parsed.cidade || '',
        estado: parsed.estado || '',
        latitude: parsed.latitude,
        longitude: parsed.longitude
      };
      
      // Garantir que o endereço tem coordenadas
      if (!address.latitude || !address.longitude) {
        address.latitude = -23.6746;
        address.longitude = -46.7357;
      }
      
      return address;
    } catch (error) {
      console.error('Erro ao ler endereço salvo:', error);
      return null;
    }
  }
}

export const locationService = LocationService.getInstance(); 