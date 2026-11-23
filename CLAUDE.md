# CLAUDE.md — Into the Deep (Bible daily dive)

Krillion-style Bible trivia: 7 open-answer prompts × 25 s, rarity-based points, 10 m depth per point (700 = 7,000 m).
Modes: daily dive, archive, Free Dive (unlimited practice, 3 air tanks), Big Fish (online turn-based party via room code / link).
Look: quiet, editorial — ivory/soft gold on a dusk-to-abyss navy; solid ivory buttons, flat dark panels, no gradients/emoji/sweeps, Cinzel + Cormorant + Manrope, three.js world (`src/components/World3D.tsx`, lazy-loaded; 2D `Ocean.tsx` is the no-WebGL fallback).

## Commands
- `pnpm dev` — web http://localhost:5280 (strictPort) + API :8787 (Vite proxies /api and /socket.io)
- `pnpm test` — vitest (tests/*.test.ts); `pnpm typecheck`; `pnpm build`; `pnpm start` (prod, serves dist/)

## Layout
- `shared/` isomorphic: `match.ts` (normalise + fuzzy), `scoring.ts` (tiers, priors, depth, zones), `dives.ts` (dive numbering, seeded selection), `data/` (questions: `people.ts`/`world.ts` + `bank-*.ts` in the compact `@id|Category|Text` bank format)
- `server/solo.ts` SoloService (inject `now`), `server/party.ts` PartyRoom (inject Clock), `server/index.ts` wiring
- `src/` React 19 + Tailwind v4 + motion; `lib/ocean.ts` global depth target; `components/Ocean.tsx` background world

## Conventions / decisions
- Answers never reach the client; all validation/scoring server-side. Don't import `shared/data` from `src/`.
- Dataset line format `Canonical|Alias:level:Ref` (level 0 obscure … 5 obvious), answers separated by `;` or newlines; names may contain `:`. Refs are chapter-level only (verse is stripped). Protestant canon, no Apocrypha. Accuracy > quantity; never invent names. Tests enforce no alias collisions.
- Questions are general (people, places, events, animals, roles, food & drink, objects, Jesus, faith…), never verse- or chapter-specific, never closed short lists. Tests enforce ≥8 answers, ≥4 distinct levels, a level ≥4 answer, no digits in question text. Difficulty 1/2/3 is computed from the three best-known answers (`difficultyOf`).
- Scoring: `share=(count+40*prior[level])/(total+40)` → fixed tiers 10/20/35/60/85/100. Stats count once per player-prompt, ≤3 per IP-hash/question/day.
- Timer is server-authoritative: deadline = opened_at + 3 s lead + 25 s; grace 1.5 s; reopen keeps clock.
- Dive prompts are materialised in `dive_prompts` on first use (stable history; a retired question id is swapped for a fresh one). Daily = 3 easy → 3 medium → 1 hard, 7 different categories (`selectDaily`, seeded streams per tier).
- Budget is $0: free data/tiers only, no paid APIs.
- Party rooms are in-memory (lost on restart). Turn-based: a question passes round the table in seat order; timeout = −1 life and it still passes on; after a full round, new question if anyone lost a life, else same question again (cap `maxRounds`, default 15, then everyone survives). Host settings: lives 1–5, turn 5–60 s, difficulty easy/medium/hard/mixed, round cap, topics. Starter rotates; 3 s reading lead; reveal board between questions; emoji reactions.
- Answer boards (`/api/board/:id`) only for prompts the player finished or non-live prompts; Free Dive never serves today's daily prompts.
- Original branding only — do not copy Krillion art/text/names.
- Git: commit with the user's configured identity; NO Co-Authored-By / AI attribution trailers (user instruction).

## Status (2026-11-23)
- Done: dusk redesign (ridgeline hills, sun path, silhouette boat, editorial cover), 417-question open-ended pool, Free Dive, answer boards with chapter links, streaks, verse of the day, turn-based Big Fish with settings + reactions, 468 tests passing, prod build.
- Ideas next: share image, PWA, Postgres port if hosting needs it.
