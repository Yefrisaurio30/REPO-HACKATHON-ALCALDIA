import Icon from '../components/Icon'
import { Link } from '../router'

/** Página mostrada cuando la ruta interna no existe. */
export default function NotFound() {
  return (
    <section className="section not-found">
      <span className="not-found-icon" aria-hidden="true">
        <Icon name="compass" size={26} />
      </span>
      <h1 className="page-title">Esta ruta no existe</h1>
      <p className="page-description">
        El enlace que abriste no corresponde a ninguna sección de VibraLink. Puedes
        volver al inicio o revisar el directorio de servicios.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
        <Link className="btn btn-secondary" to="/servicios">
          Ver servicios
        </Link>
      </div>
    </section>
  )
}
