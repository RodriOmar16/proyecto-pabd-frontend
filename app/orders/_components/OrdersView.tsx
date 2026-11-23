"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { ApiError } from "@/lib/api";
import type { Paginated } from "@/lib/types";
import { listOrders } from "../_lib/api";
import type { Order } from "../_lib/types";
import OrderDetail, { OrderTotals } from "./OrderDetail";
import { useOrderDetail } from "../_lib/useOrderDetail";
import OrderFilters from "./OrderFilters";
import OrdersTable from "./OrdersTable";

const TAMANIO_PAGINA = 10;

type Consulta = { page: number; filters: Record<string, string> };

/** Pantalla de consulta de órdenes: filtros, tabla, paginación y detalle (ojito). */
export default function OrdersView() {
  const [consulta, setConsulta] = useState<Consulta>({ page: 1, filters: {} });
  const [resultado, setResultado] = useState<Paginated<Order> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verOrden, setVerOrden] = useState<number | null>(null);
  const { orden, detalle, error: errorDetalle } = useOrderDetail(verOrden);

  useEffect(() => {
    let cancelado = false;
    listOrders({ page: consulta.page, size: TAMANIO_PAGINA, filters: consulta.filters })
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

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Órdenes</h1>

      <OrderFilters
        buscando={buscando}
        onBuscar={(filtros) => {
          setBuscando(true);
          actualizarConsulta({ filters: filtros, page: 1 });
        }}
      />

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <OrdersTable ordenes={resultado?.data ?? []} cargando={cargando} onVer={(orden) => setVerOrden(orden.orderid)} />
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
        open={verOrden !== null}
        title={verOrden !== null ? `Orden N° ${verOrden}` : ""}
        onClose={() => setVerOrden(null)}
        size="xl"
        footer={<OrderTotals orden={orden} detalle={detalle} />}
      >
        <OrderDetail orden={orden} detalle={detalle} error={errorDetalle} />
      </Modal>
    </div>
  );
}