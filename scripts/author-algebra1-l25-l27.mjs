/**
 * Wave 9 authoring: Algebra I Lessons 25–27 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l25-l27.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-25..27; confirms L24 unlockOnMastery → lesson_board_25;
 * L27 unlocks lesson_board_28 teaser.
 *
 * KaTeX: promptMath on every item; MC math choices in $...$.
 * Feedback: distinct EN/ES/PL prose.
 * No English filler in ES/PL KaTeX (o / lub / y / i, not "or"/"and").
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

/** Same math string in all locales (no embedded English words). */
function mathChoices(...opts) {
  const fixed = opts.map(wrapKatex)
  return L(fixed, fixed, fixed)
}

/** Per-locale math choice arrays (for localized \\text{...}). */
function mathChoicesL(enOpts, esOpts, plOpts) {
  return L(enOpts.map(wrapKatex), esOpts.map(wrapKatex), plOpts.map(wrapKatex))
}

function latexifyMath(s) {
  return String(s).replace(/\\\^/g, '^')
}

const existingKpDoc = JSON.parse(readFileSync(join(outDir, 'knowledge-points.json'), 'utf8'))
const existingStd = JSON.parse(readFileSync(join(outDir, 'standards-index.json'), 'utf8'))
const lesson24 = JSON.parse(readFileSync(join(outDir, 'lesson-24.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.inequality.two.var',
    title: L(
      'Graph a linear inequality in two variables',
      'Graficar una desigualdad lineal en dos variables',
      'Rysować nierówność liniową dwóch zmiennych',
    ),
    prerequisites: ['kp.alg1.graph.slope.intercept', 'kp.alg1.inequality.meaning'],
    successCriteria: L(
      'Student graphs the boundary line (solid/dashed) and shades the correct half-plane using a test point.',
      'El estudiante grafica la frontera (continua/discontinua) y sombrea el semplano correcto con un punto de prueba.',
      'Uczeń rysuje prostą brzegową (ciągła/przerywana) i zacienia właściwą półpłaszczyznę punktem próbnym.',
    ),
    misconceptions: L(
      [
        'Using a solid boundary for < or >',
        'Shading the wrong side after a failed or skipped test point',
      ],
      [
        'Usar frontera continua para < o >',
        'Sombrear el lado incorrecto tras un punto de prueba fallido u omitido',
      ],
      [
        'Używanie ciągłej granicy dla < lub >',
        'Zacienianie złej strony po nieudanym lub pominiętym punkcie próbnym',
      ],
    ),
    standards: [
      TX('A.3(D)', 'A.1(D)', 'A.1(F)'),
      CC('A-REI.D.12', 'A-CED.A.3'),
      CA('A-REI.12'),
      FL('MA.912.AR.9.4'),
    ],
  },
  {
    id: 'kp.alg1.systems.inequalities.region',
    title: L(
      'Graph systems of linear inequalities',
      'Graficar sistemas de desigualdades lineales',
      'Rysować układy nierówności liniowych',
    ),
    prerequisites: ['kp.alg1.inequality.two.var', 'kp.alg1.systems.meaning'],
    encompassing: ['kp.alg1.inequality.two.var'],
    successCriteria: L(
      'Student identifies the intersection (overlap) of two half-planes as the solution region of a system.',
      'El estudiante identifica la intersección (solapamiento) de dos semplanos como la región solución del sistema.',
      'Uczeń identyfikuje przecięcie (wspólny obszar) dwóch półpłaszczyzn jako obszar rozwiązań układu.',
    ),
    misconceptions: L(
      [
        'Shading the union instead of the intersection',
        'Thinking parallel boundaries always mean an empty solution set',
      ],
      [
        'Sombrear la unión en lugar de la intersección',
        'Pensar que fronteras paralelas siempre dan conjunto vacío',
      ],
      [
        'Zacienianie sumy zamiast przecięcia',
        'Myślenie, że równoległe brzegi zawsze dają zbiór pusty',
      ],
    ),
    standards: [
      TX('A.3(H)', 'A.3(D)', 'A.1(D)'),
      CC('A-REI.D.12', 'A-CED.A.3'),
      CA('A-REI.12'),
      FL('MA.912.AR.9.6'),
    ],
  },
  {
    id: 'kp.alg1.systems.inequalities.test',
    title: L(
      'Test points in inequality solution regions',
      'Probar puntos en regiones de soluciones de desigualdades',
      'Sprawdzać punkty w obszarach rozwiązań nierówności',
    ),
    prerequisites: ['kp.alg1.systems.inequalities.region'],
    encompassing: ['kp.alg1.systems.inequalities.region'],
    successCriteria: L(
      'Student substitutes ordered pairs into both inequalities to decide membership in the solution set.',
      'El estudiante sustituye pares ordenados en ambas desigualdades para decidir pertenencia al conjunto solución.',
      'Uczeń podstawia pary uporządkowane do obu nierówności, by rozstrzygnąć przynależność do zbioru rozwiązań.',
    ),
    misconceptions: L(
      [
        'Checking only one inequality of the system',
        'Treating boundary points as solutions when inequalities are strict',
      ],
      [
        'Verificar solo una desigualdad del sistema',
        'Tratar puntos de la frontera como soluciones cuando las desigualdades son estrictas',
      ],
      [
        'Sprawdzanie tylko jednej nierówności układu',
        'Traktowanie punktów brzegu jako rozwiązań przy nierównościach ostrych',
      ],
    ),
    standards: [
      TX('A.3(H)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.D.12', 'A-CED.A.3'),
      CA('A-REI.12'),
      FL('MA.912.AR.9.6'),
    ],
  },
  {
    id: 'kp.alg1.scatter.interpret',
    title: L(
      'Read and interpret scatter plots',
      'Leer e interpretar diagramas de dispersión',
      'Odczytywać i interpretować wykresy rozrzutu',
    ),
    prerequisites: ['kp.alg1.rate.of.change', 'kp.alg1.graph.slope.intercept'],
    successCriteria: L(
      'Student describes bivariate data patterns from a scatter plot (clusters, outliers, overall shape).',
      'El estudiante describe patrones de datos bivariados en un diagrama de dispersión (grupos, atípicos, forma).',
      'Uczeń opisuje wzorce danych dwuzmiennych na wykresie rozrzutu (skupiska, wartości odstające, kształt).',
    ),
    misconceptions: L(
      [
        'Reading every point as lying on a single exact line',
        'Ignoring clear outliers when describing the overall trend',
      ],
      [
        'Leer cada punto como si estuviera en una sola recta exacta',
        'Ignorar atípicos claros al describir la tendencia general',
      ],
      [
        'Odczytywanie każdego punktu jakby leżał na jednej dokładnej prostej',
        'Ignorowanie wyraźnych wartości odstających przy opisie trendu',
      ],
    ),
    standards: [
      TX('A.4(A)', 'A.1(D)', 'A.1(A)'),
      CC('S-ID.B.6', 'S-ID.B.6a'),
      CA('S-ID.6'),
      FL('MA.912.DP.2.4'),
    ],
  },
  {
    id: 'kp.alg1.correlation.direction',
    title: L(
      'Describe correlation direction and strength',
      'Describir dirección y fuerza de la correlación',
      'Opisywać kierunek i siłę korelacji',
    ),
    prerequisites: ['kp.alg1.scatter.interpret'],
    encompassing: ['kp.alg1.scatter.interpret'],
    successCriteria: L(
      'Student labels association as positive, negative, or roughly none, and qualitatively strong vs weak.',
      'El estudiante etiqueta la asociación como positiva, negativa o aproximadamente nula, y cualitativamente fuerte o débil.',
      'Uczeń określa związek jako dodatni, ujemny lub w przybliżeniu zerowy oraz jakościowo silny lub słaby.',
    ),
    misconceptions: L(
      [
        'Confusing positive slope of a fit line with causation',
        'Calling weak positive association “no correlation”',
      ],
      [
        'Confundir pendiente positiva de la recta de ajuste con causalidad',
        'Llamar “sin correlación” a una asociación positiva débil',
      ],
      [
        'Mylenie dodatniego nachylenia prostej dopasowania z przyczynowością',
        'Nazywanie słabej korelacji dodatniej „brakiem korelacji”',
      ],
    ),
    standards: [
      TX('A.4(A)', 'A.4(B)', 'A.1(D)'),
      CC('S-ID.C.8', 'S-ID.C.9'),
      CA('S-ID.8'),
      FL('MA.912.DP.2.6'),
    ],
  },
  {
    id: 'kp.alg1.line.best.fit',
    title: L(
      'Use a line of best fit',
      'Usar una recta de mejor ajuste',
      'Stosować prostą najlepszego dopasowania',
    ),
    prerequisites: ['kp.alg1.correlation.direction', 'kp.alg1.write.equation.slope.yint'],
    encompassing: ['kp.alg1.correlation.direction'],
    successCriteria: L(
      'Student reads or applies a linear model y ≈ mx + b from a scatter plot to estimate or predict.',
      'El estudiante lee o aplica un modelo lineal y ≈ mx + b de un diagrama de dispersión para estimar o predecir.',
      'Uczeń odczytuje lub stosuje model liniowy y ≈ mx + b z wykresu rozrzutu do szacowania lub przewidywania.',
    ),
    misconceptions: L(
      [
        'Extrapolating far beyond the data as if the fit were exact',
        'Using the wrong slope sign relative to the association',
      ],
      [
        'Extrapolar mucho más allá de los datos como si el ajuste fuera exacto',
        'Usar el signo incorrecto de la pendiente respecto a la asociación',
      ],
      [
        'Ekstrapolowanie daleko poza dane jakby dopasowanie było dokładne',
        'Używanie złego znaku nachylenia względem związku',
      ],
    ),
    standards: [
      TX('A.4(C)', 'A.4(A)', 'A.1(F)'),
      CC('S-ID.B.6a', 'S-ID.C.7'),
      CA('S-ID.6'),
      FL('MA.912.DP.2.5'),
    ],
  },
  {
    id: 'kp.alg1.modeling.write',
    title: L(
      'Write algebraic models from contexts',
      'Escribir modelos algebraicos desde contextos',
      'Zapisywać modele algebraiczne z kontekstu',
    ),
    prerequisites: ['kp.alg1.expression.translate', 'kp.alg1.write.equation.slope.yint'],
    successCriteria: L(
      'Student translates a real-world constraint or relationship into an equation or inequality.',
      'El estudiante traduce una restricción o relación del mundo real en una ecuación o desigualdad.',
      'Uczeń tłumaczy ograniczenie lub zależność z życia na równanie lub nierówność.',
    ),
    misconceptions: L(
      [
        'Mixing units or reversing which quantity is the independent variable',
        'Writing expressions where equations are required',
      ],
      [
        'Mezclar unidades o invertir cuál cantidad es la variable independiente',
        'Escribir expresiones donde se requieren ecuaciones',
      ],
      [
        'Mieszanie jednostek lub odwracanie zmiennej niezależnej',
        'Zapisywanie wyrażeń tam, gdzie potrzebne są równania',
      ],
    ),
    standards: [
      TX('A.1(A)', 'A.1(B)', 'A.2(C)'),
      CC('A-CED.A.1', 'A-CED.A.2'),
      CA('A-CED.1'),
      FL('MA.912.AR.2.5'),
    ],
  },
  {
    id: 'kp.alg1.modeling.multi.step',
    title: L(
      'Solve multi-step modeling problems',
      'Resolver problemas de modelado de varios pasos',
      'Rozwiązywać wieloetapowe zadania modelowania',
    ),
    prerequisites: ['kp.alg1.modeling.write', 'kp.alg1.solve.multi.step'],
    encompassing: ['kp.alg1.modeling.write'],
    successCriteria: L(
      'Student plans, computes, and interprets a numeric answer in context for a multi-step Algebra I application.',
      'El estudiante planifica, calcula e interpreta una respuesta numérica en contexto en una aplicación de varios pasos.',
      'Uczeń planuje, oblicza i interpretuje wynik liczbowy w kontekście wieloetapowego zastosowania algebry I.',
    ),
    misconceptions: L(
      [
        'Stopping after forming the model without solving',
        'Reporting a raw number without checking units or reasonableness',
      ],
      [
        'Detenerse tras formar el modelo sin resolver',
        'Reportar un número sin verificar unidades o razonabilidad',
      ],
      [
        'Zatrzymanie się po utworzeniu modelu bez rozwiązania',
        'Podawanie liczby bez sprawdzenia jednostek lub sensowności',
      ],
    ),
    standards: [
      TX('A.1(A)', 'A.1(B)', 'A.5(C)'),
      CC('A-CED.A.1', 'A-REI.B.3'),
      CA('A-CED.1'),
      FL('MA.912.AR.2.5'),
    ],
  },
  {
    id: 'kp.alg1.modeling.choose',
    title: L(
      'Choose and justify a modeling approach',
      'Elegir y justificar un enfoque de modelado',
      'Wybierać i uzasadniać podejście modelowania',
    ),
    prerequisites: ['kp.alg1.modeling.multi.step', 'kp.alg1.systems.verify'],
    encompassing: ['kp.alg1.modeling.multi.step'],
    successCriteria: L(
      'Student selects linear vs system vs inequality models when appropriate and justifies the choice briefly.',
      'El estudiante elige modelos lineales, de sistemas o de desigualdades cuando corresponde y justifica brevemente.',
      'Uczeń wybiera model liniowy, układ lub nierówność, gdy to właściwe, i krótko uzasadnia wybór.',
    ),
    misconceptions: L(
      [
        'Defaulting to one equation when two constraints require a system',
        'Using equality when a constraint is clearly an inequality',
      ],
      [
        'Usar por defecto una ecuación cuando dos restricciones requieren un sistema',
        'Usar igualdad cuando la restricción es claramente una desigualdad',
      ],
      [
        'Domyślne jedno równanie, gdy dwa ograniczenia wymagają układu',
        'Używanie równości, gdy ograniczenie jest wyraźnie nierównością',
      ],
    ),
    standards: [
      TX('A.1(A)', 'A.1(B)', 'A.1(F)'),
      CC('A-CED.A.3', 'A-CED.A.2'),
      CA('A-CED.3'),
      FL('MA.912.AR.2.5'),
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

const ineqSysKps = [
  'kp.alg1.inequality.two.var',
  'kp.alg1.systems.inequalities.region',
  'kp.alg1.systems.inequalities.test',
]
const scatterKps = [
  'kp.alg1.scatter.interpret',
  'kp.alg1.correlation.direction',
  'kp.alg1.line.best.fit',
]
const modelKps = [
  'kp.alg1.modeling.write',
  'kp.alg1.modeling.multi.step',
  'kp.alg1.modeling.choose',
]

addKpsToExisting('TX', 'A.1(A)', [...scatterKps, ...modelKps])
addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.systems.inequalities.test',
  ...modelKps,
])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.inequality.two.var',
  'kp.alg1.systems.inequalities.region',
  ...scatterKps,
])
addKpsToExisting('TX', 'A.1(F)', [
  ...ineqSysKps,
  'kp.alg1.line.best.fit',
  'kp.alg1.modeling.choose',
])
addKpsToExisting('TX', 'A.2(C)', ['kp.alg1.modeling.write'])
addKpsToExisting('TX', 'A.5(C)', ['kp.alg1.modeling.multi.step'])
addKpsToExisting('CCSS', 'A-CED.A.1', modelKps)
addKpsToExisting('CCSS', 'A-CED.A.2', ['kp.alg1.modeling.write', 'kp.alg1.modeling.choose'])
addKpsToExisting('CCSS', 'A-REI.B.3', ['kp.alg1.modeling.multi.step'])

ensureCode(
  'TX',
  'A.3(D)',
  L(
    'Graph the solution set of linear inequalities in two variables on the coordinate plane',
    'Graficar el conjunto solución de desigualdades lineales en dos variables en el plano',
    'Rysować zbiór rozwiązań nierówności liniowych dwóch zmiennych na płaszczyźnie',
  ),
  ['kp.alg1.inequality.two.var', 'kp.alg1.systems.inequalities.region'],
)
ensureCode(
  'TX',
  'A.3(H)',
  L(
    'Graph the solution set of systems of two linear inequalities in two variables on the coordinate plane',
    'Graficar el conjunto solución de sistemas de dos desigualdades lineales en dos variables',
    'Rysować zbiór rozwiązań układów dwóch nierówności liniowych dwóch zmiennych',
  ),
  ['kp.alg1.systems.inequalities.region', 'kp.alg1.systems.inequalities.test'],
)
ensureCode(
  'TX',
  'A.4(A)',
  L(
    'Calculate, using technology, the correlation coefficient between two quantitative variables and interpret this quantity as a measure of the strength of the linear association',
    'Calcular, con tecnología, el coeficiente de correlación entre dos variables cuantitativas e interpretarlo como medida de la fuerza de la asociación lineal',
    'Obliczać (z technologią) współczynnik korelacji dwóch zmiennych ilościowych i interpretować go jako miarę siły związku liniowego',
  ),
  scatterKps,
)
ensureCode(
  'TX',
  'A.4(B)',
  L(
    'Compare and contrast association and causation in real-world problems',
    'Comparar y contrastar asociación y causalidad en problemas del mundo real',
    'Porównywać i przeciwstawiać związek oraz przyczynowość w problemach rzeczywistych',
  ),
  ['kp.alg1.correlation.direction'],
)
ensureCode(
  'TX',
  'A.4(C)',
  L(
    'Write, with and without technology, linear functions that provide a reasonable fit to data to estimate solutions and make predictions for real-world problems',
    'Escribir, con y sin tecnología, funciones lineales que se ajusten razonablemente a datos para estimar y predecir en problemas reales',
    'Zapisywać (z technologią i bez) funkcje liniowe rozsądnie dopasowane do danych, by szacować i przewidywać w problemach rzeczywistych',
  ),
  ['kp.alg1.line.best.fit'],
)
ensureCode(
  'CCSS',
  'A-REI.D.12',
  L(
    'Graph the solutions to a linear inequality in two variables as a half-plane, and graph the solution set to a system of linear inequalities as the intersection of the corresponding half-planes',
    'Graficar soluciones de una desigualdad lineal en dos variables como semplano, y el conjunto solución de un sistema como intersección de semplanos',
    'Rysować rozwiązania nierówności liniowej dwóch zmiennych jako półpłaszczyznę oraz zbiór rozwiązań układu jako przecięcie półpłaszczyzn',
  ),
  ineqSysKps,
)
ensureCode(
  'CCSS',
  'A-CED.A.3',
  L(
    'Represent constraints by equations or inequalities, and by systems of equations and/or inequalities, and interpret solutions as viable or nonviable options in a modeling context',
    'Representar restricciones con ecuaciones o desigualdades y con sistemas, e interpretar soluciones como opciones viables o no en un contexto de modelado',
    'Przedstawiać ograniczenia równaniami lub nierównościami oraz układami i interpretować rozwiązania jako opcje możliwe lub niemożliwe w modelowaniu',
  ),
  [...ineqSysKps, 'kp.alg1.modeling.choose'],
)
ensureCode(
  'CCSS',
  'S-ID.B.6',
  L(
    'Represent data on two quantitative variables on a scatter plot, and describe how the variables are related',
    'Representar datos de dos variables cuantitativas en un diagrama de dispersión y describir cómo se relacionan',
    'Przedstawiać dane dwóch zmiennych ilościowych na wykresie rozrzutu i opisywać ich związek',
  ),
  ['kp.alg1.scatter.interpret', 'kp.alg1.line.best.fit'],
)
ensureCode(
  'CCSS',
  'S-ID.B.6a',
  L(
    'Fit a function to the data; use functions fitted to data to solve problems in the context of the data',
    'Ajustar una función a los datos; usar funciones ajustadas para resolver problemas en el contexto de los datos',
    'Dopasować funkcję do danych; używać dopasowanych funkcji do rozwiązywania problemów w kontekście danych',
  ),
  ['kp.alg1.scatter.interpret', 'kp.alg1.line.best.fit'],
)
ensureCode(
  'CCSS',
  'S-ID.C.7',
  L(
    'Interpret the slope and the intercept of a linear model in the context of the data',
    'Interpretar la pendiente y la intersección de un modelo lineal en el contexto de los datos',
    'Interpretować nachylenie i przecięcie modelu liniowego w kontekście danych',
  ),
  ['kp.alg1.line.best.fit'],
)
ensureCode(
  'CCSS',
  'S-ID.C.8',
  L(
    'Compute (using technology) and interpret the correlation coefficient of a linear fit',
    'Calcular (con tecnología) e interpretar el coeficiente de correlación de un ajuste lineal',
    'Obliczać (z technologią) i interpretować współczynnik korelacji dopasowania liniowego',
  ),
  ['kp.alg1.correlation.direction'],
)
ensureCode(
  'CCSS',
  'S-ID.C.9',
  L(
    'Distinguish between correlation and causation',
    'Distinguir entre correlación y causalidad',
    'Rozróżniać korelację i przyczynowość',
  ),
  ['kp.alg1.correlation.direction'],
)

existingStd.lessonCoverage['alg1-l25'] = [
  'A.3(D)',
  'A.3(H)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-REI.D.12',
  'A-CED.A.3',
]
existingStd.lessonCoverage['alg1-l26'] = [
  'A.4(A)',
  'A.4(B)',
  'A.4(C)',
  'A.1(A)',
  'A.1(D)',
  'A.1(F)',
  'S-ID.B.6',
  'S-ID.B.6a',
  'S-ID.C.7',
  'S-ID.C.8',
  'S-ID.C.9',
]
existingStd.lessonCoverage['alg1-l27'] = [
  'A.1(A)',
  'A.1(B)',
  'A.1(F)',
  'A.2(C)',
  'A.5(C)',
  'A-CED.A.1',
  'A-CED.A.2',
  'A-CED.A.3',
  'A-REI.B.3',
]

const l25Bound = [TX('A.3(D)', 'A.1(D)', 'A.1(F)'), CC('A-REI.D.12', 'A-CED.A.3')]
const l25Reg = [TX('A.3(H)', 'A.3(D)', 'A.1(D)'), CC('A-REI.D.12', 'A-CED.A.3')]
const l25Test = [TX('A.3(H)', 'A.1(B)', 'A.1(F)'), CC('A-REI.D.12', 'A-CED.A.3')]

const l26Sc = [TX('A.4(A)', 'A.1(D)', 'A.1(A)'), CC('S-ID.B.6', 'S-ID.B.6a')]
const l26Cor = [TX('A.4(A)', 'A.4(B)', 'A.1(D)'), CC('S-ID.C.8', 'S-ID.C.9')]
const l26Fit = [TX('A.4(C)', 'A.4(A)', 'A.1(F)'), CC('S-ID.B.6a', 'S-ID.C.7')]

const l27W = [TX('A.1(A)', 'A.1(B)', 'A.2(C)'), CC('A-CED.A.1', 'A-CED.A.2')]
const l27M = [TX('A.1(A)', 'A.1(B)', 'A.5(C)'), CC('A-CED.A.1', 'A-REI.B.3')]
const l27C = [TX('A.1(A)', 'A.1(B)', 'A.1(F)'), CC('A-CED.A.3', 'A-CED.A.2')]

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
   LESSON 25 — Systems of linear inequalities
   ═══════════════════════════════════════ */
const l25Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'For y > 2x − 1, should the boundary line be solid or dashed?',
      'Para y > 2x − 1, ¿la frontera debe ser continua o discontinua?',
      'Dla y > 2x − 1 granica ma być ciągła czy przerywana?',
    ),
    math: 'y>2x-1',
    choices0: mathChoicesL(
      ['\\text{dashed}', '\\text{solid}', '\\text{none}', '\\text{both}'],
      ['\\text{discontinua}', '\\text{continua}', '\\text{ninguna}', '\\text{ambas}'],
      ['\\text{przerywana}', '\\text{ciągła}', '\\text{żadna}', '\\text{obie}'],
    ),
    fc: L(
      'Strict inequalities (> or <) use a dashed boundary; points on the line are not solutions.',
      'Las desigualdades estrictas (> o <) usan frontera discontinua; los puntos de la recta no son soluciones.',
      'Ostre nierówności (> lub <) mają przerywaną granicę; punkty na prostej nie są rozwiązaniami.',
    ),
    fi: L(
      'Use solid only for ≤ or ≥; here > means the boundary is not included.',
      'Usa continua solo para ≤ o ≥; aquí > significa que la frontera no se incluye.',
      'Ciągłą stosuj tylko dla ≤ lub ≥; tu > oznacza, że granica nie należy do rozwiązań.',
    ),
    tags: ['solid_vs_dashed', 'strict_vs_closed'],
    stds: l25Bound,
  },
  {
    id: 't02',
    kp: 'kp.alg1.systems.inequalities.region',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'The solution of a system of two linear inequalities is the region where…',
      'La solución de un sistema de dos desigualdades lineales es la región donde…',
      'Rozwiązaniem układu dwóch nierówności liniowych jest obszar, gdzie…',
    ),
    math: '\\begin{cases} y\\ge x \\\\ y\\le 4-x \\end{cases}',
    choices0: mathChoicesL(
      ['\\text{both true}', '\\text{either true}', '\\text{neither}', '\\text{only y}'],
      ['\\text{ambas ciertas}', '\\text{alguna cierta}', '\\text{ninguna}', '\\text{solo y}'],
      ['\\text{obie prawdziwe}', '\\text{któraś}', '\\text{żadna}', '\\text{tylko y}'],
    ),
    fc: L(
      'AND: a point must satisfy both inequalities — the overlapping shaded region.',
      'Y: un punto debe satisfacer ambas — la región sombreada que se solapa.',
      'I: punkt musi spełniać obie — wspólny zacieniony obszar.',
    ),
    fi: L(
      'Systems use intersection (both), not union (either).',
      'Los sistemas usan intersección (ambas), no unión (alguna).',
      'Układy używają przecięcia (obie), nie sumy (któraś).',
    ),
    tags: ['union_vs_intersection', 'one_inequality_only'],
    stds: l25Reg,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.35,
    b: -0.6,
    prompt: L(
      'Test (0,0) in y ≤ −x + 3. Does it satisfy the inequality?',
      'Prueba (0,0) en y ≤ −x + 3. ¿Satisface la desigualdad?',
      'Sprawdź (0,0) w y ≤ −x + 3. Czy spełnia nierówność?',
    ),
    math: '(0,0):\\ y\\le -x+3',
    choices0: mathChoicesL(
      ['\\text{yes}', '\\text{no}', '\\text{on line only}', '\\text{undefined}'],
      ['\\text{sí}', '\\text{falso}', '\\text{solo en recta}', '\\text{indefinido}'],
      ['\\text{tak}', '\\text{nie}', '\\text{tylko na prostej}', '\\text{nieokreślone}'],
    ),
    fc: L(
      '0 ≤ −0 + 3 → 0 ≤ 3 is true, so (0,0) is in the half-plane.',
      '0 ≤ −0 + 3 → 0 ≤ 3 es verdadero, así (0,0) está en el semplano.',
      '0 ≤ −0 + 3 → 0 ≤ 3 jest prawdziwe, więc (0,0) leży w półpłaszczyźnie.',
    ),
    fi: L(
      'Substitute x=0, y=0 into the inequality and check the truth value.',
      'Sustituye x=0, y=0 en la desigualdad y verifica el valor de verdad.',
      'Podstaw x=0, y=0 do nierówności i sprawdź wartość logiczną.',
    ),
    tags: ['arith_error', 'boundary_confusion'],
    stds: l25Bound,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.systems.inequalities.test',
    diff: 0.4,
    b: -0.45,
    prompt: L(
      'System: y ≥ 1 and x ≤ 2. Is (3, 2) a solution?',
      'Sistema: y ≥ 1 y x ≤ 2. ¿Es (3, 2) solución?',
      'Układ: y ≥ 1 i x ≤ 2. Czy (3, 2) jest rozwiązaniem?',
    ),
    math: '\\begin{cases} y\\ge 1 \\\\ x\\le 2 \\end{cases}\\ (3,2)',
    choices0: mathChoicesL(
      ['\\text{no}', '\\text{yes}', '\\text{only if =}', '\\text{maybe}'],
      ['\\text{falso}', '\\text{sí}', '\\text{solo si =}', '\\text{quizá}'],
      ['\\text{nie}', '\\text{tak}', '\\text{tylko gdy =}', '\\text{może}'],
    ),
    fc: L(
      'y=2 ≥ 1 is true, but x=3 ≤ 2 is false — fails the system.',
      'y=2 ≥ 1 es cierto, pero x=3 ≤ 2 es falso — falla el sistema.',
      'y=2 ≥ 1 jest prawdziwe, ale x=3 ≤ 2 jest fałszywe — układ nie.',
    ),
    fi: L(
      'Both inequalities must hold; check x ≤ 2 carefully.',
      'Ambas desigualdades deben cumplirse; revisa x ≤ 2 con cuidado.',
      'Obie nierówności muszą zachodzić; uważnie sprawdź x ≤ 2.',
    ),
    tags: ['checked_one_only', 'sign_error'],
    stds: l25Test,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.systems.inequalities.region',
    diff: 0.42,
    b: -0.35,
    prompt: L(
      'Which describes the solution set of y ≥ 0 and x ≥ 0?',
      '¿Qué describe el conjunto solución de y ≥ 0 y x ≥ 0?',
      'Co opisuje zbiór rozwiązań y ≥ 0 i x ≥ 0?',
    ),
    math: '\\begin{cases} y\\ge 0 \\\\ x\\ge 0 \\end{cases}',
    choices0: mathChoicesL(
      ['\\text{1st quadrant + axes}', '\\text{3rd only}', '\\text{all plane}', '\\text{empty}'],
      ['\\text{1.er cuadrante + ejes}', '\\text{solo 3.er}', '\\text{todo el plano}', '\\text{vacío}'],
      ['\\text{I ćwiartka + osie}', '\\text{tylko III}', '\\text{cała płaszczyzna}', '\\text{pusty}'],
    ),
    fc: L(
      'Nonnegative x and y include the first quadrant and the nonnegative axes.',
      'x e y no negativos incluyen el primer cuadrante y los ejes no negativos.',
      'Nieuujemne x i y obejmują pierwszą ćwiartkę i nieujemne osie.',
    ),
    fi: L(
      'x ≥ 0 and y ≥ 0 is the closed first quadrant (including axes).',
      'x ≥ 0 e y ≥ 0 es el primer cuadrante cerrado (incluyendo ejes).',
      'x ≥ 0 i y ≥ 0 to domknięta pierwsza ćwiartka (z osiami).',
    ),
    tags: ['wrong_quadrant', 'open_vs_closed'],
    stds: l25Reg,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.45,
    b: -0.25,
    prompt: L(
      'For 2x + y < 4 rewritten as y < −2x + 4, shade…',
      'Para 2x + y < 4 escrito como y < −2x + 4, sombrea…',
      'Dla 2x + y < 4 zapisanej jako y < −2x + 4 zacieniaj…',
    ),
    math: 'y<-2x+4',
    choices0: mathChoicesL(
      ['\\text{below the line}', '\\text{above the line}', '\\text{on the line}', '\\text{nowhere}'],
      ['\\text{bajo la recta}', '\\text{sobre la recta}', '\\text{en la recta}', '\\text{ningún lado}'],
      ['\\text{pod prostą}', '\\text{nad prostą}', '\\text{na prostej}', '\\text{nigdzie}'],
    ),
    fc: L(
      'y < (line) means points with smaller y — below the dashed line.',
      'y < (recta) significa puntos con y menor — debajo de la discontinua.',
      'y < (prosta) oznacza punkty z mniejszym y — pod przerywaną.',
    ),
    fi: L(
      'When solved for y, the inequality direction tells above vs below.',
      'Al despejar y, el sentido de la desigualdad indica arriba o abajo.',
      'Po rozwiązaniu względem y kierunek nierówności mówi nad lub pod.',
    ),
    tags: ['above_vs_below', 'forgot_solve_y'],
    stds: l25Bound,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.systems.inequalities.test',
    diff: 0.48,
    b: -0.15,
    prompt: L(
      'System: x + y ≤ 5 and y ≥ x. Is (2, 2) a solution?',
      'Sistema: x + y ≤ 5 y y ≥ x. ¿Es (2, 2) solución?',
      'Układ: x + y ≤ 5 i y ≥ x. Czy (2, 2) jest rozwiązaniem?',
    ),
    math: '\\begin{cases} x+y\\le 5 \\\\ y\\ge x \\end{cases}\\ (2,2)',
    choices0: mathChoicesL(
      ['\\text{yes}', '\\text{no}', '\\text{boundary only}', '\\text{need graph}'],
      ['\\text{sí}', '\\text{falso}', '\\text{solo frontera}', '\\text{falta gráfica}'],
      ['\\text{tak}', '\\text{nie}', '\\text{tylko brzeg}', '\\text{potrzeba wykresu}'],
    ),
    fc: L(
      '2+2=4 ≤ 5 and 2 ≥ 2 both true — (2,2) is in the region.',
      '2+2=4 ≤ 5 y 2 ≥ 2 ambas ciertas — (2,2) está en la región.',
      '2+2=4 ≤ 5 i 2 ≥ 2 obie prawdziwe — (2,2) jest w obszarze.',
    ),
    fi: L(
      'Check both: sum ≤ 5 and y compared with x.',
      'Verifica ambas: suma ≤ 5 e y comparado con x.',
      'Sprawdź obie: suma ≤ 5 oraz y względem x.',
    ),
    tags: ['arith_error', 'equality_excluded'],
    stds: l25Test,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.5,
    b: 0.0,
    prompt: L(
      'Which inequality has a solid boundary and shade above y = −x?',
      '¿Qué desigualdad tiene frontera continua y sombreado sobre y = −x?',
      'Która nierówność ma ciągłą granicę i zacienienie nad y = −x?',
    ),
    math: 'y\\,?\\,-x',
    choices0: mathChoices('y \\ge -x', 'y > -x', 'y < -x', 'y \\le -x'),
    fc: L(
      '≥ includes the line (solid) and above means greater y.',
      '≥ incluye la recta (continua) y “sobre” significa y mayor.',
      '≥ obejmuje prostą (ciągła), a „nad” oznacza większe y.',
    ),
    fi: L(
      'Solid ↔ ≤/≥; above ↔ y greater than the line expression.',
      'Continua ↔ ≤/≥; sobre ↔ y mayor que la expresión de la recta.',
      'Ciągła ↔ ≤/≥; nad ↔ y większe niż wyrażenie prostej.',
    ),
    tags: ['strict_vs_closed', 'above_vs_below'],
    stds: l25Bound,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.systems.inequalities.test',
    diff: 0.52,
    b: 0.1,
    prompt: L(
      'How many of {(0,0),(1,3),(4,0)} satisfy y ≥ 2x and x ≥ 0?',
      '¿Cuántos de {(0,0),(1,3),(4,0)} cumplen y ≥ 2x y x ≥ 0?',
      'Ile z {(0,0),(1,3),(4,0)} spełnia y ≥ 2x i x ≥ 0?',
    ),
    math: '\\{(0,0),(1,3),(4,0)\\}',
    choices0: mathChoices('2', '1', '3', '0'),
    fc: L(
      '(0,0): yes. (1,3): 3≥2 yes. (4,0): 0≥8 no. Count = 2.',
      '(0,0): sí. (1,3): 3≥2 sí. (4,0): 0≥8 no. Total = 2.',
      '(0,0): tak. (1,3): 3≥2 tak. (4,0): 0≥8 nie. Liczba = 2.',
    ),
    fi: L(
      'Test each ordered pair in both inequalities.',
      'Prueba cada par ordenado en ambas desigualdades.',
      'Sprawdź każdą parę w obu nierównościach.',
    ),
    tags: ['missed_point', 'arith_error'],
    stds: l25Test,
    num: 2,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.systems.inequalities.region',
    diff: 0.55,
    b: 0.2,
    prompt: L(
      'If two half-planes do not overlap, the system solution set is…',
      'Si dos semplanos no se solapan, el conjunto solución del sistema es…',
      'Jeśli dwie półpłaszczyzny nie mają części wspólnej, zbiór rozwiązań układu jest…',
    ),
    math: 'H_1\\cap H_2=\\varnothing',
    choices0: mathChoicesL(
      ['\\text{empty}', '\\text{a line}', '\\text{all plane}', '\\text{one point}'],
      ['\\text{vacío}', '\\text{una recta}', '\\text{todo el plano}', '\\text{un punto}'],
      ['\\text{pusty}', '\\text{prosta}', '\\text{cała płaszczyzna}', '\\text{jeden punkt}'],
    ),
    fc: L(
      'No common points means the intersection — the solution — is empty.',
      'Sin puntos comunes, la intersección — la solución — es vacía.',
      'Brak wspólnych punktów oznacza, że przecięcie — rozwiązanie — jest puste.',
    ),
    fi: L(
      'A system needs points that lie in every inequality’s half-plane.',
      'Un sistema necesita puntos en el semplano de cada desigualdad.',
      'Układ wymaga punktów leżących w półpłaszczyźnie każdej nierówności.',
    ),
    tags: ['confused_with_parallel_eq', 'union_vs_intersection'],
    stds: l25Reg,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.55,
    b: 0.25,
    prompt: L(
      'Point (1, 5) is on the line y = 3x + 2. For y > 3x + 2, is (1,5) a solution?',
      'El punto (1, 5) está en y = 3x + 2. Para y > 3x + 2, ¿es (1,5) solución?',
      'Punkt (1, 5) leży na y = 3x + 2. Dla y > 3x + 2, czy (1,5) jest rozwiązaniem?',
    ),
    math: '(1,5)\\in y=3x+2;\\ y>3x+2?',
    choices0: mathChoicesL(
      ['\\text{no}', '\\text{yes}', '\\text{only if solid}', '\\text{always}'],
      ['\\text{falso}', '\\text{sí}', '\\text{solo si continua}', '\\text{siempre}'],
      ['\\text{nie}', '\\text{tak}', '\\text{tylko gdy ciągła}', '\\text{zawsze}'],
    ),
    fc: L(
      'On the boundary: 5 = 3(1)+2, so y > 3x+2 fails (needs strict greater).',
      'En la frontera: 5 = 3(1)+2, así y > 3x+2 falla (exige estrictamente mayor).',
      'Na brzegu: 5 = 3(1)+2, więc y > 3x+2 nie zachodzi (wymaga ostrego >).',
    ),
    fi: L(
      'Strict > excludes the boundary line itself.',
      'El > estricto excluye la propia recta frontera.',
      'Ostre > wyklucza samą prostą brzegową.',
    ),
    tags: ['boundary_included', 'strict_vs_closed'],
    stds: l25Bound,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.systems.inequalities.test',
    diff: 0.58,
    b: 0.35,
    prompt: L(
      'System: y ≤ −x + 6 and y ≥ 2. Which point is NOT a solution?',
      'Sistema: y ≤ −x + 6 y y ≥ 2. ¿Qué punto NO es solución?',
      'Układ: y ≤ −x + 6 i y ≥ 2. Który punkt NIE jest rozwiązaniem?',
    ),
    math: '\\begin{cases} y\\le -x+6 \\\\ y\\ge 2 \\end{cases}',
    choices0: mathChoices('(5,1)', '(2,3)', '(0,4)', '(1,2)'),
    fc: L(
      '(5,1): y=1 fails y ≥ 2. The others satisfy both.',
      '(5,1): y=1 falla y ≥ 2. Los otros cumplen ambas.',
      '(5,1): y=1 nie spełnia y ≥ 2. Pozostałe spełniają obie.',
    ),
    fi: L(
      'Reject any point with y < 2 or above the line y = −x+6.',
      'Rechaza puntos con y < 2 o por encima de y = −x+6.',
      'Odrzuć punkty z y < 2 lub nad prostą y = −x+6.',
    ),
    tags: ['picked_valid', 'arith_error'],
    stds: l25Test,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.systems.inequalities.region',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Constraints: x ≥ 0, y ≥ 0, x + y ≤ 4. The feasible region is a…',
      'Restricciones: x ≥ 0, y ≥ 0, x + y ≤ 4. La región factible es un…',
      'Ograniczenia: x ≥ 0, y ≥ 0, x + y ≤ 4. Obszar dopuszczalny to…',
    ),
    math: 'x\\ge 0,\\ y\\ge 0,\\ x+y\\le 4',
    choices0: mathChoicesL(
      ['\\text{triangle}', '\\text{infinite strip}', '\\text{circle}', '\\text{empty}'],
      ['\\text{triángulo}', '\\text{franja infinita}', '\\text{círculo}', '\\text{vacío}'],
      ['\\text{trójkąt}', '\\text{nieskończony pas}', '\\text{koło}', '\\text{pusty}'],
    ),
    fc: L(
      'Axes and the line x+y=4 cut a right triangle in the first quadrant.',
      'Los ejes y la recta x+y=4 cortan un triángulo rectángulo en el primer cuadrante.',
      'Osie i prosta x+y=4 wycinają trójkąt prostokątny w pierwszej ćwiartce.',
    ),
    fi: L(
      'Three linear boundaries meeting in the closed first quadrant form a triangle.',
      'Tres fronteras lineales que se encuentran en el primer cuadrante cerrado forman un triángulo.',
      'Trzy liniowe brzegi w domkniętej pierwszej ćwiartce tworzą trójkąt.',
    ),
    tags: ['wrong_shape', 'forgot_nonneg'],
    stds: l25Reg,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.62,
    b: 0.5,
    prompt: L(
      'Rewrite −3x + y ≥ 6 in slope-intercept form for graphing.',
      'Reescribe −3x + y ≥ 6 en forma pendiente-intersección para graficar.',
      'Zapisz −3x + y ≥ 6 w postaci kierunkowej do rysowania.',
    ),
    math: '-3x+y\\ge 6',
    choices0: mathChoices('y \\ge 3x + 6', 'y \\le 3x + 6', 'y \\ge -3x + 6', 'y \\ge 3x - 6'),
    fc: L(
      'Add 3x: y ≥ 3x + 6. Inequality direction stays the same.',
      'Suma 3x: y ≥ 3x + 6. El sentido de la desigualdad no cambia.',
      'Dodaj 3x: y ≥ 3x + 6. Kierunek nierówności się nie zmienia.',
    ),
    fi: L(
      'Isolate y by adding 3x to both sides; do not flip when adding.',
      'Despeja y sumando 3x a ambos lados; no inviertas al sumar.',
      'Wyodrębnij y dodając 3x do obu stron; przy dodawaniu nie odwracaj.',
    ),
    tags: ['flipped_wrong', 'sign_error'],
    stds: l25Bound,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.systems.inequalities.test',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'System: y > x − 1 and y < 2x + 1. Is (0, 0) a solution?',
      'Sistema: y > x − 1 y y < 2x + 1. ¿Es (0, 0) solución?',
      'Układ: y > x − 1 i y < 2x + 1. Czy (0, 0) jest rozwiązaniem?',
    ),
    math: '\\begin{cases} y>x-1 \\\\ y<2x+1 \\end{cases}\\ (0,0)',
    choices0: mathChoicesL(
      ['\\text{yes}', '\\text{no}', '\\text{on both lines}', '\\text{only first}'],
      ['\\text{sí}', '\\text{falso}', '\\text{en ambas rectas}', '\\text{solo la 1.}'],
      ['\\text{tak}', '\\text{nie}', '\\text{na obu prostych}', '\\text{tylko pierwsza}'],
    ),
    fc: L(
      '0 > −1 true and 0 < 1 true — interior point of the strip.',
      '0 > −1 cierto y 0 < 1 cierto — punto interior de la franja.',
      '0 > −1 prawdziwe i 0 < 1 prawdziwe — punkt wewnątrz pasa.',
    ),
    fi: L(
      'Substitute (0,0) into both strict inequalities.',
      'Sustituye (0,0) en ambas desigualdades estrictas.',
      'Podstaw (0,0) do obu ostrych nierówności.',
    ),
    tags: ['checked_one_only', 'boundary_confusion'],
    stds: l25Test,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.systems.inequalities.region',
    diff: 0.68,
    b: 0.65,
    prompt: L(
      'y ≥ 2 and y ≤ 2. The solution region is…',
      'y ≥ 2 y y ≤ 2. La región solución es…',
      'y ≥ 2 i y ≤ 2. Obszar rozwiązań to…',
    ),
    math: '\\begin{cases} y\\ge 2 \\\\ y\\le 2 \\end{cases}',
    choices0: mathChoicesL(
      ['\\text{the line }y=2', '\\text{above }y=2', '\\text{empty}', '\\text{all plane}'],
      ['\\text{la recta }y=2', '\\text{sobre }y=2', '\\text{vacío}', '\\text{todo el plano}'],
      ['\\text{prosta }y=2', '\\text{nad }y=2', '\\text{pusty}', '\\text{cała płaszczyzna}'],
    ),
    fc: L(
      'Both force y = 2: the intersection is the horizontal line y = 2.',
      'Ambas fuerzan y = 2: la intersección es la recta horizontal y = 2.',
      'Obie wymuszają y = 2: przecięcie to pozioma prosta y = 2.',
    ),
    fi: L(
      'y ≥ 2 and y ≤ 2 together mean exactly y = 2.',
      'y ≥ 2 e y ≤ 2 juntas significan exactamente y = 2.',
      'y ≥ 2 i y ≤ 2 razem oznaczają dokładnie y = 2.',
    ),
    tags: ['thought_empty', 'thought_halfplane'],
    stds: l25Reg,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.inequality.two.var',
    diff: 0.7,
    b: 0.75,
    prompt: L(
      'When multiplying an inequality by −1 to isolate y, you must…',
      'Al multiplicar una desigualdad por −1 para despejar y, debes…',
      'Mnożąc nierówność przez −1, by wyodrębnić y, musisz…',
    ),
    math: '-y < 2x \\Rightarrow ?',
    choices0: mathChoicesL(
      ['\\text{flip the sign}', '\\text{keep the sign}', '\\text{drop y}', '\\text{square both}'],
      ['\\text{invertir el sentido}', '\\text{mantener el sentido}', '\\text{quitar y}', '\\text{cuadrar}'],
      ['\\text{odwrócić znak}', '\\text{zostawić znak}', '\\text{usunąć y}', '\\text{podnieść do kwadratu}'],
    ),
    fc: L(
      'Multiplying/dividing by a negative reverses the inequality symbol.',
      'Multiplicar/dividir por un negativo invierte el símbolo de desigualdad.',
      'Mnożenie/dzielenie przez ujemną odwraca znak nierówności.',
    ),
    fi: L(
      '−y < 2x → multiply by −1 → y > −2x.',
      '−y < 2x → multiplica por −1 → y > −2x.',
      '−y < 2x → pomnóż przez −1 → y > −2x.',
    ),
    tags: ['forgot_flip', 'sign_error'],
    stds: l25Bound,
  },
]

/* ═══════════════════════════════════════
   LESSON 26 — Scatter, correlation, fit
   ═══════════════════════════════════════ */
const l26Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.scatter.interpret',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'A scatter plot shows many points rising left→right. What pattern is that?',
      'Un diagrama de dispersión muestra muchos puntos que suben de izq. a der. ¿Qué patrón es?',
      'Wykres rozrzutu pokazuje wiele punktów rosnących od lewej do prawej. Jaki to wzorzec?',
    ),
    math: '(x\\uparrow,\\ y\\uparrow)',
    choices0: mathChoicesL(
      ['\\text{positive assoc.}', '\\text{negative assoc.}', '\\text{none}', '\\text{circle}'],
      ['\\text{asoc. positiva}', '\\text{asoc. negativa}', '\\text{ninguna}', '\\text{círculo}'],
      ['\\text{związek +}', '\\text{związek −}', '\\text{brak}', '\\text{okrąg}'],
    ),
    fc: L(
      'As x increases, y tends to increase — positive association.',
      'Al aumentar x, y tiende a aumentar — asociación positiva.',
      'Gdy x rośnie, y zwykle rośnie — związek dodatni.',
    ),
    fi: L(
      'Rising cloud = positive; falling cloud = negative.',
      'Nube ascendente = positiva; descendente = negativa.',
      'Chmura rosnąca = dodatni; opadająca = ujemny.',
    ),
    tags: ['sign_flip', 'no_pattern'],
    stds: l26Sc,
  },
  {
    id: 't02',
    kp: 'kp.alg1.line.best.fit',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'A line of best fit is y = 0.5x + 2. Estimate y when x = 8.',
      'Una recta de mejor ajuste es y = 0.5x + 2. Estima y cuando x = 8.',
      'Prosta najlepszego dopasowania: y = 0.5x + 2. Oszacuj y dla x = 8.',
    ),
    math: 'y=0.5x+2,\\ x=8',
    choices0: mathChoices('6', '4', '10', '2'),
    fc: L(
      'Substitute: 0.5(8)+2 = 4+2 = 6.',
      'Sustituye: 0.5(8)+2 = 4+2 = 6.',
      'Podstaw: 0.5(8)+2 = 4+2 = 6.',
    ),
    fi: L(
      'Substitute x into the linear model: y = mx + b.',
      'Sustituye x en el modelo lineal: y = mx + b.',
      'Podstaw x do modelu liniowego: y = mx + b.',
    ),
    tags: ['used_intercept_only', 'arith_error'],
    stds: l26Fit,
    num: 6,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.correlation.direction',
    diff: 0.35,
    b: -0.6,
    prompt: L(
      'Points fall as x increases. Correlation direction is…',
      'Los puntos bajan al aumentar x. La dirección de la correlación es…',
      'Punkty opadają, gdy x rośnie. Kierunek korelacji to…',
    ),
    math: '(x\\uparrow,\\ y\\downarrow)',
    choices0: mathChoicesL(
      ['\\text{negative}', '\\text{positive}', '\\text{zero only}', '\\text{perfect +}'],
      ['\\text{negativa}', '\\text{positiva}', '\\text{solo cero}', '\\text{perfecta +}'],
      ['\\text{ujemna}', '\\text{dodatnia}', '\\text{tylko zero}', '\\text{doskonała +}'],
    ),
    fc: L(
      'Downward trend means negative association / correlation.',
      'Tendencia descendente significa asociación / correlación negativa.',
      'Trend spadkowy oznacza związek / korelację ujemną.',
    ),
    fi: L(
      'Negative: larger x paired with smaller y on average.',
      'Negativa: x mayores emparejados con y menores en promedio.',
      'Ujemna: większe x zwykle z mniejszymi y.',
    ),
    tags: ['sign_flip', 'confused_strength'],
    stds: l26Cor,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.scatter.interpret',
    diff: 0.4,
    b: -0.45,
    prompt: L(
      'One point sits far from the main cloud. That point is often called…',
      'Un punto está muy lejos de la nube principal. Ese punto suele llamarse…',
      'Jeden punkt leży daleko od głównej chmury. Taki punkt często nazywa się…',
    ),
    math: '(x^*,y^*)\\notin\\text{cloud}',
    choices0: mathChoicesL(
      ['\\text{outlier}', '\\text{median}', '\\text{mode}', '\\text{intercept}'],
      ['\\text{atípico}', '\\text{mediana}', '\\text{moda}', '\\text{intersección}'],
      ['\\text{odstający}', '\\text{mediana}', '\\text{moda}', '\\text{przecięcie}'],
    ),
    fc: L(
      'A point far from the pattern is an outlier (may pull a fit line).',
      'Un punto lejos del patrón es atípico (puede tirar de la recta de ajuste).',
      'Punkt daleko od wzorca to wartość odstająca (może ciągnąć prostą).',
    ),
    fi: L(
      'Outliers are unusual points relative to the rest of the scatter.',
      'Los atípicos son puntos inusuales respecto al resto de la dispersión.',
      'Wartości odstające to nietypowe punkty względem reszty rozrzutu.',
    ),
    tags: ['confused_center', 'ignored_outlier'],
    stds: l26Sc,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.line.best.fit',
    diff: 0.42,
    b: -0.3,
    prompt: L(
      'Fit line: y = −2x + 10. Slope means each +1 in x changes y by…',
      'Recta de ajuste: y = −2x + 10. La pendiente significa que +1 en x cambia y en…',
      'Prosta: y = −2x + 10. Nachylenie oznacza, że +1 w x zmienia y o…',
    ),
    math: 'y=-2x+10',
    choices0: mathChoices('-2', '2', '10', '-10'),
    fc: L(
      'Slope m = −2: predicted y decreases by 2 per unit increase in x.',
      'Pendiente m = −2: y predicha baja 2 por cada unidad que sube x.',
      'Nachylenie m = −2: przewidywane y spada o  i 2 na jednostkę wzrostu x.',
    ),
    fi: L(
      'In y = mx + b, m is the rate of change of the model.',
      'En y = mx + b, m es la tasa de cambio del modelo.',
      'W y = mx + b m to tempo zmiany modelu.',
    ),
    tags: ['used_intercept', 'sign_error'],
    stds: l26Fit,
    num: -2,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.correlation.direction',
    diff: 0.45,
    b: -0.2,
    prompt: L(
      'r ≈ 0.95 for a linear fit suggests the association is…',
      'r ≈ 0.95 para un ajuste lineal sugiere que la asociación es…',
      'r ≈ 0.95 dla dopasowania liniowego sugeruje, że związek jest…',
    ),
    math: 'r\\approx 0.95',
    choices0: mathChoicesL(
      ['\\text{strong +}', '\\text{strong −}', '\\text{weak +}', '\\text{none}'],
      ['\\text{fuerte +}', '\\text{fuerte −}', '\\text{débil +}', '\\text{ninguna}'],
      ['\\text{silna +}', '\\text{silna −}', '\\text{słaba +}', '\\text{brak}'],
    ),
    fc: L(
      'r near +1 means strong positive linear association.',
      'r cerca de +1 significa asociación lineal positiva fuerte.',
      'r blisko +1 oznacza silny dodatni związek liniowy.',
    ),
    fi: L(
      '|r| near 1 → strong; sign of r → direction.',
      '|r| cerca de 1 → fuerte; signo de r → dirección.',
      '|r| blisko 1 → silny; znak r → kierunek.',
    ),
    tags: ['strength_direction_swap', 'near_zero'],
    stds: l26Cor,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.scatter.interpret',
    diff: 0.48,
    b: -0.1,
    prompt: L(
      'Points form a tight cloud with no clear up/down trend. Best description?',
      'Los puntos forman una nube densa sin tendencia clara arriba/abajo. ¿Mejor descripción?',
      'Punkty tworzą zwartą chmurę bez wyraźnego trendu góra/dół. Najlepszy opis?',
    ),
    math: '\\{(x_i,y_i)\\}',
    choices0: mathChoicesL(
      ['\\text{little/no linear}', '\\text{strong +}', '\\text{strong −}', '\\text{exact line}'],
      ['\\text{poca/nula lineal}', '\\text{fuerte +}', '\\text{fuerte −}', '\\text{recta exacta}'],
      ['\\text{słaba/brak liniowej}', '\\text{silna +}', '\\text{silna −}', '\\text{dokładna prosta}'],
    ),
    fc: L(
      'No clear monotone trend suggests little or no linear association.',
      'Sin tendencia monótona clara sugiere poca o nula asociación lineal.',
      'Brak wyraźnego monotonicznego trendu sugeruje słaby lub brak związku liniowego.',
    ),
    fi: L(
      'Strong linear patterns lean clearly up or down.',
      'Los patrones lineales fuertes se inclinan claramente arriba o abajo.',
      'Silne wzorce liniowe wyraźnie wznoszą się lub opadają.',
    ),
    tags: ['forced_trend', 'confused_strength'],
    stds: l26Sc,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.line.best.fit',
    diff: 0.5,
    b: 0.0,
    prompt: L(
      'Model y = 3x − 1. Predict y at x = 5.',
      'Modelo y = 3x − 1. Predice y en x = 5.',
      'Model y = 3x − 1. Przewidź y przy x = 5.',
    ),
    math: 'y=3x-1,\\ x=5',
    choices0: mathChoices('14', '15', '16', '12'),
    fc: L(
      'Compute: 3(5)−1 = 15−1 = 14.',
      'Calcula: 3(5)−1 = 15−1 = 14.',
      'Oblicz: 3(5)−1 = 15−1 = 14.',
    ),
    fi: L(
      'Evaluate mx + b at the given x.',
      'Evalúa mx + b en el x dado.',
      'Oblicz mx + b dla danego x.',
    ),
    tags: ['forgot_subtract', 'arith_error'],
    stds: l26Fit,
    num: 14,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.correlation.direction',
    diff: 0.52,
    b: 0.1,
    prompt: L(
      'True or false: a strong correlation proves that x causes y.',
      'Verdadero o falso: una correlación fuerte prueba que x causa y.',
      'Prawda czy fałsz: silna korelacja dowodzi, że x powoduje y.',
    ),
    math: '|r|\\approx 1\\Rightarrow\\text{cause?}',
    choices0: mathChoicesL(
      ['\\text{false}', '\\text{true}', '\\text{only if }r>0', '\\text{only if }r<0'],
      ['\\text{falso}', '\\text{verdadero}', '\\text{solo si }r>0', '\\text{solo si }r<0'],
      ['\\text{fałsz}', '\\text{prawda}', '\\text{tylko gdy }r>0', '\\text{tylko gdy }r<0'],
    ),
    fc: L(
      'Correlation ≠ causation — association can arise without a causal link.',
      'Correlación ≠ causalidad — puede haber asociación sin vínculo causal.',
      'Korelacja ≠ przyczynowość — związek może istnieć bez związku przyczynowego.',
    ),
    fi: L(
      'Even |r| near 1 does not by itself prove cause.',
      'Incluso |r| cerca de 1 no prueba por sí solo la causa.',
      'Nawet |r| blisko 1 samo w sobie nie dowodzi przyczyny.',
    ),
    tags: ['causation_claim', 'direction_only'],
    stds: l26Cor,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.scatter.interpret',
    diff: 0.55,
    b: 0.2,
    prompt: L(
      'Hours studied (x) vs test score (y) show a rising cloud. Expect…',
      'Horas de estudio (x) vs puntuación (y) muestran nube ascendente. Espera…',
      'Godziny nauki (x) vs wynik (y) dają rosnącą chmurę. Oczekuj…',
    ),
    math: 'x\\uparrow,\\ y\\uparrow',
    choices0: mathChoicesL(
      ['\\text{positive assoc.}', '\\text{negative assoc.}', '\\text{r=0 exact}', '\\text{no data}'],
      ['\\text{asoc. positiva}', '\\text{asoc. negativa}', '\\text{r=0 exacto}', '\\text{sin datos}'],
      ['\\text{związek +}', '\\text{związek −}', '\\text{r=0 dokładnie}', '\\text{brak danych}'],
    ),
    fc: L(
      'Rising pattern suggests positive association between hours and score.',
      'El patrón ascendente sugiere asociación positiva entre horas y puntuación.',
      'Rosnący wzorzec sugeruje dodatni związek godzin z wynikiem.',
    ),
    fi: L(
      'Upward trend ↔ positive; downward ↔ negative.',
      'Tendencia alcista ↔ positiva; bajista ↔ negativa.',
      'Trend w górę ↔ dodatni; w dół ↔ ujemny.',
    ),
    tags: ['sign_flip', 'causation_claim'],
    stds: l26Sc,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.line.best.fit',
    diff: 0.55,
    b: 0.25,
    prompt: L(
      'Fit: y = 4x + 1. What is the y-intercept of the model?',
      'Ajuste: y = 4x + 1. ¿Cuál es la intersección con y del modelo?',
      'Dopasowanie: y = 4x + 1. Jakie jest przecięcie z osią y modelu?',
    ),
    math: 'y=4x+1',
    choices0: mathChoices('1', '4', '0', '5'),
    fc: L(
      'In y = mx + b, b = 1 is the model’s y-intercept.',
      'En y = mx + b, b = 1 es la intersección con y del modelo.',
      'W y = mx + b b = 1 to przecięcie modelu z osią y.',
    ),
    fi: L(
      'b is the constant term; m is the slope.',
      'b es el término constante; m es la pendiente.',
      'b to wyraz wolny; m to nachylenie.',
    ),
    tags: ['swapped_m_b', 'arith_error'],
    stds: l26Fit,
    num: 1,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.correlation.direction',
    diff: 0.58,
    b: 0.35,
    prompt: L(
      'Which r indicates the strongest linear association?',
      '¿Qué r indica la asociación lineal más fuerte?',
      'Które r wskazuje najsilniejszy związek liniowy?',
    ),
    math: 'r\\in\\{-0.2,\\ 0.4,\\ -0.9,\\ 0.1\\}',
    choices0: mathChoices('-0.9', '0.4', '-0.2', '0.1'),
    fc: L(
      'Strength is |r|; |−0.9| = 0.9 is largest.',
      'La fuerza es |r|; |−0.9| = 0.9 es la mayor.',
      'Siła to |r|; |−0.9| = 0.9 jest największe.',
    ),
    fi: L(
      'Compare absolute values of r, not the signed values alone.',
      'Compara valores absolutos de r, no solo los signos.',
      'Porównuj wartości bezwzględne r, nie same znaki.',
    ),
    tags: ['ignored_abs', 'picked_positive'],
    stds: l26Cor,
    num: -0.9,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.line.best.fit',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Data x from 2 to 10; fit y = x + 3. Predicting at x = 100 is…',
      'Datos x de 2 a 10; ajuste y = x + 3. Predecir en x = 100 es…',
      'Dane x od 2 do 10; dopasowanie y = x + 3. Predykcja przy x = 100 to…',
    ),
    math: 'x\\in[2,10];\\ \\hat y(100)',
    choices0: mathChoicesL(
      ['\\text{risky extrapol.}', '\\text{safe interp.}', '\\text{exact}', '\\text{impossible}'],
      ['\\text{extrap. riesgosa}', '\\text{interp. segura}', '\\text{exacta}', '\\text{imposible}'],
      ['\\text{ryzyk. ekstrapol.}', '\\text{bezpiecz. interp.}', '\\text{dokładna}', '\\text{niemożliwa}'],
    ),
    fc: L(
      'x=100 is far outside the data — extrapolation is unreliable.',
      'x=100 está muy fuera de los datos — la extrapolación es poco fiable.',
      'x=100 daleko poza danymi — ekstrapolacja jest zawodna.',
    ),
    fi: L(
      'Interpolation stays inside the observed x-range; extrapolation goes beyond.',
      'La interpolación queda dentro del rango de x; la extrapolación va más allá.',
      'Interpolacja zostaje w zakresie x; ekstrapolacja wychodzi poza.',
    ),
    tags: ['extrapolation_ok', 'thought_impossible'],
    stds: l26Fit,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.scatter.interpret',
    diff: 0.62,
    b: 0.5,
    prompt: L(
      'Two clusters appear in a scatter plot. A single straight fit may…',
      'Aparecen dos grupos en un diagrama de dispersión. Un solo ajuste recto puede…',
      'Na wykresie rozrzutu widać dwa skupiska. Jedno dopasowanie prostą może…',
    ),
    math: '2\\ \\text{grupos/clusters}',
    choices0: mathChoicesL(
      ['\\text{mislead}', '\\text{always perfect}', '\\text{force r=0}', '\\text{remove axes}'],
      ['\\text{engañar}', '\\text{siempre perfecto}', '\\text{forzar r=0}', '\\text{quitar ejes}'],
      ['\\text{mylnie}', '\\text{zawsze idealne}', '\\text{wymuszać r=0}', '\\text{usuwać osie}'],
    ),
    fc: L(
      'One line can poorly represent two separate groups — inspect structure first.',
      'Una recta puede representar mal dos grupos separados — inspecciona la estructura primero.',
      'Jedna prosta może źle reprezentować dwie grupy — najpierw zbadaj strukturę.',
    ),
    fi: L(
      'Look for subgroups before trusting a single linear summary.',
      'Busca subgrupos antes de confiar en un resumen lineal único.',
      'Szukaj podgrup zanim zaufasz jednemu liniowemu podsumowaniu.',
    ),
    tags: ['ignored_structure', 'forced_line'],
    stds: l26Sc,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.correlation.direction',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'r = −0.3 is best described as…',
      'r = −0.3 se describe mejor como…',
      'r = −0.3 najlepiej opisać jako…',
    ),
    math: 'r=-0.3',
    choices0: mathChoicesL(
      ['\\text{weak −}', '\\text{strong −}', '\\text{strong +}', '\\text{perfect}'],
      ['\\text{débil −}', '\\text{fuerte −}', '\\text{fuerte +}', '\\text{perfecta}'],
      ['\\text{słaba −}', '\\text{silna −}', '\\text{silna +}', '\\text{doskonała}'],
    ),
    fc: L(
      '|r|=0.3 is modest; the sign is negative → weak negative.',
      '|r|=0.3 es modesto; el signo es negativo → débil negativa.',
      '|r|=0.3 jest umiarkowane; znak ujemny → słaba ujemna.',
    ),
    fi: L(
      'Near ±1 is strong; near 0 is weak.',
      'Cerca de ±1 es fuerte; cerca de 0 es débil.',
      'Blisko ±1 to silna; blisko 0 to słaba.',
    ),
    tags: ['strength_overstated', 'sign_flip'],
    stds: l26Cor,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.line.best.fit',
    diff: 0.68,
    b: 0.65,
    prompt: L(
      'Fit y = 2x + 5 models cost. Slope 2 means…',
      'El ajuste y = 2x + 5 modela costo. La pendiente 2 significa…',
      'Dopasowanie y = 2x + 5 modeluje koszt. Nachylenie 2 oznacza…',
    ),
    math: 'y=2x+5',
    choices0: mathChoicesL(
      ['\\text{+2 per unit x}', '\\text{fixed cost 2}', '\\text{+5 per unit x}', '\\text{x=2}'],
      ['\\text{+2 por unidad x}', '\\text{costo fijo 2}', '\\text{+5 por unidad x}', '\\text{x=2}'],
      ['\\text{+2 na jedn. x}', '\\text{koszt stały 2}', '\\text{+5 na jedn. x}', '\\text{x=2}'],
    ),
    fc: L(
      'm=2: predicted cost rises by 2 for each additional unit of x.',
      'm=2: el costo predicho sube 2 por cada unidad adicional de x.',
      'm=2: przewidywany koszt rośnie o 2 na każdą dodatkową jednostkę x.',
    ),
    fi: L(
      'Slope is the change in y per unit change in x; intercept is the constant term.',
      'La pendiente es el cambio de y por unidad de x; la intersección es el término constante.',
      'Nachylenie to zmiana y na jednostkę x; wyraz wolny to stała.',
    ),
    tags: ['swapped_m_b', 'units_ignored'],
    stds: l26Fit,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.scatter.interpret',
    diff: 0.7,
    b: 0.75,
    prompt: L(
      'If every point lies exactly on a falling line, correlation is…',
      'Si cada punto cae exactamente en una recta descendente, la correlación es…',
      'Jeśli każdy punkt leży dokładnie na opadającej prostej, korelacja jest…',
    ),
    math: 'r\\to ?',
    choices0: mathChoices('-1', '1', '0', '0.5'),
    fc: L(
      'Perfect negative linear fit means r = −1.',
      'Ajuste lineal negativo perfecto significa r = −1.',
      'Doskonałe ujemne dopasowanie liniowe oznacza r = −1.',
    ),
    fi: L(
      'Perfect positive → r=1; perfect negative → r=−1; none → near 0.',
      'Positiva perfecta → r=1; negativa perfecta → r=−1; nula → cerca de 0.',
      'Doskonała dodatnia → r=1; doskonała ujemna → r=−1; brak → blisko 0.',
    ),
    tags: ['sign_flip', 'thought_zero'],
    stds: l26Sc,
    num: -1,
  },
]

/* ═══════════════════════════════════════
   LESSON 27 — Modeling / multi-step apps
   ═══════════════════════════════════════ */
const l27Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.modeling.write',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'A taxi charges $3 plus $2 per mile. Cost C after m miles is…',
      'Un taxi cobra $3 más $2 por milla. El costo C tras m millas es…',
      'Taksówka bierze 3$ plus 2$ za milę. Koszt C po m milach to…',
    ),
    math: 'C(m)=?',
    choices0: mathChoices('C=2m+3', 'C=3m+2', 'C=2m-3', 'C=m+5'),
    fc: L(
      'Fixed $3 plus $2 each mile: C = 2m + 3.',
      'Fijo $3 más $2 por milla: C = 2m + 3.',
      'Stałe 3$ plus 2$ za milę: C = 2m + 3.',
    ),
    fi: L(
      'Constant fee is the intercept; per-mile rate is the slope.',
      'La tarifa fija es la intersección; la tarifa por milla es la pendiente.',
      'Stała opłata to wyraz wolny; stawka za milę to nachylenie.',
    ),
    tags: ['swapped_rate_fee', 'sign_error'],
    stds: l27W,
  },
  {
    id: 't02',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'Solve 3x + 5 = 20 for a ticket budget model. What is x?',
      'Resuelve 3x + 5 = 20 para un modelo de presupuesto. ¿Cuánto es x?',
      'Rozwiąż 3x + 5 = 20 dla modelu budżetu. Ile wynosi x?',
    ),
    math: '3x+5=20',
    choices0: mathChoices('5', '4', '6', '15'),
    fc: L(
      'Subtract 5: 3x = 15 → x = 5.',
      'Resta 5: 3x = 15 → x = 5.',
      'Odejmij 5: 3x = 15 → x = 5.',
    ),
    fi: L(
      'Subtract 5, then divide by 3.',
      'Resta 5 y luego divide entre 3.',
      'Odejmij 5, potem podziel przez 3.',
    ),
    tags: ['forgot_subtract', 'divided_wrong'],
    stds: l27M,
    num: 5,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.modeling.choose',
    diff: 0.35,
    b: -0.6,
    prompt: L(
      'You need at least 12 points and at most 40 minutes. Best model type?',
      'Necesitas al menos 12 puntos y como máximo 40 minutos. ¿Mejor tipo de modelo?',
      'Potrzebujesz co najmniej 12 punktów i co najwyżej 40 minut. Najlepszy typ modelu?',
    ),
    math: 'p\\ge 12,\\ t\\le 40',
    choices0: mathChoicesL(
      ['\\text{inequalities}', '\\text{one equality}', '\\text{only graph}', '\\text{ratio only}'],
      ['\\text{desigualdades}', '\\text{una igualdad}', '\\text{solo gráfica}', '\\text{solo razón}'],
      ['\\text{nierówności}', '\\text{jedna równość}', '\\text{tylko wykres}', '\\text{tylko stosunek}'],
    ),
    fc: L(
      '“At least” and “at most” are inequality constraints.',
      '“Al menos” y “como máximo” son restricciones de desigualdad.',
      '„Co najmniej” i „co najwyżej” to ograniczenia nierównościowe.',
    ),
    fi: L(
      'Equality alone cannot capture ≥ / ≤ requirements.',
      'La igualdad sola no captura requisitos ≥ / ≤.',
      'Sama równość nie oddaje wymagań ≥ / ≤.',
    ),
    tags: ['used_equality', 'ignored_constraint'],
    stds: l27C,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.modeling.write',
    diff: 0.4,
    b: -0.45,
    prompt: L(
      'Adult tickets $8, child $5. Total $46 for a+c tickets. Equation?',
      'Entradas adulto $8, niño $5. Total $46 por a+c entradas. ¿Ecuación?',
      'Bilet dorosły 8$, dziecko 5$. Suma 46$ za a+c biletów. Równanie?',
    ),
    math: '8a+5c=46',
    choices0: mathChoices('8a+5c=46', '8a+5c=a+c', 'a+c=46', '8a-5c=46'),
    fc: L(
      'Value equation: 8a + 5c = 46.',
      'Ecuación de valor: 8a + 5c = 46.',
      'Równanie wartości: 8a + 5c = 46.',
    ),
    fi: L(
      'Money totals use price × count for each type, summed.',
      'Los totales de dinero usan precio × cantidad de cada tipo, sumados.',
      'Sumy pieniędzy: cena × liczba każdego typu, zsumowane.',
    ),
    tags: ['count_as_value', 'sign_error'],
    stds: l27W,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.42,
    b: -0.3,
    prompt: L(
      'Phone plan: $20 + $0.10 per text. Cost is $32. How many texts?',
      'Plan: $20 + $0.10 por mensaje. El costo es $32. ¿Cuántos mensajes?',
      'Plan: 20$ + 0,10$ za SMS. Koszt 32$. Ile SMS-ów?',
    ),
    math: '20+0.10t=32',
    choices0: mathChoices('120', '12', '320', '52'),
    fc: L(
      'After removing the fee: 0.10t = 12 → t = 120.',
      'Tras quitar la tarifa fija: 0.10t = 12 → t = 120.',
      'Po odjęciu opłaty stałej: 0.10t = 12 → t = 120.',
    ),
    fi: L(
      'Subtract 20, then divide by 0.10.',
      'Resta 20 y divide entre 0.10.',
      'Odejmij 20, potem podziel przez 0.10.',
    ),
    tags: ['forgot_fee', 'decimal_error'],
    stds: l27M,
    num: 120,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.modeling.choose',
    diff: 0.45,
    b: -0.2,
    prompt: L(
      'Two unknowns linked by two independent facts. Prefer…',
      'Dos desconocidas ligadas por dos hechos independientes. Prefiere…',
      'Dwie niewiadome związane dwoma niezależnymi faktami. Preferuj…',
    ),
    math: '2\\ \\text{var},\\ 2\\ \\text{eq}',
    choices0: mathChoicesL(
      ['\\text{a system}', '\\text{one expression}', '\\text{only inequality}', '\\text{scatter only}'],
      ['\\text{un sistema}', '\\text{una expresión}', '\\text{solo desigualdad}', '\\text{solo dispersión}'],
      ['\\text{układ}', '\\text{jedno wyrażenie}', '\\text{tylko nierówność}', '\\text{tylko rozrzut}'],
    ),
    fc: L(
      'Two independent constraints on two variables → a system of equations.',
      'Dos restricciones independientes en dos variables → un sistema de ecuaciones.',
      'Dwa niezależne ograniczenia na dwie zmienne → układ równań.',
    ),
    fi: L(
      'One equation alone usually leaves a free variable.',
      'Una sola ecuación suele dejar una variable libre.',
      'Jedno równanie zwykle zostawia wolną zmienną.',
    ),
    tags: ['one_eq_only', 'forced_inequality'],
    stds: l27C,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.48,
    b: -0.1,
    prompt: L(
      'Rectangle: length = w+3, perimeter 30. Find width w.',
      'Rectángulo: largo = w+3, perímetro 30. Halla el ancho w.',
      'Prostokąt: długość = w+3, obwód 30. Znajdź szerokość w.',
    ),
    math: '2(w+(w+3))=30',
    choices0: mathChoices('6', '7', '9', '12'),
    fc: L(
      'Perimeter: 2(2w+3)=30 → 2w+3=15 → w=6.',
      'Perímetro: 2(2w+3)=30 → 2w+3=15 → w=6.',
      'Obwód: 2(2w+3)=30 → 2w+3=15 → w=6.',
    ),
    fi: L(
      'Perimeter is 2(L+W); substitute L = w+3.',
      'El perímetro es 2(L+W); sustituye L = w+3.',
      'Obwód to 2(L+W); podstaw L = w+3.',
    ),
    tags: ['used_area', 'forgot_times_2'],
    stds: l27M,
    num: 6,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.modeling.write',
    diff: 0.5,
    b: 0.0,
    prompt: L(
      'Savings S starts at 40 and grows by 15 each week w. Model?',
      'El ahorro S empieza en 40 y crece 15 cada semana w. ¿Modelo?',
      'Oszczędności S startują od 40 i rosną o 15 co tydzień w. Model?',
    ),
    math: 'S(w)=?',
    choices0: mathChoices('S=15w+40', 'S=40w+15', 'S=15w-40', 'S=w+55'),
    fc: L(
      'Initial 40 + 15 per week: S = 15w + 40.',
      'Inicial 40 + 15 por semana: S = 15w + 40.',
      'Początkowe 40 + 15 na tydzień: S = 15w + 40.',
    ),
    fi: L(
      'Starting amount is the intercept; weekly growth is the slope.',
      'La cantidad inicial es la intersección; el crecimiento semanal es la pendiente.',
      'Kwota początkowa to wyraz wolny; tygodniowy wzrost to nachylenie.',
    ),
    tags: ['swapped_rate_fee', 'sign_error'],
    stds: l27W,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.52,
    b: 0.1,
    prompt: L(
      'Mixture: 2 lb of $4 coffee with 3 lb of $7 coffee. Cost per lb of mix?',
      'Mezcla: 2 lb de café a $4 con 3 lb a $7. ¿Costo por lb de la mezcla?',
      'Mieszanka: 2 lb kawy po 4$ z 3 lb po 7$. Koszt na lb mieszanki?',
    ),
    math: '\\frac{2\\cdot 4+3\\cdot 7}{2+3}',
    choices0: mathChoices('5.8', '5.5', '6', '11'),
    fc: L(
      'Total cost 8+21=29; total mass 5; 29/5 = 5.8.',
      'Costo total 8+21=29; masa total 5; 29/5 = 5.8.',
      'Koszt łączny 8+21=29; masa 5; 29/5 = 5.8.',
    ),
    fi: L(
      'Weighted average: (sum of value)/(sum of mass).',
      'Promedio ponderado: (suma de valor)/(suma de masa).',
      'Średnia ważona: (suma wartości)/(suma masy).',
    ),
    tags: ['averaged_prices', 'forgot_weights'],
    stds: l27M,
    num: 5.8,
    tol: 0.05,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.modeling.choose',
    diff: 0.55,
    b: 0.2,
    prompt: L(
      'Fence length fixed; maximize enclosed rectangular area. This is primarily…',
      'Longitud de cerca fija; maximizar área rectangular. Esto es principalmente…',
      'Stała długość ogrodzenia; maksymalizacja prostokątnego pola. To głównie…',
    ),
    math: 'P=\\text{const},\\ A\\to\\max',
    choices0: mathChoicesL(
      ['\\text{optimization model}', '\\text{scatter fit}', '\\text{absolute value}', '\\text{radical only}'],
      ['\\text{modelo de optimización}', '\\text{ajuste de dispersión}', '\\text{valor absoluto}', '\\text{solo radical}'],
      ['\\text{model optymalizacji}', '\\text{dopasowanie rozrzutu}', '\\text{wartość bezwzględna}', '\\text{tylko pierwiastek}'],
    ),
    fc: L(
      'A fixed perimeter with max area is a classic optimization/modeling setup.',
      'Perímetro fijo con área máxima es un planteo clásico de optimización/modelado.',
      'Stały obwód i max pole to klasyczny układ optymalizacji/modelowania.',
    ),
    fi: L(
      'You write a relation, then find an extreme value under a constraint.',
      'Escribes una relación y luego hallas un extremo bajo una restricción.',
      'Zapisujesz zależność, potem szukasz ekstremum przy ograniczeniu.',
    ),
    tags: ['wrong_tool', 'ignored_constraint'],
    stds: l27C,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.modeling.write',
    diff: 0.55,
    b: 0.25,
    prompt: L(
      'Boat speed in still water b; current 3. Downstream rate is…',
      'Velocidad del bote en agua quieta b; corriente 3. La tasa río abajo es…',
      'Prędkość łodzi w stojącej wodzie b; prąd 3. Tempo z prądem to…',
    ),
    math: 'v_{down}=?',
    choices0: mathChoices('b+3', 'b-3', '3b', 'b/3'),
    fc: L(
      'Current adds to still-water speed downstream: b + 3.',
      'La corriente se suma a la velocidad río abajo: b + 3.',
      'Prąd dodaje się do prędkości z prądem: b + 3.',
    ),
    fi: L(
      'Downstream: add current; upstream: subtract current.',
      'Río abajo: suma la corriente; río arriba: réstala.',
      'Z prądem: dodaj prąd; pod prąd: odejmij prąd.',
    ),
    tags: ['upstream_down', 'multiplied'],
    stds: l27W,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.58,
    b: 0.35,
    prompt: L(
      '2(x − 4) = 3x + 1. Solve for x in a cost-balance model.',
      '2(x − 4) = 3x + 1. Resuelve x en un modelo de balance de costos.',
      '2(x − 4) = 3x + 1. Rozwiąż x w modelu bilansu kosztów.',
    ),
    math: '2(x-4)=3x+1',
    choices0: mathChoices('-9', '9', '-7', '7'),
    fc: L(
      'Distribute then collect: 2x − 8 = 3x + 1 → x = −9.',
      'Distribuye y reúne: 2x − 8 = 3x + 1 → x = −9.',
      'Rozdziel i zbierz: 2x − 8 = 3x + 1 → x = −9.',
    ),
    fi: L(
      'Distribute, collect like terms, isolate x.',
      'Distribuye, reúne términos semejantes, despeja x.',
      'Rozdziel, zbierz wyrazy podobne, wyodrębnij x.',
    ),
    tags: ['distribute_error', 'sign_error'],
    stds: l27M,
    num: -9,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.modeling.choose',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'A story gives “twice a number plus 7 is 19.” Best first step?',
      'Una historia dice “el doble de un número más 7 es 19.” ¿Mejor primer paso?',
      'Opowieść: „podwojona liczba plus 7 to 19.” Najlepszy pierwszy krok?',
    ),
    math: '2n+7=19',
    choices0: mathChoicesL(
      ['\\text{write equation}', '\\text{guess only}', '\\text{draw scatter}', '\\text{ignore 7}'],
      ['\\text{escribir ecuación}', '\\text{solo adivinar}', '\\text{dibujar dispersión}', '\\text{ignorar 7}'],
      ['\\text{zapisać równanie}', '\\text{tylko zgadywać}', '\\text{rysować rozrzut}', '\\text{ignorować 7}'],
    ),
    fc: L(
      'Translate words into 2n + 7 = 19, then solve.',
      'Traduce palabras a 2n + 7 = 19 y luego resuelve.',
      'Przetłumacz słowa na 2n + 7 = 19, potem rozwiąż.',
    ),
    fi: L(
      'Modeling starts by writing a precise algebraic statement.',
      'El modelado empieza escribiendo un enunciado algebraico preciso.',
      'Modelowanie zaczyna się od precyzyjnego zapisu algebraicznego.',
    ),
    tags: ['skipped_model', 'wrong_tool'],
    stds: l27C,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.62,
    b: 0.5,
    prompt: L(
      'Car rents for $40/day + $0.25/mi. Two days, 80 mi. Total cost?',
      'Auto: $40/día + $0.25/mi. Dos días, 80 mi. ¿Costo total?',
      'Auto: 40$/dzień + 0,25$/mi. Dwa dni, 80 mi. Całkowity koszt?',
    ),
    math: '2\\cdot 40+0.25\\cdot 80',
    choices0: mathChoices('100', '80', '120', '90'),
    fc: L(
      'Days: 80. Miles: 20. Total 100.',
      'Días: 80. Millas: 20. Total 100.',
      'Dni: 80. Mile: 20. Razem 100.',
    ),
    fi: L(
      'Compute daily fee × days plus mileage fee × miles.',
      'Calcula tarifa diaria × días más tarifa por milla × millas.',
      'Policz opłatę dzienną × dni plus opłatę za milę × mile.',
    ),
    tags: ['missed_days', 'arith_error'],
    stds: l27M,
    num: 100,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.modeling.write',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Inequality: spend at most $50 on items costing $x each, buying n items.',
      'Desigualdad: gastar a lo sumo $50 en artículos de $x cada uno, comprando n.',
      'Nierówność: wydać co najwyżej 50$ na rzeczy po x$ sztuka, kupując n.',
    ),
    math: 'nx\\,?\\,50',
    choices0: mathChoices('nx \\le 50', 'nx \\ge 50', 'n+x=50', 'n/x=50'),
    fc: L(
      '“At most 50” means nx ≤ 50.',
      '“A lo sumo 50” significa nx ≤ 50.',
      '„Co najwyżej 50” oznacza nx ≤ 50.',
    ),
    fi: L(
      'At most → ≤; at least → ≥.',
      'A lo sumo → ≤; al menos → ≥.',
      'Co najwyżej → ≤; co najmniej → ≥.',
    ),
    tags: ['flipped_inequality', 'used_equality'],
    stds: l27W,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.modeling.multi.step',
    diff: 0.68,
    b: 0.65,
    prompt: L(
      'System: x + y = 10 and 2x − y = 2. Find x.',
      'Sistema: x + y = 10 y 2x − y = 2. Halla x.',
      'Układ: x + y = 10 i 2x − y = 2. Znajdź x.',
    ),
    math: '\\begin{cases} x+y=10 \\\\ 2x-y=2 \\end{cases}',
    choices0: mathChoices('4', '6', '3', '5'),
    fc: L(
      'Add: 3x = 12 → x = 4 (then y = 6).',
      'Suma: 3x = 12 → x = 4 (luego y = 6).',
      'Dodaj: 3x = 12 → x = 4 (potem y = 6).',
    ),
    fi: L(
      'Elimination: add to cancel y, then back-substitute.',
      'Eliminación: suma para cancelar y, luego sustituye.',
      'Eliminacja: dodaj, by skasować y, potem podstaw wstecz.',
    ),
    tags: ['added_wrong', 'swapped_xy'],
    stds: l27M,
    num: 4,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.modeling.choose',
    diff: 0.7,
    b: 0.75,
    prompt: L(
      'After solving a model, you should always…',
      'Tras resolver un modelo, siempre debes…',
      'Po rozwiązaniu modelu zawsze powinieneś…',
    ),
    math: '\\checkmark\\ ?',
    choices0: mathChoicesL(
      ['\\text{check units/sense}', '\\text{delete data}', '\\text{force r=1}', '\\text{ignore context}'],
      ['\\text{revisar unidades/sentido}', '\\text{borrar datos}', '\\text{forzar r=1}', '\\text{ignorar contexto}'],
      ['\\text{sprawdzić jedn./sens}', '\\text{usunąć dane}', '\\text{wymuszać r=1}', '\\text{ignorować kontekst}'],
    ),
    fc: L(
      'Interpret the answer: units, domain, and real-world reasonableness.',
      'Interpreta la respuesta: unidades, dominio y razonabilidad en el mundo real.',
      'Zinterpretuj wynik: jednostki, dziedzina i sensowność w rzeczywistości.',
    ),
    fi: L(
      'A numeric solve is incomplete until checked in context.',
      'Una resolución numérica está incompleta hasta verificarla en contexto.',
      'Wynik liczbowy jest niekompletny, dopóki nie sprawdzisz go w kontekście.',
    ),
    tags: ['skipped_check', 'wrong_tool'],
    stds: l27C,
  },
]

const lesson25Items = buildItems('alg1-l25', l25Specs)
const lesson26Items = buildItems('alg1-l26', l26Specs)
const lesson27Items = buildItems('alg1-l27', l27Specs)

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

const lesson25 = pack(
  'alg1-l25',
  25,
  L(
    'Systems of Linear Inequalities',
    'Sistemas de desigualdades lineales',
    'Układy nierówności liniowych',
  ),
  ineqSysKps,
  'lesson_board_25',
  ['lesson_board_26'],
  L('Teach: half-planes & overlap', 'Enseñar: semplanos y solapamiento', 'Nauczanie: półpłaszczyzny i przecięcie'),
  L(
    'Graph each inequality’s half-plane (solid/dashed boundary). The system solution is the intersection of the shaded regions; test points to verify.',
    'Grafica el semplano de cada desigualdad (frontera continua/discontinua). La solución del sistema es la intersección de las regiones; verifica con puntos de prueba.',
    'Narysuj półpłaszczyznę każdej nierówności (granica ciągła/przerywana). Rozwiązanie układu to przecięcie obszarów; sprawdzaj punktami próbnymi.',
  ),
  ['y>mx+b:\\ \\text{dashed}', 'H_1\\cap H_2', '(x_0,y_0)\\ \\text{test}'],
  L(
    'Classify boundaries, shade sides, and test ordered pairs in systems.',
    'Clasifica fronteras, sombrea lados y prueba pares ordenados en sistemas.',
    'Klasyfikuj granice, zacieniaj strony i sprawdzaj pary w układach.',
  ),
  lesson25Items,
)

const lesson26 = pack(
  'alg1-l26',
  26,
  L(
    'Scatter Plots, Correlation & Line of Best Fit',
    'Diagramas de dispersión, correlación y recta de mejor ajuste',
    'Wykresy rozrzutu, korelacja i prosta najlepszego dopasowania',
  ),
  scatterKps,
  'lesson_board_26',
  ['lesson_board_27'],
  L('Teach: cloud, r, and fit', 'Enseñar: nube, r y ajuste', 'Nauczanie: chmura, r i dopasowanie'),
  L(
    'Scatter plots show bivariate patterns. Correlation direction/strength (r) is not causation. A line of best fit y ≈ mx + b estimates and predicts within the data range.',
    'Los diagramas de dispersión muestran patrones bivariados. La dirección/fuerza de r no es causalidad. Una recta de mejor ajuste y ≈ mx + b estima y predice dentro del rango de datos.',
    'Wykresy rozrzutu pokazują wzorce dwuzmienne. Kierunek/siła r to nie przyczynowość. Prosta y ≈ mx + b szacuje i przewiduje w zakresie danych.',
  ),
  ['(x_i,y_i)', 'r\\in[-1,1]', 'y\\approx mx+b'],
  L(
    'Describe association, interpret r, and use linear fits carefully.',
    'Describe la asociación, interpreta r y usa ajustes lineales con cuidado.',
    'Opisuj związek, interpretuj r i ostrożnie stosuj dopasowania liniowe.',
  ),
  lesson26Items,
)

const lesson27 = pack(
  'alg1-l27',
  27,
  L(
    'Algebra I Modeling & Multi-Step Applications',
    'Modelado de Álgebra I y aplicaciones de varios pasos',
    'Modelowanie algebry I i zastosowania wieloetapowe',
  ),
  modelKps,
  'lesson_board_27',
  ['lesson_board_28'],
  L('Teach: write, solve, check', 'Enseñar: escribir, resolver, verificar', 'Nauczanie: zapisz, rozwiąż, sprawdź'),
  L(
    'Translate contexts into equations, inequalities, or systems; solve multi-step; choose the right structure; always check units and reasonableness.',
    'Traduce contextos a ecuaciones, desigualdades o sistemas; resuelve varios pasos; elige la estructura correcta; siempre verifica unidades y razonabilidad.',
    'Tłumacz konteksty na równania, nierówności lub układy; rozwiązuj wieloetapowo; wybieraj właściwą strukturę; zawsze sprawdzaj jednostki i sensowność.',
  ),
  ['\\text{model}', '\\text{solve}', '\\text{interpret}'],
  L(
    'Build models, solve applications, and justify which representation fits.',
    'Construye modelos, resuelve aplicaciones y justifica qué representación encaja.',
    'Buduj modele, rozwiązuj zastosowania i uzasadniaj, która reprezentacja pasuje.',
  ),
  lesson27Items,
)

/* Patch teach bodyMath — avoid English filler where possible */
lesson25.sections[1].bodyMath = ['y>mx+b:\\ ---', 'H_1\\cap H_2', '(x_0,y_0)']
lesson26.sections[1].bodyMath = ['(x_i,y_i)', 'r\\in[-1,1]', 'y\\approx mx+b']
lesson27.sections[1].bodyMath = ['\\rightarrow\\ \\text{eq}', '\\rightarrow\\ x', '\\rightarrow\\ \\checkmark']

lesson25.sections[0].body = L(
  'You will graph systems of linear inequalities and identify solution regions with test points.',
  'Graficarás sistemas de desigualdades lineales e identificarás regiones solución con puntos de prueba.',
  'Będziesz rysować układy nierówności liniowych i identyfikować obszary rozwiązań punktami próbnymi.',
)
lesson26.sections[0].body = L(
  'You will interpret scatter plots, describe correlation, and use lines of best fit.',
  'Interpretarás diagramas de dispersión, describirás correlación y usarás rectas de mejor ajuste.',
  'Będziesz interpretować wykresy rozrzutu, opisywać korelację i stosować proste najlepszego dopasowania.',
)
lesson27.sections[0].body = L(
  'You will write, solve, and check multi-step Algebra I models from real contexts.',
  'Escribirás, resolverás y verificarás modelos de Álgebra I de varios pasos desde contextos reales.',
  'Będziesz zapisywać, rozwiązywać i sprawdzać wieloetapowe modele algebry I z kontekstu.',
)

/* Fix L26 g03 feedback typo */
const g03 = lesson26Items.find((it) => it.id === 'alg1-l26-g03')
if (g03) {
  g03.feedbackCorrect.pl =
    'Nachylenie m = −2: przewidywane y spada o 2 na jednostkę wzrostu x.'
}

/* ─── Write outputs ─── */
lesson24.worldHook.unlockOnMastery = ['lesson_board_25']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-24.json', lesson24)
writeJson('lesson-25.json', lesson25)
writeJson('lesson-26.json', lesson26)
writeJson('lesson-27.json', lesson27)

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
  // also scan promptMath for English or/and in shared field — note only
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
  lessons: [lesson25, lesson26, lesson27].map((l) => ({
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
  unlockChain: 'L24→board_25→L25→26→L26→27→L27→board_28 teaser',
}

console.log(JSON.stringify(summary, null, 2))
