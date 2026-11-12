import { Ban, CircleCheck, Pen } from "lucide-react";
import IconButton from "@/components/IconButton";
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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {COLUMNAS.map((columna) => (
              <th key={columna} className={`px-4 py-3 font-medium ${columna === "Acciones" ? "text-right" : ""}`}>
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cargando ? "opacity-50" : ""}>
          {clientes.length === 0 && (
            <tr>
              <td colSpan={COLUMNAS.length} className="px-4 py-10 text-center text-muted-foreground">
                {cargando ? "Cargando…" : "No se encontraron clientes."}
              </td>
            </tr>
          )}
          {clientes.map((cliente) => (
            <tr key={cliente.customerid} className="border-b border-border last:border-0 hover:bg-primary/5">
              <td className="px-4 py-3 font-mono text-xs">{cliente.customerid}</td>
              <td className="px-4 py-3 font-medium">{cliente.companyname}</td>
              <td className="px-4 py-3">{cliente.contactname ?? "—"}</td>
              <td className="px-4 py-3">{cliente.city ?? "—"}</td>
              <td className="px-4 py-3">{cliente.country ?? "—"}</td>
              <td className="px-4 py-3">{cliente.phone ?? "—"}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs">
                  <span className={`h-2 w-2 rounded-full ${cliente.disabled ? "bg-lavender" : "bg-success"}`} />
                  {cliente.disabled ? "Inhabilitado" : "Activo"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  {/* Un cliente inhabilitado no se puede editar: primero hay que habilitarlo */}
                  {!cliente.disabled && (
                    <IconButton
                      label="Editar"
                      onClick={() => onEditar(cliente)}
                      className="text-orange-500 hover:bg-orange-500/10"
                    >
                      <Pen className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  )}
                  {cliente.disabled ? (
                    <IconButton
                      label="Habilitar"
                      onClick={() => onCambiarEstado(cliente)}
                      className="text-success hover:bg-success/15"
                    >
                      <CircleCheck className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  ) : (
                    <IconButton
                      label="Inhabilitar"
                      onClick={() => onCambiarEstado(cliente)}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Ban className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}