import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Check, Loader2, RefreshCw, Clock, Bell, ShieldCheck, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PixTransactionResponse } from "@/services/pixService";
import { toast } from "@/components/ui/sonner";
import { QRCodeSVG } from "qrcode.react";
import { PixStatusService } from "@/services/pixStatusService";
import { useUtm } from "@/hooks/useUtm";
import { CheckoutFormData, CartItem } from "@/types/checkout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { trackPixGenerated } from '@/services/facebookPixelService';

// Adicionar estilo CSS para animação de shake
const shakeAnimation = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;

interface PixPaymentProps {
  pixData: PixTransactionResponse | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  checkoutData?: CheckoutFormData;
  cartItems?: CartItem[];
  totalPrice?: number;
  onPaymentConfirmed?: () => void;
}

// Dados simulados para prova social
const FAKE_RECENT_PAYMENTS = [
  { name: "João S.", time: "há 32s" },
  { name: "Maria L.", time: "há 1m" },
  { name: "Carlos R.", time: "há 2m" },
  { name: "Ana P.", time: "há 3m" },
  { name: "Pedro M.", time: "há 4m" },
  { name: "Lucia F.", time: "há 5m" },
  { name: "Roberto A.", time: "há 6m" },
  { name: "Fernanda S.", time: "há 7m" },
  { name: "Marcos T.", time: "há 8m" },
  { name: "Julia C.", time: "há 9m" },
];

export function PixPayment({ 
  pixData, 
  isLoading, 
  error, 
  onRetry, 
  checkoutData,
  cartItems,
  totalPrice,
  onPaymentConfirmed 
}: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [qrCodeError, setQrCodeError] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'waiting_payment' | 'paid' | 'expired'>('waiting_payment');
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<number>(Math.floor(Math.random() * 20) + 15); // 15-35 usuários ativos
  const [recentPaymentIndex, setRecentPaymentIndex] = useState<number>(0);
  const timerRef = useRef<HTMLDivElement>(null);
  const utm = useUtm();

  // Log detalhado dos dados recebidos
  useEffect(() => {
    if (pixData) {
      console.log('Dados PIX recebidos no componente:', JSON.stringify(pixData, null, 2));
      
      // Verificar se temos um código PIX válido
      const pixCode = getPixCode();
      if (pixCode === "Código PIX indisponível") {
        console.error('Não foi possível encontrar um código PIX válido');
        setQrCodeError(true);
      } else {
        console.log('Código PIX encontrado:', pixCode.substring(0, 50) + '...');
        setQrCodeError(false);
        // Disparar evento PixGenerated do Facebook Pixel
        if (checkoutData && cartItems && totalPrice) {
          trackPixGenerated({
            content_type: 'product',
            content_ids: cartItems.map(item => item.id),
            contents: cartItems.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.finalPrice })),
            currency: 'BRL',
            value: totalPrice,
            num_items: cartItems.length,
            customer_name: checkoutData.nome,
            customer_phone: checkoutData.telefone,
            utm: utm.getAllUtmParams(),
            pix_transaction_id: pixData.id,
            status: 'generated',
          }, utm.getAllUtmParams());
        }
      }
      
      // Adicionar transação para monitoramento se temos todos os dados necessários
      if (pixData.id && checkoutData && cartItems && totalPrice) {
        // Capturar os parâmetros UTM uma única vez fora do ciclo de re-renderização
        const utmParams = utm.getAllUtmParams();
        
        PixStatusService.addPendingTransaction({
          pixTransactionId: pixData.id,
          checkoutData,
          cartItems,
          totalPrice,
          utmParams,
          createdAt: new Date().toISOString(),
          attempts: 0
        });
      }
    }
  }, [pixData, checkoutData, cartItems, totalPrice]);

  // Calcular tempo restante quando o QR code for gerado
  useEffect(() => {
    if (!pixData?.expiresAt) return;
    
    // Converter para timestamp
    const expirationDate = new Date(pixData.expiresAt).getTime();
    const now = new Date().getTime();
    
    // Limitar o tempo máximo para 5 minutos (300000 ms), independente do que vier do servidor
    const maxExpirationTime = now + (5 * 60 * 1000); // 5 minutos em milissegundos
    const actualExpirationTime = Math.min(expirationDate, maxExpirationTime);
    
    const updateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const difference = actualExpirationTime - currentTime;
      
      if (difference <= 0) {
        setTimeLeft(0);
        setPaymentStatus('expired');
        return;
      }
      
      setTimeLeft(Math.floor(difference / 1000));
      
      // Efeito de shake no timer quando < 2 minutos
      if (difference < 120000 && timerRef.current) {
        timerRef.current.classList.add('animate-shake');
        setTimeout(() => {
          if (timerRef.current) {
            timerRef.current.classList.remove('animate-shake');
          }
        }, 1000);
      }
    };
    
    // Atualizar tempo restante inicialmente
    updateTimeLeft();
    
    // Atualizar a cada segundo
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [pixData?.expiresAt]);

  // Verificação automática frequente do status
  useEffect(() => {
    if (!pixData?.id || paymentStatus !== 'waiting_payment') return;
    
    const checkPaymentStatus = async () => {
      try {
        const status = await PixStatusService.checkTransactionStatus(pixData.id);
        
        if (status === 'paid') {
          setPaymentStatus('paid');
          
          // Chamar callback de pagamento confirmado
          if (onPaymentConfirmed) {
            onPaymentConfirmed();
          }
        } else if (status === 'expired') {
          setPaymentStatus('expired');
        }
      } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
      }
    };
    
    // Verificar a cada 3 segundos
    const interval = setInterval(checkPaymentStatus, 3000);
    return () => clearInterval(interval);
  }, [pixData?.id, paymentStatus, onPaymentConfirmed]);

  // Simular usuários ativos e pagamentos recentes
  useEffect(() => {
    // Atualizar número de usuários ativos aleatoriamente
    const userInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 a +2
        return Math.max(15, Math.min(40, prev + change)); // Manter entre 15-40
      });
    }, 5000);
    
    // Rotacionar pagamentos recentes
    const paymentInterval = setInterval(() => {
      setRecentPaymentIndex(prev => (prev + 1) % FAKE_RECENT_PAYMENTS.length);
    }, 3000);
    
    return () => {
      clearInterval(userInterval);
      clearInterval(paymentInterval);
    };
  }, []);

  // Listener para evento de pagamento aprovado
  useEffect(() => {
    const handlePaymentApproved = (event: CustomEvent) => {
      const { transactionId } = event.detail;
      
      // Verificar se é a transação atual
      if (pixData?.id === transactionId) {
        console.log('✅ Pagamento PIX aprovado detectado:', transactionId);
        setPaymentStatus('paid');
        
        // Chamar callback de pagamento confirmado
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      }
    };
    
    // Adicionar listener para o evento personalizado
    window.addEventListener('pix-payment-approved', handlePaymentApproved as EventListener);
    
    // Remover listener ao desmontar
    return () => {
      window.removeEventListener('pix-payment-approved', handlePaymentApproved as EventListener);
    };
  }, [pixData?.id, onPaymentConfirmed]);

  // Formatar o tempo restante em mm:ss
  const formatTimeLeft = () => {
    if (timeLeft === null) return "--:--";
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return [
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  // Função para copiar o código PIX
  const handleCopyPix = () => {
    const pixCodeValue = getPixCode();
    
    if (pixCodeValue === "Código PIX indisponível") {
      toast.error("Não foi possível encontrar o código PIX");
      return;
    }
    
    navigator.clipboard.writeText(pixCodeValue);
    setCopied(true);
    toast("✅ Código PIX copiado!", {
      description: "Cole o código no seu app de banco para pagar em segundos!"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Função para obter o código PIX de diferentes locais da estrutura
  const getPixCode = (): string => {
    if (!pixData) return "Código PIX indisponível";
    
    // Verificar em diferentes locais possíveis
    const possibleLocations = [
      pixData.pixCode,
      pixData.pix?.code,
      pixData.pix?.pixCode,
      pixData.pix?.qrcode
    ];
    
    // Retornar o primeiro valor não nulo/undefined
    for (const location of possibleLocations) {
      if (location) return location;
    }
    
    return "Código PIX indisponível";
  };
  
  // Função para verificar manualmente o status do pagamento
  const handleCheckStatus = async () => {
    if (!pixData?.id) return;
    
    setIsCheckingStatus(true);
    
    try {
      const status = await PixStatusService.checkTransactionStatus(pixData.id);
      
      if (status === 'paid') {
        setPaymentStatus('paid');
        
        // Chamar callback de pagamento confirmado
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      } else if (status === 'expired') {
        setPaymentStatus('expired');
      }
      
      toast.info(`Status do pagamento: ${status === 'paid' ? '✅ APROVADO' : status === 'expired' ? '⏰ EXPIRADO' : '⏳ AGUARDANDO'}`);
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      toast.error("Erro ao verificar status do pagamento");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Função para simular que já pagou
  const handleAlreadyPaid = () => {
    toast("Verificando pagamento...", {
      description: "Estamos confirmando seu pagamento, aguarde alguns segundos."
    });
    
    setIsCheckingStatus(true);
    
    // Simular verificação
    setTimeout(() => {
      handleCheckStatus();
    }, 2000);
  };
  
  // Renderizar estados diferentes
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
        <h3 className="text-lg font-medium mb-2">Gerando Pagamento PIX</h3>
        <p className="text-muted-foreground">
          Preparando seu código PIX para pagamento rápido...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-destructive/10 rounded-full p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-medium mb-2">Erro ao gerar o PIX</h3>
        <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
          {error}
        </p>
        <Button onClick={onRetry} variant="default" size="lg" className="font-bold">
          TENTAR NOVAMENTE
        </Button>
      </div>
    );
  }

  if (!pixData) {
    return null;
  }
  
  // Se o pagamento foi aprovado, mostrar mensagem de sucesso
  if (paymentStatus === 'paid') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <div className="flex flex-col items-center text-center py-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 rounded-full p-4 mb-4"
          >
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </motion.div>
          <AlertTitle className="text-2xl font-bold mb-2 text-green-700">
            PAGAMENTO APROVADO!
          </AlertTitle>
          <AlertDescription className="text-green-600 text-lg">
            Seu pagamento foi confirmado com sucesso! 🎉
          </AlertDescription>
        </div>
      </Alert>
    );
  }
  
  // Se o pagamento expirou
  if (paymentStatus === 'expired') {
    return (
      <Alert className="bg-red-50 border-red-200">
        <div className="flex flex-col items-center text-center py-6">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <AlertTitle className="text-2xl font-bold mb-2 text-red-700">
            OFERTA EXPIRADA!
          </AlertTitle>
          <AlertDescription className="text-red-600 mb-4 text-lg">
            O tempo para pagamento acabou. Gere um novo PIX para garantir sua compra!
          </AlertDescription>
          <Button onClick={onRetry} size="lg" className="font-bold bg-red-600 hover:bg-red-700 text-white">
            GERAR NOVO PIX AGORA
          </Button>
        </div>
      </Alert>
    );
  }

  // Obter o código PIX para o QR code
  const pixCodeForQR = getPixCode();
  const hasValidPixCode = pixCodeForQR !== "Código PIX indisponível";
  const isAlmostExpiring = timeLeft !== null && timeLeft < 300; // Menos de 5 minutos

  return (
    <>
      <style>{shakeAnimation}</style>
      <Card className="border-0 shadow-lg">
      {/* Timer em destaque */}
      <div 
        ref={timerRef}
        className={`w-full py-3 text-center bg-amber-500 text-white rounded-t-lg`}
      >
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="text-lg font-bold">⏰ OFERTA EXPIRA EM:</span>
          <span className="text-2xl font-bold tabular-nums">{formatTimeLeft()}</span>
        </div>
      </div>

      <CardHeader className="pt-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 1.5 
            }}
          >
            <Badge variant="outline" className="mb-2 bg-red-50 text-red-600 border-red-200 px-3 py-1 text-sm">
              🔥 {activeUsers} PESSOAS PAGANDO AGORA
            </Badge>
          </motion.div>
          <CardTitle className="text-2xl font-bold">⚡ PAGAMENTO INSTANTÂNEO</CardTitle>
          <p className="text-amber-600 font-medium mt-1">
            Pague em 30 segundos e garanta sua compra!
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex flex-col items-center">
          <motion.div 
            className="bg-white p-4 rounded-lg border-4 border-amber-400 shadow-lg mb-4"
            animate={{ 
              boxShadow: ['0px 0px 0px rgba(245, 158, 11, 0.2)', '0px 0px 20px rgba(245, 158, 11, 0.6)', '0px 0px 0px rgba(245, 158, 11, 0.2)'],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 
            }}
          >
            {!hasValidPixCode || qrCodeError ? (
              <div className="w-[250px] h-[250px] flex items-center justify-center bg-muted">
                <p className="text-sm text-muted-foreground text-center px-4">
                  Não foi possível carregar o QR code. Use o código PIX abaixo.
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <QRCodeSVG 
                  value={pixCodeForQR}
                  size={250}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={true}
                />
              </div>
            )}
          </motion.div>

          {/* Botão Copiar PIX */}
          <div className="w-full mb-4">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6"
              onClick={handleCopyPix}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  CÓDIGO COPIADO
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 mr-2" />
                  COPIAR CÓDIGO PIX
                </>
              )}
            </Button>
            
            <div className="relative mt-3">
              <div className="bg-gray-100 p-3 rounded-md text-xs break-all border border-gray-300">
                {getPixCode()}
              </div>
            </div>
          </div>
          
          {/* Botão Já Paguei */}
          <Button 
            variant="outline" 
            size="lg"
            className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-bold text-lg py-6 mb-4"
            onClick={handleAlreadyPaid}
            disabled={isCheckingStatus}
          >
            {isCheckingStatus ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                VERIFICANDO PAGAMENTO...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                JÁ PAGUEI
              </>
            )}
          </Button>
        </div>
        
        {/* Prova Social */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-bold text-center mb-3 text-gray-800">
            ✅ ÚLTIMOS PAGAMENTOS APROVADOS
          </h4>
          <div className="space-y-2 max-h-[120px] overflow-y-auto">
            <AnimatePresence>
              {FAKE_RECENT_PAYMENTS.slice(0, 5).map((payment, i) => (
                <motion.div 
                  key={i}
                  className={`flex items-center justify-between p-2 rounded ${i === 0 ? 'bg-green-50 border border-green-100' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
                    <span className="font-medium">{payment.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{payment.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Elementos de Confiança */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center bg-blue-50 p-3 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <span className="text-xs font-medium text-blue-700">🔒 Pagamento 100% Seguro</span>
          </div>
          <div className="flex items-center bg-green-50 p-3 rounded-lg">
            <Zap className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
            <span className="text-xs font-medium text-green-700">✅ Aprovação Instantânea</span>
          </div>
          <div className="flex items-center bg-amber-50 p-3 rounded-lg">
            <Bell className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
            <span className="text-xs font-medium text-amber-700">📱 Pix Oficial Banco Central</span>
          </div>
          <div className="flex items-center bg-purple-50 p-3 rounded-lg">
            <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
            <span className="text-xs font-medium text-purple-700">💳 Sem Taxas Adicionais</span>
          </div>
        </div>
        
        {/* Como pagar - Versão simplificada */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h4 className="font-bold mb-2 text-center">PAGUE EM 3 PASSOS SIMPLES:</h4>
          <ol className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className="bg-amber-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 flex-shrink-0">1</span>
              <span>Abra o app do seu banco e escolha <strong>pagar com PIX</strong></span>
            </li>
            <li className="flex items-center">
              <span className="bg-amber-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 flex-shrink-0">2</span>
              <span>Escaneie o QR code ou <strong>cole o código copiado</strong></span>
            </li>
            <li className="flex items-center">
              <span className="bg-amber-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 flex-shrink-0">3</span>
              <span>Confirme o pagamento e <strong>clique em "JÁ PAGUEI"</strong></span>
            </li>
          </ol>
        </div>
      </CardContent>
      
      {/* Alerta de última chance */}
      {isAlmostExpiring && (
        <CardFooter className="bg-red-50 p-4 border-t border-red-200">
          <div className="w-full text-center">
            <p className="text-red-600 font-bold text-lg">
              🚨 ATENÇÃO: SUA OFERTA ESTÁ QUASE EXPIRANDO!
            </p>
            <p className="text-red-500 text-sm">
              Pague agora para não perder esta oportunidade!
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
    </>
  );
} 