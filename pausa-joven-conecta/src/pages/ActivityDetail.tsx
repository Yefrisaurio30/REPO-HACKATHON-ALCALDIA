import { useMemo } from 'react'
import Callout from '../components/Callout'
import Icon from '../components/Icon'
import SourceLink from '../components/SourceLink'
import VerificationBadge from '../components/VerificationBadge'
import { activities, formatLongDate, formatTime, getActivityById, isPastActivity } from '../data'
import { ACTIVITY_CATEGORY_LABELS, MODALITY_LABELS } from '../data/labels'
import { useNow } from '../hooks/useNow'
import { Link } from '../router'
import { useRouteMatch } from '../router/hooks'

/** Detalle de una actividad de la agenda. */
export default function ActivityDetail() {
  const { id } = useRouteMatch()
  const now = useNow()
  const activity = id ? getActivityById(id) : undefined

  const related = useMemo(
    () =>
      activity
        ? activities
            .filter(
              (item) => item.id !== activity.id && item.category === activity.category,
            )
            .slice(0, 3)
        : [],
    [activity],
  )

  if (!activity) {
    return (
      <section className="section">
        <h1 className="page-title">No encontramos esa actividad</h1>
        <p className="page-description">
          El enlace puede estar incompleto o el registro ya no está en la agenda de
          demostración.
        </p>
        <Link className="btn btn-primary" to="/actividades">
          Volver a la agenda
        </Link>
      </section>
    )
  }

  const isPast = isPastActivity(activity, now)

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/actividades">Agenda comunitaria</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{activity.title}</span>
      </nav>

      <header className="detail-header">
        <div className="detail-header-top">
          <span className="chip chip-purple">
            {ACTIVITY_CATEGORY_LABELS[activity.category]}
          </span>
          <span className={`state-chip ${isPast ? 'state-past' : 'state-next'}`}>
            {isPast ? 'Finalizada' : 'Programada'}
          </span>
          {activity.isDemo ? (
            <span className="demo-badge demo-badge-strong">DATOS FICTICIOS DE DEMOSTRACIÓN</span>
          ) : null}
        </div>
        <h1 className="detail-title">{activity.title}</h1>
        <p className="detail-lead">
          Organizada por <strong>{activity.organizer}</strong>
        </p>
        <VerificationBadge status={activity.verificationStatus} />
      </header>

      {isPast ? (
        <Callout tone="info" title="Esta actividad ya se realizó">
          Se muestra con fines de archivo. No es una actividad próxima y su enlace
          de inscripción ya no aplica.
        </Callout>
      ) : null}

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-block" aria-labelledby="titulo-actividad">
            <h2 className="detail-block-title" id="titulo-actividad">
              <Icon name="calendar" size={18} />
              Sobre la actividad
            </h2>
            <p className="detail-text">{activity.description}</p>
            {activity.notes ? (
              <p className="detail-note">
                <Icon name="info" size={16} />
                {activity.notes}
              </p>
            ) : null}
          </section>

          <section className="detail-block" aria-labelledby="titulo-cuando">
            <h2 className="detail-block-title" id="titulo-cuando">
              <Icon name="clock" size={18} />
              Cuándo y dónde
            </h2>
            <dl className="detail-list">
              <div>
                <dt>Fecha</dt>
                <dd>{formatLongDate(activity.date)}</dd>
              </div>
              <div>
                <dt>Hora</dt>
                <dd>{formatTime(activity.time)}</dd>
              </div>
              <div>
                <dt>Lugar o modalidad</dt>
                <dd>
                  {activity.location ?? 'Lugar por confirmar'}
                  <span className="detail-sub">{MODALITY_LABELS[activity.modality]}</span>
                </dd>
              </div>
              <div>
                <dt>Organizador</dt>
                <dd>{activity.organizer}</dd>
              </div>
              <div>
                <dt>Identificador del registro</dt>
                <dd>
                  <code className="record-id">{activity.id}</code>
                </dd>
              </div>
            </dl>
          </section>

          <section className="detail-block" aria-labelledby="titulo-requisitos">
            <h2 className="detail-block-title" id="titulo-requisitos">
              <Icon name="users" size={18} />
              Requisitos de participación
            </h2>
            {activity.requirements ? (
              <p className="detail-text">{activity.requirements}</p>
            ) : (
              <p className="detail-text muted">
                La fuente no informa requisitos. Se recomienda confirmar con el
                organizador antes de ir.
              </p>
            )}
          </section>

          <section className="detail-block" aria-labelledby="titulo-inscripcion">
            <h2 className="detail-block-title" id="titulo-inscripcion">
              <Icon name="ticket" size={18} />
              Participar
            </h2>

            {activity.registrationUrl ? (
              activity.verificationStatus === 'verificado' && !isPast ? (
                <SourceLink
                  url={activity.registrationUrl}
                  label="Ir al enlace de inscripción"
                  note="Enlace verificado en la fuente oficial."
                />
              ) : (
                <Callout tone="warning" title="Enlace de participación sin verificar">
                  <p>
                    {isPast
                      ? 'La actividad ya se realizó, así que este enlace no está activo.'
                      : 'El enlace apunta a un marcador de posición del prototipo: no abre un formulario real.'}
                  </p>
                  <p>
                    <a
                      className="source-link-anchor"
                      href={activity.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer external"
                    >
                      <span>Abrir el enlace de ejemplo</span>
                      <Icon name="external" size={16} />
                      <span className="sr-only">(se abre en una pestaña nueva)</span>
                    </a>
                  </p>
                </Callout>
              )
            ) : (
              <Callout tone="info" title="No hay enlace de inscripción publicado">
                <p>
                  La fuente de esta actividad no incluye un enlace de
                  participación. Se mostrará en cuanto exista y se pueda verificar.
                </p>
              </Callout>
            )}
          </section>
        </div>

        <aside className="detail-aside" aria-labelledby="titulo-ficha-actividad">
          <section className="detail-block detail-block-sticky">
            <h2 className="detail-block-title" id="titulo-ficha-actividad">
              <Icon name="clipboard" size={18} />
              Ficha de verificación
            </h2>

            <dl className="detail-list detail-list-compact">
              <div>
                <dt>Estado</dt>
                <dd>
                  <VerificationBadge status={activity.verificationStatus} />
                </dd>
              </div>
              <div>
                <dt>
                  {activity.isDemo
                    ? 'Fecha de revisión (demo)'
                    : 'Fecha de consulta de la fuente'}
                </dt>
                <dd>
                  {activity.lastVerified ? (
                    activity.lastVerified
                  ) : (
                    <span className="muted">Sin fecha registrada</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Fuente de información</dt>
                <dd>
                  {activity.sourceUrl ? (
                    <SourceLink
                      url={activity.sourceUrl}
                      label="Ver la fuente"
                      note={
                        activity.isDemo
                          ? 'Enlace de ejemplo: el dominio reservado demo.example nunca resuelve.'
                          : undefined
                      }
                    />
                  ) : (
                    <span className="muted">Sin fuente registrada.</span>
                  )}
                </dd>
              </div>
            </dl>

            <Link className="btn btn-secondary btn-block" to="/actividades">
              Volver a la agenda
            </Link>
          </section>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="titulo-relacionadas">
          <div className="section-head">
            <p className="eyebrow">También puede interesarte</p>
            <h2 id="titulo-relacionadas">Otras actividades de la misma categoría</h2>
          </div>
          <ul className="related-list">
            {related.map((item) => (
              <li key={item.id}>
                <Link className="related-link" to={`/actividades/${item.id}`}>
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {formatLongDate(item.date)} · {formatTime(item.time)}
                    </small>
                  </span>
                  <Icon name="arrow-right" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
