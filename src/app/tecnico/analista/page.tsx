"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnalistaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Se estiver carregando, mostra mensagem de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-lg">Carregando...</span>
      </div>
    );
  }

  // Se não estiver autenticado, não mostra nada (será redirecionado)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="bg-card p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Tela do Técnico</h1>
          <p className="text-lg">
            Bem-vindo à área do técnico analista, {user.name}!
          </p>
          <p className="mt-4 text-muted-foreground">
            Esta é uma página de teste para verificar a autenticação.
          </p>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Dados do Usuário:</h2>
            <ul className="text-left">
              <li><strong>Nome:</strong> {user.name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Tipo:</strong> {user.tipo}</li>
              <li><strong>Código:</strong> {user.cod}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
