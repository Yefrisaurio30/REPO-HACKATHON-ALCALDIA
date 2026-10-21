import { useCallback, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { RouterContext, type RouterContextValue } from './context'
import { normalizePath, parseRoute } from './routes'

function readLocation(): { path: string; query: URLSearchParams } {
  if (typeof window === 'undefined') {
    return { path: '/', query: new URLSearchParams() }
  }

  const raw = window.location.hash.replace(/^#/, '')
  const [pathPart, queryPart = ''] = raw.split('?')
  const path = normalizePath(pathPart || '/')

  return { path, query: new URLSearchParams(queryPart) }
}

/** Proveedor de navegación por hash (`#/ruta`). */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const handleChange = () => setLocation(readLocation())
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const navigate = useCallback((to: string) => {
    const target = to.startsWith('#') ? to.slice(1) : to
    const nextHash = `#${target}`

    if (window.location.hash === nextHash) {
      // Si la ruta no cambia, `hashchange` no se dispara: actualizamos a mano.
      setLocation(readLocation())
      return
    }

    window.location.hash = nextHash
  }, [])

  const value = useMemo<RouterContextValue>(
    () => ({
      path: location.path,
      query: location.query,
      match: parseRoute(location.path),
      navigate,
    }),
    [location, navigate],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  children: ReactNode
}

/**
 * Enlace interno. Mantiene el comportamiento nativo del navegador
 * (abrir en otra pestaña, copiar enlace) y por eso usa `href="#/ruta"`.
 */
export function Link({ to, children, ...rest }: LinkProps) {
  const target = to.startsWith('#') ? to.slice(1) : to
  return (
    <a href={`#${target}`} {...rest}>
      {children}
    </a>
  )
}
