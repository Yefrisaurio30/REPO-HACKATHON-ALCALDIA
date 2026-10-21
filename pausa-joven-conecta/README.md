# VibraLink · Mente Sana Joven

**«Conecta con lo que te hace bien»**

Prototipo web del reto **«Mente Sana Joven»** de la Hackathon Villavicencio 2026.
VibraLink conecta a jóvenes de Villavicencio con servicios de orientación y con
actividades comunitarias de bienestar, mostrando siempre **de dónde viene cada
dato y cuándo se revisó**.

> ⚠️ **Prototipo con datos ficticios.** Todos los registros son inventados para
> probar la interfaz: no corresponden a instituciones reales, no tienen contactos
> confirmados y los enlaces apuntan al dominio reservado `demo.example`, que
> nunca resuelve.

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
npm test             # pruebas de lógica con node:test (34 pruebas)
npm run validate:data # valida los JSON de demostración (sin dependencias)
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
    services.json     # 20 servicios ficticios
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
- **Sin datos reales.** Los enlaces solo usan `demo.example` (dominio reservado
  por la RFC 2606, nunca resuelve) y los contactos de ejemplo se declaran como
  tales. El validador de datos lo verifica en cada ejecución.

## Accesibilidad y seguridad

- Enlace de salto al contenido, puntos de referencia (`header`, `nav`, `main`,
  `footer`), `aria-current` en la ruta activa y foco visible.
- Etiquetas visibles en todos los controles, `aria-live` en los contadores de
  resultados y errores de formulario con `role="alert"` y `aria-invalid`.
- `prefers-reduced-motion` respetado y contraste verificado (Lighthouse
  Accessibility 1.0 en todas las páginas).
- El formulario de reporte **no envía datos a ningún servidor**, no guarda nada
  en el dispositivo y no solicita información sensible.
- Enlace externo con `target="_blank"` y `rel="noopener noreferrer external"`.

## Alcance (fuera del alcance del prototipo)

VibraLink es una herramienta informativa y comunitaria. **No** hace diagnósticos,
**no** evalúa clínicamente, **no** predice riesgo, **no** prescribe tratamientos y
**no** incluye chatbots que se hagan pasar por profesionales de la salud. Tampoco
recolecta datos de salud mental ni permite probar con público real: las
pruebas del prototipo usan datos sintéticos y escenarios ficticios.
