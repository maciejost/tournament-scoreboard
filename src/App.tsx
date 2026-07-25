import { useMemo } from 'react'
import type { Game, Match, Players, Winner } from './types'
import { uid } from './lib/uid'
import { computeStats } from './lib/stats'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Leaderboard } from './components/Leaderboard'
import { GameBreakdown } from './components/GameBreakdown'
import { PlayerNamesEditor } from './components/PlayerNamesEditor'
import { GameManager } from './components/GameManager'
import { MatchLogger } from './components/MatchLogger'
import { MatchHistory } from './components/MatchHistory'
import { SettingsCard } from './components/SettingsCard'
import { FullscreenButton } from './components/FullscreenButton'
import { FlagIcon } from './components/icons'

const DEFAULT_PLAYERS: Players = { p1: 'Spiller 1', p2: 'Spiller 2' }
const DEFAULT_TOURNAMENT = 'The Masters'

function createDefaultGames(): Game[] {
  return ['Catan', 'Ticket to Ride', 'Scythe'].map((name) => ({ id: uid(), name }))
}

function App() {
  const [players, setPlayers] = useLocalStorage<Players>('sb.players', DEFAULT_PLAYERS)
  const [games, setGames] = useLocalStorage<Game[]>('sb.games', createDefaultGames())
  const [matches, setMatches] = useLocalStorage<Match[]>('sb.matches', [])
  const [tournamentName, setTournamentName] = useLocalStorage('sb.tournament', DEFAULT_TOURNAMENT)

  const stats = useMemo(() => computeStats(games, matches), [games, matches])

  function addGame(name: string) {
    setGames((prev) => [...prev, { id: uid(), name }])
  }

  function removeGame(id: string) {
    const count = matches.filter((m) => m.gameId === id).length
    if (
      count > 0 &&
      !window.confirm(
        `Slette dette spillet og ${count} registrert${count === 1 ? ' resultat' : 'e resultater'}?`,
      )
    ) {
      return
    }
    setGames((prev) => prev.filter((g) => g.id !== id))
    setMatches((prev) => prev.filter((m) => m.gameId !== id))
  }

  function renameGame(id: string, name: string) {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)))
  }

  function logMatch(gameId: string, winner: Winner) {
    setMatches((prev) => [{ id: uid(), gameId, winner, playedAt: Date.now() }, ...prev])
  }

  function editMatch(id: string, patch: Partial<Pick<Match, 'gameId' | 'winner'>>) {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function deleteMatch(id: string) {
    setMatches((prev) => prev.filter((m) => m.id !== id))
  }

  function resetAll() {
    setPlayers(DEFAULT_PLAYERS)
    setGames(createDefaultGames())
    setMatches([])
    setTournamentName(DEFAULT_TOURNAMENT)
  }

  return (
    <div className="min-h-screen">
      <FullscreenButton />
      <section className="flex min-h-screen flex-col px-4 pt-6 pb-6 sm:px-6 sm:pt-8">
        <header className="mx-auto w-full max-w-[1600px] text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-gold">
            <FlagIcon className="size-5" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase sm:text-sm">
              Turnering
            </span>
          </div>
          <h1 className="font-serif text-4xl font-black tracking-wide text-accent text-shadow-board sm:text-6xl xl:text-7xl">
            {tournamentName || 'The Masters'}
          </h1>
          <p className="mt-2 flex items-center justify-center gap-3 font-serif text-sm tracking-[0.35em] text-cream/80 uppercase sm:text-lg">
            <span className="h-px w-8 bg-gold/60 sm:w-16" />
            Resultattavle – én mot én
            <span className="h-px w-8 bg-gold/60 sm:w-16" />
          </p>
        </header>

        <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-center py-6">
          <div className="grid w-full gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <Leaderboard players={players} stats={stats} />
            </div>
            <div className="xl:col-span-2">
              <GameBreakdown players={players} stats={stats} />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px flex-1 bg-gold/30" />
            <h2 className="font-serif text-lg font-bold tracking-[0.3em] text-gold-bright uppercase sm:text-2xl">
              Kontrollpanel
            </h2>
            <span className="h-px flex-1 bg-gold/30" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <PlayerNamesEditor players={players} onChange={setPlayers} />
              <GameManager
                games={games}
                matches={matches}
                onAdd={addGame}
                onRemove={removeGame}
                onRename={renameGame}
              />
              <SettingsCard
                tournamentName={tournamentName}
                matchCount={matches.length}
                onRename={setTournamentName}
                onClearHistory={() => setMatches([])}
                onResetAll={resetAll}
              />
            </div>
            <div className="space-y-6">
              <MatchLogger games={games} players={players} onLog={logMatch} />
              <MatchHistory
                games={games}
                players={players}
                matches={matches}
                onEdit={editMatch}
                onDelete={deleteMatch}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1600px] px-6 py-6 text-center text-xs tracking-[0.25em] text-muted/70 uppercase">
        {stats.totalMatches} resultat{stats.totalMatches === 1 ? '' : 'er'} registrert · lagret på
        denne enheten
      </footer>
    </div>
  )
}

export default App
