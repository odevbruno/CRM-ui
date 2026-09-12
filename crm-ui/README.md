# crm-ui

Design system do CotaFlow, no modelo **shadcn/ui**: não é uma dependência
compilada em `node_modules` — o CLI **copia o código-fonte** (componentes
React/TypeScript + tokens CSS) direto pro seu projeto. Depois de instalado,
o código é seu: edite, quebre, estenda à vontade, sem precisar dar `eject`
em nada.

## Instalação num projeto

```bash
npx crm-ui init
```

Isso cria `src/components/crm-ui/tokens.css` (tokens de cor/radius/
fonte, light + dark) e `tailwind.snippet.js` (extensão de tema pra colar no
seu `tailwind.config.js`), e salva um `crm-ui.json` na raiz do projeto
lembrando onde tudo foi instalado.

```bash
# ver o que existe
npx crm-ui list

# instalar componentes específicos (resolve dependências sozinho)
npx crm-ui add button card pageheader

# instalar uma tela inteira (traz os componentes que ela usa junto)
npx crm-ui add visao-geral crm

# sobrescrever arquivos já existentes
npx crm-ui add button --force
```

Por padrão tudo vai para `src/components/crm-ui/{components,screens}`.
Use `--dir` no `init` pra mudar isso:

```bash
npx crm-ui init --dir src/ui/cotaflow
```

## O que tem no registry

- **Componentes:** Button, Tag/Chip (Badge), Card, StatCard, Segmented,
  Field/Input/Select/Textarea/Switch, Sidebar, PageHeader, Table,
  ThemeToggle, cn.
- **Telas prontas:** `visao-geral`, `crm` — completas, compostas só com os
  componentes acima.
- **`screens-spec`:** Markdown com a composição das outras 8 telas
  (Conversas, Agentes, Testar agente, Agenda, Integrações, Conhecimento,
  Alertas, Configurações), pra um agente de código gerar a partir daqui.
- **`reference/cotaflow-app.html`:** o mockup original navegável por hash
  (`#conversas`, `#agentes`...) — fonte visual definitiva, pixel a pixel.

## Documentação visual (link público)

Este repo já traz `docs/index.html` (galeria de componentes) e
`docs/screens.html` (as 10 telas navegáveis por hash) prontos pra virar um
link público via **GitHub Pages**, sem precisar de build:

1. Suba o repo pro GitHub.
2. Vá em **Settings → Pages** → em "Build and deployment", escolha
   **Source: GitHub Actions** (o repo já traz
   `.github/workflows/pages.yml`, que publica `docs/` automaticamente a
   cada push em `main`).
   - Alternativa sem Actions: escolha **Deploy from a branch**, branch
     `main`, pasta **`/docs`**.
3. Em alguns segundos o GitHub mostra a URL, algo como
   `https://SEU_USUARIO.github.io/crm-ui/`.
   - Galeria de componentes: essa URL.
   - Telas completas: a mesma URL + `screens.html`.

Antes de subir, edite o link "GitHub" no topo de `docs/index.html`
(procure por `SEU_USUARIO/crm-ui`) para apontar pro seu repo de verdade.

Toda vez que você editar um componente e regenerar o registry, vale rodar
de novo o script que copia o CSS pra `docs/` (ou editar `docs/index.html`
à mão) pra a galeria não ficar desatualizada — ela é só uma vitrine visual,
não lê o registry em tempo real.

## Depois de instalado

O código vive no seu repo, não neste pacote. Se quiser trazer uma versão
nova de um componente específico, rode `add` de novo com `--force` — mas
isso sobrescreve qualquer edição local que você tenha feito nele, então
prefira copiar manualmente o que mudou se já tiver customizado.

## Publicando uma versão nova deste pacote

Veja `PUBLISHING.md`.

## Para agentes de código

Veja `AGENTS.md` — tem o passo a passo e as regras de uso dos tokens que
não podem ser quebradas.
