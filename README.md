# northum-ecommerce

Site da **Northum** para a **Nina, IA de vendas da Northum**: ela atende os leads da empresa no WhatsApp, qualifica, organiza o funil e passa para a equipe na hora certa.

A copy segue o dossiê de produto da Nina: só promete o que já está no produto e não usa números de resultado (conversão, clientes, tempo médio) enquanto eles não existirem.

A página `vsl/` ainda descreve a oferta antiga (Método Conversão 7D) e não tem link no site.

Site estático (HTML, CSS e JavaScript, sem build).

## Estrutura

- `index.html`: página principal
- `privacidade.html`: política de privacidade (rascunho, revisar juridicamente)
- `config.js`: dados editáveis (nome, WhatsApp, e-mail, destino do formulário, exibição de preço)
- `assets/css/styles.css`: estilos no sistema visual Norte (Sora e Inter, meia-noite e ouro)
- `assets/js/main.js`: conversa animada do topo, botão Assumir, menu, animações, validação e envio do formulário
- `assets/brand/`: arquivos oficiais do logo (SVG e PNG)
- `PROMPT_SITE_CONVERSAO_7D.md`: briefing de implementação do site

## Como visualizar

Abra o `index.html` no navegador ou sirva a pasta com qualquer servidor estático.

## Antes de publicar

Preencha o `config.js` (WhatsApp, e-mail, `FORM_ENDPOINT`) e revise a política de privacidade com um advogado.
