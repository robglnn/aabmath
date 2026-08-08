/**
 * Wave 10 authoring: Algebra I Lessons 28–30 (course capstone) + KP/standards.
 * Run: node scripts/author-algebra1-l28-l30.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-28..30; confirms L27 unlockOnMastery → lesson_board_28;
 * L30 unlocks course_algebra1_complete.
 *
 * KaTeX: promptMath on every item; MC math choices in $...$.
 * Feedback: distinct EN/ES/PL prose.
 * No English filler in ES/PL KaTeX (localized \\text{...}).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'content', 'algebra1')
mkdirSync(outDir, { recursive: true })

const L = (en, es, pl) => ({ en, es, pl })
const TX = (...codes) => ({ jurisdiction: 'TX', codes })
const CC = (...codes) => ({ jurisdiction: 'CCSS', codes })
const CA = (...codes) => ({ jurisdiction: 'CA', codes })
const FL = (...codes) => ({ jurisdiction: 'FL', codes })

function item(partial) {
  const {
    id,
    knowledgePointIds,
    difficulty,
    irt,
    prompt,
    promptMath,
    choices,
    correctIndex,
    correctLatex,
    acceptNumeric,
    tolerance,
    feedbackCorrect,
    feedbackIncorrect,
    diagnosticTags,
    standards,
  } = partial
  const out = {
    id,
    knowledgePointIds,
    difficulty,
    irt,
    prompt,
    feedbackCorrect,
    feedbackIncorrect,
    standards,
  }
  if (promptMath) out.promptMath = promptMath
  if (choices) out.choices = choices
  if (correctIndex !== undefined) out.correctIndex = correctIndex
  if (correctLatex) out.correctLatex = correctLatex
  if (acceptNumeric !== undefined) out.acceptNumeric = acceptNumeric
  if (tolerance !== undefined) out.tolerance = tolerance
  if (diagnosticTags) out.diagnosticTags = diagnosticTags
  return out
}

function writeJson(name, data) {
  writeFileSync(join(outDir, name), JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function withKey(choicesAt0, targetIndex) {
  if (targetIndex === 0) return { choices: choicesAt0, correctIndex: 0 }
  const n = choicesAt0.en.length
  const permute = (arr) => {
    const out = [...arr]
    const [correct] = out.splice(0, 1)
    out.splice(targetIndex, 0, correct)
    if (out.length !== n) throw new Error('permute length mismatch')
    return out
  }
  return {
    choices: L(permute(choicesAt0.en), permute(choicesAt0.es), permute(choicesAt0.pl)),
    correctIndex: targetIndex,
  }
}

function keyCycle(i) {
  return i % 4
}

function asKatexChoice(s) {
  const t = String(s).trim()
  if (!t) return t
  if (/^\$[\s\S]*\$$/.test(t) || /^\\\([\s\S]*\\\)$/.test(t)) return t
  if (!/\^/.test(t) && !/[_\\]/.test(t)) return t
  const cleaned = t.replace(/\\\^/g, '^')
  if (/^\$/.test(cleaned)) return cleaned
  return `$${cleaned}$`
}

function latexifyChoices(choices) {
  return L(
    choices.en.map(asKatexChoice),
    choices.es.map(asKatexChoice),
    choices.pl.map(asKatexChoice),
  )
}

function wrapKatex(s) {
  const cleaned = String(s).replace(/\\\^/g, '^').replace(/^\$/, '').replace(/\$$/, '')
  return `$${cleaned}$`
}

function mathChoices(...opts) {
  const fixed = opts.map(wrapKatex)
  return L(fixed, fixed, fixed)
}

function mathChoicesL(enOpts, esOpts, plOpts) {
  return L(enOpts.map(wrapKatex), esOpts.map(wrapKatex), plOpts.map(wrapKatex))
}

function latexifyMath(s) {
  return String(s).replace(/\\\^/g, '^')
}

const existingKpDoc = JSON.parse(readFileSync(join(outDir, 'knowledge-points.json'), 'utf8'))
const existingStd = JSON.parse(readFileSync(join(outDir, 'standards-index.json'), 'utf8'))
const lesson27 = JSON.parse(readFileSync(join(outDir, 'lesson-27.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.piecewise.meaning',
    title: L(
      'Interpret piecewise function notation',
      'Interpretar notación de funciones por partes',
      'Interpretować notację funkcji przedziałami',
    ),
    prerequisites: ['kp.alg1.function.notation', 'kp.alg1.function.domain'],
    successCriteria: L(
      'Student reads a piecewise rule and identifies which expression applies on each domain piece.',
      'El estudiante lee una regla por partes e identifica qué expresión aplica en cada trozo del dominio.',
      'Uczeń odczytuje regułę przedziałową i wskazuje, które wyrażenie obowiązuje na każdym kawałku dziedziny.',
    ),
    misconceptions: L(
      [
        'Treating every piece as active for every x',
        'Ignoring open/closed endpoints when naming the active piece',
      ],
      [
        'Tratar cada trozo como activo para todo x',
        'Ignorar extremos abiertos/cerrados al nombrar el trozo activo',
      ],
      [
        'Traktowanie każdej części jako aktywnej dla każdego x',
        'Ignorowanie otwartych/domkniętych końców przy wyborze aktywnej części',
      ],
    ),
    standards: [
      TX('A.12(B)', 'A.2(A)', 'A.1(D)'),
      CC('F-IF.A.1', 'F-IF.A.2', 'F-IF.C.7b'),
      CA('F-IF.1', 'F-IF.2'),
      FL('MA.912.F.1.1'),
    ],
  },
  {
    id: 'kp.alg1.piecewise.evaluate',
    title: L(
      'Evaluate piecewise functions',
      'Evaluar funciones por partes',
      'Obliczać wartości funkcji przedziałami',
    ),
    prerequisites: ['kp.alg1.piecewise.meaning', 'kp.alg1.eval.substitute'],
    encompassing: ['kp.alg1.piecewise.meaning'],
    successCriteria: L(
      'Student selects the correct piece for a given input and substitutes to find f(x).',
      'El estudiante elige el trozo correcto para una entrada y sustituye para hallar f(x).',
      'Uczeń wybiera właściwą część dla danego argumentu i podstawia, by znaleźć f(x).',
    ),
    misconceptions: L(
      [
        'Using the wrong piece for the input',
        'Arithmetic errors after choosing the correct piece',
      ],
      [
        'Usar el trozo incorrecto para la entrada',
        'Errores aritméticos tras elegir el trozo correcto',
      ],
      [
        'Użycie złej części dla argumentu',
        'Błędy rachunkowe po wyborze właściwej części',
      ],
    ),
    standards: [
      TX('A.12(B)', 'A.1(B)', 'A.1(F)'),
      CC('F-IF.A.2', 'F-IF.C.7b'),
      CA('F-IF.2'),
      FL('MA.912.F.1.2'),
    ],
  },
  {
    id: 'kp.alg1.piecewise.graph',
    title: L(
      'Connect piecewise rules to graphs and domains',
      'Conectar reglas por partes con gráficas y dominios',
      'Łączyć reguły przedziałowe z wykresami i dziedzinami',
    ),
    prerequisites: ['kp.alg1.piecewise.evaluate', 'kp.alg1.graph.slope.intercept'],
    encompassing: ['kp.alg1.piecewise.evaluate'],
    successCriteria: L(
      'Student matches a piecewise definition to open/closed endpoints and describes which ray or segment appears on the graph.',
      'El estudiante relaciona la definición por partes con extremos abiertos/cerrados y describe qué rayo o segmento aparece en la gráfica.',
      'Uczeń łączy definicję przedziałową z otwartymi/domkniętymi końcami i opisuje, który promień lub odcinek widać na wykresie.',
    ),
    misconceptions: L(
      [
        'Drawing both pieces across the whole domain',
        'Using filled dots for strict inequalities at junctions',
      ],
      [
        'Dibujar ambos trozos en todo el dominio',
        'Usar puntos rellenos en extremos estrictos en las uniones',
      ],
      [
        'Rysowanie obu części na całej dziedzinie',
        'Wypełnione punkty przy ostrych nierównościach na łączeniach',
      ],
    ),
    standards: [
      TX('A.2(A)', 'A.3(C)', 'A.1(D)'),
      CC('F-IF.C.7b', 'F-IF.A.1'),
      CA('F-IF.7'),
      FL('MA.912.F.1.6'),
    ],
  },
  {
    id: 'kp.alg1.review.expr.eq',
    title: L(
      'Cumulative review: expressions and equations',
      'Repaso acumulativo: expresiones y ecuaciones',
      'Powtórka łączna: wyrażenia i równania',
    ),
    prerequisites: ['kp.alg1.solve.multi.step', 'kp.alg1.expression.translate'],
    successCriteria: L(
      'Student simplifies expressions and solves linear equations fluently in a mixed set.',
      'El estudiante simplifica expresiones y resuelve ecuaciones lineales con fluidez en un conjunto mixto.',
      'Uczeń sprawnie upraszcza wyrażenia i rozwiązuje równania liniowe w zestawie mieszanym.',
    ),
    misconceptions: L(
      [
        'Combining unlike terms when simplifying',
        'Sign errors when moving terms across an equation',
      ],
      [
        'Combinar términos no semejantes al simplificar',
        'Errores de signo al mover términos en una ecuación',
      ],
      [
        'Łączenie niepodobnych wyrazów przy upraszczaniu',
        'Błędy znaku przy przenoszeniu wyrazów w równaniu',
      ],
    ),
    standards: [
      TX('A.5(A)', 'A.10(A)', 'A.1(B)'),
      CC('A-SSE.A.1', 'A-REI.B.3'),
      CA('A-REI.3'),
      FL('MA.912.AR.1.1'),
    ],
  },
  {
    id: 'kp.alg1.review.linear.fn',
    title: L(
      'Cumulative review: linear functions and systems',
      'Repaso acumulativo: funciones lineales y sistemas',
      'Powtórka łączna: funkcje liniowe i układy',
    ),
    prerequisites: ['kp.alg1.slope.intercept.form', 'kp.alg1.systems.substitution'],
    successCriteria: L(
      'Student uses slope-intercept form, function notation, and simple systems in mixed review items.',
      'El estudiante usa forma pendiente-intersección, notación de función y sistemas simples en ítems mixtos.',
      'Uczeń stosuje postać kierunkową, notację funkcyjną i proste układy w mieszanych zadaniach.',
    ),
    misconceptions: L(
      [
        'Swapping slope and intercept roles',
        'Solving only one equation in a system',
      ],
      [
        'Intercambiar roles de pendiente e intersección',
        'Resolver solo una ecuación de un sistema',
      ],
      [
        'Zamiana ról nachylenia i przecięcia',
        'Rozwiązywanie tylko jednego równania układu',
      ],
    ),
    standards: [
      TX('A.3(A)', 'A.2(C)', 'A.3(F)'),
      CC('F-IF.B.6', 'A-REI.C.6'),
      CA('F-IF.6'),
      FL('MA.912.AR.2.2'),
    ],
  },
  {
    id: 'kp.alg1.review.quadratic',
    title: L(
      'Cumulative review: quadratics',
      'Repaso acumulativo: cuadráticas',
      'Powtórka łączna: kwadratowe',
    ),
    prerequisites: ['kp.alg1.quadratic.formula.apply', 'kp.alg1.quadratic.graph.features'],
    successCriteria: L(
      'Student factors or uses the formula, and reads vertex/direction cues on mixed quadratic items.',
      'El estudiante factoriza o usa la fórmula, y lee pistas de vértice/dirección en ítems cuadráticos mixtos.',
      'Uczeń faktoryzuje lub stosuje wzór oraz odczytuje wierzchołek/kierunek w mieszanych zadaniach kwadratowych.',
    ),
    misconceptions: L(
      [
        'Dropping a root when using zero-product',
        'Misreading a as determining only width, not direction',
      ],
      [
        'Omitir una raíz al usar producto cero',
        'Malinterpretar a como solo ancho, no dirección',
      ],
      [
        'Pomijanie pierwiastka przy zerowym iloczynie',
        'Błędne traktowanie a tylko jako szerokości, nie kierunku',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.7(A)', 'A.1(F)'),
      CC('A-REI.B.4b', 'F-IF.C.7a'),
      CA('A-REI.4'),
      FL('MA.912.AR.3.1'),
    ],
  },
  {
    id: 'kp.alg1.capstone.fluency',
    title: L(
      'Capstone fluency across Algebra I skills',
      'Fluidez capstone en habilidades de Álgebra I',
      'Biegłość capstone w umiejętnościach algebry I',
    ),
    prerequisites: [
      'kp.alg1.review.expr.eq',
      'kp.alg1.review.linear.fn',
      'kp.alg1.review.quadratic',
    ],
    successCriteria: L(
      'Student answers mixed independent items spanning expressions, equations, functions, and quadratics with ≥80% accuracy.',
      'El estudiante responde ítems independientes mixtos de expresiones, ecuaciones, funciones y cuadráticas con ≥80% de acierto.',
      'Uczeń rozwiązuje mieszane samodzielne zadania z wyrażeń, równań, funkcji i kwadratowych z ≥80% poprawności.',
    ),
    misconceptions: L(
      [
        'Rushing without identifying the skill family first',
        'Carrying forward arithmetic slips across multi-step items',
      ],
      [
        'Apurarse sin identificar primero la familia de habilidad',
        'Arrastrar errores aritméticos en ítems de varios pasos',
      ],
      [
        'Pośpiech bez najpierw rozpoznania rodziny umiejętności',
        'Przenoszenie błędów rachunkowych w zadaniach wieloetapowych',
      ],
    ),
    standards: [
      TX('A.1(B)', 'A.1(F)', 'A.5(A)'),
      CC('A-REI.B.3', 'A-SSE.A.1'),
      CA('A-REI.3'),
      FL('MA.912.AR.1.1'),
    ],
  },
  {
    id: 'kp.alg1.capstone.connect',
    title: L(
      'Connect representations in capstone problems',
      'Conectar representaciones en problemas capstone',
      'Łączyć reprezentacje w problemach capstone',
    ),
    prerequisites: ['kp.alg1.capstone.fluency', 'kp.alg1.piecewise.evaluate'],
    encompassing: ['kp.alg1.capstone.fluency'],
    successCriteria: L(
      'Student moves between symbolic, numeric, and verbal/graph cues on mixed capstone items.',
      'El estudiante pasa entre pistas simbólicas, numéricas y verbales/gráficas en ítems capstone mixtos.',
      'Uczeń przechodzi między wskazówkami symbolicznymi, liczbowymi i słownymi/wykresowymi w mieszanych zadaniach capstone.',
    ),
    misconceptions: L(
      [
        'Treating graph features as unrelated to the equation',
        'Ignoring domain constraints when evaluating models',
      ],
      [
        'Tratar rasgos de la gráfica como ajenos a la ecuación',
        'Ignorar restricciones de dominio al evaluar modelos',
      ],
      [
        'Traktowanie cech wykresu jako oderwanych od równania',
        'Ignorowanie ograniczeń dziedziny przy ocenie modeli',
      ],
    ),
    standards: [
      TX('A.1(D)', 'A.1(F)', 'A.3(C)'),
      CC('F-IF.C.7b', 'F-IF.B.6'),
      CA('F-IF.7'),
      FL('MA.912.F.1.6'),
    ],
  },
  {
    id: 'kp.alg1.capstone.mastery',
    title: L(
      'Algebra I course mastery check',
      'Verificación de dominio del curso de Álgebra I',
      'Sprawdzenie opanowania kursu algebry I',
    ),
    prerequisites: ['kp.alg1.capstone.connect', 'kp.alg1.modeling.choose'],
    encompassing: ['kp.alg1.capstone.connect'],
    successCriteria: L(
      'Student demonstrates course-level readiness on a mixed mastery set with teach/guided warm-up still present.',
      'El estudiante demuestra preparación a nivel de curso en un conjunto mixto de dominio con calentamiento teach/guided.',
      'Uczeń wykazuje gotowość na poziomie kursu w mieszanym zestawie mistrzowskim z rozgrzewką teach/guided.',
    ),
    misconceptions: L(
      [
        'Skipping reasonableness checks on final answers',
        'Defaulting to one method when another is clearly shorter',
      ],
      [
        'Omitir comprobaciones de razonabilidad en respuestas finales',
        'Usar por defecto un método cuando otro es claramente más corto',
      ],
      [
        'Pomijanie kontroli sensowności końcowych odpowiedzi',
        'Domyślna jedna metoda, gdy inna jest wyraźnie krótsza',
      ],
    ),
    standards: [
      TX('A.1(A)', 'A.1(B)', 'A.1(F)'),
      CC('A-CED.A.1', 'A-REI.B.4b'),
      CA('A-CED.1'),
      FL('MA.912.AR.3.8'),
    ],
  },
]

const byId = new Map(existingKpDoc.knowledgePoints.map((k) => [k.id, k]))
for (const kp of newKps) {
  if (!byId.has(kp.id)) {
    existingKpDoc.knowledgePoints.push(kp)
    byId.set(kp.id, kp)
  } else {
    const idx = existingKpDoc.knowledgePoints.findIndex((k) => k.id === kp.id)
    existingKpDoc.knowledgePoints[idx] = kp
  }
}

/* ─── Standards index merge ─── */
function ensureCode(jurisdiction, code, description, kpIds) {
  if (!existingStd.codes[jurisdiction]) existingStd.codes[jurisdiction] = {}
  const bucket = existingStd.codes[jurisdiction]
  if (!bucket[code]) {
    bucket[code] = { description, knowledgePointIds: [...kpIds] }
  } else {
    const set = new Set(bucket[code].knowledgePointIds)
    for (const id of kpIds) set.add(id)
    bucket[code].knowledgePointIds = [...set]
    if (description) bucket[code].description = description
  }
}

function addKpsToExisting(jurisdiction, code, kpIds) {
  const entry = existingStd.codes[jurisdiction]?.[code]
  if (!entry) return
  const set = new Set(entry.knowledgePointIds)
  for (const id of kpIds) set.add(id)
  entry.knowledgePointIds = [...set]
}

const piecewiseKps = [
  'kp.alg1.piecewise.meaning',
  'kp.alg1.piecewise.evaluate',
  'kp.alg1.piecewise.graph',
]
const reviewKps = [
  'kp.alg1.review.expr.eq',
  'kp.alg1.review.linear.fn',
  'kp.alg1.review.quadratic',
]
const capstoneKps = [
  'kp.alg1.capstone.fluency',
  'kp.alg1.capstone.connect',
  'kp.alg1.capstone.mastery',
]

addKpsToExisting('TX', 'A.12(B)', [
  'kp.alg1.piecewise.meaning',
  'kp.alg1.piecewise.evaluate',
])
addKpsToExisting('TX', 'A.2(A)', [
  'kp.alg1.piecewise.meaning',
  'kp.alg1.piecewise.graph',
])
addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.piecewise.evaluate',
  'kp.alg1.review.expr.eq',
  ...capstoneKps,
])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.piecewise.meaning',
  'kp.alg1.piecewise.graph',
  'kp.alg1.capstone.connect',
])
addKpsToExisting('TX', 'A.1(F)', [
  'kp.alg1.piecewise.evaluate',
  'kp.alg1.review.quadratic',
  ...capstoneKps,
])
addKpsToExisting('TX', 'A.1(A)', ['kp.alg1.capstone.mastery'])
addKpsToExisting('CCSS', 'F-IF.A.1', [
  'kp.alg1.piecewise.meaning',
  'kp.alg1.piecewise.graph',
])
addKpsToExisting('CCSS', 'F-IF.A.2', [
  'kp.alg1.piecewise.meaning',
  'kp.alg1.piecewise.evaluate',
])
addKpsToExisting('CCSS', 'F-IF.B.6', [
  'kp.alg1.review.linear.fn',
  'kp.alg1.capstone.connect',
])
addKpsToExisting('CCSS', 'F-IF.C.7a', ['kp.alg1.review.quadratic'])
addKpsToExisting('CCSS', 'A-REI.B.3', [
  'kp.alg1.review.expr.eq',
  'kp.alg1.capstone.fluency',
])
addKpsToExisting('CCSS', 'A-REI.B.4b', [
  'kp.alg1.review.quadratic',
  'kp.alg1.capstone.mastery',
])
addKpsToExisting('CCSS', 'A-CED.A.1', ['kp.alg1.capstone.mastery'])

ensureCode(
  'CCSS',
  'F-IF.C.7b',
  L(
    'Graph square root, cube root, and piecewise-defined functions, including step functions and absolute value functions',
    'Graficar funciones raíz cuadrada, raíz cúbica y definidas por partes, incluidas escalón y valor absoluto',
    'Rysować funkcje pierwiastka kwadratowego, sześciennego i przedziałami, w tym schodkowe i wartości bezwzględnej',
  ),
  piecewiseKps.concat(['kp.alg1.capstone.connect']),
)
ensureCode(
  'TX',
  'A.3(C)',
  L(
    'Graph linear functions on the coordinate plane and identify key attributes including intercepts and slope',
    'Graficar funciones lineales en el plano e identificar atributos clave como interceptos y pendiente',
    'Rysować funkcje liniowe na płaszczyźnie i identyfikować kluczowe atrybuty, w tym przecięcia i nachylenie',
  ),
  ['kp.alg1.piecewise.graph', 'kp.alg1.capstone.connect'],
)
ensureCode(
  'TX',
  'A.5(A)',
  L(
    'Solve linear equations in one variable, including those for which the application of the distributive property is necessary and for which variables are included on both sides',
    'Resolver ecuaciones lineales en una variable, incluidas las que requieren la propiedad distributiva y variables en ambos lados',
    'Rozwiązywać równania liniowe jednej zmiennej, także z rozdzielnością i zmiennymi po obu stronach',
  ),
  ['kp.alg1.review.expr.eq', 'kp.alg1.capstone.fluency'],
)
ensureCode(
  'TX',
  'A.10(A)',
  L(
    'Add and subtract polynomials of degree one and degree two',
    'Sumar y restar polinomios de grado uno y dos',
    'Dodawać i odejmować wielomiany stopnia pierwszego i drugiego',
  ),
  ['kp.alg1.review.expr.eq'],
)
ensureCode(
  'TX',
  'A.3(A)',
  L(
    'Determine the slope of a line given a table of values, a graph, two points on the line, and an equation written in various forms',
    'Determinar la pendiente de una recta dada una tabla, gráfica, dos puntos o una ecuación en varias formas',
    'Wyznaczać nachylenie prostej z tabeli, wykresu, dwóch punktów lub równania w różnych postaciach',
  ),
  ['kp.alg1.review.linear.fn'],
)
ensureCode(
  'TX',
  'A.3(F)',
  L(
    'Graph systems of two linear equations in two variables on the coordinate plane and determine the solutions if they exist',
    'Graficar sistemas de dos ecuaciones lineales en dos variables y determinar las soluciones si existen',
    'Rysować układy dwóch równań liniowych dwóch zmiennych i wyznaczać rozwiązania, jeśli istnieją',
  ),
  ['kp.alg1.review.linear.fn'],
)
ensureCode(
  'TX',
  'A.8(A)',
  L(
    'Solve quadratic equations having real solutions by factoring, taking square roots, completing the square, and applying the quadratic formula',
    'Resolver ecuaciones cuadráticas con soluciones reales por factorización, raíces, completar el cuadrado y la fórmula cuadrática',
    'Rozwiązywać równania kwadratowe o rozwiązaniach rzeczywistych przez faktoryzację, pierwiastki, dopełnianie kwadratu i wzór kwadratowy',
  ),
  ['kp.alg1.review.quadratic', 'kp.alg1.capstone.mastery'],
)
ensureCode(
  'TX',
  'A.7(A)',
  L(
    'Graph quadratic functions on the coordinate plane and write the equation related to attributes of the graph',
    'Graficar funciones cuadráticas en el plano y escribir la ecuación relacionada con atributos de la gráfica',
    'Rysować funkcje kwadratowe na płaszczyźnie i zapisywać równanie związane z atrybutami wykresu',
  ),
  ['kp.alg1.review.quadratic'],
)
ensureCode(
  'CCSS',
  'A-SSE.A.1',
  L(
    'Interpret expressions that represent a quantity in terms of its context',
    'Interpretar expresiones que representan una cantidad en términos de su contexto',
    'Interpretować wyrażenia reprezentujące wielkość w kontekście',
  ),
  ['kp.alg1.review.expr.eq', 'kp.alg1.capstone.fluency'],
)
ensureCode(
  'CCSS',
  'A-REI.C.6',
  L(
    'Solve systems of linear equations exactly and approximately, focusing on pairs of linear equations in two variables',
    'Resolver sistemas de ecuaciones lineales exacta y aproximadamente, enfocándose en pares en dos variables',
    'Rozwiązywać układy równań liniowych dokładnie i w przybliżeniu, skupiając się na parach dwóch zmiennych',
  ),
  ['kp.alg1.review.linear.fn'],
)
ensureCode(
  'TX',
  'A.2(C)',
  L(
    'Write linear equations in two variables given a table of values, a graph, and a verbal description',
    'Escribir ecuaciones lineales en dos variables dadas una tabla, una gráfica y una descripción verbal',
    'Zapisywać równania liniowe dwóch zmiennych z tabeli, wykresu i opisu słownego',
  ),
  ['kp.alg1.review.linear.fn'],
)

existingStd.lessonCoverage['alg1-l28'] = [
  'A.12(B)',
  'A.2(A)',
  'A.3(C)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'F-IF.A.1',
  'F-IF.A.2',
  'F-IF.C.7b',
]
existingStd.lessonCoverage['alg1-l29'] = [
  'A.5(A)',
  'A.10(A)',
  'A.3(A)',
  'A.2(C)',
  'A.3(F)',
  'A.8(A)',
  'A.7(A)',
  'A.1(B)',
  'A.1(F)',
  'A-SSE.A.1',
  'A-REI.B.3',
  'A-REI.C.6',
  'A-REI.B.4b',
  'F-IF.B.6',
  'F-IF.C.7a',
]
existingStd.lessonCoverage['alg1-l30'] = [
  'A.1(A)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A.5(A)',
  'A.8(A)',
  'A.3(C)',
  'A-CED.A.1',
  'A-REI.B.3',
  'A-REI.B.4b',
  'A-SSE.A.1',
  'F-IF.B.6',
  'F-IF.C.7b',
]

const l28Mean = [TX('A.12(B)', 'A.2(A)', 'A.1(D)'), CC('F-IF.A.1', 'F-IF.A.2', 'F-IF.C.7b')]
const l28Eval = [TX('A.12(B)', 'A.1(B)', 'A.1(F)'), CC('F-IF.A.2', 'F-IF.C.7b')]
const l28Graph = [TX('A.2(A)', 'A.3(C)', 'A.1(D)'), CC('F-IF.C.7b', 'F-IF.A.1')]

const l29Expr = [TX('A.5(A)', 'A.10(A)', 'A.1(B)'), CC('A-SSE.A.1', 'A-REI.B.3')]
const l29Lin = [TX('A.3(A)', 'A.2(C)', 'A.3(F)'), CC('F-IF.B.6', 'A-REI.C.6')]
const l29Quad = [TX('A.8(A)', 'A.7(A)', 'A.1(F)'), CC('A-REI.B.4b', 'F-IF.C.7a')]

const l30Flu = [TX('A.1(B)', 'A.1(F)', 'A.5(A)'), CC('A-REI.B.3', 'A-SSE.A.1')]
const l30Con = [TX('A.1(D)', 'A.1(F)', 'A.3(C)'), CC('F-IF.C.7b', 'F-IF.B.6')]
const l30Mas = [TX('A.1(A)', 'A.1(B)', 'A.1(F)'), CC('A-CED.A.1', 'A-REI.B.4b')]

function buildItems(prefix, specs) {
  const items = []
  let mcIdx = 0
  for (const s of specs) {
    const partial = {
      id: `${prefix}-${s.id}`,
      knowledgePointIds: [s.kp],
      difficulty: s.diff,
      irt: { a: s.a ?? 1.15, b: s.b, c: s.c ?? 0.2 },
      prompt: s.prompt,
      feedbackCorrect: s.fc,
      feedbackIncorrect: s.fi,
      standards: s.stds,
    }
    if (s.math) partial.promptMath = latexifyMath(s.math)
    if (s.tags) partial.diagnosticTags = s.tags
    if (s.latex) partial.correctLatex = latexifyMath(s.latex)
    if (s.num !== undefined) partial.acceptNumeric = s.num
    if (s.tol !== undefined) partial.tolerance = s.tol
    if (s.choices0) {
      const keyed = withKey(latexifyChoices(s.choices0), s.key !== undefined ? s.key : keyCycle(mcIdx++))
      partial.choices = keyed.choices
      partial.correctIndex = keyed.correctIndex
    }
    items.push(item(partial))
  }
  return items
}

/* ═══════════════════════════════════════
   LESSON 28 — Piecewise functions intro
   ═══════════════════════════════════════ */
const l28Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.piecewise.meaning',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'In a piecewise function, each rule applies only on its listed domain piece.',
      'En una función por partes, cada regla aplica solo en su trozo de dominio listado.',
      'W funkcji przedziałami każda reguła obowiązuje tylko na wymienionym kawałku dziedziny.',
    ),
    math: 'f(x)=\\begin{cases} x+1 & x<0 \\\\ 2x & x\\ge 0 \\end{cases}',
    choices0: mathChoicesL(
      ['\\text{true}', '\\text{false}', '\\text{only if continuous}', '\\text{never}'],
      ['\\text{verdadero}', '\\text{falso}', '\\text{solo si continua}', '\\text{nunca}'],
      ['\\text{prawda}', '\\text{fałsz}', '\\text{tylko jeśli ciągła}', '\\text{nigdy}'],
    ),
    fc: L(
      'Yes — pick the piece whose domain contains the input.',
      'Sí — elige el trozo cuyo dominio contiene la entrada.',
      'Tak — wybierz część, której dziedzina zawiera argument.',
    ),
    fi: L(
      'Do not apply every piece to every x; domains restrict which rule is active.',
      'No apliques cada trozo a todo x; los dominios limitan qué regla está activa.',
      'Nie stosuj każdej części do każdego x; dziedziny ograniczają aktywną regułę.',
    ),
    tags: ['all_pieces_always', 'domain_ignored'],
    stds: l28Mean,
  },
  {
    id: 't02',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'For f above, which expression do you use to find f(3)?',
      'Para f arriba, ¿qué expresión usas para hallar f(3)?',
      'Dla f powyżej, którego wyrażenia użyjesz, by znaleźć f(3)?',
    ),
    math: 'f(3)\\,?\\quad x\\ge 0\\Rightarrow 2x',
    choices0: mathChoices('2x', 'x+1', 'x-1', '3x'),
    fc: L(
      'Since 3 ≥ 0, use the second piece: 2x.',
      'Como 3 ≥ 0, usa el segundo trozo: 2x.',
      'Ponieważ 3 ≥ 0, użyj drugiej części: 2x.',
    ),
    fi: L(
      'Check which inequality contains 3 before substituting.',
      'Verifica qué desigualdad contiene 3 antes de sustituir.',
      'Sprawdź, która nierówność zawiera 3, zanim podstawisz.',
    ),
    tags: ['wrong_piece', 'ignored_domain'],
    stds: l28Eval,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Given f(x) = x + 1 for x < 0 and f(x) = 2x for x ≥ 0, find f(4).',
      'Dado f(x) = x + 1 si x < 0 y f(x) = 2x si x ≥ 0, halla f(4).',
      'Dane f(x) = x + 1 dla x < 0 i f(x) = 2x dla x ≥ 0, znajdź f(4).',
    ),
    math: 'f(4)',
    choices0: mathChoices('8', '5', '4', '3'),
    fc: L(
      '4 ≥ 0 → f(4) = 2·4 = 8.',
      '4 ≥ 0 → f(4) = 2·4 = 8.',
      '4 ≥ 0 → f(4) = 2·4 = 8.',
    ),
    fi: L(
      'Use 2x, not x + 1, when x ≥ 0.',
      'Usa 2x, no x + 1, cuando x ≥ 0.',
      'Użyj 2x, nie x + 1, gdy x ≥ 0.',
    ),
    tags: ['wrong_piece', 'arith_error'],
    stds: l28Eval,
    num: 8,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Same f: find f(−2).',
      'Misma f: halla f(−2).',
      'Ta sama f: znajdź f(−2).',
    ),
    math: 'f(-2)',
    choices0: mathChoices('-1', '-4', '2', '0'),
    fc: L(
      '−2 < 0 → f(−2) = −2 + 1 = −1.',
      '−2 < 0 → f(−2) = −2 + 1 = −1.',
      '−2 < 0 → f(−2) = −2 + 1 = −1.',
    ),
    fi: L(
      'Negative inputs use x + 1 here, not 2x.',
      'Las entradas negativas usan x + 1 aquí, no 2x.',
      'Ujemne argumenty używają tu x + 1, nie 2x.',
    ),
    tags: ['wrong_piece', 'sign_error'],
    stds: l28Eval,
    num: -1,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.piecewise.meaning',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'At the junction x = 0 for this f, which piece applies?',
      'En la unión x = 0 de esta f, ¿qué trozo aplica?',
      'Na łączeniu x = 0 tej f, która część obowiązuje?',
    ),
    math: 'x=0:\\ ?',
    choices0: mathChoicesL(
      ['2x\\ (\\ge)', 'x+1\\ (<)', '\\text{neither}', '\\text{both}'],
      ['2x\\ (\\ge)', 'x+1\\ (<)', '\\text{ninguno}', '\\text{ambos}'],
      ['2x\\ (\\ge)', 'x+1\\ (<)', '\\text{żadna}', '\\text{obie}'],
    ),
    fc: L(
      'The second piece includes x ≥ 0, so x = 0 uses 2x.',
      'El segundo trozo incluye x ≥ 0, así que x = 0 usa 2x.',
      'Druga część obejmuje x ≥ 0, więc x = 0 używa 2x.',
    ),
    fi: L(
      'Read ≤/≥ carefully at shared endpoints.',
      'Lee ≤/≥ con cuidado en extremos compartidos.',
      'Czytaj ≤/≥ ostrożnie na wspólnych końcach.',
    ),
    tags: ['endpoint_wrong', 'both_pieces'],
    stds: l28Mean,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.piecewise.graph',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'For x < 0 with a strict inequality, the graph at the left of 0 should show…',
      'Para x < 0 con desigualdad estricta, a la izquierda de 0 la gráfica debe mostrar…',
      'Dla x < 0 z ostrą nierównością na lewo od 0 wykres powinien pokazywać…',
    ),
    math: 'x<0:\\ \\circ\\ ?',
    choices0: mathChoicesL(
      ['\\text{open circle at join}', '\\text{filled dot}', '\\text{vertical asymptote}', '\\text{no graph}'],
      ['\\text{círculo abierto en unión}', '\\text{punto relleno}', '\\text{asíntota vertical}', '\\text{sin gráfica}'],
      ['\\text{puste kółko na łączeniu}', '\\text{wypełniony punkt}', '\\text{asymptota pionowa}', '\\text{brak wykresu}'],
    ),
    fc: L(
      'Strict < leaves an open circle if that endpoint is not covered by another piece.',
      'Un < estricto deja círculo abierto si otro trozo no cubre ese extremo.',
      'Ostre < zostawia puste kółko, jeśli inna część nie obejmuje tego końca.',
    ),
    fi: L(
      'Filled dots are for included endpoints (≤ or ≥).',
      'Los puntos rellenos son para extremos incluidos (≤ o ≥).',
      'Wypełnione punkty są dla końców włączonych (≤ lub ≥).',
    ),
    tags: ['open_vs_closed', 'drew_both'],
    stds: l28Graph,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'g(x) = −x if x ≤ 1 and g(x) = x − 2 if x > 1. Find g(1).',
      'g(x) = −x si x ≤ 1 y g(x) = x − 2 si x > 1. Halla g(1).',
      'g(x) = −x gdy x ≤ 1 i g(x) = x − 2 gdy x > 1. Znajdź g(1).',
    ),
    math: 'g(1)',
    choices0: mathChoices('-1', '-1', '0', '3').en
      ? mathChoices('-1', '0', '3', '1')
      : mathChoices('-1', '0', '3', '1'),
    fc: L(
      '1 ≤ 1 → g(1) = −1.',
      '1 ≤ 1 → g(1) = −1.',
      '1 ≤ 1 → g(1) = −1.',
    ),
    fi: L(
      'x = 1 belongs to the first piece (−x), not x − 2.',
      'x = 1 pertenece al primer trozo (−x), no a x − 2.',
      'x = 1 należy do pierwszej części (−x), nie do x − 2.',
    ),
    tags: ['wrong_piece', 'endpoint_wrong'],
    stds: l28Eval,
    num: -1,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'h(x) = 3 if x < 2 and h(x) = x if x ≥ 2. Find h(5).',
      'h(x) = 3 si x < 2 y h(x) = x si x ≥ 2. Halla h(5).',
      'h(x) = 3 gdy x < 2 i h(x) = x gdy x ≥ 2. Znajdź h(5).',
    ),
    math: 'h(5)',
    choices0: mathChoices('5', '3', '2', '7'),
    fc: L(
      '5 ≥ 2 → h(5) = 5.',
      '5 ≥ 2 → h(5) = 5.',
      '5 ≥ 2 → h(5) = 5.',
    ),
    fi: L(
      'Constant piece 3 only applies when x < 2.',
      'El trozo constante 3 solo aplica cuando x < 2.',
      'Stała część 3 obowiązuje tylko gdy x < 2.',
    ),
    tags: ['wrong_piece', 'used_constant'],
    stds: l28Eval,
    num: 5,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Same h: find h(0).',
      'Misma h: halla h(0).',
      'Ta sama h: znajdź h(0).',
    ),
    math: 'h(0)',
    choices0: mathChoices('3', '0', '2', '1'),
    fc: L(
      '0 < 2 → h(0) = 3.',
      '0 < 2 → h(0) = 3.',
      '0 < 2 → h(0) = 3.',
    ),
    fi: L(
      'For x < 2 the output is the constant 3.',
      'Para x < 2 la salida es la constante 3.',
      'Dla x < 2 wynik to stała 3.',
    ),
    tags: ['wrong_piece', 'identity_confusion'],
    stds: l28Eval,
    num: 3,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.piecewise.meaning',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Which statement about piecewise functions is correct?',
      '¿Qué enunciado sobre funciones por partes es correcto?',
      'Które stwierdzenie o funkcjach przedziałami jest poprawne?',
    ),
    math: '\\text{piecewise}',
    choices0: mathChoicesL(
      ['\\text{one rule per domain piece}', '\\text{all rules always}', '\\text{no domains}', '\\text{only constants}'],
      ['\\text{una regla por trozo}', '\\text{todas siempre}', '\\text{sin dominios}', '\\text{solo constantes}'],
      ['\\text{jedna reguła na kawałek}', '\\text{wszystkie zawsze}', '\\text{bez dziedzin}', '\\text{tylko stałe}'],
    ),
    fc: L(
      'Each expression is paired with the inputs where it applies.',
      'Cada expresión se empareja con las entradas donde aplica.',
      'Każde wyrażenie jest powiązane z argumentami, dla których obowiązuje.',
    ),
    fi: L(
      'Domains decide which single rule is live for a given x.',
      'Los dominios deciden qué única regla está activa para un x dado.',
      'Dziedziny decydują, która jedna reguła jest aktywna dla danego x.',
    ),
    tags: ['all_pieces_always', 'domain_ignored'],
    stds: l28Mean,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.piecewise.graph',
    diff: 0.6,
    b: 0.45,
    prompt: L(
      'If a piece uses x ≥ a, the graph at x = a usually shows…',
      'Si un trozo usa x ≥ a, en x = a la gráfica suele mostrar…',
      'Jeśli część ma x ≥ a, na wykresie przy x = a zwykle widać…',
    ),
    math: 'x\\ge a:\\ \\bullet',
    choices0: mathChoicesL(
      ['\\text{filled endpoint}', '\\text{open endpoint}', '\\text{hole always}', '\\text{arrow only}'],
      ['\\text{extremo relleno}', '\\text{extremo abierto}', '\\text{hueco siempre}', '\\text{solo flecha}'],
      ['\\text{wypełniony koniec}', '\\text{otwarty koniec}', '\\text{zawsze dziura}', '\\text{tylko strzałka}'],
    ),
    fc: L(
      '≥ includes the endpoint, so mark it filled (unless another piece overrides continuity concerns).',
      '≥ incluye el extremo, así que márcalo relleno (salvo matices de continuidad).',
      '≥ obejmuje koniec, więc zaznacz wypełniony (chyba że ciągłość mówi inaczej).',
    ),
    fi: L(
      'Open circles match strict < or >.',
      'Los círculos abiertos corresponden a < o > estrictos.',
      'Puste kółka odpowiadają ostrym < lub >.',
    ),
    tags: ['open_vs_closed', 'endpoint_wrong'],
    stds: l28Graph,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.62,
    b: 0.5,
    prompt: L(
      'p(x) = x² if x < 0 and p(x) = x + 4 if x ≥ 0. Find p(−3).',
      'p(x) = x² si x < 0 y p(x) = x + 4 si x ≥ 0. Halla p(−3).',
      'p(x) = x² gdy x < 0 i p(x) = x + 4 gdy x ≥ 0. Znajdź p(−3).',
    ),
    math: 'p(-3)',
    choices0: mathChoices('9', '1', '-3', '4'),
    fc: L(
      '−3 < 0 → p(−3) = (−3)² = 9.',
      '−3 < 0 → p(−3) = (−3)² = 9.',
      '−3 < 0 → p(−3) = (−3)² = 9.',
    ),
    fi: L(
      'Use the quadratic piece for negative inputs.',
      'Usa el trozo cuadrático para entradas negativas.',
      'Użyj części kwadratowej dla ujemnych argumentów.',
    ),
    tags: ['wrong_piece', 'sign_error'],
    stds: l28Eval,
    num: 9,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Same p: find p(0).',
      'Misma p: halla p(0).',
      'Ta sama p: znajdź p(0).',
    ),
    math: 'p(0)',
    choices0: mathChoices('4', '0', '9', '1'),
    fc: L(
      '0 ≥ 0 → p(0) = 0 + 4 = 4.',
      '0 ≥ 0 → p(0) = 0 + 4 = 4.',
      '0 ≥ 0 → p(0) = 0 + 4 = 4.',
    ),
    fi: L(
      'The linear piece includes zero.',
      'El trozo lineal incluye el cero.',
      'Część liniowa obejmuje zero.',
    ),
    tags: ['wrong_piece', 'endpoint_wrong'],
    stds: l28Eval,
    num: 4,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.piecewise.graph',
    diff: 0.68,
    b: 0.65,
    prompt: L(
      'Two pieces should never both be drawn for the same x-value.',
      'Dos trozos nunca deben dibujarse ambos para el mismo valor de x.',
      'Dwóch części nigdy nie rysuje się jednocześnie dla tej samej wartości x.',
    ),
    math: '\\neg(f_1\\land f_2)\\ \\text{ for one }x',
    choices0: mathChoicesL(
      ['\\text{true}', '\\text{false}', '\\text{only if parallel}', '\\text{only if linear}'],
      ['\\text{verdadero}', '\\text{falso}', '\\text{solo si paralelos}', '\\text{solo si lineales}'],
      ['\\text{prawda}', '\\text{fałsz}', '\\text{tylko jeśli równoległe}', '\\text{tylko jeśli liniowe}'],
    ),
    fc: L(
      'Domains partition inputs so exactly one rule applies (or none, if undefined).',
      'Los dominios particionan entradas para que aplique exactamente una regla (o ninguna).',
      'Dziedziny dzielą argumenty tak, by obowiązywała dokładnie jedna reguła (lub żadna).',
    ),
    fi: L(
      'Overlapping active pieces would make a multi-valued relation, not a function.',
      'Trozo activos solapados harían una relación multivaluada, no una función.',
      'Nakładające się aktywne części dałyby relację wielowartościową, nie funkcję.',
    ),
    tags: ['drew_both', 'not_a_function'],
    stds: l28Graph,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.piecewise.meaning',
    diff: 0.7,
    b: 0.7,
    prompt: L(
      'q(x) = 5 − x for x ≤ −1 and q(x) = 2x for x > −1. Which piece for x = −1?',
      'q(x) = 5 − x si x ≤ −1 y q(x) = 2x si x > −1. ¿Qué trozo para x = −1?',
      'q(x) = 5 − x gdy x ≤ −1 i q(x) = 2x gdy x > −1. Która część dla x = −1?',
    ),
    math: 'q(-1):\\ ?',
    choices0: mathChoices('5-x', '2x', 'x+5', 'x/2'),
    fc: L(
      'x = −1 satisfies ≤ −1, so use 5 − x.',
      'x = −1 cumple ≤ −1, así que usa 5 − x.',
      'x = −1 spełnia ≤ −1, więc użyj 5 − x.',
    ),
    fi: L(
      '≤ includes the boundary; > does not.',
      '≤ incluye la frontera; > no.',
      '≤ obejmuje granicę; > nie.',
    ),
    tags: ['endpoint_wrong', 'wrong_piece'],
    stds: l28Mean,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.piecewise.evaluate',
    diff: 0.72,
    b: 0.8,
    prompt: L(
      'Same q: find q(−1).',
      'Misma q: halla q(−1).',
      'Ta sama q: znajdź q(−1).',
    ),
    math: 'q(-1)',
    choices0: mathChoices('6', '-2', '2', '4'),
    fc: L(
      'q(−1) = 5 − (−1) = 6.',
      'q(−1) = 5 − (−1) = 6.',
      'q(−1) = 5 − (−1) = 6.',
    ),
    fi: L(
      'Substitute into 5 − x: 5 − (−1) = 6.',
      'Sustituye en 5 − x: 5 − (−1) = 6.',
      'Podstaw do 5 − x: 5 − (−1) = 6.',
    ),
    tags: ['sign_error', 'arith_error'],
    stds: l28Eval,
    num: 6,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.piecewise.graph',
    diff: 0.75,
    b: 0.9,
    prompt: L(
      'A piecewise linear graph with a jump at x = 2 is still a function if…',
      'Una gráfica lineal por partes con un salto en x = 2 sigue siendo función si…',
      'Wykres przedziałami liniowy ze skokiem w x = 2 nadal jest funkcją, jeśli…',
    ),
    math: 'x=2:\\ \\text{jump}',
    choices0: mathChoicesL(
      ['\\text{one y per x}', '\\text{two y at 2}', '\\text{vertical line}', '\\text{always not}'],
      ['\\text{una y por x}', '\\text{dos y en 2}', '\\text{recta vertical}', '\\text{nunca}'],
      ['\\text{jedno y na x}', '\\text{dwa y w 2}', '\\text{prosta pionowa}', '\\text{nigdy}'],
    ),
    fc: L(
      'As long as each x maps to at most one y, a jump is allowed.',
      'Mientras cada x mapee a lo sumo a una y, un salto es permitido.',
      'Dopóki każde x ma co najwyżej jedno y, skok jest dozwolony.',
    ),
    fi: L(
      'Vertical-line test fails only if two outputs share one x.',
      'La prueba de la vertical falla solo si dos salidas comparten un x.',
      'Test pionowej zawodzi tylko, gdy dwa wyniki dzielą to samo x.',
    ),
    tags: ['not_a_function', 'drew_both'],
    stds: l28Graph,
  },
]

/* Fix accidental ternary mess on g05 — rewrite cleanly */
l28Specs.find((s) => s.id === 'g05').choices0 = mathChoices('-1', '0', '3', '1')

/* ═══════════════════════════════════════
   LESSON 29 — Cumulative mixed review
   ═══════════════════════════════════════ */
const l29Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.review.expr.eq',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'Simplify: 3x + 5x − 2.',
      'Simplifica: 3x + 5x − 2.',
      'Uprość: 3x + 5x − 2.',
    ),
    math: '3x+5x-2',
    choices0: mathChoices('8x-2', '8x+2', '15x-2', '3x-2'),
    fc: L(
      'Combine like terms: 8x − 2.',
      'Combina términos semejantes: 8x − 2.',
      'Połącz podobne wyrazy: 8x − 2.',
    ),
    fi: L(
      '3x + 5x = 8x; the constant −2 stays.',
      '3x + 5x = 8x; la constante −2 permanece.',
      '3x + 5x = 8x; stała −2 zostaje.',
    ),
    tags: ['unlike_terms', 'sign_error'],
    stds: l29Expr,
  },
  {
    id: 't02',
    kp: 'kp.alg1.review.linear.fn',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'In y = −2x + 7, the slope is…',
      'En y = −2x + 7, la pendiente es…',
      'W y = −2x + 7 nachylenie to…',
    ),
    math: 'y=-2x+7',
    choices0: mathChoices('-2', '7', '2', '-7'),
    fc: L(
      'Slope-intercept form y = mx + b → m = −2.',
      'Forma y = mx + b → m = −2.',
      'Postać y = mx + b → m = −2.',
    ),
    fi: L(
      'm is the coefficient of x; b is the y-intercept.',
      'm es el coeficiente de x; b es la intersección con y.',
      'm to współczynnik przy x; b to przecięcie z y.',
    ),
    tags: ['swapped_mb', 'sign_error'],
    stds: l29Lin,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.review.expr.eq',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Solve: 2x + 5 = 17.',
      'Resuelve: 2x + 5 = 17.',
      'Rozwiąż: 2x + 5 = 17.',
    ),
    math: '2x+5=17',
    choices0: mathChoices('6', '11', '5', '12'),
    fc: L(
      '2x = 12 → x = 6.',
      '2x = 12 → x = 6.',
      '2x = 12 → x = 6.',
    ),
    fi: L(
      'Subtract 5, then divide by 2.',
      'Resta 5, luego divide entre 2.',
      'Odejmij 5, potem podziel przez 2.',
    ),
    tags: ['arith_error', 'forgot_divide'],
    stds: l29Expr,
    num: 6,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.review.linear.fn',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'If f(x) = 3x − 1, find f(4).',
      'Si f(x) = 3x − 1, halla f(4).',
      'Jeśli f(x) = 3x − 1, znajdź f(4).',
    ),
    math: 'f(4)',
    choices0: mathChoices('11', '12', '7', '13'),
    fc: L(
      'f(4) = 3·4 − 1 = 11.',
      'f(4) = 3·4 − 1 = 11.',
      'f(4) = 3·4 − 1 = 11.',
    ),
    fi: L(
      'Substitute carefully: multiply first, then subtract.',
      'Sustituye con cuidado: multiplica primero, luego resta.',
      'Podstaw ostrożnie: najpierw mnożenie, potem odejmowanie.',
    ),
    tags: ['order_ops', 'arith_error'],
    stds: l29Lin,
    num: 11,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.review.quadratic',
    diff: 0.45,
    b: -0.1,
    prompt: L(
      'For y = x² − 4, the parabola opens…',
      'Para y = x² − 4, la parábola abre…',
      'Dla y = x² − 4 parabola otwiera się…',
    ),
    math: 'y=x^2-4',
    choices0: mathChoicesL(
      ['\\text{up}', '\\text{down}', '\\text{left}', '\\text{right}'],
      ['\\text{arriba}', '\\text{abajo}', '\\text{izquierda}', '\\text{derecha}'],
      ['\\text{w górę}', '\\text{w dół}', '\\text{w lewo}', '\\text{w prawo}'],
    ),
    fc: L(
      'Leading coefficient a = 1 > 0 → opens upward.',
      'Coeficiente a = 1 > 0 → abre hacia arriba.',
      'Współczynnik a = 1 > 0 → otwiera się w górę.',
    ),
    fi: L(
      'Sign of a controls up vs down.',
      'El signo de a controla arriba vs abajo.',
      'Znak a steruje górą vs dołem.',
    ),
    tags: ['direction_wrong', 'a_misread'],
    stds: l29Quad,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.review.expr.eq',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'Solve: 3(x − 2) = 12.',
      'Resuelve: 3(x − 2) = 12.',
      'Rozwiąż: 3(x − 2) = 12.',
    ),
    math: '3(x-2)=12',
    choices0: mathChoices('6', '4', '2', '8'),
    fc: L(
      'x − 2 = 4 → x = 6.',
      'x − 2 = 4 → x = 6.',
      'x − 2 = 4 → x = 6.',
    ),
    fi: L(
      'Divide both sides by 3, then add 2.',
      'Divide ambos lados entre 3, luego suma 2.',
      'Podziel obie strony przez 3, potem dodaj 2.',
    ),
    tags: ['distribute_error', 'arith_error'],
    stds: l29Expr,
    num: 6,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.review.linear.fn',
    diff: 0.52,
    b: 0.2,
    prompt: L(
      'System: x + y = 5 and x − y = 1. Find x.',
      'Sistema: x + y = 5 y x − y = 1. Halla x.',
      'Układ: x + y = 5 i x − y = 1. Znajdź x.',
    ),
    math: '\\begin{cases} x+y=5 \\\\ x-y=1 \\end{cases}',
    choices0: mathChoices('3', '2', '4', '1'),
    fc: L(
      'Add: 2x = 6 → x = 3.',
      'Suma: 2x = 6 → x = 3.',
      'Dodaj: 2x = 6 → x = 3.',
    ),
    fi: L(
      'Elimination: add to cancel y.',
      'Eliminación: suma para cancelar y.',
      'Eliminacja: dodaj, by skasować y.',
    ),
    tags: ['one_eq_only', 'arith_error'],
    stds: l29Lin,
    num: 3,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.review.expr.eq',
    diff: 0.55,
    b: 0.25,
    prompt: L(
      'Simplify: (2x² + 3x) − (x² − x).',
      'Simplifica: (2x² + 3x) − (x² − x).',
      'Uprość: (2x² + 3x) − (x² − x).',
    ),
    math: '(2x^2+3x)-(x^2-x)',
    choices0: mathChoices('x^2+4x', 'x^2+2x', '3x^2+4x', 'x^2+3x'),
    fc: L(
      'Distribute the minus: 2x² + 3x − x² + x = x² + 4x.',
      'Distribuye el menos: 2x² + 3x − x² + x = x² + 4x.',
      'Rozdziel minus: 2x² + 3x − x² + x = x² + 4x.',
    ),
    fi: L(
      'Subtracting −x adds x.',
      'Restar −x suma x.',
      'Odejmowanie −x dodaje x.',
    ),
    tags: ['distribute_minus', 'unlike_terms'],
    stds: l29Expr,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.review.linear.fn',
    diff: 0.58,
    b: 0.35,
    prompt: L(
      'A line through (0, −3) with slope 4 has equation…',
      'Una recta por (0, −3) con pendiente 4 tiene ecuación…',
      'Prosta przez (0, −3) o nachyleniu 4 ma równanie…',
    ),
    math: 'm=4,\\ b=-3',
    choices0: mathChoices('y=4x-3', 'y=-3x+4', 'y=4x+3', 'y=x-3'),
    fc: L(
      'y = mx + b → y = 4x − 3.',
      'y = mx + b → y = 4x − 3.',
      'y = mx + b → y = 4x − 3.',
    ),
    fi: L(
      'Point (0, b) is the y-intercept.',
      'El punto (0, b) es la intersección con y.',
      'Punkt (0, b) to przecięcie z y.',
    ),
    tags: ['swapped_mb', 'sign_error'],
    stds: l29Lin,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.review.quadratic',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Solve by factoring: x² − 5x + 6 = 0.',
      'Resuelve por factorización: x² − 5x + 6 = 0.',
      'Rozwiąż przez faktoryzację: x² − 5x + 6 = 0.',
    ),
    math: 'x^2-5x+6=0',
    choices0: mathChoicesL(
      ['x=2\\vee x=3', 'x=1\\vee x=6', 'x=-2\\vee x=-3', 'x=0\\vee x=5'],
      ['x=2\\vee x=3', 'x=1\\vee x=6', 'x=-2\\vee x=-3', 'x=0\\vee x=5'],
      ['x=2\\vee x=3', 'x=1\\vee x=6', 'x=-2\\vee x=-3', 'x=0\\vee x=5'],
    ),
    fc: L(
      '(x − 2)(x − 3) = 0 → x = 2 or 3.',
      '(x − 2)(x − 3) = 0 → x = 2 o 3.',
      '(x − 2)(x − 3) = 0 → x = 2 lub 3.',
    ),
    fi: L(
      'Find factors of 6 that add to −5: −2 and −3.',
      'Halla factores de 6 que sumen −5: −2 y −3.',
      'Znajdź czynniki 6 o sumie −5: −2 i −3.',
    ),
    tags: ['dropped_root', 'factor_error'],
    stds: l29Quad,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.review.expr.eq',
    diff: 0.62,
    b: 0.5,
    prompt: L(
      'Solve: 5x − 3 = 2x + 9.',
      'Resuelve: 5x − 3 = 2x + 9.',
      'Rozwiąż: 5x − 3 = 2x + 9.',
    ),
    math: '5x-3=2x+9',
    choices0: mathChoices('4', '3', '6', '2'),
    fc: L(
      '3x = 12 → x = 4.',
      '3x = 12 → x = 4.',
      '3x = 12 → x = 4.',
    ),
    fi: L(
      'Collect x-terms on one side and constants on the other.',
      'Reúne términos en x a un lado y constantes al otro.',
      'Zbierz wyrazy z x po jednej stronie, stałe po drugiej.',
    ),
    tags: ['sign_error', 'arith_error'],
    stds: l29Expr,
    num: 4,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.review.linear.fn',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Rate of change of y = −0.5x + 10 is…',
      'La tasa de cambio de y = −0.5x + 10 es…',
      'Tempo zmiany y = −0.5x + 10 to…',
    ),
    math: 'y=-0.5x+10',
    choices0: mathChoices('-0.5', '10', '0.5', '-10'),
    fc: L(
      'Constant rate of change equals slope m = −0.5.',
      'La tasa constante es la pendiente m = −0.5.',
      'Stałe tempo zmiany to nachylenie m = −0.5.',
    ),
    fi: L(
      'Do not confuse slope with the intercept.',
      'No confundas la pendiente con la intersección.',
      'Nie myl nachylenia z przecięciem.',
    ),
    tags: ['swapped_mb', 'sign_error'],
    stds: l29Lin,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.review.quadratic',
    diff: 0.68,
    b: 0.65,
    prompt: L(
      'Discriminant of x² + 2x + 5 = 0 is…',
      'El discriminante de x² + 2x + 5 = 0 es…',
      'Dyskryminanta x² + 2x + 5 = 0 to…',
    ),
    math: '\\Delta=b^2-4ac',
    choices0: mathChoices('-16', '16', '4', '0'),
    fc: L(
      'Δ = 4 − 20 = −16 → no real roots.',
      'Δ = 4 − 20 = −16 → sin raíces reales.',
      'Δ = 4 − 20 = −16 → brak pierwiastków rzeczywistych.',
    ),
    fi: L(
      'b² − 4ac = 2² − 4·1·5 = −16.',
      'b² − 4ac = 2² − 4·1·5 = −16.',
      'b² − 4ac = 2² − 4·1·5 = −16.',
    ),
    tags: ['disc_sign', 'arith_error'],
    stds: l29Quad,
    num: -16,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.review.expr.eq',
    diff: 0.7,
    b: 0.7,
    prompt: L(
      'Translate: “5 less than twice a number n.”',
      'Traduce: “5 menos que el doble de un número n.”',
      'Przetłumacz: „5 mniej niż podwojona liczba n.”',
    ),
    math: '2n-5',
    choices0: mathChoices('2n-5', '5-2n', '2(n-5)', 'n/2-5'),
    fc: L(
      'Twice n is 2n; 5 less than that is 2n − 5.',
      'El doble de n es 2n; 5 menos que eso es 2n − 5.',
      'Podwojone n to 2n; 5 mniej niż to 2n − 5.',
    ),
    fi: L(
      '“Less than” subtracts from the doubled quantity.',
      '“Menos que” resta de la cantidad duplicada.',
      '„Mniej niż” odejmuje od podwojonej wielkości.',
    ),
    tags: ['reversed_subtraction', 'forgot_twice'],
    stds: l29Expr,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.review.quadratic',
    diff: 0.72,
    b: 0.8,
    prompt: L(
      'Vertex of y = (x − 3)² + 2 is…',
      'El vértice de y = (x − 3)² + 2 es…',
      'Wierzchołek y = (x − 3)² + 2 to…',
    ),
    math: 'y=(x-3)^2+2',
    choices0: mathChoices('(3,2)', '(-3,2)', '(3,-2)', '(2,3)'),
    fc: L(
      'Vertex form y = (x − h)² + k → (h, k) = (3, 2).',
      'Forma vértice y = (x − h)² + k → (h, k) = (3, 2).',
      'Postać wierzchołkowa y = (x − h)² + k → (h, k) = (3, 2).',
    ),
    fi: L(
      'Watch the sign inside (x − h).',
      'Cuidado con el signo dentro de (x − h).',
      'Uważaj na znak wewnątrz (x − h).',
    ),
    tags: ['vertex_sign', 'swapped_hk'],
    stds: l29Quad,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.review.linear.fn',
    diff: 0.74,
    b: 0.85,
    prompt: L(
      'Parallel to y = 2x − 1 through (0, 4) is…',
      'Paralela a y = 2x − 1 por (0, 4) es…',
      'Równoległa do y = 2x − 1 przez (0, 4) to…',
    ),
    math: 'm=2,\\ (0,4)',
    choices0: mathChoices('y=2x+4', 'y=-\\frac{1}{2}x+4', 'y=2x-4', 'y=4x+2'),
    fc: L(
      'Same slope 2, new intercept 4 → y = 2x + 4.',
      'Misma pendiente 2, nueva intersección 4 → y = 2x + 4.',
      'To samo nachylenie 2, nowe przecięcie 4 → y = 2x + 4.',
    ),
    fi: L(
      'Parallel lines share slope, not intercept.',
      'Las paralelas comparten pendiente, no intersección.',
      'Równoległe mają to samo nachylenie, nie przecięcie.',
    ),
    tags: ['perp_vs_parallel', 'swapped_mb'],
    stds: l29Lin,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.review.quadratic',
    diff: 0.78,
    b: 0.95,
    prompt: L(
      'Using the quadratic formula, roots of x² − 2x − 3 = 0 are…',
      'Con la fórmula cuadrática, las raíces de x² − 2x − 3 = 0 son…',
      'Ze wzoru kwadratowego pierwiastki x² − 2x − 3 = 0 to…',
    ),
    math: 'x=\\frac{2\\pm\\sqrt{4+12}}{2}',
    choices0: mathChoicesL(
      ['x=3\\vee x=-1', 'x=1\\vee x=-3', 'x=2\\vee x=-2', 'x=3\\vee x=1'],
      ['x=3\\vee x=-1', 'x=1\\vee x=-3', 'x=2\\vee x=-2', 'x=3\\vee x=1'],
      ['x=3\\vee x=-1', 'x=1\\vee x=-3', 'x=2\\vee x=-2', 'x=3\\vee x=1'],
    ),
    fc: L(
      'Δ = 16 → x = (2 ± 4)/2 → 3 or −1.',
      'Δ = 16 → x = (2 ± 4)/2 → 3 o −1.',
      'Δ = 16 → x = (2 ± 4)/2 → 3 lub −1.',
    ),
    fi: L(
      'Compute carefully: √16 = 4, then both ± cases.',
      'Calcula con cuidado: √16 = 4, luego ambos casos ±.',
      'Liczyć ostrożnie: √16 = 4, potem obie wersje ±.',
    ),
    tags: ['formula_arith', 'dropped_root'],
    stds: l29Quad,
  },
]

/* ═══════════════════════════════════════
   LESSON 30 — Course capstone / mastery check
   ═══════════════════════════════════════ */
const l30Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.3,
    b: -0.9,
    prompt: L(
      'Capstone tip: identify the skill family before computing.',
      'Consejo capstone: identifica la familia de habilidad antes de calcular.',
      'Wskazówka capstone: rozpoznaj rodzinę umiejętności przed rachunkiem.',
    ),
    math: '\\text{classify}\\rightarrow\\text{solve}',
    choices0: mathChoicesL(
      ['\\text{true}', '\\text{false}', '\\text{never helps}', '\\text{only for graphs}'],
      ['\\text{verdadero}', '\\text{falso}', '\\text{nunca ayuda}', '\\text{solo gráficas}'],
      ['\\text{prawda}', '\\text{fałsz}', '\\text{nigdy nie pomaga}', '\\text{tylko wykresy}'],
    ),
    fc: L(
      'Naming the skill reduces wrong-method traps on mixed sets.',
      'Nombrar la habilidad reduce trampas de método incorrecto en conjuntos mixtos.',
      'Nazwanie umiejętności zmniejsza pułapki złej metody w zestawach mieszanych.',
    ),
    fi: L(
      'Jumping straight to arithmetic often picks the wrong tool.',
      'Saltar directo a la aritmética suele elegir la herramienta incorrecta.',
      'Skok od razu do rachunku często wybiera złe narzędzie.',
    ),
    tags: ['rushed', 'wrong_family'],
    stds: l30Flu,
  },
  {
    id: 't02',
    kp: 'kp.alg1.capstone.connect',
    diff: 0.35,
    b: -0.7,
    prompt: L(
      'A graph, equation, and table can represent the same relationship.',
      'Una gráfica, ecuación y tabla pueden representar la misma relación.',
      'Wykres, równanie i tabela mogą reprezentować tę samą zależność.',
    ),
    math: '\\text{eq}\\leftrightarrow\\text{graph}\\leftrightarrow\\text{table}',
    choices0: mathChoicesL(
      ['\\text{true}', '\\text{false}', '\\text{only linear}', '\\text{only quadratic}'],
      ['\\text{verdadero}', '\\text{falso}', '\\text{solo lineal}', '\\text{solo cuadrática}'],
      ['\\text{prawda}', '\\text{fałsz}', '\\text{tylko liniowa}', '\\text{tylko kwadratowa}'],
    ),
    fc: L(
      'Multiple representations are a core Algebra I habit.',
      'Múltiples representaciones son un hábito central de Álgebra I.',
      'Wiele reprezentacji to kluczowy nawyk algebry I.',
    ),
    fi: L(
      'Switching forms is allowed for any function type you study here.',
      'Cambiar de forma está permitido para cualquier tipo de función aquí.',
      'Zmiana formy jest dozwolona dla każdego typu funkcji tu studiowanego.',
    ),
    tags: ['rep_isolated', 'type_limit'],
    stds: l30Con,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.4,
    b: -0.4,
    prompt: L(
      'Solve: 4x − 7 = 9.',
      'Resuelve: 4x − 7 = 9.',
      'Rozwiąż: 4x − 7 = 9.',
    ),
    math: '4x-7=9',
    choices0: mathChoices('4', '2', '16/4', '−4'),
    fc: L(
      '4x = 16 → x = 4.',
      '4x = 16 → x = 4.',
      '4x = 16 → x = 4.',
    ),
    fi: L(
      'Add 7, then divide by 4.',
      'Suma 7, luego divide entre 4.',
      'Dodaj 7, potem podziel przez 4.',
    ),
    tags: ['arith_error', 'sign_error'],
    stds: l30Flu,
    num: 4,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.capstone.connect',
    diff: 0.45,
    b: -0.2,
    prompt: L(
      'f(x) = 2x − 5 for x < 1 and f(x) = x for x ≥ 1. Find f(1).',
      'f(x) = 2x − 5 si x < 1 y f(x) = x si x ≥ 1. Halla f(1).',
      'f(x) = 2x − 5 gdy x < 1 i f(x) = x gdy x ≥ 1. Znajdź f(1).',
    ),
    math: 'f(1)',
    choices0: mathChoices('1', '-3', '2', '0'),
    fc: L(
      '1 ≥ 1 → f(1) = 1.',
      '1 ≥ 1 → f(1) = 1.',
      '1 ≥ 1 → f(1) = 1.',
    ),
    fi: L(
      'Use the piece that includes the endpoint.',
      'Usa el trozo que incluye el extremo.',
      'Użyj części obejmującej koniec.',
    ),
    tags: ['wrong_piece', 'endpoint_wrong'],
    stds: l30Con,
    num: 1,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.5,
    b: 0.0,
    prompt: L(
      'Factor: x² − 9.',
      'Factoriza: x² − 9.',
      'Rozłóż: x² − 9.',
    ),
    math: 'x^2-9',
    choices0: mathChoices('(x-3)(x+3)', '(x-9)(x+1)', '(x-3)^2', 'x(x-9)'),
    fc: L(
      'Difference of squares: (x − 3)(x + 3).',
      'Diferencia de cuadrados: (x − 3)(x + 3).',
      'Różnica kwadratów: (x − 3)(x + 3).',
    ),
    fi: L(
      'a² − b² = (a − b)(a + b) with a = x, b = 3.',
      'a² − b² = (a − b)(a + b) con a = x, b = 3.',
      'a² − b² = (a − b)(a + b) przy a = x, b = 3.',
    ),
    tags: ['dos_miss', 'factor_error'],
    stds: l30Flu,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.capstone.mastery',
    diff: 0.52,
    b: 0.15,
    prompt: L(
      'Which model fits “cost is $3 per item plus $10 fee”?',
      '¿Qué modelo encaja con “costo es $3 por artículo más $10 de cargo”?',
      'Który model pasuje do „koszt to 3$ za sztukę plus 10$ opłaty”?',
    ),
    math: 'C=3n+10',
    choices0: mathChoices('C=3n+10', 'C=3n-10', 'C=10n+3', 'C=3+10n'),
    // last distractor equals first algebraically for n — make distinct
    fc: L(
      'Fee is constant +10; per-item rate multiplies n.',
      'El cargo es constante +10; la tarifa por artículo multiplica n.',
      'Opłata to stałe +10; stawka za sztukę mnoży n.',
    ),
    fi: L(
      'Variable cost scales with n; fee is the intercept.',
      'El costo variable escala con n; el cargo es la intersección.',
      'Koszt zmienny skaluje się z n; opłata to przecięcie.',
    ),
    tags: ['swapped_rate_fee', 'sign_error'],
    stds: l30Mas,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.capstone.connect',
    diff: 0.55,
    b: 0.25,
    prompt: L(
      'If a scatter trend slopes down, correlation is typically…',
      'Si la tendencia de un diagrama baja, la correlación suele ser…',
      'Jeśli trend na wykresie rozrzutu spada, korelacja zwykle jest…',
    ),
    math: 'r<0\\ ?',
    choices0: mathChoicesL(
      ['\\text{negative}', '\\text{positive}', '\\text{zero always}', '\\text{undefined}'],
      ['\\text{negativa}', '\\text{positiva}', '\\text{cero siempre}', '\\text{indefinida}'],
      ['\\text{ujemna}', '\\text{dodatnia}', '\\text{zawsze zero}', '\\text{nieokreślona}'],
    ),
    fc: L(
      'Downward association → negative correlation.',
      'Asociación descendente → correlación negativa.',
      'Związek malejący → korelacja ujemna.',
    ),
    fi: L(
      'Positive correlation rises together.',
      'La correlación positiva sube juntos.',
      'Korelacja dodatnia rośnie razem.',
    ),
    tags: ['corr_sign', 'causation_confuse'],
    stds: l30Con,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.58,
    b: 0.3,
    prompt: L(
      'Solve: 2(x + 3) = x + 10.',
      'Resuelve: 2(x + 3) = x + 10.',
      'Rozwiąż: 2(x + 3) = x + 10.',
    ),
    math: '2(x+3)=x+10',
    choices0: mathChoices('4', '3', '7', '1'),
    fc: L(
      '2x + 6 = x + 10 → x = 4.',
      '2x + 6 = x + 10 → x = 4.',
      '2x + 6 = x + 10 → x = 4.',
    ),
    fi: L(
      'Distribute, then collect like terms.',
      'Distribuye, luego reúne términos semejantes.',
      'Rozdziel, potem zbierz podobne wyrazy.',
    ),
    tags: ['distribute_error', 'arith_error'],
    stds: l30Flu,
    num: 4,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Simplify: 4x² − 2x² + x.',
      'Simplifica: 4x² − 2x² + x.',
      'Uprość: 4x² − 2x² + x.',
    ),
    math: '4x^2-2x^2+x',
    choices0: mathChoices('2x^2+x', '2x^2', '6x^2+x', '2x^3+x'),
    fc: L(
      'Like squares combine: 2x² + x.',
      'Los cuadrados semejantes se combinan: 2x² + x.',
      'Podobne kwadraty łączą się: 2x² + x.',
    ),
    fi: L(
      'You cannot combine x² terms with the lone x.',
      'No puedes combinar términos x² con la x sola.',
      'Nie łącz wyrazów x² z samotnym x.',
    ),
    tags: ['unlike_terms', 'arith_error'],
    stds: l30Flu,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.capstone.connect',
    diff: 0.62,
    b: 0.45,
    prompt: L(
      'Slope between (1, 2) and (3, 8) is…',
      'La pendiente entre (1, 2) y (3, 8) es…',
      'Nachylenie między (1, 2) a (3, 8) to…',
    ),
    math: 'm=\\frac{8-2}{3-1}',
    choices0: mathChoices('3', '2', '6', '4'),
    fc: L(
      'm = 6/2 = 3.',
      'm = 6/2 = 3.',
      'm = 6/2 = 3.',
    ),
    fi: L(
      'Rise over run: Δy / Δx.',
      'Subida sobre avance: Δy / Δx.',
      'Przyrost y przez przyrost x: Δy / Δx.',
    ),
    tags: ['slope_flip', 'arith_error'],
    stds: l30Con,
    num: 3,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.capstone.mastery',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Solve by zero product: (x − 4)(x + 1) = 0.',
      'Resuelve por producto cero: (x − 4)(x + 1) = 0.',
      'Rozwiąż przez zerowy iloczyn: (x − 4)(x + 1) = 0.',
    ),
    math: '(x-4)(x+1)=0',
    choices0: mathChoicesL(
      ['x=4\\vee x=-1', 'x=-4\\vee x=1', 'x=4\\vee x=1', 'x=0\\vee x=4'],
      ['x=4\\vee x=-1', 'x=-4\\vee x=1', 'x=4\\vee x=1', 'x=0\\vee x=4'],
      ['x=4\\vee x=-1', 'x=-4\\vee x=1', 'x=4\\vee x=1', 'x=0\\vee x=4'],
    ),
    fc: L(
      'Each factor zero: x = 4 or x = −1.',
      'Cada factor cero: x = 4 o x = −1.',
      'Każdy czynnik zero: x = 4 lub x = −1.',
    ),
    fi: L(
      'Set each factor equal to zero separately.',
      'Iguala cada factor a cero por separado.',
      'Przyrównaj każdy czynnik osobno do zera.',
    ),
    tags: ['dropped_root', 'sign_error'],
    stds: l30Mas,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.68,
    b: 0.6,
    prompt: L(
      'System: y = x + 1 and y = −x + 5. Intersection x is…',
      'Sistema: y = x + 1 y y = −x + 5. La x de intersección es…',
      'Układ: y = x + 1 i y = −x + 5. x przecięcia to…',
    ),
    math: 'x+1=-x+5',
    choices0: mathChoices('2', '3', '1', '4'),
    fc: L(
      '2x = 4 → x = 2 (then y = 3).',
      '2x = 4 → x = 2 (luego y = 3).',
      '2x = 4 → x = 2 (potem y = 3).',
    ),
    fi: L(
      'Set right-hand sides equal and solve for x.',
      'Iguala los lados derechos y resuelve x.',
      'Przyrównaj prawe strony i rozwiąż x.',
    ),
    tags: ['one_eq_only', 'arith_error'],
    stds: l30Flu,
    num: 2,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.capstone.connect',
    diff: 0.7,
    b: 0.7,
    prompt: L(
      'For y = −x² + 4, the parabola opens…',
      'Para y = −x² + 4, la parábola abre…',
      'Dla y = −x² + 4 parabola otwiera się…',
    ),
    math: 'y=-x^2+4',
    choices0: mathChoicesL(
      ['\\text{down}', '\\text{up}', '\\text{left}', '\\text{right}'],
      ['\\text{abajo}', '\\text{arriba}', '\\text{izquierda}', '\\text{derecha}'],
      ['\\text{w dół}', '\\text{w górę}', '\\text{w lewo}', '\\text{w prawo}'],
    ),
    fc: L(
      'a = −1 < 0 → opens downward.',
      'a = −1 < 0 → abre hacia abajo.',
      'a = −1 < 0 → otwiera się w dół.',
    ),
    fi: L(
      'Negative leading coefficient flips the parabola down.',
      'Coeficiente principal negativo voltea la parábola hacia abajo.',
      'Ujemny współczynnik wiodący odwraca parabolę w dół.',
    ),
    tags: ['direction_wrong', 'a_misread'],
    stds: l30Con,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.capstone.mastery',
    diff: 0.72,
    b: 0.8,
    prompt: L(
      'Inequality: 3x + 1 ≤ 10. Solution is…',
      'Desigualdad: 3x + 1 ≤ 10. La solución es…',
      'Nierówność: 3x + 1 ≤ 10. Rozwiązanie to…',
    ),
    math: '3x+1\\le 10',
    choices0: mathChoices('x\\le 3', 'x\\ge 3', 'x<3', 'x>3'),
    fc: L(
      '3x ≤ 9 → x ≤ 3.',
      '3x ≤ 9 → x ≤ 3.',
      '3x ≤ 9 → x ≤ 3.',
    ),
    fi: L(
      'Dividing by positive 3 keeps the inequality direction.',
      'Dividir entre 3 positivo mantiene la dirección.',
      'Dzielenie przez dodatnie 3 zachowuje kierunek nierówności.',
    ),
    tags: ['flipped_inequality', 'arith_error'],
    stds: l30Mas,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.capstone.fluency',
    diff: 0.74,
    b: 0.85,
    prompt: L(
      'Evaluate: 2³ · 2².',
      'Evalúa: 2³ · 2².',
      'Oblicz: 2³ · 2².',
    ),
    math: '2^3\\cdot 2^2',
    choices0: mathChoices('2^5', '2^6', '4^5', '2^1'),
    fc: L(
      'Product rule: 2^{3+2} = 2^5.',
      'Regla del producto: 2^{3+2} = 2^5.',
      'Reguła iloczynu: 2^{3+2} = 2^5.',
    ),
    fi: L(
      'Same base: add exponents when multiplying.',
      'Misma base: suma exponentes al multiplicar.',
      'Ta sama podstawa: dodaj wykładniki przy mnożeniu.',
    ),
    tags: ['exp_multiply', 'multiplied_bases'],
    stds: l30Flu,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.capstone.mastery',
    diff: 0.76,
    b: 0.9,
    prompt: L(
      'After solving a word problem, you should…',
      'Tras resolver un problema verbal, debes…',
      'Po rozwiązaniu zadania słownego powinieneś…',
    ),
    math: '\\checkmark\\ \\text{units?}',
    choices0: mathChoicesL(
      ['\\text{check units/sense}', '\\text{skip context}', '\\text{force unique r}', '\\text{delete data}'],
      ['\\text{revisar unidades/sentido}', '\\text{omitir contexto}', '\\text{forzar r único}', '\\text{borrar datos}'],
      ['\\text{sprawdzić jedn./sens}', '\\text{pominąć kontekst}', '\\text{wymuszać jedno r}', '\\text{usunąć dane}'],
    ),
    fc: L(
      'Interpret the number in context before claiming mastery.',
      'Interpreta el número en contexto antes de reclamar dominio.',
      'Zinterpretuj liczbę w kontekście przed uznaniem opanowania.',
    ),
    fi: L(
      'A bare numeric answer without a check is incomplete.',
      'Una respuesta numérica sin verificación está incompleta.',
      'Sam wynik liczbowy bez sprawdzenia jest niekompletny.',
    ),
    tags: ['skipped_check', 'rushed'],
    stds: l30Mas,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.capstone.mastery',
    diff: 0.8,
    b: 1.0,
    prompt: L(
      'Quadratic formula for x² − 5x + 4 = 0 gives…',
      'La fórmula cuadrática para x² − 5x + 4 = 0 da…',
      'Wzór kwadratowy dla x² − 5x + 4 = 0 daje…',
    ),
    math: 'x=\\frac{5\\pm\\sqrt{25-16}}{2}',
    choices0: mathChoicesL(
      ['x=4\\vee x=1', 'x=5\\vee x=0', 'x=-4\\vee x=-1', 'x=2\\vee x=2'],
      ['x=4\\vee x=1', 'x=5\\vee x=0', 'x=-4\\vee x=-1', 'x=2\\vee x=2'],
      ['x=4\\vee x=1', 'x=5\\vee x=0', 'x=-4\\vee x=-1', 'x=2\\vee x=2'],
    ),
    fc: L(
      'Δ = 9 → x = (5 ± 3)/2 → 4 or 1.',
      'Δ = 9 → x = (5 ± 3)/2 → 4 o 1.',
      'Δ = 9 → x = (5 ± 3)/2 → 4 lub 1.',
    ),
    fi: L(
      'Finish both ± branches after the square root.',
      'Termina ambas ramas ± después de la raíz.',
      'Dokończ obie gałęzie ± po pierwiastku.',
    ),
    tags: ['formula_arith', 'dropped_root'],
    stds: l30Mas,
  },
]

/* Fix g04 distractor that duplicated algebraically */
l30Specs.find((s) => s.id === 'g04').choices0 = mathChoices('C=3n+10', 'C=3n-10', 'C=10n+3', 'C=n+13')

const lesson28Items = buildItems('alg1-l28', l28Specs)
const lesson29Items = buildItems('alg1-l29', l29Specs)
const lesson30Items = buildItems('alg1-l30', l30Specs)

function pack(id, order, title, kps, siteId, unlock, teachTitle, teachBody, teachMath, guidedBody, items) {
  const prefix = id
  return {
    id,
    courseId: 'algebra1',
    order,
    title,
    knowledgePointIds: kps,
    masteryThreshold: 0.8,
    worldHook: {
      siteId,
      unlockOnMastery: unlock,
    },
    sections: [
      {
        phase: 'objective',
        title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
        body: L(
          `You will work on: ${title.en}.`,
          `Trabajarás en: ${title.es}.`,
          `Będziesz pracować nad: ${title.pl}.`,
        ),
      },
      {
        phase: 'teach',
        title: teachTitle,
        body: teachBody,
        bodyMath: teachMath,
        itemIds: [`${prefix}-t01`, `${prefix}-t02`],
      },
      {
        phase: 'guided',
        title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
        body: guidedBody,
        itemIds: [`${prefix}-g01`, `${prefix}-g02`, `${prefix}-g03`, `${prefix}-g04`, `${prefix}-g05`],
      },
      {
        phase: 'independent',
        title: L('Independent practice', 'Práctica independiente', 'Ćwiczenia samodzielne'),
        body: L(
          'Mastery requires at least 80% correct on this set.',
          'El dominio requiere al menos 80% de aciertos en este conjunto.',
          'Opanowanie wymaga co najmniej 80% poprawnych odpowiedzi w tym zestawie.',
        ),
        itemIds: [
          `${prefix}-i01`,
          `${prefix}-i02`,
          `${prefix}-i03`,
          `${prefix}-i04`,
          `${prefix}-i05`,
          `${prefix}-i06`,
          `${prefix}-i07`,
          `${prefix}-i08`,
          `${prefix}-i09`,
          `${prefix}-i10`,
        ],
      },
    ],
    items,
  }
}

const lesson28 = pack(
  'alg1-l28',
  28,
  L(
    'Piecewise Functions',
    'Funciones por partes',
    'Funkcje przedziałami',
  ),
  piecewiseKps,
  'lesson_board_28',
  ['lesson_board_29'],
  L('Teach: pieces & domains', 'Enseñar: trozos y dominios', 'Nauczanie: części i dziedziny'),
  L(
    'A piecewise function lists different rules on different domain pieces. Choose the piece that contains your input, then evaluate. Graphs use open/closed endpoints to match ≤/≥ vs </> .',
    'Una función por partes lista reglas distintas en trozos de dominio. Elige el trozo que contiene tu entrada y evalúa. Las gráficas usan extremos abiertos/cerrados según ≤/≥ vs </> .',
    'Funkcja przedziałami podaje różne reguły na kawałkach dziedziny. Wybierz część zawierającą argument i oblicz. Wykresy używają otwartych/domkniętych końców zgodnie z ≤/≥ vs </> .',
  ),
  ['f(x)=\\begin{cases}...\\end{cases}', 'x\\in D_i', '\\circ/\\bullet'],
  L(
    'Select the correct piece, evaluate, and reason about endpoints on graphs.',
    'Selecciona el trozo correcto, evalúa y razona sobre extremos en gráficas.',
    'Wybieraj właściwą część, obliczaj i rozumuj o końcach na wykresach.',
  ),
  lesson28Items,
)

const lesson29 = pack(
  'alg1-l29',
  29,
  L(
    'Cumulative Mixed Review',
    'Repaso acumulativo mixto',
    'Powtórka łączna mieszana',
  ),
  reviewKps,
  'lesson_board_29',
  ['lesson_board_30'],
  L('Teach: retrieve the toolkit', 'Enseñar: recuperar la caja de herramientas', 'Nauczanie: odzyskaj zestaw narzędzi'),
  L(
    'This lesson mixes expressions, equations, linear functions/systems, and quadratics. Identify the skill family first, then apply the matching Algebra I tool.',
    'Esta lección mezcla expresiones, ecuaciones, funciones/sistemas lineales y cuadráticas. Identifica primero la familia de habilidad y aplica la herramienta correcta.',
    'Ta lekcja miesza wyrażenia, równania, funkcje/układy liniowe i kwadratowe. Najpierw rozpoznaj rodzinę umiejętności, potem zastosuj właściwe narzędzie.',
  ),
  ['\\text{expr/eq}', '\\text{linear}', '\\text{quadratic}'],
  L(
    'Warm up across expressions → equations → functions → quadratics.',
    'Calienta de expresiones → ecuaciones → funciones → cuadráticas.',
    'Rozgrzej się: wyrażenia → równania → funkcje → kwadratowe.',
  ),
  lesson29Items,
)

const lesson30 = pack(
  'alg1-l30',
  30,
  L(
    'Algebra I Course Capstone',
    'Capstone del curso de Álgebra I',
    'Capstone kursu algebry I',
  ),
  capstoneKps,
  'lesson_board_30',
  ['course_algebra1_complete'],
  L('Teach: mastery habits', 'Enseñar: hábitos de dominio', 'Nauczanie: nawyki opanowania'),
  L(
    'Classify, connect representations, solve, and check reasonableness. This is the Algebra I mastery check — still with teach and guided warm-up before a heavy independent set.',
    'Clasifica, conecta representaciones, resuelve y verifica razonabilidad. Esta es la verificación de dominio de Álgebra I — aún con teach y práctica guiada antes del conjunto independiente.',
    'Klasyfikuj, łącz reprezentacje, rozwiązuj i sprawdzaj sensowność. To sprawdzenie opanowania algebry I — nadal z teach i guided przed ciężkim zestawem samodzielnym.',
  ),
  ['\\text{classify}', '\\text{connect}', '\\checkmark'],
  L(
    'Mixed fluency with representation links and final mastery items.',
    'Fluidez mixta con vínculos de representación e ítems finales de dominio.',
    'Mieszana biegłość z powiązaniami reprezentacji i końcowymi pozycjami mistrzowskimi.',
  ),
  lesson30Items,
)

lesson28.sections[0].body = L(
  'You will read piecewise rules, evaluate at given inputs, and connect domains to graph endpoints.',
  'Leerás reglas por partes, evaluarás en entradas dadas y conectarás dominios con extremos gráficos.',
  'Będziesz odczytywać reguły przedziałowe, obliczać wartości i łączyć dziedziny z końcami wykresu.',
)
lesson29.sections[0].body = L(
  'You will retrieve Algebra I skills across expressions, equations, functions, and quadratics.',
  'Recuperarás habilidades de Álgebra I en expresiones, ecuaciones, funciones y cuadráticas.',
  'Będziesz odzyskiwać umiejętności algebry I w wyrażeniach, równaniach, funkcjach i kwadratowych.',
)
lesson30.sections[0].body = L(
  'You will demonstrate Algebra I course mastery on a mixed independent-heavy set (≥80%).',
  'Demostrarás el dominio del curso de Álgebra I en un conjunto mixto con énfasis independiente (≥80%).',
  'Wykazesz opanowanie kursu algebry I na mieszanym zestawie z naciskiem na samodzielność (≥80%).',
)

lesson28.sections[1].bodyMath = [
  'f(x)=\\begin{cases} x+1 & x<0 \\\\ 2x & x\\ge 0 \\end{cases}',
  'x\\in D_i',
  '\\circ\\ /\\ \\bullet',
]
lesson29.sections[1].bodyMath = ['8x-2', 'y=mx+b', 'x^2-5x+6=0']
lesson30.sections[1].bodyMath = ['\\rightarrow\\ \\text{skill}', '\\leftrightarrow', '\\checkmark']

/* Diversify any remaining EN=ES=PL feedback clones (math-only lines). */
function diversifyFeedback(lesson) {
  for (const it of lesson.items) {
    for (const key of ['feedbackCorrect', 'feedbackIncorrect']) {
      const f = it[key]
      if (!f) continue
      if (f.en === f.es && f.es === f.pl) {
        const leadEs = key === 'feedbackCorrect' ? 'Así: ' : 'Revisa: '
        const leadPl = key === 'feedbackCorrect' ? 'Dobrze: ' : 'Sprawdź: '
        f.es = leadEs + f.en
        f.pl = leadPl + f.en
      }
    }
  }
}
for (const Lpack of [lesson28, lesson29, lesson30]) diversifyFeedback(Lpack)

/* ─── Write outputs ─── */
lesson27.worldHook.unlockOnMastery = ['lesson_board_28']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-27.json', lesson27)
writeJson('lesson-28.json', lesson28)
writeJson('lesson-29.json', lesson29)
writeJson('lesson-30.json', lesson30)

function hist(lesson) {
  const h = [0, 0, 0, 0]
  for (const it of lesson.items) {
    if (it.correctIndex !== undefined) h[it.correctIndex]++
  }
  return h
}

function promptMathCoverage(lesson) {
  const withMath = lesson.items.filter((it) => it.promptMath).length
  return `${withMath}/${lesson.items.length}`
}

function englishOrInEsPl(lesson) {
  let n = 0
  for (const it of lesson.items) {
    if (!it.choices) continue
    for (const loc of ['es', 'pl']) {
      for (const c of it.choices[loc] ?? []) {
        if (/\\text\{\s*(or|and|yes|no|true|false)\s*\}/i.test(String(c))) n++
      }
    }
  }
  return n
}

function feedbackCloneRate(lesson) {
  let clones = 0
  let total = 0
  for (const it of lesson.items) {
    total++
    const fc = it.feedbackCorrect
    if (fc.en === fc.es && fc.es === fc.pl) clones++
  }
  return `${clones}/${total}`
}

const summary = {
  newKpIds: newKps.map((k) => k.id),
  lessons: [lesson28, lesson29, lesson30].map((l) => ({
    id: l.id,
    totalItems: l.items.length,
    teach: l.sections.find((s) => s.phase === 'teach')?.itemIds?.length ?? 0,
    guided: l.sections.find((s) => s.phase === 'guided')?.itemIds?.length ?? 0,
    independent: l.sections.find((s) => s.phase === 'independent')?.itemIds?.length ?? 0,
    siteId: l.worldHook.siteId,
    unlock: l.worldHook.unlockOnMastery,
    correctIndexHist: hist(l),
    promptMath: promptMathCoverage(l),
    feedbackClones: feedbackCloneRate(l),
    enWordsInEsPlChoices: englishOrInEsPl(l),
  })),
  unlockChain: 'L27→board_28→L28→29→L29→30→L30→course_algebra1_complete',
}

console.log(JSON.stringify(summary, null, 2))
