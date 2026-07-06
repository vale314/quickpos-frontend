// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Usamos useState para asegurar que el QueryClient se cree solo una vez por ciclo de vida
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2, // Reintenta un par de veces antes de fallar
            refetchOnWindowFocus: false, // En móvil esto suele causar peticiones innecesarias
            staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar la data obsoleta
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}