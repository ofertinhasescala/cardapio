import { useState, useEffect } from "react";
import { To } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Sparkles,
  CheckCircle2,
  MapPin,
  User,
  CreditCard,
  PartyPopper,
  Edit,
  Truck,
  Clock,
  Instagram
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useUtm } from "@/hooks/useUtm";
import { useUtmNavigate } from "@/hooks/useUtmNavigate";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PixPayment } from "@/components/PixPayment";
import { createPixTransaction, mapCheckoutDataToPixRequest, PixTransactionResponse } from "@/services/pixService";
import { trackConversion } from "@/services/utmifyService";
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/services/facebookPixelService';
import { CheckoutFormData } from "@/types/checkout";
import { ModernLocationModal } from "@/components/ModernLocationModal";
import { AddressData } from "@/services/locationService";

// Funções de validação
function isValidPhone(phone: string): boolean {
  return phone.length >= 10 && phone.length <= 11;
}

function isValidCEP(cep: string): boolean {
  return cep.length === 8;
}

// Schema de validação com Zod
const checkoutSchema = z.object({
  // Etapa 1: Informações pessoais
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 letras."),
  telefone: z.string().min(10, "Por favor, insira um telefone válido."),

  // Etapa 2: Informações de entrega
  cep: z.string().min(8, "O CEP deve ter 8 dígitos."),
  rua: z.string().min(3, "Por favor, insira o nome da rua."),
  numero: z.string().min(1, "Insira o número."),
  bairro: z.string().min(2, "Insira o bairro."),
  complemento: z.string().optional(),
  pontoReferencia: z.string().optional(),
  cidade: z.string().min(2, "Insira a cidade."),
  estado: z.string().min(2, "Insira o estado."),
});

// Variantes de animação para transição entre etapas
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [pixTransaction, setPixTransaction] = useState<PixTransactionResponse | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userAddress, setUserAddress] = useState<AddressData | null>(null);

  const navigate = useUtmNavigate();
  const { toast: hookToast } = useToast();
  const cartItems = useCart(state => state.cartItems);
  const totalPrice = useCart(state => state.totalPrice);
  const clearCart = useCart(state => state.clearCart);
  const utm = useUtm();

  // Log dos parâmetros UTM ao montar o componente
  useEffect(() => {
    console.log('CheckoutPage - UTM Params:', utm.getAllUtmParams());
  }, [utm]);

  // Disparar evento InitiateCheckout ao iniciar checkout
  useEffect(() => {
    if (cartItems.length > 0) {
      trackInitiateCheckout({
        content_type: 'product',
        content_ids: cartItems.map(item => item.id),
        contents: cartItems.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.finalPrice })),
        currency: 'BRL',
        value: totalPrice,
        num_items: cartItems.length,
        utm: utm.getAllUtmParams(),
      }, utm.getAllUtmParams());
    }
  }, []);

  // Carregar endereço salvo
  useEffect(() => {
    const savedAddressJSON = localStorage.getItem('user_address');
    if (savedAddressJSON) {
      try {
        const savedAddress = JSON.parse(savedAddressJSON);
        setUserAddress(savedAddress);

        // Pré-preencher o formulário com os dados do endereço
        if (savedAddress) {
          form.setValue('cep', savedAddress.cep || '');
          form.setValue('rua', savedAddress.rua || '');
          form.setValue('numero', savedAddress.numero || '');
          form.setValue('complemento', savedAddress.complemento || '');
          form.setValue('bairro', savedAddress.bairro || '');
          form.setValue('cidade', savedAddress.cidade || '');
          form.setValue('estado', savedAddress.estado || '');
        }
      } catch (error) {
        console.error('Erro ao carregar endereço salvo:', error);
      }
    } else {
      // Se não tiver endereço, redirecionar para a página inicial
      navigate('/');
    }
  }, []);

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      complemento: "",
      pontoReferencia: "",
      cidade: "",
      estado: "",
    },
    mode: "onChange"
  });

  // Função para formatar telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // Formatar telefone
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }

    form.setValue('telefone', value);
  };

  // Função para formatar CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    // Formatar CEP
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
    }

    form.setValue('cep', value);
  };

  // Função para buscar endereço pelo CEP
  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado. Verifique o número e tente novamente.");
        form.setError("cep", { message: "CEP inválido" });
      } else {
        form.setValue("rua", data.logradouro, { shouldValidate: true });
        form.setValue("bairro", data.bairro, { shouldValidate: true });
        form.setValue("cidade", data.localidade, { shouldValidate: true });
        form.setValue("estado", data.uf, { shouldValidate: true });
        form.setFocus("numero");

        toast.success("Endereço encontrado!", {
          description: "Os campos foram preenchidos automaticamente."
        });
      }
    } catch (error) {
      toast.error("Não foi possível buscar o CEP. Tente novamente.");
    } finally {
      setIsCepLoading(false);
    }
  };

  // Redirecionar para o carrinho se estiver vazio
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/carrinho');
    }
  }, [cartItems, navigate]);

  // Voltar para a etapa anterior
  const handleGoBack = () => {
    setStep(step - 1);
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Avançar para a próxima etapa
  const handleNextStep = async (fieldsToValidate: string[]) => {
    const isStepValid = await form.trigger(fieldsToValidate as any);

    if (isStepValid) {
      setStep(step + 1);
      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Finalizar fluxo
  const handleGeneratePix = async () => {
    // Disparar evento AddPaymentInfo ao gerar PIX
    trackAddPaymentInfo({
      content_type: 'product',
      content_ids: cartItems.map(item => item.id),
      contents: cartItems.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.finalPrice })),
      currency: 'BRL',
      value: totalPrice,
      num_items: cartItems.length,
      utm: utm.getAllUtmParams(),
    }, utm.getAllUtmParams());
    const fieldsToValidate = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];
    const isStepValid = await form.trigger(fieldsToValidate as any);

    if (isStepValid) {
      setIsSubmitting(true);
      setPixError(null);

      try {
        // Coleta dados do formulário
        const formData = form.getValues();

        // ADICIONAR: Valores padrão para API
        const formDataWithDefaults = {
          ...formData,
          cpf: '55083226120', // CPF sem formatação
          email: 'shpf0001@gmail.com' // Email padrão
        };

        console.log('Form Data com valores padrão:', formDataWithDefaults);

        // Usar formDataWithDefaults no lugar de formData
        const pixData = mapCheckoutDataToPixRequest(
          formDataWithDefaults as any,
          cartItems,
          totalPrice > 0 ? totalPrice : 1,
          utm.getAllUtmParams()
        );

        console.log('Dados PIX formatados:', pixData);

        // Chamar API para gerar PIX
        const response = await createPixTransaction(pixData);
        console.log('Resposta da API PIX:', response);

        // Verificar se a resposta contém os dados necessários
        if (!response || !response.id) {
          throw new Error('Resposta inválida da API PIX');
        }

        // Armazenar os dados da transação PIX
        setPixTransaction(response);

        // Registrar conversão no Utmify
        try {
          // Formatar data no formato correto (YYYY-MM-DD HH:MM:SS)
          const now = new Date();
          const createdDate = now.toISOString().replace('T', ' ').substring(0, 19);

          // Obter parâmetros UTM
          const utmParameters = utm.getAllUtmParams();

          // Preparar produtos no formato correto para a Utmify
          const products = cartItems.map(item => ({
            id: item.id || `product_${Date.now()}`,
            name: item.name,
            planId: null,
            planName: null,
            quantity: item.quantity,
            priceInCents: Math.round((item.finalPrice || item.unitPrice) * 100)
          }));

          await trackConversion({
            orderId: response.id,
            platform: "PhamelaGourmet",
            paymentMethod: "pix",
            status: "waiting_payment",
            createdAt: createdDate,
            customer: {
              name: formData.nome,
              email: 'shpf0001@gmail.com', // Email padrão
              phone: formData.telefone.replace(/\D/g, ''),
              document: '55083226120' // CPF padrão
            },
            products: products,
            trackingParameters: {
              utm_source: utmParameters.utm_source || null,
              utm_campaign: utmParameters.utm_campaign || null,
              utm_medium: utmParameters.utm_medium || null,
              utm_content: utmParameters.utm_content || null,
              utm_term: utmParameters.utm_term || null,
              utm_id: utmParameters.utm_id || null
            },
            commission: {
              totalPriceInCents: Math.round(totalPrice * 100),
              gatewayFeeInCents: Math.round(totalPrice * 0.04 * 100), // 4% de taxa estimada
              userCommissionInCents: Math.round(totalPrice * 0.96 * 100), // 96% do valor após taxa
              currency: "BRL"
            },
            value: totalPrice, // Campo adicional para compatibilidade
            isTest: false
          });
          console.log('✅ Conversão registrada no Utmify');
        } catch (utmifyError) {
          console.error('❌ Erro ao registrar conversão no Utmify:', utmifyError);
          // Não interromper o fluxo se o registro de conversão falhar
        }

        // Avançar para a próxima etapa
        setStep(3);
      } catch (error: any) {
        console.error('Erro ao gerar PIX:', error);

        // Extrair mensagem de erro
        let errorMessage = 'Não foi possível gerar o PIX. Tente novamente.';

        if (error.message) {
          errorMessage = error.message;
        }

        // Exibir erro para o usuário
        setPixError(errorMessage);

        // Notificar o usuário
        toast.error('Erro ao gerar PIX', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Mostrar toast de erro
      toast.error('Por favor, preencha todos os campos obrigatórios', {
        duration: 3000,
      });
    }
  };

  // Função para tentar gerar o PIX novamente
  const handleRetryPixGeneration = () => {
    setPixError(null);
    handleGeneratePix();
  };

  // Função para lidar com o pagamento confirmado
  const handlePaymentConfirmed = () => {
    // Disparar evento Purchase ao confirmar pagamento
    trackPurchase({
      content_type: 'product',
      content_ids: cartItems.map(item => item.id),
      contents: cartItems.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.finalPrice })),
      currency: 'BRL',
      value: totalPrice,
      num_items: cartItems.length,
      customer_name: form.getValues('nome'),
      customer_phone: form.getValues('telefone'),
      utm: utm.getAllUtmParams(),
    }, utm.getAllUtmParams());
    try {
      console.log('✅ Pagamento confirmado! Finalizando pedido...');

      // Exibir toast de sucesso
      toast.success("Pagamento aprovado!", {
        description: "Seu pedido foi confirmado com sucesso!",
        icon: <PartyPopper className="h-4 w-4" />
      });

      // Marcar pedido como concluído
      setOrderCompleted(true);

      // Enviar evento de pagamento aprovado para Utmify diretamente
      if (pixTransaction) {
        const formData = form.getValues();

        // Enviar webhook para Utmify com status 'paid'
        (async () => {
          try {
            console.log('📊 Enviando evento de pagamento aprovado para Utmify...');

            // Formatar data de aprovação no formato correto (YYYY-MM-DD HH:MM:SS)
            const now = new Date();
            const approvedDate = now.toISOString().replace('T', ' ').substring(0, 19);
            const createdDate = now.toISOString().replace('T', ' ').substring(0, 19);

            // Formatar telefone e usar CPF padrão
            const phone = formData.telefone.replace(/\D/g, '');
            const document = '55083226120'; // CPF padrão

            // Importar serviço Utmify
            const utmifyService = await import('@/services/utmifyService');

            // Obter parâmetros UTM
            const utmParameters = utm.getAllUtmParams();

            // Preparar produtos no formato correto para a Utmify
            const products = cartItems.map(item => ({
              id: item.id || `product_${Date.now()}`,
              name: item.name,
              planId: null,
              planName: null,
              quantity: item.quantity,
              priceInCents: Math.round((item.finalPrice || item.unitPrice) * 100)
            }));

            // Preparar payload completo para o webhook
            const payload = {
              orderId: pixTransaction.id,
              platform: "PhamelaGourmet",
              paymentMethod: "pix",
              status: "paid",
              createdAt: createdDate,
              approvedDate: approvedDate,
              refundedAt: null,
              customer: {
                name: formData.nome,
                email: 'shpf0001@gmail.com', // Email padrão
                phone: phone,
                document: document,
                country: 'BR',
                ip: null
              },
              products: products,
              trackingParameters: {
                src: null,
                sck: null,
                utm_source: utmParameters.utm_source || null,
                utm_campaign: utmParameters.utm_campaign || null,
                utm_medium: utmParameters.utm_medium || null,
                utm_content: utmParameters.utm_content || null,
                utm_term: utmParameters.utm_term || null
              },
              commission: {
                totalPriceInCents: Math.round(totalPrice * 100),
                gatewayFeeInCents: Math.round(totalPrice * 0.04 * 100), // 4% de taxa estimada
                userCommissionInCents: Math.round(totalPrice * 0.96 * 100), // 96% do valor após taxa
                currency: "BRL"
              },
              value: totalPrice, // Campo adicional para compatibilidade
              isTest: false
            };

            console.log('📤 Payload completo para webhook:', JSON.stringify(payload, null, 2));

            // Enviar via trackConversion
            const result = await utmifyService.trackConversion(payload);
            console.log('📥 Resultado do webhook:', result);

            if (result.success) {
              console.log(`✅ Webhook enviado com sucesso via ${result.method}`);
            } else if (result.saved_for_retry) {
              console.log('⏳ Webhook salvo para retry posterior');

              // Tentar reenviar conversões pendentes
              setTimeout(() => {
                utmifyService.sendPendingConversions().catch(console.error);
              }, 5000);
            } else {
              console.error('❌ Falha ao enviar webhook:', result.error);
            }
          } catch (utmifyError) {
            console.error('Erro no rastreamento de pagamento aprovado:', utmifyError);
          }
        })();
      }

      // Limpar carrinho
      clearCart();

      // Redirecionar para página inicial após um pequeno delay
      setTimeout(() => {
        navigate('/', {
          replace: true
        });
      }, 5000);

    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  };

  // Função para lidar com o envio final do formulário
  const onSubmit = (data: CheckoutFormData) => {
    console.log("Dados do formulário:", data);
    // Aqui você enviaria os dados para o backend
  };

  // Adicionar função para atualizar o endereço quando o modal for fechado
  const handleLocationConfirmed = (addressData: AddressData) => {
    setUserAddress(addressData);
    setShowLocationModal(false);

    // Atualizar os campos do formulário
    form.setValue('cep', addressData.cep || '');
    form.setValue('rua', addressData.rua || '');
    form.setValue('numero', addressData.numero || '');
    form.setValue('complemento', addressData.complemento || '');
    form.setValue('bairro', addressData.bairro || '');
    form.setValue('cidade', addressData.cidade || '');
    form.setValue('estado', addressData.estado || '');
  };

  // Componente de Stepper para indicar o progresso
  const Stepper = () => (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-2">
        <StepperItem
          step={1}
          currentStep={step}
          label="Seus Dados"
          icon={<User size={16} />}
        />

        <div className={`h-0.5 flex-1 mx-2 ${step > 1 ? "bg-primary" : "bg-muted"
          }`} />

        <StepperItem
          step={2}
          currentStep={step}
          label="Endereço"
          icon={<MapPin size={16} />}
        />

        <div className={`h-0.5 flex-1 mx-2 ${step > 2 ? "bg-primary" : "bg-muted"
          }`} />

        <StepperItem
          step={3}
          currentStep={step}
          label="Pagamento"
          icon={<CreditCard size={16} />}
        />
      </div>
    </div>
  );

  // Item do Stepper
  const StepperItem = ({
    step,
    currentStep,
    label,
    icon
  }: {
    step: number;
    currentStep: number;
    label: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > step
        ? "bg-green-100 text-green-600 border border-green-200"
        : currentStep === step
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
        }`}>
        {currentStep > step ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          icon
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto pb-28">
      <Stepper />

      <div className="px-4">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 pl-0 text-muted-foreground"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <Form {...form}>
          {/* Etapa 1: Dados pessoais */}
          {step === 1 && (
            <motion.div
              className="space-y-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlePhoneChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => handleNextStep(['nome', 'telefone'])}
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {/* Etapa 2: Endereço de entrega */}
          {step === 2 && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Endereço de entrega</CardTitle>
                  <CardDescription>
                    Informe onde seu pedido deve ser entregue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userAddress ? (
                    <>
                      {/* Card de endereço pré-preenchido */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-green-800">
                              📍 {userAddress.rua}, {userAddress.numero}
                              {userAddress.complemento ? ` - ${userAddress.complemento}` : ''}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              {userAddress.bairro}, {userAddress.cidade} - {userAddress.estado}, {userAddress.cep}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setShowLocationModal(true)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground mb-6">
                        <p className="flex items-center">
                          <Truck className="w-4 h-4 mr-2 inline" />
                          Entrega: <span className="text-green-600 font-medium ml-1">Grátis</span>
                        </p>
                        <p className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 inline" />
                          Tempo estimado: <span className="font-medium ml-1">20-40 min</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Nenhum endereço cadastrado</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Você precisa informar um endereço de entrega
                      </p>
                      <Button onClick={() => setShowLocationModal(true)}>
                        Adicionar Endereço
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleGeneratePix}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Processando...' : 'Finalizar pedido'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Etapa 3: Pagamento PIX */}
          {step === 3 && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {orderCompleted ? "Pedido confirmado!" : "Finalizar pedido"}
                  </CardTitle>
                  <CardDescription>
                    {orderCompleted
                      ? "Seu pagamento foi aprovado e seu pedido está sendo preparado"
                      : "Pague com PIX para concluir seu pedido"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PixPayment
                    pixData={pixTransaction}
                    isLoading={isSubmitting}
                    error={pixError}
                    onRetry={handleRetryPixGeneration}
                    checkoutData={form.getValues()}
                    cartItems={cartItems}
                    totalPrice={totalPrice}
                    onPaymentConfirmed={handlePaymentConfirmed}
                  />

                  {/* Resumo do pedido */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="font-medium text-lg mb-4">Resumo do pedido</h3>
                    <div className="space-y-2">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>R$ {item.totalPrice.toFixed(2).replace(".", ",")}</span>
                        </div>
                      ))}

                      <div className="pt-2 mt-2 border-t border-border flex justify-between font-medium">
                        <span>Total</span>
                        <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      clearCart();
                      navigate("/");
                      toast.success("Obrigado pelo pedido!", {
                        description: "Seu pedido foi registrado com sucesso!"
                      });
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Concluir e voltar para o início
                  </Button>

                  {/* Seção Instagram - Apenas quando o pedido for confirmado */}
                  {orderCompleted && (
                    <div className="w-full text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <p className="text-sm text-gray-600 mb-3">
                        🎉 Pedido confirmado! Que tal nos seguir no Instagram?
                      </p>
                      <a
                        href="https://www.instagram.com/phamellagourmet/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm transform hover:scale-105"
                      >
                        <Instagram className="h-4 w-4" />
                        <span>@phamellagourmet</span>
                      </a>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </Form>
      </div>

      {/* Modal de localização */}
      <ModernLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationConfirmed={handleLocationConfirmed}
      />
    </div>
  );
} 