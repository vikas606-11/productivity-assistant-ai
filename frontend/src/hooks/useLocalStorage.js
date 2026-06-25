/**
 * useLocalStorage — Custom hook for persisting state in localStorage.
 * Will be used by task and settings features in future commits.
 *
 * @param {string} key   - localStorage key
 * @param {*}      initialValue - default value when key is absent
 */
import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`[useLocalStorage] Failed to set "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
