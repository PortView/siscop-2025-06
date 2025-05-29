// Tela de Carregamento (Loading)
export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-16 w-16 mb-4"></div>
        <h2 className="text-xl font-bold">Entrando... Aguarde</h2>
      </div>
    </div>
  );
}
