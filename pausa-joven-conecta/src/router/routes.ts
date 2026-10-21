/**
 * Rutas de la aplicación.
 *
 * El prototipo usa navegación por hash (`#/servicios/service-demo-001`) para
 * no depender de un enrutador externo ni de configuración del servidor:
 * las URLs son enlaces internos reales (`<a href="#/...">`) y funcionan con
 * el teclado, el historial del navegador y las herramientas de auditoría.
 */
export type RouteName =
  | 'inicio'
  | 'servicios'
  | 'servicio-detalle'
  | 'actividades'
  | 'actividad-detalle'
  | 'transparencia'
  | 'no-encontrado'

export interface RouteMatch {
  name: RouteName
  /** Identificador del registro cuando la ruta es de detalle. */
  id: string | null
  /** Ruta normalizada, por ejemplo `/servicios/service-demo-001`. */
  path: string
}

/** Normaliza una ruta: sin barra final y con barra inicial garantizada. */
export function normalizePath(path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`
  if (withSlash.length > 1 && withSlash.endsWith('/')) {
    return withSlash.slice(0, -1)
  }
  return withSlash
}

/** Convierte la ruta (sin query) en el nombre de ruta y sus parámetros. */
export function parseRoute(path: string): RouteMatch {
  const normalized = normalizePath(path)
  const segments = normalized.split('/').filter(Boolean)

  if (segments.length === 0) {
    return { name: 'inicio', id: null, path: normalized }
  }

  const [section, id] = segments

  if (section === 'servicios') {
    if (!id) return { name: 'servicios', id: null, path: normalized }
    return { name: 'servicio-detalle', id, path: normalized }
  }

  if (section === 'actividades') {
    if (!id) return { name: 'actividades', id: null, path: normalized }
    return { name: 'actividad-detalle', id, path: normalized }
  }

  if (section === 'transparencia' && !id) {
    return { name: 'transparencia', id: null, path: normalized }
  }

  return { name: 'no-encontrado', id: null, path: normalized }
}

/** Construye la ruta interna de un servicio. */
export function servicePath(id: string): string {
  return `/servicios/${encodeURIComponent(id)}`
}

/** Construye la ruta interna de una actividad. */
export function activityPath(id: string): string {
  return `/actividades/${encodeURIComponent(id)}`
}

/** Rutas de navegación principal, en orden de menú. */
export const NAV_ROUTES = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/transparencia', label: 'Transparencia' },
] as const

/** Ruta de la llamada a la acción destacada del encabezado. */
export const ACTIVITIES_ROUTE = { to: '/actividades', label: 'Actividades' } as const
