"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  label: string; // texto del tooltip (y nombre accesible del botón)
  onClick: () => void;
  className?: string; // colores del ícono y del fondo al pasar el mouse
  children: ReactNode; // el ícono
};

/** Botón de solo ícono con tooltip (shadcn): aparece a la izquierda al pasar el mouse o con el teclado. */
export default function IconButton({ label, onClick, className, children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          aria-label={label}
          className={className}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}