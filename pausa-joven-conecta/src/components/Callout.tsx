import type { ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

export type CalloutTone = 'info' | 'warning' | 'demo' | 'success'

type CalloutProps = {
  tone: CalloutTone
  title: string
  children?: ReactNode
  icon?: IconName
}

const TONE_ICON: Record<CalloutTone, IconName> = {
  info: 'info',
  warning: 'shield',
  demo: 'flag',
  success: 'check',
}

/**
 * Aviso destacado. Se usa para la advertencia de datos no verificados, el
 * aviso de datos ficticios y la aclaración de que la plataforma no es un
 * servicio médico.
 */
export default function Callout({ tone, title, children, icon }: CalloutProps) {
  return (
    <div className={`callout callout-${tone}`} role="note">
      <span className="callout-icon" aria-hidden="true">
        <Icon name={icon ?? TONE_ICON[tone]} size={18} />
      </span>
      <div className="callout-body">
        <p className="callout-title">{title}</p>
        {children ? <div className="callout-text">{children}</div> : null}
      </div>
    </div>
  )
}
