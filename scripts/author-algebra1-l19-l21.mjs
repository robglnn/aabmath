/**
 * Wave 7 authoring: Algebra I Lessons 19–21 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l19-l21.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-19..21; confirms L18 unlockOnMastery → lesson_board_19;
 * L21 unlocks lesson_board_22 teaser.
 *
 * KaTeX: promptMath on every item; MC math choices in $...$.
 * Feedback: distinct EN/ES/PL prose.
 * Localized conjunctions in ES/PL KaTeX (o / lub, not English "or").
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
const lesson18 = JSON.parse(readFileSync(join(outDir, 'lesson-18.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.exponential.recognize',
    title: L(
      'Recognize exponential growth and decay',
      'Reconocer crecimiento y decaimiento exponencial',
      'Rozpoznawać wzrost i zanikanie wykładnicze',
    ),
    prerequisites: ['kp.alg1.graph.slope.intercept', 'kp.alg1.exponents.product'],
    successCriteria: L(
      'Student distinguishes exponential patterns (common ratio) from linear (common difference) in tables and graphs.',
      'El estudiante distingue patrones exponenciales (razón común) de lineales (diferencia común) en tablas y gráficas.',
      'Uczeń odróżnia wzorce wykładnicze (wspólny iloraz) od liniowych (wspólna różnica) w tabelach i wykresach.',
    ),
    misconceptions: L(
      [
        'Calling any curved graph exponential without checking a constant multiplier',
        'Confusing growth (b > 1) with decay (0 < b < 1)',
      ],
      [
        'Llamar exponencial a cualquier gráfica curva sin verificar un multiplicador constante',
        'Confundir crecimiento (b > 1) con decaimiento (0 < b < 1)',
      ],
      [
        'Nazywanie wykładniczym każdego krzywego wykresu bez stałego mnożnika',
        'Mylenie wzrostu (b > 1) z zanikaniem (0 < b < 1)',
      ],
    ),
    standards: [
      TX('A.9(B)', 'A.9(D)', 'A.1(D)'),
      CC('F-LE.A.1c', 'F-LE.A.2'),
      CA('F-LE.1c'),
      FL('MA.912.F.1.6'),
    ],
  },
  {
    id: 'kp.alg1.exponential.form',
    title: L(
      'Form y = a·b^x — identify a and b',
      'Forma y = a·b^x — identificar a y b',
      'Postać y = a·b^x — identyfikować a i b',
    ),
    prerequisites: ['kp.alg1.exponential.recognize', 'kp.alg1.exponents.power'],
    encompassing: ['kp.alg1.exponential.recognize'],
    successCriteria: L(
      'Student reads initial value a (when x = 0) and growth/decay factor b from a rule, table, or context.',
      'El estudiante lee el valor inicial a (cuando x = 0) y el factor b de crecimiento/decaimiento de una regla, tabla o contexto.',
      'Uczeń odczytuje wartość początkową a (gdy x = 0) oraz czynnik b wzrostu/zanikania z reguły, tabeli lub kontekstu.',
    ),
    misconceptions: L(
      [
        'Treating b as an additive rate (like slope) instead of a multiplier',
        'Swapping a and b when writing y = a·b^x',
      ],
      [
        'Tratar b como una tasa aditiva (como pendiente) en lugar de un multiplicador',
        'Intercambiar a y b al escribir y = a·b^x',
      ],
      [
        'Traktowanie b jak stopy addytywnej (jak nachylenie) zamiast mnożnika',
        'Zamienianie a i b przy zapisie y = a·b^x',
      ],
    ),
    standards: [
      TX('A.9(B)', 'A.9(C)', 'A.1(F)'),
      CC('F-LE.A.2', 'F-LE.A.1c'),
      CA('F-LE.2'),
      FL('MA.912.F.1.6'),
    ],
  },
  {
    id: 'kp.alg1.exponential.evaluate',
    title: L(
      'Evaluate and extend exponential rules',
      'Evaluar y extender reglas exponenciales',
      'Obliczać i rozszerzać reguły wykładnicze',
    ),
    prerequisites: ['kp.alg1.exponential.form'],
    successCriteria: L(
      'Student substitutes integer x into y = a·b^x and finds next terms of a geometric sequence from a recursive multiply-by-b rule.',
      'El estudiante sustituye x entero en y = a·b^x y halla términos siguientes de una sucesión geométrica multiplicando por b.',
      'Uczeń podstawia całkowite x do y = a·b^x i znajduje kolejne wyrazy ciągu geometrycznego mnożąc przez b.',
    ),
    misconceptions: L(
      [
        'Adding b repeatedly instead of multiplying',
        'Using b^x without multiplying by a',
      ],
      [
        'Sumar b repetidamente en lugar de multiplicar',
        'Usar b^x sin multiplicar por a',
      ],
      [
        'Dodawanie b wielokrotnie zamiast mnożenia',
        'Używanie b^x bez mnożenia przez a',
      ],
    ),
    standards: [
      TX('A.9(B)', 'A.9(C)', 'A.1(B)'),
      CC('F-LE.A.2', 'F-IF.C.7e'),
      CA('F-LE.2'),
      FL('MA.912.F.1.6'),
    ],
  },
  {
    id: 'kp.alg1.radical.perfect.squares',
    title: L(
      'Perfect squares and simple square roots',
      'Cuadrados perfectos y raíces cuadradas simples',
      'Kwadraty doskonałe i proste pierwiastki kwadratowe',
    ),
    prerequisites: ['kp.alg1.exponents.power', 'kp.alg1.order.ops'],
    successCriteria: L(
      'Student recognizes perfect squares and evaluates √n for perfect-square n (principal/nonnegative root).',
      'El estudiante reconoce cuadrados perfectos y evalúa √n para n cuadrado perfecto (raíz principal no negativa).',
      'Uczeń rozpoznaje kwadraty doskonałe i oblicza √n dla doskonałego n (główny pierwiastek nieujemny).',
    ),
    misconceptions: L(
      [
        'Reporting ±√n when the radical symbol alone means the principal root',
        'Thinking √(a + b) = √a + √b',
      ],
      [
        'Reportar ±√n cuando el radical solo significa la raíz principal',
        'Creer que √(a + b) = √a + √b',
      ],
      [
        'Podawanie ±√n, gdy sam symbol pierwiastka oznacza pierwiastek główny',
        'Myślenie, że √(a + b) = √a + √b',
      ],
    ),
    standards: [
      TX('A.11(A)', 'A.1(B)', 'A.1(F)'),
      CC('N-RN.A.2', 'A-SSE.A.2'),
      CA('N-RN.2'),
      FL('MA.912.NSO.1.3'),
    ],
  },
  {
    id: 'kp.alg1.radical.simplify',
    title: L(
      'Simplify square-root radicals',
      'Simplificar radicales de raíz cuadrada',
      'Upraszczać pierwiastki kwadratowe',
    ),
    prerequisites: ['kp.alg1.radical.perfect.squares', 'kp.alg1.factor.gcf'],
    encompassing: ['kp.alg1.radical.perfect.squares'],
    successCriteria: L(
      'Student factors out the largest perfect-square factor: √(k²·m) = k√m (m square-free when possible).',
      'El estudiante saca el mayor factor cuadrado perfecto: √(k²·m) = k√m (m libre de cuadrados cuando es posible).',
      'Uczeń wyciąga największy czynnik kwadratowy: √(k²·m) = k√m (m bezkwadratowe, gdy możliwe).',
    ),
    misconceptions: L(
      [
        'Pulling out a non-square factor as if it were a perfect square',
        'Leaving a perfect-square factor inside the radical',
      ],
      [
        'Sacar un factor no cuadrado como si fuera cuadrado perfecto',
        'Dejar un factor cuadrado perfecto dentro del radical',
      ],
      [
        'Wyciąganie czynnika niekwadratowego jak kwadratu doskonałego',
        'Zostawianie czynnika kwadratowego wewnątrz pierwiastka',
      ],
    ),
    standards: [
      TX('A.11(A)', 'A.1(B)', 'A.1(F)'),
      CC('N-RN.A.2', 'A-SSE.A.2'),
      CA('N-RN.2'),
      FL('MA.912.NSO.1.3'),
    ],
  },
  {
    id: 'kp.alg1.radical.operations',
    title: L(
      'Multiply and divide simple square roots',
      'Multiplicar y dividir raíces cuadradas simples',
      'Mnożyć i dzielić proste pierwiastki kwadratowe',
    ),
    prerequisites: ['kp.alg1.radical.simplify'],
    successCriteria: L(
      'Student uses √a·√b = √(ab) and √a/√b = √(a/b) (b > 0), then simplifies the result.',
      'El estudiante usa √a·√b = √(ab) y √a/√b = √(a/b) (b > 0), luego simplifica el resultado.',
      'Uczeń stosuje √a·√b = √(ab) i √a/√b = √(a/b) (b > 0), potem upraszcza wynik.',
    ),
    misconceptions: L(
      [
        'Adding radicals by adding radicands: √a + √b ≠ √(a+b)',
        'Forgetting to simplify after multiplying or dividing',
      ],
      [
        'Sumar radicales sumando radicandos: √a + √b ≠ √(a+b)',
        'Olvidar simplificar después de multiplicar o dividir',
      ],
      [
        'Dodawanie pierwiastków przez dodawanie podpierwiastkowych: √a + √b ≠ √(a+b)',
        'Zapominanie o uproszczeniu po mnożeniu lub dzieleniu',
      ],
    ),
    standards: [
      TX('A.11(A)', 'A.1(B)', 'A.1(F)'),
      CC('N-RN.A.2', 'A-SSE.A.2'),
      CA('N-RN.2'),
      FL('MA.912.NSO.1.3'),
    ],
  },
  {
    id: 'kp.alg1.rational.simplify',
    title: L(
      'Simplify simple rational expressions',
      'Simplificar expresiones racionales simples',
      'Upraszczać proste wyrażenia wymierne',
    ),
    prerequisites: ['kp.alg1.factor.gcf', 'kp.alg1.exponents.quotient'],
    successCriteria: L(
      'Student factors numerator and denominator when needed and cancels only common factors (not terms).',
      'El estudiante factoriza numerador y denominador cuando hace falta y cancela solo factores comunes (no términos).',
      'Uczeń rozkłada licznik i mianownik gdy trzeba i skraca tylko wspólne czynniki (nie składniki).',
    ),
    misconceptions: L(
      [
        'Canceling terms across a sum (e.g. canceling x in (x+2)/x)',
        'Canceling only part of a factor',
      ],
      [
        'Cancelar términos en una suma (p. ej. cancelar x en (x+2)/x)',
        'Cancelar solo parte de un factor',
      ],
      [
        'Skracanie składników w sumie (np. x w (x+2)/x)',
        'Skracanie tylko części czynnika',
      ],
    ),
    standards: [
      TX('A.10(D)', 'A.1(B)', 'A.1(F)'),
      CC('A-APR.D.6', 'A-SSE.A.2'),
      CA('A-APR.6'),
      FL('MA.912.AR.1.7'),
    ],
  },
  {
    id: 'kp.alg1.rational.multiply',
    title: L(
      'Multiply simple rational expressions',
      'Multiplicar expresiones racionales simples',
      'Mnożyć proste wyrażenia wymierne',
    ),
    prerequisites: ['kp.alg1.rational.simplify', 'kp.alg1.factor.trinomial.a1'],
    encompassing: ['kp.alg1.rational.simplify'],
    successCriteria: L(
      'Student multiplies numerators and denominators (or factors first), then cancels common factors before expanding.',
      'El estudiante multiplica numeradores y denominadores (o factoriza primero), luego cancela factores comunes antes de expandir.',
      'Uczeń mnoży liczniki i mianowniki (lub najpierw rozkłada), potem skraca wspólne czynniki przed rozwinięciem.',
    ),
    misconceptions: L(
      [
        'Cross-adding instead of multiplying fractions',
        'Canceling after incorrectly expanding both sides',
      ],
      [
        'Sumar en cruz en lugar de multiplicar fracciones',
        'Cancelar después de expandir incorrectamente ambos lados',
      ],
      [
        'Dodawanie na krzyż zamiast mnożenia ułamków',
        'Skracanie po błędnym rozwinięciu obu stron',
      ],
    ),
    standards: [
      TX('A.10(D)', 'A.1(B)', 'A.1(F)'),
      CC('A-APR.D.6', 'A-SSE.A.2'),
      CA('A-APR.6'),
      FL('MA.912.AR.1.7'),
    ],
  },
  {
    id: 'kp.alg1.rational.divide',
    title: L(
      'Divide simple rational expressions',
      'Dividir expresiones racionales simples',
      'Dzielić proste wyrażenia wymierne',
    ),
    prerequisites: ['kp.alg1.rational.multiply'],
    successCriteria: L(
      'Student rewrites division as multiplication by the reciprocal, then multiplies and simplifies.',
      'El estudiante reescribe la división como multiplicación por el recíproco, luego multiplica y simplifica.',
      'Uczeń przepisuje dzielenie jako mnożenie przez odwrotność, potem mnoży i upraszcza.',
    ),
    misconceptions: L(
      [
        'Flipping the first fraction instead of the divisor',
        'Dividing numerators and denominators separately without reciprocals',
      ],
      [
        'Invertir la primera fracción en lugar del divisor',
        'Dividir numeradores y denominadores por separado sin recíprocos',
      ],
      [
        'Odwracanie pierwszego ułamka zamiast dzielnika',
        'Dzielenie liczników i mianowników osobno bez odwrotności',
      ],
    ),
    standards: [
      TX('A.10(D)', 'A.1(B)', 'A.1(F)'),
      CC('A-APR.D.6', 'A-SSE.A.2'),
      CA('A-APR.6'),
      FL('MA.912.AR.1.7'),
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

const expKps = [
  'kp.alg1.exponential.recognize',
  'kp.alg1.exponential.form',
  'kp.alg1.exponential.evaluate',
]
const radKps = [
  'kp.alg1.radical.perfect.squares',
  'kp.alg1.radical.simplify',
  'kp.alg1.radical.operations',
]
const ratKps = [
  'kp.alg1.rational.simplify',
  'kp.alg1.rational.multiply',
  'kp.alg1.rational.divide',
]

addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.exponential.evaluate',
  ...radKps,
  ...ratKps,
])
addKpsToExisting('TX', 'A.1(D)', ['kp.alg1.exponential.recognize'])
addKpsToExisting('TX', 'A.1(F)', [
  'kp.alg1.exponential.form',
  ...radKps,
  ...ratKps,
])
addKpsToExisting('CCSS', 'A-SSE.A.2', [...radKps, ...ratKps])
addKpsToExisting('TX', 'A.10(D)', ratKps)

ensureCode(
  'TX',
  'A.9(B)',
  L(
    'Interpret the meaning of the values of a and b in exponential functions of the form f(x) = ab^x in real-world problems',
    'Interpretar el significado de a y b en funciones exponenciales f(x) = ab^x en problemas del mundo real',
    'Interpretować znaczenie a i b w funkcjach wykładniczych f(x) = ab^x w zadaniach rzeczywistych',
  ),
  expKps,
)
ensureCode(
  'TX',
  'A.9(C)',
  L(
    'Write exponential functions in the form f(x) = ab^x (where b is a rational number) to describe problems arising from mathematical and real-world situations, including growth and decay',
    'Escribir funciones exponenciales f(x) = ab^x (b racional) para describir problemas matemáticos y del mundo real, incluido crecimiento y decaimiento',
    'Zapisywać funkcje wykładnicze f(x) = ab^x (b wymierne) opisujące problemy matematyczne i rzeczywiste, w tym wzrost i zanikanie',
  ),
  ['kp.alg1.exponential.form', 'kp.alg1.exponential.evaluate'],
)
ensureCode(
  'TX',
  'A.9(D)',
  L(
    'Graph exponential functions that model growth and decay and show key attributes including intercepts',
    'Graficar funciones exponenciales de crecimiento y decaimiento mostrando atributos clave, incluidos interceptos',
    'Rysować funkcje wykładnicze wzrostu i zanikania z kluczowymi cechami, w tym przecięciami',
  ),
  ['kp.alg1.exponential.recognize', 'kp.alg1.exponential.form'],
)
ensureCode(
  'TX',
  'A.11(A)',
  L(
    'Simplify numerical radical expressions involving square roots',
    'Simplificar expresiones radicales numéricas que involucran raíces cuadradas',
    'Upraszczać numeryczne wyrażenia pierwiastkowe z pierwiastkami kwadratowymi',
  ),
  radKps,
)
ensureCode(
  'CCSS',
  'F-LE.A.1c',
  L(
    'Recognize situations in which a quantity grows or decays by a constant percent rate per unit interval relative to another',
    'Reconocer situaciones en las que una cantidad crece o decae a una tasa porcentual constante por intervalo unitario',
    'Rozpoznawać sytuacje, w których wielkość rośnie lub zanika ze stałą stopą procentową na jednostkowy przedział',
  ),
  ['kp.alg1.exponential.recognize', 'kp.alg1.exponential.form'],
)
ensureCode(
  'CCSS',
  'F-LE.A.2',
  L(
    'Construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs',
    'Construir funciones lineales y exponenciales, incluidas sucesiones aritméticas y geométricas, dada una gráfica, descripción o dos pares entrada-salida',
    'Konstruować funkcje liniowe i wykładnicze, w tym ciągi arytmetyczne i geometryczne, z wykresu, opisu lub dwóch par wejście-wyjście',
  ),
  expKps,
)
ensureCode(
  'CCSS',
  'F-IF.C.7e',
  L(
    'Graph exponential functions, showing intercepts and end behavior',
    'Graficar funciones exponenciales, mostrando interceptos y comportamiento final',
    'Rysować funkcje wykładnicze, pokazując przecięcia i zachowanie na końcach',
  ),
  ['kp.alg1.exponential.evaluate', 'kp.alg1.exponential.recognize'],
)
ensureCode(
  'CCSS',
  'N-RN.A.2',
  L(
    'Rewrite expressions involving radicals and rational exponents using the properties of exponents',
    'Reescribir expresiones con radicales y exponentes racionales usando propiedades de exponentes',
    'Przepisywać wyrażenia z pierwiastkami i wykładnikami wymiernymi za pomocą własności potęg',
  ),
  radKps,
)
ensureCode(
  'CCSS',
  'A-APR.D.6',
  L(
    'Rewrite simple rational expressions in different forms; write a(x)/b(x) in the form q(x) + r(x)/b(x), where a(x), b(x), q(x), and r(x) are polynomials with the degree of r(x) less than the degree of b(x)',
    'Reescribir expresiones racionales simples en distintas formas; escribir a(x)/b(x) como q(x) + r(x)/b(x) con deg r < deg b',
    'Przepisywać proste wyrażenia wymierne w innych postaciach; zapisywać a(x)/b(x) jako q(x) + r(x)/b(x) przy deg r < deg b',
  ),
  ratKps,
)

existingStd.lessonCoverage['alg1-l19'] = [
  'A.9(B)',
  'A.9(C)',
  'A.9(D)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'F-LE.A.1c',
  'F-LE.A.2',
  'F-IF.C.7e',
]
existingStd.lessonCoverage['alg1-l20'] = [
  'A.11(A)',
  'A.1(B)',
  'A.1(F)',
  'N-RN.A.2',
  'A-SSE.A.2',
]
existingStd.lessonCoverage['alg1-l21'] = [
  'A.10(D)',
  'A.1(B)',
  'A.1(F)',
  'A-APR.D.6',
  'A-SSE.A.2',
]

const l19Rec = [TX('A.9(B)', 'A.9(D)', 'A.1(D)'), CC('F-LE.A.1c', 'F-LE.A.2')]
const l19Form = [TX('A.9(B)', 'A.9(C)', 'A.1(F)'), CC('F-LE.A.2', 'F-LE.A.1c')]
const l19Eval = [TX('A.9(B)', 'A.9(C)', 'A.1(B)'), CC('F-LE.A.2', 'F-IF.C.7e')]

const l20Perf = [TX('A.11(A)', 'A.1(B)', 'A.1(F)'), CC('N-RN.A.2', 'A-SSE.A.2')]
const l20Simp = [TX('A.11(A)', 'A.1(B)', 'A.1(F)'), CC('N-RN.A.2', 'A-SSE.A.2')]
const l20Ops = [TX('A.11(A)', 'A.1(B)', 'A.1(F)'), CC('N-RN.A.2', 'A-SSE.A.2')]

const l21Simp = [TX('A.10(D)', 'A.1(B)', 'A.1(F)'), CC('A-APR.D.6', 'A-SSE.A.2')]
const l21Mul = [TX('A.10(D)', 'A.1(B)', 'A.1(F)'), CC('A-APR.D.6', 'A-SSE.A.2')]
const l21Div = [TX('A.10(D)', 'A.1(B)', 'A.1(F)'), CC('A-APR.D.6', 'A-SSE.A.2')]

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
   LESSON 19 — Exponential growth/decay
   ═══════════════════════════════════════ */
const l19Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.exponential.recognize',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'The table shows y values for x = 0, 1, 2, 3: 5, 10, 20, 40. What kind of pattern is this?',
      'La tabla muestra y para x = 0, 1, 2, 3: 5, 10, 20, 40. ¿Qué tipo de patrón es?',
      'Tabela pokazuje y dla x = 0, 1, 2, 3: 5, 10, 20, 40. Jaki to wzorzec?',
    ),
    math: '5,\\ 10,\\ 20,\\ 40',
    choices0: L(
      ['Exponential growth (×2 each step)', 'Linear growth (+5 each step)', 'Exponential decay', 'Quadratic only'],
      ['Crecimiento exponencial (×2 cada paso)', 'Crecimiento lineal (+5 cada paso)', 'Decaimiento exponencial', 'Solo cuadrático'],
      ['Wzrost wykładniczy (×2 na krok)', 'Wzrost liniowy (+5 na krok)', 'Zanikanie wykładnicze', 'Tylko kwadratowy'],
    ),
    fc: L(
      'Each term is twice the previous — a constant ratio of 2 means exponential growth.',
      'Cada término es el doble del anterior: una razón constante 2 indica crecimiento exponencial.',
      'Każdy wyraz jest dwa razy większy od poprzedniego — stały iloraz 2 to wzrost wykładniczy.',
    ),
    fi: L(
      'Check ratios: 10/5 = 20/10 = 40/20 = 2, not a constant difference.',
      'Mira las razones: 10/5 = 20/10 = 40/20 = 2, no una diferencia constante.',
      'Sprawdź ilorazy: 10/5 = 20/10 = 40/20 = 2, nie stała różnica.',
    ),
    tags: ['linear_vs_exp', 'growth_vs_decay'],
    stds: l19Rec,
  },
  {
    id: 't02',
    kp: 'kp.alg1.exponential.form',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'In y = 3 · 2^x, what is the initial value a and the growth factor b?',
      'En y = 3 · 2^x, ¿cuál es el valor inicial a y el factor de crecimiento b?',
      'W y = 3 · 2^x, jaka jest wartość początkowa a i czynnik wzrostu b?',
    ),
    math: 'y=3\\cdot 2^{x}',
    choices0: mathChoicesL(
      ['a=3,\\ b=2', 'a=2,\\ b=3', 'a=3,\\ b=\\tfrac12', 'a=6,\\ b=2'],
      ['a=3,\\ b=2', 'a=2,\\ b=3', 'a=3,\\ b=\\tfrac12', 'a=6,\\ b=2'],
      ['a=3,\\ b=2', 'a=2,\\ b=3', 'a=3,\\ b=\\tfrac12', 'a=6,\\ b=2'],
    ),
    fc: L(
      'Form y = a·b^x: a = 3 is the starting value; b = 2 multiplies each step.',
      'Forma y = a·b^x: a = 3 es el valor inicial; b = 2 multiplica en cada paso.',
      'Postać y = a·b^x: a = 3 to wartość początkowa; b = 2 mnoży na każdym kroku.',
    ),
    fi: L(
      'a is the coefficient in front; b is the base of the exponential.',
      'a es el coeficiente delante; b es la base de la exponencial.',
      'a to współczynnik z przodu; b to podstawa potęgi.',
    ),
    tags: ['swap_a_b', 'wrong_factor'],
    stds: l19Form,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.exponential.recognize',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'A quantity is multiplied by 0.8 each year. Is this growth or decay?',
      'Una cantidad se multiplica por 0.8 cada año. ¿Es crecimiento o decaimiento?',
      'Wielkość jest mnożona przez 0.8 co rok. Czy to wzrost czy zanikanie?',
    ),
    math: 'b=0.8',
    choices0: L(
      ['Decay (0 < b < 1)', 'Growth (b > 1)', 'Neither — it is linear', 'Growth because 0.8 > 0'],
      ['Decaimiento (0 < b < 1)', 'Crecimiento (b > 1)', 'Ninguno — es lineal', 'Crecimiento porque 0.8 > 0'],
      ['Zanikanie (0 < b < 1)', 'Wzrost (b > 1)', 'Żadne — to liniowe', 'Wzrost, bo 0.8 > 0'],
    ),
    fc: L(
      'When the factor b is between 0 and 1, each step shrinks the value — decay.',
      'Si el factor b está entre 0 y 1, cada paso reduce el valor: decaimiento.',
      'Gdy czynnik b jest między 0 a 1, każdy krok zmniejsza wartość — zanikanie.',
    ),
    fi: L(
      'Growth needs b > 1; positivity alone is not enough.',
      'El crecimiento necesita b > 1; solo ser positivo no basta.',
      'Wzrost wymaga b > 1; sama dodatniość nie wystarczy.',
    ),
    tags: ['growth_vs_decay', 'sign_confusion'],
    stds: l19Rec,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.exponential.form',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'A culture starts at 200 cells and triples each hour. Which model fits?',
      'Un cultivo empieza con 200 células y se triplica cada hora. ¿Qué modelo encaja?',
      'Kultura zaczyna od 200 komórek i potraja się co godzinę. Który model pasuje?',
    ),
    math: 'y=a\\cdot b^{x}',
    choices0: mathChoices(
      'y=200\\cdot 3^{x}',
      'y=200\\cdot 3x',
      'y=3\\cdot 200^{x}',
      'y=200+3x',
    ),
    fc: L(
      'Start 200 and multiply by 3 each hour → y = 200 · 3^x.',
      'Empieza en 200 y multiplica por 3 cada hora → y = 200 · 3^x.',
      'Start 200 i mnożenie przez 3 co godzinę → y = 200 · 3^x.',
    ),
    fi: L(
      'Tripling is a factor of 3 in the base, not adding 3x or swapping a and b.',
      'Triplicar es un factor 3 en la base, no sumar 3x ni intercambiar a y b.',
      'Potrójnienie to czynnik 3 w podstawie, nie dodawanie 3x ani zamiana a i b.',
    ),
    tags: ['linear_model', 'swap_a_b'],
    stds: l19Form,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.exponential.evaluate',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'If y = 5 · 2^x, what is y when x = 3?',
      'Si y = 5 · 2^x, ¿cuánto es y cuando x = 3?',
      'Jeśli y = 5 · 2^x, ile wynosi y przy x = 3?',
    ),
    math: 'y=5\\cdot 2^{3}',
    choices0: mathChoices('40', '30', '16', '13'),
    fc: L(
      '2³ = 8, then 5 · 8 = 40.',
      '2³ = 8, luego 5 · 8 = 40.',
      '2³ = 8, potem 5 · 8 = 40.',
    ),
    fi: L(
      'Compute the power first, then multiply by 5 — do not add 5 + 2·3.',
      'Calcula primero la potencia y luego multiplica por 5 — no sumes 5 + 2·3.',
      'Najpierw potęga, potem mnożenie przez 5 — nie dodawaj 5 + 2·3.',
    ),
    tags: ['add_instead_of_multiply', 'power_error'],
    stds: l19Eval,
    num: 40,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.exponential.evaluate',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Sequence: 4, 12, 36, … Each term multiplies by 3. What is the next term?',
      'Sucesión: 4, 12, 36, … Cada término se multiplica por 3. ¿Cuál es el siguiente?',
      'Ciąg: 4, 12, 36, … Każdy wyraz mnoży się przez 3. Jaki jest następny?',
    ),
    math: '4,\\ 12,\\ 36,\\ ?',
    choices0: mathChoices('108', '72', '39', '144'),
    fc: L(
      '36 × 3 = 108 — keep the same common ratio.',
      '36 × 3 = 108 — mantén la misma razón común.',
      '36 × 3 = 108 — zachowaj ten sam wspólny iloraz.',
    ),
    fi: L(
      'Multiply the last term by 3; do not add 3 or double.',
      'Multiplica el último término por 3; no sumes 3 ni dupliques.',
      'Pomnóż ostatni wyraz przez 3; nie dodawaj 3 ani nie podwajaj.',
    ),
    tags: ['add_instead_of_multiply', 'wrong_ratio'],
    stds: l19Eval,
    num: 108,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.exponential.form',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'y = 80 · (1/2)^x models which situation best?',
      'y = 80 · (1/2)^x modela mejor ¿cuál situación?',
      'y = 80 · (1/2)^x najlepiej modeluje którą sytuację?',
    ),
    math: 'y=80\\cdot\\left(\\tfrac12\\right)^{x}',
    choices0: L(
      ['Starts at 80 and halves each step (decay)', 'Starts at 80 and doubles each step', 'Starts at 1/2 and grows by 80', 'Linear decrease of 80'],
      ['Empieza en 80 y se reduce a la mitad cada paso (decaimiento)', 'Empieza en 80 y se duplica cada paso', 'Empieza en 1/2 y crece en 80', 'Descenso lineal de 80'],
      ['Zaczyna od 80 i co krok się połowi (zanikanie)', 'Zaczyna od 80 i co krok się podwaja', 'Zaczyna od 1/2 i rośnie o 80', 'Liniowy spadek o 80'],
    ),
    fc: L(
      'a = 80 and b = 1/2 < 1 → start at 80 and halve each unit of x.',
      'a = 80 y b = 1/2 < 1 → empieza en 80 y se reduce a la mitad en cada unidad de x.',
      'a = 80 i b = 1/2 < 1 → start 80 i połowienie na każdą jednostkę x.',
    ),
    fi: L(
      'Because b = 1/2 is less than 1, the model decays by half — it does not double.',
      'Como b = 1/2 es menor que 1, el modelo decae a la mitad — no se duplica.',
      'Ponieważ b = 1/2 < 1, model zanika o połowę — nie podwaja się.',
    ),
    tags: ['growth_vs_decay', 'swap_a_b'],
    stds: l19Form,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.exponential.recognize',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Which table shows exponential decay?',
      '¿Qué tabla muestra decaimiento exponencial?',
      'Która tabela pokazuje zanikanie wykładnicze?',
    ),
    math: 'y:\\ ?,\\ ?,\\ ?,\\ ?',
    choices0: L(
      ['100, 50, 25, 12.5', '100, 90, 80, 70', '2, 4, 8, 16', '1, 4, 9, 16'],
      ['100, 50, 25, 12.5', '100, 90, 80, 70', '2, 4, 8, 16', '1, 4, 9, 16'],
      ['100, 50, 25, 12.5', '100, 90, 80, 70', '2, 4, 8, 16', '1, 4, 9, 16'],
    ),
    fc: L(
      '100 → 50 → 25 → 12.5 multiplies by 1/2 each time — exponential decay.',
      '100 → 50 → 25 → 12.5 se multiplica por 1/2 cada vez — decaimiento exponencial.',
      '100 → 50 → 25 → 12.5 mnoży się przez 1/2 za każdym razem — zanikanie wykładnicze.',
    ),
    fi: L(
      'Decay needs a constant ratio between 0 and 1; −10 each step is linear.',
      'El decaimiento necesita razón constante entre 0 y 1; −10 cada paso es lineal.',
      'Zanikanie wymaga stałego ilorazu między 0 a 1; −10 na krok to liniowe.',
    ),
    tags: ['linear_vs_exp', 'growth_vs_decay'],
    stds: l19Rec,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.exponential.form',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'At x = 0, y = 12. Each step multiplies by 1.5. Write y = a·b^x.',
      'En x = 0, y = 12. Cada paso multiplica por 1.5. Escribe y = a·b^x.',
      'Przy x = 0, y = 12. Każdy krok mnoży przez 1.5. Zapisz y = a·b^x.',
    ),
    math: 'a=12,\\ b=1.5',
    choices0: mathChoices(
      'y=12\\cdot(1.5)^{x}',
      'y=1.5\\cdot 12^{x}',
      'y=12+1.5x',
      'y=12\\cdot(0.5)^{x}',
    ),
    fc: L(
      'Initial value a = 12 and factor b = 1.5 give y = 12 · (1.5)^x.',
      'Valor inicial a = 12 y factor b = 1.5 dan y = 12 · (1.5)^x.',
      'Wartość początkowa a = 12 i czynnik b = 1.5 dają y = 12 · (1.5)^x.',
    ),
    fi: L(
      'Put the starting amount in front and the multiplier in the base.',
      'Pon el valor inicial delante y el multiplicador en la base.',
      'Wartość startową z przodu, mnożnik w podstawie.',
    ),
    tags: ['swap_a_b', 'linear_model'],
    stds: l19Form,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.exponential.evaluate',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Evaluate y = 2 · 3^x at x = 4.',
      'Evalúa y = 2 · 3^x en x = 4.',
      'Oblicz y = 2 · 3^x dla x = 4.',
    ),
    math: 'y=2\\cdot 3^{4}',
    choices0: mathChoices('162', '81', '24', '54'),
    fc: L(
      '3⁴ = 81, then 2 · 81 = 162.',
      '3⁴ = 81, luego 2 · 81 = 162.',
      '3⁴ = 81, potem 2 · 81 = 162.',
    ),
    fi: L(
      '3⁴ is 81, not 12; multiply the power by the leading 2.',
      '3⁴ es 81, no 12; multiplica la potencia por el 2 inicial.',
      '3⁴ to 81, nie 12; pomnóż potęgę przez początkowe 2.',
    ),
    tags: ['power_error', 'forgot_a'],
    stds: l19Eval,
    num: 162,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.exponential.recognize',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'On a graph, y starts at 4 and doubles for each +1 in x. Which equation matches?',
      'En una gráfica, y empieza en 4 y se duplica por cada +1 en x. ¿Qué ecuación coincide?',
      'Na wykresie y zaczyna od 4 i podwaja się przy każdym +1 w x. Które równanie pasuje?',
    ),
    math: 'y=4\\cdot 2^{x}',
    choices0: mathChoices(
      'y=4\\cdot 2^{x}',
      'y=4+2x',
      'y=2\\cdot 4^{x}',
      'y=4\\cdot\\left(\\tfrac12\\right)^{x}',
    ),
    fc: L(
      'Start 4 and double → multiply by 2 each step: y = 4 · 2^x.',
      'Empieza en 4 y duplica → multiplica por 2 cada paso: y = 4 · 2^x.',
      'Start 4 i podwajanie → mnożenie przez 2 na krok: y = 4 · 2^x.',
    ),
    fi: L(
      'Doubling is exponential with b = 2, not a linear +2x model.',
      'Duplicar es exponencial con b = 2, no un modelo lineal +2x.',
      'Podwajanie to wykładnicze z b = 2, nie liniowe +2x.',
    ),
    tags: ['linear_model', 'growth_vs_decay'],
    stds: l19Rec,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.exponential.form',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Which values of a and b give decay starting at 50 that shrinks by 20% each step?',
      '¿Qué valores de a y b dan decaimiento que empieza en 50 y se reduce 20% cada paso?',
      'Które a i b dają zanikanie od 50 ze spadkiem 20% na krok?',
    ),
    math: 'y=a\\cdot b^{x}',
    choices0: mathChoicesL(
      ['a=50,\\ b=0.8', 'a=50,\\ b=1.2', 'a=50,\\ b=0.2', 'a=0.8,\\ b=50'],
      ['a=50,\\ b=0.8', 'a=50,\\ b=1.2', 'a=50,\\ b=0.2', 'a=0.8,\\ b=50'],
      ['a=50,\\ b=0.8', 'a=50,\\ b=1.2', 'a=50,\\ b=0.2', 'a=0.8,\\ b=50'],
    ),
    fc: L(
      'Keep 80% → multiply by 0.8; a = 50 is the start.',
      'Conservar 80% → multiplicar por 0.8; a = 50 es el inicio.',
      'Zachować 80% → mnożyć przez 0.8; a = 50 to początek.',
    ),
    fi: L(
      'A 20% decrease leaves 80% of the previous value, so b = 0.8 not 0.2.',
      'Una baja del 20% deja el 80% del valor anterior, así b = 0.8 no 0.2.',
      'Spadek o 20% zostawia 80% poprzedniej wartości, więc b = 0.8 nie 0.2.',
    ),
    tags: ['percent_to_factor', 'swap_a_b'],
    stds: l19Form,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.exponential.evaluate',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'y = 100 · (0.5)^x. Find y when x = 2.',
      'y = 100 · (0.5)^x. Halla y cuando x = 2.',
      'y = 100 · (0.5)^x. Znajdź y dla x = 2.',
    ),
    math: 'y=100\\cdot(0.5)^{2}',
    choices0: mathChoices('25', '50', '200', '0.5'),
    fc: L(
      '(0.5)² = 0.25, then 100 · 0.25 = 25.',
      '(0.5)² = 0.25, luego 100 · 0.25 = 25.',
      '(0.5)² = 0.25, potem 100 · 0.25 = 25.',
    ),
    fi: L(
      'Square the factor first: half twice is one-fourth of 100.',
      'Primero eleva el factor al cuadrado: la mitad dos veces es un cuarto de 100.',
      'Najpierw podnieś czynnik do kwadratu: połowa dwa razy to ćwierć ze 100.',
    ),
    tags: ['power_error', 'forgot_a'],
    stds: l19Eval,
    num: 25,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.exponential.recognize',
    diff: 0.6,
    b: 0.45,
    prompt: L(
      'Why is 3, 6, 9, 12 linear rather than exponential?',
      '¿Por qué 3, 6, 9, 12 es lineal y no exponencial?',
      'Dlaczego 3, 6, 9, 12 jest liniowe, a nie wykładnicze?',
    ),
    math: '3,\\ 6,\\ 9,\\ 12',
    choices0: L(
      ['Constant difference +3, not a constant ratio', 'It multiplies by 2 each time', 'All sequences are exponential', 'It decays by half'],
      ['Diferencia constante +3, no una razón constante', 'Se multiplica por 2 cada vez', 'Todas las sucesiones son exponenciales', 'Decae a la mitad'],
      ['Stała różnica +3, nie stały iloraz', 'Mnoży się przez 2 za każdym razem', 'Wszystkie ciągi są wykładnicze', 'Zanika o połowę'],
    ),
    fc: L(
      'Adding 3 each step is a constant difference — the hallmark of linear change.',
      'Sumar 3 cada paso es diferencia constante — sello del cambio lineal.',
      'Dodawanie 3 na krok to stała różnica — cecha zmiany liniowej.',
    ),
    fi: L(
      'Ratios 6/3 = 2 but 9/6 = 1.5 are not equal, so it is not exponential.',
      'Las razones 6/3 = 2 pero 9/6 = 1.5 no son iguales, así no es exponencial.',
      'Ilorazy 6/3 = 2, ale 9/6 = 1.5 nie są równe, więc to nie wykładnicze.',
    ),
    tags: ['linear_vs_exp', 'ratio_check'],
    stds: l19Rec,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.exponential.form',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Which equation matches the table (x, y): (0, 7), (1, 21), (2, 63)?',
      '¿Qué ecuación coincide con la tabla (x, y): (0, 7), (1, 21), (2, 63)?',
      'Które równanie pasuje do tabeli (x, y): (0, 7), (1, 21), (2, 63)?',
    ),
    math: '(0,7),\\ (1,21),\\ (2,63)',
    choices0: mathChoices(
      'y=7\\cdot 3^{x}',
      'y=7\\cdot 3x',
      'y=3\\cdot 7^{x}',
      'y=7+3x',
    ),
    fc: L(
      'y(0) = 7 = a, and 21/7 = 63/21 = 3 = b, so y = 7 · 3^x.',
      'y(0) = 7 = a, y 21/7 = 63/21 = 3 = b, así y = 7 · 3^x.',
      'y(0) = 7 = a oraz 21/7 = 63/21 = 3 = b, więc y = 7 · 3^x.',
    ),
    fi: L(
      'Read a from x = 0 and b from the common ratio of successive y-values.',
      'Lee a en x = 0 y b de la razón común de los y sucesivos.',
      'Odczytaj a z x = 0 i b ze wspólnego ilorazu kolejnych y.',
    ),
    tags: ['swap_a_b', 'linear_model'],
    stds: l19Form,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.exponential.evaluate',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'A recursive rule: a₁ = 5, aₙ = 2 · aₙ₋₁. What is a₄?',
      'Regla recursiva: a₁ = 5, aₙ = 2 · aₙ₋₁. ¿Cuánto es a₄?',
      'Reguła rekurencyjna: a₁ = 5, aₙ = 2 · aₙ₋₁. Ile wynosi a₄?',
    ),
    math: 'a_{1}=5,\\ a_{n}=2a_{n-1}',
    choices0: mathChoices('40', '20', '10', '80'),
    fc: L(
      '5 → 10 → 20 → 40 after three doublings to reach term 4.',
      '5 → 10 → 20 → 40 tras tres duplicaciones para llegar al término 4.',
      '5 → 10 → 20 → 40 po trzech podwojeniach do wyrazu 4.',
    ),
    fi: L(
      'From a₁ to a₄ you apply ×2 three times: 5 · 2³ = 40.',
      'De a₁ a a₄ aplicas ×2 tres veces: 5 · 2³ = 40.',
      'Od a₁ do a₄ stosujesz ×2 trzy razy: 5 · 2³ = 40.',
    ),
    tags: ['off_by_one', 'add_instead_of_multiply'],
    stds: l19Eval,
    num: 40,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.exponential.evaluate',
    diff: 0.7,
    b: 0.65,
    prompt: L(
      'y = 6 · 2^x. Which ordered pair is on the graph?',
      'y = 6 · 2^x. ¿Qué par ordenado está en la gráfica?',
      'y = 6 · 2^x. Która para uporządkowana leży na wykresie?',
    ),
    math: 'y=6\\cdot 2^{x}',
    choices0: mathChoices('(2,24)', '(2,12)', '(1,8)', '(0,2)'),
    fc: L(
      'At x = 2: 6 · 2² = 6 · 4 = 24, so (2, 24).',
      'En x = 2: 6 · 2² = 6 · 4 = 24, así (2, 24).',
      'Przy x = 2: 6 · 2² = 6 · 4 = 24, więc (2, 24).',
    ),
    fi: L(
      'Substitute x into 6 · 2^x carefully; (0, 6) would be the y-intercept, not (0, 2).',
      'Sustituye x en 6 · 2^x con cuidado; (0, 6) sería el intercepto y, no (0, 2).',
      'Podstaw x do 6 · 2^x ostrożnie; (0, 6) to przecięcie y, nie (0, 2).',
    ),
    tags: ['forgot_a', 'power_error'],
    stds: l19Eval,
  },
]

/* ═══════════════════════════════════════
   LESSON 20 — Radical expressions
   ═══════════════════════════════════════ */
const l20Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.radical.perfect.squares',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'What is √81?',
      '¿Cuánto es √81?',
      'Ile wynosi √81?',
    ),
    math: '\\sqrt{81}',
    choices0: mathChoices('9', '-9', '\\pm 9', '40.5'),
    fc: L(
      '9² = 81, and the radical symbol means the principal (nonnegative) root 9.',
      '9² = 81, y el radical significa la raíz principal (no negativa) 9.',
      '9² = 81, a symbol pierwiastka oznacza pierwiastek główny (nieujemny) 9.',
    ),
    fi: L(
      '√ denotes the principal square root — report 9, not ±9.',
      '√ denota la raíz cuadrada principal — reporta 9, no ±9.',
      '√ oznacza główny pierwiastek kwadratowy — podaj 9, nie ±9.',
    ),
    tags: ['pm_instead_of_principal', 'half_error'],
    stds: l20Perf,
    num: 9,
  },
  {
    id: 't02',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Simplify √50.',
      'Simplifica √50.',
      'Uprość √50.',
    ),
    math: '\\sqrt{50}',
    choices0: mathChoices('5\\sqrt{2}', '25\\sqrt{2}', '2\\sqrt{5}', '10\\sqrt{5}'),
    fc: L(
      '50 = 25 · 2, so √50 = √25 · √2 = 5√2.',
      '50 = 25 · 2, así √50 = √25 · √2 = 5√2.',
      '50 = 25 · 2, więc √50 = √25 · √2 = 5√2.',
    ),
    fi: L(
      'Pull out the largest perfect square 25, not 2 or 10.',
      'Saca el mayor cuadrado perfecto 25, no 2 ni 10.',
      'Wyciągnij największy kwadrat doskonały 25, nie 2 ani 10.',
    ),
    tags: ['wrong_perfect_square', 'incomplete_simplify'],
    stds: l20Simp,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.radical.perfect.squares',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Which of these is a perfect square?',
      '¿Cuál de estos es un cuadrado perfecto?',
      'Która z tych liczb jest kwadratem doskonałym?',
    ),
    math: '12,\\ 16,\\ 18,\\ 20',
    choices0: mathChoices('16', '12', '18', '20'),
    fc: L(
      '16 = 4², so it is a perfect square; the others are not.',
      '16 = 4², así es un cuadrado perfecto; los otros no.',
      '16 = 4², więc to kwadrat doskonały; pozostałe nie.',
    ),
    fi: L(
      'Ask whether an integer square equals the number — only 16 works here.',
      'Pregunta si un cuadrado entero iguala el número — solo 16 funciona aquí.',
      'Sprawdź, czy kwadrat całkowity równa się liczbie — tu tylko 16.',
    ),
    tags: ['not_perfect_square'],
    stds: l20Perf,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Simplify √72.',
      'Simplifica √72.',
      'Uprość √72.',
    ),
    math: '\\sqrt{72}',
    choices0: mathChoices('6\\sqrt{2}', '8\\sqrt{2}', '36\\sqrt{2}', '3\\sqrt{8}'),
    fc: L(
      '72 = 36 · 2, so √72 = 6√2.',
      '72 = 36 · 2, así √72 = 6√2.',
      '72 = 36 · 2, więc √72 = 6√2.',
    ),
    fi: L(
      'Use 36 as the perfect-square factor (not leaving √8).',
      'Usa 36 como factor cuadrado perfecto (no dejes √8).',
      'Użyj 36 jako czynnika kwadratowego (nie zostawiaj √8).',
    ),
    tags: ['incomplete_simplify', 'wrong_perfect_square'],
    stds: l20Simp,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.radical.operations',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Simplify √3 · √12.',
      'Simplifica √3 · √12.',
      'Uprość √3 · √12.',
    ),
    math: '\\sqrt{3}\\cdot\\sqrt{12}',
    choices0: mathChoices('6', '3\\sqrt{4}', '\\sqrt{15}', '36'),
    fc: L(
      'Multiply under one radical: √3 · √12 = √36 = 6.',
      'Multiplica bajo un radical: √3 · √12 = √36 = 6.',
      'Pomnóż pod jednym pierwiastkiem: √3 · √12 = √36 = 6.',
    ),
    fi: L(
      'Multiply under one radical: √(3 · 12) = √36 = 6.',
      'Multiplica bajo un radical: √(3 · 12) = √36 = 6.',
      'Pomnóż pod jednym pierwiastkiem: √(3 · 12) = √36 = 6.',
    ),
    tags: ['add_radicands', 'forgot_simplify'],
    stds: l20Ops,
    num: 6,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Simplify √18.',
      'Simplifica √18.',
      'Uprość √18.',
    ),
    math: '\\sqrt{18}',
    choices0: mathChoices('3\\sqrt{2}', '9\\sqrt{2}', '2\\sqrt{3}', '6\\sqrt{3}'),
    fc: L(
      '18 = 9 · 2, so √18 = 3√2.',
      '18 = 9 · 2, así √18 = 3√2.',
      '18 = 9 · 2, więc √18 = 3√2.',
    ),
    fi: L(
      'The perfect-square factor is 9, giving coefficient 3 outside.',
      'El factor cuadrado perfecto es 9, dando coeficiente 3 afuera.',
      'Czynnik kwadratowy to 9, więc współczynnik 3 na zewnątrz.',
    ),
    tags: ['wrong_perfect_square', 'incomplete_simplify'],
    stds: l20Simp,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.radical.operations',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'Simplify √48 / √3.',
      'Simplifica √48 / √3.',
      'Uprość √48 / √3.',
    ),
    math: '\\frac{\\sqrt{48}}{\\sqrt{3}}',
    choices0: mathChoices('4', '16', '\\sqrt{16}', '\\sqrt{45}'),
    fc: L(
      'Divide radicands: √48 / √3 = √16 = 4.',
      'Divide radicandos: √48 / √3 = √16 = 4.',
      'Podziel podpierwiastkowe: √48 / √3 = √16 = 4.',
    ),
    fi: L(
      'Divide the radicands first, then take the square root of 16.',
      'Divide primero los radicandos y luego la raíz de 16.',
      'Najpierw podziel podpierwiastkowe, potem pierwiastek z 16.',
    ),
    tags: ['subtract_radicands', 'forgot_simplify'],
    stds: l20Ops,
    num: 4,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.radical.perfect.squares',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'What is √121?',
      '¿Cuánto es √121?',
      'Ile wynosi √121?',
    ),
    math: '\\sqrt{121}',
    choices0: mathChoices('11', '12', '\\pm 11', '60.5'),
    fc: L(
      '11² = 121, so the principal root is 11.',
      '11² = 121, así la raíz principal es 11.',
      '11² = 121, więc pierwiastek główny to 11.',
    ),
    fi: L(
      'Find the nonnegative number whose square is 121.',
      'Halla el número no negativo cuyo cuadrado es 121.',
      'Znajdź nieujemną liczbę, której kwadrat to 121.',
    ),
    tags: ['pm_instead_of_principal', 'off_by_one'],
    stds: l20Perf,
    num: 11,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Simplify √32.',
      'Simplifica √32.',
      'Uprość √32.',
    ),
    math: '\\sqrt{32}',
    choices0: mathChoices('4\\sqrt{2}', '2\\sqrt{8}', '16\\sqrt{2}', '8\\sqrt{2}'),
    fc: L(
      '32 = 16 · 2, so √32 = 4√2.',
      '32 = 16 · 2, así √32 = 4√2.',
      '32 = 16 · 2, więc √32 = 4√2.',
    ),
    fi: L(
      'Fully simplify: do not stop at 2√8.',
      'Simplifica por completo: no te quedes en 2√8.',
      'Uprość w pełni: nie zatrzymuj się na 2√8.',
    ),
    tags: ['incomplete_simplify', 'wrong_perfect_square'],
    stds: l20Simp,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.radical.operations',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Simplify √8 · √2.',
      'Simplifica √8 · √2.',
      'Uprość √8 · √2.',
    ),
    math: '\\sqrt{8}\\cdot\\sqrt{2}',
    choices0: mathChoices('4', '2\\sqrt{4}', '\\sqrt{10}', '16'),
    fc: L(
      'Combine: √8 · √2 = √16 = 4.',
      'Combina: √8 · √2 = √16 = 4.',
      'Połącz: √8 · √2 = √16 = 4.',
    ),
    fi: L(
      'Combine into √16, then take the root.',
      'Combina en √16 y luego toma la raíz.',
      'Połącz w √16, potem weź pierwiastek.',
    ),
    tags: ['add_radicands', 'forgot_simplify'],
    stds: l20Ops,
    num: 4,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Simplify √75.',
      'Simplifica √75.',
      'Uprość √75.',
    ),
    math: '\\sqrt{75}',
    choices0: mathChoices('5\\sqrt{3}', '25\\sqrt{3}', '3\\sqrt{5}', '15\\sqrt{5}'),
    fc: L(
      '75 = 25 · 3, so √75 = 5√3.',
      '75 = 25 · 3, así √75 = 5√3.',
      '75 = 25 · 3, więc √75 = 5√3.',
    ),
    fi: L(
      'Factor 25 out of 75; the leftover radicand is 3.',
      'Saca 25 de 75; el radicando restante es 3.',
      'Wyciągnij 25 z 75; pozostały podpierwiastkowy to 3.',
    ),
    tags: ['wrong_perfect_square', 'swapped_factors'],
    stds: l20Simp,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.radical.perfect.squares',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Which statement is true?',
      '¿Cuál afirmación es verdadera?',
      'Które twierdzenie jest prawdziwe?',
    ),
    math: '\\sqrt{a+b}\\ \\text{vs}\\ \\sqrt{a}+\\sqrt{b}',
    choices0: mathChoicesL(
      [
        '\\sqrt{9+16}=5\\ne 3+4',
        '\\sqrt{9+16}=3+4',
        '\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}\\text{ always}',
        '\\sqrt{25}=\\pm 5',
      ],
      [
        '\\sqrt{9+16}=5\\ne 3+4',
        '\\sqrt{9+16}=3+4',
        '\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}\\text{ siempre}',
        '\\sqrt{25}=\\pm 5',
      ],
      [
        '\\sqrt{9+16}=5\\ne 3+4',
        '\\sqrt{9+16}=3+4',
        '\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}\\text{ zawsze}',
        '\\sqrt{25}=\\pm 5',
      ],
    ),
    fc: L(
      '√(9+16) = √25 = 5, while 3 + 4 = 7 — radicals do not distribute over addition.',
      '√(9+16) = √25 = 5, mientras 3 + 4 = 7 — los radicales no se distribuyen sobre la suma.',
      '√(9+16) = √25 = 5, a 3 + 4 = 7 — pierwiastki nie rozdzielają się względem dodawania.',
    ),
    fi: L(
      'Test a concrete counterexample: √25 ≠ √9 + √16.',
      'Prueba un contraejemplo concreto: √25 ≠ √9 + √16.',
      'Sprawdź konkretny kontrprzykład: √25 ≠ √9 + √16.',
    ),
    tags: ['distribute_over_add', 'pm_instead_of_principal'],
    stds: l20Perf,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.radical.operations',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Simplify √6 · √24.',
      'Simplifica √6 · √24.',
      'Uprość √6 · √24.',
    ),
    math: '\\sqrt{6}\\cdot\\sqrt{24}',
    choices0: mathChoices('12', '\\sqrt{30}', '6\\sqrt{4}', '144'),
    fc: L(
      'Product of radicands: √6 · √24 = √144 = 12.',
      'Producto de radicandos: √6 · √24 = √144 = 12.',
      'Iloczyn podpierwiastkowych: √6 · √24 = √144 = 12.',
    ),
    fi: L(
      'Product of radicands is 144, a perfect square.',
      'El producto de radicandos es 144, un cuadrado perfecto.',
      'Iloczyn podpierwiastkowych to 144, kwadrat doskonały.',
    ),
    tags: ['add_radicands', 'forgot_simplify'],
    stds: l20Ops,
    num: 12,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.6,
    b: 0.45,
    prompt: L(
      'Simplify √98.',
      'Simplifica √98.',
      'Uprość √98.',
    ),
    math: '\\sqrt{98}',
    choices0: mathChoices('7\\sqrt{2}', '49\\sqrt{2}', '2\\sqrt{7}', '14\\sqrt{7}'),
    fc: L(
      '98 = 49 · 2, so √98 = 7√2.',
      '98 = 49 · 2, así √98 = 7√2.',
      '98 = 49 · 2, więc √98 = 7√2.',
    ),
    fi: L(
      'Largest perfect square dividing 98 is 49.',
      'El mayor cuadrado perfecto que divide a 98 es 49.',
      'Największy kwadrat doskonały dzielący 98 to 49.',
    ),
    tags: ['wrong_perfect_square', 'swapped_factors'],
    stds: l20Simp,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.radical.operations',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Simplify √45 / √5.',
      'Simplifica √45 / √5.',
      'Uprość √45 / √5.',
    ),
    math: '\\frac{\\sqrt{45}}{\\sqrt{5}}',
    choices0: mathChoices('3', '9', '\\sqrt{9}', '\\sqrt{40}'),
    fc: L(
      '√45 / √5 = √9 = 3 after dividing radicands.',
      '√45 / √5 = √9 = 3 tras dividir radicandos.',
      '√45 / √5 = √9 = 3 po podzieleniu podpierwiastkowych.',
    ),
    fi: L(
      '45 ÷ 5 = 9 under one radical.',
      '45 ÷ 5 = 9 bajo un solo radical.',
      '45 ÷ 5 = 9 pod jednym pierwiastkiem.',
    ),
    tags: ['subtract_radicands', 'forgot_simplify'],
    stds: l20Ops,
    num: 3,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.radical.simplify',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Simplify √12 · √3.',
      'Simplifica √12 · √3.',
      'Uprość √12 · √3.',
    ),
    math: '\\sqrt{12}\\cdot\\sqrt{3}',
    choices0: mathChoices('6', '3\\sqrt{4}', '\\sqrt{15}', '36'),
    fc: L(
      '√12 · √3 = √36 = 6 (or 2√3 · √3 = 2 · 3 = 6).',
      '√12 · √3 = √36 = 6 (o 2√3 · √3 = 2 · 3 = 6).',
      '√12 · √3 = √36 = 6 (lub 2√3 · √3 = 2 · 3 = 6).',
    ),
    fi: L(
      'Either multiply first to √36, or simplify √12 = 2√3 then multiply.',
      'Multiplica primero a √36, o simplifica √12 = 2√3 y luego multiplica.',
      'Albo najpierw √36, albo uprość √12 = 2√3 i potem pomnóż.',
    ),
    tags: ['add_radicands', 'forgot_simplify'],
    stds: l20Simp,
    num: 6,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.radical.operations',
    diff: 0.7,
    b: 0.65,
    prompt: L(
      'Simplify (√18) / (√2).',
      'Simplifica (√18) / (√2).',
      'Uprość (√18) / (√2).',
    ),
    math: '\\frac{\\sqrt{18}}{\\sqrt{2}}',
    choices0: mathChoices('3', '9', '\\sqrt{16}', '4'),
    fc: L(
      '√18 / √2 = √9 = 3 after dividing radicands.',
      '√18 / √2 = √9 = 3 tras dividir radicandos.',
      '√18 / √2 = √9 = 3 po podzieleniu podpierwiastkowych.',
    ),
    fi: L(
      'Divide radicands: 18/2 = 9, then √9 = 3.',
      'Divide radicandos: 18/2 = 9, luego √9 = 3.',
      'Podziel podpierwiastkowe: 18/2 = 9, potem √9 = 3.',
    ),
    tags: ['subtract_radicands', 'forgot_simplify'],
    stds: l20Ops,
    num: 3,
  },
]

/* ═══════════════════════════════════════
   LESSON 21 — Rational expressions
   ═══════════════════════════════════════ */
const l21Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.rational.simplify',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'Simplify (6x) / (3x) for x ≠ 0.',
      'Simplifica (6x) / (3x) para x ≠ 0.',
      'Uprość (6x) / (3x) dla x ≠ 0.',
    ),
    math: '\\frac{6x}{3x}',
    choices0: mathChoices('2', '2x', '3', '6'),
    fc: L(
      'Cancel the common factor x and divide coefficients: 6/3 = 2.',
      'Cancela el factor común x y divide coeficientes: 6/3 = 2.',
      'Skróć wspólny czynnik x i podziel współczynniki: 6/3 = 2.',
    ),
    fi: L(
      'Cancel matching factors completely — you should not leave an extra x.',
      'Cancela factores coincidentes por completo — no debe quedar una x extra.',
      'Skróć pasujące czynniki całkowicie — nie powinno zostać dodatkowe x.',
    ),
    tags: ['left_variable', 'cancel_terms'],
    stds: l21Simp,
    num: 2,
  },
  {
    id: 't02',
    kp: 'kp.alg1.rational.multiply',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Multiply: (2/3) · (9/4).',
      'Multiplica: (2/3) · (9/4).',
      'Pomnóż: (2/3) · (9/4).',
    ),
    math: '\\frac{2}{3}\\cdot\\frac{9}{4}',
    choices0: mathChoices('\\frac{3}{2}', '\\frac{18}{12}', '\\frac{11}{7}', '\\frac{8}{27}'),
    fc: L(
      'Cancel 3 with 9 and 2 with 4 → 1/1 · 3/2 = 3/2.',
      'Cancela 3 con 9 y 2 con 4 → 1/1 · 3/2 = 3/2.',
      'Skróć 3 z 9 i 2 z 4 → 1/1 · 3/2 = 3/2.',
    ),
    fi: L(
      'Multiply numerators and denominators, then reduce — or cancel first.',
      'Multiplica numeradores y denominadores y reduce — o cancela primero.',
      'Pomnóż liczniki i mianowniki, potem uprość — albo najpierw skróć.',
    ),
    tags: ['add_fractions', 'forgot_reduce'],
    stds: l21Mul,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.rational.simplify',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Simplify (x²) / (x) for x ≠ 0.',
      'Simplifica (x²) / (x) para x ≠ 0.',
      'Uprość (x²) / (x) dla x ≠ 0.',
    ),
    math: '\\frac{x^{2}}{x}',
    choices0: mathChoices('x', 'x^{3}', '1', 'x^{2}'),
    fc: L(
      'Subtract exponents: x² / x = x^(2−1) = x.',
      'Resta exponentes: x² / x = x^(2−1) = x.',
      'Odejmij wykładniki: x² / x = x^(2−1) = x.',
    ),
    fi: L(
      'Subtract exponents when dividing matching bases — result is x, not 1.',
      'Resta exponentes al dividir bases iguales — el resultado es x, no 1.',
      'Odejmij wykładniki przy dzieleniu tych samych podstaw — wynik to x, nie 1.',
    ),
    tags: ['exponent_error', 'cancel_all'],
    stds: l21Simp,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.rational.simplify',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Simplify (4x + 8) / 4.',
      'Simplifica (4x + 8) / 4.',
      'Uprość (4x + 8) / 4.',
    ),
    math: '\\frac{4x+8}{4}',
    choices0: mathChoices('x+2', 'x+8', '4x+2', 'x'),
    fc: L(
      'Factor 4(x + 2)/4 = x + 2.',
      'Factoriza 4(x + 2)/4 = x + 2.',
      'Rozłóż 4(x + 2)/4 = x + 2.',
    ),
    fi: L(
      'Divide every term by 4: 4x/4 + 8/4 = x + 2.',
      'Divide cada término entre 4: 4x/4 + 8/4 = x + 2.',
      'Podziel każdy składnik przez 4: 4x/4 + 8/4 = x + 2.',
    ),
    tags: ['cancel_one_term', 'forgot_constant'],
    stds: l21Simp,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.rational.multiply',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Multiply: (x/5) · (10/x) for x ≠ 0.',
      'Multiplica: (x/5) · (10/x) para x ≠ 0.',
      'Pomnóż: (x/5) · (10/x) dla x ≠ 0.',
    ),
    math: '\\frac{x}{5}\\cdot\\frac{10}{x}',
    choices0: mathChoices('2', '10', '\\frac{10x}{5x}', '\\frac{x}{2}'),
    fc: L(
      'Cancel x and reduce 10/5 → 2.',
      'Cancela x y reduce 10/5 → 2.',
      'Skróć x i uprość 10/5 → 2.',
    ),
    fi: L(
      'After canceling x you still simplify 10/5 to 2.',
      'Tras cancelar x aún simplificas 10/5 a 2.',
      'Po skróceniu x nadal upraszczasz 10/5 do 2.',
    ),
    tags: ['forgot_reduce', 'cancel_terms'],
    stds: l21Mul,
    num: 2,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.rational.divide',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Divide: (3/4) ÷ (1/2).',
      'Divide: (3/4) ÷ (1/2).',
      'Podziel: (3/4) ÷ (1/2).',
    ),
    math: '\\frac{3}{4}\\div\\frac{1}{2}',
    choices0: mathChoices('\\frac{3}{2}', '\\frac{3}{8}', '\\frac{2}{3}', '6'),
    fc: L(
      'Multiply by the reciprocal: (3/4) · (2/1) = 6/4 = 3/2.',
      'Multiplica por el recíproco: (3/4) · (2/1) = 6/4 = 3/2.',
      'Pomnóż przez odwrotność: (3/4) · (2/1) = 6/4 = 3/2.',
    ),
    fi: L(
      'Flip the second fraction only, then multiply.',
      'Invierte solo la segunda fracción y luego multiplica.',
      'Odwróć tylko drugi ułamek, potem pomnóż.',
    ),
    tags: ['flip_first', 'multiply_without_flip'],
    stds: l21Div,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.rational.divide',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'Divide: (x/3) ÷ (x/6) for x ≠ 0.',
      'Divide: (x/3) ÷ (x/6) para x ≠ 0.',
      'Podziel: (x/3) ÷ (x/6) dla x ≠ 0.',
    ),
    math: '\\frac{x}{3}\\div\\frac{x}{6}',
    choices0: mathChoices('2', '\\frac{1}{2}', 'x^{2}', '18'),
    fc: L(
      '(x/3) · (6/x) = 6/3 = 2 after canceling x.',
      '(x/3) · (6/x) = 6/3 = 2 tras cancelar x.',
      '(x/3) · (6/x) = 6/3 = 2 po skróceniu x.',
    ),
    fi: L(
      'Reciprocal of x/6 is 6/x; cancel x and simplify coefficients.',
      'El recíproco de x/6 es 6/x; cancela x y simplifica coeficientes.',
      'Odwrotność x/6 to 6/x; skróć x i uprość współczynniki.',
    ),
    tags: ['flip_first', 'forgot_reduce'],
    stds: l21Div,
    num: 2,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.rational.simplify',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Simplify (10x³) / (5x) for x ≠ 0.',
      'Simplifica (10x³) / (5x) para x ≠ 0.',
      'Uprość (10x³) / (5x) dla x ≠ 0.',
    ),
    math: '\\frac{10x^{3}}{5x}',
    choices0: mathChoices('2x^{2}', '2x^{3}', '5x^{2}', '2x'),
    fc: L(
      '10/5 = 2 and x³/x = x² → 2x².',
      '10/5 = 2 y x³/x = x² → 2x².',
      '10/5 = 2 oraz x³/x = x² → 2x².',
    ),
    fi: L(
      'Reduce coefficients and subtract exponents on x.',
      'Reduce coeficientes y resta exponentes de x.',
      'Uprość współczynniki i odejmij wykładniki przy x.',
    ),
    tags: ['exponent_error', 'coeff_error'],
    stds: l21Simp,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.rational.simplify',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Simplify (x² − 9) / (x − 3) for x ≠ 3.',
      'Simplifica (x² − 9) / (x − 3) para x ≠ 3.',
      'Uprość (x² − 9) / (x − 3) dla x ≠ 3.',
    ),
    math: '\\frac{x^{2}-9}{x-3}',
    choices0: mathChoices('x+3', 'x-3', 'x^{2}-3', 'x-9'),
    fc: L(
      'Difference of squares: (x − 3)(x + 3)/(x − 3) = x + 3.',
      'Diferencia de cuadrados: (x − 3)(x + 3)/(x − 3) = x + 3.',
      'Różnica kwadratów: (x − 3)(x + 3)/(x − 3) = x + 3.',
    ),
    fi: L(
      'Factor the numerator first, then cancel the matching (x − 3).',
      'Factoriza primero el numerador y luego cancela el (x − 3) coincidente.',
      'Najpierw rozłóż licznik, potem skróć pasujące (x − 3).',
    ),
    tags: ['no_factor', 'cancel_terms'],
    stds: l21Simp,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.rational.multiply',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Multiply: (3x/4) · (8/9x) for x ≠ 0.',
      'Multiplica: (3x/4) · (8/9x) para x ≠ 0.',
      'Pomnóż: (3x/4) · (8/9x) dla x ≠ 0.',
    ),
    math: '\\frac{3x}{4}\\cdot\\frac{8}{9x}',
    choices0: mathChoices('\\frac{2}{3}', '\\frac{24x}{36x}', '\\frac{3}{2}', '6'),
    fc: L(
      'Cancel x, reduce 8/4 = 2 and 3/9 = 1/3 → 2/3.',
      'Cancela x, reduce 8/4 = 2 y 3/9 = 1/3 → 2/3.',
      'Skróć x, uprość 8/4 = 2 i 3/9 = 1/3 → 2/3.',
    ),
    fi: L(
      'Cancel common factors before multiplying leftovers.',
      'Cancela factores comunes antes de multiplicar lo que queda.',
      'Skróć wspólne czynniki przed mnożeniem reszty.',
    ),
    tags: ['forgot_reduce', 'cancel_terms'],
    stds: l21Mul,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.rational.multiply',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Multiply: ((x + 1)/5) · (10/(x + 1)) for x ≠ −1.',
      'Multiplica: ((x + 1)/5) · (10/(x + 1)) para x ≠ −1.',
      'Pomnóż: ((x + 1)/5) · (10/(x + 1)) dla x ≠ −1.',
    ),
    math: '\\frac{x+1}{5}\\cdot\\frac{10}{x+1}',
    choices0: mathChoices('2', '10', '\\frac{10(x+1)}{5(x+1)}', '50'),
    fc: L(
      'Cancel (x + 1); 10/5 = 2.',
      'Cancela (x + 1); 10/5 = 2.',
      'Skróć (x + 1); 10/5 = 2.',
    ),
    fi: L(
      'Whole factors cancel; then simplify the numeric fraction.',
      'Se cancelan factores enteros; luego simplifica la fracción numérica.',
      'Skracają się całe czynniki; potem uprość ułamek liczbowy.',
    ),
    tags: ['forgot_reduce', 'partial_cancel'],
    stds: l21Mul,
    num: 2,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.rational.divide',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Divide: (2/5) ÷ (4/15).',
      'Divide: (2/5) ÷ (4/15).',
      'Podziel: (2/5) ÷ (4/15).',
    ),
    math: '\\frac{2}{5}\\div\\frac{4}{15}',
    choices0: mathChoices('\\frac{3}{2}', '\\frac{8}{75}', '\\frac{2}{3}', '\\frac{15}{4}'),
    fc: L(
      'Multiply by the reciprocal: (2/5) · (15/4) = 30/20 = 3/2.',
      'Multiplica por el recíproco: (2/5) · (15/4) = 30/20 = 3/2.',
      'Pomnóż przez odwrotność: (2/5) · (15/4) = 30/20 = 3/2.',
    ),
    fi: L(
      'Multiply by 15/4, the reciprocal of 4/15, then reduce.',
      'Multiplica por 15/4, el recíproco de 4/15, y reduce.',
      'Pomnóż przez 15/4, odwrotność 4/15, potem uprość.',
    ),
    tags: ['multiply_without_flip', 'forgot_reduce'],
    stds: l21Div,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.rational.simplify',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Which simplification is illegal?',
      '¿Qué simplificación es ilegal?',
      'Które uproszczenie jest niedozwolone?',
    ),
    math: '\\frac{x+2}{x}',
    choices0: mathChoicesL(
      [
        '\\frac{x+2}{x}\\to 2\\quad(\\text{cancel }x)',
        '\\frac{6x}{3x}\\to 2',
        '\\frac{x^{2}}{x}\\to x',
        '\\frac{4(x+1)}{4}\\to x+1',
      ],
      [
        '\\frac{x+2}{x}\\to 2\\quad(\\text{cancelar }x)',
        '\\frac{6x}{3x}\\to 2',
        '\\frac{x^{2}}{x}\\to x',
        '\\frac{4(x+1)}{4}\\to x+1',
      ],
      [
        '\\frac{x+2}{x}\\to 2\\quad(\\text{skr\u00f3\u0107 }x)',
        '\\frac{6x}{3x}\\to 2',
        '\\frac{x^{2}}{x}\\to x',
        '\\frac{4(x+1)}{4}\\to x+1',
      ],
    ),
    fc: L(
      'You cannot cancel a term from a sum — (x + 2)/x is not 2.',
      'No puedes cancelar un término de una suma — (x + 2)/x no es 2.',
      'Nie można skracać składnika z sumy — (x + 2)/x to nie 2.',
    ),
    fi: L(
      'Only common factors cancel; terms added in the numerator stay.',
      'Solo se cancelan factores comunes; los términos sumados en el numerador quedan.',
      'Skracają się tylko wspólne czynniki; składniki w liczniku zostają.',
    ),
    tags: ['cancel_terms'],
    stds: l21Simp,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.rational.multiply',
    diff: 0.6,
    b: 0.45,
    prompt: L(
      'Multiply: ((x − 2)/(x + 5)) · ((x + 5)/4) for x ≠ −5.',
      'Multiplica: ((x − 2)/(x + 5)) · ((x + 5)/4) para x ≠ −5.',
      'Pomnóż: ((x − 2)/(x + 5)) · ((x + 5)/4) dla x ≠ −5.',
    ),
    math: '\\frac{x-2}{x+5}\\cdot\\frac{x+5}{4}',
    choices0: mathChoices('\\frac{x-2}{4}', '\\frac{x-2}{x+5}', 'x-2', '\\frac{(x-2)(x+5)}{4(x+5)}'),
    fc: L(
      'Cancel (x + 5) → (x − 2)/4.',
      'Cancela (x + 5) → (x − 2)/4.',
      'Skróć (x + 5) → (x − 2)/4.',
    ),
    fi: L(
      'Matching binomial factors cancel across the product.',
      'Los factores binomiales coincidentes se cancelan en el producto.',
      'Pasujące czynniki dwumianowe skracają się w iloczynie.',
    ),
    tags: ['forgot_cancel', 'forgot_denominator'],
    stds: l21Mul,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.rational.divide',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Divide: (5x/2) ÷ (10/x) for x ≠ 0.',
      'Divide: (5x/2) ÷ (10/x) para x ≠ 0.',
      'Podziel: (5x/2) ÷ (10/x) dla x ≠ 0.',
    ),
    math: '\\frac{5x}{2}\\div\\frac{10}{x}',
    choices0: mathChoices('\\frac{x^{2}}{4}', '\\frac{5x}{20}', '\\frac{50x}{2x}', '\\frac{x}{4}'),
    fc: L(
      'Flip and multiply: (5x/2) · (x/10) = 5x²/20 = x²/4.',
      'Invierte y multiplica: (5x/2) · (x/10) = 5x²/20 = x²/4.',
      'Odwróć i pomnóż: (5x/2) · (x/10) = 5x²/20 = x²/4.',
    ),
    fi: L(
      'Reciprocal of 10/x is x/10; multiply and reduce 5/20.',
      'El recíproco de 10/x es x/10; multiplica y reduce 5/20.',
      'Odwrotność 10/x to x/10; pomnóż i uprość 5/20.',
    ),
    tags: ['flip_first', 'forgot_reduce'],
    stds: l21Div,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.rational.divide',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Divide: ((x + 3)/7) ÷ ((x + 3)/14) for x ≠ −3.',
      'Divide: ((x + 3)/7) ÷ ((x + 3)/14) para x ≠ −3.',
      'Podziel: ((x + 3)/7) ÷ ((x + 3)/14) dla x ≠ −3.',
    ),
    math: '\\frac{x+3}{7}\\div\\frac{x+3}{14}',
    choices0: mathChoices('2', '\\frac{1}{2}', '14', '\\frac{(x+3)^{2}}{98}'),
    fc: L(
      'Multiply by 14/(x + 3); cancel (x + 3) → 14/7 = 2.',
      'Multiplica por 14/(x + 3); cancela (x + 3) → 14/7 = 2.',
      'Pomnóż przez 14/(x + 3); skróć (x + 3) → 14/7 = 2.',
    ),
    fi: L(
      'After flipping the divisor, the (x + 3) factors cancel cleanly.',
      'Tras invertir el divisor, los factores (x + 3) se cancelan limpio.',
      'Po odwróceniu dzielnika czynniki (x + 3) skracają się czysto.',
    ),
    tags: ['multiply_without_flip', 'forgot_cancel'],
    stds: l21Div,
    num: 2,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.rational.multiply',
    diff: 0.7,
    b: 0.65,
    prompt: L(
      'Multiply: ((x² − 1)/6) · (3/(x − 1)) for x ≠ 1.',
      'Multiplica: ((x² − 1)/6) · (3/(x − 1)) para x ≠ 1.',
      'Pomnóż: ((x² − 1)/6) · (3/(x − 1)) dla x ≠ 1.',
    ),
    math: '\\frac{x^{2}-1}{6}\\cdot\\frac{3}{x-1}',
    choices0: mathChoices('\\frac{x+1}{2}', '\\frac{x-1}{2}', 'x+1', '\\frac{3(x^{2}-1)}{6(x-1)}'),
    fc: L(
      'Factor x² − 1 = (x − 1)(x + 1); cancel (x − 1); 3/6 = 1/2 → (x + 1)/2.',
      'Factoriza x² − 1 = (x − 1)(x + 1); cancela (x − 1); 3/6 = 1/2 → (x + 1)/2.',
      'Rozłóż x² − 1 = (x − 1)(x + 1); skróć (x − 1); 3/6 = 1/2 → (x + 1)/2.',
    ),
    fi: L(
      'Factor the difference of squares before canceling with (x − 1).',
      'Factoriza la diferencia de cuadrados antes de cancelar con (x − 1).',
      'Rozłóż różnicę kwadratów przed skróceniem z (x − 1).',
    ),
    tags: ['no_factor', 'wrong_remaining_factor'],
    stds: l21Mul,
  },
]

const lesson19Items = buildItems('alg1-l19', l19Specs)
const lesson20Items = buildItems('alg1-l20', l20Specs)
const lesson21Items = buildItems('alg1-l21', l21Specs)

function pack(id, order, title, kps, siteId, unlock, teachTitle, teachBody, teachMath, guidedBody, items) {
  const prefix = id
  return {
    id,
    courseId: 'algebra1',
    order,
    title,
    knowledgePointIds: kps,
    masteryThreshold: 0.8,
    worldHook: { siteId, unlockOnMastery: unlock },
    sections: [
      {
        phase: 'objective',
        title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
        body: L(
          title.en.includes('Exponential')
            ? 'You will recognize growth/decay, read a and b in y = a·b^x, and evaluate simple exponential rules.'
            : title.en.includes('Radical')
              ? 'You will evaluate perfect-square roots, simplify radicals, and multiply/divide simple square roots.'
              : 'You will simplify, multiply, and divide simple rational expressions by canceling factors.',
          title.en.includes('Exponential')
            ? 'Reconocerás crecimiento/decaimiento, leerás a y b en y = a·b^x y evaluarás reglas exponenciales simples.'
            : title.en.includes('Radical')
              ? 'Evaluarás raíces de cuadrados perfectos, simplificarás radicales y multiplicarás/dividirás raíces simples.'
              : 'Simplificarás, multiplicarás y dividirás expresiones racionales simples cancelando factores.',
          title.en.includes('Exponential')
            ? 'Będziesz rozpoznawać wzrost/zanikanie, odczytywać a i b w y = a·b^x oraz obliczać proste reguły wykładnicze.'
            : title.en.includes('Radical')
              ? 'Będziesz obliczać pierwiastki kwadratów doskonałych, upraszczać pierwiastki oraz mnożyć/dzielić proste pierwiastki.'
              : 'Będziesz upraszczać, mnożyć i dzielić proste wyrażenia wymierne przez skracanie czynników.',
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

const lesson19 = pack(
  'alg1-l19',
  19,
  L(
    'Exponential Growth & Decay Intro',
    'Introducción al crecimiento y decaimiento exponencial',
    'Wstęp do wzrostu i zanikania wykładniczego',
  ),
  expKps,
  'lesson_board_19',
  ['lesson_board_20'],
  L('Teach: ratio & form', 'Enseñar: razón y forma', 'Nauczanie: iloraz i postać'),
  L(
    'Exponential change multiplies by a constant factor b each step. Write y = a·b^x with a = y(0).',
    'El cambio exponencial multiplica por un factor constante b cada paso. Escribe y = a·b^x con a = y(0).',
    'Zmiana wykładnicza mnoży przez stały czynnik b na każdym kroku. Zapisz y = a·b^x z a = y(0).',
  ),
  ['y=a\\cdot b^{x}', 'b>1:\\text{ growth};\\ 0<b<1:\\text{ decay}', '5,10,20,40:\\ b=2'],
  L(
    'Classify growth vs decay, identify a and b, and evaluate friendly integer powers.',
    'Clasifica crecimiento vs decaimiento, identifica a y b, y evalúa potencias enteras amables.',
    'Klasyfikuj wzrost vs zanikanie, identyfikuj a i b oraz obliczaj wygodne potęgi całkowite.',
  ),
  lesson19Items,
)

const lesson20 = pack(
  'alg1-l20',
  20,
  L(
    'Radical Expressions — Square Roots',
    'Expresiones radicales — raíces cuadradas',
    'Wyrażenia pierwiastkowe — pierwiastki kwadratowe',
  ),
  radKps,
  'lesson_board_20',
  ['lesson_board_21'],
  L('Teach: pull perfect squares', 'Enseñar: sacar cuadrados perfectos', 'Nauczanie: wyciąganie kwadratów'),
  L(
    '√ means the principal root. Factor the largest perfect square out of the radicand; multiply/divide by combining radicands.',
    '√ significa la raíz principal. Saca el mayor cuadrado perfecto del radicando; multiplica/divide combinando radicandos.',
    '√ oznacza pierwiastek główny. Wyciągnij największy kwadrat doskonały; mnoż/dziel łącząc podpierwiastkowe.',
  ),
  ['\\sqrt{k^{2}m}=k\\sqrt{m}', '\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{ab}', '\\sqrt{50}=5\\sqrt{2}'],
  L(
    'Evaluate perfect squares, simplify, and practice product/quotient of square roots.',
    'Evalúa cuadrados perfectos, simplifica y practica producto/cociente de raíces.',
    'Obliczaj kwadraty doskonałe, upraszczaj i ćwicz iloczyn/iloraz pierwiastków.',
  ),
  lesson20Items,
)

const lesson21 = pack(
  'alg1-l21',
  21,
  L(
    'Rational Expressions Intro',
    'Introducción a expresiones racionales',
    'Wstęp do wyrażeń wymiernych',
  ),
  ratKps,
  'lesson_board_21',
  ['lesson_board_22'],
  L('Teach: cancel factors', 'Enseñar: cancelar factores', 'Nauczanie: skracanie czynników'),
  L(
    'Factor first. Cancel only common factors (never terms in a sum). Division = multiply by the reciprocal.',
    'Factoriza primero. Cancela solo factores comunes (nunca términos de una suma). División = multiplicar por el recíproco.',
    'Najpierw rozłóż. Skracaj tylko wspólne czynniki (nigdy składników sumy). Dzielenie = mnożenie przez odwrotność.',
  ),
  [
    '\\frac{ac}{bc}=\\frac{a}{b}',
    '\\frac{a}{b}\\div\\frac{c}{d}=\\frac{a}{b}\\cdot\\frac{d}{c}',
    '\\frac{x^{2}-9}{x-3}=x+3\\ (x\\ne 3)',
  ],
  L(
    'Simplify monomials and binomials, then multiply and divide with canceling.',
    'Simplifica monomios y binomios; luego multiplica y divide cancelando.',
    'Upraszczaj jednomiany i dwumiany; potem mnoż i dziel ze skracaniem.',
  ),
  lesson21Items,
)

/* Localize teach bodyMath English words for ES/PL display is section-level shared —
   keep math-only bodyMath where possible. Patch L19 teach bodyMath to avoid EN-only text. */
lesson19.sections[1].bodyMath = [
  'y=a\\cdot b^{x}',
  'b>1:\\uparrow;\\quad 0<b<1:\\downarrow',
  '5,10,20,40:\\ b=2',
]

/* ─── Write outputs ─── */
lesson18.worldHook.unlockOnMastery = ['lesson_board_19']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-18.json', lesson18)
writeJson('lesson-19.json', lesson19)
writeJson('lesson-20.json', lesson20)
writeJson('lesson-21.json', lesson21)

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

function englishOrInEsPl(lesson) {
  let n = 0
  for (const it of lesson.items) {
    if (!it.choices) continue
    for (const loc of ['es', 'pl']) {
      for (const c of it.choices[loc] ?? []) {
        if (/\\text\{\s*or\s*\}/i.test(String(c))) n++
      }
    }
  }
  return n
}

const summary = {
  newKpIds: newKps.map((k) => k.id),
  lessons: [lesson19, lesson20, lesson21].map((l) => ({
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
    enOrInEsPlChoices: englishOrInEsPl(l),
  })),
  l18Unlock: lesson18.worldHook.unlockOnMastery,
}
console.log(JSON.stringify(summary, null, 2))
