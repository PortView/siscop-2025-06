"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { SiscopConformidade, SiscopCliente, SiscopUnidade } from '@/lib/types';
import { formatDate } from '@/lib/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TableConform from './table-conform';

// Props esperadas para o componente de Compliance
interface ComplianceSectionProps {
  selectedClient: SiscopCliente | null;
  selectedUnit?: SiscopUnidade | null;
}

export function ComplianceSectionNew({ selectedClient, selectedUnit }: ComplianceSectionProps) {
  // CNPJ selecionado
  const [cnpj, setCnpj] = useState<string | null>(null);
  // Checkbox para relatório
  const [onlyForReport, setOnlyForReport] = useState<boolean>(false);
  // Lista de CNPJs disponíveis
  const [cnpjs, setCnpjs] = useState<string[]>([]);
  const [loadingCnpjs, setLoadingCnpjs] = useState<boolean>(false);
  // Documentos de conformidade
  const [complianceDocuments, setComplianceDocuments] = useState<SiscopConformidade[]>([]);
  const [loadingCompliance, setLoadingCompliance] = useState<boolean>(false);

  // Busca CNPJs do cliente selecionado
  useEffect(() => {
    if (!selectedClient) {
      setCnpjs([]);
      return;
    }
    setLoadingCnpjs(true);
    fetch(`/api/clientes?codcli=${selectedClient.codcli}&cnpjs=1`)
      .then((res): Promise<string[]> => res.json())
      .then((data) => setCnpjs(Array.isArray(data) ? data : []))
      .catch(() => setCnpjs([]))
      .finally(() => setLoadingCnpjs(false));
  }, [selectedClient]);

  // Atualiza documentos de conformidade ao trocar cliente, CNPJ ou filtro
  useEffect(() => {
    if (!selectedClient || !cnpj) {
      setComplianceDocuments([]);
      return;
    }
    setLoadingCompliance(true);
    fetch(`/api/conformidade?codcli=${selectedClient.codcli}&cnpj=${cnpj}&onlyForReport=${onlyForReport}`)
      .then((res): Promise<SiscopConformidade[]> => res.json())
      .then((data) => setComplianceDocuments(Array.isArray(data) ? data : []))
      .catch(() => setComplianceDocuments([]))
      .finally(() => setLoadingCompliance(false));
  }, [selectedClient, cnpj, onlyForReport]);

  return (

    <div className="bg-[#d0e0f0] border-none shadow-md w-full rounded-l-none">
    <CardContent className="p-2">
      <div className="flex justify-between items-end mb-2 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-row items-center gap-1">
            {/* <Label htmlFor="cnpj" className="text-xs text-red-500 font-medium z-50">CNPJ</Label> */}
            <div className="text-xs text-zinc-950 font-medium z-50">CNPJ</div>
            <Select
              id="cnpj"
              disabled={!selectedClient || cnpjs.length === 0}
              value={cnpj ?? ""}
              onChange={e => setCnpj(e.target.value)}
              className="h-10 text-xs w-52"
            >
              <option value="" disabled>
                Selecione um CNPJ
              </option>
              {cnpjs.map((item) => (
                <option key={item} value={item} className="text-xs">
                  {item}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center space-x-1">
            <Checkbox
              id="onlyForReport"
              checked={false}
              onChange={e => setOnlyForReport(e.target.checked)}
              className="h-3 w-3"
            />
            <div className="text-xs text-zinc-950">Somente p/ relatório</div>
          </div>
        </div>

        <div className="flex gap-1 h-10">
          <Button variant="secondary" className="h-10 py-0 px-2 bg-green-100 border-green-300 text-green-800 hover:bg-green-200 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Inserir
          </Button>
          <Button variant="secondary" className="h-10 py-0 px-2 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 text-xs">
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="danger" className="h-10 py-0 px-2 bg-red-100 border-red-300 text-red-800 hover:bg-red-200 text-xs">
            <Trash2 className="h-3 w-3 mr-1" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="rounded-l-none rounded-r-md border overflow-hidden">
        {!selectedUnit ? (
          <div className="flex items-center justify-center p-20 h-[430px]">
            <p className="text-md text-zinc-900">Selecione uma unidade para visualizar os documentos de conformidade.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <TableConform
              codimov={selectedUnit?.codend || 0}
              web={false}
              relatorio={true}
              cnpj=""
              temcnpj={false}
            />
          </div>
        )}
      </div>
    </CardContent>
  </div>


  );
}