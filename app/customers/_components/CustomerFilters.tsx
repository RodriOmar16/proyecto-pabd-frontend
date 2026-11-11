"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import Switch from "@/components/Switch";
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
    e.preventDefault(); // evita que el formulario recargue la página
    onBuscar(valores);
  }

  function limpiar() {
    setValores({});
    onBuscar({});
  }

  return (
    <form onSubmit={buscar} className="rounded-xl border border-border bg-surface p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CAMPOS.map((campo) => (
          <label key={campo.name} className="flex flex-col gap-1 text-xs font-medium text-muted">
            {campo.label}
            <input
              value={valores[campo.name] ?? ""}
              onChange={(e) => setValores({ ...valores, [campo.name]: e.target.value })}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
        ))}

        {/* Celda 12 de la grilla: fila 3, columna 4 en pantallas grandes */}
        <div className="flex items-end pb-2">
          <Switch checked={disabled} onChange={onCambiarDisabled} label="Inhabilitados" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={limpiar}
          disabled={buscando}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={buscando}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buscando ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
          Buscar
        </button>
      </div>
    </form>
  );
}