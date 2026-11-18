import type { CampoSupplier } from "./field";

/** Un supplier tal como lo devuelve la API (mismos nombres que las columnas de la tabla). */
export type Supplier = {
  supplierid: number;
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
  homepage: string | null;
};

/** Valores del formulario de alta/edición: un texto por campo. */
export type SupplierValues = Record<CampoSupplier, string>;

/** Lo que devuelve el endpoint de cambio de estado. */
export type SupplierEstado = Pick<Supplier, "supplierid" | "companyname">;