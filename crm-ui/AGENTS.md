# AGENTS.md — crm-ui

Isto é para VOCÊ, agente de código, quando o Bruno pedir para instalar,
gerar ou alterar uma tela do CotaFlow usando este pacote.

## Modelo mental

`crm-ui` funciona como o `shadcn/ui`: **não é uma dependência de
runtime**. `npx crm-ui add <nome>` copia arquivos `.tsx`/`.css` de
dentro do pacote para dentro do repo do projeto (por padrão em
`src/components/crm-ui/`). Depois de copiado, o código passa a
pertencer ao projeto — edite-o à vontade, sem "voltar" pro pacote.

## Primeira vez num projeto

```bash
npx crm-ui init
```
Isso escreve `src/components/crm-ui/tokens.css` +
`tailwind.snippet.js` e cria `crm-ui.json` na raiz. Depois disso:

1. `@import` do `tokens.css` no CSS global do projeto (uma vez só).
2. Merge do conteúdo de `tailwind.snippet.js` dentro de `theme.extend` do
   `tailwind.config.js` do projeto — não sobrescreva o que já existir lá,
   só adicione as chaves novas (`colors`, `borderRadius`, `boxShadow`,
   `fontFamily`, `fontSize`).

## Instalando um componente ou tela

```bash
npx crm-ui list                       # ver o catálogo
npx crm-ui add button card pageheader # componentes específicos
npx crm-ui add visao-geral            # tela pronta (traz dependências junto)
npx crm-ui add screens-spec           # markdown de composição das outras 8 telas
```

O CLI resolve dependências sozinho (ex.: pedir `statcard` também traz
`card`). Arquivos que já existem no destino são pulados por padrão —
use `--force` só se tiver certeza de que não há edição local a perder.

## Gerando uma tela que ainda não está pronta

`visao-geral` e `crm` já vêm implementadas. As outras 8 (Conversas,
Agentes, Testar agente, Agenda, Integrações, Conhecimento, Alertas,
Configurações) só têm a especificação, não o `.tsx`:

1. `npx crm-ui add screens-spec` — isso copia
   `docs/SCREENS_SPEC.md` pro projeto.
2. Abra `reference/cotaflow-app.html#<nome-da-tela>` (dentro do pacote,
   em `node_modules/crm-ui/reference/`, ou peça pro Bruno já ter essa
   pasta salva em algum lugar do repo) — é a fonte visual definitiva.
3. Instale os componentes que a spec dessa tela pede
   (`npx crm-ui add <componente1> <componente2> ...`).
4. Escreva o `.tsx` da tela nova em
   `src/components/crm-ui/screens/<Nome>.tsx`, seguindo exatamente o
   padrão de composição de `VisaoGeral.tsx`/`CRM.tsx` (PageHeader no topo,
   conteúdo em grid de Cards) e usando só os componentes instalados —
   nunca crie `<div>` estilizado à mão quando um primitivo já resolve.

## Regras que não podem ser quebradas

- **Uma cor de acento só** (`--accent`, mapeada em Tailwind como
  `accent`/`accent-soft`/`accent-line`). As únicas semânticas extras são
  `ok` (sucesso) e `warn` (atenção/escalada). Não crie uma terceira.
- **Um raio só** (`rounded-ds` = 6px) em cards, botões, inputs, tags.
  Círculos/avatares/pills usam `rounded-ds-full`.
- **`font-mono` só para dado numérico** (horário, %, R$, contador, id).
  Todo o resto é `font-sans`.
- **Hairlines (`border-line`) separam seções — não sombra.** `shadow-ds`
  é decorativo e sutil, e é vazio no dark por design.
- **Dark mode é `[data-theme="dark"]` trocando `var(--x)`, nunca classe
  `dark:` espalhada pelo componente.** Se algo parece precisar de
  `dark:bg-...`, o token errado está sendo usado — corrija o token, não
  adicione a classe.
- **Não invente token novo sem necessidade.** Se faltar, adicione nos dois
  temas dentro de `tokens.css` antes de usar em qualquer componente.
- **Um só botão `variant="primary"` por tela/seção.** Ações concorrentes
  usam `default` ou `ghost`.

## Prompt pronto pra pedir uma tela nova

> "Rode `npx crm-ui add screens-spec` e os componentes necessários
> pra tela `<nome>`. Leia a seção `<nome>` em `docs/SCREENS_SPEC.md` e
> abra `reference/cotaflow-app.html#<nome>` pra ver o layout definitivo.
> Gere `screens/<Nome>.tsx` só com os componentes de
> `components/crm-ui`, no mesmo padrão de `VisaoGeral.tsx`."
