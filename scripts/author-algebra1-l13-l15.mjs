/**
 * Wave 5 authoring: Algebra I Lessons 13–15 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l13-l15.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-13..15; confirms L12 unlockOnMastery → lesson_board_13;
 * L15 unlocks lesson_board_16 teaser.
 *
 * KaTeX policy (Wave 5): promptMath on nearly every item; MC choices prefer
 * KaTeX (x^{2}, not ASCII caret x^2) so choice labels render via renderChoiceLabel.
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

function keyCycle(i) {
  return i % 4
}

/**
 * Wrap pure-math choice labels in $...$ so renderChoiceLabel/containsLatex
 * triggers KaTeX (bare `x^{2}` has no `\`/`$` and would stay textContent).
 * Do not insert `\^` — LaTeX exponents are caret, not backslash-caret.
 */
function asKatexChoice(s) {
  const t = String(s).trim()
  if (!t) return t
  if (/^\$[\s\S]*\$$/.test(t) || /^\\\([\s\S]*\\\)$/.test(t)) return t
  // Text / conceptual choices: leave plain unless they contain ^ exponents
  if (!/\^/.test(t) && !/[_\\]/.test(t)) return t
  // Strip a mistaken \^ from an earlier pass, keep caret
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

/** Same math string for all locales, always $-wrapped for choice KaTeX. */
function mathChoices(...opts) {
  const fixed = opts.map((s) => {
    const cleaned = String(s).replace(/\\\^/g, '^').replace(/^\$/, '').replace(/\$$/, '')
    return `$${cleaned}$`
  })
  return L(fixed, fixed, fixed)
}

/** promptMath / bodyMath: keep LaTeX caret exponents (no $ wrap). */
function latexifyMath(s) {
  return String(s).replace(/\\\^/g, '^')
}

const existingKpDoc = JSON.parse(readFileSync(join(outDir, 'knowledge-points.json'), 'utf8'))
const existingStd = JSON.parse(readFileSync(join(outDir, 'standards-index.json'), 'utf8'))
const lesson12 = JSON.parse(readFileSync(join(outDir, 'lesson-12.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.polynomial.distribute',
    title: L(
      'Multiply a monomial by a polynomial (distribute)',
      'Multiplicar un monomio por un polinomio (distribuir)',
      'Mnożyć jednomian przez wielomian (rozdzielność)',
    ),
    prerequisites: ['kp.alg1.polynomial.classify', 'kp.alg1.exponents.product'],
    successCriteria: L(
      'Student distributes a monomial across every term of a polynomial, multiplying coefficients and adding exponents on like bases.',
      'El estudiante distribuye un monomio a cada término de un polinomio, multiplicando coeficientes y sumando exponentes de bases iguales.',
      'Uczeń rozdziela jednomian na każdy wyraz wielomianu, mnożąc współczynniki i dodając wykładniki tych samych podstaw.',
    ),
    misconceptions: L(
      [
        'Multiplying only the first term of the polynomial',
        'Adding exponents when multiplying unlike bases, or multiplying exponents instead of adding',
      ],
      [
        'Multiplicar solo el primer término del polinomio',
        'Sumar exponentes con bases distintas, o multiplicar exponentes en lugar de sumarlos',
      ],
      [
        'Mnożenie tylko pierwszego wyrazu wielomianu',
        'Dodawanie wykładników przy różnych podstawach lub mnożenie wykładników zamiast dodawania',
      ],
    ),
    standards: [
      TX('A.10(B)', 'A.1(F)', 'A.1(B)'),
      CC('A-APR.A.1', 'A-SSE.A.1a', 'A-SSE.A.1'),
      CA('A-APR.1'),
      FL('MA.912.AR.1.4'),
    ],
  },
  {
    id: 'kp.alg1.polynomial.foil',
    title: L(
      'Multiply two binomials (FOIL / distribute)',
      'Multiplicar dos binomios (FOIL / distribuir)',
      'Mnożyć dwa dwumiany (FOIL / rozdzielność)',
    ),
    prerequisites: ['kp.alg1.polynomial.distribute'],
    encompassing: ['kp.alg1.polynomial.distribute'],
    successCriteria: L(
      'Student multiplies two binomials by finding all four products (First, Outer, Inner, Last) and combining like terms.',
      'El estudiante multiplica dos binomios hallando los cuatro productos (primero, externo, interno, último) y combinando términos semejantes.',
      'Uczeń mnoży dwa dwumiany, znajdując cztery iloczyny (pierwszy, zewnętrzny, wewnętrzny, ostatni) i łącząc wyrazy podobne.',
    ),
    misconceptions: L(
      [
        'Only multiplying first and last terms (skipping Outer/Inner)',
        'Combining unlike terms or mishandling signs on negative terms',
      ],
      [
        'Multiplicar solo el primero y el último (omitir externo/interno)',
        'Combinar términos no semejantes o manejar mal los signos negativos',
      ],
      [
        'Mnożenie tylko pierwszego i ostatniego (pomijanie zewnętrznych/wewnętrznych)',
        'Łączenie niepodobnych wyrazów lub błędy znaków przy ujemnych',
      ],
    ),
    standards: [
      TX('A.10(B)', 'A.1(F)', 'A.1(B)'),
      CC('A-APR.A.1', 'A-SSE.A.2', 'A-SSE.A.1a'),
      CA('A-APR.1'),
      FL('MA.912.AR.1.4'),
    ],
  },
  {
    id: 'kp.alg1.polynomial.multiply',
    title: L(
      'Multiply polynomials beyond FOIL',
      'Multiplicar polinomios más allá de FOIL',
      'Mnożyć wielomiany poza FOIL',
    ),
    prerequisites: ['kp.alg1.polynomial.foil'],
    encompassing: ['kp.alg1.polynomial.foil'],
    successCriteria: L(
      'Student multiplies a binomial by a trinomial (or similar) by distributing each term and combining like terms in standard form.',
      'El estudiante multiplica un binomio por un trinomio (o similar) distribuyendo cada término y combinando semejantes en forma estándar.',
      'Uczeń mnoży dwumian przez trójmian (lub podobnie), rozdzielając każdy wyraz i łącząc podobne w postaci standardowej.',
    ),
    misconceptions: L(
      [
        'Missing a whole row of products when distributing',
        'Adding degrees incorrectly after expanding',
      ],
      [
        'Omitir toda una fila de productos al distribuir',
        'Sumar grados incorrectamente después de expandir',
      ],
      [
        'Pominięcie całego wiersza iloczynów przy rozdzielaniu',
        'Błędne dodawanie stopni po rozwinięciu',
      ],
    ),
    standards: [
      TX('A.10(B)', 'A.1(F)', 'A.1(B)'),
      CC('A-APR.A.1', 'A-SSE.A.2', 'A-SSE.A.1'),
      CA('A-APR.1'),
    ],
  },
  {
    id: 'kp.alg1.factor.gcf',
    title: L(
      'Factor out the greatest common factor (GCF)',
      'Sacar el máximo común divisor (MCD / GCF)',
      'Wyłączać największy wspólny dzielnik (NWD / GCF)',
    ),
    prerequisites: ['kp.alg1.polynomial.distribute', 'kp.alg1.polynomial.classify'],
    successCriteria: L(
      'Student finds the GCF of coefficients and variable powers, factors it out, and writes an equivalent product.',
      'El estudiante halla el MCD de coeficientes y potencias, lo saca como factor común y escribe un producto equivalente.',
      'Uczeń znajduje NWD współczynników i potęg, wyłącza go przed nawias i zapisuje równoważny iloczyn.',
    ),
    misconceptions: L(
      [
        'Factoring only the numeric GCF and leaving variable factors inside inconsistently',
        'Dividing some terms by the GCF but not others',
      ],
      [
        'Sacar solo el MCD numérico y dejar factores de variable de forma inconsistente',
        'Dividir algunos términos entre el MCD pero no otros',
      ],
      [
        'Wyłączanie tylko liczbowego NWD i niespójne traktowanie zmiennych',
        'Dzielenie tylko niektórych wyrazów przez NWD',
      ],
    ),
    standards: [
      TX('A.10(D)', 'A.1(F)', 'A.1(B)'),
      CC('A-SSE.A.2', 'A-SSE.B.3a', 'A-APR.A.1'),
      CA('A-SSE.2'),
      FL('MA.912.AR.1.5'),
    ],
  },
  {
    id: 'kp.alg1.factor.trinomial.a1',
    title: L(
      'Factor simple trinomials x² + bx + c (a = 1)',
      'Factorizar trinomios simples x² + bx + c (a = 1)',
      'Rozkładać proste trójmiany x² + bx + c (a = 1)',
    ),
    prerequisites: ['kp.alg1.factor.gcf', 'kp.alg1.polynomial.foil'],
    encompassing: ['kp.alg1.factor.gcf'],
    successCriteria: L(
      'Student factors x² + bx + c as (x + p)(x + q) where p + q = b and p·q = c (integers).',
      'El estudiante factoriza x² + bx + c como (x + p)(x + q) donde p + q = b y p·q = c (enteros).',
      'Uczeń rozkłada x² + bx + c jako (x + p)(x + q), gdzie p + q = b i p·q = c (całkowite).',
    ),
    misconceptions: L(
      [
        'Choosing factors of c that do not sum to b',
        'Putting the wrong signs on p and q when c is positive or negative',
      ],
      [
        'Elegir factores de c que no suman b',
        'Poner signos incorrectos en p y q cuando c es positivo o negativo',
      ],
      [
        'Wybór czynników c, które nie sumują się do b',
        'Błędne znaki p i q, gdy c jest dodatnie lub ujemne',
      ],
    ),
    standards: [
      TX('A.10(E)', 'A.10(D)', 'A.1(F)'),
      CC('A-SSE.B.3a', 'A-SSE.A.2', 'A-APR.A.1'),
      CA('A-SSE.3a'),
      FL('MA.912.AR.1.5'),
    ],
  },
  {
    id: 'kp.alg1.factor.verify',
    title: L(
      'Verify a factorization by multiplying',
      'Verificar una factorización multiplicando',
      'Sprawdzać rozkład przez mnożenie',
    ),
    prerequisites: ['kp.alg1.factor.trinomial.a1', 'kp.alg1.polynomial.foil'],
    encompassing: ['kp.alg1.polynomial.foil'],
    successCriteria: L(
      'Student expands a proposed factorization and confirms it matches the original polynomial.',
      'El estudiante expande una factorización propuesta y confirma que coincide con el polinomio original.',
      'Uczeń rozwija proponowany rozkład i potwierdza zgodność z oryginalnym wielomianem.',
    ),
    misconceptions: L(
      [
        'Accepting a factorization without expanding to check',
        'Expanding incorrectly and still claiming a match',
      ],
      [
        'Aceptar una factorización sin expandir para comprobar',
        'Expandir incorrectamente y aun así afirmar coincidencia',
      ],
      [
        'Akceptowanie rozkładu bez sprawdzenia przez rozwinięcie',
        'Błędne rozwinięcie i twierdzenie o zgodności',
      ],
    ),
    standards: [
      TX('A.10(E)', 'A.10(B)', 'A.1(D)'),
      CC('A-SSE.B.3a', 'A-APR.A.1', 'A-SSE.A.2'),
      CA('A-SSE.3a'),
    ],
  },
  {
    id: 'kp.alg1.factor.difference.squares',
    title: L(
      'Factor a difference of squares',
      'Factorizar una diferencia de cuadrados',
      'Rozkładać różnicę kwadratów',
    ),
    prerequisites: ['kp.alg1.factor.gcf', 'kp.alg1.polynomial.foil'],
    successCriteria: L(
      'Student recognizes a² − b² and rewrites it as (a − b)(a + b), including after factoring a GCF when needed.',
      'El estudiante reconoce a² − b² y lo reescribe como (a − b)(a + b), incluso tras sacar un MCD si hace falta.',
      'Uczeń rozpoznaje a² − b² i zapisuje (a − b)(a + b), także po wyłączeniu NWD gdy trzeba.',
    ),
    misconceptions: L(
      [
        'Treating a² + b² as factorable over the reals the same way',
        'Writing (a − b)² instead of (a − b)(a + b)',
      ],
      [
        'Tratar a² + b² como factorable sobre los reales de la misma forma',
        'Escribir (a − b)² en lugar de (a − b)(a + b)',
      ],
      [
        'Traktowanie a² + b² jak rozkładalne w ten sam sposób nad liczbami rzeczywistymi',
        'Zapisywanie (a − b)² zamiast (a − b)(a + b)',
      ],
    ),
    standards: [
      TX('A.10(F)', 'A.10(D)', 'A.1(F)'),
      CC('A-SSE.A.2', 'A-SSE.B.3a', 'A-APR.A.1'),
      CA('A-SSE.2'),
      FL('MA.912.AR.1.5'),
    ],
  },
  {
    id: 'kp.alg1.factor.trinomial.more',
    title: L(
      'Factor more trinomials (signs, larger constants)',
      'Factorizar más trinomios (signos, constantes mayores)',
      'Rozkładać trudniejsze trójmiany (znaki, większe stałe)',
    ),
    prerequisites: ['kp.alg1.factor.trinomial.a1'],
    encompassing: ['kp.alg1.factor.trinomial.a1'],
    successCriteria: L(
      'Student factors a=1 trinomials with mixed signs or larger |c|, choosing integer pairs that multiply to c and add to b.',
      'El estudiante factoriza trinomios a=1 con signos mixtos o |c| mayor, eligiendo pares enteros que multiplican a c y suman b.',
      'Uczeń rozkłada trójmiany a=1 z mieszanymi znakami lub większym |c|, wybierając pary całkowite o iloczynie c i sumie b.',
    ),
    misconceptions: L(
      [
        'Swapping which factor gets the larger magnitude when signs differ',
        'Forgetting that both factors are negative when c > 0 and b < 0',
      ],
      [
        'Intercambiar qué factor tiene mayor magnitud cuando los signos difieren',
        'Olvidar que ambos factores son negativos cuando c > 0 y b < 0',
      ],
      [
        'Zamiana, który czynnik ma większą wartość bezwzględną przy różnych znakach',
        'Zapominanie, że oba czynniki są ujemne, gdy c > 0 i b < 0',
      ],
    ),
    standards: [
      TX('A.10(E)', 'A.10(D)', 'A.1(F)'),
      CC('A-SSE.B.3a', 'A-SSE.A.2', 'A-APR.A.1'),
      CA('A-SSE.3a'),
    ],
  },
  {
    id: 'kp.alg1.factor.perfect.square',
    title: L(
      'Recognize and factor perfect-square trinomials',
      'Reconocer y factorizar trinomios cuadrados perfectos',
      'Rozpoznawać i rozkładać trójmiany kwadratów zupełnych',
    ),
    prerequisites: ['kp.alg1.factor.trinomial.a1', 'kp.alg1.factor.difference.squares'],
    encompassing: ['kp.alg1.factor.trinomial.a1'],
    successCriteria: L(
      'Student recognizes a² ± 2ab + b² and writes (a ± b)², distinguishing from a non-perfect trinomial.',
      'El estudiante reconoce a² ± 2ab + b² y escribe (a ± b)², distinguiendo de un trinomio no perfecto.',
      'Uczeń rozpoznaje a² ± 2ab + b² i zapisuje (a ± b)², odróżniając od trójmianu niezupełnego.',
    ),
    misconceptions: L(
      [
        'Writing (a + b)² for a² − 2ab + b²',
        'Treating any trinomial with a square first term as a perfect square',
      ],
      [
        'Escribir (a + b)² para a² − 2ab + b²',
        'Tratar cualquier trinomio con primer término cuadrado como cuadrado perfecto',
      ],
      [
        'Zapisywanie (a + b)² dla a² − 2ab + b²',
        'Traktowanie każdego trójmianu z kwadratem na początku jako kwadratu zupełnego',
      ],
    ),
    standards: [
      TX('A.10(E)', 'A.10(F)', 'A.1(F)'),
      CC('A-SSE.A.2', 'A-SSE.B.3a', 'A-APR.A.1'),
      CA('A-SSE.2'),
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

const multiplyKps = [
  'kp.alg1.polynomial.distribute',
  'kp.alg1.polynomial.foil',
  'kp.alg1.polynomial.multiply',
]
const factorKps = [
  'kp.alg1.factor.gcf',
  'kp.alg1.factor.trinomial.a1',
  'kp.alg1.factor.verify',
  'kp.alg1.factor.difference.squares',
  'kp.alg1.factor.trinomial.more',
  'kp.alg1.factor.perfect.square',
]

addKpsToExisting('TX', 'A.1(B)', [...multiplyKps, 'kp.alg1.factor.gcf', 'kp.alg1.factor.verify'])
addKpsToExisting('TX', 'A.1(D)', ['kp.alg1.factor.verify'])
addKpsToExisting('TX', 'A.1(F)', [...multiplyKps, ...factorKps])
addKpsToExisting('CCSS', 'A-APR.A.1', [...multiplyKps, ...factorKps])
addKpsToExisting('CCSS', 'A-SSE.A.1', multiplyKps)
addKpsToExisting('CCSS', 'A-SSE.A.1a', [
  'kp.alg1.polynomial.distribute',
  'kp.alg1.polynomial.foil',
])

ensureCode(
  'TX',
  'A.10(B)',
  L(
    'Multiply polynomials of degree one and degree two',
    'Multiplicar polinomios de grado uno y grado dos',
    'Mnożyć wielomiany stopnia pierwszego i drugiego',
  ),
  multiplyKps,
)
ensureCode(
  'TX',
  'A.10(D)',
  L(
    'Rewrite polynomial expressions of degree one and degree two in equivalent forms using the distributive property',
    'Reescribir expresiones polinomiales de grado uno y dos en formas equivalentes usando la propiedad distributiva',
    'Przepisywać wyrażenia wielomianowe stopnia 1 i 2 w równoważne formy z użyciem rozdzielności',
  ),
  [
    'kp.alg1.factor.gcf',
    'kp.alg1.factor.trinomial.a1',
    'kp.alg1.factor.difference.squares',
    'kp.alg1.factor.trinomial.more',
  ],
)
ensureCode(
  'TX',
  'A.10(E)',
  L(
    'Factor, if possible, trinomials with integer coefficients as products of linear factors',
    'Factorizar, si es posible, trinomios con coeficientes enteros como productos de factores lineales',
    'Rozkładać, jeśli możliwe, trójmiany o współczynnikach całkowitych na iloczyny czynników liniowych',
  ),
  [
    'kp.alg1.factor.trinomial.a1',
    'kp.alg1.factor.verify',
    'kp.alg1.factor.trinomial.more',
    'kp.alg1.factor.perfect.square',
  ],
)
ensureCode(
  'TX',
  'A.10(F)',
  L(
    'Decide if a binomial can be written as a difference of two squares and, if possible, factor it',
    'Decidir si un binomio se puede escribir como diferencia de cuadrados y, si es posible, factorizarlo',
    'Rozstrzygać, czy dwumian jest różnicą kwadratów, i jeśli możliwe — rozłożyć go',
  ),
  ['kp.alg1.factor.difference.squares', 'kp.alg1.factor.perfect.square'],
)
ensureCode(
  'CCSS',
  'A-SSE.A.2',
  L(
    'Use the structure of an expression to identify ways to rewrite it',
    'Usar la estructura de una expresión para identificar formas de reescribirla',
    'Używać struktury wyrażenia do znajdowania sposobów przepisania',
  ),
  [
    'kp.alg1.polynomial.foil',
    'kp.alg1.polynomial.multiply',
    ...factorKps,
  ],
)
ensureCode(
  'CCSS',
  'A-SSE.B.3a',
  L(
    'Factor a quadratic expression to reveal the zeros of the function it defines',
    'Factorizar una expresión cuadrática para revelar los ceros de la función que define',
    'Rozkładać wyrażenie kwadratowe, by ujawnić zera funkcji, którą definiuje',
  ),
  [
    'kp.alg1.factor.gcf',
    'kp.alg1.factor.trinomial.a1',
    'kp.alg1.factor.verify',
    'kp.alg1.factor.difference.squares',
    'kp.alg1.factor.trinomial.more',
    'kp.alg1.factor.perfect.square',
  ],
)

existingStd.lessonCoverage['alg1-l13'] = [
  'A.10(B)',
  'A.1(B)',
  'A.1(F)',
  'A-APR.A.1',
  'A-SSE.A.1',
  'A-SSE.A.1a',
  'A-SSE.A.2',
]
existingStd.lessonCoverage['alg1-l14'] = [
  'A.10(D)',
  'A.10(E)',
  'A.10(B)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-SSE.A.2',
  'A-SSE.B.3a',
  'A-APR.A.1',
]
existingStd.lessonCoverage['alg1-l15'] = [
  'A.10(F)',
  'A.10(E)',
  'A.10(D)',
  'A.1(F)',
  'A-SSE.A.2',
  'A-SSE.B.3a',
  'A-APR.A.1',
]

const l13Dist = [TX('A.10(B)', 'A.1(F)', 'A.1(B)'), CC('A-APR.A.1', 'A-SSE.A.1a', 'A-SSE.A.1')]
const l13Foil = [TX('A.10(B)', 'A.1(F)', 'A.1(B)'), CC('A-APR.A.1', 'A-SSE.A.2', 'A-SSE.A.1a')]
const l13Mul = [TX('A.10(B)', 'A.1(F)', 'A.1(B)'), CC('A-APR.A.1', 'A-SSE.A.2', 'A-SSE.A.1')]

const l14Gcf = [TX('A.10(D)', 'A.1(F)', 'A.1(B)'), CC('A-SSE.A.2', 'A-SSE.B.3a', 'A-APR.A.1')]
const l14Tri = [TX('A.10(E)', 'A.10(D)', 'A.1(F)'), CC('A-SSE.B.3a', 'A-SSE.A.2', 'A-APR.A.1')]
const l14Ver = [TX('A.10(E)', 'A.10(B)', 'A.1(D)'), CC('A-SSE.B.3a', 'A-APR.A.1', 'A-SSE.A.2')]

const l15Dos = [TX('A.10(F)', 'A.10(D)', 'A.1(F)'), CC('A-SSE.A.2', 'A-SSE.B.3a', 'A-APR.A.1')]
const l15More = [TX('A.10(E)', 'A.10(D)', 'A.1(F)'), CC('A-SSE.B.3a', 'A-SSE.A.2', 'A-APR.A.1')]
const l15Perf = [TX('A.10(E)', 'A.10(F)', 'A.1(F)'), CC('A-SSE.A.2', 'A-SSE.B.3a', 'A-APR.A.1')]

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
   LESSON 13 — Multiply / FOIL / distribute
   ═══════════════════════════════════════ */
const l13Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.polynomial.distribute',
    diff: 0.25,
    b: -1.05,
    prompt: L(
      'Distribute: 3x(2x + 5).',
      'Distribuye: 3x(2x + 5).',
      'Rozdziel: 3x(2x + 5).',
    ),
    math: '3x(2x + 5)',
    choices0: mathChoices('6x^{2}+15x', '6x+15x', '5x^{2}+15', '6x^{2}+5'),
    fc: L('3x·2x = 6x² and 3x·5 = 15x.', '3x·2x = 6x² y 3x·5 = 15x.', '3x·2x = 6x² oraz 3x·5 = 15x.'),
    fi: L('Multiply the monomial by every term; add exponents on x.', 'Multiplica el monomio por cada término; suma exponentes de x.', 'Pomnóż jednomian przez każdy wyraz; dodaj wykładniki x.'),
    tags: ['first_term_only', 'forgot_exponent_add'],
    stds: l13Dist,
  },
  {
    id: 't02',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.3,
    b: -0.85,
    prompt: L(
      'FOIL: (x + 2)(x + 3).',
      'FOIL: (x + 2)(x + 3).',
      'FOIL: (x + 2)(x + 3).',
    ),
    math: '(x + 2)(x + 3)',
    choices0: mathChoices('x^{2}+5x+6', 'x^{2}+6', 'x^{2}+5x', 'x^{2}+6x+5'),
    fc: L('x² + 3x + 2x + 6 = x² + 5x + 6.', 'x² + 3x + 2x + 6 = x² + 5x + 6.', 'x² + 3x + 2x + 6 = x² + 5x + 6.'),
    fi: L('Include Outer and Inner: 3x and 2x combine to 5x.', 'Incluye externo e interno: 3x y 2x dan 5x.', 'Uwzględnij zewnętrzne i wewnętrzne: 3x i 2x dają 5x.'),
    tags: ['skipped_outer_inner', 'wrong_constant'],
    stds: l13Foil,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.polynomial.distribute',
    diff: 0.35,
    b: -0.55,
    prompt: L(
      'Simplify −2x(4x − 3).',
      'Simplifica −2x(4x − 3).',
      'Uprość −2x(4x − 3).',
    ),
    math: '-2x(4x - 3)',
    choices0: mathChoices('-8x^{2}+6x', '-8x^{2}-6x', '8x^{2}+6x', '-8x^{2}+3'),
    fc: L('−2x·4x = −8x²; −2x·(−3) = +6x.', '−2x·4x = −8x²; −2x·(−3) = +6x.', '−2x·4x = −8x²; −2x·(−3) = +6x.'),
    fi: L('Negative times negative on the second term yields +6x.', 'Negativo por negativo en el segundo término da +6x.', 'Ujemne razy ujemne w drugim wyrazie daje +6x.'),
    tags: ['sign_error', 'first_term_only'],
    stds: l13Dist,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.4,
    b: -0.35,
    prompt: L(
      'Expand (x − 4)(x + 1).',
      'Expande (x − 4)(x + 1).',
      'Rozwiń (x − 4)(x + 1).',
    ),
    math: '(x - 4)(x + 1)',
    choices0: mathChoices('x^{2}-3x-4', 'x^{2}+3x-4', 'x^{2}-5x-4', 'x^{2}-3x+4'),
    fc: L('x² + x − 4x − 4 = x² − 3x − 4.', 'x² + x − 4x − 4 = x² − 3x − 4.', 'x² + x − 4x − 4 = x² − 3x − 4.'),
    fi: L('Outer +1x and Inner −4x combine to −3x; Last is −4.', 'Externo +1x e interno −4x dan −3x; último es −4.', 'Zewnętrzne +1x i wewnętrzne −4x dają −3x; ostatni to −4.'),
    tags: ['sign_error', 'skipped_outer_inner'],
    stds: l13Foil,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.4,
    b: -0.25,
    prompt: L(
      'Expand (2x + 1)(x + 5).',
      'Expande (2x + 1)(x + 5).',
      'Rozwiń (2x + 1)(x + 5).',
    ),
    math: '(2x + 1)(x + 5)',
    choices0: mathChoices('2x^{2}+11x+5', '2x^{2}+5x+5', '2x^{2}+10x+5', '3x^{2}+11x+5'),
    fc: L('2x² + 10x + x + 5 = 2x² + 11x + 5.', '2x² + 10x + x + 5 = 2x² + 11x + 5.', '2x² + 10x + x + 5 = 2x² + 11x + 5.'),
    fi: L('Do not drop the Inner product 1·x.', 'No omitas el producto interno 1·x.', 'Nie pomijaj wewnętrznego iloczynu 1·x.'),
    tags: ['skipped_outer_inner', 'coeff_error'],
    stds: l13Foil,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.polynomial.multiply',
    diff: 0.45,
    b: -0.1,
    prompt: L(
      'Multiply (x + 2)(x^{2} + 3x + 1). First term of the product?',
      'Multiplica (x + 2)(x^{2} + 3x + 1). ¿Primer término del producto?',
      'Pomnóż (x + 2)(x^{2} + 3x + 1). Pierwszy wyraz iloczynu?',
    ),
    math: '(x + 2)(x^{2} + 3x + 1)',
    choices0: mathChoices('x^{3}', 'x^{2}', '2x^{2}', '3x^{2}'),
    fc: L('x · x² = x³ leads the expanded polynomial.', 'x · x² = x³ encabeza el polinomio expandido.', 'x · x² = x³ prowadzi rozwinięty wielomian.'),
    fi: L('Distribute x across the trinomial; highest power comes from x·x².', 'Distribuye x en el trinomio; la mayor potencia viene de x·x².', 'Rozdziel x na trójmian; najwyższa potęga z x·x².'),
    tags: ['degree_error', 'missed_row'],
    stds: l13Mul,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.polynomial.distribute',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      '5y^{2}(2y − 4) equals…',
      '5y^{2}(2y − 4) es igual a…',
      '5y^{2}(2y − 4) równa się…',
    ),
    math: '5y^{2}(2y - 4)',
    choices0: mathChoices('10y^{3}-20y^{2}', '10y^{3}-4', '7y^{3}-20y^{2}', '10y^{2}-20y^{2}'),
    fc: L('5y²·2y = 10y³; 5y²·(−4) = −20y².', '5y²·2y = 10y³; 5y²·(−4) = −20y².', '5y²·2y = 10y³; 5y²·(−4) = −20y².'),
    fi: L('Add exponents on y: 2+1=3 for the first product.', 'Suma exponentes de y: 2+1=3 en el primer producto.', 'Dodaj wykładniki y: 2+1=3 w pierwszym iloczynie.'),
    tags: ['forgot_exponent_add', 'first_term_only'],
    stds: l13Dist,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.polynomial.distribute',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Simplify 4a(a^{2} − 2a + 3).',
      'Simplifica 4a(a^{2} − 2a + 3).',
      'Uprość 4a(a^{2} − 2a + 3).',
    ),
    math: '4a(a^{2} - 2a + 3)',
    choices0: mathChoices('4a^{3}-8a^{2}+12a', '4a^{3}-2a+3', '4a^{3}-8a+12a', 'a^{3}-8a^{2}+12a'),
    fc: L('4a·a²=4a³; 4a·(−2a)=−8a²; 4a·3=12a.', '4a·a²=4a³; 4a·(−2a)=−8a²; 4a·3=12a.', '4a·a²=4a³; 4a·(−2a)=−8a²; 4a·3=12a.'),
    fi: L('Hit every term of the trinomial with 4a.', 'Aplica 4a a cada término del trinomio.', 'Pomnóż każdy wyraz trójmianu przez 4a.'),
    tags: ['first_term_only', 'coeff_error'],
    stds: l13Dist,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Expand (x − 3)(x − 5).',
      'Expande (x − 3)(x − 5).',
      'Rozwiń (x − 3)(x − 5).',
    ),
    math: '(x - 3)(x - 5)',
    choices0: mathChoices('x^{2}-8x+15', 'x^{2}-8x-15', 'x^{2}+8x+15', 'x^{2}-2x+15'),
    fc: L('x² − 5x − 3x + 15 = x² − 8x + 15.', 'x² − 5x − 3x + 15 = x² − 8x + 15.', 'x² − 5x − 3x + 15 = x² − 8x + 15.'),
    fi: L('Negative times negative Last term is +15; middle is −8x.', 'Negativo por negativo en el último da +15; el medio es −8x.', 'Ujemne razy ujemne w ostatnim daje +15; środek to −8x.'),
    tags: ['sign_error', 'wrong_constant'],
    stds: l13Foil,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Expand (3x − 2)(x + 4).',
      'Expande (3x − 2)(x + 4).',
      'Rozwiń (3x − 2)(x + 4).',
    ),
    math: '(3x - 2)(x + 4)',
    choices0: mathChoices('3x^{2}+10x-8', '3x^{2}+12x-8', '3x^{2}+10x+8', '3x^{2}-10x-8'),
    fc: L('3x² + 12x − 2x − 8 = 3x² + 10x − 8.', '3x² + 12x − 2x − 8 = 3x² + 10x − 8.', '3x² + 12x − 2x − 8 = 3x² + 10x − 8.'),
    fi: L('Outer 12x and Inner −2x combine to +10x.', 'Externo 12x e interno −2x dan +10x.', 'Zewnętrzne 12x i wewnętrzne −2x dają +10x.'),
    tags: ['skipped_outer_inner', 'sign_error'],
    stds: l13Foil,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.polynomial.multiply',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Expand (x + 1)(x^{2} − x + 2). What is the x term?',
      'Expande (x + 1)(x^{2} − x + 2). ¿Cuál es el término en x?',
      'Rozwiń (x + 1)(x^{2} − x + 2). Jaki jest wyraz z x?',
    ),
    math: '(x + 1)(x^{2} - x + 2)',
    choices0: mathChoices('x', '2x', '-x', '3x'),
    fc: L('From x·(−x)=−x² rows plus 1·…: constant×x and like-x combine → +x after full expand: x³ + x.', 'Tras expandir completo: x³ + x (término lineal x).', 'Po pełnym rozwinięciu: x³ + x (wyraz liniowy x).'),
    fi: L('Collect all degree-1 contributions after distributing both x and 1.', 'Reúne todas las contribuciones de grado 1 tras distribuir x y 1.', 'Zbierz wszystkie wkłady stopnia 1 po rozdzieleniu x i 1.'),
    tags: ['missed_row', 'like_term_error'],
    stds: l13Mul,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.polynomial.distribute',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      '−3m(2m^{2} + m − 5) equals…',
      '−3m(2m^{2} + m − 5) es igual a…',
      '−3m(2m^{2} + m − 5) równa się…',
    ),
    math: '-3m(2m^{2} + m - 5)',
    choices0: mathChoices('-6m^{3}-3m^{2}+15m', '-6m^{3}-3m^{2}-15m', '6m^{3}-3m^{2}+15m', '-6m^{3}+3m^{2}+15m'),
    fc: L('−3m·2m²=−6m³; −3m·m=−3m²; −3m·(−5)=+15m.', '−3m·2m²=−6m³; −3m·m=−3m²; −3m·(−5)=+15m.', '−3m·2m²=−6m³; −3m·m=−3m²; −3m·(−5)=+15m.'),
    fi: L('Watch the last sign: negative times negative is positive.', 'Cuidado con el último signo: negativo por negativo es positivo.', 'Uważaj na ostatni znak: ujemne razy ujemne jest dodatnie.'),
    tags: ['sign_error', 'first_term_only'],
    stds: l13Dist,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Expand (2x − 5)(2x + 5).',
      'Expande (2x − 5)(2x + 5).',
      'Rozwiń (2x − 5)(2x + 5).',
    ),
    math: '(2x - 5)(2x + 5)',
    choices0: mathChoices('4x^{2}-25', '4x^{2}+25', '4x^{2}-10x-25', '4x^{2}+20x-25'),
    fc: L('Difference of squares: (2x)² − 5² = 4x² − 25.', '(Diferencia de cuadrados): (2x)² − 5² = 4x² − 25.', 'Różnica kwadratów: (2x)² − 5² = 4x² − 25.'),
    fi: L('Outer and Inner cancel (±10x); Last is −25.', 'Externo e interno se cancelan (±10x); último es −25.', 'Zewnętrzne i wewnętrzne kasują się (±10x); ostatni to −25.'),
    tags: ['skipped_cancel', 'sign_error'],
    stds: l13Foil,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.polynomial.multiply',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Expand (x − 2)(x^{2} + 2x + 4). Constant term?',
      'Expande (x − 2)(x^{2} + 2x + 4). ¿Término constante?',
      'Rozwiń (x − 2)(x^{2} + 2x + 4). Wyraz wolny?',
    ),
    math: '(x - 2)(x^{2} + 2x + 4)',
    choices0: mathChoices('-8', '8', '-4', '4'),
    fc: L('Only −2 · 4 contributes to the constant: −8.', 'Solo −2 · 4 aporta a la constante: −8.', 'Tylko −2 · 4 daje stałą: −8.'),
    fi: L('The constant comes from (−2) times the trinomial’s constant.', 'La constante viene de (−2) por la constante del trinomio.', 'Stała pochodzi z (−2) razy stała trójmianu.'),
    tags: ['missed_row', 'sign_error'],
    stds: l13Mul,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.polynomial.foil',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Which product equals x^{2} − 1?',
      '¿Qué producto es igual a x^{2} − 1?',
      'Który iloczyn równa się x^{2} − 1?',
    ),
    math: 'x^{2} - 1',
    choices0: mathChoices('(x-1)(x+1)', '(x-1)(x-1)', '(x+1)(x+1)', '(x-1)^{2}'),
    fc: L('Difference of squares: (x−1)(x+1).', 'Diferencia de cuadrados: (x−1)(x+1).', 'Różnica kwadratów: (x−1)(x+1).'),
    fi: L('(x−1)² expands to x² − 2x + 1, not x² − 1.', '(x−1)² da x² − 2x + 1, no x² − 1.', '(x−1)² daje x² − 2x + 1, nie x² − 1.'),
    tags: ['perfect_square_confusion'],
    stds: l13Foil,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.polynomial.distribute',
    diff: 0.65,
    b: 0.65,
    prompt: L(
      'True or false idea: distributing means multiply the outside only by the first inside term.',
      'Idea verdadera o falsa: distribuir significa multiplicar el exterior solo por el primer término interior.',
      'Prawda czy fałsz: rozdzielność oznacza mnożenie zewnętrznego tylko przez pierwszy wyraz wewnątrz.',
    ),
    math: 'a(b + c)',
    choices0: L(
      [
        'False — multiply by every term inside',
        'True — only the first term',
        'True — only the last term',
        'False — never multiply constants',
      ],
      [
        'Falso — multiplica por cada término interior',
        'Verdadero — solo el primer término',
        'Verdadero — solo el último término',
        'Falso — nunca multipliques constantes',
      ],
      [
        'Fałsz — mnoż przez każdy wyraz wewnątrz',
        'Prawda — tylko pierwszy wyraz',
        'Prawda — tylko ostatni wyraz',
        'Fałsz — nigdy nie mnoż stałych',
      ],
    ),
    fc: L('a(b+c)=ab+ac — every term.', 'a(b+c)=ab+ac — cada término.', 'a(b+c)=ab+ac — każdy wyraz.'),
    fi: L('Skipping terms is the classic distribute error.', 'Omitir términos es el error clásico al distribuir.', 'Pomijanie wyrazów to klasyczny błąd rozdzielności.'),
    tags: ['first_term_only'],
    stds: l13Dist,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.polynomial.multiply',
    diff: 0.65,
    b: 0.7,
    prompt: L(
      'Fully expand (x + 3)(x^{2} − 2x + 1).',
      'Expande completamente (x + 3)(x^{2} − 2x + 1).',
      'Całkowicie rozwiń (x + 3)(x^{2} − 2x + 1).',
    ),
    math: '(x + 3)(x^{2} - 2x + 1)',
    choices0: mathChoices('x^{3}+x^{2}-5x+3', 'x^{3}-2x^{2}+x+3', 'x^{3}+x^{2}-5x-3', 'x^{3}+3x^{2}-6x+3'),
    fc: L('x³ − 2x² + x + 3x² − 6x + 3 = x³ + x² − 5x + 3.', 'x³ − 2x² + x + 3x² − 6x + 3 = x³ + x² − 5x + 3.', 'x³ − 2x² + x + 3x² − 6x + 3 = x³ + x² − 5x + 3.'),
    fi: L('Combine −2x² + 3x² and x − 6x carefully.', 'Combina −2x² + 3x² y x − 6x con cuidado.', 'Ostrożnie połącz −2x² + 3x² oraz x − 6x.'),
    tags: ['like_term_error', 'missed_row'],
    stds: l13Mul,
  },
]

/* ═══════════════════════════════════════
   LESSON 14 — GCF + simple trinomials (a=1)
   ═══════════════════════════════════════ */
const l14Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.factor.gcf',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'Factor out the GCF: 6x + 9.',
      'Saca el MCD: 6x + 9.',
      'Wyłącz NWD: 6x + 9.',
    ),
    math: '6x + 9',
    choices0: mathChoices('3(2x+3)', '6(x+9)', '3(2x+9)', '2(3x+9)'),
    fc: L('GCF is 3: 3(2x+3).', 'El MCD es 3: 3(2x+3).', 'NWD to 3: 3(2x+3).'),
    fi: L('Divide each term by the greatest common numeric factor 3.', 'Divide cada término entre el mayor factor numérico común 3.', 'Podziel każdy wyraz przez największy wspólny czynnik 3.'),
    tags: ['partial_gcf', 'wrong_gcf'],
    stds: l14Gcf,
  },
  {
    id: 't02',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Factor x^{2} + 5x + 6.',
      'Factoriza x^{2} + 5x + 6.',
      'Rozłóż x^{2} + 5x + 6.',
    ),
    math: 'x^{2} + 5x + 6',
    choices0: mathChoices('(x+2)(x+3)', '(x+1)(x+6)', '(x-2)(x-3)', '(x+2)(x-3)'),
    fc: L('2+3=5 and 2·3=6.', '2+3=5 y 2·3=6.', '2+3=5 i 2·3=6.'),
    fi: L('Find two numbers that multiply to 6 and add to 5.', 'Halla dos números que multipliquen a 6 y sumen 5.', 'Znajdź dwie liczby o iloczynie 6 i sumie 5.'),
    tags: ['wrong_factor_pair', 'sign_error'],
    stds: l14Tri,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.factor.gcf',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Factor 4x^{2} − 10x.',
      'Factoriza 4x^{2} − 10x.',
      'Rozłóż 4x^{2} − 10x.',
    ),
    math: '4x^{2} - 10x',
    choices0: mathChoices('2x(2x-5)', '2(2x^{2}-5x)', '4x(x-10)', '2x(2x-10)'),
    fc: L('GCF 2x: 2x(2x−5).', 'MCD 2x: 2x(2x−5).', 'NWD 2x: 2x(2x−5).'),
    fi: L('Pull out both the numeric GCF and the lowest power of x.', 'Saca el MCD numérico y la menor potencia de x.', 'Wyłącz liczbowy NWD i najniższą potęgę x.'),
    tags: ['partial_gcf', 'wrong_gcf'],
    stds: l14Gcf,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Factor x^{2} − 7x + 12.',
      'Factoriza x^{2} − 7x + 12.',
      'Rozłóż x^{2} − 7x + 12.',
    ),
    math: 'x^{2} - 7x + 12',
    choices0: mathChoices('(x-3)(x-4)', '(x+3)(x+4)', '(x-2)(x-6)', '(x-1)(x-12)'),
    fc: L('−3 + −4 = −7 and (−3)(−4)=12.', '−3 + −4 = −7 y (−3)(−4)=12.', '−3 + −4 = −7 i (−3)(−4)=12.'),
    fi: L('When c>0 and b<0, both factors are negative.', 'Cuando c>0 y b<0, ambos factores son negativos.', 'Gdy c>0 i b<0, oba czynniki są ujemne.'),
    tags: ['sign_error', 'wrong_factor_pair'],
    stds: l14Tri,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Factor x^{2} + x − 12.',
      'Factoriza x^{2} + x − 12.',
      'Rozłóż x^{2} + x − 12.',
    ),
    math: 'x^{2} + x - 12',
    choices0: mathChoices('(x+4)(x-3)', '(x+6)(x-2)', '(x+3)(x-4)', '(x-4)(x-3)'),
    fc: L('4 + (−3) = 1 and 4·(−3)=−12.', '4 + (−3) = 1 y 4·(−3)=−12.', '4 + (−3) = 1 i 4·(−3)=−12.'),
    fi: L('Opposite signs; the larger magnitude gets the sign of b.', 'Signos opuestos; la mayor magnitud lleva el signo de b.', 'Przeciwne znaki; większa wartość bezwzględna ma znak b.'),
    tags: ['sign_swap', 'wrong_factor_pair'],
    stds: l14Tri,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.factor.verify',
    diff: 0.45,
    b: -0.05,
    prompt: L(
      'Does (x + 2)(x + 5) equal x^{2} + 7x + 10?',
      '¿(x + 2)(x + 5) es igual a x^{2} + 7x + 10?',
      'Czy (x + 2)(x + 5) równa się x^{2} + 7x + 10?',
    ),
    math: '(x + 2)(x + 5) \\stackrel{?}{=} x^{2} + 7x + 10',
    choices0: L(
      ['Yes — FOIL gives x² + 7x + 10', 'No — middle should be 10x', 'No — constant should be 7', 'Yes — but only if x=0'],
      ['Sí — FOIL da x² + 7x + 10', 'No — el medio debería ser 10x', 'No — la constante debería ser 7', 'Sí — pero solo si x=0'],
      ['Tak — FOIL daje x² + 7x + 10', 'Nie — środek powinien być 10x', 'Nie — stała powinna być 7', 'Tak — ale tylko gdy x=0'],
    ),
    fc: L('x² + 5x + 2x + 10 = x² + 7x + 10.', 'x² + 5x + 2x + 10 = x² + 7x + 10.', 'x² + 5x + 2x + 10 = x² + 7x + 10.'),
    fi: L('Expand to verify any proposed factorization.', 'Expande para verificar cualquier factorización propuesta.', 'Rozwiń, by sprawdzić proponowany rozkład.'),
    tags: ['no_verify'],
    stds: l14Ver,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.factor.gcf',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Factor 12x^{3} + 18x^{2}.',
      'Factoriza 12x^{3} + 18x^{2}.',
      'Rozłóż 12x^{3} + 18x^{2}.',
    ),
    math: '12x^{3} + 18x^{2}',
    choices0: mathChoices('6x^{2}(2x+3)', '6x(2x^{2}+3x)', '12x^{2}(x+18)', '3x^{2}(4x+6)'),
    fc: L('GCF 6x²: 6x²(2x+3).', 'MCD 6x²: 6x²(2x+3).', 'NWD 6x²: 6x²(2x+3).'),
    fi: L('Use the greatest common coefficient and the lowest power of x present in all terms.', 'Usa el mayor coeficiente común y la menor potencia de x en todos los términos.', 'Użyj największego wspólnego współczynnika i najniższej potęgi x we wszystkich wyrazach.'),
    tags: ['partial_gcf', 'wrong_gcf'],
    stds: l14Gcf,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.factor.gcf',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Factor −5x − 15.',
      'Factoriza −5x − 15.',
      'Rozłóż −5x − 15.',
    ),
    math: '-5x - 15',
    choices0: mathChoices('-5(x+3)', '-5(x-3)', '5(x+3)', '-15(x+1)'),
    fc: L('Factor −5: −5(x+3).', 'Factor −5: −5(x+3).', 'Czynnik −5: −5(x+3).'),
    fi: L('Pulling a negative GCF flips signs inside the parentheses.', 'Sacar un MCD negativo cambia signos dentro del paréntesis.', 'Ujemny NWD odwraca znaki w nawiasie.'),
    tags: ['sign_error', 'wrong_gcf'],
    stds: l14Gcf,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Factor x^{2} − 2x − 15.',
      'Factoriza x^{2} − 2x − 15.',
      'Rozłóż x^{2} − 2x − 15.',
    ),
    math: 'x^{2} - 2x - 15',
    choices0: mathChoices('(x-5)(x+3)', '(x+5)(x-3)', '(x-15)(x+1)', '(x-5)(x-3)'),
    fc: L('−5 + 3 = −2 and (−5)(3)=−15.', '−5 + 3 = −2 y (−5)(3)=−15.', '−5 + 3 = −2 i (−5)(3)=−15.'),
    fi: L('Factors of −15 with sum −2: −5 and +3.', 'Factores de −15 con suma −2: −5 y +3.', 'Czynniki −15 o sumie −2: −5 i +3.'),
    tags: ['sign_swap', 'wrong_factor_pair'],
    stds: l14Tri,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'Factor x^{2} + 8x + 16.',
      'Factoriza x^{2} + 8x + 16.',
      'Rozłóż x^{2} + 8x + 16.',
    ),
    math: 'x^{2} + 8x + 16',
    choices0: mathChoices('(x+4)(x+4)', '(x+2)(x+8)', '(x+4)(x-4)', '(x+16)(x+1)'),
    fc: L('4+4=8 and 4·4=16 → (x+4)².', '4+4=8 y 4·4=16 → (x+4)².', '4+4=8 i 4·4=16 → (x+4)².'),
    fi: L('Same factor twice when the middle is twice one factor of c.', 'El mismo factor dos veces cuando el medio es el doble de un factor de c.', 'Ten sam czynnik dwa razy, gdy środek to podwójny czynnik c.'),
    tags: ['wrong_factor_pair'],
    stds: l14Tri,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.factor.verify',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Which factorization of x^{2} − 9x + 18 is correct?',
      '¿Qué factorización de x^{2} − 9x + 18 es correcta?',
      'Który rozkład x^{2} − 9x + 18 jest poprawny?',
    ),
    math: 'x^{2} - 9x + 18',
    choices0: mathChoices('(x-3)(x-6)', '(x+3)(x+6)', '(x-2)(x-9)', '(x-3)(x+6)'),
    fc: L('Expand: x² − 6x − 3x + 18 = x² − 9x + 18.', 'Expande: x² − 6x − 3x + 18 = x² − 9x + 18.', 'Rozwiń: x² − 6x − 3x + 18 = x² − 9x + 18.'),
    fi: L('Check by multiplying; −3 and −6 sum to −9.', 'Comprueba multiplicando; −3 y −6 suman −9.', 'Sprawdź mnożąc; −3 i −6 dają sumę −9.'),
    tags: ['sign_error', 'wrong_factor_pair'],
    stds: l14Ver,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.factor.gcf',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'After factoring GCF from 8x^{2}y − 12xy, one correct form is…',
      'Tras sacar el MCD de 8x^{2}y − 12xy, una forma correcta es…',
      'Po wyłączeniu NWD z 8x^{2}y − 12xy poprawna forma to…',
    ),
    math: '8x^{2}y - 12xy',
    choices0: mathChoices('4xy(2x-3)', '4x(2xy-3y)', '8xy(x-12)', '2xy(4x-6)'),
    fc: L('GCF 4xy leaves (2x−3).', 'MCD 4xy deja (2x−3).', 'NWD 4xy zostawia (2x−3).'),
    fi: L('Include every common variable factor to the lowest power.', 'Incluye cada factor variable común a la menor potencia.', 'Uwzględnij każdy wspólny czynnik zmiennej w najniższej potędze.'),
    tags: ['partial_gcf'],
    stds: l14Gcf,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Factor x^{2} − 9x − 10.',
      'Factoriza x^{2} − 9x − 10.',
      'Rozłóż x^{2} − 9x − 10.',
    ),
    math: 'x^{2} - 9x - 10',
    choices0: mathChoices('(x-10)(x+1)', '(x+10)(x-1)', '(x-5)(x-2)', '(x-10)(x-1)'),
    fc: L('−10 + 1 = −9 and (−10)(1)=−10.', '−10 + 1 = −9 y (−10)(1)=−10.', '−10 + 1 = −9 i (−10)(1)=−10.'),
    fi: L('Try factor pairs of −10; only −10 and +1 sum to −9.', 'Prueba pares de −10; solo −10 y +1 suman −9.', 'Sprawdź pary −10; tylko −10 i +1 dają −9.'),
    tags: ['wrong_factor_pair', 'sign_swap'],
    stds: l14Tri,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.factor.verify',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Expand (x − 4)(x + 7). Result?',
      'Expande (x − 4)(x + 7). ¿Resultado?',
      'Rozwiń (x − 4)(x + 7). Wynik?',
    ),
    math: '(x - 4)(x + 7)',
    choices0: mathChoices('x^{2}+3x-28', 'x^{2}-3x-28', 'x^{2}+3x+28', 'x^{2}-11x-28'),
    fc: L('x² + 7x − 4x − 28 = x² + 3x − 28.', 'x² + 7x − 4x − 28 = x² + 3x − 28.', 'x² + 7x − 4x − 28 = x² + 3x − 28.'),
    fi: L('Outer and Inner: 7x − 4x = 3x.', 'Externo e interno: 7x − 4x = 3x.', 'Zewnętrzne i wewnętrzne: 7x − 4x = 3x.'),
    tags: ['sign_error', 'like_term_error'],
    stds: l14Ver,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.factor.gcf',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Best first step for 2x^{2} + 10x + 12?',
      '¿Mejor primer paso para 2x^{2} + 10x + 12?',
      'Najlepszy pierwszy krok dla 2x^{2} + 10x + 12?',
    ),
    math: '2x^{2} + 10x + 12',
    choices0: L(
      ['Factor out 2, then factor the trinomial', 'FOIL immediately without GCF', 'Subtract 12 from both sides', 'Divide only the first term by 2'],
      ['Sacar 2 y luego factorizar el trinomio', 'FOIL de inmediato sin MCD', 'Restar 12 a ambos lados', 'Dividir solo el primer término entre 2'],
      ['Wyłączyć 2, potem rozłożyć trójmian', 'Od razu FOIL bez NWD', 'Odjąć 12 od obu stron', 'Podzielić tylko pierwszy wyraz przez 2'],
    ),
    fc: L('Always pull GCF first: 2(x² + 5x + 6).', 'Siempre saca el MCD primero: 2(x² + 5x + 6).', 'Zawsze najpierw NWD: 2(x² + 5x + 6).'),
    fi: L('GCF first makes the remaining trinomial easier.', 'El MCD primero facilita el trinomio restante.', 'NWD najpierw ułatwia pozostały trójmian.'),
    tags: ['skipped_gcf'],
    stds: l14Gcf,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.factor.trinomial.a1',
    diff: 0.65,
    b: 0.65,
    prompt: L(
      'Factor x^{2} + 0x − 16 (i.e. x^{2} − 16) as a trinomial case.',
      'Factoriza x^{2} + 0x − 16 (es decir x^{2} − 16) como caso de trinomio.',
      'Rozłóż x^{2} + 0x − 16 (czyli x^{2} − 16) jak trójmian.',
    ),
    math: 'x^{2} - 16',
    choices0: mathChoices('(x-4)(x+4)', '(x-8)(x+2)', '(x-4)(x-4)', '(x+4)(x+4)'),
    fc: L('−4 + 4 = 0 and (−4)(4)=−16.', '−4 + 4 = 0 y (−4)(4)=−16.', '−4 + 4 = 0 i (−4)(4)=−16.'),
    fi: L('Numbers that multiply to −16 and add to 0 are opposites.', 'Números que multiplican a −16 y suman 0 son opuestos.', 'Liczby o iloczynie −16 i sumie 0 są przeciwne.'),
    tags: ['wrong_factor_pair', 'perfect_square_confusion'],
    stds: l14Tri,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.factor.verify',
    diff: 0.65,
    b: 0.7,
    prompt: L(
      'Someone claims x^{2} + 5x − 6 = (x + 6)(x − 1). Check?',
      'Alguien afirma x^{2} + 5x − 6 = (x + 6)(x − 1). ¿Comprobar?',
      'Ktoś twierdzi x^{2} + 5x − 6 = (x + 6)(x − 1). Sprawdzenie?',
    ),
    math: 'x^{2} + 5x - 6 \\stackrel{?}{=} (x + 6)(x - 1)',
    choices0: L(
      ['Correct — expands to x² + 5x − 6', 'Wrong — expands to x² − 5x − 6', 'Wrong — expands to x² + 7x − 6', 'Correct — but constant should be +6'],
      ['Correcto — expande a x² + 5x − 6', 'Incorrecto — expande a x² − 5x − 6', 'Incorrecto — expande a x² + 7x − 6', 'Correcto — pero la constante debería ser +6'],
      ['Poprawne — rozwija do x² + 5x − 6', 'Błędne — rozwija do x² − 5x − 6', 'Błędne — rozwija do x² + 7x − 6', 'Poprawne — ale stała powinna być +6'],
    ),
    fc: L('6x − x = 5x; 6·(−1)=−6. Match.', '6x − x = 5x; 6·(−1)=−6. Coincide.', '6x − x = 5x; 6·(−1)=−6. Zgodne.'),
    fi: L('Always FOIL to confirm.', 'Siempre FOIL para confirmar.', 'Zawsze FOIL, by potwierdzić.'),
    tags: ['no_verify'],
    stds: l14Ver,
  },
]

/* ═══════════════════════════════════════
   LESSON 15 — Diff of squares + more trinomials
   ═══════════════════════════════════════ */
const l15Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'Factor x^{2} − 25.',
      'Factoriza x^{2} − 25.',
      'Rozłóż x^{2} − 25.',
    ),
    math: 'x^{2} - 25',
    choices0: mathChoices('(x-5)(x+5)', '(x-5)(x-5)', '(x+5)(x+5)', 'x(x-25)'),
    fc: L('a² − b² = (a−b)(a+b) with a=x, b=5.', 'a² − b² = (a−b)(a+b) con a=x, b=5.', 'a² − b² = (a−b)(a+b) przy a=x, b=5.'),
    fi: L('Difference of squares uses opposite signs, not a squared binomial.', 'La diferencia de cuadrados usa signos opuestos, no un binomio al cuadrado.', 'Różnica kwadratów ma przeciwne znaki, nie kwadrat dwumianu.'),
    tags: ['perfect_square_confusion', 'sum_of_squares'],
    stds: l15Dos,
  },
  {
    id: 't02',
    kp: 'kp.alg1.factor.trinomial.more',
    diff: 0.3,
    b: -0.8,
    prompt: L(
      'Factor x^{2} − 11x + 24.',
      'Factoriza x^{2} − 11x + 24.',
      'Rozłóż x^{2} − 11x + 24.',
    ),
    math: 'x^{2} - 11x + 24',
    choices0: mathChoices('(x-3)(x-8)', '(x-4)(x-6)', '(x+3)(x+8)', '(x-2)(x-12)'),
    fc: L('−3 + −8 = −11; (−3)(−8)=24.', '−3 + −8 = −11; (−3)(−8)=24.', '−3 + −8 = −11; (−3)(−8)=24.'),
    fi: L('Both factors negative when c>0 and b<0.', 'Ambos factores negativos cuando c>0 y b<0.', 'Oba czynniki ujemne, gdy c>0 i b<0.'),
    tags: ['wrong_factor_pair', 'sign_error'],
    stds: l15More,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Factor 9x^{2} − 16.',
      'Factoriza 9x^{2} − 16.',
      'Rozłóż 9x^{2} − 16.',
    ),
    math: '9x^{2} - 16',
    choices0: mathChoices('(3x-4)(3x+4)', '(3x-4)(3x-4)', '(9x-4)(x+4)', '(3x-16)(3x+1)'),
    fc: L('(3x)² − 4² = (3x−4)(3x+4).', '(3x)² − 4² = (3x−4)(3x+4).', '(3x)² − 4² = (3x−4)(3x+4).'),
    fi: L('Take square roots of both square terms.', 'Toma raíces cuadradas de ambos términos cuadrados.', 'Weź pierwiastki obu wyrazów kwadratowych.'),
    tags: ['wrong_roots', 'perfect_square_confusion'],
    stds: l15Dos,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.factor.perfect.square',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Factor x^{2} + 10x + 25.',
      'Factoriza x^{2} + 10x + 25.',
      'Rozłóż x^{2} + 10x + 25.',
    ),
    math: 'x^{2} + 10x + 25',
    choices0: mathChoices('(x+5)^{2}', '(x-5)^{2}', '(x+5)(x-5)', '(x+10)(x+2.5)'),
    fc: L('a² + 2ab + b² = (a+b)² with a=x, b=5.', 'a² + 2ab + b² = (a+b)² con a=x, b=5.', 'a² + 2ab + b² = (a+b)² przy a=x, b=5.'),
    fi: L('Middle term 10x = 2·x·5 confirms a perfect square.', 'El término medio 10x = 2·x·5 confirma cuadrado perfecto.', 'Środkowy 10x = 2·x·5 potwierdza kwadrat zupełny.'),
    tags: ['difference_confused', 'not_perfect'],
    stds: l15Perf,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.factor.trinomial.more',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Factor x^{2} + 3x − 28.',
      'Factoriza x^{2} + 3x − 28.',
      'Rozłóż x^{2} + 3x − 28.',
    ),
    math: 'x^{2} + 3x - 28',
    choices0: mathChoices('(x+7)(x-4)', '(x+4)(x-7)', '(x+14)(x-2)', '(x+28)(x-1)'),
    fc: L('7 + (−4) = 3; 7·(−4)=−28.', '7 + (−4) = 3; 7·(−4)=−28.', '7 + (−4) = 3; 7·(−4)=−28.'),
    fi: L('Larger magnitude gets the sign of b (+).', 'La mayor magnitud lleva el signo de b (+).', 'Większa wartość bezwzględna ma znak b (+).'),
    tags: ['sign_swap', 'wrong_factor_pair'],
    stds: l15More,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.45,
    b: 0.0,
    prompt: L(
      'Factor 4y^{2} − 49.',
      'Factoriza 4y^{2} − 49.',
      'Rozłóż 4y^{2} − 49.',
    ),
    math: '4y^{2} - 49',
    choices0: mathChoices('(2y-7)(2y+7)', '(2y-7)^{2}', '(4y-7)(y+7)', '(2y-49)(2y+1)'),
    fc: L('(2y)² − 7².', '(2y)² − 7².', '(2y)² − 7².'),
    fi: L('√4y² = 2y and √49 = 7.', '√4y² = 2y y √49 = 7.', '√4y² = 2y i √49 = 7.'),
    tags: ['wrong_roots', 'perfect_square_confusion'],
    stds: l15Dos,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.factor.perfect.square',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Factor x^{2} − 6x + 9.',
      'Factoriza x^{2} − 6x + 9.',
      'Rozłóż x^{2} − 6x + 9.',
    ),
    math: 'x^{2} - 6x + 9',
    choices0: mathChoices('(x-3)^{2}', '(x+3)^{2}', '(x-3)(x+3)', '(x-9)(x-1)'),
    fc: L('a² − 2ab + b² = (a−b)².', 'a² − 2ab + b² = (a−b)².', 'a² − 2ab + b² = (a−b)².'),
    fi: L('Minus in the middle → (x−3)², not (x+3)².', 'Menos en el medio → (x−3)², no (x+3)².', 'Minus w środku → (x−3)², nie (x+3)².'),
    tags: ['sign_error', 'difference_confused'],
    stds: l15Perf,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'Factor 25 − x^{2}.',
      'Factoriza 25 − x^{2}.',
      'Rozłóż 25 − x^{2}.',
    ),
    math: '25 - x^{2}',
    choices0: mathChoices('(5-x)(5+x)', '(x-5)(x+5)', '(5-x)^{2}', '-(x-5)^{2}'),
    fc: L('5² − x² = (5−x)(5+x).', '5² − x² = (5−x)(5+x).', '5² − x² = (5−x)(5+x).'),
    fi: L('Order follows a² − b² with a=5, b=x (equivalent forms OK if expanded match).', 'El orden sigue a² − b² con a=5, b=x.', 'Kolejność według a² − b² przy a=5, b=x.'),
    tags: ['order_error', 'perfect_square_confusion'],
    stds: l15Dos,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.factor.trinomial.more',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Factor x^{2} − 14x + 45.',
      'Factoriza x^{2} − 14x + 45.',
      'Rozłóż x^{2} − 14x + 45.',
    ),
    math: 'x^{2} - 14x + 45',
    choices0: mathChoices('(x-5)(x-9)', '(x-3)(x-15)', '(x+5)(x+9)', '(x-5)(x+9)'),
    fc: L('−5 + −9 = −14; product 45.', '−5 + −9 = −14; producto 45.', '−5 + −9 = −14; iloczyn 45.'),
    fi: L('List factor pairs of 45; both negative.', 'Lista pares de 45; ambos negativos.', 'Wypisz pary 45; obie ujemne.'),
    tags: ['wrong_factor_pair', 'sign_error'],
    stds: l15More,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.55,
    b: 0.3,
    prompt: L(
      'First factor GCF, then difference of squares: 2x^{2} − 32.',
      'Primero MCD, luego diferencia de cuadrados: 2x^{2} − 32.',
      'Najpierw NWD, potem różnica kwadratów: 2x^{2} − 32.',
    ),
    math: '2x^{2} - 32',
    choices0: mathChoices('2(x-4)(x+4)', '2(x-4)^{2}', '(2x-8)(x+4)', '2(x^{2}-16)'),
    fc: L('2(x²−16)=2(x−4)(x+4).', '2(x²−16)=2(x−4)(x+4).', '2(x²−16)=2(x−4)(x+4).'),
    fi: L('After GCF 2, finish factoring x²−16.', 'Tras el MCD 2, termina de factorizar x²−16.', 'Po NWD 2 dokończ rozkład x²−16.'),
    tags: ['stopped_early', 'skipped_gcf'],
    stds: l15Dos,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.factor.perfect.square',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Is x^{2} + 4x + 4 a perfect-square trinomial?',
      '¿Es x^{2} + 4x + 4 un trinomio cuadrado perfecto?',
      'Czy x^{2} + 4x + 4 to trójmian kwadratu zupełnego?',
    ),
    math: 'x^{2} + 4x + 4',
    choices0: L(
      ['Yes — (x+2)²', 'No — middle should be 8x', 'Yes — (x−2)²', 'No — it is a difference of squares'],
      ['Sí — (x+2)²', 'No — el medio debería ser 8x', 'Sí — (x−2)²', 'No — es diferencia de cuadrados'],
      ['Tak — (x+2)²', 'Nie — środek powinien być 8x', 'Tak — (x−2)²', 'Nie — to różnica kwadratów'],
    ),
    fc: L('2·x·2 = 4x matches the middle term.', '2·x·2 = 4x coincide con el término medio.', '2·x·2 = 4x zgadza się ze środkowym wyrazem.'),
    fi: L('Check middle = 2√(first)·√(last).', 'Comprueba medio = 2√(primero)·√(último).', 'Sprawdź środek = 2√(pierwszy)·√(ostatni).'),
    tags: ['not_perfect'],
    stds: l15Perf,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.factor.trinomial.more',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Factor x^{2} + 2x − 48.',
      'Factoriza x^{2} + 2x − 48.',
      'Rozłóż x^{2} + 2x − 48.',
    ),
    math: 'x^{2} + 2x - 48',
    choices0: mathChoices('(x+8)(x-6)', '(x+6)(x-8)', '(x+12)(x-4)', '(x+16)(x-3)'),
    fc: L('8 + (−6) = 2; 8·(−6)=−48.', '8 + (−6) = 2; 8·(−6)=−48.', '8 + (−6) = 2; 8·(−6)=−48.'),
    fi: L('Need sum +2 with product −48.', 'Necesitas suma +2 con producto −48.', 'Potrzebna suma +2 i iloczyn −48.'),
    tags: ['sign_swap', 'wrong_factor_pair'],
    stds: l15More,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Can x^{2} + 36 be factored as a difference of squares over the reals?',
      '¿Se puede factorizar x^{2} + 36 como diferencia de cuadrados sobre los reales?',
      'Czy x^{2} + 36 rozkłada się jak różnica kwadratów nad liczbami rzeczywistymi?',
    ),
    math: 'x^{2} + 36',
    choices0: L(
      ['No — it is a sum of squares', 'Yes — (x−6)(x+6)', 'Yes — (x+6)²', 'Yes — (x−6)²'],
      ['No — es una suma de cuadrados', 'Sí — (x−6)(x+6)', 'Sí — (x+6)²', 'Sí — (x−6)²'],
      ['Nie — to suma kwadratów', 'Tak — (x−6)(x+6)', 'Tak — (x+6)²', 'Tak — (x−6)²'],
    ),
    fc: L('a² + b² does not factor over the reals like a² − b².', 'a² + b² no se factoriza sobre los reales como a² − b².', 'a² + b² nie rozkłada się nad ℝ jak a² − b².'),
    fi: L('Only a difference (minus) of squares uses (a−b)(a+b).', 'Solo una diferencia (menos) de cuadrados usa (a−b)(a+b).', 'Tylko różnica (minus) kwadratów daje (a−b)(a+b).'),
    tags: ['sum_of_squares'],
    stds: l15Dos,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.factor.perfect.square',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Factor 4x^{2} − 12x + 9.',
      'Factoriza 4x^{2} − 12x + 9.',
      'Rozłóż 4x^{2} − 12x + 9.',
    ),
    math: '4x^{2} - 12x + 9',
    choices0: mathChoices('(2x-3)^{2}', '(2x+3)^{2}', '(2x-3)(2x+3)', '(4x-3)(x-3)'),
    fc: L('(2x)² − 2·2x·3 + 3² = (2x−3)².', '(2x)² − 2·2x·3 + 3² = (2x−3)².', '(2x)² − 2·2x·3 + 3² = (2x−3)².'),
    fi: L('Middle −12x = −2·(2x)·3 confirms the minus square.', 'Medio −12x = −2·(2x)·3 confirma el cuadrado con menos.', 'Środek −12x = −2·(2x)·3 potwierdza kwadrat z minusem.'),
    tags: ['sign_error', 'difference_confused'],
    stds: l15Perf,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.factor.trinomial.more',
    diff: 0.6,
    b: 0.55,
    prompt: L(
      'Factor x^{2} − x − 72.',
      'Factoriza x^{2} − x − 72.',
      'Rozłóż x^{2} − x − 72.',
    ),
    math: 'x^{2} - x - 72',
    choices0: mathChoices('(x-9)(x+8)', '(x+9)(x-8)', '(x-12)(x+6)', '(x-8)(x-9)'),
    fc: L('−9 + 8 = −1; (−9)(8)=−72.', '−9 + 8 = −1; (−9)(8)=−72.', '−9 + 8 = −1; (−9)(8)=−72.'),
    fi: L('Product −72, sum −1 → −9 and +8.', 'Producto −72, suma −1 → −9 y +8.', 'Iloczyn −72, suma −1 → −9 i +8.'),
    tags: ['sign_swap', 'wrong_factor_pair'],
    stds: l15More,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.factor.difference.squares',
    diff: 0.65,
    b: 0.65,
    prompt: L(
      'Factor 81x^{2} − 1.',
      'Factoriza 81x^{2} − 1.',
      'Rozłóż 81x^{2} − 1.',
    ),
    math: '81x^{2} - 1',
    choices0: mathChoices('(9x-1)(9x+1)', '(9x-1)^{2}', '(81x-1)(x+1)', '(9x-1)(x+1)'),
    fc: L('(9x)² − 1².', '(9x)² − 1².', '(9x)² − 1².'),
    fi: L('√81x² = 9x; √1 = 1.', '√81x² = 9x; √1 = 1.', '√81x² = 9x; √1 = 1.'),
    tags: ['wrong_roots', 'perfect_square_confusion'],
    stds: l15Dos,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.factor.trinomial.more',
    diff: 0.65,
    b: 0.7,
    prompt: L(
      'Factor x^{2} + 15x + 54.',
      'Factoriza x^{2} + 15x + 54.',
      'Rozłóż x^{2} + 15x + 54.',
    ),
    math: 'x^{2} + 15x + 54',
    choices0: mathChoices('(x+6)(x+9)', '(x+3)(x+18)', '(x+2)(x+27)', '(x-6)(x-9)'),
    fc: L('6+9=15 and 6·9=54.', '6+9=15 y 6·9=54.', '6+9=15 i 6·9=54.'),
    fi: L('Both positive when b and c are positive.', 'Ambos positivos cuando b y c son positivos.', 'Oba dodatnie, gdy b i c są dodatnie.'),
    tags: ['wrong_factor_pair', 'sign_error'],
    stds: l15More,
  },
]

const lesson13Items = buildItems('alg1-l13', l13Specs)
const lesson14Items = buildItems('alg1-l14', l14Specs)
const lesson15Items = buildItems('alg1-l15', l15Specs)

const lesson13 = {
  id: 'alg1-l13',
  courseId: 'algebra1',
  order: 13,
  title: L(
    'Multiply Polynomials — Distribute & FOIL',
    'Multiplicar polinomios — distribuir y FOIL',
    'Mnożenie wielomianów — rozdzielność i FOIL',
  ),
  knowledgePointIds: [
    'kp.alg1.polynomial.distribute',
    'kp.alg1.polynomial.foil',
    'kp.alg1.polynomial.multiply',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_13', unlockOnMastery: ['lesson_board_14'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will multiply polynomials by distributing a monomial and by FOIL (and beyond) for binomials, then combine like terms.',
        'Multiplicarás polinomios distribuyendo un monomio y con FOIL (y más) para binomios, luego combinarás términos semejantes.',
        'Będziesz mnożyć wielomiany przez rozdzielanie jednomianu oraz FOIL (i dalej) dla dwumianów, potem łączyć wyrazy podobne.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: distribute & FOIL', 'Enseñar: distribuir y FOIL', 'Nauczanie: rozdzielność i FOIL'),
      body: L(
        'Distribute the outside factor to every inside term. For two binomials, form all four products (FOIL) and combine like terms.',
        'Distribuye el factor exterior a cada término interior. Para dos binomios, forma los cuatro productos (FOIL) y combina semejantes.',
        'Rozdziel czynnik zewnętrzny na każdy wyraz wewnątrz. Dla dwóch dwumianów utwórz cztery iloczyny (FOIL) i połącz podobne.',
      ),
      bodyMath: [
        '3x(2x + 5) = 6x^{2} + 15x',
        '(x + 2)(x + 3) = x^{2} + 5x + 6',
        '(2x - 5)(2x + 5) = 4x^{2} - 25',
      ],
      itemIds: ['alg1-l13-t01', 'alg1-l13-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Practice signs while distributing and FOIL; begin binomial × trinomial products.',
        'Practica signos al distribuir y en FOIL; comienza productos binomio × trinomio.',
        'Ćwicz znaki przy rozdzielaniu i FOIL; zacznij iloczyny dwumian × trójmian.',
      ),
      itemIds: ['alg1-l13-g01', 'alg1-l13-g02', 'alg1-l13-g03', 'alg1-l13-g04', 'alg1-l13-g05'],
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
        'alg1-l13-i01',
        'alg1-l13-i02',
        'alg1-l13-i03',
        'alg1-l13-i04',
        'alg1-l13-i05',
        'alg1-l13-i06',
        'alg1-l13-i07',
        'alg1-l13-i08',
        'alg1-l13-i09',
        'alg1-l13-i10',
      ],
    },
  ],
  items: lesson13Items,
}

const lesson14 = {
  id: 'alg1-l14',
  courseId: 'algebra1',
  order: 14,
  title: L(
    'Factor — GCF & Simple Trinomials',
    'Factorizar — MCD y trinomios simples',
    'Rozkład — NWD i proste trójmiany',
  ),
  knowledgePointIds: [
    'kp.alg1.factor.gcf',
    'kp.alg1.factor.trinomial.a1',
    'kp.alg1.factor.verify',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_14', unlockOnMastery: ['lesson_board_15'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will factor out GCFs and factor x² + bx + c (a=1), then verify by multiplying.',
        'Sacarás el MCD y factorizarás x² + bx + c (a=1), luego verificarás multiplicando.',
        'Będziesz wyłączać NWD i rozkładać x² + bx + c (a=1), potem sprawdzać przez mnożenie.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: GCF & (x+p)(x+q)', 'Enseñar: MCD y (x+p)(x+q)', 'Nauczanie: NWD i (x+p)(x+q)'),
      body: L(
        'Pull the greatest common factor first. For x² + bx + c, find integers p,q with p+q=b and p·q=c.',
        'Saca primero el máximo común divisor. Para x² + bx + c, halla enteros p,q con p+q=b y p·q=c.',
        'Najpierw wyłącz największy wspólny dzielnik. Dla x² + bx + c znajdź całkowite p,q: p+q=b, p·q=c.',
      ),
      bodyMath: [
        '6x + 9 = 3(2x + 3)',
        'x^{2} + 5x + 6 = (x + 2)(x + 3)',
        '(x + 2)(x + 5) = x^{2} + 7x + 10',
      ],
      itemIds: ['alg1-l14-t01', 'alg1-l14-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Factor GCFs with variables, practice mixed-sign trinomials, and check by expanding.',
        'Factoriza MCD con variables, practica trinomios con signos mixtos y comprueba expandiendo.',
        'Rozkładaj NWD ze zmiennymi, ćwicz trójmiany z mieszanymi znakami i sprawdzaj rozwijając.',
      ),
      itemIds: ['alg1-l14-g01', 'alg1-l14-g02', 'alg1-l14-g03', 'alg1-l14-g04', 'alg1-l14-g05'],
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
        'alg1-l14-i01',
        'alg1-l14-i02',
        'alg1-l14-i03',
        'alg1-l14-i04',
        'alg1-l14-i05',
        'alg1-l14-i06',
        'alg1-l14-i07',
        'alg1-l14-i08',
        'alg1-l14-i09',
        'alg1-l14-i10',
      ],
    },
  ],
  items: lesson14Items,
}

const lesson15 = {
  id: 'alg1-l15',
  courseId: 'algebra1',
  order: 15,
  title: L(
    'Factor — Difference of Squares & More',
    'Factorizar — diferencia de cuadrados y más',
    'Rozkład — różnica kwadratów i więcej',
  ),
  knowledgePointIds: [
    'kp.alg1.factor.difference.squares',
    'kp.alg1.factor.trinomial.more',
    'kp.alg1.factor.perfect.square',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_15', unlockOnMastery: ['lesson_board_16'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will factor differences of squares and perfect-square trinomials, and tackle harder a=1 trinomials.',
        'Factorizarás diferencias de cuadrados y trinomios cuadrados perfectos, y abordarás trinomios a=1 más difíciles.',
        'Będziesz rozkładać różnice kwadratów i trójmiany kwadratów zupełnych oraz trudniejsze trójmiany a=1.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: special products reverse', 'Enseñar: productos especiales al revés', 'Nauczanie: odwrotność iloczynów specjalnych'),
      body: L(
        'a² − b² = (a−b)(a+b). Perfect squares: a² ± 2ab + b² = (a ± b)². Keep practicing larger factor pairs.',
        'a² − b² = (a−b)(a+b). Cuadrados perfectos: a² ± 2ab + b² = (a ± b)². Sigue practicando pares de factores mayores.',
        'a² − b² = (a−b)(a+b). Kwadraty zupełne: a² ± 2ab + b² = (a ± b)². Ćwicz większe pary czynników.',
      ),
      bodyMath: [
        'x^{2} - 25 = (x - 5)(x + 5)',
        'x^{2} + 10x + 25 = (x + 5)^{2}',
        'x^{2} - 11x + 24 = (x - 3)(x - 8)',
      ],
      itemIds: ['alg1-l15-t01', 'alg1-l15-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Factor scaled differences of squares and recognize perfect squares among harder trinomials.',
        'Factoriza diferencias de cuadrados escaladas y reconoce cuadrados perfectos entre trinomios más duros.',
        'Rozkładaj przeskalowane różnice kwadratów i rozpoznawaj kwadraty zupełne wśród trudniejszych trójmianów.',
      ),
      itemIds: ['alg1-l15-g01', 'alg1-l15-g02', 'alg1-l15-g03', 'alg1-l15-g04', 'alg1-l15-g05'],
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
        'alg1-l15-i01',
        'alg1-l15-i02',
        'alg1-l15-i03',
        'alg1-l15-i04',
        'alg1-l15-i05',
        'alg1-l15-i06',
        'alg1-l15-i07',
        'alg1-l15-i08',
        'alg1-l15-i09',
        'alg1-l15-i10',
      ],
    },
  ],
  items: lesson15Items,
}

/* ─── Write outputs ─── */
lesson12.worldHook.unlockOnMastery = ['lesson_board_13']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-12.json', lesson12)
writeJson('lesson-13.json', lesson13)
writeJson('lesson-14.json', lesson14)
writeJson('lesson-15.json', lesson15)

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
        // Bare caret math without $ or \ — would not render via KaTeX
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

const summary = {
  newKpIds: newKps.map((k) => k.id),
  lessons: [lesson13, lesson14, lesson15].map((l) => ({
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
  })),
  l12Unlock: lesson12.worldHook.unlockOnMastery,
}
console.log(JSON.stringify(summary, null, 2))
