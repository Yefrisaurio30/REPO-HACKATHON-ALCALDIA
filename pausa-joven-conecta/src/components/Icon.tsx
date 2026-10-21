import type { ReactNode } from 'react'

export type IconName =
  | 'search'
  | 'calendar'
  | 'clock'
  | 'pin'
  | 'users'
  | 'heart'
  | 'sparkles'
  | 'arrow-right'
  | 'check'
  | 'shield'
  | 'clipboard'
  | 'external'
  | 'info'
  | 'menu'
  | 'close'
  | 'phone'
  | 'mail'
  | 'flag'
  | 'ticket'
  | 'filter'
  | 'book'
  | 'compass'

const PATHS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <line x1="8" y1="3" x2="8" y2="8" />
      <line x1="16" y1="3" x2="16" y2="8" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  users: (
    <>
      <path d="M16 19v-1.4a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V19" />
      <circle cx="9.5" cy="7" r="3.2" />
      <path d="M17 4.2a3.2 3.2 0 0 1 0 6.2" />
      <path d="M21 19v-1.4a4 4 0 0 0-3-3.8" />
    </>
  ),
  heart: (
    <path d="M12 20.2s-7.2-4.4-7.2-9.4A4.2 4.2 0 0 1 12 7.9a4.2 4.2 0 0 1 7.2 2.9c0 5-7.2 9.4-7.2 9.4z" />
  ),
  sparkles: (
    <>
      <path d="M12 3.5l1.7 4.4 4.4 1.7-4.4 1.7L12 15.7l-1.7-4.4L5.9 9.6l4.4-1.7L12 3.5z" />
      <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </>
  ),
  'arrow-right': (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </>
  ),
  check: <polyline points="4 12.5 9.5 18 20 6.5" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.3-3 7.7-7 9-4-1.3-7-4.7-7-9V6l7-3z" />
      <polyline points="9 12 11.2 14.2 15.2 10.2" />
    </>
  ),
  clipboard: (
    <>
      <rect x="9" y="3" width="6" height="3.5" rx="1" />
      <path d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H15" />
      <polyline points="9 12 11 14 15 9.5" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-8.5 8.5" />
      <path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <line x1="12" y1="7.6" x2="12" y2="7.6" />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  phone: (
    <path d="M6.4 3h3.1l1.5 3.9-2 1.5a12.2 12.2 0 0 0 6.6 6.6l1.5-2 3.9 1.5v3.1a2.4 2.4 0 0 1-2.6 2.4A16.6 16.6 0 0 1 4 6.6 2.4 2.4 0 0 1 6.4 3z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <polyline points="3.8 7 12 13 20.2 7" />
    </>
  ),
  flag: (
    <>
      <line x1="5" y1="21" x2="5" y2="4" />
      <path d="M5 4.6h11.5l-1.6 3.7 1.6 3.7H5" />
    </>
  ),
  ticket: (
    <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V10a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15.5V14a2 2 0 0 0 0-4V8.5z" />
  ),
  filter: (
    <>
      <line x1="4" y1="6.5" x2="20" y2="6.5" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5z" />
      <line x1="4" y1="20.5" x2="19" y2="20.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
}

type IconProps = {
  name: IconName
  size?: number
  className?: string
  /** Texto alternativo. Si se omite, el icono se marca como decorativo. */
  title?: string
}

/** Set de iconos en línea (SVG). No requiere dependencias externas. */
export default function Icon({ name, size = 20, className, title }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  )
}
