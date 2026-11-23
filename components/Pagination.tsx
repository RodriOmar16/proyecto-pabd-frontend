import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  size: number;
  total: number;
  onChange: (page: number) => void;
};

/** Paginación simple: cantidad de resultados, página actual y botones anterior/siguiente. */
export default function Pagination({ page, size, total, onChange }: Props) {
  const totalPaginas = Math.max(1, Math.ceil(total / size));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">
        {total} resultado{total === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft aria-hidden="true" />
          Anterior
        </Button>
        <span className="px-2">
          Página {page} de {totalPaginas}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPaginas} onClick={() => onChange(page + 1)}>
          Siguiente
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}