/**
 * Tipos compartidos de VibraLink.
 *
 * Los datos de demostración se cargan desde `src/data/services.json` y
 * `src/data/activities.json`; estas interfaces describen la forma esperada
 * de cada registro.
 *
 * Reglas del proyecto (ver `scripts/validate-data.mjs`):
 *  - Los registros ficticios declaran `isDemo: true`; los reales, `isDemo: false`.
 *  - `verificationStatus` describe el estado de verificación de la fuente:
 *      - `demo`      → registro ficticio, sin fuente real consultada.
 *      - `pendiente` → se tiene un dato (por ejemplo un contacto) que aún no
 *                      se ha podido confirmar contra una fuente oficial.
 *      - `verificado`→ la fuente oficial se consultó y el dato está vigente;
 *                      exige `lastVerified` con fecha de consulta.
 *  - Un registro real sin fecha de consulta debe quedar en `pendiente` con
 *    notas: nunca se publica un teléfono como vigente sin fuente y fecha.
 *  - Los `sourceUrl` y `registrationUrl` de registros ficticios solo pueden
 *    apuntar al dominio reservado `demo.example`, que nunca resuelve; los de
 *    registros reales deben ser una fuente oficial `https://`.
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

/** Información de contacto estructurada (teléfono y WhatsApp). */
export interface ServiceContact {
  phone: string | null
  whatsapp: string | null
}

/** Horario de atención del servicio. */
export interface ServiceSchedule {
  description: string
  /** `true` cuando la fuente oficial confirmó el horario. */
  verified: boolean
}

/** Ubicación física del servicio. */
export interface ServiceLocation {
  name: string
  address: string
  purpose: string
  verified: boolean
}

/** Paso de la ruta de atención integral. */
export interface SupportRouteStep {
  step: number
  title: string
  description: string
}

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
  /** Ciudad del servicio (opcional). */
  city?: string
  /** Departamento del servicio (opcional). */
  department?: string
  /** Contacto estructurado: teléfono y WhatsApp (opcional). */
  contactStructured?: ServiceContact
  /** Horario de atención (opcional). */
  schedule?: ServiceSchedule
  /** Ubicaciones físicas del servicio (opcional). */
  locations?: ServiceLocation[]
  /** Información sobre atención presencial o visita a domicilio (opcional). */
  homeVisitInformation?: string
  /** Ruta de atención integral (opcional). */
  supportRoute?: SupportRouteStep[]
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
