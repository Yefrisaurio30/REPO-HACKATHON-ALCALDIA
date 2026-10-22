import type { ActivityStatus, VerificationStatus } from "../types"
import Icon from "./Icon"

export default function VerificationBadge({
  status,
}: {
  status: VerificationStatus | ActivityStatus
}) {
  const content =
    status === "verified"
      ? { label: "Información verificada", className: "verified" }
      : status === "finished"
        ? { label: "Actividad finalizada", className: "finished" }
        : status === "unverified"
          ? { label: "No verificado", className: "unverified" }
          : { label: "Datos ficticios de demostración", className: "demo" }
  return (
    <span className={`badge ${content.className}`}>
      <Icon name={status === "unverified" ? "info" : "check"} size={14} />
      {content.label}
    </span>
  )
}
