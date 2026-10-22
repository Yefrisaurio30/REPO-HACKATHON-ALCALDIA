import { useEffect, useRef } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ActivityDetail from './pages/ActivityDetail'
import Activities from './pages/Activities'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ServiceDetail from './pages/ServiceDetail'
import Services from './pages/Services'
import Transparency from './pages/Transparency'
import { RouterProvider } from './router'
import { useRouteMatch } from './router/hooks'

const TITLES: Record<string, string> = {
  inicio: 'VibraLink · Conecta con lo que te hace bien',
  servicios: 'Directorio de servicios · VibraLink',
  'servicio-detalle': 'Detalle del servicio · VibraLink',
  actividades: 'Agenda comunitaria · VibraLink',
  'actividad-detalle': 'Detalle de la actividad · VibraLink',
  transparencia: 'Transparencia · VibraLink',
  'no-encontrado': 'Página no encontrada · VibraLink',
}

/**
 * Ajusta el título del documento, el scroll y el foco al cambiar de ruta
 * (comportamiento esperado en una aplicación de una sola página).
 */
function RouteEffects() {
  const { name } = useRouteMatch()
  const isFirstRender = useRef(true)

  useEffect(() => {
    document.title = TITLES[name] ?? TITLES.inicio

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
    const main = document.getElementById('contenido')
    main?.focus({ preventScroll: true })
  }, [name])

  return null
}

function CurrentPage() {
  const { name } = useRouteMatch()

  switch (name) {
    case 'inicio':
      return <Home />
    case 'servicios':
      return <Services />
    case 'servicio-detalle':
      return <ServiceDetail />
    case 'actividades':
      return <Activities />
    case 'actividad-detalle':
      return <ActivityDetail />
    case 'transparencia':
      return <Transparency />
    case 'no-encontrado':
      return <NotFound />
    default:
      return <NotFound />
  }
}

function App() {
  return (
    <RouterProvider>
      <div className="bg-decor" aria-hidden="true">
        <span className="bg-blob bg-blob-1" />
        <span className="bg-blob bg-blob-2" />
        <span className="bg-blob bg-blob-3" />
        <svg className="bg-star bg-star-1" viewBox="0 0 24 24" focusable="false">
          <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="#ffb703" />
        </svg>
        <svg className="bg-star bg-star-2" viewBox="0 0 24 24" focusable="false">
          <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="#ff6b6b" />
        </svg>
        <svg className="bg-star bg-star-3" viewBox="0 0 24 24" focusable="false">
          <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="#4cc9f0" />
        </svg>
        <svg className="bg-star bg-star-4" viewBox="0 0 24 24" focusable="false">
          <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="#0fa39a" />
        </svg>
      </div>
      <div className="app-shell">
        <a className="skip-link" href="#contenido">
          Saltar al contenido principal
        </a>
        <RouteEffects />
        <Navbar />
        <main id="contenido" className="app-main" tabIndex={-1}>
          <div className="container">
            <CurrentPage />
          </div>
        </main>
        <Footer />
      </div>
    </RouterProvider>
  )
}

export default App
