"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void; // se llama al pedir cerrar: X, Esc o clic afuera (si dismissable)
  children: ReactNode;
  dismissable?: boolean; // false = no se cierra con clic afuera ni con Esc (solo con la X o un botón)
  size?: "sm" | "lg";
};

/** Ventana modal basada en el Dialog de shadcn (Radix). Misma API que la versión anterior. */
export default function Modal({ open, title, onClose, children, dismissable = true, size = "lg" }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(abierto) => {
        if (!abierto) onClose(); // la X, Esc o clic afuera: decide el componente que usa el modal
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className={cn("gap-0 p-0", size === "sm" ? "sm:max-w-md" : "sm:max-w-2xl")}
        onInteractOutside={(e) => {
          if (!dismissable) e.preventDefault(); // clic afuera no cierra
        }}
        onEscapeKeyDown={(e) => {
          if (!dismissable) e.preventDefault(); // Esc no cierra
        }}
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {/* Radix desmonta el contenido al cerrar: el formulario arranca limpio cada vez */}
        <div className="px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}