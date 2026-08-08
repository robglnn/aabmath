# Critic remediation — Wave 3 content FAIL → KaTeX (promptMath + choice render)

**Trigger:** [Content critic wave3](critic-content-wave3.md) FAIL — L8 nearly omitted `promptMath` (2/17); L7/L8 MC choices embed raw `\frac{...}` rendered as plain `textContent`.

**Root cause:** `LessonScreen` set `btn.textContent` on choice buttons; no KaTeX path for choice labels. L8 authored equation stems without chalkboard `promptMath`.

**Fix applied (dual layer):**

### 1. UI — KaTeX on MC choice labels

- **`renderKatex.ts`** — `containsLatex`, `normalizeLatex` (strip `\(...\)` / `$...$`), `renderChoiceLabel` (inline KaTeX when `\` or `$` present).
- **`LessonScreen.ts`** — choice buttons call `renderChoiceLabel` instead of `textContent`.
- **`style.css`** — `.hud-choice-list` layout; `.hud-choice-btn .katex` inherits button color/size.

**Choice render path (Lesson + Review):**

```
LessonRunner / ReviewRunner → choices[] in LessonScreenData
  → LessonScreen.show() → renderChoiceLabel(btn, label)
  → containsLatex? renderKatex(el, latex, displayMode=false) : textContent
```

ReviewRunner shares `LessonScreen`; no separate path needed.

### 2. Content — `promptMath` restored on L8; L9 equation items thickened

| Pack | Before | After |
|---|---|---|
| alg1-l08 | 2 / 17 | **17 / 17** |
| alg1-l09 | 6 / 17 | **12 / 17** (equation/substitution items) |
| alg1-l07 | 12 / 17 | unchanged (already wave-1 level) |

L7 `alg1-l07-i05` and L8 guided/independent `\frac` choices now render as fractions via choice KaTeX.

**Files touched:**

| File | Change |
|---|---|
| `src/ui/math/renderKatex.ts` | `containsLatex`, `normalizeLatex`, `renderChoiceLabel` |
| `src/ui/components/LessonScreen.ts` | KaTeX choice labels |
| `src/style.css` | Choice list + inline KaTeX in buttons |
| `content/algebra1/lesson-08.json` | +15 `promptMath` fields |
| `content/algebra1/lesson-09.json` | +6 `promptMath` on equation-heavy items |
| `public/workbench.html` | Wave 3 KaTeX → REMEDIATED awaiting critic |
| `docs/gauntlet/remediation-katex-wave3.md` | This note |

**Preserved:** MC shuffle + grading; `masteryThreshold` 0.8; EN/ES/PL choice alignment.

**Next:** Fresh critic — confirm L8 `promptMath` ≥ wave-1 bar; play L7/L8 items with `\frac` choices and verify rendered fractions (not literal backslashes); `npm run build` green.
