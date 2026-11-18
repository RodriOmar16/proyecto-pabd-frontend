import type { CampoCliente } from "./field";

/** Un cliente tal como lo devuelve la API (mismos nombres que las columnas de la tabla). */
export type Customer = {
  customerid: string;
  companyname: string;
  contactname: string | null;
  contacttitle: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalcode: string | null;
  country: string | null;
  phone: string | null;
  fax: string | null;
  disabled: boolean;
};

/** Valores del formulario de alta/edición: un texto por campo. */
export type CustomerValues = Record<CampoCliente, string>;

/** Lo que devuelve el endpoint de cambio de estado (mensaje de fn_abm_cliente). */
export type CustomerEstado = { customerid: string; mensaje: string };