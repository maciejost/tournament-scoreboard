import type { ReactNode } from 'react'

interface CardProps {
  title: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

/** Shared panel used across the admin controls. */
export function Card({ title, icon, action, children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-gold/30 bg-panel/70 board-grain p-5 shadow-lg backdrop-blur-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-gold/20 pb-3">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold tracking-[0.2em] text-accent uppercase">
          {icon}
          <span>{title}</span>
        </h3>
        {action}
      </div>
      {children}
    </section>
  )
}
