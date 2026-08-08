/**
 * Wave 8 authoring: Algebra I Lessons 22–24 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l22-l24.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-22..24; confirms L21 unlockOnMastery → lesson_board_22;
 * L24 unlocks lesson_board_25 teaser.
 *
 * KaTeX: promptMath on every item; MC math choices in $...$.
 * Feedback: distinct EN/ES/PL prose.
 * No English filler in ES/PL KaTeX (o / lub, not "or").
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
const lesson21 = JSON.parse(readFileSync(join(outDir, 'lesson-21.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.absolute.meaning',
    title: L(
      'Interpret absolute value as distance',
      'Interpretar el valor absoluto como distancia',
      'Interpretować wartość bezwzględną jako odległość',
    ),
    prerequisites: ['kp.alg1.inequality.meaning', 'kp.alg1.solve.two.step'],
    successCriteria: L(
      'Student explains |x| as distance from 0 and evaluates |a| for integers a.',
      'El estudiante explica |x| como distancia desde 0 y evalúa |a| para enteros a.',
      'Uczeń wyjaśnia |x| jako odległość od 0 i oblicza |a| dla całkowitych a.',
    ),
    misconceptions: L(
      [
        'Treating absolute value as always making the inside negative',
        'Dropping bars without flipping signs when the inside is negative',
      ],
      [
        'Tratar el valor absoluto como si siempre volviera negativo el interior',
        'Quitar barras sin cambiar signos cuando el interior es negativo',
      ],
      [
        'Traktowanie wartości bezwzględnej jakby zawsze czyniła wnętrze ujemnym',
        'Usuwanie kresek bez zmiany znaków, gdy wnętrze jest ujemne',
      ],
    ),
    standards: [
      TX('A.5(A)', 'A.1(D)', 'A.1(F)'),
      CC('A-REI.B.3', '6.NS.C.7c'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.1'),
    ],
  },
  {
    id: 'kp.alg1.absolute.equations',
    title: L(
      'Solve absolute value equations',
      'Resolver ecuaciones de valor absoluto',
      'Rozwiązywać równania z wartością bezwzględną',
    ),
    prerequisites: ['kp.alg1.absolute.meaning', 'kp.alg1.solve.both.sides'],
    encompassing: ['kp.alg1.absolute.meaning'],
    successCriteria: L(
      'Student solves |ax+b| = c (c ≥ 0) by writing ax+b = c and ax+b = −c, then checks extraneous cases when c < 0.',
      'El estudiante resuelve |ax+b| = c (c ≥ 0) escribiendo ax+b = c y ax+b = −c, y verifica casos sin solución si c < 0.',
      'Uczeń rozwiązuje |ax+b| = c (c ≥ 0) zapisując ax+b = c oraz ax+b = −c i sprawdza brak rozwiązań gdy c < 0.',
    ),
    misconceptions: L(
      [
        'Writing only the positive case and missing the negative branch',
        'Believing |expression| = negative has two real solutions',
      ],
      [
        'Escribir solo el caso positivo y omitir la rama negativa',
        'Creer que |expresión| = negativo tiene dos soluciones reales',
      ],
      [
        'Zapisywanie tylko przypadku dodatniego i pomijanie ujemnej gałęzi',
        'Wiara, że |wyrażenie| = ujemne ma dwa rozwiązania rzeczywiste',
      ],
    ),
    standards: [
      TX('A.5(A)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.B.3', 'A-CED.A.1'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.1'),
    ],
  },
  {
    id: 'kp.alg1.absolute.inequalities',
    title: L(
      'Solve absolute value inequalities',
      'Resolver desigualdades de valor absoluto',
      'Rozwiązywać nierówności z wartością bezwzględną',
    ),
    prerequisites: ['kp.alg1.absolute.equations', 'kp.alg1.inequality.two.step'],
    encompassing: ['kp.alg1.absolute.equations'],
    successCriteria: L(
      'Student rewrites |ax+b| < c as a compound AND inequality and |ax+b| > c as a compound OR inequality (c > 0).',
      'El estudiante reescribe |ax+b| < c como desigualdad compuesta Y y |ax+b| > c como O (c > 0).',
      'Uczeń przepisuje |ax+b| < c jako złożoną nierówność I oraz |ax+b| > c jako LUB (c > 0).',
    ),
    misconceptions: L(
      [
        'Using OR for “less than” and AND for “greater than”',
        'Forgetting to flip inequality directions when multiplying by −1',
      ],
      [
        'Usar O para “menor que” y Y para “mayor que”',
        'Olvidar invertir desigualdades al multiplicar por −1',
      ],
      [
        'Używanie LUB dla „mniejsze niż” i I dla „większe niż”',
        'Zapominanie o odwróceniu nierówności przy mnożeniu przez −1',
      ],
    ),
    standards: [
      TX('A.5(B)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.B.3', 'A-CED.A.1'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.6'),
    ],
  },
  {
    id: 'kp.alg1.function.notation',
    title: L(
      'Use function notation f(x)',
      'Usar la notación de función f(x)',
      'Stosować notację funkcyjną f(x)',
    ),
    prerequisites: ['kp.alg1.function.linear.intro', 'kp.alg1.eval.substitute'],
    successCriteria: L(
      'Student evaluates f(a) by substituting x = a into the rule and distinguishes f(x) from f · x.',
      'El estudiante evalúa f(a) sustituyendo x = a en la regla y distingue f(x) de f · x.',
      'Uczeń oblicza f(a) podstawiając x = a do wzoru i odróżnia f(x) od f · x.',
    ),
    misconceptions: L(
      [
        'Reading f(x) as “f times x”',
        'Substituting into the wrong place or leaving x in the answer',
      ],
      [
        'Leer f(x) como “f por x”',
        'Sustituir en el lugar incorrecto o dejar x en la respuesta',
      ],
      [
        'Czytanie f(x) jako „f razy x”',
        'Podstawianie w złe miejsce lub zostawianie x w odpowiedzi',
      ],
    ),
    standards: [
      TX('A.12(B)', 'A.1(D)', 'A.1(F)'),
      CC('F-IF.A.2', 'F-IF.A.1'),
      CA('F-IF.2'),
      FL('MA.912.F.1.2'),
    ],
  },
  {
    id: 'kp.alg1.function.domain',
    title: L(
      'Identify domain of simple functions',
      'Identificar el dominio de funciones simples',
      'Wyznaczać dziedzinę prostych funkcji',
    ),
    prerequisites: ['kp.alg1.function.notation'],
    successCriteria: L(
      'Student names the set of allowed inputs for linear rules and simple restrictions (e.g. nonzero denominators).',
      'El estudiante nombra el conjunto de entradas permitidas para reglas lineales y restricciones simples (p. ej. denominadores no nulos).',
      'Uczeń podaje zbiór dopuszczalnych argumentów dla reguł liniowych i prostych ograniczeń (np. mianownik ≠ 0).',
    ),
    misconceptions: L(
      [
        'Confusing domain (inputs) with range (outputs)',
        'Ignoring restrictions that exclude values from the domain',
      ],
      [
        'Confundir dominio (entradas) con rango (salidas)',
        'Ignorar restricciones que excluyen valores del dominio',
      ],
      [
        'Mylenie dziedziny (argumenty) z przeciwdziedziną (wartości)',
        'Ignorowanie ograniczeń wykluczających wartości z dziedziny',
      ],
    ),
    standards: [
      TX('A.2(A)', 'A.12(A)', 'A.1(D)'),
      CC('F-IF.A.1', 'F-IF.A.2'),
      CA('F-IF.1'),
      FL('MA.912.F.1.1'),
    ],
  },
  {
    id: 'kp.alg1.function.range',
    title: L(
      'Identify range of simple functions',
      'Identificar el rango de funciones simples',
      'Wyznaczać przeciwdziedzinę prostych funkcji',
    ),
    prerequisites: ['kp.alg1.function.domain', 'kp.alg1.function.notation'],
    encompassing: ['kp.alg1.function.domain'],
    successCriteria: L(
      'Student finds possible outputs from a rule, table, or graph for linear and simple discrete cases.',
      'El estudiante halla salidas posibles a partir de una regla, tabla o gráfica en casos lineales y discretos simples.',
      'Uczeń znajduje możliwe wartości z wzoru, tabeli lub wykresu dla przypadków liniowych i prostych dyskretnych.',
    ),
    misconceptions: L(
      [
        'Listing inputs when asked for range',
        'Assuming every linear function’s range is all real numbers without checking context',
      ],
      [
        'Listar entradas cuando se pide el rango',
        'Asumir que el rango de toda lineal es todos los reales sin mirar el contexto',
      ],
      [
        'Wypisywanie argumentów zamiast wartości',
        'Zakładanie, że przeciwdziedzina każdej funkcji liniowej to wszystkie reals bez kontekstu',
      ],
    ),
    standards: [
      TX('A.2(A)', 'A.12(B)', 'A.1(D)'),
      CC('F-IF.A.1', 'F-IF.A.2'),
      CA('F-IF.1'),
      FL('MA.912.F.1.1'),
    ],
  },
  {
    id: 'kp.alg1.sequence.arithmetic',
    title: L(
      'Recognize arithmetic sequences',
      'Reconocer sucesiones aritméticas',
      'Rozpoznawać ciągi arytmetyczne',
    ),
    prerequisites: ['kp.alg1.rate.of.change', 'kp.alg1.function.linear.intro'],
    successCriteria: L(
      'Student identifies a common difference d and finds the next term of an arithmetic sequence.',
      'El estudiante identifica una diferencia común d y halla el siguiente término de una sucesión aritmética.',
      'Uczeń identyfikuje wspólną różnicę d i znajduje następny wyraz ciągu arytmetycznego.',
    ),
    misconceptions: L(
      [
        'Using a ratio when the pattern is additive',
        'Computing d from non-consecutive terms without dividing by the step count',
      ],
      [
        'Usar una razón cuando el patrón es aditivo',
        'Calcular d entre términos no consecutivos sin dividir por el número de pasos',
      ],
      [
        'Używanie ilorazu, gdy wzorzec jest addytywny',
        'Obliczanie d między niekolejnymi wyrazami bez dzielenia przez liczbę kroków',
      ],
    ),
    standards: [
      TX('A.12(C)', 'A.1(D)', 'A.1(F)'),
      CC('F-BF.A.2', 'F-LE.A.2'),
      CA('F-BF.2'),
      FL('MA.912.AR.5.1'),
    ],
  },
  {
    id: 'kp.alg1.sequence.geometric',
    title: L(
      'Recognize geometric sequences',
      'Reconocer sucesiones geométricas',
      'Rozpoznawać ciągi geometryczne',
    ),
    prerequisites: ['kp.alg1.exponential.recognize', 'kp.alg1.sequence.arithmetic'],
    successCriteria: L(
      'Student identifies a common ratio r and finds the next term of a geometric sequence.',
      'El estudiante identifica una razón común r y halla el siguiente término de una sucesión geométrica.',
      'Uczeń identyfikuje wspólny iloraz r i znajduje następny wyraz ciągu geometrycznego.',
    ),
    misconceptions: L(
      [
        'Adding a constant when the pattern multiplies',
        'Mixing up common difference with common ratio',
      ],
      [
        'Sumar una constante cuando el patrón multiplica',
        'Confundir diferencia común con razón común',
      ],
      [
        'Dodawanie stałej, gdy wzorzec mnoży',
        'Mylenie wspólnej różnicy ze wspólnym ilorazem',
      ],
    ),
    standards: [
      TX('A.12(C)', 'A.1(D)', 'A.1(F)'),
      CC('F-BF.A.2', 'F-LE.A.2'),
      CA('F-BF.2'),
      FL('MA.912.AR.5.1'),
    ],
  },
  {
    id: 'kp.alg1.sequence.nth.term',
    title: L(
      'Write nth-term formulas for sequences',
      'Escribir fórmulas del término n-ésimo',
      'Zapisywać wzory na n-ty wyraz ciągu',
    ),
    prerequisites: ['kp.alg1.sequence.arithmetic', 'kp.alg1.sequence.geometric'],
    encompassing: ['kp.alg1.sequence.arithmetic', 'kp.alg1.sequence.geometric'],
    successCriteria: L(
      'Student writes a_n = a_1 + (n−1)d or a_n = a_1 · r^(n−1) and evaluates for small n.',
      'El estudiante escribe a_n = a_1 + (n−1)d o a_n = a_1 · r^(n−1) y evalúa para n pequeños.',
      'Uczeń zapisuje a_n = a_1 + (n−1)d lub a_n = a_1 · r^(n−1) i oblicza dla małych n.',
    ),
    misconceptions: L(
      [
        'Using n instead of (n−1) in the explicit formula',
        'Applying an arithmetic formula to a geometric sequence',
      ],
      [
        'Usar n en lugar de (n−1) en la fórmula explícita',
        'Aplicar una fórmula aritmética a una sucesión geométrica',
      ],
      [
        'Używanie n zamiast (n−1) we wzorze jawnym',
        'Stosowanie wzoru arytmetycznego do ciągu geometrycznego',
      ],
    ),
    standards: [
      TX('A.12(D)', 'A.12(C)', 'A.1(F)'),
      CC('F-BF.A.2', 'F-BF.A.1a'),
      CA('F-BF.2'),
      FL('MA.912.AR.5.3'),
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

const absKps = [
  'kp.alg1.absolute.meaning',
  'kp.alg1.absolute.equations',
  'kp.alg1.absolute.inequalities',
]
const fnKps = [
  'kp.alg1.function.notation',
  'kp.alg1.function.domain',
  'kp.alg1.function.range',
]
const seqKps = [
  'kp.alg1.sequence.arithmetic',
  'kp.alg1.sequence.geometric',
  'kp.alg1.sequence.nth.term',
]

addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.absolute.equations',
  'kp.alg1.absolute.inequalities',
])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.absolute.meaning',
  ...fnKps,
  'kp.alg1.sequence.arithmetic',
  'kp.alg1.sequence.geometric',
])
addKpsToExisting('TX', 'A.1(F)', [...absKps, ...fnKps, ...seqKps])
addKpsToExisting('TX', 'A.5(A)', ['kp.alg1.absolute.meaning', 'kp.alg1.absolute.equations'])
addKpsToExisting('TX', 'A.5(B)', ['kp.alg1.absolute.inequalities'])
addKpsToExisting('TX', 'A.2(A)', ['kp.alg1.function.domain', 'kp.alg1.function.range'])
addKpsToExisting('TX', 'A.12(B)', ['kp.alg1.function.notation', 'kp.alg1.function.range'])
addKpsToExisting('CCSS', 'A-REI.B.3', absKps)
addKpsToExisting('CCSS', 'F-IF.A.1', fnKps)
addKpsToExisting('CCSS', 'F-LE.A.2', seqKps)

ensureCode(
  'TX',
  'A.12(A)',
  L(
    'Decide whether relations represented verbally, tabularly, graphically, and symbolically define a function',
    'Decidir si relaciones representadas verbal, tabular, gráfica y simbólicamente definen una función',
    'Rozstrzygać, czy relacje przedstawione słownie, tabelarycznie, graficznie i symbolicznie definiują funkcję',
  ),
  ['kp.alg1.function.domain', 'kp.alg1.function.notation'],
)
ensureCode(
  'TX',
  'A.12(C)',
  L(
    'Identify terms of arithmetic and geometric sequences when the sequences are given using function notation or recursive formulas',
    'Identificar términos de sucesiones aritméticas y geométricas dadas en notación de función o fórmulas recursivas',
    'Identyfikować wyrazy ciągów arytmetycznych i geometrycznych danych w notacji funkcyjnej lub wzorach rekurencyjnych',
  ),
  seqKps,
)
ensureCode(
  'TX',
  'A.12(D)',
  L(
    'Write a formula for the nth term of arithmetic and geometric sequences, given the value of several of their terms',
    'Escribir una fórmula para el término n-ésimo de sucesiones aritméticas y geométricas, dados varios términos',
    'Zapisywać wzór na n-ty wyraz ciągów arytmetycznych i geometrycznych, mając kilka wyrazów',
  ),
  ['kp.alg1.sequence.nth.term'],
)
ensureCode(
  'CCSS',
  'A-CED.A.1',
  L(
    'Create equations and inequalities in one variable and use them to solve problems',
    'Crear ecuaciones y desigualdades en una variable y usarlas para resolver problemas',
    'Tworzyć równania i nierówności jednej zmiennej i używać ich do rozwiązywania problemów',
  ),
  ['kp.alg1.absolute.equations', 'kp.alg1.absolute.inequalities'],
)
ensureCode(
  'CCSS',
  'F-IF.A.2',
  L(
    'Use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context',
    'Usar notación de función, evaluar funciones para entradas en sus dominios e interpretar enunciados con notación de función en contexto',
    'Stosować notację funkcyjną, obliczać wartości dla argumentów z dziedziny i interpretować zapisy z notacją funkcyjną w kontekście',
  ),
  fnKps,
)
ensureCode(
  'CCSS',
  'F-BF.A.1a',
  L(
    'Determine an explicit expression, a recursive process, or steps for calculation from a context',
    'Determinar una expresión explícita, un proceso recursivo o pasos de cálculo a partir de un contexto',
    'Wyznaczać wyrażenie jawne, proces rekurencyjny lub kroki obliczeń z kontekstu',
  ),
  ['kp.alg1.sequence.nth.term'],
)
ensureCode(
  'CCSS',
  'F-BF.A.2',
  L(
    'Write arithmetic and geometric sequences both recursively and with an explicit formula, use them to model situations, and translate between the two forms',
    'Escribir sucesiones aritméticas y geométricas de forma recursiva y con fórmula explícita, modelar situaciones y traducir entre ambas formas',
    'Zapisywać ciągi arytmetyczne i geometryczne rekurencyjnie i jawnym wzorem, modelować sytuacje i przechodzić między formami',
  ),
  seqKps,
)
ensureCode(
  'CCSS',
  '6.NS.C.7c',
  L(
    'Understand the absolute value of a rational number as its distance from 0 on the number line',
    'Entender el valor absoluto de un racional como su distancia a 0 en la recta numérica',
    'Rozumieć wartość bezwzględną liczby wymiernej jako odległość od 0 na osi liczbowej',
  ),
  ['kp.alg1.absolute.meaning'],
)

existingStd.lessonCoverage['alg1-l22'] = [
  'A.5(A)',
  'A.5(B)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-REI.B.3',
  'A-CED.A.1',
  '6.NS.C.7c',
]
existingStd.lessonCoverage['alg1-l23'] = [
  'A.12(A)',
  'A.12(B)',
  'A.2(A)',
  'A.1(D)',
  'A.1(F)',
  'F-IF.A.1',
  'F-IF.A.2',
]
existingStd.lessonCoverage['alg1-l24'] = [
  'A.12(C)',
  'A.12(D)',
  'A.1(D)',
  'A.1(F)',
  'F-BF.A.1a',
  'F-BF.A.2',
  'F-LE.A.2',
]

const l22Mean = [TX('A.5(A)', 'A.1(D)', 'A.1(F)'), CC('A-REI.B.3', '6.NS.C.7c')]
const l22Eq = [TX('A.5(A)', 'A.1(B)', 'A.1(F)'), CC('A-REI.B.3', 'A-CED.A.1')]
const l22Ineq = [TX('A.5(B)', 'A.1(B)', 'A.1(F)'), CC('A-REI.B.3', 'A-CED.A.1')]

const l23Not = [TX('A.12(B)', 'A.1(D)', 'A.1(F)'), CC('F-IF.A.2', 'F-IF.A.1')]
const l23Dom = [TX('A.2(A)', 'A.12(A)', 'A.1(D)'), CC('F-IF.A.1', 'F-IF.A.2')]
const l23Rng = [TX('A.2(A)', 'A.12(B)', 'A.1(D)'), CC('F-IF.A.1', 'F-IF.A.2')]

const l24Ar = [TX('A.12(C)', 'A.1(D)', 'A.1(F)'), CC('F-BF.A.2', 'F-LE.A.2')]
const l24Ge = [TX('A.12(C)', 'A.1(D)', 'A.1(F)'), CC('F-BF.A.2', 'F-LE.A.2')]
const l24Nth = [TX('A.12(D)', 'A.12(C)', 'A.1(F)'), CC('F-BF.A.2', 'F-BF.A.1a')]

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
   LESSON 22 — Absolute value eq & ineq
   ═══════════════════════════════════════ */
const l22Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.absolute.meaning',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'What is |−7|?',
      '¿Cuánto es |−7|?',
      'Ile wynosi |−7|?',
    ),
    math: '|{-7}|',
    choices0: mathChoices('7', '-7', '0', '14'),
    fc: L(
      'Absolute value is distance from 0, so |−7| = 7.',
      'El valor absoluto es la distancia a 0, así |−7| = 7.',
      'Wartość bezwzględna to odległość od 0, więc |−7| = 7.',
    ),
    fi: L(
      'Distance is never negative — strip the sign after taking absolute value.',
      'La distancia nunca es negativa: quita el signo al tomar valor absoluto.',
      'Odległość nigdy nie jest ujemna — usuń znak po wzięciu wartości bezwzględnej.',
    ),
    tags: ['sign_error', 'double_magnitude'],
    stds: l22Mean,
    num: 7,
  },
  {
    id: 't02',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Solve |x| = 5. Which pair is correct?',
      'Resuelve |x| = 5. ¿Cuál par es correcto?',
      'Rozwiąż |x| = 5. Która para jest poprawna?',
    ),
    math: '|x|=5',
    choices0: mathChoicesL(
      ['x=5\\ \\text{ or }\\ x=-5', 'x=5\\ \\text{ only}', 'x=-5\\ \\text{ only}', 'x=0'],
      ['x=5\\ \\text{ o }\\ x=-5', 'x=5\\ \\text{ solo}', 'x=-5\\ \\text{ solo}', 'x=0'],
      ['x=5\\ \\text{ lub }\\ x=-5', 'x=5\\ \\text{ tylko}', 'x=-5\\ \\text{ tylko}', 'x=0'],
    ),
    fc: L(
      'Distance 5 from 0 means x = 5 or x = −5.',
      'Distancia 5 desde 0 significa x = 5 o x = −5.',
      'Odległość 5 od 0 oznacza x = 5 lub x = −5.',
    ),
    fi: L(
      'Absolute value equations usually split into two linear cases when the right side is positive.',
      'Las ecuaciones de valor absoluto suelen dividirse en dos casos lineales si el lado derecho es positivo.',
      'Równania z wartością bezwzględną zwykle rozdzielają się na dwa przypadki liniowe, gdy prawa strona jest dodatnia.',
    ),
    tags: ['miss_negative_branch', 'zero_confusion'],
    stds: l22Eq,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.absolute.meaning',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'On a number line, |x − 2| means the distance between x and which number?',
      'En la recta, |x − 2| es la distancia entre x y qué número?',
      'Na osi |x − 2| to odległość między x a jaką liczbą?',
    ),
    math: '|x-2|',
    choices0: mathChoices('2', '0', '-2', 'x'),
    fc: L(
      '|x − a| is distance from x to a, so here a = 2.',
      '|x − a| es la distancia de x a a; aquí a = 2.',
      '|x − a| to odległość x od a; tu a = 2.',
    ),
    fi: L(
      'Think “distance to the number being subtracted,” not to zero unless a = 0.',
      'Piensa “distancia al número que se resta,” no a cero salvo que a = 0.',
      'Myśl „odległość od odejmowanej liczby”, nie od zera, chyba że a = 0.',
    ),
    tags: ['center_wrong', 'zero_default'],
    stds: l22Mean,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Solve |2x − 1| = 7. What are the solutions?',
      'Resuelve |2x − 1| = 7. ¿Cuáles son las soluciones?',
      'Rozwiąż |2x − 1| = 7. Jakie są rozwiązania?',
    ),
    math: '|2x-1|=7',
    choices0: mathChoicesL(
      ['x=4\\ \\text{ or }\\ x=-3', 'x=4\\ \\text{ only}', 'x=3\\ \\text{ or }\\ x=-4', 'x=\\tfrac82'],
      ['x=4\\ \\text{ o }\\ x=-3', 'x=4\\ \\text{ solo}', 'x=3\\ \\text{ o }\\ x=-4', 'x=\\tfrac82'],
      ['x=4\\ \\text{ lub }\\ x=-3', 'x=4\\ \\text{ tylko}', 'x=3\\ \\text{ lub }\\ x=-4', 'x=\\tfrac82'],
    ),
    fc: L(
      'Split: 2x − 1 = 7 → x = 4; 2x − 1 = −7 → x = −3.',
      'Divide: 2x − 1 = 7 → x = 4; 2x − 1 = −7 → x = −3.',
      'Rozdziel: 2x − 1 = 7 → x = 4; 2x − 1 = −7 → x = −3.',
    ),
    fi: L(
      'Set the inside equal to 7 and to −7, then solve each linear equation.',
      'Iguala el interior a 7 y a −7; luego resuelve cada ecuación lineal.',
      'Przyrównaj wnętrze do 7 i do −7, potem rozwiąż każde równanie liniowe.',
    ),
    tags: ['miss_branch', 'arithmetic_error'],
    stds: l22Eq,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.45,
    b: -0.1,
    prompt: L(
      'How many real solutions does |x + 3| = −2 have?',
      '¿Cuántas soluciones reales tiene |x + 3| = −2?',
      'Ile rozwiązań rzeczywistych ma |x + 3| = −2?',
    ),
    math: '|x+3|=-2',
    choices0: mathChoices('0', '1', '2', '3'),
    fc: L(
      'Absolute value cannot equal a negative number — no real solutions.',
      'El valor absoluto no puede igualar un negativo: no hay soluciones reales.',
      'Wartość bezwzględna nie może równać się liczbie ujemnej — brak rozwiązań rzeczywistych.',
    ),
    fi: L(
      'The left side is always ≥ 0, so it can never equal −2.',
      'El lado izquierdo siempre es ≥ 0, así que nunca iguala −2.',
      'Lewa strona zawsze jest ≥ 0, więc nigdy nie równa się −2.',
    ),
    tags: ['negative_rhs', 'force_two_solutions'],
    stds: l22Eq,
    num: 0,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.absolute.inequalities',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Which compound inequality matches |x| < 4?',
      '¿Qué desigualdad compuesta corresponde a |x| < 4?',
      'Która złożona nierówność odpowiada |x| < 4?',
    ),
    math: '|x|<4',
    choices0: mathChoicesL(
      ['-4<x<4', 'x<-4\\ \\text{ or }\\ x>4', 'x<-4', 'x>4'],
      ['-4<x<4', 'x<-4\\ \\text{ o }\\ x>4', 'x<-4', 'x>4'],
      ['-4<x<4', 'x<-4\\ \\text{ lub }\\ x>4', 'x<-4', 'x>4'],
    ),
    fc: L(
      '“Less than” absolute value is an AND interval between −c and c.',
      '“Menor que” en valor absoluto es un intervalo Y entre −c y c.',
      '„Mniejsze niż” przy wartości bezwzględnej to przedział I między −c a c.',
    ),
    fi: L(
      'Do not use the OR outside form — that is for |x| > 4.',
      'No uses la forma O exterior: esa es para |x| > 4.',
      'Nie używaj formy LUB na zewnątrz — to dla |x| > 4.',
    ),
    tags: ['and_or_swap', 'endpoint_error'],
    stds: l22Ineq,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.absolute.inequalities',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Which describes |x − 1| ≥ 3?',
      '¿Cuál describe |x − 1| ≥ 3?',
      'Co opisuje |x − 1| ≥ 3?',
    ),
    math: '|x-1|\\ge 3',
    choices0: mathChoicesL(
      ['x\\le -2\\ \\text{ or }\\ x\\ge 4', '-2\\le x\\le 4', 'x\\ge 4\\ \\text{ only}', 'x\\le -2\\ \\text{ only}'],
      ['x\\le -2\\ \\text{ o }\\ x\\ge 4', '-2\\le x\\le 4', 'x\\ge 4\\ \\text{ solo}', 'x\\le -2\\ \\text{ solo}'],
      ['x\\le -2\\ \\text{ lub }\\ x\\ge 4', '-2\\le x\\le 4', 'x\\ge 4\\ \\text{ tylko}', 'x\\le -2\\ \\text{ tylko}'],
    ),
    fc: L(
      'x − 1 ≤ −3 or x − 1 ≥ 3 → x ≤ −2 or x ≥ 4.',
      'x − 1 ≤ −3 o x − 1 ≥ 3 → x ≤ −2 o x ≥ 4.',
      'x − 1 ≤ −3 lub x − 1 ≥ 3 → x ≤ −2 lub x ≥ 4.',
    ),
    fi: L(
      'Greater-than absolute value opens outward as an OR compound inequality.',
      'Mayor-que en valor absoluto se abre hacia afuera como desigualdad O.',
      'Większe-niż przy wartości bezwzględnej otwiera się na zewnątrz jako nierówność LUB.',
    ),
    tags: ['and_or_swap', 'center_shift'],
    stds: l22Ineq,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.absolute.meaning',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Evaluate |3 − 8|.',
      'Evalúa |3 − 8|.',
      'Oblicz |3 − 8|.',
    ),
    math: '|3-8|',
    choices0: mathChoices('5', '-5', '11', '3'),
    fc: L(
      '3 − 8 = −5, and |−5| = 5.',
      '3 − 8 = −5, y |−5| = 5.',
      '3 − 8 = −5, a |−5| = 5.',
    ),
    fi: L(
      'Simplify inside first, then take absolute value of the result.',
      'Simplifica primero el interior; luego toma el valor absoluto.',
      'Najpierw uprość wnętrze, potem weź wartość bezwzględną wyniku.',
    ),
    tags: ['order_ops', 'sign_error'],
    stds: l22Mean,
    num: 5,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'Solve |x + 4| = 9.',
      'Resuelve |x + 4| = 9.',
      'Rozwiąż |x + 4| = 9.',
    ),
    math: '|x+4|=9',
    choices0: mathChoicesL(
      ['x=5\\ \\text{ or }\\ x=-13', 'x=5\\ \\text{ only}', 'x=13\\ \\text{ or }\\ x=-5', 'x=-4'],
      ['x=5\\ \\text{ o }\\ x=-13', 'x=5\\ \\text{ solo}', 'x=13\\ \\text{ o }\\ x=-5', 'x=-4'],
      ['x=5\\ \\text{ lub }\\ x=-13', 'x=5\\ \\text{ tylko}', 'x=13\\ \\text{ lub }\\ x=-5', 'x=-4'],
    ),
    fc: L(
      'Both cases: x + 4 = 9 → x = 5; x + 4 = −9 → x = −13.',
      'Ambos casos: x + 4 = 9 → x = 5; x + 4 = −9 → x = −13.',
      'Oba przypadki: x + 4 = 9 → x = 5; x + 4 = −9 → x = −13.',
    ),
    fi: L(
      'Solve both x + 4 = 9 and x + 4 = −9.',
      'Resuelve tanto x + 4 = 9 como x + 4 = −9.',
      'Rozwiąż zarówno x + 4 = 9, jak i x + 4 = −9.',
    ),
    tags: ['miss_branch', 'sign_flip_error'],
    stds: l22Eq,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.55,
    b: 0.25,
    prompt: L(
      'Solve |3x| = 12.',
      'Resuelve |3x| = 12.',
      'Rozwiąż |3x| = 12.',
    ),
    math: '|3x|=12',
    choices0: mathChoicesL(
      ['x=4\\ \\text{ or }\\ x=-4', 'x=4\\ \\text{ only}', 'x=36', 'x=\\tfrac{1}{4}'],
      ['x=4\\ \\text{ o }\\ x=-4', 'x=4\\ \\text{ solo}', 'x=36', 'x=\\tfrac{1}{4}'],
      ['x=4\\ \\text{ lub }\\ x=-4', 'x=4\\ \\text{ tylko}', 'x=36', 'x=\\tfrac{1}{4}'],
    ),
    fc: L(
      '3x = 12 or 3x = −12 → x = 4 or x = −4.',
      '3x = 12 o 3x = −12 → x = 4 o x = −4.',
      '3x = 12 lub 3x = −12 → x = 4 lub x = −4.',
    ),
    fi: L(
      'Divide both cases by 3; do not cube or invert incorrectly.',
      'Divide ambos casos entre 3; no eleves al cubo ni inviertas mal.',
      'Podziel oba przypadki przez 3; nie potęguj ani nie odwracaj błędnie.',
    ),
    tags: ['miss_branch', 'scale_error'],
    stds: l22Eq,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.absolute.inequalities',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Solve |x| > 2.',
      'Resuelve |x| > 2.',
      'Rozwiąż |x| > 2.',
    ),
    math: '|x|>2',
    choices0: mathChoicesL(
      ['x<-2\\ \\text{ or }\\ x>2', '-2<x<2', 'x>2\\ \\text{ only}', 'x<-2\\ \\text{ only}'],
      ['x<-2\\ \\text{ o }\\ x>2', '-2<x<2', 'x>2\\ \\text{ solo}', 'x<-2\\ \\text{ solo}'],
      ['x<-2\\ \\text{ lub }\\ x>2', '-2<x<2', 'x>2\\ \\text{ tylko}', 'x<-2\\ \\text{ tylko}'],
    ),
    fc: L(
      'Outside the interval (−2, 2): x < −2 or x > 2.',
      'Fuera del intervalo (−2, 2): x < −2 o x > 2.',
      'Na zewnątrz przedziału (−2, 2): x < −2 lub x > 2.',
    ),
    fi: L(
      'Greater-than uses OR rays, not the AND middle interval.',
      'Mayor-que usa rayos O, no el intervalo Y del medio.',
      'Większe-niż używa promieni LUB, nie środkowego przedziału I.',
    ),
    tags: ['and_or_swap'],
    stds: l22Ineq,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.absolute.inequalities',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Solve |2x + 1| ≤ 5.',
      'Resuelve |2x + 1| ≤ 5.',
      'Rozwiąż |2x + 1| ≤ 5.',
    ),
    math: '|2x+1|\\le 5',
    choices0: mathChoicesL(
      ['-3\\le x\\le 2', 'x\\le -3\\ \\text{ or }\\ x\\ge 2', '-5\\le x\\le 5', 'x\\ge 2'],
      ['-3\\le x\\le 2', 'x\\le -3\\ \\text{ o }\\ x\\ge 2', '-5\\le x\\le 5', 'x\\ge 2'],
      ['-3\\le x\\le 2', 'x\\le -3\\ \\text{ lub }\\ x\\ge 2', '-5\\le x\\le 5', 'x\\ge 2'],
    ),
    fc: L(
      'AND chain: −5 ≤ 2x + 1 ≤ 5 → −6 ≤ 2x ≤ 4 → −3 ≤ x ≤ 2.',
      'Cadena Y: −5 ≤ 2x + 1 ≤ 5 → −6 ≤ 2x ≤ 4 → −3 ≤ x ≤ 2.',
      'Łańcuch I: −5 ≤ 2x + 1 ≤ 5 → −6 ≤ 2x ≤ 4 → −3 ≤ x ≤ 2.',
    ),
    fi: L(
      'Less-than-or-equal absolute value is a closed AND interval; solve both sides carefully.',
      'Menor-o-igual en valor absoluto es un intervalo Y cerrado; resuelve ambos lados con cuidado.',
      'Mniejsze-równe przy wartości bezwzględnej to domknięty przedział I; rozwiąż obie strony ostrożnie.',
    ),
    tags: ['and_or_swap', 'scale_error'],
    stds: l22Ineq,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.absolute.meaning',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Which statement is always true?',
      '¿Cuál enunciado es siempre verdadero?',
      'Które stwierdzenie jest zawsze prawdziwe?',
    ),
    math: '|a|\\ge 0',
    choices0: L(
      ['|a| ≥ 0 for every real a', '|a| is always equal to a', '|a| is always negative', '|a| = −a always'],
      ['|a| ≥ 0 para todo real a', '|a| siempre es igual a a', '|a| siempre es negativo', '|a| = −a siempre'],
      ['|a| ≥ 0 dla każdego rzeczywistego a', '|a| zawsze równa się a', '|a| zawsze jest ujemne', '|a| = −a zawsze'],
    ),
    fc: L(
      'Absolute value is a nonnegative distance for every real number.',
      'El valor absoluto es una distancia no negativa para todo real.',
      'Wartość bezwzględna to nieujemna odległość dla każdej liczby rzeczywistej.',
    ),
    fi: L(
      '|a| equals a only when a ≥ 0; it equals −a when a < 0.',
      '|a| iguala a solo si a ≥ 0; iguala −a cuando a < 0.',
      '|a| równa się a tylko gdy a ≥ 0; równa się −a gdy a < 0.',
    ),
    tags: ['identity_confusion', 'always_negative'],
    stds: l22Mean,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.6,
    b: 0.45,
    prompt: L(
      'Solve |4 − x| = 6.',
      'Resuelve |4 − x| = 6.',
      'Rozwiąż |4 − x| = 6.',
    ),
    math: '|4-x|=6',
    choices0: mathChoicesL(
      ['x=-2\\ \\text{ or }\\ x=10', 'x=2\\ \\text{ or }\\ x=-10', 'x=10\\ \\text{ only}', 'x=-2\\ \\text{ only}'],
      ['x=-2\\ \\text{ o }\\ x=10', 'x=2\\ \\text{ o }\\ x=-10', 'x=10\\ \\text{ solo}', 'x=-2\\ \\text{ solo}'],
      ['x=-2\\ \\text{ lub }\\ x=10', 'x=2\\ \\text{ lub }\\ x=-10', 'x=10\\ \\text{ tylko}', 'x=-2\\ \\text{ tylko}'],
    ),
    fc: L(
      'Cases: 4 − x = 6 → x = −2; 4 − x = −6 → x = 10.',
      'Casos: 4 − x = 6 → x = −2; 4 − x = −6 → x = 10.',
      'Przypadki: 4 − x = 6 → x = −2; 4 − x = −6 → x = 10.',
    ),
    fi: L(
      'Watch the subtracted variable: solve 4 − x = ±6 carefully.',
      'Cuidado con la variable restada: resuelve 4 − x = ±6 con cuidado.',
      'Uważaj na odejmowaną zmienną: rozwiąż 4 − x = ±6 ostrożnie.',
    ),
    tags: ['variable_on_right', 'miss_branch'],
    stds: l22Eq,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.absolute.inequalities',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Solve |x + 2| < 1.',
      'Resuelve |x + 2| < 1.',
      'Rozwiąż |x + 2| < 1.',
    ),
    math: '|x+2|<1',
    choices0: mathChoicesL(
      ['-3<x<-1', 'x<-3\\ \\text{ or }\\ x>-1', '-1<x<3', 'x>-1'],
      ['-3<x<-1', 'x<-3\\ \\text{ o }\\ x>-1', '-1<x<3', 'x>-1'],
      ['-3<x<-1', 'x<-3\\ \\text{ lub }\\ x>-1', '-1<x<3', 'x>-1'],
    ),
    fc: L(
      'Subtract 2 throughout: −1 < x + 2 < 1 → −3 < x < −1.',
      'Resta 2 en toda la cadena: −1 < x + 2 < 1 → −3 < x < −1.',
      'Odejmij 2 w całym łańcuchu: −1 < x + 2 < 1 → −3 < x < −1.',
    ),
    fi: L(
      'Shift the center left by 2; keep the AND interval open.',
      'Desplaza el centro 2 a la izquierda; mantén el intervalo Y abierto.',
      'Przesuń środek o 2 w lewo; zachowaj otwarty przedział I.',
    ),
    tags: ['center_shift', 'and_or_swap'],
    stds: l22Ineq,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.absolute.equations',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'If |x| = 0, what is x?',
      'Si |x| = 0, ¿cuánto es x?',
      'Jeśli |x| = 0, ile wynosi x?',
    ),
    math: '|x|=0',
    choices0: L(
      ['$0$', '$1$', '$-1$', 'no solution'],
      ['$0$', '$1$', '$-1$', 'sin solución'],
      ['$0$', '$1$', '$-1$', 'brak rozwiązania'],
    ),
    fc: L(
      'Only 0 is distance 0 from the origin, so x = 0.',
      'Solo 0 está a distancia 0 del origen, así x = 0.',
      'Tylko 0 ma odległość 0 od początku, więc x = 0.',
    ),
    fi: L(
      'This is the unique case with one solution — not two branches.',
      'Este es el caso único con una solución — no dos ramas.',
      'To jedyny przypadek z jednym rozwiązaniem — nie dwie gałęzie.',
    ),
    tags: ['zero_case', 'force_two'],
    stds: l22Eq,
    num: 0,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.absolute.inequalities',
    diff: 0.7,
    b: 0.65,
    prompt: L(
      'Solve |3x − 6| > 9.',
      'Resuelve |3x − 6| > 9.',
      'Rozwiąż |3x − 6| > 9.',
    ),
    math: '|3x-6|>9',
    choices0: mathChoicesL(
      ['x<-1\\ \\text{ or }\\ x>5', '-1<x<5', 'x>5\\ \\text{ only}', 'x<-1\\ \\text{ only}'],
      ['x<-1\\ \\text{ o }\\ x>5', '-1<x<5', 'x>5\\ \\text{ solo}', 'x<-1\\ \\text{ solo}'],
      ['x<-1\\ \\text{ lub }\\ x>5', '-1<x<5', 'x>5\\ \\text{ tylko}', 'x<-1\\ \\text{ tylko}'],
    ),
    fc: L(
      '3x − 6 < −9 or 3x − 6 > 9 → x < −1 or x > 5.',
      '3x − 6 < −9 o 3x − 6 > 9 → x < −1 o x > 5.',
      '3x − 6 < −9 lub 3x − 6 > 9 → x < −1 lub x > 5.',
    ),
    fi: L(
      'Divide by 3 carefully on both OR branches after isolating.',
      'Divide entre 3 con cuidado en ambas ramas O tras aislar.',
      'Podziel przez 3 ostrożnie na obu gałęziach LUB po izolacji.',
    ),
    tags: ['and_or_swap', 'scale_error'],
    stds: l22Ineq,
  },
]

/* ═══════════════════════════════════════
   LESSON 23 — Function notation / domain / range
   ═══════════════════════════════════════ */
const l23Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.function.notation',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'If f(x) = 2x + 3, what is f(4)?',
      'Si f(x) = 2x + 3, ¿cuánto es f(4)?',
      'Jeśli f(x) = 2x + 3, ile wynosi f(4)?',
    ),
    math: 'f(x)=2x+3;\\ f(4)=?',
    choices0: mathChoices('11', '8', '7', '24'),
    fc: L(
      'Substitute: f(4) = 2(4) + 3 = 11.',
      'Sustituye: f(4) = 2(4) + 3 = 11.',
      'Podstaw: f(4) = 2(4) + 3 = 11.',
    ),
    fi: L(
      'Replace every x with 4; do not multiply f by 4.',
      'Reemplaza cada x por 4; no multipliques f por 4.',
      'Zastąp każde x przez 4; nie mnoż f przez 4.',
    ),
    tags: ['times_f', 'partial_sub'],
    stds: l23Not,
    num: 11,
  },
  {
    id: 't02',
    kp: 'kp.alg1.function.domain',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'For f(x) = 5x − 1 with no extra restrictions, what is the domain?',
      'Para f(x) = 5x − 1 sin más restricciones, ¿cuál es el dominio?',
      'Dla f(x) = 5x − 1 bez dodatkowych ograniczeń, jaka jest dziedzina?',
    ),
    math: 'f(x)=5x-1',
    choices0: L(
      ['All real numbers', 'Only x > 0', 'Only integers', 'Empty set'],
      ['Todos los números reales', 'Solo x > 0', 'Solo enteros', 'Conjunto vacío'],
      ['Wszystkie liczby rzeczywiste', 'Tylko x > 0', 'Tylko całkowite', 'Zbiór pusty'],
    ),
    fc: L(
      'A linear polynomial accepts every real input.',
      'Un polinomio lineal acepta toda entrada real.',
      'Wielomian liniowy przyjmuje każdy rzeczywisty argument.',
    ),
    fi: L(
      'Without a stated context or denominator, domain is all reals.',
      'Sin contexto o denominador declarado, el dominio es todos los reales.',
      'Bez kontekstu lub mianownika dziedzina to wszystkie reals.',
    ),
    tags: ['restrict_unnecessarily', 'empty_domain'],
    stds: l23Dom,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.function.notation',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'If g(x) = x² − 1, find g(−3).',
      'Si g(x) = x² − 1, halla g(−3).',
      'Jeśli g(x) = x² − 1, znajdź g(−3).',
    ),
    math: 'g(x)=x^{2}-1;\\ g(-3)=?',
    choices0: mathChoices('8', '10', '-10', '-8'),
    fc: L(
      'Square first: (−3)² − 1 = 9 − 1 = 8.',
      'Primero el cuadrado: (−3)² − 1 = 9 − 1 = 8.',
      'Najpierw kwadrat: (−3)² − 1 = 9 − 1 = 8.',
    ),
    fi: L(
      'Square the negative first: (−3)² = 9, then subtract 1.',
      'Eleva al cuadrado el negativo primero: (−3)² = 9, luego resta 1.',
      'Najpierw kwadrat ujemnej: (−3)² = 9, potem odejmij 1.',
    ),
    tags: ['sign_square', 'order_ops'],
    stds: l23Not,
    num: 8,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.function.domain',
    diff: 0.4,
    b: -0.25,
    prompt: L(
      'What value is excluded from the domain of h(x) = 1/(x − 4)?',
      '¿Qué valor se excluye del dominio de h(x) = 1/(x − 4)?',
      'Jaka wartość jest wykluczona z dziedziny h(x) = 1/(x − 4)?',
    ),
    math: 'h(x)=\\dfrac{1}{x-4}',
    choices0: mathChoices('4', '0', '1', '-4'),
    fc: L(
      'Denominator zero when x − 4 = 0 → x = 4 is excluded.',
      'Denominador cero cuando x − 4 = 0 → se excluye x = 4.',
      'Mianownik zero gdy x − 4 = 0 → wykluczamy x = 4.',
    ),
    fi: L(
      'Set the denominator equal to zero to find excluded inputs.',
      'Iguala el denominador a cero para hallar entradas excluidas.',
      'Przyrównaj mianownik do zera, by znaleźć wykluczone argumenty.',
    ),
    tags: ['wrong_zero', 'numerator_focus'],
    stds: l23Dom,
    num: 4,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.function.range',
    diff: 0.4,
    b: -0.15,
    prompt: L(
      'The table maps 1→3, 2→5, 3→7. What is the range?',
      'La tabla mapea 1→3, 2→5, 3→7. ¿Cuál es el rango?',
      'Tabela mapuje 1→3, 2→5, 3→7. Jaka jest przeciwdziedzina?',
    ),
    math: '\\{(1,3),(2,5),(3,7)\\}',
    choices0: mathChoicesL(
      ['\\{3,5,7\\}', '\\{1,2,3\\}', '\\{1,3,5,7\\}', '\\{0\\}'],
      ['\\{3,5,7\\}', '\\{1,2,3\\}', '\\{1,3,5,7\\}', '\\{0\\}'],
      ['\\{3,5,7\\}', '\\{1,2,3\\}', '\\{1,3,5,7\\}', '\\{0\\}'],
    ),
    fc: L(
      'Range is the set of outputs: {3, 5, 7}.',
      'El rango es el conjunto de salidas: {3, 5, 7}.',
      'Przeciwdziedzina to zbiór wartości: {3, 5, 7}.',
    ),
    fi: L(
      'Do not list the inputs — those are the domain.',
      'No listes las entradas: esas son el dominio.',
      'Nie wypisuj argumentów — to dziedzina.',
    ),
    tags: ['domain_vs_range', 'merge_sets'],
    stds: l23Rng,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.function.notation',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'If f(x) = 3x − 2 and f(a) = 10, what is a?',
      'Si f(x) = 3x − 2 y f(a) = 10, ¿cuánto es a?',
      'Jeśli f(x) = 3x − 2 i f(a) = 10, ile wynosi a?',
    ),
    math: 'f(a)=10;\\ f(x)=3x-2',
    choices0: mathChoices('4', '8', '12', '\\tfrac{8}{3}'),
    fc: L(
      'Solve for input: 3a − 2 = 10 → 3a = 12 → a = 4.',
      'Resuelve la entrada: 3a − 2 = 10 → 3a = 12 → a = 4.',
      'Rozwiąż argument: 3a − 2 = 10 → 3a = 12 → a = 4.',
    ),
    fi: L(
      'Set the rule equal to 10 and solve for the input a.',
      'Iguala la regla a 10 y resuelve para la entrada a.',
      'Przyrównaj wzór do 10 i rozwiąż względem argumentu a.',
    ),
    tags: ['solve_for_input', 'arithmetic'],
    stds: l23Not,
    num: 4,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.function.range',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'For f(x) = −2x + 1 over all reals, which best describes the range?',
      'Para f(x) = −2x + 1 sobre todos los reales, ¿qué describe mejor el rango?',
      'Dla f(x) = −2x + 1 na wszystkich reals, co najlepiej opisuje przeciwdziedzinę?',
    ),
    math: 'f(x)=-2x+1',
    choices0: L(
      ['All real numbers', 'Only y ≥ 0', 'Only y ≤ 1', 'Only integers'],
      ['Todos los números reales', 'Solo y ≥ 0', 'Solo y ≤ 1', 'Solo enteros'],
      ['Wszystkie liczby rzeczywiste', 'Tylko y ≥ 0', 'Tylko y ≤ 1', 'Tylko całkowite'],
    ),
    fc: L(
      'A nonconstant linear function is onto the reals — range is all reals.',
      'Una lineal no constante cubre todos los reales: el rango es todos los reales.',
      'Niekostantna funkcja liniowa pokrywa reals — przeciwdziedzina to wszystkie reals.',
    ),
    fi: L(
      'Slope ≠ 0 means every real output is hit exactly once.',
      'Pendiente ≠ 0 significa que cada salida real se alcanza exactamente una vez.',
      'Nachylenie ≠ 0 oznacza, że każda rzeczywista wartość jest osiągana dokładnie raz.',
    ),
    tags: ['restrict_range', 'y_intercept_as_bound'],
    stds: l23Rng,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.function.notation',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'If f(x) = −x + 6, find f(2).',
      'Si f(x) = −x + 6, halla f(2).',
      'Jeśli f(x) = −x + 6, znajdź f(2).',
    ),
    math: 'f(2)=?',
    choices0: mathChoices('4', '8', '-2', '12'),
    fc: L(
      'Substitute: f(2) = −2 + 6 = 4.',
      'Sustituye: f(2) = −2 + 6 = 4.',
      'Podstaw: f(2) = −2 + 6 = 4.',
    ),
    fi: L(
      'Apply the negative to the input: −(2) + 6.',
      'Aplica el negativo a la entrada: −(2) + 6.',
      'Zastosuj minus do argumentu: −(2) + 6.',
    ),
    tags: ['sign_error', 'times_f'],
    stds: l23Not,
    num: 4,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.function.domain',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'Domain of k(x) = √(x − 3) (real-valued). Which is correct?',
      'Dominio de k(x) = √(x − 3) (valores reales). ¿Cuál es correcto?',
      'Dziedzina k(x) = √(x − 3) (wartości rzeczywiste). Które jest poprawne?',
    ),
    math: 'k(x)=\\sqrt{x-3}',
    choices0: mathChoicesL(
      ['x\\ge 3', 'x>3', 'x\\le 3', '\\text{all reals}'],
      ['x\\ge 3', 'x>3', 'x\\le 3', '\\text{todos los reales}'],
      ['x\\ge 3', 'x>3', 'x\\le 3', '\\text{wszystkie rzeczywiste}'],
    ),
    fc: L(
      'Radicand ≥ 0 → x − 3 ≥ 0 → x ≥ 3.',
      'Radicando ≥ 0 → x − 3 ≥ 0 → x ≥ 3.',
      'Podpierwiastkowe ≥ 0 → x − 3 ≥ 0 → x ≥ 3.',
    ),
    fi: L(
      'Include the endpoint where the radicand is zero.',
      'Incluye el extremo donde el radicando es cero.',
      'Uwzględnij koniec, gdzie podpierwiastkowe jest zerem.',
    ),
    tags: ['open_vs_closed', 'flip_inequality'],
    stds: l23Dom,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.function.range',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'f maps {−1, 0, 2} to {4, 1, 7} respectively. Range is?',
      'f mapea {−1, 0, 2} a {4, 1, 7} respectivamente. ¿Rango?',
      'f mapuje {−1, 0, 2} na {4, 1, 7} odpowiednio. Przeciwdziedzina?',
    ),
    math: 'f(-1)=4,\\ f(0)=1,\\ f(2)=7',
    choices0: mathChoicesL(
      ['\\{1,4,7\\}', '\\{-1,0,2\\}', '\\{4\\}', '\\{0,1,2,4,7\\}'],
      ['\\{1,4,7\\}', '\\{-1,0,2\\}', '\\{4\\}', '\\{0,1,2,4,7\\}'],
      ['\\{1,4,7\\}', '\\{-1,0,2\\}', '\\{4\\}', '\\{0,1,2,4,7\\}'],
    ),
    fc: L(
      'Collect outputs: {1, 4, 7}.',
      'Reúne las salidas: {1, 4, 7}.',
      'Zbierz wartości: {1, 4, 7}.',
    ),
    fi: L(
      'Range uses y-values, not the domain inputs.',
      'El rango usa valores y, no las entradas del dominio.',
      'Przeciwdziedzina to wartości y, nie argumenty dziedziny.',
    ),
    tags: ['domain_vs_range'],
    stds: l23Rng,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.function.notation',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'If p(x) = 4 − 5x, compute p(−1).',
      'Si p(x) = 4 − 5x, calcula p(−1).',
      'Jeśli p(x) = 4 − 5x, oblicz p(−1).',
    ),
    math: 'p(-1)=?',
    choices0: mathChoices('9', '-1', '4', '-9'),
    fc: L(
      'Negatives cancel: 4 − 5(−1) = 4 + 5 = 9.',
      'Los negativos se cancelan: 4 − 5(−1) = 4 + 5 = 9.',
      'Ujemne się znoszą: 4 − 5(−1) = 4 + 5 = 9.',
    ),
    fi: L(
      'Minus times a negative input becomes plus.',
      'Menos por una entrada negativa se vuelve más.',
      'Minus razy ujemny argument daje plus.',
    ),
    tags: ['double_negative', 'times_f'],
    stds: l23Not,
    num: 9,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.function.domain',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Which x is NOT in the domain of r(x) = (x + 1)/(x(x − 2))?',
      '¿Qué x NO está en el dominio de r(x) = (x + 1)/(x(x − 2))?',
      'Które x NIE należy do dziedziny r(x) = (x + 1)/(x(x − 2))?',
    ),
    math: 'r(x)=\\dfrac{x+1}{x(x-2)}',
    choices0: mathChoicesL(
      ['x=0\\ \\text{ and }\\ x=2', 'x=-1\\ \\text{ only}', 'x=1', 'x=3'],
      ['x=0\\ \\text{ y }\\ x=2', 'x=-1\\ \\text{ solo}', 'x=1', 'x=3'],
      ['x=0\\ \\text{ i }\\ x=2', 'x=-1\\ \\text{ tylko}', 'x=1', 'x=3'],
    ),
    fc: L(
      'Denominator zero at x = 0 and x = 2 (numerator zero at −1 is fine).',
      'Denominador cero en x = 0 y x = 2 (cero del numerador en −1 está bien).',
      'Mianownik zero przy x = 0 i x = 2 (zero licznika przy −1 jest OK).',
    ),
    fi: L(
      'Exclude zeros of the denominator, not the numerator.',
      'Excluye ceros del denominador, no del numerador.',
      'Wyklucz zera mianownika, nie licznika.',
    ),
    tags: ['numerator_as_domain', 'miss_factor'],
    stds: l23Dom,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.function.range',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Constant function f(x) = 7 for all real x. Range is?',
      'Función constante f(x) = 7 para todo x real. ¿Rango?',
      'Funkcja stała f(x) = 7 dla każdego rzeczywistego x. Przeciwdziedzina?',
    ),
    math: 'f(x)=7',
    choices0: mathChoicesL(
      ['\\{7\\}', '\\text{all reals}', '\\{0,7\\}', '\\emptyset'],
      ['\\{7\\}', '\\text{todos los reales}', '\\{0,7\\}', '\\emptyset'],
      ['\\{7\\}', '\\text{wszystkie rzeczywiste}', '\\{0,7\\}', '\\emptyset'],
    ),
    fc: L(
      'Every input maps to 7, so the range is the singleton {7}.',
      'Toda entrada va a 7, así el rango es el singleton {7}.',
      'Każdy argument daje 7, więc przeciwdziedzina to singleton {7}.',
    ),
    fi: L(
      'A constant function does not hit all reals — only that constant.',
      'Una constante no alcanza todos los reales: solo esa constante.',
      'Stała nie osiąga wszystkich reals — tylko tę stałą.',
    ),
    tags: ['constant_range', 'all_reals_default'],
    stds: l23Rng,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.function.notation',
    diff: 0.6,
    b: 0.45,
    prompt: L(
      'If f(x) = 2x + 1 and g(x) = x − 4, what is f(g(5))?',
      'Si f(x) = 2x + 1 y g(x) = x − 4, ¿cuánto es f(g(5))?',
      'Jeśli f(x) = 2x + 1 i g(x) = x − 4, ile wynosi f(g(5))?',
    ),
    math: 'f(g(5))=?',
    choices0: mathChoices('3', '7', '11', '1'),
    fc: L(
      'Inner then outer: g(5) = 1; f(1) = 2(1) + 1 = 3.',
      'Interior luego exterior: g(5) = 1; f(1) = 2(1) + 1 = 3.',
      'Wewnętrzna, potem zewnętrzna: g(5) = 1; f(1) = 2(1) + 1 = 3.',
    ),
    fi: L(
      'Evaluate the inner function first, then apply f.',
      'Evalúa primero la función interior; luego aplica f.',
      'Najpierw oblicz funkcję wewnętrzną, potem zastosuj f.',
    ),
    tags: ['composition_order', 'arithmetic'],
    stds: l23Not,
    num: 3,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.function.domain',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'A relation from a finite set of students to their ages is a function if…',
      'Una relación de un conjunto finito de estudiantes a sus edades es función si…',
      'Relacja ze skończonego zbioru uczniów do ich wieku jest funkcją, jeśli…',
    ),
    math: '\\text{function?}',
    choices0: L(
      ['Each student maps to exactly one age', 'Each age maps to exactly one student', 'Ages may be missing', 'Students may have two ages'],
      ['Cada estudiante mapea a exactamente una edad', 'Cada edad mapea a exactamente un estudiante', 'Pueden faltar edades', 'Estudiantes pueden tener dos edades'],
      ['Każdy uczeń mapuje na dokładnie jeden wiek', 'Każdy wiek mapuje na dokładnie jednego ucznia', 'Wiek może brakować', 'Uczniowie mogą mieć dwa wieki'],
    ),
    fc: L(
      'A function assigns each input exactly one output.',
      'Una función asigna a cada entrada exactamente una salida.',
      'Funkcja przypisuje każdemu argumentowi dokładnie jedną wartość.',
    ),
    fi: L(
      'Uniqueness is required for outputs per input, not the reverse.',
      'Se requiere unicidad de salida por entrada, no al revés.',
      'Wymagana jest jednoznaczność wartości dla argumentu, nie odwrotnie.',
    ),
    tags: ['vertical_line', 'invert_definition'],
    stds: l23Dom,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.function.range',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'f(x) = x² with domain {−2, −1, 0, 1, 2}. Range is?',
      'f(x) = x² con dominio {−2, −1, 0, 1, 2}. ¿Rango?',
      'f(x) = x² z dziedziną {−2, −1, 0, 1, 2}. Przeciwdziedzina?',
    ),
    math: 'f(x)=x^{2},\\ D=\\{-2,-1,0,1,2\\}',
    choices0: mathChoicesL(
      ['\\{0,1,4\\}', '\\{-2,-1,0,1,2\\}', '\\{0,1,2,4\\}', '\\{4\\}'],
      ['\\{0,1,4\\}', '\\{-2,-1,0,1,2\\}', '\\{0,1,2,4\\}', '\\{4\\}'],
      ['\\{0,1,4\\}', '\\{-2,-1,0,1,2\\}', '\\{0,1,2,4\\}', '\\{4\\}'],
    ),
    fc: L(
      'Squares: 4, 1, 0, 1, 4 → unique outputs {0, 1, 4}.',
      'Cuadrados: 4, 1, 0, 1, 4 → salidas únicas {0, 1, 4}.',
      'Kwadraty: 4, 1, 0, 1, 4 → unikalne wartości {0, 1, 4}.',
    ),
    fi: L(
      'Duplicate outputs collapse in a set; do not copy the domain.',
      'Las salidas duplicadas colapsan en un conjunto; no copies el dominio.',
      'Powtórzone wartości zlewają się w zbiorze; nie kopiuj dziedziny.',
    ),
    tags: ['domain_vs_range', 'duplicate_outputs'],
    stds: l23Rng,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.function.notation',
    diff: 0.7,
    b: 0.65,
    prompt: L(
      'If f(x) = (x − 1)/2 and f(b) = 5, find b.',
      'Si f(x) = (x − 1)/2 y f(b) = 5, halla b.',
      'Jeśli f(x) = (x − 1)/2 i f(b) = 5, znajdź b.',
    ),
    math: '\\dfrac{b-1}{2}=5',
    choices0: mathChoices('11', '9', '10', '6'),
    fc: L(
      'Clear the denominator: (b − 1)/2 = 5 → b − 1 = 10 → b = 11.',
      'Limpia el denominador: (b − 1)/2 = 5 → b − 1 = 10 → b = 11.',
      'Usuń mianownik: (b − 1)/2 = 5 → b − 1 = 10 → b = 11.',
    ),
    fi: L(
      'Multiply both sides by 2, then add 1.',
      'Multiplica ambos lados por 2; luego suma 1.',
      'Pomnóż obie strony przez 2, potem dodaj 1.',
    ),
    tags: ['solve_for_input', 'fraction_error'],
    stds: l23Not,
    num: 11,
  },
]

/* ═══════════════════════════════════════
   LESSON 24 — Arithmetic & geometric sequences
   ═══════════════════════════════════════ */
const l24Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.sequence.arithmetic',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'Sequence: 3, 7, 11, 15, … What is the common difference?',
      'Sucesión: 3, 7, 11, 15, … ¿Cuál es la diferencia común?',
      'Ciąg: 3, 7, 11, 15, … Jaka jest wspólna różnica?',
    ),
    math: '3,\\ 7,\\ 11,\\ 15,\\ \\ldots',
    choices0: mathChoices('4', '3', '7', '2'),
    fc: L(
      'Consecutive differences: 7 − 3 = 11 − 7 = 15 − 11 = 4.',
      'Diferencias consecutivas: 7 − 3 = 11 − 7 = 15 − 11 = 4.',
      'Kolejne różnice: 7 − 3 = 11 − 7 = 15 − 11 = 4.',
    ),
    fi: L(
      'Subtract consecutive terms; the constant result is d.',
      'Resta términos consecutivos; el resultado constante es d.',
      'Odejmij kolejne wyrazy; stały wynik to d.',
    ),
    tags: ['ratio_instead', 'wrong_pair'],
    stds: l24Ar,
    num: 4,
  },
  {
    id: 't02',
    kp: 'kp.alg1.sequence.geometric',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Sequence: 2, 6, 18, 54, … What is the common ratio?',
      'Sucesión: 2, 6, 18, 54, … ¿Cuál es la razón común?',
      'Ciąg: 2, 6, 18, 54, … Jaki jest wspólny iloraz?',
    ),
    math: '2,\\ 6,\\ 18,\\ 54,\\ \\ldots',
    choices0: mathChoices('3', '4', '2', '6'),
    fc: L(
      'Consecutive ratios: 6/2 = 18/6 = 54/18 = 3.',
      'Razones consecutivas: 6/2 = 18/6 = 54/18 = 3.',
      'Kolejne ilorazy: 6/2 = 18/6 = 54/18 = 3.',
    ),
    fi: L(
      'Divide consecutive terms; the constant quotient is r.',
      'Divide términos consecutivos; el cociente constante es r.',
      'Podziel kolejne wyrazy; stały iloraz to r.',
    ),
    tags: ['difference_instead', 'wrong_pair'],
    stds: l24Ge,
    num: 3,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.sequence.arithmetic',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Next term after 10, 6, 2, −2, …?',
      '¿Siguiente término después de 10, 6, 2, −2, …?',
      'Następny wyraz po 10, 6, 2, −2, …?',
    ),
    math: '10,\\ 6,\\ 2,\\ -2,\\ ?',
    choices0: mathChoices('-6', '-4', '2', '-8'),
    fc: L(
      'Common difference d = −4, so −2 + (−4) = −6.',
      'Diferencia común d = −4, así −2 + (−4) = −6.',
      'Wspólna różnica d = −4, więc −2 + (−4) = −6.',
    ),
    fi: L(
      'Keep adding the same d; here each term decreases by 4.',
      'Sigue sumando el mismo d; aquí cada término baja 4.',
      'Dodawaj to samo d; tu każdy wyraz maleje o 4.',
    ),
    tags: ['wrong_d', 'geometric_guess'],
    stds: l24Ar,
    num: -6,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.sequence.geometric',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Next term after 81, 27, 9, 3, …?',
      '¿Siguiente término después de 81, 27, 9, 3, …?',
      'Następny wyraz po 81, 27, 9, 3, …?',
    ),
    math: '81,\\ 27,\\ 9,\\ 3,\\ ?',
    choices0: mathChoices('1', '0', '-3', '9'),
    fc: L(
      'Common ratio r = 1/3, so 3 · (1/3) = 1.',
      'Razón común r = 1/3, así 3 · (1/3) = 1.',
      'Wspólny iloraz r = 1/3, więc 3 · (1/3) = 1.',
    ),
    fi: L(
      'Multiply by the same r each time; here divide by 3.',
      'Multiplica por el mismo r cada vez; aquí divide entre 3.',
      'Mnoż przez to samo r za każdym razem; tu dziel przez 3.',
    ),
    tags: ['difference_instead', 'wrong_r'],
    stds: l24Ge,
    num: 1,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.sequence.nth.term',
    diff: 0.4,
    b: -0.15,
    prompt: L(
      'Arithmetic: a_1 = 5, d = 3. Which is a_n?',
      'Aritmética: a_1 = 5, d = 3. ¿Cuál es a_n?',
      'Arytmetyczny: a_1 = 5, d = 3. Które to a_n?',
    ),
    math: 'a_1=5,\\ d=3',
    choices0: mathChoices(
      'a_n=5+(n-1)\\cdot 3',
      'a_n=5+n\\cdot 3',
      'a_n=5\\cdot 3^{n-1}',
      'a_n=3+(n-1)\\cdot 5',
    ),
    fc: L(
      'Explicit arithmetic: a_n = a_1 + (n − 1)d.',
      'Aritmética explícita: a_n = a_1 + (n − 1)d.',
      'Jawny wzór arytmetyczny: a_n = a_1 + (n − 1)d.',
    ),
    fi: L(
      'Use (n − 1), not n; do not switch to a geometric form.',
      'Usa (n − 1), no n; no cambies a forma geométrica.',
      'Użyj (n − 1), nie n; nie przechodź na postać geometryczną.',
    ),
    tags: ['off_by_one', 'geometric_form'],
    stds: l24Nth,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.sequence.nth.term',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Geometric: a_1 = 4, r = 2. Which is a_n?',
      'Geométrica: a_1 = 4, r = 2. ¿Cuál es a_n?',
      'Geometryczny: a_1 = 4, r = 2. Które to a_n?',
    ),
    math: 'a_1=4,\\ r=2',
    choices0: mathChoices(
      'a_n=4\\cdot 2^{n-1}',
      'a_n=4+2(n-1)',
      'a_n=4\\cdot 2^{n}',
      'a_n=2\\cdot 4^{n-1}',
    ),
    fc: L(
      'Explicit geometric: a_n = a_1 · r^(n−1).',
      'Geométrica explícita: a_n = a_1 · r^(n−1).',
      'Jawny wzór geometryczny: a_n = a_1 · r^(n−1).',
    ),
    fi: L(
      'Exponent is n − 1; do not use an arithmetic add formula.',
      'El exponente es n − 1; no uses una fórmula aritmética de suma.',
      'Wykładnik to n − 1; nie używaj wzoru arytmetycznego z dodawaniem.',
    ),
    tags: ['off_by_one', 'arithmetic_form'],
    stds: l24Nth,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.sequence.arithmetic',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Is 2, 4, 8, 16 arithmetic or geometric?',
      '¿2, 4, 8, 16 es aritmética o geométrica?',
      'Czy 2, 4, 8, 16 jest arytmetyczny czy geometryczny?',
    ),
    math: '2,\\ 4,\\ 8,\\ 16',
    choices0: L(
      ['Geometric (r = 2)', 'Arithmetic (d = 2)', 'Both equally', 'Neither'],
      ['Geométrica (r = 2)', 'Aritmética (d = 2)', 'Ambas por igual', 'Ninguna'],
      ['Geometryczny (r = 2)', 'Arytmetyczny (d = 2)', 'Oba jednakowo', 'Żaden'],
    ),
    fc: L(
      'Ratios are constantly 2; differences are not constant.',
      'Las razones son constantemente 2; las diferencias no son constantes.',
      'Ilorazy są stale 2; różnice nie są stałe.',
    ),
    fi: L(
      'Check both: 4−2 ≠ 8−4, but 4/2 = 8/4 = 2.',
      'Revisa ambas: 4−2 ≠ 8−4, pero 4/2 = 8/4 = 2.',
      'Sprawdź obie: 4−2 ≠ 8−4, ale 4/2 = 8/4 = 2.',
    ),
    tags: ['type_confusion', 'd_equals_r_visual'],
    stds: l24Ar,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.sequence.arithmetic',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Find the 5th term of 1, 5, 9, 13, …',
      'Halla el 5.º término de 1, 5, 9, 13, …',
      'Znajdź 5. wyraz ciągu 1, 5, 9, 13, …',
    ),
    math: '1,\\ 5,\\ 9,\\ 13,\\ ?',
    choices0: mathChoices('17', '15', '21', '16'),
    fc: L(
      'd = 4; a_5 = 13 + 4 = 17 (or 1 + 4·4).',
      'd = 4; a_5 = 13 + 4 = 17 (o 1 + 4·4).',
      'd = 4; a_5 = 13 + 4 = 17 (lub 1 + 4·4).',
    ),
    fi: L(
      'Add d once more after the 4th term.',
      'Suma d una vez más después del 4.º término.',
      'Dodaj d jeszcze raz po 4. wyrazie.',
    ),
    tags: ['off_by_one', 'wrong_d'],
    stds: l24Ar,
    num: 17,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.sequence.geometric',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Find the next term of 5, −10, 20, −40, …',
      'Halla el siguiente término de 5, −10, 20, −40, …',
      'Znajdź następny wyraz 5, −10, 20, −40, …',
    ),
    math: '5,\\ -10,\\ 20,\\ -40,\\ ?',
    choices0: mathChoices('80', '-80', '40', '-20'),
    fc: L(
      'r = −2, so −40 · (−2) = 80.',
      'r = −2, así −40 · (−2) = 80.',
      'r = −2, więc −40 · (−2) = 80.',
    ),
    fi: L(
      'Keep multiplying by −2; signs alternate.',
      'Sigue multiplicando por −2; los signos alternan.',
      'Mnóż dalej przez −2; znaki się naprzemienne.',
    ),
    tags: ['sign_ratio', 'difference_instead'],
    stds: l24Ge,
    num: 80,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.sequence.nth.term',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'a_n = 2 + (n − 1)·5. What is a_4?',
      'a_n = 2 + (n − 1)·5. ¿Cuánto es a_4?',
      'a_n = 2 + (n − 1)·5. Ile wynosi a_4?',
    ),
    math: 'a_n=2+(n-1)\\cdot 5;\\ a_4=?',
    choices0: mathChoices('17', '22', '15', '20'),
    fc: L(
      'Plug n = 4: a_4 = 2 + 3·5 = 2 + 15 = 17.',
      'Sustituye n = 4: a_4 = 2 + 3·5 = 2 + 15 = 17.',
      'Wstaw n = 4: a_4 = 2 + 3·5 = 2 + 15 = 17.',
    ),
    fi: L(
      'Use n − 1 = 3, not n = 4 inside the product.',
      'Usa n − 1 = 3, no n = 4 dentro del producto.',
      'Użyj n − 1 = 3, nie n = 4 w iloczynie.',
    ),
    tags: ['off_by_one', 'arithmetic'],
    stds: l24Nth,
    num: 17,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.sequence.nth.term',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'a_n = 3 · 2^(n−1). What is a_5?',
      'a_n = 3 · 2^(n−1). ¿Cuánto es a_5?',
      'a_n = 3 · 2^(n−1). Ile wynosi a_5?',
    ),
    math: 'a_n=3\\cdot 2^{n-1};\\ a_5=?',
    choices0: mathChoices('48', '96', '24', '32'),
    fc: L(
      'With n − 1 = 4: a_5 = 3 · 2^4 = 3 · 16 = 48.',
      'Con n − 1 = 4: a_5 = 3 · 2^4 = 3 · 16 = 48.',
      'Przy n − 1 = 4: a_5 = 3 · 2^4 = 3 · 16 = 48.',
    ),
    fi: L(
      'Exponent is 4 when n = 5; then multiply by 3.',
      'El exponente es 4 cuando n = 5; luego multiplica por 3.',
      'Wykładnik to 4 przy n = 5; potem pomnóż przez 3.',
    ),
    tags: ['off_by_one', 'power_error'],
    stds: l24Nth,
    num: 48,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.sequence.arithmetic',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Terms a_2 = 11 and a_5 = 20 in an arithmetic sequence. What is d?',
      'Términos a_2 = 11 y a_5 = 20 en una sucesión aritmética. ¿Cuál es d?',
      'Wyrazy a_2 = 11 i a_5 = 20 w ciągu arytmetycznym. Ile wynosi d?',
    ),
    math: 'a_2=11,\\ a_5=20',
    choices0: mathChoices('3', '9', '4', '2'),
    fc: L(
      'From a_2 to a_5 is 3 steps: (20 − 11)/3 = 3.',
      'De a_2 a a_5 hay 3 pasos: (20 − 11)/3 = 3.',
      'Od a_2 do a_5 są 3 kroki: (20 − 11)/3 = 3.',
    ),
    fi: L(
      'Divide the change by the number of steps between indices.',
      'Divide el cambio entre el número de pasos entre índices.',
      'Podziel zmianę przez liczbę kroków między indeksami.',
    ),
    tags: ['skip_steps', 'difference_raw'],
    stds: l24Ar,
    num: 3,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.sequence.geometric',
    diff: 0.6,
    b: 0.4,
    prompt: L(
      'Terms a_1 = 8 and a_3 = 2 in a geometric sequence (positive r). What is r?',
      'Términos a_1 = 8 y a_3 = 2 en sucesión geométrica (r positivo). ¿Cuál es r?',
      'Wyrazy a_1 = 8 i a_3 = 2 w ciągu geometrycznym (r dodatnie). Ile wynosi r?',
    ),
    math: 'a_1=8,\\ a_3=2',
    choices0: mathChoices('\\tfrac12', '\\tfrac14', '2', '4'),
    fc: L(
      'Two steps: a_3 = a_1 · r² → 2 = 8r² → r² = 1/4 → r = 1/2.',
      'Dos pasos: a_3 = a_1 · r² → 2 = 8r² → r² = 1/4 → r = 1/2.',
      'Dwa kroki: a_3 = a_1 · r² → 2 = 8r² → r² = 1/4 → r = 1/2.',
    ),
    fi: L(
      'Two steps mean r squared, not a single ratio 2/8 alone without root.',
      'Dos pasos significan r al cuadrado, no solo la razón 2/8 sin raíz.',
      'Dwa kroki oznaczają r do kwadratu, nie sam iloraz 2/8 bez pierwiastka.',
    ),
    tags: ['skip_steps', 'forget_root'],
    stds: l24Ge,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.sequence.nth.term',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Write a_n for 7, 10, 13, 16, …',
      'Escribe a_n para 7, 10, 13, 16, …',
      'Zapisz a_n dla 7, 10, 13, 16, …',
    ),
    math: '7,\\ 10,\\ 13,\\ 16,\\ \\ldots',
    choices0: mathChoices(
      'a_n=7+(n-1)\\cdot 3',
      'a_n=7+n\\cdot 3',
      'a_n=7\\cdot 3^{n-1}',
      'a_n=3+(n-1)\\cdot 7',
    ),
    fc: L(
      'Arithmetic form: a_1 = 7, d = 3 → a_n = 7 + (n − 1)·3.',
      'Forma aritmética: a_1 = 7, d = 3 → a_n = 7 + (n − 1)·3.',
      'Postać arytmetyczna: a_1 = 7, d = 3 → a_n = 7 + (n − 1)·3.',
    ),
    fi: L(
      'Arithmetic uses add d(n−1), not multiply by 3^(n−1).',
      'Aritmética usa sumar d(n−1), no multiplicar por 3^(n−1).',
      'Arytmetyczny dodaje d(n−1), nie mnoży przez 3^(n−1).',
    ),
    tags: ['off_by_one', 'geometric_form'],
    stds: l24Nth,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.sequence.nth.term',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Write a_n for 5, 15, 45, 135, …',
      'Escribe a_n para 5, 15, 45, 135, …',
      'Zapisz a_n dla 5, 15, 45, 135, …',
    ),
    math: '5,\\ 15,\\ 45,\\ 135,\\ \\ldots',
    choices0: mathChoices(
      'a_n=5\\cdot 3^{n-1}',
      'a_n=5+(n-1)\\cdot 3',
      'a_n=5\\cdot 3^{n}',
      'a_n=3\\cdot 5^{n-1}',
    ),
    fc: L(
      'Geometric form: a_1 = 5, r = 3 → a_n = 5 · 3^(n−1).',
      'Forma geométrica: a_1 = 5, r = 3 → a_n = 5 · 3^(n−1).',
      'Postać geometryczna: a_1 = 5, r = 3 → a_n = 5 · 3^(n−1).',
    ),
    fi: L(
      'Geometric uses a_1 · r^(n−1), not an arithmetic add.',
      'Geométrica usa a_1 · r^(n−1), no una suma aritmética.',
      'Geometryczny używa a_1 · r^(n−1), nie sumy arytmetycznej.',
    ),
    tags: ['off_by_one', 'arithmetic_form'],
    stds: l24Nth,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.sequence.arithmetic',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Which sequence is arithmetic?',
      '¿Cuál sucesión es aritmética?',
      'Który ciąg jest arytmetyczny?',
    ),
    math: '\\text{classify}',
    choices0: mathChoicesL(
      ['4,\\ 1,\\ -2,\\ -5', '3,\\ 6,\\ 12,\\ 24', '2,\\ 3,\\ 5,\\ 8', '1,\\ 1,\\ 2,\\ 3'],
      ['4,\\ 1,\\ -2,\\ -5', '3,\\ 6,\\ 12,\\ 24', '2,\\ 3,\\ 5,\\ 8', '1,\\ 1,\\ 2,\\ 3'],
      ['4,\\ 1,\\ -2,\\ -5', '3,\\ 6,\\ 12,\\ 24', '2,\\ 3,\\ 5,\\ 8', '1,\\ 1,\\ 2,\\ 3'],
    ),
    fc: L(
      'Differences are constantly −3 in 4, 1, −2, −5.',
      'Las diferencias son constantemente −3 en 4, 1, −2, −5.',
      'Różnice są stale −3 w 4, 1, −2, −5.',
    ),
    fi: L(
      'Look for a constant difference, not a constant ratio or Fibonacci-like adds.',
      'Busca diferencia constante, no razón constante ni sumas tipo Fibonacci.',
      'Szukaj stałej różnicy, nie stałego ilorazu ani sum Fibonacciego.',
    ),
    tags: ['type_confusion', 'fib_distract'],
    stds: l24Ar,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.sequence.geometric',
    diff: 0.7,
    b: 0.65,
    prompt: L(
      'a_1 = 2, r = −3. What is a_4?',
      'a_1 = 2, r = −3. ¿Cuánto es a_4?',
      'a_1 = 2, r = −3. Ile wynosi a_4?',
    ),
    math: 'a_1=2,\\ r=-3;\\ a_4=?',
    choices0: mathChoices('-54', '54', '-18', '18'),
    fc: L(
      'Odd power stays negative: a_4 = 2 · (−3)^3 = 2 · (−27) = −54.',
      'Potencia impar sigue negativa: a_4 = 2 · (−3)^3 = 2 · (−27) = −54.',
      'Nieparzysta potęga zostaje ujemna: a_4 = 2 · (−3)^3 = 2 · (−27) = −54.',
    ),
    fi: L(
      'Odd powers of −3 stay negative; exponent is n − 1 = 3.',
      'Potencias impares de −3 siguen negativas; el exponente es n − 1 = 3.',
      'Nieparzyste potęgi −3 pozostają ujemne; wykładnik to n − 1 = 3.',
    ),
    tags: ['sign_power', 'off_by_one'],
    stds: l24Ge,
    num: -54,
  },
]

const lesson22Items = buildItems('alg1-l22', l22Specs)
const lesson23Items = buildItems('alg1-l23', l23Specs)
const lesson24Items = buildItems('alg1-l24', l24Specs)

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

const lesson22 = pack(
  'alg1-l22',
  22,
  L(
    'Absolute Value Equations & Inequalities',
    'Ecuaciones y desigualdades de valor absoluto',
    'Równania i nierówności z wartością bezwzględną',
  ),
  absKps,
  'lesson_board_22',
  ['lesson_board_23'],
  L('Teach: distance & cases', 'Enseñar: distancia y casos', 'Nauczanie: odległość i przypadki'),
  L(
    '|expression| is distance. Equations split into ± cases when the right side is nonnegative; inequalities use AND for < and OR for >.',
    '|expresión| es distancia. Las ecuaciones se dividen en casos ± si el lado derecho es no negativo; desigualdades usan Y para < y O para >.',
    '|wyrażenie| to odległość. Równania rozdzielają się na przypadki ±, gdy prawa strona jest nieujemna; nierówności używają I dla < i LUB dla >.',
  ),
  ['|x|=c\\Rightarrow x=\\pm c\\ (c\\ge 0)', '|x|<c\\Rightarrow -c<x<c', '|x|>c\\Rightarrow x<-c\\ \\text{..}'],
  L(
    'Evaluate absolute values, solve two-branch equations, and rewrite inequalities with AND/OR.',
    'Evalúa valores absolutos, resuelve ecuaciones de dos ramas y reescribe desigualdades con Y/O.',
    'Obliczaj wartości bezwzględne, rozwiązuj równania dwugałęziowe i przepisuj nierówności z I/LUB.',
  ),
  lesson22Items,
)

const lesson23 = pack(
  'alg1-l23',
  23,
  L(
    'Function Notation, Domain & Range',
    'Notación de función, dominio y rango',
    'Notacja funkcyjna, dziedzina i przeciwdziedzina',
  ),
  fnKps,
  'lesson_board_23',
  ['lesson_board_24'],
  L('Teach: f(x), inputs, outputs', 'Enseñar: f(x), entradas, salidas', 'Nauczanie: f(x), argumenty, wartości'),
  L(
    'f(a) means substitute x = a. Domain = allowed inputs; range = possible outputs. Watch denominators and radicands.',
    'f(a) significa sustituir x = a. Dominio = entradas permitidas; rango = salidas posibles. Cuidado con denominadores y radicandos.',
    'f(a) oznacza podstawienie x = a. Dziedzina = dopuszczalne argumenty; przeciwdziedzina = możliwe wartości. Uważaj na mianowniki i podpierwiastkowe.',
  ),
  ['f(a)=\\ldots', 'D:\\ x\\ne \\text{denom zeros}', 'R:\\ \\{outputs\\}'],
  L(
    'Evaluate f(a), find restricted domains, and list ranges from tables and rules.',
    'Evalúa f(a), halla dominios restringidos y lista rangos desde tablas y reglas.',
    'Obliczaj f(a), znajduj ograniczone dziedziny i wypisuj przeciwdziedziny z tabel i wzorów.',
  ),
  lesson23Items,
)

const lesson24 = pack(
  'alg1-l24',
  24,
  L(
    'Arithmetic & Geometric Sequences Intro',
    'Introducción a sucesiones aritméticas y geométricas',
    'Wstęp do ciągów arytmetycznych i geometrycznych',
  ),
  seqKps,
  'lesson_board_24',
  ['lesson_board_25'],
  L('Teach: d, r, and a_n', 'Enseñar: d, r y a_n', 'Nauczanie: d, r i a_n'),
  L(
    'Arithmetic adds a constant d; geometric multiplies by a constant r. Explicit: a_n = a_1+(n−1)d or a_n = a_1·r^(n−1).',
    'Aritmética suma una constante d; geométrica multiplica por una constante r. Explícitas: a_n = a_1+(n−1)d o a_n = a_1·r^(n−1).',
    'Arytmetyczny dodaje stałą d; geometryczny mnoży przez stałą r. Jawne: a_n = a_1+(n−1)d lub a_n = a_1·r^(n−1).',
  ),
  ['a_n=a_1+(n-1)d', 'a_n=a_1\\cdot r^{n-1}', 'd:\\text{ add};\\ r:\\text{ multiply}'],
  L(
    'Classify sequences, find next terms, and evaluate or write nth-term formulas.',
    'Clasifica sucesiones, halla términos siguientes y evalúa o escribe fórmulas del n-ésimo.',
    'Klasyfikuj ciągi, znajduj następne wyrazy oraz obliczaj lub zapisuj wzory na n-ty wyraz.',
  ),
  lesson24Items,
)

/* Patch teach bodyMath to avoid English filler words where possible */
lesson22.sections[1].bodyMath = [
  '|x|=c\\Rightarrow x=\\pm c\\ (c\\ge 0)',
  '|x|<c\\Rightarrow -c<x<c',
  '|x|>c\\Rightarrow x<-c\\ \\vee\\ x>c',
]
lesson23.sections[1].bodyMath = [
  'f(a)\\leftarrow x{=}a',
  'D:\\ x\\ne \\text{zeros}',
  'R:\\{y:y=f(x)\\}',
]
lesson24.sections[1].bodyMath = [
  'a_n=a_1+(n-1)d',
  'a_n=a_1\\cdot r^{n-1}',
  'd:\\ +\\ ;\\ r:\\ \\times',
]

/* Fix objective bodies cleanly */
lesson22.sections[0].body = L(
  'You will solve absolute value equations and inequalities using distance and compound cases.',
  'Resolverás ecuaciones y desigualdades de valor absoluto usando distancia y casos compuestos.',
  'Będziesz rozwiązywać równania i nierówności z wartością bezwzględną przez odległość i przypadki złożone.',
)
lesson23.sections[0].body = L(
  'You will use function notation and identify domain and range for simple functions.',
  'Usarás notación de función e identificarás dominio y rango de funciones simples.',
  'Będziesz stosować notację funkcyjną oraz wyznaczać dziedzinę i przeciwdziedzinę prostych funkcji.',
)
lesson24.sections[0].body = L(
  'You will recognize arithmetic and geometric sequences and write basic nth-term formulas.',
  'Reconocerás sucesiones aritméticas y geométricas y escribirás fórmulas básicas del n-ésimo término.',
  'Będziesz rozpoznawać ciągi arytmetyczne i geometryczne oraz zapisywać podstawowe wzory na n-ty wyraz.',
)

/* ─── Write outputs ─── */
lesson21.worldHook.unlockOnMastery = ['lesson_board_22']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-21.json', lesson21)
writeJson('lesson-22.json', lesson22)
writeJson('lesson-23.json', lesson23)
writeJson('lesson-24.json', lesson24)

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
  lessons: [lesson22, lesson23, lesson24].map((l) => ({
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
    feedbackClones: feedbackCloneRate(l),
    enOrInEsPlChoices: englishOrInEsPl(l),
  })),
  unlockChain: 'L21→board_22→L22→23→L23→24→L24→board_25 teaser',
}

console.log(JSON.stringify(summary, null, 2))
