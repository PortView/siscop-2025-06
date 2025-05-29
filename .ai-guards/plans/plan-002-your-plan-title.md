---
id: plan-002
title: Refatoração do Sistema de Autenticação
createdAt: 2025-05-28
author: Roberto Luiz Veiga
status: draft
---

## 🧩 Escopo

Refatoração do sistema de autenticação do SISCOP para resolver problemas de persistência de usuário e token, evitar chamadas desnecessárias à API e garantir que o MenuSuperior exiba corretamente os dados do usuário em todas as páginas protegidas.

## ✅ Requisitos Funcionais

- Usar as URLs de API definidas em .env.local para autenticação e obtenção de dados do usuário
- Após login, salvar o access-token de forma segura e disponível para todo o projeto
- Consultar a API de usuário (NEXT_PUBLIC_API_ME_URL) uma única vez para obter dados do usuário
- Armazenar dados do usuário de forma segura e disponível para todo o projeto
- Evitar consultas repetidas à API de usuário a menos que o token expire ou o usuário faça logout
- Garantir que o MenuSuperior exiba os dados do usuário em todas as páginas exceto login
- Criar uma página de teste simples acessível via menu (Técnico > Analista) para validar a solução
- Verificar o funcionamento da página process-control após confirmar que a página de teste funciona

## ⚙️ Requisitos Não-Funcionais

- Performance: Minimizar chamadas à API, utilizando localStorage para persistência de dados
- Segurança: Garantir que o token de acesso seja armazenado e transmitido de forma segura
- Manutenibilidade: Centralizar a lógica de autenticação em um contexto React para facilitar manutenção
- Usabilidade: Fornecer feedback visual durante o processo de autenticação (telas de carregamento)

## 📚 Diretrizes & Pacotes

- Seguir o padrão de projeto Context API do React para gerenciamento de estado global
- Utilizar o NextJS e suas funcionalidades nativas para roteamento e gerenciamento de estado
- Utilizar Tailwind CSS para estilização, mantendo o design atual do projeto
- Não adicionar pacotes externos além dos já utilizados no projeto

## 🔐 Modelo de Ameaças

- Expiração de token não tratada adequadamente, resultando em estado inconsistente
- Acesso não autorizado a rotas protegidas devido a falhas na verificação de autenticação
- Armazenamento inseguro de credenciais no localStorage
- Possível exposição de dados sensíveis em logs de depuração

## 🔢 Plano de Execução

1. Criar um contexto de autenticação centralizado (AuthContext) para gerenciar o estado do usuário e token
2. Criar um componente de providers que envolverá a aplicação com os contextos necessários
3. Atualizar a página de login para usar o contexto de autenticação
4. Simplificar o layout principal para usar o contexto de autenticação
5. Criar uma página de teste para o técnico analista para validar a solução
6. Atualizar a página process-control para usar o contexto de autenticação
7. Atualizar o MenuSuperior para adicionar o link para a página do técnico analista
8. Atualizar a página inicial para redirecionar corretamente com base no estado de autenticação
9. Testar o fluxo completo de autenticação e navegação
