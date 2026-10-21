import { MODALITY_LABELS, SERVICE_CATEGORY_LABELS, VERIFICATION_LABELS } from '../data/labels'
import type { Service } from '../types'
import DemoBadge from './DemoBadge'

type ServiceCardProps = {
  service: Service
}

/** Tarjeta de un servicio del directorio. */
export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="card service-card" id={service.id} data-service-id={service.id}>
      <header className="card-head">
        <h3>{service.name}</h3>
        {service.isDemo ? <DemoBadge /> : null}
      </header>

      <p className="card-description">{service.description}</p>

      <dl className="card-meta">
        <div>
          <dt>Categoría</dt>
          <dd>{SERVICE_CATEGORY_LABELS[service.category]}</dd>
        </div>
        <div>
          <dt>Modalidad</dt>
          <dd>{MODALITY_LABELS[service.modality]}</dd>
        </div>
        <div>
          <dt>Dirigido a</dt>
          <dd>{service.targetAudience}</dd>
        </div>
        <div>
          <dt>Lugar</dt>
          <dd>{service.location ?? 'Ubicación por definir (dato simulado)'}</dd>
        </div>
      </dl>

      <footer className="card-foot">
        <code className="record-id">{service.id}</code>
        <span className="verification">{VERIFICATION_LABELS[service.verificationStatus]}</span>
      </footer>
    </article>
  )
}
