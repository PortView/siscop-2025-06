"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  // Usando useRef para valores iniciais para evitar problemas de hidratação
  const initialRender = useRef(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();

  // Se já autenticado, redireciona para principal
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
    
    // Define os valores iniciais apenas no cliente após a primeira renderização
    if (initialRender.current) {
      setEmail("mauro@ameni.com.br");
      setPassword("$Gbgb");
      initialRender.current = false;
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    try {
      // Usa a função login do contexto de autenticação
      await login(email, password);
      // O redirecionamento é feito dentro da função login
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Erro ao autenticar");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-bold">SISCOP</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">E-mail</span>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Senha</span>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors mt-2 disabled:opacity-60 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
          {error && (
            <span className="text-red-600 text-sm text-center mt-2">{error}</span>
          )}
        </form>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="flex flex-col items-center gap-4 bg-card px-8 py-6 rounded-lg shadow-lg border border-blue-400 animate-fade-in">
            <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-12 w-12 mb-4"></div>
            <span className="text-lg font-semibold">Entrando... Aguarde</span>
          </div>
        </div>
      )}
    </div>
  );
}
