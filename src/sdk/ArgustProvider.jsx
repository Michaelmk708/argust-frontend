import { createContext, useContext, useMemo } from 'react'
import { api } from '../lib/api.js'
import { DEFAULT_EXPLORER_BASE } from './http.js'

const ArgustContext = createContext(null)

/**
 * ArgustProvider is the root of the Argust frontend SDK. It wraps the
 * shared Axios instance (already configured with the Axum backend's
 * base URL and JWT bearer-token interceptor in `src/lib/api.js`) and a
 * handful of network-level defaults, and exposes them to every
 * `useArgust*` hook via context.
 *
 * Mount it once, high in the tree (see `main.jsx`). It does not
 * replace `AuthProvider` / `ThemeProvider` — it composes alongside
 * them and is purely about talking to the Argust backend and Solana
 * network, not about auth session state or UI theme.
 */
export function ArgustProvider({ children, cluster = 'devnet', explorerBase = DEFAULT_EXPLORER_BASE }) {
  const value = useMemo(
    () => ({
      api,
      cluster,
      explorerBase,
    }),
    [cluster, explorerBase]
  )

  return <ArgustContext.Provider value={value}>{children}</ArgustContext.Provider>
}

/**
 * Internal hook used by every SDK hook to reach the shared Axios
 * client and network config. Throws early with a clear message if a
 * developer forgets to mount `<ArgustProvider>`.
 */
export function useArgustContext() {
  const ctx = useContext(ArgustContext)
  if (!ctx) {
    throw new Error(
      'useArgustContext (and every useArgust*/useVerify* hook) must be used within an <ArgustProvider>.'
    )
  }
  return ctx
}
