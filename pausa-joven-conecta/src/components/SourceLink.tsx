import Icon from './Icon'

type SourceLinkProps = {
  url: string
  /** Nombre legible de la fuente. */
  label: string
  /** Nota que se muestra debajo del enlace. */
  note?: string
}

/**
 * Enlace a la fuente oficial.
 *
 * Se abre en una pestaña nueva con `rel="noopener noreferrer"` para evitar
 * que la página de destino controle la ventana original. En el prototipo los
 * enlaces apuntan al dominio reservado `demo.example`, que nunca resuelve.
 */
export default function SourceLink({ url, label, note }: SourceLinkProps) {
  return (
    <div className="source-link">
      <a
        className="source-link-anchor"
        href={url}
        target="_blank"
        rel="noopener noreferrer external"
      >
        <span>{label}</span>
        <Icon name="external" size={16} />
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
      {note ? <p className="source-link-note">{note}</p> : null}
    </div>
  )
}
