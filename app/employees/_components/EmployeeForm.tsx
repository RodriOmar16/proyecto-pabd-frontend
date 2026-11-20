"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { OpcionesConfirmacion } from "@/components/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { createEmployee, updateEmployee, listCountries, listSupervisors } from "../_lib/api";
import { CAMPOS } from "../_lib/field";
import type { Employee, EmployeeValues, SupervisorOption } from "../_lib/types";

type Props = {
  empleado: Employee | null; // null = alta de un empleado nuevo
  confirmar: (opciones: OpcionesConfirmacion) => Promise<boolean>;
  onCambios: (hayCambios: boolean) => void; // avisa si el formulario difiere de los datos originales
  onGuardado: () => void;
  onCancelar: () => void;
};

/** Valores iniciales: los del empleado a editar, o vacíos si es un alta. */
function valoresIniciales(empleado: Employee | null): EmployeeValues {
  const valores = {} as EmployeeValues;
  for (const campo of CAMPOS) {
    const valor = empleado?.[campo.name];
    valores[campo.name] = valor !== null && valor !== undefined ? String(valor): "";
  }
  return valores;
}

/** Formulario de alta y edición (se muestra dentro del modal). */
export default function EmployeeForm({ empleado, confirmar, onCambios, onGuardado, onCancelar }: Props) {
  const [iniciales] = useState<EmployeeValues>(() => valoresIniciales(empleado));
  const [valores, setValores] = useState<EmployeeValues>(iniciales);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [paises, setPaises] = useState<string[]>([]);
  const [supervisores, setSupervisores] = useState<SupervisorOption[]>([]);

  useEffect(() => {
    async function cargarOpciones() {
      try {
        const [paises, supervisores] = await Promise.all([
          listCountries(),
          listSupervisors(empleado?.employeeid),
        ]);

        setPaises(paises);
        setSupervisores(supervisores);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudieron cargar las opciones"
        );
      }
    }

    cargarOpciones();
  }, [empleado]);


  function cambiarCampo(nombre: keyof EmployeeValues, valor: string) {
    const nuevos = { ...valores, [nombre]: valor };
    setValores(nuevos);
    onCambios(CAMPOS.some((campo) => nuevos[campo.name] !== iniciales[campo.name]));
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    const ok = await confirmar(
      empleado === null
        ? {
            titulo: "Crear empleado",
            mensaje: `¿Confirmás crear el empleado ${valores.employeeid} – ${valores.firstname}?`,
          }
        : {
            titulo: "Guardar cambios",
            mensaje: `¿Confirmás guardar los cambios del empleado ${empleado.employeeid}?`,
          },
    );
    if (!ok) return;

    setError(null);
    setGuardando(true);
    try {
      if (empleado === null) {
        await createEmployee(valores);
      } else {
        await updateEmployee(empleado.employeeid, valores);
      }
      onGuardado();
    } catch (err) {
      // Muestra el mensaje que devolvió la API (ej. "Ya existe un empleado con el código...")
      setError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPOS.map((campo) => {
          const esCodigo = campo.name === "employeeid";
          const obligatorio = esCodigo || campo.name === "firstname";
          const esPais = campo.name === "country";
          const esSupervisor = campo.name === "reportsto";

          return (
            <label key={campo.name} className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              <span>
                {campo.label}
                {obligatorio && <span className="text-destructive"> *</span>}
              </span>

              {esPais ? (
                      <select
                        value={valores[campo.name]}
                        onChange={(e) => cambiarCampo(campo.name, e.target.value)}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">Seleccionar país</option>
                        {paises.map((pais) => (
                          <option key={pais} value={pais}>
                            {pais}
                          </option>
                        ))}
                      </select>
                    ) : esSupervisor ? (
                      <select
                        value={valores[campo.name]}
                        onChange={(e) => cambiarCampo(campo.name, e.target.value)}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">Sin supervisor</option>
                        {supervisores.map((supervisor) => (
                          <option key={supervisor.employeeid} value={supervisor.employeeid}>
                            {supervisor.lastname} {supervisor.firstname} 
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={valores[campo.name]}
                        onChange={(e) =>
                          cambiarCampo(campo.name, esCodigo ? e.target.value.toUpperCase() : e.target.value)
                        }
                        maxLength={"max" in campo && typeof campo.max === "number"
                          ? campo.max
                          : undefined}                        
                        required={obligatorio}
                        readOnly={esCodigo && empleado !== null}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none read-only:opacity-60 focus:border-ring focus:ring-2 focus:ring-ring/30"
                      />
                    )}
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}