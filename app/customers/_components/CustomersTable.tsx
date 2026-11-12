import { Ban, CircleCheck, Pen } from "lucide-react";
import IconButton from "@/components/IconButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Customer } from "../_lib/types";

type Props = {
  clientes: Customer[];
  cargando: boolean;
  onEditar: (cliente: Customer) => void;
  onCambiarEstado: (cliente: Customer) => void;
};

const COLUMNAS = ["Código", "Empresa", "Contacto", "Ciudad", "País", "Teléfono", "Estado", "Acciones"];

/** Tabla de resultados con las acciones de cada fila. */
export default function CustomersTable({ clientes, cargando, onEditar, onCambiarEstado }: Props) {
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
        {clientes.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMNAS.length} className="px-4 py-10 text-center text-muted-foreground">
              {cargando ? "Cargando…" : "No se encontraron clientes."}
            </TableCell>
          </TableRow>
        )}
        {clientes.map((cliente) => (
          <TableRow key={cliente.customerid} className="even:bg-muted/50 hover:bg-accent">
            <TableCell className="px-4 font-mono text-xs">{cliente.customerid}</TableCell>
            <TableCell className="px-4 font-medium">{cliente.companyname}</TableCell>
            <TableCell className="px-4">{cliente.contactname ?? "—"}</TableCell>
            <TableCell className="px-4">{cliente.city ?? "—"}</TableCell>
            <TableCell className="px-4">{cliente.country ?? "—"}</TableCell>
            <TableCell className="px-4">{cliente.phone ?? "—"}</TableCell>
            <TableCell className="px-4">
              <Badge variant="outline" className="gap-1.5">
                <span
                  className={cn("size-2 rounded-full", cliente.disabled ? "bg-lavender" : "bg-success")}
                  aria-hidden="true"
                />
                {cliente.disabled ? "Inhabilitado" : "Activo"}
              </Badge>
            </TableCell>
            <TableCell className="px-4">
              <div className="flex justify-end gap-1">
                {/* Un cliente inhabilitado no se puede editar: primero hay que habilitarlo */}
                {!cliente.disabled && (
                  <IconButton
                    label="Editar"
                    onClick={() => onEditar(cliente)}
                    className="text-orange-500 hover:bg-orange-500/10 hover:text-orange-500"
                  >
                    <Pen aria-hidden="true" />
                  </IconButton>
                )}
                {cliente.disabled ? (
                  <IconButton
                    label="Habilitar"
                    onClick={() => onCambiarEstado(cliente)}
                    className="text-success hover:bg-success/15 hover:text-success"
                  >
                    <CircleCheck aria-hidden="true" />
                  </IconButton>
                ) : (
                  <IconButton
                    label="Inhabilitar"
                    onClick={() => onCambiarEstado(cliente)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Ban aria-hidden="true" />
                  </IconButton>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}