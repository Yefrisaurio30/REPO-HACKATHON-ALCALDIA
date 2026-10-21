import type { ActivityCategory, Modality, ServiceCategory, VerificationStatus } from '../types'

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  orientacion: 'Orientación',
  'bienestar-comunitario': 'Bienestar comunitario',
  educacion: 'Educación',
  'apoyo-social': 'Apoyo social',
  'actividades-juveniles': 'Actividades juveniles',
  cultura: 'Cultura',
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

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  demo: 'Dato ficticio · sin verificar',
  pendiente: 'Pendiente de verificación',
  verificado: 'Verificado',
}
