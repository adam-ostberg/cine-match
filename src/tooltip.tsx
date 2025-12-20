import { type ReactNode } from "react"

type TooltipProps = {
  content: ReactNode
  children: ReactNode
}
export function CustomTooltip({ content, children }: TooltipProps) {
  return (
    <span className="tooltip-wrapper">
      {children}
      <span className="tooltip">
        {content}
      </span>
    </span>
  )
}