import Icon from './Icon'

type SearchBarProps = {
  /** Identificador del input (se asocia con su etiqueta). */
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Texto de ayuda visible bajo el campo. */
  hint?: string
  autoFocus?: boolean
}

/**
 * Campo de búsqueda con etiqueta visible, botón para limpiar y contador
 * de resultados para lectores de pantalla.
 */
export default function SearchBar({
  id,
  label,
  value,
  onChange,
  placeholder = 'Escribe para buscar…',
  hint,
  autoFocus = false,
}: SearchBarProps) {
  const hasValue = value.trim().length > 0

  return (
    <div className="search-bar">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden="true">
          <Icon name="search" size={18} />
        </span>
        <input
          id={id}
          type="search"
          className="search-input"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {hasValue ? (
          <button
            type="button"
            className="search-clear"
            onClick={() => onChange('')}
            aria-label="Limpiar la búsqueda"
          >
            <Icon name="close" size={16} />
          </button>
        ) : null}
      </div>
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
