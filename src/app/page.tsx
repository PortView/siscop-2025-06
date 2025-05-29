"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Página inicial
 * 
 * Esta página redireciona o usuário com base no estado de autenticação:
 * - Se não estiver autenticado: redireciona para /login
 * - Se estiver autenticado: exibe a tela de boas-vindas
 */

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não estiver carregando e o usuário não estiver autenticado, redirecionar para login
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Enquanto estiver carregando, mostrar tela de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-lg">Carregando...</span>
      </div>
    );
  }

  // Se não estiver autenticado ou estiver carregando, mostra mensagem de redirecionamento
  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">SISCOP</h1>
          <p className="text-lg">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se estiver autenticado, mostra a tela de boas-vindas
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
          Bem-vindo ao Sistema de Controle de Processos
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-300 text-center mb-8">
          Selecione uma opção no menu superior para começar
        </p>
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-lg w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Usuário Autenticado</h2>
            <p className="mb-2"><span className="font-medium">Nome:</span> {user.name}</p>
            <p className="mb-2"><span className="font-medium">Tipo:</span> {user.tipo}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {user.email}</p>
          </div> 
        </div>*/}
      </main>
    </div>
  );
}
