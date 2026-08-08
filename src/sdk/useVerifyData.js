import { useCallback, useState } from 'react'
import { useArgustContext } from './ArgustProvider.jsx'
import { extractErrorMessage } from './http.js'

/**
 * useVerifyData wraps `POST /api/verify/data`, the general-purpose
 * data-provenance verification endpoint (for attesting facts about a
 * dataset or claim rather than a business entity). Requires a JWT.
 *
 * Expected payload shape:
 *   { data_hash, source_identity_hash, numeric_claim, category_tag, zk_proof_bytes }
 */
export function useVerifyData() {
  const { api } = useArgustContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitDataVerification = useCallback(
    async (payload) => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.post('/verify/data', payload)
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

  return { submitDataVerification, loading, error }
}
