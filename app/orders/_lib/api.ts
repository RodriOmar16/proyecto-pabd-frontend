import type { Opcion } from "@/components/AsyncCombo";
import { apiFetch, buildListQuery } from "@/lib/api";
import type { ListParams, Paginated } from "@/lib/types";
import type { DetalleOrden, Order } from "./types";

const BASE = "/api/orders";

/** Listado paginado con filtros. */
export function listOrders(params: ListParams) {
  return apiFetch<Paginated<Order>>(BASE + buildListQuery(params));
}

/** Encabezado de una orden. */
export function getOrder(id: number) {
  return apiFetch<Order>(`${BASE}/${id}`);
}

/** Líneas de productos y total final de una orden. */
export function getOrderDetail(id: number) {
  return apiFetch<DetalleOrden>(`${BASE}/${id}/detalle`);
}

type ItemLista = { nombre: string; disabled: boolean } & Record<string, unknown>;

/** Pide una lista para un seleccionable y la convierte en opciones { value, label }. */
async function buscarLista(recurso: string, campoId: string, texto: string): Promise<Opcion[]> {
  const query = texto.trim() ? `?buscar=${encodeURIComponent(texto.trim())}` : "";
  const { data } = await apiFetch<{ data: ItemLista[] }>(`${BASE}/${recurso}${query}`);
  return data.map((item) => ({
    value: String(item[campoId]),
    label: item.disabled ? `${item.nombre} (inhabilitado)` : item.nombre,
  }));
}

export const buscarClientes = (texto: string) => buscarLista("clientes", "customerid", texto);
export const buscarEmpleados = (texto: string) => buscarLista("empleados", "employeeid", texto);
export const buscarTransportistas = (texto: string) => buscarLista("transportistas", "shipperid", texto);