/** Respuesta paginada que devuelven todos los listados de la API. */
export type Paginated<T> = {
  data: T[];
  page: number;
  size: number;
  total: number;
};

/** Parámetros de un listado: página, tamaño, switch de inhabilitados y filtros por columna. */
export type ListParams = {
  page?: number;
  size?: number;
  disabled?: boolean;
  filters?: Record<string, string>; // { columna: texto a buscar }
};