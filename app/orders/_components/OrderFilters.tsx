"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, Search } from "lucide-react";
import AsyncCombo, { type Opcion } from "@/components/AsyncCombo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buscarClientes, buscarEmpleados, buscarTransportistas } from "../_lib/api";

type Valores = {
  orderid: string;
  desde: string;
  hasta: string;
  cliente: Opcion | null;
  empleado: Opcion | null;
  transportista: Opcion | null;
  shipaddress: string;
  shipcity: string;
  shipcountry: string;
};

const VACIO: Valores = {
  orderid: "",
  desde: "",
  hasta: "",
  cliente: null,
  empleado: null,
  transportista: null,
  shipaddress: "",
  shipcity: "",
  shipcountry: "",
};

type Props = {
  buscando: boolean;
  onBuscar: (filtros: Record<string, string>) => void;
};

/** Lo que ve el usuario (nombres) -> lo que recibe la API (ids). */
function aFiltros(v: Valores): Record<string, string> {
  return {
    orderid: v.orderid,
    desde: v.desde,
    hasta: v.hasta,
    customerid: v.cliente?.value ?? "",
    employeeid: v.empleado?.value ?? "",
    shipperid: v.transportista?.value ?? "",
    shipaddress: v.shipaddress,
    shipcity: v.shipcity,
    shipcountry: v.shipcountry,
  };
}

function Campo({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function OrderFilters({ buscando, onBuscar }: Props) {
  const [valores, setValores] = useState<Valores>(VACIO);

  function cambiar<K extends keyof Valores>(campo: K, valor: Valores[K]) {
    setValores((actual) => ({ ...actual, [campo]: valor }));
  }

  function buscar(e: FormEvent) {
    e.preventDefault();
    onBuscar(aFiltros(valores));
  }

  function limpiar() {
    setValores(VACIO);
    onBuscar({});
  }

  return (
    <form onSubmit={buscar} className="rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Campo id="f-orderid" label="N° de orden">
          <Input
            id="f-orderid"
            type="number"
            min={1}
            value={valores.orderid}
            onChange={(e) => cambiar("orderid", e.target.value)}
          />
        </Campo>
        <Campo id="f-desde" label="Fecha desde">
          <Input id="f-desde" type="date" value={valores.desde} onChange={(e) => cambiar("desde", e.target.value)} />
        </Campo>
        <Campo id="f-hasta" label="Fecha hasta">
          <Input id="f-hasta" type="date" value={valores.hasta} onChange={(e) => cambiar("hasta", e.target.value)} />
        </Campo>
        <Campo id="f-cliente" label="Cliente">
          <AsyncCombo
            id="f-cliente"
            value={valores.cliente}
            onChange={(opcion) => cambiar("cliente", opcion)}
            buscar={buscarClientes}
          />
        </Campo>
        <Campo id="f-empleado" label="Empleado">
          <AsyncCombo
            id="f-empleado"
            value={valores.empleado}
            onChange={(opcion) => cambiar("empleado", opcion)}
            buscar={buscarEmpleados}
          />
        </Campo>
        <Campo id="f-transportista" label="Transportista">
          <AsyncCombo
            id="f-transportista"
            value={valores.transportista}
            onChange={(opcion) => cambiar("transportista", opcion)}
            buscar={buscarTransportistas}
          />
        </Campo>
        <Campo id="f-pais" label="País de envío">
          <Input id="f-pais" value={valores.shipcountry} onChange={(e) => cambiar("shipcountry", e.target.value)} />
        </Campo>
        <Campo id="f-ciudad" label="Ciudad de envío">
          <Input id="f-ciudad" value={valores.shipcity} onChange={(e) => cambiar("shipcity", e.target.value)} />
        </Campo>
        <Campo id="f-direccion" label="Dirección de envío">
          <Input
            id="f-direccion"
            value={valores.shipaddress}
            onChange={(e) => cambiar("shipaddress", e.target.value)}
          />
        </Campo>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={limpiar} disabled={buscando}>
          Limpiar
        </Button>
        <Button type="submit" disabled={buscando}>
          {buscando ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
          Buscar
        </Button>
      </div>
    </form>
  );
}