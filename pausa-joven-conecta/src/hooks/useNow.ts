import { useEffect, useState } from 'react'

/**
 * Reloj de referencia para saber qué actividades ya pasaron.
 * Se actualiza cada minuto para que la agenda no quede desactualizada.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
