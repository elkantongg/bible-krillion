# CLAUDE.md — Into the Deep (Bible daily dive)

Krillion-style Bible trivia: 7 open-answer prompts × 25 s, rarity-based points, 10 m depth per point (700 = 7,000 m).
Modes: daily dive, archive, Big Fish (online hot-potato party via room code / link).

## Commands
- `pnpm dev` — web http://localhost:5280 (strictPort) + API :8787 (Vite proxies /api and /socket.io)
- `pnpm test` — vitest (tests/*.test.ts); `pnpm typecheck`; `pnpm build`; `pnpm start` (prod, serves dist/)

## Layout
- `shared/` isomorphic: `match.ts` (normalise + fuzzy), `scoring.ts` (tiers, priors, depth, zones), `dives.ts` (dive numbering, seeded selection), `data/` (questions)
- `server/solo.ts` SoloService (inject `now`), `server/party.ts` PartyRoom (inject Clock), `server/index.ts` wiring
- `src/` React 19 + Tailwind v4 + motion; `lib/ocean.ts` global depth target; `components/Ocean.tsx` background world

## Conventions / decisions
- Answers never reach the client; all validation/scoring server-side. Don't import `shared/data` from `src/`.
- Dataset line format `Canonical|Alias:level:Ref` (level 0 obscure … 5 obvious). Protestant canon, no Apocrypha. Accuracy > quantity; never invent names. Tests enforce no alias collisions.
- Scoring: `share=(count+40*prior[level])/(total+40)` → fixed tiers 10/20/35/60/85/100. Stats count once per player-prompt, ≤3 per IP-hash/question/day.
- Timer is server-authoritative: deadline = opened_at + 3 s lead + 25 s; grace 1.5 s; reopen keeps clock.
- Dive prompts are materialised in `dive_prompts` on first use (stable history).
- Party rooms are in-memory (lost on restart). Fuse 10–30 s hidden, floor 8 s on pass, lives 1–3.
- Original branding only — do not copy Krillion art/text/names.
- Git: commit with the user's configured identity; NO Co-Authored-By / AI attribution trailers (user instruction).

## Status (2026-11-23)
- Done: solo daily + archive, Big Fish online, ocean visuals, sounds, 69 tests passing, prod build.
- Ideas next: more questions, share image, PWA, Postgres port if hosting needs it.
