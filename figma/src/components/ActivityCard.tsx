import type { Navigate } from "../App"
import type { Activity } from "../types"
import AppLink from "./AppLink"
import Icon from "./Icon"
import VerificationBadge from "./VerificationBadge"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`))
}

export default function ActivityCard({
  activity,
  navigate,
}: {
  activity: Activity
  navigate: Navigate
}) {
  return (
    <article
      className={`activity-card ${
        activity.status === "finished" ? "is-finished" : ""
      }`}
    >
      <div className="activity-accent" />
      <div className="result-card-top">
        <span className="category-tag">{activity.category}</span>
        <VerificationBadge status={activity.status} />
      </div>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <div className="activity-meta">
        <div className="meta-row">
          <Icon name="calendar" size={17} />
          <span>{formatDate(activity.date)}</span>
        </div>
        <div className="meta-row">
          <Icon name="clock" size={17} />
          <span>{activity.time}</span>
        </div>
        <div className="meta-row">
          <Icon name="location" size={17} />
          <span>{activity.location}</span>
        </div>
      </div>
      <AppLink
        className="card-link"
        navigate={navigate}
        to={`/actividades/${activity.id}`}
      >
        Ver actividad <Icon name="arrow" size={18} />
      </AppLink>
    </article>
  )
}
