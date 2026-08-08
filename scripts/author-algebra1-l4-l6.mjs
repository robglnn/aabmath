/**
 * Wave 2 authoring: Algebra I Lessons 4–6 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l4-l6.mjs
 * Merges into existing knowledge-points.json / standards-index.json;
 * writes lesson-04..06; patches L3 unlockOnMastery → lesson_board_4.
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

const existingKpDoc = JSON.parse(readFileSync(join(outDir, 'knowledge-points.json'), 'utf8'))
const existingStd = JSON.parse(readFileSync(join(outDir, 'standards-index.json'), 'utf8'))
const lesson03 = JSON.parse(readFileSync(join(outDir, 'lesson-03.json'), 'utf8'))

/* ─── New knowledge points ─── */
const newKps = [
  {
    id: 'kp.alg1.solve.multi.step',
    title: L(
      'Solve multi-step linear equations',
      'Resolver ecuaciones lineales de varios pasos',
      'Rozwiązywanie wielokrokowych równań liniowych',
    ),
    prerequisites: ['kp.alg1.solve.two.step'],
    encompassing: ['kp.alg1.solve.two.step'],
    successCriteria: L(
      'Student combines like terms and/or uses the distributive property, then isolates the variable with inverse operations and verifies.',
      'El estudiante combina términos semejantes y/o usa la propiedad distributiva, luego aísla la variable con operaciones inversas y verifica.',
      'Uczeń łączy wyrazy podobne i/lub stosuje rozdzielność, potem izoluje zmienną działaniami odwrotnymi i weryfikuje.',
    ),
    misconceptions: L(
      [
        'Combining unlike terms before solving',
        'Forgetting to distribute to every term inside parentheses',
      ],
      [
        'Combinar términos no semejantes antes de resolver',
        'Olvidar distribuir a cada término dentro de los paréntesis',
      ],
      [
        'Łączenie niepodobnych wyrazów przed rozwiązaniem',
        'Zapominanie o rozdzielności na każdy wyraz w nawiasie',
      ],
    ),
    standards: [
      TX('A.5(A)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.B.3', 'A-REI.A.1', '7.EE.B.4'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.1'),
    ],
  },
  {
    id: 'kp.alg1.solve.both.sides',
    title: L(
      'Solve equations with variables on both sides',
      'Resolver ecuaciones con variables en ambos lados',
      'Rozwiązywanie równań ze zmiennymi po obu stronach',
    ),
    prerequisites: ['kp.alg1.solve.multi.step'],
    encompassing: ['kp.alg1.solve.multi.step'],
    successCriteria: L(
      'Student collects variable terms on one side and constants on the other, then solves and checks by substitution.',
      'El estudiante reúne términos con variable en un lado y constantes en el otro, luego resuelve y verifica por sustitución.',
      'Uczeń zbiera wyrazy ze zmienną po jednej stronie i stałe po drugiej, potem rozwiązuje i sprawdza przez podstawienie.',
    ),
    misconceptions: L(
      [
        'Subtracting a variable term from only one side',
        'Treating both-sides equations as two unrelated one-sided equations',
      ],
      [
        'Restar un término con variable de un solo lado',
        'Tratar ecuaciones con ambos lados como dos ecuaciones independientes',
      ],
      [
        'Odejmowanie wyrazu ze zmienną tylko od jednej strony',
        'Traktowanie równań z obu stron jako dwóch niezależnych równań',
      ],
    ),
    standards: [
      TX('A.5(A)', 'A.1(B)'),
      CC('A-REI.B.3', 'A-REI.A.1'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.1'),
    ],
  },
  {
    id: 'kp.alg1.equation.verify',
    title: L(
      'Verify solutions by substitution',
      'Verificar soluciones por sustitución',
      'Weryfikacja rozwiązań przez podstawienie',
    ),
    prerequisites: ['kp.alg1.equation.meaning', 'kp.alg1.solve.one.step'],
    successCriteria: L(
      'Student substitutes a candidate value into both sides of an equation and decides whether it is a true solution.',
      'El estudiante sustituye un valor candidato en ambos lados de una ecuación y decide si es una solución verdadera.',
      'Uczeń podstawia wartość kandydującą do obu stron równania i stwierdza, czy to prawdziwe rozwiązanie.',
    ),
    misconceptions: L(
      [
        'Checking only one side of the equation',
        'Accepting a value that makes sides unequal',
      ],
      [
        'Verificar solo un lado de la ecuación',
        'Aceptar un valor que hace lados desiguales',
      ],
      [
        'Sprawdzanie tylko jednej strony równania',
        'Akceptowanie wartości, która nie zrównuje stron',
      ],
    ),
    standards: [
      TX('A.5(A)', 'A.1(B)', 'A.1(D)'),
      CC('A-REI.A.1', 'A-REI.B.3', '6.EE.B.5'),
      CA('A-REI.1'),
    ],
  },
  {
    id: 'kp.alg1.inequality.meaning',
    title: L(
      'Interpret inequalities and number-line graphs',
      'Interpretar desigualdades y gráficas en la recta numérica',
      'Interpretacja nierówności i wykresów na osi liczbowej',
    ),
    prerequisites: ['kp.alg1.equation.meaning', 'kp.alg1.solve.one.step'],
    successCriteria: L(
      'Student reads inequality symbols, describes solution sets, and matches open/closed rays on a number line.',
      'El estudiante lee símbolos de desigualdad, describe conjuntos solución y relaciona rayos abiertos/cerrados en la recta.',
      'Uczeń odczytuje symbole nierówności, opisuje zbiory rozwiązań i dopasowuje półproste otwarte/domknięte na osi.',
    ),
    misconceptions: L(
      [
        'Using a closed circle for a strict inequality',
        'Thinking the inequality only allows a single number',
      ],
      [
        'Usar círculo cerrado para una desigualdad estricta',
        'Pensar que la desigualdad solo permite un solo número',
      ],
      [
        'Używanie zamkniętego kółka przy ostrej nierówności',
        'Myślenie, że nierówność dopuszcza tylko jedną liczbę',
      ],
    ),
    standards: [
      TX('A.5(B)', 'A.1(D)'),
      CC('A-REI.B.3', '6.EE.B.8'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.4'),
    ],
  },
  {
    id: 'kp.alg1.inequality.one.step',
    title: L(
      'Solve one-step linear inequalities',
      'Resolver desigualdades lineales de un paso',
      'Rozwiązywanie jednokrokowych nierówności liniowych',
    ),
    prerequisites: ['kp.alg1.inequality.meaning', 'kp.alg1.solve.one.step'],
    successCriteria: L(
      'Student isolates the variable in a one-step inequality using inverse operations and states the solution set.',
      'El estudiante aísla la variable en una desigualdad de un paso con operaciones inversas y expresa el conjunto solución.',
      'Uczeń izoluje zmienną w jednokrokowej nierówności działaniami odwrotnymi i podaje zbiór rozwiązań.',
    ),
    misconceptions: L(
      [
        'Replacing the inequality with an equals sign permanently',
        'Flipping the inequality when adding or subtracting',
      ],
      [
        'Reemplazar la desigualdad por igualdad de forma permanente',
        'Invertir la desigualdad al sumar o restar',
      ],
      [
        'Trwałe zastępowanie nierówności znakiem równości',
        'Odwracanie nierówności przy dodawaniu lub odejmowaniu',
      ],
    ),
    standards: [
      TX('A.5(B)', 'A.1(B)'),
      CC('A-REI.B.3', '7.EE.B.4b'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.4'),
    ],
  },
  {
    id: 'kp.alg1.inequality.two.step',
    title: L(
      'Solve two-step linear inequalities',
      'Resolver desigualdades lineales de dos pasos',
      'Rozwiązywanie dwukrokowych nierówności liniowych',
    ),
    prerequisites: ['kp.alg1.inequality.one.step', 'kp.alg1.solve.two.step'],
    encompassing: ['kp.alg1.inequality.one.step'],
    successCriteria: L(
      'Student solves ax+b < c (and similar) with two inverse operations, flipping when multiplying/dividing by a negative.',
      'El estudiante resuelve ax+b < c (y similares) con dos operaciones inversas, invirtiendo al multiplicar/dividir por un negativo.',
      'Uczeń rozwiązuje ax+b < c (i podobne) dwoma działaniami odwrotnymi, odwracając przy mnożeniu/dzieleniu przez ujemną.',
    ),
    misconceptions: L(
      [
        'Forgetting to flip when multiplying/dividing by a negative',
        'Undoing multiplication before addition/subtraction',
      ],
      [
        'Olvidar invertir al multiplicar/dividir por un negativo',
        'Deshacer la multiplicación antes que suma/resta',
      ],
      [
        'Zapominanie o odwróceniu przy mnożeniu/dzieleniu przez ujemną',
        'Cofanie mnożenia przed dodawaniem/odejmowaniem',
      ],
    ),
    standards: [
      TX('A.5(B)', 'A.1(B)', 'A.1(F)'),
      CC('A-REI.B.3', '7.EE.B.4b'),
      CA('A-REI.3'),
      FL('MA.912.AR.2.4'),
    ],
  },
  {
    id: 'kp.alg1.function.linear.intro',
    title: L(
      'Introduce linear functions',
      'Introducir funciones lineales',
      'Wprowadzenie do funkcji liniowych',
    ),
    prerequisites: ['kp.alg1.solve.two.step', 'kp.alg1.eval.substitute'],
    successCriteria: L(
      'Student recognizes that a linear function has a constant rate of change and relates inputs to outputs with a rule like y = mx + b.',
      'El estudiante reconoce que una función lineal tiene tasa de cambio constante y relaciona entradas con salidas con una regla como y = mx + b.',
      'Uczeń rozpoznaje, że funkcja liniowa ma stałą stopę zmian i łączy argumenty z wartościami regułą typu y = mx + b.',
    ),
    misconceptions: L(
      [
        'Thinking every equation in x and y is automatically linear',
        'Confusing a single ordered pair with the whole function',
      ],
      [
        'Pensar que toda ecuación en x e y es automáticamente lineal',
        'Confundir un solo par ordenado con toda la función',
      ],
      [
        'Myślenie, że każde równanie z x i y jest automatycznie liniowe',
        'Mylenie jednej pary uporządkowanej z całą funkcją',
      ],
    ),
    standards: [
      TX('A.2(A)', 'A.1(D)', 'A.12(B)'),
      CC('8.F.A.1', 'F-IF.A.1', 'F-LE.A.1b'),
      CA('F-IF.1'),
      FL('MA.912.F.1.1'),
    ],
  },
  {
    id: 'kp.alg1.rate.of.change',
    title: L(
      'Interpret rate of change',
      'Interpretar la tasa de cambio',
      'Interpretacja stopy zmian',
    ),
    prerequisites: ['kp.alg1.function.linear.intro'],
    successCriteria: L(
      'Student finds and interprets the constant rate of change from a table, context, or equation for a linear relationship.',
      'El estudiante halla e interpreta la tasa de cambio constante a partir de una tabla, contexto o ecuación lineal.',
      'Uczeń znajduje i interpretuje stałą stopę zmian z tabeli, kontekstu lub równania liniowego.',
    ),
    misconceptions: L(
      [
        'Using Δx/Δy instead of Δy/Δx',
        'Treating a changing difference between outputs as constant rate',
      ],
      [
        'Usar Δx/Δy en lugar de Δy/Δx',
        'Tratar una diferencia cambiante entre salidas como tasa constante',
      ],
      [
        'Używanie Δx/Δy zamiast Δy/Δx',
        'Traktowanie zmieniającej się różnicy wartości jako stałej stopy',
      ],
    ),
    standards: [
      TX('A.3(A)', 'A.1(A)', 'A.1(D)'),
      CC('8.F.B.4', 'F-IF.B.6', '8.EE.B.5'),
      CA('F-IF.6'),
      FL('MA.912.F.1.2'),
    ],
  },
  {
    id: 'kp.alg1.slope.intuition',
    title: L(
      'Build slope intuition (rise over run)',
      'Construir intuición de pendiente (subida sobre avance)',
      'Intuicja nachylenia (wzrost przez przebieg)',
    ),
    prerequisites: ['kp.alg1.rate.of.change'],
    encompassing: ['kp.alg1.rate.of.change'],
    successCriteria: L(
      'Student computes slope as rise/run (or Δy/Δx) between two points and describes steepness and direction (positive/negative).',
      'El estudiante calcula la pendiente como subida/avance (o Δy/Δx) entre dos puntos y describe inclinación y dirección (positiva/negativa).',
      'Uczeń oblicza nachylenie jako wzrost/przebieg (lub Δy/Δx) między dwoma punktami i opisuje stromość oraz kierunek (dodatni/ujemny).',
    ),
    misconceptions: L(
      [
        'Subtracting coordinates in inconsistent order (mixing x and y differences)',
        'Believing steeper always means larger absolute slope without checking signs',
      ],
      [
        'Restar coordenadas en orden inconsistente (mezclar diferencias de x e y)',
        'Creer que más empinado siempre significa mayor pendiente absoluta sin mirar signos',
      ],
      [
        'Odejmowanie współrzędnych w niespójnej kolejności (mieszanie różnic x i y)',
        'Sądzenie, że stromiej zawsze znaczy większa |nachylenie| bez znaków',
      ],
    ),
    standards: [
      TX('A.3(A)', 'A.3(B)', 'A.1(F)'),
      CC('8.EE.B.5', '8.F.B.4', 'F-IF.B.6'),
      CA('8.EE.5'),
      FL('MA.912.F.1.2'),
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

/* ─── Standards index merge helpers ─── */
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

addKpsToExisting('TX', 'A.5(A)', [
  'kp.alg1.solve.multi.step',
  'kp.alg1.solve.both.sides',
  'kp.alg1.equation.verify',
])
addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.solve.multi.step',
  'kp.alg1.solve.both.sides',
  'kp.alg1.equation.verify',
  'kp.alg1.inequality.one.step',
  'kp.alg1.inequality.two.step',
])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.equation.verify',
  'kp.alg1.inequality.meaning',
  'kp.alg1.function.linear.intro',
  'kp.alg1.rate.of.change',
])
addKpsToExisting('TX', 'A.1(F)', [
  'kp.alg1.solve.multi.step',
  'kp.alg1.inequality.two.step',
  'kp.alg1.slope.intuition',
])
addKpsToExisting('TX', 'A.1(A)', ['kp.alg1.rate.of.change'])
addKpsToExisting('TX', 'A.12(B)', ['kp.alg1.function.linear.intro'])

ensureCode(
  'TX',
  'A.5(B)',
  L(
    'Solve linear inequalities in one variable, including those for which the application of the distributive property is necessary and for which variables are included on both sides',
    'Resolver desigualdades lineales en una variable, incluidas las que requieren la propiedad distributiva y variables en ambos lados',
    'Rozwiązywać nierówności liniowe jednej zmiennej, także z rozdzielnością i zmiennymi po obu stronach',
  ),
  [
    'kp.alg1.inequality.meaning',
    'kp.alg1.inequality.one.step',
    'kp.alg1.inequality.two.step',
  ],
)
ensureCode(
  'TX',
  'A.2(A)',
  L(
    'Determine the domain and range of linear functions in mathematical and real-world situations',
    'Determinar el dominio y el rango de funciones lineales en situaciones matemáticas y del mundo real',
    'Określać dziedzinę i przeciwdziedzinę funkcji liniowych w sytuacjach matematycznych i rzeczywistych',
  ),
  ['kp.alg1.function.linear.intro'],
)
ensureCode(
  'TX',
  'A.3(A)',
  L(
    'Determine the slope of a line given a table of values, a graph, two points on the line, and an equation written in various forms',
    'Determinar la pendiente de una recta dada una tabla, una gráfica, dos puntos o una ecuación en varias formas',
    'Wyznaczać nachylenie prostej z tabeli, wykresu, dwóch punktów lub równania w różnych postaciach',
  ),
  ['kp.alg1.rate.of.change', 'kp.alg1.slope.intuition'],
)
ensureCode(
  'TX',
  'A.3(B)',
  L(
    'Calculate the rate of change of a linear function represented tabularly, graphically, or algebraically in context of mathematical and real-world problems',
    'Calcular la tasa de cambio de una función lineal representada en tabla, gráfica o algebraicamente en contexto',
    'Obliczać stopę zmian funkcji liniowej z tabeli, wykresu lub algebraicznie w kontekście',
  ),
  ['kp.alg1.slope.intuition', 'kp.alg1.rate.of.change'],
)

addKpsToExisting('CCSS', 'A-REI.A.1', [
  'kp.alg1.solve.multi.step',
  'kp.alg1.solve.both.sides',
  'kp.alg1.equation.verify',
])
addKpsToExisting('CCSS', 'A-REI.B.3', [
  'kp.alg1.solve.multi.step',
  'kp.alg1.solve.both.sides',
  'kp.alg1.equation.verify',
  'kp.alg1.inequality.meaning',
  'kp.alg1.inequality.one.step',
  'kp.alg1.inequality.two.step',
])
addKpsToExisting('CCSS', '6.EE.B.5', ['kp.alg1.equation.verify'])
addKpsToExisting('CCSS', '7.EE.B.4', ['kp.alg1.solve.multi.step'])

ensureCode(
  'CCSS',
  '6.EE.B.8',
  L(
    'Write an inequality to represent a constraint and graph on a number line',
    'Escribir una desigualdad que represente una restricción y graficarla en la recta',
    'Zapisywać nierówność jako ograniczenie i rysować na osi liczbowej',
  ),
  ['kp.alg1.inequality.meaning'],
)
ensureCode(
  'CCSS',
  '7.EE.B.4b',
  L(
    'Solve word problems leading to inequalities of the form px + q > r or px + q < r',
    'Resolver problemas que conduzcan a desigualdades de la forma px + q > r o px + q < r',
    'Rozwiązywać zadania prowadzące do nierówności postaci px + q > r lub px + q < r',
  ),
  ['kp.alg1.inequality.one.step', 'kp.alg1.inequality.two.step'],
)
ensureCode(
  'CCSS',
  '8.F.A.1',
  L(
    'Understand that a function assigns to each input exactly one output',
    'Comprender que una función asigna a cada entrada exactamente una salida',
    'Rozumieć, że funkcja przypisuje każdemu argumentowi dokładnie jedną wartość',
  ),
  ['kp.alg1.function.linear.intro'],
)
ensureCode(
  'CCSS',
  'F-IF.A.1',
  L(
    'Understand that a function from one set to another assigns each element of the domain to exactly one element of the range',
    'Comprender que una función de un conjunto a otro asigna cada elemento del dominio a exactamente un elemento del rango',
    'Rozumieć, że funkcja ze zbioru w zbiór przypisuje każdemu elementowi dziedziny dokładnie jeden element przeciwdziedziny',
  ),
  ['kp.alg1.function.linear.intro'],
)
ensureCode(
  'CCSS',
  'F-LE.A.1b',
  L(
    'Recognize situations in which one quantity changes at a constant rate relative to another',
    'Reconocer situaciones en las que una cantidad cambia a tasa constante respecto a otra',
    'Rozpoznawać sytuacje, w których jedna wielkość zmienia się ze stałą stopą względem drugiej',
  ),
  ['kp.alg1.function.linear.intro', 'kp.alg1.rate.of.change'],
)
ensureCode(
  'CCSS',
  '8.F.B.4',
  L(
    'Construct a function to model a linear relationship between two quantities',
    'Construir una función que modele una relación lineal entre dos cantidades',
    'Konstruować funkcję modelującą zależność liniową dwóch wielkości',
  ),
  ['kp.alg1.rate.of.change', 'kp.alg1.slope.intuition'],
)
ensureCode(
  'CCSS',
  'F-IF.B.6',
  L(
    'Calculate and interpret the average rate of change of a function over a specified interval',
    'Calcular e interpretar la tasa media de cambio de una función en un intervalo',
    'Obliczać i interpretować średnią stopę zmian funkcji na przedziale',
  ),
  ['kp.alg1.rate.of.change', 'kp.alg1.slope.intuition'],
)
ensureCode(
  'CCSS',
  '8.EE.B.5',
  L(
    'Graph proportional relationships, interpreting the unit rate as the slope of the graph',
    'Graficar relaciones proporcionales, interpretando la tasa unitaria como la pendiente',
    'Rysować zależności proporcjonalne, interpretując stopę jednostkową jako nachylenie',
  ),
  ['kp.alg1.rate.of.change', 'kp.alg1.slope.intuition'],
)

existingStd.lessonCoverage['alg1-l04'] = [
  'A.5(A)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-REI.A.1',
  'A-REI.B.3',
  '6.EE.B.5',
  '7.EE.B.4',
]
existingStd.lessonCoverage['alg1-l05'] = [
  'A.5(B)',
  'A.1(B)',
  'A.1(D)',
  'A.1(F)',
  'A-REI.B.3',
  '6.EE.B.8',
  '7.EE.B.4b',
]
existingStd.lessonCoverage['alg1-l06'] = [
  'A.2(A)',
  'A.3(A)',
  'A.3(B)',
  'A.1(A)',
  'A.1(D)',
  'A.12(B)',
  '8.F.A.1',
  'F-IF.A.1',
  'F-LE.A.1b',
  '8.F.B.4',
  'F-IF.B.6',
  '8.EE.B.5',
]

/* ─── Shared standards refs for items ─── */
const l4Multi = [TX('A.5(A)', 'A.1(B)', 'A.1(F)'), CC('A-REI.B.3', 'A-REI.A.1', '7.EE.B.4')]
const l4Both = [TX('A.5(A)', 'A.1(B)'), CC('A-REI.B.3', 'A-REI.A.1')]
const l4Verify = [TX('A.5(A)', 'A.1(B)', 'A.1(D)'), CC('A-REI.A.1', 'A-REI.B.3', '6.EE.B.5')]

const l5Mean = [TX('A.5(B)', 'A.1(D)'), CC('A-REI.B.3', '6.EE.B.8')]
const l5One = [TX('A.5(B)', 'A.1(B)'), CC('A-REI.B.3', '7.EE.B.4b')]
const l5Two = [TX('A.5(B)', 'A.1(B)', 'A.1(F)'), CC('A-REI.B.3', '7.EE.B.4b')]

const l6Fn = [TX('A.2(A)', 'A.1(D)', 'A.12(B)'), CC('8.F.A.1', 'F-IF.A.1', 'F-LE.A.1b')]
const l6Rate = [TX('A.3(A)', 'A.1(A)', 'A.1(D)'), CC('8.F.B.4', 'F-IF.B.6', '8.EE.B.5')]
const l6Slope = [TX('A.3(A)', 'A.3(B)', 'A.1(F)'), CC('8.EE.B.5', '8.F.B.4', 'F-IF.B.6')]

const mcYesNo = (yesIdx) => ({
  choices: L(
    ['Yes', 'No', 'Only sometimes', 'Cannot tell'],
    ['Sí', 'No', 'Solo a veces', 'No se puede saber'],
    ['Tak', 'Nie', 'Tylko czasem', 'Nie da się stwierdzić'],
  ),
  correctIndex: yesIdx,
})

/* ═══════════════ LESSON 4 ═══════════════ */
const lesson04Items = [
  item({
    id: 'alg1-l04-t01',
    knowledgePointIds: ['kp.alg1.solve.multi.step'],
    difficulty: 0.35,
    irt: { a: 1.05, b: -0.8, c: 0.2 },
    prompt: L(
      'Solve: 3(x + 2) = 18',
      'Resuelve: 3(x + 2) = 18',
      'Rozwiąż: 3(x + 2) = 18',
    ),
    promptMath: '3(x + 2) = 18',
    choices: L(
      ['x = 4', 'x = 6', 'x = 5', 'x = 3'],
      ['x = 4', 'x = 6', 'x = 5', 'x = 3'],
      ['x = 4', 'x = 6', 'x = 5', 'x = 3'],
    ),
    correctIndex: 0,
    correctLatex: 'x=4',
    acceptNumeric: 4,
    feedbackCorrect: L(
      'Distribute: 3x + 6 = 18 → 3x = 12 → x = 4. Check: 3(6) = 18.',
      'Distribuye: 3x + 6 = 18 → 3x = 12 → x = 4. Verifica: 3(6) = 18.',
      'Rozdziel: 3x + 6 = 18 → 3x = 12 → x = 4. Sprawdź: 3(6) = 18.',
    ),
    feedbackIncorrect: L(
      'Distribute first: 3x + 6 = 18, then subtract 6 and divide by 3 → x = 4.',
      'Primero distribuye: 3x + 6 = 18, luego resta 6 y divide entre 3 → x = 4.',
      'Najpierw rozdziel: 3x + 6 = 18, potem odejmij 6 i podziel przez 3 → x = 4.',
    ),
    diagnosticTags: ['forgot_distribute', 'divide_before_subtract'],
    standards: l4Multi,
  }),
  item({
    id: 'alg1-l04-t02',
    knowledgePointIds: ['kp.alg1.equation.verify'],
    difficulty: 0.3,
    irt: { a: 1.0, b: -1.0, c: 0.2 },
    prompt: L(
      'Is x = 2 a solution of 5x − 1 = 9?',
      '¿Es x = 2 una solución de 5x − 1 = 9?',
      'Czy x = 2 jest rozwiązaniem 5x − 1 = 9?',
    ),
    promptMath: '5x - 1 = 9',
    ...mcYesNo(0),
    feedbackCorrect: L(
      '5(2) − 1 = 9, which matches the right side — yes.',
      '5(2) − 1 = 9, igual al lado derecho — sí.',
      '5(2) − 1 = 9, zgadza się z prawą stroną — tak.',
    ),
    feedbackIncorrect: L(
      'Substitute: 5 · 2 − 1 = 9. Both sides equal, so it is a solution.',
      'Sustituye: 5 · 2 − 1 = 9. Ambos lados son iguales, así que es solución.',
      'Podstaw: 5 · 2 − 1 = 9. Strony są równe, więc to rozwiązanie.',
    ),
    diagnosticTags: ['check_arithmetic_error', 'one_side_only'],
    standards: l4Verify,
  }),
  item({
    id: 'alg1-l04-g01',
    knowledgePointIds: ['kp.alg1.solve.multi.step'],
    difficulty: 0.4,
    irt: { a: 1.1, b: -0.4, c: 0.2 },
    prompt: L(
      'Solve: 2x + 3x − 5 = 15',
      'Resuelve: 2x + 3x − 5 = 15',
      'Rozwiąż: 2x + 3x − 5 = 15',
    ),
    promptMath: '2x + 3x - 5 = 15',
    choices: L(
      ['x = 4', 'x = 2', 'x = 5', 'x = 10'],
      ['x = 4', 'x = 2', 'x = 5', 'x = 10'],
      ['x = 4', 'x = 2', 'x = 5', 'x = 10'],
    ),
    correctIndex: 0,
    correctLatex: 'x=4',
    acceptNumeric: 4,
    feedbackCorrect: L(
      'Combine: 5x − 5 = 15 → 5x = 20 → x = 4.',
      'Combina: 5x − 5 = 15 → 5x = 20 → x = 4.',
      'Połącz: 5x − 5 = 15 → 5x = 20 → x = 4.',
    ),
    feedbackIncorrect: L(
      'Combine like terms first (2x + 3x = 5x), then add 5 and divide by 5 → x = 4.',
      'Primero combina términos semejantes (2x + 3x = 5x), luego suma 5 y divide entre 5 → x = 4.',
      'Najpierw połącz wyrazy podobne (2x + 3x = 5x), potem dodaj 5 i podziel przez 5 → x = 4.',
    ),
    diagnosticTags: ['unlike_terms', 'skip_combine'],
    standards: l4Multi,
  }),
  item({
    id: 'alg1-l04-g02',
    knowledgePointIds: ['kp.alg1.solve.multi.step'],
    difficulty: 0.45,
    irt: { a: 1.15, b: -0.2, c: 0.2 },
    prompt: L(
      'Solve: 4(x − 1) + 2 = 14',
      'Resuelve: 4(x − 1) + 2 = 14',
      'Rozwiąż: 4(x − 1) + 2 = 14',
    ),
    promptMath: '4(x - 1) + 2 = 14',
    choices: L(
      ['x = 4', 'x = 3', 'x = 5', 'x = 2'],
      ['x = 4', 'x = 3', 'x = 5', 'x = 2'],
      ['x = 4', 'x = 3', 'x = 5', 'x = 2'],
    ),
    correctIndex: 0,
    correctLatex: 'x=4',
    acceptNumeric: 4,
    feedbackCorrect: L(
      '4x − 4 + 2 = 14 → 4x − 2 = 14 → 4x = 16 → x = 4.',
      '4x − 4 + 2 = 14 → 4x − 2 = 14 → 4x = 16 → x = 4.',
      '4x − 4 + 2 = 14 → 4x − 2 = 14 → 4x = 16 → x = 4.',
    ),
    feedbackIncorrect: L(
      'Distribute: 4x − 4 + 2 = 14. Simplify to 4x − 2 = 14, then solve → x = 4.',
      'Distribuye: 4x − 4 + 2 = 14. Simplifica a 4x − 2 = 14, luego resuelve → x = 4.',
      'Rozdziel: 4x − 4 + 2 = 14. Uprość do 4x − 2 = 14, potem rozwiąż → x = 4.',
    ),
    diagnosticTags: ['forgot_distribute', 'combine_error'],
    standards: l4Multi,
  }),
  item({
    id: 'alg1-l04-g03',
    knowledgePointIds: ['kp.alg1.solve.both.sides'],
    difficulty: 0.5,
    irt: { a: 1.2, b: 0.0, c: 0.2 },
    prompt: L(
      'Solve: 5x = 2x + 12',
      'Resuelve: 5x = 2x + 12',
      'Rozwiąż: 5x = 2x + 12',
    ),
    promptMath: '5x = 2x + 12',
    choices: L(
      ['x = 4', 'x = 6', 'x = 2', 'x = 12'],
      ['x = 4', 'x = 6', 'x = 2', 'x = 12'],
      ['x = 4', 'x = 6', 'x = 2', 'x = 12'],
    ),
    correctIndex: 0,
    correctLatex: 'x=4',
    acceptNumeric: 4,
    feedbackCorrect: L(
      'Subtract 2x: 3x = 12 → x = 4. Check: 20 = 8 + 12.',
      'Resta 2x: 3x = 12 → x = 4. Verifica: 20 = 8 + 12.',
      'Odejmij 2x: 3x = 12 → x = 4. Sprawdź: 20 = 8 + 12.',
    ),
    feedbackIncorrect: L(
      'Collect x-terms: subtract 2x from both sides → 3x = 12 → x = 4.',
      'Reúne términos en x: resta 2x de ambos lados → 3x = 12 → x = 4.',
      'Zbierz wyrazy z x: odejmij 2x od obu stron → 3x = 12 → x = 4.',
    ),
    diagnosticTags: ['one_side_only', 'wrong_collect'],
    standards: l4Both,
  }),
  item({
    id: 'alg1-l04-g04',
    knowledgePointIds: ['kp.alg1.equation.verify'],
    difficulty: 0.45,
    irt: { a: 1.1, b: -0.1, c: 0.2 },
    prompt: L(
      'Does x = 3 solve 2(x + 1) = 3x − 1?',
      '¿Resuelve x = 3 la ecuación 2(x + 1) = 3x − 1?',
      'Czy x = 3 spełnia 2(x + 1) = 3x − 1?',
    ),
    promptMath: '2(x + 1) = 3x - 1',
    ...mcYesNo(1),
    feedbackCorrect: L(
      'Left: 2(4) = 8. Right: 9 − 1 = 8. Wait — both equal 8, so yes… Correct: 2(3+1)=8 and 3(3)−1=8 — Yes it does. (If you chose No, re-check arithmetic.)',
      'Izquierda: 2(4) = 8. Derecha: 9 − 1 = 8. Sí es solución.',
      'Lewa: 2(4) = 8. Prawa: 9 − 1 = 8. Tak, to rozwiązanie.',
    ),
    feedbackIncorrect: L(
      'Substitute carefully: 2(3+1)=8 and 3·3−1=8. Sides match — it IS a solution.',
      'Sustituye con cuidado: 2(3+1)=8 y 3·3−1=8. Los lados coinciden — SÍ es solución.',
      'Podstaw starannie: 2(3+1)=8 i 3·3−1=8. Strony się zgadzają — TO jest rozwiązanie.',
    ),
    diagnosticTags: ['check_arithmetic_error'],
    standards: l4Verify,
  }),
]

// Fix g04 - I made a mistake: correct answer should be Yes (index 0), not No.
// Let me recalculate: 2(3+1)=8, 3*3-1=8, yes equal. So correctIndex should be 0.
lesson04Items[lesson04Items.length - 1] = item({
  id: 'alg1-l04-g04',
  knowledgePointIds: ['kp.alg1.equation.verify'],
  difficulty: 0.45,
  irt: { a: 1.1, b: -0.1, c: 0.2 },
  prompt: L(
    'Does x = 3 solve 2(x + 1) = 3x − 1?',
    '¿Resuelve x = 3 la ecuación 2(x + 1) = 3x − 1?',
    'Czy x = 3 spełnia 2(x + 1) = 3x − 1?',
  ),
  promptMath: '2(x + 1) = 3x - 1',
  ...mcYesNo(0),
  feedbackCorrect: L(
    'Left: 2(4) = 8. Right: 9 − 1 = 8. Both sides match — yes.',
    'Izquierda: 2(4) = 8. Derecha: 9 − 1 = 8. Ambos lados coinciden — sí.',
    'Lewa: 2(4) = 8. Prawa: 9 − 1 = 8. Strony się zgadzają — tak.',
  ),
  feedbackIncorrect: L(
    'Substitute: 2(3+1)=8 and 3·3−1=8. Sides match, so it is a solution.',
    'Sustituye: 2(3+1)=8 y 3·3−1=8. Los lados coinciden, así que es solución.',
    'Podstaw: 2(3+1)=8 i 3·3−1=8. Strony się zgadzają, więc to rozwiązanie.',
  ),
  diagnosticTags: ['check_arithmetic_error'],
  standards: l4Verify,
})

lesson04Items.push(
  item({
    id: 'alg1-l04-g05',
    knowledgePointIds: ['kp.alg1.solve.both.sides'],
    difficulty: 0.55,
    irt: { a: 1.25, b: 0.2, c: 0.2 },
    prompt: L(
      'Solve: 3x + 7 = 2x + 12',
      'Resuelve: 3x + 7 = 2x + 12',
      'Rozwiąż: 3x + 7 = 2x + 12',
    ),
    promptMath: '3x + 7 = 2x + 12',
    choices: L(
      ['x = 5', 'x = 19', 'x = −5', 'x = 12'],
      ['x = 5', 'x = 19', 'x = −5', 'x = 12'],
      ['x = 5', 'x = 19', 'x = −5', 'x = 12'],
    ),
    correctIndex: 0,
    correctLatex: 'x=5',
    acceptNumeric: 5,
    feedbackCorrect: L(
      'Subtract 2x: x + 7 = 12 → x = 5. Check: 15 + 7 = 10 + 12.',
      'Resta 2x: x + 7 = 12 → x = 5. Verifica: 15 + 7 = 10 + 12.',
      'Odejmij 2x: x + 7 = 12 → x = 5. Sprawdź: 15 + 7 = 10 + 12.',
    ),
    feedbackIncorrect: L(
      'Subtract 2x from both sides → x + 7 = 12 → x = 5.',
      'Resta 2x de ambos lados → x + 7 = 12 → x = 5.',
      'Odejmij 2x od obu stron → x + 7 = 12 → x = 5.',
    ),
    diagnosticTags: ['wrong_collect', 'add_instead_of_subtract'],
    standards: l4Both,
  }),
)

const l4Independent = [
  ['i01', 'kp.alg1.solve.multi.step', 0.5, -0.1, 'Solve: 2(x + 5) = 16', '2(x + 5) = 16', ['x = 3', 'x = 8', 'x = 5', 'x = 11'], 0, 3, 'Distribute: 2x + 10 = 16 → 2x = 6 → x = 3.', '2x + 10 = 16; subtract 10, divide by 2 → x = 3.', ['forgot_distribute'], l4Multi],
  ['i02', 'kp.alg1.solve.multi.step', 0.55, 0.1, 'Solve: 6x − 2x + 4 = 20', '6x - 2x + 4 = 20', ['x = 4', 'x = 3', 'x = 6', 'x = 2'], 0, 4, 'Combine: 4x + 4 = 20 → 4x = 16 → x = 4.', 'Combine 6x − 2x = 4x, then solve → x = 4.', ['skip_combine'], l4Multi],
  ['i03', 'kp.alg1.solve.multi.step', 0.55, 0.15, 'Solve: 5(x − 2) − 3 = 12', '5(x - 2) - 3 = 12', ['x = 5', 'x = 3', 'x = 4', 'x = 7'], 0, 5, '5x − 10 − 3 = 12 → 5x − 13 = 12 → 5x = 25 → x = 5.', 'Distribute and combine constants, then isolate x → x = 5.', ['forgot_distribute', 'combine_error'], l4Multi],
  ['i04', 'kp.alg1.solve.both.sides', 0.6, 0.25, 'Solve: 7x − 3 = 4x + 9', '7x - 3 = 4x + 9', ['x = 4', 'x = 2', 'x = 6', 'x = 3'], 0, 4, 'Subtract 4x: 3x − 3 = 9 → 3x = 12 → x = 4.', 'Move variable terms: subtract 4x, then add 3 → x = 4.', ['wrong_collect'], l4Both],
  ['i05', 'kp.alg1.solve.both.sides', 0.6, 0.3, 'Solve: 2x + 8 = 5x − 4', '2x + 8 = 5x - 4', ['x = 4', 'x = −4', 'x = 2', 'x = 12'], 0, 4, 'Subtract 2x: 8 = 3x − 4 → 12 = 3x → x = 4.', 'Collect x on the right (or left); then solve → x = 4.', ['wrong_collect', 'sign_error'], l4Both],
  ['i06', 'kp.alg1.equation.verify', 0.5, 0.0, 'Is x = −1 a solution of 3x + 5 = 2?', '3x + 5 = 2', null, 0, null, '3(−1) + 5 = 2, which equals the right side — yes.', 'Substitute: −3 + 5 = 2. It checks — yes.', ['check_arithmetic_error'], l4Verify, true],
  ['i07', 'kp.alg1.equation.verify', 0.55, 0.2, 'Is x = 6 a solution of 4x = 2x + 10?', '4x = 2x + 10', null, 1, null, 'Left 24; right 12 + 10 = 22. Not equal — no.', '4·6 = 24 but 2·6 + 10 = 22. Not a solution.', ['guess_without_check'], l4Verify, true],
  ['i08', 'kp.alg1.solve.multi.step', 0.65, 0.4, 'Solve: 3(2x − 1) = 15', '3(2x - 1) = 15', ['x = 3', 'x = 2', 'x = 4', 'x = 6'], 0, 3, '6x − 3 = 15 → 6x = 18 → x = 3.', 'Distribute: 6x − 3 = 15, add 3, divide by 6 → x = 3.', ['forgot_distribute'], l4Multi],
  ['i09', 'kp.alg1.solve.both.sides', 0.65, 0.45, 'Solve: 4(x + 1) = 2x + 14', '4(x + 1) = 2x + 14', ['x = 5', 'x = 3', 'x = 7', 'x = 2'], 0, 5, '4x + 4 = 2x + 14 → 2x = 10 → x = 5.', 'Distribute, then subtract 2x and subtract 4 → x = 5.', ['forgot_distribute', 'wrong_collect'], l4Both],
  ['i10', 'kp.alg1.solve.multi.step', 0.6, 0.35, 'Solve: x/2 + 3 = 7', '\\\\frac{x}{2} + 3 = 7', ['x = 8', 'x = 10', 'x = 4', 'x = 14'], 0, 8, 'Subtract 3: x/2 = 4 → x = 8.', 'Undo +3 first, then multiply by 2 → x = 8.', ['divide_before_subtract', 'wrong_inverse'], l4Multi],
]

for (const row of l4Independent) {
  const [sid, kp, diff, b, enPrompt, math, choices, correctIndex, num, fcEn, fiEn, tags, stds, yesNo] = row
  const esPrompt = enPrompt
    .replace('Solve:', 'Resuelve:')
    .replace('Is x = −1 a solution of', '¿Es x = −1 una solución de')
    .replace('Is x = 6 a solution of', '¿Es x = 6 una solución de')
  const plPrompt = enPrompt
    .replace('Solve:', 'Rozwiąż:')
    .replace('Is x = −1 a solution of', 'Czy x = −1 jest rozwiązaniem')
    .replace('Is x = 6 a solution of', 'Czy x = 6 jest rozwiązaniem')
  const base = {
    id: `alg1-l04-${sid}`,
    knowledgePointIds: [kp],
    difficulty: diff,
    irt: { a: 1.15 + Math.max(0, b) * 0.2, b, c: 0.2 },
    prompt: L(enPrompt, esPrompt, plPrompt),
    promptMath: math,
    feedbackCorrect: L(fcEn, fcEn, fcEn), // filled properly below
    feedbackIncorrect: L(fiEn, fiEn, fiEn),
    diagnosticTags: tags,
    standards: stds,
  }
  // Proper localized feedback for independent — use English structure with ES/PL variants
  const fc = {
    i01: L('Distribute: 2x + 10 = 16 → 2x = 6 → x = 3.', 'Distribuye: 2x + 10 = 16 → 2x = 6 → x = 3.', 'Rozdziel: 2x + 10 = 16 → 2x = 6 → x = 3.'),
    i02: L('Combine: 4x + 4 = 20 → 4x = 16 → x = 4.', 'Combina: 4x + 4 = 20 → 4x = 16 → x = 4.', 'Połącz: 4x + 4 = 20 → 4x = 16 → x = 4.'),
    i03: L('5x − 10 − 3 = 12 → 5x − 13 = 12 → 5x = 25 → x = 5.', '5x − 10 − 3 = 12 → 5x − 13 = 12 → 5x = 25 → x = 5.', '5x − 10 − 3 = 12 → 5x − 13 = 12 → 5x = 25 → x = 5.'),
    i04: L('Subtract 4x: 3x − 3 = 9 → 3x = 12 → x = 4.', 'Resta 4x: 3x − 3 = 9 → 3x = 12 → x = 4.', 'Odejmij 4x: 3x − 3 = 9 → 3x = 12 → x = 4.'),
    i05: L('Subtract 2x: 8 = 3x − 4 → 12 = 3x → x = 4.', 'Resta 2x: 8 = 3x − 4 → 12 = 3x → x = 4.', 'Odejmij 2x: 8 = 3x − 4 → 12 = 3x → x = 4.'),
    i06: L('3(−1) + 5 = 2 — yes, it is a solution.', '3(−1) + 5 = 2 — sí, es solución.', '3(−1) + 5 = 2 — tak, to rozwiązanie.'),
    i07: L('4·6 = 24 but 2·6 + 10 = 22 — not a solution.', '4·6 = 24 pero 2·6 + 10 = 22 — no es solución.', '4·6 = 24, ale 2·6 + 10 = 22 — to nie rozwiązanie.'),
    i08: L('6x − 3 = 15 → 6x = 18 → x = 3.', '6x − 3 = 15 → 6x = 18 → x = 3.', '6x − 3 = 15 → 6x = 18 → x = 3.'),
    i09: L('4x + 4 = 2x + 14 → 2x = 10 → x = 5.', '4x + 4 = 2x + 14 → 2x = 10 → x = 5.', '4x + 4 = 2x + 14 → 2x = 10 → x = 5.'),
    i10: L('Subtract 3: x/2 = 4 → x = 8.', 'Resta 3: x/2 = 4 → x = 8.', 'Odejmij 3: x/2 = 4 → x = 8.'),
  }
  const fi = {
    i01: L('Distribute first, then isolate x → x = 3.', 'Primero distribuye, luego aísla x → x = 3.', 'Najpierw rozdziel, potem izoluj x → x = 3.'),
    i02: L('Combine like terms (6x − 2x), then solve → x = 4.', 'Combina términos semejantes (6x − 2x), luego resuelve → x = 4.', 'Połącz wyrazy podobne (6x − 2x), potem rozwiąż → x = 4.'),
    i03: L('Distribute, combine −10 − 3, then solve → x = 5.', 'Distribuye, combina −10 − 3, luego resuelve → x = 5.', 'Rozdziel, połącz −10 − 3, potem rozwiąż → x = 5.'),
    i04: L('Subtract 4x from both sides, then add 3 → x = 4.', 'Resta 4x de ambos lados, luego suma 3 → x = 4.', 'Odejmij 4x od obu stron, potem dodaj 3 → x = 4.'),
    i05: L('Collect variable terms, then constants → x = 4.', 'Reúne términos con variable, luego constantes → x = 4.', 'Zbierz wyrazy ze zmienną, potem stałe → x = 4.'),
    i06: L('Substitute carefully: −3 + 5 = 2. It checks.', 'Sustituye con cuidado: −3 + 5 = 2. Se verifica.', 'Podstaw starannie: −3 + 5 = 2. Sprawdza się.'),
    i07: L('Check both sides: 24 ≠ 22, so x = 6 fails.', 'Verifica ambos lados: 24 ≠ 22, así que x = 6 falla.', 'Sprawdź obie strony: 24 ≠ 22, więc x = 6 odpada.'),
    i08: L('Distribute to get 6x − 3 = 15, then solve → x = 3.', 'Distribuye para obtener 6x − 3 = 15, luego resuelve → x = 3.', 'Rozdziel, by uzyskać 6x − 3 = 15, potem rozwiąż → x = 3.'),
    i09: L('Distribute, then get variables on one side → x = 5.', 'Distribuye, luego lleva variables a un lado → x = 5.', 'Rozdziel, potem przenieś zmienne na jedną stronę → x = 5.'),
    i10: L('Undo +3 first, then multiply by 2 → x = 8.', 'Deshaz +3 primero, luego multiplica por 2 → x = 8.', 'Najpierw cofnij +3, potem pomnóż przez 2 → x = 8.'),
  }
  const partial = {
    ...base,
    feedbackCorrect: fc[sid],
    feedbackIncorrect: fi[sid],
  }
  if (yesNo) {
    Object.assign(partial, mcYesNo(correctIndex))
  } else {
    partial.choices = L(choices, choices, choices)
    partial.correctIndex = correctIndex
    partial.correctLatex = `x=${num}`
    partial.acceptNumeric = num
  }
  lesson04Items.push(item(partial))
}

const lesson04 = {
  id: 'alg1-l04',
  courseId: 'algebra1',
  order: 4,
  title: L(
    'Multi-Step Equations — Distribute, Combine & Check',
    'Ecuaciones de varios pasos — distribuir, combinar y verificar',
    'Równania wielokrokowe — rozdzielność, łączenie i sprawdzanie',
  ),
  knowledgePointIds: [
    'kp.alg1.solve.multi.step',
    'kp.alg1.solve.both.sides',
    'kp.alg1.equation.verify',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_4', unlockOnMastery: ['lesson_board_5'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will solve multi-step linear equations (combine like terms, distribute), handle variables on both sides, and verify solutions by substitution.',
        'Resolverás ecuaciones lineales de varios pasos (combinar términos, distribuir), con variables en ambos lados, y verificarás por sustitución.',
        'Będziesz rozwiązywać wielokrokowe równania liniowe (łączenie wyrazów, rozdzielność), ze zmiennymi po obu stronach, i weryfikować przez podstawienie.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: simplify, then balance', 'Enseñar: simplificar, luego equilibrar', 'Nauczanie: uprość, potem zrównoważ'),
      body: L(
        'Simplify each side first (distribute, combine like terms). Keep the balance with inverse operations. When variables appear on both sides, collect them on one side, then solve. Always check by substituting back.',
        'Simplifica cada lado primero (distribuye, combina términos). Mantén el equilibrio con operaciones inversas. Si hay variables en ambos lados, reúnelas en uno y resuelve. Siempre verifica sustituyendo.',
        'Najpierw uprość każdą stronę (rozdzielność, wyrazy podobne). Zachowaj równowagę działaniami odwrotnymi. Gdy zmienne są po obu stronach, zbierz je po jednej i rozwiąż. Zawsze sprawdź podstawiając.',
      ),
      bodyMath: ['3(x + 2) = 18', '5x = 2x + 12', '3x + 7 = 2x + 12'],
      itemIds: ['alg1-l04-t01', 'alg1-l04-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Practice distributing, combining, collecting variable terms, and checking candidate solutions.',
        'Practica distribuir, combinar, reunir términos con variable y verificar soluciones candidatas.',
        'Ćwicz rozdzielność, łączenie, zbieranie wyrazów ze zmienną i sprawdzanie rozwiązań kandydujących.',
      ),
      itemIds: ['alg1-l04-g01', 'alg1-l04-g02', 'alg1-l04-g03', 'alg1-l04-g04', 'alg1-l04-g05'],
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
        'alg1-l04-i01',
        'alg1-l04-i02',
        'alg1-l04-i03',
        'alg1-l04-i04',
        'alg1-l04-i05',
        'alg1-l04-i06',
        'alg1-l04-i07',
        'alg1-l04-i08',
        'alg1-l04-i09',
        'alg1-l04-i10',
      ],
    },
  ],
  items: lesson04Items,
}

/* ═══════════════ LESSON 5 ═══════════════ */
const lesson05Items = [
  item({
    id: 'alg1-l05-t01',
    knowledgePointIds: ['kp.alg1.inequality.meaning'],
    difficulty: 0.3,
    irt: { a: 1.0, b: -1.0, c: 0.2 },
    prompt: L(
      'What does x > 3 mean on a number line?',
      '¿Qué significa x > 3 en la recta numérica?',
      'Co oznacza x > 3 na osi liczbowej?',
    ),
    promptMath: 'x > 3',
    choices: L(
      [
        'Open circle at 3, ray to the right',
        'Closed circle at 3, ray to the right',
        'Open circle at 3, ray to the left',
        'Only the point 3',
      ],
      [
        'Círculo abierto en 3, rayo a la derecha',
        'Círculo cerrado en 3, rayo a la derecha',
        'Círculo abierto en 3, rayo a la izquierda',
        'Solo el punto 3',
      ],
      [
        'Otwarte kółko w 3, półprosta w prawo',
        'Zamknięte kółko w 3, półprosta w prawo',
        'Otwarte kółko w 3, półprosta w lewo',
        'Tylko punkt 3',
      ],
    ),
    correctIndex: 0,
    feedbackCorrect: L(
      'Strict > excludes 3 (open circle) and includes all greater values (ray right).',
      'El > estricto excluye 3 (círculo abierto) e incluye valores mayores (rayo a la derecha).',
      'Ostre > wyklucza 3 (otwarte kółko) i obejmuje większe wartości (półprosta w prawo).',
    ),
    feedbackIncorrect: L(
      'Use an open circle for > or <, and shade toward larger numbers for >.',
      'Usa círculo abierto para > o <, y sombrea hacia números mayores para >.',
      'Użyj otwartego kółka dla > lub <, i zacieniaj w stronę większych liczb dla >.',
    ),
    diagnosticTags: ['closed_for_strict', 'wrong_ray_direction'],
    standards: l5Mean,
  }),
  item({
    id: 'alg1-l05-t02',
    knowledgePointIds: ['kp.alg1.inequality.one.step'],
    difficulty: 0.35,
    irt: { a: 1.05, b: -0.8, c: 0.2 },
    prompt: L(
      'Solve: x + 4 ≤ 10',
      'Resuelve: x + 4 ≤ 10',
      'Rozwiąż: x + 4 ≤ 10',
    ),
    promptMath: 'x + 4 \\le 10',
    choices: L(
      ['x ≤ 6', 'x ≥ 6', 'x ≤ 14', 'x = 6'],
      ['x ≤ 6', 'x ≥ 6', 'x ≤ 14', 'x = 6'],
      ['x ≤ 6', 'x ≥ 6', 'x ≤ 14', 'x = 6'],
    ),
    correctIndex: 0,
    correctLatex: 'x\\le 6',
    feedbackCorrect: L(
      'Subtract 4 from both sides: x ≤ 6. Closed ray left of 6 (includes 6).',
      'Resta 4 a ambos lados: x ≤ 6. Rayo cerrado a la izquierda de 6 (incluye 6).',
      'Odejmij 4 od obu stron: x ≤ 6. Domknięta półprosta w lewo od 6 (z 6).',
    ),
    feedbackIncorrect: L(
      'Undo +4 by subtracting 4; keep ≤ (adding/subtracting does not flip).',
      'Deshaz +4 restando 4; conserva ≤ (sumar/restar no invierte).',
      'Cofnij +4 odejmując 4; zachowaj ≤ (dodawanie/odejmowanie nie odwraca).',
    ),
    diagnosticTags: ['flip_on_add', 'replace_with_equals'],
    standards: l5One,
  }),
  item({
    id: 'alg1-l05-g01',
    knowledgePointIds: ['kp.alg1.inequality.meaning'],
    difficulty: 0.4,
    irt: { a: 1.1, b: -0.4, c: 0.2 },
    prompt: L(
      'Which graph matches x ≤ −2?',
      '¿Qué gráfica corresponde a x ≤ −2?',
      'Który wykres odpowiada x ≤ −2?',
    ),
    promptMath: 'x \\le -2',
    choices: L(
      [
        'Closed circle at −2, ray left',
        'Open circle at −2, ray left',
        'Closed circle at −2, ray right',
        'Open circle at 2, ray left',
      ],
      [
        'Círculo cerrado en −2, rayo izquierda',
        'Círculo abierto en −2, rayo izquierda',
        'Círculo cerrado en −2, rayo derecha',
        'Círculo abierto en 2, rayo izquierda',
      ],
      [
        'Zamknięte kółko w −2, półprosta w lewo',
        'Otwarte kółko w −2, półprosta w lewo',
        'Zamknięte kółko w −2, półprosta w prawo',
        'Otwarte kółko w 2, półprosta w lewo',
      ],
    ),
    correctIndex: 0,
    feedbackCorrect: L(
      '≤ includes the endpoint (closed) and goes toward smaller numbers (left).',
      '≤ incluye el extremo (cerrado) y va hacia números menores (izquierda).',
      '≤ obejmuje koniec (domknięte) i idzie ku mniejszym liczbom (w lewo).',
    ),
    feedbackIncorrect: L(
      '≤ uses a closed circle; shade left for “less than or equal.”',
      '≤ usa círculo cerrado; sombrea a la izquierda para “menor o igual.”',
      '≤ używa zamkniętego kółka; zacieniaj w lewo dla „mniejsze lub równe.”',
    ),
    diagnosticTags: ['open_for_inclusive', 'wrong_ray_direction'],
    standards: l5Mean,
  }),
  item({
    id: 'alg1-l05-g02',
    knowledgePointIds: ['kp.alg1.inequality.one.step'],
    difficulty: 0.45,
    irt: { a: 1.15, b: -0.2, c: 0.2 },
    prompt: L(
      'Solve: 3x > 12',
      'Resuelve: 3x > 12',
      'Rozwiąż: 3x > 12',
    ),
    promptMath: '3x > 12',
    choices: L(
      ['x > 4', 'x < 4', 'x > 36', 'x ≥ 4'],
      ['x > 4', 'x < 4', 'x > 36', 'x ≥ 4'],
      ['x > 4', 'x < 4', 'x > 36', 'x ≥ 4'],
    ),
    correctIndex: 0,
    correctLatex: 'x>4',
    feedbackCorrect: L(
      'Divide both sides by 3 (positive): x > 4. Inequality direction stays.',
      'Divide ambos lados entre 3 (positivo): x > 4. La dirección se conserva.',
      'Podziel obie strony przez 3 (dodatnie): x > 4. Kierunek nierówności zostaje.',
    ),
    feedbackIncorrect: L(
      'Divide by positive 3 → x > 4. Do not flip; do not change > to ≥.',
      'Divide entre 3 positivo → x > 4. No inviertas; no cambies > a ≥.',
      'Podziel przez dodatnie 3 → x > 4. Nie odwracaj; nie zmieniaj > na ≥.',
    ),
    diagnosticTags: ['flip_on_positive_divide', 'strict_to_inclusive'],
    standards: l5One,
  }),
  item({
    id: 'alg1-l05-g03',
    knowledgePointIds: ['kp.alg1.inequality.two.step'],
    difficulty: 0.5,
    irt: { a: 1.2, b: 0.0, c: 0.2 },
    prompt: L(
      'Solve: 2x + 3 < 11',
      'Resuelve: 2x + 3 < 11',
      'Rozwiąż: 2x + 3 < 11',
    ),
    promptMath: '2x + 3 < 11',
    choices: L(
      ['x < 4', 'x > 4', 'x < 7', 'x ≤ 4'],
      ['x < 4', 'x > 4', 'x < 7', 'x ≤ 4'],
      ['x < 4', 'x > 4', 'x < 7', 'x ≤ 4'],
    ),
    correctIndex: 0,
    correctLatex: 'x<4',
    feedbackCorrect: L(
      'Subtract 3: 2x < 8 → divide by 2: x < 4.',
      'Resta 3: 2x < 8 → divide entre 2: x < 4.',
      'Odejmij 3: 2x < 8 → podziel przez 2: x < 4.',
    ),
    feedbackIncorrect: L(
      'Undo +3 first, then divide by 2. Keep < → x < 4.',
      'Deshaz +3 primero, luego divide entre 2. Conserva < → x < 4.',
      'Najpierw cofnij +3, potem podziel przez 2. Zachowaj < → x < 4.',
    ),
    diagnosticTags: ['wrong_order', 'strict_to_inclusive'],
    standards: l5Two,
  }),
  item({
    id: 'alg1-l05-g04',
    knowledgePointIds: ['kp.alg1.inequality.two.step'],
    difficulty: 0.55,
    irt: { a: 1.25, b: 0.25, c: 0.2 },
    prompt: L(
      'Solve: −2x ≥ 8',
      'Resuelve: −2x ≥ 8',
      'Rozwiąż: −2x ≥ 8',
    ),
    promptMath: '-2x \\ge 8',
    choices: L(
      ['x ≤ −4', 'x ≥ −4', 'x ≤ 4', 'x ≥ 4'],
      ['x ≤ −4', 'x ≥ −4', 'x ≤ 4', 'x ≥ 4'],
      ['x ≤ −4', 'x ≥ −4', 'x ≤ 4', 'x ≥ 4'],
    ),
    correctIndex: 0,
    correctLatex: 'x\\le -4',
    feedbackCorrect: L(
      'Divide by −2 and flip: x ≤ −4.',
      'Divide entre −2 e invierte: x ≤ −4.',
      'Podziel przez −2 i odwróć: x ≤ −4.',
    ),
    feedbackIncorrect: L(
      'When dividing by a negative, flip the inequality: x ≤ −4.',
      'Al dividir por un negativo, invierte la desigualdad: x ≤ −4.',
      'Przy dzieleniu przez ujemną odwróć nierówność: x ≤ −4.',
    ),
    diagnosticTags: ['forgot_flip', 'sign_error'],
    standards: l5Two,
  }),
  item({
    id: 'alg1-l05-g05',
    knowledgePointIds: ['kp.alg1.inequality.meaning'],
    difficulty: 0.45,
    irt: { a: 1.1, b: -0.1, c: 0.2 },
    prompt: L(
      'Which value is in the solution set of x ≥ 5?',
      '¿Qué valor está en el conjunto solución de x ≥ 5?',
      'Która wartość należy do zbioru rozwiązań x ≥ 5?',
    ),
    promptMath: 'x \\ge 5',
    choices: L(
      ['5', '4', '0', '−5'],
      ['5', '4', '0', '−5'],
      ['5', '4', '0', '−5'],
    ),
    correctIndex: 0,
    acceptNumeric: 5,
    feedbackCorrect: L(
      '≥ includes the boundary; 5 is in the set.',
      '≥ incluye el borde; 5 está en el conjunto.',
      '≥ obejmuje granicę; 5 należy do zbioru.',
    ),
    feedbackIncorrect: L(
      'x ≥ 5 means all numbers greater than or equal to 5 — including 5.',
      'x ≥ 5 significa todos los números mayores o iguales a 5 — incluido 5.',
      'x ≥ 5 oznacza wszystkie liczby ≥ 5 — w tym 5.',
    ),
    diagnosticTags: ['exclude_boundary'],
    standards: l5Mean,
  }),
]

const l5IndSpecs = [
  {
    id: 'i01',
    kp: 'kp.alg1.inequality.one.step',
    diff: 0.5,
    b: 0.0,
    prompt: L('Solve: x − 5 > 2', 'Resuelve: x − 5 > 2', 'Rozwiąż: x − 5 > 2'),
    math: 'x - 5 > 2',
    choices: L(['x > 7', 'x < 7', 'x > −3', 'x ≥ 7'], ['x > 7', 'x < 7', 'x > −3', 'x ≥ 7'], ['x > 7', 'x < 7', 'x > −3', 'x ≥ 7']),
    correctIndex: 0,
    latex: 'x>7',
    fc: L('Add 5: x > 7.', 'Suma 5: x > 7.', 'Dodaj 5: x > 7.'),
    fi: L('Undo −5 by adding 5; keep > → x > 7.', 'Deshaz −5 sumando 5; conserva > → x > 7.', 'Cofnij −5 dodając 5; zachowaj > → x > 7.'),
    tags: ['wrong_inverse', 'strict_to_inclusive'],
    stds: l5One,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.inequality.one.step',
    diff: 0.5,
    b: 0.05,
    prompt: L('Solve: x/4 ≤ 3', 'Resuelve: x/4 ≤ 3', 'Rozwiąż: x/4 ≤ 3'),
    math: '\\frac{x}{4} \\le 3',
    choices: L(['x ≤ 12', 'x ≥ 12', 'x ≤ 0.75', 'x < 12'], ['x ≤ 12', 'x ≥ 12', 'x ≤ 0.75', 'x < 12'], ['x ≤ 12', 'x ≥ 12', 'x ≤ 0.75', 'x < 12']),
    correctIndex: 0,
    latex: 'x\\le 12',
    fc: L('Multiply by 4: x ≤ 12.', 'Multiplica por 4: x ≤ 12.', 'Pomnóż przez 4: x ≤ 12.'),
    fi: L('Multiply both sides by positive 4; keep ≤ → x ≤ 12.', 'Multiplica ambos lados por 4 positivo; conserva ≤ → x ≤ 12.', 'Pomnóż obie strony przez dodatnie 4; zachowaj ≤ → x ≤ 12.'),
    tags: ['flip_on_positive_multiply', 'strict_to_inclusive'],
    stds: l5One,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.inequality.two.step',
    diff: 0.55,
    b: 0.15,
    prompt: L('Solve: 3x − 1 ≥ 8', 'Resuelve: 3x − 1 ≥ 8', 'Rozwiąż: 3x − 1 ≥ 8'),
    math: '3x - 1 \\ge 8',
    choices: L(['x ≥ 3', 'x ≤ 3', 'x ≥ 7/3', 'x > 3'], ['x ≥ 3', 'x ≤ 3', 'x ≥ 7/3', 'x > 3'], ['x ≥ 3', 'x ≤ 3', 'x ≥ 7/3', 'x > 3']),
    correctIndex: 0,
    latex: 'x\\ge 3',
    fc: L('Add 1: 3x ≥ 9 → x ≥ 3.', 'Suma 1: 3x ≥ 9 → x ≥ 3.', 'Dodaj 1: 3x ≥ 9 → x ≥ 3.'),
    fi: L('Add 1, then divide by 3 → x ≥ 3.', 'Suma 1, luego divide entre 3 → x ≥ 3.', 'Dodaj 1, potem podziel przez 3 → x ≥ 3.'),
    tags: ['wrong_order'],
    stds: l5Two,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.inequality.two.step',
    diff: 0.6,
    b: 0.3,
    prompt: L('Solve: −3x + 6 < 0', 'Resuelve: −3x + 6 < 0', 'Rozwiąż: −3x + 6 < 0'),
    math: '-3x + 6 < 0',
    choices: L(['x > 2', 'x < 2', 'x > −2', 'x ≥ 2'], ['x > 2', 'x < 2', 'x > −2', 'x ≥ 2'], ['x > 2', 'x < 2', 'x > −2', 'x ≥ 2']),
    correctIndex: 0,
    latex: 'x>2',
    fc: L('Subtract 6: −3x < −6 → divide by −3 and flip: x > 2.', 'Resta 6: −3x < −6 → divide entre −3 e invierte: x > 2.', 'Odejmij 6: −3x < −6 → podziel przez −3 i odwróć: x > 2.'),
    fi: L('Remember to flip when dividing by −3 → x > 2.', 'Recuerda invertir al dividir entre −3 → x > 2.', 'Pamiętaj o odwróceniu przy dzieleniu przez −3 → x > 2.'),
    tags: ['forgot_flip'],
    stds: l5Two,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.inequality.meaning',
    diff: 0.5,
    b: 0.1,
    prompt: L('Which graph matches x < 0?', '¿Qué gráfica corresponde a x < 0?', 'Który wykres odpowiada x < 0?'),
    math: 'x < 0',
    choices: L(
      ['Open circle at 0, ray left', 'Closed circle at 0, ray left', 'Open circle at 0, ray right', 'Closed circle at 0, ray right'],
      ['Círculo abierto en 0, rayo izquierda', 'Círculo cerrado en 0, rayo izquierda', 'Círculo abierto en 0, rayo derecha', 'Círculo cerrado en 0, rayo derecha'],
      ['Otwarte kółko w 0, półprosta w lewo', 'Zamknięte kółko w 0, półprosta w lewo', 'Otwarte kółko w 0, półprosta w prawo', 'Zamknięte kółko w 0, półprosta w prawo'],
    ),
    correctIndex: 0,
    fc: L('Strict < → open at 0; smaller numbers → ray left.', 'Estricto < → abierto en 0; menores → rayo izquierda.', 'Ostre < → otwarte w 0; mniejsze → półprosta w lewo.'),
    fi: L('Open circle for <; shade left of 0.', 'Círculo abierto para <; sombrea a la izquierda de 0.', 'Otwarte kółko dla <; zacieniaj na lewo od 0.'),
    tags: ['closed_for_strict', 'wrong_ray_direction'],
    stds: l5Mean,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.inequality.two.step',
    diff: 0.55,
    b: 0.2,
    prompt: L('Solve: 5x + 10 ≤ 0', 'Resuelve: 5x + 10 ≤ 0', 'Rozwiąż: 5x + 10 ≤ 0'),
    math: '5x + 10 \\le 0',
    choices: L(['x ≤ −2', 'x ≥ −2', 'x ≤ 2', 'x < −2'], ['x ≤ −2', 'x ≥ −2', 'x ≤ 2', 'x < −2'], ['x ≤ −2', 'x ≥ −2', 'x ≤ 2', 'x < −2']),
    correctIndex: 0,
    latex: 'x\\le -2',
    fc: L('Subtract 10: 5x ≤ −10 → x ≤ −2.', 'Resta 10: 5x ≤ −10 → x ≤ −2.', 'Odejmij 10: 5x ≤ −10 → x ≤ −2.'),
    fi: L('Subtract 10, divide by 5 (positive) → x ≤ −2.', 'Resta 10, divide entre 5 (positivo) → x ≤ −2.', 'Odejmij 10, podziel przez 5 (dodatnie) → x ≤ −2.'),
    tags: ['sign_error'],
    stds: l5Two,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.inequality.one.step',
    diff: 0.55,
    b: 0.15,
    prompt: L('Solve: −x < 5', 'Resuelve: −x < 5', 'Rozwiąż: −x < 5'),
    math: '-x < 5',
    choices: L(['x > −5', 'x < −5', 'x > 5', 'x < 5'], ['x > −5', 'x < −5', 'x > 5', 'x < 5'], ['x > −5', 'x < −5', 'x > 5', 'x < 5']),
    correctIndex: 0,
    latex: 'x>-5',
    fc: L('Multiply/divide by −1 and flip: x > −5.', 'Multiplica/divide por −1 e invierte: x > −5.', 'Pomnóż/podziel przez −1 i odwróć: x > −5.'),
    fi: L('Dividing by −1 flips < to > → x > −5.', 'Dividir entre −1 invierte < a > → x > −5.', 'Dzielenie przez −1 odwraca < na > → x > −5.'),
    tags: ['forgot_flip'],
    stds: l5One,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.inequality.meaning',
    diff: 0.45,
    b: -0.05,
    prompt: L('Is −1 a solution of x > 0?', '¿Es −1 una solución de x > 0?', 'Czy −1 jest rozwiązaniem x > 0?'),
    math: 'x > 0',
    choices: L(['No', 'Yes', 'Only if closed circle', 'Cannot tell'], ['No', 'Sí', 'Solo si círculo cerrado', 'No se puede saber'], ['Nie', 'Tak', 'Tylko przy zamkniętym kółku', 'Nie da się stwierdzić']),
    correctIndex: 0,
    fc: L('−1 is less than 0, so it is not in x > 0.', '−1 es menor que 0, así que no está en x > 0.', '−1 jest mniejsze od 0, więc nie należy do x > 0.'),
    fi: L('x > 0 is only positive numbers; −1 fails.', 'x > 0 son solo números positivos; −1 falla.', 'x > 0 to tylko liczby dodatnie; −1 odpada.'),
    tags: ['number_line_misread'],
    stds: l5Mean,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.inequality.two.step',
    diff: 0.6,
    b: 0.35,
    prompt: L('Solve: 2(x − 3) ≥ 4', 'Resuelve: 2(x − 3) ≥ 4', 'Rozwiąż: 2(x − 3) ≥ 4'),
    math: '2(x - 3) \\ge 4',
    choices: L(['x ≥ 5', 'x ≤ 5', 'x ≥ 1', 'x > 5'], ['x ≥ 5', 'x ≤ 5', 'x ≥ 1', 'x > 5'], ['x ≥ 5', 'x ≤ 5', 'x ≥ 1', 'x > 5']),
    correctIndex: 0,
    latex: 'x\\ge 5',
    fc: L('2x − 6 ≥ 4 → 2x ≥ 10 → x ≥ 5.', '2x − 6 ≥ 4 → 2x ≥ 10 → x ≥ 5.', '2x − 6 ≥ 4 → 2x ≥ 10 → x ≥ 5.'),
    fi: L('Distribute (or divide by 2 first), then solve → x ≥ 5.', 'Distribuye (o divide entre 2 primero), luego resuelve → x ≥ 5.', 'Rozdziel (lub najpierw podziel przez 2), potem rozwiąż → x ≥ 5.'),
    tags: ['forgot_distribute'],
    stds: l5Two,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.inequality.two.step',
    diff: 0.65,
    b: 0.4,
    prompt: L('Solve: 4 − x ≤ 1', 'Resuelve: 4 − x ≤ 1', 'Rozwiąż: 4 − x ≤ 1'),
    math: '4 - x \\le 1',
    choices: L(['x ≥ 3', 'x ≤ 3', 'x ≥ −3', 'x ≤ −3'], ['x ≥ 3', 'x ≤ 3', 'x ≥ −3', 'x ≤ −3'], ['x ≥ 3', 'x ≤ 3', 'x ≥ −3', 'x ≤ −3']),
    correctIndex: 0,
    latex: 'x\\ge 3',
    fc: L('Subtract 4: −x ≤ −3 → multiply by −1 and flip: x ≥ 3.', 'Resta 4: −x ≤ −3 → multiplica por −1 e invierte: x ≥ 3.', 'Odejmij 4: −x ≤ −3 → pomnóż przez −1 i odwróć: x ≥ 3.'),
    fi: L('Isolate −x, then flip when multiplying by −1 → x ≥ 3.', 'Aísla −x, luego invierte al multiplicar por −1 → x ≥ 3.', 'Izoluj −x, potem odwróć przy mnożeniu przez −1 → x ≥ 3.'),
    tags: ['forgot_flip', 'sign_error'],
    stds: l5Two,
  },
]

for (const s of l5IndSpecs) {
  const partial = {
    id: `alg1-l05-${s.id}`,
    knowledgePointIds: [s.kp],
    difficulty: s.diff,
    irt: { a: 1.2, b: s.b, c: 0.2 },
    prompt: s.prompt,
    promptMath: s.math,
    choices: s.choices,
    correctIndex: s.correctIndex,
    feedbackCorrect: s.fc,
    feedbackIncorrect: s.fi,
    diagnosticTags: s.tags,
    standards: s.stds,
  }
  if (s.latex) partial.correctLatex = s.latex
  lesson05Items.push(item(partial))
}

const lesson05 = {
  id: 'alg1-l05',
  courseId: 'algebra1',
  order: 5,
  title: L(
    'Linear Inequalities — One-Step, Two-Step & the Number Line',
    'Desigualdades lineales — un paso, dos pasos y la recta numérica',
    'Nierówności liniowe — jeden krok, dwa kroki i oś liczbowa',
  ),
  knowledgePointIds: [
    'kp.alg1.inequality.meaning',
    'kp.alg1.inequality.one.step',
    'kp.alg1.inequality.two.step',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_5', unlockOnMastery: ['lesson_board_6'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will interpret inequality symbols on a number line and solve one- and two-step linear inequalities, flipping when multiplying or dividing by a negative.',
        'Interpretarás símbolos de desigualdad en la recta y resolverás desigualdades lineales de uno y dos pasos, invirtiendo al multiplicar o dividir por un negativo.',
        'Będziesz interpretować symbole nierówności na osi i rozwiązywać jedno- oraz dwukrokowe nierówności liniowe, odwracając przy mnożeniu lub dzieleniu przez ujemną.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: solution sets and flips', 'Enseñar: conjuntos solución e inversiones', 'Nauczanie: zbiory rozwiązań i odwracanie'),
      body: L(
        'An inequality describes a set of numbers. Open circles exclude the endpoint (<, >); closed include it (≤, ≥). Solve like equations, but flip the inequality when you multiply or divide both sides by a negative number.',
        'Una desigualdad describe un conjunto de números. Círculos abiertos excluyen el extremo (<, >); cerrados lo incluyen (≤, ≥). Resuelve como ecuaciones, pero invierte al multiplicar o dividir por un negativo.',
        'Nierówność opisuje zbiór liczb. Otwarte kółka wykluczają koniec (<, >); zamknięte obejmują (≤, ≥). Rozwiązuj jak równania, ale odwróć nierówność przy mnożeniu lub dzieleniu przez ujemną.',
      ),
      bodyMath: ['x > 3', 'x + 4 \\le 10', '-2x \\ge 8'],
      itemIds: ['alg1-l05-t01', 'alg1-l05-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Match number-line graphs, solve one- and two-step inequalities, and practice the flip rule.',
        'Relaciona gráficas en la recta, resuelve desigualdades de uno y dos pasos y practica la regla de inversión.',
        'Dopasuj wykresy na osi, rozwiązuj nierówności jedno- i dwukrokowe oraz ćwicz regułę odwracania.',
      ),
      itemIds: ['alg1-l05-g01', 'alg1-l05-g02', 'alg1-l05-g03', 'alg1-l05-g04', 'alg1-l05-g05'],
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
        'alg1-l05-i01',
        'alg1-l05-i02',
        'alg1-l05-i03',
        'alg1-l05-i04',
        'alg1-l05-i05',
        'alg1-l05-i06',
        'alg1-l05-i07',
        'alg1-l05-i08',
        'alg1-l05-i09',
        'alg1-l05-i10',
      ],
    },
  ],
  items: lesson05Items,
}

/* ═══════════════ LESSON 6 ═══════════════ */
const lesson06Items = [
  item({
    id: 'alg1-l06-t01',
    knowledgePointIds: ['kp.alg1.function.linear.intro'],
    difficulty: 0.3,
    irt: { a: 1.0, b: -1.0, c: 0.2 },
    prompt: L(
      'Which rule describes a linear function?',
      '¿Qué regla describe una función lineal?',
      'Która reguła opisuje funkcję liniową?',
    ),
    promptMath: 'y = 2x + 1',
    choices: L(
      ['y = 2x + 1', 'y = x^2 + 1', 'y = 2/x', 'y = 2^x'],
      ['y = 2x + 1', 'y = x^2 + 1', 'y = 2/x', 'y = 2^x'],
      ['y = 2x + 1', 'y = x^2 + 1', 'y = 2/x', 'y = 2^x'],
    ),
    correctIndex: 0,
    feedbackCorrect: L(
      'y = 2x + 1 has constant rate of change 2 — a classic linear rule.',
      'y = 2x + 1 tiene tasa de cambio constante 2 — regla lineal clásica.',
      'y = 2x + 1 ma stałą stopę zmian 2 — klasyczna reguła liniowa.',
    ),
    feedbackIncorrect: L(
      'Linear functions look like y = mx + b (constant rate). Powers, reciprocals, and exponentials are not linear.',
      'Las funciones lineales son como y = mx + b (tasa constante). Potencias, reciprocos y exponenciales no son lineales.',
      'Funkcje liniowe mają postać y = mx + b (stała stopa). Potęgi, odwrotności i wykładnicze nie są liniowe.',
    ),
    diagnosticTags: ['nonlinear_as_linear'],
    standards: l6Fn,
  }),
  item({
    id: 'alg1-l06-t02',
    knowledgePointIds: ['kp.alg1.rate.of.change'],
    difficulty: 0.35,
    irt: { a: 1.05, b: -0.8, c: 0.2 },
    prompt: L(
      'A table shows x: 1, 2, 3 and y: 5, 8, 11. What is the rate of change?',
      'Una tabla muestra x: 1, 2, 3 e y: 5, 8, 11. ¿Cuál es la tasa de cambio?',
      'Tabela: x: 1, 2, 3 oraz y: 5, 8, 11. Jaka jest stopa zmian?',
    ),
    choices: L(
      ['3', '1', '5', '8'],
      ['3', '1', '5', '8'],
      ['3', '1', '5', '8'],
    ),
    correctIndex: 0,
    acceptNumeric: 3,
    correctLatex: '3',
    feedbackCorrect: L(
      'Δy/Δx = (8−5)/(2−1) = 3 (same between each consecutive pair).',
      'Δy/Δx = (8−5)/(2−1) = 3 (igual entre cada par consecutivo).',
      'Δy/Δx = (8−5)/(2−1) = 3 (to samo między kolejnymi parami).',
    ),
    feedbackIncorrect: L(
      'Rate of change = change in y ÷ change in x. Here each step adds 3 to y when x increases by 1.',
      'Tasa de cambio = cambio en y ÷ cambio en x. Aquí cada paso suma 3 a y cuando x aumenta 1.',
      'Stopa zmian = zmiana y ÷ zmiana x. Tu każdy krok dodaje 3 do y, gdy x rośnie o 1.',
    ),
    diagnosticTags: ['dx_over_dy', 'use_y_not_delta'],
    standards: l6Rate,
  }),
  item({
    id: 'alg1-l06-g01',
    knowledgePointIds: ['kp.alg1.function.linear.intro'],
    difficulty: 0.4,
    irt: { a: 1.1, b: -0.4, c: 0.2 },
    prompt: L(
      'If f(x) = 3x − 2, what is f(4)?',
      'Si f(x) = 3x − 2, ¿cuánto es f(4)?',
      'Jeśli f(x) = 3x − 2, ile wynosi f(4)?',
    ),
    promptMath: 'f(x) = 3x - 2',
    choices: L(['10', '12', '14', '5'], ['10', '12', '14', '5'], ['10', '12', '14', '5']),
    correctIndex: 0,
    acceptNumeric: 10,
    correctLatex: '10',
    feedbackCorrect: L(
      'f(4) = 3·4 − 2 = 12 − 2 = 10.',
      'f(4) = 3·4 − 2 = 12 − 2 = 10.',
      'f(4) = 3·4 − 2 = 12 − 2 = 10.',
    ),
    feedbackIncorrect: L(
      'Substitute x = 4 into 3x − 2 → 12 − 2 = 10.',
      'Sustituye x = 4 en 3x − 2 → 12 − 2 = 10.',
      'Podstaw x = 4 do 3x − 2 → 12 − 2 = 10.',
    ),
    diagnosticTags: ['eval_error'],
    standards: l6Fn,
  }),
  item({
    id: 'alg1-l06-g02',
    knowledgePointIds: ['kp.alg1.rate.of.change'],
    difficulty: 0.45,
    irt: { a: 1.15, b: -0.2, c: 0.2 },
    prompt: L(
      'A bike travels 30 miles in 2 hours at constant speed. What is the rate of change in miles per hour?',
      'Una bici recorre 30 millas en 2 horas a velocidad constante. ¿Cuál es la tasa de cambio en millas por hora?',
      'Rower jedzie 30 mil w 2 godziny ze stałą prędkością. Jaka jest stopa zmian w milach na godzinę?',
    ),
    choices: L(['15', '30', '60', '2'], ['15', '30', '60', '2'], ['15', '30', '60', '2']),
    correctIndex: 0,
    acceptNumeric: 15,
    correctLatex: '15',
    feedbackCorrect: L(
      'Rate = 30 miles ÷ 2 hours = 15 mi/h.',
      'Tasa = 30 millas ÷ 2 horas = 15 mi/h.',
      'Stopa = 30 mil ÷ 2 godziny = 15 mi/h.',
    ),
    feedbackIncorrect: L(
      'Divide distance by time for constant rate: 30/2 = 15.',
      'Divide distancia entre tiempo para tasa constante: 30/2 = 15.',
      'Podziel drogę przez czas dla stałej stopy: 30/2 = 15.',
    ),
    diagnosticTags: ['invert_rate'],
    standards: l6Rate,
  }),
  item({
    id: 'alg1-l06-g03',
    knowledgePointIds: ['kp.alg1.slope.intuition'],
    difficulty: 0.5,
    irt: { a: 1.2, b: 0.0, c: 0.2 },
    prompt: L(
      'What is the slope of the line through (1, 2) and (3, 8)?',
      '¿Cuál es la pendiente de la recta por (1, 2) y (3, 8)?',
      'Jakie jest nachylenie prostej przez (1, 2) i (3, 8)?',
    ),
    promptMath: 'm = \\frac{\\Delta y}{\\Delta x}',
    choices: L(['3', '2', '6', '1/3'], ['3', '2', '6', '1/3'], ['3', '2', '6', '1/3']),
    correctIndex: 0,
    acceptNumeric: 3,
    correctLatex: '3',
    feedbackCorrect: L(
      'm = (8−2)/(3−1) = 6/2 = 3.',
      'm = (8−2)/(3−1) = 6/2 = 3.',
      'm = (8−2)/(3−1) = 6/2 = 3.',
    ),
    feedbackIncorrect: L(
      'Slope = rise/run = (y₂−y₁)/(x₂−x₁) = 6/2 = 3.',
      'Pendiente = subida/avance = (y₂−y₁)/(x₂−x₁) = 6/2 = 3.',
      'Nachylenie = wzrost/przebieg = (y₂−y₁)/(x₂−x₁) = 6/2 = 3.',
    ),
    diagnosticTags: ['dx_over_dy', 'order_swap'],
    standards: l6Slope,
  }),
  item({
    id: 'alg1-l06-g04',
    knowledgePointIds: ['kp.alg1.slope.intuition'],
    difficulty: 0.55,
    irt: { a: 1.25, b: 0.2, c: 0.2 },
    prompt: L(
      'A line has slope −2. As x increases by 1, what happens to y?',
      'Una recta tiene pendiente −2. Cuando x aumenta 1, ¿qué pasa con y?',
      'Prosta ma nachylenie −2. Gdy x rośnie o 1, co dzieje się z y?',
    ),
    choices: L(
      ['y decreases by 2', 'y increases by 2', 'y decreases by 1/2', 'y stays the same'],
      ['y disminuye en 2', 'y aumenta en 2', 'y disminuye en 1/2', 'y no cambia'],
      ['y maleje o 2', 'y rośnie o 2', 'y maleje o 1/2', 'y się nie zmienia'],
    ),
    correctIndex: 0,
    feedbackCorrect: L(
      'Negative slope means y falls as x rises; magnitude 2 means decrease by 2 per unit x.',
      'Pendiente negativa: y baja cuando x sube; magnitud 2 significa bajar 2 por cada unidad de x.',
      'Ujemne nachylenie: y spada, gdy x rośnie; |2| oznacza spadek o 2 na jednostkę x.',
    ),
    feedbackIncorrect: L(
      'Slope −2 = Δy/Δx = −2/1, so y changes by −2 when x increases by 1.',
      'Pendiente −2 = Δy/Δx = −2/1, así que y cambia en −2 cuando x aumenta 1.',
      'Nachylenie −2 = Δy/Δx = −2/1, więc y zmienia się o −2, gdy x rośnie o 1.',
    ),
    diagnosticTags: ['ignore_sign', 'invert_slope'],
    standards: l6Slope,
  }),
  item({
    id: 'alg1-l06-g05',
    knowledgePointIds: ['kp.alg1.rate.of.change'],
    difficulty: 0.5,
    irt: { a: 1.15, b: 0.1, c: 0.2 },
    prompt: L(
      'In y = −4x + 7, what is the rate of change?',
      'En y = −4x + 7, ¿cuál es la tasa de cambio?',
      'W y = −4x + 7, jaka jest stopa zmian?',
    ),
    promptMath: 'y = -4x + 7',
    choices: L(['−4', '4', '7', '−7'], ['−4', '4', '7', '−7'], ['−4', '4', '7', '−7']),
    correctIndex: 0,
    acceptNumeric: -4,
    correctLatex: '-4',
    feedbackCorrect: L(
      'In y = mx + b, the rate of change (slope) is m = −4.',
      'En y = mx + b, la tasa de cambio (pendiente) es m = −4.',
      'W y = mx + b stopa zmian (nachylenie) to m = −4.',
    ),
    feedbackIncorrect: L(
      'The coefficient of x is the constant rate: m = −4 (not the intercept 7).',
      'El coeficiente de x es la tasa constante: m = −4 (no la intersección 7).',
      'Współczynnik przy x to stała stopa: m = −4 (nie wyraz wolny 7).',
    ),
    diagnosticTags: ['confuse_intercept', 'drop_sign'],
    standards: l6Rate,
  }),
]

const l6IndSpecs = [
  {
    id: 'i01',
    kp: 'kp.alg1.function.linear.intro',
    diff: 0.45,
    b: -0.1,
    prompt: L('Which situation is linear?', '¿Qué situación es lineal?', 'Która sytuacja jest liniowa?'),
    choices: L(
      ['Earn $12 per hour with no tip variation', 'Population doubles every year', 'Area of a square vs side length', 'Bounce height halves each bounce'],
      ['Ganar $12 por hora sin variación de propina', 'La población se duplica cada año', 'Área de un cuadrado vs lado', 'La altura del rebote se reduce a la mitad'],
      ['Zarobek 12 $/h bez zmiennych napiwków', 'Populacja podwaja się co rok', 'Pole kwadratu vs długość boku', 'Wysokość odbicia maleje o połowę'],
    ),
    correctIndex: 0,
    fc: L('Constant dollars per hour is a constant rate — linear.', 'Dólares por hora constantes = tasa constante — lineal.', 'Stałe dolary na godzinę = stała stopa — liniowe.'),
    fi: L('Look for constant rate of change. Doubling, squares, and halving are not linear.', 'Busca tasa de cambio constante. Duplicar, cuadrados y reducir a la mitad no son lineales.', 'Szukaj stałej stopy zmian. Podwajanie, kwadraty i połowienie nie są liniowe.'),
    tags: ['nonlinear_as_linear'],
    stds: l6Fn,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.function.linear.intro',
    diff: 0.5,
    b: 0.0,
    prompt: L('If g(x) = −x + 5, what is g(2)?', 'Si g(x) = −x + 5, ¿cuánto es g(2)?', 'Jeśli g(x) = −x + 5, ile wynosi g(2)?'),
    math: 'g(x) = -x + 5',
    choices: L(['3', '7', '−3', '5'], ['3', '7', '−3', '5'], ['3', '7', '−3', '5']),
    correctIndex: 0,
    num: 3,
    latex: '3',
    fc: L('g(2) = −2 + 5 = 3.', 'g(2) = −2 + 5 = 3.', 'g(2) = −2 + 5 = 3.'),
    fi: L('Substitute x = 2: −2 + 5 = 3.', 'Sustituye x = 2: −2 + 5 = 3.', 'Podstaw x = 2: −2 + 5 = 3.'),
    tags: ['eval_error', 'sign_error'],
    stds: l6Fn,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.rate.of.change',
    diff: 0.5,
    b: 0.1,
    prompt: L('Table: x 0,2,4 and y 1,5,9. Rate of change?', 'Tabla: x 0,2,4 e y 1,5,9. ¿Tasa de cambio?', 'Tabela: x 0,2,4 oraz y 1,5,9. Stopa zmian?'),
    choices: L(['2', '4', '1', '0.5'], ['2', '4', '1', '0.5'], ['2', '4', '1', '0.5']),
    correctIndex: 0,
    num: 2,
    latex: '2',
    fc: L('(5−1)/(2−0) = 4/2 = 2.', '(5−1)/(2−0) = 4/2 = 2.', '(5−1)/(2−0) = 4/2 = 2.'),
    fi: L('Δy/Δx between consecutive points: 4/2 = 2.', 'Δy/Δx entre puntos consecutivos: 4/2 = 2.', 'Δy/Δx między kolejnymi punktami: 4/2 = 2.'),
    tags: ['dx_over_dy', 'use_x_step_only'],
    stds: l6Rate,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.rate.of.change',
    diff: 0.55,
    b: 0.2,
    prompt: L('In y = (1/2)x − 3, rate of change is?', 'En y = (1/2)x − 3, ¿la tasa de cambio es?', 'W y = (1/2)x − 3 stopa zmian to?'),
    math: 'y = \\frac{1}{2}x - 3',
    choices: L(['1/2', '−3', '2', '−1/2'], ['1/2', '−3', '2', '−1/2'], ['1/2', '−3', '2', '−1/2']),
    correctIndex: 0,
    latex: '\\frac{1}{2}',
    fc: L('m = 1/2 is the constant rate of change.', 'm = 1/2 es la tasa de cambio constante.', 'm = 1/2 to stała stopa zmian.'),
    fi: L('In y = mx + b, rate = m = 1/2 (not the intercept −3).', 'En y = mx + b, tasa = m = 1/2 (no la intersección −3).', 'W y = mx + b stopa = m = 1/2 (nie wyraz wolny −3).'),
    tags: ['confuse_intercept', 'invert_slope'],
    stds: l6Rate,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.slope.intuition',
    diff: 0.55,
    b: 0.25,
    prompt: L('Slope through (0, 4) and (2, 0)?', '¿Pendiente por (0, 4) y (2, 0)?', 'Nachylenie przez (0, 4) i (2, 0)?'),
    math: 'm = \\frac{0-4}{2-0}',
    choices: L(['−2', '2', '−1/2', '4'], ['−2', '2', '−1/2', '4'], ['−2', '2', '−1/2', '4']),
    correctIndex: 0,
    num: -2,
    latex: '-2',
    fc: L('m = (0−4)/(2−0) = −4/2 = −2.', 'm = (0−4)/(2−0) = −4/2 = −2.', 'm = (0−4)/(2−0) = −4/2 = −2.'),
    fi: L('Rise/run = −4/2 = −2 (falling line).', 'Subida/avance = −4/2 = −2 (recta descendente).', 'Wzrost/przebieg = −4/2 = −2 (prosta opadająca).'),
    tags: ['drop_sign', 'dx_over_dy'],
    stds: l6Slope,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.slope.intuition',
    diff: 0.5,
    b: 0.15,
    prompt: L('Which slope is steeper (larger |m|)?', '¿Qué pendiente es más empinada (mayor |m|)?', 'Które nachylenie jest stromsze (większe |m|)?'),
    choices: L(['m = −5', 'm = 2', 'm = −1', 'm = 0'], ['m = −5', 'm = 2', 'm = −1', 'm = 0'], ['m = −5', 'm = 2', 'm = −1', 'm = 0']),
    correctIndex: 0,
    fc: L('|−5| = 5 is largest; steepest among the options.', '|−5| = 5 es el mayor; el más empinado.', '|−5| = 5 jest największe; najbardziej strome.'),
    fi: L('Compare absolute values: |−5| > |2| > |−1| > |0|.', 'Compara valores absolutos: |−5| > |2| > |−1| > |0|.', 'Porównaj wartości bezwzględne: |−5| > |2| > |−1| > |0|.'),
    tags: ['ignore_absolute_value'],
    stds: l6Slope,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.slope.intuition',
    diff: 0.6,
    b: 0.35,
    prompt: L('Slope through (−1, 3) and (1, 3)?', '¿Pendiente por (−1, 3) y (1, 3)?', 'Nachylenie przez (−1, 3) i (1, 3)?'),
    choices: L(['0', '3', '2', 'undefined'], ['0', '3', '2', 'indefinida'], ['0', '3', '2', 'nieokreślone']),
    correctIndex: 0,
    num: 0,
    latex: '0',
    fc: L('Δy = 0 → horizontal line → slope 0.', 'Δy = 0 → recta horizontal → pendiente 0.', 'Δy = 0 → pozioma → nachylenie 0.'),
    fi: L('(3−3)/(1−(−1)) = 0/2 = 0.', '(3−3)/(1−(−1)) = 0/2 = 0.', '(3−3)/(1−(−1)) = 0/2 = 0.'),
    tags: ['horizontal_as_undefined'],
    stds: l6Slope,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.rate.of.change',
    diff: 0.55,
    b: 0.2,
    prompt: L('Temperature drops 6° in 3 hours steadily. Rate of change (° per hour)?', 'La temperatura baja 6° en 3 horas de forma constante. ¿Tasa (° por hora)?', 'Temperatura spada o 6° w 3 godziny stale. Stopa (° na godzinę)?'),
    choices: L(['−2', '2', '−6', '3'], ['−2', '2', '−6', '3'], ['−2', '2', '−6', '3']),
    correctIndex: 0,
    num: -2,
    latex: '-2',
    fc: L('−6° / 3 h = −2° per hour.', '−6° / 3 h = −2° por hora.', '−6° / 3 h = −2° na godzinę.'),
    fi: L('Include the negative for a drop: −6/3 = −2.', 'Incluye el negativo por la bajada: −6/3 = −2.', 'Uwzględnij minus przy spadku: −6/3 = −2.'),
    tags: ['drop_sign', 'invert_rate'],
    stds: l6Rate,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.function.linear.intro',
    diff: 0.55,
    b: 0.25,
    prompt: L('In y = mx + b, what does b represent?', 'En y = mx + b, ¿qué representa b?', 'W y = mx + b, co oznacza b?'),
    choices: L(
      ['y-intercept (value when x = 0)', 'slope', 'rate of change', 'always the maximum y'],
      ['intersección con y (valor cuando x = 0)', 'pendiente', 'tasa de cambio', 'siempre el máximo y'],
      ['punkt przecięcia z osią y (gdy x = 0)', 'nachylenie', 'stopa zmian', 'zawsze maksimum y'],
    ),
    correctIndex: 0,
    fc: L('b is the y-intercept — the output when x = 0.', 'b es la intersección con y — la salida cuando x = 0.', 'b to punkt przecięcia z osią y — wartość gdy x = 0.'),
    fi: L('m is slope/rate; b is where the line crosses the y-axis.', 'm es pendiente/tasa; b es donde la recta corta el eje y.', 'm to nachylenie/stopa; b to przecięcie z osią y.'),
    tags: ['confuse_m_and_b'],
    stds: l6Fn,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.slope.intuition',
    diff: 0.65,
    b: 0.45,
    prompt: L('Slope through (2, −1) and (5, 5)?', '¿Pendiente por (2, −1) y (5, 5)?', 'Nachylenie przez (2, −1) i (5, 5)?'),
    choices: L(['2', '3', '6', '1/2'], ['2', '3', '6', '1/2'], ['2', '3', '6', '1/2']),
    correctIndex: 0,
    num: 2,
    latex: '2',
    fc: L('m = (5−(−1))/(5−2) = 6/3 = 2.', 'm = (5−(−1))/(5−2) = 6/3 = 2.', 'm = (5−(−1))/(5−2) = 6/3 = 2.'),
    fi: L('(y₂−y₁)/(x₂−x₁) = 6/3 = 2.', '(y₂−y₁)/(x₂−x₁) = 6/3 = 2.', '(y₂−y₁)/(x₂−x₁) = 6/3 = 2.'),
    tags: ['order_swap', 'arithmetic_error'],
    stds: l6Slope,
  },
]

for (const s of l6IndSpecs) {
  const partial = {
    id: `alg1-l06-${s.id}`,
    knowledgePointIds: [s.kp],
    difficulty: s.diff,
    irt: { a: 1.2, b: s.b, c: 0.2 },
    prompt: s.prompt,
    feedbackCorrect: s.fc,
    feedbackIncorrect: s.fi,
    diagnosticTags: s.tags,
    standards: s.stds,
    choices: s.choices,
    correctIndex: s.correctIndex,
  }
  if (s.math) partial.promptMath = s.math
  if (s.latex) partial.correctLatex = s.latex
  if (s.num !== undefined) partial.acceptNumeric = s.num
  lesson06Items.push(item(partial))
}

const lesson06 = {
  id: 'alg1-l06',
  courseId: 'algebra1',
  order: 6,
  title: L(
    'Linear Functions — Rate of Change & Slope Intuition',
    'Funciones lineales — tasa de cambio e intuición de pendiente',
    'Funkcje liniowe — stopa zmian i intuicja nachylenia',
  ),
  knowledgePointIds: [
    'kp.alg1.function.linear.intro',
    'kp.alg1.rate.of.change',
    'kp.alg1.slope.intuition',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_6', unlockOnMastery: ['lesson_board_7'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will recognize linear functions, find constant rates of change from tables and contexts, and compute slope as rise over run.',
        'Reconocerás funciones lineales, hallarás tasas de cambio constantes en tablas y contextos, y calcularás pendiente como subida sobre avance.',
        'Będziesz rozpoznawać funkcje liniowe, znajdować stałe stopy zmian z tabel i kontekstów oraz obliczać nachylenie jako wzrost przez przebieg.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: constant rate and slope', 'Enseñar: tasa constante y pendiente', 'Nauczanie: stała stopa i nachylenie'),
      body: L(
        'A linear function has a constant rate of change. In y = mx + b, m is that rate (slope). Slope = rise/run = Δy/Δx between two points. Positive slopes rise; negative slopes fall.',
        'Una función lineal tiene tasa de cambio constante. En y = mx + b, m es esa tasa (pendiente). Pendiente = subida/avance = Δy/Δx entre dos puntos. Pendientes positivas suben; negativas bajan.',
        'Funkcja liniowa ma stałą stopę zmian. W y = mx + b m to ta stopa (nachylenie). Nachylenie = wzrost/przebieg = Δy/Δx między dwoma punktami. Dodatnie rosną; ujemne spadają.',
      ),
      bodyMath: ['y = 2x + 1', 'm = \\frac{\\Delta y}{\\Delta x}', 'y = -4x + 7'],
      itemIds: ['alg1-l06-t01', 'alg1-l06-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Evaluate linear rules, read rates from tables and contexts, and compute slopes between points.',
        'Evalúa reglas lineales, lee tasas en tablas y contextos, y calcula pendientes entre puntos.',
        'Obliczaj reguły liniowe, odczytuj stopy z tabel i kontekstów oraz nachylenia między punktami.',
      ),
      itemIds: ['alg1-l06-g01', 'alg1-l06-g02', 'alg1-l06-g03', 'alg1-l06-g04', 'alg1-l06-g05'],
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
        'alg1-l06-i01',
        'alg1-l06-i02',
        'alg1-l06-i03',
        'alg1-l06-i04',
        'alg1-l06-i05',
        'alg1-l06-i06',
        'alg1-l06-i07',
        'alg1-l06-i08',
        'alg1-l06-i09',
        'alg1-l06-i10',
      ],
    },
  ],
  items: lesson06Items,
}

/* ─── Write outputs ─── */
lesson03.worldHook.unlockOnMastery = ['lesson_board_4']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-03.json', lesson03)
writeJson('lesson-04.json', lesson04)
writeJson('lesson-05.json', lesson05)
writeJson('lesson-06.json', lesson06)

const summary = {
  newKpIds: newKps.map((k) => k.id),
  lessons: [lesson04, lesson05, lesson06].map((l) => ({
    id: l.id,
    totalItems: l.items.length,
    teach: l.sections.find((s) => s.phase === 'teach')?.itemIds?.length ?? 0,
    guided: l.sections.find((s) => s.phase === 'guided')?.itemIds?.length ?? 0,
    independent: l.sections.find((s) => s.phase === 'independent')?.itemIds?.length ?? 0,
    siteId: l.worldHook.siteId,
    unlock: l.worldHook.unlockOnMastery,
  })),
  l3Unlock: lesson03.worldHook.unlockOnMastery,
}
console.log(JSON.stringify(summary, null, 2))
