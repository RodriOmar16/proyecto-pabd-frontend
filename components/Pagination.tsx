type Props = {
  page: number;
  size: number;
  total: number;
  onChange: (page: number) => void;
};

/** Paginación simple: cantidad de resultados, página actual y botones anterior/siguiente. */
export default function Pagination({ page, size, total, onChange }: Props) {
  const totalPaginas = Math.max(1, Math.ceil(total / size));
  const boton =
    "rounded-md border border-border px-3 py-1.5 transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">
        {total} resultado{total === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-2">
        <button type="button" className={boton} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          ‹ Anterior
        </button>
        <span className="px-2">
          Página {page} de {totalPaginas}
        </span>
        <button type="button" className={boton} disabled={page >= totalPaginas} onClick={() => onChange(page + 1)}>
          Siguiente ›
        </button>
      </div>
    </div>
  );
}