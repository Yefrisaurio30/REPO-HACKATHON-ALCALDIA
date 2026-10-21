/**
 * Tipos compartidos de VibraLink.
 *
 * Los datos de demostración se cargan desde `src/data/services.json` y
 * `src/data/activities.json`; estas interfaces describen la forma esperada
 * de cada registro.
 */

export type ServiceCategory =
  | 'orientacion'
  | 'bienestar-comunitario'
  | 'educacion'
  | 'apoyo-social'
  | 'actividades-juveniles'
  | 'cultura'

export type ActivityCategory =
  | 'cultura'
  | 'deporte'
  | 'educacion'
  | 'arte-y-creatividad'
  | 'bienestar-comunitario'
  | 'participacion-juvenil'

export type Modality = 'presencial' | 'virtual' | 'telefonica'

/**
 * `demo` = registro ficticio de demostración.
 * Los demás valores quedan reservados para cuando existan fuentes verificadas.
 */
export type VerificationStatus = 'demo' | 'pendiente' | 'verificado'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  description: string
  modality: Modality
  targetAudience: string
  location: string | null
  contact: string | null
  sourceUrl: string | null
  lastVerified: string | null
  verificationStatus: VerificationStatus
  isDemo: boolean
}

export interface Activity {
  id: string
  title: string
  category: ActivityCategory
  description: string
  organizer: string
  /** Fecha en formato YYYY-MM-DD. */
  date: string
  /** Hora en formato HH:mm (24 horas). */
  time: string
  location: string | null
  modality: Modality
  sourceUrl: string | null
  registrationUrl: string | null
  verificationStatus: VerificationStatus
  isDemo: boolean
}
