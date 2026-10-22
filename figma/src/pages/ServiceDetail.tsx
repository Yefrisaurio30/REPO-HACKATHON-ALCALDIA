import type { Navigate } from "../App"
import AppLink from "../components/AppLink"
import Icon from "../components/Icon"
import VerificationBadge from "../components/VerificationBadge"
import { services } from "../data/services"

export default function ServiceDetail({
  id,
  navigate,
}: {
  id: string
  navigate: Navigate
}) {
  const service = services.find((item) => item.id === id)
  if (!service)
    return (
      <div className="container not-found">
        <h1>Servicio no encontrado</h1>
        <p>El registro solicitado no existe en este prototipo.</p>
        <AppLink
          className="button button-primary"
          navigate={navigate}
          to="/servicios"
        >
          Volver al directorio
        </AppLink>
      </div>
    )
  return (
    <div className="detail-page container">
      <AppLink className="back-link" navigate={navigate} to="/servicios">
        ← Volver al directorio
      </AppLink>
      <article className="detail-card">
        <header>
          <div>
            <span className="category-tag">{service.category}</span>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
          </div>
          <VerificationBadge status={service.status} />
        </header>
        {service.status === "unverified" && (
          <div className="warning">
            <Icon name="info" />
            <div>
              <strong>Información no verificada</strong>
              <p>
                VibraLink todavía no ha contrastado este contacto directamente
                en la fuente oficial. Confirma su vigencia antes de utilizarlo.
              </p>
            </div>
          </div>
        )}
        <div className="detail-grid">
          <section>
            <h2>Información del servicio</h2>
            <dl>
              <div>
                <dt>Modalidad</dt>
                <dd>{service.modality}</dd>
              </div>
              <div>
                <dt>Público destinatario</dt>
                <dd>{service.audience}</dd>
              </div>
              <div>
                <dt>Contacto</dt>
                <dd>
                  {service.contact ||
                    "No hay un contacto verificado disponible."}
                </dd>
              </div>
            </dl>
          </section>
          <aside className="source-card">
            <Icon name="shield" size={25} />
            <h2>Transparencia del dato</h2>
            <dl>
              <div>
                <dt>Fuente</dt>
                <dd>{service.sourceLabel}</dd>
              </div>
              <div>
                <dt>Fecha de consulta</dt>
                <dd>{service.consultedAt}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>
                  <VerificationBadge status={service.status} />
                </dd>
              </div>
            </dl>
            {service.sourceUrl ? (
              <a href={service.sourceUrl} rel="noreferrer" target="_blank">
                Consultar fuente oficial
              </a>
            ) : (
              <p className="muted">
                No se publica un enlace porque todavía no se ha confirmado una
                URL oficial directa para este registro.
              </p>
            )}
          </aside>
        </div>
      </article>
      <aside className="safety-note">
        <Icon name="heart" />
        <p>
          <strong>Recuerda:</strong> VibraLink es una herramienta informativa,
          no un servicio médico ni de atención de emergencias.
        </p>
      </aside>
    </div>
  )
}
