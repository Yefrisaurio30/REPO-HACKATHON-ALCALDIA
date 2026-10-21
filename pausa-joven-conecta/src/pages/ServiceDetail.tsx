import Callout from '../components/Callout'
import Icon from '../components/Icon'
import ServiceCard from '../components/ServiceCard'
import SourceLink from '../components/SourceLink'
import VerificationBadge from '../components/VerificationBadge'
import { getRelatedServices, getServiceById } from '../data'
import { MODALITY_LABELS, SERVICE_CATEGORY_LABELS } from '../data/labels'
import { Link } from '../router'
import { useRouteMatch } from '../router/hooks'

/** Detalle de un servicio del directorio. */
export default function ServiceDetail() {
  const { id } = useRouteMatch()
  const service = id ? getServiceById(id) : undefined

  if (!service) {
    return (
      <section className="section">
        <h1 className="page-title">No encontramos ese servicio</h1>
        <p className="page-description">
          El enlace puede estar incompleto o el registro ya no está en el
          directorio de demostración.
        </p>
        <Link className="btn btn-primary" to="/servicios">
          Volver al directorio
        </Link>
      </section>
    )
  }

  const related = getRelatedServices(service)

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/servicios">Directorio de servicios</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{service.name}</span>
      </nav>

      <header className="detail-header">
        <div className="detail-header-top">
          <span className="chip chip-purple">{SERVICE_CATEGORY_LABELS[service.category]}</span>
          {service.isDemo ? <span className="demo-badge demo-badge-strong">DATOS FICTICIOS DE DEMOSTRACIÓN</span> : null}
        </div>
        <h1 className="detail-title">{service.name}</h1>
        <p className="detail-lead">{service.description}</p>
        <VerificationBadge status={service.verificationStatus} />
      </header>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-block" aria-labelledby="titulo-detalle">
            <h2 className="detail-block-title" id="titulo-detalle">
              <Icon name="heart" size={18} />
              Detalle del servicio
            </h2>
            <dl className="detail-list">
              <div>
                <dt>Modalidad</dt>
                <dd>{MODALITY_LABELS[service.modality]}</dd>
              </div>
              <div>
                <dt>Público destinatario</dt>
                <dd>{service.targetAudience}</dd>
              </div>
              <div>
                <dt>Lugar</dt>
                <dd>{service.location ?? 'Ubicación no informada en la fuente'}</dd>
              </div>
              <div>
                <dt>Identificador del registro</dt>
                <dd>
                  <code className="record-id">{service.id}</code>
                </dd>
              </div>
            </dl>

            {service.notes ? (
              <p className="detail-note">
                <Icon name="info" size={16} />
                {service.notes}
              </p>
            ) : null}
          </section>

          <section className="detail-block" aria-labelledby="titulo-contacto">
            <h2 className="detail-block-title" id="titulo-contacto">
              <Icon name="phone" size={18} />
              Contacto
            </h2>

            {service.contact ? (
              service.verificationStatus === 'verificado' ? (
                <p className="detail-contact">
                  <span className="detail-contact-value">
                    <Icon name="mail" size={16} />
                    {service.contact}
                  </span>
                  <span className="detail-contact-tag">Dato verificado en la fuente oficial</span>
                </p>
              ) : (
                <Callout tone="warning" title="Contacto sin verificar: no lo tomes como vigente">
                  <p>
                    Aparece en el registro de demostración, pero no se ha
                    confirmado contra una fuente oficial. Confirma antes de ir o
                    llamar.
                  </p>
                  <p className="detail-contact-value">
                    <Icon name="mail" size={16} />
                    {service.contact}
                  </p>
                </Callout>
              )
            ) : (
              <Callout tone="info" title="Todavía no hay un contacto confirmado">
                <p>
                  Este registro no tiene teléfono, correo ni enlace de contacto
                  verificado. Preferimos mostrar esta información honesta antes
                  que inventar un dato.
                </p>
              </Callout>
            )}
          </section>

          <Callout tone="info" title="VibraLink no es un servicio médico">
            Esta ficha es informativa: no incluye diagnóstico, evaluación ni
            recomendación de tratamientos. Para una atención profesional de
            salud mental, consulta directamente con la institución responsable.
          </Callout>
        </div>

        <aside className="detail-aside" aria-labelledby="titulo-ficha">
          <section className="detail-block detail-block-sticky">
            <h2 className="detail-block-title" id="titulo-ficha">
              <Icon name="clipboard" size={18} />
              Ficha de verificación
            </h2>

            <dl className="detail-list detail-list-compact">
              <div>
                <dt>Estado</dt>
                <dd>
                  <VerificationBadge status={service.verificationStatus} />
                </dd>
              </div>
              <div>
                <dt>
                  {service.isDemo ? 'Fecha de revisión (demo)' : 'Fecha de consulta de la fuente'}
                </dt>
                <dd>
                  {service.lastVerified ? (
                    service.lastVerified
                  ) : (
                    <span className="muted">Sin fecha registrada</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Fuente oficial</dt>
                <dd>
                  {service.sourceUrl ? (
                    <SourceLink
                      url={service.sourceUrl}
                      label="Ver la fuente"
                      note={
                        service.isDemo
                          ? 'Enlace de ejemplo: el dominio reservado demo.example nunca resuelve.'
                          : undefined
                      }
                    />
                  ) : (
                    <span className="muted">
                      Sin fuente registrada: el dato está pendiente de verificación.
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <Link className="btn btn-secondary btn-block" to="/servicios">
              Volver al directorio
            </Link>
          </section>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="titulo-relacionados">
          <div className="section-head">
            <p className="eyebrow">También te puede servir</p>
            <h2 id="titulo-relacionados">Servicios de la misma categoría</h2>
          </div>
          <div className="card-grid">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
