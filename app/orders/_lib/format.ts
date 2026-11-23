const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" });

export function formatoMoneda(valor: number | null | undefined) {
  return valor == null ? "—" : moneda.format(valor);
}

/** "1996-07-04" -> "04/07/1996" (sin pasar por Date, para no correr el día por zona horaria). */
export function formatoFecha(iso: string | null | undefined) {
  if (!iso) return "—";
  const [anio, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

export function formatoPorcentaje(valor: number) {
  return `${Math.round(valor * 100)} %`;
}