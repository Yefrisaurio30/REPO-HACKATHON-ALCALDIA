import { useContext } from 'react'
import { RouterContext, type RouterContextValue } from './context'
import { normalizePath, type RouteMatch } from './routes'

function useRouterContext(): RouterContextValue {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter debe usarse dentro de <RouterProvider>.')
  }
  return context
}

/** Datos de la ruta actual. */
export function useRouter(): RouterContextValue {
  return useRouterContext()
}

/** Ruta actual ya interpretada (sección + identificador). */
export function useRouteMatch(): RouteMatch {
  return useRouterContext().match
}

/** `true` si la ruta actual corresponde a `to`. */
export function useIsActive(to: string): boolean {
  const { path } = useRouterContext()
  const target = normalizePath(to)
  if (target === '/') return path === '/'
  return path === target || path.startsWith(`${target}/`)
}
