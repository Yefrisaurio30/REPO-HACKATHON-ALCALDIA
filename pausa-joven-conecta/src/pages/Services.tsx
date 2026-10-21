import { useMemo, useState } from 'react'
import Callout from '../components/Callout'
import EmptyState from '../components/EmptyState'
import FilterBar, { type FilterDefinition } from '../components/FilterBar'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import ServiceCard from '../components/ServiceCard'
import {
  filterServices,
  modalities,
  serviceCategories,
  services,
} from '../data'
import { MODALITY_LABELS, SERVICE_CATEGORY_LABELS } from '../data/labels'
import { useRouter } from '../router/hooks'
import type { Modality, ServiceCategory } from '../types'

const ALL = 'todas'

/** Directorio de servicios de orientación y bienestar. */
export default function Services() {
  const { query: routeQuery } = useRouter()
  const routeSearch = routeQuery.get('q') ?? ''
  const [search, setSearch] = useState(routeSearch)
  const [category, setCategory] = useState<ServiceCategory | typeof ALL>(ALL)
  const [modality, setModality] = useState<Modality | typeof ALL>(ALL)
  const [lastRouteSearch, setLastRouteSearch] = useState(routeSearch)

  // Si la búsqueda llega desde la página de inicio (`?q=...`), se aplica.
  // Se ajusta durante el render para no disparar un efecto en cascada.
  if (routeSearch !== lastRouteSearch) {
    setLastRouteSearch(routeSearch)
    setSearch(routeSearch)
  }

  const results = useMemo(
    () => filterServices({ query: search, category, modality }),
    [search, category, modality],
  )

  const hasFilters = search.trim() !== '' || category !== ALL || modality !== ALL

  const resetFilters = () => {
    setSearch('')
    setCategory(ALL)
    setModality(ALL)
  }

  const filters: FilterDefinition[] = [
    {
      id: 'filtro-categoria',
      label: 'Categoría',
      value: category,
      onChange: (value) => setCategory(value as ServiceCategory | typeof ALL),
      options: [
        { value: ALL, label: 'Todas las categorías' },
        ...serviceCategories.map((value) => ({
          value,
          label: SERVICE_CATEGORY_LABELS[value],
        })),
      ],
    },
    {
      id: 'filtro-modalidad',
      label: 'Modalidad',
      value: modality,
      onChange: (value) => setModality(value as Modality | typeof ALL),
      options: [
        { value: ALL, label: 'Todas las modalidades' },
        ...modalities.map((value) => ({ value, label: MODALITY_LABELS[value] })),
      ],
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Directorio informativo"
        title="Encuentra apoyo"
        description="Busca por nombre o descripción y filtra por categoría o modalidad. Cada ficha indica su fuente, la fecha de consulta y el estado de verificación del dato."
      />

      <Callout tone="demo" title="DATOS FICTICIOS DE DEMOSTRACIÓN">
        Los registros de este directorio son ficticios: sirven para probar el
        buscador y los filtros. No corresponden a instituciones reales de
        Villavicencio, no tienen datos de contacto confirmados y no deben usarse
        para tomar decisiones. Hay {services.length} registros de ejemplo cargados
        en el prototipo.
      </Callout>

      <section className="section" aria-labelledby="titulo-resultados">
        <h2 className="sr-only" id="titulo-resultados">
          Resultados de la búsqueda de servicios
        </h2>

        <div className="filters-panel">
          <SearchBar
            id="busqueda-servicios"
            label="Buscar servicios"
            value={search}
            onChange={setSearch}
            placeholder="Ej.: orientación, acompañamiento, música…"
            hint="La búsqueda revisa el nombre, la descripción y el público destinatario. No hace falta escribir la palabra exacta."
          />
          <FilterBar
            filters={filters}
            hasActiveFilters={hasFilters}
            onReset={resetFilters}
          />
        </div>

        <p className="results-count" role="status" aria-live="polite">
          {results.length === 1
            ? '1 servicio encontrado'
            : `${results.length} servicios encontrados`}
          {hasFilters ? ' con los filtros aplicados' : ' en el directorio'}
        </p>

        {results.length === 0 ? (
          <EmptyState
            title="No encontramos servicios con esa búsqueda"
            description="Prueba con otra palabra como «orientación» o «deporte», revisa la categoría elegida o quita los filtros para ver todo el directorio."
            action={
              <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                Limpiar filtros
              </button>
            }
          />
        ) : (
          <div className="card-grid">
            {results.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
