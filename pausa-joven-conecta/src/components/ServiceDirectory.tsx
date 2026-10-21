import { useMemo, useState } from 'react'
import { filterServices, modalities, serviceCategories } from '../data'
import { MODALITY_LABELS, SERVICE_CATEGORY_LABELS } from '../data/labels'
import type { Modality, ServiceCategory } from '../types'
import ServiceCard from './ServiceCard'

const ALL = 'todas'

/**
 * Directorio de servicios: búsqueda por nombre y descripción, y filtros por
 * categoría y modalidad. Todas las opciones se derivan de `services.json`.
 */
export default function ServiceDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ServiceCategory | typeof ALL>(ALL)
  const [modality, setModality] = useState<Modality | typeof ALL>(ALL)

  const results = useMemo(
    () => filterServices({ query, category, modality }),
    [query, category, modality],
  )

  const hasFilters = query.trim() !== '' || category !== ALL || modality !== ALL

  return (
    <section className="section" id="servicios">
      <div className="section-head">
        <h2>Directorio de servicios</h2>
        <p>
          Busca por nombre o descripción y filtra por categoría o modalidad. Los
          registros provienen de <code>src/data/services.json</code>.
        </p>
      </div>

      <div className="filters">
        <div className="field field-search">
          <label htmlFor="service-search">Buscar servicios</label>
          <input
            id="service-search"
            type="search"
            placeholder="Ej.: orientación, salud mental, música..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="service-category">Categoría</label>
          <select
            id="service-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ServiceCategory | typeof ALL)}
          >
            <option value={ALL}>Todas</option>
            {serviceCategories.map((value) => (
              <option key={value} value={value}>
                {SERVICE_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="service-modality">Modalidad</label>
          <select
            id="service-modality"
            value={modality}
            onChange={(event) => setModality(event.target.value as Modality | typeof ALL)}
          >
            <option value={ALL}>Todas</option>
            {modalities.map((value) => (
              <option key={value} value={value}>
                {MODALITY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="results-count" role="status">
        {results.length} {results.length === 1 ? 'servicio' : 'servicios'} encontrados
        {hasFilters ? ' con los filtros aplicados' : ''}
      </p>

      {results.length === 0 ? (
        <p className="empty-state">
          No hay servicios que coincidan con la búsqueda. Prueba con otra palabra o
          quita los filtros.
        </p>
      ) : (
        <div className="card-grid">
          {results.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
