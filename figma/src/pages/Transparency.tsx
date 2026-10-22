import { FormEvent, useState } from "react"
import Icon from "../components/Icon"

export default function Transparency() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors: Record<string, string> = {}
    if (!data.get("recordType"))
      nextErrors.recordType = "Selecciona un tipo de registro."
    if (String(data.get("record") || "").trim().length < 3)
      nextErrors.record = "Escribe al menos 3 caracteres."
    if (String(data.get("issue") || "").trim().length < 15)
      nextErrors.issue = "Describe el problema en al menos 15 caracteres."
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) {
      setSubmitted(true)
      event.currentTarget.reset()
    }
  }
  return (
    <div className="page">
      <section className="page-hero transparency-hero">
        <div className="container">
          <span className="eyebrow">
            <Icon name="shield" size={16} /> Información abierta
          </span>
          <h1>
            Transparencia que genera <span>confianza</span>
          </h1>
          <p>
            Así cuidamos la calidad de cada registro publicado en VibraLink.
          </p>
        </div>
      </section>
      <section className="section container process-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Nuestro proceso</span>
            <h2>De la fuente a tu pantalla</h2>
          </div>
        </div>
        <div className="process-grid">
          <article>
            <span>01</span>
            <Icon name="search" />
            <h3>Recopilamos</h3>
            <p>
              Priorizamos portales institucionales y publicaciones oficiales. En
              este prototipo solo usamos escenarios sintéticos.
            </p>
          </article>
          <article>
            <span>02</span>
            <Icon name="shield" />
            <h3>Verificamos</h3>
            <p>
              Comprobamos responsable, fecha, vigencia y que el enlace
              corresponda a una fuente oficial.
            </p>
          </article>
          <article>
            <span>03</span>
            <Icon name="clock" />
            <h3>Fechamos</h3>
            <p>
              Mostramos cuándo se consultó la fuente para que puedas evaluar qué
              tan reciente es el dato.
            </p>
          </article>
          <article>
            <span>04</span>
            <Icon name="check" />
            <h3>Actualizamos</h3>
            <p>
              Revisaremos registros periódicamente y retiraremos contactos o
              actividades que pierdan vigencia.
            </p>
          </article>
        </div>
      </section>
      <section className="transparency-info">
        <div className="container info-grid">
          <div>
            <span className="section-kicker">Estados visibles</span>
            <h2>Nunca ocultamos la incertidumbre</h2>
            <p>
              Si un dato no tiene una fuente confiable, se presenta como no
              verificado. Los ejemplos se etiquetan de forma permanente para
              evitar confusiones.
            </p>
            <ul className="check-list">
              <li>
                <span className="status-dot green" /> Verificado: coincide con
                una fuente oficial
              </li>
              <li>
                <span className="status-dot yellow" /> No verificado: no debe
                considerarse vigente
              </li>
              <li>
                <span className="status-dot purple" /> Demostración: contenido
                completamente ficticio
              </li>
            </ul>
          </div>
          <div className="update-card">
            <Icon name="clock" size={30} />
            <h3>Ciclo de actualización propuesto</h3>
            <p>
              Revisión mensual de servicios y semanal de actividades. Los
              reportes se priorizarían en la siguiente revisión editorial.
            </p>
            <small>
              Proceso proyectado para una fase futura; no está operando en este
              prototipo.
            </small>
          </div>
        </div>
      </section>
      <section className="section container report-grid">
        <div>
          <span className="section-kicker">Ayúdanos a mejorar</span>
          <h2>Reporta un dato incorrecto</h2>
          <p>
            Este formulario funciona solo como demostración. Valida la
            información en tu dispositivo y no envía ni almacena datos.
          </p>
          <div className="privacy-note">
            <Icon name="shield" />
            <span>
              <strong>Sin datos personales</strong>
              <small>
                No solicitamos nombre, correo, teléfono ni información de salud.
              </small>
            </span>
          </div>
        </div>
        <div className="report-card">
          {submitted ? (
            <div className="success-message" role="status">
              <span>
                <Icon name="check" size={27} />
              </span>
              <h3>Reporte validado</h3>
              <p>
                La demostración se completó. Ningún dato fue enviado o
                almacenado.
              </p>
              <button
                className="button button-secondary"
                onClick={() => setSubmitted(false)}
                type="button"
              >
                Crear otro reporte
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <label htmlFor="record-type">
                Tipo de registro
                <select
                  aria-describedby={
                    errors.recordType ? "record-type-error" : undefined
                  }
                  aria-invalid={!!errors.recordType}
                  defaultValue=""
                  id="record-type"
                  name="recordType"
                >
                  <option disabled value="">
                    Selecciona una opción
                  </option>
                  <option>Servicio</option>
                  <option>Actividad</option>
                </select>
                {errors.recordType && (
                  <small className="field-error" id="record-type-error">
                    {errors.recordType}
                  </small>
                )}
              </label>
              <label htmlFor="record">
                Nombre del registro
                <input
                  aria-describedby={errors.record ? "record-error" : undefined}
                  aria-invalid={!!errors.record}
                  id="record"
                  maxLength={80}
                  name="record"
                  placeholder="Ej. Nombre de la actividad"
                />
                {errors.record && (
                  <small className="field-error" id="record-error">
                    {errors.record}
                  </small>
                )}
              </label>
              <label htmlFor="issue">
                ¿Qué información debe revisarse?
                <textarea
                  aria-describedby={errors.issue ? "issue-error" : "issue-help"}
                  aria-invalid={!!errors.issue}
                  id="issue"
                  maxLength={400}
                  name="issue"
                  placeholder="Describe el dato incorrecto, sin incluir información personal."
                  rows={5}
                />
                <small id="issue-help">
                  No incluyas datos personales ni información de salud.
                </small>
                {errors.issue && (
                  <small className="field-error" id="issue-error">
                    {errors.issue}
                  </small>
                )}
              </label>
              <button className="button button-primary" type="submit">
                Validar reporte de demostración
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
