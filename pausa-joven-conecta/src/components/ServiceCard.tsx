import { MODALITY_LABELS, SERVICE_CATEGORY_LABELS } from '../data/labels'
import { servicePath } from '../router/routes'
import { Link } from '../router'
import type { Service } from '../types'
import DemoBadge from './DemoBadge'
import Icon from './Icon'
import VerificationBadge from './VerificationBadge'

type ServiceCardProps = {
  service: Service
}

/** Tarjeta de un servicio del directorio. */
export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="card service-card" data-service-id={service.id}>
      <div className="card-topline">
        <span className="chip chip-purple">{SERVICE_CATEGORY_LABELS[service.category]}</span>
        {service.isDemo ? <DemoBadge /> : null}
      </div>

      <h3 className="card-title">
        <Link to={servicePath(service.id)}>{service.name}</Link>
      </h3>

      <p className="card-description">{service.description}</p>

      <ul className="card-meta">
        <li>
          <Icon name="users" size={16} />
          <span>
            <span className="meta-label">Dirigido a</span>
            {service.targetAudience}
          </span>
        </li>
        <li>
          <Icon name="compass" size={16} />
          <span>
            <span className="meta-label">Modalidad</span>
            {MODALITY_LABELS[service.modality]}
          </span>
        </li>
        <li>
          <Icon name="pin" size={16} />
          <span>
            <span className="meta-label">Lugar</span>
            {service.location ?? 'Ubicación por confirmar'}
          </span>
        </li>
      </ul>

      <footer className="card-foot">
        <VerificationBadge status={service.verificationStatus} compact />
        <Link className="card-link" to={servicePath(service.id)}>
          Ver servicio
          <Icon name="arrow-right" size={16} />
        </Link>
      </footer>
    </article>
  )
}
