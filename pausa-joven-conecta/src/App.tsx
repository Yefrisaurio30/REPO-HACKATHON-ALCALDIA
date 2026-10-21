import './App.css'
import CommunityAgenda from './components/CommunityAgenda'
import ServiceDirectory from './components/ServiceDirectory'
import { activities, services } from './data'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            VL
          </span>
          <div>
            <h1>VibraLink</h1>
            <p className="brand-subtitle">
              Mente Sana Joven · Hackathon Villavicencio 2026
            </p>
          </div>
        </div>
        <nav className="app-nav" aria-label="Secciones">
          <a href="#servicios">Servicios</a>
          <a href="#agenda">Agenda</a>
        </nav>
      </header>

      <section className="hero">
        <h2>Información juvenil en un solo lugar</h2>
        <p>
          Directorio de servicios de orientación, bienestar, educación y comunidad,
          junto con una agenda de actividades juveniles para probar el prototipo de
          VibraLink.
        </p>
        <ul className="hero-stats">
          <li>
            <strong>{services.length}</strong>
            <span>servicios cargados</span>
          </li>
          <li>
            <strong>{activities.length}</strong>
            <span>actividades en la agenda</span>
          </li>
        </ul>
      </section>

      <aside className="demo-notice" role="note">
        <strong>Prototipo con datos de demostración.</strong> Los servicios y
        actividades que se muestran son ficticios: no corresponden a instituciones
        reales de Villavicencio, no tienen datos de contacto y no han sido
        verificados. Su objetivo es probar el buscador, los filtros y la agenda.
      </aside>

      <main>
        <ServiceDirectory />
        <CommunityAgenda />
      </main>

      <footer className="app-footer">
        <p>
          VibraLink · Prototipo del reto «Mente Sana Joven» para la Hackathon
          Villavicencio 2026. Datos cargados desde <code>src/data/services.json</code>{' '}
          y <code>src/data/activities.json</code>.
        </p>
      </footer>
    </div>
  )
}

export default App
