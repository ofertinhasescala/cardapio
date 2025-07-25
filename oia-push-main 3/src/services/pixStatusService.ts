import type { CheckoutFormData, CartItem } from "@/types/checkout"
import type { UtmParams } from "@/hooks/useUtm"
import axios from "axios"
import { toast } from "@/components/ui/sonner"
import { trackPixPaid } from '@/services/facebookPixelService';

interface PendingPixTransaction {
  pixTransactionId: string
  checkoutData: CheckoutFormData
  cartItems: CartItem[]
  totalPrice: number
  utmParams: UtmParams
  createdAt: string
  lastCheck?: string
  attempts: number
}

export class PixStatusService {
  private static readonly STORAGE_KEY = "pending_pix_transactions"
  private static readonly CHECK_INTERVAL = 5000 // 5 segundos
  private static readonly MAX_ATTEMPTS = 120 // 10 minutos de tentativas (5s * 120 = 10min)
  private static pollingInterval: number | null = null

  /**
   * Adicionar transação para monitoramento
   */
  static addPendingTransaction(data: PendingPixTransaction): void {
    try {
      const pendingTransactions = this.getPendingTransactions()

      // Verificar se já existe uma transação com o mesmo ID
      const existingIndex = pendingTransactions.findIndex((t) => t.pixTransactionId === data.pixTransactionId)

      if (existingIndex >= 0) {
        // Transação já existe, só registrar no log
        console.log(`⚠️ Transação PIX ${data.pixTransactionId} já está sendo monitorada`)
        return
      }

      // Adicionar nova transação
      pendingTransactions.push(data)

      // Salvar no localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pendingTransactions))
      console.log(`✅ Transação PIX ${data.pixTransactionId} adicionada para monitoramento`)

      // Iniciar polling se ainda não estiver ativo
      if (this.pollingInterval === null) {
        this.startPolling()
      }
    } catch (error) {
      console.error("Erro ao adicionar transação PIX pendente:", error)
    }
  }

  /**
   * Obter lista de transações pendentes
   */
  static getPendingTransactions(): PendingPixTransaction[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Erro ao obter transações PIX pendentes:", error)
      return []
    }
  }

  /**
   * Remover transação da lista de pendentes
   */
  static removePendingTransaction(transactionId: string): void {
    try {
      const pendingTransactions = this.getPendingTransactions()
      const filteredTransactions = pendingTransactions.filter((t) => t.pixTransactionId !== transactionId)

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTransactions))
      console.log(`✅ Transação PIX ${transactionId} removida do monitoramento`)

      // Se não houver mais transações pendentes, parar o polling
      if (filteredTransactions.length === 0) {
        this.stopPolling()
      }
    } catch (error) {
      console.error("Erro ao remover transação PIX pendente:", error)
    }
  }

  /**
   * Verificar status de uma transação específica
   */
  static async checkTransactionStatus(
    transactionId: string,
  ): Promise<"waiting_payment" | "paid" | "expired" | "refused" | "refunded" | "chargedback"> {
    try {
      console.log(`🔍 Verificando status da transação ${transactionId}...`)

      // URL da API Monetrix para verificar status
      const apiUrl = `https://api.monetrix.store/v1/transactions/${transactionId}`

      // Token de autenticação Basic (do exemplo curl fornecido)
      const apiAuthToken =
        "Basic cGtfS1FNc29IMTY5ZjczS01mREhxUnVmNGZWQjFPOUw4MmpsMDZEeE1yVEM0Q0VsdTFHOnNrX3BQOHhldGJKUDlpbXZJcldfTVZ5WmpXWUtiZ0pGVGxSU1E5ZlY1WkhZWDl3ejliWg=="

      console.log(`📤 Enviando requisição para API Monetrix: ${apiUrl}`)

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: apiAuthToken,
          accept: "application/json",
        },
      })

      console.log(`📥 Resposta recebida da API Monetrix:`, response.data)

      // Verificar resposta da API
      if (response.data && response.data.status) {
        console.log(`Status da transação ${transactionId}: ${response.data.status}`)
        return response.data.status
      }

      console.log(`Status não encontrado na resposta, assumindo waiting_payment`)
      return "waiting_payment" // Status padrão se não conseguir determinar
    } catch (error) {
      console.error(`Erro ao verificar status da transação ${transactionId}:`, error)
      // Em caso de erro, assumir que ainda está pendente ou que houve um problema na requisição
      // Dependendo do erro, pode-se considerar 'refused' ou 'expired' se for um erro de validação ou timeout
      // Por simplicidade, manter 'waiting_payment' para continuar tentando
      return "waiting_payment"
    }
  }

  /**
   * Iniciar polling para todas as transações pendentes
   */
  static startPolling(): void {
    if (this.pollingInterval !== null) {
      return // Já está em execução
    }

    console.log("🔄 Iniciando monitoramento de transações PIX pendentes...")

    // Iniciar o intervalo de verificação
    this.pollingInterval = window.setInterval(() => {
      this.checkPendingTransactions()
    }, this.CHECK_INTERVAL)
  }

  /**
   * Parar polling
   */
  static stopPolling(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
      console.log("⏹️ Monitoramento de transações PIX interrompido")
    }
  }

  /**
   * Verificar todas as transações pendentes
   */
  static async checkPendingTransactions(): Promise<void> {
    try {
      const pendingTransactions = this.getPendingTransactions()

      if (pendingTransactions.length === 0) {
        this.stopPolling()
        return
      }

      console.log(`🔍 Verificando ${pendingTransactions.length} transações PIX pendentes...`)

      const now = new Date()
      const updatedTransactions: PendingPixTransaction[] = []

      // Verificar cada transação pendente
      for (const transaction of pendingTransactions) {
        // Incrementar tentativas
        const updatedTransaction = {
          ...transaction,
          attempts: transaction.attempts + 1,
          lastCheck: now.toISOString(),
        }

        // Verificar se atingiu o limite de tentativas
        if (updatedTransaction.attempts > this.MAX_ATTEMPTS) {
          console.warn(`⚠️ Transação ${transaction.pixTransactionId} atingiu o limite de tentativas`)
          continue // Não adicionar à lista atualizada (será removida)
        }

        try {
          // Verificar status atual
          const status = await this.checkTransactionStatus(transaction.pixTransactionId)

          // Se o pagamento foi aprovado
          if (status === "paid") {
            console.log(`✅ Transação ${transaction.pixTransactionId} APROVADA!`)
            await this.processApprovedTransaction(transaction)
            continue // Não adicionar à lista atualizada (será removida)
          }

          // Se o pagamento expirou, foi recusado, reembolsado ou estornado
          if (status === "expired" || status === "refused" || status === "refunded" || status === "chargedback") {
            console.log(`⏱️ Transação ${transaction.pixTransactionId} com status final: ${status}`)
            // Opcional: enviar evento para UTMify para status de falha/expirado
            // await this.processFailedTransaction(transaction, status);
            continue // Não adicionar à lista atualizada (será removida)
          }

          // Se ainda está aguardando pagamento, manter na lista
          updatedTransactions.push(updatedTransaction)
        } catch (error) {
          console.error(`Erro ao processar transação ${transaction.pixTransactionId}:`, error)
          updatedTransactions.push(updatedTransaction)
        }
      }

      // Atualizar a lista de transações pendentes
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTransactions))

      // Se não houver mais transações pendentes, parar o polling
      if (updatedTransactions.length === 0) {
        this.stopPolling()
      }
    } catch (error) {
      console.error("Erro ao verificar transações PIX pendentes:", error)
    }
  }

  /**
   * Processar transação aprovada
   */
  private static async processApprovedTransaction(transaction: PendingPixTransaction): Promise<void> {
    try {
      console.log("🎉 Processando transação PIX aprovada:", transaction.pixTransactionId)
      console.log("⭐⭐⭐ PROCESSANDO PAGAMENTO PIX APROVADO ⭐⭐⭐")

      // Formatar telefone e CPF para envio
      const phone = transaction.checkoutData.telefone.replace(/\D/g, "")
      const document = transaction.checkoutData.cpf.replace(/\D/g, "")

      // Formatar data de aprovação no formato correto para UTMify (YYYY-MM-DD HH:MM:SS)
      const now = new Date()
      const approvedDate = now.toISOString().replace("T", " ").substring(0, 19)

      // Formatar data de criação no formato correto
      const createdAt = transaction.createdAt.includes("T")
        ? transaction.createdAt.replace("T", " ").substring(0, 19)
        : transaction.createdAt

      // Preparar produtos no formato correto para a Utmify
      const products = transaction.cartItems.map((item) => ({
        id: item.id || `product_${Date.now()}`,
        name: item.name,
        planId: null,
        planName: null,
        quantity: item.quantity,
        priceInCents: Math.round((item.finalPrice || item.unitPrice) * 100),
      }))

      // Preparar parâmetros UTM no formato correto
      const utmParams = transaction.utmParams || {}

      // Garantir que temos valores padrão para parâmetros UTM importantes
      const trackingParameters = {
        src: utmParams.src || null,
        sck: utmParams.sck || null,
        utm_source: utmParams.utm_source || "direct",
        utm_campaign: utmParams.utm_campaign || "organic",
        utm_medium: utmParams.utm_medium || "website",
        utm_content: utmParams.utm_content || null,
        utm_term: utmParams.utm_term || null,
        utm_id: utmParams.utm_id || null,
      }

      // Calcular valores de comissão corretamente
      const totalPriceInCents = Math.round(transaction.totalPrice * 100)
      const gatewayFeeInCents = Math.round(totalPriceInCents * 0.04) // 4% de taxa estimada
      const userCommissionInCents = totalPriceInCents - gatewayFeeInCents // 96% do valor após taxa

      // Enviar webhook para UTMify com status 'paid'
      const utmifyPayload = {
        orderId: transaction.pixTransactionId,
        platform: "GlobalPay",
        paymentMethod: "pix",
        status: "paid",
        createdAt: createdAt,
        approvedDate: approvedDate,
        refundedAt: null,
        customer: {
          name: transaction.checkoutData.nome,
          email: transaction.checkoutData.email || "",
          phone: phone,
          document: document,
          country: "BR",
          ip: null, // O IP será obtido dentro do utmifyService.trackConversion
        },
        products: products,
        trackingParameters: trackingParameters,
        commission: {
          totalPriceInCents: totalPriceInCents,
          gatewayFeeInCents: gatewayFeeInCents,
          userCommissionInCents: userCommissionInCents,
          currency: "BRL",
        },
        isTest: false,
      }

      console.log("📤 Enviando webhook UTMify para pagamento APROVADO:", JSON.stringify(utmifyPayload, null, 2))

      // Importar serviço Utmify
      const utmifyService = await import("./utmifyService")

      // Tentar enviar via trackConversion (função principal)
      try {
        console.log("📡 Tentando enviar via trackConversion...")
        const result = await utmifyService.trackConversion(utmifyPayload)

        console.log("📥 Resultado do webhook UTMify:", result)

        if (result.success) {
          console.log(`✅ Webhook UTMify enviado com sucesso via ${result.method}`)
        } else if (result.saved_for_retry) {
          console.log("⏳ Webhook UTMify salvo para retry posterior")

          // Tentar reenviar conversões pendentes
          setTimeout(() => {
            utmifyService.sendPendingConversions().catch(console.error)
          }, 5000)
        } else {
          console.error("❌ Falha ao enviar webhook UTMify:", result.error)
        }
      } catch (error) {
        console.error("❌ Erro ao enviar webhook via trackConversion:", error)
      }

      // Disparar evento personalizado para notificar a UI
      const pixApprovedEvent = new CustomEvent("pix-payment-approved", {
        detail: {
          transactionId: transaction.pixTransactionId,
        },
      })
      window.dispatchEvent(pixApprovedEvent)

      // Disparar evento PixPaid do Facebook Pixel
      trackPixPaid({
        content_type: 'product',
        content_ids: transaction.cartItems.map(item => item.id),
        contents: transaction.cartItems.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.finalPrice })),
        currency: 'BRL',
        value: transaction.totalPrice,
        num_items: transaction.cartItems.length,
        customer_name: transaction.checkoutData.nome,
        customer_phone: transaction.checkoutData.telefone,
        utm: transaction.utmParams,
        pix_transaction_id: transaction.pixTransactionId,
        status: 'paid',
      }, transaction.utmParams);

      // Remover transação da lista de pendentes
      this.removePendingTransaction(transaction.pixTransactionId)

      // Exibir toast de sucesso (se o usuário ainda estiver na página)
      toast.success("Pagamento PIX aprovado!", {
        description: "Seu pedido foi confirmado com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao processar transação aprovada:", error)
    }
  }
}
