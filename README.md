# NLW - AI

[Material complementar](https://efficient-sloth-d85.notion.site/NLW-13-IA-dc54c0a8b5c04d8198cef71627852d73)

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
