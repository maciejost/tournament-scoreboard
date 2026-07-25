import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Game, Match, Players, Winner } from '../types'
import { Card } from './Card'
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from './icons'

interface Props {
  games: Game[]
  players: Players
  matches: Match[]
  onEdit: (id: string, patch: Partial<Pick<Match, 'gameId' | 'winner'>>) => void
  onDelete: (id: string) => void
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const selectClass =
  'rounded-lg border border-gold/30 bg-board-deep px-2 py-1.5 text-cream outline-none focus:border-accent'

export function MatchHistory({ games, players, matches, onEdit, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editGameId, setEditGameId] = useState('')
  const [editWinner, setEditWinner] = useState<Winner>('p1')

  const ordered = [...matches].sort((a, b) => b.playedAt - a.playedAt)

  const gameName = (id: string) => games.find((g) => g.id === id)?.name ?? 'Slettet spill'
  const winnerLabel = (w: Winner) =>
    w === 'p1' ? players.p1 || 'Spiller 1' : w === 'p2' ? players.p2 || 'Spiller 2' : 'Uavgjort'

  function startEdit(m: Match) {
    setEditingId(m.id)
    setEditGameId(m.gameId)
    setEditWinner(m.winner)
  }

  function save() {
    if (editingId) onEdit(editingId, { gameId: editGameId, winner: editWinner })
    setEditingId(null)
  }

  return (
    <Card
      title="Historikk"
      icon={<PencilIcon className="size-5" />}
      action={
        <span className="tnum rounded-full border border-gold/30 px-2.5 py-0.5 text-xs font-semibold text-muted">
          {matches.length} registrert
        </span>
      }
    >
      {ordered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gold/30 px-3 py-6 text-center text-muted">
          Ingen resultater registrert ennå.
        </p>
      ) : (
        <ul className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
          {ordered.map((m) => {
            const isEditing = editingId === m.id
            return (
              <li
                key={m.id}
                className="rounded-lg border border-gold/20 bg-board-deep/40 px-3 py-2.5"
              >
                {isEditing ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className={selectClass}
                      value={editGameId}
                      onChange={(e) => setEditGameId(e.target.value)}
                    >
                      {games.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className={selectClass}
                      value={editWinner}
                      onChange={(e) => setEditWinner(e.target.value as Winner)}
                    >
                      <option value="p1">{players.p1 || 'Spiller 1'}</option>
                      <option value="p2">{players.p2 || 'Spiller 2'}</option>
                    </select>
                    <div className="ml-auto flex gap-2">
                      <IconButton label="Lagre" onClick={save} tone="accent">
                        <CheckIcon className="size-5" />
                      </IconButton>
                      <IconButton label="Avbryt" onClick={() => setEditingId(null)}>
                        <XIcon className="size-5" />
                      </IconButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-cream" title={gameName(m.gameId)}>
                        {gameName(m.gameId)}
                      </p>
                      <p className="text-xs tracking-wide text-muted">{dateFmt.format(m.playedAt)}</p>
                    </div>
                    <WinnerBadge winner={m.winner} label={winnerLabel(m.winner)} />
                    <div className="flex gap-1.5">
                      <IconButton label="Rediger" onClick={() => startEdit(m)}>
                        <PencilIcon className="size-4" />
                      </IconButton>
                      <IconButton label="Slett" onClick={() => onDelete(m.id)} tone="danger">
                        <TrashIcon className="size-4" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function WinnerBadge({ winner, label }: { winner: Winner; label: string }) {
  if (winner === 'tie') {
    return (
      <span className="max-w-[8rem] shrink-0 truncate rounded-full border border-gold/60 px-3 py-1 text-sm font-bold text-gold-bright italic">
        Uavgjort
      </span>
    )
  }
  const tone = winner === 'p1' ? 'bg-accent' : 'bg-gold-bright'
  return (
    <span
      className={`max-w-[9rem] shrink-0 truncate rounded-full px-3 py-1 text-sm font-bold text-board-deep ${tone}`}
      title={label}
    >
      {label}
    </span>
  )
}

function IconButton({
  children,
  label,
  onClick,
  tone = 'default',
}: {
  children: ReactNode
  label: string
  onClick: () => void
  tone?: 'default' | 'accent' | 'danger'
}) {
  const tones = {
    default: 'border-gold/40 text-muted hover:border-accent hover:text-accent',
    accent: 'border-accent/60 text-accent hover:bg-accent hover:text-board-deep',
    danger: 'border-red-400/40 text-red-300 hover:border-red-300 hover:text-red-200',
  }
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition ${tones[tone]}`}
    >
      {children}
    </button>
  )
}
