import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Activities from "./pages/Activities"
import ActivityDetail from "./pages/ActivityDetail"
import Home from "./pages/Home"
import ServiceDetail from "./pages/ServiceDetail"
import Services from "./pages/Services"
import Transparency from "./pages/Transparency"

export type Navigate = (path: string) => void

function getRoute() {
  return window.location.pathname.replace(/\/+$/, "") || "/"
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute())
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigate: Navigate = (path) => {
    if (path === route) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.history.pushState({}, "", path)
    setRoute(path)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  let page = <Home navigate={navigate} />
  if (route === "/servicios") page = <Services navigate={navigate} />
  else if (route.startsWith("/servicios/")) {
    page = (
      <ServiceDetail
        id={decodeURIComponent(route.split("/")[2] || "")}
        navigate={navigate}
      />
    )
  } else if (route === "/actividades") page = <Activities navigate={navigate} />
  else if (route.startsWith("/actividades/")) {
    page = (
      <ActivityDetail
        id={decodeURIComponent(route.split("/")[2] || "")}
        navigate={navigate}
      />
    )
  } else if (route === "/transparencia") page = <Transparency />

  return (
    <div className="app-shell">
      <Navbar currentPath={route} navigate={navigate} />
      <main id="contenido-principal">{page}</main>
      <Footer navigate={navigate} />
    </div>
  )
}
