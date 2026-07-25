import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Game, Match, Players } from '../types'
import type { BackupData } from '../lib/backup'
import { parseBackup, serializeBackup } from '../lib/backup'
import { Card } from './Card'
import { DownloadIcon, UploadIcon } from './icons'

interface Props {
  players: Players
  games: Game[]
  matches: Match[]
  tournamentName: string
  onRestore: (data: BackupData) => void
}

type Feedback = { kind: 'ok' | 'error'; text: string } | null

export function BackupCard({ players, games, matches, tournamentName, onRestore }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  function download() {
    const text = serializeBackup({ players, games, matches, tournamentName })
    const stamp = new Date().toISOString().slice(0, 10)
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `masters-sikkerhetskopi-${stamp}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setFeedback({ kind: 'ok', text: 'Sikkerhetskopi lastet ned.' })
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be picked again later
    if (!file) return
    try {
      const data = parseBackup(await file.text())
      const n = data.matches.length
      const summary = `${data.games.length} spill og ${n} resultat${n === 1 ? '' : 'er'}`
      if (!window.confirm(`Gjenopprette ${summary}? Dette erstatter alle nåværende data.`)) {
        return
      }
      onRestore(data)
      setFeedback({ kind: 'ok', text: 'Data gjenopprettet fra sikkerhetskopi.' })
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Kunne ikke lese filen.',
      })
    }
  }

  return (
    <Card title="Sikkerhetskopi" icon={<DownloadIcon className="size-5" />}>
      <p className="mb-4 text-sm text-muted">
        Last ned alle data som en JSON-fil, eller gjenopprett fra en tidligere sikkerhetskopi.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={download}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 font-semibold text-board-deep transition hover:brightness-110 active:brightness-95"
        >
          <DownloadIcon className="size-5" /> Last ned
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold/40 px-3 py-2.5 font-semibold text-cream transition hover:border-accent hover:text-accent"
        >
          <UploadIcon className="size-5" /> Gjenopprett
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          className="hidden"
        />
      </div>
      {feedback && (
        <p className={`mt-3 text-sm ${feedback.kind === 'ok' ? 'text-accent' : 'text-red-300'}`}>
          {feedback.text}
        </p>
      )}
    </Card>
  )
}
