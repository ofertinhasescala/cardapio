// pixService.ts
import { CheckoutFormData } from "@/types/checkout";
import { UtmParams } from "@/hooks/useUtm";

// Tipos para a API da Monetrix
interface PixCustomer {
  name: string;
  phone: string;
  email: string; // Campo obrigatório
  document: {
    type: 'cpf';
    number: string;
  };
  address?: {
    street: string;
    streetNumber: string;
    complement?: string;
    zipCode: string;
    neighborhood: string;
    city: string;
    state: string;
    country: 'BR';
  };
}

interface PixItem {
  title: string;
  quantity: number;
  unitPrice: number; // Valor em centavos
  tangible: boolean;
  externalRef?: string;
}

interface PixTransactionRequest {
  amount: number; // Valor total em centavos
  paymentMethod: 'pix';
  items: PixItem[];
  customer: PixCustomer;
  pix?: {
    expiresIn?: number; // Tempo de expiração em minutos (opcional)
  };
  externalRef?: string;
  metadata?: string;
  postbackUrl?: string;
}

export interface PixTransactionResponse {
  id: string;
  qrCode?: string;
  qrCodeUrl?: string;
  pixCode?: string;
  status: string;
  expiresAt: string;
  amount: number;
  externalRef?: string;
  // Campo pix que pode estar presente na resposta da API
  pix?: {
    qrCode?: string;
    qrCodeUrl?: string;
    code?: string;
    pixCode?: string;
    qrcode?: string;
    expirationDate?: string;
    receiptUrl?: string;
  };
}

class PixApiError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'PixApiError';
  }
}

/**
 * Mapeia os dados do formulário de checkout para o formato esperado pela API Monetrix
 * @param formData Dados do formulário de checkout
 * @param cartItems Itens do carrinho
 * @param totalPrice Preço total
 * @param utmParams Parâmetros UTM para rastreamento
 * @returns Objeto formatado para a API Monetrix
 */
export function mapCheckoutDataToPixRequest(
  formData: CheckoutFormData & { cpf: string; email: string }, 
  cartItems: any[], 
  totalPrice: number,
  utmParams?: UtmParams
): PixTransactionRequest {
  // Criar metadados com informações de UTM
  const metadata: Record<string, any> = {
    orderTime: new Date().toISOString(),
    platform: "PhamelaGourmet",
  };
  
  // Adicionar parâmetros UTM aos metadados
  if (utmParams) {
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        metadata[key] = value;
      }
    });
  }
  
  // Converter metadados para string JSON
  const metadataString = JSON.stringify(metadata);
  
  // Gerar referência externa com UTM source se disponível
  const utmSource = utmParams?.utm_source || 'direct';
  const externalRef = `ORDER_${Date.now()}_${utmSource}`;
  
  return {
    amount: Math.round(totalPrice * 100), // Convertendo para centavos
    paymentMethod: 'pix',
    items: cartItems.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unitPrice: Math.round(item.unitPrice * 100), // Convertendo para centavos
      tangible: true,
      externalRef: item.id?.toString() || undefined
    })),
    customer: {
      name: formData.nome,
      phone: formData.telefone.replace(/\D/g, ''),
      email: formData.email, // Usar email fornecido (ou valor padrão)
      document: {
        type: 'cpf',
        number: formData.cpf.replace(/\D/g, '') // Usar CPF fornecido (ou valor padrão)
      },
      address: {
        street: formData.rua,
        streetNumber: formData.numero,
        complement: formData.complemento || undefined,
        zipCode: formData.cep.replace(/\D/g, ''),
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        country: 'BR'
      }
    },
    pix: {
      expiresIn: 60 // Expira em 60 minutos
    },
    externalRef,
    metadata: metadataString
  };
}

/**
 * Cria uma transação PIX na API Monetrix
 */
export async function createPixTransaction(data: PixTransactionRequest | any): Promise<PixTransactionResponse> {
  try {
    console.log('🔄 Iniciando criação de transação PIX...');
    console.log('Dados recebidos:', JSON.stringify(data, null, 2));

    // Verificação básica dos campos obrigatórios
    if (!data.customer?.email) {
      console.error('❌ Email do cliente é obrigatório');
      throw new PixApiError('Email do cliente é obrigatório');
    }

    // Configuração da API
    const API_URL = import.meta.env.VITE_MONETRIX_API_URL || 'https://api.monetrix.store/v1/transactions';
    const PUBLIC_KEY = import.meta.env.VITE_MONETRIX_PUBLIC_KEY;
    const SECRET_KEY = import.meta.env.VITE_MONETRIX_SECRET_KEY;

    if (!PUBLIC_KEY || !SECRET_KEY) {
      throw new PixApiError('Credenciais da API não configuradas');
    }

    // Preparar headers
    const credentials = btoa(`${PUBLIC_KEY}:${SECRET_KEY}`);
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    console.log('🔄 Enviando requisição para API...');
    console.log('URL:', API_URL);
    console.log('Headers:', { ...headers, Authorization: 'Basic [HIDDEN]' });

    // Fazer requisição
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📥 Resposta da API recebida');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    // Verificar se a resposta é JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Resposta não é JSON:', textResponse);
      throw new PixApiError(`Resposta inválida da API: ${textResponse}`, response.status);
    }

    let responseData = await response.json();
    console.log('Dados da resposta:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      // Tentar extrair mensagem de erro da resposta
      let errorMessage = 'Erro desconhecido na API';
      
      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.errors) {
        errorMessage = Array.isArray(responseData.errors) 
          ? responseData.errors.join('; ')
          : JSON.stringify(responseData.errors);
      }

      // Log detalhado do erro
      console.error('❌ Erro da API:', errorMessage);
      
      // Se houver detalhes específicos do erro, exibir também
      if (responseData.error && typeof responseData.error === 'object') {
        console.error('Detalhes do erro:', JSON.stringify(responseData.error, null, 2));
        
        // Construir uma mensagem de erro mais detalhada
        const errorDetails: string[] = [];
        
        Object.entries(responseData.error).forEach(([field, message]) => {
          errorDetails.push(`${field}: ${message}`);
        });
        
        if (errorDetails.length > 0) {
          errorMessage += ` (${errorDetails.join(', ')})`;
        }
      }
      
      throw new PixApiError(errorMessage, response.status, responseData);
    }

    // Função auxiliar para buscar valores em diferentes caminhos da resposta
    const findValueInResponse = (keys: string[], obj: any = responseData): any => {
      for (const key of keys) {
        // Verificar caminhos aninhados com notação de ponto
        if (key.includes('.')) {
          const parts = key.split('.');
          let current = obj;
          
          for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
              current = current[part];
            } else {
              current = undefined;
              break;
            }
          }
          
          if (current !== undefined) {
            return current;
          }
        } 
        // Verificar caminhos diretos
        else if (obj && typeof obj === 'object' && key in obj) {
          return obj[key];
        }
      }
      return undefined;
    };

    // Normalizar a resposta para o formato esperado pelo componente
    const normalizedResponse: PixTransactionResponse = {
      id: findValueInResponse(['id', 'transactionId', 'transaction.id', 'pix.id']) || `pix-${Date.now()}`,
      status: findValueInResponse(['status', 'transaction.status', 'pix.status']) || 'pending',
      amount: findValueInResponse(['amount', 'transaction.amount', 'value', 'pix.amount']) || data.amount,
      expiresAt: findValueInResponse(['expiresAt', 'pix.expirationDate', 'expirationDate']) || 
                 new Date(Date.now() + 3600000).toISOString(),
      externalRef: findValueInResponse(['externalRef', 'reference', 'pix.reference']) || data.externalRef
    };

    // Buscar dados do QR code em vários locais possíveis da resposta
    const qrCode = findValueInResponse([
      'qrCode', 'qr_code', 'qrcode', 'qr', 
      'pix.qrCode', 'pix.qr_code', 'pix.qrcode', 
      'transaction.qrCode', 'transaction.qr_code'
    ]);
    
    const qrCodeUrl = findValueInResponse([
      'qrCodeUrl', 'qrcode_url', 'qrcodeUrl', 'qrUrl', 
      'pix.qrCodeUrl', 'pix.qrcode_url', 'pix.qrcodeUrl', 
      'transaction.qrCodeUrl', 'transaction.qrcode_url'
    ]);
    
    const pixCode = findValueInResponse([
      'pixCode', 'pix_code', 'pixcode', 'code', 
      'pix.pixCode', 'pix.pix_code', 'pix.pixcode', 'pix.code',
      'transaction.pixCode', 'transaction.pix_code', 'pix.qrcode'
    ]);

    // Adicionar os dados encontrados à resposta normalizada
    if (qrCode) {
      console.log('QR Code encontrado:', qrCode.substring(0, 50) + '...');
      normalizedResponse.qrCode = qrCode;
    }
    
    if (qrCodeUrl) {
      console.log('QR Code URL encontrada:', qrCodeUrl);
      normalizedResponse.qrCodeUrl = qrCodeUrl;
    }
    
    if (pixCode) {
      console.log('Código PIX encontrado:', pixCode.substring(0, 50) + '...');
      normalizedResponse.pixCode = pixCode;
    }

    // Verificar se temos o objeto pix na resposta
    if (responseData.pix && typeof responseData.pix === 'object') {
      console.log('Objeto pix encontrado na resposta');
      normalizedResponse.pix = { ...responseData.pix };
    }

    // Se não encontramos dados de QR code ou código PIX, usar serviço externo para gerar QR code
    if (!qrCode && !qrCodeUrl && !pixCode) {
      console.warn('⚠️ Resposta da API não contém QR Code ou código PIX');
      
      // Se temos um código de transação, podemos tentar gerar um QR code
      if (normalizedResponse.id) {
        normalizedResponse.qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(normalizedResponse.id)}&chs=200x200&chld=L|0`;
        normalizedResponse.pixCode = normalizedResponse.id;
        console.log('QR Code gerado a partir do ID da transação:', normalizedResponse.id);
      }
    } else if (pixCode && !qrCodeUrl) {
      // Se temos o código PIX mas não temos a URL do QR code, gerar uma
      normalizedResponse.qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=200x200&chld=L|0`;
      console.log('QR Code gerado a partir do código PIX usando Google Charts');
    }

    // Log final da resposta normalizada
    console.log('✅ Transação PIX criada com sucesso!');
    console.log('Dados normalizados:', JSON.stringify(normalizedResponse, null, 2));
    
    return normalizedResponse;

  } catch (error: any) {
    console.error('❌ Erro ao criar transação PIX:', error);
    
    if (error instanceof PixApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new PixApiError('Erro de conexão com a API. Verifique sua conexão com a internet.');
    }
    
    throw new PixApiError(`Erro inesperado: ${error.message}`);
  }
}

// Função auxiliar para converter valor em reais para centavos
export function convertToCents(value: number): number {
  return Math.round(value * 100);
}

// Função auxiliar para converter centavos para reais
export function convertToReais(cents: number): number {
  return cents / 100;
}

// Função auxiliar para formatar valor monetário
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Exportar classes de erro
export { PixApiError }; 