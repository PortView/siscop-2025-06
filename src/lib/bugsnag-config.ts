/**
 * Configuração do Bugsnag para monitoramento de erros
 * 
 * Este arquivo substitui qualquer configuração existente do Bugsnag
 * e garante que a aplicação não apresente erros relacionados à configuração.
 */

// Objeto global para armazenar a configuração do Bugsnag
interface BugsnagConfig {
  appId: string;
  apiKey: string;
  enabled: boolean;
  releaseStage: string;
}

// Configuração padrão (desabilitada para desenvolvimento)
const config: BugsnagConfig = {
  // ID corrigido com 32 caracteres hexadecimais
  appId: '36a89c62-7595-4435-87c1-e77002fe5e0f',
  apiKey: 'seu-api-key-aqui',
  enabled: false, // Desabilitado por padrão
  releaseStage: process.env.NODE_ENV || 'development'
};

// Função para inicializar o Bugsnag
export const initBugsnag = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Se o Bugsnag já estiver definido no objeto window, substitui a configuração
    if ((window as any).Bugsnag) {
      console.log('Substituindo configuração existente do Bugsnag');
      
      // Desativa o Bugsnag existente
      (window as any).Bugsnag = {
        start: () => console.log('Bugsnag desabilitado para desenvolvimento'),
        notify: () => console.log('Notificação do Bugsnag desabilitada para desenvolvimento'),
        // Implementa outros métodos necessários para evitar erros
        getPlugin: () => null,
        addMetadata: () => {},
        leaveBreadcrumb: () => {},
        isStarted: () => false
      };
      
      return (window as any).Bugsnag;
    }
    
    // Se não existir, cria um objeto Bugsnag simulado
    (window as any).Bugsnag = {
      start: () => console.log('Bugsnag desabilitado para desenvolvimento'),
      notify: () => console.log('Notificação do Bugsnag desabilitada para desenvolvimento'),
      // Implementa outros métodos necessários para evitar erros
      getPlugin: () => null,
      addMetadata: () => {},
      leaveBreadcrumb: () => {},
      isStarted: () => false
    };
    
    return (window as any).Bugsnag;
  } catch (error) {
    console.error('Erro ao configurar Bugsnag:', error);
    return null;
  }
};

// Função para notificar erros (segura, não causa erros se o Bugsnag não estiver disponível)
export const notifyError = (error: Error, metadata?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  try {
    if ((window as any).Bugsnag && config.enabled) {
      (window as any).Bugsnag.notify(error, (event: any) => {
        if (metadata) {
          Object.entries(metadata).forEach(([section, data]) => {
            event.addMetadata(section, data);
          });
        }
      });
    } else {
      // Apenas registra no console se o Bugsnag estiver desabilitado
      console.error('Erro capturado (Bugsnag desabilitado):', error);
      if (metadata) {
        console.error('Metadados:', metadata);
      }
    }
  } catch (e) {
    console.error('Erro ao notificar Bugsnag:', e);
  }
};

export default {
  initBugsnag,
  notifyError
};
