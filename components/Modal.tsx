"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void; // se llama al pedir cerrar: X, Esc o clic afuera (si dismissable)
  children: ReactNode;
  footer?: ReactNode; // opcional: bloque fijo abajo (no scrollea con el cuerpo)
  dismissable?: boolean; // false = no se cierra con clic afuera ni con Esc (solo con la X o un botón)
  size?: "sm" | "lg" | "xl";
};

const ANCHOS = { sm: "sm:max-w-md", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" };

/** Modal con título fijo, cuerpo con scroll (si hace falta) y pie fijo opcional. */
export default function Modal({ open, title, onClose, children, footer, dismissable = true, size = "lg" }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(abierto) => {
        if (!abierto) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className={cn("flex max-h-[90vh] flex-col gap-0 p-0", ANCHOS[size])}
        onInteractOutside={(e) => {
          if (!dismissable) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!dismissable) e.preventDefault();
        }}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="shrink-0 border-t px-6 py-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}