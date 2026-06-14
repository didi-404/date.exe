# Date.exe

Projeto em HTML, CSS e JavaScript inspirado em um Reel de convite para date com estética de tecnologia.

## Arquivos

- `index.html`: estrutura da página
- `style.css`: visual, animações e responsividade
- `script.js`: interações, botão que foge, digitação, escolha de rolê, data, horário, envio por e-mail sem redirecionamento e confetes

## Como usar

Abra o arquivo `index.html` no navegador.

## Envio para e-mail

O formulário está configurado para enviar as respostas para:

`diego.souza.3046@gmail.com`

Ele usa o FormSubmit com envio via AJAX, então a página não redireciona: depois de confirmar aparece a mensagem “Seu convite foi enviado, gatinha!”. Na primeira vez que alguém enviar o formulário pode chegar um e-mail de confirmação para ativar o recebimento nesse endereço. Depois da ativação, os próximos envios chegam automaticamente.

## O que é enviado

- Resposta: sim, aceitou o date
- Tipo de date escolhido
- Data escolhida
- Horário escolhido
- Mensagem opcional

## Personalização rápida

No `index.html`, altere os textos principais do convite e o e-mail do formulário, se quiser.
No `style.css`, altere as cores dentro de `:root`.
No `script.js`, altere as frases do botão “não” em `noMessages`.
