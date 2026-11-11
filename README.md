# Northwind CRUD – Frontend

Interfaz en **Next.js 16 + TypeScript + Tailwind CSS** que consume la API Python del backend.

## Instalación

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

En `.env.local`, cada integrante pone la URL de **su** API:

```ini
NEXT_PUBLIC_API_URL=http://localhost:8001
```

`.env.local` no se sube al repo; solo se sube `.env.example`.

---

## Estructura

```text
frontend/
├── app/
│   ├── layout.tsx              # marco común: barra de navegación (compartido)
│   ├── page.tsx                # inicio: redirige a /customers (compartido)
│   ├── globals.css             # estilos globales de Tailwind (compartido)
│   │
│   ├── customers/              # ← módulo de un integrante (URL: /customers)
│   │   ├── page.tsx            #   página del CRUD
│   │   ├── _components/        #   componentes solo de esta tabla (carpeta privada: no es ruta)
│   │   │   ├── CustomersTable.tsx
│   │   │   ├── CustomerFilters.tsx
│   │   │   └── CustomerForm.tsx
│   │   └── _lib/
│   │       ├── api.ts          #   llamadas a /api/customers
│   │       └── types.ts        #   tipo Customer
│   │
│   ├── products/               # ← otro integrante (misma estructura)
│   └── suppliers/              # ← otro integrante (misma estructura)
│
├── components/                 # componentes compartidos por todas las tablas
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   ├── Switch.tsx
│   └── Modal.tsx
│
└── lib/
    ├── api.ts                  # apiFetch(): URL base, JSON y manejo de errores
    └── types.ts                # tipos comunes: Paginated<T>, ApiError
```

### Qué va en cada lugar

| Lugar | Qué contiene | Quién lo toca |
| --- | --- | --- |
| `app/<tabla>/` | todo lo de una tabla: página, componentes, llamadas a la API y tipos | solo el integrante de esa tabla |
| `components/` | piezas de interfaz reutilizables (paginación, switch, modal) | se modifican avisando al grupo |
| `lib/` | conexión con la API y tipos comunes | se modifican avisando al grupo |
| `app/layout.tsx`, `components/Navbar.tsx` | marco y navegación | cada integrante agrega **un link** para su tabla |

## Convenciones

**Nombres**
- Componentes: Formato llamado `PascalCase.tsx` (`CustomerForm.tsx`), un componente por archivo.
- Funciones y variables: `camelCase` (`listCustomers`, `toggleCustomer`).
- Tipos: `PascalCase` (`Customer`, `Paginated<Customer>`).
- Carpetas de rutas en minúscula y en plural, igual que la API: `customers`, `products`.

**Cada módulo tiene las mismas piezas**

| Archivo | Contenido |
| --- | --- |
| `_lib/types.ts` | el tipo de la tabla, con los mismos nombres de campo que el JSON de la API (`companyname`, `disabled`…) |
| `_lib/api.ts` | `list(params)`, `get(id)`, `create(data)`, `update(id, data)`, `toggle(id)`, siempre usando `apiFetch` |
| `_components/<Tabla>Table.tsx` | tabla con los registros |
| `_components/<Tabla>Filters.tsx` | un campo de búsqueda por columna buscable y el switch "Inhabilitados" |
| `_components/<Tabla>Form.tsx` | formulario de alta y edición |
| `page.tsx` | arma la página con los componentes anteriores |

**Reglas**
- Nunca escribir la URL de la API a mano: siempre `apiFetch` de `lib/api.ts`, que usa `NEXT_PUBLIC_API_URL`.
- `'use client'` solo en los componentes interactivos (tabla, filtros, formulario), no en todo.
- Estilos solo con clases de Tailwind; no crear archivos `.css` nuevos.
- Si algo de una tabla sirve para las demás, se mueve a `components/` o `lib/` y se avisa al grupo.

## Pantalla de cada tabla (igual para todas)

- Al entrar, lista los registros **habilitados**, paginados.
- Un campo de búsqueda por cada columna buscable; los filtros se combinan.
- Switch **"Inhabilitados"**: activado, muestra solo los inhabilitados (`disabled=true`).
- Botones por fila: **Editar** y **Habilitar/Inhabilitar**.
- Botón **Nuevo** para dar de alta.
- Errores de la API (400, 404, 409) se muestran con el mensaje que devuelve el backend.
Tener esto en cuento si es que lo admite la tabla, sino consultar como poder lograrlo

## Cómo agregar una tabla

1. Copiar la carpeta `app/customers` con el nombre de la tabla.
2. Adaptar `_lib/types.ts` y `_lib/api.ts` a la tabla y a su ruta de la API.
3. Adaptar columnas, filtros y formulario en `_components/`.
4. Agregar el link en `components/Navbar.tsx`.

## Git

- Ramas: `feature/<tabla>-front` (ej. `feature/products-front`).
- Pull request hacia `main`, revisado por otro integrante.