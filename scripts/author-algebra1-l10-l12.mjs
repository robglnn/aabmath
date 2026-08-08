/**
 * Wave 4 authoring: Algebra I Lessons 10–12 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l10-l12.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-10..12; confirms L9 unlockOnMastery → lesson_board_10;
 * L12 unlocks lesson_board_13 teaser.
 *
 * KaTeX policy (Wave 3 critic): nearly every item has promptMath when math
 * appears; MC choices use plain Unicode / (a/b) — never raw \frac in choices.
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

/** Place correct choice (authored at index 0) at targetIndex; same permute for all locales. */
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

/** Cycle keys 0,1,2,3 for MC diversification (target ≤70% any single index). */
function keyCycle(i) {
  return i % 4
}

const existingKpDoc = JSON.parse(readFileSync(join(outDir, 'knowledge-points.json'), 'utf8'))
const existingStd = JSON.parse(readFileSync(join(outDir, 'standards-index.json'), 'utf8'))
const lesson09 = JSON.parse(readFileSync(join(outDir, 'lesson-09.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.systems.elimination',
    title: L(
      'Solve systems by elimination (add/subtract)',
      'Resolver sistemas por eliminación (sumar/restar)',
      'Rozwiązywać układy metodą eliminacji (dodawanie/odejmowanie)',
    ),
    prerequisites: ['kp.alg1.systems.meaning', 'kp.alg1.systems.substitution'],
    encompassing: ['kp.alg1.systems.substitution'],
    successCriteria: L(
      'Student eliminates one variable by adding or subtracting aligned equations and solves the resulting one-variable equation.',
      'El estudiante elimina una variable sumando o restando ecuaciones alineadas y resuelve la ecuación de una variable resultante.',
      'Uczeń eliminuje jedną zmienną przez dodanie lub odjęcie równań i rozwiązuje powstałe równanie jednej zmiennej.',
    ),
    misconceptions: L(
      [
        'Adding equations that do not cancel a variable',
        'Forgetting to apply the operation to every term on both sides',
      ],
      [
        'Sumar ecuaciones que no cancelan una variable',
        'Olvidar aplicar la operación a cada término en ambos lados',
      ],
      [
        'Dodawanie równań, które nie kasują zmiennej',
        'Zapominanie o zastosowaniu operacji do każdego wyrazu po obu stronach',
      ],
    ),
    standards: [
      TX('A.5(C)', 'A.2(I)', 'A.1(B)'),
      CC('8.EE.C.8b', 'A-REI.C.6', 'A-REI.C.5'),
      CA('A-REI.6'),
      FL('MA.912.AR.9.1'),
    ],
  },
  {
    id: 'kp.alg1.systems.elimination.scale',
    title: L(
      'Scale equations before elimination',
      'Escalar ecuaciones antes de eliminar',
      'Mnożyć równania przed eliminacją',
    ),
    prerequisites: ['kp.alg1.systems.elimination'],
    successCriteria: L(
      'Student multiplies one or both equations by a constant so coefficients of one variable become opposites (or equal), then eliminates.',
      'El estudiante multiplica una o ambas ecuaciones por una constante para que los coeficientes de una variable sean opuestos (o iguales) y luego elimina.',
      'Uczeń mnoży jedno lub oba równania przez stałą, by współczynniki jednej zmiennej stały się przeciwne (lub równe), potem eliminuje.',
    ),
    misconceptions: L(
      [
        'Multiplying only one side of an equation',
        'Choosing a scale that does not create matching coefficients',
      ],
      [
        'Multiplicar solo un lado de una ecuación',
        'Elegir un escalado que no iguala coeficientes',
      ],
      [
        'Mnożenie tylko jednej strony równania',
        'Wybór skali, która nie wyrównuje współczynników',
      ],
    ),
    standards: [
      TX('A.5(C)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.C.5', 'A-REI.C.6', '8.EE.C.8b'),
      CA('A-REI.5'),
    ],
  },
  {
    id: 'kp.alg1.systems.verify',
    title: L(
      'Check a system solution in both equations',
      'Comprobar una solución del sistema en ambas ecuaciones',
      'Sprawdzać rozwiązanie układu w obu równaniach',
    ),
    prerequisites: ['kp.alg1.systems.meaning', 'kp.alg1.equation.verify'],
    encompassing: ['kp.alg1.equation.verify'],
    successCriteria: L(
      'Student substitutes an ordered pair into both equations and decides whether it is a solution.',
      'El estudiante sustituye un par ordenado en ambas ecuaciones y decide si es solución.',
      'Uczeń podstawia par uporządkowany do obu równań i decyduje, czy jest rozwiązaniem.',
    ),
    misconceptions: L(
      [
        'Checking only one equation',
        'Accepting a pair that fails after arithmetic slips',
      ],
      [
        'Comprobar solo una ecuación',
        'Aceptar un par que falla tras errores aritméticos',
      ],
      [
        'Sprawdzanie tylko jednego równania',
        'Akceptowanie pary, która nie przechodzi po błędzie rachunkowym',
      ],
    ),
    standards: [
      TX('A.5(C)', 'A.1(D)', 'A.1(B)'),
      CC('8.EE.C.8a', 'A-REI.C.6', 'A-REI.D.11'),
      CA('A-REI.6'),
    ],
  },
  {
    id: 'kp.alg1.exponents.product',
    title: L(
      'Product of powers: a^m · a^n = a^(m+n)',
      'Producto de potencias: a^m · a^n = a^(m+n)',
      'Iloczyn potęg: a^m · a^n = a^(m+n)',
    ),
    prerequisites: ['kp.alg1.order.ops', 'kp.alg1.expression.parts'],
    successCriteria: L(
      'Student multiplies powers with the same base by adding exponents.',
      'El estudiante multiplica potencias de la misma base sumando exponentes.',
      'Uczeń mnoży potęgi o tej samej podstawie, dodając wykładniki.',
    ),
    misconceptions: L(
      [
        'Multiplying the exponents instead of adding',
        'Adding the bases as well as the exponents',
      ],
      [
        'Multiplicar los exponentes en lugar de sumarlos',
        'Sumar también las bases además de los exponentes',
      ],
      [
        'Mnożenie wykładników zamiast dodawania',
        'Dodawanie również podstaw oprócz wykładników',
      ],
    ),
    standards: [
      TX('A.11(B)', 'A.1(D)', 'A.1(F)'),
      CC('8.EE.A.1', 'N-RN.A.1', 'A-SSE.A.1'),
      CA('8.EE.1'),
      FL('MA.912.NSO.1.1'),
    ],
  },
  {
    id: 'kp.alg1.exponents.quotient',
    title: L(
      'Quotient of powers: a^m / a^n = a^(m−n)',
      'Cociente de potencias: a^m / a^n = a^(m−n)',
      'Iloraz potęg: a^m / a^n = a^(m−n)',
    ),
    prerequisites: ['kp.alg1.exponents.product'],
    encompassing: ['kp.alg1.exponents.product'],
    successCriteria: L(
      'Student divides powers with the same base by subtracting exponents.',
      'El estudiante divide potencias de la misma base restando exponentes.',
      'Uczeń dzieli potęgi o tej samej podstawie, odejmując wykładniki.',
    ),
    misconceptions: L(
      [
        'Subtracting bases or dividing exponents',
        'Writing a^(n−m) instead of a^(m−n) when dividing a^m by a^n',
      ],
      [
        'Restar bases o dividir exponentes',
        'Escribir a^(n−m) en lugar de a^(m−n) al dividir a^m entre a^n',
      ],
      [
        'Odejmowanie podstaw lub dzielenie wykładników',
        'Zapisywanie a^(n−m) zamiast a^(m−n) przy dzieleniu a^m przez a^n',
      ],
    ),
    standards: [
      TX('A.11(B)', 'A.1(D)', 'A.1(F)'),
      CC('8.EE.A.1', 'N-RN.A.1', 'A-SSE.A.1'),
      CA('8.EE.1'),
    ],
  },
  {
    id: 'kp.alg1.exponents.power',
    title: L(
      'Power of a power: (a^m)^n = a^(mn)',
      'Potencia de una potencia: (a^m)^n = a^(mn)',
      'Potęga potęgi: (a^m)^n = a^(mn)',
    ),
    prerequisites: ['kp.alg1.exponents.product'],
    successCriteria: L(
      'Student raises a power to a power by multiplying exponents.',
      'El estudiante eleva una potencia a otra potencia multiplicando exponentes.',
      'Uczeń podnosi potęgę do potęgi, mnożąc wykładniki.',
    ),
    misconceptions: L(
      [
        'Adding exponents instead of multiplying for (a^m)^n',
        'Raising the base and exponent incorrectly (a^(m^n))',
      ],
      [
        'Sumar exponentes en lugar de multiplicar para (a^m)^n',
        'Elevar mal la base y el exponente (a^(m^n))',
      ],
      [
        'Dodawanie wykładników zamiast mnożenia dla (a^m)^n',
        'Błędne podnoszenie podstawy i wykładnika (a^(m^n))',
      ],
    ),
    standards: [
      TX('A.11(B)', 'A.1(D)', 'A.1(F)'),
      CC('8.EE.A.1', 'N-RN.A.1', 'A-SSE.A.1'),
      CA('8.EE.1'),
    ],
  },
  {
    id: 'kp.alg1.polynomial.classify',
    title: L(
      'Classify polynomials by degree and term count',
      'Clasificar polinomios por grado y número de términos',
      'Klasyfikować wielomiany według stopnia i liczby wyrazów',
    ),
    prerequisites: ['kp.alg1.expression.parts', 'kp.alg1.exponents.product'],
    successCriteria: L(
      'Student names degree (highest exponent of a variable term) and type (mono/bi/tri/poly by terms) for simple polynomials.',
      'El estudiante nombra el grado (mayor exponente de un término variable) y el tipo (mono/bi/tri/poli por términos) de polinomios simples.',
      'Uczeń podaje stopień (najwyższy wykładnik wyrazu zmiennego) i typ (jedno-/dwu-/trój-/wielomian) prostych wielomianów.',
    ),
    misconceptions: L(
      [
        'Using the number of terms as the degree',
        'Ignoring the variable and treating the constant as the degree',
      ],
      [
        'Usar el número de términos como el grado',
        'Ignorar la variable y tratar la constante como el grado',
      ],
      [
        'Traktowanie liczby wyrazów jako stopnia',
        'Ignorowanie zmiennej i traktowanie stałej jako stopnia',
      ],
    ),
    standards: [
      TX('A.10(A)', 'A.1(D)', 'A.1(F)'),
      CC('A-SSE.A.1a', 'A-APR.A.1', 'A-SSE.A.1'),
      CA('A-SSE.1'),
    ],
  },
  {
    id: 'kp.alg1.polynomial.add',
    title: L(
      'Add polynomials by combining like terms',
      'Sumar polinomios combinando términos semejantes',
      'Dodawać wielomiany przez łączenie wyrazów podobnych',
    ),
    prerequisites: ['kp.alg1.polynomial.classify', 'kp.alg1.expression.parts'],
    encompassing: ['kp.alg1.expression.parts'],
    successCriteria: L(
      'Student adds two polynomials by combining like terms and writes the sum in standard form.',
      'El estudiante suma dos polinomios combinando términos semejantes y escribe la suma en forma estándar.',
      'Uczeń dodaje dwa wielomiany, łącząc wyrazy podobne, i zapisuje sumę w postaci standardowej.',
    ),
    misconceptions: L(
      [
        'Combining unlike terms (different powers)',
        'Adding exponents when combining like terms',
      ],
      [
        'Combinar términos no semejantes (distintas potencias)',
        'Sumar exponentes al combinar términos semejantes',
      ],
      [
        'Łączenie niepodobnych wyrazów (różne potęgi)',
        'Dodawanie wykładników przy łączeniu wyrazów podobnych',
      ],
    ),
    standards: [
      TX('A.10(A)', 'A.1(F)', 'A.1(B)'),
      CC('A-APR.A.1', 'A-SSE.A.1a', 'A-SSE.A.1'),
      CA('A-APR.1'),
      FL('MA.912.AR.1.3'),
    ],
  },
  {
    id: 'kp.alg1.polynomial.subtract',
    title: L(
      'Subtract polynomials (distribute the minus)',
      'Restar polinomios (distribuir el menos)',
      'Odejmować wielomiany (rozdzielanie minusa)',
    ),
    prerequisites: ['kp.alg1.polynomial.add'],
    encompassing: ['kp.alg1.polynomial.add'],
    successCriteria: L(
      'Student subtracts polynomials by distributing a negative sign to each term of the subtrahend, then combining like terms.',
      'El estudiante resta polinomios distribuyendo el signo negativo a cada término del sustraendo y luego combina términos semejantes.',
      'Uczeń odejmuje wielomiany, rozdzielając znak minus na każdy wyraz odjemnika, potem łączy wyrazy podobne.',
    ),
    misconceptions: L(
      [
        'Only changing the sign of the first term of the subtrahend',
        'Treating subtraction as addition without distributing the minus',
      ],
      [
        'Cambiar solo el signo del primer término del sustraendo',
        'Tratar la resta como suma sin distribuir el menos',
      ],
      [
        'Zmiana znaku tylko pierwszego wyrazu odjemnika',
        'Traktowanie odejmowania jak dodawania bez rozdzielenia minusa',
      ],
    ),
    standards: [
      TX('A.10(A)', 'A.1(F)', 'A.1(B)'),
      CC('A-APR.A.1', 'A-SSE.A.1a', 'A-SSE.A.1'),
      CA('A-APR.1'),
    ],
  },
]

const existingIds = new Set(existingKpDoc.knowledgePoints.map((k) => k.id))
for (const kp of newKps) {
  if (existingIds.has(kp.id)) {
    const idx = existingKpDoc.knowledgePoints.findIndex((k) => k.id === kp.id)
    existingKpDoc.knowledgePoints[idx] = kp
  } else {
    existingKpDoc.knowledgePoints.push(kp)
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

addKpsToExisting('TX', 'A.5(C)', [
  'kp.alg1.systems.elimination',
  'kp.alg1.systems.elimination.scale',
  'kp.alg1.systems.verify',
])
addKpsToExisting('TX', 'A.2(I)', [
  'kp.alg1.systems.elimination',
  'kp.alg1.systems.verify',
])
addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.systems.elimination',
  'kp.alg1.systems.elimination.scale',
  'kp.alg1.systems.verify',
  'kp.alg1.polynomial.add',
  'kp.alg1.polynomial.subtract',
])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.systems.verify',
  'kp.alg1.exponents.product',
  'kp.alg1.exponents.quotient',
  'kp.alg1.exponents.power',
  'kp.alg1.polynomial.classify',
])
addKpsToExisting('TX', 'A.1(F)', [
  'kp.alg1.systems.elimination.scale',
  'kp.alg1.exponents.product',
  'kp.alg1.exponents.quotient',
  'kp.alg1.exponents.power',
  'kp.alg1.polynomial.classify',
  'kp.alg1.polynomial.add',
  'kp.alg1.polynomial.subtract',
])
addKpsToExisting('CCSS', '8.EE.C.8a', ['kp.alg1.systems.verify'])
addKpsToExisting('CCSS', '8.EE.C.8b', [
  'kp.alg1.systems.elimination',
  'kp.alg1.systems.elimination.scale',
])
addKpsToExisting('CCSS', 'A-REI.C.6', [
  'kp.alg1.systems.elimination',
  'kp.alg1.systems.elimination.scale',
  'kp.alg1.systems.verify',
])
addKpsToExisting('CCSS', 'A-REI.D.11', ['kp.alg1.systems.verify'])
addKpsToExisting('CCSS', 'A-SSE.A.1', [
  'kp.alg1.exponents.product',
  'kp.alg1.exponents.quotient',
  'kp.alg1.exponents.power',
  'kp.alg1.polynomial.classify',
  'kp.alg1.polynomial.add',
  'kp.alg1.polynomial.subtract',
])
addKpsToExisting('CCSS', 'A-SSE.A.1a', [
  'kp.alg1.polynomial.classify',
  'kp.alg1.polynomial.add',
  'kp.alg1.polynomial.subtract',
])

ensureCode(
  'TX',
  'A.11(B)',
  L(
    'Simplify numeric and algebraic expressions using the laws of exponents, including integral and rational exponents',
    'Simplificar expresiones numéricas y algebraicas usando las leyes de los exponentes, incluidos enteros y racionales',
    'Upraszczać wyrażenia liczbowe i algebraiczne za pomocą praw potęg, w tym wykładników całkowitych i wymiernych',
  ),
  [
    'kp.alg1.exponents.product',
    'kp.alg1.exponents.quotient',
    'kp.alg1.exponents.power',
  ],
)
ensureCode(
  'TX',
  'A.10(A)',
  L(
    'Add and subtract polynomials of degree one and degree two',
    'Sumar y restar polinomios de grado uno y grado dos',
    'Dodawać i odejmować wielomiany stopnia pierwszego i drugiego',
  ),
  [
    'kp.alg1.polynomial.classify',
    'kp.alg1.polynomial.add',
    'kp.alg1.polynomial.subtract',
  ],
)
ensureCode(
  'CCSS',
  'A-REI.C.5',
  L(
    'Prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions',
    'Demostrar que, dado un sistema de dos ecuaciones, reemplazar una por la suma de esa y un múltiplo de la otra produce un sistema con las mismas soluciones',
    'Udowodnić, że zastąpienie jednego równania sumą tego równania i wielokrotności drugiego daje układ o tych samych rozwiązaniach',
  ),
  ['kp.alg1.systems.elimination', 'kp.alg1.systems.elimination.scale'],
)
ensureCode(
  'CCSS',
  '8.EE.A.1',
  L(
    'Know and apply the properties of integer exponents to generate equivalent numerical expressions',
    'Conocer y aplicar las propiedades de los exponentes enteros para generar expresiones numéricas equivalentes',
    'Znać i stosować własności wykładników całkowitych do generowania równoważnych wyrażeń liczbowych',
  ),
  [
    'kp.alg1.exponents.product',
    'kp.alg1.exponents.quotient',
    'kp.alg1.exponents.power',
  ],
)
ensureCode(
  'CCSS',
  'N-RN.A.1',
  L(
    'Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents',
    'Explicar cómo la definición de exponentes racionales sigue de extender las propiedades de los exponentes enteros',
    'Wyjaśniać, jak definicja wykładników wymiernych wynika z rozszerzenia własności wykładników całkowitych',
  ),
  [
    'kp.alg1.exponents.product',
    'kp.alg1.exponents.quotient',
    'kp.alg1.exponents.power',
  ],
)
ensureCode(
  'CCSS',
  'A-APR.A.1',
  L(
    'Understand that polynomials form a system analogous to the integers; add, subtract, and multiply polynomials',
    'Comprender que los polinomios forman un sistema análogo a los enteros; sumar, restar y multiplicar polinomios',
    'Rozumieć, że wielomiany tworzą układ analogiczny do liczb całkowitych; dodawać, odejmować i mnożyć wielomiany',
  ),
  [
    'kp.alg1.polynomial.classify',
    'kp.alg1.polynomial.add',
    'kp.alg1.polynomial.subtract',
  ],
)

existingStd.lessonCoverage['alg1-l10'] = [
  'A.5(C)',
  'A.2(I)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  '8.EE.C.8a',
  '8.EE.C.8b',
  'A-REI.C.5',
  'A-REI.C.6',
  'A-REI.D.11',
]
existingStd.lessonCoverage['alg1-l11'] = [
  'A.11(B)',
  'A.1(D)',
  'A.1(F)',
  '8.EE.A.1',
  'N-RN.A.1',
  'A-SSE.A.1',
]
existingStd.lessonCoverage['alg1-l12'] = [
  'A.10(A)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-APR.A.1',
  'A-SSE.A.1',
  'A-SSE.A.1a',
]

const l10Elim = [TX('A.5(C)', 'A.2(I)', 'A.1(B)'), CC('8.EE.C.8b', 'A-REI.C.6', 'A-REI.C.5')]
const l10Scale = [TX('A.5(C)', 'A.1(B)', 'A.1(F)'), CC('A-REI.C.5', 'A-REI.C.6', '8.EE.C.8b')]
const l10Ver = [TX('A.5(C)', 'A.1(D)', 'A.1(B)'), CC('8.EE.C.8a', 'A-REI.C.6', 'A-REI.D.11')]

const l11Prod = [TX('A.11(B)', 'A.1(D)', 'A.1(F)'), CC('8.EE.A.1', 'N-RN.A.1', 'A-SSE.A.1')]
const l11Quot = [TX('A.11(B)', 'A.1(D)', 'A.1(F)'), CC('8.EE.A.1', 'N-RN.A.1', 'A-SSE.A.1')]
const l11Pow = [TX('A.11(B)', 'A.1(D)', 'A.1(F)'), CC('8.EE.A.1', 'N-RN.A.1', 'A-SSE.A.1')]

const l12Class = [TX('A.10(A)', 'A.1(D)', 'A.1(F)'), CC('A-SSE.A.1a', 'A-APR.A.1', 'A-SSE.A.1')]
const l12Add = [TX('A.10(A)', 'A.1(F)', 'A.1(B)'), CC('A-APR.A.1', 'A-SSE.A.1a', 'A-SSE.A.1')]
const l12Sub = [TX('A.10(A)', 'A.1(F)', 'A.1(B)'), CC('A-APR.A.1', 'A-SSE.A.1a', 'A-SSE.A.1')]

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
    if (s.math) partial.promptMath = s.math
    if (s.tags) partial.diagnosticTags = s.tags
    if (s.latex) partial.correctLatex = s.latex
    if (s.num !== undefined) partial.acceptNumeric = s.num
    if (s.tol !== undefined) partial.tolerance = s.tol
    if (s.choices0) {
      const keyed = withKey(s.choices0, s.key !== undefined ? s.key : keyCycle(mcIdx++))
      partial.choices = keyed.choices
      partial.correctIndex = keyed.correctIndex
    }
    items.push(item(partial))
  }
  return items
}

/* ═══════════════════════════════════════
   LESSON 10 — Systems: elimination + check
   ═══════════════════════════════════════ */
const l10Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.25,
    b: -1.05,
    prompt: L(
      'To eliminate x in { x + y = 5 ; −x + 2y = 4 }, what do you do first?',
      'Para eliminar x en { x + y = 5 ; −x + 2y = 4 }, ¿qué haces primero?',
      'Aby wyeliminować x w { x + y = 5 ; −x + 2y = 4 }, co robisz najpierw?',
    ),
    math: 'x + y = 5,\\quad -x + 2y = 4',
    choices0: L(
      ['Add the equations (x terms cancel)', 'Subtract them without aligning', 'Divide both by x', 'Graph only'],
      ['Sumar las ecuaciones (se cancelan las x)', 'Restarlas sin alinear', 'Dividir ambas entre x', 'Solo graficar'],
      ['Dodać równania (wyrazy x się kasują)', 'Odjąć bez wyrównania', 'Podzielić obie przez x', 'Tylko rysować'],
    ),
    fc: L('Coefficients of x are 1 and −1 — add to eliminate x.', 'Coeficientes de x son 1 y −1 — suma para eliminar x.', 'Współczynniki x to 1 i −1 — dodaj, by wyeliminować x.'),
    fi: L('Look for opposite coefficients, then add (or equal coefficients, then subtract).', 'Busca coeficientes opuestos y suma (o iguales y resta).', 'Szukaj przeciwnych współczynników i dodaj (lub równych i odejmij).'),
    tags: ['no_cancel', 'graph_only'],
    stds: l10Elim,
  },
  {
    id: 't02',
    kp: 'kp.alg1.systems.verify',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'Does (2, 3) solve { x + y = 5 ; 2x − y = 1 }?',
      '¿(2, 3) resuelve { x + y = 5 ; 2x − y = 1 }?',
      'Czy (2, 3) rozwiązuje { x + y = 5 ; 2x − y = 1 }?',
    ),
    math: 'x + y = 5,\\quad 2x - y = 1',
    choices0: L(
      ['Yes — both equations true', 'No — only the first is true', 'No — only the second is true', 'No — neither is true'],
      ['Sí — ambas verdaderas', 'No — solo la primera', 'No — solo la segunda', 'No — ninguna'],
      ['Tak — oba prawdziwe', 'Nie — tylko pierwsze', 'Nie — tylko drugie', 'Nie — żadne'],
    ),
    fc: L('2+3=5 and 4−3=1 — both hold.', '2+3=5 y 4−3=1 — ambas se cumplen.', '2+3=5 i 4−3=1 — oba zachodzą.'),
    fi: L('Substitute into BOTH equations before deciding.', 'Sustituye en AMBAS ecuaciones antes de decidir.', 'Podstaw do OBU równań przed decyzją.'),
    tags: ['one_equation_only'],
    stds: l10Ver,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.35,
    b: -0.55,
    prompt: L(
      'Add { 3x + y = 7 ; −3x + 2y = 8 }. What equation remains?',
      'Suma { 3x + y = 7 ; −3x + 2y = 8 }. ¿Qué ecuación queda?',
      'Dodaj { 3x + y = 7 ; −3x + 2y = 8 }. Jakie równanie zostaje?',
    ),
    math: '3x + y = 7,\\quad -3x + 2y = 8',
    choices0: L(
      ['3y = 15', 'y = 15', '6x + 3y = 15', '−6x + 3y = 15'],
      ['3y = 15', 'y = 15', '6x + 3y = 15', '−6x + 3y = 15'],
      ['3y = 15', 'y = 15', '6x + 3y = 15', '−6x + 3y = 15'],
    ),
    fc: L('x terms cancel; y + 2y = 3y and 7 + 8 = 15.', 'Se cancelan las x; y + 2y = 3y y 7 + 8 = 15.', 'Wyrazy x się kasują; y + 2y = 3y i 7 + 8 = 15.'),
    fi: L('Add corresponding terms; the ±3x pair should cancel.', 'Suma términos correspondientes; el par ±3x debe cancelarse.', 'Dodaj odpowiadające wyrazy; para ±3x powinna się skasować.'),
    tags: ['forgot_cancel', 'added_x'],
    stds: l10Elim,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.4,
    b: -0.35,
    prompt: L(
      'From 3y = 15 after elimination, what is y?',
      'De 3y = 15 tras eliminar, ¿cuánto es y?',
      'Z 3y = 15 po eliminacji, ile wynosi y?',
    ),
    math: '3y = 15',
    choices0: L(['5', '15', '3', '12'], ['5', '15', '3', '12'], ['5', '15', '3', '12']),
    latex: '5',
    num: 5,
    fc: L('Divide both sides by 3: y = 5.', 'Divide ambos lados entre 3: y = 5.', 'Podziel obie strony przez 3: y = 5.'),
    fi: L('Solve the one-variable equation after elimination.', 'Resuelve la ecuación de una variable tras eliminar.', 'Rozwiąż równanie jednej zmiennej po eliminacji.'),
    tags: ['arithmetic_error'],
    stds: l10Elim,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.systems.elimination.scale',
    diff: 0.45,
    b: -0.1,
    prompt: L(
      'For { 2x + y = 8 ; x + 3y = 9 }, multiply the second by 2. New second equation?',
      'Para { 2x + y = 8 ; x + 3y = 9 }, multiplica la segunda por 2. ¿Nueva segunda?',
      'Dla { 2x + y = 8 ; x + 3y = 9 } pomnóż drugie przez 2. Nowe drugie?',
    ),
    math: '2x + y = 8,\\quad x + 3y = 9',
    choices0: L(
      ['2x + 6y = 18', '2x + 3y = 18', 'x + 6y = 18', '2x + 6y = 9'],
      ['2x + 6y = 18', '2x + 3y = 18', 'x + 6y = 18', '2x + 6y = 9'],
      ['2x + 6y = 18', '2x + 3y = 18', 'x + 6y = 18', '2x + 6y = 9'],
    ),
    fc: L('Multiply every term: 2(x) + 2(3y) = 2(9).', 'Multiplica cada término: 2(x) + 2(3y) = 2(9).', 'Pomnóż każdy wyraz: 2(x) + 2(3y) = 2(9).'),
    fi: L('Scale both sides completely — every term.', 'Escala ambos lados por completo — cada término.', 'Przeskaluj obie strony całkowicie — każdy wyraz.'),
    tags: ['partial_scale', 'rhs_forgot'],
    stds: l10Scale,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.systems.verify',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Does (1, 4) solve { 2x + y = 6 ; x − y = −1 }?',
      '¿(1, 4) resuelve { 2x + y = 6 ; x − y = −1 }?',
      'Czy (1, 4) rozwiązuje { 2x + y = 6 ; x − y = −1 }?',
    ),
    math: '2x + y = 6,\\quad x - y = -1',
    choices0: L(
      ['No — fails the second equation', 'Yes — both true', 'No — fails the first only', 'Yes — one equation is enough'],
      ['No — falla la segunda', 'Sí — ambas verdaderas', 'No — falla solo la primera', 'Sí — basta una ecuación'],
      ['Nie — nie spełnia drugiego', 'Tak — oba prawdziwe', 'Nie — nie spełnia tylko pierwszego', 'Tak — wystarczy jedno'],
    ),
    fc: L('2(1)+4=6 true, but 1−4=−3 ≠ −1.', '2(1)+4=6 verdad, pero 1−4=−3 ≠ −1.', '2(1)+4=6 prawda, ale 1−4=−3 ≠ −1.'),
    fi: L('Both must hold; failing one means not a solution.', 'Ambas deben cumplirse; fallar una = no es solución.', 'Oba muszą zachodzić; niespełnienie jednego = nie rozwiązanie.'),
    tags: ['one_equation_only'],
    stds: l10Ver,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      '{ x + 2y = 10 ; x − 2y = 2 }. After eliminating y, what is x?',
      '{ x + 2y = 10 ; x − 2y = 2 }. Tras eliminar y, ¿cuánto es x?',
      '{ x + 2y = 10 ; x − 2y = 2 }. Po wyeliminowaniu y, ile wynosi x?',
    ),
    math: 'x + 2y = 10,\\quad x - 2y = 2',
    choices0: L(['6', '4', '8', '2'], ['6', '4', '8', '2'], ['6', '4', '8', '2']),
    latex: '6',
    num: 6,
    fc: L('Add: 2x = 12 → x = 6.', 'Suma: 2x = 12 → x = 6.', 'Dodaj: 2x = 12 → x = 6.'),
    fi: L('Add to cancel ±2y, then divide by 2.', 'Suma para cancelar ±2y, luego divide entre 2.', 'Dodaj, by skasować ±2y, potem podziel przez 2.'),
    tags: ['wrong_op', 'arithmetic_error'],
    stds: l10Elim,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.4,
    b: -0.15,
    prompt: L(
      '{ 4x − y = 10 ; 2x + y = 8 }. Find x after eliminating y.',
      '{ 4x − y = 10 ; 2x + y = 8 }. Halla x tras eliminar y.',
      '{ 4x − y = 10 ; 2x + y = 8 }. Znajdź x po wyeliminowaniu y.',
    ),
    math: '4x - y = 10,\\quad 2x + y = 8',
    choices0: L(['3', '2', '4', '6'], ['3', '2', '4', '6'], ['3', '2', '4', '6']),
    latex: '3',
    num: 3,
    fc: L('Add: 6x = 18 → x = 3.', 'Suma: 6x = 18 → x = 3.', 'Dodaj: 6x = 18 → x = 3.'),
    fi: L('±y cancel when you add; then solve for x.', '±y se cancelan al sumar; luego resuelve x.', '±y kasują się przy dodawaniu; potem rozwiąż x.'),
    tags: ['wrong_op', 'arithmetic_error'],
    stds: l10Elim,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Same system: 4x − y = 10, 2x + y = 8. Find y.',
      'Mismo sistema: 4x − y = 10, 2x + y = 8. Halla y.',
      'Ten sam układ: 4x − y = 10, 2x + y = 8. Znajdź y.',
    ),
    math: '4x - y = 10,\\quad 2x + y = 8',
    choices0: L(['2', '3', '−2', '8'], ['2', '3', '−2', '8'], ['2', '3', '−2', '8']),
    latex: '2',
    num: 2,
    fc: L('x = 3 → 2(3) + y = 8 → y = 2. Solution (3, 2).', 'x = 3 → 2(3) + y = 8 → y = 2. Solución (3, 2).', 'x = 3 → 2(3) + y = 8 → y = 2. Rozwiązanie (3, 2).'),
    fi: L('Back-substitute x into either original equation.', 'Sustituye x de vuelta en cualquiera de las originales.', 'Podstaw x z powrotem do któregokolwiek oryginalnego.'),
    tags: ['stop_after_one_var', 'sign_error'],
    stds: l10Elim,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.systems.verify',
    diff: 0.45,
    b: 0.1,
    prompt: L(
      'Does (3, 2) solve { 4x − y = 10 ; 2x + y = 8 }?',
      '¿(3, 2) resuelve { 4x − y = 10 ; 2x + y = 8 }?',
      'Czy (3, 2) rozwiązuje { 4x − y = 10 ; 2x + y = 8 }?',
    ),
    math: '4x - y = 10,\\quad 2x + y = 8',
    choices0: L(
      ['Yes — both equations true', 'No — only the first', 'No — only the second', 'No — neither'],
      ['Sí — ambas verdaderas', 'No — solo la primera', 'No — solo la segunda', 'No — ninguna'],
      ['Tak — oba prawdziwe', 'Nie — tylko pierwsze', 'Nie — tylko drugie', 'Nie — żadne'],
    ),
    fc: L('12 − 2 = 10 and 6 + 2 = 8 — both true.', '12 − 2 = 10 y 6 + 2 = 8 — ambas verdaderas.', '12 − 2 = 10 i 6 + 2 = 8 — oba prawdziwe.'),
    fi: L('Checking both equations confirms the elimination result.', 'Comprobar ambas confirma el resultado de eliminación.', 'Sprawdzenie obu potwierdza wynik eliminacji.'),
    tags: ['one_equation_only'],
    stds: l10Ver,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.systems.elimination.scale',
    diff: 0.5,
    b: 0.25,
    prompt: L(
      '{ 3x + 2y = 16 ; x + y = 7 }. Multiply second by 2, then subtract from first. What remains?',
      '{ 3x + 2y = 16 ; x + y = 7 }. Multiplica la segunda por 2 y réstala de la primera. ¿Qué queda?',
      '{ 3x + 2y = 16 ; x + y = 7 }. Pomnóż drugie przez 2 i odejmij od pierwszego. Co zostaje?',
    ),
    math: '3x + 2y = 16,\\quad x + y = 7',
    choices0: L(
      ['x = 2', 'y = 2', '5x = 30', 'x + 2y = 2'],
      ['x = 2', 'y = 2', '5x = 30', 'x + 2y = 2'],
      ['x = 2', 'y = 2', '5x = 30', 'x + 2y = 2'],
    ),
    fc: L('Second×2: 2x+2y=14. Subtract from first: x = 2.', 'Segunda×2: 2x+2y=14. Resta de la primera: x = 2.', 'Drugie×2: 2x+2y=14. Odejmij od pierwszego: x = 2.'),
    fi: L('After scaling, subtract carefully term by term.', 'Tras escalar, resta término a término con cuidado.', 'Po przeskalowaniu odejmuj wyraz po wyrazie.'),
    tags: ['wrong_op', 'partial_scale'],
    stds: l10Scale,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.systems.elimination.scale',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Same scaled system: x = 2. Find y from x + y = 7.',
      'Mismo sistema escalado: x = 2. Halla y desde x + y = 7.',
      'Ten sam układ: x = 2. Znajdź y z x + y = 7.',
    ),
    math: 'x + y = 7',
    choices0: L(['5', '2', '7', '9'], ['5', '2', '7', '9'], ['5', '2', '7', '9']),
    latex: '5',
    num: 5,
    fc: L('2 + y = 7 → y = 5. Solution (2, 5).', '2 + y = 7 → y = 5. Solución (2, 5).', '2 + y = 7 → y = 5. Rozwiązanie (2, 5).'),
    fi: L('Back-substitute the found x into the simpler equation.', 'Sustituye x hallada en la ecuación más simple.', 'Podstaw znalezione x do prostszego równania.'),
    tags: ['stop_after_one_var'],
    stds: l10Scale,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.systems.verify',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Does (0, 7) solve { x + y = 7 ; 3x + 2y = 16 }?',
      '¿(0, 7) resuelve { x + y = 7 ; 3x + 2y = 16 }?',
      'Czy (0, 7) rozwiązuje { x + y = 7 ; 3x + 2y = 16 }?',
    ),
    math: 'x + y = 7,\\quad 3x + 2y = 16',
    choices0: L(
      ['No — fails the second equation', 'Yes — both true', 'No — fails the first only', 'Yes — y alone is enough'],
      ['No — falla la segunda', 'Sí — ambas verdaderas', 'No — falla solo la primera', 'Sí — basta con y'],
      ['Nie — nie spełnia drugiego', 'Tak — oba prawdziwe', 'Nie — nie spełnia tylko pierwszego', 'Tak — samo y wystarczy'],
    ),
    fc: L('0+7=7 true, but 0+14=14 ≠ 16.', '0+7=7 verdad, pero 0+14=14 ≠ 16.', '0+7=7 prawda, ale 0+14=14 ≠ 16.'),
    fi: L('Satisfying one equation is not enough for a system.', 'Cumplir una ecuación no basta para un sistema.', 'Spełnienie jednego równania nie wystarcza w układzie.'),
    tags: ['one_equation_only'],
    stds: l10Ver,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.55,
    b: 0.45,
    prompt: L(
      '{ 5x + 3y = 19 ; 5x − y = 7 }. Eliminate x. What is y?',
      '{ 5x + 3y = 19 ; 5x − y = 7 }. Elimina x. ¿Cuánto es y?',
      '{ 5x + 3y = 19 ; 5x − y = 7 }. Wyeliminuj x. Ile wynosi y?',
    ),
    math: '5x + 3y = 19,\\quad 5x - y = 7',
    choices0: L(['3', '2', '4', '1'], ['3', '2', '4', '1'], ['3', '2', '4', '1']),
    latex: '3',
    num: 3,
    fc: L('Subtract: 4y = 12 → y = 3.', 'Resta: 4y = 12 → y = 3.', 'Odejmij: 4y = 12 → y = 3.'),
    fi: L('Equal 5x coefficients → subtract the equations.', 'Coeficientes 5x iguales → resta las ecuaciones.', 'Równe współczynniki 5x → odejmij równania.'),
    tags: ['wrong_op', 'arithmetic_error'],
    stds: l10Elim,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.systems.elimination',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Same system: y = 3. Find the solution pair (x, y).',
      'Mismo sistema: y = 3. Halla el par (x, y).',
      'Ten sam układ: y = 3. Znajdź parę (x, y).',
    ),
    math: '5x - y = 7',
    choices0: L(
      ['(2, 3)', '(3, 2)', '(1, 3)', '(2, 2)'],
      ['(2, 3)', '(3, 2)', '(1, 3)', '(2, 2)'],
      ['(2, 3)', '(3, 2)', '(1, 3)', '(2, 2)'],
    ),
    fc: L('5x − 3 = 7 → 5x = 10 → x = 2 → (2, 3).', '5x − 3 = 7 → 5x = 10 → x = 2 → (2, 3).', '5x − 3 = 7 → 5x = 10 → x = 2 → (2, 3).'),
    fi: L('Back-substitute y into either equation for x.', 'Sustituye y de vuelta para hallar x.', 'Podstaw y z powrotem, by znaleźć x.'),
    tags: ['swap_xy', 'stop_after_one_var'],
    stds: l10Elim,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.systems.elimination.scale',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Why multiply an equation before eliminating?',
      '¿Por qué multiplicar una ecuación antes de eliminar?',
      'Dlaczego mnożyć równanie przed eliminacją?',
    ),
    math: 'a x + b y = c',
    choices0: L(
      ['To make one variable’s coefficients opposites or equal', 'To change the solution of the system', 'To remove the equals sign', 'Only to make numbers larger'],
      ['Para hacer opuestos o iguales los coeficientes de una variable', 'Para cambiar la solución del sistema', 'Para quitar el signo igual', 'Solo para hacer números más grandes'],
      ['Aby współczynniki jednej zmiennej stały się przeciwne lub równe', 'Aby zmienić rozwiązanie układu', 'Aby usunąć znak równości', 'Tylko by powiększyć liczby'],
    ),
    fc: L('Scaling creates matching coefficients so add/subtract cancels a variable (A-REI.C.5).', 'Escalar crea coeficientes iguales para cancelar una variable (A-REI.C.5).', 'Skalowanie wyrównuje współczynniki, by skasować zmienną (A-REI.C.5).'),
    fi: L('The goal is cancellation of one variable, not changing the solution set.', 'La meta es cancelar una variable, no cambiar el conjunto solución.', 'Celem jest skasowanie zmiennej, nie zmiana zbioru rozwiązań.'),
    tags: ['changes_solution', 'cosmetic_only'],
    stds: l10Scale,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.systems.verify',
    diff: 0.65,
    b: 0.6,
    prompt: L(
      'Best reason to check after elimination?',
      '¿Mejor razón para comprobar tras eliminar?',
      'Najlepszy powód sprawdzania po eliminacji?',
    ),
    choices0: L(
      ['Catch arithmetic errors by testing both original equations', 'Checking is optional if graphs look close', 'Only the first equation matters', 'Verification replaces solving'],
      ['Detectar errores aritméticos probando ambas ecuaciones originales', 'Comprobar es opcional si las gráficas se ven cerca', 'Solo importa la primera ecuación', 'Verificar reemplaza resolver'],
      ['Wykryć błędy rachunkowe testując oba oryginalne równania', 'Sprawdzanie opcjonalne, gdy wykresy wyglądają blisko', 'Liczy się tylko pierwsze równanie', 'Weryfikacja zastępuje rozwiązywanie'],
    ),
    math: '(x, y)',
    fc: L('A true solution must satisfy both originals — verification catches slips.', 'Una solución verdadera cumple ambas originales — la verificación atrapa errores.', 'Prawdziwe rozwiązanie spełnia oba oryginały — weryfikacja łapie potknięcia.'),
    fi: L('Always check both equations; near misses on a graph are not enough.', 'Siempre comprueba ambas; acercarse en una gráfica no basta.', 'Zawsze sprawdzaj oba; blisko na wykresie nie wystarczy.'),
    tags: ['skip_check', 'one_equation_only'],
    stds: l10Ver,
  },
]

const lesson10Items = buildItems('alg1-l10', l10Specs)
const lesson10 = {
  id: 'alg1-l10',
  courseId: 'algebra1',
  order: 10,
  title: L(
    'Systems — Elimination Method & Checking',
    'Sistemas — método de eliminación y comprobación',
    'Układy — metoda eliminacji i sprawdzanie',
  ),
  knowledgePointIds: [
    'kp.alg1.systems.elimination',
    'kp.alg1.systems.elimination.scale',
    'kp.alg1.systems.verify',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_10', unlockOnMastery: ['lesson_board_11'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will solve 2×2 linear systems by elimination (including scaling), then verify ordered pairs in both equations.',
        'Resolverás sistemas lineales 2×2 por eliminación (incluyendo escalado) y verificarás pares ordenados en ambas ecuaciones.',
        'Będziesz rozwiązywać układy 2×2 metodą eliminacji (w tym skalowanie) i weryfikować pary w obu równaniach.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: eliminate & verify', 'Enseñar: eliminar y verificar', 'Nauczanie: eliminacja i weryfikacja'),
      body: L(
        'Align variables, add or subtract to cancel one variable (scale first if needed), solve, back-substitute, then check both originals.',
        'Alinea variables, suma o resta para cancelar una (escala primero si hace falta), resuelve, sustituye de vuelta y comprueba ambas originales.',
        'Wyrównaj zmienne, dodaj lub odejmij by skasować jedną (przeskaluj gdy trzeba), rozwiąż, podstaw z powrotem i sprawdź oba oryginały.',
      ),
      bodyMath: [
        'x + y = 5,\\; -x + 2y = 4',
        '3y = 9 \\Rightarrow y = 3',
        '(x, y) = (2, 3)',
      ],
      itemIds: ['alg1-l10-t01', 'alg1-l10-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Practice adding to cancel, scaling, solving for each variable, and rejecting false pairs.',
        'Practica sumar para cancelar, escalar, resolver cada variable y rechazar pares falsos.',
        'Ćwicz dodawanie do kasowania, skalowanie, rozwiązywanie zmiennych i odrzucanie fałszywych par.',
      ),
      itemIds: ['alg1-l10-g01', 'alg1-l10-g02', 'alg1-l10-g03', 'alg1-l10-g04', 'alg1-l10-g05'],
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
        'alg1-l10-i01',
        'alg1-l10-i02',
        'alg1-l10-i03',
        'alg1-l10-i04',
        'alg1-l10-i05',
        'alg1-l10-i06',
        'alg1-l10-i07',
        'alg1-l10-i08',
        'alg1-l10-i09',
        'alg1-l10-i10',
      ],
    },
  ],
  items: lesson10Items,
}

/* ═══════════════════════════════════════
   LESSON 11 — Exponent properties
   ═══════════════════════════════════════ */
const l11Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.exponents.product',
    diff: 0.25,
    b: -1.1,
    prompt: L(
      'Simplify x^3 · x^4 using the product rule.',
      'Simplifica x^3 · x^4 con la regla del producto.',
      'Uprość x^3 · x^4 regułą iloczynu.',
    ),
    math: 'x^{3} \\cdot x^{4}',
    choices0: L(
      ['x^7', 'x^12', 'x^1', '2x^7'],
      ['x^7', 'x^12', 'x^1', '2x^7'],
      ['x^7', 'x^12', 'x^1', '2x^7'],
    ),
    fc: L('Same base: add exponents — 3 + 4 = 7.', 'Misma base: suma exponentes — 3 + 4 = 7.', 'Ta sama podstawa: dodaj wykładniki — 3 + 4 = 7.'),
    fi: L('Product rule: a^m · a^n = a^(m+n), not a^(mn).', 'Regla del producto: a^m · a^n = a^(m+n), no a^(mn).', 'Reguła iloczynu: a^m · a^n = a^(m+n), nie a^(mn).'),
    tags: ['multiply_exponents', 'add_bases'],
    stds: l11Prod,
  },
  {
    id: 't02',
    kp: 'kp.alg1.exponents.power',
    diff: 0.3,
    b: -0.9,
    prompt: L(
      'Simplify (y^2)^5 using the power rule.',
      'Simplifica (y^2)^5 con la regla de potencia.',
      'Uprość (y^2)^5 regułą potęgi.',
    ),
    math: '(y^{2})^{5}',
    choices0: L(
      ['y^10', 'y^7', 'y^25', '5y^2'],
      ['y^10', 'y^7', 'y^25', '5y^2'],
      ['y^10', 'y^7', 'y^25', '5y^2'],
    ),
    fc: L('Multiply exponents: 2 · 5 = 10.', 'Multiplica exponentes: 2 · 5 = 10.', 'Pomnóż wykładniki: 2 · 5 = 10.'),
    fi: L('Power rule: (a^m)^n = a^(mn), not a^(m+n).', 'Regla de potencia: (a^m)^n = a^(mn), no a^(m+n).', 'Reguła potęgi: (a^m)^n = a^(mn), nie a^(m+n).'),
    tags: ['add_instead', 'tower_wrong'],
    stds: l11Pow,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.exponents.product',
    diff: 0.35,
    b: -0.55,
    prompt: L(
      'Simplify 2^3 · 2^2.',
      'Simplifica 2^3 · 2^2.',
      'Uprość 2^3 · 2^2.',
    ),
    math: '2^{3} \\cdot 2^{2}',
    choices0: L(['2^5', '2^6', '4^5', '2^1'], ['2^5', '2^6', '4^5', '2^1'], ['2^5', '2^6', '4^5', '2^1']),
    fc: L('Add exponents: 3 + 2 = 5 → 2^5.', 'Suma exponentes: 3 + 2 = 5 → 2^5.', 'Dodaj wykładniki: 3 + 2 = 5 → 2^5.'),
    fi: L('Keep the base 2; only add the exponents.', 'Mantén la base 2; solo suma los exponentes.', 'Zachowaj podstawę 2; tylko dodaj wykładniki.'),
    tags: ['multiply_exponents', 'multiply_bases'],
    stds: l11Prod,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.exponents.quotient',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Simplify a^8 / a^3.',
      'Simplifica a^8 / a^3.',
      'Uprość a^8 / a^3.',
    ),
    math: '\\dfrac{a^{8}}{a^{3}}',
    choices0: L(
      ['a^5', 'a^11', 'a^24', 'a^(8/3)'],
      ['a^5', 'a^11', 'a^24', 'a^(8/3)'],
      ['a^5', 'a^11', 'a^24', 'a^(8/3)'],
    ),
    fc: L('Subtract exponents: 8 − 3 = 5.', 'Resta exponentes: 8 − 3 = 5.', 'Odejmij wykładniki: 8 − 3 = 5.'),
    fi: L('Quotient rule: a^m / a^n = a^(m−n).', 'Regla del cociente: a^m / a^n = a^(m−n).', 'Reguła ilorazu: a^m / a^n = a^(m−n).'),
    tags: ['add_exponents', 'divide_exponents'],
    stds: l11Quot,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.exponents.quotient',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Simplify b^4 / b^4.',
      'Simplifica b^4 / b^4.',
      'Uprość b^4 / b^4.',
    ),
    math: '\\dfrac{b^{4}}{b^{4}}',
    choices0: L(
      ['b^0 which equals 1 (b ≠ 0)', 'b^1', 'b^8', '0'],
      ['b^0 que vale 1 (b ≠ 0)', 'b^1', 'b^8', '0'],
      ['b^0 równe 1 (b ≠ 0)', 'b^1', 'b^8', '0'],
    ),
    fc: L('4 − 4 = 0 → b^0 = 1 for b ≠ 0.', '4 − 4 = 0 → b^0 = 1 si b ≠ 0.', '4 − 4 = 0 → b^0 = 1 dla b ≠ 0.'),
    fi: L('Equal exponents subtract to 0; nonzero base to the 0 is 1.', 'Exponentes iguales restan a 0; base no nula a la 0 es 1.', 'Równe wykładniki dają 0; niezerowa podstawa do 0 to 1.'),
    tags: ['zero_power_wrong', 'add_exponents'],
    stds: l11Quot,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.exponents.power',
    diff: 0.45,
    b: 0.1,
    prompt: L(
      'Simplify (3^2)^3.',
      'Simplifica (3^2)^3.',
      'Uprość (3^2)^3.',
    ),
    math: '(3^{2})^{3}',
    choices0: L(['3^6', '3^5', '9^3', '3^8'], ['3^6', '3^5', '9^3', '3^8'], ['3^6', '3^5', '9^3', '3^8']),
    fc: L('2 · 3 = 6 → 3^6.', '2 · 3 = 6 → 3^6.', '2 · 3 = 6 → 3^6.'),
    fi: L('Multiply the exponents; keep base 3.', 'Multiplica los exponentes; mantén base 3.', 'Pomnóż wykładniki; zachowaj podstawę 3.'),
    tags: ['add_instead', 'change_base'],
    stds: l11Pow,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.exponents.product',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Simplify m^2 · m · m^5 (remember m = m^1).',
      'Simplifica m^2 · m · m^5 (recuerda m = m^1).',
      'Uprość m^2 · m · m^5 (pamiętaj m = m^1).',
    ),
    math: 'm^{2} \\cdot m \\cdot m^{5}',
    choices0: L(
      ['m^8', 'm^7', 'm^10', '3m^7'],
      ['m^8', 'm^7', 'm^10', '3m^7'],
      ['m^8', 'm^7', 'm^10', '3m^7'],
    ),
    fc: L('2 + 1 + 5 = 8 → m^8.', '2 + 1 + 5 = 8 → m^8.', '2 + 1 + 5 = 8 → m^8.'),
    fi: L('Treat bare m as m^1, then add all exponents.', 'Trata m solo como m^1 y suma todos los exponentes.', 'Traktuj samo m jako m^1 i dodaj wszystkie wykładniki.'),
    tags: ['forgot_m1', 'multiply_exponents'],
    stds: l11Prod,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.exponents.product',
    diff: 0.4,
    b: -0.1,
    prompt: L('Simplify x^5 · x^2.', 'Simplifica x^5 · x^2.', 'Uprość x^5 · x^2.'),
    math: 'x^{5} \\cdot x^{2}',
    choices0: L(['x^7', 'x^10', 'x^3', '2x^7'], ['x^7', 'x^10', 'x^3', '2x^7'], ['x^7', 'x^10', 'x^3', '2x^7']),
    fc: L('5 + 2 = 7.', '5 + 2 = 7.', '5 + 2 = 7.'),
    fi: L('Add exponents for the product of powers.', 'Suma exponentes para el producto de potencias.', 'Dodaj wykładniki dla iloczynu potęg.'),
    tags: ['multiply_exponents'],
    stds: l11Prod,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.exponents.quotient',
    diff: 0.45,
    b: 0.05,
    prompt: L('Simplify w^9 / w^4.', 'Simplifica w^9 / w^4.', 'Uprość w^9 / w^4.'),
    math: '\\dfrac{w^{9}}{w^{4}}',
    choices0: L(['w^5', 'w^13', 'w^36', 'w^(9/4)'], ['w^5', 'w^13', 'w^36', 'w^(9/4)'], ['w^5', 'w^13', 'w^36', 'w^(9/4)']),
    fc: L('9 − 4 = 5.', '9 − 4 = 5.', '9 − 4 = 5.'),
    fi: L('Subtract the bottom exponent from the top.', 'Resta el exponente de abajo del de arriba.', 'Odejmij dolny wykładnik od górnego.'),
    tags: ['add_exponents', 'divide_exponents'],
    stds: l11Quot,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.exponents.power',
    diff: 0.45,
    b: 0.15,
    prompt: L('Simplify (z^3)^4.', 'Simplifica (z^3)^4.', 'Uprość (z^3)^4.'),
    math: '(z^{3})^{4}',
    choices0: L(['z^12', 'z^7', 'z^81', '4z^3'], ['z^12', 'z^7', 'z^81', '4z^3'], ['z^12', 'z^7', 'z^81', '4z^3']),
    fc: L('3 · 4 = 12.', '3 · 4 = 12.', '3 · 4 = 12.'),
    fi: L('Multiply exponents for a power of a power.', 'Multiplica exponentes para potencia de potencia.', 'Pomnóż wykładniki dla potęgi potęgi.'),
    tags: ['add_instead'],
    stds: l11Pow,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.exponents.product',
    diff: 0.5,
    b: 0.25,
    prompt: L('Simplify 5^2 · 5^3 · 5.', 'Simplifica 5^2 · 5^3 · 5.', 'Uprość 5^2 · 5^3 · 5.'),
    math: '5^{2} \\cdot 5^{3} \\cdot 5',
    choices0: L(['5^6', '5^5', '5^7', '15^5'], ['5^6', '5^5', '5^7', '15^5'], ['5^6', '5^5', '5^7', '15^5']),
    fc: L('2 + 3 + 1 = 6 → 5^6.', '2 + 3 + 1 = 6 → 5^6.', '2 + 3 + 1 = 6 → 5^6.'),
    fi: L('Include the bare 5 as 5^1.', 'Incluye el 5 solo como 5^1.', 'Uwzględnij samo 5 jako 5^1.'),
    tags: ['forgot_m1', 'multiply_exponents'],
    stds: l11Prod,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.exponents.quotient',
    diff: 0.55,
    b: 0.35,
    prompt: L('Simplify (c^7) / (c^2).', 'Simplifica (c^7) / (c^2).', 'Uprość (c^7) / (c^2).'),
    math: '\\dfrac{c^{7}}{c^{2}}',
    choices0: L(['c^5', 'c^9', 'c^14', 'c^(7/2)'], ['c^5', 'c^9', 'c^14', 'c^(7/2)'], ['c^5', 'c^9', 'c^14', 'c^(7/2)']),
    fc: L('7 − 2 = 5.', '7 − 2 = 5.', '7 − 2 = 5.'),
    fi: L('Same base → subtract exponents.', 'Misma base → resta exponentes.', 'Ta sama podstawa → odejmij wykładniki.'),
    tags: ['add_exponents'],
    stds: l11Quot,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.exponents.power',
    diff: 0.55,
    b: 0.4,
    prompt: L('Simplify (n^4)^2.', 'Simplifica (n^4)^2.', 'Uprość (n^4)^2.'),
    math: '(n^{4})^{2}',
    choices0: L(['n^8', 'n^6', 'n^16', '2n^4'], ['n^8', 'n^6', 'n^16', '2n^4'], ['n^8', 'n^6', 'n^16', '2n^4']),
    fc: L('4 · 2 = 8.', '4 · 2 = 8.', '4 · 2 = 8.'),
    fi: L('Do not add 4 + 2 for a power of a power.', 'No sumes 4 + 2 para potencia de potencia.', 'Nie dodawaj 4 + 2 dla potęgi potęgi.'),
    tags: ['add_instead'],
    stds: l11Pow,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.exponents.product',
    diff: 0.55,
    b: 0.45,
    prompt: L(
      'Which expression equals x^3 · x^3?',
      '¿Qué expresión equivale a x^3 · x^3?',
      'Które wyrażenie równa się x^3 · x^3?',
    ),
    math: 'x^{3} \\cdot x^{3}',
    choices0: L(['x^6', '(x^3)^2 only is different', 'x^9', '6x'], ['x^6', 'solo (x^3)^2 es distinto', 'x^9', '6x'], ['x^6', 'tylko (x^3)^2 jest inne', 'x^9', '6x']),
    fc: L('3 + 3 = 6; also (x^3)^2 = x^6 — same value.', '3 + 3 = 6; también (x^3)^2 = x^6 — mismo valor.', '3 + 3 = 6; też (x^3)^2 = x^6 — ta sama wartość.'),
    fi: L('Product of equal powers adds exponents to 6.', 'Producto de potencias iguales suma exponentes a 6.', 'Iloczyn równych potęg dodaje wykładniki do 6.'),
    tags: ['multiply_exponents'],
    stds: l11Prod,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.exponents.quotient',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Simplify (d^5 · d^2) / d^4.',
      'Simplifica (d^5 · d^2) / d^4.',
      'Uprość (d^5 · d^2) / d^4.',
    ),
    math: '\\dfrac{d^{5} \\cdot d^{2}}{d^{4}}',
    choices0: L(['d^3', 'd^7', 'd^11', 'd^1'], ['d^3', 'd^7', 'd^11', 'd^1'], ['d^3', 'd^7', 'd^11', 'd^1']),
    fc: L('Numerator d^7; then 7 − 4 = 3.', 'Numerador d^7; luego 7 − 4 = 3.', 'Licznik d^7; potem 7 − 4 = 3.'),
    fi: L('First combine the product in the numerator, then subtract.', 'Primero combina el producto del numerador, luego resta.', 'Najpierw połącz iloczyn w liczniku, potem odejmij.'),
    tags: ['order_wrong', 'add_exponents'],
    stds: l11Quot,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.exponents.power',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Simplify ((p^2)^3) · p.',
      'Simplifica ((p^2)^3) · p.',
      'Uprość ((p^2)^3) · p.',
    ),
    math: '((p^{2})^{3}) \\cdot p',
    choices0: L(['p^7', 'p^6', 'p^5', 'p^8'], ['p^7', 'p^6', 'p^5', 'p^8'], ['p^7', 'p^6', 'p^5', 'p^8']),
    fc: L('(p^2)^3 = p^6; then p^6 · p^1 = p^7.', '(p^2)^3 = p^6; luego p^6 · p^1 = p^7.', '(p^2)^3 = p^6; potem p^6 · p^1 = p^7.'),
    fi: L('Power rule first, then product rule with p^1.', 'Primero potencia, luego producto con p^1.', 'Najpierw potęga, potem iloczyn z p^1.'),
    tags: ['forgot_m1', 'add_instead'],
    stds: l11Pow,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.exponents.product',
    diff: 0.65,
    b: 0.6,
    prompt: L(
      'Which rule turns a^m · a^n into a single power?',
      '¿Qué regla convierte a^m · a^n en una sola potencia?',
      'Która reguła zamienia a^m · a^n w jedną potęgę?',
    ),
    math: 'a^{m} \\cdot a^{n}',
    choices0: L(
      ['Add the exponents (product rule)', 'Multiply the exponents', 'Subtract the exponents', 'Divide the bases'],
      ['Sumar los exponentes (regla del producto)', 'Multiplicar los exponentes', 'Restar los exponentes', 'Dividir las bases'],
      ['Dodać wykładniki (reguła iloczynu)', 'Pomnożyć wykładniki', 'Odjąć wykładniki', 'Podzielić podstawy'],
    ),
    fc: L('Product rule: same base → add exponents.', 'Regla del producto: misma base → suma exponentes.', 'Reguła iloczynu: ta sama podstawa → dodaj wykładniki.'),
    fi: L('Multiplying exponents is for (a^m)^n, not a^m · a^n.', 'Multiplicar exponentes es para (a^m)^n, no a^m · a^n.', 'Mnożenie wykładników jest dla (a^m)^n, nie a^m · a^n.'),
    tags: ['rule_confusion'],
    stds: l11Prod,
  },
]

const lesson11Items = buildItems('alg1-l11', l11Specs)
const lesson11 = {
  id: 'alg1-l11',
  courseId: 'algebra1',
  order: 11,
  title: L(
    'Exponent Properties — Product, Quotient, Power',
    'Propiedades de exponentes — producto, cociente, potencia',
    'Własności potęg — iloczyn, iloraz, potęga',
  ),
  knowledgePointIds: [
    'kp.alg1.exponents.product',
    'kp.alg1.exponents.quotient',
    'kp.alg1.exponents.power',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_11', unlockOnMastery: ['lesson_board_12'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will simplify expressions using product, quotient, and power rules for exponents with the same base.',
        'Simplificarás expresiones usando las reglas de producto, cociente y potencia para exponentes de la misma base.',
        'Będziesz upraszczać wyrażenia regułami iloczynu, ilorazu i potęgi dla tej samej podstawy.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: three exponent rules', 'Enseñar: tres reglas de exponentes', 'Nauczanie: trzy reguły potęg'),
      body: L(
        'Same base: multiply → add exponents; divide → subtract; raise a power to a power → multiply exponents.',
        'Misma base: multiplicar → sumar exponentes; dividir → restar; potenciar una potencia → multiplicar exponentes.',
        'Ta sama podstawa: mnożenie → dodaj wykładniki; dzielenie → odejmij; potęga potęgi → pomnóż wykładniki.',
      ),
      bodyMath: [
        'a^{m} \\cdot a^{n} = a^{m+n}',
        '\\dfrac{a^{m}}{a^{n}} = a^{m-n}',
        '(a^{m})^{n} = a^{mn}',
      ],
      itemIds: ['alg1-l11-t01', 'alg1-l11-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Apply each rule to numbers and variables; watch for bare factors like m = m^1.',
        'Aplica cada regla a números y variables; vigila factores solos como m = m^1.',
        'Stosuj każdą regułę do liczb i zmiennych; uważaj na czynniki jak m = m^1.',
      ),
      itemIds: ['alg1-l11-g01', 'alg1-l11-g02', 'alg1-l11-g03', 'alg1-l11-g04', 'alg1-l11-g05'],
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
        'alg1-l11-i01',
        'alg1-l11-i02',
        'alg1-l11-i03',
        'alg1-l11-i04',
        'alg1-l11-i05',
        'alg1-l11-i06',
        'alg1-l11-i07',
        'alg1-l11-i08',
        'alg1-l11-i09',
        'alg1-l11-i10',
      ],
    },
  ],
  items: lesson11Items,
}

/* ═══════════════════════════════════════
   LESSON 12 — Polynomials add/sub/classify
   ═══════════════════════════════════════ */
const l12Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.25,
    b: -1.05,
    prompt: L(
      'What is the degree of 4x^3 − 2x + 7?',
      '¿Cuál es el grado de 4x^3 − 2x + 7?',
      'Jaki jest stopień 4x^3 − 2x + 7?',
    ),
    math: '4x^{3} - 2x + 7',
    choices0: L(
      ['3 (highest power of x)', '2 (number of variable terms)', '4 (leading coefficient)', '7 (constant term)'],
      ['3 (mayor potencia de x)', '2 (número de términos variables)', '4 (coeficiente principal)', '7 (término constante)'],
      ['3 (najwyższa potęga x)', '2 (liczba wyrazów zmiennych)', '4 (współczynnik wiodący)', '7 (wyraz wolny)'],
    ),
    fc: L('Degree is the highest exponent on the variable: 3.', 'El grado es el mayor exponente de la variable: 3.', 'Stopień to najwyższy wykładnik zmiennej: 3.'),
    fi: L('Do not confuse degree with coefficient or term count.', 'No confundas grado con coeficiente o número de términos.', 'Nie myl stopnia ze współczynnikiem ani liczbą wyrazów.'),
    tags: ['term_count_as_degree', 'coeff_as_degree'],
    stds: l12Class,
  },
  {
    id: 't02',
    kp: 'kp.alg1.polynomial.add',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'Add (2x + 3) + (5x − 1).',
      'Suma (2x + 3) + (5x − 1).',
      'Dodaj (2x + 3) + (5x − 1).',
    ),
    math: '(2x + 3) + (5x - 1)',
    choices0: L(
      ['7x + 2', '7x − 2', '3x + 2', '10x + 2'],
      ['7x + 2', '7x − 2', '3x + 2', '10x + 2'],
      ['7x + 2', '7x − 2', '3x + 2', '10x + 2'],
    ),
    fc: L('Like terms: 2x+5x=7x and 3+(−1)=2.', 'Términos semejantes: 2x+5x=7x y 3+(−1)=2.', 'Wyrazy podobne: 2x+5x=7x i 3+(−1)=2.'),
    fi: L('Combine x-terms and constants separately.', 'Combina términos en x y constantes por separado.', 'Łącz wyrazy z x i stałe osobno.'),
    tags: ['unlike_combined', 'sign_error'],
    stds: l12Add,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Classify 5x^2 by term count.',
      'Clasifica 5x^2 por número de términos.',
      'Sklasyfikuj 5x^2 według liczby wyrazów.',
    ),
    math: '5x^{2}',
    choices0: L(
      ['Monomial (one term)', 'Binomial', 'Trinomial', 'Constant only'],
      ['Monomio (un término)', 'Binomio', 'Trinomio', 'Solo constante'],
      ['Jednomian (jeden wyraz)', 'Dwumian', 'Trójmian', 'Tylko stała'],
    ),
    fc: L('One term → monomial; degree is still 2.', 'Un término → monomio; el grado sigue siendo 2.', 'Jeden wyraz → jednomian; stopień nadal 2.'),
    fi: L('Term count names mono/bi/tri; degree is the exponent.', 'El número de términos nombra mono/bi/tri; el grado es el exponente.', 'Liczba wyrazów nazywa jedno-/dwu-/trój-; stopień to wykładnik.'),
    tags: ['degree_as_type'],
    stds: l12Class,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.4,
    b: -0.25,
    prompt: L(
      'Classify x^2 + 3x − 4 by term count.',
      'Clasifica x^2 + 3x − 4 por número de términos.',
      'Sklasyfikuj x^2 + 3x − 4 według liczby wyrazów.',
    ),
    math: 'x^{2} + 3x - 4',
    choices0: L(
      ['Trinomial (three terms)', 'Binomial', 'Monomial', 'Degree 3 polynomial'],
      ['Trinomio (tres términos)', 'Binomio', 'Monomio', 'Polinomio de grado 3'],
      ['Trójmian (trzy wyrazy)', 'Dwumian', 'Jednomian', 'Wielomian stopnia 3'],
    ),
    fc: L('Three terms → trinomial; degree is 2.', 'Tres términos → trinomio; el grado es 2.', 'Trzy wyrazy → trójmian; stopień to 2.'),
    fi: L('Count terms for the name; highest power for degree.', 'Cuenta términos para el nombre; mayor potencia para el grado.', 'Policz wyrazy dla nazwy; najwyższa potęga dla stopnia.'),
    tags: ['degree_as_type', 'term_count_as_degree'],
    stds: l12Class,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.polynomial.add',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Add (x^2 + 4x) + (3x^2 − x + 5).',
      'Suma (x^2 + 4x) + (3x^2 − x + 5).',
      'Dodaj (x^2 + 4x) + (3x^2 − x + 5).',
    ),
    math: '(x^{2} + 4x) + (3x^{2} - x + 5)',
    choices0: L(
      ['4x^2 + 3x + 5', '4x^2 + 5x + 5', '3x^2 + 3x + 5', '4x^2 − 3x + 5'],
      ['4x^2 + 3x + 5', '4x^2 + 5x + 5', '3x^2 + 3x + 5', '4x^2 − 3x + 5'],
      ['4x^2 + 3x + 5', '4x^2 + 5x + 5', '3x^2 + 3x + 5', '4x^2 − 3x + 5'],
    ),
    fc: L('x^2+3x^2=4x^2; 4x+(−x)=3x; +5.', 'x^2+3x^2=4x^2; 4x+(−x)=3x; +5.', 'x^2+3x^2=4x^2; 4x+(−x)=3x; +5.'),
    fi: L('Combine only like powers of x.', 'Combina solo potencias semejantes de x.', 'Łącz tylko podobne potęgi x.'),
    tags: ['unlike_combined', 'sign_error'],
    stds: l12Add,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.polynomial.subtract',
    diff: 0.45,
    b: 0.15,
    prompt: L(
      'Subtract (5x + 2) − (3x − 4).',
      'Resta (5x + 2) − (3x − 4).',
      'Odejmij (5x + 2) − (3x − 4).',
    ),
    math: '(5x + 2) - (3x - 4)',
    choices0: L(
      ['2x + 6', '2x − 2', '8x − 2', '2x − 6'],
      ['2x + 6', '2x − 2', '8x − 2', '2x − 6'],
      ['2x + 6', '2x − 2', '8x − 2', '2x − 6'],
    ),
    fc: L('Distribute minus: 5x+2−3x+4 = 2x+6.', 'Distribuye el menos: 5x+2−3x+4 = 2x+6.', 'Rozdziel minus: 5x+2−3x+4 = 2x+6.'),
    fi: L('Minus before (3x − 4) flips both signs → −3x + 4.', 'El menos ante (3x − 4) cambia ambos signos → −3x + 4.', 'Minus przed (3x − 4) zmienia oba znaki → −3x + 4.'),
    tags: ['first_term_only', 'sign_error'],
    stds: l12Sub,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.polynomial.subtract',
    diff: 0.5,
    b: 0.25,
    prompt: L(
      'Subtract (2x^2 + x) − (x^2 − 3x).',
      'Resta (2x^2 + x) − (x^2 − 3x).',
      'Odejmij (2x^2 + x) − (x^2 − 3x).',
    ),
    math: '(2x^{2} + x) - (x^{2} - 3x)',
    choices0: L(
      ['x^2 + 4x', 'x^2 − 2x', '3x^2 + 4x', 'x^2 − 4x'],
      ['x^2 + 4x', 'x^2 − 2x', '3x^2 + 4x', 'x^2 − 4x'],
      ['x^2 + 4x', 'x^2 − 2x', '3x^2 + 4x', 'x^2 − 4x'],
    ),
    fc: L('2x^2+x − x^2 + 3x = x^2 + 4x.', '2x^2+x − x^2 + 3x = x^2 + 4x.', '2x^2+x − x^2 + 3x = x^2 + 4x.'),
    fi: L('Distribute the minus to every term of the second polynomial.', 'Distribuye el menos a cada término del segundo polinomio.', 'Rozdziel minus na każdy wyraz drugiego wielomianu.'),
    tags: ['first_term_only', 'sign_error'],
    stds: l12Sub,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.4,
    b: -0.1,
    prompt: L(
      'Degree of 9 − 6x?',
      '¿Grado de 9 − 6x?',
      'Stopień 9 − 6x?',
    ),
    math: '9 - 6x',
    choices0: L(['1', '0', '6', '9'], ['1', '0', '6', '9'], ['1', '0', '6', '9']),
    latex: '1',
    num: 1,
    fc: L('Highest power is x^1 → degree 1.', 'La mayor potencia es x^1 → grado 1.', 'Najwyższa potęga to x^1 → stopień 1.'),
    fi: L('Constants are degree 0; linear terms are degree 1.', 'Constantes son grado 0; términos lineales grado 1.', 'Stałe mają stopień 0; wyrazy liniowe stopień 1.'),
    tags: ['constant_as_degree', 'coeff_as_degree'],
    stds: l12Class,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Classify 7 by degree and type.',
      'Clasifica 7 por grado y tipo.',
      'Sklasyfikuj 7 według stopnia i typu.',
    ),
    math: '7',
    choices0: L(
      ['Constant monomial, degree 0', 'Linear binomial', 'Degree 7 monomial', 'Not a polynomial'],
      ['Monomio constante, grado 0', 'Binomio lineal', 'Monomio de grado 7', 'No es polinomio'],
      ['Stały jednomian, stopień 0', 'Liniowy dwumian', 'Jednomian stopnia 7', 'To nie wielomian'],
    ),
    fc: L('A nonzero constant is a degree-0 monomial.', 'Una constante no nula es un monomio de grado 0.', 'Niezerowa stała to jednomian stopnia 0.'),
    fi: L('The number itself is not the degree.', 'El número mismo no es el grado.', 'Sama liczba nie jest stopniem.'),
    tags: ['coeff_as_degree'],
    stds: l12Class,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.polynomial.add',
    diff: 0.45,
    b: 0.15,
    prompt: L(
      'Add (3x^2 − 5) + (x^2 + 2x + 1).',
      'Suma (3x^2 − 5) + (x^2 + 2x + 1).',
      'Dodaj (3x^2 − 5) + (x^2 + 2x + 1).',
    ),
    math: '(3x^{2} - 5) + (x^{2} + 2x + 1)',
    choices0: L(
      ['4x^2 + 2x − 4', '4x^2 + 2x − 5', '3x^2 + 2x − 4', '4x^2 − 2x − 4'],
      ['4x^2 + 2x − 4', '4x^2 + 2x − 5', '3x^2 + 2x − 4', '4x^2 − 2x − 4'],
      ['4x^2 + 2x − 4', '4x^2 + 2x − 5', '3x^2 + 2x − 4', '4x^2 − 2x − 4'],
    ),
    fc: L('3+1=4 for x^2; +2x; −5+1=−4.', '3+1=4 para x^2; +2x; −5+1=−4.', '3+1=4 dla x^2; +2x; −5+1=−4.'),
    fi: L('Combine like terms carefully with the constants.', 'Combina términos semejantes con cuidado en las constantes.', 'Łącz wyrazy podobne ostrożnie ze stałymi.'),
    tags: ['sign_error', 'unlike_combined'],
    stds: l12Add,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.polynomial.add',
    diff: 0.5,
    b: 0.25,
    prompt: L(
      'Add (−2x + 8) + (5x − 3).',
      'Suma (−2x + 8) + (5x − 3).',
      'Dodaj (−2x + 8) + (5x − 3).',
    ),
    math: '(-2x + 8) + (5x - 3)',
    choices0: L(
      ['3x + 5', '3x − 5', '7x + 5', '−7x + 5'],
      ['3x + 5', '3x − 5', '7x + 5', '−7x + 5'],
      ['3x + 5', '3x − 5', '7x + 5', '−7x + 5'],
    ),
    fc: L('−2x+5x=3x; 8−3=5.', '−2x+5x=3x; 8−3=5.', '−2x+5x=3x; 8−3=5.'),
    fi: L('Watch the signs when combining.', 'Cuida los signos al combinar.', 'Uważaj na znaki przy łączeniu.'),
    tags: ['sign_error'],
    stds: l12Add,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.polynomial.subtract',
    diff: 0.5,
    b: 0.3,
    prompt: L(
      'Subtract (6x − 1) − (2x + 5).',
      'Resta (6x − 1) − (2x + 5).',
      'Odejmij (6x − 1) − (2x + 5).',
    ),
    math: '(6x - 1) - (2x + 5)',
    choices0: L(
      ['4x − 6', '4x + 4', '8x − 6', '4x − 4'],
      ['4x − 6', '4x + 4', '8x − 6', '4x − 4'],
      ['4x − 6', '4x + 4', '8x − 6', '4x − 4'],
    ),
    fc: L('6x−1−2x−5 = 4x−6.', '6x−1−2x−5 = 4x−6.', '6x−1−2x−5 = 4x−6.'),
    fi: L('Distribute minus to +5 as well → −5.', 'Distribuye el menos también a +5 → −5.', 'Rozdziel minus też na +5 → −5.'),
    tags: ['first_term_only', 'sign_error'],
    stds: l12Sub,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.polynomial.subtract',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Subtract (x^2 + 5x − 2) − (3x^2 − x).',
      'Resta (x^2 + 5x − 2) − (3x^2 − x).',
      'Odejmij (x^2 + 5x − 2) − (3x^2 − x).',
    ),
    math: '(x^{2} + 5x - 2) - (3x^{2} - x)',
    choices0: L(
      ['−2x^2 + 6x − 2', '−2x^2 + 4x − 2', '2x^2 + 6x − 2', '−2x^2 + 6x + 2'],
      ['−2x^2 + 6x − 2', '−2x^2 + 4x − 2', '2x^2 + 6x − 2', '−2x^2 + 6x + 2'],
      ['−2x^2 + 6x − 2', '−2x^2 + 4x − 2', '2x^2 + 6x − 2', '−2x^2 + 6x + 2'],
    ),
    fc: L('x^2−3x^2=−2x^2; 5x−(−x)=6x; −2.', 'x^2−3x^2=−2x^2; 5x−(−x)=6x; −2.', 'x^2−3x^2=−2x^2; 5x−(−x)=6x; −2.'),
    fi: L('Minus times −x becomes +x when distributing.', 'Menos por −x se vuelve +x al distribuir.', 'Minus razy −x daje +x przy rozdzielaniu.'),
    tags: ['sign_error', 'first_term_only'],
    stds: l12Sub,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.55,
    b: 0.45,
    prompt: L(
      'Degree of 2x^4 + x^2 − 9?',
      '¿Grado de 2x^4 + x^2 − 9?',
      'Stopień 2x^4 + x^2 − 9?',
    ),
    math: '2x^{4} + x^{2} - 9',
    choices0: L(['4', '2', '3', '9'], ['4', '2', '3', '9'], ['4', '2', '3', '9']),
    latex: '4',
    num: 4,
    fc: L('Highest power is 4.', 'La mayor potencia es 4.', 'Najwyższa potęga to 4.'),
    fi: L('Degree follows the leading (highest) power, not the constant.', 'El grado sigue la potencia mayor, no la constante.', 'Stopień idzie za najwyższą potęgą, nie za stałą.'),
    tags: ['term_count_as_degree', 'constant_as_degree'],
    stds: l12Class,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.polynomial.add',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Add (4x^2 − 3x + 1) + (−x^2 + 3x − 1).',
      'Suma (4x^2 − 3x + 1) + (−x^2 + 3x − 1).',
      'Dodaj (4x^2 − 3x + 1) + (−x^2 + 3x − 1).',
    ),
    math: '(4x^{2} - 3x + 1) + (-x^{2} + 3x - 1)',
    choices0: L(
      ['3x^2', '3x^2 − 6x', '5x^2', '3x^2 + 2'],
      ['3x^2', '3x^2 − 6x', '5x^2', '3x^2 + 2'],
      ['3x^2', '3x^2 − 6x', '5x^2', '3x^2 + 2'],
    ),
    fc: L('4−1=3 for x^2; −3x+3x=0; 1−1=0 → 3x^2.', '4−1=3 para x^2; −3x+3x=0; 1−1=0 → 3x^2.', '4−1=3 dla x^2; −3x+3x=0; 1−1=0 → 3x^2.'),
    fi: L('Like terms cancel completely for x and the constant.', 'Los términos semejantes se cancelan en x y la constante.', 'Wyrazy podobne kasują się całkowicie dla x i stałej.'),
    tags: ['missed_cancel'],
    stds: l12Add,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.polynomial.subtract',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'What is the first step of (A) − (B) for polynomials?',
      '¿Cuál es el primer paso de (A) − (B) para polinomios?',
      'Jaki jest pierwszy krok (A) − (B) dla wielomianów?',
    ),
    math: 'A - B',
    choices0: L(
      ['Distribute a minus to every term of B, then combine like terms', 'Only flip the first term of B', 'Add A and B without changing signs', 'Multiply degrees'],
      ['Distribuir un menos a cada término de B y luego combinar', 'Solo cambiar el primer término de B', 'Sumar A y B sin cambiar signos', 'Multiplicar grados'],
      ['Rozdzielić minus na każdy wyraz B, potem łączyć podobne', 'Zmienić tylko pierwszy wyraz B', 'Dodać A i B bez zmiany znaków', 'Mnożyć stopnie'],
    ),
    fc: L('Subtraction = add the opposite of each term in B.', 'Restar = sumar el opuesto de cada término de B.', 'Odejmowanie = dodaj przeciwieństwo każdego wyrazu B.'),
    fi: L('Every term of the subtrahend gets a sign flip.', 'Cada término del sustraendo cambia de signo.', 'Każdy wyraz odjemnika zmienia znak.'),
    tags: ['first_term_only'],
    stds: l12Sub,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.polynomial.classify',
    diff: 0.65,
    b: 0.6,
    prompt: L(
      'Best description of 3x + 1?',
      '¿Mejor descripción de 3x + 1?',
      'Najlepszy opis 3x + 1?',
    ),
    math: '3x + 1',
    choices0: L(
      ['Linear binomial (degree 1, two terms)', 'Quadratic monomial', 'Cubic trinomial', 'Degree 3 binomial'],
      ['Binomio lineal (grado 1, dos términos)', 'Monomio cuadrático', 'Trinomio cúbico', 'Binomio de grado 3'],
      ['Liniowy dwumian (stopień 1, dwa wyrazy)', 'Kwadratowy jednomian', 'Sześcienny trójmian', 'Dwumian stopnia 3'],
    ),
    fc: L('Two terms and highest power 1 → linear binomial.', 'Dos términos y potencia mayor 1 → binomio lineal.', 'Dwa wyrazy i najwyższa potęga 1 → liniowy dwumian.'),
    fi: L('Degree from highest power; type from term count.', 'Grado por potencia mayor; tipo por número de términos.', 'Stopień z najwyższej potęgi; typ z liczby wyrazów.'),
    tags: ['degree_as_type', 'term_count_as_degree'],
    stds: l12Class,
  },
]

const lesson12Items = buildItems('alg1-l12', l12Specs)
const lesson12 = {
  id: 'alg1-l12',
  courseId: 'algebra1',
  order: 12,
  title: L(
    'Polynomials — Classify, Add, Subtract',
    'Polinomios — clasificar, sumar, restar',
    'Wielomiany — klasyfikacja, dodawanie, odejmowanie',
  ),
  knowledgePointIds: [
    'kp.alg1.polynomial.classify',
    'kp.alg1.polynomial.add',
    'kp.alg1.polynomial.subtract',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_12', unlockOnMastery: ['lesson_board_13'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will classify polynomials by degree and term count, then add and subtract by combining like terms (with careful distribution of the minus).',
        'Clasificarás polinomios por grado y número de términos, y sumarás/restarás combinando términos semejantes (distribuyendo el menos con cuidado).',
        'Będziesz klasyfikować wielomiany według stopnia i liczby wyrazów oraz dodawać/odejmować łącząc wyrazy podobne (ostrożnie rozdzielając minus).',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: classify & combine', 'Enseñar: clasificar y combinar', 'Nauczanie: klasyfikacja i łączenie'),
      body: L(
        'Degree = highest variable power; mono/bi/tri by terms. Add like powers. Subtract by distributing −1 across the second polynomial.',
        'Grado = mayor potencia de la variable; mono/bi/tri por términos. Suma potencias semejantes. Resta distribuyendo −1 en el segundo polinomio.',
        'Stopień = najwyższa potęga zmiennej; jedno-/dwu-/trój- według wyrazów. Dodawaj podobne potęgi. Odejmuj rozdzielając −1 na drugi wielomian.',
      ),
      bodyMath: [
        '4x^{3} - 2x + 7 \\;(\\text{degree } 3)',
        '(2x + 3) + (5x - 1) = 7x + 2',
        '(5x + 2) - (3x - 4) = 2x + 6',
      ],
      itemIds: ['alg1-l12-t01', 'alg1-l12-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Name degrees and types, then practice sums and differences with sign flips.',
        'Nombra grados y tipos; practica sumas y diferencias con cambios de signo.',
        'Nazywaj stopnie i typy; ćwicz sumy i różnice ze zmianami znaków.',
      ),
      itemIds: ['alg1-l12-g01', 'alg1-l12-g02', 'alg1-l12-g03', 'alg1-l12-g04', 'alg1-l12-g05'],
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
        'alg1-l12-i01',
        'alg1-l12-i02',
        'alg1-l12-i03',
        'alg1-l12-i04',
        'alg1-l12-i05',
        'alg1-l12-i06',
        'alg1-l12-i07',
        'alg1-l12-i08',
        'alg1-l12-i09',
        'alg1-l12-i10',
      ],
    },
  ],
  items: lesson12Items,
}

/* ─── Write outputs ─── */
lesson09.worldHook.unlockOnMastery = ['lesson_board_10']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-09.json', lesson09)
writeJson('lesson-10.json', lesson10)
writeJson('lesson-11.json', lesson11)
writeJson('lesson-12.json', lesson12)

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

function fracInChoices(lesson) {
  let n = 0
  for (const it of lesson.items) {
    if (!it.choices) continue
    for (const loc of ['en', 'es', 'pl']) {
      for (const c of it.choices[loc] ?? []) {
        if (String(c).includes('\\frac') || String(c).includes('\\\\')) n++
      }
    }
  }
  return n
}

const summary = {
  newKpIds: newKps.map((k) => k.id),
  lessons: [lesson10, lesson11, lesson12].map((l) => ({
    id: l.id,
    totalItems: l.items.length,
    teach: l.sections.find((s) => s.phase === 'teach')?.itemIds?.length ?? 0,
    guided: l.sections.find((s) => s.phase === 'guided')?.itemIds?.length ?? 0,
    independent: l.sections.find((s) => s.phase === 'independent')?.itemIds?.length ?? 0,
    siteId: l.worldHook.siteId,
    unlock: l.worldHook.unlockOnMastery,
    correctIndexHist: hist(l),
    promptMath: promptMathCoverage(l),
    rawFracInChoices: fracInChoices(l),
  })),
  l9Unlock: lesson09.worldHook.unlockOnMastery,
}
console.log(JSON.stringify(summary, null, 2))
