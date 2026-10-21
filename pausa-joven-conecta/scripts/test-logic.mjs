/**
 * Pruebas de la lógica de VibraLink.
 * Uso: npm test
 *
 * No requiere dependencias externas: usa el runner integrado de Node
 * (`node:test`) y el eliminación de tipos de Node 22 para importar los
 * módulos de TypeScript directamente.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import {
  activityStart,
  filterActivities,
  filterServices,
  formatLongDate,
  formatMediumDate,
  formatMonth,
  formatTime,
  isPastActivity,
  normalizeText,
} from '../src/data/filters.ts'
import {
  activityPath,
  normalizePath,
  parseRoute,
  servicePath,
} from '../src/router/routes.ts'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'src', 'data')

const services = JSON.parse(await readFile(join(dataDir, 'services.json'), 'utf8'))
const activities = JSON.parse(await readFile(join(dataDir, 'activities.json'), 'utf8'))

/** Fecha de referencia fija para que las pruebas sean deterministas. */
const NOW = new Date('2026-10-21T12:00:00')

// ------------------------------------------------------------------ búsqueda

test('normalizeText quita tildes y unifica mayúsculas', () => {
  assert.equal(normalizeText('Atención'), 'atencion')
  assert.equal(normalizeText('MÚSICA'), 'musica')
  assert.equal(normalizeText('  Salud  Mental '), '  salud  mental ')
})

test('la búsqueda de servicios encuentra coincidencias por nombre', () => {
  const results = filterServices(services, { query: 'biblioteca' })
  assert.ok(results.length > 0, 'debe encontrar al menos un servicio')
  assert.ok(results.every((item) => /biblioteca/i.test(item.name)))
})

test('la búsqueda de servicios encuentra coincidencias por descripción', () => {
  const results = filterServices(services, { query: 'tutores' })
  assert.ok(results.length > 0, 'debe encontrar al menos un servicio por la descripción')
})

test('la búsqueda ignora tildes y mayúsculas', () => {
  const conTilde = filterServices(services, { query: 'atención' }).map((item) => item.id)
  const sinTilde = filterServices(services, { query: 'atencion' }).map((item) => item.id)
  assert.deepEqual(conTilde, sinTilde)
})

test('la búsqueda acepta el comienzo de una palabra', () => {
  const results = filterServices(services, { query: 'deporte' })
  assert.ok(results.length > 0, 'debe encontrar la sede deportiva por el comienzo de palabra')
  assert.ok(results.some((item) => /deportiva/i.test(item.name)))
})

test('la búsqueda con varias palabras exige que todas coincidan', () => {
  const resultados = filterServices(services, { query: 'deporte joven' })
  assert.ok(resultados.length > 0)
  assert.ok(resultados.every((item) => /deport/i.test(item.name + item.description + item.targetAudience)))
})

test('una búsqueda sin coincidencias devuelve una lista vacía', () => {
  const results = filterServices(services, { query: 'zzzz-no-existe-zzz' })
  assert.equal(results.length, 0)
})

// ------------------------------------------------------------------- filtros

test('el filtro por categoría reduce los resultados y mantiene la categoría', () => {
  const all = filterServices(services)
  const results = filterServices(services, { category: 'orientacion' })
  assert.ok(results.length > 0)
  assert.ok(results.length < all.length)
  assert.ok(results.every((item) => item.category === 'orientacion'))
})

test('el filtro por modalidad reduce los resultados y mantiene la modalidad', () => {
  const results = filterServices(services, { modality: 'virtual' })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => item.modality === 'virtual'))
})

test('los filtros de categoría y modalidad se combinan', () => {
  const results = filterServices(services, { category: 'orientacion', modality: 'presencial' })
  assert.ok(results.every((item) => item.category === 'orientacion' && item.modality === 'presencial'))
})

test('sin filtros se obtienen todos los servicios', () => {
  assert.equal(filterServices(services).length, services.length)
})

// ------------------------------------------------------------------- agenda

test('la agenda de actividades encuentra coincidencias por nombre', () => {
  const results = filterActivities(activities, { query: 'yoga' })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => item.title.toLowerCase().includes('yoga')))
})

test('la búsqueda de actividades también revisa el organizador', () => {
  const results = filterActivities(activities, { query: 'comunidad deportiva' })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => item.organizer.toLowerCase().includes('comunidad deportiva')))
})

test('el filtro de actividades_programadas excluye las ya realizadas', () => {
  const results = filterActivities(activities, { status: 'proximas', now: NOW })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => !isPastActivity(item, NOW)))
})

test('el filtro de actividades finalizadas solo muestra las ya realizadas', () => {
  const results = filterActivities(activities, { status: 'finalizadas', now: NOW })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => isPastActivity(item, NOW)))
})

test('las actividades finalizadas y las upcoming son disjuntas y cubren el total', () => {
  const proximas = filterActivities(activities, { status: 'proximas', now: NOW })
  const finalizadas = filterActivities(activities, { status: 'finalizadas', now: NOW })
  const ids = new Set([...proximas, ...finalizadas].map((item) => item.id))
  assert.equal(ids.size, activities.length)
})

test('la agenda ordena las actividades por fecha y hora', () => {
  const results = filterActivities(activities, { now: NOW })
  for (let index = 1; index < results.length; index += 1) {
    const previous = activityStart(results[index - 1]).getTime()
    const current = activityStart(results[index]).getTime()
    assert.ok(previous <= current, 'la lista debe estar en orden cronológico')
  }
})

test('el filtro por mes solo devuelve actividades de ese mes', () => {
  const results = filterActivities(activities, { month: '2026-11', now: NOW })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => item.date.startsWith('2026-11')))
})

test('el filtro por categoría de actividad reduce los resultados', () => {
  const results = filterActivities(activities, { category: 'deporte', now: NOW })
  assert.ok(results.length > 0)
  assert.ok(results.every((item) => item.category === 'deporte'))
})

test('una combinación de filtros sin coincidencias devuelve una lista vacía', () => {
  const results = filterActivities(activities, {
    category: 'deporte',
    month: '2026-08',
    now: NOW,
  })
  assert.equal(results.length, 0)
})

test('isPastActivity distingue pasado y futuro en el límite de la fecha', () => {
  const pasado = { date: '2026-10-21', time: '09:00' }
  const futuro = { date: '2026-10-21', time: '13:00' }
  assert.equal(isPastActivity(pasado, NOW), true)
  assert.equal(isPastActivity(futuro, NOW), false)
})

// ------------------------------------------------------------------- formato

test('formatTime convierte la hora de 24 h a 12 h en español', () => {
  assert.equal(formatTime('15:00'), '3:00 p. m.')
  assert.equal(formatTime('06:30'), '6:30 a. m.')
  assert.equal(formatTime('12:00'), '12:00 p. m.')
  assert.equal(formatTime('00:05'), '12:05 a. m.')
})

test('formatLongDate y formatMediumDate incluyen el año', () => {
  assert.match(formatLongDate('2026-11-14'), /2026/)
  assert.match(formatMediumDate('2026-11-14'), /2026/)
  assert.match(formatMonth('2026-11'), /noviembre/i)
})

// ------------------------------------------------------------------- rutas

test('parseRoute reconoce cada sección de la aplicación', () => {
  assert.equal(parseRoute('/').name, 'inicio')
  assert.equal(parseRoute('/servicios').name, 'servicios')
  assert.equal(parseRoute('/actividades').name, 'actividades')
  assert.equal(parseRoute('/transparencia').name, 'transparencia')
  assert.equal(parseRoute('/ruta-inexistente').name, 'no-encontrado')
})

test('parseRoute extrae el identificador de las rutas de detalle', () => {
  const service = parseRoute('/servicios/service-demo-001')
  assert.equal(service.name, 'servicio-detalle')
  assert.equal(service.id, 'service-demo-001')

  const activity = parseRoute('/actividades/activity-demo-001')
  assert.equal(activity.name, 'actividad-detalle')
  assert.equal(activity.id, 'activity-demo-001')
})

test('normalizePath unifica barras finales e iniciales', () => {
  assert.equal(normalizePath('servicios'), '/servicios')
  assert.equal(normalizePath('/servicios/'), '/servicios')
  assert.equal(normalizePath('/'), '/')
})

test('cada servicio genera una ruta interna que vuelve a interpretarse', () => {
  for (const service of services) {
    const path = servicePath(service.id)
    const match = parseRoute(path)
    assert.equal(match.name, 'servicio-detalle')
    assert.equal(match.id, service.id)
  }
})

test('cada actividad genera una ruta interna que vuelve a interpretarse', () => {
  for (const activity of activities) {
    const path = activityPath(activity.id)
    const match = parseRoute(path)
    assert.equal(match.name, 'actividad-detalle')
    assert.equal(match.id, activity.id)
  }
})

// ------------------------------------------------------------ integridad datos

test('los identificadores de los registros son únicos', () => {
  const ids = services.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)

  const activityIds = activities.map((item) => item.id)
  assert.equal(new Set(activityIds).size, activityIds.length)
})

test('los registros ficticios y los reales cumplen sus reglas de verificación', () => {
  for (const service of services) {
    if (service.isDemo) {
      assert.notEqual(service.verificationStatus, 'verificado')
      continue
    }
    // Registro real: sin fecha de consulta no puede publicarse como vigente.
    assert.ok(
      ['pendiente', 'verificado'].includes(service.verificationStatus),
      `${service.id}: un registro real debe ser pendiente o verificado`,
    )
    if (service.verificationStatus === 'verificado') {
      assert.match(
        service.lastVerified ?? '',
        /^\d{4}-\d{2}-\d{2}$/,
        `${service.id}: "verificado" exige fecha de consulta en lastVerified`,
      )
    }
    assert.ok(
      service.notes && service.notes.trim().length > 0,
      `${service.id}: un registro real debe declarar sus notas de verificación`,
    )
  }
  for (const activity of activities) {
    assert.equal(activity.isDemo, true, `${activity.id} debe ser isDemo`)
    assert.notEqual(activity.verificationStatus, 'verificado')
  }
})

test('los enlaces ficticios solo usan demo.example y los reales una fuente oficial', () => {
  const demoUrls = [
    ...services.filter((item) => item.isDemo).map((item) => item.sourceUrl),
    ...activities.filter((item) => item.isDemo).map((item) => item.sourceUrl),
    ...activities.filter((item) => item.isDemo).map((item) => item.registrationUrl),
  ].filter(Boolean)

  assert.ok(demoUrls.length > 0)
  for (const url of demoUrls) {
    assert.ok(url.startsWith('https://demo.example/'), `URL de demo no permitida: ${url}`)
  }

  const realUrls = services.filter((item) => !item.isDemo).map((item) => item.sourceUrl)
  for (const url of realUrls) {
    assert.ok(url, 'un registro real debe declarar su fuente')
    assert.ok(url.startsWith('https://'), `Fuente real sin https: ${url}`)
    assert.ok(!url.includes('demo.example'), `Fuente real apunta al dominio de demo: ${url}`)
  }
})

test('los registros ficticios no contienen teléfonos ni contactos reales', () => {
  for (const service of services) {
    if (!service.isDemo || !service.contact) continue
    assert.match(service.contact.toLowerCase(), /ejemplo/)
    assert.ok(
      !/\d{3}[\s-]?\d{3}[\s-]?\d{4}/.test(service.contact),
      `${service.id}: el contacto ficticio no puede contener un teléfono`,
    )
  }
})

test('cada registro tiene la fecha de consulta o deja constancia de que no la tiene', () => {
  for (const service of services) {
    if (service.lastVerified !== null) {
      assert.match(service.lastVerified, /^\d{4}-\d{2}-\d{2}$/)
    }
  }
  for (const activity of activities) {
    if (activity.lastVerified !== null) {
      assert.match(activity.lastVerified, /^\d{4}-\d{2}-\d{2}$/)
    }
  }
})

// ---------------------------------------------------------------- registro real

test('el registro real de Yo Te Escucho declara sus datos sin afirmar vigencia', () => {
  const real = services.find((item) => item.id === 'yo-te-escucho-villavicencio')
  assert.ok(real, 'debe existir el registro real')
  assert.equal(real.isDemo, false, 'el registro real no es de demostración')
  assert.equal(real.verificationStatus, 'pendiente', 'sin fecha de consulta debe quedar pendiente')
  assert.equal(real.lastVerified, null, 'sin fecha de consulta no hay fecha publicada')
  assert.ok(real.notes && real.notes.trim().length > 0, 'debe declarar notas de verificación')
  assert.ok(real.sourceUrl && real.sourceUrl.startsWith('https://'), 'debe tener fuente oficial')
  assert.ok(real.supportRoute && real.supportRoute.length > 0, 'debe tener ruta de soporte')
  assert.equal(real.contactStructured?.phone, '018000931089')
  assert.equal(real.contactStructured?.whatsapp, '+573163907010')
})

test('el conjunto de datos cubre actividades pasadas y futuras', () => {
  const past = activities.filter((item) => isPastActivity(item, NOW))
  const future = activities.filter((item) => !isPastActivity(item, NOW))
  assert.ok(past.length > 0, 'debe haber actividades finalizadas')
  assert.ok(future.length > 0, 'debe haber actividades programadas')
})
