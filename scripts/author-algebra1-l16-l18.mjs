/**
 * Wave 6 authoring: Algebra I Lessons 16–18 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l16-l18.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-16..18; confirms L15 unlockOnMastery → lesson_board_16;
 * L18 unlocks lesson_board_19 teaser.
 *
 * KaTeX policy: promptMath on nearly every item; MC math choices in $...$.
 * Feedback: distinct EN/ES/PL prose (not equation-only clones).
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

function mathChoices(...opts) {
  const fixed = opts.map((s) => {
    const cleaned = String(s).replace(/\\\^/g, '^').replace(/^\$/, '').replace(/\$$/, '')
    return `$${cleaned}$`
  })
  return L(fixed, fixed, fixed)
}

function latexifyMath(s) {
  return String(s).replace(/\\\^/g, '^')
}

const existingKpDoc = JSON.parse(readFileSync(join(outDir, 'knowledge-points.json'), 'utf8'))
const existingStd = JSON.parse(readFileSync(join(outDir, 'standards-index.json'), 'utf8'))
const lesson15 = JSON.parse(readFileSync(join(outDir, 'lesson-15.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.quadratic.zero.product',
    title: L(
      'Zero product property for equations',
      'Propiedad del producto cero en ecuaciones',
      'Własność iloczynu zerowego w równaniach',
    ),
    prerequisites: ['kp.alg1.factor.trinomial.a1', 'kp.alg1.factor.verify'],
    successCriteria: L(
      'Student uses: if A·B = 0, then A = 0 or B = 0 (or both), to set each factor equal to zero.',
      'El estudiante usa: si A·B = 0, entonces A = 0 o B = 0 (o ambos), igualando cada factor a cero.',
      'Uczeń stosuje: jeśli A·B = 0, to A = 0 lub B = 0 (albo oba), przyrównując każdy czynnik do zera.',
    ),
    misconceptions: L(
      [
        'Setting the product equal to a nonzero number and still treating factors independently',
        'Solving only one factor and ignoring the other root',
      ],
      [
        'Igualar el producto a un número distinto de cero y tratar los factores por separado',
        'Resolver solo un factor e ignorar la otra raíz',
      ],
      [
        'Przyrównywanie iloczynu do liczby niezerowej i traktowanie czynników osobno',
        'Rozwiązywanie tylko jednego czynnika i pomijanie drugiego pierwiastka',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.B.4b', 'A-SSE.B.3a'),
      CA('A-REI.4b'),
      FL('MA.912.AR.3.1'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.solve.factoring',
    title: L(
      'Solve quadratic equations by factoring',
      'Resolver ecuaciones cuadráticas por factorización',
      'Rozwiązywać równania kwadratowe przez rozkład',
    ),
    prerequisites: [
      'kp.alg1.quadratic.zero.product',
      'kp.alg1.factor.trinomial.a1',
      'kp.alg1.factor.difference.squares',
    ],
    encompassing: ['kp.alg1.quadratic.zero.product'],
    successCriteria: L(
      'Student rewrites a quadratic as a product of linear factors (when possible) and solves using the zero product property.',
      'El estudiante reescribe una cuadrática como producto de factores lineales (cuando es posible) y resuelve con el producto cero.',
      'Uczeń przepisuje równanie kwadratowe na iloczyn czynników liniowych (gdy to możliwe) i rozwiązuje własnością iloczynu zerowego.',
    ),
    misconceptions: L(
      [
        'Forgetting to set the equation equal to zero before factoring',
        'Reporting factors as solutions instead of the zeros of each factor',
      ],
      [
        'Olvidar igualar a cero antes de factorizar',
        'Reportar los factores como soluciones en lugar de los ceros de cada factor',
      ],
      [
        'Zapominanie o sprowadzeniu do zera przed rozkładem',
        'Podawanie czynników jako rozwiązań zamiast zer każdego czynnika',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.10(E)', 'A.1(F)'),
      CC('A-REI.B.4b', 'A-SSE.B.3a'),
      CA('A-REI.4b'),
      FL('MA.912.AR.3.1'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.check.roots',
    title: L(
      'Identify and check roots of factored quadratics',
      'Identificar y comprobar raíces de cuadráticas factorizadas',
      'Identyfikować i sprawdzać pierwiastki rozłożonych kwadratowych',
    ),
    prerequisites: ['kp.alg1.quadratic.solve.factoring'],
    successCriteria: L(
      'Student reads roots from a factored equation and verifies by substitution or by expanding.',
      'El estudiante lee las raíces de una ecuación factorizada y verifica por sustitución o expandiendo.',
      'Uczeń odczytuje pierwiastki z postaci rozłożonej i sprawdza przez podstawienie lub rozwinięcie.',
    ),
    misconceptions: L(
      [
        'Confusing the constants in (x − p)(x − q) with the signs of the roots',
        'Accepting extraneous roots that do not satisfy the original equation',
      ],
      [
        'Confundir las constantes en (x − p)(x − q) con los signos de las raíces',
        'Aceptar raíces extrañas que no satisfacen la ecuación original',
      ],
      [
        'Mylenie stałych w (x − p)(x − q) ze znakami pierwiastków',
        'Akceptowanie pierwiastków obcych, które nie spełniają równania',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.1(D)', 'A.1(F)'),
      CC('A-REI.B.4b', 'A-SSE.B.3a'),
      CA('A-REI.4b'),
      FL('MA.912.AR.3.1'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.formula',
    title: L(
      'Quadratic formula (structure)',
      'Fórmula cuadrática (estructura)',
      'Wzór kwadratowy (struktura)',
    ),
    prerequisites: ['kp.alg1.quadratic.solve.factoring'],
    successCriteria: L(
      'Student recalls x = (−b ± √(b² − 4ac)) / (2a) for ax² + bx + c = 0 with a ≠ 0.',
      'El estudiante recuerda x = (−b ± √(b² − 4ac)) / (2a) para ax² + bx + c = 0 con a ≠ 0.',
      'Uczeń pamięta x = (−b ± √(b² − 4ac)) / (2a) dla ax² + bx + c = 0 przy a ≠ 0.',
    ),
    misconceptions: L(
      [
        'Using −b without the ±, or dividing only one term by 2a',
        'Swapping a, b, c when identifying coefficients',
      ],
      [
        'Usar −b sin el ±, o dividir solo un término entre 2a',
        'Intercambiar a, b, c al identificar coeficientes',
      ],
      [
        'Używanie −b bez ± albo dzielenie tylko jednego składnika przez 2a',
        'Zamienianie a, b, c przy identyfikacji współczynników',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.1(F)', 'A.1(B)'),
      CC('A-REI.B.4b', 'A-REI.B.4a'),
      CA('A-REI.4b'),
      FL('MA.912.AR.3.2'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.discriminant',
    title: L(
      'Discriminant and number of real roots',
      'Discriminante y número de raíces reales',
      'Wyróżnik i liczba pierwiastków rzeczywistych',
    ),
    prerequisites: ['kp.alg1.quadratic.formula'],
    successCriteria: L(
      'Student computes Δ = b² − 4ac and interprets: Δ > 0 two real, Δ = 0 one real (double), Δ < 0 no real roots.',
      'El estudiante calcula Δ = b² − 4ac e interpreta: Δ > 0 dos reales, Δ = 0 una real (doble), Δ < 0 ninguna real.',
      'Uczeń oblicza Δ = b² − 4ac i interpretuje: Δ > 0 dwa rzeczywiste, Δ = 0 jeden (podwójny), Δ < 0 brak rzeczywistych.',
    ),
    misconceptions: L(
      [
        'Thinking a negative discriminant always means complex work is required in Algebra I context without stating “no real roots”',
        'Confusing the sign of Δ with the sign of the leading coefficient a',
      ],
      [
        'Creer que un discriminante negativo siempre exige complejos en Álgebra I sin decir “sin raíces reales”',
        'Confundir el signo de Δ con el signo del coeficiente principal a',
      ],
      [
        'Myślenie, że ujemny wyróżnik zawsze wymaga liczb zespolonych w Algebrze I zamiast „brak pierwiastków rzeczywistych”',
        'Mylenie znaku Δ ze znakiem współczynnika wiodącego a',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.1(F)', 'A.1(D)'),
      CC('A-REI.B.4b', 'A-REI.B.4a'),
      CA('A-REI.4b'),
      FL('MA.912.AR.3.2'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.formula.apply',
    title: L(
      'Apply the quadratic formula',
      'Aplicar la fórmula cuadrática',
      'Stosować wzór kwadratowy',
    ),
    prerequisites: ['kp.alg1.quadratic.formula', 'kp.alg1.quadratic.discriminant'],
    encompassing: ['kp.alg1.quadratic.formula'],
    successCriteria: L(
      'Student substitutes a, b, c carefully, simplifies the radical when possible, and reports exact or simplified roots.',
      'El estudiante sustituye a, b, c con cuidado, simplifica el radical cuando es posible y reporta raíces exactas o simplificadas.',
      'Uczeń podstawia a, b, c ostrożnie, upraszcza pierwiastek gdy można i podaje dokładne lub uproszczone pierwiastki.',
    ),
    misconceptions: L(
      [
        'Arithmetic errors under the radical or forgetting ± produces two candidates',
        'Leaving the answer as ±√Δ without dividing by 2a',
      ],
      [
        'Errores aritméticos bajo el radical u olvidar que ± da dos candidatos',
        'Dejar la respuesta como ±√Δ sin dividir entre 2a',
      ],
      [
        'Błędy arytmetyczne pod pierwiastkiem lub zapominanie, że ± daje dwa kandydaty',
        'Zostawianie odpowiedzi jako ±√Δ bez dzielenia przez 2a',
      ],
    ),
    standards: [
      TX('A.8(A)', 'A.1(F)', 'A.1(B)'),
      CC('A-REI.B.4b', 'A-REI.B.4a'),
      CA('A-REI.4b'),
      FL('MA.912.AR.3.2'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.parabola.direction',
    title: L(
      'Parabola opens up or down',
      'La parábola abre hacia arriba o abajo',
      'Parabola otwiera się w górę lub w dół',
    ),
    prerequisites: ['kp.alg1.graph.slope.intercept', 'kp.alg1.quadratic.solve.factoring'],
    successCriteria: L(
      'Student uses the sign of a in y = ax² + bx + c: a > 0 opens up, a < 0 opens down.',
      'El estudiante usa el signo de a en y = ax² + bx + c: a > 0 abre hacia arriba, a < 0 hacia abajo.',
      'Uczeń używa znaku a w y = ax² + bx + c: a > 0 otwiera w górę, a < 0 w dół.',
    ),
    misconceptions: L(
      [
        'Using the sign of c (y-intercept) to decide opening direction',
        'Thinking steeper |a| changes the opening direction instead of width',
      ],
      [
        'Usar el signo de c (intercepto y) para decidir la apertura',
        'Creer que un |a| mayor cambia la dirección en lugar del ancho',
      ],
      [
        'Używanie znaku c (przecięcie z osią y) do kierunku otwarcia',
        'Myślenie, że większe |a| zmienia kierunek zamiast szerokości',
      ],
    ),
    standards: [
      TX('A.7(A)', 'A.1(F)', 'A.1(D)'),
      CC('F-IF.C.7a', 'A-SSE.A.1a'),
      CA('F-IF.7a'),
      FL('MA.912.F.1.1'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.vertex.axis',
    title: L(
      'Vertex and axis of symmetry',
      'Vértice y eje de simetría',
      'Wierzchołek i oś symetrii',
    ),
    prerequisites: ['kp.alg1.quadratic.parabola.direction'],
    successCriteria: L(
      'Student finds the axis x = −b/(2a) and the vertex (h, k) by evaluating y at that x (intro level).',
      'El estudiante halla el eje x = −b/(2a) y el vértice (h, k) evaluando y en esa x (nivel introductorio).',
      'Uczeń znajduje oś x = −b/(2a) i wierzchołek (h, k) przez obliczenie y w tym x (poziom wstępny).',
    ),
    misconceptions: L(
      [
        'Using −b/a or b/(2a) instead of −b/(2a) for the axis',
        'Reporting the axis as a y-value or confusing vertex with y-intercept',
      ],
      [
        'Usar −b/a o b/(2a) en lugar de −b/(2a) para el eje',
        'Reportar el eje como un valor y o confundir vértice con intercepto y',
      ],
      [
        'Używanie −b/a lub b/(2a) zamiast −b/(2a) dla osi',
        'Podawanie osi jako wartości y lub mylenie wierzchołka z przecięciem y',
      ],
    ),
    standards: [
      TX('A.7(A)', 'A.1(F)', 'A.1(B)'),
      CC('F-IF.C.7a', 'A-SSE.B.3b'),
      CA('F-IF.7a'),
      FL('MA.912.F.1.1'),
    ],
  },
  {
    id: 'kp.alg1.quadratic.graph.features',
    title: L(
      'Key features of a parabola graph',
      'Características clave de la gráfica de una parábola',
      'Kluczowe cechy wykresu paraboli',
    ),
    prerequisites: [
      'kp.alg1.quadratic.vertex.axis',
      'kp.alg1.quadratic.check.roots',
    ],
    encompassing: ['kp.alg1.quadratic.parabola.direction'],
    successCriteria: L(
      'Student connects roots (x-intercepts), y-intercept, vertex, and axis to sketch or describe a parabola.',
      'El estudiante conecta raíces (interceptos x), intercepto y, vértice y eje para bosquejar o describir una parábola.',
      'Uczeń łączy pierwiastki (przecięcia x), przecięcie y, wierzchołek i oś, by naszkicować lub opisać parabolę.',
    ),
    misconceptions: L(
      [
        'Assuming the vertex is always on the y-axis',
        'Mixing up x-intercepts with the y-intercept c',
      ],
      [
        'Asumir que el vértice siempre está en el eje y',
        'Confundir interceptos x con el intercepto y = c',
      ],
      [
        'Zakładanie, że wierzchołek zawsze leży na osi y',
        'Mylenie przecięć x z przecięciem y = c',
      ],
    ),
    standards: [
      TX('A.7(A)', 'A.1(D)', 'A.1(F)'),
      CC('F-IF.C.7a', 'A-REI.D.10'),
      CA('F-IF.7a'),
      FL('MA.912.F.1.1'),
    ],
  },
]

const existingIds = new Set(existingKpDoc.knowledgePoints.map((k) => k.id))
for (const kp of newKps) {
  if (!existingIds.has(kp.id)) {
    existingKpDoc.knowledgePoints.push(kp)
    existingIds.add(kp.id)
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

const solveFactorKps = [
  'kp.alg1.quadratic.zero.product',
  'kp.alg1.quadratic.solve.factoring',
  'kp.alg1.quadratic.check.roots',
]
const formulaKps = [
  'kp.alg1.quadratic.formula',
  'kp.alg1.quadratic.discriminant',
  'kp.alg1.quadratic.formula.apply',
]
const graphKps = [
  'kp.alg1.quadratic.parabola.direction',
  'kp.alg1.quadratic.vertex.axis',
  'kp.alg1.quadratic.graph.features',
]

addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.quadratic.zero.product',
  'kp.alg1.quadratic.formula',
  'kp.alg1.quadratic.formula.apply',
  'kp.alg1.quadratic.vertex.axis',
])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.quadratic.check.roots',
  'kp.alg1.quadratic.discriminant',
  'kp.alg1.quadratic.parabola.direction',
  'kp.alg1.quadratic.graph.features',
])
addKpsToExisting('TX', 'A.1(F)', [...solveFactorKps, ...formulaKps, ...graphKps])
addKpsToExisting('CCSS', 'A-SSE.B.3a', solveFactorKps)
addKpsToExisting('CCSS', 'F-IF.C.7a', graphKps)
addKpsToExisting('CCSS', 'A-REI.D.10', ['kp.alg1.quadratic.graph.features'])

ensureCode(
  'TX',
  'A.8(A)',
  L(
    'Solve quadratic equations having real solutions by factoring, taking square roots, completing the square, and applying the quadratic formula',
    'Resolver ecuaciones cuadráticas con soluciones reales por factorización, raíces cuadradas, completar el cuadrado y la fórmula cuadrática',
    'Rozwiązywać równania kwadratowe o rozwiązaniach rzeczywistych przez rozkład, pierwiastki, dopełnianie kwadratu i wzór kwadratowy',
  ),
  [...solveFactorKps, ...formulaKps],
)
ensureCode(
  'TX',
  'A.7(A)',
  L(
    'Graph quadratic functions on the coordinate plane and use the graph to identify key attributes including x-intercept, y-intercept, zeros, maximum or minimum value, vertex, and the equation of the axis of symmetry',
    'Graficar funciones cuadráticas en el plano y usar la gráfica para identificar atributos clave: interceptos, ceros, máximo o mínimo, vértice y eje de simetría',
    'Rysować funkcje kwadratowe na płaszczyźnie i z wykresu odczytywać kluczowe cechy: przecięcia, zera, max/min, wierzchołek i oś symetrii',
  ),
  graphKps,
)
ensureCode(
  'TX',
  'A.10(E)',
  L(
    'Factor, if possible, trinomials with integer coefficients as products of linear factors',
    'Factorizar, si es posible, trinomios con coeficientes enteros como productos de factores lineales',
    'Rozkładać, jeśli możliwe, trójmiany o współczynnikach całkowitych na iloczyny czynników liniowych',
  ),
  ['kp.alg1.quadratic.solve.factoring'],
)
ensureCode(
  'CCSS',
  'A-REI.B.4b',
  L(
    'Solve quadratic equations by inspection, taking square roots, completing the square, the quadratic formula and factoring, as appropriate to the initial form of the equation',
    'Resolver ecuaciones cuadráticas por inspección, raíces cuadradas, completar el cuadrado, fórmula cuadrática y factorización, según la forma inicial',
    'Rozwiązywać równania kwadratowe przez wgląd, pierwiastki, dopełnianie kwadratu, wzór kwadratowy i rozkład — zależnie od postaci początkowej',
  ),
  [...solveFactorKps, ...formulaKps],
)
ensureCode(
  'CCSS',
  'A-REI.B.4a',
  L(
    'Use the method of completing the square to transform any quadratic equation in x into an equation of the form (x − p)² = q',
    'Usar completar el cuadrado para transformar cualquier ecuación cuadrática en x a la forma (x − p)² = q',
    'Używać dopełniania kwadratu, by przekształcić równanie kwadratowe w x do postaci (x − p)² = q',
  ),
  formulaKps,
)
ensureCode(
  'CCSS',
  'A-SSE.B.3b',
  L(
    'Complete the square in a quadratic expression to reveal the maximum or minimum value of the function it defines',
    'Completar el cuadrado en una expresión cuadrática para revelar el máximo o mínimo de la función que define',
    'Dopełniać kwadrat w wyrażeniu kwadratowym, by ujawnić maksimum lub minimum funkcji',
  ),
  ['kp.alg1.quadratic.vertex.axis'],
)
ensureCode(
  'CCSS',
  'A-SSE.A.1a',
  L(
    'Interpret parts of an expression, such as terms, factors, and coefficients',
    'Interpretar partes de una expresión, como términos, factores y coeficientes',
    'Interpretować części wyrażenia: wyrazy, czynniki i współczynniki',
  ),
  ['kp.alg1.quadratic.parabola.direction'],
)

existingStd.lessonCoverage['alg1-l16'] = [
  'A.8(A)',
  'A.10(E)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-REI.B.4b',
  'A-SSE.B.3a',
]
existingStd.lessonCoverage['alg1-l17'] = [
  'A.8(A)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-REI.B.4a',
  'A-REI.B.4b',
]
existingStd.lessonCoverage['alg1-l18'] = [
  'A.7(A)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'F-IF.C.7a',
  'A-REI.D.10',
  'A-SSE.B.3b',
]

const l16Zpp = [TX('A.8(A)', 'A.1(B)', 'A.1(F)'), CC('A-REI.B.4b', 'A-SSE.B.3a')]
const l16Sol = [TX('A.8(A)', 'A.10(E)', 'A.1(F)'), CC('A-REI.B.4b', 'A-SSE.B.3a')]
const l16Chk = [TX('A.8(A)', 'A.1(D)', 'A.1(F)'), CC('A-REI.B.4b', 'A-SSE.B.3a')]

const l17Form = [TX('A.8(A)', 'A.1(F)', 'A.1(B)'), CC('A-REI.B.4b', 'A-REI.B.4a')]
const l17Disc = [TX('A.8(A)', 'A.1(F)', 'A.1(D)'), CC('A-REI.B.4b', 'A-REI.B.4a')]
const l17App = [TX('A.8(A)', 'A.1(F)', 'A.1(B)'), CC('A-REI.B.4b', 'A-REI.B.4a')]

const l18Dir = [TX('A.7(A)', 'A.1(F)', 'A.1(D)'), CC('F-IF.C.7a', 'A-SSE.A.1a')]
const l18Vtx = [TX('A.7(A)', 'A.1(F)', 'A.1(B)'), CC('F-IF.C.7a', 'A-SSE.B.3b')]
const l18Feat = [TX('A.7(A)', 'A.1(D)', 'A.1(F)'), CC('F-IF.C.7a', 'A-REI.D.10')]

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
   LESSON 16 — Solve by factoring
   ═══════════════════════════════════════ */
const l16Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.quadratic.zero.product',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'If (x − 3)(x + 2) = 0, what are the solutions?',
      'Si (x − 3)(x + 2) = 0, ¿cuáles son las soluciones?',
      'Jeśli (x − 3)(x + 2) = 0, jakie są rozwiązania?',
    ),
    math: '(x - 3)(x + 2) = 0',
    choices0: mathChoices('x=3\\text{ or }x=-2', 'x=-3\\text{ or }x=2', 'x=3\\text{ or }x=2', 'x=-3\\text{ or }x=-2'),
    fc: L(
      'Zero product: each factor can be zero, so x = 3 or x = −2.',
      'Producto cero: cada factor puede ser cero, así x = 3 o x = −2.',
      'Iloczyn zerowy: każdy czynnik może być zerem, więc x = 3 lub x = −2.',
    ),
    fi: L(
      'From (x − 3) = 0 get x = 3; from (x + 2) = 0 get x = −2.',
      'De (x − 3) = 0 obtienes x = 3; de (x + 2) = 0 obtienes x = −2.',
      'Z (x − 3) = 0 masz x = 3; z (x + 2) = 0 masz x = −2.',
    ),
    tags: ['sign_flip_root', 'swapped_roots'],
    stds: l16Zpp,
  },
  {
    id: 't02',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Solve by factoring: x^{2} − 5x + 6 = 0.',
      'Resuelve por factorización: x^{2} − 5x + 6 = 0.',
      'Rozwiąż przez rozkład: x^{2} − 5x + 6 = 0.',
    ),
    math: 'x^{2} - 5x + 6 = 0',
    choices0: mathChoices('x=2\\text{ or }x=3', 'x=-2\\text{ or }x=-3', 'x=1\\text{ or }x=6', 'x=2\\text{ or }x=-3'),
    fc: L(
      'Factors as (x − 2)(x − 3) = 0, so the roots are 2 and 3.',
      'Se factoriza como (x − 2)(x − 3) = 0, así las raíces son 2 y 3.',
      'Rozkład to (x − 2)(x − 3) = 0, więc pierwiastki to 2 i 3.',
    ),
    fi: L(
      'Find integers that multiply to 6 and add to −5: −2 and −3, giving (x − 2)(x − 3).',
      'Busca enteros que multipliquen a 6 y sumen −5: −2 y −3, dando (x − 2)(x − 3).',
      'Znajdź całkowite, które mnożą się do 6 i sumują do −5: −2 i −3, czyli (x − 2)(x − 3).',
    ),
    tags: ['sign_error', 'wrong_factor_pair'],
    stds: l16Sol,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.quadratic.zero.product',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Solve: x(x − 7) = 0.',
      'Resuelve: x(x − 7) = 0.',
      'Rozwiąż: x(x − 7) = 0.',
    ),
    math: 'x(x - 7) = 0',
    choices0: mathChoices('x=0\\text{ or }x=7', 'x=0\\text{ or }x=-7', 'x=7\\text{ only}', 'x=1\\text{ or }x=7'),
    fc: L(
      'Either factor is zero: x = 0 or x − 7 = 0 → x = 7.',
      'Cualquier factor es cero: x = 0 o x − 7 = 0 → x = 7.',
      'Którykolwiek czynnik zerowy: x = 0 lub x − 7 = 0 → x = 7.',
    ),
    fi: L(
      'Do not drop the root x = 0 that comes from the lone factor x.',
      'No omitas la raíz x = 0 que viene del factor solo x.',
      'Nie pomijaj pierwiastka x = 0 z samego czynnika x.',
    ),
    tags: ['missed_zero_root', 'sign_flip_root'],
    stds: l16Zpp,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Solve: x^{2} + 2x − 15 = 0.',
      'Resuelve: x^{2} + 2x − 15 = 0.',
      'Rozwiąż: x^{2} + 2x − 15 = 0.',
    ),
    math: 'x^{2} + 2x - 15 = 0',
    choices0: mathChoices('x=-5\\text{ or }x=3', 'x=5\\text{ or }x=-3', 'x=-5\\text{ or }x=-3', 'x=5\\text{ or }x=3'),
    fc: L(
      '(x + 5)(x − 3) = 0 yields x = −5 or x = 3.',
      '(x + 5)(x − 3) = 0 da x = −5 o x = 3.',
      '(x + 5)(x − 3) = 0 daje x = −5 lub x = 3.',
    ),
    fi: L(
      'Need factors of −15 that sum to +2: +5 and −3.',
      'Necesitas factores de −15 que sumen +2: +5 y −3.',
      'Potrzebujesz czynników −15 sumujących się do +2: +5 i −3.',
    ),
    tags: ['sign_error', 'wrong_factor_pair'],
    stds: l16Sol,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Solve: x^{2} − 16 = 0.',
      'Resuelve: x^{2} − 16 = 0.',
      'Rozwiąż: x^{2} − 16 = 0.',
    ),
    math: 'x^{2} - 16 = 0',
    choices0: mathChoices('x=4\\text{ or }x=-4', 'x=4\\text{ only}', 'x=16\\text{ or }x=-16', 'x=8\\text{ or }x=-8'),
    fc: L(
      'Difference of squares: (x − 4)(x + 4) = 0 → x = ±4.',
      'Diferencia de cuadrados: (x − 4)(x + 4) = 0 → x = ±4.',
      'Różnica kwadratów: (x − 4)(x + 4) = 0 → x = ±4.',
    ),
    fi: L(
      'Factor as (x − 4)(x + 4), not as a single positive root.',
      'Factoriza como (x − 4)(x + 4), no como una sola raíz positiva.',
      'Rozłóż jako (x − 4)(x + 4), nie jako jeden dodatni pierwiastek.',
    ),
    tags: ['missed_negative_root', 'wrong_roots'],
    stds: l16Sol,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.quadratic.check.roots',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Which pair are the roots of (x + 1)(x − 6) = 0?',
      '¿Cuál par son las raíces de (x + 1)(x − 6) = 0?',
      'Która para to pierwiastki (x + 1)(x − 6) = 0?',
    ),
    math: '(x + 1)(x - 6) = 0',
    choices0: mathChoices('x=-1\\text{ and }x=6', 'x=1\\text{ and }x=-6', 'x=-1\\text{ and }x=-6', 'x=1\\text{ and }x=6'),
    fc: L(
      'Set each factor to zero: x + 1 = 0 → −1; x − 6 = 0 → 6.',
      'Iguala cada factor a cero: x + 1 = 0 → −1; x − 6 = 0 → 6.',
      'Przyrównaj każdy czynnik do zera: x + 1 = 0 → −1; x − 6 = 0 → 6.',
    ),
    fi: L(
      'The root from (x − r) is +r; from (x + r) is −r.',
      'La raíz de (x − r) es +r; de (x + r) es −r.',
      'Pierwiastek z (x − r) to +r; z (x + r) to −r.',
    ),
    tags: ['sign_flip_root', 'swapped_roots'],
    stds: l16Chk,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'First step for 2x^{2} − 8x = 0 before factoring further?',
      '¿Primer paso para 2x^{2} − 8x = 0 antes de seguir factorizando?',
      'Pierwszy krok dla 2x^{2} − 8x = 0 przed dalszym rozkładem?',
    ),
    math: '2x^{2} - 8x = 0',
    choices0: L(
      ['Factor out 2x', 'Divide only by 2', 'Add 8x to both sides', 'Use quadratic formula first'],
      ['Sacar factor 2x', 'Dividir solo entre 2', 'Sumar 8x a ambos lados', 'Usar primero la fórmula cuadrática'],
      ['Wyłączyć 2x', 'Podzielić tylko przez 2', 'Dodać 8x do obu stron', 'Najpierw użyć wzoru kwadratowego'],
    ),
    fc: L(
      'Pull the GCF 2x to get 2x(x − 4) = 0, then apply zero product.',
      'Saca el MCD 2x para obtener 2x(x − 4) = 0 y aplica producto cero.',
      'Wyłącz NWD 2x, otrzymasz 2x(x − 4) = 0, potem iloczyn zerowy.',
    ),
    fi: L(
      'Common factor 2x unlocks roots x = 0 and x = 4 cleanly.',
      'El factor común 2x revela limpiamente las raíces x = 0 y x = 4.',
      'Wspólny czynnik 2x jasno daje pierwiastki x = 0 i x = 4.',
    ),
    tags: ['skipped_gcf', 'wrong_strategy'],
    stds: l16Sol,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Solve: x^{2} − 9x + 20 = 0.',
      'Resuelve: x^{2} − 9x + 20 = 0.',
      'Rozwiąż: x^{2} − 9x + 20 = 0.',
    ),
    math: 'x^{2} - 9x + 20 = 0',
    choices0: mathChoices('x=4\\text{ or }x=5', 'x=-4\\text{ or }x=-5', 'x=2\\text{ or }x=10', 'x=4\\text{ or }x=-5'),
    fc: L(
      '(x − 4)(x − 5) = 0, so x = 4 or x = 5.',
      '(x − 4)(x − 5) = 0, así x = 4 o x = 5.',
      '(x − 4)(x − 5) = 0, więc x = 4 lub x = 5.',
    ),
    fi: L(
      '4 and 5 multiply to 20 and add to 9 (signs match both negative factors).',
      '4 y 5 multiplican a 20 y suman 9 (ambos factores negativos).',
      '4 i 5 dają iloczyn 20 i sumę 9 (oba czynniki ujemne w nawiasach).',
    ),
    tags: ['wrong_factor_pair', 'sign_error'],
    stds: l16Sol,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.quadratic.zero.product',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'If (2x − 1)(x + 4) = 0, which is a solution?',
      'Si (2x − 1)(x + 4) = 0, ¿cuál es una solución?',
      'Jeśli (2x − 1)(x + 4) = 0, które jest rozwiązaniem?',
    ),
    math: '(2x - 1)(x + 4) = 0',
    choices0: mathChoices('x=\\frac{1}{2}', 'x=-\\frac{1}{2}', 'x=4', 'x=2'),
    fc: L(
      '2x − 1 = 0 gives x = 1/2 (and the other root is x = −4).',
      '2x − 1 = 0 da x = 1/2 (la otra raíz es x = −4).',
      '2x − 1 = 0 daje x = 1/2 (drugi pierwiastek to x = −4).',
    ),
    fi: L(
      'Solve 2x − 1 = 0 carefully: add 1, then divide by 2.',
      'Resuelve 2x − 1 = 0 con cuidado: suma 1 y divide entre 2.',
      'Rozwiąż 2x − 1 = 0 ostrożnie: dodaj 1, potem podziel przez 2.',
    ),
    tags: ['coeff_half_error', 'sign_flip_root'],
    stds: l16Zpp,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Solve: x^{2} + 7x + 12 = 0.',
      'Resuelve: x^{2} + 7x + 12 = 0.',
      'Rozwiąż: x^{2} + 7x + 12 = 0.',
    ),
    math: 'x^{2} + 7x + 12 = 0',
    choices0: mathChoices('x=-3\\text{ or }x=-4', 'x=3\\text{ or }x=4', 'x=-2\\text{ or }x=-6', 'x=-3\\text{ or }x=4'),
    fc: L(
      '(x + 3)(x + 4) = 0 → x = −3 or x = −4.',
      '(x + 3)(x + 4) = 0 → x = −3 o x = −4.',
      '(x + 3)(x + 4) = 0 → x = −3 lub x = −4.',
    ),
    fi: L(
      'Both factors are positive when b and c are positive, so both roots are negative.',
      'Ambos factores son positivos cuando b y c son positivos, así ambas raíces son negativas.',
      'Oba czynniki są dodatnie, gdy b i c są dodatnie, więc oba pierwiastki są ujemne.',
    ),
    tags: ['sign_error', 'wrong_factor_pair'],
    stds: l16Sol,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.quadratic.check.roots',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Does x = −2 satisfy (x + 2)(x − 5) = 0?',
      '¿Satisface x = −2 la ecuación (x + 2)(x − 5) = 0?',
      'Czy x = −2 spełnia (x + 2)(x − 5) = 0?',
    ),
    math: '(x + 2)(x - 5) = 0',
    choices0: L(
      ['Yes', 'No', 'Only if x = 5 also', 'Only for x = 2'],
      ['Sí', 'No', 'Solo si también x = 5', 'Solo para x = 2'],
      ['Tak', 'Nie', 'Tylko gdy też x = 5', 'Tylko dla x = 2'],
    ),
    fc: L(
      'Yes — plugging in makes the first factor zero, so the product is zero.',
      'Sí — al sustituir, el primer factor se anula y el producto es cero.',
      'Tak — podstawienie zeruje pierwszy czynnik, więc iloczyn jest zerem.',
    ),
    fi: L(
      'Any root that zeros one factor automatically zeros the product.',
      'Cualquier raíz que anule un factor anula automáticamente el producto.',
      'Każdy pierwiastek zerujący jeden czynnik automatycznie zeruje iloczyn.',
    ),
    tags: ['verify_fail', 'confused_other_root'],
    stds: l16Chk,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Solve: 3x^{2} − 12x = 0.',
      'Resuelve: 3x^{2} − 12x = 0.',
      'Rozwiąż: 3x^{2} − 12x = 0.',
    ),
    math: '3x^{2} - 12x = 0',
    choices0: mathChoices('x=0\\text{ or }x=4', 'x=0\\text{ or }x=-4', 'x=4\\text{ only}', 'x=3\\text{ or }x=4'),
    fc: L(
      'Factor 3x(x − 4) = 0 → x = 0 or x = 4.',
      'Factoriza 3x(x − 4) = 0 → x = 0 o x = 4.',
      'Rozkład 3x(x − 4) = 0 → x = 0 lub x = 4.',
    ),
    fi: L(
      'After factoring out 3x, solve x − 4 = 0 for the nonzero root.',
      'Tras sacar 3x, resuelve x − 4 = 0 para la raíz distinta de cero.',
      'Po wyłączeniu 3x rozwiąż x − 4 = 0 dla niezerowego pierwiastka.',
    ),
    tags: ['missed_zero_root', 'sign_error'],
    stds: l16Sol,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Solve: x^{2} − x − 12 = 0.',
      'Resuelve: x^{2} − x − 12 = 0.',
      'Rozwiąż: x^{2} − x − 12 = 0.',
    ),
    math: 'x^{2} - x - 12 = 0',
    choices0: mathChoices('x=4\\text{ or }x=-3', 'x=-4\\text{ or }x=3', 'x=6\\text{ or }x=-2', 'x=4\\text{ or }x=3'),
    fc: L(
      '(x − 4)(x + 3) = 0 → x = 4 or x = −3.',
      '(x − 4)(x + 3) = 0 → x = 4 o x = −3.',
      '(x − 4)(x + 3) = 0 → x = 4 lub x = −3.',
    ),
    fi: L(
      'Integers −4 and +3 multiply to −12 and add to −1.',
      'Enteros −4 y +3 multiplican a −12 y suman −1.',
      'Całkowite −4 i +3 dają iloczyn −12 i sumę −1.',
    ),
    tags: ['sign_error', 'wrong_factor_pair'],
    stds: l16Sol,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.quadratic.check.roots',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'If the solutions are x = −1 and x = 8, which equation fits?',
      'Si las soluciones son x = −1 y x = 8, ¿qué ecuación encaja?',
      'Jeśli rozwiązania to x = −1 i x = 8, które równanie pasuje?',
    ),
    math: 'x=-1\\text{ and }x=8',
    choices0: mathChoices('(x+1)(x-8)=0', '(x-1)(x+8)=0', '(x+1)(x+8)=0', '(x-1)(x-8)=0'),
    fc: L(
      'Roots −1 and 8 match factors (x + 1) and (x − 8).',
      'Las raíces −1 y 8 corresponden a (x + 1) y (x − 8).',
      'Pierwiastki −1 i 8 odpowiadają czynnikom (x + 1) i (x − 8).',
    ),
    fi: L(
      'Build (x − root) for each root: (x − (−1))(x − 8) = (x + 1)(x − 8).',
      'Arma (x − raíz) por cada raíz: (x − (−1))(x − 8) = (x + 1)(x − 8).',
      'Zbuduj (x − pierwiastek) dla każdego: (x − (−1))(x − 8) = (x + 1)(x − 8).',
    ),
    tags: ['reversed_factors', 'sign_flip_root'],
    stds: l16Chk,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.65,
    b: 0.65,
    prompt: L(
      'Solve: x^{2} − 25 = 0.',
      'Resuelve: x^{2} − 25 = 0.',
      'Rozwiąż: x^{2} − 25 = 0.',
    ),
    math: 'x^{2} - 25 = 0',
    choices0: mathChoices('x=5\\text{ or }x=-5', 'x=5\\text{ only}', 'x=25\\text{ or }x=-25', 'x=\\sqrt{25}\\text{ only}'),
    fc: L(
      '(x − 5)(x + 5) = 0 gives both 5 and −5.',
      '(x − 5)(x + 8) wait — (x − 5)(x + 5) = 0 da 5 y −5.',
      '(x − 5)(x + 5) = 0 daje zarówno 5, jak i −5.',
    ),
    fi: L(
      'Square-rooting alone still needs ±; factoring shows both roots clearly.',
      'Sacar raíz sola aún necesita ±; factorizar muestra ambas raíces con claridad.',
      'Sam pierwiastek i tak wymaga ±; rozkład jasno pokazuje oba pierwiastki.',
    ),
    tags: ['missed_negative_root', 'wrong_roots'],
    stds: l16Sol,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.quadratic.zero.product',
    diff: 0.65,
    b: 0.7,
    prompt: L(
      'Why can we split (x − 2)(3x + 1) = 0 into two linear equations?',
      '¿Por qué podemos partir (x − 2)(3x + 1) = 0 en dos ecuaciones lineales?',
      'Dlaczego możemy rozdzielić (x − 2)(3x + 1) = 0 na dwa równania liniowe?',
    ),
    math: '(x - 2)(3x + 1) = 0',
    choices0: L(
      [
        'A product is zero only if a factor is zero',
        'Because every quadratic has two positive roots',
        'Because we can divide both sides by any factor freely',
        'Because a and c must have opposite signs',
      ],
      [
        'Un producto es cero solo si un factor es cero',
        'Porque toda cuadrática tiene dos raíces positivas',
        'Porque podemos dividir libremente entre cualquier factor',
        'Porque a y c deben tener signos opuestos',
      ],
      [
        'Iloczyn jest zerem tylko gdy czynnik jest zerem',
        'Bo każde kwadratowe ma dwa dodatnie pierwiastki',
        'Bo wolno dzielić obie strony przez dowolny czynnik',
        'Bo a i c muszą mieć przeciwne znaki',
      ],
    ),
    fc: L(
      'That is the zero product property — real numbers multiply to zero only via a zero factor.',
      'Esa es la propiedad del producto cero: reales dan producto cero solo con un factor cero.',
      'To własność iloczynu zerowego — liczby rzeczywiste dają zero tylko przez zerowy czynnik.',
    ),
    fi: L(
      'Dividing by a factor can lose a root; the property uses “or,” not division.',
      'Dividir por un factor puede perder una raíz; la propiedad usa “o”, no división.',
      'Dzielenie przez czynnik może zgubić pierwiastek; własność mówi „lub”, nie dzielenie.',
    ),
    tags: ['wrong_reason', 'divide_away_root'],
    stds: l16Zpp,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.quadratic.solve.factoring',
    diff: 0.7,
    b: 0.8,
    prompt: L(
      'Solve: x^{2} + 3x − 28 = 0.',
      'Resuelve: x^{2} + 3x − 28 = 0.',
      'Rozwiąż: x^{2} + 3x − 28 = 0.',
    ),
    math: 'x^{2} + 3x - 28 = 0',
    choices0: mathChoices('x=-7\\text{ or }x=4', 'x=7\\text{ or }x=-4', 'x=-7\\text{ or }x=-4', 'x=7\\text{ or }x=4'),
    fc: L(
      '(x + 7)(x − 4) = 0 → x = −7 or x = 4.',
      '(x + 7)(x − 4) = 0 → x = −7 o x = 4.',
      '(x + 7)(x − 4) = 0 → x = −7 lub x = 4.',
    ),
    fi: L(
      'Pair +7 and −4: product −28, sum +3.',
      'Par +7 y −4: producto −28, suma +3.',
      'Para +7 i −4: iloczyn −28, suma +3.',
    ),
    tags: ['wrong_factor_pair', 'sign_error'],
    stds: l16Sol,
  },
]

/* Fix accidental typo in i08 Spanish feedback */
l16Specs.find((s) => s.id === 'i08').fc = L(
  '(x − 5)(x + 5) = 0 gives both 5 and −5.',
  '(x − 5)(x + 5) = 0 da tanto 5 como −5.',
  '(x − 5)(x + 5) = 0 daje zarówno 5, jak i −5.',
)

/* ═══════════════════════════════════════
   LESSON 17 — Quadratic formula + discriminant
   ═══════════════════════════════════════ */
const l17Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.quadratic.formula',
    diff: 0.25,
    b: -0.95,
    prompt: L(
      'For ax^{2} + bx + c = 0, the quadratic formula begins with which numerator?',
      'Para ax^{2} + bx + c = 0, ¿con qué numerador empieza la fórmula cuadrática?',
      'Dla ax^{2} + bx + c = 0 od jakiego licznika zaczyna się wzór kwadratowy?',
    ),
    math: 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}',
    choices0: mathChoices('-b\\pm\\sqrt{b^{2}-4ac}', 'b\\pm\\sqrt{b^{2}-4ac}', '-b\\pm\\sqrt{b^{2}+4ac}', 'b\\pm 4ac'),
    fc: L(
      'The classic form starts with −b ± the square root of the discriminant.',
      'La forma clásica empieza con −b ± la raíz del discriminante.',
      'Klasyczna postać zaczyna się od −b ± pierwiastka z wyróżnika.',
    ),
    fi: L(
      'Remember the leading minus on b and the minus inside b² − 4ac.',
      'Recuerda el menos delante de b y el menos dentro de b² − 4ac.',
      'Pamiętaj minus przed b i minus wewnątrz b² − 4ac.',
    ),
    tags: ['sign_on_b', 'disc_sign_error'],
    stds: l17Form,
  },
  {
    id: 't02',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.3,
    b: -0.75,
    prompt: L(
      'The discriminant of ax^{2} + bx + c is…',
      'El discriminante de ax^{2} + bx + c es…',
      'Wyróżnik ax^{2} + bx + c to…',
    ),
    math: '\\Delta = b^{2} - 4ac',
    choices0: mathChoices('b^{2}-4ac', 'b^{2}+4ac', '2a', '-b/(2a)'),
    fc: L(
      'Δ = b² − 4ac sits under the radical in the quadratic formula.',
      'Δ = b² − 4ac está bajo el radical en la fórmula cuadrática.',
      'Δ = b² − 4ac stoi pod pierwiastkiem we wzorze kwadratowym.',
    ),
    fi: L(
      'Do not confuse Δ with the axis formula −b/(2a) or with 2a in the denominator.',
      'No confundas Δ con el eje −b/(2a) ni con 2a del denominador.',
      'Nie myl Δ z osią −b/(2a) ani z 2a w mianowniku.',
    ),
    tags: ['confused_with_axis', 'disc_sign_error'],
    stds: l17Disc,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.35,
    b: -0.45,
    prompt: L(
      'If Δ > 0 for a quadratic with real coefficients, how many distinct real roots?',
      'Si Δ > 0 para una cuadrática con coeficientes reales, ¿cuántas raíces reales distintas?',
      'Jeśli Δ > 0 dla kwadratowego o współczynnikach rzeczywistych, ile różnych pierwiastków rzeczywistych?',
    ),
    math: '\\Delta > 0',
    choices0: L(
      ['Two', 'One', 'Zero', 'Infinitely many'],
      ['Dos', 'Una', 'Cero', 'Infinitas'],
      ['Dwa', 'Jeden', 'Zero', 'Nieskończenie wiele'],
    ),
    fc: L(
      'A positive discriminant means two distinct real solutions.',
      'Un discriminante positivo significa dos soluciones reales distintas.',
      'Dodatni wyróżnik oznacza dwa różne rozwiązania rzeczywiste.',
    ),
    fi: L(
      'Δ = 0 is the double-root case; Δ < 0 means no real roots.',
      'Δ = 0 es la raíz doble; Δ < 0 significa ninguna raíz real.',
      'Δ = 0 to pierwiastek podwójny; Δ < 0 oznacza brak pierwiastków rzeczywistych.',
    ),
    tags: ['disc_count_error', 'confused_zero_case'],
    stds: l17Disc,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.quadratic.formula',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'For 2x^{2} − 3x + 1 = 0, what is a?',
      'Para 2x^{2} − 3x + 1 = 0, ¿cuál es a?',
      'Dla 2x^{2} − 3x + 1 = 0, ile wynosi a?',
    ),
    math: '2x^{2} - 3x + 1 = 0',
    choices0: mathChoices('2', '-3', '1', '-2'),
    fc: L(
      'a is the coefficient of x², here 2.',
      'a es el coeficiente de x², aquí 2.',
      'a to współczynnik przy x², tutaj 2.',
    ),
    fi: L(
      'Write standard form ax² + bx + c; a multiplies x².',
      'Escribe la forma ax² + bx + c; a multiplica a x².',
      'Zapisz postać ax² + bx + c; a mnoży x².',
    ),
    tags: ['coeff_swap', 'sign_on_b'],
    stds: l17Form,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.4,
    b: -0.15,
    prompt: L(
      'Compute Δ for x^{2} − 4x + 4 = 0.',
      'Calcula Δ para x^{2} − 4x + 4 = 0.',
      'Oblicz Δ dla x^{2} − 4x + 4 = 0.',
    ),
    math: 'x^{2} - 4x + 4 = 0',
    choices0: mathChoices('0', '16', '-16', '4'),
    fc: L(
      'b² − 4ac = 16 − 16 = 0, a repeated real root.',
      'b² − 4ac = 16 − 16 = 0, una raíz real repetida.',
      'b² − 4ac = 16 − 16 = 0, powtórzony pierwiastek rzeczywisty.',
    ),
    fi: L(
      'Here a = 1, b = −4, c = 4 → (−4)² − 4·1·4 = 0.',
      'Aquí a = 1, b = −4, c = 4 → (−4)² − 4·1·4 = 0.',
      'Tu a = 1, b = −4, c = 4 → (−4)² − 4·1·4 = 0.',
    ),
    tags: ['arith_under_radical', 'sign_on_b'],
    stds: l17Disc,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.quadratic.formula.apply',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Apply the formula to x^{2} − 5x + 6 = 0. The roots are…',
      'Aplica la fórmula a x^{2} − 5x + 6 = 0. Las raíces son…',
      'Zastosuj wzór do x^{2} − 5x + 6 = 0. Pierwiastki to…',
    ),
    math: 'x^{2} - 5x + 6 = 0',
    choices0: mathChoices('x=2\\text{ or }x=3', 'x=-2\\text{ or }x=-3', 'x=1\\text{ or }x=6', 'x=5\\pm\\sqrt{1}'),
    fc: L(
      'Δ = 25 − 24 = 1, so x = (5 ± 1)/2 → 3 and 2.',
      'Δ = 25 − 24 = 1, así x = (5 ± 1)/2 → 3 y 2.',
      'Δ = 25 − 24 = 1, więc x = (5 ± 1)/2 → 3 i 2.',
    ),
    fi: L(
      'Substitute a = 1, b = −5, c = 6 into (−b ± √Δ)/(2a).',
      'Sustituye a = 1, b = −5, c = 6 en (−b ± √Δ)/(2a).',
      'Podstaw a = 1, b = −5, c = 6 do (−b ± √Δ)/(2a).',
    ),
    tags: ['arith_under_radical', 'forgot_divide_2a'],
    stds: l17App,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.45,
    b: 0.1,
    prompt: L(
      'If Δ < 0, what is true in real Algebra I?',
      'Si Δ < 0, ¿qué es cierto en Álgebra I real?',
      'Jeśli Δ < 0, co jest prawdą w rzeczywistej Algebrze I?',
    ),
    math: '\\Delta < 0',
    choices0: L(
      ['No real roots', 'Exactly one real root', 'Two identical real roots', 'Infinitely many real roots'],
      ['Ninguna raíz real', 'Exactamente una raíz real', 'Dos raíces reales idénticas', 'Infinitas raíces reales'],
      ['Brak pierwiastków rzeczywistych', 'Dokładnie jeden pierwiastek rzeczywisty', 'Dwa identyczne pierwiastki rzeczywiste', 'Nieskończenie wiele pierwiastków rzeczywistych'],
    ),
    fc: L(
      'Negative Δ means the square root is not real — no real solutions.',
      'Δ negativo significa que la raíz no es real — sin soluciones reales.',
      'Ujemne Δ oznacza, że pierwiastek nie jest rzeczywisty — brak rozwiązań rzeczywistych.',
    ),
    fi: L(
      'One real root is the Δ = 0 case, not Δ < 0.',
      'Una raíz real es el caso Δ = 0, no Δ < 0.',
      'Jeden pierwiastek rzeczywisty to przypadek Δ = 0, nie Δ < 0.',
    ),
    tags: ['disc_count_error', 'confused_zero_case'],
    stds: l17Disc,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.quadratic.formula.apply',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Solve with the formula: x^{2} + 2x − 3 = 0.',
      'Resuelve con la fórmula: x^{2} + 2x − 3 = 0.',
      'Rozwiąż wzorem: x^{2} + 2x − 3 = 0.',
    ),
    math: 'x^{2} + 2x - 3 = 0',
    choices0: mathChoices('x=1\\text{ or }x=-3', 'x=-1\\text{ or }x=3', 'x=1\\text{ or }x=3', 'x=-1\\text{ or }x=-3'),
    fc: L(
      'Δ = 4 + 12 = 16; x = (−2 ± 4)/2 → 1 and −3.',
      'Δ = 4 + 12 = 16; x = (−2 ± 4)/2 → 1 y −3.',
      'Δ = 4 + 12 = 16; x = (−2 ± 4)/2 → 1 i −3.',
    ),
    fi: L(
      'Keep −b = −2, then apply both + and − before dividing by 2.',
      'Mantén −b = −2, luego aplica + y − antes de dividir entre 2.',
      'Zachowaj −b = −2, potem zastosuj + i − przed dzieleniem przez 2.',
    ),
    tags: ['sign_on_b', 'forgot_pm'],
    stds: l17App,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.5,
    b: 0.25,
    prompt: L(
      'Compute Δ for 3x^{2} + 5x + 1 = 0.',
      'Calcula Δ para 3x^{2} + 5x + 1 = 0.',
      'Oblicz Δ dla 3x^{2} + 5x + 1 = 0.',
    ),
    math: '3x^{2} + 5x + 1 = 0',
    choices0: mathChoices('13', '25', '-7', '37'),
    fc: L(
      '25 − 4·3·1 = 25 − 12 = 13.',
      '25 − 4·3·1 = 25 − 12 = 13.',
      '25 − 4·3·1 = 25 − 12 = 13.',
    ),
    fi: L(
      'Use b² − 4ac with a = 3, b = 5, c = 1.',
      'Usa b² − 4ac con a = 3, b = 5, c = 1.',
      'Użyj b² − 4ac przy a = 3, b = 5, c = 1.',
    ),
    tags: ['arith_under_radical', 'coeff_swap'],
    stds: l17Disc,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.quadratic.formula',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'In the formula, what must be true about a?',
      'En la fórmula, ¿qué debe ser cierto sobre a?',
      'We wzorze, co musi być prawdziwe o a?',
    ),
    math: 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}',
    choices0: L(
      ['a ≠ 0', 'a > 0 only', 'a = 1 always', 'a = c'],
      ['a ≠ 0', 'Solo a > 0', 'a = 1 siempre', 'a = c'],
      ['a ≠ 0', 'Tylko a > 0', 'a = 1 zawsze', 'a = c'],
    ),
    fc: L(
      'If a = 0 the equation is not quadratic and division by 2a fails.',
      'Si a = 0 la ecuación no es cuadrática y dividir entre 2a falla.',
      'Gdy a = 0 równanie nie jest kwadratowe i dzielenie przez 2a zawodzi.',
    ),
    fi: L(
      'a can be negative (opens down); it just cannot be zero.',
      'a puede ser negativo (abre hacia abajo); solo no puede ser cero.',
      'a może być ujemne (otwiera w dół); po prostu nie może być zerem.',
    ),
    tags: ['a_zero_invalid', 'direction_confusion'],
    stds: l17Form,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.quadratic.formula.apply',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'For x^{2} − 2x − 1 = 0, the exact roots are…',
      'Para x^{2} − 2x − 1 = 0, las raíces exactas son…',
      'Dla x^{2} − 2x − 1 = 0 dokładne pierwiastki to…',
    ),
    math: 'x^{2} - 2x - 1 = 0',
    choices0: mathChoices('1\\pm\\sqrt{2}', '1\\pm\\sqrt{3}', '-1\\pm\\sqrt{2}', '2\\pm\\sqrt{2}'),
    fc: L(
      'Δ = 4 + 4 = 8 = 4·2; x = (2 ± 2√2)/2 = 1 ± √2.',
      'Δ = 4 + 4 = 8 = 4·2; x = (2 ± 2√2)/2 = 1 ± √2.',
      'Δ = 4 + 4 = 8 = 4·2; x = (2 ± 2√2)/2 = 1 ± √2.',
    ),
    fi: L(
      'Simplify √8 = 2√2, then cancel the common factor 2 with the denominator.',
      'Simplifica √8 = 2√2 y cancela el 2 común con el denominador.',
      'Uprość √8 = 2√2, potem skróć wspólne 2 z mianownikiem.',
    ),
    tags: ['radical_simplify', 'forgot_divide_2a'],
    stds: l17App,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.55,
    b: 0.45,
    prompt: L(
      'For x^{2} + x + 1 = 0, Δ equals…',
      'Para x^{2} + x + 1 = 0, Δ vale…',
      'Dla x^{2} + x + 1 = 0 Δ wynosi…',
    ),
    math: 'x^{2} + x + 1 = 0',
    choices0: mathChoices('-3', '3', '1', '-1'),
    fc: L(
      '1 − 4 = −3, so there are no real roots.',
      '1 − 4 = −3, así no hay raíces reales.',
      '1 − 4 = −3, więc brak pierwiastków rzeczywistych.',
    ),
    fi: L(
      'b² − 4ac = 1 − 4·1·1 = −3.',
      'b² − 4ac = 1 − 4·1·1 = −3.',
      'b² − 4ac = 1 − 4·1·1 = −3.',
    ),
    tags: ['arith_under_radical', 'disc_count_error'],
    stds: l17Disc,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.quadratic.formula.apply',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Solve: 2x^{2} − 3x − 2 = 0 using the formula.',
      'Resuelve: 2x^{2} − 3x − 2 = 0 con la fórmula.',
      'Rozwiąż: 2x^{2} − 3x − 2 = 0 wzorem.',
    ),
    math: '2x^{2} - 3x - 2 = 0',
    choices0: mathChoices('x=2\\text{ or }x=-\\frac{1}{2}', 'x=-2\\text{ or }x=\\frac{1}{2}', 'x=3\\text{ or }x=-\\frac{1}{2}', 'x=2\\text{ or }x=\\frac{1}{2}'),
    fc: L(
      'Δ = 9 + 16 = 25; x = (3 ± 5)/4 → 2 and −1/2.',
      'Δ = 9 + 16 = 25; x = (3 ± 5)/4 → 2 y −1/2.',
      'Δ = 9 + 16 = 25; x = (3 ± 5)/4 → 2 i −1/2.',
    ),
    fi: L(
      'Denominator is 2a = 4; do not stop after computing ±√Δ alone.',
      'El denominador es 2a = 4; no te detengas solo en ±√Δ.',
      'Mianownik to 2a = 4; nie zatrzymuj się na samym ±√Δ.',
    ),
    tags: ['forgot_divide_2a', 'sign_on_b'],
    stds: l17App,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.6,
    b: 0.6,
    prompt: L(
      'Which statement matches Δ = 0?',
      '¿Qué enunciado corresponde a Δ = 0?',
      'Które stwierdzenie pasuje do Δ = 0?',
    ),
    math: '\\Delta = 0',
    choices0: L(
      ['Exactly one distinct real root (double root)', 'Two distinct real roots', 'No real roots', 'The parabola has no vertex'],
      ['Exactamente una raíz real distinta (raíz doble)', 'Dos raíces reales distintas', 'Ninguna raíz real', 'La parábola no tiene vértice'],
      ['Dokładnie jeden różny pierwiastek rzeczywisty (podwójny)', 'Dwa różne pierwiastki rzeczywiste', 'Brak pierwiastków rzeczywistych', 'Parabola nie ma wierzchołka'],
    ),
    fc: L(
      'The radical vanishes, so −b/(2a) is the single repeated root.',
      'El radical desaparece, así −b/(2a) es la única raíz repetida.',
      'Pierwiastek znika, więc −b/(2a) to jedyny powtórzony pierwiastek.',
    ),
    fi: L(
      'Δ = 0 is the borderline between two real roots and none.',
      'Δ = 0 es el límite entre dos raíces reales y ninguna.',
      'Δ = 0 to granica między dwoma pierwiastkami rzeczywistymi a brakiem.',
    ),
    tags: ['confused_zero_case', 'disc_count_error'],
    stds: l17Disc,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.quadratic.formula',
    diff: 0.65,
    b: 0.7,
    prompt: L(
      'For −x^{2} + 4x − 1 = 0, which triple (a, b, c) is correct?',
      'Para −x^{2} + 4x − 1 = 0, ¿qué terna (a, b, c) es correcta?',
      'Dla −x^{2} + 4x − 1 = 0, która trójka (a, b, c) jest poprawna?',
    ),
    math: '-x^{2} + 4x - 1 = 0',
    choices0: mathChoices('(-1,4,-1)', '(1,4,-1)', '(-1,-4,-1)', '(1,-4,1)'),
    fc: L(
      'Read coefficients as written: a = −1, b = 4, c = −1.',
      'Lee los coeficientes tal cual: a = −1, b = 4, c = −1.',
      'Odczytaj współczynniki jak zapisano: a = −1, b = 4, c = −1.',
    ),
    fi: L(
      'Do not multiply the whole equation by −1 unless you flip every coefficient.',
      'No multipliques toda la ecuación por −1 salvo que cambies cada coeficiente.',
      'Nie mnoż całego równania przez −1, chyba że odwrócisz każdy współczynnik.',
    ),
    tags: ['coeff_swap', 'sign_on_a'],
    stds: l17Form,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.quadratic.formula.apply',
    diff: 0.65,
    b: 0.75,
    prompt: L(
      'After finding √Δ = 5 for a = 1, b = −1, c = −6, the roots are…',
      'Tras hallar √Δ = 5 con a = 1, b = −1, c = −6, las raíces son…',
      'Po znalezieniu √Δ = 5 przy a = 1, b = −1, c = −6 pierwiastki to…',
    ),
    math: 'a=1,\\; b=-1,\\; \\sqrt{\\Delta}=5',
    choices0: mathChoices('x=3\\text{ or }x=-2', 'x=-3\\text{ or }x=2', 'x=1\\pm 5', 'x=\\pm 5'),
    fc: L(
      'x = (1 ± 5)/2 → 3 and −2.',
      'x = (1 ± 5)/2 → 3 y −2.',
      'x = (1 ± 5)/2 → 3 i −2.',
    ),
    fi: L(
      '−b = −(−1) = +1; divide each ± case by 2a = 2.',
      '−b = −(−1) = +1; divide cada caso ± entre 2a = 2.',
      '−b = −(−1) = +1; podziel każdy przypadek ± przez 2a = 2.',
    ),
    tags: ['forgot_divide_2a', 'sign_on_b'],
    stds: l17App,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.quadratic.discriminant',
    diff: 0.7,
    b: 0.85,
    prompt: L(
      'Which equation has two distinct real roots?',
      '¿Qué ecuación tiene dos raíces reales distintas?',
      'Które równanie ma dwa różne pierwiastki rzeczywiste?',
    ),
    math: '\\Delta = b^{2}-4ac',
    choices0: mathChoices('x^{2}-5x+4=0', 'x^{2}+2x+5=0', 'x^{2}-6x+9=0', 'x^{2}+x+1=0'),
    fc: L(
      'For x² − 5x + 4, Δ = 25 − 16 = 9 > 0.',
      'Para x² − 5x + 4, Δ = 25 − 16 = 9 > 0.',
      'Dla x² − 5x + 4 Δ = 25 − 16 = 9 > 0.',
    ),
    fi: L(
      'Check Δ: x² + 2x + 5 and x² + x + 1 are negative; x² − 6x + 9 is zero.',
      'Revisa Δ: x² + 2x + 5 y x² + x + 1 son negativos; x² − 6x + 9 es cero.',
      'Sprawdź Δ: x² + 2x + 5 i x² + x + 1 są ujemne; x² − 6x + 9 to zero.',
    ),
    tags: ['disc_count_error', 'arith_under_radical'],
    stds: l17Disc,
  },
]

/* Fix i04 Spanish/Polish — keep math in EN path but diversify surrounding words already OK;
   diversify i02/i05 fc which still clone math — wrap with prose: */
l17Specs.find((s) => s.id === 'i02').fc = L(
  'Plug in: 25 − 12 = 13, so Δ = 13.',
  'Sustituye: 25 − 12 = 13, así Δ = 13.',
  'Podstaw: 25 − 12 = 13, więc Δ = 13.',
)
l17Specs.find((s) => s.id === 'i04').fc = L(
  'Δ = 8 simplifies under the radical, yielding exact roots 1 ± √2.',
  'Δ = 8 se simplifica bajo el radical y da las raíces exactas 1 ± √2.',
  'Δ = 8 upraszcza się pod pierwiastkiem i daje dokładne pierwiastki 1 ± √2.',
)
l17Specs.find((s) => s.id === 'i05').fc = L(
  'Computing 1 − 4 gives −3, so Δ is negative.',
  'Calcular 1 − 4 da −3, así Δ es negativo.',
  'Obliczenie 1 − 4 daje −3, więc Δ jest ujemne.',
)

/* ═══════════════════════════════════════
   LESSON 18 — Graphing parabolas intro
   ═══════════════════════════════════════ */
const l18Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.quadratic.parabola.direction',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'For y = 2x^{2} − x + 1, the parabola…',
      'Para y = 2x^{2} − x + 1, la parábola…',
      'Dla y = 2x^{2} − x + 1 parabola…',
    ),
    math: 'y = 2x^{2} - x + 1',
    choices0: L(
      ['Opens upward', 'Opens downward', 'Is a straight line', 'Has no vertex'],
      ['Abre hacia arriba', 'Abre hacia abajo', 'Es una recta', 'No tiene vértice'],
      ['Otwiera się w górę', 'Otwiera się w dół', 'Jest prostą', 'Nie ma wierzchołka'],
    ),
    fc: L(
      'a = 2 > 0, so the parabola opens upward.',
      'a = 2 > 0, así la parábola abre hacia arriba.',
      'a = 2 > 0, więc parabola otwiera się w górę.',
    ),
    fi: L(
      'Only the sign of a (the x² coefficient) controls opening direction.',
      'Solo el signo de a (coeficiente de x²) controla la apertura.',
      'Tylko znak a (współczynnik przy x²) steruje kierunkiem otwarcia.',
    ),
    tags: ['used_c_for_direction', 'direction_error'],
    stds: l18Dir,
  },
  {
    id: 't02',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Axis of symmetry for y = x^{2} − 6x + 5?',
      '¿Eje de simetría de y = x^{2} − 6x + 5?',
      'Oś symetrii dla y = x^{2} − 6x + 5?',
    ),
    math: 'y = x^{2} - 6x + 5',
    choices0: mathChoices('x=3', 'x=-3', 'x=6', 'y=3'),
    fc: L(
      'x = −b/(2a) = −(−6)/2 = 3.',
      'x = −b/(2a) = −(−6)/2 = 3.',
      'x = −b/(2a) = −(−6)/2 = 3.',
    ),
    fi: L(
      'Use −b/(2a), not b/(2a), and report a vertical line x = …',
      'Usa −b/(2a), no b/(2a), y reporta una recta vertical x = …',
      'Użyj −b/(2a), nie b/(2a), i podaj pionową prostą x = …',
    ),
    tags: ['axis_sign_error', 'axis_as_y'],
    stds: l18Vtx,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.quadratic.parabola.direction',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'y = −3x^{2} + 2x opens…',
      'y = −3x^{2} + 2x abre…',
      'y = −3x^{2} + 2x otwiera się…',
    ),
    math: 'y = -3x^{2} + 2x',
    choices0: L(
      ['Downward', 'Upward', 'Leftward', 'Horizontally'],
      ['Hacia abajo', 'Hacia arriba', 'Hacia la izquierda', 'Horizontalmente'],
      ['W dół', 'W górę', 'W lewo', 'Poziomo'],
    ),
    fc: L(
      'Negative a means the parabola opens downward (a maximum).',
      'a negativo significa que abre hacia abajo (un máximo).',
      'Ujemne a oznacza otwarcie w dół (maksimum).',
    ),
    fi: L(
      'Ignore the linear term for direction — only a matters.',
      'Ignora el término lineal para la dirección — solo importa a.',
      'Zignoruj wyraz liniowy dla kierunku — liczy się tylko a.',
    ),
    tags: ['direction_error', 'used_b_for_direction'],
    stds: l18Dir,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'For y = 2x^{2} + 8x − 1, the axis is…',
      'Para y = 2x^{2} + 8x − 1, el eje es…',
      'Dla y = 2x^{2} + 8x − 1 oś to…',
    ),
    math: 'y = 2x^{2} + 8x - 1',
    choices0: mathChoices('x=-2', 'x=2', 'x=-4', 'x=4'),
    fc: L(
      '−b/(2a) = −8/(4) = −2.',
      '−b/(2a) = −8/(4) = −2.',
      '−b/(2a) = −8/(4) = −2.',
    ),
    fi: L(
      'Denominator is 2a = 4; numerator is −b = −8.',
      'El denominador es 2a = 4; el numerador es −b = −8.',
      'Mianownik to 2a = 4; licznik to −b = −8.',
    ),
    tags: ['axis_sign_error', 'forgot_2a'],
    stds: l18Vtx,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.quadratic.graph.features',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'The y-intercept of y = x^{2} − 4x + 7 is…',
      'El intercepto y de y = x^{2} − 4x + 7 es…',
      'Przecięcie z osią y dla y = x^{2} − 4x + 7 to…',
    ),
    math: 'y = x^{2} - 4x + 7',
    choices0: mathChoices('(0,7)', '(7,0)', '(0,-4)', '(4,0)'),
    fc: L(
      'Set x = 0; y = c = 7, so the point is (0, 7).',
      'Pon x = 0; y = c = 7, así el punto es (0, 7).',
      'Podstaw x = 0; y = c = 7, więc punkt to (0, 7).',
    ),
    fi: L(
      'y-intercept is where the graph meets the y-axis: (0, c).',
      'El intercepto y es donde la gráfica toca el eje y: (0, c).',
      'Przecięcie y to miejsce styku z osią y: (0, c).',
    ),
    tags: ['confused_x_intercept', 'swapped_coords'],
    stds: l18Feat,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Vertex x-coordinate of y = x^{2} − 2x − 3?',
      '¿Coordenada x del vértice de y = x^{2} − 2x − 3?',
      'Współrzędna x wierzchołka y = x^{2} − 2x − 3?',
    ),
    math: 'y = x^{2} - 2x - 3',
    choices0: mathChoices('1', '-1', '2', '-2'),
    fc: L(
      'h = −b/(2a) = 2/2 = 1.',
      'h = −b/(2a) = 2/2 = 1.',
      'h = −b/(2a) = 2/2 = 1.',
    ),
    fi: L(
      'With a = 1 and b = −2, −b/(2a) = 2/2 = 1.',
      'Con a = 1 y b = −2, −b/(2a) = 2/2 = 1.',
      'Przy a = 1 i b = −2, −b/(2a) = 2/2 = 1.',
    ),
    tags: ['axis_sign_error', 'forgot_2a'],
    stds: l18Vtx,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.quadratic.graph.features',
    diff: 0.45,
    b: 0.1,
    prompt: L(
      'If roots are x = −1 and x = 5, the axis of symmetry is…',
      'Si las raíces son x = −1 y x = 5, el eje de simetría es…',
      'Jeśli pierwiastki to x = −1 i x = 5, oś symetrii to…',
    ),
    math: 'x=-1\\text{ and }x=5',
    choices0: mathChoices('x=2', 'x=3', 'x=-2', 'x=4'),
    fc: L(
      'Midpoint of the roots: (−1 + 5)/2 = 2.',
      'Punto medio de las raíces: (−1 + 5)/2 = 2.',
      'Środek pierwiastków: (−1 + 5)/2 = 2.',
    ),
    fi: L(
      'The axis sits halfway between the two x-intercepts.',
      'El eje queda a mitad de camino entre los dos interceptos x.',
      'Oś leży w połowie drogi między dwoma przecięciami x.',
    ),
    tags: ['midpoint_error', 'axis_sign_error'],
    stds: l18Feat,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.quadratic.parabola.direction',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Which function opens downward?',
      '¿Qué función abre hacia abajo?',
      'Która funkcja otwiera się w dół?',
    ),
    math: 'y=ax^{2}+bx+c',
    choices0: mathChoices('y=-x^{2}+3x', 'y=x^{2}-3x', 'y=2x^{2}+1', 'y=\\frac{1}{2}x^{2}'),
    fc: L(
      'Only y = −x² + 3x has negative a.',
      'Solo y = −x² + 3x tiene a negativo.',
      'Tylko y = −x² + 3x ma ujemne a.',
    ),
    fi: L(
      'Scan the coefficient of x²; positive a always opens up.',
      'Mira el coeficiente de x²; a positivo siempre abre hacia arriba.',
      'Spójrz na współczynnik przy x²; dodatnie a zawsze otwiera w górę.',
    ),
    tags: ['direction_error', 'used_c_for_direction'],
    stds: l18Dir,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.5,
    b: 0.25,
    prompt: L(
      'Axis for y = −x^{2} + 4x − 1?',
      '¿Eje de y = −x^{2} + 4x − 1?',
      'Oś dla y = −x^{2} + 4x − 1?',
    ),
    math: 'y = -x^{2} + 4x - 1',
    choices0: mathChoices('x=2', 'x=-2', 'x=4', 'x=-4'),
    fc: L(
      '−b/(2a) = −4/(−2) = 2.',
      '−b/(2a) = −4/(−2) = 2.',
      '−b/(2a) = −4/(−2) = 2.',
    ),
    fi: L(
      'a = −1 and b = 4 → −4 divided by −2 equals 2.',
      'a = −1 y b = 4 → −4 entre −2 es 2.',
      'a = −1 i b = 4 → −4 podzielone przez −2 daje 2.',
    ),
    tags: ['axis_sign_error', 'forgot_2a'],
    stds: l18Vtx,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.quadratic.graph.features',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'For y = (x − 2)(x + 4), the x-intercepts are…',
      'Para y = (x − 2)(x + 4), los interceptos x son…',
      'Dla y = (x − 2)(x + 4) przecięcia x to…',
    ),
    math: 'y = (x - 2)(x + 4)',
    choices0: mathChoices('x=2\\text{ and }x=-4', 'x=-2\\text{ and }x=4', 'x=2\\text{ and }x=4', 'x=-2\\text{ and }x=-4'),
    fc: L(
      'Zeros come from each factor: x = 2 and x = −4.',
      'Los ceros vienen de cada factor: x = 2 y x = −4.',
      'Zera pochodzą z każdego czynnika: x = 2 i x = −4.',
    ),
    fi: L(
      'From (x − 2) get 2; from (x + 4) get −4.',
      'De (x − 2) obtienes 2; de (x + 4) obtienes −4.',
      'Z (x − 2) masz 2; z (x + 4) masz −4.',
    ),
    tags: ['sign_flip_root', 'confused_y_intercept'],
    stds: l18Feat,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'y = x^{2} − 4x + 1 has vertex at x = 2. What is k = y(2)?',
      'y = x^{2} − 4x + 1 tiene vértice en x = 2. ¿Cuánto es k = y(2)?',
      'y = x^{2} − 4x + 1 ma wierzchołek przy x = 2. Ile wynosi k = y(2)?',
    ),
    math: 'y(2)=?',
    choices0: mathChoices('-3', '3', '1', '-1'),
    fc: L(
      'y(2) = 4 − 8 + 1 = −3, so the vertex is (2, −3).',
      'y(2) = 4 − 8 + 1 = −3, así el vértice es (2, −3).',
      'y(2) = 4 − 8 + 1 = −3, więc wierzchołek to (2, −3).',
    ),
    fi: L(
      'Substitute x = 2 into the quadratic to get the vertex y-value.',
      'Sustituye x = 2 en la cuadrática para obtener la y del vértice.',
      'Podstaw x = 2 do kwadratowej, by dostać y wierzchołka.',
    ),
    tags: ['vertex_y_arith', 'forgot_evaluate'],
    stds: l18Vtx,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.quadratic.graph.features',
    diff: 0.55,
    b: 0.45,
    prompt: L(
      'A parabola opens up and has vertex (3, −2). It has…',
      'Una parábola abre hacia arriba y tiene vértice (3, −2). Tiene…',
      'Parabola otwiera się w górę i ma wierzchołek (3, −2). Ma…',
    ),
    math: 'vertex\\ (3,-2),\\ a>0',
    choices0: L(
      ['A minimum at y = −2', 'A maximum at y = −2', 'No extreme value', 'A maximum at x = −2'],
      ['Un mínimo en y = −2', 'Un máximo en y = −2', 'Ningún extremo', 'Un máximo en x = −2'],
      ['Minimum w y = −2', 'Maksimum w y = −2', 'Brak ekstremum', 'Maksimum w x = −2'],
    ),
    fc: L(
      'Opening upward makes the vertex a minimum point.',
      'Abrir hacia arriba hace del vértice un mínimo.',
      'Otwarcie w górę czyni wierzchołek minimum.',
    ),
    fi: L(
      'Up ⇒ minimum; down ⇒ maximum at the vertex.',
      'Arriba ⇒ mínimo; abajo ⇒ máximo en el vértice.',
      'W górę ⇒ minimum; w dół ⇒ maksimum w wierzchołku.',
    ),
    tags: ['min_max_swap', 'direction_error'],
    stds: l18Feat,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.quadratic.parabola.direction',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Compared with y = x^{2}, the graph of y = 4x^{2} is…',
      'Comparada con y = x^{2}, la gráfica de y = 4x^{2} es…',
      'W porównaniu z y = x^{2} wykres y = 4x^{2} jest…',
    ),
    math: 'y=4x^{2}\\text{ vs }y=x^{2}',
    choices0: L(
      ['Narrower (steeper)', 'Wider (flatter)', 'Shifted right', 'Reflected over the x-axis'],
      ['Más estrecha (más empinada)', 'Más ancha (más plana)', 'Desplazada a la derecha', 'Reflejada sobre el eje x'],
      ['Węższa (stromsza)', 'Szersza (płaska)', 'Przesunięta w prawo', 'Odbita względem osi x'],
    ),
    fc: L(
      'Larger |a| pulls the arms inward — a narrower parabola.',
      'Un |a| mayor acerca los brazos — una parábola más estrecha.',
      'Większe |a| ściąga ramiona — węższa parabola.',
    ),
    fi: L(
      'Changing a scales width; it does not by itself translate horizontally.',
      'Cambiar a escala el ancho; por sí solo no traslada horizontalmente.',
      'Zmiana a skaluje szerokość; sama nie przesuwa poziomo.',
    ),
    tags: ['width_confused', 'direction_error'],
    stds: l18Dir,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.6,
    b: 0.6,
    prompt: L(
      'For y = 3x^{2} − 12x + 5, axis of symmetry?',
      'Para y = 3x^{2} − 12x + 5, ¿eje de simetría?',
      'Dla y = 3x^{2} − 12x + 5 oś symetrii?',
    ),
    math: 'y = 3x^{2} - 12x + 5',
    choices0: mathChoices('x=2', 'x=-2', 'x=4', 'x=-4'),
    fc: L(
      '−b/(2a) = 12/(6) = 2.',
      '−b/(2a) = 12/(6) = 2.',
      '−b/(2a) = 12/(6) = 2.',
    ),
    fi: L(
      '2a = 6 and −b = 12, so the axis is x = 2.',
      '2a = 6 y −b = 12, así el eje es x = 2.',
      '2a = 6 i −b = 12, więc oś to x = 2.',
    ),
    tags: ['forgot_2a', 'axis_sign_error'],
    stds: l18Vtx,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.quadratic.graph.features',
    diff: 0.65,
    b: 0.7,
    prompt: L(
      'Which point must lie on every parabola y = ax^{2} + bx + c?',
      '¿Qué punto debe estar en toda parábola y = ax^{2} + bx + c?',
      'Który punkt musi leżeć na każdej paraboli y = ax^{2} + bx + c?',
    ),
    math: 'y=ax^{2}+bx+c',
    choices0: mathChoices('(0,c)', '(c,0)', '(0,0)', '(a,0)'),
    fc: L(
      'The constant term is the y-intercept, so (0, c) is always on the graph.',
      'El término constante es el intercepto y, así (0, c) siempre está en la gráfica.',
      'Stały wyraz to przecięcie y, więc (0, c) zawsze leży na wykresie.',
    ),
    fi: L(
      '(0, 0) is on the graph only when c = 0.',
      '(0, 0) está en la gráfica solo cuando c = 0.',
      '(0, 0) leży na wykresie tylko gdy c = 0.',
    ),
    tags: ['confused_x_intercept', 'origin_assumption'],
    stds: l18Feat,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.quadratic.graph.features',
    diff: 0.65,
    b: 0.75,
    prompt: L(
      'y = x^{2} − 9 has x-intercepts…',
      'y = x^{2} − 9 tiene interceptos x…',
      'y = x^{2} − 9 ma przecięcia x…',
    ),
    math: 'y = x^{2} - 9',
    choices0: mathChoices('x=3\\text{ and }x=-3', 'x=9\\text{ and }x=-9', 'x=0\\text{ only}', 'x=3\\text{ only}'),
    fc: L(
      'Set y = 0: x² = 9 → x = ±3.',
      'Pon y = 0: x² = 9 → x = ±3.',
      'Podstaw y = 0: x² = 9 → x = ±3.',
    ),
    fi: L(
      'Difference of squares: (x − 3)(x + 3) = 0.',
      'Diferencia de cuadrados: (x − 3)(x + 3) = 0.',
      'Różnica kwadratów: (x − 3)(x + 3) = 0.',
    ),
    tags: ['missed_negative_root', 'confused_y_intercept'],
    stds: l18Feat,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.quadratic.vertex.axis',
    diff: 0.7,
    b: 0.85,
    prompt: L(
      'Vertex of y = x^{2} + 6x + 5 is…',
      'El vértice de y = x^{2} + 6x + 5 es…',
      'Wierzchołek y = x^{2} + 6x + 5 to…',
    ),
    math: 'y = x^{2} + 6x + 5',
    choices0: mathChoices('(-3,-4)', '(3,-4)', '(-3,5)', '(0,5)'),
    fc: L(
      'Axis x = −3; y(−3) = 9 − 18 + 5 = −4 → (−3, −4).',
      'Eje x = −3; y(−3) = 9 − 18 + 5 = −4 → (−3, −4).',
      'Oś x = −3; y(−3) = 9 − 18 + 5 = −4 → (−3, −4).',
    ),
    fi: L(
      'Find h = −b/(2a) = −3, then evaluate to get k.',
      'Halla h = −b/(2a) = −3 y evalúa para obtener k.',
      'Znajdź h = −b/(2a) = −3, potem oblicz k.',
    ),
    tags: ['vertex_y_arith', 'axis_sign_error'],
    stds: l18Vtx,
  },
]

/* Diversify remaining equation-cloned fc in L18 */
l18Specs.find((s) => s.id === 't02').fc = L(
  'Plug into −b/(2a): with b = −6 you get x = 3 as the axis.',
  'Sustituye en −b/(2a): con b = −6 obtienes x = 3 como eje.',
  'Podstaw do −b/(2a): przy b = −6 dostajesz oś x = 3.',
)
l18Specs.find((s) => s.id === 'g02').fc = L(
  'Compute −8 over 2·2 to land on the vertical line x = −2.',
  'Calcula −8 entre 2·2 y obtienes la recta vertical x = −2.',
  'Policz −8 przez 2·2 i otrzymasz pionową prostą x = −2.',
)
l18Specs.find((s) => s.id === 'g04').fc = L(
  'The axis formula gives h = 1 for this parabola.',
  'La fórmula del eje da h = 1 para esta parábola.',
  'Wzór na oś daje h = 1 dla tej paraboli.',
)
l18Specs.find((s) => s.id === 'i02').fc = L(
  'Negative a flips signs in −b/(2a), but here it still simplifies to x = 2.',
  'a negativo cambia signos en −b/(2a), pero aquí aún se simplifica a x = 2.',
  'Ujemne a zmienia znaki w −b/(2a), ale tu i tak upraszcza się do x = 2.',
)
l18Specs.find((s) => s.id === 'i07').fc = L(
  'Divide 12 by 6 after forming −b/(2a) to get the axis x = 2.',
  'Divide 12 entre 6 tras formar −b/(2a) para obtener el eje x = 2.',
  'Podziel 12 przez 6 po utworzeniu −b/(2a), by dostać oś x = 2.',
)

const lesson16Items = buildItems('alg1-l16', l16Specs)
const lesson17Items = buildItems('alg1-l17', l17Specs)
const lesson18Items = buildItems('alg1-l18', l18Specs)

const lesson16 = {
  id: 'alg1-l16',
  courseId: 'algebra1',
  order: 16,
  title: L(
    'Solve Quadratics by Factoring',
    'Resolver cuadráticas por factorización',
    'Rozwiązywanie kwadratowych przez rozkład',
  ),
  knowledgePointIds: [
    'kp.alg1.quadratic.zero.product',
    'kp.alg1.quadratic.solve.factoring',
    'kp.alg1.quadratic.check.roots',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_16', unlockOnMastery: ['lesson_board_17'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will use the zero product property to solve quadratic equations that factor over the integers.',
        'Usarás la propiedad del producto cero para resolver ecuaciones cuadráticas que se factorizan en enteros.',
        'Będziesz używać własności iloczynu zerowego do rozwiązywania równań kwadratowych rozkładalnych w liczbach całkowitych.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: factor then zero', 'Enseñar: factorizar luego cero', 'Nauczanie: rozkład, potem zero'),
      body: L(
        'Write = 0, factor, set each factor to zero, and solve the linear pieces. Check roots when unsure.',
        'Escribe = 0, factoriza, iguala cada factor a cero y resuelve las piezas lineales. Comprueba raíces si dudas.',
        'Zapisz = 0, rozłóż, przyrównaj każdy czynnik do zera i rozwiąż części liniowe. Sprawdź pierwiastki w razie wątpliwości.',
      ),
      bodyMath: [
        '(x-3)(x+2)=0 \\Rightarrow x=3\\text{ or }x=-2',
        'x^{2}-5x+6=(x-2)(x-3)=0',
        'x^{2}-16=(x-4)(x+4)=0',
      ],
      itemIds: ['alg1-l16-t01', 'alg1-l16-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Practice GCF first, difference of squares, and reading roots from factored form.',
        'Practica primero el MCD, diferencia de cuadrados y leer raíces de la forma factorizada.',
        'Ćwicz najpierw NWD, różnicę kwadratów i odczyt pierwiastków z postaci rozłożonej.',
      ),
      itemIds: ['alg1-l16-g01', 'alg1-l16-g02', 'alg1-l16-g03', 'alg1-l16-g04', 'alg1-l16-g05'],
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
        'alg1-l16-i01',
        'alg1-l16-i02',
        'alg1-l16-i03',
        'alg1-l16-i04',
        'alg1-l16-i05',
        'alg1-l16-i06',
        'alg1-l16-i07',
        'alg1-l16-i08',
        'alg1-l16-i09',
        'alg1-l16-i10',
      ],
    },
  ],
  items: lesson16Items,
}

const lesson17 = {
  id: 'alg1-l17',
  courseId: 'algebra1',
  order: 17,
  title: L(
    'Quadratic Formula & Discriminant',
    'Fórmula cuadrática y discriminante',
    'Wzór kwadratowy i wyróżnik',
  ),
  knowledgePointIds: [
    'kp.alg1.quadratic.formula',
    'kp.alg1.quadratic.discriminant',
    'kp.alg1.quadratic.formula.apply',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_17', unlockOnMastery: ['lesson_board_18'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will identify a, b, c, use the quadratic formula, and interpret the discriminant.',
        'Identificarás a, b, c, usarás la fórmula cuadrática e interpretarás el discriminante.',
        'Będziesz identyfikować a, b, c, stosować wzór kwadratowy i interpretować wyróżnik.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: formula & Δ', 'Enseñar: fórmula y Δ', 'Nauczanie: wzór i Δ'),
      body: L(
        'Memorize x = (−b ± √(b² − 4ac))/(2a). The sign of Δ = b² − 4ac tells how many real roots.',
        'Memoriza x = (−b ± √(b² − 4ac))/(2a). El signo de Δ = b² − 4ac dice cuántas raíces reales hay.',
        'Zapamiętaj x = (−b ± √(b² − 4ac))/(2a). Znak Δ = b² − 4ac mówi, ile jest pierwiastków rzeczywistych.',
      ),
      bodyMath: [
        'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}',
        '\\Delta=b^{2}-4ac',
        '\\Delta>0:\\ 2\\text{ real};\\ \\Delta=0:\\ 1\\text{ real};\\ \\Delta<0:\\text{ none real}',
      ],
      itemIds: ['alg1-l17-t01', 'alg1-l17-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Classify by Δ, pick coefficients carefully, and run the formula on friendly integers.',
        'Clasifica por Δ, elige coeficientes con cuidado y aplica la fórmula con enteros amables.',
        'Klasyfikuj według Δ, ostrożnie wybieraj współczynniki i stosuj wzór na wygodnych całkowitych.',
      ),
      itemIds: ['alg1-l17-g01', 'alg1-l17-g02', 'alg1-l17-g03', 'alg1-l17-g04', 'alg1-l17-g05'],
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
        'alg1-l17-i01',
        'alg1-l17-i02',
        'alg1-l17-i03',
        'alg1-l17-i04',
        'alg1-l17-i05',
        'alg1-l17-i06',
        'alg1-l17-i07',
        'alg1-l17-i08',
        'alg1-l17-i09',
        'alg1-l17-i10',
      ],
    },
  ],
  items: lesson17Items,
}

const lesson18 = {
  id: 'alg1-l18',
  courseId: 'algebra1',
  order: 18,
  title: L(
    'Parabolas — Vertex & Axis Intro',
    'Parábolas — vértice y eje (intro)',
    'Parabole — wierzchołek i oś (wstęp)',
  ),
  knowledgePointIds: [
    'kp.alg1.quadratic.parabola.direction',
    'kp.alg1.quadratic.vertex.axis',
    'kp.alg1.quadratic.graph.features',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_18', unlockOnMastery: ['lesson_board_19'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will describe opening direction, find the axis and vertex, and connect intercepts to the graph.',
        'Describirás la apertura, hallarás eje y vértice, y conectarás interceptos con la gráfica.',
        'Będziesz opisywać kierunek otwarcia, znajdować oś i wierzchołek oraz łączyć przecięcia z wykresem.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: shape & symmetry', 'Enseñar: forma y simetría', 'Nauczanie: kształt i symetria'),
      body: L(
        'Sign of a → up/down. Axis x = −b/(2a). Vertex sits on that axis; intercepts help sketch.',
        'Signo de a → arriba/abajo. Eje x = −b/(2a). El vértice está en ese eje; los interceptos ayudan a bosquejar.',
        'Znak a → góra/dół. Oś x = −b/(2a). Wierzchołek leży na tej osi; przecięcia pomagają szkicować.',
      ),
      bodyMath: [
        'a>0:\\text{ opens up};\\ a<0:\\text{ opens down}',
        'x=-\\frac{b}{2a}',
        'y=x^{2}-6x+5:\\text{ axis }x=3',
      ],
      itemIds: ['alg1-l18-t01', 'alg1-l18-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Practice direction, axis arithmetic, y-intercept, and midpoint of roots.',
        'Practica dirección, aritmética del eje, intercepto y y punto medio de raíces.',
        'Ćwicz kierunek, arytmetykę osi, przecięcie y oraz środek pierwiastków.',
      ),
      itemIds: ['alg1-l18-g01', 'alg1-l18-g02', 'alg1-l18-g03', 'alg1-l18-g04', 'alg1-l18-g05'],
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
        'alg1-l18-i01',
        'alg1-l18-i02',
        'alg1-l18-i03',
        'alg1-l18-i04',
        'alg1-l18-i05',
        'alg1-l18-i06',
        'alg1-l18-i07',
        'alg1-l18-i08',
        'alg1-l18-i09',
        'alg1-l18-i10',
      ],
    },
  ],
  items: lesson18Items,
}

/* ─── Write outputs ─── */
lesson15.worldHook.unlockOnMastery = ['lesson_board_16']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-15.json', lesson15)
writeJson('lesson-16.json', lesson16)
writeJson('lesson-17.json', lesson17)
writeJson('lesson-18.json', lesson18)

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

function asciiCaretChoices(lesson) {
  let n = 0
  for (const it of lesson.items) {
    if (!it.choices) continue
    for (const loc of ['en', 'es', 'pl']) {
      for (const c of it.choices[loc] ?? []) {
        const s = String(c)
        if (/\^/.test(s) && !/\$/.test(s) && !/\\/.test(s)) n++
      }
    }
  }
  return n
}

function katexChoiceHits(lesson) {
  let hits = 0
  let total = 0
  for (const it of lesson.items) {
    if (!it.choices) continue
    for (const c of it.choices.en ?? []) {
      total++
      if (/\\|\$/.test(String(c))) hits++
    }
  }
  return `${hits}/${total}`
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
  lessons: [lesson16, lesson17, lesson18].map((l) => ({
    id: l.id,
    totalItems: l.items.length,
    teach: l.sections.find((s) => s.phase === 'teach')?.itemIds?.length ?? 0,
    guided: l.sections.find((s) => s.phase === 'guided')?.itemIds?.length ?? 0,
    independent: l.sections.find((s) => s.phase === 'independent')?.itemIds?.length ?? 0,
    siteId: l.worldHook.siteId,
    unlock: l.worldHook.unlockOnMastery,
    correctIndexHist: hist(l),
    promptMath: promptMathCoverage(l),
    katexChoicesEn: katexChoiceHits(l),
    asciiCaretChoices: asciiCaretChoices(l),
    enEsPlFeedbackClones: feedbackCloneRate(l),
  })),
  l15Unlock: lesson15.worldHook.unlockOnMastery,
}
console.log(JSON.stringify(summary, null, 2))
