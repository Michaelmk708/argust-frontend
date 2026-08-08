import { useCallback, useState } from 'react'
import { useArgustContext } from './ArgustProvider.jsx'
import { extractErrorMessage } from './http.js'

/**
 * useAdminPending wraps `GET /api/admin/pending`. Requires a JWT with
 * an admin role.
 */
export function useAdminPending() {
  const { api } = useArgustContext()
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/pending')
      const list = Array.isArray(data) ? data : data?.businesses || []
      setBusinesses(list)
      return list
    } catch (err) {
      const message = extractErrorMessage(err)
      setError(message)
      setBusinesses([])
      return []
    } finally {
      setLoading(false)
    }
  }, [api])

  return { businesses, setBusinesses, loading, error, refresh }
}

/**
 * useApproveEntity wraps `POST /api/admin/verify-entity`, which
 * triggers the Anchor contract deployment / on-chain anchoring for a
 * given business. Requires a JWT with an admin role.
 */
export function useApproveEntity() {
  const { api } = useArgustContext()
  const [approvingId, setApprovingId] = useState(null)
  const [error, setError] = useState('')

  const approveEntity = useCallback(
    async ({ brs_number, is_active = true, is_tax_compliant = true, audit_tier = 1 }) => {
      setApprovingId(brs_number)
      setError('')
      try {
        const { data } = await api.post('/admin/verify-entity', {
          brs_number,
          is_active,
          is_tax_compliant,
          audit_tier,
        })
        return data
      } catch (err) {
        const message = extractErrorMessage(err)
        setError(message)
        throw new Error(message)
      } finally {
        setApprovingId(null)
      }
    },
    [api]
  )

  return { approveEntity, approvingId, error }
}
