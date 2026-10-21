import { useEffect, useMemo, useState, type FormEvent } from 'react'
import ActivityCard from '../components/ActivityCard'
import Callout from '../components/Callout'
import Icon from '../components/Icon'
import ServiceCard from '../components/ServiceCard'
import { filterActivities, services } from '../data'
import { useNow } from '../hooks/useNow'
import { Link } from '../router'
import { useRouter } from '../router/hooks'

const ROTATING_MESSAGES = [
  'Un paso a la vez también cuenta.',
  'Participar también es construir comunidad.',
  'Lo que te mueve, te ayuda.',
  'Un espacio cerca puede cambiar la semana.',
]

type SearchTarget = 'servicios' | 'actividades'

/** Página de inicio: presentación, buscador general y accesos principales. */
export default function Home() {
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState<SearchTarget>('servicios')
  const [messageIndex, setMessageIndex] = useState(0)
  const { navigate } = useRouter()
  const now = useNow()

  useEffect(() => {
    const timer = setInterval(
      () => setMessageIndex((index) => (index + 1) % ROTATING_MESSAGES.length),
      8000,
    )
    return () => clearInterval(timer)
  }, [])

  const upcomingActivities = useMemo(
    () => filterActivities({ status: 'proximas', now }).slice(0, 3),
    [now],
  )

  const featuredServices = useMemo(() => services.slice(0, 3), [])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const clean = query.trim()
    const path = target === 'servicios' ? '/servicios' : '/actividades'
    navigate(clean ? `${path}?q=${encodeURIComponent(clean)}` : path)
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="sparkles" size={14} />
            Bienestar joven en Villavicencio
          </p>
          <h1 className="hero-title">
            Conecta con <span className="hero-title-accent">lo que te hace bien.</span>
          </h1>
          <p className="hero-lead">
            Encuentra orientación confiable y descubre actividades para compartir,
            aprender y cuidar tu bienestar. Cada ficha muestra de dónde viene el
            dato y cuándo se revisó.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/servicios">
              Explorar servicios
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link className="btn btn-secondary" to="/actividades">
              Ver actividades
            </Link>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Punto de partida">
          <div className="hero-panel-head">
            <h2 className="hero-panel-title">Tu punto de partida</h2>
            <span className="hero-panel-note">
              <span className="dot dot-teal" aria-hidden="true" />
              Información clara
            </span>
          </div>

          <div className="hero-panel-cards">
            <Link className="mini-card mini-card-purple" to="/servicios">
              <span className="mini-card-icon" aria-hidden="true">
                <Icon name="heart" size={20} />
              </span>
              <span>
                <strong>Apoyo</strong>
                <small>Rutas informativas</small>
              </span>
            </Link>
            <Link className="mini-card mini-card-teal" to="/actividades">
              <span className="mini-card-icon" aria-hidden="true">
                <Icon name="calendar" size={20} />
              </span>
              <span>
                <strong>Actividades</strong>
                <small>Planes para conectar</small>
              </span>
            </Link>
          </div>

          <div className="hero-quote">
            <span className="hero-quote-icon" aria-hidden="true">
              <Icon name="sparkles" size={20} />
            </span>
            <span>
              <small>Vibra del día</small>
              <strong>{ROTATING_MESSAGES[messageIndex]}</strong>
            </span>
          </div>

          <ul className="hero-panel-pills">
            <li>
              <Icon name="shield" size={15} />
              Fuentes visibles
            </li>
            <li>
              <Icon name="check" size={15} />
              Datos fechados
            </li>
          </ul>
        </aside>
      </section>

      <section className="search-band" aria-labelledby="titulo-busqueda">
        <div className="search-band-copy">
          <p className="eyebrow">Encuentra tu ruta</p>
          <h2 id="titulo-busqueda">¿Qué necesitas explorar hoy?</h2>
        </div>
        <form className="global-search" role="search" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="busqueda-general">
            Buscar en VibraLink
          </label>
          <div className="global-search-field">
            <span className="search-icon" aria-hidden="true">
              <Icon name="search" size={18} />
            </span>
            <input
              id="busqueda-general"
              type="search"
              name="q"
              value={query}
              placeholder="Busca apoyo, talleres, deporte…"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <label className="sr-only" htmlFor="busqueda-destino">
            ¿Dónde quieres buscar?
          </label>
          <select
            id="busqueda-destino"
            className="select-control"
            value={target}
            onChange={(event) => setTarget(event.target.value as SearchTarget)}
          >
            <option value="servicios">En servicios</option>
            <option value="actividades">En actividades</option>
          </select>
          <button className="btn btn-primary" type="submit">
            Buscar
            <Icon name="arrow-right" size={18} />
          </button>
        </form>
      </section>

      <section className="section" aria-labelledby="titulo-rutas">
        <div className="section-head">
          <p className="eyebrow">Dos caminos</p>
          <h2 id="titulo-rutas">¿Por dónde quieres empezar?</h2>
        </div>

        <div className="feature-grid">
          <Link className="feature-card feature-card-purple" to="/servicios">
            <span className="feature-card-icon" aria-hidden="true">
              <Icon name="heart" size={24} />
            </span>
            <span className="feature-card-body">
              <span className="feature-card-eyebrow">Directorio informativo</span>
              <span className="feature-card-title">Encuentra apoyo</span>
              <span className="feature-card-text">
                Consulta opciones de orientación y conoce el estado de cada fuente.
              </span>
            </span>
            <Icon className="feature-card-arrow" name="arrow-right" size={22} />
          </Link>

          <Link className="feature-card feature-card-teal" to="/actividades">
            <span className="feature-card-icon" aria-hidden="true">
              <Icon name="calendar" size={24} />
            </span>
            <span className="feature-card-body">
              <span className="feature-card-eyebrow">Agenda comunitaria</span>
              <span className="feature-card-title">Explora actividades</span>
              <span className="feature-card-text">
                Descubre talleres, cultura, deporte y espacios para conectar.
              </span>
            </span>
            <Icon className="feature-card-arrow" name="arrow-right" size={22} />
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="titulo-agenda">
        <div className="section-head section-head-row">
          <div>
            <p className="eyebrow">Agenda abierta</p>
            <h2 id="titulo-agenda">Planes para conectar</h2>
          </div>
          <Link className="text-link" to="/actividades">
            Ver toda la agenda
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        {upcomingActivities.length > 0 ? (
          <div className="card-grid">
            {upcomingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} now={now} />
            ))}
          </div>
        ) : (
          <Callout tone="info" title="Por ahora no hay actividades programadas">
            Cuando el equipo cargue nuevas fechas, aparecerán aquí. Mientras tanto
            puedes revisar las actividades finalizadas.
          </Callout>
        )}
      </section>

      <section className="section" aria-labelledby="titulo-servicios">
        <div className="section-head section-head-row">
          <div>
            <p className="eyebrow">Rutas de apoyo</p>
            <h2 id="titulo-servicios">Opciones para empezar hoy</h2>
          </div>
          <Link className="text-link" to="/servicios">
            Ver todos los servicios
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        <div className="card-grid">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="section verification-section" aria-labelledby="titulo-verificacion">
        <div className="section-head">
          <p className="eyebrow">Cómo verificamos</p>
          <h2 id="titulo-verificacion">Información con fecha y fuente</h2>
          <p>
            Cada ficha dice de dónde viene la información y cuándo se consultó.
            Si algo no está verificado, lo mostramos con una advertencia clara en
            lugar de presentarlo como si fuera seguro.
          </p>
        </div>

        <ol className="steps-grid">
          <li className="step-card">
            <span className="step-number">01</span>
            <h3>Recopilamos</h3>
            <p>
              Reunimos solo información publicada por la institución o comunidad
              responsable de cada servicio o actividad.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">02</span>
            <h3>Verificamos</h3>
            <p>
              Revisamos la fuente oficial y anotamos la fecha de consulta. Si el
              contacto no se puede confirmar, queda marcado como pendiente.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">03</span>
            <h3>Publicamos</h3>
            <p>
              Cada ficha muestra su estado de verificación, la fuente y la fecha
              para que decidas con criterio.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">04</span>
            <h3>Actualizamos</h3>
            <p>
              Reportas un dato que cambió o que está equivocado y revisamos el
              registro con la misma fecha visible.
            </p>
          </li>
        </ol>

        <Link className="btn btn-secondary" to="/transparencia">
          Ver la página de transparencia
          <Icon name="arrow-right" size={18} />
        </Link>
      </section>

      <section className="section">
        <Callout tone="warning" title="Esto es un prototipo informativo, no un servicio médico">
          VibraLink no hace diagnósticos, no evalúa riesgos y no recomienda
          tratamientos. Si buscas atención profesional de salud mental, usa los
          datos que aparecen en la fuente oficial y confirma siempre con la
          institución.
        </Callout>
      </section>
    </>
  )
}
