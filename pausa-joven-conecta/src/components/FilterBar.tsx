import Icon from './Icon'

export type FilterOption = {
  value: string
  label: string
  /** Número de registros que coinciden con la opción. */
  count?: number
}

export type FilterDefinition = {
  id: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

type FilterBarProps = {
  filters: FilterDefinition[]
  /** Indica si hay algún filtro activo (permite activar "Limpiar"). */
  hasActiveFilters: boolean
  onReset: () => void
  resetLabel?: string
}

/**
 * Barra de filtros accesibles: cada control es un `select` con etiqueta
 * visible, y hay una acción clara para volver al estado inicial.
 */
export default function FilterBar({
  filters,
  hasActiveFilters,
  onReset,
  resetLabel = 'Limpiar filtros',
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-head">
        <span className="filter-bar-title">
          <Icon name="filter" size={16} />
          Filtros
        </span>
        {hasActiveFilters ? (
          <button type="button" className="link-button" onClick={onReset}>
            {resetLabel}
          </button>
        ) : null}
      </div>

      <div className="filter-bar-grid">
        {filters.map((filter) => (
          <div className="field" key={filter.id}>
            <label className="field-label" htmlFor={filter.id}>
              {filter.label}
            </label>
            <select
              id={filter.id}
              className="select-control"
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {typeof option.count === 'number' ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
