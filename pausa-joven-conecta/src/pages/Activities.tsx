import { useMemo, useState } from 'react'
import ActivityCalendar from '../components/ActivityCalendar'
import ActivityCard from '../components/ActivityCard'
import Callout from '../components/Callout'
import EmptyState from '../components/EmptyState'
import FilterBar, { type FilterDefinition } from '../components/FilterBar'
import Icon from '../components/Icon'
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

type ViewMode = 'calendar' | 'tarjetas'

/** Devuelve la clave `YYYY-MM` del mes de la fecha indicada. */
function currentMonthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

/** Agenda de actividades comunitarias. */
export default function Activities() {
  const { query: routeQuery } = useRouter()
  const routeSearch = routeQuery.get('q') ?? ''
  const [search, setSearch] = useState(routeSearch)
  const [category, setCategory] = useState<ActivityCategory | typeof ALL>(ALL)
  const [month, setMonth] = useState<string>(ALL_MONTHS)
  const [status, setStatus] = useState<ActivityStatusFilter>('proximas')
  const [lastRouteSearch, setLastRouteSearch] = useState(routeSearch)
  const [view, setView] = useState<ViewMode>('calendar')
  const [calendarMonth, setCalendarMonth] = useState<string>(() => currentMonthKey(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
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

  /** Actividades del mes visible en el calendario que cumplen los filtros. */
  const displayedMonthActivities = useMemo(
    () =>
      filterActivities({
        query: search,
        category,
        month: calendarMonth,
        status,
        now,
      }),
    [search, category, calendarMonth, status, now],
  )

  /** Actividades del día seleccionado en el calendario. */
  const selectedDayActivities = useMemo(() => {
    if (!selectedDate) return []
    return results.filter((activity) => activity.date === selectedDate)
  }, [results, selectedDate])

  const isCalendarView = view === 'calendar'
  const showActivitiesForDate = isCalendarView && selectedDate !== null
  const activitiesForView = showActivitiesForDate
    ? selectedDayActivities
    : isCalendarView
      ? displayedMonthActivities
      : results

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
      onChange: (value) => {
        setMonth(value)
        if (value !== ALL_MONTHS) {
          setCalendarMonth(value)
        }
      },
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

  const handleCalendarMonthChange = (nextMonth: string) => {
    setCalendarMonth(nextMonth)
    setMonth(nextMonth)
  }

  const handleSelectDate = (date: string) => {
    const nextDate = selectedDate === date ? null : date
    setSelectedDate(nextDate)
    if (nextDate) {
      const nextMonth = nextDate.slice(0, 7)
      setMonth(nextMonth)
      setCalendarMonth(nextMonth)
    }
  }

  const emptyStateTitle = showActivitiesForDate
    ? 'No hay actividades programadas para este día'
    : isCalendarView
      ? 'No hay actividades programadas para este mes'
      : 'No hay actividades para estos filtros'

  const emptyStateDescription = showActivitiesForDate
    ? 'Prueba con otra fecha del calendario o ajusta los filtros para ver otras actividades.'
    : isCalendarView
      ? 'Usa los botones de navegación para explorar otros meses o ajusta los filtros aplicados.'
      : 'Prueba con otro mes, cambia la categoría o muestra todas las actividades, incluidas las que ya se realizaron.'

  const emptyStateAction = (
    <button type="button" className="btn btn-secondary" onClick={resetFilters}>
      Quitar filtros
    </button>
  )

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

        <div className="view-switch" role="group" aria-label="Cambiar la vista de la agenda">
          <button
            type="button"
            className={`view-switch-option${view === 'calendar' ? ' is-active' : ''}`}
            aria-pressed={view === 'calendar'}
            onClick={() => setView('calendar')}
          >
            <Icon name="calendar" size={16} />
            Calendario
          </button>
          <button
            type="button"
            className={`view-switch-option${view === 'tarjetas' ? ' is-active' : ''}`}
            aria-pressed={view === 'tarjetas'}
            onClick={() => setView('tarjetas')}
          >
            <Icon name="list" size={16} />
            Tarjetas
          </button>
        </div>

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

        {view === 'calendar' ? (
          <ActivityCalendar
            month={calendarMonth}
            activities={displayedMonthActivities}
            selectedDate={selectedDate}
            onMonthChange={handleCalendarMonthChange}
            onSelectDate={handleSelectDate}
          />
        ) : null}

        <p className="results-count" role="status" aria-live="polite">
          {activitiesForView.length === 1
            ? '1 actividad en la agenda'
            : `${activitiesForView.length} actividades en la agenda`}
          {hasFilters ? ' con los filtros aplicados' : ''}
        </p>

        {activitiesForView.length === 0 ? (
          <EmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            action={emptyStateAction}
          />
        ) : (
          <div className="card-grid">
            {activitiesForView.map((activity) => (
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
