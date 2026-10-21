/**
 * Tipos compartidos de VibraLink.
 *
 * Los datos de demostración se cargan desde `src/data/services.json` y
 * `src/data/activities.json`; estas interfaces describen la forma esperada
 * de cada registro.
 *
 * Reglas del proyecto (ver `scripts/validate-data.mjs`):
 *  - Todo registro del prototipo es ficticio: `isDemo` es `true`.
 *  - `verificationStatus` describe el estado de verificación de la fuente:
 *      - `demo`      → registro ficticio, sin fuente real consultada.
 *      - `pendiente` → se tiene un dato (por ejemplo un contacto) que aún no
 *                      se ha podido confirmar contra una fuente oficial.
 *      - `verificado`→ la fuente oficial se consultó y el dato está vigente.
 *                      reservado para cuando existan fuentes reales.
 *  - `sourceUrl` y `registrationUrl` de registros de demostración solo pueden
 *    apuntar al dominio reservado `demo.example`, que nunca resuelve.
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

export type VerificationStatus = 'demo' | 'pendiente' | 'verificado'

/** Servicio de orientación o bienestar incluido en el directorio. */
export interface Service {
  id: string
  name: string
  category: ServiceCategory
  description: string
  modality: Modality
  /** Público destinatario del servicio. */
  targetAudience: string
  /** Lugar de atención. `null` cuando no se conoce o no aplica. */
  location: string | null
  /** Contacto publicado por la fuente. `null` cuando no hay dato confirmado. */
  contact: string | null
  /** URL de la fuente oficial. `null` cuando todavía no hay fuente. */
  sourceUrl: string | null
  /** Fecha (YYYY-MM-DD) en que se consultó la fuente. */
  lastVerified: string | null
  verificationStatus: VerificationStatus
  isDemo: boolean
  /** Nota aclaratoria opcional (alcance, condiciones, etc.). */
  notes: string | null
}

/** Actividad de la agenda comunitaria. */
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
  /** Lugar de encuentro. `null` cuando no se conoce o no aplica. */
  location: string | null
  modality: Modality
  /** Requisitos de participación. `null` cuando no están informados. */
  requirements: string | null
  /** URL de la fuente de información. */
  sourceUrl: string | null
  /** Enlace de participación o inscripción. */
  registrationUrl: string | null
  /** Fecha (YYYY-MM-DD) en que se consultó la fuente. */
  lastVerified: string | null
  verificationStatus: VerificationStatus
  isDemo: boolean
  /** Nota aclaratoria opcional. */
  notes: string | null
}
