type DemoBadgeProps = {
  /** Texto visible de la etiqueta. */
  label?: string
}

/**
 * Etiqueta visible que identifica los registros ficticios de demostración.
 * Se muestra en todas las tarjetas para no confundirlas con datos verificados.
 */
export default function DemoBadge({ label = 'SERVICIO FICTICIO — SOLO DEMOSTRACIÓN' }: DemoBadgeProps) {
  return (
    <span
      className="demo-badge"
      title="Registro ficticio creado para probar el prototipo. No corresponde a una entidad real."
    >
      {label}
    </span>
  )
}
