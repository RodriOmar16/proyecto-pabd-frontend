import { apiFetch, buildListQuery } from "@/lib/api";
import type { ListParams, Paginated } from "@/lib/types";
import type { Supplier, SupplierEstado, SupplierValues } from "./types";

const BASE = "/api/suppliers";

/** Listado paginado con filtros por columna y switch de inhabilitados. */
export function listSuppliers(params: ListParams) {
  return apiFetch<Paginated<Supplier>>(BASE + buildListQuery(params));
}

/**Obtener un supplier mediante su código. */
export function getSupplier(id: number) {
  return apiFetch<Supplier>(`${BASE}/${encodeURIComponent(id)}`);
}

/** Alta de un supplier. */
export function createSupplier(data: SupplierValues) {
  return apiFetch<Supplier>(BASE, { method: "POST", body: JSON.stringify(data) });
}

/** Edición de un supplier (el código no se modifica). */
export function updateSupplier(id: number, data: SupplierValues) {
  return apiFetch<Supplier>(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Eliminación de un supplier */
export function deleteSupplier(id: number) {
  return apiFetch<SupplierEstado>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}