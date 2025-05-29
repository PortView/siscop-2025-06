"use client";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // Importar Inter e Roboto_Mono
import "./globals.css";
import { LoadingScreen } from "./loading/page"; // Importa o componente de loading
import MenuSuperior from "@/components/MenuSuperior"; // Importa o MenuSuperior
import { usePathname } from 'next/navigation'; // Importar usePathname
import AppProviders from "@/providers/AppProviders"; // Importar o componente de providers
import { useAuth } from "@/contexts/AuthContext"; // Importar o contexto de autenticação

// Configurar Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define a variável CSS para Inter
});

// Configurar Roboto_Mono
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono", // Define a variável CSS para Roboto_Mono
});

// Componente interno que usa o contexto de autenticação
function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Se estiver carregando e não for a página de login, mostra a tela de carregamento
  if (isLoading && !isLoginPage) {
    console.log("[Layout] Renderizando LoadingScreen (isLoading)");
    return (
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={inter.className}>
          <LoadingScreen />
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
      >
        {!isLoginPage && <MenuSuperior user={user} onLogout={logout} />}
        
        <main className={!isLoginPage && user ? "pt-16" : ""}>
          {children}
        </main>
      </body>
    </html>
  );
}

// Layout principal que fornece o contexto
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <RootLayoutContent>{children}</RootLayoutContent>
    </AppProviders>
  );
}
