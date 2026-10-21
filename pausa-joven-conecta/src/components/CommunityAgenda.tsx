import { useEffect, useMemo, useState } from 'react'
import {
  activityCategories,
  activityMonths,
  filterActivities,
  formatMonth,
  type ActivityStatusFilter,
} from '../data'
import { ACTIVITY_CATEGORY_LABELS } from '../data/labels'
import type { ActivityCategory } from '../types'
import ActivityCard from './ActivityCard'

const ALL = 'todas'
const ALL_MONTHS = 'todos'

/** Cada cuánto se refresca la referencia de "ahora" usada para marcar actividades. */
const REFRESH_MS = 60_000

/**
 * Agenda comunitaria: filtra por categoría, mes y estado (programadas o
 * finalizadas). Las opciones se derivan de `activities.json`.
 */
export default function CommunityAgenda() {
  const [category, setCategory] = useState<ActivityCategory | typeof ALL>(ALL)
  const [month, setMonth] = useState<string>(ALL_MONTHS)
  const [status, setStatus] = useState<ActivityStatusFilter>(ALL)
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  const results = useMemo(
    () => filterActivities({ category, month, status, now }),
    [category, month, status, now],
  )

  const hasFilters = category !== ALL || month !== ALL_MONTHS || status !== ALL

  return (
    <section className="section" id="agenda">
      <div className="section-head">
        <h2>Agenda comunitaria</h2>
        <p>
          Filtra por categoría, mes o estado para ver actividades programadas y
          finalizadas. Los registros provienen de <code>src/data/activities.json</code>.
        </p>
      </div>

      <div className="filters">
        <div className="field">
          <label htmlFor="activity-category">Categoría</label>
          <select
            id="activity-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ActivityCategory | typeof ALL)}
          >
            <option value={ALL}>Todas</option>
            {activityCategories.map((value) => (
              <option key={value} value={value}>
                {ACTIVITY_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="activity-month">Mes</label>
          <select
            id="activity-month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          >
            <option value={ALL_MONTHS}>Todos los meses</option>
            {activityMonths.map((value) => (
              <option key={value} value={value}>
                {formatMonth(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="activity-status">Estado</label>
          <select
            id="activity-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ActivityStatusFilter)}
          >
            <option value="todas">Todas</option>
            <option value="programadas">Programadas</option>
            <option value="finalizadas">Finalizadas</option>
          </select>
        </div>
      </div>

      <p className="results-count" role="status">
        {results.length} {results.length === 1 ? 'actividad' : 'actividades'} en la agenda
        {hasFilters ? ' con los filtros aplicados' : ''}
      </p>

      {results.length === 0 ? (
        <p className="empty-state">
          No hay actividades para los filtros seleccionados. Prueba con otro mes o
          muestra todas las actividades.
        </p>
      ) : (
        <div className="card-grid">
          {results.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} now={now} />
          ))}
        </div>
      )}
    </section>
  )
}
