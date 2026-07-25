import type { Players } from '../types'
import type { Stats } from '../lib/stats'

interface Props {
  players: Players
  stats: Stats
}

export function GameBreakdown({ players, stats }: Props) {
  const { perGame, totals } = stats
  const p1 = players.p1 || 'Spiller 1'
  const p2 = players.p2 || 'Spiller 2'

  return (
    <section className="rounded-3xl border-2 border-gold/50 bg-linear-to-b from-panel to-board-deep board-grain p-5 shadow-2xl sm:p-8">
      <header className="mb-5 flex items-center justify-center gap-4">
        <span className="hidden h-px flex-1 bg-linear-to-r from-transparent to-gold/70 sm:block" />
        <h2 className="text-center font-serif text-xl font-black tracking-[0.3em] text-accent uppercase text-shadow-board sm:text-3xl">
          Spill&nbsp;for&nbsp;spill
        </h2>
        <span className="hidden h-px flex-1 bg-linear-to-l from-transparent to-gold/70 sm:block" />
      </header>

      {perGame.length === 0 ? (
        <p className="py-6 text-center font-serif text-lg text-muted sm:text-xl">
          Ingen spill lagt til ennå – legg til ett under{' '}
          <span className="text-accent">Spilloppsett</span>.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-lg sm:text-2xl xl:text-3xl">
            <thead>
              <tr className="border-b-2 border-gold/50 text-accent">
                <th className="px-2 py-3 text-left font-serif font-bold tracking-widest uppercase">
                  Spill
                </th>
                <th
                  className="w-[28%] px-2 py-3 text-center align-bottom font-serif text-lg font-bold tracking-tight break-words uppercase sm:text-xl xl:text-2xl"
                  title={p1}
                >
                  {p1}
                </th>
                <th
                  className="w-[28%] px-2 py-3 text-center align-bottom font-serif text-lg font-bold tracking-tight break-words uppercase sm:text-xl xl:text-2xl"
                  title={p2}
                >
                  {p2}
                </th>
              </tr>
            </thead>
            <tbody>
              {perGame.map((row) => {
                const p1Lead = row.p1 > row.p2
                const p2Lead = row.p2 > row.p1
                return (
                  <tr key={row.gameId} className="border-b border-gold/15 last:border-b-0">
                    <td className="px-2 py-3 text-left font-semibold text-cream" title={row.gameName}>
                      <span className="line-clamp-1">{row.gameName}</span>
                    </td>
                    <Cell value={row.p1} highlight={p1Lead} />
                    <Cell value={row.p2} highlight={p2Lead} />
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gold/50">
                <td className="px-2 py-3 text-left font-serif font-bold tracking-widest text-accent uppercase">
                  Totalt
                </td>
                <Cell value={totals.p1.wins} highlight={totals.p1.wins > totals.p2.wins} bold />
                <Cell value={totals.p2.wins} highlight={totals.p2.wins > totals.p1.wins} bold />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  )
}

function Cell({
  value,
  highlight,
  bold = false,
}: {
  value: number
  highlight: boolean
  bold?: boolean
}) {
  return (
    <td
      className={`tnum px-2 py-3 text-center font-num ${bold ? 'font-bold' : 'font-semibold'} ${
        highlight ? 'text-accent' : 'text-cream'
      }`}
    >
      {value}
    </td>
  )
}
