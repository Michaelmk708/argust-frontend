/**
 * Argust Frontend SDK
 * ---------------------------------------------------------------
 * A small, dependency-free layer over the shared Axios client that
 * abstracts away Axum endpoint paths, JWT header wiring, error-shape
 * normalization, and Solana explorer/hash formatting.
 *
 * Mount once:
 *   import { ArgustProvider } from './sdk'
 *   <ArgustProvider><App /></ArgustProvider>
 *
 * Then use anywhere inside the tree:
 *   import { useVerifyBusiness, useBusinessStatus, useArgustProof } from '../../sdk'
 */
export { ArgustProvider, useArgustContext } from './ArgustProvider.jsx'

export { useArgustProof, ZKTLS_STEPS } from './useArgustProof.js'

export { useVerifyBusiness } from './useVerifyBusiness.js'
export { useVerifyData } from './useVerifyData.js'

export { useBusinessStatus } from './useBusinessStatus.js'
export { useProvenanceStatus } from './useProvenanceStatus.js'

export { useDeveloperKeys } from './useDeveloperKeys.js'
export { useAdminPending, useApproveEntity } from './useAdminEntities.js'

export { extractErrorMessage, explorerTxUrl, truncateHash, DEFAULT_EXPLORER_BASE } from './http.js'
export { sha256Hex, randomHex, buildMockProofBytes } from './crypto.js'
