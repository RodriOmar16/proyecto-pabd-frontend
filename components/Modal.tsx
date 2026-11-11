"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void; // se llama al pedir cerrar: X, Esc o clic afuera (si dismissable)
  children: ReactNode;
  dismissable?: boolean; // false = no se cierra con clic afuera ni con Esc (solo con la X o un botón)
  size?: "sm" | "lg";
};

/** Ventana modal basada en el elemento nativo <dialog>. */
export default function Modal({ open, title, onClose, children, dismissable = true, size = "lg" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // Abre o cierra el <dialog> nativo según la prop "open"
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault(); // la tecla Esc no cierra sola: decide el componente
        if (dismissable) onClose();
      }}
      onClose={() => {
        if (open) onClose(); // por si el navegador lo cerró por su cuenta: sincroniza el estado
      }}
      onClick={(e) => {
        if (dismissable && e.target === ref.current) onClose(); // clic en el fondo oscuro
      }}
      className={`m-auto w-full rounded-xl border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-black/60 ${
        size === "sm" ? "max-w-md" : "max-w-2xl"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-md p-1 text-muted transition-colors hover:bg-primary/10 hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {/* El contenido se monta solo con el modal abierto: el formulario arranca limpio cada vez */}
      <div className="px-6 py-5">{open && children}</div>
    </dialog>
  );
}