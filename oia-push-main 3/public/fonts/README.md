# Informações sobre a fonte do projeto

A fonte Manrope foi adicionada ao projeto utilizando o Google Fonts CDN.

## Sobre a Manrope

Manrope é uma fonte moderna e limpa, de código aberto, que funciona bem tanto para textos quanto para títulos. A fonte foi criada por Mikhail Sharanda e é distribuída gratuitamente sob a licença SIL Open Font License.

## Como a fonte está sendo utilizada

A fonte Manrope está sendo carregada via CDN no arquivo `index.html` utilizando o Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

## Configuração no Tailwind

A fonte está configurada no arquivo `tailwind.config.ts` como a fonte padrão:

```js
fontFamily: {
  sans: ['Manrope', 'sans-serif'],
},
```

## Utilizando a fonte

Para utilizar a fonte no seu projeto, simplesmente use as classes do Tailwind:

- `font-sans` para usar a fonte Manrope (padrão)
- Combine com classes de peso como `font-normal`, `font-medium`, `font-semibold`, `font-bold` e `font-extrabold` 