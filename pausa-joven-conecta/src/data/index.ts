/**
 * Capa de datos de VibraLink.
 *
 * Los registros provienen exclusivamente de los archivos JSON del proyecto:
 *   - src/data/services.json
 *   - src/data/activities.json
 *
 * Aquí solo se cargan, se tipan y se derivan los filtros y utilidades que
 * consumen los componentes. Ningún componente escribe datos a mano.
 *
 * La lógica de filtrado vive en `src/data/filters.ts` (sin dependencias de
 * los JSON) para poder probarla de forma aislada.
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
import {
  filterActivities as applyActivityFilters,
  filterServices as applyServiceFilters,
} from './filters'

export const services: Service[] = servicesJson as Service[]
export const activities: Activity[] = activitiesJson as Activity[]

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

/** Categorías de servicio presentes en `services.json`. */
export const serviceCategories: ServiceCategory[] = unique(
  services.map((service) => service.category),
)

/** Categorías de actividad presentes en `activities.json`. */
export const activityCategories: ActivityCategory[] = unique(
  activities.map((activity) => activity.category),
)

/** Modalidades presentes en ambos archivos. */
export const modalities: Modality[] = unique([
  ...services.map((service) => service.modality),
  ...activities.map((activity) => activity.modality),
])

/** Meses (YYYY-MM) con actividades registradas, ordenados cronológicamente. */
export const activityMonths: string[] = unique(
  activities.map((activity) => activity.date.slice(0, 7)),
).sort()

/** Busca un servicio por su identificador. */
export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id)
}

/** Busca una actividad por su identificador. */
export function getActivityById(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id)
}

/** Servicios de la misma categoría (para recomendaciones en el detalle). */
export function getRelatedServices(service: Service, limit = 3): Service[] {
  return services
    .filter((candidate) => candidate.id !== service.id && candidate.category === service.category)
    .slice(0, limit)
}

/** Aplica los filtros del directorio de servicios. */
export function filterServices(filters: Parameters<typeof applyServiceFilters>[1] = {}) {
  return applyServiceFilters(services, filters)
}

/** Aplica los filtros de la agenda comunitaria. */
export function filterActivities(filters: Parameters<typeof applyActivityFilters>[1] = {}) {
  return applyActivityFilters(activities, filters)
}

export {
  activityStart,
  formatLongDate,
  formatMediumDate,
  formatMonth,
  formatTime,
  isPastActivity,
  normalizeText,
} from './filters'
export type { ActivityFilters, ActivityStatusFilter, ServiceFilters } from './filters'
