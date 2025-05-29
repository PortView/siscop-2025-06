// src/lib/env.ts
// Centraliza as variáveis de ambiente usadas no projeto.
// ATENÇÃO: Certifique-se de definir NEXT_PUBLIC_API_CONFORMIDADE_URL em seu .env.local

export const API_CONFORMIDADE_URL = process.env.NEXT_PUBLIC_API_CONFORMIDADE_URL as string;
export const API_SERVICOS_URL = process.env.NEXT_PUBLIC_API_SERVICOS_URL as string;
export const API_FOLLOWUP_URL = process.env.NEXT_PUBLIC_API_FOLLOWUP_URL as string;
export const API_CLIENTES_URL = process.env.NEXT_PUBLIC_API_CLIENTES_URL as string;
export const API_UNIDADES_URL = process.env.NEXT_PUBLIC_API_UNIDADES_URL as string;

