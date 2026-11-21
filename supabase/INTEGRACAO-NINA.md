# Integração: Nina busca os dados do lead no Supabase

Quando alguém preenche o formulário do site, o lead fica salvo na tabela `leads`
do projeto Supabase **leads_northum**. Na tela de obrigado, o lead toca em
"Falar com a Nina" e envia esta mensagem pelo WhatsApp:

> Oi, Nina! Sou {nome}, da {empresa}. Acabei de pedir uma demonstração da Northum pelo site.

A Nina usa o número de quem escreveu para buscar o restante no Supabase.

## No Supabase (uma vez)

Rodar `supabase/lead_por_whatsapp.sql` no SQL Editor. Ele cria a função
`lead_por_whatsapp(numero)`, que só a chave secreta pode chamar.

## Chamada

```
POST https://xcapfhqegjvrfwqdncqu.supabase.co/rest/v1/rpc/lead_por_whatsapp
apikey: <SUPABASE_SECRET_KEY>
Authorization: Bearer <SUPABASE_SECRET_KEY>
Content-Type: application/json

{ "numero": "5547999616637" }
```

- Aceita o número em qualquer formato, inclusive `554799616637@s.whatsapp.net`
  e números do Brasil sem o 9.
- Responde uma lista com 0 ou 1 lead (o mais recente daquele número).
- Campos: `nome`, `email`, `whatsapp`, `empresa`, `segmento`, `leads_por_mes`,
  `equipe_comercial`, `como_responde_hoje`, `criado_em`, `status`, `observacoes`,
  `origem`, `pagina`, `utm_*`.

## Marcar que a Nina começou o atendimento (opcional)

```
PATCH https://xcapfhqegjvrfwqdncqu.supabase.co/rest/v1/leads?id=eq.<id>
apikey / Authorization: <SUPABASE_SECRET_KEY>
Content-Type: application/json
Prefer: return=minimal

{ "status": "em contato" }
```

## Segurança

- A chave secreta (`sb_secret_...` ou `service_role`) fica só no servidor da
  Nina, em variável de ambiente. Nunca no site, no código versionado ou no navegador.
- O site usa só a chave publishable, que consegue apenas inserir leads.
