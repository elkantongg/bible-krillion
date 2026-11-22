# Into the Deep — the daily Bible dive

An open-answer Bible trivia game where **rarer correct answers score more** and your score sinks you into the ocean.
It plays in the genre of Krillion (krillion.io), with original code, visuals and branding. The Bible theme comes from the questions.

- **Daily dive**: 7 prompts, 25 seconds each, the same for everyone, one dive per day.
- **Archive**: play any past dive you missed.
- **Big Fish**: online multiplayer with room codes and invite links. Name an answer and pass the fish before its hidden clock runs out.

## Quick start

```bash
pnpm install
cp .env.example .env        # optional: the defaults work locally
pnpm dev                     # web on http://localhost:5280, API on :8787
```

Requires Node ≥ 22.13 (it uses the built-in `node:sqlite`, so no native build step) and pnpm.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server plus the API/socket server, with hot reload |
| `pnpm test` | Vitest: matching, dataset integrity, scoring, solo flow, party rules |
| `pnpm build` | Typecheck and build the client into `dist/` |
| `pnpm start` | Production: one Node process serves `dist/`, `/api` and `/socket.io` |

### Environment (`.env.example`)

| Var | Default | Notes |
| --- | --- | --- |
| `API_PORT` | 8787 | Dev API port (Vite proxies to it). In production, `PORT` is used. |
| `DB_PATH` | `./data/deep.db` | SQLite file, created automatically |
| `PLAYER_SECRET` | dev value | **Set a long random string in production.** It signs the anonymous player tokens. |
| `LAUNCH_DATE` | 2026-11-23 | The date of Dive #1 |

### Deploying (free tier)

Any host that runs a long-lived Node process with a persistent disk will work, for example Render, Fly.io or Railway.
Build with `pnpm install && pnpm build`, start with `pnpm start`, and point `DB_PATH` at the persistent volume.
WebSockets must be allowed. Party rooms live in memory, so a restart ends games in progress.

## How it plays

Landing → **Begin descent** → each prompt shows with "the clock starts in 3…" → 25-second answer window → the answer sinks through
the rarity tiers → result card → **Descend ▼** → … → prompt 7 → results screen (depth, zone, emoji grid, share, the most common
answer and a deep cut for each prompt).

- A wrong answer just bounces off ("no echo from the deep"), and you can keep trying until time runs out.
- If time runs out, the prompt scores 0 ("Nothing Landed").
- Every point sinks you 10 m. A perfect 700 reaches the trench floor at 7,000 m.

### Mechanics: verified vs assumed

I checked these on krillion.io on 2026-11-23 by playing part of a round:

- 7 prompts, 25 s each, same for everyone, one dive per day. There is an archive and themed/unlimited modes.
- Each point = 10 m, and 700 is "the trench".
- Discrete rarity tiers that top out at 100 points.
- A short "clock starts in N" lead-in, then a free-text answer.
- A wrong answer shows a "try again" message while the clock keeps running.
- When time runs out the prompt scores 0 with a "nothing landed" result, then "Descend" leads to the next prompt.
- The answer animates through the tier levels before the result card appears.
- Puffer Party (the multiplayer mode): pass-the-puffer, a hidden fuse randomised between 10 and 30 s that keeps running between turns and resets to 8 s if a pass leaves less than 8 s, and the last player still in wins. (Source: the Krillion FAQ.)

These are my assumptions, documented and consistent:

- **Tier thresholds and names.** My tiers are Surface Foam 10, Shallows 20, Reef 35, Rare Find 60, Deep Cut 85, Pearl of Great Price 100. The originals' exact cut-offs aren't public.
- **Rarity formula.** See below.
- **Lives in Big Fish.** You get 1–3 lives (default 2) and lose one each time the fish swallows you. I couldn't verify the original's lives.
- **Prompt after a pop.** A new prompt starts after each swallow, and also when a category runs out.
- **Results screen.** I designed it myself: the emoji share grid, "deeper than X%" percentile, and the most-said answer plus a deep cut. I didn't finish a live dive to compare it.

## Rarity scoring

```
share  = (count + K · prior(level)) / (total + K)        K = 40
prior  = [0.0008, 0.004, 0.012, 0.03, 0.07, 0.2] for curated level 0…5
points = first tier whose minShare ≤ share
         (≥12% → 10, ≥5% → 20, ≥2% → 35, ≥0.8% → 60, ≥0.2% → 85, else 100)
```

- **Cold start.** With no data, `share` equals the curated prior, so the dataset's commonness levels set the score.
- **Learning.** As real valid submissions accumulate, the empirical frequency takes over. K acts as 40 "pseudo-players".
- **Anti-manipulation.** Only the first locked answer per player per prompt counts toward the rarity stats. Each hashed IP adds to a question's stats at most 3 times per day. Answers are rate-limited and capped at 40 attempts per prompt.
- **Server-authoritative timing.** The deadline is stored server-side. Re-opening a prompt keeps the original clock, and late answers lock at 0.

## Question pool (511 prompts)

- **29 hand-written prompts** (`shared/data/people.ts`, `world.ts`), covering kings, prophets, animals, foods, parables, gems and more.
- **482 generated prompts** (`shared/data/generated.json`) built from [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata),
  which tags every person and place in all 31,102 verses. The generator (`scripts/build-questions.ts`) makes:
  - **Book prompts:** "Name a person / place / woman mentioned in {book}"
  - **Chapter-range prompts:** "Name a person mentioned in Genesis 1–10"
  - **Section prompts:** "Name a woman mentioned in the four Gospels"
  - **Word play:** names by first letter (Old Testament, New Testament, places), by exact length, and by ending ("-iah")
  - **Chapter pairings:** "Name a person who appears in a chapter alongside Elijah", only for well-known anchors
- **Accuracy:** every generated answer is a name the dataset tags in a verse inside the prompt's scope, and that verse is its reference.
  Gender is checked per person, not per name, so the man Noah doesn't count as a woman in Genesis. Old Testament passages that the
  dataset tags with "Jesus" as messianic are left out, so answers stay literal. Spelling variants are merged, and near-duplicate
  prompts are dropped.
- **Familiarity levels** come from how many verses mention a name. A hand-written rating is used as a minimum, so Eve stays "obvious"
  even though few verses mention her.
- **Daily mix:** 2 hand-written prompts plus 5 generated ones, with the generated five from different groups (no two from the same
  book). The generated pool runs about 96 days before it cycles, and about 97% of prompts don't repeat within a cycle.

Rebuild the pool (downloads about 50 MB of JSON into the gitignored `data/theographic/`):

```bash
pnpm questions:fetch && pnpm questions:build
```

**Licence:** `shared/data/generated.json` is derived from Theographic Bible Metadata by Robert Rouse, licensed
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). That file is shared under the same licence, and the game credits
it in How to play.

## Answer validation

Answers are checked against a question-specific dataset (`shared/data/`):

- **511 questions, about 36,000 answers.** Each answer has aliases or spellings, a commonness level and a scripture reference.
- **Normalisation.** Matching ignores case, accents, punctuation and spacing ("Tubal-cain" = "tubalcain"). It strips titles and fillers such as *King*, *Mount* and *Parable of the*, and handles simple plurals.
- **Typo tolerance.** Up to 1 edit for 4–7 letters and 2 edits for 8+, but only when one answer is clearly closest. A tie is rejected.
- **Real names never fuzzed in.** If the input is exactly a real biblical name from another question (for example "Moses" for *kings*), it is not fuzzy-matched into this question.
- **No AI.** The dataset is the only source of truth, so nothing invented can be accepted.
- **Hidden answers.** Answers never ship to the browser. Validation happens on the server.

**Canon/translation policy:** Protestant 66-book canon (no Apocrypha). Names follow common English translations (KJV, NIV, ESV),
with KJV/Greek-form aliases such as *Elias*, *Esaias* and *Jechonias*. A person mentioned in a passage counts. For example, Rahab
counts as a woman in the New Testament because of Heb 11:31.

To add a question, add a `q(id, text, category, block)` entry. The format is `Canonical|Alias:level:Ref`. `pnpm test` checks
for alias collisions, malformed lines and a spread of difficulty levels.

## Architecture

```
shared/   types, matching, scoring, dive selection, question dataset (used by both server and tests)
server/   Express + socket.io; SQLite via node:sqlite
  solo.ts   daily/archive dive service (server-authoritative timer, scoring, stats)
  party.ts  Big Fish room engine (pure logic, injectable clock → unit-tested)
  index.ts  HTTP API, player tokens, rate limits, sockets, static hosting
src/      React 19 + Tailwind v4 + Motion
  components/Ocean.tsx   layered ocean: colour ramp by depth, light rays, depth ruler, creatures, marine-snow canvas
  screens/               Home, Dive, Archive, Party (lobby/game/over)
tests/    vitest suites
```

**Players** are anonymous. The server issues an HMAC-signed id, which is kept in `localStorage`. No accounts and no paid services.

**Daily selection** is a seeded shuffle that cycles through the whole pool before any prompt repeats. Each dive's 7 prompts are
saved to the database the first time it's opened, so adding questions never changes a past dive.

## Differences from Krillion

- **Original design.** The name, branding, art, copy, tier names and depth captions are all new. The ocean includes a few small
  scripture captions (Jonah, Psalm 42, Job 41).
- **Big Fish vs Puffer Party.** It uses the same hot-potato mechanic, but with a "great fish" that opens its jaws as time passes,
  a configurable number of lives, and rarity badges shown on each answer.
- **SQLite instead of Supabase.** It's simpler to run solo and free. The schema is small, so it can be ported to Postgres if needed.
- **Not included.** Themed packs, unlimited mode, accounts and friends.
