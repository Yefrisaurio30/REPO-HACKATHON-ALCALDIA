import type { Navigate } from "../App"
import AppLink from "../components/AppLink"
import Icon from "../components/Icon"
import VerificationBadge from "../components/VerificationBadge"
import { activities } from "../data/activities"

export default function ActivityDetail({
  id,
  navigate,
}: {
  id: string
  navigate: Navigate
}) {
  const activity = activities.find((item) => item.id === id)
  if (!activity)
    return (
      <div className="container not-found">
        <h1>Actividad no encontrada</h1>
        <p>El registro solicitado no existe en este prototipo.</p>
        <AppLink
          className="button button-primary"
          navigate={navigate}
          to="/actividades"
        >
          Volver a la agenda
        </AppLink>
      </div>
    )
  const formattedDate = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${activity.date}T12:00:00Z`))
  return (
    <div className="detail-page container">
      <AppLink className="back-link" navigate={navigate} to="/actividades">
        ← Volver a la agenda
      </AppLink>
      <article className="detail-card activity-detail">
        <header>
          <div>
            <span className="category-tag">{activity.category}</span>
            <h1>{activity.name}</h1>
            <p>{activity.description}</p>
          </div>
          <VerificationBadge status={activity.status} />
        </header>
        {activity.status === "finished" && (
          <div className="warning neutral">
            <Icon name="clock" />
            <div>
              <strong>Esta actividad ya finalizó</strong>
              <p>
                Se conserva únicamente como ejemplo histórico y no aparece entre
                las próximas actividades.
              </p>
            </div>
          </div>
        )}
        <div className="event-facts">
          <div>
            <Icon name="calendar" />
            <span>
              <small>Fecha</small>
              <strong>{formattedDate}</strong>
            </span>
          </div>
          <div>
            <Icon name="clock" />
            <span>
              <small>Hora</small>
              <strong>{activity.time}</strong>
            </span>
          </div>
          <div>
            <Icon name="location" />
            <span>
              <small>Lugar o modalidad</small>
              <strong>{activity.location}</strong>
            </span>
          </div>
        </div>
        <div className="detail-grid">
          <section>
            <h2>Sobre la actividad</h2>
            <dl>
              <div>
                <dt>Organizador</dt>
                <dd>{activity.organizer}</dd>
              </div>
              <div>
                <dt>Requisitos</dt>
                <dd>
                  {activity.requirements ||
                    "No se conocen requisitos de participación."}
                </dd>
              </div>
              <div>
                <dt>Inscripción</dt>
                <dd>
                  {activity.participationUrl
                    ? "Enlace verificado disponible"
                    : "No hay enlace de inscripción verificado."}
                </dd>
              </div>
            </dl>
          </section>
          <aside className="source-card">
            <Icon name="shield" size={25} />
            <h2>Fuente de información</h2>
            <p>{activity.sourceLabel}</p>
            <VerificationBadge status={activity.status} />
            {activity.sourceUrl ? (
              <a href={activity.sourceUrl} rel="noreferrer" target="_blank">
                Consultar fuente
              </a>
            ) : (
              <p className="muted">
                No existe una fuente externa porque este registro es ficticio.
              </p>
            )}
          </aside>
        </div>
      </article>
    </div>
  )
}
