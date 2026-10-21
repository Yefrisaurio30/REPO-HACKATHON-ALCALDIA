import { useRef, useState, type FormEvent } from 'react'
import Callout from '../components/Callout'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import { activities, services } from '../data'
import { VERIFICATION_EXPLANATIONS, VERIFICATION_LABELS } from '../data/labels'
import type { VerificationStatus } from '../types'

type FormState = {
  recordType: 'servicio' | 'actividad'
  recordId: string
  field: string
  description: string
  contact: string
  consent: boolean
}

type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL_STATE: FormState = {
  recordType: 'servicio',
  recordId: services[0]?.id ?? '',
  field: 'fecha',
  description: '',
  contact: '',
  consent: false,
}

const MIN_DESCRIPTION = 20
const MAX_DESCRIPTION = 600

const FIELDS = [
  { value: 'fecha', label: 'La fecha no corresponde' },
  { value: 'contacto', label: 'El contacto está equivocado o no responde' },
  { value: 'enlace', label: 'El enlace o la fuente no funciona' },
  { value: 'descripcion', label: 'La descripción está incompleta o desactualizada' },
  { value: 'estado', label: 'La actividad no es próxima / ya se realizó' },
  { value: 'otro', label: 'Otro problema' },
]

const STATUS_ORDER: VerificationStatus[] = ['demo', 'pendiente', 'verificado']

/** Campo del formulario asociado a cada error, para mover el foco. */
const ERROR_FIELD_IDS: Record<keyof FormState, string> = {
  recordType: 'reporte-tipo',
  recordId: 'reporte-registro',
  field: 'reporte-campo',
  description: 'reporte-descripcion',
  contact: 'reporte-contacto',
  consent: 'reporte-consentimiento',
}

/** Página de transparencia: proceso, estados de verificación y reporte. */
export default function Transparency() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState<FormState | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validate = (state: FormState): FormErrors => {
    const next: FormErrors = {}

    if (!state.recordId) {
      next.recordId = 'Elige el registro que quieres reportar.'
    }

    const description = state.description.trim()
    if (!description) {
      next.description = 'Escribe qué información no coincide.'
    } else if (description.length < MIN_DESCRIPTION) {
      next.description = `Describe el problema con al menos ${MIN_DESCRIPTION} caracteres.`
    } else if (description.length > MAX_DESCRIPTION) {
      next.description = `Máximo ${MAX_DESCRIPTION} caracteres (llevas ${description.length}).`
    }

    if (state.contact.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.contact.trim())) {
      next.contact = 'Escribe un correo válido o deja el campo vacío.'
    }

    if (!state.consent) {
      next.consent = 'Confirma que entiendes el alcance de la demostración.'
    }

    return next
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitted(null)
      const firstErrorKey = Object.keys(nextErrors)[0] as keyof FormState
      document.getElementById(ERROR_FIELD_IDS[firstErrorKey])?.focus()
      return
    }

    setErrors({})
    setSubmitted(form)
  }

  const recordLabel = (id: string) => {
    const service = services.find((item) => item.id === id)
    if (service) return service.name
    const activity = activities.find((item) => item.id === id)
    return activity ? activity.title : id
  }

  return (
    <>
      <PageHeader
        eyebrow="Transparencia ante todo"
        title="Cómo llega cada dato a VibraLink"
        description="VibraLink es un prototipo informativo. Publicamos de dónde viene cada registro, cuándo revisamos la fuente y cómo se puede corregir lo que no esté bien."
      />

      <Callout tone="demo" title="DATOS FICTICIOS DE DEMOSTRACIÓN">
        El prototipo se alimenta de registros ficticios identificados como tales.
        Ningún dato de este sitio corresponde a una institución real de
        Villavicencio.
      </Callout>

      <section className="section" aria-labelledby="titulo-proceso">
        <div className="section-head">
          <p className="eyebrow">El proceso</p>
          <h2 id="titulo-proceso">Cinco pasos, siempre visibles</h2>
        </div>

        <ol className="steps-grid">
          <li className="step-card">
            <span className="step-number">01</span>
            <h3>Recopilamos</h3>
            <p>
              Buscamos en fuentes oficiales y en los canales públicos de la
              comunidad. Solo guardamos información que se pueda atribuir a una
              fuente identificable.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">02</span>
            <h3>Verificamos</h3>
            <p>
              La persona responsable revisa el dato y anota si la fuente oficial lo
              respalda. Si no se puede confirmar, el registro queda como
              pendiente.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">03</span>
            <h3>Fecha de consulta</h3>
            <p>
              Cada ficha indica el día en que se consultó la fuente. Sin fecha no
              publicamos el dato como vigente.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">04</span>
            <h3>Lo reportas</h3>
            <p>
              Si un dato está equivocado o desactualizado, lo reportas con el
              formulario de esta página.
            </p>
          </li>
          <li className="step-card">
            <span className="step-number">05</span>
            <h3>Actualizamos</h3>
            <p>
              Revisamos el reporte, consultamos la fuente de nuevo y actualizamos
              la ficha conservando la trazabilidad del cambio.
            </p>
          </li>
        </ol>
      </section>

      <section className="section" aria-labelledby="titulo-estados">
        <div className="section-head">
          <p className="eyebrow">Estados</p>
          <h2 id="titulo-estados">Qué significa cada etiqueta</h2>
          <p>
            El color nunca es el único indicador: cada estado incluye un texto y
            una explicación, para que se entienda también sin ver la pantalla.
          </p>
        </div>

        <ul className="status-list">
          {STATUS_ORDER.map((status) => (
            <li key={status} className={`status-item status-item-${status}`}>
              <span className="status-item-label">{VERIFICATION_LABELS[status]}</span>
              <p>{VERIFICATION_EXPLANATIONS[status]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="titulo-reporte">
        <div className="section-head">
          <p className="eyebrow">Reportes</p>
          <h2 id="titulo-reporte">¿Viste un dato incorrecto?</h2>
          <p>
            Completa el formulario de demostración. No se envía información a
            servidores externos, no se guarda nada en tu dispositivo y no debes
            incluir datos personales ni información de salud.
          </p>
        </div>

        <div className="form-layout">
          <form className="report-form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <h3 className="form-title">
              <Icon name="flag" size={18} />
              Formulario de reporte (demostración)
            </h3>

            {submitted ? (
              <div className="form-success" role="status">
                <span className="form-success-icon" aria-hidden="true">
                  <Icon name="check" size={22} />
                </span>
                <h4>Reporte registrado en la demostración</h4>
                <p>
                  Recibimos tu reporte de prueba para «{recordLabel(submitted.recordId)}».
                  En este prototipo la información <strong>no sale del navegador</strong>:
                  no se envía a ningún servidor ni queda guardada.
                </p>
                <ul className="form-summary">
                  <li>
                    <span>Registro</span>
                    <strong>{recordLabel(submitted.recordId)}</strong>
                  </li>
                  <li>
                    <span>Campo</span>
                    <strong>{FIELDS.find((item) => item.value === submitted.field)?.label}</strong>
                  </li>
                  <li>
                    <span>Contacto</span>
                    <strong>{submitted.contact.trim() || 'No indicado'}</strong>
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmitted(null)
                    setForm(INITIAL_STATE)
                  }}
                >
                  Enviar otro reporte
                </button>
              </div>
            ) : (
              <>
                <div className="form-field">
                  <label className="field-label" htmlFor="reporte-tipo">
                    Tipo de registro
                  </label>
                  <select
                    id="reporte-tipo"
                    className="select-control"
                    value={form.recordType}
                    onChange={(event) => {
                      const recordType = event.target.value as FormState['recordType']
                      const list = recordType === 'servicio' ? services : activities
                      update('recordType', recordType)
                      update('recordId', list[0]?.id ?? '')
                    }}
                  >
                    <option value="servicio">Servicio del directorio</option>
                    <option value="actividad">Actividad de la agenda</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="reporte-registro">
                    Registro que quieres reportar
                  </label>
                  <select
                    id="reporte-registro"
                    className="select-control"
                    value={form.recordId}
                    aria-invalid={errors.recordId ? 'true' : undefined}
                    aria-describedby={errors.recordId ? 'error-reporte-registro' : undefined}
                    onChange={(event) => update('recordId', event.target.value)}
                  >
                    {(form.recordType === 'servicio' ? services : activities).map((item) => (
                      <option key={item.id} value={item.id}>
                        {'name' in item ? item.name : item.title}
                      </option>
                    ))}
                  </select>
                  {errors.recordId ? (
                    <p className="field-error" id="error-reporte-registro" role="alert">
                      {errors.recordId}
                    </p>
                  ) : null}
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="reporte-campo">
                    ¿Qué información no coincide?
                  </label>
                  <select
                    id="reporte-campo"
                    className="select-control"
                    value={form.field}
                    onChange={(event) => update('field', event.target.value)}
                  >
                    {FIELDS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="reporte-descripcion">
                    Descripción del problema
                  </label>
                  <textarea
                    id="reporte-descripcion"
                    className="textarea-control"
                    rows={5}
                    value={form.description}
                    aria-invalid={errors.description ? 'true' : undefined}
                    aria-describedby={
                      errors.description ? 'error-reporte-descripcion' : 'ayuda-reporte-descripcion'
                    }
                    onChange={(event) => update('description', event.target.value)}
                  />
                  <p className="field-hint" id="ayuda-reporte-descripcion">
                    Entre {MIN_DESCRIPTION} y {MAX_DESCRIPTION} caracteres. Describe solo
                    el dato que falla, sin datos personales ni información de salud.
                  </p>
                  {errors.description ? (
                    <p className="field-error" id="error-reporte-descripcion" role="alert">
                      {errors.description}
                    </p>
                  ) : null}
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="reporte-contacto">
                    ¿Cómo te avisamos? (opcional)
                  </label>
                  <input
                    id="reporte-contacto"
                    type="email"
                    className="input-control"
                    value={form.contact}
                    placeholder="correo@ejemplo.com"
                    aria-invalid={errors.contact ? 'true' : undefined}
                    aria-describedby={errors.contact ? 'error-reporte-contacto' : undefined}
                    onChange={(event) => update('contact', event.target.value)}
                  />
                  <p className="field-hint">
                    Opcional. Es el único dato personal que se acepta y no se
                    almacena en este prototipo.
                  </p>
                  {errors.contact ? (
                    <p className="field-error" id="error-reporte-contacto" role="alert">
                      {errors.contact}
                    </p>
                  ) : null}
                </div>

                <div className="form-field form-field-check">
                  <input
                    id="reporte-consentimiento"
                    type="checkbox"
                    checked={form.consent}
                    aria-invalid={errors.consent ? 'true' : undefined}
                    aria-describedby={errors.consent ? 'error-reporte-consentimiento' : undefined}
                    onChange={(event) => update('consent', event.target.checked)}
                  />
                  <label htmlFor="reporte-consentimiento">
                    Entiendo que este formulario es una demostración, que no se envía
                    información a ningún servidor y que no debo incluir datos
                    sensibles.
                  </label>
                </div>
                {errors.consent ? (
                  <p className="field-error" id="error-reporte-consentimiento" role="alert">
                    {errors.consent}
                  </p>
                ) : null}

                <button className="btn btn-primary btn-block" type="submit">
                  Enviar reporte de demostración
                  <Icon name="arrow-right" size={18} />
                </button>
              </>
            )}
          </form>

          <aside className="form-aside">
            <Callout tone="info" title="Qué hace y qué no hace este formulario">
              <ul className="check-list">
                <li>
                  <Icon name="check" size={15} />
                  Valida los campos y te avisa de lo que falta.
                </li>
                <li>
                  <Icon name="check" size={15} />
                  Muestra una confirmación visible al final.
                </li>
                <li>
                  <Icon name="close" size={15} />
                  No envía datos a servidores externos.
                </li>
                <li>
                  <Icon name="close" size={15} />
                  No guarda información en el dispositivo.
                </li>
                <li>
                  <Icon name="close" size={15} />
                  No solicita datos de salud ni historial personal.
                </li>
              </ul>
            </Callout>

            <section className="detail-block">
              <h3 className="detail-block-title">
                <Icon name="clipboard" size={18} />
                Qué revisamos
              </h3>
              <p className="detail-text">
                Un reporte se toma como un aviso para volver a consultar la fuente
                oficial del registro. No se modifican datos sin comprobarlos y cada
                cambio conserva la fecha de la última consulta.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </>
  )
}
