# VibraLink · Mente Sana Joven

**«Conecta con lo que te hace bien»**

Prototipo web del reto **«Mente Sana Joven»** de la Hackathon Villavicencio 2026.
VibraLink conecta a jóvenes de Villavicencio con servicios de orientación y con
actividades comunitarias de bienestar, mostrando siempre **de dónde viene cada
dato y cuándo se revisó**.

> ⚠️ **Datos mixtos, siempre etiquetados.** El directorio carga **20 servicios
> ficticios** para probar la interfaz (contactos de ejemplo y enlaces al dominio
> reservado `demo.example`, que nunca resuelve) y **1 registro real** —«Yo Te
> Escucho» de Villavicencio— con estado **«Pendiente de verificación»** y
> `lastVerified: null`: ningún teléfono se publica como vigente sin fuente
> oficial y fecha de consulta.

## Qué incluye

| Pantalla | Ruta | Qué hace |
| --- | --- | --- |
| Inicio | `#/` | Hero con el eslogan, buscador general, tarjetas de acceso, actividades destacadas, servicios destacados y explicación de la verificación. |
| Directorio de servicios | `#/servicios` | Buscador por nombre y descripción + filtros por categoría y modalidad. |
| Detalle de servicio | `#/servicios/:id` | Ficha completa: descripción, modalidad, público, contacto, fuente, fecha de consulta y estado de verificación. |
| Agenda comunitaria | `#/actividades` | Buscador por nombre + filtros por categoría, mes y estado (próximas / finalizadas). |
| Detalle de actividad | `#/actividades/:id` | Descripción, fecha y hora, lugar, organizador, requisitos, fuente e inscripción. |
| Transparencia | `#/transparencia` | Cómo se recopila y verifica la información, qué significa cada etiqueta y formulario de reporte. |
| No encontrado | cualquier otra | Ruta inexistente con enlaces de vuelta. |

## Comandos

```bash
npm install          # solo la primera vez
npm run dev          # servidor de desarrollo (http://localhost:5173)
npm run build        # comprobación de tipos + build de producción
npm run preview      # sirve el build de producción
npm run lint         # oxlint
npm test             # pruebas de lógica con node:test (35 pruebas)
npm run validate:data # valida los JSON del proyecto (sin dependencias)
```

## Estructura

```
src/
  components/         # piezas reutilizables
    Navbar.tsx        # logotipo, menú, CTA de actividades y menú móvil
    Footer.tsx        # pie con alcance y enlaces
    SearchBar.tsx     # campo de búsqueda con etiqueta y botón de limpiar
    FilterBar.tsx     # filtros por `select` y acción "limpiar"
    ServiceCard.tsx   # tarjeta de servicio
    ActivityCard.tsx  # tarjeta de actividad
    VerificationBadge.tsx # estado de verificación (demo / pendiente / verificado)
    DemoBadge.tsx     # etiqueta "datos ficticios"
    Callout.tsx       # avisos (datos ficticios, contacto sin verificar, etc.)
    EmptyState.tsx    # mensaje de resultados vacíos
    SourceLink.tsx    # enlace externo con `rel="noopener noreferrer"`
    PageHeader.tsx    # encabezado de página
    Icon.tsx          # set de iconos SVG en línea (sin librerías)
  pages/              # una página por ruta
    Home.tsx  Services.tsx  ServiceDetail.tsx
    Activities.tsx  ActivityDetail.tsx  Transparency.tsx  NotFound.tsx
  router/             # enrutado por hash (sin dependencias)
    routes.ts         # rutas puras y `parseRoute`
    context.ts        # contexto de navegación
    hooks.ts          # `useRouter`, `useRouteMatch`, `useIsActive`
    index.tsx         # `RouterProvider` y `Link`
  data/
    services.json     # 20 servicios ficticios + 1 real pendiente (Yo Te Escucho)
    activities.json   # 32 actividades ficticias (ago 2026 → dic 2027)
    filters.ts        # lógica pura de búsqueda, filtros y formato
    index.ts          # carga los JSON y expone los filtros
    labels.ts         # etiquetas en español
  hooks/useNow.ts     # reloj de referencia para marcar actividades vencidas
  styles/
    components.css    # componentes reutilizables
    pages.css         # estilos por página
  types/index.ts      # interfaces de los registros
  index.css           # tokens de diseño, base y utilidades
scripts/
  validate-data.mjs   # reglas de seguridad de los datos de demostración
  test-logic.mjs      # pruebas automatizadas de la lógica
```

## Decisiones técnicas

- **Sin dependencias nuevas.** El proyecto conserva `react`, `react-dom` y las
  herramientas de desarrollo que ya tenía. El enrutado se resuelve con un
  router por hash propio (`src/router/`), por lo que no hace falta instalar
  `react-router` ni ejecutar scripts de instalación de terceros.
- **Enlaces internos reales.** Todas las rutas son `<a href="#/ruta">`: funcionan
  con teclado, con «copiar enlace» y con el historial del navegador.
- **Búsqueda flexible.** La búsqueda ignora tildes y mayúsculas, revisa nombre,
  descripción y público/organizador, y acepta el comienzo de una palabra
  («deporte» encuentra «Sede Deportiva»).
- **Honestidad del dato.** Si falta información, la interfaz lo dice
  («Sin fecha registrada», «Sin fuente registrada», «Todavía no hay un contacto
  confirmado») en vez de inventarla.
- **Reglas distintas para datos ficticios y reales.** Los registros ficticios
  usan contactos de ejemplo y solo el dominio `demo.example` (dominio reservado
  por la RFC 2606, nunca resuelve). Los registros reales exigen fuente oficial
  `https://`, notas de verificación y estado `pendiente`, salvo que exista fecha
  de consulta: `npm run validate:data` aplica un juego de reglas distinto a
  cada tipo de registro en cada ejecución.

## Accesibilidad y seguridad

- Enlace de salto al contenido, puntos de referencia (`header`, `nav`, `main`,
  `footer`), `aria-current` en la ruta activa y foco visible.
- Etiquetas visibles en todos los controles, `aria-live` en los contadores de
  resultados y errores de formulario con `role="alert"` y `aria-invalid`.
- `prefers-reduced-motion` respetado y contraste verificado (Lighthouse
  Accessibility **0.96** / 96 en la página principal de la build de producción;
  reproducible con `npx lighthouse http://localhost:4173 --only-categories=accessibility`).
- El formulario de reporte **no envía datos a ningún servidor**, no guarda nada
  en el dispositivo y no solicita información sensible.
- Enlace externo con `target="_blank"` y `rel="noopener noreferrer external"`.

## Evidencia de pruebas y estado TRL 4

| Caso de prueba | Qué usa | Resultado |
| --- | --- | --- |
| `npm run build` | código completo | ✔ `tsc` sin errores + build de producción de Vite |
| `npm run lint` | código completo | ✔ oxlint sin errores |
| `npm test` | 21 servicios y 32 actividades | ✔ 35/35 pruebas (búsqueda, filtros, formato, rutas, integridad, registro real) |
| `npm run validate:data` | ambos JSON | ✔ reglas de datos ficticios y de datos reales |

- **Datos usados:** sintéticos (20 servicios y 32 actividades ficticios) más un
  registro real pendiente sin fecha de consulta. No se usó información de salud
  de personas reales ni se probó con público.
- **Funciones críticas integradas y funcionando en entorno controlado:**
  búsqueda con filtros, ficha de detalle con contacto, estados de verificación
  y formulario de reporte.
- **Limitaciones conocidas:** sin pruebas con usuarios reales (TRL 5 fuera del
  alcance del reto); el formulario de reporte no envía datos a servidores; la
  verificación de fuentes es manual y el registro real todavía no tiene fecha
  de consulta; la ventana de actividades es fija (ago 2026 → dic 2027).

## Evidencia de necesidad y preguntas de usuario

- **Problema delimitado:** jóvenes de 18 a 28 años en Villavicencio que necesitan
  orientación en salud mental, bienestar o apoyo, pero sin una ruta clara de
  acceso a los servicios de orientación disponibles.
- **Usuario principal:** el joven que hoy describe y busca su propia ayuda por
  redes sociales, familia, amigos o buscadores; sin un punto de entrada único.
- **Preguntas de exploración:** el equipo planteó preguntas para entender cómo
  se busca información hoy, antes de definir cómo la solución debe facilitarla
  (no se sustituye evaluación clínica ni se generan datos).

## Plan de operación

- **Quién verifica:** responsable designado de revisión de fuentes.
- **Frecuencia:** revisión inicial documentada al cierre del desarrollo y refresco
  periódico de fuentes para la versión operativa.
- **Reporte y actualización:** el formulario de la página de Transparencia
  registra el alerta → responsable re-verifica la fuente → se actualiza el
  registro conservando la trazabilidad (fecha de última consulta).
- **Fuentes inactivas:** un teléfono o ruta reportado queda actualizado como
  «pendiente» en lugar de seguirse mostrando como vigente.

## Trabajo previo y licencias

- **Trabajo previo:** todo el código (router propio, componentes, estilos,
  scripts y datos) se escribió para este proyecto; no se copió código de otros
  repositorios ni se usó una plantilla de UI.
- **Dependencias de terceros** (fijadas en `package-lock.json`): react y
  react-dom (MIT), typescript (Apache-2.0), vite y @vitejs/plugin-react (MIT),
  oxlint (MIT) y @types/* (MIT). No hay dependencias nuevas en tiempo de
  ejecución.
- **Sin credenciales:** no hay llaves API, contraseñas ni datos personales en
  el repositorio ni en la presentación.
- **Datos:** el registro real proviene de una publicación oficial de la
  Alcaldía de Villavicencio (ver `sourceUrl` en `src/data/services.json`).

## Alcance (fuera del alcance del prototipo)

VibraLink es una herramienta informativa y comunitaria. **No** hace diagnósticos,
**no** evalúa clínicamente, **no** predice riesgo, **no** prescribe tratamientos y
**no** incluye chatbots que se hagan pasar por profesionales de la salud. Tampoco
recolecta datos de salud mental ni permite probar con público real: las
pruebas del prototipo usan datos sintéticos y escenarios ficticios. El único
registro real se usa para mostrar cómo se publica un dato **no verificado**,
sin afirmar su vigencia.
