// Utilitário simples para classes condicional (tailwind)
export function cn(...args: any[]): string {
  return args.filter(Boolean).join(' ');
}
