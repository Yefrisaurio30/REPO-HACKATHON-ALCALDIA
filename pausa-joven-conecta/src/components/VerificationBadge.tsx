import { VERIFICATION_EXPLANATIONS, VERIFICATION_LABELS, VERIFICATION_SHORT_LABELS } from '../data/labels'
import type { VerificationStatus } from '../types'
import Icon from './Icon'

type VerificationBadgeProps = {
  status: VerificationStatus
  /** Versión corta para tarjetas; la larga se usa en detalles. */
  compact?: boolean
}

/**
 * Etiqueta de estado de verificación.
 *
 * Muestra siempre una explicación ampliable (`title`) porque el color por sí
 * solo no basta para comunicar si un dato está confirmado o no.
 */
export default function VerificationBadge({ status, compact = false }: VerificationBadgeProps) {
  const icon = status === 'verificado' ? 'check' : status === 'pendiente' ? 'info' : 'flag'

  return (
    <span
      className={`verification-badge verification-${status}${compact ? ' is-compact' : ''}`}
      title={VERIFICATION_EXPLANATIONS[status]}
    >
      <Icon name={icon} size={14} />
      {compact ? VERIFICATION_SHORT_LABELS[status] : VERIFICATION_LABELS[status]}
    </span>
  )
}
