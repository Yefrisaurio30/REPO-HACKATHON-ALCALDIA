/**
 * Valida los datos de demostración de VibraLink.
 * Uso: npm run validate:data
 *
 * No requiere dependencias externas: solo usa Node.js.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'src', 'data')

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
  'sourceUrl',
  'registrationUrl',
  'verificationStatus',
  'isDemo',
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
  if (record.verificationStatus !== 'demo') {
    fail(`${where}: verificationStatus debe ser "demo" (es ${record.verificationStatus})`)
  }
  if (record.isDemo !== true) {
    fail(`${where}: isDemo debe ser true (es ${record.isDemo})`)
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

function checkNoRealContacts(record, where) {
  for (const field of ['contact', 'sourceUrl', 'registrationUrl']) {
    if (field in record && record[field] !== null) {
      fail(`${where}: "${field}" debe ser null en datos de demostración (es ${JSON.stringify(record[field])})`)
    }
  }
  if (record.contact !== null && record.contact !== undefined) {
    if (/\d{3}/.test(String(record.contact))) {
      fail(`${where}: "contact" parece un teléfono real`)
    }
  }
  if (record.sourceUrl !== null && record.sourceUrl !== undefined) {
    fail(`${where}: "sourceUrl" debe ser null en datos de demostración`)
  }
  if ('registrationUrl' in record && record.registrationUrl !== null) {
    fail(`${where}: "registrationUrl" debe ser null en datos de demostración`)
  }
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

// ---------------------------------------------------------------- servicios
const services = await readJson('services.json')
if (services) {
  if (!Array.isArray(services)) {
    fail('services.json: la raíz debe ser un arreglo')
  } else {
    if (services.length < 12) fail(`services.json: se requieren al menos 12 servicios (hay ${services.length})`)

    for (const service of services) {
      const where = checkCommon(service, 'services.json', SERVICE_FIELDS)
      checkNoRealContacts(service, where)

      if (!SERVICE_CATEGORIES.has(service.category)) {
        fail(`${where}: categoría de servicio desconocida "${service.category}"`)
      }
      checkText(service.name, `${where}/name`)
      checkText(service.description, `${where}/description`)
      checkText(service.targetAudience, `${where}/targetAudience`)
      if (service.location !== null) checkText(service.location, `${where}/location`)
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

    for (const activity of activities) {
      const where = checkCommon(activity, 'activities.json', ACTIVITY_FIELDS)
      checkNoRealContacts(activity, where)

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

      if (isValidDate(activity.date) && isValidTime(activity.time)) {
        const start = new Date(`${activity.date}T${activity.time}:00`)
        if (start.getTime() < now.getTime()) past += 1
        else future += 1
      }
    }

    const unique = checkUniqueIds(activities, 'activities.json')
    if (past === 0) fail('activities.json: se requiere al menos una actividad pasada')
    if (future === 0) fail('activities.json: se requiere al menos una actividad futura')
    console.log(
      `activities.json -> ${activities.length} actividades, ${unique} ids únicos, ${past} pasadas y ${future} futuras`,
    )
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
