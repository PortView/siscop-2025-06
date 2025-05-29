// Configuração do Bugsnag para monitoramento de erros
// Esta configuração pode ser ativada em ambientes de produção

// Flag para habilitar ou desabilitar o Bugsnag
const BUGSNAG_ENABLED = false;

// ID correto da aplicação Bugsnag (exemplo fictício com 32 caracteres hexadecimais)
// Substitua por um ID válido quando necessário
const BUGSNAG_APP_ID = '36a89c62-7595-4435-87c1-e77002fe5e0f';

// Função para inicializar o Bugsnag apenas se estiver habilitado
export const initBugsnag = () => {
  // Se o Bugsnag estiver desabilitado, não faz nada
  if (!BUGSNAG_ENABLED) {
    console.log('Bugsnag está desabilitado. Monitoramento de erros não está ativo.');
    return null;
  }

  // Caso contrário, tentaria inicializar o Bugsnag (código comentado para referência futura)
  /*
  try {
    // Código de inicialização do Bugsnag iria aqui
    // Exemplo: Bugsnag.start({ apiKey: BUGSNAG_APP_ID });
    return true;
  } catch (error) {
    console.error('Erro ao inicializar Bugsnag:', error);
    return null;
  }
  */
  
  return null;
};

// Exporta uma função de notificação segura que só funciona se o Bugsnag estiver habilitado
export const notifyError = (error: Error) => {
  if (!BUGSNAG_ENABLED) {
    // Se o Bugsnag estiver desabilitado, apenas registra no console
    console.error('Erro capturado (Bugsnag desabilitado):', error);
    return;
  }
  
  // Caso contrário, notificaria o Bugsnag (código comentado para referência futura)
  /*
  try {
    // Código para notificar o Bugsnag iria aqui
    // Exemplo: Bugsnag.notify(error);
  } catch (e) {
    console.error('Erro ao notificar Bugsnag:', e);
  }
  */
};
