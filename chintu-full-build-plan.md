# CHINTU — चिंटू — FULL BUILD PLAN
## Everything ships. One version. No phases.
### Single source of truth · June 2026

---

## HOW TO USE THIS DOCUMENT

This is the only planning document, and it describes the complete product — not a v1 with things deliberately held back. Hand this whole file to any AI coding assistant at the start of any session. There is no "later list" here; everything described is meant to be built.

If you're an AI reading this: build exactly what's described. If something seems missing, it's an oversight to flag, not a deliberate cut to respect.

---

## PART 1 — THE PRODUCT, IN ONE PARAGRAPH

Chintu is a full study companion system for students preparing for JEE, NEET, SAT/ACT, A-Levels, GCSEs, Gaokao, GRE/GMAT, and placements — built around a small calico cat the user names themselves. Every study action earns coins. Coins buy room decor, wearables, an outdoor space, and eventually a second companion. The cat reacts to everything — studies alongside the user, celebrates milestones, waits quietly when they're away, and never shames them for missing a day. Underneath the companion sits a complete, connected toolkit: timer, timetable, portion tracker, mock-score tracker, revision queue, to-do list, stats, weekly digest, focus mode, accounts with cloud sync, and live study rooms. Everything is free at launch — no paywall under this plan.

---

## PART 2 — WHY THIS PRODUCT, WHY THIS NAME

Every other study app treats students like productivity machines. Chintu treats them like kids — because that's what they are. A 17-year-old preparing for JEE is a child carrying an adult's pressure. They don't need a coach. They don't need an AI therapist. They need a small, silly, loveable companion who just sits with them while they study, cheers when they finish a chapter, and looks sleepy when it's 1am.

Students preparing for these exams study in real emotional isolation. Existing apps either punish missed days with broken-streak shame, or were built for a different student with no cultural or emotional context for what this actually feels like. Nobody has built a study companion that feels like it belongs to the person using it.

The name is Chintu. That's the character, the brand, and the emotional thesis, all in one word.

---

## PART 3 — THE AI BOUNDARY (PERMANENT, NON-NEGOTIABLE)

This is the most important design decision in the product, and it doesn't change regardless of how much else gets built.

**Chintu communicates through:**
- Expressions and animations across 12 emotional states (full list in Part 8)
- Short, practical, multiple-choice check-ins only — never open-ended, never emotionally probing
- Celebration reactions when sessions, chapters, or milestones are completed

**Chintu never:**
- Asks how the student feels emotionally
- Gives advice about stress, mental health, or motivation
- Tries to be a therapist, mentor, or counselor
- Generates open-ended language-model text that could be misread in a dark moment

**Where AI is actually used — minimal, by design, even in the full build:**
- Initial study-plan generation (exam date + syllabus → a starting schedule), once per student
- Everything else — portion tracking, check-ins, streak logic, scheduling, mock-score trends, revision surfacing — is rule-based logic, not a language model. More features does not mean more AI surface area; it means more deterministic logic.

**The mental health boundary, made concrete:** a persistent, quiet footer link to iCall (India: 9152987821, free and confidential) appears on every screen. If a student types something into any text input that contains a clear distress signal, the only response is one pre-written sentence: "This sounds hard. Please talk to someone who can actually help — iCall: 9152987821, free and confidential." Then nothing else.

---

## PART 4 — FULL SYSTEM LIST

Every system below ships. They're grouped by what they're for, not by priority.

### 4.1 Timer (the heartbeat)
- Pomodoro (25/5) and custom duration modes
- **Custom presets saved per subject** — e.g. Maths = 50/10, Reading = 25/5 — remembered automatically next time that subject is selected
- One-tap start from the dashboard
- Session optionally tied to a subject pulled from the tracker or timetable
- Chintu animates during the session (studying pose), happy + bounce on completion, sleepy after 10pm local time regardless of activity
- Soft chime on completion via Web Audio API
- **Focus Mode**: one tap when starting a session visually locks the screen to the timer — navigation is hidden/disabled until the session ends or is deliberately stopped, removing the temptation to wander off mid-session
- Coin rates: Pomodoro complete = +10. Custom session = +1 per 3 minutes. First session of the day = +5 bonus. **First session of the week (Monday, or first day back) = +10 bonus**, stacks with the daily bonus
- Session log stored, feeds stats and the weekly digest

### 4.2 Timetable
- Visual weekly grid: 7 days × 8 time slots (5am, 7am, 9am, 11am, 1pm, 3pm, 6pm, 9pm)
- Each slot: subject + color (from the locked palette, Part 9) + optional note
- Mobile default: single-day view with swipe/arrows; week grid as a toggle
- Chintu in the corner, mood reflects % of week filled
- Drag-and-drop rearranging of filled slots
- Clear-slot option in the edit modal
- **Year-at-a-glance D-Day strip** above the grid — a simple horizontal countdown of all upcoming exam dates, lighter weight than a full calendar but more visible than a single closest-D-Day

### 4.3 Portion Tracker (syllabus)
- Exam pack selected at onboarding (full list, Part 6)
- Pre-loaded topics for JEE, NEET, SAT/ACT, A-Levels, GCSEs, Gaokao, GRE/GMAT, Placements
- Custom mode always available alongside any pack
- 4-state cycle per topic: Not started → In progress → Done → Needs revision
- +5 coins per topic completed, +25 bonus per full subject completed
- Chintu's mood on this page reflects overall progress
- Switching packs warns that progress resets

### 4.4 Revision Queue (its own dedicated page, not just a dashboard mention)
- Every topic marked "Done" automatically schedules a revision reminder using spaced-repetition timing (default first revision at 7 days, with further intervals after that if marked done again)
- A clean daily list: "What's due for revision today" — pulled from across every subject, not buried inside the tracker
- This is the single most-cited reason students fall behind close to an exam, so it gets a dedicated home rather than living as a side-effect of the tracker

### 4.5 Mock Test Score Tracker
- Log a score per mock test: exam pack, subject(s), date, score (raw or percentile, student's choice), optional notes
- A simple line chart per subject showing score trend over time
- This is the number JEE/NEET/SAT students actually obsess over, and nothing else in the system currently captures it

### 4.6 Dashboard (the daily hub)
- Time-of-day greeting using the cat's name
- Chintu shown in his current room scene, day/night by device local time
- D-Day strip (unlimited dates — no cap)
- Today's timetable slots, pulled in automatically
- Today's top 3 to-do items, pulled in automatically
- Today's revision items due, pulled in automatically
- Quick stats row: today's focused hours, coins earned today, streak shown softly
- One-tap "Start studying" button
- "What are you studying today?" single-tap subject picker, pre-filling the timer

### 4.7 To-do list
- Nested tasks (a topic can have subtasks)
- Due dates, priority shown as color (high/medium/low)
- Complete a task = +2 coins
- Today's top 3 auto-surface on the dashboard
- Minimal UI, Chintu only appears for a brief "all done!" state

### 4.8 Stats
- Daily study hours bar chart, weekly and monthly views
- Subject breakdown
- Mock score trend lines (pulled from 4.5)
- Streak counter
- Clean enough to screenshot and share, no Chintu presence on this page

### 4.9 Weekly Digest
- Once a week (configurable day, default Sunday evening), a soft full-screen summary: "This week with {name}: 14 hours, 3 subjects, longest streak 5 days, 2 mock tests logged"
- Distinct from the always-available stats page — this is a moment, not a dashboard
- Cheap to build, strong emotional payoff, and gives the weekly-bonus mechanic (4.1) something to point back to

### 4.10 Shop (the core reward loop)
- Chintu shown in his indoor room (and, once unlocked, the outdoor space)
- Owned/equipped items in their actual scene slots
- Buy/equip controls, lock state for unaffordable items
- Day/night switching visible in the room preview
- Everything reachable purely through studying — no real-money purchases of coins
- **Outdoor scene as a coin-unlockable second space** — once unlocked, the shop gains a second tab/area with its own props (grass, sky that shifts with day/night/sunset, outdoor-specific items), giving the coin sink somewhere new to go once the indoor room fills up
- **A second companion**, unlockable with a large coin milestone — a different animal (not a second cat) that appears alongside Chintu once unlocked, giving long-term players something to work toward beyond decor

### 4.11 Accounts and Cloud Sync
- Login (email or a simple OAuth option), backed by Supabase
- All localStorage-equivalent data (timetable, tracker, to-do, timer history, mock scores, coins, shop ownership, streak) migrates to account-based cloud storage
- Cross-device sync — start a session on the phone, see progress reflected on the laptop
- Data export (CSV) of session history and mock scores, available any time, no minimum data threshold required

### 4.12 Study Rooms
- Live, anonymous presence — "47 students online right now" per room
- Default rooms: JEE Physics, NEET Bio, Placement DSA, Free Study, plus any others that make sense per pack
- No chat, no names, no profiles, no video/audio — purely an ambient presence count
- Joining a room opens a full-screen timer with Chintu in the corner and a soft "X others studying with you" counter
- The count pulses gently above 10 users; a room at 0 shows "Be the first today 🌅"
- Leaving the page removes presence automatically
- **Friend pairing (opt-in)**: a simple invite-code system to see a friend's streak alongside your own, anonymous by default to everyone except the person you've explicitly shared a code with — not a social feed, not chat, just a quiet shared accountability view

### 4.13 Journal
- One daily text box: "What did I do today?" — no prompts, no guided reflection, no emotional questions
- Private, never shared, never AI-analyzed — a log, not therapy
- Uses the `mood-thoughtful` companion pose

### 4.14 Mood Check-in + History
- A simple, low-friction daily check-in using a small icon set (not a text journal — a tap-based mood log)
- A private history graph over time
- Handled with the same privacy stance as the journal: never shared, never AI-analyzed, purely for the student's own pattern-noticing

### 4.15 Offline-first support (PWA)
- The app should function reasonably well without an active connection — timer, timetable, tracker, and to-do list all need to work offline and sync once connectivity returns
- This matters specifically because exam-week wifi/data reliability is a real, common problem for this exact user base

---

## PART 5 — THE GUILT-FREE STREAK SYSTEM (NON-NEGOTIABLE)

- Streak = consecutive days with at least 1 completed timer session
- Displayed as "X days with {name}" — never a bare number with a fire emoji, never red, never "broken"
- Miss 1 day: nothing changes visibly
- Miss 2+ days and return: "{name} is happy you're back. Want to start with something small?" — one button, no mention of how long they were gone
- Miss 5+ days: one extra line — "{name} saved your spot. 🌸" — still no day count mentioned
- After 3 resets in 7 days with zero sessions: "Hey, everything okay?" — two options, "I'm okay, let's go" / "Not really." "Not really" quietly surfaces the iCall number, no alarm styling
- Streak Shield (earnable shop item, 150 coins, never purchasable with money): absorbs one missed day silently when equipped, then is consumed, with a small positive animation on activation
- The phrase "streak broken" must never appear anywhere, in any context
- Friend-paired streaks (4.12) follow the exact same guilt-free rules — a friend's missed day is never flagged or compared negatively

---

## PART 6 — EXAM PACKS

Shipped as structured data, not hardcoded per screen, so adding a new pack later is a content task.

| Pack | Region | Subjects |
|---|---|---|
| JEE (Main + Advanced) | India | Physics, Chemistry, Maths |
| NEET | India | Physics, Chemistry, Biology |
| SAT / ACT | USA | Reading & Writing, Math (+ Science for ACT) |
| A-Levels | UK + Commonwealth | Modular — student picks 3–4 subjects |
| GCSEs | UK | Modular — student picks subjects |
| Gaokao | China | Chinese, Maths, Foreign Language, + Science or Humanities track |
| GRE / GMAT | Global | Verbal, Quant, Analytical Writing / Data Insights |
| Placements / Interview Prep | Global | Fully custom |
| Custom | Global | Fully custom, always available alongside any pack |

JEE and NEET ship with full standard syllabus topics pre-loaded since they're the founding use case; other packs ship with a solid topic list from day one rather than being deferred.

---

## PART 7 — ONBOARDING FLOW

1. Welcome screen
2. Pick exam pack (Part 6)
3. Name the cat — text input + inspiration chips (Pip, Mochi, Tofu, Walnut, Biscuit, Bun), stored as `companionName`, never hardcoded
4. Optional: set first D-Day(s)
5. Optional: create an account now or continue locally and link an account later (account creation should never block first use)
6. Land on the dashboard, already populated with the chosen pack's topics

---

## PART 8 — THE COMPANION: CHINTU THE CALICO CAT

### 8.1 Species and look
Chintu is a calico cat — cream base with ochre and grey-brown patches — drawn in **flat color, no shading or gradients.** Every state needs a transparent PNG at 1000×1000px source, all anchored to the same ground-contact point so the character doesn't visually "jump" between moods.

Since there's no shading, contrast comes from outline weight and color values alone. Before drawing all 12 mood states, draw one test pose and check it at the actual small sizes it'll appear at (32–48px navbar icon, app icon, shop thumbnail). If the cream washes out, darken it slightly or thicken the outline — don't reintroduce shading to fix it.

### 8.2 The 12 emotional states
| # | Filename | What it looks like | Where it's used |
|---|---|---|---|
| 1 | `mood-studying.png` | Focused, looking down at a book | Timer: during session |
| 2 | `mood-happy.png` | Light bounce, small celebration | Session complete, task complete |
| 3 | `mood-sleepy.png` | Droopy eyes, slight slouch | After 10pm local time |
| 4 | `mood-waiting.png` | Neutral, looking up expectantly | Dashboard: no session yet today |
| 5 | `mood-worried.png` | Subtle concern, ears slightly back | Tracker: meaningfully behind pace |
| 6 | `mood-celebrating-big.png` | Arms up, energetic, bigger pose | Major milestones: 100% syllabus, 30-day streak, mock score improvement |
| 7 | `mood-cozy.png` | Relaxed, half-closed eyes | Evening hours, outdoor scene |
| 8 | `mood-thoughtful.png` | Looking gently down/away, calm | Journal page |
| 9 | `mood-curious.png` | Head tilted, ears forward | Onboarding, exploring a new feature for the first time |
| 10 | `mood-determined.png` | Focused, slightly forward-leaning | Long Focus Mode sessions, mock test day |
| 11 | `mood-surprised.png` | Wide eyes, small startle | Unexpected milestone (e.g. unlocking the second companion) |

### 8.3 Wearables — 8 shop items
| Item | Filename | Position | Coin cost |
|---|---|---|---|
| Little glasses | `wear-glasses.png` | Face | 75 |
| Tiny scarf | `wear-scarf.png` | Neck | 100 |
| Graduate cap | `wear-gradcap.png` | Top of head | 180 |
| Winter beanie | `wear-beanie.png` | Top of head | 90 |
| Bow tie | `wear-bowtie.png` | Neck | 60 |
| Tiny backpack | `wear-backpack.png` | Back | 120 |
| Flower crown | `wear-flowercrown.png` | Top of head | 80 |
| Exam warrior headband | `wear-headband.png` | Forehead | 150 |

Each wearable should work cleanly on at least `studying`, `happy`, and `waiting` poses.

### 8.4 Indoor room scene
Layers positioned with CSS percentage coordinates, not baked into one image, so items can be independently owned/equipped at any screen size.

**Backgrounds:** `scene-indoor-day.png`, `scene-indoor-night.png` (warm dark plum night palette, never pure black)

**Base furniture (always present):** `prop-desk.png`, `prop-window.png` (sky behind it shifts with day/night)

**Purchasable desk props:** Chai cup (50), Stack of books (120), Small plant (80), Desk lamp (150), Pencil holder (40)

**Purchasable wall props:** Star chart (100), Motivational poster (90), String lights (130)

**Purchasable floor props:** Bookshelf (200), Floor rug (110)

**Streak Shield:** `item-streak-shield.png`, 150 coins, earn-only, functional (see Part 5)

### 8.5 Outdoor scene (full feature, not deferred)
- Unlocked via a coin milestone (single unlock price, not a separate currency)
- Own background set: day/sunset/night sky, day/evening/night grass, soil/ground
- At least 4–6 outdoor-specific props (e.g. a small study mat, a tree, string lanterns, a kite, a tiffin box, a cycle) to give the space its own identity rather than feeling like a recolored indoor room
- Chintu's `cozy` mood pose is the default here in evening hours

### 8.6 Second companion
- A different animal (not a second cat) — pick something that pairs visually without competing (e.g. a small bird or dog), unlocked at a large coin milestone
- Appears alongside Chintu in the room scenes once unlocked, doesn't need its own full 12-mood set — a smaller set of 3–4 simple states is enough since it's a companion-to-the-companion, not a second protagonist

### 8.7 App icon
`icon-app.png` — simple version of Chintu, single happy or waiting pose, square crop, legible from 16px to 512px.

### 8.8 Full art asset count
12 mood states + 8 wearables + indoor scene (2 backgrounds + 2 base furniture + 10 purchasable props + streak shield) + outdoor scene (3 sky + 4 ground/grass states + 4–6 props) + second companion (3–4 simple states) + 1 app icon.

---

## PART 9 — COLOR, TYPOGRAPHY, LOCKED VISUAL SYSTEM

Locked. Do not change without explicit sign-off.

### 9.1 UI palette
- Primary action (buttons, active nav, coins): `#9B6FD4` — Deep Plum
- Soft background pill/tag: `#E7BEF8` — Soft Lilac
- Secondary/info: `#93ABD9` — Blueberry Milk
- Energy/reward accent: `#EDE986` — Lemon Cream
- Done/positive: `#7EC8A0`
- In progress: `#93ABD9`
- Needs revision: `#F9C060`
- Streak/celebration accent: `#F2619C` — the only place pink appears anywhere in the UI

### 9.2 Backgrounds
- Day: `#FBF3FF` · Evening: `#F5DDF7` · Night: `#1E1428` (warm dark plum, never cold black)

### 9.3 Chintu's calico coloring (flat, no shading)
- Cream base: `#EEDBB5` · Ochre patches: `#C98A4B` · Grey-brown patches: `#9A8C7A`
- Belly/light patch: `#FAF1DD` (small areas only)
- Cheek blush / celebration pink: `#F2A6B8`

### 9.4 Navy — replaces black everywhere
- Outline/line art: `#2E2A4A`
- Primary text, day: `#241F3D` · Primary text, night: `#EDE8FB`
- Secondary text/timestamps: `#6E6688`
- Rule: anything that would default to black uses `#2E2A4A` instead. No exceptions.

### 9.5 Outdoor scene colors
- Day sky `#D4EEFF` · Sunset sky `#FFB8D0` · Night sky `#2A1E4A`
- Day grass `#B8E0A0` · Evening grass `#7AB860` · Night grass `#1A3A20` · Soil `#C4956A`

### 9.6 Typography
- Headers: Fredoka or Baloo 2 · Body: Nunito · Timer/numbers: monospaced or tabular figures
- Never Comic Sans, never a default system font

### 9.7 Day/night switch
- 6:00am = day, 6:00pm = night, 400ms CSS crossfade, device local time, calculated once in a shared module

---

## PART 10 — TECHNICAL FOUNDATION

**Platform order:** Web app first (zero app-store wait, fastest iteration, usable on a laptop). Android second (majority of the target demographic, push notifications matter for habit formation — "Chintu misses you"). iOS deprioritized given margins and where this demographic actually is.

**Stack:** React/Next.js frontend, Tailwind CSS, Supabase for auth, database, and realtime presence (study rooms), Vercel for hosting.

**Accounts:** built from the start, not deferred — Part 4.11 is a full system, not an afterthought, since cloud sync and study rooms both depend on it.

**Offline support:** PWA with local caching/sync for the core daily-use tools (timer, timetable, tracker, to-do), per Part 4.15.

**Realtime:** Supabase Realtime presence for study rooms — no video, no audio, no chat, just an anonymous count. Technically lightweight, emotionally significant.

**Character animations:** CSS/SVG-driven, with full illustrated calico art (Part 8) replacing placeholder art before launch rather than after.

---

## PART 11 — KNOWN BUG, FIX FIRST

The current build has a horizontal-overflow problem on mobile — the page renders wider than the viewport, the bottom nav clips on the right edge, and zooming out is needed to see the page fully. Fix this before any new feature or art work goes in.

**Checklist:**
- [ ] Confirm `<meta name="viewport" content="width=device-width, initial-scale=1">` is present
- [ ] Search for any element using a fixed pixel `width` instead of `max-width`, `%`, or `100vw`
- [ ] Check the bottom nav component specifically
- [ ] Test at 375px and 390px widths
- [ ] Rework the timetable's subject color-picker swatches to draw from the Part 9 palette

---

## PART 12 — FILE AND FOLDER STRUCTURE

```
app/
  (onboarding)/
  (dashboard)/
  (timetable)/
  (timer)/
  (tracker)/
  (revisions)/
  (mocktests)/
  (todo)/
  (stats)/
  (digest)/
  (shop)/
  (rooms)/
  (journal)/
  (mood)/
  (account)/
components/
  companion/
    Companion.jsx
    companionMoodLogic.js
    companionDialogue.js
  shared/
    Navbar.jsx
    BottomNav.jsx
    Button.jsx
    Modal.jsx
    SceneBackground.jsx
  dashboard/ timetable/ timer/ tracker/ revisions/ mocktests/ todo/ stats/ digest/ shop/ rooms/ journal/ mood/
lib/
  streakLogic.js
  coinLogic.js
  dayNightLogic.js
  revisionLogic.js        ← spaced-repetition scheduling
  focusModeLogic.js
  examPacks/
    index.js
    jee.js / neet.js / sat.js / alevels.js / gcse.js / gaokao.js / gre.js / placements.js / custom.js
  storage.js               ← local + cloud sync keys, named constants
  supabase/
    client.js
    auth.js
    presence.js            ← study room realtime
public/
  companion/               ← 12 mood PNGs
  wearables/                ← 8 wearable PNGs
  scene/
    indoor/                ← backgrounds + props
    outdoor/                ← sky states + grass states + props
  companion2/               ← second companion's small state set
  icons/
    icon-app.png
```

---

## PART 13 — BUILD ORDER

Not phased into "ship now / ship later" — everything is in scope. This is the sequence that minimizes rework, since later systems depend on earlier ones (accounts before sync, timer before stats, etc).

1. **Fix the mobile bug** (Part 11) — before anything else
2. **Foundation**: file structure, storage/coin/day-night logic, Supabase project + auth wired in from the start
3. **Onboarding**: exam pack data, cat naming, account creation step
4. **Core loop**: timer (with Focus Mode and presets), timetable, dashboard wired to both
5. **Tracker + Revision Queue** (the revision queue depends on the tracker's "Done" state, build it right after)
6. **To-do list**, wired into the dashboard
7. **Mock test tracker**, wired into stats
8. **Stats + Weekly Digest**
9. **Streak system + Streak Shield + guilt-free reset logic**
10. **Shop**: indoor room first, then outdoor scene, then second companion as the final unlock tier
11. **Study rooms**: realtime presence, then friend pairing on top of it
12. **Journal + Mood check-in** (lower interdependency, can slot in alongside any of the above)
13. **Cloud sync + cross-device + data export**, once everything above has real data to sync
14. **Offline/PWA support** — wrap this around the finished core tools
15. **Full art pass**: all 12 moods, both scenes, second companion, app icon — replacing any placeholder art
16. **Full mobile/desktop QA pass**, every page, both viewport widths
17. **Ship, then share with real students and start iterating from actual feedback**

---

## PART 14 — OPEN QUESTIONS (GENUINELY UNDECIDED)

1. **Product/app name** — decide before any public sharing
2. **Landing page design** (pre-onboarding) — not specified here
3. **Outdoor scene unlock model** — single price vs. tiered
4. **Second companion species** — needs a final pick
5. **Whether to ever monetize, and how** — explicitly deferred, not designed here

---

*End of plan. Everything in this document is in scope. There is no later list.*
