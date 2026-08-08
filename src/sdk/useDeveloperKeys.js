import { useCallback, useState } from 'react'
import { useArgustContext } from './ArgustProvider.jsx'
import { extractErrorMessage } from './http.js'

/**
 * useDeveloperKeys wraps `POST /api/auth/developer/keys`. Requires a
 * JWT (developer must be logged in). `environment` is typically
 * 'test' or 'live'.
 */
export function useDeveloperKeys() {
  const { api } = useArgustContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateKey = useCallback(
    async (environment) => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.post('/auth/developer/keys', { environment })
        return data
      } catch (err) {
        const message = extractErrorMessage(err)
        setError(message)
        throw new Error(message)
      } finally {
        setLoading(false)
      }
    },
    [api]
  )

  return { generateKey, loading, error }
}
