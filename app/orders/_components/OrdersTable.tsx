import { Eye } from "lucide-react";
import IconButton from "@/components/IconButton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatoFecha } from "../_lib/format";
import type { Order } from "../_lib/types";

type Props = {
  ordenes: Order[];
  cargando: boolean;
  onVer: (orden: Order) => void;
};

const COLUMNAS = ["N°", "Fecha", "Cliente", "Empleado", "Transportista", "Destino", "Estado", "Acciones"];

export default function OrdersTable({ ordenes, cargando, onVer }: Props) {
  return (
    <Table>
      <TableHeader className="bg-primary/15 [&_tr]:border-primary/30">
        <TableRow className="hover:bg-transparent">
          {COLUMNAS.map((columna) => (
            <TableHead
              key={columna}
              className={cn(
                "px-4 text-xs font-semibold uppercase tracking-wide text-primary",
                columna === "Acciones" && "text-right"
              )}
            >
              {columna}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={cn(cargando && "opacity-50")}>
        {ordenes.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMNAS.length} className="px-4 py-10 text-center text-muted-foreground">
              {cargando ? "Cargando…" : "No se encontraron órdenes."}
            </TableCell>
          </TableRow>
        )}
        {ordenes.map((orden) => (
          <TableRow key={orden.orderid} className="even:bg-muted/50 hover:bg-accent">
            <TableCell className="px-4 font-mono text-xs">{orden.orderid}</TableCell>
            <TableCell className="px-4">{formatoFecha(orden.orderdate)}</TableCell>
            <TableCell className="px-4 font-medium">{orden.cliente ?? "—"}</TableCell>
            <TableCell className="px-4">{orden.empleado ?? "—"}</TableCell>
            <TableCell className="px-4">{orden.transportista ?? "—"}</TableCell>
            <TableCell className="px-4">
              {[orden.shipcity, orden.shipcountry].filter(Boolean).join(", ") || "—"}
            </TableCell>
            <TableCell className="px-4">
              <Badge variant="outline" className="gap-1.5">
                <span
                  className={cn("size-2 rounded-full", orden.shippeddate ? "bg-success" : "bg-lavender")}
                  aria-hidden="true"
                />
                {orden.shippeddate ? "Enviada" : "Pendiente"}
              </Badge>
            </TableCell>
            <TableCell className="px-4">
              <div className="flex justify-end">
                <IconButton
                  label="Ver detalle"
                  onClick={() => onVer(orden)}
                  className="text-info hover:bg-info/10 hover:text-info"
                >
                  <Eye aria-hidden="true" />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}