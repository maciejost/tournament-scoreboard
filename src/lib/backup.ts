import type { Game, Match, Players, Winner } from '../types'

/** Everything needed to fully restore a tournament. */
export interface BackupData {
  tournamentName: string
  players: Players
  games: Game[]
  matches: Match[]
}

/** On-disk backup format: a small envelope around {@link BackupData}. */
export interface BackupFile {
  app: typeof BACKUP_APP_ID
  version: number
  exportedAt: string
  data: BackupData
}

export const BACKUP_APP_ID = 'tournament-scoreboard'
export const BACKUP_VERSION = 1

export function serializeBackup(data: BackupData): string {
  const file: BackupFile = {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
  return JSON.stringify(file, null, 2)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isWinner(value: unknown): value is Winner {
  return value === 'p1' || value === 'p2' || value === 'tie'
}

/**
 * Parses and validates a backup file. Accepts both the wrapped envelope and a
 * bare data object. Invalid individual games/matches are skipped; missing core
 * sections throw a descriptive (Norwegian) error.
 */
export function parseBackup(text: string): BackupData {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('Filen er ikke gyldig JSON.')
  }
  if (!isObject(raw)) {
    throw new Error('Filen inneholder ikke en gyldig sikkerhetskopi.')
  }

  const container = isObject(raw.data) ? raw.data : raw

  const players = container.players
  if (!isObject(players) || typeof players.p1 !== 'string' || typeof players.p2 !== 'string') {
    throw new Error('Sikkerhetskopien mangler gyldige spillere.')
  }

  if (!Array.isArray(container.games)) {
    throw new Error('Sikkerhetskopien mangler spill-listen.')
  }
  const games: Game[] = []
  for (const g of container.games) {
    if (isObject(g) && typeof g.id === 'string' && typeof g.name === 'string') {
      games.push({ id: g.id, name: g.name })
    }
  }

  if (!Array.isArray(container.matches)) {
    throw new Error('Sikkerhetskopien mangler kamphistorikk.')
  }
  const matches: Match[] = []
  for (const m of container.matches) {
    if (
      isObject(m) &&
      typeof m.id === 'string' &&
      typeof m.gameId === 'string' &&
      isWinner(m.winner) &&
      typeof m.playedAt === 'number'
    ) {
      matches.push({ id: m.id, gameId: m.gameId, winner: m.winner, playedAt: m.playedAt })
    }
  }

  const tournamentName =
    typeof container.tournamentName === 'string' && container.tournamentName.trim()
      ? container.tournamentName
      : 'The Masters'

  return { players: { p1: players.p1, p2: players.p2 }, games, matches, tournamentName }
}
