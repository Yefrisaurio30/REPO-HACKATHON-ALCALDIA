/**
 * Utilidades de calendario personal para VibraLink.
 *
 * - Genera el contenido de un archivo ICS válido en cliente (`text/calendar`).
 * - Construye enlaces a Google Calendar con los parámetros correctos.
 *
 * No se envía información personal ni a ningún servidor: los archivos ICS se
 * crean con `Blob` en el navegador y los enlaces apuntan a Google Calendar con
 * los únicos datos del evento disponibles en la actividad.
 */
import type { Activity } from '../types'

const ICS_PRODID = '-//VibraLink//Agenda comunitaria//ES'

/** Desplazamiento de la hora local (Colombia, UTC-5) a la hora UTC. */
const LOCAL_TO_UTC_HOURS = 5

type CalendarEventTimes = {
  /** Fecha y hora de inicio en formato ICS `YYYYMMDDTHHMMSSZ`. */
  start: string
  /** Fecha y hora de fin en formato ICS `YYYYMMDDTHHMMSSZ`; `null` si no está disponible. */
  end: string | null
}

/** Formatea un `Date` UTC como `YYYYMMDDTHHMMSSZ` (DATE-TIME de iCalendar en UTC). */
function toUtcStamp(date: Date): string {
  const year = String(date.getUTCFullYear()).padStart(4, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}Z`
}

/** Convierte la fecha (`YYYY-MM-DD`) y hora (`HH:mm`) local de la actividad a UTC. */
function toLocalUtcStamp(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const utcDate = new Date(
    Date.UTC(year, (month ?? 1) - 1, day ?? 1, (hours ?? 0) + LOCAL_TO_UTC_HOURS, minutes ?? 0),
  )
  return toUtcStamp(utcDate)
}

/** `true` si la actividad tiene fecha y hora válidas para armar un evento. */
export function canCreateCalendarEvent(activity: Activity): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(activity.date)) return false
  if (!/^\d{2}:\d{2}$/.test(activity.time)) return false
  const start = new Date(`${activity.date}T${activity.time}:00`)
  return !Number.isNaN(start.getTime())
}

/** Devuelve las fechas del evento o `null` si falta información esencial. */
export function buildCalendarEvent(activity: Activity): CalendarEventTimes | null {
  if (!canCreateCalendarEvent(activity)) return null
  return {
    start: toLocalUtcStamp(activity.date, activity.time),
    end: null,
  }
}

/** Escapa un texto para el formato iCalendar (texto plano). */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/"/g, '\\"')
}

/** Genera el contenido del archivo ICS para una actividad. `null` si faltan datos esenciales. */
export function buildIcsContent(activity: Activity): string | null {
  const event = buildCalendarEvent(activity)
  if (!event) return null

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${ICS_PRODID}`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${activity.id}@villavicencio.vibralink`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${event.start}`,
    ...(event.end ? [`DTEND:${event.end}`] : []),
    `SUMMARY:${escapeIcsText(activity.title)}`,
    `DESCRIPTION:${escapeIcsText(activity.description)}`,
    ...(activity.location ? [`LOCATION:${escapeIcsText(activity.location)}`] : []),
    ...(activity.sourceUrl ? [`URL:${activity.sourceUrl}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return `${lines.join('\r\n')}\r\n`
}

/** Descarga un archivo ICS en el navegador usando un enlace local. */
export function downloadCalendarEvent(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Construye el enlace de Google Calendar para una actividad. `null` si faltan datos esenciales. */
export function buildGoogleCalendarUrl(activity: Activity): string | null {
  const event = buildCalendarEvent(activity)
  if (!event) return null

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: activity.title,
    dates: `${event.start}/${event.end ?? event.start}`,
    details: activity.description,
    ctz: 'America/Bogota',
  })
  if (activity.location) {
    params.set('location', activity.location)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
