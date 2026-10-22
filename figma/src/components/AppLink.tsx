import type { MouseEvent, ReactNode } from "react"
import type { Navigate } from "../App"

export default function AppLink({
  children,
  className,
  navigate,
  to,
}: {
  children: ReactNode
  className?: string
  navigate: Navigate
  to: string
}) {
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      event.button === 0
    ) {
      event.preventDefault()
      navigate(to)
    }
  }
  return (
    <a className={className} href={to} onClick={follow}>
      {children}
    </a>
  )
}
