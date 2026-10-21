import { formatLongDate, isPastActivity } from '../data'
import { ACTIVITY_CATEGORY_LABELS, MODALITY_LABELS, VERIFICATION_LABELS } from '../data/labels'
import type { Activity } from '../types'
import DemoBadge from './DemoBadge'

type ActivityCardProps = {
  activity: Activity
  /** Fecha de referencia para saber si la actividad ya pasó. */
  now: Date
}

/** Tarjeta de una actividad de la agenda comunitaria. */
export default function ActivityCard({ activity, now }: ActivityCardProps) {
  const isPast = isPastActivity(activity, now)

  return (
    <article
      className="card activity-card"
      id={activity.id}
      data-activity-id={activity.id}
      data-status={isPast ? 'finalizada' : 'programada'}
    >
      <header className="card-head">
        <div>
          <h3>{activity.title}</h3>
          <p className="organizer">{activity.organizer}</p>
        </div>
        {activity.isDemo ? <DemoBadge /> : null}
      </header>

      <p className="card-description">{activity.description}</p>

      <ul className="tags">
        <li className="tag tag-category">{ACTIVITY_CATEGORY_LABELS[activity.category]}</li>
        <li className="tag">{MODALITY_LABELS[activity.modality]}</li>
        <li className={`tag ${isPast ? 'tag-past' : 'tag-next'}`}>
          {isPast ? 'Finalizada' : 'Programada'}
        </li>
      </ul>

      <dl className="card-meta">
        <div>
          <dt>Fecha</dt>
          <dd>{formatLongDate(activity.date)}</dd>
        </div>
        <div>
          <dt>Hora</dt>
          <dd>{activity.time} h</dd>
        </div>
        <div>
          <dt>Lugar</dt>
          <dd>{activity.location ?? 'Lugar por definir (simulado)'}</dd>
        </div>
      </dl>

      <footer className="card-foot">
        <code className="record-id">{activity.id}</code>
        <span className="verification">{VERIFICATION_LABELS[activity.verificationStatus]}</span>
      </footer>
    </article>
  )
}
