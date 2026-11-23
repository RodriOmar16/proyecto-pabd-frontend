/** Encabezado de una orden, tal como lo devuelve fn_consulta_ordenes. */
export type Order = {
  orderid: number;
  orderdate: string | null;
  requireddate: string | null;
  shippeddate: string | null;
  customerid: string | null;
  cliente: string | null;
  employeeid: number | null;
  empleado: string | null;
  shipperid: number | null;
  transportista: string | null;
  freight: number | null;
  shipname: string | null;
  shipaddress: string | null;
  shipcity: string | null;
  shipregion: string | null;
  shippostalcode: string | null;
  shipcountry: string | null;
};

/** Una línea de producto (fn_py_orden_detalles). */
export type LineaDetalle = {
  orderid: number;
  productid: number;
  producto: string;
  quantity: number;
  unitprice: number;
  discount: number;
  subtotal: number;
};

/** Respuesta de GET /api/orders/{id}/detalle. */
export type DetalleOrden = {
  orderid: number;
  lineas: LineaDetalle[];
  total_final: number | null;
};