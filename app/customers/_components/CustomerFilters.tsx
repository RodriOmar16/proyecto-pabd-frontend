"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import Switch from "@/components/Switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAMPOS } from "../_lib/field";

type Props = {
  disabled: boolean;
  buscando: boolean; // true mientras se espera la respuesta de la API
  onBuscar: (filtros: Record<string, string>) => void;
  onCambiarDisabled: (disabled: boolean) => void;
};

/** Un campo de búsqueda por columna, switch de inhabilitados y botones Limpiar/Buscar. */
export default function CustomerFilters({ disabled, buscando, onBuscar, onCambiarDisabled }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});

  function buscar(e: FormEvent) {
    e.preventDefault();
    onBuscar(valores);
  }

  function limpiar() {
    setValores({});
    onBuscar({});
  }

  return (
    <form onSubmit={buscar} className="rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CAMPOS.map((campo) => (
          <div key={campo.name} className="flex flex-col gap-1.5">
            <Label htmlFor={`f-${campo.name}`} className="text-xs text-muted-foreground">
              {campo.label}
            </Label>
            <Input
              id={`f-${campo.name}`}
              value={valores[campo.name] ?? ""}
              onChange={(e) => setValores({ ...valores, [campo.name]: e.target.value })}
            />
          </div>
        ))}

        {/* Celda 12 de la grilla: fila 3, columna 4 en pantallas grandes */}
        <div className="flex items-end pb-1.5">
          <Switch checked={disabled} onChange={onCambiarDisabled} label="Inhabilitados" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={limpiar} disabled={buscando}>
          Limpiar
        </Button>
        <Button type="submit" disabled={buscando}>
          {buscando ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
          Buscar
        </Button>
      </div>
    </form>
  );
}