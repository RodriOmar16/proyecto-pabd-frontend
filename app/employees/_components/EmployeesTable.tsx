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
import type { Employee } from "../_lib/types";

type Props = {
  empleados: Employee[];
  cargando: boolean;
  onEditar: (empleado: Employee) => void;
  onCambiarEstado: (empleado: Employee) => void;
};

const COLUMNAS = ["Código", "Apellido y nombre", "Titulo", "Ciudad", "País", "Responsable", "Estado", "Acciones"];

/** Tabla de resultados con las acciones de cada fila. */
export default function EmployeesTable({ empleados, cargando, onEditar, onCambiarEstado }: Props) {
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
        {empleados.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMNAS.length} className="px-4 py-10 text-center text-muted-foreground">
              {cargando ? "Cargando…" : "No se encontraron empleados."}
            </TableCell>
          </TableRow>
        )}
        {empleados.map((empleado) => (
          <TableRow key={empleado.employeeid} className="even:bg-muted/50 hover:bg-accent">
            <TableCell className="px-4 font-mono text-xs">{empleado.employeeid}</TableCell>
            <TableCell className="px-4 font-medium">{empleado.lastname} {empleado.firstname}</TableCell>
            <TableCell className="px-4">{empleado.title ?? "—"}</TableCell>
            <TableCell className="px-4">{empleado.city ?? "—"}</TableCell>
            <TableCell className="px-4">{empleado.country ?? "—"}</TableCell>
            <TableCell className="px-4">{empleado.reportsto ?? "—"}</TableCell>
            <TableCell className="px-4">
              <Badge variant="outline" className="gap-1.5">
                <span
                  className={cn("size-2 rounded-full", empleado.disabled ? "bg-lavender" : "bg-success")}
                  aria-hidden="true"
                />
                {empleado.disabled ? "Inhabilitado" : "Activo"}
              </Badge>
            </TableCell>
            <TableCell className="px-4">
              <div className="flex justify-end gap-1">
                {/* Un empleado inhabilitado no se puede editar: primero hay que habilitarlo */}
                {!empleado.disabled && (
                  <IconButton
                    label="Editar"
                    onClick={() => onEditar(empleado)}
                    className="text-orange-500 hover:bg-orange-500/10 hover:text-orange-500"
                  >
                    <Pen aria-hidden="true" />
                  </IconButton>
                )}
                {empleado.disabled ? (
                  <IconButton
                    label="Habilitar"
                    onClick={() => onCambiarEstado(empleado)}
                    className="text-success hover:bg-success/15 hover:text-success"
                  >
                    <CircleCheck aria-hidden="true" />
                  </IconButton>
                ) : (
                  <IconButton
                    label="Inhabilitar"
                    onClick={() => onCambiarEstado(empleado)}
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