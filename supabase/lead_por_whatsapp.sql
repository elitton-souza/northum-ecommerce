-- Busca, pelo número do WhatsApp, o lead mais recente que preencheu o formulário do site.
-- Usada pela Nina para começar o pré-atendimento já sabendo os dados do lead.
--
-- Como usar: no Supabase, projeto leads_northum > SQL Editor > New query,
-- cole este arquivo inteiro e clique em Run.
--
-- Aceita o número em qualquer formato: "5547999616637", "+55 (47) 99961-6637",
-- "554799616637" (o WhatsApp às vezes manda números do Brasil sem o 9) ou
-- "5547999616637@s.whatsapp.net". Compara DDD + os 8 últimos dígitos.
--
-- Só a chave secreta (service_role / secret) pode chamar. O site não consegue.

create or replace function public.lead_por_whatsapp(numero text)
returns setof public.leads
language sql
stable
set search_path = public
as $$
  with n as (
    select regexp_replace(split_part(coalesce(numero, ''), '@', 1), '\D', '', 'g') as d
  ),
  k as (
    select case when length(d) >= 12 and left(d, 2) = '55' then substr(d, 3) else d end as d
    from n
  )
  select l.*
  from public.leads l, k
  where length(k.d) between 10 and 11
    and substr(l.whatsapp, 4, 2) = left(k.d, 2)
    and right(l.whatsapp, 8) = right(k.d, 8)
  order by l.criado_em desc
  limit 1;
$$;

revoke all on function public.lead_por_whatsapp(text) from public, anon, authenticated;
grant execute on function public.lead_por_whatsapp(text) to service_role;
