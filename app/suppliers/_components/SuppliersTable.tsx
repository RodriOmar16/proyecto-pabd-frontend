import { Ban, CircleCheck, Pen } from "lucide-react";
import IconButton from "@/components/IconButton";
import type { Supplier } from "../_lib/types";

type Props = {
  suppliers: Supplier[];
  cargando: boolean;
  onEditar: (supplier: Supplier) => void;
  onCambiarEstado: (supplier: Supplier) => void;
};

const COLUMNAS = ["Código", "Empresa", "Contacto", "Ciudad", "País", "Teléfono", "Acciones"];

/** Tabla de resultados con las acciones de cada fila. */
export default function SuppliersTable({ suppliers, cargando, onEditar, onCambiarEstado }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-muted">
          <tr>
            {COLUMNAS.map((columna) => (
              <th key={columna} className={`px-4 py-3 font-medium ${columna === "Acciones" ? "text-right" : ""}`}>
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cargando ? "opacity-50" : ""}>
          {suppliers.length === 0 && (
            <tr>
              <td colSpan={COLUMNAS.length} className="px-4 py-10 text-center text-muted">
                {cargando ? "Cargando…" : "No se encontraron suppliers."}
              </td>
            </tr>
          )}
          {suppliers.map((supplier) => (
            <tr key={supplier.supplierid} className="border-b border-border last:border-0 hover:bg-primary/5">
              <td className="px-4 py-3 font-mono text-xs">{supplier.supplierid}</td>
              <td className="px-4 py-3 font-medium">{supplier.companyname}</td>
              <td className="px-4 py-3">{supplier.contactname ?? "—"}</td>
              <td className="px-4 py-3">{supplier.city ?? "—"}</td>
              <td className="px-4 py-3">{supplier.country ?? "—"}</td>
              <td className="px-4 py-3">{supplier.phone ?? "—"}</td>
              {/*
              <td className="px-4 py-3">
                
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs">
                  <span  />
                </span>
              </td>
              */}
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  {/* Un supplier inhabilitado no se puede editar: primero hay que habilitarlo */}
                  {(
                    <IconButton
                      label="Editar"
                      onClick={() => onEditar(supplier)}
                      className="text-orange-500 hover:bg-orange-500/10"
                    >
                      <Pen className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  )}
                  {(
                    <IconButton
                      label="Eliminar"
                      onClick={() => onCambiarEstado(supplier)}
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