import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from "react-router-dom";
import { LocationProvider } from "./hooks/LocationContext";
import { useUtm } from "./hooks/useUtm";
import { useEffect, useRef } from "react";
import { sendPendingConversions, checkUtmifyStatus } from "./services/utmifyService";
import { toast } from "@/components/ui/sonner";
import { UtmNavigation } from "./components/UtmNavigation";
import { UtmDebugger } from "./components/UtmDebugger";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Menu from "./pages/Menu";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient();

// Componente para capturar e sincronizar parâmetros UTM em todas as páginas
const UtmCapture = () => {
  const utm = useUtm();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isInitializedRef = useRef(false);
  
  // Efeito para capturar UTM params da URL atual
  useEffect(() => {
    // Evitar processamento desnecessário em re-renders
    if (isInitializedRef.current) {
      return;
    }
    
    try {
      isInitializedRef.current = true;
      
      // Log dos parâmetros UTM atuais
      const currentUtmParams = utm.getAllUtmParams();
      console.log("UtmCapture - Current route:", location.pathname);
      console.log("UTM Params em store:", currentUtmParams);
      
      // Verificar parâmetros UTM na URL atual
      const urlUtmParams: Record<string, string> = {};
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
      
      utmKeys.forEach(key => {
        const value = searchParams.get(key);
        if (value) {
          urlUtmParams[key] = value;
        }
      });
      
      if (Object.keys(urlUtmParams).length > 0) {
        console.log("UTM Params na URL atual:", urlUtmParams);
      }
    } catch (error) {
      console.error("Erro ao processar UTM params:", error);
    }
  }, [location.pathname, searchParams, utm]);
  
  // Efeito para verificar e reenviar conversões pendentes
  useEffect(() => {
    // Verificar e reenviar conversões pendentes após um delay
    const timeoutId = setTimeout(async () => {
      try {
        // Verificar se há conversões pendentes e tentar reenviar
        const pendingConversions = JSON.parse(
          localStorage.getItem('utmify_pending_conversions') || '[]'
        );
        
        if (pendingConversions.length > 0) {
          console.log(`Tentando reenviar ${pendingConversions.length} conversões pendentes...`);
          const result = await sendPendingConversions();
          
          console.log("Resultado do reenvio:", result);
          
          if (result.success > 0) {
            toast.success(`${result.success} conversões reenviadas com sucesso`);
          }
          
          if (result.remaining > 0) {
            console.warn(`${result.remaining} conversões ainda pendentes`);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar conversões pendentes:", error);
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
  
  return null;
};

// Adicionar tipagem para o objeto utmify global
declare global {
  interface Window {
    utmify?: {
      conversion: (data: any) => void;
    };
    utmifyDebug?: {
      loaded: boolean;
      pageLoaded?: boolean;
      pathname?: string;
      utmParams?: any;
      errors: string[];
      events: any[];
    };
  }
}

// Componente de rotas com captura UTM
const AppRoutes = () => {
  return (
    <>
      <UtmCapture />
      <UtmNavigation />
      <UtmDebugger />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// Inicializar sistema de reenvio de conversões pendentes
const initializeUtmify = () => {
  // Tentar reenviar conversões pendentes a cada 5 minutos
  const RETRY_INTERVAL = 5 * 60 * 1000; // 5 minutos
  
  // Primeira tentativa após 10 segundos (dar tempo para a página carregar)
  setTimeout(async () => {
    try {
      console.log("Inicializando sistema de reenvio de conversões UTMIFY...");
      await sendPendingConversions();
      
      // Configurar intervalo para tentativas periódicas
      setInterval(async () => {
        try {
          await sendPendingConversions();
        } catch (error) {
          console.error("Erro ao reenviar conversões pendentes:", error);
        }
      }, RETRY_INTERVAL);
      
    } catch (error) {
      console.error("Erro ao inicializar sistema de reenvio:", error);
    }
  }, 10000);
};

const App = () => {
  // Inicializar sistema de reenvio ao montar o componente
  useEffect(() => {
    initializeUtmify();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
