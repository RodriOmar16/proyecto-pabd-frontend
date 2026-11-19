import { Ban, Pen } from "lucide-react";
import IconButton from "@/components/IconButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Supplier } from "../_lib/types";
type Props = {
  suppliers: Supplier[];
  cargando: boolean;
  onEditar: (supplier: Supplier) => void;
  onCambiarEstado: (supplier: Supplier) => void;
};
const COLUMNAS = ["Código", "Empresa", "Contacto", "Ciudad", "País", "Teléfono", "Acciones"];
export default function SuppliersTable({ suppliers, cargando, onEditar, onCambiarEstado }: Props) {
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
        {suppliers.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMNAS.length} className="px-4 py-10 text-center text-muted-foreground">
              {cargando ? "Cargando…" : "No se encontraron suppliers."}
            </TableCell>
          </TableRow>
        )}
        {suppliers.map((supplier) => (
          <TableRow key={supplier.supplierid} className="even:bg-muted/50 hover:bg-accent">
            <TableCell className="px-4 font-mono text-xs">{supplier.supplierid}</TableCell>
            <TableCell className="px-4 font-medium">{supplier.companyname}</TableCell>
            <TableCell className="px-4">{supplier.contactname ?? "—"}</TableCell>
            <TableCell className="px-4">{supplier.city ?? "—"}</TableCell>
            <TableCell className="px-4">{supplier.country ?? "—"}</TableCell>
            <TableCell className="px-4">{supplier.phone ?? "—"}</TableCell>
            <TableCell className="px-4">
              <div className="flex justify-end gap-1">
                <IconButton
                  label="Editar"
                  onClick={() => onEditar(supplier)}
                  className="text-orange-500 hover:bg-orange-500/10 hover:text-orange-500"
                >
                  <Pen className="h-4 w-4" aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Eliminar"
                  onClick={() => onCambiarEstado(supplier)}
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Ban className="h-4 w-4" aria-hidden="true" />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}