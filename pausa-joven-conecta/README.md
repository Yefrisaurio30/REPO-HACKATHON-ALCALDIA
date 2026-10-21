# VibraLink · Mente Sana Joven

Prototipo web para el reto **«Mente Sana Joven»** de la Hackathon Villavicencio 2026.
La aplicación tiene dos módulos:

- **Directorio de servicios** (`src/data/services.json`): búsqueda por nombre y
  descripción, y filtros por categoría y modalidad.
- **Agenda comunitaria** (`src/data/activities.json`): filtros por categoría, mes y
  estado (programadas / finalizadas).

## Datos de demostración

Los archivos `src/data/services.json` y `src/data/activities.json` contienen
**registros ficticios** creados para probar el prototipo. Todos llevan
`"isDemo": true` y `"verificationStatus": "demo"`, no incluyen teléfonos, correos ni
enlaces reales, y la interfaz los muestra con la etiqueta «Dato de demostración».

Para reemplazar los datos de prueba por fuentes verificadas hay que mantener la
misma forma de los registros (tipos en `src/types.ts`) y actualizar
`verificationStatus` e `isDemo` en cada registro.

## Comandos

```bash
npm install          # solo la primera vez
npm run dev          # servidor de desarrollo
npm run build        # comprobación de tipos + build de producción
npm run lint         # oxlint
npm run validate:data # valida los JSON de demostración (sin dependencias)
```

## Estructura

```
src/
  data/
    services.json     # 17 servicios ficticios
    activities.json   # 18 actividades ficticias
    index.ts          # carga los JSON y expone filtros y utilidades
    labels.ts         # etiquetas en español de categorías y modalidades
  components/
    ServiceDirectory.tsx  # buscador + filtros del directorio
    ServiceCard.tsx       # tarjeta de servicio (identificada por su id)
    CommunityAgenda.tsx   # agenda con filtros por categoría, mes y estado
    ActivityCard.tsx      # tarjeta de actividad (identificada por su id)
    DemoBadge.tsx         # etiqueta visible de dato de demostración
  types.ts            # interfaces de los registros
```
