import type { CampoEmpleado } from "./field";

/** Un empleado tal como lo devuelve la API (mismos nombres que las columnas de la tabla). */
export type Employee = {
  employeeid: number;
  lastname: string;
  firstname: string | null;
  title: string | null;
  titleofcourtesy: string | null;
  birthdate: string | null;
  hiredate: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalcode: string | null;
  country: string | null;
  homephone: string | null;
  extension: string | null;
  notes: string | null;
  reportsto: number | null;
  salary: number | null;
  comission_pct: number | null;
  disabled: boolean;
};

export type SupervisorOption = {
  employeeid: number;
  firstname: string;
  lastname: string;
};

/** Valores del formulario de alta/edición: un texto por campo. */
export type EmployeeValues = Record<CampoEmpleado, string>;

/** Lo que devuelve el endpoint de cambio de estado (mensaje de fn_abm_employee). */
export type EmployeeEstado = { employeeid: string; mensaje: string };