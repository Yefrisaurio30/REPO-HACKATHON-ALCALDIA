import type { Navigate } from "../App"
import AppLink from "./AppLink"

export default function Footer({ navigate }: { navigate: Navigate }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand-light">
            <span className="brand-mark">
              <span />
              <span />
            </span>
            <span>
              Vibra<span>Link</span>
            </span>
          </div>
          <p>Conecta con lo que te hace bien.</p>
        </div>
        <div>
          <h2>Explora</h2>
          <AppLink navigate={navigate} to="/servicios">
            Directorio de servicios
          </AppLink>
          <AppLink navigate={navigate} to="/actividades">
            Agenda comunitaria
          </AppLink>
          <AppLink navigate={navigate} to="/transparencia">
            Transparencia
          </AppLink>
        </div>
        <div>
          <h2>Sobre el prototipo</h2>
          <p>
            Proyecto informativo para la Hackathon Villavicencio 2026. No ofrece
            atención médica ni reemplaza orientación profesional.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 VibraLink · Prototipo con datos sintéticos
      </div>
    </footer>
  )
}
