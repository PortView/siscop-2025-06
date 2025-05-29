"use client";

import { useState } from 'react';
import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Opcional para debug

export default function QueryClientProviderComponent({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Exemplo de opções padrão, ajuste conforme necessário
        // staleTime: 1000 * 60 * 5, // 5 minutos
        // refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {/* Descomente para usar as ferramentas de desenvolvimento do React Query */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </TanStackQueryClientProvider>
  );
}
