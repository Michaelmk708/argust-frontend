/**
 * Shared HTTP + Solana display helpers used across the Argust SDK
 * hooks, so every hook surfaces errors and transaction data the same
 * way instead of every page reinventing `err.response?.data` parsing.
 */

/**
 * Normalizes an Axios error (or any thrown error) from the Axum
 * backend into a single human-readable string. The backend may return
 * a plain string, `{ error: "..." }`, or `{ message: "..." }`.
 */
export function extractErrorMessage(error) {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.error) return data.error
  if (data?.message) return data.message
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
  if (error?.message === 'Network Error') {
    return 'Could not reach the Argust backend. Is the API running?'
  }
  return error?.message || 'Something went wrong. Please try again.'
}

export const DEFAULT_EXPLORER_BASE = 'https://explorer.solana.com/tx'

/**
 * Builds a Solana Explorer URL for a transaction signature/hash,
 * so pages never have to hand-assemble cluster query strings.
 */
export function explorerTxUrl(txHash, cluster = 'devnet', explorerBase = DEFAULT_EXPLORER_BASE) {
  if (!txHash) return null
  return `${explorerBase}/${txHash}?cluster=${cluster}`
}

/** Shortens a PDA / transaction hash for compact display: 6Fk3...9pQ2 */
export function truncateHash(value, chars = 4) {
  if (!value) return ''
  if (value.length <= chars * 2 + 3) return value
  return `${value.slice(0, chars)}...${value.slice(-chars)}`
}
