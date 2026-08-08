import { useCallback, useState } from 'react'
import { useArgustContext } from './ArgustProvider.jsx'
import { extractErrorMessage, explorerTxUrl } from './http.js'

/**
 * useProvenanceStatus wraps the public `GET /api/status/provenance/:data_hash`
 * lookup — the data-provenance counterpart to useBusinessStatus. No
 * JWT required.
 */
export function useProvenanceStatus() {
  const { api, cluster, explorerBase } = useArgustContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = useCallback(
    async (dataHash) => {
      const trimmed = (dataHash || '').trim()
      if (!trimmed) return null

      setLoading(true)
      setError('')
      setData(null)
      try {
        const { data: result } = await api.get(`/status/provenance/${encodeURIComponent(trimmed)}`)
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
