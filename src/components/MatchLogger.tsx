import { useEffect, useRef, useState } from 'react'
import type { Game, Players, Winner } from '../types'
import { Card } from './Card'
import { CheckIcon, PlusIcon } from './icons'

interface Props {
  games: Game[]
  players: Players
  onLog: (gameId: string, winner: Winner) => void
}

export function MatchLogger({ games, players, onLog }: Props) {
  const [gameId, setGameId] = useState(games[0]?.id ?? '')
  const [winner, setWinner] = useState<Winner | ''>('')
  const [flash, setFlash] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (games.length === 0) {
      setGameId('')
    } else if (!games.some((g) => g.id === gameId)) {
      setGameId(games[0].id)
    }
  }, [games, gameId])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function log() {
    if (!gameId || !winner) return
    onLog(gameId, winner)
    setWinner('')
    setFlash(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setFlash(false), 1600)
  }

  const winnerOptions: { value: Winner; label: string }[] = [
    { value: 'p1', label: players.p1 || 'Spiller 1' },
    { value: 'p2', label: players.p2 || 'Spiller 2' },
  ]

  return (
    <Card title="Registrer resultat" icon={<PlusIcon className="size-5" />}>
      {games.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gold/30 px-3 py-6 text-center text-muted">
          Legg til et brettspill under <span className="text-accent">Spilloppsett</span> for å
          registrere resultater.
        </p>
      ) : (
        <div className="space-y-5">
          <div>
            <span className="mb-2 block text-xs font-semibold tracking-widest text-muted uppercase">
              Spill
            </span>
            <div className="flex flex-wrap gap-2">
              {games.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setGameId(game.id)}
                  className={`rounded-full border px-4 py-2 text-base font-semibold transition ${
                    gameId === game.id
                      ? 'border-accent bg-accent text-board-deep'
                      : 'border-gold/40 text-cream hover:border-accent hover:text-accent'
                  }`}
                >
                  {game.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold tracking-widest text-muted uppercase">
              Vinner
            </span>
            <div className="grid grid-cols-2 gap-2">
              {winnerOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWinner(opt.value)}
                  className={`min-h-[3.5rem] rounded-xl border px-2 py-2 text-lg font-bold break-words transition ${
                    winner === opt.value
                      ? 'border-accent bg-accent text-board-deep shadow-[0_0_25px_-8px_var(--color-accent)]'
                      : 'border-gold/40 text-cream hover:border-accent hover:text-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={log}
            disabled={!gameId || !winner}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-lg font-bold tracking-widest text-board-deep uppercase transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckIcon className="size-6" /> Registrer resultat
          </button>

          <p
            className={`text-center text-sm font-semibold tracking-widest text-accent uppercase transition-opacity ${
              flash ? 'opacity-100' : 'opacity-0'
            }`}
            aria-live="polite"
          >
            ✓ Resultat registrert
          </p>
        </div>
      )}
    </Card>
  )
}
