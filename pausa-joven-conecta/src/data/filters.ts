/**
 * Lógica pura de filtrado y formato de VibraLink.
 *
 * Este módulo no importa los JSON: recibe los registros como argumento, de
 * modo que las reglas se puedan probar de forma aislada (ver
 * `scripts/test-logic.mjs`).
 */
import type {
  Activity,
  ActivityCategory,
  Modality,
  Service,
  ServiceCategory,
} from '../types'

/** Quita tildes y pasa a minúsculas para comparar textos de búsqueda. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Separa un texto normalizado en palabras comparables. */
function toWords(...parts: string[]): string[] {
  return normalizeText(parts.join(' '))
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

/**
 * Una palabra de la búsqueda coincide con el texto si:
 *  - aparece completa dentro de alguna palabra («salud» en «saludable»), o
 *  - es el comienzo de alguna palabra cuando tiene 5 letras o más
 *    («deporte» encuentra «deportiva»).
 */
function wordMatches(word: string, token: string): boolean {
  if (word.includes(token)) return true
  if (token.length >= 5) {
    const stem = token.slice(0, token.length - 1)
    if (word.startsWith(stem)) return true
  }
  return false
}

/** `true` si todas las palabras de la búsqueda aparecen en el texto. */
export function matchesQuery(words: string[], query: string): boolean {
  const tokens = normalizeText(query.trim()).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  return tokens.every((token) => words.some((word) => wordMatches(word, token)))
}

export interface ServiceFilters {
  /** Texto libre: busca por nombre y descripción. */
  query?: string
  category?: ServiceCategory | 'todas'
  modality?: Modality | 'todas'
}

/** Aplica los filtros del directorio de servicios. */
export function filterServices(
  services: Service[],
  { query = '', category = 'todas', modality = 'todas' }: ServiceFilters = {},
): Service[] {
  const needle = normalizeText(query.trim())

  return services.filter((service) => {
    if (category !== 'todas' && service.category !== category) return false
    if (modality !== 'todas' && service.modality !== modality) return false
    if (!needle) return true

    const words = toWords(service.name, service.description, service.targetAudience)
    return matchesQuery(words, needle)
  })
}

export type ActivityStatusFilter = 'todas' | 'proximas' | 'finalizadas'

export interface ActivityFilters {
  /** Texto libre: busca por nombre, descripción y organizador. */
  query?: string
  category?: ActivityCategory | 'todas'
  /** Mes en formato YYYY-MM. */
  month?: string | 'todos'
  status?: ActivityStatusFilter
  now?: Date
}

/** Aplica los filtros de la agenda comunitaria. */
export function filterActivities(
  activities: Activity[],
  {
    query = '',
    category = 'todas',
    month = 'todos',
    status = 'todas',
    now = new Date(),
  }: ActivityFilters = {},
): Activity[] {
  const needle = normalizeText(query.trim())

  return activities
    .filter((activity) => {
      if (category !== 'todas' && activity.category !== category) return false
      if (month !== 'todos' && !activity.date.startsWith(month)) return false
      if (status === 'proximas' && isPastActivity(activity, now)) return false
      if (status === 'finalizadas' && !isPastActivity(activity, now)) return false
      if (!needle) return true

      const words = toWords(activity.title, activity.description, activity.organizer)
      return matchesQuery(words, needle)
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

/** `true` si la fecha de la actividad (`YYYY-MM-DD`) es una fecha real válida. */
export function isValidActivityDate(activity: Activity): boolean {
  if (typeof activity.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(activity.date)) {
    return false
  }
  const [year, month, day] = activity.date.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
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

/** Formatea una fecha YYYY-MM-DD de forma compacta (22 de agosto de 2026). */
export function formatMediumDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)
  const label = parsed.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Formatea un mes YYYY-MM como texto en español. */
export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, monthNumber - 1, 1))
  const label = parsed.toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/**
 * Convierte una hora HH:mm (24 h) al formato de 12 horas en español.
 * Ej.: `15:00` → `3:00 p. m.`
 */
export function formatTime(time: string): string {
  const [rawHours, rawMinutes] = time.split(':')
  const hours = Number(rawHours)
  const minutes = Number(rawMinutes)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time

  const suffix = hours < 12 ? 'a. m.' : 'p. m.'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const minutesText = String(minutes).padStart(2, '0')

  return `${hour12}:${minutesText} ${suffix}`
}
