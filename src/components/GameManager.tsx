import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { Game, Match } from '../types'
import { Card } from './Card'
import { CheckIcon, FlagIcon, PencilIcon, PlusIcon, TrashIcon, XIcon } from './icons'

interface Props {
  games: Game[]
  matches: Match[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
}

const inputClass =
  'w-full rounded-lg border border-gold/30 bg-board-deep/60 px-3 py-2.5 text-lg text-cream outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/40'

export function GameManager({ games, matches, onAdd, onRemove, onRename }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const counts = new Map<string, number>()
  for (const m of matches) counts.set(m.gameId, (counts.get(m.gameId) ?? 0) + 1)

  function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (games.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Det spillet står allerede på listen.')
      return
    }
    onAdd(trimmed)
    setName('')
    setError('')
  }

  function saveEdit(id: string) {
    const trimmed = editValue.trim()
    if (trimmed) onRename(id, trimmed)
    setEditingId(null)
  }

  return (
    <Card title="Spilloppsett" icon={<FlagIcon className="size-5" />}>
      <form onSubmit={submit} className="flex gap-2">
        <input
          className={inputClass}
          value={name}
          maxLength={30}
          placeholder="Legg til et spill – f.eks. Catan"
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 font-semibold tracking-wide text-board-deep uppercase transition hover:brightness-110 active:brightness-95 disabled:opacity-40"
          disabled={!name.trim()}
        >
          <PlusIcon className="size-5" />
          <span className="hidden sm:inline">Legg til</span>
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-accent/90">{error}</p>}

      <ul className="mt-4 space-y-2">
        {games.length === 0 && (
          <li className="rounded-lg border border-dashed border-gold/30 px-3 py-4 text-center text-muted">
            Ingen spill ennå. Legg til ditt første brettspill over.
          </li>
        )}
        {games.map((game) => {
          const count = counts.get(game.id) ?? 0
          const isEditing = editingId === game.id
          return (
            <li
              key={game.id}
              className="flex items-center gap-2 rounded-lg border border-gold/20 bg-board-deep/40 px-3 py-2"
            >
              {isEditing ? (
                <>
                  <input
                    className={inputClass + ' py-1.5 text-base'}
                    value={editValue}
                    maxLength={30}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(game.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <IconButton label="Lagre" onClick={() => saveEdit(game.id)} tone="accent">
                    <CheckIcon className="size-5" />
                  </IconButton>
                  <IconButton label="Avbryt" onClick={() => setEditingId(null)}>
                    <XIcon className="size-5" />
                  </IconButton>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate text-lg font-semibold text-cream" title={game.name}>
                    {game.name}
                  </span>
                  <span className="tnum rounded-full border border-gold/30 px-2 py-0.5 text-xs font-semibold text-muted">
                    {count} {count === 1 ? 'kamp' : 'kamper'}
                  </span>
                  <IconButton
                    label="Gi nytt navn"
                    onClick={() => {
                      setEditingId(game.id)
                      setEditValue(game.name)
                    }}
                  >
                    <PencilIcon className="size-4" />
                  </IconButton>
                  <IconButton label="Slett" onClick={() => onRemove(game.id)} tone="danger">
                    <TrashIcon className="size-4" />
                  </IconButton>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
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
