import { useCallback, useState } from 'react'
import { useArgustContext } from './ArgustProvider.jsx'
import { extractErrorMessage } from './http.js'

/**
 * useVerifyBusiness wraps `POST /api/verify/business`. Requires the
 * caller to be authenticated (the shared `api` instance already
 * attaches the JWT bearer token from local storage, see
 * `src/lib/api.js`).
 *
 * Expected payload shape (matches the Axum backend exactly):
 *   {
 *     brs_number, business_name_hash, is_active, is_tax_compliant,
 *     audit_tier, source_domain_hash, zk_proof_bytes
 *   }
 */
export function useVerifyBusiness() {
  const { api } = useArgustContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitBusinessVerification = useCallback(
    async (payload) => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.post('/verify/business', payload)
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

  return { submitBusinessVerification, loading, error }
}
