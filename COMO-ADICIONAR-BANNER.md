# Como adicionar a imagem de morangos como banner

Para adicionar a imagem de morangos como banner do site, siga estas instruções:

1. Salve a imagem de morangos vermelhos brilhantes que você compartilhou
2. Renomeie o arquivo para `banner-morangos.jpg`
3. Coloque o arquivo na pasta raiz do projeto (mesmo local onde estão os arquivos index.html, app.js, etc.)

O site já está configurado para usar essa imagem como banner. Assim que o arquivo estiver no lugar correto, a página inicial exibirá automaticamente os morangos como banner.

## Observações

- A imagem será exibida em tamanho grande no topo da página
- Um gradiente escuro foi adicionado sobre a imagem para melhorar o contraste com a logo e ícones
- Os botões no topo da imagem foram ajustados para fundo escuro semitransparente para melhor visibilidade

Se desejar utilizar outra imagem como banner no futuro, basta:
1. Salvar a nova imagem na pasta do projeto
2. Atualizar o arquivo `config.js` alterando o valor da propriedade `banner` para o nome do novo arquivo 