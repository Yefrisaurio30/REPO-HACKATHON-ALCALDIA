import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
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

const MOODS = [
  { color: '#ffb703', mouth: 'M15 28c3 6 15 6 18 0' },
  { color: '#2ec4b6', mouth: 'M16 30h16' },
  { color: '#4cc9f0', mouth: 'M16 33c3-5 13-5 16 0' },
  { color: '#ff6b6b', mouth: 'M16 29c2 3 5 3 7 0s5-3 7 0' },
  { color: '#0fa39a', mouth: 'M18 30c2 2 10 2 12 0' },
]

const COLOR_CARDS = [
  { color: '#0fa39a', icon: 'heart' as const },
  { color: '#ffb703', icon: 'calendar' as const },
  { color: '#ff6b6b', icon: 'users' as const },
  { color: '#4cc9f0', icon: 'sparkles' as const },
]

type SearchTarget = 'servicios' | 'actividades'

/** Página de inicio: presentación, buscador general y accesos principales. */
export default function Home() {
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState<SearchTarget>('servicios')
  const [messageIndex, setMessageIndex] = useState(0)
  const [selectedMood, setSelectedMood] = useState(0)
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
      <section className="hero" aria-labelledby="hero-titulo">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="sparkles" size={14} />
            Bienestar joven en Villavicencio
          </p>
          <h1 className="hero-title" id="hero-titulo">
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
        </div>

        <div className="hero-art">
          <svg
            className="hero-illustration"
            id="ilustracion-portada"
            viewBox="0 0 520 460"
            role="img"
            aria-labelledby="ilustracion-portada-titulo"
            focusable="false"
          >
            <title id="ilustracion-portada-titulo">
              Ilustración de una persona meditando entre colinas, con sol y estrellas
            </title>
            <defs>
              <linearGradient id="calma-cielo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c8f5ee" />
                <stop offset="1" stopColor="#eefcf9" />
              </linearGradient>
              <linearGradient id="calma-colina" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2ec4b6" />
                <stop offset="1" stopColor="#0fa39a" />
              </linearGradient>
              <clipPath id="calma-marco">
                <rect x="10" y="10" width="500" height="440" rx="48" />
              </clipPath>
            </defs>
            <rect x="10" y="10" width="500" height="440" rx="48" fill="url(#calma-cielo)" />
            <g clipPath="url(#calma-marco)">
              <circle cx="366" cy="128" r="64" fill="#ffb703" />
              <circle cx="366" cy="128" r="88" fill="#ffb703" opacity="0.16" />
              <path
                d="M10 356C120 270 210 270 300 356c60-58 130-58 210 0v104H10Z"
                fill="url(#calma-colina)"
                opacity="0.85"
              />
              <path
                d="M10 392c110-58 200-58 290 0 70-40 140-40 210 0v58H10Z"
                fill="#0b7f78"
                opacity="0.5"
              />
              <g>
                <circle cx="260" cy="262" r="25" fill="#1f2a2e" />
                <path d="M260 289c-20 0-32 20-32 45h64c0-25-12-45-32-45Z" fill="#3d5a66" />
                <path d="M228 334c-14 0-24 10-24 18h112c0-8-10-18-24-18Z" fill="#1f2a2e" />
                <path
                  d="M244 300c5 6 27 6 32 0"
                  stroke="#c8f5ee"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </g>
              <path
                d="M112 146c3.5 12 6.5 15 18.5 18.5-12 3.5-15 6.5-18.5 18.5-3.5-12-6.5-15-18.5-18.5 12-3.5 15-6.5 18.5-18.5Z"
                fill="#ff6b6b"
              />
              <path
                d="M424 246c2.5 9 4.5 11 13.5 13.5-9 2.5-11 4.5-13.5 13.5-2.5-9-4.5-11-13.5-13.5 9-2.5 11-4.5 13.5-13.5Z"
                fill="#4cc9f0"
              />
              <path
                d="M156 232c2.5 9 4.5 11 13.5 13.5-9 2.5-11 4.5-13.5 13.5-2.5-9-4.5-11-13.5-13.5 9-2.5 11-4.5 13.5-13.5Z"
                fill="#0077b6"
              />
              <path d="M118 372c0-30 24-46 50-46 0 30-22 48-50 46Z" fill="#ffb703" />
              <path
                d="M408 384c0-26 21-40 44-40 0 26-19 42-44 40Z"
                fill="#ff6b6b"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>
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

      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
          <path
            d="M0 72C200 20 380 20 560 62s360 58 560 8 260-26 320-8V120H0Z"
            fill="#c8f5ee"
          />
          <path
            d="M0 92C200 52 380 52 560 84s360 40 560 6 260-14 320-2V120H0Z"
            fill="#ffb703"
            opacity="0.35"
          />
        </svg>
      </div>

      <section className="mood-section" aria-label="Selecciona cómo te sientes">
        <div className="mood-faces" role="group" aria-label="Estados de ánimo">
          {MOODS.map((mood, index) => (
            <button
              key={mood.color}
              type="button"
              className={`mood-face${selectedMood === index ? ' is-selected' : ''}`}
              style={{ '--mood-color': mood.color } as CSSProperties}
              aria-pressed={selectedMood === index}
              aria-label={ROTATING_MESSAGES[index % ROTATING_MESSAGES.length]}
              onClick={() => {
                setSelectedMood(index)
                setMessageIndex(index % ROTATING_MESSAGES.length)
              }}
            >
              <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                <circle
                  cx="24"
                  cy="24"
                  r="20.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                />
                <circle cx="17" cy="20" r="2.5" fill="currentColor" />
                <circle cx="31" cy="20" r="2.5" fill="currentColor" />
                <path
                  d={mood.mouth}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>
        <p className="mood-message" aria-live="polite">
          {ROTATING_MESSAGES[messageIndex]}
        </p>
      </section>

      <section className="breathing-band" aria-hidden="true">
        <span className="breathing-halo" />
        <span className="breathing-circle" />
      </section>

      <section className="status-band" aria-hidden="true">
        <div className="status-track">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`status-segment${index < 4 ? ' is-filled' : ''}`}
            />
          ))}
        </div>
        <span className="status-rocket">
          <Icon name="rocket" size={26} />
        </span>
      </section>

      <section className="color-cards" aria-hidden="true">
        {COLOR_CARDS.map((card) => (
          <div key={card.color} className="color-card" style={{ background: card.color }}>
            <Icon name={card.icon} size={34} />
          </div>
        ))}
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
