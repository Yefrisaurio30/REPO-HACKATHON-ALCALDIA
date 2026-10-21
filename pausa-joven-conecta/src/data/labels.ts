import type { ActivityCategory, Modality, ServiceCategory, VerificationStatus } from '../types'
import type { ActivityStatusFilter } from './filters'

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  orientacion: 'Orientación',
  'bienestar-comunitario': 'Bienestar comunitario',
  educacion: 'Educación',
  'apoyo-social': 'Apoyo social',
  'actividades-juveniles': 'Actividades juveniles',
  cultura: 'Cultura',
}

/** Descripción corta de cada categoría de servicio (tarjetas y filtros). */
export const SERVICE_CATEGORY_HINTS: Record<ServiceCategory, string> = {
  orientacion: 'Acompañamiento para decidir sobre estudio, trabajo y proyecto de vida.',
  'bienestar-comunitario': 'Espacios de escucha, movimiento y hábitos de autocuidado.',
  educacion: 'Formación, refuerzo escolar y habilidades digitales.',
  'apoyo-social': 'Apoyos económicos, convocatorias y recursos de primera necesidad.',
  'actividades-juveniles': 'Espacios de convivencia, deporte y participación juvenil.',
  cultura: 'Lectura, teatro y expresiones artísticas para la comunidad.',
}

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  cultura: 'Cultura',
  deporte: 'Deporte',
  educacion: 'Educación',
  'arte-y-creatividad': 'Arte y creatividad',
  'bienestar-comunitario': 'Bienestar comunitario',
  'participacion-juvenil': 'Participación juvenil',
}

export const MODALITY_LABELS: Record<Modality, string> = {
  presencial: 'Presencial',
  virtual: 'Virtual',
  telefonica: 'Telefónica',
}

export const MODALITY_HINTS: Record<Modality, string> = {
  presencial: 'Te encuentras en persona en un punto de la ciudad.',
  virtual: 'Participas desde tu dispositivo, con enlace o sala en línea.',
  telefonica: 'Te atienden por llamada telefónica.',
}

/**
 * Texto de la etiqueta de verificación.
 * - `demo`      → se marca como dato ficticio de demostración.
 * - `pendiente` → el dato existe pero no se ha confirmado en una fuente.
 * - `verificado`→ la fuente oficial se consultó y el dato está vigente.
 */
export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  demo: 'Dato ficticio de demostración',
  pendiente: 'Pendiente de verificación',
  verificado: 'Verificado',
}

/** Texto corto de la etiqueta de verificación (tarjetas). */
export const VERIFICATION_SHORT_LABELS: Record<VerificationStatus, string> = {
  demo: 'Datos ficticios',
  pendiente: 'Sin verificar',
  verificado: 'Verificado',
}

export const VERIFICATION_EXPLANATIONS: Record<VerificationStatus, string> = {
  demo:
    'Registro ficticio creado para probar el prototipo. No corresponde a una institución real y no debe usarse para tomar decisiones.',
  pendiente:
    'El dato aparece en la fuente pero todavía no se ha confirmado que siga vigente. Tómalo como referencia y confirma antes de ir.',
  verificado:
    'La fuente oficial se consultó en la fecha indicada y el dato estaba vigente en ese momento.',
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatusFilter, string> = {
  todas: 'Todas',
  proximas: 'Próximas',
  finalizadas: 'Finalizadas',
}

/** Etiquetas de la agenda para actividades ya realizadas o por realizar. */
export const ACTIVITY_STATE_LABELS = {
  proxima: 'Programada',
  finalizada: 'Finalizada',
} as const
