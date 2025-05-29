"use client";
import ThemeToggle from "@/components/ThemeToggle";
import Link from 'next/link';
import { useEffect, useState } from "react";

const menus = [
  {
    label: "Administração",
    submenu: [
      { label: "Atribuições" },
      { label: "Atribuições Receita Cargos" },
    ],
  },
  {
    label: "Cadastro",
    submenu: [
      { label: "Clientes" },
      { label: "Imóveis" },
      { label: "Contratos" },
    ],
  },
  {
    label: "Gerência",
    submenu: [
      { label: "Controle de Processos", href: "/gerencia/process-control" },
      { label: "Lib. Fatur. Gerência" },
      { label: "Lib. Fixa. Gerência" },
      { label: "Copia de Conf. p/ outro imóvel" },
      { label: "Copia de Conf. p/ vários imóveis" },
    ],
  },
  {
    label: "Técnico",
    submenu: [
      { label: "Analista", href: "/tecnico/analista" },
    ],
  },
  {
    label: "Consultas",
    submenu: [
      { label: "Aval.Conformidades" },
      { label: "Planilhas Dinâmicas" },
      { label: "Medição Cliente" },
      { label: "Medição Faturamento" },
      { label: "Pendências" },
      { label: "Emol Pagos" },
      { label: "Faturamento Gerência" },
      { label: "Produção Faturamento" },
    ],
  },
];

export default function MenuSuperior({
  user,
  onLogout,
}: {
  user: { name: string; tipo: string; email: string } | null;
  onLogout: () => void;
}) {
  console.log('[MenuSuperior] Renderizando. Props recebidas:', { user, естьLogout: !!onLogout }); // Log adicionado

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mouseOverMenu, setMouseOverMenu] = useState<string | null>(null); // Novo estado

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Verifica se o clique foi fora dos elementos do menu que podem estar abertos
      // Esta lógica pode precisar de ajuste dependendo da estrutura exata do DOM e se os menus são portais
      const target = event.target as HTMLElement;
      if (openMenu && !target.closest('.menu-item-wrapper')) { // Adicione uma classe aos wrappers dos itens de menu
        setOpenMenu(null);
      }
    }
    if (openMenu) {
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [openMenu]);

  const handleMenuEnter = (label: string) => {
    setOpenMenu(label);
    setMouseOverMenu(label);
  };

  const handleMenuLeave = () => {
    // Atrasar o fechamento para permitir a transição para o submenu
    setTimeout(() => {
      if (mouseOverMenu !== openMenu) { // Só fecha se o mouse não estiver sobre o submenu aberto
        setOpenMenu(null);
      }
    }, 100); // Pequeno delay, ajuste conforme necessário
    setMouseOverMenu(null); // Reseta o estado do mouse sobre o menu principal
  };

  const handleSubMenuEnter = () => {
    if (openMenu) {
      setMouseOverMenu(openMenu); // Indica que o mouse está sobre o submenu do menu aberto
    }
  };

  const handleSubMenuLeave = () => {
    setMouseOverMenu(null);
    setOpenMenu(null); // Fecha se sair do submenu também
  };

  return (
    <header className="w-full bg-card border-b border-black/10 dark:border-white/10 px-4 py-2 flex items-center justify-between shadow-sm fixed top-0 left-0 z-30">
      {/* Esquerda: Logo/Nome */}
      <div className="flex items-center gap-2">
        <a href="/" className="text-xl font-bold tracking-wide text-blue-600 dark:text-blue-400 hover:underline">
          Siscop
        </a>
      </div>
      {/* Centro: Menus */}
      <nav className="hidden md:flex gap-4">
        {menus.map((menu) => (
          <div
            key={menu.label}
            className="relative menu-item-wrapper" // Adicionada classe para handleClickOutside
            onMouseEnter={() => handleMenuEnter(menu.label)}
            onMouseLeave={handleMenuLeave}
          >
            <button
              className="px-3 py-1 rounded font-medium hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle ao clicar, mas mantém aberto se já estiver via hover
                setOpenMenu(openMenu === menu.label && mouseOverMenu === menu.label ? null : menu.label);
                setMouseOverMenu(menu.label); // Garante que o clique também marque como mouse sobre
              }}
              type="button"
            >
              {menu.label}
            </button>
            {/* Dropdown */}
            {openMenu === menu.label && (
              <div
                className="absolute left-0 top-full mt-1 min-w-max rounded shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50 animate-fade-in"
                onMouseEnter={handleSubMenuEnter} // Adicionado
                onMouseLeave={handleSubMenuLeave} // Adicionado
              >
                {menu.submenu.map((item) => (
                  item.href ? (
                    <Link href={item.href} key={item.label} className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer text-sm whitespace-nowrap">
                      {item.label}
                    </Link>
                  ) : (
                    <div
                      key={item.label}
                      className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer text-sm whitespace-nowrap"
                      // onClick={() => item.action && item.action()} // Exemplo se você tivesse ações
                    >
                      {item.label}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {/* Direita: Usuário, Tema, Logoff */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex flex-col items-end mr-2">
            <span className="font-semibold leading-tight">{user.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{user.tipo}</span>
          </div>
        )}
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-lg">
          {user ? user.name.split(" ").map((n) => n[0]).join("") : <span>M</span>}
        </div>
        {/* Botão tema */}
        <ThemeToggle />
        {/* Logoff */}
        <button
          onClick={onLogout}
          className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors font-medium text-sm"
        >
          Logoff
        </button>
      </div>
    </header>
  );
}
