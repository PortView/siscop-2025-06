import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ProcessFilterPanel() {
  // Estados para armazenar valores atuais/aplicados
  const [codServValue, setCodServValue] = useState("-1");
  const [statusValue, setStatusValue] = useState("ALL");
  const [dtLimiteValue, setDtLimiteValue] = useState("ALL");

  // Estado para controlar a exibição dos campos
  const [showDropdown, setShowDropdown] = useState(true);
  const [showCodServ, setShowCodServ] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showDtLimite, setShowDtLimite] = useState(false);

  // Estado para o checkbox "servNaoConcluidos"
  const [servNaoConcluidos, setServNaoConcluidos] = useState(true);

  // Estados para armazenar as listas de valores únicos
  const [codServOptions, setCodServOptions] = useState<number[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [dtLimiteOptions, setDtLimiteOptions] = useState<string[]>([]);

  // Estados para armazenar os valores temporários dos filtros
  const [tempCodServValue, setTempCodServValue] = useState(codServValue);
  const [tempStatusValue, setTempStatusValue] = useState(statusValue);
  const [tempDtLimiteValue, setTempDtLimiteValue] = useState(dtLimiteValue);

  // Função para ouvir eventos de atualizações de filtros (quando uma unidade é selecionada)
  useEffect(() => {
    const handleFiltersUpdated = () => {
      console.log("ProcessFilterPanel: Evento 'filters-updated' recebido");
      loadFilterData();
    };

    // Registra os ouvintes de evento para o evento personalizado filters-updated
    window.addEventListener("filters-updated", handleFiltersUpdated);

    // Carrega dados iniciais
    loadFilterData();

    // Limpa os ouvintes de evento quando o componente é desmontado
    return () => {
      window.removeEventListener("filters-updated", handleFiltersUpdated);
    };
  }, []);

  // Atualiza os valores temporários quando os valores padrão são carregados inicialmente
  useEffect(() => {
    setTempCodServValue(codServValue);
    setTempStatusValue(statusValue);
    setTempDtLimiteValue(dtLimiteValue);
  }, [codServValue, statusValue, dtLimiteValue]);

  // Handler para mudança no filtro de serviço (apenas atualiza o valor temporário)
  const handleCodServChange = (value: string) => {
    setTempCodServValue(value);
  };

  // Handler para mudança no filtro de status (apenas atualiza o valor temporário)
  const handleStatusChange = (value: string) => {
    setTempStatusValue(value);
  };

  // Handler para mudança no filtro de data limite (apenas atualiza o valor temporário)
  const handleDtLimiteChange = (value: string) => {
    setTempDtLimiteValue(value);
  };

  // Carrega dados de filtros e opções do localStorage (chamado quando uma unidade é selecionada)
  const loadFilterData = () => {
    try {
      console.log("ProcessFilterPanel: Carregando dados de filtros");

      // Carregar valores dos filtros selecionados
      const storedCodServ = localStorage.getItem("v_codServ");
      const storedStatus = localStorage.getItem("v_status");
      const storedDtLimite = localStorage.getItem("v_dtLimite");

      console.log("ProcessFilterPanel: Valores armazenados:", {
        codServ: storedCodServ,
        status: storedStatus,
        dtLimite: storedDtLimite,
      });

      if (storedCodServ) {
        setCodServValue(storedCodServ);
        setShowCodServ(storedCodServ !== "-1");
      }

      if (storedStatus) {
        setStatusValue(storedStatus);
        setShowStatus(storedStatus !== "ALL");
      }

      if (storedDtLimite) {
        setDtLimiteValue(storedDtLimite);
        setShowDtLimite(storedDtLimite !== "ALL");
      }

      // Carregar listas de opções
      const codServListStr = localStorage.getItem("v_codServ_list");
      if (codServListStr) {
        try {
          const codServList = JSON.parse(codServListStr);
          if (Array.isArray(codServList)) {
            setCodServOptions(codServList);
            console.log("Lista de códigos de serviço carregada:", codServList);
          }
        } catch (e) {
          console.error("Erro ao processar lista de códigos de serviço:", e);
        }
      }

      const statusListStr = localStorage.getItem("v_status_list");
      if (statusListStr) {
        try {
          const statusList = JSON.parse(statusListStr);
          if (Array.isArray(statusList)) {
            setStatusOptions(statusList);
            console.log("Lista de status carregada:", statusList);
          }
        } catch (e) {
          console.error("Erro ao processar lista de status:", e);
        }
      }

      const dtLimiteListStr = localStorage.getItem("v_dtLimite_list");
      if (dtLimiteListStr) {
        try {
          const dtLimiteList = JSON.parse(dtLimiteListStr);
          if (Array.isArray(dtLimiteList)) {
            // Converter formato ISO para YYYY-MM-DD para o input date
            const formattedDates = dtLimiteList
              .filter((date) => date !== null && date !== undefined)
              .map((date) => {
                try {
                  const d = new Date(date);
                  return d.toISOString().split("T")[0];
                } catch {
                  return "";
                }
              })
              .filter(Boolean);

            setDtLimiteOptions(formattedDates);
            console.log("Lista de datas limite carregada:", formattedDates);
          }
        } catch (e) {
          console.error("Erro ao processar lista de datas:", e);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
    }
  };

  // Função para aplicar os filtros quando o botão "Aplicar" é clicado
  const handleApplyFilters = () => {
    // Armazena os valores selecionados no localStorage
    localStorage.setItem("v_codServ", tempCodServValue);
    localStorage.setItem("v_status", tempStatusValue);
    localStorage.setItem("v_dtLimite", tempDtLimiteValue);
    localStorage.setItem(
      "v_servNaoConcluidos",
      servNaoConcluidos ? "true" : "false",
    );

    // Atualiza os valores no estado
    setCodServValue(tempCodServValue);
    setStatusValue(tempStatusValue);
    setDtLimiteValue(tempDtLimiteValue);

    // Dispara um evento personalizado para notificar a aplicação dos filtros
    try {
      console.log("Disparando evento apply-filters com parâmetros:", {
        qCodServ: tempCodServValue,
        qStatus: tempStatusValue,
        qDtlimite: tempDtLimiteValue,
        qConcluido: servNaoConcluidos, // Manda true para que mostre Só serv. não Concluídos
      });

      // Cria um evento personalizado com os parâmetros dos filtros
      const event = new CustomEvent("apply-filters", {
        detail: {
          qCodServ: tempCodServValue,
          qStatus: tempStatusValue,
          qDtlimite: tempDtLimiteValue,
          qConcluido: servNaoConcluidos, // Manda true para que mostre Só serv. não Concluídos
        },
      });

      window.dispatchEvent(event);
    } catch (e) {
      console.error("Erro ao disparar evento apply-filters:", e);
    }
  };

  return (
    <Card className="border-2 border-white shadow-md w-[940px] h-[170px] rounded-sm">
      <CardContent className="p-2 flex flex-col gap-2">
        {/* Row 1: Main filters */}
        <div className="flex flex-row items-center gap-4 h-[50px]">
          <div className="flex flex-row items-center gap-2">
            <Label
              htmlFor="codserv"
              className="text-secondary-foreground text-xs font-semibold mt-2"
            >
              Cód.Serv.
            </Label>
            <Select
              value={tempCodServValue}
              onChange={e => handleCodServChange(e.target.value)}
              disabled={!showDropdown}
              className={"h-9 w-[100px] bg-select text-select-foreground border border-border rounded px-2 text-xs" + (!showDropdown ? " opacity-50 cursor-not-allowed" : "")}
            >
              <option value="-1">Todos</option>
              {codServOptions.map((codServ) => (
                <option key={codServ} value={String(codServ)}>
                  {codServ}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label
              htmlFor="status"
              className="text-secondary-foreground text-xs font-semibold mt-2"
            >
              Status
            </Label>
            <Select
              value={tempStatusValue}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={!showDropdown}
              className={"h-9 w-[200px] bg-select text-select-foreground border border-border rounded px-2 text-xs" + (!showDropdown ? " opacity-50" : "")}
            >
              <option value="ALL">Todos</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label
              htmlFor="DTLimite"
              className="text-secondary-foreground text-xs font-semibold mt-2"
            >
              Dt.Limite
            </Label>
            <Select
              value={tempDtLimiteValue}
              onChange={e => handleDtLimiteChange(e.target.value)}
              disabled={!showDropdown}
              className={"h-9 w-[150px] bg-select text-select-foreground border border-border rounded px-2 text-xs" + (!showDropdown ? " opacity-50" : "")}
            >
              <option value="ALL">Todas</option>
              {dtLimiteOptions.map((date) => {
                const formattedDate = new Date(date).toLocaleDateString("pt-BR");
                return (
                  <option key={date} value={date}>
                    {formattedDate}
                  </option>
                );
              })}
            </Select>

            <Button
              size="sm"
              variant="default"
              className="h-9 ml-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleApplyFilters}
              disabled={!showDropdown} // Desabilita o botão se os dropdowns estiverem desabilitados
            >
              <FilterIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Aplicar</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Checkbox filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="servNaoConcluidos"
              checked={servNaoConcluidos}
              onChange={e => setServNaoConcluidos(e.target.checked)}
            />
            <Label
              htmlFor="servNaoConcluidos"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Só Serv. não Concluídos
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="novos" />
            <Label
              htmlFor="novos"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Novos
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="suspensos" />
            <Label
              htmlFor="suspensos"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Suspensos
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="semNota" />
            <Label
              htmlFor="semNota"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Sem Nota
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="pendencia" />
            <Label
              htmlFor="pendencia"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Pendência
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="docInternet" />
            <Label
              htmlFor="docInternet"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Doc.Internet
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="soOS" />
            <Label
              htmlFor="soOS"
              className="text-secondary-foreground text-xs font-semibold"
            >
              Só O.S.
            </Label>
          </div>
        </div>

        {/* Row 3: Services and Tasks */}
        <div className="flex flex-row place-items-end gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-secondary-foreground text-xs font-semibold">
              Gerente Mauro.Luiz
            </Label>
          </div>

          <div className="flex items-center gap-1 ml-8">
            <div className="flex gap-2">
              <div className="flex flex-col">
                <label className="text-[10px] font-light mb-0.2 tracking-tighter text-secondary-foreground">
                  H. tramit.
                </label>
                <Input className="h-7 w-20 bg-input text-input-foreground border-border" />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-light mb-0.2 tracking-tighter text-secondary-foreground">
                  H. assess.
                </label>
                <Input className="h-7 w-20 bg-input text-input-foreground border-border" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex gap-2">
              <div className="flex flex-col">
                <label className="text-[10px] font-light mb-0.2 tracking-tighter text-secondary-foreground">
                  TE tramit.
                </label>
                <Input className="h-7 w-20 bg-input text-input-foreground border-border" />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-light mb-0.2 tracking-tighter text-secondary-foreground">
                  TE assess.
                </label>
                <Input className="h-7 w-20 bg-input text-input-foreground border-border" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}