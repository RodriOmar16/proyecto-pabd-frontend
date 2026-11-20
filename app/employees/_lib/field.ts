/**
 * Campos de employees: se usan para armar los filtros y el formulario.
 * "max" es el largo máximo que acepta la base (igual que LIMITES en el backend).
 */

export const CAMPOS  = [
  { name: "employeeid", label: "Código" },
  { name: "lastname", label: "Apellido" },
  { name: "firstname", label: "Nombre" },
  { name: "title", label: "Titulo" },
  { name: "titleofcourtesy", label: "Titulo de cortesía" },
  { name: "birthdate", label: "Fecha de nacimiento" },
  { name: "hiredate", label: "Fecha de contratación" },
  { name: "address", label: "Dirección" },
  { name: "city", label: "Ciudad" },
  { name: "region", label: "Región" },
  { name: "postalcode", label: "Código Postal" },
  { name: "country", label: "País" , max: 3},
  { name: "homephone", label: "Teléfono particular" },
  { name: "extension", label: "Extensión" },
  { name: "notes", label: "Notas" },
  { name: "reportsto", label: "Responsable" },
  { name: "salary", label: "Salario" },
  { name: "comission_pct", label: "Porcentaje de comisión" },
] as const;

/** Nombre de cualquiera de los campos: "customerid" | "companyname" | ... */
export type CampoEmpleado = (typeof CAMPOS)[number]["name"];
