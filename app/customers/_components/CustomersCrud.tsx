"use client";

import { useEffect, useState } from "react";
import { useConfirm } from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { ApiError } from "@/lib/api";
import type { Paginated } from "@/lib/types";
import { listCustomers, toggleCustomer } from "../_lib/api";
import type { Customer } from "../_lib/types";
import CustomerFilters from "./CustomerFilters";
import CustomerForm from "./CustomerForm";
import CustomersTable from "./CustomersTable";

const TAMANIO_PAGINA = 10;

/** Lo que se le pide a la API. "version" sirve para forzar una recarga con los mismos filtros. */
type Consulta = {
  page: number;
  filters: Record<string, string>;
  disabled: boolean;
  version: number;
};

type EstadoModal = { abierto: boolean; cliente: Customer | null };

/** Pantalla completa del CRUD de clientes: botón Nuevo, filtros, tabla, paginación y modal. */
export default function CustomersCrud() {
  const [consulta, setConsulta] = useState<Consulta>({ page: 1, filters: {}, disabled: false, version: 0 });
  const [resultado, setResultado] = useState<Paginated<Customer> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false); // solo cuando se presiona "Buscar"
  const [modal, setModal] = useState<EstadoModal>({ abierto: false, cliente: null });
  const [hayCambios, setHayCambios] = useState(false); // el formulario abierto tiene cambios sin guardar
  const { confirmar, dialogoConfirmacion } = useConfirm();

  // Cada vez que cambia la consulta, se pide el listado a la API
  useEffect(() => {
    let cancelado = false; // evita mostrar una respuesta vieja si llega tarde
    listCustomers({
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

  async function cambiarEstado(cliente: Customer) {
    const accion = cliente.disabled ? "habilitar" : "inhabilitar";
    const ok = await confirmar({
      titulo: cliente.disabled ? "Habilitar cliente" : "Inhabilitar cliente",
      mensaje: `¿Seguro que querés ${accion} a ${cliente.companyname} (${cliente.customerid})?`,
      peligro: !cliente.disabled,
    });
    if (!ok) return;
    try {
      await toggleCustomer(cliente.customerid);
      recargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
    }
  }

  function abrirModal(cliente: Customer | null) {
    setHayCambios(false);
    setModal({ abierto: true, cliente });
  }

  function cerrarModal() {
    setHayCambios(false);
    setModal({ abierto: false, cliente: null });
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
        <button
          type="button"
          onClick={() => abrirModal(null)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          + Nuevo
        </button>
      </div>

      <CustomerFilters
        disabled={consulta.disabled}
        buscando={buscando}
        onBuscar={(filtros) => {
          setBuscando(true);
          actualizarConsulta({ filters: filtros, page: 1 });
        }}
        onCambiarDisabled={(disabled) => actualizarConsulta({ disabled, page: 1 })}
      />

      {error && (
        <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <CustomersTable
          clientes={resultado?.data ?? []}
          cargando={cargando}
          onEditar={(cliente) => abrirModal(cliente)}
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
        title={modal.cliente ? `Editar cliente ${modal.cliente.customerid}` : "Nuevo cliente"}
        onClose={pedirCerrarModal}
        dismissable={false}
      >
        <CustomerForm
          cliente={modal.cliente}
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