/**
 * Valida los datos de demostración de VibraLink.
 * Uso: npm run validate:data
 *
 * No requiere dependencias externas: solo usa Node.js.
 *
 * Reglas de seguridad del proyecto:
 *  - Todos los registros son ficticios (`isDemo: true`) y su estado nunca es
 *    `verificado`, porque no se ha consultado ninguna fuente real.
 *  - Los enlaces solo pueden apuntar al dominio reservado `demo.example`,
 *    que por definición nunca resuelve (RFC 2606).
 *  - Los contactos de ejemplo deben contener la palabra «ejemplo» y un
 *    correo del mismo dominio reservado. Nunca hay teléfonos reales.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'src', 'data')

/** Dominio reservado para ejemplos: nunca resuelve en internet. */
const DEMO_DOMAIN = 'demo.example'
const DEMO_URL_PREFIX = `https://${DEMO_DOMAIN}/`

const SERVICE_CATEGORIES = new Set([
  'orientacion',
  'bienestar-comunitario',
  'educacion',
  'apoyo-social',
  'actividades-juveniles',
  'cultura',
])

const ACTIVITY_CATEGORIES = new Set([
  'cultura',
  'deporte',
  'educacion',
  'arte-y-creatividad',
  'bienestar-comunitario',
  'participacion-juvenil',
])

const MODALITIES = new Set(['presencial', 'virtual', 'telefonica'])
const VERIFICATION_STATUSES = new Set(['demo', 'pendiente', 'verificado'])

const errors = []
const warnings = []

const fail = (msg) => errors.push(msg)
const warn = (msg) => warnings.push(msg)

async function readJson(fileName) {
  const raw = await readFile(join(dataDir, fileName), 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    fail(`${fileName}: JSON inválido -> ${error.message}`)
    return null
  }
}

/** Detecta caracteres fuera del juego esperado (texto en español). */
const ALLOWED_CHARS_STRICT = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,;:!¡?¿"'()°\-/]+$/

function checkText(value, where) {
  if (typeof value !== 'string') {
    fail(`${where}: se esperaba texto y se recibió ${typeof value}`)
    return
  }
  if (!ALLOWED_CHARS_STRICT.test(value)) {
    const odd = [...new Set(value.split('').filter((c) => !ALLOWED_CHARS_STRICT.test(c)))]
    warn(`${where}: caracteres inesperados ${JSON.stringify(odd.join(''))} en "${value}"`)
  }
}

/** Detecta números que podrían ser un teléfono real. */
function checkNoPhoneLike(value, where) {
  if (typeof value === 'string' && /\d{3}[\s-]?\d{3}[\s-]?\d{4}/.test(value)) {
    fail(`${where}: parece contener un teléfono real`)
  }
}

const SERVICE_FIELDS = [
  'id',
  'name',
  'category',
  'description',
  'modality',
  'targetAudience',
  'location',
  'contact',
  'sourceUrl',
  'lastVerified',
  'verificationStatus',
  'isDemo',
  'notes',
]

const ACTIVITY_FIELDS = [
  'id',
  'title',
  'category',
  'description',
  'organizer',
  'date',
  'time',
  'location',
  'modality',
  'requirements',
  'sourceUrl',
  'registrationUrl',
  'lastVerified',
  'verificationStatus',
  'isDemo',
  'notes',
]

function checkCommon(record, fileName, requiredFields) {
  const where = `${fileName}/${record.id ?? '(sin id)'}`

  for (const field of requiredFields) {
    if (!(field in record)) {
      fail(`${where}: falta el campo "${field}"`)
    }
  }

  if (typeof record.id !== 'string' || !record.id.trim()) {
    fail(`${where}: id ausente o vacío`)
  }
  if (!VERIFICATION_STATUSES.has(record.verificationStatus)) {
    fail(
      `${where}: verificationStatus debe ser "demo", "pendiente" o "verificado" (es ${record.verificationStatus})`,
    )
  }
  if (record.isDemo && record.verificationStatus === 'verificado') {
    fail(`${where}: los registros de demostración no pueden tener verificationStatus "verificado"`)
  }
  if (!record.isDemo && record.verificationStatus === 'demo') {
    fail(`${where}: los registros reales no deben tener verificationStatus "demo"`)
  }
  if (!MODALITIES.has(record.modality)) {
    fail(`${where}: modality desconocida "${record.modality}"`)
  }
  return where
}

function checkUniqueIds(records, fileName) {
  const seen = new Set()
  for (const record of records) {
    if (seen.has(record.id)) {
      fail(`${fileName}: id duplicado "${record.id}"`)
    }
    seen.add(record.id)
  }
  return seen.size
}

/** Los enlaces de demostración solo pueden usar el dominio reservado. */
function checkDemoUrl(value, where, field) {
  if (value === null || value === undefined) return
  if (typeof value !== 'string' || !value.startsWith(DEMO_URL_PREFIX)) {
    fail(
      `${where}: "${field}" debe ser null o empezar por ${DEMO_URL_PREFIX} (dominio reservado que nunca resuelve)`,
    )
  }
}

/** El contacto de ejemplo debe ser claramente ficticio. */
function checkDemoContact(value, where) {
  if (value === null || value === undefined) return
  if (typeof value !== 'string' || !value.trim()) {
    fail(`${where}: "contact" vacío`)
    return
  }
  const lowered = value.toLowerCase()
  if (!lowered.includes('ejemplo')) {
    fail(`${where}: "contact" debe dejar claro que es un ejemplo (falta la palabra "ejemplo")`)
  }
  if (!lowered.includes(`@${DEMO_DOMAIN}`)) {
    fail(`${where}: "contact" debe usar el correo reservado @${DEMO_DOMAIN}`)
  }
  checkNoPhoneLike(value, `${where}/contact`)
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function isValidTime(value) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return false
  const [hours, minutes] = value.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

function checkLastVerified(value, where) {
  if (value === null || value === undefined) return
  if (!isValidDate(value)) {
    fail(`${where}: "lastVerified" inválido "${value}" (se espera YYYY-MM-DD o null)`)
  }
}

// ---------------------------------------------------------------- servicios
const services = await readJson('services.json')
if (services) {
  if (!Array.isArray(services)) {
    fail('services.json: la raíz debe ser un arreglo')
  } else {
    if (services.length !== 4) {
      fail(`services.json: el directorio debe contener exactamente 4 servicios (hay ${services.length})`)
    }

    for (const service of services) {
      const where = checkCommon(service, 'services.json', SERVICE_FIELDS)

      if (!SERVICE_CATEGORIES.has(service.category)) {
        fail(`${where}: categoría de servicio desconocida "${service.category}"`)
      }
      checkText(service.name, `${where}/name`)
      checkText(service.description, `${where}/description`)
      checkText(service.targetAudience, `${where}/targetAudience`)
      if (service.location !== null) checkText(service.location, `${where}/location`)
      if (service.notes !== null) checkText(service.notes, `${where}/notes`)

      if (service.isDemo) {
        checkDemoContact(service.contact, where)
        checkDemoUrl(service.sourceUrl, where, 'sourceUrl')
      } else {
        if (typeof service.sourceUrl !== 'string' || !service.sourceUrl.startsWith('https://')) {
          fail(`${where}: sourceUrl de registro real debe ser una fuente oficial (https://...)`)
        }
        if (service.verificationStatus !== 'pendiente') {
          fail(
            `${where}: registro real debe tener verificationStatus "pendiente" (es ${service.verificationStatus})`,
          )
        }
        if (service.lastVerified !== null) {
          fail(`${where}: registro real debe tener lastVerified en null mientras está pendiente de verificación`)
        }
      }

      checkLastVerified(service.lastVerified, where)
      checkNoPhoneLike(service.description, `${where}/description`)
      if (service.description.trim().length < 40) {
        warn(`${where}: descripción demasiado corta para probar búsquedas`)
      }
    }

    const unique = checkUniqueIds(services, 'services.json')
    console.log(`services.json  -> ${services.length} servicios, ${unique} ids únicos`)
  }
}

// --------------------------------------------------------------- actividades
const activities = await readJson('activities.json')
if (activities) {
  if (!Array.isArray(activities)) {
    fail('activities.json: la raíz debe ser un arreglo')
  } else {
    if (activities.length < 15) fail(`activities.json: se requieren al menos 15 actividades (hay ${activities.length})`)

    const now = new Date()
    let past = 0
    let future = 0
    let earliest = null
    let latest = null

    for (const activity of activities) {
      const where = checkCommon(activity, 'activities.json', ACTIVITY_FIELDS)

      if (!ACTIVITY_CATEGORIES.has(activity.category)) {
        fail(`${where}: categoría de actividad desconocida "${activity.category}"`)
      }
      if (!isValidDate(activity.date)) {
        fail(`${where}: fecha inválida "${activity.date}" (se espera YYYY-MM-DD)`)
      }
      if (!isValidTime(activity.time)) {
        fail(`${where}: hora inválida "${activity.time}" (se espera HH:mm)`)
      }
      checkText(activity.title, `${where}/title`)
      checkText(activity.description, `${where}/description`)
      checkText(activity.organizer, `${where}/organizer`)
      if (activity.location !== null) checkText(activity.location, `${where}/location`)
      if (activity.requirements !== null) checkText(activity.requirements, `${where}/requirements`)
      if (activity.notes !== null) checkText(activity.notes, `${where}/notes`)
      checkDemoUrl(activity.sourceUrl, where, 'sourceUrl')
      checkDemoUrl(activity.registrationUrl, where, 'registrationUrl')
      checkLastVerified(activity.lastVerified, where)
      checkNoPhoneLike(activity.description, `${where}/description`)

      if (isValidDate(activity.date)) {
        if (!earliest || activity.date < earliest) earliest = activity.date
        if (!latest || activity.date > latest) latest = activity.date
      }

      if (isValidDate(activity.date) && isValidTime(activity.time)) {
        const start = new Date(`${activity.date}T${activity.time}:00`)
        if (start.getTime() < now.getTime()) past += 1
        else future += 1
      }
    }

    const unique = checkUniqueIds(activities, 'activities.json')
    if (past === 0) {
      warn('activities.json: no hay actividades ya realizadas (la ventana de datos es fija)')
    }
    if (future === 0) {
      warn(
        `activities.json: no hay actividades futuras con la fecha de hoy (la ventana de datos termina en ${latest})`,
      )
    }
    console.log(
      `activities.json -> ${activities.length} actividades, ${unique} ids únicos, ${past} pasadas y ${future} futuras`,
    )
    console.log(`                 ventana de datos: ${earliest} → ${latest}`)
  }
}

// ------------------------------------------------------------------ resumen
for (const warning of warnings) console.warn(`AVISO: ${warning}`)
for (const error of errors) console.error(`ERROR: ${error}`)

if (errors.length > 0) {
  console.error(`\nValidación fallida: ${errors.length} error(es).`)
  process.exit(1)
}

console.log('\nValidación correcta: los datos de demostración cumplen las reglas del proyecto.')
