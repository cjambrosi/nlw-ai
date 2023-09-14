# NLW - AI

[Material complementar](https://efficient-sloth-d85.notion.site/NLW-13-IA-dc54c0a8b5c04d8198cef71627852d73)

[Repositório oficial](https://github.com/rocketseat-education/nlw-ai-mastery)

Dicas de ferramentas:

- httpie: <https://httpie.io>
- REST Client for VSCode : <https://marketplace.visualstudio.com/items?itemName=humao.rest-client>
- Aramazenamento de arquivos em Clund:
  - [Amazon S3](https://aws.amazon.com/s3)
  - [Cloudflare R2](https://developers.cloudflare.com/r2)
    - Não cobra taxa de egress, ou seja, taxa de download.

Dicas:

- No Javascript quando temos um número muito grande como `1048576`, para visualizar melhor as casas dos milhares é possível utilizar o **undernline** (`_`), ficando `1_048_576`. Isso não afetará o valor.

## Front-end

Instalar e configurar o [shadcn/ui](https://ui.shadcn.com) com [Tailwind CSS](https://tailwindcss.com) e [Radix UI](https://www.radix-ui.com).

- Tailwind CSS

  Instalar:

  > npm i -D tailwindcss postcss autoprefixer

  Configurar:

  > npx tailwindcss init -p

- No arquivo `tsconfig.json` em `compilerOptions` adicionar o código a baixo:

  ```json
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
  ```

- Instalar o `@types/node`:

  > npm i -D @types/node

- Atualizar o arquivo `vite.config.ts` com o código a baixo:

  ```typescript
  import path from "path"
  import react from "@vitejs/plugin-react"
  import { defineConfig } from "vite"
  
  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  })
  ```

- Excutar o CLI do **shadcn/ui** para configurar o projeto com as configurações realizadas:

  > npx shadcn-ui@latest init

- Comando para adicionarmos componentes do **shadcn/ui** no projeto automaticamente:

  > npx shadcn-ui@latest add button

Instalar a biblioteca [Lucide React](https://lucide.dev) para ícones:

> npm i lucide-react

## Back-end

Iniciar configuração do Node.js:

> npm init -y

Instalar dependências de desenvolvimento:

> npm i -D typescript @types/node tsx

Instalar o framework [fastify](https://fastify.dev) para rotas HTTP:

> npm i fastify

Instalar a lib [fastify-multipart](https://github.com/fastify/fastify-multipart):

> npm i @fastify/multipart

Instalar e configurar o [Prisma ORM](https://www.prisma.io)

- Instalação:

  > npm i -D prisma

- Configuração com SQLite:

  > npx prisma init --datasource-provider sqlite

- Comando para gerar migrations do Prisma no ambiente de desenvolvimento:

  > npx prisma migrate dev

- Visualizar o banco de dados com CLI do Prisma:

  > npx prisma studio

Instalar o [zod](https://zod.dev) para validação:

> mpm i zod

Instalar a biblioteca [openai](https://www.npmjs.com/package/openai):

> npm i openai
