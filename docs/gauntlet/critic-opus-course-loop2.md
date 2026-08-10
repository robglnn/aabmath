# FAIL

**Critic:** `claude-opus-5` (Claude Code CLI), fresh context, did **not** build the remediation
**Date:** 2026-08-08
**Claim under test:** `docs/gauntlet/remediation-opus-course-gate.md` — "the gate-integrity remediation closes the loop-1 largest gap enough that mastery is no longer trivially gamed by answer recall alone"
**Method:** production build (`npm run build`), `vite preview` on :4174 at a **1100×620** viewport, live play — walked to `lesson_board_1`, ran L1 objective→teach→guided→independent, failed the gate, retried, passed, closed, opened the Progress Report at `progress_pedestal` in EN/ES/PL; then seeded `completedLessons` to reach `lesson_board_5` and `lesson_board_11` and played both. Plus a full static audit of all 30 packs / 508 items.

---

## Verdict

Every one of the seven re-critic bars the remediation itself nominated **passes**. The claim they were meant to establish does not.

The remediation removed *one* answer-recall channel (worked feedback during independent practice) and replaced it with another: the per-item `Correct.` / `Incorrect.` line is a **per-item oracle over a fixed item set with unlimited free retries**. I built a zero-knowledge elimination bot that reads no lesson content and only the correct/incorrect signal. It **passed Lesson 11's 80% mastery gate in 6 attempts** and earned the board-12 unlock. Mastery is still trivially gamed by recall — recall of which options were rejected rather than recall of a printed answer key.

Worse, the remediation introduced two P0 regressions that did not exist in loop 1. One makes **Lesson 5 unpassable by a student who knows every answer**, which severs the unlock chain and makes `course_algebra1_complete` unreachable by legitimate play. The other is a **hard softlock that also displays a false "Mastery gate passed!"** after a 0% set.

---

## Bar-by-bar, against real artifacts and live play

| # | Bar | Result | Evidence |
|---|---|---|---|
| 1 | `npm run build` green | **PASS** | `tsc && vite build` clean. 66 modules, `index-BREJK5bR.js` 1,673.44 kB (407.96 kB gzip). Only the pre-existing chunk-size advisory. |
| 2 | Preview; walk `lesson_board_1`; exercise independent | **PASS** | Walked from spawn to the board, `E` opened "Variables, Expressions, and the Language of Algebra". Phase banner ran Learning objective → Teach → Guided practice → Independent practice. Only console error in the whole session was `favicon.ico` 404. |
| 3 | `acceptNumeric`/`correctLatex` items show TEXT, not 4 MC buttons, in independent | **PASS** | L1 independent: `i03` ("The product of 4 and a number k"), `i06` ("3 times the sum of n and 4"), `i04` ("the quotient of a number m and 3") all rendered `.hud-answer-slot` visible / `.hud-choice-list` hidden. L5: 8 of 10 independent items text. `gradeItem` now checks `acceptNumeric` → `correctLatex` → `choices`, in that order. |
| 4 | Wrong independent answers do not reveal the correct value before the set ends | **PASS** | Every wrong independent answer returned exactly `"Incorrect. Keep going — the set is scored at the end."` for all 9 L1 items and all 10 L5 items. `item.feedbackIncorrect` is no longer reachable in the independent phase. Teach/guided still reveal, which is correct. |
| 5 | Fail gate → RETRY → independent order differs | **PASS** | Attempt 1 (nonce 0): `i05, i06, i03, i08, i01, i02, i09, i04, i07`. Attempt 2 (nonce 1): `i02, i03, i07, i01, i04, i08, i09, i05, i06`. Distinct permutations, verified by prompt text in-play, and MC option order re-shuffled independently. **Same nine items, though** — order, not form. |
| 6 | Closing a just-passed lesson must not re-serve those independent stems; `?sr=1` should prefer other forms | **PASS** | Passed L1, closed the board: **no retrieval fired**. Persisted `spacedQueue` showed `dueAt = now + 591 s` (the 10-minute first interval). Re-run under `?sr=1`: retrieval fired and served 3/3 items that were **teach/guided** items (`7x + 3`, `5y − 8`, `5 more than twice a number n`) — zero independent stems. `excludeItemIds` reaches `pickReviewItems` from the lesson-close path. |
| 7 | Progress Report fits/scrolls in ~600 px; ES/PL topics localized | **PASS (with a stale-render caveat)** | At 620 px tall: panel `top 96.1 → bottom 542.5`, `scrollHeight 1489 > clientHeight 442`, `overflow-y: auto`, visible scrollbar, all 30 mastery + 30 alignment lines reachable. Opened in ES → "VARIABLES, EXPRESIONES Y EL LENGUAJE DEL ÁLGEBRA: 98% DOMINIO"; in PL → "ZMIENNE, WYRAŻENIA I JĘZYK ALGEBRY: 98% OPANOWANIE". `.hud-hologram` is used only by `ProgressReport.ts`, so the `max-height` is scoped. **Caveat:** switching locale *while the report is open* retranslates only the title — the body stays in the language it was built in, because `buildProgressReportData` is not re-run on `onLocaleChange`. Shot: `shots/critic-opus-course-loop2-report-scroll.png`. |
| — | **Claim: mastery no longer trivially gamed by answer recall** | **FAIL** | Zero-knowledge elimination bot cleared L11's gate. See below. |

---

## Largest remaining gap

**The retry loop is still an answer oracle. Withholding the worked answer did not remove the crib sheet — it only made the student read it one bit at a time.**

Four facts, all verified:

1. **The item set is fixed across retries.** `resetIndependentPhase()` bumps a nonce and calls `shuffleIds` on `getSectionItemIds(lesson, 'independent')`. It re-permutes; it never resamples. The remediation says as much ("parallel forms / parameterized generators" is in the *not in this pass* list), so retry N shows the same 9–10 stems as retry 1.
2. **Every item now returns a per-item verdict.** `"Correct."` vs `"Incorrect. Keep going…"` is emitted immediately, per item, before the set is scored. That tells the student exactly which items they missed and — for MC — exactly which option to strike.
3. **Retries are unlimited, free, and skip re-teach.** `resetIndependentPhase()` sets `phaseIndex` straight back to `independent`. No cooldown, no attempt cap, no forced return through teach/guided.
4. **Live proof.** I ran a bot on **Lesson 11** (Exponent Properties) that reads nothing but the verdict string, keeps a per-prompt set of rejected option labels, and always picks the first unrejected option. It types `0` into every text field, which is always wrong. Scores by attempt:

   | Attempt | 1 | 2 | 3 | 4 | 5 | 6 |
   |---|---|---|---|---|---|---|
   | Gate | 20% | 20% | 60% | 70% | 50% | **90% — PASS** |

   `completedLessons` went from 10 to 11; `lesson_board_12` unlocked. Total elapsed: under ten seconds of clicking.

The bot's ceiling is the MC share of the independent set. Across the bank:

| | Count |
|---|---|
| Independent items course-wide | 298 |
| …still 4-option MC (no `acceptNumeric`/`correctLatex`) | **188 (63%)** |
| Lessons where MC share ≥ the 0.8 threshold, i.e. pure elimination reaches PASS | **12 of 30** — L11–L18, L21, L22, L25, L29 |
| …of which are 100% MC independent sets | 7 — L11, L13, L14, L15, L16, L17, L18 |

L13–L18 are six consecutive gates that measure nothing. L29 is "Cumulative Mixed Review" — the one gate a parent would most read as a summative check — at exactly the 0.8 ceiling.

The constructed-response items only slow the oracle, they do not stop it: 137 of the 150 `acceptNumeric` answers are integers in [−20, 20], so a bot with the same free-retry oracle brute-forces each in ≤41 guesses. (That is arithmetic on the bank, not something I ran.)

Credit where it is due — the sequential unlock chain means a total novice cannot *start* at L11; L1's 3 constructed-response items cap the elimination bot at 6/9 = 67%. So the remediation did raise the floor. But "harder to game at lesson 1" is not the claim. The claim is that the 80% gate measures mastery, and on 12 of 30 lessons it provably still does not.

---

## New P0 regressions introduced by this remediation

Both are more severe than the gap the remediation set out to close. Neither existed in loop 1, because in loop 1 these items were multiple choice.

### R1 — Lesson 5 is unpassable by a student who knows every answer. The course cannot be finished.

`gradeItem` grades `correctLatex` by `normalizeLatex` (strip whitespace, lowercase) and **exact string equality**. Five of Lesson 5's ten independent answers are authored as literal TeX with a control sequence:

```
alg1-l05-i02 = x\le 12    alg1-l05-i03 = x\ge 3     alg1-l05-i06 = x\le -2
alg1-l05-i09 = x\ge 5     alg1-l05-i10 = x\ge 3
```

I played L5 as a student who solves all ten correctly and writes standard notation. Live result — the five `\le`/`\ge` items were all marked **Incorrect**:

| Prompt | Typed | Verdict |
|---|---|---|
| Solve: x/4 ≤ 3 | `x ≤ 12` | Incorrect |
| Solve: 3x − 1 ≥ 8 | `x ≥ 3` | Incorrect |
| Solve: 5x + 10 ≤ 0 | `x ≤ -2` | Incorrect |
| Solve: 2(x − 3) ≥ 4 | `x ≥ 5` | Incorrect |
| Solve: 4 − x ≤ 1 | `x ≥ 3` | Incorrect |
| Solve: x − 5 > 2 | `x>7` | Correct |
| Solve: −3x + 6 < 0 | `x>2` | Correct |
| Solve: −x < 5 | `x>-5` | Correct |
| Which graph matches x < 0? (MC) | — | Correct |
| Is −1 a solution of x > 0? (MC) | — | Correct |

**Ceiling for a perfect student: 50%. Threshold: 80%.** `x<=12`, `x ≤ 12`, and `x \le 12` are all rejected; only the literal `x\le 12` passes. Nothing in the lesson, the input label ("YOUR ANSWER"), or any placeholder tells the student to type LaTeX — and Lesson 5's own guided feedback actively teaches the opposite: item `alg1-l05-g04` has `correctLatex: "x\\le -4"` while its `feedbackCorrect` reads *"Divide by −2 and flip: x ≤ −4."* The app demonstrates the notation it will then reject.

Because `lesson_board_5` gates `lesson_board_6`, the entire chain L6→L30 and `course_algebra1_complete` is now unreachable by legitimate play. **This alone invalidates the `exit-gate-algebra1.md` PASS.**

Five other independent items across the bank have the same defect (`\frac`): `alg1-l01-i04` (`\frac{m}{3}`), `alg1-l06-i04`, `alg1-l07-i05`, `alg1-l08-i07`. Confirmed live on L1: typing `m/3` for "the quotient of a number m and 3" → **Incorrect**; typing `\frac{m}{3}` → Correct. Those lessons stay passable at 89–90%, so they cost the student a mark rather than the lesson.

Related, smaller: `acceptNumeric` is checked *before* `correctLatex`, and 59 items carry both. On those, "solve for x" items authored `acceptNumeric: 5` and `correctLatex: "x=5"` accept `5` and reject `x = 5` — the more mathematically complete answer is the wrong one.

### R2 — Softlock + false "Mastery gate passed!" after a 0% set

Minimal repro, fresh profile, **Lesson 1, first attempt**, verified live:

1. Walk to `lesson_board_1`, reach independent practice, answer all 9 items wrong.
2. Gate fails: `Need ≥80% mastery to proceed (0%)`, commit becomes `RETRY INDEPENDENT`, exit disabled. Correct so far.
3. **The four choice buttons for the last item are still rendered and still live** on that fail screen (`.hud-choice-list` is not hidden, because `getViewState` still computes `inputMode: 'choices'` for the current item when `gateFailed`).
4. Click the correct one (`2t`) instead of the RETRY button.
5. Result: the screen reads **"Mastery gate passed!"**, the commit button reverts to `CONTINUE`, and:
   - `completedLessons` is `[]` — the lesson is **not** credited, no board unlocks;
   - the exit button stays **disabled** (`gateFailed` was never cleared);
   - `CONTINUE` does nothing — pressed 3×, state unchanged.

   The player is permanently trapped in the lesson and must reload the page. Shot: `shots/critic-opus-course-loop2-softlock.png` (note "Mastery gate passed!", greyed CLOSE, PROGRESS still 2%).

Mechanism: `LessonScreen`'s choice buttons call `onSubmit(String(idx))` directly and never check `dataset.action === 'retry'` (only the commit button does). `LessonRunner.submitAnswer` therefore falls through the `gateFailed && answer === '__retry__'` guard, grades the item into a freshly-emptied `independentResults`, hits `isLastItemInPhase()`, and calls `completeLessonIfPassed(lesson, [true])`. `scoreIndependentSet([true])` returns `passed: true` (accuracy 1.0 of a 1-item set) → `gatePassed = true`; but `lessonPassed` separately rejects the length mismatch → the lesson is never recorded. `gateFailed` and `gatePassed` are now both true, and nothing can clear either.

`LessonScreen.ts:89-91` has the same hole for text items — the `Enter` handler calls `onSubmit(value)` with no retry check — so this is reachable on every one of the 30 lessons regardless of which item lands last in the shuffle, not only the 29 with MC independent items.

A student who fails a set and then taps an answer instead of hunting for the RETRY button — the exact interaction they just performed nine times in a row — bricks the lesson.

---

## Secondary findings

1. **The gate-fail message is dead code.** `LessonRunner` composes `"Independent set: 0% (need 80%). Retry reshuffles the set."` into `lastGateMessage`, but `getViewState` renders `feedbackText: this.lastFeedback ?? this.lastGateMessage` and `lastFeedback` is always set on the final item. The student is never told the set will be reshuffled, in any locale.
2. **Constructed-response conversion left the stems reading as multiple choice.** Live, with a text box and no options on screen: *"Which matches "the quotient of a number m and 3"?"*, *"Which expression means "5 more than twice a number n"?"*, *""3 times the sum of n and 4" is:"*. The stems ask the student to select from a list that is not there.
3. **Progress Report body does not re-render on locale change.** `onLocaleChange` re-renders the lesson/review runners but not an open report; the title flips to "INFORME DE PROGRESO" while every topic line stays English with `% MASTERY`. Verified live in ES and PL.
4. **`gradeItem` does not normalize the typographic minus.** Prompts, choices, and feedback all use U+2212 (`−`). `Number.parseFloat("−1")` is `NaN` and `normalizeLatex` does not fold it, so an answer copied from the board grades as wrong while the ASCII hyphen grades as right. `alg1-l02-g03` (`acceptNumeric: -1`) is the clean example.
5. **Carried forward unresolved from loop 1** (the remediation says so explicitly, and I confirmed all four): no parallel forms per KP; KaTeX choices still absent in L1–L12; mastery still credited per-lesson not per-KP (`completeLessonIfPassed` marks every `lesson.knowledgePointIds` mastered off one aggregate); L29/L30 still pull no items forward, so the capstone is not cumulative.

---

## What still works

Loop 1's inventory holds up, and the remediation's own mechanics are real, not stubbed:

- **The build is clean and the world loop is intact.** Cold cache → world → walk → `E` → lesson → gate → unlock → close → retrieval → pedestal → report ran end to end in a single session, with one favicon 404 as the only console noise. The camera-input ordering fix in `GameApp` (read look/move/fire *before* `beginFrame()`) is in and the camera is not frozen.
- **Constructed response is genuinely wired, not cosmetic.** `gradeItem` orders `acceptNumeric` → `correctLatex` → `choices`; `prefersConstructedResponse` drives `inputMode` in both `LessonRunner` and `ReviewRunner`; `getMcShuffle` correctly returns `null` for constructed items so no stale shuffle leaks into grading. 110 of 298 independent items now demand production, up from 0.
- **The independent phase no longer prints an answer key.** Verified across 19 wrong answers in two lessons and three locales' worth of strings in the source.
- **Retry reshuffle is real** and the choice-order shuffle is independent of it.
- **The spaced-review fix is a genuine improvement.** 10-minute first interval instead of `Date.now()`, and `pickReviewItems`' ranking (`−100` excluded, `−10` independent, `+20` constructed) demonstrably steered all three retrieval items to teach/guided forms. It is still same-session repetition of items seen minutes earlier — the bank has nothing else to draw — but the specific defect loop 1 named is fixed.
- **The Progress Report layout regression is fixed and the localization fix is correct on the open path.** Scrolls at 620 px, and ES/PL topic lines are real translations with correct orthography.
- **The content bank remains strong.** 30 packs, 508 items, 91 KPs, TEKS + CCSS on every item, no dangling `itemIds`, no orphan items, no duplicate prompts, trilingual with correct diacritics.

---

## Recommendation

**FAIL loop 2.** Do not author more lessons, and do not re-run the exit gate until:

1. **R1 is fixed** — the course is currently uncompletable. Either a real answer-equivalence grader (parse `<=`, `≤`, `\le`, `m/3` ≡ `\frac{m}{3}`, `x = 5` ≡ `5`) or de-authored `correctLatex` on anything that needs a control sequence. This is the one that has to move first.
2. **R2 is fixed** — route every submit path through the same retry guard, and hide the answer affordances entirely on the gate-fail screen. A student must not be able to brick a lesson with one tap.
3. **The oracle is closed** — the loop-1 recommendation stands unchanged and unaddressed: 3–4 parallel forms per knowledge point so a retry draws unseen items. Until then, per-item verdicts should be withheld until the set is scored (report `n/10` only), retries should be capped and should route back through teach, and the 12 all-MC-passable lessons need constructed-response items authored into their independent sets.

Re-critic bar for loop 3: a zero-knowledge elimination bot must **not** clear any lesson gate; a student typing `x ≤ 12` for `x/4 ≤ 3` must be marked correct; and no interaction on a gate-fail screen may produce "Mastery gate passed!".
