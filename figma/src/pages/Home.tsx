import { useMemo, useState } from "react"
import type { Navigate } from "../App"
import ActivityCard from "../components/ActivityCard"
import AppLink from "../components/AppLink"
import Icon from "../components/Icon"
import SearchBar from "../components/SearchBar"
import { activities } from "../data/activities"
import { services } from "../data/services"

export default function Home({ navigate }: { navigate: Navigate }) {
  const [query, setQuery] = useState("")
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es")
    if (normalized.length < 2) return []
    return [
      ...services.map((item) => ({
        id: item.id,
        label: item.name,
        description: item.description,
        type: "Servicio",
        path: `/servicios/${item.id}`,
      })),
      ...activities.map((item) => ({
        id: item.id,
        label: item.name,
        description: item.description,
        type: "Actividad",
        path: `/actividades/${item.id}`,
      })),
    ]
      .filter((item) =>
        `${item.label} ${item.description}`
          .toLocaleLowerCase("es")
          .includes(normalized),
      )
      .slice(0, 6)
  }, [query])
  const featured = activities
    .filter((activity) => activity.status !== "finished")
    .slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <Icon name="spark" size={16} /> Bienestar joven en Villavicencio
            </span>
            <h1>
              Conecta con lo que <span>te hace bien.</span>
            </h1>
            <p>
              Encuentra orientación confiable y descubre actividades para
              compartir, aprender y cuidar tu bienestar.
            </p>
            <div className="hero-actions">
              <AppLink
                className="button button-primary"
                navigate={navigate}
                to="/servicios"
              >
                Explorar servicios <Icon name="arrow" size={18} />
              </AppLink>
              <AppLink
                className="button button-secondary"
                navigate={navigate}
                to="/actividades"
              >
                Ver actividades
              </AppLink>
            </div>
          </div>
          <div className="hero-dashboard" aria-label="Resumen de VibraLink">
            <div className="dashboard-head">
              <span>Tu punto de partida</span>
              <span className="mini-status">
                <i /> Información clara
              </span>
            </div>
            <div className="dashboard-cards">
              <div className="mini-card lilac">
                <span className="icon-box">
                  <Icon name="heart" />
                </span>
                <strong>Apoyo</strong>
                <small>Rutas informativas</small>
              </div>
              <div className="mini-card cyan">
                <span className="icon-box">
                  <Icon name="calendar" />
                </span>
                <strong>Actividades</strong>
                <small>Planes para conectar</small>
              </div>
            </div>
            <div className="wellbeing-card">
              <span className="pulse-circle">
                <Icon name="spark" size={25} />
              </span>
              <div>
                <small>Vibra del día</small>
                <strong>Un paso a la vez también cuenta.</strong>
              </div>
            </div>
            <div className="trust-row">
              <span>
                <Icon name="shield" size={17} /> Fuentes visibles
              </span>
              <span>
                <Icon name="check" size={17} /> Datos fechados
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="search-section container"
        aria-labelledby="search-title"
      >
        <div>
          <span className="section-kicker">Encuentra tu ruta</span>
          <h2 id="search-title">¿Qué necesitas explorar hoy?</h2>
        </div>
        <SearchBar
          id="general-search"
          onChange={setQuery}
          placeholder="Busca apoyo, talleres, deporte..."
          value={query}
        />
        {query.trim().length >= 2 && (
          <div className="global-results" aria-live="polite">
            {matches.length ? (
              matches.map((item) => (
                <AppLink
                  key={`${item.type}-${item.id}`}
                  navigate={navigate}
                  to={item.path}
                >
                  <span>
                    <small>{item.type}</small>
                    <strong>{item.label}</strong>
                  </span>
                  <Icon name="chevron" size={18} />
                </AppLink>
              ))
            ) : (
              <p>
                No encontramos coincidencias. Prueba con otra palabra o explora
                los directorios.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="container pathways">
        <AppLink
          className="pathway-card support"
          navigate={navigate}
          to="/servicios"
        >
          <span className="path-icon">
            <Icon name="heart" size={27} />
          </span>
          <span>
            <small>Directorio informativo</small>
            <strong>Encuentra apoyo</strong>
            <p>
              Consulta opciones de orientación y conoce el estado de cada
              fuente.
            </p>
          </span>
          <Icon name="arrow" />
        </AppLink>
        <AppLink
          className="pathway-card activities"
          navigate={navigate}
          to="/actividades"
        >
          <span className="path-icon">
            <Icon name="calendar" size={27} />
          </span>
          <span>
            <small>Agenda comunitaria</small>
            <strong>Explora actividades</strong>
            <p>Descubre talleres, cultura, deporte y espacios para conectar.</p>
          </span>
          <Icon name="arrow" />
        </AppLink>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Agenda abierta</span>
            <h2>Planes para conectar</h2>
          </div>
          <AppLink className="text-link" navigate={navigate} to="/actividades">
            Ver toda la agenda <Icon name="arrow" size={18} />
          </AppLink>
        </div>
        <div className="cards-grid">
          {featured.map((activity) => (
            <ActivityCard
              activity={activity}
              key={activity.id}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      <section className="verification-section">
        <div className="container verification-grid">
          <div className="verification-visual">
            <div className="shield-large">
              <Icon name="shield" size={48} />
            </div>
            <span className="dot dot-a" />
            <span className="dot dot-b" />
          </div>
          <div>
            <span className="section-kicker">Transparencia ante todo</span>
            <h2>Sabes de dónde viene cada dato</h2>
            <p>
              Cada registro muestra su fuente, fecha de consulta y estado de
              verificación. Cuando no hay información confirmada, te lo decimos
              claramente.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" /> Fuentes y fechas visibles
              </li>
              <li>
                <Icon name="check" /> Advertencias para datos no verificados
              </li>
              <li>
                <Icon name="check" /> Canal de reporte sin datos personales
              </li>
            </ul>
            <AppLink
              className="button button-dark"
              navigate={navigate}
              to="/transparencia"
            >
              Conoce el proceso
            </AppLink>
          </div>
        </div>
      </section>
      <aside className="demo-notice container">
        <Icon name="info" />
        <div>
          <strong>Este sitio es un prototipo informativo.</strong>
          <p>
            Los servicios recomendados están pendientes de contraste directo
            con sus fuentes oficiales; las actividades son sintéticas y están
            señaladas. VibraLink no ofrece diagnósticos, tratamientos ni
            atención médica.
          </p>
        </div>
      </aside>
    </>
  )
}
