"use client";

import { useEffect, useState } from "react";
import { useConfirm } from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { ApiError } from "@/lib/api";
import type { Paginated } from "@/lib/types";
import { listEmployees, toggleEmployee } from "../_lib/api";
import type { Employee } from "../_lib/types";
import EmployeeFilters from "./EmployeeFilters";
import EmployeeForm from "./EmployeeForm";
import EmployeesTable from "./EmployeesTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TAMANIO_PAGINA = 10;

/** Lo que se le pide a la API. "version" sirve para forzar una recarga con los mismos filtros. */
type Consulta = {
  page: number;
  filters: Record<string, string>;
  disabled: boolean;
  version: number;
};

type EstadoModal = { abierto: boolean; empleado: Employee | null };

/** Pantalla completa del CRUD de empleados: botón Nuevo, filtros, tabla, paginación y modal. */
export default function EmployeesCrud() {
  const [consulta, setConsulta] = useState<Consulta>({ page: 1, filters: {}, disabled: false, version: 0 });
  const [resultado, setResultado] = useState<Paginated<Employee> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false); // solo cuando se presiona "Buscar"
  const [modal, setModal] = useState<EstadoModal>({ abierto: false, empleado: null });
  const [hayCambios, setHayCambios] = useState(false); // el formulario abierto tiene cambios sin guardar
  const { confirmar, dialogoConfirmacion } = useConfirm();

  // Cada vez que cambia la consulta, se pide el listado a la API
  useEffect(() => {
    let cancelado = false; // evita mostrar una respuesta vieja si llega tarde
    listEmployees({
      page: consulta.page,
      size: TAMANIO_PAGINA,
      filters: consulta.filters,
      disabled: consulta.disabled,
    })
      .then((datos) => {
        if (cancelado) return;
        setResultado(datos);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelado) return;
        setError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
      })
      .finally(() => {
        if (cancelado) return;
        setCargando(false);
        setBuscando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [consulta]);

  function actualizarConsulta(cambios: Partial<Consulta>) {
    setCargando(true);
    setConsulta((actual) => ({ ...actual, ...cambios }));
  }

  function recargar() {
    setCargando(true);
    setConsulta((actual) => ({ ...actual, version: actual.version + 1 }));
  }

  async function cambiarEstado(empleado: Employee) {
    const accion = empleado.disabled ? "habilitar" : "inhabilitar";
    const ok = await confirmar({
      titulo: empleado.disabled ? "Habilitar empleado" : "Inhabilitar empleado",
      mensaje: `¿Seguro que querés ${accion} a ${empleado.firstname} (${empleado.firstname})?`,
      peligro: !empleado.disabled,
    });
    if (!ok) return;
    try {
      await toggleEmployee(empleado.employeeid);
      recargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
    }
  }

  function abrirModal(empleado: Employee | null) {
    setHayCambios(false);
    setModal({ abierto: true, empleado });
  }

  function cerrarModal() {
    setHayCambios(false);
    setModal({ abierto: false, empleado: null });
  }

  /** Cancelar o X: si hay cambios sin guardar, pregunta antes de descartarlos. */
  async function pedirCerrarModal() {
    if (hayCambios) {
      const descartar = await confirmar({
        titulo: "Descartar cambios",
        mensaje: "Hay cambios sin guardar. ¿Querés cerrar y perderlos?",
        textoSi: "Sí, descartar",
        peligro: true,
      });
      if (!descartar) return;
    }
    cerrarModal();
  }

  function guardado() {
    cerrarModal();
    recargar();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Button onClick={() => abrirModal(null)}>
          <Plus aria-hidden="true" />
          Nuevo
        </Button>
      </div>

      <EmployeeFilters
        disabled={consulta.disabled}
        buscando={buscando}
        onBuscar={(filtros) => {
          setBuscando(true);
          actualizarConsulta({ filters: filtros, page: 1 });
        }}
        onCambiarDisabled={(disabled) => actualizarConsulta({ disabled, page: 1 })}
      />

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <EmployeesTable
          empleados={resultado?.data ?? []}
          cargando={cargando}
          onEditar={(empleado) => abrirModal(empleado)}
          onCambiarEstado={cambiarEstado}
        />
        {resultado && (
          <div className="border-t border-border px-4 py-3">
            <Pagination
              page={resultado.page}
              size={resultado.size}
              total={resultado.total}
              onChange={(page) => actualizarConsulta({ page })}
            />
          </div>
        )}
      </div>

      <Modal
        open={modal.abierto}
        title={modal.empleado ? `Editar empleado ${modal.empleado.employeeid}` : "Nuevo empleado"}
        onClose={pedirCerrarModal}
        dismissable={false}
      >
        <EmployeeForm
          empleado={modal.empleado}
          confirmar={confirmar}
          onCambios={setHayCambios}
          onGuardado={guardado}
          onCancelar={pedirCerrarModal}
        />
      </Modal>

      {dialogoConfirmacion}
    </div>
  );
}