import type { ReactNode } from 'react'
import Icon from './Icon'

type EmptyStateProps = {
  title: string
  description: string
  /** Acción opcional (botón o enlace) para resolver el estado vacío. */
  action?: ReactNode
}

/** Mensaje claro cuando un filtro no devuelve resultados. */
export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state-icon" aria-hidden="true">
        <Icon name="search" size={22} />
      </span>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  )
}
