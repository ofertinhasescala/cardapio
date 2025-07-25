console.log("🔄 Carregando serviço UTMIFY...")

// Token da API UTMIFY
const API_TOKEN = "VXP780tVat6jiScL4tmxBsf61Z1tvMQgDyaP"

// URL base da API UTMIFY
const API_URL = "https://api.utmify.com.br"
const API_ENDPOINT = "/api-credentials/orders" // Endpoint correto para a API Utmify

// Cabeçalho de autenticação correto
const AUTH_HEADER = "x-api-token"
const AUTH_VALUE = API_TOKEN // Usar apenas o token, sem Bearer

// Configurações
const CONFIG = {
  // Número máximo de tentativas para reenvio
  MAX_RETRY_ATTEMPTS: 5,
  // Tempo base entre tentativas (ms)
  BASE_RETRY_DELAY: 1000,
  // Tempo máximo entre tentativas (ms)
  MAX_RETRY_DELAY: 30000,
  // Nome da chave no localStorage
  STORAGE_KEY: "utmify_pending_conversions",
  // Tempo de expiração para conversões pendentes (ms) - 7 dias
  PENDING_EXPIRATION: 7 * 24 * 60 * 60 * 1000,
}

console.log("✅ Serviço UTMIFY carregado com sucesso!")

// Detectar ambiente restrito
const isRestrictedEnvironment = () => {
  try {
    // Verificar por frame_ant.js ou outras restrições comuns
    return (
      window.location.href.includes("frame_ant") ||
      (typeof window !== "undefined" && window.frames.length > 0 && window.top !== window.self)
    )
  } catch (e) {
    // Se não conseguir acessar window.top, provavelmente está em um iframe com restrições
    return true
  }
}

// Função para obter IP do cliente
const getClientIP = async (): Promise<string> => {
  try {
    // Tentar obter IP via API externa
    const response = await fetch("https://api.ipify.org?format=json", {
      method: "GET",
      timeout: 3000,
    })

    if (response.ok) {
      const data = await response.json()
      return data.ip || "127.0.0.1"
    }
  } catch (error) {
    console.warn("Não foi possível obter IP real:", error)
  }

  // Fallback para IP local
  return "127.0.0.1"
}

// Logger customizado para organizar os logs
const logger = {
  group: (name: string) => {
    console.group(`🔍 UTMIFY: ${name}`)
  },
  groupEnd: () => {
    console.groupEnd()
  },
  info: (message: string, data?: any) => {
    console.info(`ℹ️ UTMIFY: ${message}`, data !== undefined ? data : "")
  },
  success: (message: string, data?: any) => {
    console.log(`✅ UTMIFY: ${message}`, data !== undefined ? data : "")
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ UTMIFY: ${message}`, data !== undefined ? data : "")
  },
  error: (message: string, error?: any) => {
    console.error(`❌ UTMIFY: ${message}`, error !== undefined ? error : "")
  },
  debug: (message: string, data?: any) => {
    console.debug(`🔧 UTMIFY: ${message}`, data !== undefined ? data : "")
  },
}

interface PendingConversion {
  data: any
  timestamp: string
  attempts?: number
  lastAttempt?: string
  nextAttempt?: string
}

/**
 * Verifica se o ambiente é restrito para requisições externas
 */
export const checkEnvironment = (): {
  isRestricted: boolean
  details: string
} => {
  const isRestricted = isRestrictedEnvironment()
  let details = "Ambiente normal"

  if (isRestricted) {
    details = "Ambiente com restrições (possivelmente em iframe ou com bloqueio de CORS)"
  }

  return {
    isRestricted,
    details,
  }
}

/**
 * Salva uma conversão para tentativa futura
 */
export const saveConversionForRetry = (payload: any, attempts = 0): void => {
  try {
    logger.group("Salvando conversão para retry")

    const now = new Date()
    const nextAttemptDelay = Math.min(
      CONFIG.BASE_RETRY_DELAY * Math.pow(2, attempts), // Exponential backoff
      CONFIG.MAX_RETRY_DELAY,
    )

    const nextAttempt = new Date(now.getTime() + nextAttemptDelay)

    const pendingConversion: PendingConversion = {
      data: payload,
      timestamp: now.toISOString(),
      attempts: attempts,
      lastAttempt: now.toISOString(),
      nextAttempt: nextAttempt.toISOString(),
    }

    // Obter conversões pendentes
    const pendingConversions: PendingConversion[] = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]")

    // Adicionar nova conversão
    pendingConversions.push(pendingConversion)

    // Salvar no localStorage
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(pendingConversions))

    logger.success("Conversão salva para retry", {
      attempts,
      nextAttempt: nextAttempt.toISOString(),
    })
    logger.groupEnd()
  } catch (e) {
    logger.error("Erro ao salvar conversão para retry", e)
    logger.groupEnd()
  }
}

/**
 * Limpa conversões expiradas do armazenamento local
 */
export const cleanupExpiredConversions = (): void => {
  try {
    logger.group("Limpando conversões expiradas")

    const pendingConversions: PendingConversion[] = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]")

    if (pendingConversions.length === 0) {
      logger.info("Nenhuma conversão pendente para limpar")
      logger.groupEnd()
      return
    }

    const now = new Date().getTime()
    const validConversions = pendingConversions.filter((conv) => {
      const timestamp = new Date(conv.timestamp).getTime()
      return now - timestamp < CONFIG.PENDING_EXPIRATION
    })

    logger.info(`Removidas ${pendingConversions.length - validConversions.length} conversões expiradas`)

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(validConversions))
    logger.groupEnd()
  } catch (e) {
    logger.error("Erro ao limpar conversões expiradas", e)
    logger.groupEnd()
  }
}

/**
 * Tenta reenviar conversões pendentes
 */
export const sendPendingConversions = async (): Promise<{
  success: number
  failed: number
  remaining: number
}> => {
  logger.group("Reenviando conversões pendentes")

  try {
    // Limpar conversões expiradas primeiro
    cleanupExpiredConversions()

    // Obter conversões pendentes
    const pendingConversions: PendingConversion[] = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]")

    if (pendingConversions.length === 0) {
      logger.info("Nenhuma conversão pendente para reenviar")
      logger.groupEnd()
      return { success: 0, failed: 0, remaining: 0 }
    }

    logger.info(`Encontradas ${pendingConversions.length} conversões pendentes`)

    const now = new Date()
    let success = 0
    let failed = 0
    const updatedConversions = []

    // Processar cada conversão
    for (const conversion of pendingConversions) {
      // Verificar se está na hora de tentar novamente
      const nextAttempt = conversion.nextAttempt ? new Date(conversion.nextAttempt) : new Date(0)

      if (nextAttempt > now) {
        // Ainda não está na hora
        logger.debug(
          `Conversão ${conversion.data.orderId || conversion.data.order_id} agendada para ${conversion.nextAttempt}`,
        )
        updatedConversions.push(conversion)
        continue
      }

      // Tentar reenviar
      try {
        logger.info(
          `Reenviando conversão ${conversion.data.orderId || conversion.data.order_id} (tentativa ${conversion.attempts || 0 + 1})`,
        )

        // Tentar enviar usando a estratégia principal
        await trackConversion(conversion.data)

        logger.success(`Conversão ${conversion.data.orderId || conversion.data.order_id} reenviada com sucesso`)
        success++
      } catch (error) {
        const attempts = (conversion.attempts || 0) + 1

        if (attempts >= CONFIG.MAX_RETRY_ATTEMPTS) {
          logger.error(
            `Desistindo da conversão ${conversion.data.orderId || conversion.data.order_id} após ${attempts} tentativas`,
          )
          failed++
        } else {
          // Calcular próxima tentativa com exponential backoff
          const nextAttemptDelay = Math.min(CONFIG.BASE_RETRY_DELAY * Math.pow(2, attempts), CONFIG.MAX_RETRY_DELAY)

          const nextAttemptDate = new Date(now.getTime() + nextAttemptDelay)

          // Atualizar conversão
          conversion.attempts = attempts
          conversion.lastAttempt = now.toISOString()
          conversion.nextAttempt = nextAttemptDate.toISOString()

          logger.warn(
            `Falha ao reenviar ${conversion.data.orderId || conversion.data.order_id}. Agendando próxima tentativa para ${nextAttemptDate.toISOString()}`,
          )
          updatedConversions.push(conversion)
        }
      }
    }

    // Atualizar localStorage
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(updatedConversions))

    logger.info("Resumo do reenvio", {
      success,
      failed,
      remaining: updatedConversions.length,
    })

    logger.groupEnd()
    return { success, failed, remaining: updatedConversions.length }
  } catch (e) {
    logger.error("Erro ao reenviar conversões pendentes", e)
    logger.groupEnd()
    return { success: 0, failed: 0, remaining: 0 }
  }
}

/**
 * Função principal para rastrear conversões com múltiplas estratégias
 * Implementa várias abordagens para contornar bloqueios de CORS e outras restrições
 */
export const trackConversion = async (data: any): Promise<any> => {
  logger.group("Iniciando rastreamento de conversão")

  try {
    // Adicionar log detalhado para depuração
    console.log("🔍 Detalhes completos da conversão sendo enviada:", JSON.stringify(data, null, 2))
    console.log("🔍 Método de envio: POST direto para API")

    const fullApiUrl = `${API_URL}${API_ENDPOINT}`

    // Verificar status do pagamento
    const paymentStatus = data.status || "waiting_payment"

    // Log especial para pagamentos aprovados
    if (paymentStatus === "paid") {
      logger.info("⭐ Processando conversão de PAGAMENTO APROVADO ⭐")
      console.log("⭐⭐⭐ ENVIANDO WEBHOOK DE PAGAMENTO APROVADO ⭐⭐⭐")
    }

    // Obter IP do cliente
    const clientIP = await getClientIP()
    logger.info(`IP do cliente obtido: ${clientIP}`)

    // Formatar dados para API UTMIFY conforme o formato esperado
    const payload = {
      orderId: data.order_id || data.orderId,
      platform: data.platform || "PhamelaGourmet",
      paymentMethod: data.paymentMethod || "pix",
      status: paymentStatus,
      createdAt: data.createdAt || new Date().toISOString().replace("T", " ").substring(0, 19),
      approvedDate:
        paymentStatus === "paid"
          ? data.approvedDate || new Date().toISOString().replace("T", " ").substring(0, 19)
          : null,
      refundedAt: null,
      customer: {
        name: data.customer?.name || data.customer_name || "",
        email: data.customer?.email || data.customer_email || "",
        phone: data.customer?.phone || "",
        document: data.customer?.document || "",
        country: "BR",
        ip: clientIP, // Usar IP obtido em vez de null
      },
      products: Array.isArray(data.products)
        ? data.products.map((product: any) => ({
            id: product.id || null,
            name: product.name || "",
            planId: product.planId || null,
            planName: product.planName || null,
            quantity: product.quantity || 1,
            priceInCents: Math.round((product.price || product.priceInCents || 0) * (product.price ? 100 : 1)),
          }))
        : [],
      trackingParameters: {
        src: data.trackingParameters?.src || data.utm_params?.src || null,
        sck: data.trackingParameters?.sck || data.utm_params?.sck || null,
        utm_source: data.trackingParameters?.utm_source || data.utm_params?.utm_source || null,
        utm_campaign: data.trackingParameters?.utm_campaign || data.utm_params?.utm_campaign || null,
        utm_medium: data.trackingParameters?.utm_medium || data.utm_params?.utm_medium || null,
        utm_content: data.trackingParameters?.utm_content || data.utm_params?.utm_content || null,
        utm_term: data.trackingParameters?.utm_term || data.utm_params?.utm_term || null,
        utm_id: data.trackingParameters?.utm_id || data.utm_params?.utm_id || null,
      },
      commission: {
        totalPriceInCents: Math.round((data.value || data.commission?.totalPriceInCents || 0) * (data.value ? 100 : 1)),
        gatewayFeeInCents: data.commission?.gatewayFeeInCents || 0,
        userCommissionInCents: Math.round(
          (data.value || data.commission?.userCommissionInCents || 0) * (data.value ? 100 : 1),
        ),
        currency: "BRL",
      },
      isTest: false,
    }

    // Verificar se as datas estão no formato correto (YYYY-MM-DD HH:MM:SS)
    const formatDateIfNeeded = (dateStr: string) => {
      if (!dateStr) return null
      if (dateStr.includes("T")) {
        return dateStr.replace("T", " ").substring(0, 19)
      }
      return dateStr
    }

    // Garantir formato correto das datas
    payload.createdAt = formatDateIfNeeded(payload.createdAt)
    if (payload.approvedDate) {
      payload.approvedDate = formatDateIfNeeded(payload.approvedDate)
    }

    // Log detalhado para pagamentos aprovados
    if (paymentStatus === "paid") {
      logger.info("📊 Dados de pagamento aprovado:")
      logger.info(`OrderID: ${payload.orderId}`)
      logger.info(`Status: ${payload.status}`)
      logger.info(`CreatedAt: ${payload.createdAt}`)
      logger.info(`ApprovedDate: ${payload.approvedDate}`)
      logger.info(
        `Valor: ${payload.commission.totalPriceInCents / 100} (${payload.commission.totalPriceInCents} cents)`,
      )

      // Verificar parâmetros UTM
      console.log("📊 Parâmetros UTM:", JSON.stringify(payload.trackingParameters, null, 2))

      // Verificar produtos
      console.log("📊 Produtos:", JSON.stringify(payload.products, null, 2))
    }

    console.log("📤 Payload completo para Utmify:", JSON.stringify(payload, null, 2))
    logger.debug(`📤 Enviando conversão UTMIFY (status: ${paymentStatus}):`, payload)

    // Enviar diretamente via fetch API com método POST
    try {
      logger.info("Enviando via Fetch API com x-api-token")
      console.log("📡 Enviando via POST para:", fullApiUrl)

      // Implementar timeout para evitar espera prolongada
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

      const response = await fetch(fullApiUrl, {
        method: "POST",
        headers: {
          [AUTH_HEADER]: AUTH_VALUE,
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(payload),
        mode: "cors",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const responseData = await response.json()
        logger.success("Conversão enviada com sucesso via POST")
        logger.success("Resposta da API:", responseData)
        logger.groupEnd()
        return { success: true, method: "direct_post", data: responseData }
      } else {
        const errorText = await response.text()
        logger.warn(`Falha no envio via POST: ${response.status} ${response.statusText}`)
        logger.warn(`Resposta de erro: ${errorText}`)
        throw new Error(`Falha no envio: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (error) {
      if (error.name === "AbortError") {
        logger.warn("Fetch API falhou: Timeout após 10 segundos")
      } else {
        logger.warn("Fetch API falhou:", error)
      }

      // Salvar para tentativa posterior
      logger.info("Falha no envio direto, salvando para tentativa posterior")
      saveConversionForRetry(data)
      logger.warn("Conversão salva para tentativa posterior")
      logger.groupEnd()

      return { success: false, saved_for_retry: true, method: "pending_conversion", error: String(error) }
    }
  } catch (error) {
    logger.error("Erro ao rastrear conversão", error)
    console.error("❌❌❌ Erro crítico ao rastrear conversão:", error)
    logger.groupEnd()

    // Salvar para retry em caso de erro
    try {
      saveConversionForRetry(data)
    } catch (e) {
      logger.error("Erro ao salvar para retry", e)
    }

    return { success: false, error: String(error) }
  }
}

/**
 * Testa a conexão com a API UTMIFY
 */
export const testUtmifyConnection = async (): Promise<any> => {
  logger.group("Testando conexão com UTMIFY")

  try {
    const env = checkEnvironment()
    logger.info("Ambiente detectado", env)

    // Testar endpoint principal
    try {
      const testUrl = `${API_URL}${API_ENDPOINT}/test`
      logger.debug(`Testando endpoint principal: ${testUrl}`)

      const response = await fetch(testUrl, {
        method: "POST", // Alterar para POST
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          [AUTH_HEADER]: AUTH_VALUE, // Usar o cabeçalho de autenticação correto
        },
        body: JSON.stringify({ test: true }), // Adicionar um corpo para o POST
      })

      const status = response.status
      let text = ""

      try {
        text = await response.text()
      } catch (e) {
        text = "Não foi possível ler o corpo da resposta"
      }

      logger.debug(`Resultado: ${status}`)

      return [
        {
          url: testUrl,
          status,
          ok: response.ok,
          body: text,
        },
      ]
    } catch (error) {
      logger.error(`Erro ao testar endpoint principal`, error)

      // Tentar com Image Beacon como fallback
      try {
        const img = new Image()
        const testUrl = `${API_URL}${API_ENDPOINT}/test`

        const beaconPromise = new Promise<{ success: boolean; timeout?: boolean }>((resolve) => {
          img.onload = () => resolve({ success: true })
          img.onerror = () => resolve({ success: false })
          setTimeout(() => resolve({ success: false, timeout: true }), 3000)
        })

        img.src = `${testUrl}?token=${API_TOKEN}&timestamp=${Date.now()}`

        const beaconResult = await beaconPromise

        return [
          {
            url: testUrl,
            status: beaconResult.success ? "ok" : "error",
            ok: beaconResult.success,
            body: beaconResult.success ? "Image loaded" : "Image failed to load",
          },
        ]
      } catch (e) {
        return [
          {
            url: `${API_URL}${API_ENDPOINT}/test`,
            status: "error",
            ok: false,
            error: String(error),
          },
        ]
      }
    }
  } catch (error) {
    logger.error("Erro ao testar conexão", error)
    logger.groupEnd()
    throw error
  } finally {
    logger.groupEnd()
  }
}

/**
 * Verifica o status da integração com UTMIFY
 */
export const checkUtmifyStatus = async (): Promise<{
  scriptLoaded: boolean
  apiConnected: boolean
  pendingConversions: number
}> => {
  logger.group("Verificando status da integração UTMIFY")

  try {
    const scriptLoaded = typeof window.utmify !== "undefined"

    let apiConnected = false
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINT}/test`, {
        method: "POST", // Alterar para POST
        mode: "cors",
        headers: {
          [AUTH_HEADER]: AUTH_VALUE, // Usar o cabeçalho de autenticação correto
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: true }), // Adicionar um corpo para o POST
      })

      apiConnected = response.ok
    } catch (e) {
      // Tentar com Image Beacon como fallback
      try {
        const img = new Image()
        const testPromise = new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          setTimeout(() => resolve(false), 3000)
        })

        img.src = `${API_URL}${API_ENDPOINT}/test?token=${API_TOKEN}&timestamp=${Date.now()}`

        apiConnected = await testPromise
      } catch (beaconError) {
        logger.warn("API não respondeu via Fetch nem via Image Beacon", e)
      }
    }

    // Verificar conversões pendentes
    const pendingConversions = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]").length

    const status = {
      scriptLoaded,
      apiConnected,
      pendingConversions,
    }

    logger.info("Status da integração", status)
    logger.groupEnd()

    return status
  } catch (error) {
    logger.error("Erro ao verificar status", error)
    logger.groupEnd()

    return {
      scriptLoaded: false,
      apiConnected: false,
      pendingConversions: 0,
    }
  }
}

// Adicionar tipagem para o objeto utmify global
declare global {
  interface Window {
    utmify?: {
      conversion: (data: any) => void
    }
    utmifyDebug?: {
      loaded: boolean
      pageLoaded?: boolean
      pathname?: string
      utmParams?: any
      errors: string[]
      events: any[]
    }
  }
}

export default {
  trackConversion,
  checkUtmifyStatus,
  testUtmifyConnection,
  sendPendingConversions,
  checkEnvironment,
}
