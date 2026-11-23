"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getOrder, getOrderDetail } from "./api";
import type { DetalleOrden, Order } from "./types";

type Datos = { orderid: number; orden: Order; detalle: DetalleOrden };
type Falla = { orderid: number; mensaje: string };

/** Carga encabezado y detalle de una orden. Con null no hace nada (modal cerrado). */
export function useOrderDetail(orderid: number | null) {
  const [datos, setDatos] = useState<Datos | null>(null);
  const [falla, setFalla] = useState<Falla | null>(null);

  useEffect(() => {
    if (orderid === null) return;
    let cancelado = false;
    Promise.all([getOrder(orderid), getOrderDetail(orderid)])
      .then(([orden, detalle]) => {
        if (cancelado) return;
        setDatos({ orderid, orden, detalle });
        setFalla(null);
      })
      .catch((err: unknown) => {
        if (cancelado) return;
        setFalla({ orderid, mensaje: err instanceof ApiError ? err.message : "Ocurrió un error inesperado" });
      });
    return () => {
      cancelado = true;
    };
  }, [orderid]);

  // Solo vale lo que corresponde a la orden abierta (evita ver un instante la anterior)
  const actual = datos?.orderid === orderid ? datos : null;
  return {
    orden: actual?.orden ?? null,
    detalle: actual?.detalle ?? null,
    error: falla?.orderid === orderid ? falla.mensaje : null,
  };
}