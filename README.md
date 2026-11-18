# northum-ecommerce

Site da **Northum**: agente de IA que atende o WhatsApp de e-commerces 24/7, com painel ao vivo (botão Assumir), kanban e dashboard das conversas.

A página `vsl/` ainda descreve a oferta antiga (Método Conversão 7D) e não tem link no site.

Site estático (HTML, CSS e JavaScript, sem build).

## Estrutura

- `index.html`: página principal
- `privacidade.html`: política de privacidade (rascunho, revisar juridicamente)
- `config.js`: dados editáveis (nome, WhatsApp, e-mail, destino do formulário, exibição de preço)
- `assets/css/styles.css`: estilos e paleta de cores
- `assets/js/main.js`: chat animado, menu, animações, validação e envio do formulário
- `PROMPT_SITE_CONVERSAO_7D.md`: briefing de implementação do site

## Como visualizar

Abra o `index.html` no navegador ou sirva a pasta com qualquer servidor estático.

## Antes de publicar

Preencha o `config.js` (WhatsApp, e-mail, `FORM_ENDPOINT`) e revise a política de privacidade e a garantia de execução com um advogado.
