# Configuração para Desenvolvimento

## 🚀 Como iniciar o servidor local

### Opção 1: Script Bash (Recomendado)
```bash
./start-server.sh
```

### Opção 2: Comando direto
```bash
php -S localhost:8000
```

### Opção 3: Script PHP
```bash
php iniciar-servidor.php
```

## 🔗 URLs para teste

- **Projeto principal:** http://localhost:8000/index.html
- **Teste de pagamento:** http://localhost:8000/teste-pagamento.html
- **Teste Monetrix:** http://localhost:8000/checkout/teste-monetrix.php

## 📋 Checklist de teste

1. ✅ Iniciar servidor PHP local
2. ✅ Abrir http://localhost:8000/teste-pagamento.html
3. ✅ Clicar em "Testar Conectividade"
4. ✅ Clicar em "Testar Pagamento"
5. ✅ Verificar se PIX é gerado
6. ✅ Testar no projeto principal

## 🐛 Solução de problemas

### Erro "Failed to fetch"
- Verifique se o servidor PHP está rodando
- Confirme se está acessando via http://localhost:8000
- Verifique se não há outro processo na porta 8000

### Erro de CORS
- Os headers CORS já foram adicionados
- Certifique-se de usar localhost, não file://

### Erro na API Monetrix
- Verifique as credenciais no pagamento.php
- Confirme se a URL da API está correta
- Verifique os logs em checkout/logs/

## 📁 Estrutura de arquivos

```
projeto/
├── index.html                 # Projeto principal
├── teste-pagamento.html       # Teste isolado
├── start-server.sh           # Script para iniciar servidor
├── checkout/
│   ├── pagamento.php         # API de pagamento Monetrix
│   ├── webhook.php           # Webhook Monetrix
│   ├── verificar.php         # Verificação de status
│   ├── utmify.php           # UTMify (pago)
│   ├── utmify-pendente.php  # UTMify (pendente)
│   └── logs/                # Logs do sistema
└── ...
```

## 🔧 Configurações importantes

- **API Monetrix:** https://api.monetrix.store/v1
- **Webhook URL:** http://localhost:8000/checkout/webhook.php
- **UTMify Token:** 7uICYFeg4zAj4ZbDzK6DDnGyBxHbce92BaVd

## 📝 Logs importantes

- Logs Monetrix: `checkout/logs/`
- Logs PHP: Terminal onde o servidor está rodando
- Logs Browser: Console do navegador (F12)