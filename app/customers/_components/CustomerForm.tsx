"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { OpcionesConfirmacion } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
            <div key={campo.name} className="flex flex-col gap-1.5">
              <Label htmlFor={`c-${campo.name}`} className="text-xs text-muted-foreground">
                {campo.label}
                {obligatorio && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id={`c-${campo.name}`}
                value={valores[campo.name]}
                onChange={(e) =>
                  cambiarCampo(campo.name, esCodigo ? e.target.value.toUpperCase() : e.target.value)
                }
                maxLength={campo.max}
                required={obligatorio}
                readOnly={esCodigo && cliente !== null} // el código no se edita
                className="read-only:opacity-60"
              />
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={guardando}>
          {guardando && <Loader2 className="animate-spin" aria-hidden="true" />}
          {guardando ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}