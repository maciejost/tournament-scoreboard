export type PlayerId = 'p1' | 'p2'
export type Winner = PlayerId | 'tie'

export interface Players {
  p1: string
  p2: string
}

export interface Game {
  id: string
  name: string
}

export interface Match {
  id: string
  gameId: string
  winner: Winner
  playedAt: number
}
