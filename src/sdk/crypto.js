/**
 * Lightweight crypto helpers used by the Argust SDK.
 *
 * `sha256Hex` uses the browser's native Web Crypto API to derive a
 * deterministic hash for values the backend expects as hashes
 * (business_name_hash, source_domain_hash, data_hash, etc.) so raw
 * business data never has to be the thing we submit on-chain.
 *
 * `randomHex` / `buildMockProofBytes` are used only by the zkTLS
 * simulation to produce a realistic-looking `zk_proof_bytes` payload
 * in the browser, in place of a real zero-knowledge proof produced by
 * a zkTLS notary/prover service.
 */

export async function sha256Hex(value) {
  const encoder = new TextEncoder()
  const data = encoder.encode(String(value ?? ''))
  const digest = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(digest)
}

export function randomHex(byteLength = 32) {
  const bytes = new Uint8Array(byteLength)
  crypto.getRandomValues(bytes)
  return bufferToHex(bytes.buffer)
}

/**
 * Builds a base64-encoded mock zk_proof_bytes payload. Real zkTLS
 * proofs are opaque binary blobs; we mimic that shape here (a
 * versioned header + random proof bytes) so the backend integration
 * contract (a base64/opaque string field) can be wired end to end
 * before a real prover is plugged in.
 */
export function buildMockProofBytes({ subject = 'business', claims = {} } = {}) {
  const header = {
    proof_system: 'argust-zktls-mock/v1',
    subject,
    claims,
    nonce: randomHex(16),
    issued_at: new Date().toISOString(),
  }
  const json = JSON.stringify(header)
  const base64 = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(json))) : json
  return `zkp_${base64}`
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
