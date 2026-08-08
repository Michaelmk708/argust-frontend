import { useCallback, useState } from 'react'
import { useArgustContext } from './ArgustProvider.jsx'
import { extractErrorMessage, explorerTxUrl } from './http.js'

/**
 * useBusinessStatus wraps the public `GET /api/status/business/:brs_number`
 * lookup. No JWT is required — this mirrors the "anyone can check a
 * business" public-lookup behavior of the platform.
 *
 * Returns a `lookup(brsNumber)` function rather than fetching
 * automatically, since the status page drives this from a search form.
 */
export function useBusinessStatus() {
  const { api, cluster, explorerBase } = useArgustContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = useCallback(
    async (brsNumber) => {
      const trimmed = (brsNumber || '').trim()
      if (!trimmed) return null

      setLoading(true)
      setError('')
      setData(null)
      try {
        const { data: result } = await api.get(`/status/business/${encodeURIComponent(trimmed)}`)
        setData(result)
        return result
      } catch (err) {
        const message = extractErrorMessage(err)
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [api]
  )

  const reset = useCallback(() => {
    setData(null)
    setError('')
  }, [])

  return {
    data,
    loading,
    error,
    lookup,
    reset,
    explorerUrl: data?.tx_hash ? explorerTxUrl(data.tx_hash, cluster, explorerBase) : null,
  }
}
