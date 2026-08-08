# Argust Trust — Frontend

React + Vite + Tailwind CSS frontend for the Argust Trust on-chain business
verification platform. Talks to a Rust (Axum) + Solana (Anchor) backend.

## Design system

- **Palette:** deep navy/near-black (`#0B0F19`) in dark mode, cool off-white
  (`#F7F8FB`) in light mode, with a violet (`#7C6AED`) primary accent,
  emerald (`#10B981`) for verified states, and amber (`#F59E0B`) for pending.
- **Type:** Space Grotesk for display headings, Inter for body copy,
  JetBrains Mono for BRS numbers, PDAs, and transaction hashes.
- **Signature element:** the hexagonal "seal" mark (`src/components/Seal.jsx`)
  — used as the logo, the hero motif, and the live status indicator — echoed
  in the ambient background glows (`GlowField.jsx`), which are hexagon-clipped
  rather than plain circles.

## Requirements

- Node.js 18+
- Your Argust Trust Axum backend running locally on `http://localhost:3000`
  (or set `VITE_API_BASE_URL` — see below)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Optional: point at a different API host
cp .env.example .env
# edit .env and set VITE_API_BASE_URL

# 3. Run the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Pages

| Route        | Purpose                                                        |
|--------------|-----------------------------------------------------------------|
| `/`          | Hero + image carousel + BRS lookup search bar                   |
| `/register`  | Business registration / ingest form → `POST /api/verify`        |
| `/status`    | Verification status lookup → `GET /api/status/:brs_number`      |
| `/admin`     | Pending business queue + on-chain approval → `POST /api/admin/approve` |

## API layer

All backend calls live in `src/lib/api.js`:

- `submitVerification(payload)` → `POST /api/verify`
- `getStatus(brsNumber)` → `GET /api/status/:brs_number`
- `approveBusiness(payload)` → `POST /api/admin/approve`
- `getPendingBusinesses()` → `GET /api/admin/pending` (optional; the Admin
  page falls back to sample data if this route isn't implemented yet)

## Build for production

```bash
npm run build
npm run preview
```
