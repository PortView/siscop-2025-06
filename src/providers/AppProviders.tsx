"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import QueryClientProviderComponent from "@/components/providers/QueryClientProvider";
import { ToastProvider } from "@/components/ui/toast-provider";

/**
 * Componente AppProviders
 * 
 * Este componente centraliza todos os providers da aplicação,
 * garantindo que os contextos estejam disponíveis em toda a aplicação
 * na ordem correta de aninhamento.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProviderComponent>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProviderComponent>
  );
}

export default AppProviders;
