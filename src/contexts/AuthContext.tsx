"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Interface para o usuário
export interface User {
  id: number;
  name: string;
  email: string;
  cod: number;
  tipo: string;
  // Adicione outros campos conforme necessário
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Chaves para o localStorage
const TOKEN_KEY = "access-token";
const USER_KEY = "siscop_user";

// Provider do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Verificar se há um usuário no localStorage
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("[AuthContext] Usuário carregado do localStorage:", JSON.parse(storedUser).name);
          setIsLoading(false);
          return;
        }

        // Se não há usuário, mas há token, buscar usuário da API
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          console.log("[AuthContext] Token encontrado, buscando dados do usuário...");
          await fetchUserData(token);
        } else {
          console.log("[AuthContext] Nenhum token encontrado, usuário não autenticado");
          setUser(null);
        }
      } catch (error) {
        console.error("[AuthContext] Erro ao verificar autenticação:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função para buscar dados do usuário
  const fetchUserData = async (token: string) => {
    try {
      console.log("[AuthContext] Buscando dados do usuário na API...");
      const response = await fetch(process.env.NEXT_PUBLIC_API_ME_URL!, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do usuário: ${response.status}`);
      }

      const userData = await response.json();
      console.log("[AuthContext] Dados do usuário obtidos com sucesso:", userData.name);
      
      // Salvar usuário no localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("[AuthContext] Erro ao buscar dados do usuário:", error);
      // Se houver erro, limpar token e usuário
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      throw error;
    }
  };

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("[AuthContext] Iniciando processo de login...");
      // Fazer login na API
      const response = await fetch(process.env.NEXT_PUBLIC_API_AUTH_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }

      const data = await response.json();
      
      if (!data["access_token"]) {
        throw new Error("Token não retornado pela API");
      }
      
      console.log("[AuthContext] Login bem-sucedido, token obtido");
      
      // Salvar token no localStorage
      localStorage.setItem(TOKEN_KEY, data["access_token"]);
      
      // Buscar dados do usuário com o token
      await fetchUserData(data["access_token"]);
      
      // Redirecionar para a página principal
      router.replace("/");
    } catch (error) {
      console.error("[AuthContext] Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    console.log("[AuthContext] Realizando logout...");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    router.push("/login");
  };

  // Valor do contexto
  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
