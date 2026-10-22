import { useMemo, useState } from "react"
import type { Navigate } from "../App"
import Icon from "../components/Icon"
import SearchBar from "../components/SearchBar"
import ServiceCard from "../components/ServiceCard"
import { services } from "../data/services"

export default function Services({ navigate }: { navigate: Navigate }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("Todas")
  const [modality, setModality] = useState("Todas")
  const categories = [
    "Todas",
    ...new Set(services.map((service) => service.category)),
  ]
  const modalities = [
    "Todas",
    ...new Set(services.map((service) => service.modality)),
  ]
  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("es")
    return services.filter(
      (service) =>
        (!term ||
          `${service.name} ${service.description}`
            .toLocaleLowerCase("es")
            .includes(term)) &&
        (category === "Todas" || service.category === category) &&
        (modality === "Todas" || service.modality === modality),
    )
  }, [query, category, modality])

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">
            <Icon name="heart" size={16} /> Directorio informativo
          </span>
          <h1>
            Encuentra una ruta de <span>orientación</span>
          </h1>
          <p>
            Consulta opciones de demostración y revisa siempre el estado de su
            información.
          </p>
        </div>
      </section>
      <div className="container content-layout">
        <aside className="filters" aria-label="Filtros de servicios">
          <div className="filter-title">
            <Icon name="filter" />
            <h2>Filtrar resultados</h2>
          </div>
          <label>
            Categoría
            <select
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Modalidad
            <select
              onChange={(event) => setModality(event.target.value)}
              value={modality}
            >
              {modalities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button
            className="clear-button"
            onClick={() => {
              setQuery("")
              setCategory("Todas")
              setModality("Todas")
            }}
            type="button"
          >
            Limpiar filtros
          </button>
        </aside>
        <section className="results" aria-labelledby="services-results">
          <SearchBar
            id="service-search"
            onChange={setQuery}
            placeholder="Busca por nombre o descripción"
            value={query}
          />
          <div className="results-header">
            <h2 id="services-results">
              {results.length}{" "}
              {results.length === 1 ? "resultado" : "resultados"}
            </h2>
            <span>Fuentes por verificar</span>
          </div>
          <div className="results-grid" aria-live="polite">
            {results.length ? (
              results.map((service) => (
                <ServiceCard
                  key={service.id}
                  navigate={navigate}
                  service={service}
                />
              ))
            ) : (
              <div className="empty-state">
                <Icon name="search" size={34} />
                <h3>No encontramos coincidencias</h3>
                <p>Prueba otra palabra o elimina alguno de los filtros.</p>
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setQuery("")
                    setCategory("Todas")
                    setModality("Todas")
                  }}
                  type="button"
                >
                  Ver todos los servicios
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
