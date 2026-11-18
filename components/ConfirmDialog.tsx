"use client";

import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type OpcionesConfirmacion = {
  titulo: string; // ej. "Inhabilitar cliente"
  mensaje: string; // ej. "¿Seguro que querés inhabilitar a Alfreds Futterkiste?"
  textoSi?: string; // por defecto "Sí"
  textoNo?: string; // por defecto "No"
  peligro?: boolean; // true = botón "Sí" en rojo (acciones delicadas)
};

/**
 * Hook para pedir confirmación con el AlertDialog de shadcn.
 * Uso:
 *   const { confirmar, dialogoConfirmacion } = useConfirm();
 *   if (!(await confirmar({ titulo: "...", mensaje: "..." }))) return;
 *   ...y renderizar {dialogoConfirmacion} en el componente.
 */
export function useConfirm() {
  const [abierto, setAbierto] = useState(false);
  // Se conservan las últimas opciones para que el texto no desaparezca durante la animación de cierre
  const [opciones, setOpciones] = useState<OpcionesConfirmacion | null>(null);
  const resolver = useRef<((respuesta: boolean) => void) | null>(null);

  /** Abre el diálogo y devuelve una promesa que se resuelve con true (Sí) o false (No). */
  function confirmar(nuevas: OpcionesConfirmacion): Promise<boolean> {
    setOpciones(nuevas);
    setAbierto(true);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }

  function responder(respuesta: boolean) {
    resolver.current?.(respuesta); // si ya se respondió, no hace nada
    resolver.current = null;
    setAbierto(false);
  }

  const dialogoConfirmacion = (
    <AlertDialog
      open={abierto}
      onOpenChange={(valor) => {
        if (!valor) responder(false); // Esc o "No"
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{opciones?.titulo}</AlertDialogTitle>
          <AlertDialogDescription>{opciones?.mensaje}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{opciones?.textoNo ?? "No"}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => responder(true)}
            className={
              opciones?.peligro ? "bg-destructive text-white hover:bg-destructive/90" : undefined
            }
          >
            {opciones?.textoSi ?? "Sí"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirmar, dialogoConfirmacion };
}