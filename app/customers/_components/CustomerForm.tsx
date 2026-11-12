"use client";

import { useState, type FormEvent } from "react";
import type { OpcionesConfirmacion } from "@/components/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { createCustomer, updateCustomer } from "../_lib/api";
import { CAMPOS } from "../_lib/field";
import type { Customer, CustomerValues } from "../_lib/types";

type Props = {
  cliente: Customer | null; // null = alta de un cliente nuevo
  confirmar: (opciones: OpcionesConfirmacion) => Promise<boolean>;
  onCambios: (hayCambios: boolean) => void; // avisa si el formulario difiere de los datos originales
  onGuardado: () => void;
  onCancelar: () => void;
};

/** Valores iniciales: los del cliente a editar, o vacíos si es un alta. */
function valoresIniciales(cliente: Customer | null): CustomerValues {
  const valores = {} as CustomerValues;
  for (const campo of CAMPOS) {
    valores[campo.name] = cliente?.[campo.name] ?? "";
  }
  return valores;
}

/** Formulario de alta y edición (se muestra dentro del modal). */
export default function CustomerForm({ cliente, confirmar, onCambios, onGuardado, onCancelar }: Props) {
  const [iniciales] = useState<CustomerValues>(() => valoresIniciales(cliente));
  const [valores, setValores] = useState<CustomerValues>(iniciales);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function cambiarCampo(nombre: keyof CustomerValues, valor: string) {
    const nuevos = { ...valores, [nombre]: valor };
    setValores(nuevos);
    onCambios(CAMPOS.some((campo) => nuevos[campo.name] !== iniciales[campo.name]));
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    const ok = await confirmar(
      cliente === null
        ? {
            titulo: "Crear cliente",
            mensaje: `¿Confirmás crear el cliente ${valores.customerid} – ${valores.companyname}?`,
          }
        : {
            titulo: "Guardar cambios",
            mensaje: `¿Confirmás guardar los cambios del cliente ${cliente.customerid}?`,
          },
    );
    if (!ok) return;

    setError(null);
    setGuardando(true);
    try {
      if (cliente === null) {
        await createCustomer(valores);
      } else {
        await updateCustomer(cliente.customerid, valores);
      }
      onGuardado();
    } catch (err) {
      // Muestra el mensaje que devolvió la API (ej. "Ya existe un cliente con el código...")
      setError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPOS.map((campo) => {
          const esCodigo = campo.name === "customerid";
          const obligatorio = esCodigo || campo.name === "companyname";
          return (
            <label key={campo.name} className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              <span>
                {campo.label}
                {obligatorio && <span className="text-destructive"> *</span>}
              </span>
              <input
                value={valores[campo.name]}
                onChange={(e) =>
                  cambiarCampo(campo.name, esCodigo ? e.target.value.toUpperCase() : e.target.value)
                }
                maxLength={campo.max}
                required={obligatorio}
                readOnly={esCodigo && cliente !== null} // el código no se edita
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none read-only:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30	"
              />
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}