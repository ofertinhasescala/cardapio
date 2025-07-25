import { UtmParams } from '@/hooks/useUtm';

interface FacebookPixelEvent {
  event: string;
  data?: Record<string, any>;
}

const PIXEL_ID = '1404066580873208';
const CONVERSIONS_API_TOKEN = 'EAAiRE5K8xWsBPN9cXp4poZBgH53DylNZCHQpuGOhZCcJuHPKeCqgHx5t6ZCIDXENcOMaUaXKnn9cXZAZCPpnfT9EdmQuPytC9waZBtVdCWRIxOuiRxU0AZBzu72HVSTptGU2a06jGm5ZBHGGZAIG7ELqfRXSXPJtALtnYN2FccZATBrCbZCCpvEs1UrYLKoZCCb9kENKVZAAZDZD';

// Utilitário para hash SHA256 (para advanced matching)
async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Envia evento para o pixel web
function sendPixelEvent(event: FacebookPixelEvent) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', event.event, event.data || {});
    window.facebookPixelDebug?.events.push({ type: 'web', ...event, timestamp: new Date().toISOString() });
  } else {
    // Retry simples se fbq não estiver pronto
    setTimeout(() => sendPixelEvent(event), 1000);
  }
}

// Envia evento para a Conversions API (server-side)
async function sendConversionsApiEvent(event: FacebookPixelEvent, utmParams?: UtmParams) {
  try {
    // Advanced matching
    const userData: Record<string, any> = {};
    if (event.data?.customer_email) userData.em = await sha256(event.data.customer_email.trim().toLowerCase());
    if (event.data?.customer_phone) userData.ph = await sha256(event.data.customer_phone.replace(/\D/g, ''));
    if (event.data?.customer_name) userData.fn = await sha256(event.data.customer_name.trim().toLowerCase());
    // UTM params
    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) userData[key] = value;
      });
    }
    // Monta payload
    const payload = {
      event_name: event.event,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: userData,
      custom_data: event.data || {},
    };
    // Envia para a API do Facebook
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CONVERSIONS_API_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [payload] }),
    });
    const result = await response.json();
    window.facebookPixelDebug?.events.push({ type: 'api', ...event, result, timestamp: new Date().toISOString() });
    return result;
  } catch (error) {
    window.facebookPixelDebug?.errors.push({ error, event, timestamp: new Date().toISOString() });
    // Retry simples
    setTimeout(() => sendConversionsApiEvent(event, utmParams), 2000);
  }
}

// Função principal para disparar eventos (web + API)
export async function trackFacebookEvent(event: FacebookPixelEvent, utmParams?: UtmParams) {
  sendPixelEvent(event);
  await sendConversionsApiEvent(event, utmParams);
}

// Eventos padrão
export function trackAddToCart(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'AddToCart', data }, utmParams);
}
export function trackViewContent(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'ViewContent', data }, utmParams);
}
export function trackInitiateCheckout(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'InitiateCheckout', data }, utmParams);
}
export function trackAddPaymentInfo(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'AddPaymentInfo', data }, utmParams);
}
export function trackPurchase(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'Purchase', data }, utmParams);
}

// Eventos personalizados
export function trackPixGenerated(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'PixGenerated', data }, utmParams);
}
export function trackPixPaid(data: Record<string, any>, utmParams?: UtmParams) {
  trackFacebookEvent({ event: 'PixPaid', data }, utmParams);
}

// Função utilitária para disparar eventos do Google Analytics (gtag)
export function trackGtagEvent(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params || {});
  }
}

// Debug global
if (typeof window !== 'undefined') {
  window.facebookPixelDebug = window.facebookPixelDebug || {
    loaded: true,
    events: [],
    errors: [],
    pixelId: PIXEL_ID,
  };
}

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    facebookPixelDebug?: {
      loaded: boolean;
      events: any[];
      errors: any[];
      pixelId: string;
    };
    gtag?: (...args: any[]) => void;
  }
} 