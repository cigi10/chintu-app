# Studyloaf Plus: design notes

Status: proposal only. No payment code exists or should be written until the
"Before charging anything" list below is done. Written 2026-10-10 against
the app at commit `0459135`.

## TL;DR

- **Recommendation: run a minimal fake-door test now; do not build payments yet.**
  The card is honest ("coming soon, nothing is charged"), cheap, and reversible.
  It is the only way to learn whether anyone would pay before spending money
  on a Vercel Pro plan, GST advice and Razorpay onboarding.
- **Fix hosting first, regardless of Plus.** Vercel's Hobby plan is for
  non-commercial use only, and Vercel's fair-use page explicitly lists
  "the inclusion of advertisements, including ... Google AdSense" as commercial
  use. Studyloaf already runs AdSense on `/blog` and `/resources`, so the site
  is outside Hobby's terms today. Plus would add two more commercial triggers
  ("advertising the sale of a product or service" and "any method of
  requesting or processing payment").
- **Most "Plus candidates" are already free.** Cloud sync, the revision queue,
  per-subject mock charts, tracker progress and coin-bought cosmetics all ship
  free today, and the homepage promises sync is free. Plus has to be *deeper
  versions* of these, never a paywall on what users already have.
- **Traffic is very small** (5 Google search clicks in the 34 days to
  2026-10-03; about 45 user rows). A fake door at this size yields a small
  waitlist and qualitative signal, not statistical proof. Treat its result as
  "is there any pull at all", not as validation of a price.

## What the app is today

Everything below is free. Signed-in users get cloud sync for all of it;
guests keep data in the browser (`lib/storage.js`, synced keys in
`CLOUD_COLUMNS`).

| Area | What exists | Where |
|---|---|---|
| Focus timer | Study/break modes, sessions, coins per session, completion sounds | `/timer`, `components/StudyTimer.jsx` |
| Syllabus tracker | Exam packs (JEE, NEET, GATE CS/ECE/EE/ME/BT, more), per-topic status, per-subject and overall progress % | `/tracker`, `components/PortionTracker.jsx` |
| Countdowns | Per-exam countdown pages, D-days on the dashboard | `/countdown`, dashboard |
| Revision queue | Spaced-repetition ladder with suggested intervals, manual scheduling | `/revisions`, `components/RevisionQueue.jsx` |
| Mock tests | Log raw or percentile scores by subject, simple per-subject bar chart | `/mocktests`, `components/MockTests.jsx` |
| Stats | Minutes by subject, heatmaps | `/stats`, `components/StatsCharts.jsx` |
| Companion and shop | Companion with moods; 10 accessories and timer sounds bought with coins earned by studying | `/shop`, `lib/shopItems.js`, `lib/timerSounds.js` |
| Other | Todo, timetable and generator, goals, quizzes, Crumb game, journal, mood, digest, study rooms, blog and resources | various |
| Cloud sync | Every synced key, across devices, for any signed-in user | `lib/storage.js` |

Public promises that constrain Plus:

- Homepage (`components/Landing.jsx`): "Sign in with Google and your timer
  sessions, tracker, goals, and achievements sync across every device" and
  "Free to use".
- Terms (`app/terms/page.tsx`) describe storing data "so it can sync across
  your sessions and devices". There is no refund or paid-plan section.

## Proposed free vs Plus split

Principle: **nothing that is free today becomes paid.** Taking away sync or
the revision queue would break a public promise, and the app's tone is "no
shame system", which a bait-and-switch would undermine. Plus adds depth on top.

### Stays free

- Timer, all modes and the free sounds
- Basic tracker: every exam pack, topic statuses, progress percentages
- Countdowns and D-days
- Cloud sync across devices (already free and promised; see "Cloud sync" below)
- Revision queue as it is today (manual scheduling)
- Mock score logging and the current per-subject chart
- Shop items bought with earned coins
- Everything else listed above

### Plus candidates

| Candidate | Free today | What Plus would add | Verdict |
|---|---|---|---|
| Syllabus analytics | Progress % per subject | Pace vs exam date ("at this rate you finish Networks 3 weeks late"), weakest topics, weekly change | **Strong candidate.** New value, uses data users already enter. |
| Mock-score trends | One bar chart per subject | Rolling averages, best/worst, percentile targets, cross-subject view, trend vs syllabus progress | **Strong candidate.** Natural pair with syllabus analytics. |
| Revision queue | Manual spaced repetition | Automatic scheduling from tracker status and mock weak spots, a daily "due today" list, optional reminders | **Candidate.** Reminders need an email or push channel that doesn't exist yet. |
| Companion cosmetics | 10 coin-bought items | Plus-only outfits, never sold for coins and never sold *as* coins | **Candidate, low risk.** Selling coins would cheapen the earned-reward loop, so keep the two economies separate. |
| Cloud sync | Free for every signed-in user | Only things that don't exist yet: version history, restore a deleted tracker, export | **Keep sync free.** Charging for it reneges on the homepage promise and would hit the users most likely to stay. |

## Pricing options

These are starting points for the fake door and for later testing, not
researched benchmarks. Indian students are price-sensitive and usage is
seasonal, so both options are kept low.

| | Option A: monthly | Option B: exam-season pass |
|---|---|---|
| Price (proposal) | ₹79 per month | ₹299 one-time |
| Covers | Rolling monthly | Purchase date to 31 May 2027 (covers GATE in February, JEE Main sessions, JEE Advanced and NEET UG; confirm each 2027 date before selling) |
| Razorpay flow | Subscriptions with a UPI Autopay mandate (cards as fallback) | Standard Checkout or a Payment Link, a single UPI or card payment, no mandate |
| Gateway fee (per Razorpay's published pricing, verify at signup) | 2% + 18% GST on the fee, about 2.36%: ₹1.86, net about ₹77 | Same rate: about ₹7.06, net about ₹292 |
| Pros | Predictable revenue; easy to cancel | Matches how students actually use the app (heavy before exams); one payment, no mandate failures; easier to explain refunds |
| Cons | Mandate setup friction; failed renewals; churn right after each exam | Revenue is lumpy; the end date must be clear at purchase |

**Leaning:** Option B first. It fits seasonal usage, avoids recurring-mandate
complexity, and a fixed end date is easy to state honestly. Add monthly later
if people ask for it.

### Razorpay and UPI notes

- UPI Autopay recurring debits up to ₹15,000 per transaction need no
  additional authentication under current RBI rules, so either price is well
  inside that limit. The customer approves the mandate once in their UPI app.
- Razorpay charges no setup or annual fee for standard pricing. Subscriptions
  on cards carry an extra subscription fee on top of the gateway rate.
- Account activation needs KYC (PAN, bank account) and a review of the
  website. Expect them to look for pricing, terms, privacy, refund and
  cancellation, and contact pages that are live and consistent. Check their
  current activation checklist rather than relying on this list.
- Payment confirmation must come from Razorpay's webhook, verified with its
  signature on the server, never from the browser redirect alone.

## Before charging anything

Each item is a blocker for taking money, not for the fake door, except the
first one, which applies today.

1. **Hosting plan.** Move the Vercel project to Pro (or another host that
   allows commercial use). This is already needed because of AdSense,
   independent of Plus.
2. **GST and tax: questions for an accountant**
   - Do I need GST registration now, given the services threshold (₹20 lakh
     aggregate turnover in most states, ₹10 lakh in special-category states),
     or is voluntary registration better for Razorpay or for claiming input credit?
   - Does Razorpay require a GSTIN for an individual or sole proprietor below
     the threshold?
   - How is a digital subscription sold to a student outside India treated
     (export of services, OIDAR rules)?
   - Which business structure (sole proprietorship, presumptive taxation, an
     LLP) makes sense at this revenue?
   - What records and invoices must I issue for each payment?
3. **Refund policy.** Write one: for example, a full refund within 7 days if
   Plus doesn't work for you, pro-rated or none after that; what happens to a
   season pass if an exam is postponed. Publish it as a page and link it from
   checkout.
4. **Terms of service.** Add a paid-plan section: what Plus includes, the
   price and billing period, auto-renewal and how to cancel (Option A), the
   season-pass end date (Option B), what happens to data and features when
   Plus ends (data is kept and free features keep working), and that prices
   include GST if registered.
5. **Privacy policy.** Add Razorpay as a processor and state that card and UPI
   details go to Razorpay, never to Studyloaf.
6. **Entitlements.** Plus status must be checked on the server (a table
   written only by the verified webhook), never trusted from the browser.
7. **Support.** A way to reach a human about a payment, answered within a
   stated time.

## Minimum fake-door test

Goal: find out whether signed-in users show any interest in Plus, before any
spending. Nothing is sold, nothing is charged, and the card says so.

**What:** a small "Studyloaf Plus: coming soon" card on `/profile` (the
nearest thing to a settings page) and at the bottom of `/shop`. It lists the
Plus candidates above, says "Everything that's free today stays free" and
"Coming soon, nothing is charged", and has a "Notify me" button.

**Flow:**
1. The card renders: GA4 `plus_interest` with `step: "view"`.
2. The visitor taps "Notify me": `step: "open"`, and an email field and the
   same consent checkbox as the email list appear.
3. They submit: a row is recorded in `email_signups` with
   `source_page = 'plus_waitlist'`, or, if the address is already on the
   list, `plus_waitlist_at` is set on the existing row. `step: "signup"`.

Both pages require sign-in, so the audience is people who already use the
app, which is who would pay.

**Run for:** 6 weeks, to 2026-11-30 (before GATE crunch, so it measures
interest rather than panic).

**Decision rule (judgment calls, not statistics, given the sample size):**
- **Go to the "before charging" list** if at least 10 people join the waitlist
  *and* at least 15% of signed-in users who saw the card tapped "Notify me".
- **Rework the offer** if people open but few sign up (the features or the
  framing don't land).
- **Park Plus** if almost nobody opens it. Spend the time on traffic and
  retention instead, then rerun.

**Also read:** "What's missing?" feedback over the same period. If the same
requests come up, they may be better Plus features than this list.

**Remove the card** when the test ends, whichever way it goes, so it doesn't
promise something indefinitely.
