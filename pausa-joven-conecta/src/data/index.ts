/**
 * Capa de datos de VibraLink.
 *
 * Los registros provienen exclusivamente de los archivos JSON del proyecto:
 *   - src/data/services.json
 *   - src/data/activities.json
 *
 * Aquí solo se cargan, se tipan y se derivan los filtros y utilidades que
 * consumen los componentes. Ningún componente escribe datos a mano.
 */
import activitiesJson from './activities.json'
import servicesJson from './services.json'
import type {
  Activity,
  ActivityCategory,
  Modality,
  Service,
  ServiceCategory,
} from '../types'

export const services: Service[] = servicesJson as Service[]
export const activities: Activity[] = activitiesJson as Activity[]

/** Quita tildes y pasa a minúsculas para comparar textos de búsqueda. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

/** Categorías de servicio presentes en `services.json`. */
export const serviceCategories: ServiceCategory[] = unique(services.map((s) => s.category))

/** Categorías de actividad presentes en `activities.json`. */
export const activityCategories: ActivityCategory[] = unique(
  activities.map((a) => a.category),
)

/** Modalidades presentes en ambos archivos. */
export const modalities: Modality[] = unique([
  ...services.map((s) => s.modality),
  ...activities.map((a) => a.modality),
])

/** Meses (YYYY-MM) con actividades registradas, ordenados cronológicamente. */
export const activityMonths: string[] = unique(
  activities.map((a) => a.date.slice(0, 7)),
).sort()

export interface ServiceFilters {
  /** Texto libre: busca por nombre y descripción. */
  query?: string
  category?: ServiceCategory | 'todas'
  modality?: Modality | 'todas'
}

/** Aplica los filtros del directorio de servicios. */
export function filterServices({
  query = '',
  category = 'todas',
  modality = 'todas',
}: ServiceFilters = {}): Service[] {
  const needle = normalizeText(query.trim())

  return services.filter((service) => {
    if (category !== 'todas' && service.category !== category) return false
    if (modality !== 'todas' && service.modality !== modality) return false
    if (!needle) return true

    const haystack = normalizeText(`${service.name} ${service.description}`)
    return haystack.includes(needle)
  })
}

export type ActivityStatusFilter = 'todas' | 'programadas' | 'finalizadas'

export interface ActivityFilters {
  category?: ActivityCategory | 'todas'
  /** Mes en formato YYYY-MM. */
  month?: string | 'todos'
  status?: ActivityStatusFilter
  now?: Date
}

/** Aplica los filtros de la agenda comunitaria. */
export function filterActivities({
  category = 'todas',
  month = 'todos',
  status = 'todas',
  now = new Date(),
}: ActivityFilters = {}): Activity[] {
  return activities
    .filter((activity) => {
      if (category !== 'todas' && activity.category !== category) return false
      if (month !== 'todos' && !activity.date.startsWith(month)) return false
      if (status === 'programadas' && isPastActivity(activity, now)) return false
      if (status === 'finalizadas' && !isPastActivity(activity, now)) return false
      return true
    })
    .sort((a, b) => {
      const diff = activityStart(a).getTime() - activityStart(b).getTime()
      return diff !== 0 ? diff : a.id.localeCompare(b.id)
    })
}

/** Fecha y hora de inicio de una actividad. */
export function activityStart(activity: Activity): Date {
  return new Date(`${activity.date}T${activity.time}:00`)
}

/** `true` si la actividad ya empezó o terminó. */
export function isPastActivity(activity: Activity, now: Date = new Date()): boolean {
  return activityStart(activity).getTime() < now.getTime()
}

/** Formatea una fecha YYYY-MM-DD como texto en español. */
export function formatLongDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)
  return parsed.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Formatea un mes YYYY-MM como texto en español. */
export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, monthNumber - 1, 1))
  const label = parsed.toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}
