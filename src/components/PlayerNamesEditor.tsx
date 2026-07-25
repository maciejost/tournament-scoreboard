import type { Players } from '../types'
import { Card } from './Card'
import { TrophyIcon } from './icons'

interface Props {
  players: Players
  onChange: (next: Players) => void
}

const inputClass =
  'w-full rounded-lg border border-gold/30 bg-board-deep/60 px-3 py-2.5 text-lg text-cream outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/40'

export function PlayerNamesEditor({ players, onChange }: Props) {
  return (
    <Card title="Spillere" icon={<TrophyIcon className="size-5" />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Spiller 1"
          value={players.p1}
          fallback="Spiller 1"
          onChange={(v) => onChange({ ...players, p1: v })}
        />
        <Field
          label="Spiller 2"
          value={players.p2}
          fallback="Spiller 2"
          onChange={(v) => onChange({ ...players, p2: v })}
        />
      </div>
    </Card>
  )
}

function Field({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string
  value: string
  fallback: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-widest text-muted uppercase">
        {label}
      </span>
      <input
        className={inputClass}
        value={value}
        maxLength={24}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          if (!e.target.value.trim()) onChange(fallback)
        }}
        placeholder={fallback}
      />
    </label>
  )
}
