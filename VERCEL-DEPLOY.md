# Implantação na Vercel - Atelier Phamela Gourmet

Este guia explica como implantar o site da Atelier Phamela Gourmet na Vercel.

## Pré-requisitos

1. Uma conta na [Vercel](https://vercel.com/)
2. Git instalado no seu computador
3. O repositório do projeto: https://github.com/ofertinhasescala/cardapio.git

## Passo a Passo para Implantação

### 1. Preparar o Repositório

O projeto já está configurado para ser implantado na Vercel. Os arquivos necessários são:

- `vercel.json`: Configurações do projeto para a Vercel
- `package.json`: Definição das dependências
- `api/index.php`: Ponto de entrada para funções serverless
- `api/webhook.php`: Endpoint para webhooks do Monetrix

### 2. Fazer Login na Vercel

1. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta
2. Se ainda não tiver uma conta, crie uma nova

### 3. Importar o Projeto

1. No dashboard da Vercel, clique em "New Project" (ou "Add New" → "Project")
2. Se você já conectou seu GitHub, selecione o repositório `ofertinhasescala/cardapio` na lista
3. Se não, clique em "Import Git Repository" e cole a URL: `https://github.com/ofertinhasescala/cardapio.git`
4. Clique em "Import"

### 4. Configurar Variáveis de Ambiente

Na tela de configuração do projeto, adicione as seguintes variáveis de ambiente:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `API_KEY` | `sua_chave_api_monetrix` | Chave pública da API Monetrix |
| `API_SECRET` | `seu_secret_monetrix` | Chave secreta da API Monetrix |
| `PIX_INTEGRATION_TYPE` | `monetrix` | Tipo de integração PIX |
| `PIX_ENDPOINT` | `https://api.monetizze.dev.br/2.1/transactions/pix` | Endpoint da API PIX |
| `PIX_WEBHOOK_SECRET` | `seu_webhook_secret` | Segredo para validar webhooks |
| `PIX_MERCHANT_NAME` | `Atelier Phamela Gourmet` | Nome do lojista |
| `PIX_MERCHANT_CITY` | `São Paulo` | Cidade do lojista |
| `PIX_MERCHANT_ID` | `seu_merchant_id` | ID do lojista |
| `ENVIRONMENT` | `production` | Ambiente (use `development` para testes) |
| `DB_PATH` | `/tmp/database.sqlite` | Caminho para o banco de dados SQLite |
| `FB_PIXEL_ID` | `1404066580873208` | ID do Facebook Pixel |
| `FB_ACCESS_TOKEN` | `EAAiRE5K8xWsB...` | Token de acesso do Facebook (use seu token completo) |

### 5. Opções de Implantação

Na mesma tela, configure:

1. **Build Command**: Deixe em branco (o projeto não requer build)
2. **Output Directory**: Deixe em branco (usará a raiz)
3. **Install Command**: `npm install` (para instalar as dependências necessárias)

### 6. Concluir a Implantação

1. Clique em "Deploy"
2. Aguarde a conclusão da implantação (geralmente leva alguns minutos)
3. Quando a implantação for concluída, clique no link fornecido para acessar seu site

## Configuração Adicional do Domínio (Opcional)

Se você deseja usar um domínio personalizado:

1. No dashboard do projeto, vá para "Settings" → "Domains"
2. Clique em "Add" e insira seu domínio
3. Siga as instruções para configurar seu DNS

## Verificando Logs e Depuração

Para verificar os logs da aplicação:

1. No dashboard do projeto, clique na implantação mais recente
2. Vá para a aba "Functions"
3. Clique em qualquer função para ver seus logs
4. Para logs mais detalhados, vá para "Settings" → "Functions" → "Logs" e habilite "Debug Mode"

## Testando a API

Após a implantação, você pode testar se a API está funcionando corretamente acessando:

```
https://seu-projeto.vercel.app/api
```

Você deverá ver uma resposta JSON indicando que a API está online.

## Configuração do Webhook para PIX

Para configurar o webhook de notificações PIX na plataforma Monetrix:

1. No painel da Monetrix, vá para "Configurações" → "Webhooks"
2. Adicione um novo webhook com a URL:
   ```
   https://seu-projeto.vercel.app/api/webhook.php
   ```
3. Selecione os eventos `transaction.updated` e `pix.updated`
4. Salve as configurações

## Solução de Problemas Comuns

### Erro de Banco de Dados SQLite

Se você encontrar erros relacionados ao SQLite, verifique:

1. A variável `DB_PATH` está configurada como `/tmp/database.sqlite`
2. O código está usando `getenv('DB_PATH')` para obter o caminho do banco de dados

### Falha na Integração com PIX

Se os pagamentos PIX não estiverem funcionando:

1. Verifique se as credenciais da API (`API_KEY` e `API_SECRET`) estão corretas
2. Verifique os logs para ver se há erros específicos na comunicação com a API Monetrix
3. Confirme que o ambiente (`ENVIRONMENT`) está configurado corretamente

### Problemas com PHP

A Vercel usa uma versão específica do PHP. Se houver problemas de compatibilidade:

1. Verifique se `vercel.json` está configurado corretamente com o runtime `vercel-php@0.6.0`
2. Certifique-se de que seu código PHP é compatível com a versão PHP 7.4

## Atualizando o Site

Para atualizar seu site após fazer alterações:

1. Faça commit das alterações para o repositório Git
2. A Vercel detectará automaticamente as alterações e fará uma nova implantação

## Contato e Suporte

Se precisar de ajuda adicional, entre em contato pelo Instagram: [@phamela.gourmetofc](https://www.instagram.com/phamela.gourmetofc/) 