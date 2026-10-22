import type { Navigate } from "../App"
import type { Service } from "../types"
import AppLink from "./AppLink"
import Icon from "./Icon"
import VerificationBadge from "./VerificationBadge"

export default function ServiceCard({
  navigate,
  service,
}: {
  navigate: Navigate
  service: Service
}) {
  return (
    <article className="result-card">
      <div className="result-card-top">
        <span className="category-tag">{service.category}</span>
        <VerificationBadge status={service.status} />
      </div>
      <h2>{service.name}</h2>
      <p>{service.description}</p>
      <div className="meta-row">
        <Icon name="home" size={17} />
        <span>{service.modality}</span>
      </div>
      <div className="meta-row">
        <Icon name="users" size={17} />
        <span>{service.audience}</span>
      </div>
      <AppLink
        className="card-link"
        navigate={navigate}
        to={`/servicios/${service.id}`}
      >
        Ver información <Icon name="arrow" size={18} />
      </AppLink>
    </article>
  )
}
