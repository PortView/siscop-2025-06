import { notifyError } from './bugsnag-config';

/**
 * Manipulador global de erros para a aplicação
 * Captura erros não tratados e os processa adequadamente
 */
export const setupGlobalErrorHandler = () => {
  // Captura erros não tratados em promises
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Erro não tratado em promise:', event.reason);
    
    // Se for um objeto de erro, notifica o Bugsnag (se estiver habilitado)
    if (event.reason instanceof Error) {
      notifyError(event.reason);
    } else {
      // Caso contrário, cria um novo objeto de erro
      notifyError(new Error(`Erro não tratado: ${String(event.reason)}`));
    }
  });

  // Captura erros não tratados em geral
  window.addEventListener('error', (event) => {
    console.error('Erro global:', event.error);
    
    if (event.error) {
      notifyError(event.error);
    }
  });

  // Substitui a configuração do console.error para capturar erros registrados
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Mantém o comportamento original
    originalConsoleError(...args);
    
    // Verifica se o primeiro argumento é um erro
    if (args[0] instanceof Error) {
      notifyError(args[0]);
    }
    // Não notifica strings de erro para evitar duplicação
  };
};

/**
 * Função auxiliar para capturar e tratar erros em funções assíncronas
 * @param fn Função assíncrona a ser executada
 * @param errorMessage Mensagem de erro personalizada (opcional)
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage = 'Ocorreu um erro na operação'
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    console.error(errorMessage, error);
    
    // Notifica o Bugsnag se estiver habilitado
    if (error instanceof Error) {
      notifyError(error);
      return [null, error];
    }
    
    // Se não for um objeto Error, cria um
    const wrappedError = new Error(errorMessage);
    notifyError(wrappedError);
    return [null, wrappedError];
  }
}
