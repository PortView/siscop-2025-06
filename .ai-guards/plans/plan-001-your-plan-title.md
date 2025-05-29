---
id: plan-001
title: Plano de Upgrade: Next.js v15 e Tailwind CSS
createdAt: 2025-05-27
author: Roberto Luiz Veiga
status: draft
---

## 🧩 Scope

Atualizar o projeto Siscop da versão atual do Next.js (13.4.19) para a Next.js v15, e atualizar o Tailwind CSS (3.3.3) para a versão mais recente compatível, garantindo a manutenção da funcionalidade existente e aplicando as melhores práticas.

## ✅ Functional Requirements

- Manter todas as funcionalidades existentes da aplicação Siscop após o upgrade.
- Garantir que a navegação, o roteamento e a renderização de páginas e componentes continuem funcionando como esperado.
- Assegurar que as APIs `cookies` e `headers` sejam refatoradas para o modelo assíncrono do Next.js 15 e funcionem corretamente, especialmente em relação à autenticação e gerenciamento de sessão.
- A estilização com Tailwind CSS deve permanecer intacta e funcional em todos os componentes e páginas.
- A aplicação deve ser compilada (`build`) com sucesso e executada (`dev`, `start`) sem erros críticos após as atualizações.

## ⚙️ Non-Functional Requirements

- **Performance:** Manter ou melhorar o desempenho geral da aplicação (tempo de carregamento, interatividade) após o upgrade. Next.js 15 visa melhorias de performance que devem ser aproveitadas.
- **Security:** Manter o nível de segurança da aplicação. O upgrade não deve introduzir novas vulnerabilidades. As dependências atualizadas devem ser versões estáveis e seguras.
- **Scalability:** A aplicação deve permanecer escalável com as novas versões das dependências.
- **Maintainability:** O código deve permanecer legível e manutenível, seguindo as convenções do Next.js 15 e Tailwind CSS.

## 📚 Guidelines & Packages

- **Guidelines:**
    - Seguir as diretrizes de codificação e estrutura do projeto Siscop.
    - Utilizar Git para controle de versão com um branch dedicado para o upgrade (ex: `feature/upgrade-next15`).
    - Consultar e seguir as recomendações oficiais de upgrade da documentação do Next.js e Tailwind CSS.
- **Packages to Upgrade (principais):**
    - `next`: `13.4.19` -> `latest` (visando v15)
    - `react`: `18.2.0` -> `latest` (compatível com Next.js 15)
    - `react-dom`: `18.2.0` -> `latest` (compatível com Next.js 15)
    - `eslint-config-next`: `13.4.19` -> `latest`
    - `tailwindcss`: `3.3.3` -> `latest`
    - `postcss`: Versão atual -> `latest`
    - `autoprefixer`: Versão atual -> `latest`
    - `@types/react`: Versão atual -> `latest`
    - `@types/react-dom`: Versão atual -> `latest`
    - `@types/node`: Versão atual -> `latest`

## 🔐 Threat Model

- **Principal Ponto de Atenção:** A refatoração das APIs `cookies` e `headers` para o modelo assíncrono no Next.js 15. É crucial garantir que a manipulação de tokens de autenticação e dados de sessão continue segura e correta para evitar vulnerabilidades como XSS ou fixação de sessão.
- Revisar o impacto das novas versões das dependências em quaisquer outras áreas sensíveis à segurança da aplicação.
- Verificar se as dependências atualizadas possuem vulnerabilidades conhecidas e aplicar patches ou atualizações adicionais, se necessário, após o upgrade inicial.

## � Execution Plan

1. First implementation step
2. Second implementation step
3. Third implementation step

## 🚀 Passos Detalhados para o Upgrade

### 1. Preparação

Antes de iniciar o processo de upgrade, é crucial realizar os seguintes passos:

*   **[ ] Backup do Projeto:**
    *   Crie um backup completo do seu projeto. Use um sistema de controle de versão como Git e crie um novo branch para o upgrade (ex: `git checkout -b feature/upgrade-next15`).
    *   `git commit -am "Checkpoint antes do upgrade para Next.js 15"`
*   **[ ] Verificar Versão do Node.js:**
    *   Next.js 15 pode exigir uma versão mais recente do Node.js. Consulte a documentação oficial do Next.js 15 para os requisitos de versão do Node.js (geralmente as versões LTS mais recentes são recomendadas).
    *   Atualize o Node.js e o npm/yarn, se necessário.
*   **[ ] Ler as Notas de Lançamento:**
    *   Consulte as notas de lançamento (release notes) do Next.js para todas as versões entre a sua atual (13.4.19) e a 15. Isso ajudará a identificar todas as breaking changes e depreciações.
    *   [Next.js Releases](https://nextjs.org/blog)

### 2. Upgrade das Dependências

#### 2.1. Next.js e Pacotes Relacionados

Você tem duas opções principais para atualizar o Next.js:

*   **[ ] Opção 1: Usar Next.js Codemods (Recomendado pela Vercel)**
    *   Codemods ajudam a automatizar algumas das atualizações de código necessárias.
    *   Comando:
        ```bash
        npx @next/codemod@canary upgrade latest
        ```
    *   Após rodar o codemod, inspecione as alterações feitas.

*   **[ ] Opção 2: Atualização Manual dos Pacotes**
    *   Se preferir controle manual ou se o codemod não cobrir tudo.
    *   Comando para npm (certifique-se de que `react` e `react-dom` também sejam compatíveis, `@latest` geralmente funciona):
        ```bash
        npm i next@latest react@latest react-dom@latest eslint-config-next@latest
        ```
    *   Atualize também os pacotes de tipagem, se estiver usando TypeScript:
        ```bash
        npm i -D @types/react@latest @types/react-dom@latest @types/node@latest
        ```

#### 2.2. Tailwind CSS e Pacotes Relacionados

*   **[ ] Atualizar Tailwind CSS, PostCSS e Autoprefixer:**
    *   Geralmente, as versões mais recentes do Tailwind CSS são compatíveis com as versões mais recentes do Next.js.
    *   Comando para npm:
        ```bash
        npm i -D tailwindcss@latest postcss@latest autoprefixer@latest
        ```

### 3. Lidar com Breaking Changes

#### 3.1. Next.js 15

*   **[ ] APIs `cookies` e `headers` Assíncronas:**
    *   **Principal Breaking Change:** Em Next.js 15, as APIs `cookies()` e `headers()` de `next/headers` se tornam **totalmente assíncronas**.
    *   Qualquer código que as utilize de forma síncrona (ex: `const token = cookies().get('token')`) precisará ser refatorado para usar `async/await` ou `.then()`.
    *   **Ação:** Revise todo o código que utiliza `cookies()` ou `headers()` e aplique a refatoração para o modelo assíncrono.

*   **[ ] Outras Breaking Changes:**
    *   Revise cuidadosamente as notas de lançamento do Next.js 14 e 15 para outras possíveis breaking changes que possam afetar seu projeto.

#### 3.2. Tailwind CSS

*   **[ ] Revisar Notas de Lançamento do Tailwind CSS:**
    *   Verifique as notas de lançamento das versões do Tailwind CSS entre a sua atual (3.3.3) e a mais recente para quaisquer breaking changes ou atualizações na configuração (`tailwind.config.js`).

### 4. Pós-Upgrade

*   **[ ] Limpar e Reinstalar Dependências:**
    *   Remova `node_modules` e o arquivo de lock (`package-lock.json` ou `yarn.lock`):
        ```bash
        rm -rf node_modules
        rm -f package-lock.json yarn.lock
        ```
    *   Reinstale todas as dependências:
        ```bash
        npm install
        ```

*   **[ ] Linter e Formatador:**
    *   Execute suas ferramentas de linting e formatação:
        ```bash
        npm run lint --fix
        ```

*   **[ ] Testes Extensivos:**
    *   **Build de Produção:** `npm run build`
    *   **Servidor de Desenvolvimento:** `npm run dev`
    *   Navegue por todas as páginas e funcionalidades.
    *   Foco nos testes: funcionalidades com `cookies`/`headers`, roteamento, renderização, estilização.

### 5. Resolução de Problemas

*   **[ ] Consultar Documentação:** Oficial do Next.js e Tailwind CSS.
*   **[ ] GitHub Issues:** Verificar repositórios por issues relatadas.
*   **[ ] Analisar Erros:** Mensagens de erro de build/runtime.

---

**Conclusão do Upgrade:**

*   [ ] Todas as etapas concluídas.
*   [ ] Aplicação testada e funcionando conforme esperado.
*   [ ] Branch de upgrade mergeado na branch principal.
*   `git commit -am "Upgrade para Next.js 15 e Tailwind CSS bem-sucedido"`
