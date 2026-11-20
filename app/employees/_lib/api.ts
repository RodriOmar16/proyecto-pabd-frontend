import { apiFetch, buildListQuery } from "@/lib/api";
import type { ListParams, Paginated } from "@/lib/types";
import type { Employee, EmployeeEstado, EmployeeValues, SupervisorOption } from "./types";

const BASE = "/api/employees";

/** Listado paginado con filtros por columna y switch de inhabilitados. */
export function listEmployees(params: ListParams) {
  return apiFetch<Paginated<Employee>>(BASE + buildListQuery(params));
}

/** Un cliente por su código. */
export function getEmployee(id: number) {
  return apiFetch<Employee>(`${BASE}/${encodeURIComponent(id)}`);
}

/** Alta de un cliente. */
export function createEmployee(data: EmployeeValues) {
  return apiFetch<Employee>(BASE, { method: "POST", body: JSON.stringify(data) });
}

/** Edición de un cliente (el código no se modifica). */
export function updateEmployee(id: number, data: EmployeeValues) {
  return apiFetch<Employee>(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Habilita o inhabilita: invierte el estado actual. */
export function toggleEmployee(id: number) {
  return apiFetch<EmployeeEstado>(`${BASE}/${encodeURIComponent(id)}/estado`, { method: "PATCH" });
}

/** Lista los países disponibles. */
export function listCountries() {
  return apiFetch<string[]>(`${BASE}/paises`);
}

export function listSupervisors(employeeid?: number) {
  const query = employeeid !== undefined
    ? `?employeeid=${encodeURIComponent(employeeid)}`
    : "";

  return apiFetch<SupervisorOption[]>(`${BASE}/supervisores${query}`);
}