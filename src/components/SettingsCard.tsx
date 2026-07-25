import { Card } from './Card'
import { GearIcon, TrashIcon } from './icons'

interface Props {
  tournamentName: string
  matchCount: number
  onRename: (name: string) => void
  onClearHistory: () => void
  onResetAll: () => void
}

const inputClass =
  'w-full rounded-lg border border-gold/30 bg-board-deep/60 px-3 py-2.5 text-lg text-cream outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/40'

export function SettingsCard({
  tournamentName,
  matchCount,
  onRename,
  onClearHistory,
  onResetAll,
}: Props) {
  return (
    <Card title="Turnering" icon={<GearIcon className="size-5" />}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold tracking-widest text-muted uppercase">
          Turneringsnavn
        </span>
        <input
          className={inputClass}
          value={tournamentName}
          maxLength={40}
          placeholder="The Masters"
          onChange={(e) => onRename(e.target.value)}
          onBlur={(e) => {
            if (!e.target.value.trim()) onRename('The Masters')
          }}
        />
      </label>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={matchCount === 0}
          onClick={() => {
            if (window.confirm('Tømme alle registrerte resultater? Spillere og spill beholdes.')) {
              onClearHistory()
            }
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold/40 px-3 py-2.5 font-semibold text-cream transition hover:border-accent hover:text-accent disabled:opacity-40"
        >
          <TrashIcon className="size-5" /> Tøm resultater
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Nullstille alt til standard? Dette sletter spillere, spill og resultater.')) {
              onResetAll()
            }
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-400/50 px-3 py-2.5 font-semibold text-red-300 transition hover:border-red-300 hover:bg-red-500/10"
        >
          <TrashIcon className="size-5" /> Nullstill alt
        </button>
      </div>
    </Card>
  )
}
