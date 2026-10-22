import { useMemo, useState } from "react"
import type { Navigate } from "../App"
import ActivityCard from "../components/ActivityCard"
import Icon from "../components/Icon"
import SearchBar from "../components/SearchBar"
import { activities } from "../data/activities"

export default function Activities({ navigate }: { navigate: Navigate }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("Todas")
  const [dateFilter, setDateFilter] = useState("Próximas")
  const categories = [
    "Todas",
    ...new Set(activities.map((activity) => activity.category)),
  ]
  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("es")
    return activities.filter(
      (activity) =>
        (!term ||
          `${activity.name} ${activity.description}`
            .toLocaleLowerCase("es")
            .includes(term)) &&
        (category === "Todas" || activity.category === category) &&
        (dateFilter === "Todas" ||
          (dateFilter === "Finalizadas"
            ? activity.status === "finished"
            : activity.status !== "finished")),
    )
  }, [query, category, dateFilter])
  return (
    <div className="page">
      <section className="page-hero activities-hero">
        <div className="container">
          <span className="eyebrow">
            <Icon name="calendar" size={16} /> Agenda comunitaria
          </span>
          <h1>
            Encuentra un plan para <span>conectar</span>
          </h1>
          <p>
            Talleres, cultura, deporte y experiencias de bienestar para
            compartir.
          </p>
        </div>
      </section>
      <section className="container agenda-tools">
        <SearchBar
          id="activity-search"
          onChange={setQuery}
          placeholder="Busca una actividad"
          value={query}
        />
        <div className="chip-row" aria-label="Categorías">
          {categories.map((item) => (
            <button
              aria-pressed={category === item}
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="date-filter">
          <label htmlFor="date-filter">Mostrar</label>
          <select
            id="date-filter"
            onChange={(event) => setDateFilter(event.target.value)}
            value={dateFilter}
          >
            <option>Próximas</option>
            <option>Finalizadas</option>
            <option>Todas</option>
          </select>
        </div>
      </section>
      <section className="section container">
        <div className="results-header">
          <h2>
            {dateFilter === "Próximas" ? "Próximas actividades" : dateFilter}
          </h2>
          <span>{results.length} resultados</span>
        </div>
        <div className="cards-grid" aria-live="polite">
          {results.length ? (
            results.map((activity) => (
              <ActivityCard
                activity={activity}
                key={activity.id}
                navigate={navigate}
              />
            ))
          ) : (
            <div className="empty-state">
              <Icon name="calendar" size={34} />
              <h3>No hay actividades con estos filtros</h3>
              <p>Prueba otra categoría o revisa todas las fechas.</p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setQuery("")
                  setCategory("Todas")
                  setDateFilter("Próximas")
                }}
                type="button"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
