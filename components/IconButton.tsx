import type { ReactNode } from "react";

type Props = {
  label: string; // texto del tooltip (y nombre accesible del botón)
  onClick: () => void;
  className?: string; // colores del ícono y del fondo al pasar el mouse
  children: ReactNode; // el ícono
};

/** Botón de solo ícono con tooltip: aparece a la izquierda al pasar el mouse o al enfocarlo con el teclado. */
export default function IconButton({ label, onClick, className = "", children }: Props) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`rounded-md p-1.5 transition-colors ${className}`}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}