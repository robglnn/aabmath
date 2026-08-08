import { loadAlgebra1Content, getIndependentItemIds } from '../src/content/loadContent.ts'
import { PedagogyEngine, createDefaultProgress } from '../src/pedagogy/PedagogyEngine.ts'
import { LessonRunner } from '../src/game/lesson/LessonRunner.ts'
import { writeFileSync } from 'node:fs'

const content = loadAlgebra1Content()
const l1 = content.lessons[0]
const ids = getIndependentItemIds(l1)
const lines: string[] = []
const log = (msg: string) => lines.push(msg)

log(`L1 independent count=${ids.length} threshold=${l1.masteryThreshold}`)
log(`unlockOnMastery=${JSON.stringify(l1.worldHook.unlockOnMastery)}`)

const fail70 = ids.map((_, i) => i < Math.floor(ids.length * 0.7))
const pass80 = ids.map((_, i) => i < Math.ceil(ids.length * 0.8))
const short = [true]

{
  const e = new PedagogyEngine(createDefaultProgress(), content.knowledgePointById)
  const s = e.completeLessonIfPassed(l1, fail70)
  log(
    `engine fail70 correct=${fail70.filter(Boolean).length}/${fail70.length} scored.passed=${s.passed} lessonPassed=${e.lessonPassed(l1, fail70)} completed=${JSON.stringify(e.getProgress().completedLessons)} unlock=${JSON.stringify(e.unlockSiteIds(l1))}`,
  )
}
{
  const e = new PedagogyEngine(createDefaultProgress(), content.knowledgePointById)
  const s = e.completeLessonIfPassed(l1, pass80)
  log(
    `engine pass80 correct=${pass80.filter(Boolean).length}/${pass80.length} scored.passed=${s.passed} accuracy=${s.accuracy} completed=${JSON.stringify(e.getProgress().completedLessons)} unlock=${JSON.stringify(e.unlockSiteIds(l1))}`,
  )
}
{
  const e = new PedagogyEngine(createDefaultProgress(), content.knowledgePointById)
  log(`engine shortArray lessonPassed=${e.lessonPassed(l1, short)}`)
}

function simulateRunnerGate(results: boolean[]) {
  const e = new PedagogyEngine(createDefaultProgress(), content.knowledgePointById)
  const r = new LessonRunner(l1, e, 'en')
  // Drive to last independent answer the same way LessonRunner does after pushes
  ;(r as unknown as { phaseIndex: number }).phaseIndex = 3
  ;(r as unknown as { itemIndex: number }).itemIndex = 0
  ;(r as unknown as { independentResults: boolean[] }).independentResults = []
  for (let i = 0; i < results.length; i++) {
    ;(r as unknown as { independentResults: boolean[] }).independentResults.push(results[i])
    if (i === results.length - 1) {
      const scored = e.completeLessonIfPassed(
        l1,
        (r as unknown as { independentResults: boolean[] }).independentResults,
      )
      ;(r as unknown as { gateScorePercent: number }).gateScorePercent = scored.accuracy * 100
      if (!scored.passed) {
        ;(r as unknown as { gateFailed: boolean }).gateFailed = true
        ;(r as unknown as { independentResults: boolean[] }).independentResults = []
        ;(r as unknown as { itemIndex: number }).itemIndex = 0
      } else {
        ;(r as unknown as { gatePassed: boolean }).gatePassed = true
        ;(r as unknown as { phaseIndex: number }).phaseIndex = 4
      }
    }
  }
  const unlocked = new Set(['lesson_board_1'])
  const view = r.getViewState()
  if (view.gatePassed) {
    for (const siteId of e.unlockSiteIds(l1)) unlocked.add(siteId)
  }
  return {
    canClose: r.canClose(),
    closeDisabled: view.closeDisabled,
    gateFailed: view.gateFailed,
    gatePassed: view.gatePassed,
    completed: e.getProgress().completedLessons,
    unlock: e.unlockSiteIds(l1),
    unlockedSites: [...unlocked],
  }
}

log(`runner fail70 ${JSON.stringify(simulateRunnerGate(fail70))}`)
log(`runner pass80 ${JSON.stringify(simulateRunnerGate(pass80))}`)

// Full LessonRunner submitAnswer path using grade bypass: answer independent by pushing through phases with engineered results
function fullRunnerPath(makeCorrect: (itemIndex: number, total: number) => boolean) {
  const e = new PedagogyEngine(createDefaultProgress(), content.knowledgePointById)
  const r = new LessonRunner(l1, e, 'en')
  let steps = 0
  while (steps++ < 500) {
    const v = r.getViewState()
    if (v.gatePassed || v.gateFailed) break
    if (v.submitLabel === 'continue' || v.inputMode === 'none') {
      r.submitAnswer('')
      continue
    }
    const phase = (r as unknown as { currentPhase: () => string }).currentPhase()
    const idx = (r as unknown as { itemIndex: number }).itemIndex
    const item = (r as unknown as { currentItem: () => { answer?: unknown; choices?: Record<string, string[]> } | undefined }).currentItem()
    if (!item) {
      r.submitAnswer('')
      continue
    }
    if (phase === 'independent') {
      const want = makeCorrect(idx, ids.length)
      // Force result by temporarily replacing grade via known answers is hard; use internal push path:
      // Instead call submit with correct/incorrect by reading expected from item if present
      const anyItem = item as {
        type?: string
        answer?: { en?: string } | string
        choices?: { en?: string[] }
        correctIndex?: number
      }
      if (want) {
        if (anyItem.choices && typeof (anyItem as { correctIndex?: number }).correctIndex === 'number') {
          r.submitAnswer(String((anyItem as { correctIndex: number }).correctIndex))
        } else if (typeof anyItem.answer === 'string') {
          r.submitAnswer(anyItem.answer)
        } else if (anyItem.answer && typeof anyItem.answer === 'object' && 'en' in anyItem.answer) {
          r.submitAnswer(String((anyItem.answer as { en: string }).en))
        } else {
          // fallback: inject via private then last-item gate
          ;(r as unknown as { independentResults: boolean[] }).independentResults.push(true)
          const idsLeft = ids.length - (r as unknown as { independentResults: boolean[] }).independentResults.length
          if (idsLeft === 0) {
            const scored = e.completeLessonIfPassed(
              l1,
              (r as unknown as { independentResults: boolean[] }).independentResults,
            )
            ;(r as unknown as { gateScorePercent: number }).gateScorePercent = scored.accuracy * 100
            if (!scored.passed) {
              ;(r as unknown as { gateFailed: boolean }).gateFailed = true
              ;(r as unknown as { independentResults: boolean[] }).independentResults = []
            } else {
              ;(r as unknown as { gatePassed: boolean }).gatePassed = true
              ;(r as unknown as { phaseIndex: number }).phaseIndex = 4
            }
            break
          }
          ;(r as unknown as { itemIndex: number }).itemIndex += 1
        }
      } else {
        r.submitAnswer('___WRONG___')
      }
    } else {
      // guided/teach: any answer then continue
      if (v.inputMode === 'choices') r.submitAnswer('0')
      else r.submitAnswer('x')
    }
  }
  const view = r.getViewState()
  const unlocked = new Set(['lesson_board_1'])
  if (view.gatePassed) for (const s of e.unlockSiteIds(l1)) unlocked.add(s)
  return {
    steps,
    canClose: r.canClose(),
    closeDisabled: view.closeDisabled,
    gateFailed: view.gateFailed,
    gatePassed: view.gatePassed,
    completed: e.getProgress().completedLessons,
    unlock: e.unlockSiteIds(l1),
    unlockedSites: [...unlocked],
    masteryPct: view.masteryPercent,
  }
}

log(`fullRunner ~70% ${JSON.stringify(fullRunnerPath((i, n) => i < Math.floor(n * 0.7)))}`)
log(`fullRunner ≥80% ${JSON.stringify(fullRunnerPath((i, n) => i < Math.ceil(n * 0.8)))}`)

writeFileSync('scripts/smoke-gate-out.txt', lines.join('\n'), 'utf8')
console.log(lines.join('\n'))
