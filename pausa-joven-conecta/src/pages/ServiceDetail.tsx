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

  // URL de WhatsApp limpia (solo dígitos) para abrir wa.me.
  const whatsappUrl = service.contactStructured?.whatsapp
    ? `https://wa.me/${service.contactStructured.whatsapp.replace(/[^\d]/g, '')}`
    : null

  // URL tel: para llamada. Usa el teléfono estructurado o, en su defecto,
  // el contacto libre cuando no es un correo.
  const telUrl = service.contactStructured?.phone
    ? `tel:${service.contactStructured.phone}`
    : service.contact && !service.contact.includes('@')
      ? `tel:${service.contact.replace(/[^\d+]/g, '')}`
      : null

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

        {(telUrl || whatsappUrl) && (
          <div className="detail-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {telUrl && (
              <a className="btn btn-primary" href={telUrl}>
                <Icon name="phone" size={18} />
                Llamar
              </a>
            )}
            {whatsappUrl && (
              <a
                className="btn btn-secondary"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                Contactar por WhatsApp
              </a>
            )}
          </div>
        )}
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
              {service.city && service.department ? (
                <div>
                  <dt>Ciudad / Departamento</dt>
                  <dd>
                    {service.city}, {service.department}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Lugar</dt>
                <dd>{service.location ?? 'Ubicación no informada en la fuente'}</dd>
              </div>
              {service.contactStructured?.phone ? (
                <div>
                  <dt>Teléfono</dt>
                  <dd>
                    <a className="detail-contact-value" href={`tel:${service.contactStructured.phone}`}>
                      <Icon name="phone" size={16} />
                      {service.contactStructured.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {service.contactStructured?.whatsapp && whatsappUrl ? (
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a
                      className="detail-contact-value"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="whatsapp" size={16} />
                      {service.contactStructured.whatsapp}
                    </a>
                  </dd>
                </div>
              ) : null}
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
              (() => {
                const contactIcon = service.contact.includes('@') ? 'mail' : 'phone'
                return service.verificationStatus === 'verificado' ? (
                  <p className="detail-contact">
                    <span className="detail-contact-value">
                      <Icon name={contactIcon} size={16} />
                      {service.contact}
                    </span>
                    <span className="detail-contact-tag">Dato verificado en la fuente oficial</span>
                  </p>
                ) : (
                  <Callout tone="warning" title="Contacto sin verificar: no lo tomes como vigente">
                    <p>
                      {service.isDemo
                        ? 'Aparece en el registro de demostración, pero no se ha confirmado contra una fuente oficial. Confirma antes de ir o llamar.'
                        : 'Aparece en el registro, pero su vigencia no se ha confirmado contra una fuente oficial. Confirma antes de ir o llamar.'}
                    </p>
                    <p className="detail-contact-value">
                      <Icon name={contactIcon} size={16} />
                      {service.contact}
                    </p>
                  </Callout>
                )
              })()
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

          {service.schedule ? (
            <section className="detail-block" aria-labelledby="horario">
              <h2 className="detail-block-title" id="horario">
                <Icon name="clock" size={18} />
                Horario de atención
              </h2>
              <dl className="detail-list">
                <div>
                  <dt>Horario</dt>
                  <dd>{service.schedule.description}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd>
                    {service.schedule.verified ? (
                      <span className="chip chip-teal">Verificado</span>
                    ) : (
                      <span className="chip chip-amber">Pendiente de confirmación</span>
                    )}
                  </dd>
                </div>
              </dl>
              {!service.schedule.verified ? (
                <p className="detail-note" style={{ marginTop: '0.5rem' }}>
                  <Icon name="info" size={16} />
                  El horario no ha sido confirmado con la fuente oficial. Confirma antes de acudir.
                </p>
              ) : null}
            </section>
          ) : null}

          {service.locations && service.locations.length > 0 ? (
            <section className="detail-block" aria-labelledby="ubicaciones">
              <h2 className="detail-block-title" id="ubicaciones">
                <Icon name="pin" size={18} />
                Ubicaciones físicas
              </h2>
              <div
                className="card-grid"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
              >
                {service.locations.map((loc) => (
                  <article key={loc.name} className="card">
                    <h3 className="card-title">{loc.name}</h3>
                    <p className="card-description">{loc.purpose}</p>
                    <dl className="detail-list" style={{ marginTop: '1rem' }}>
                      <div>
                        <dt>Dirección</dt>
                        <dd>{loc.address}</dd>
                      </div>
                      <div>
                        <dt>Estado</dt>
                        <dd>
                          {loc.verified ? (
                            <span className="chip chip-teal">Verificado</span>
                          ) : (
                            <span className="chip chip-amber">Por confirmar</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
              {!service.locations.some((loc) => loc.verified) ? (
                <p className="detail-note" style={{ marginTop: '1rem' }}>
                  <Icon name="info" size={16} />
                  Las ubicaciones no han sido confirmadas con la fuente oficial. Verifica antes de acudir.
                </p>
              ) : null}
            </section>
          ) : null}

          {service.homeVisitInformation ? (
            <section className="detail-block" aria-labelledby="atencion-presencial">
              <h2 className="detail-block-title" id="atencion-presencial">
                <Icon name="clipboard" size={18} />
                Información sobre atención presencial
              </h2>
              <p>{service.homeVisitInformation}</p>
            </section>
          ) : null}

          {service.supportRoute && service.supportRoute.length > 0 ? (
            <section className="detail-block" aria-labelledby="ruta-atencion">
              <h2 className="detail-block-title" id="ruta-atencion">
                <Icon name="compass" size={18} />
                Ruta de atención integral
              </h2>
              <p className="detail-note" style={{ marginBottom: '1rem' }}>
                <Icon name="info" size={16} />
                Esta ruta es orientación informativa: no constituye un diagnóstico ni un protocolo clínico confirmado.
              </p>
              <ol className="detail-list" style={{ listStyle: 'none', counterReset: 'step' }}>
                {service.supportRoute.map((step) => (
                  <li
                    key={step.step}
                    style={{ position: 'relative', paddingLeft: '3rem', marginBottom: '1.5rem' }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'var(--purple-600)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                      }}
                    >
                      {step.step}
                    </span>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{step.title}</strong>
                    <p style={{ margin: 0, color: 'var(--ink-600)' }}>{step.description}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

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
