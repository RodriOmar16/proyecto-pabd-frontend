"use client";

import { useState, type FormEvent } from "react";
import type { OpcionesConfirmacion } from "@/components/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { createSupplier, updateSupplier } from "../_lib/api";
import { CAMPOS } from "../_lib/field";
import type { Supplier, SupplierValues } from "../_lib/types";

type Props = {
  supplier: Supplier | null; // null = alta de un supplier nuevo
  confirmar: (opciones: OpcionesConfirmacion) => Promise<boolean>;
  onCambios: (hayCambios: boolean) => void; // avisa si el formulario difiere de los datos originales
  onGuardado: () => void;
  onCancelar: () => void;
};

/** Valores iniciales: los del supplier a editar, o vacíos si es un alta. */
function valoresIniciales(supplier: Supplier | null): SupplierValues {
  const valores = {} as SupplierValues;
  for (const campo of CAMPOS) {
    const valor = supplier?.[campo.name];
    valores[campo.name] = valor !== null && valor !== undefined ? String(valor): "";
  }
  return valores;
}

/** Formulario de alta y edición (se muestra dentro del modal). */
export default function SupplierForm({ supplier, confirmar, onCambios, onGuardado, onCancelar }: Props) {
  const [iniciales] = useState<SupplierValues>(() => valoresIniciales(supplier));
  const [valores, setValores] = useState<SupplierValues>(iniciales);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function cambiarCampo(nombre: keyof SupplierValues, valor: string) {
    const nuevos = { ...valores, [nombre]: valor };
    setValores(nuevos);
    onCambios(CAMPOS.some((campo) => nuevos[campo.name] !== iniciales[campo.name]));
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    const ok = await confirmar(
      supplier === null
        ? {
            titulo: "Crear supplier",
            mensaje: `¿Confirmás crear el supplier – ${valores.companyname}?`,
          }
        : {
            titulo: "Guardar cambios",
            mensaje: `¿Confirmás guardar los cambios del supplier ${supplier.supplierid}?`,
          },
    );
    if (!ok) return;

    setError(null);
    setGuardando(true);
    try {
      if (supplier === null) {
        await createSupplier(valores);
      } else {
        await updateSupplier(supplier.supplierid, valores);
      }
      onGuardado();
    } catch (err) {
      // Muestra el mensaje que devolvió la API (ej. "Ya existe un supplier con el código...")
      setError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPOS.map((campo) => {
          const esCodigo = campo.name === "supplierid";
          const obligatorio = esCodigo || campo.name === "companyname";
          return (
            <label key={campo.name} className="flex flex-col gap-1 text-xs font-medium text-muted">
              <span>
                {campo.label}
                {obligatorio && <span className="text-danger"> *</span>}
              </span>
              <input
                value={valores[campo.name]}
                onChange={(e) =>
                  cambiarCampo(campo.name, esCodigo ? e.target.value.toUpperCase() : e.target.value)
                }
                maxLength={campo.max}
                required={obligatorio}
                readOnly={esCodigo && supplier !== null} // el código no se edita
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none read-only:opacity-60 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
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