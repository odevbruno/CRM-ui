# Publicando o crm-ui no npm

Este pacote é privado ao seu uso (não precisa ser público globalmente).
Duas opções:

## Opção A — npm público (mais simples, qualquer um pode instalar)

```bash
cd crm-ui
npm login                 # sua conta npm
npm publish --access public
```

Se `crm-ui` já estiver em uso por outra pessoa no registry público,
escolha um nome com escopo, ex. `@brunodev/crm-ui`:

```json
// package.json
{ "name": "@brunodev/crm-ui" }
```

```bash
npm publish --access public
```

E instala no projeto com `npx @brunodev/crm-ui init`.

## Opção B — sem publicar em lugar nenhum (uso só seu)

Não precisa de npm registry pra nada disso funcionar. Duas formas:

**1. Instalar direto de uma pasta local:**
```bash
cd caminho/do/projeto-do-crm
npm install /caminho/absoluto/para/crm-ui
npx crm-ui init
```

**2. Instalar direto de um repositório git (GitHub privado, por exemplo):**
```bash
npm install github:seu-usuario/crm-ui
npx crm-ui init
```

Qualquer uma das três formas dá o mesmo resultado: o `bin/cli.js` fica
disponível via `npx crm-ui`, e ele só copia arquivos — nunca faz o
projeto depender deste pacote em runtime.

## Versionando mudanças

Quando você editar um componente aqui na pasta `crm-ui` de origem
(não no projeto onde foi instalado) e quiser que ele fique disponível pra
reinstalar:

1. Edite o `.tsx` fonte.
2. Rode o gerador de registry (`gen_registry.py`, se você mantiver esse
   script por perto) ou edite direto o JSON correspondente em
   `registry/items/<nome>.json` — o campo `files[].content` é o código
   inteiro como string.
3. Suba a versão em `package.json` (`npm version patch`) e publique de novo
   (ou apenas faça commit/push se estiver usando instalação via git).
