// Funções mínimas para evitar erro de importação. Implemente a lógica real conforme necessário.

// Utilitário para obter token do localStorage
import { LOCAL_STORAGE_TOKEN_KEY } from '@/lib/constants';

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || "";
  }
  return "";
}

// CLIENTES
export async function fetchClientes(codcoor: number) {
  const url = new URL(process.env.NEXT_PUBLIC_API_CLIENTES_URL!);
  url.searchParams.set("codcoor", codcoor.toString());

  const token = getToken();
  // Log para debug: mostra URL, codcoor e início do token
  console.log('[API][CLIENTES] URL--:', url.toString());
  console.log('[API][CLIENTES] Parâmetros--:', {
    url: url.toString(),
    codcoor,
    tokenPreview: token ? token.substring(0, 8) + '...' : 'NULO'
  });

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    //credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar clientes");
  return res.json();
}

// UNIDADES
export async function fetchUnidades({ codcoor, codcli, uf, page = 1 }: { codcoor: number, codcli: number, uf: string, page?: number }) {
  const url = new URL(process.env.NEXT_PUBLIC_API_UNIDADES_URL!);
  url.searchParams.set("codcoor", codcoor.toString());
  url.searchParams.set("codcli", codcli.toString());
  url.searchParams.set("uf", uf);
  url.searchParams.set("page", page.toString());

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getToken()}` },
    //credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar unidades");
  return res.json();
}

// SERVIÇOS
export async function fetchServicos(params: {
  qcodCoor: number,
  qcontrato: number,
  qUnidade: number,
  qConcluido: boolean,
  qCodServ: number,
  qStatus: string,
  qDtlimite: string
}) {
  const url = new URL(process.env.NEXT_PUBLIC_API_SERVICOS_URL!);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getToken()}` },
    //credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar serviços");
  return res.json();
}

// FOLLOWUP
export async function fetchFollowup(codserv: number) {
  const url = new URL(process.env.NEXT_PUBLIC_API_FOLLOWUP_URL!);
  url.searchParams.set("codserv", codserv.toString());

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getToken()}` },
    //credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar followup");
  return res.json();
}

// CONFORMIDADE
export async function fetchConformidade(params: {
  codimov: number,
  web: boolean,
  relatorio: boolean,
  cnpj: string,
  temcnpj: boolean
}) {
  const url = new URL(process.env.NEXT_PUBLIC_API_CONFORMIDADE_URL!);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getToken()}` },
    //credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao buscar conformidade");
  return res.json();
}
