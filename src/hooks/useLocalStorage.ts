import { useEffect, useState } from 'react'

/**
 * State hook that transparently persists to browser localStorage.
 * Falls back to the initial value when storage is unavailable or corrupt.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage may be full or blocked (private mode) — ignore. */
    }
  }, [key, value])

  return [value, setValue] as const
}
