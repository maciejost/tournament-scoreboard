import type { Game, Match, Winner } from '../types'

export interface PlayerRecord {
  wins: number
  losses: number
}

export interface GameRow {
  gameId: string
  gameName: string
  p1: number
  p2: number
  total: number
}

export interface Stats {
  totals: { p1: PlayerRecord; p2: PlayerRecord }
  perGame: GameRow[]
  /** 'p1'/'p2' when one player leads on wins, or 'tie' for level standings. */
  leader: Winner
  totalMatches: number
  /** Absolute win margin between the two players. */
  margin: number
}

const emptyRecord = (): PlayerRecord => ({ wins: 0, losses: 0 })

export function computeStats(games: Game[], matches: Match[]): Stats {
  const totals = { p1: emptyRecord(), p2: emptyRecord() }

  const perGame = new Map<string, GameRow>()
  for (const g of games) {
    perGame.set(g.id, { gameId: g.id, gameName: g.name, p1: 0, p2: 0, total: 0 })
  }

  for (const m of matches) {
    if (m.winner === 'p1') {
      totals.p1.wins++
      totals.p2.losses++
    } else if (m.winner === 'p2') {
      totals.p2.wins++
      totals.p1.losses++
    }

    const row = perGame.get(m.gameId)
    if (row) {
      if (m.winner === 'p1') row.p1++
      else if (m.winner === 'p2') row.p2++
      row.total++
    }
  }

  let leader: Winner = 'tie'
  if (totals.p1.wins > totals.p2.wins) leader = 'p1'
  else if (totals.p2.wins > totals.p1.wins) leader = 'p2'

  return {
    totals,
    perGame: [...perGame.values()],
    leader,
    totalMatches: matches.length,
    margin: Math.abs(totals.p1.wins - totals.p2.wins),
  }
}
