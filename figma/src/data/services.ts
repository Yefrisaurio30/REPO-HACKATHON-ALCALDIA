import type { Service } from "../types"

export const services: Service[] = [
  {
    id: "yo-te-escucho-villavicencio",
    name: "Yo Te Escucho — Villavicencio",
    description: "Orientación y acompañamiento emocional para la comunidad de Villavicencio.",
    category: "Orientación",
    modality: "Telefónica",
    audience: "Comunidad de Villavicencio",
    contact: "WhatsApp indicado: 316 390 7010 · Línea gratuita indicada: 018000 931 089",
    sourceLabel:
      "Alcaldía de Villavicencio — publicación indicada del 9 de junio de 2026, pendiente de contraste directo",
    consultedAt: "No consultada directamente por VibraLink",
    status: "unverified",
  },
  {
    id: "icbf-linea-141",
    name: "ICBF — Línea 141",
    description: "Línea de protección y orientación para niñas, niños y adolescentes.",
    category: "Protección",
    modality: "Telefónica",
    audience: "Niñas, niños, adolescentes y personas que requieran orientación para su protección",
    contact: "Línea indicada: 141 · Disponibilidad publicada: 24 horas",
    sourceLabel: "Portal oficial del ICBF — información indicada por el usuario, pendiente de contraste directo",
    consultedAt: "No consultada directamente por VibraLink",
    status: "unverified",
  },
  {
    id: "secretaria-salud-villavicencio",
    name: "Secretaría de Salud de Villavicencio",
    description: "Información institucional sobre programas municipales de salud y bienestar.",
    category: "Información",
    modality: "Virtual",
    audience: "Comunidad de Villavicencio",
    contact: "Consulta el directorio institucional oficial para confirmar los canales vigentes.",
    sourceLabel: "Portal de la Alcaldía de Villavicencio — pendiente de consulta directa del directorio",
    consultedAt: "No consultada directamente por VibraLink",
    status: "unverified",
  },
  {
    id: "servicios-amigables-salud",
    name: "Servicios Amigables en Salud",
    description: "Orientación para jóvenes sobre bienestar y salud integral.",
    category: "Bienestar",
    modality: "Presencial",
    audience: "Adolescentes y jóvenes",
    contact: "Ubicación publicada anteriormente: Centro de Salud Popular, Villavicencio",
    sourceLabel:
      "Información municipal sobre el programa — continuidad del servicio y ubicación pendientes de confirmación",
    consultedAt: "No consultada directamente por VibraLink",
    status: "unverified",
  },
]
