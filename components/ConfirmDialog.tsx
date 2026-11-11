"use client";

import { useRef, useState } from "react";
import Modal from "@/components/Modal";

export type OpcionesConfirmacion = {
  titulo: string; // ej. "Inhabilitar cliente"
  mensaje: string; // ej. "¿Seguro que querés inhabilitar a Alfreds Futterkiste?"
  textoSi?: string; // por defecto "Sí"
  textoNo?: string; // por defecto "No"
  peligro?: boolean; // true = botón "Sí" en rojo (acciones delicadas)
};

/**
 * Hook para pedir confirmación con un modal propio.
 * Uso:
 *   const { confirmar, dialogoConfirmacion } = useConfirm();
 *   if (!(await confirmar({ titulo: "...", mensaje: "..." }))) return;
 *   ...y renderizar {dialogoConfirmacion} en el componente.
 */
export function useConfirm() {
  const [opciones, setOpciones] = useState<OpcionesConfirmacion | null>(null);
  const resolver = useRef<((respuesta: boolean) => void) | null>(null);

  /** Abre el modal y devuelve una promesa que se resuelve con true (Sí) o false (No). */
  function confirmar(nuevas: OpcionesConfirmacion): Promise<boolean> {
    setOpciones(nuevas);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }

  function responder(respuesta: boolean) {
    resolver.current?.(respuesta);
    resolver.current = null;
    setOpciones(null);
  }

  const dialogoConfirmacion = (
    <Modal open={opciones !== null} title={opciones?.titulo ?? ""} onClose={() => responder(false)} size="sm">
      <p className="text-sm">{opciones?.mensaje}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => responder(false)}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10"
        >
          {opciones?.textoNo ?? "No"}
        </button>
        <button
          type="button"
          onClick={() => responder(true)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 ${
            opciones?.peligro ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"
          }`}
        >
          {opciones?.textoSi ?? "Sí"}
        </button>
      </div>
    </Modal>
  );

  return { confirmar, dialogoConfirmacion };
}