import { useEffect, useRef, useState } from 'react'
import { ACTIVITIES_ROUTE, NAV_ROUTES } from '../router/routes'
import { Link } from '../router'
import { useIsActive, useRouter } from '../router/hooks'
import Icon from './Icon'

function Wordmark() {
  return (
    <span className="wordmark">
      <svg
        className="wordmark-logo"
        viewBox="0 0 32 32"
        role="img"
        aria-label="VibraLink"
        focusable="false"
      >
        <rect width="32" height="32" rx="10" fill="#0fa39a" />
        <path
          d="M7 21c3.5-7.5 6.5-7.5 10 0s6.5 7.5 10 0"
          fill="none"
          stroke="#fff6e9"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="wordmark-text">
        Vibra<span className="wordmark-accent">Link</span>
      </span>
    </span>
  )
}

/** Encabezado con logotipo, menú de navegación y acceso destacado. */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { path } = useRouter()
  const [menuPath, setMenuPath] = useState(path)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Cierra el menú al cambiar de ruta (ajuste durante el render).
  if (menuPath !== path) {
    setMenuPath(path)
    if (isOpen) setIsOpen(false)
  }

  // Cierra el menú con la tecla Escape y devuelve el foco al botón.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="VibraLink, ir al inicio">
          <Wordmark />
        </Link>

        <nav className="navbar-nav" aria-label="Navegación principal">
          {NAV_ROUTES.map((route) => (
            <NavLink key={route.to} to={route.to}>
              {route.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link className="btn btn-primary btn-cta" to={ACTIVITIES_ROUTE.to}>
            <Icon name="calendar" size={18} />
            <span>{ACTIVITIES_ROUTE.label}</span>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="navbar-toggle"
            aria-expanded={isOpen}
            aria-controls="menu-movil"
            onClick={() => setIsOpen((value) => !value)}
          >
            <Icon name={isOpen ? 'close' : 'menu'} size={22} />
            <span className="sr-only">
              {isOpen ? 'Cerrar el menú' : 'Abrir el menú de navegación'}
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        className={`navbar-panel${isOpen ? ' is-open' : ''}`}
        hidden={!isOpen}
      >
        <nav className="navbar-panel-nav" aria-label="Navegación principal (móvil)">
          {NAV_ROUTES.map((route) => (
            <NavLink key={route.to} to={route.to} variant="panel">
              {route.label}
            </NavLink>
          ))}
          <Link
            className="btn btn-primary btn-block"
            to={ACTIVITIES_ROUTE.to}
            onClick={() => setIsOpen(false)}
          >
            <Icon name="calendar" size={18} />
            <span>{ACTIVITIES_ROUTE.label}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

type NavLinkProps = {
  to: string
  children: string
  variant?: 'default' | 'panel'
}

function NavLink({ to, children, variant = 'default' }: NavLinkProps) {
  const isActive = useIsActive(to)

  return (
    <Link
      to={to}
      className={`navbar-link${variant === 'panel' ? ' navbar-link-panel' : ''}${
        isActive ? ' is-active' : ''
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
