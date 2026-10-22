import { formatMonth, isValidActivityDate } from '../data'
import type { Activity } from '../types'
import Icon from './Icon'

const WEEKDAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

type ActivityCalendarProps = {
  /** Mes visible en el calendario, en formato YYYY-MM. */
  month: string
  /** Actividades del mes que cumplen los filtros actuales. */
  activities: Activity[]
  /** Fecha seleccionada (YYYY-MM-DD) o `null` cuando no hay día elegido. */
  selectedDate: string | null
  /** Cambia el mes visible en el calendario. */
  onMonthChange: (month: string) => void
  /** Selecciona una fecha del calendario. */
  onSelectDate: (date: string) => void
}

/** Separa el mes visible (`YYYY-MM`) en año y mes (0-11, indexados). */
function parseCalendarMonth(month: string): { year: number; monthIndex: number } {
  const [year, monthNumber] = month.split('-').map(Number)
  const parsedYear = Number.isFinite(year) && year > 0 ? year : new Date().getFullYear()
  const parsedMonth = Number.isFinite(monthNumber) && monthNumber > 0 ? monthNumber : 1
  return { year: parsedYear, monthIndex: parsedMonth - 1 }
}

/** Convierte un `Date` local en la clave `YYYY-MM-DD` usada por los datos. */
function toCalendarKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Avanza o retrocede un mes en formato `YYYY-MM`. */
function shiftCalendarMonth(month: string, delta: number): string {
  const { year, monthIndex } = parseCalendarMonth(month)
  const shifted = new Date(year, monthIndex + delta, 1)
  const shiftedMonth = String(shifted.getMonth() + 1).padStart(2, '0')
  return `${shifted.getFullYear()}-${shiftedMonth}`
}

/** Construye las semanas del mes visible, empezando en lunes. */
function buildCalendarWeeks(year: number, monthIndex: number): Array<Array<Date | null>> {
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingBlanks = (firstDay.getDay() + 6) % 7

  const weeks: Array<Array<Date | null>> = []
  let week: Array<Date | null> = []
  const pushCell = (value: Date | null) => {
    week.push(value)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  for (let index = 0; index < leadingBlanks; index += 1) {
    pushCell(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    pushCell(new Date(year, monthIndex, day))
  }
  if (week.length > 0) {
    weeks.push(week)
  }

  return weeks
}

/** Fechas del mes (claves `YYYY-MM-DD`) que tienen actividades visibles. */
function datesWithActivities(activities: Activity[]): Set<string> {
  const keys = new Set<string>()
  for (const activity of activities) {
    if (!isValidActivityDate(activity)) continue
    keys.add(activity.date)
  }
  return keys
}

/** Etiqueta legible del día para el botón del calendario. */
function formatCalendarDay(date: Date): string {
  const label = date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Calendario mensual de actividades de la agenda. */
export default function ActivityCalendar({
  month,
  activities,
  selectedDate,
  onMonthChange,
  onSelectDate,
}: ActivityCalendarProps) {
  const { year, monthIndex } = parseCalendarMonth(month)
  const weeks = buildCalendarWeeks(year, monthIndex)
  const activeDates = datesWithActivities(activities)
  const today = new Date()

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="btn btn-secondary calendar-nav"
          onClick={() => onMonthChange(shiftCalendarMonth(month, -1))}
          aria-label="Ver el mes anterior"
        >
          <Icon name="chevron-left" size={18} />
        </button>
        <h2 className="calendar-title">{formatMonth(month)}</h2>
        <button
          type="button"
          className="btn btn-secondary calendar-nav"
          onClick={() => onMonthChange(shiftCalendarMonth(month, 1))}
          aria-label="Ver el mes siguiente"
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((weekday) => (
              <th key={weekday} scope="col" className="calendar-weekday">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date, cellIndex) => {
                if (!date) {
                  return <td key={cellIndex} className="calendar-cell-empty" aria-hidden="true" />;
                }

                const key = toCalendarKey(date);
                const isActive = activeDates.has(key);
                const isSelected = selectedDate === key;
                const isToday =
                  date.getFullYear() === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate();
                const dayLabel = formatCalendarDay(date);
                const dayAriaLabel = isSelected
                  ? `Día seleccionado: ${dayLabel}`
                  : isActive
                    ? `Día ${dayLabel} con actividades`
                    : isToday
                      ? `Día de hoy: ${dayLabel}`
                      : `Día ${dayLabel}`;

                return (
                  <td key={cellIndex} className="calendar-cell">
                    <button
                      type="button"
                      className={`calendar-day${isActive ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                      onClick={() => onSelectDate(key)}
                      aria-pressed={isSelected}
                      aria-label={dayAriaLabel}
                    >
                      {date.getDate()}
                      {isActive ? <span className="calendar-indicator" aria-hidden="true" /> : null}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
