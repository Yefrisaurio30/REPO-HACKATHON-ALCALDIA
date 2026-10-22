import { ACTIVITIES_ROUTE, NAV_ROUTES } from '../router/routes'
import { Link } from '../router'
import Icon from './Icon'

/** Pie de página con el alcance del proyecto y sus enlaces internos. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-eyebrow">Transparencia ante todo</span>
          <p className="footer-title">VibraLink</p>
          <p className="footer-tagline">Conecta con lo que te hace bien.</p>
          <p className="footer-text">
            Prototipo del reto «Mente Sana Joven» de la Hackathon Villavicencio 2026.
            VibraLink es una herramienta informativa y comunitaria: no es un
            servicio médico, no evalúa tu salud mental y no reemplaza la atención
            de profesionales.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Enlaces del pie de página">
          <h2 className="footer-heading">Secciones</h2>
          <ul>
            {NAV_ROUTES.map((route) => (
              <li key={route.to}>
                <Link to={route.to}>{route.label}</Link>
              </li>
            ))}
            <li>
              <Link to={ACTIVITIES_ROUTE.to}>{ACTIVITIES_ROUTE.label}</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-notes">
          <h2 className="footer-heading">Antes de usar los datos</h2>
          <ul className="footer-list">
            <li>
              <Icon name="flag" size={16} />
              La mayoría de registros del prototipo son ficticios y están
              marcados como «DATOS FICTICIOS DE DEMOSTRACIÓN»; los reales
              aparecen como «Pendiente de verificación».
            </li>
            <li>
              <Icon name="info" size={16} />
              No hay datos de contacto verificados: cuando falta información se
              muestra un aviso en lugar de inventarla.
            </li>
            <li>
              <Icon name="shield" size={16} />
              No se recopilan datos personales ni se envía información a
              servidores externos.
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Prototipo de demostración construido con React, TypeScript y Vite.
          Datos de ejemplo en <code>src/data/services.json</code> y{' '}
          <code>src/data/activities.json</code>.
        </p>
        <p className="footer-emergency">
          Si estás en una situación de emergencia, acude a los servicios de
          emergencia oficiales o al centro de salud más cercano. VibraLink no es
          un canal de atención urgente.
        </p>
      </div>
    </footer>
  )
}
