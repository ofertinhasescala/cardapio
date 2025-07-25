# Instruções para Upload no GitHub

Para fazer o upload deste projeto para o GitHub, siga os passos abaixo:

## 1. Autenticar no GitHub

Você precisa ter permissões de escrita no repositório `https://github.com/ofertasescaladas20/oia-push`.

## 2. Configurar credenciais

### Opção 1: Usando Token de Acesso Pessoal
1. Acesse GitHub.com e faça login
2. Vá para Configurações > Configurações do desenvolvedor > Tokens de acesso pessoal
3. Clique em "Generate new token (classic)"
4. Dê um nome ao token (ex: "OIA Push Access")
5. Selecione o escopo "repo" para acesso completo ao repositório
6. Clique em "Generate token" e copie o token gerado
7. No terminal, execute:
   ```
   git remote set-url origin https://SEU_USUARIO:SEU_TOKEN@github.com/ofertasescaladas20/oia-push.git
   git push -u origin main
   ```

### Opção 2: Usando SSH
1. Verifique se você tem uma chave SSH configurada:
   ```
   ls -la ~/.ssh
   ```
2. Se não tiver, crie uma:
   ```
   ssh-keygen -t ed25519 -C "seu_email@example.com"
   ```
3. Adicione a chave ao agente SSH:
   ```
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```
4. Copie a chave pública:
   ```
   cat ~/.ssh/id_ed25519.pub
   ```
5. Adicione a chave à sua conta do GitHub:
   - Acesse GitHub.com > Configurações > SSH and GPG keys
   - Clique em "New SSH key"
   - Cole a chave e salve
6. Configure o repositório para usar SSH:
   ```
   git remote set-url origin git@github.com:ofertasescaladas20/oia-push.git
   git push -u origin main
   ```

## 3. Upload Manual (alternativa)

Se as opções acima não funcionarem:

1. Acesse https://github.com/ofertasescaladas20/oia-push
2. Clique em "Add file" > "Upload files"
3. Arraste e solte os arquivos do projeto (você pode precisar fazer isso em lotes)
4. Adicione uma mensagem de commit: "Versão inicial do OIA Push"
5. Clique em "Commit changes" 