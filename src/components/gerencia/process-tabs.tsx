"use client";
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplianceSectionNew } from './compliance-section';
import { SiscopCliente, SiscopUnidade } from '@/lib/types';
import TableConform from './table-conform';

interface ProcessTabsProps {
  selectedClient: SiscopCliente | null;
  selectedUnit?: SiscopUnidade | null;
}

export function ProcessTabs({ selectedClient, selectedUnit }: ProcessTabsProps) {
  // Exemplo de tabs verticais 100% Tailwind puro
  const [activeTab, setActiveTab] = useState('conformidade');
  const tabs = [
    {
      key: 'conformidade',
      label: 'Conformidades',
      content: (
        <div className="max-w-[1860px] min-w-[1860px] h-full flex flex-col items-start justify-start p-0 overflow-x-auto">
          <ComplianceSectionNew selectedClient={selectedClient} selectedUnit={selectedUnit} />
        </div>
      ),
    },
    { key: 'desenhos', label: 'Desenhos', content: 'Conteúdo da aba Desenhos (Tailwind puro)' },
    { key: 'detalhe', label: 'Detalhe', content: 'Conteúdo da aba Detalhe (Tailwind puro)' },
    { key: 'caract', label: 'Carac.', content: 'Conteúdo da aba Carac. (Tailwind puro)' },
  ];

  return (
    <>
      {/* EXEMPLO: TABS VERTICAIS TAILWIND PURO */}
      <div className="flex w-[1890px] h-[520px] ml-1 mb-8 rounded-lg overflow-hidden border border-blue-100">
        {/* Lista de abas com labels na vertical */}
        <div className="flex flex-col w-10 bg-[#d0e0f0] border-r border-blue-200 items-center justify-start">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`flex items-center justify-center h-24 w-2 transition-colors border-l-4 focus:outline-none focus:ring-2 focus:ring-blue-400
                ${activeTab === tab.key ? 'bg-white text-blue-800 border-blue-600 shadow-md' : 'text-gray-600 border-transparent hover:bg-blue-50'}`}
              onClick={() => setActiveTab(tab.key)}
              aria-selected={activeTab === tab.key}
              aria-controls={`tab-panel-${tab.key}`}
              role="tab"
              tabIndex={activeTab === tab.key ? 0 : -1}
              style={{ minWidth: '52px', minHeight: '120px' }}
            >
              <span className="transform -rotate-90 whitespace-nowrap text-xs font-semibold select-none">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        {/* Conteúdo da aba selecionada */}
        <div className="flex-1 flex items-start justify-start bg-white" role="tabpanel" id={`tab-panel-${activeTab}`}>  
          <span className="text-blue-700 text-sm font-medium">{tabs.find(tab => tab.key === activeTab)?.content}</span>
        </div>
      </div>


    </>
  );
}