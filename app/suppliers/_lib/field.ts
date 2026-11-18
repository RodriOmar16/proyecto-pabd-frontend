/**
 * Campos de suppliers: se usan para armar los filtros y el formulario.
 * "max" es el largo máximo que acepta la base (igual que LIMITES en el backend).
 */
export const CAMPOS = [
  { name: "supplierid", label: "Código", max: 5 },
  { name: "companyname", label: "Empresa", max: 40 },
  { name: "contactname", label: "Contacto", max: 30 },
  { name: "contacttitle", label: "Cargo", max: 30 },
  { name: "address", label: "Dirección", max: 60 },
  { name: "city", label: "Ciudad", max: 15 },
  { name: "region", label: "Región", max: 15 },
  { name: "postalcode", label: "Código postal", max: 10 },
  { name: "country", label: "País", max: 15 },
  { name: "phone", label: "Teléfono", max: 24 },
  { name: "fax", label: "Fax", max: 24 },
  { name: "homepage", label: "Homepage", max: 40 },
] as const;

/** Nombre de cualquiera de los campos: "supplierid" | "companyname" | ... */
export type CampoSupplier = (typeof CAMPOS)[number]["name"];