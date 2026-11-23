# CLAUDE.md — BIBLIO (Bible daily ascent)

Krillion-style Bible trivia: 7 open-answer prompts × 25 s, rarity-based points, 10 m of altitude per point (700 = 7,000 m), climbing through tiers of heaven.
Modes: daily ascent, archive, Free Flight (unlimited practice, 3 feathers), Chariots (online turn-based party via room code / link).
Theme: one ascent, in order — the lake at dusk (boat) → the open sky (birds) → through the middle of the clouds (rainbow) → above the clouds, where only cloud lies below and a golden castle-city (Revelation 21) draws nearer as you climb. The cover (0 m) is a clear dusk — indigo → violet → orange, stars, hills, lake, boat, no cloud; as you climb the land sinks into haze and the cloud deck fades in gradually (`uFade`, ~30→820 m) — keep that transition gradual, never a cut. Sky + volumetric clouds are ray-marched in one low-res background pass (`World3D.tsx` BG_FRAG, 3D Perlin–Worley noise); the castle is procedural (lathe towers, merged per material) with env reflections, shadows and bloom. Once the castle is in sight (above the clouds) the heavenly host appears — feathered angels (`world/angels.ts`: three-joint wings with real feather rows, pleated flowing robes; flyers circling, trumpeters at the gate, angels on a stairway of light) and chariots/horses of fire (`world/fire.ts`: flame particles on a galloping skeleton) — none below the clouds. Music is generated live (`lib/music.ts`: choir, harp, bells, fanfares at the cloud top and the gates; starts on first gesture, follows the mute button). Smoothness: all shaders are pre-compiled after the first frame (`warm`), the shadow light stays enabled (toggling it recompiles), and a frame-time governor steps resolution/ray-march steps down on slow devices. Keep the quality bar: no crude primitives or cartoon figures; never scale an instanced mesh to ~0 (NaN normals → bloom blacks out the screen). Never depict God.
Internal names still say dive/depth (routes `/dive`, `/free`, `/party`, `dive_prompts`, `setDepth`, tier keys) — user-facing copy says ascent/altitude.
Look: quiet, editorial — ivory/soft gold on a dusk-to-abyss navy; solid ivory buttons, flat dark panels, no gradients/emoji/sweeps, Cinzel + Cormorant + Manrope, three.js world (`src/components/World3D.tsx`, lazy-loaded; 2D `Heavens.tsx` is the no-WebGL fallback).

## Commands
- `pnpm dev` — web http://localhost:5280 (strictPort) + API :8787 (Vite proxies /api and /socket.io)
- `pnpm test` — vitest (tests/*.test.ts); `pnpm typecheck`; `pnpm build`; `pnpm start` (prod, serves dist/)

## Layout
- `shared/` isomorphic: `match.ts` (normalise + fuzzy), `scoring.ts` (tiers, priors, depth, zones), `dives.ts` (dive numbering, seeded selection), `data/` (questions: `people.ts`/`world.ts` + `bank-*.ts` in the compact `@id|Category|Text` bank format)
- `server/solo.ts` SoloService (inject `now`), `server/party.ts` PartyRoom (inject Clock), `server/index.ts` wiring
- `src/` React 19 + Tailwind v4 + motion; `lib/sky.ts` global altitude target + air colours; `components/World3D.tsx` 3D world, `components/Heavens.tsx` 2D fallback

## Conventions / decisions
- Answers never reach the client; all validation/scoring server-side. Don't import `shared/data` from `src/`.
- Dataset line format `Canonical|Alias:level:Ref` (level 0 obscure … 5 obvious), answers separated by `;` or newlines; names may contain `:`. Refs are chapter-level only (verse is stripped). Protestant canon, no Apocrypha. Accuracy > quantity; never invent names. Tests enforce no alias collisions.
- Questions are general (people, places, events, animals, roles, food & drink, objects, Jesus, faith…), never verse- or chapter-specific, never closed short lists. Tests enforce ≥8 answers, ≥4 distinct levels, a level ≥4 answer, no digits in question text. Difficulty 1/2/3 is computed from the three best-known answers (`difficultyOf`).
- Lenient answers (`resolveAnswer`): exact/alias/typo match first; else if the typed keywords (stemmed, synonyms folded via `SAME`, filler and question-text words dropped) mean exactly one answer, it is accepted as that answer ("elijah went up in a whirlwind" → Chariot of fire). Guards: no prefix/typo guesses when auto-accepting, a lone owner name ("Peter" → Peter's mother-in-law) or another person/place's name on non-event questions only suggests. If a few answers fit, the server returns `suggestions` → "did you mean …?" chips. A test keeps wrong auto-accepts under 0.5%.
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
