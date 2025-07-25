// API serverless para o Facebook Conversions API (compatível com Vercel)
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responder às solicitações OPTIONS sem processar
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Verificar se é uma solicitação POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  
  // Log para depuração
  console.log(`[FB API] Recebendo solicitação ${req.method}`);
  
  try {
    // Dados do evento
    const data = req.body;
    console.log(`[FB API] Evento recebido: ${data.eventName}`, data);
    
    // Em um cenário real, aqui você enviaria para a API do Facebook
    // Para teste, apenas simulamos o sucesso
    const responseData = {
      success: true,
      event_id: `ev_${Date.now()}`,
      message: `Evento ${data.eventName} processado com sucesso`
    };
    
    // Responder com sucesso
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error(`[FB API] Erro:`, error);
    return res.status(500).json({
      success: false,
      message: `Erro ao processar evento: ${error.message}`
    });
  }
} 