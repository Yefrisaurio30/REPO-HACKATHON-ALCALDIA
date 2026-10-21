import { createContext } from 'react'
import type { RouteMatch } from './routes'

export interface RouterContextValue {
  /** Ruta actual normalizada, por ejemplo `/servicios`. */
  path: string
  /** Parámetros de búsqueda de la ruta actual (`?q=...`). */
  query: URLSearchParams
  /** Ruta interpretada (sección y, si aplica, identificador). */
  match: RouteMatch
  /** Cambia de ruta interna. */
  navigate: (to: string) => void
}

/** Contexto de navegación. Lo consumen los hooks de `src/router/hooks.ts`. */
export const RouterContext = createContext<RouterContextValue | null>(null)
