import { apiFetch, buildListQuery } from "@/lib/api";
import type { ListParams, Paginated } from "@/lib/types";
import type { Customer, CustomerEstado, CustomerValues } from "./types";

const BASE = "/api/customers";

/** Listado paginado con filtros por columna y switch de inhabilitados. */
export function listCustomers(params: ListParams) {
  return apiFetch<Paginated<Customer>>(BASE + buildListQuery(params));
}

/** Un cliente por su código. */
export function getCustomer(id: string) {
  return apiFetch<Customer>(`${BASE}/${encodeURIComponent(id)}`);
}

/** Alta de un cliente. */
export function createCustomer(data: CustomerValues) {
  return apiFetch<Customer>(BASE, { method: "POST", body: JSON.stringify(data) });
}

/** Edición de un cliente (el código no se modifica). */
export function updateCustomer(id: string, data: CustomerValues) {
  return apiFetch<Customer>(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Habilita o inhabilita: invierte el estado actual. */
export function toggleCustomer(id: string) {
  return apiFetch<CustomerEstado>(`${BASE}/${encodeURIComponent(id)}/estado`, { method: "PATCH" });
}