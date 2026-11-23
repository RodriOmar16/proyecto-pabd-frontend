"use client";

import { useRef } from "react";
import AsyncSelect from "react-select/async";
import { cn } from "@/lib/utils";

export type Opcion = { value: string; label: string };

type Props = {
  id: string;
  value: Opcion | null;
  onChange: (opcion: Opcion | null) => void;
  buscar: (texto: string) => Promise<Opcion[]>;
  placeholder?: string;
};

/** Seleccionable que busca en la API 300 ms después de la última tecla. */
export default function AsyncCombo({ id, value, onChange, buscar, placeholder = "Todos" }: Props) {
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cargarOpciones(texto: string) {
    if (espera.current) clearTimeout(espera.current);
    // Carga inicial o texto borrado: consulta al instante, sin esperar
    if (!texto.trim()) {
      return buscar("").catch(() => []);
    }
    return new Promise<Opcion[]>((resolve) => {
      espera.current = setTimeout(() => {
        buscar(texto).then(resolve).catch(() => resolve([]));
      }, 300);
    });
  }

  return (
    <AsyncSelect<Opcion>
      instanceId={id}
      inputId={id}
      value={value}
      onChange={(opcion) => onChange(opcion)}
      loadOptions={cargarOpciones}
      defaultOptions
      isClearable
      placeholder={placeholder}
      noOptionsMessage={() => "Sin coincidencias"}
      loadingMessage={() => "Buscando…"}
      unstyled
      styles={{ menu: (base) => ({ ...base, zIndex: 50 }) }}
      classNames={{
        control: ({ isFocused }) =>
          cn(
            "min-h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm",
            isFocused && "border-ring ring-3 ring-ring/50"
          ),
        placeholder: () => "text-muted-foreground",
        menu: () => "mt-1 rounded-lg border bg-popover text-popover-foreground shadow-md",
        menuList: () => "p-1",
        option: ({ isFocused, isSelected }) =>
          cn(
            "cursor-pointer rounded-md px-2 py-1.5 text-sm",
            isFocused && "bg-accent",
            isSelected && "bg-primary text-primary-foreground"
          ),
        noOptionsMessage: () => "px-2 py-1.5 text-sm text-muted-foreground",
        loadingMessage: () => "px-2 py-1.5 text-sm text-muted-foreground",
        indicatorsContainer: () => "gap-1 text-muted-foreground",
        clearIndicator: () => "cursor-pointer hover:text-foreground",
        dropdownIndicator: () => "cursor-pointer hover:text-foreground",
        indicatorSeparator: () => "hidden",
      }}
    />
  );
}