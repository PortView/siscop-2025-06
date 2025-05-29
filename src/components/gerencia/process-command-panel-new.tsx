import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SiscopCliente, SiscopUnidade } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { fetchClientes, fetchUnidades } from '@/lib/api-service';
import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USER_KEY } from '@/lib/constants';
import { FileText, Edit, AlertCircle, DollarSign, ShoppingCart, ClipboardList, Trash2, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
// import { ApiParamDialog } from '@/components/api-param-dialog';

interface ProcessCommandPanelProps {
  onClientChange?: (clientId: number) => void;
  onUnitChange?: (unit: SiscopUnidade) => void;
}

export function ProcessCommandPanel({ onClientChange, onUnitChange }: ProcessCommandPanelProps) {
  // Hook de toast
  const toast = useToast();
  // Referências para controle de processamento
  const isProcessingClientChange = useRef(false);
  const isProcessingUfChange = useRef(false);
  const lastFetchedParams = useRef<{ codcli?: number, uf?: string } | null>(null);

  // Estados principais
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedUF, setSelectedUF] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SiscopUnidade | null>(null);
  const [manualUFSelection, setManualUFSelection] = useState<boolean>(false);

  // Estados para dados e operações
  const [codCoor, setCodCoor] = useState<number>(0);
  const [units, setUnits] = useState<SiscopUnidade[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [unitsError, setUnitsError] = useState<Error | null>(null);

  // Estados UI e filtragem
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [apiParams, setApiParams] = useState({
    token: null as string | null,
    codcoor: null as number | null,
    codcli: null as number | null,
    uf: null as string | null,
    page: 1
  });
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [ufSearchTerm, setUfSearchTerm] = useState<string>('');
  const [unitSearchTerm, setUnitSearchTerm] = useState<string>('');
  const [allUfs, setAllUfs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [shouldShowPagination, setShouldShowPagination] = useState(false);

  // Carregar dados do usuário uma única vez e inicializar estados
  // DEBUG FORÇADO: Mostra token no console e em alert ao montar componente
  if (typeof window !== 'undefined') {
    const tokenKey = LOCAL_STORAGE_TOKEN_KEY;
    const tokenVal = localStorage.getItem(tokenKey);

  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // DEBUG: Exibir chave e valor do token na tela e no console
    const tokenKey = LOCAL_STORAGE_TOKEN_KEY;
    const tokenVal = localStorage.getItem(tokenKey);

    // Exibir no DOM para debug visual
    // const debugDiv = document.createElement('div');
    // debugDiv.style.position = 'fixed';
    // debugDiv.style.bottom = '30px';
    // debugDiv.style.left = '50%';
    // debugDiv.style.transform = 'translateX(-50%)';
    // debugDiv.style.background = '#222';
    // debugDiv.style.color = '#fff';
    // debugDiv.style.padding = '10px 20px';
    // debugDiv.style.zIndex = '9999';
    // debugDiv.style.fontSize = '14px';
    // debugDiv.style.borderRadius = '8px';
    // debugDiv.innerText = `TOKEN_KEY: ${tokenKey}\nToken: ${tokenVal ? tokenVal.substring(0, 16) + '...' : 'NULO'}`;
    // document.body.appendChild(debugDiv);
    // setTimeout(() => debugDiv.remove(), 8000);

    // Ao carregar a página, o checkbox deve estar unchecked e desabilitado
    setAllUfs(false);

    // Limpar todos os estados iniciais
    setSelectedClient(null);
    setSelectedUF(null);
    setSelectedUnit(null);
    setUnits([]);

    try {
      // Obter token
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

      // Obter dados do usuário
      const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (!userJson) return;

      const userData = JSON.parse(userJson);
      if (userData?.cod) {
        setCodCoor(userData.cod);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
    }
  }, []);

  // Query para carregar clientes (API real, sem mock, conforme consumo-de-apis.md)
  const {
    data: clients = [],
    isLoading: isLoadingClients,
    isError: isErrorClients,
    error: clientsError
  } = useQuery<SiscopCliente[]>({
    queryKey: ['siscop-clientes', codCoor],
    queryFn: async () => {
      if (!codCoor) return [];
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      if (!token) throw new Error('Token de acesso não encontrado.');
      try {
        // fetchClientes já envia o token e codcoor corretamente
        const result = await fetchClientes(codCoor);
        if (!Array.isArray(result)) throw new Error('Resposta inesperada da API de clientes.');
        return result;
      } catch (error: any) {
        toast('Erro ao buscar clientes: ' + (error?.message || 'Erro desconhecido'), { variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!codCoor,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // UFs disponíveis para o cliente selecionado
  const ufs = useMemo(() => {
    if (!selectedClient) return [];
    const clientData = clients.find((c: SiscopCliente) => c.codcli === selectedClient);
    return clientData?.lc_ufs?.map((u: any) => u.uf) || [];
  }, [selectedClient, clients]);

  // Listas filtradas para os dropdowns (filtragem ocorre apenas após 3 caracteres)
  const filteredClients = useMemo(() => {
    const trimmedTerm = clientSearchTerm.trim();
    // Retornar todos os clientes se o termo de busca for vazio ou tiver menos de 3 caracteres
    if (!trimmedTerm || trimmedTerm.length < 3) return clients;
    // Aplicar filtro apenas se tiver 3 ou mais caracteres
    return clients.filter((client: SiscopCliente) =>
      client.fantasia.toLowerCase().includes(trimmedTerm.toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  const filteredUfs = useMemo(() => {
    const trimmedTerm = ufSearchTerm.trim();
    // Retornar todas as UFs se o termo de busca for vazio ou tiver menos de 3 caracteres
    if (!trimmedTerm || trimmedTerm.length < 3) return ufs;
    // Aplicar filtro apenas se tiver 3 ou mais caracteres
    return ufs.filter((uf: string) =>
      uf.toLowerCase().includes(trimmedTerm.toLowerCase())
    );
  }, [ufs, ufSearchTerm]);

  const filteredUnits = useMemo(() => {
    const trimmedTerm = unitSearchTerm.trim();
    // Retornar todas as unidades se o termo de busca for vazio ou tiver menos de 3 caracteres
    if (!trimmedTerm || trimmedTerm.length < 3) return units;
    // Aplicar filtro apenas se tiver 3 ou mais caracteres
    return units.filter(unit => {
      const unitStr = `${unit.contrato} - ${unit.cadimov?.uf || ''} - ${unit.cadimov?.tipo || ''}`;
      return unitStr.toLowerCase().includes(trimmedTerm.toLowerCase());
    });
  }, [units, unitSearchTerm]);

  // Função interna para limpar o cache de unidades
  const clearUnitsCacheInternal = (client: number, uf: string, coorCode: number) => {
    if (!client || !uf || !coorCode) return;

    // Limpar chave específica do localStorage
    const cacheKey = `units_${coorCode}_${client}_${uf}_1`;
    console.log(`Limpando cache para ${cacheKey}`);
    localStorage.removeItem(cacheKey);
  };

  // Função para limpar o cache de unidades (versão com hook)
  const clearUnitsCache = useCallback((client: number, uf: string) => {
    clearUnitsCacheInternal(client, uf, codCoor);
  }, [codCoor]);

  // Função memoizada para carregar unidades com validação de parâmetros duplicados
  const fetchUnitsIfNeeded = useCallback(async (
    codcli: number,
    uf: string,
    processingRef: React.MutableRefObject<boolean>,
    shouldForceRefresh = true // Agora por padrão sempre forçamos refresh
  ) => {
    // Se já estiver processando, evitamos requisições duplicadas
    if (processingRef.current) {
      return null;
    }

    // Verificar se é uma mudança real de cliente/UF ou se é apenas um recarregamento
    const isParameterChange =
      lastFetchedParams.current?.codcli !== codcli ||
      lastFetchedParams.current?.uf !== uf;

    // Sempre limpar cache quando mudar cliente ou UF
    if (isParameterChange && codCoor) {
      clearUnitsCacheInternal(codcli, uf, codCoor);
    }

    // Marcar como em processamento
    processingRef.current = true;

    // Limpar unidades enquanto carrega novos dados
    setUnits([]);

    // Atualizar parâmetros da última busca
    lastFetchedParams.current = { codcli, uf };

    if (!codCoor) {
      processingRef.current = false;
      return null;
    }

    setIsLoadingUnits(true);
    setUnitsError(null);

    try {
      const params = { codcoor: codCoor, codcli, uf, page: 1 };

      console.log(`Buscando unidades para cliente ${codcli} e UF ${uf}`);

      // Sempre forçar recarga de dados (sem usar cache) para garantir dados atualizados
      // Independente se é troca de cliente, UF ou não
      const options = { skipCache: true };
      const response = await fetchUnidades(params);

      if (!response?.folowups) {
        setUnits([]);
        processingRef.current = false;
        setSelectedUnit(null); // Garantir que nenhuma unidade esteja selecionada se não houver dados
        return null;
      }

      // Atualizar unidades
      setUnits(response.folowups);

      // Atualizar informações de paginação
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.lastPage);
        setTotalItems(response.pagination.totalItems);

        // Mostrar paginação apenas se houver mais de 100 itens
        setShouldShowPagination(response.pagination.totalItems > 100);
      } else {
        // Reset paginação se não houver dados de paginação
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
        setShouldShowPagination(false);
      }

      // Verificar se há unidades
      if (response.folowups.length === 0) {
        toast(`Nenhuma unidade encontrada. Não há unidades para este cliente na UF ${uf}.`);
        processingRef.current = false;
        setSelectedUnit(null); // Garantir que nenhuma unidade esteja selecionada
        return null;
      }

      // Selecionar primeira unidade com timeout para evitar renders excessivos
      if (response.folowups.length > 0) {
        const firstUnit = response.folowups[0];
        setTimeout(() => {
          setSelectedUnit(firstUnit);
          processingRef.current = false;
        }, 100);
      }

      return response;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      setUnitsError(error as Error);
      toast(`Erro ao buscar unidades: ${(error as Error).message || 'Erro desconhecido ao buscar unidades.'}`);
      processingRef.current = false;
      setSelectedUnit(null); // Garantir que nenhuma unidade esteja selecionada em caso de erro
      return null;
    } finally {
      setIsLoadingUnits(false);
    }
  }, [codCoor]);

  // Handler para recarregar unidades manualmente (botão "Tentar novamente")
  const refetchUnits = useCallback(() => {
    if (!selectedClient || !selectedUF) {
      toast('Parâmetros incompletos. Cliente e UF são necessários para buscar unidades.');
      return;
    }

    fetchUnitsIfNeeded(selectedClient, selectedUF, isProcessingUfChange, true);
  }, [selectedClient, selectedUF, fetchUnitsIfNeeded]);

  // Função para carregar unidades com paginação
  const loadPagedUnits = useCallback((pageNumber: number) => {
    if (!selectedClient || !codCoor) return;

    // Se não houver UF selecionada e o checkbox Todas UFs estiver desmarcado, não fazer nada
    if (!selectedUF && !allUfs) return;

    // Determinar a UF a ser usada
    const ufParam = allUfs ? "ZZ" : selectedUF;

    if (!ufParam) return;

    setIsLoadingUnits(true);

    const params = {
      codcoor: codCoor,
      codcli: selectedClient,
      uf: ufParam,
      page: pageNumber
    };

    // Força o refresh do cache
    fetchUnidades(params)
      .then(response => {
        if (response?.folowups) {
          setUnits(response.folowups);

          // Atualizar informações de paginação
          if (response.pagination) {
            setCurrentPage(response.pagination.currentPage);
            setTotalPages(response.pagination.lastPage);
            setTotalItems(response.pagination.totalItems);

            // Mostrar paginação apenas se houver mais de 100 itens
            setShouldShowPagination(response.pagination.totalItems > 100);
          }

          if (response.folowups.length > 0) {
            // Selecionar primeira unidade
            setTimeout(() => {
              setSelectedUnit(response.folowups[0]);
            }, 100);
          }
        }
      })
      .catch(error => {
        setUnitsError(error as Error);
        toast('Erro ao buscar unidades: ' + (error as Error).message);
      })
      .finally(() => {
        setIsLoadingUnits(false);
      });
  }, [selectedClient, selectedUF, allUfs, codCoor]);

  // Handler para o diálogo de API
  const showParamsDialog = useCallback(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    setApiParams({
      token: token || 'não disponível',
      codcoor: Number(codCoor) || 0,
      codcli: Number(selectedClient) || 0,
      uf: selectedUF || 'não disponível',
      page: 1
    });

    setIsVerifyDialogOpen(true);
  }, [codCoor, selectedClient, selectedUF]);

  const handleConfirmApiCall = useCallback(() => {
    setIsVerifyDialogOpen(false);
    refetchUnits();
  }, [refetchUnits]);

  // Manipulador de alteração de cliente
  const handleClientChange = useCallback((codcli: number) => {
    // Limpar cache do cliente/UF anterior se existir
    if (selectedClient && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
    }

    // Definir o novo cliente
    setSelectedClient(codcli);

    // Forçar remoção da seleção manual de UF para permitir seleção automática
    setManualUFSelection(false);

    // Limpar seleções atuais
    setSelectedUnit(null);
    setUnits([]);

    // Encontrar a primeira UF do novo cliente selecionado e defini-la imediatamente
    const clientData = clients.find((c: any) => c.codcli === codcli);
    if (clientData?.lc_ufs?.length) {
      const firstClientUF = clientData.lc_ufs[0].uf;
      console.log(`Cliente alterado para ${codcli}, definindo primeira UF: ${firstClientUF}`);
      setSelectedUF(firstClientUF);
    } else {
      // Se o cliente não tiver UFs, limpar a UF selecionada
      setSelectedUF(null);
    }

    // Notificar o componente pai
    if (onClientChange) {
      onClientChange(codcli);
    }
  }, [onClientChange, selectedClient, selectedUF, clearUnitsCache, clients]);

  // Manipulador de alteração de UF
  const handleUFChange = useCallback((uf: string) => {
    // Limpar cache do cliente/UF anterior se existir
    if (selectedClient && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
    }

    // Limpar possível cache para a nova combinação cliente/UF
    if (selectedClient && uf) {
      clearUnitsCache(selectedClient, uf);
    }

    setSelectedUF(uf);
    setManualUFSelection(true);
    setSelectedUnit(null);
    setUnits([]); // Limpar unidades ao mudar a UF
    setIsLoadingUnits(true); // Mostrar estado de carregamento
  }, [selectedClient, selectedUF, clearUnitsCache]);

  // Removemos o efeito de selecionar UF automaticamente,
  // pois isso agora é feito diretamente no handleClientChange
  // para evitar condições de corrida e garantir a ordem correta das operações

  // Efeito: carregar unidades quando UF e cliente estiverem definidos
  useEffect(() => {
    if (!selectedClient || !selectedUF) return;

    // Limpar cache atual antes de buscar novas unidades
    clearUnitsCache(selectedClient, selectedUF);

    // Use a referência apropriada dependendo se foi mudança manual de UF ou automática
    const processingRef = manualUFSelection ? isProcessingUfChange : isProcessingClientChange;

    fetchUnitsIfNeeded(selectedClient, selectedUF, processingRef);
  }, [selectedClient, selectedUF, manualUFSelection, fetchUnitsIfNeeded, clearUnitsCache]);

  // Efeito: quando a unidade muda, notificar o componente pai
  useEffect(() => {
    if (!selectedUnit || !onUnitChange) return;

    const timer = setTimeout(() => {
      onUnitChange(selectedUnit);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedUnit, onUnitChange]);

  return (
    <Card className="border-2 border-white shadow-md w-[940px] h-[170px] rounded-sm">
      <CardContent className="p-2 flex flex-col gap-2 bg-zinc-700 rounded-md m-0.5 h-[160px]">
        {/* Primeira linha: Cliente, UF, Todas UFs, Planilhas, Contratos ----- bg-blue-200  bg-[#bfdbfe] */}
        <div className="flex items-center gap-2 h-[50px]">
          {/* Cliente */}
          <select
            disabled={isLoadingClients}
            className="h-8 text-xs w-[380px] bg-select text-select-foreground border-border rounded-md"
            value={selectedClient || ''}
            onChange={e => handleClientChange(Number(e.target.value))}
          >
            <option value="" disabled>Selecione um cliente</option>
            {filteredClients.length > 0 ? (
              filteredClients.map((client: any) => (
                <option key={client.codcli} value={client.codcli.toString()}>
                  {client.fantasia}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhum cliente encontrado</option>
            )}
          </select>

          {/* UF - Dropdown com seleção real */}
          <select
            disabled={!selectedClient || ufs.length === 0 || allUfs}
            className="h-8 text-xs w-[100px] border-border bg-select text-select-foreground rounded-md"
            value={selectedUF || ''}
            onChange={e => handleUFChange(e.target.value)}
          >
            <option value="" disabled>Selecione UF</option>
            {ufs.length > 0 ? (
              ufs.map((uf: string) => (
                <option key={uf} value={uf}>{uf}</option>
              ))
            ) : (
              <option value="" disabled>Nenhuma UF encontrada</option>
            )}
          </select>

          {/* Checkbox Todas UFs */}
          <div className="flex items-center h-8 px-2">
            <Checkbox
              id="todas-ufs"
              checked={allUfs}
              disabled={!selectedClient}
              onChange={(checked: any) => {
                const isChecked = !!checked;
                setAllUfs(isChecked);

                // Se marcado, buscar unidades com UF="ZZ", senão usar o UF selecionado
                if (isChecked) {
                  // Buscar todas as UFs com parâmetro especial "ZZ"
                  if (selectedClient && codCoor) {
                    // Use a referência apropriada para controle de processamento
                    const params = {
                      codcoor: codCoor,
                      codcli: selectedClient,
                      uf: "ZZ", // Código especial para todas as UFs
                      page: 1
                    };

                    setIsLoadingUnits(true);
                    // Forçar requisição nova ao mudar o filtro para todas UFs
                    fetchUnidades(params)
                      .then(response => {
                        if (response?.folowups) {
                          setUnits(response.folowups);

                          // Atualizar informações de paginação
                          if (response.pagination) {
                            setCurrentPage(response.pagination.currentPage);
                            setTotalPages(response.pagination.lastPage);
                            setTotalItems(response.pagination.totalItems);

                            // Mostrar paginação apenas se houver mais de 100 itens
                            setShouldShowPagination(response.pagination.totalItems > 100);
                          } else {
                            setCurrentPage(1);
                            setTotalPages(1);
                            setTotalItems(0);
                            setShouldShowPagination(false);
                          }

                          if (response.folowups.length > 0) {
                            // Selecionar primeira unidade
                            setTimeout(() => {
                              setSelectedUnit(response.folowups[0]);
                            }, 100);
                          }
                        }
                      })
                      .catch(error => {
                        setUnitsError(error as Error);
                        toast(`Erro ao buscar unidades: ${(error as Error).message || 'Erro desconhecido ao buscar unidades.'}`);
                      })
                      .finally(() => {
                        setIsLoadingUnits(false);
                      });
                  }
                } else if (selectedClient && selectedUF && codCoor) {
                  // Ao desmarcar, voltar a usar o UF selecionado e buscar unidades normalmente
                  const params = {
                    codcoor: codCoor,
                    codcli: selectedClient,
                    uf: selectedUF,
                    page: 1
                  };

                  setIsLoadingUnits(true);
                  // Forçar requisição nova ao desmarcar "Todas UFs"
                  fetchUnidades(params)
                    .then(response => {
                      if (response?.folowups) {
                        setUnits(response.folowups);

                        // Atualizar informações de paginação
                        if (response.pagination) {
                          setCurrentPage(response.pagination.currentPage);
                          setTotalPages(response.pagination.lastPage);
                          setTotalItems(response.pagination.totalItems);

                          // Mostrar paginação apenas se houver mais de 100 itens
                          setShouldShowPagination(response.pagination.totalItems > 100);
                        } else {
                          setCurrentPage(1);
                          setTotalPages(1);
                          setTotalItems(0);
                          setShouldShowPagination(false);
                        }

                        if (response.folowups.length > 0) {
                          // Selecionar primeira unidade
                          setTimeout(() => {
                            setSelectedUnit(response.folowups[0]);
                          }, 100);
                        }
                      }
                    })
                    .catch(error => {
                      setUnitsError(error as Error);
                      toast(`Erro ao buscar unidades: ${(error as Error).message || 'Erro desconhecido ao buscar unidades.'}`);
                    })
                    .finally(() => {
                      setIsLoadingUnits(false);
                    });
                }
              }}
              className="mr-1"
            />
            <Label htmlFor="todas-ufs" className="text-secondary-foreground text-xs font-semibold">Todas UFs</Label>
          </div>

          {/* Botão Planilhas */}
          <Button
            variant="default"
            size="sm"
            className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
          >
            <FileText className="h-4 w-4 mr-1" />
            Planilhas
          </Button>

          {/* Botão Contrato */}
          <Button
            variant="default"
            size="sm"
            className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
          >
            {`Contr: ${selectedUnit?.contrato ? ('00' + selectedUnit.contrato).slice(-7) : '-----'}`}
          </Button>
        </div>

        {/* Segunda linha: Unidades e Paginação */}
        <div className="flex items-center gap-1">
          <Label htmlFor="unidades" className="text-secondary-foreground text-xs font-semibold mr-2">Unidades</Label>
          {unitsError ? (
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xs">Erro ao carregar unidades</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                  onClick={() => refetchUnits()}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Tentar novamente
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <select
                disabled={((!selectedUF && !allUfs) || isLoadingUnits || (units as SiscopUnidade[]).length === 0)}
                className="h-8 text-xs w-[450px] border-slate-500 bg-select text-select-foreground border-border rounded-md"
                value={selectedUnit ? `${selectedUnit.contrato}-${selectedUnit.codend}` : ''}
                onChange={e => {
                  const value = e.target.value;
                  const unit = (units as SiscopUnidade[]).find((u: SiscopUnidade) => u.contrato + '-' + u.codend === value);
                  if (unit) {
                    setSelectedUnit(unit);
                  }
                }}
              >
                <option value="" disabled>Selecione uma unidade</option>
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <option key={`${unit.contrato}-${unit.codend}`} value={`${unit.contrato}-${unit.codend}`}>
                      {`${unit.contrato} - ${unit.cadimov?.uf || ''} - ${unit.cadimov?.tipo || ''}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Nenhuma unidade encontrada</option>
                )}
              </select>
            </div>
          )}

          {/* Paginação - Visível apenas quando há mais de 100 itens */}
          {shouldShowPagination && (
            <div className="flex items-center gap-[2px] ml-2">
              {/* Primeira página */}
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === 1 || isLoadingUnits}
                onClick={() => loadPagedUnits(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Página anterior */}
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === 1 || isLoadingUnits}
                onClick={() => loadPagedUnits(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Exibição da página atual e total */}
              <div className="bg-blue-900 rounded h-8 px-3 flex items-center text-sm font-medium text-white border border-blue-600">
                <span>{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </div>

              {/* Próxima página */}
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === totalPages || isLoadingUnits}
                onClick={() => loadPagedUnits(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Última página */}
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === totalPages || isLoadingUnits}
                onClick={() => loadPagedUnits(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>

              {/* Input para ir para uma página específica */}
              <Input
                type="number"
                min={1}
                max={totalPages}
                className="h-8 w-26 text-sm text-center bg-blue-900 border-blue-600 text-white placeholder-blue-300"
                placeholder="Pg"
                disabled={isLoadingUnits}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget;
                    const page = parseInt(input.value);
                    if (!isNaN(page) && page >= 1 && page <= totalPages) {
                      loadPagedUnits(page);
                      // Limpar o input após navegar
                      input.value = '';
                    } else {
                      toast(`Página inválida. Informe um número entre 1 e ${totalPages}`);
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Terceira linha: 7 botões com ícones */}
        <div className="flex items-center gap-1">
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <AlertCircle className="h-4 w-4 mr-1" />
            Ocorrências
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <DollarSign className="h-4 w-4 mr-1" />
            Custos
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Ord.Compra
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <ClipboardList className="h-4 w-4 mr-1" />
            Edit.Tarefas
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <Trash2 className="h-4 w-4 mr-1" />
            Rescisão
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Pendenciar
          </Button>
        </div>
      </CardContent>

      {/* Diálogo de verificação de parâmetros da API (ApiParamDialog comentado temporariamente) */}
      {/*
      <ApiParamDialog 
        isOpen={isVerifyDialogOpen}
        onClose={() => setIsVerifyDialogOpen(false)}
        onConfirm={handleConfirmApiCall}
        params={apiParams}
      />
      */}
    </Card>
  );
}