-- Tabela que recebe os leads do formulário "Agendar demonstração" do site.
-- Como usar: no Supabase, abra o projeto leads_northum > SQL Editor > New query,
-- cole este arquivo inteiro e clique em Run.

create table if not exists public.leads (
  id                          uuid primary key default gen_random_uuid(),
  criado_em                   timestamptz not null default now(),

  -- Passo 1: contato
  nome                        text not null check (char_length(nome) between 2 and 120),
  email                       text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  whatsapp                    text not null check (whatsapp ~ '^\+55[0-9]{10,11}$'),
  empresa                     text not null check (char_length(empresa) between 1 and 160),

  -- Passo 2: sobre os leads
  segmento                    text not null check (char_length(segmento) <= 80),
  leads_por_mes               text not null check (char_length(leads_por_mes) <= 40),
  equipe_comercial            text not null check (char_length(equipe_comercial) <= 40),
  como_responde_hoje          text check (char_length(como_responde_hoje) <= 80),

  -- Consentimento e origem
  aceite_politica_privacidade boolean not null default false,
  origem                      text check (char_length(origem) <= 80),
  pagina                      text check (char_length(pagina) <= 200),
  utm_source                  text check (char_length(utm_source) <= 200),
  utm_medium                  text check (char_length(utm_medium) <= 200),
  utm_campaign                text check (char_length(utm_campaign) <= 200),
  utm_term                    text check (char_length(utm_term) <= 200),
  utm_content                 text check (char_length(utm_content) <= 200),

  -- Para a equipe comercial acompanhar
  status                      text not null default 'novo'
                              check (status in ('novo', 'em contato', 'demonstração marcada', 'cliente', 'descartado')),
  observacoes                 text
);

create index if not exists leads_criado_em_idx on public.leads (criado_em desc);

-- Segurança: o site só pode INSERIR leads. Ninguém de fora consegue ler,
-- alterar ou apagar. Você vê os leads pelo painel do Supabase (Table Editor).
alter table public.leads enable row level security;

drop policy if exists "site insere leads" on public.leads;
create policy "site insere leads"
  on public.leads
  for insert
  to anon
  with check (status = 'novo' and observacoes is null);

revoke all on public.leads from anon, authenticated;
grant insert (
  nome, email, whatsapp, empresa, segmento, leads_por_mes, equipe_comercial,
  como_responde_hoje, aceite_politica_privacidade, origem, pagina,
  utm_source, utm_medium, utm_campaign, utm_term, utm_content
) on public.leads to anon;
