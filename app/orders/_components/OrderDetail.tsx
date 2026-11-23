import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatoFecha, formatoMoneda, formatoPorcentaje } from "../_lib/format";
import type { DetalleOrden, Order } from "../_lib/types";

type Props = {
  orden: Order | null;
  detalle: DetalleOrden | null;
  error: string | null;
};

function Dato({ label, valor }: { label: string; valor: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{valor || "—"}</dd>
    </div>
  );
}

/** Cuerpo del modal: datos de la orden y tabla de productos (con scroll propio). */
export default function OrderDetail({ orden, detalle, error }: Props) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }
  if (!orden || !detalle) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Cargando…</p>;
  }

  const destino = [orden.shipaddress, orden.shipcity, orden.shippostalcode, orden.shipcountry]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-5">
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <Dato label="Cliente" valor={orden.cliente} />
        <Dato label="Empleado" valor={orden.empleado} />
        <Dato label="Transportista" valor={orden.transportista} />
        <Dato label="Fecha de pedido" valor={formatoFecha(orden.orderdate)} />
        <Dato label="Fecha requerida" valor={formatoFecha(orden.requireddate)} />
        <Dato label="Fecha de envío" valor={orden.shippeddate ? formatoFecha(orden.shippeddate) : "Pendiente"} />
        <Dato label="Destinatario" valor={orden.shipname} />
        <div className="col-span-2">
          <Dato label="Dirección de envío" valor={destino} />
        </div>
      </dl>

      {/* Contenedor propio: la tabla scrollea sola si supera el alto máximo y el encabezado queda fijo */}
      <div className="max-h-[40vh] overflow-y-auto rounded-lg border">
        <table className="w-full text-sm">
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow className="bg-primary/15 hover:bg-primary/15">
              <TableHead className="px-3 text-primary">Producto</TableHead>
              <TableHead className="px-3 text-right text-primary">Cant.</TableHead>
              <TableHead className="px-3 text-right text-primary">Precio unit.</TableHead>
              <TableHead className="px-3 text-right text-primary">Desc.</TableHead>
              <TableHead className="px-3 text-right text-primary">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalle.lineas.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  La orden no tiene productos.
                </TableCell>
              </TableRow>
            )}
            {detalle.lineas.map((linea) => (
              <TableRow key={linea.productid} className="even:bg-muted/50">
                <TableCell className="px-3">{linea.producto}</TableCell>
                <TableCell className="px-3 text-right">{linea.quantity}</TableCell>
                <TableCell className="px-3 text-right">{formatoMoneda(linea.unitprice)}</TableCell>
                <TableCell className="px-3 text-right">{formatoPorcentaje(linea.discount)}</TableCell>
                <TableCell className="px-3 text-right font-medium">{formatoMoneda(linea.subtotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  );
}

/** Pie fijo del modal: flete y total final. */
export function OrderTotals({ orden, detalle }: Pick<Props, "orden" | "detalle">) {
  if (!orden || !detalle) return null;
  return (
    <dl className="ml-auto grid w-full max-w-xs grid-cols-2 gap-y-1 text-sm">
      <dt className="text-muted-foreground">Flete</dt>
      <dd className="text-right">{formatoMoneda(orden.freight)}</dd>
      <dt className="border-t pt-1 font-semibold">Total final</dt>
      <dd className="border-t pt-1 text-right text-base font-semibold text-primary">
        {formatoMoneda(detalle.total_final)}
      </dd>
    </dl>
  );
}