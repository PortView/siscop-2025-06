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

interface ProcessCommandPanelProps {
  onClientChange?: (clientId: number) => void;
  onUnitChange?: (unit: SiscopUnidade) => void;
}

export function ProcessCommandPanel({ onClientChange, onUnitChange }: ProcessCommandPanelProps) {
  const toast = useToast();
  const isProcessingClientChange = useRef(false);
  const isProcessingUfChange = useRef(false);
  const lastFetchedParams = useRef<{ codcli?: number, uf?: string } | null>(null);

  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedUF, setSelectedUF] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SiscopUnidade | null>(null);
  const [manualUFSelection, setManualUFSelection] = useState<boolean>(false);

  const [codCoor, setCodCoor] = useState<number>(0);
  const [units, setUnits] = useState<SiscopUnidade[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [unitsError, setUnitsError] = useState<Error | null>(null);

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

  if (typeof window !== 'undefined') {
    const tokenKey = LOCAL_STORAGE_TOKEN_KEY;
    const tokenVal = localStorage.getItem(tokenKey);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tokenKey = LOCAL_STORAGE_TOKEN_KEY;
    const tokenVal = localStorage.getItem(tokenKey);

    setAllUfs(false);

    setSelectedClient(null);
    setSelectedUF(null);
    setSelectedUnit(null);
    setUnits([]);

    try {
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

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

  const ufs = useMemo(() => {
    if (!selectedClient) return [];
    const clientData = clients.find((c: SiscopCliente) => c.codcli === selectedClient);
    return clientData?.lc_ufs?.map((u: any) => u.uf) || [];
  }, [selectedClient, clients]);

  const filteredClients = useMemo(() => {
    const trimmedTerm = clientSearchTerm.trim();
    if (!trimmedTerm || trimmedTerm.length < 3) return clients;
    return clients.filter((client: SiscopCliente) =>
      client.fantasia.toLowerCase().includes(trimmedTerm.toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  const filteredUfs = useMemo(() => {
    const trimmedTerm = ufSearchTerm.trim();
    if (!trimmedTerm || trimmedTerm.length < 3) return ufs;
    return ufs.filter((uf: string) =>
      uf.toLowerCase().includes(trimmedTerm.toLowerCase())
    );
  }, [ufs, ufSearchTerm]);

  const filteredUnits = useMemo(() => {
    const trimmedTerm = unitSearchTerm.trim();
    if (!trimmedTerm || trimmedTerm.length < 3) return units;
    return units.filter(unit => {
      const unitStr = `${unit.contrato} - ${unit.cadimov?.uf || ''} - ${unit.cadimov?.tipo || ''}`;
      return unitStr.toLowerCase().includes(trimmedTerm.toLowerCase());
    });
  }, [units, unitSearchTerm]);

  const clearUnitsCacheInternal = (client: number, uf: string, coorCode: number) => {
    if (!client || !uf || !coorCode) return;
    const cacheKey = `units_${coorCode}_${client}_${uf}_1`;
    console.log(`Limpando cache para ${cacheKey}`);
    localStorage.removeItem(cacheKey);
  };

  const clearUnitsCache = useCallback((client: number, uf: string) => {
    clearUnitsCacheInternal(client, uf, codCoor);
  }, [codCoor]);

  const fetchUnitsIfNeeded = useCallback(async (
    codcli: number,
    uf: string,
    processingRef: React.MutableRefObject<boolean>,
    shouldForceRefresh = true
  ) => {
    if (processingRef.current) {
      return null;
    }

    const isParameterChange =
      lastFetchedParams.current?.codcli !== codcli ||
      lastFetchedParams.current?.uf !== uf;

    if (isParameterChange && codCoor) {
      clearUnitsCacheInternal(codcli, uf, codCoor);
    }

    processingRef.current = true;

    setUnits([]);

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

      const options = { skipCache: true };
      const response = await fetchUnidades(params);

      if (!response?.folowups) {
        setUnits([]);
        processingRef.current = false;
        setSelectedUnit(null);
        return null;
      }

      setUnits(response.folowups);

      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.lastPage);
        setTotalItems(response.pagination.totalItems);

        setShouldShowPagination(response.pagination.totalItems > 100);
      } else {
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
        setShouldShowPagination(false);
      }

      if (response.folowups.length === 0) {
        toast(`Nenhuma unidade encontrada. Não há unidades para este cliente na UF ${uf}.`);
        processingRef.current = false;
        setSelectedUnit(null);
        return null;
      }

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
      setSelectedUnit(null);
      return null;
    } finally {
      setIsLoadingUnits(false);
    }
  }, [codCoor]);

  const refetchUnits = useCallback(() => {
    if (!selectedClient || !selectedUF) {
      toast('Parâmetros incompletos. Cliente e UF são necessários para buscar unidades.');
      return;
    }

    fetchUnitsIfNeeded(selectedClient, selectedUF, isProcessingUfChange, true);
  }, [selectedClient, selectedUF, fetchUnitsIfNeeded]);

  const loadPagedUnits = useCallback((pageNumber: number) => {
    if (!selectedClient || !codCoor) return;

    if (!selectedUF && !allUfs) return;

    const ufParam = allUfs ? "ZZ" : selectedUF;

    if (!ufParam) return;

    setIsLoadingUnits(true);

    const params = {
      codcoor: codCoor,
      codcli: selectedClient,
      uf: ufParam,
      page: pageNumber
    };

    fetchUnidades(params)
      .then(response => {
        if (response?.folowups) {
          setUnits(response.folowups);

          if (response.pagination) {
            setCurrentPage(response.pagination.currentPage);
            setTotalPages(response.pagination.lastPage);
            setTotalItems(response.pagination.totalItems);

            setShouldShowPagination(response.pagination.totalItems > 100);
          }

          if (response.folowups.length > 0) {
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

  const handleClientChange = useCallback((codcli: number) => {
    if (selectedClient && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
    }

    setSelectedClient(codcli);

    setManualUFSelection(false);

    setSelectedUnit(null);
    setUnits([]);

    const clientData = clients.find((c: any) => c.codcli === codcli);
    if (clientData?.lc_ufs?.length) {
      const firstClientUF = clientData.lc_ufs[0].uf;
      console.log(`Cliente alterado para ${codcli}, definindo primeira UF: ${firstClientUF}`);
      setSelectedUF(firstClientUF);
    } else {
      setSelectedUF(null);
    }

    if (onClientChange) {
      onClientChange(codcli);
    }
  }, [onClientChange, selectedClient, selectedUF, clearUnitsCache, clients]);

  const handleUFChange = useCallback((uf: string) => {
    if (selectedClient && selectedUF) {
      clearUnitsCache(selectedClient, selectedUF);
    }

    if (selectedClient && uf) {
      clearUnitsCache(selectedClient, uf);
    }

    setSelectedUF(uf);
    setManualUFSelection(true);
    setSelectedUnit(null);
    setUnits([]);
    setIsLoadingUnits(true);
  }, [selectedClient, selectedUF, clearUnitsCache]);

  useEffect(() => {
    if (!selectedClient || !selectedUF) return;

    clearUnitsCache(selectedClient, selectedUF);

    const processingRef = manualUFSelection ? isProcessingUfChange : isProcessingClientChange;

    fetchUnitsIfNeeded(selectedClient, selectedUF, processingRef);
  }, [selectedClient, selectedUF, manualUFSelection, fetchUnitsIfNeeded, clearUnitsCache]);

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
        <div className="flex items-center gap-2 h-[50px]">
          <select
            disabled={isLoadingClients}
            className="h-8 text-xs w-[380px] bg-zinc-800 text-white border-zinc-600 rounded-md"
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

          <select
            disabled={!selectedClient || ufs.length === 0 || allUfs}
            className="h-8 text-xs w-[100px] bg-zinc-800 text-white border-zinc-600 rounded-md"
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

          <div className="flex items-center h-8 px-2">
            <Checkbox
              id="todas-ufs"
              checked={allUfs}
              disabled={!selectedClient}
              onChange={(checked: any) => {
                const isChecked = !!checked;
                setAllUfs(isChecked);

                if (isChecked) {
                  if (selectedClient && codCoor) {
                    const params = {
                      codcoor: codCoor,
                      codcli: selectedClient,
                      uf: "ZZ",
                      page: 1
                    };

                    setIsLoadingUnits(true);
                    fetchUnidades(params)
                      .then(response => {
                        if (response?.folowups) {
                          setUnits(response.folowups);

                          if (response.pagination) {
                            setCurrentPage(response.pagination.currentPage);
                            setTotalPages(response.pagination.lastPage);
                            setTotalItems(response.pagination.totalItems);

                            setShouldShowPagination(response.pagination.totalItems > 100);
                          } else {
                            setCurrentPage(1);
                            setTotalPages(1);
                            setTotalItems(0);
                            setShouldShowPagination(false);
                          }

                          if (response.folowups.length > 0) {
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
                  const params = {
                    codcoor: codCoor,
                    codcli: selectedClient,
                    uf: selectedUF,
                    page: 1
                  };

                  setIsLoadingUnits(true);
                  fetchUnidades(params)
                    .then(response => {
                      if (response?.folowups) {
                        setUnits(response.folowups);

                        if (response.pagination) {
                          setCurrentPage(response.pagination.currentPage);
                          setTotalPages(response.pagination.lastPage);
                          setTotalItems(response.pagination.totalItems);

                          setShouldShowPagination(response.pagination.totalItems > 100);
                        } else {
                          setCurrentPage(1);
                          setTotalPages(1);
                          setTotalItems(0);
                          setShouldShowPagination(false);
                        }

                        if (response.folowups.length > 0) {
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

          <Button
            variant="default"
            size="sm"
            className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
          >
            <FileText className="h-4 w-4 mr-1" />
            Planilhas
          </Button>

          <Button
            variant="default"
            size="sm"
            className="h-8 bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
          >
            {`Contr: ${selectedUnit?.contrato ? ('00' + selectedUnit.contrato).slice(-7) : '-----'}`}
          </Button>
        </div>

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
                className="h-8 text-xs w-[450px] bg-zinc-800 text-white border-zinc-600 rounded-md"
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

          {shouldShowPagination && (
            <div className="flex items-center gap-[2px] ml-2">
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === 1 || isLoadingUnits}
                onClick={() => loadPagedUnits(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === 1 || isLoadingUnits}
                onClick={() => loadPagedUnits(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="bg-blue-900 rounded h-8 px-3 flex items-center text-sm font-medium text-white border border-blue-600">
                <span>{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </div>

              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === totalPages || isLoadingUnits}
                onClick={() => loadPagedUnits(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-blue-700 border-blue-600 text-white p-0 hover:bg-blue-800"
                disabled={currentPage === totalPages || isLoadingUnits}
                onClick={() => loadPagedUnits(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>

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
    </Card>
  );
}