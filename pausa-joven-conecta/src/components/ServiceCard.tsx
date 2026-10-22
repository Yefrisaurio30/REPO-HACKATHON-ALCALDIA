
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

/** Extrae el primer número de teléfono de un texto de contacto. */
function extractPhoneNumber(value: string): string {
  const match = value.match(/(\+?\d[\d\s-]{1,}\d)/)
  if (!match) return ''
  return match[1].replace(/[\s-]/g, '')
}

/** Tarjeta de un servicio del directorio. */
export default function ServiceCard({ service }: ServiceCardProps) {
  const contact = service.contact
  const phoneNumber = contact ? extractPhoneNumber(contact) : ''
  const hasWhatsapp = contact ? /whatsapp/i.test(contact) : false

  const locationLabel =
    service.city && service.department
      ? `${service.city}, ${service.department}`
      : (service.location ?? 'Ubicación por confirmar')

  return (
    <article className="card service-card" data-service-id={service.id}>
      <div className="card-topline">
        <span className="chip chip-purple">
          {SERVICE_CATEGORY_LABELS[service.category]}
        </span>
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
            {locationLabel}
          </span>
        </li>
      </ul>

      {contact ? (
        <div className="card-contact">
          <span className="card-contact-value">{contact}</span>
          <div className="card-contact-actions">
            {phoneNumber ? (
              <a className="btn btn-secondary" href={`tel:${phoneNumber}`}>
                Llamar
              </a>
            ) : null}

            {hasWhatsapp && phoneNumber ? (
              <a
                className="btn btn-secondary"
                href={`https://wa.me/${phoneNumber.replace(/^\+/, '')}`}
                target="_blank"
                rel="noopener noreferrer external"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="card-contact">
          <span className="card-contact-value">
            Contacto por confirmar
          </span>
          {service.sourceUrl ? (
            <a
              className="btn btn-secondary"
              href={service.sourceUrl}
              target="_blank"
              rel="noopener noreferrer external"
            >
              Consultar fuente oficial
            </a>
          ) : null}
        </div>
      )}

      {service.verificationStatus === 'pendiente' ? (
        <p className="card-pending">Información por confirmar</p>
      ) : null}

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
