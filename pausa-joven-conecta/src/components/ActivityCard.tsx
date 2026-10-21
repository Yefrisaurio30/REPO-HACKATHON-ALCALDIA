import { ACTIVITY_CATEGORY_LABELS, MODALITY_LABELS } from '../data/labels'
import { formatMediumDate, formatTime, isPastActivity } from '../data'
import { activityPath } from '../router/routes'
import { Link } from '../router'
import type { Activity } from '../types'
import DemoBadge from './DemoBadge'
import Icon from './Icon'
import VerificationBadge from './VerificationBadge'

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
      data-activity-id={activity.id}
      data-status={isPast ? 'finalizada' : 'programada'}
    >
      <div className="card-topline">
        <span className="chip chip-purple">{ACTIVITY_CATEGORY_LABELS[activity.category]}</span>
        {activity.isDemo ? <DemoBadge /> : null}
      </div>

      <h3 className="card-title">
        <Link to={activityPath(activity.id)}>{activity.title}</Link>
      </h3>

      <p className="organizer">{activity.organizer}</p>
      <p className="card-description">{activity.description}</p>

      <ul className="card-meta">
        <li>
          <Icon name="calendar" size={16} />
          <span>
            <span className="meta-label">Fecha</span>
            {formatMediumDate(activity.date)}
          </span>
        </li>
        <li>
          <Icon name="clock" size={16} />
          <span>
            <span className="meta-label">Hora</span>
            {formatTime(activity.time)}
          </span>
        </li>
        <li>
          <Icon name="pin" size={16} />
          <span>
            <span className="meta-label">Lugar</span>
            {activity.location ?? MODALITY_LABELS[activity.modality]}
          </span>
        </li>
      </ul>

      <footer className="card-foot">
        <span className={`state-chip ${isPast ? 'state-past' : 'state-next'}`}>
          {isPast ? 'Finalizada' : 'Programada'}
        </span>
        <span className="card-foot-right">
          <VerificationBadge status={activity.verificationStatus} compact />
          <Link className="card-link" to={activityPath(activity.id)}>
            Ver actividad
            <Icon name="arrow-right" size={16} />
          </Link>
        </span>
      </footer>
    </article>
  )
}
