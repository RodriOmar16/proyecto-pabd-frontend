import type { ListParams } from "@/lib/types";

// URL de la API: sale de .env.local (NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

/** Error con el código HTTP y el mensaje que devolvió la API ({"error": "..."}). */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Llama a la API: arma la URL, envía/recibe JSON y convierte las respuestas de error en ApiError. */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    // fetch solo falla así si no hay conexión (por ejemplo, el backend está apagado)
    throw new ApiError(0, "No se pudo conectar con la API. ¿Está levantado el backend?");
  }

  if (response.status === 204) {
    return undefined as T; // respuesta sin contenido
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, body?.error ?? `Error ${response.status}`);
  }
  return body as T;
}

/** Arma el query string de un listado. Ej: ?page=1&size=20&disabled=true&companyname=ana */
export function buildListQuery(params: ListParams = {}): string {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.size) query.set("size", String(params.size));
  if (params.disabled) query.set("disabled", "true");
  for (const [column, value] of Object.entries(params.filters ?? {})) {
    if (value.trim()) query.set(column, value.trim()); // solo los campos con texto
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}