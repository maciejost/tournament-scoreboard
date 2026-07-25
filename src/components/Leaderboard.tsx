import type { Players } from '../types'
import type { PlayerRecord, Stats } from '../lib/stats'
import { FlagIcon } from './icons'

interface Props {
  players: Players
  stats: Stats
}

export function Leaderboard({ players, stats }: Props) {
  const { totals, leader, margin, totalMatches } = stats
  const isTie = leader === 'tie'

  return (
    <section className="rounded-3xl border-2 border-gold/60 bg-linear-to-b from-panel to-board-deep board-grain p-5 shadow-2xl sm:p-8">
      <header className="mb-6 flex items-center justify-center gap-4">
        <span className="hidden h-px flex-1 bg-linear-to-r from-transparent to-gold/70 sm:block" />
        <h2 className="text-center font-serif text-2xl font-black tracking-[0.35em] text-accent uppercase text-shadow-board sm:text-4xl">
          Ledertavle
        </h2>
        <span className="hidden h-px flex-1 bg-linear-to-l from-transparent to-gold/70 sm:block" />
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-6">
        <PlayerColumn
          name={players.p1 || 'Spiller 1'}
          record={totals.p1}
          status={statusFor('p1', leader, totalMatches)}
        />

        <div className="flex flex-col items-center justify-center">
          <span className="h-full w-px bg-linear-to-b from-transparent via-gold/50 to-transparent" />
          <span className="my-2 flex size-12 items-center justify-center rounded-full border border-gold/60 bg-board-deep font-serif text-lg font-bold text-gold sm:size-16 sm:text-2xl">
            vs
          </span>
          <span className="h-full w-px bg-linear-to-b from-transparent via-gold/50 to-transparent" />
        </div>

        <PlayerColumn
          name={players.p2 || 'Spiller 2'}
          record={totals.p2}
          status={statusFor('p2', leader, totalMatches)}
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-gold/30 bg-board-deep/60 px-4 py-3 text-center">
        <FlagIcon className="size-5 shrink-0 text-accent sm:size-6" />
        <p className="font-serif text-lg font-bold tracking-widest text-cream uppercase sm:text-2xl">
          {totalMatches === 0 ? (
            <span className="text-muted">Venter på første resultat</span>
          ) : isTie ? (
            <span className="text-accent">Likt</span>
          ) : (
            <>
              <span className="text-accent">
                {leader === 'p1' ? players.p1 || 'Spiller 1' : players.p2 || 'Spiller 2'}
              </span>{' '}
              leder med {margin}
            </>
          )}
        </p>
      </div>
    </section>
  )
}

type Status = 'leader' | 'chasing' | 'square' | 'idle'

function statusFor(id: 'p1' | 'p2', leader: Stats['leader'], totalMatches: number): Status {
  if (totalMatches === 0) return 'idle'
  if (leader === 'tie') return 'square'
  return leader === id ? 'leader' : 'chasing'
}

function PlayerColumn({
  name,
  record,
  status,
}: {
  name: string
  record: PlayerRecord
  status: Status
}) {
  const isLeader = status === 'leader'

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border px-3 py-5 text-center transition-colors sm:px-6 sm:py-7 ${
        isLeader
          ? 'border-accent/70 bg-accent/5 shadow-[0_0_40px_-12px_var(--color-accent)]'
          : 'border-gold/25 bg-board-deep/30'
      }`}
    >
      <StatusPill status={status} />

      <h3
        className={`mt-3 line-clamp-2 font-serif text-2xl leading-tight font-black break-words text-shadow-board sm:text-4xl xl:text-5xl ${
          isLeader ? 'text-accent' : 'text-cream'
        }`}
        title={name}
      >
        {name}
      </h3>

      <div
        className={`tnum mt-2 font-num text-7xl leading-none font-bold sm:text-8xl xl:text-[7rem] ${
          isLeader ? 'text-accent' : 'text-cream'
        }`}
      >
        {record.wins}
      </div>
      <div className="text-xs font-semibold tracking-[0.3em] text-muted uppercase sm:text-sm">
        Seiere
      </div>

      <dl className="mt-4 grid w-full max-w-[16rem] grid-cols-2 gap-1.5 sm:gap-2">
        <Stat label="Tap" value={record.losses} />
        <Stat label="Seier %" value={winPct(record)} />
      </dl>
    </div>
  )
}

function StatusPill({ status }: { status: Status }) {
  if (status === 'leader') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold tracking-widest text-board-deep uppercase sm:text-sm">
        <FlagIcon className="size-3.5" /> Leder
      </span>
    )
  }
  if (status === 'square') {
    return (
      <span className="inline-flex items-center rounded-full border border-gold/60 px-3 py-1 text-xs font-bold tracking-widest text-gold-bright uppercase sm:text-sm">
        Likt
      </span>
    )
  }
  if (status === 'chasing') {
    return (
      <span className="inline-flex items-center rounded-full border border-gold/40 px-3 py-1 text-xs font-bold tracking-widest text-muted uppercase sm:text-sm">
        Jager
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full border border-gold/20 px-3 py-1 text-xs font-bold tracking-widest text-muted/70 uppercase sm:text-sm">
      Utslag
    </span>
  )
}

function winPct(record: PlayerRecord): string {
  const played = record.wins + record.losses
  return played === 0 ? '—' : `${Math.round((record.wins / played) * 100)}%`
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number | string
  highlight?: boolean
}) {
  return (
    <div className="rounded-lg border border-gold/20 bg-board/40 py-2">
      <dd
        className={`tnum font-num text-2xl leading-none font-bold sm:text-3xl ${
          highlight ? 'text-accent' : 'text-cream'
        }`}
      >
        {value}
      </dd>
      <dt className="mt-1 text-[0.6rem] font-semibold tracking-widest text-muted uppercase sm:text-xs">
        {label}
      </dt>
    </div>
  )
}
