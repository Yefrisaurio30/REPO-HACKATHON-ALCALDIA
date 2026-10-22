import { useState } from "react"
import type { Navigate } from "../App"
import AppLink from "./AppLink"
import Icon from "./Icon"

export default function Navbar({
  currentPath,
  navigate,
}: {
  currentPath: string
  navigate: Navigate
}) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: "Inicio", path: "/" },
    { label: "Servicios", path: "/servicios" },
    { label: "Transparencia", path: "/transparencia" },
  ]
  const go = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <header className="site-header">
      <nav aria-label="Navegación principal" className="navbar container">
        <AppLink className="brand" navigate={go} to="/">
          <span className="brand-mark">
            <span />
            <span />
          </span>
          <span>
            Vibra<span>Link</span>
          </span>
        </AppLink>
        <button
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <Icon name={open ? "x" : "menu"} />
        </button>
        <div className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map((link) => (
            <AppLink
              className={currentPath === link.path ? "active" : ""}
              key={link.path}
              navigate={go}
              to={link.path}
            >
              {link.label}
            </AppLink>
          ))}
          <AppLink
            className="button button-primary nav-cta"
            navigate={go}
            to="/actividades"
          >
            <Icon name="calendar" size={18} /> Actividades
          </AppLink>
        </div>
      </nav>
    </header>
  )
}
