import { useMemo, useState } from 'react'
import ActivityCard from '../components/ActivityCard'
import Callout from '../components/Callout'
import EmptyState from '../components/EmptyState'
import FilterBar, { type FilterDefinition } from '../components/FilterBar'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import {
  activityCategories,
  activityMonths,
  activities,
  filterActivities,
  formatMonth,
} from '../data'
import { ACTIVITY_CATEGORY_LABELS, ACTIVITY_STATUS_LABELS } from '../data/labels'
import { useNow } from '../hooks/useNow'
import { useRouter } from '../router/hooks'
import type { ActivityCategory } from '../types'
import type { ActivityStatusFilter } from '../data'

const ALL = 'todas'
const ALL_MONTHS = 'todos'

/** Agenda de actividades comunitarias. */
export default function Activities() {
  const { query: routeQuery } = useRouter()
  const routeSearch = routeQuery.get('q') ?? ''
  const [search, setSearch] = useState(routeSearch)
  const [category, setCategory] = useState<ActivityCategory | typeof ALL>(ALL)
  const [month, setMonth] = useState<string>(ALL_MONTHS)
  const [status, setStatus] = useState<ActivityStatusFilter>('proximas')
  const [lastRouteSearch, setLastRouteSearch] = useState(routeSearch)
  const now = useNow()

  // Si la búsqueda llega desde la página de inicio (`?q=...`), se aplica.
  // Se ajusta durante el render para no disparar un efecto en cascada.
  if (routeSearch !== lastRouteSearch) {
    setLastRouteSearch(routeSearch)
    setSearch(routeSearch)
  }

  const results = useMemo(
    () => filterActivities({ query: search, category, month, status, now }),
    [search, category, month, status, now],
  )

  const hasFilters =
    search.trim() !== '' || category !== ALL || month !== ALL_MONTHS || status !== 'proximas'

  const resetFilters = () => {
    setSearch('')
    setCategory(ALL)
    setMonth(ALL_MONTHS)
    setStatus('proximas')
  }

  const filters: FilterDefinition[] = [
    {
      id: 'filtro-actividad-categoria',
      label: 'Categoría',
      value: category,
      onChange: (value) => setCategory(value as ActivityCategory | typeof ALL),
      options: [
        { value: ALL, label: 'Todas las categorías' },
        ...activityCategories.map((value) => ({
          value,
          label: ACTIVITY_CATEGORY_LABELS[value],
        })),
      ],
    },
    {
      id: 'filtro-actividad-mes',
      label: 'Fecha',
      value: month,
      onChange: setMonth,
      options: [
        { value: ALL_MONTHS, label: 'Todos los meses' },
        ...activityMonths.map((value) => ({ value, label: formatMonth(value) })),
      ],
    },
    {
      id: 'filtro-actividad-estado',
      label: 'Estado',
      value: status,
      onChange: (value) => setStatus(value as ActivityStatusFilter),
      options: [
        { value: 'proximas', label: ACTIVITY_STATUS_LABELS.proximas },
        { value: 'finalizadas', label: ACTIVITY_STATUS_LABELS.finalizadas },
        { value: 'todas', label: ACTIVITY_STATUS_LABELS.todas },
      ],
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Agenda comunitaria"
        title="Explora actividades"
        description="Talleres, cultura, deporte, jornadas educativas y actividades comunitarias de bienestar. Filtra por categoría, fecha y estado; las actividades ya realizadas aparecen siempre como finalizadas."
      />

      <Callout tone="demo" title="DATOS FICTICIOS DE DEMOSTRACIÓN">
        Las actividades de esta agenda son ficticias y sirven para probar los
        filtros. No son eventos reales, los lugares son simulados y los enlaces de
        inscripción son marcadores de posición que no resuelven.
      </Callout>

      <section className="section" aria-labelledby="titulo-actividades">
        <h2 className="sr-only" id="titulo-actividades">
          Resultados de la agenda de actividades
        </h2>

        <div className="filters-panel">
          <SearchBar
            id="busqueda-actividades"
            label="Buscar actividades"
            value={search}
            onChange={setSearch}
            placeholder="Ej.: pintura, torneo, lectura…"
            hint="La búsqueda revisa el nombre, la descripción y el organizador. No hace falta escribir la palabra exacta."
          />
          <FilterBar
            filters={filters}
            hasActiveFilters={hasFilters}
            onReset={resetFilters}
            resetLabel="Quitar filtros"
          />
        </div>

        <p className="results-count" role="status" aria-live="polite">
          {results.length === 1
            ? '1 actividad en la agenda'
            : `${results.length} actividades en la agenda`}
          {hasFilters ? ' con los filtros aplicados' : ''}
        </p>

        {results.length === 0 ? (
          <EmptyState
            title="No hay actividades para estos filtros"
            description="Prueba con otro mes, cambia la categoría o muestra todas las actividades, incluidas las que ya se realizaron."
            action={
              <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                Quitar filtros
              </button>
            }
          />
        ) : (
          <div className="card-grid">
            {results.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} now={now} />
            ))}
          </div>
        )}

        <p className="agenda-summary">
          El prototipo carga {activities.length} actividades de ejemplo entre
          agosto de 2026 y diciembre de 2027. Las fechas ya pasadas se marcan
          automáticamente como finalizadas.
        </p>
      </section>
    </>
  )
}
