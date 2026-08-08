/**
 * Wave 3 authoring: Algebra I Lessons 7–9 + KP/standards extensions.
 * Run: node scripts/author-algebra1-l7-l9.mjs
 * Merges into knowledge-points.json / standards-index.json;
 * writes lesson-07..09; confirms L6 unlockOnMastery → lesson_board_7.
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
const lesson06 = JSON.parse(readFileSync(join(outDir, 'lesson-06.json'), 'utf8'))

/* ─── New knowledge points (9) ─── */
const newKps = [
  {
    id: 'kp.alg1.slope.intercept.form',
    title: L(
      'Read slope-intercept form y = mx + b',
      'Leer la forma pendiente-intersección y = mx + b',
      'Odczytywać postać kierunkową y = mx + b',
    ),
    prerequisites: ['kp.alg1.slope.intuition', 'kp.alg1.function.linear.intro'],
    encompassing: ['kp.alg1.slope.intuition'],
    successCriteria: L(
      'Student identifies slope m and y-intercept b from an equation in slope-intercept form.',
      'El estudiante identifica la pendiente m y la intersección b a partir de una ecuación en forma pendiente-intersección.',
      'Uczeń identyfikuje nachylenie m i punkt przecięcia b z równania w postaci kierunkowej.',
    ),
    misconceptions: L(
      [
        'Swapping m and b (treating the constant as slope)',
        'Thinking the coefficient of x is always positive',
      ],
      [
        'Intercambiar m y b (tratar la constante como pendiente)',
        'Pensar que el coeficiente de x siempre es positivo',
      ],
      [
        'Zamiana m i b (traktowanie stałej jako nachylenia)',
        'Myślenie, że współczynnik przy x jest zawsze dodatni',
      ],
    ),
    standards: [
      TX('A.3(C)', 'A.2(B)', 'A.1(D)'),
      CC('8.F.B.3', '8.EE.B.6', 'F-IF.C.7a'),
      CA('8.F.3'),
      FL('MA.912.F.1.2'),
    ],
  },
  {
    id: 'kp.alg1.graph.slope.intercept',
    title: L(
      'Graph lines from slope-intercept form',
      'Graficar rectas desde la forma pendiente-intersección',
      'Rysować proste z postaci kierunkowej',
    ),
    prerequisites: ['kp.alg1.slope.intercept.form'],
    successCriteria: L(
      'Student plots the y-intercept and uses rise/run from slope to graph a line from y = mx + b.',
      'El estudiante marca la intersección con y y usa subida/avance de la pendiente para graficar y = mx + b.',
      'Uczeń zaznacza przecięcie z osią y i używa wzrostu/przebiegu nachylenia, by narysować y = mx + b.',
    ),
    misconceptions: L(
      [
        'Plotting intercept on the x-axis instead of the y-axis',
        'Using run/rise instead of rise/run when stepping the slope',
      ],
      [
        'Marcar la intersección en el eje x en lugar del eje y',
        'Usar avance/subida en lugar de subida/avance al aplicar la pendiente',
      ],
      [
        'Zaznaczanie przecięcia na osi x zamiast osi y',
        'Używanie przebiegu/wzrostu zamiast wzrostu/przebiegu przy nachyleniu',
      ],
    ),
    standards: [
      TX('A.3(C)', 'A.1(C)', 'A.1(D)'),
      CC('8.F.B.3', 'F-IF.C.7a', 'A-REI.D.10'),
      CA('8.F.3'),
      FL('MA.912.F.1.3'),
    ],
  },
  {
    id: 'kp.alg1.intercept.identify',
    title: L(
      'Identify intercepts of a linear graph',
      'Identificar intersecciones de una gráfica lineal',
      'Identyfikować punkty przecięcia wykresu liniowego',
    ),
    prerequisites: ['kp.alg1.slope.intercept.form'],
    successCriteria: L(
      'Student finds y-intercept (and simple x-intercept when asked) from an equation or described graph.',
      'El estudiante halla la intersección con y (y la intersección con x simple cuando se pide) desde una ecuación o gráfica descrita.',
      'Uczeń znajduje przecięcie z osią y (oraz proste przecięcie z osią x, gdy pytają) z równania lub opisanego wykresu.',
    ),
    misconceptions: L(
      [
        'Confusing x-intercept with y-intercept',
        'Setting the wrong variable to zero when finding an intercept',
      ],
      [
        'Confundir intersección con x e intersección con y',
        'Igualar a cero la variable incorrecta al hallar una intersección',
      ],
      [
        'Mylenie przecięcia z osią x i z osią y',
        'Zerowanie złej zmiennej przy szukaniu przecięcia',
      ],
    ),
    standards: [
      TX('A.3(C)', 'A.2(A)', 'A.1(D)'),
      CC('F-IF.C.7a', 'A-REI.D.10', '8.F.B.3'),
      CA('F-IF.7'),
    ],
  },
  {
    id: 'kp.alg1.write.equation.slope.yint',
    title: L(
      'Write y = mx + b from slope and y-intercept',
      'Escribir y = mx + b a partir de pendiente e intersección',
      'Zapisywać y = mx + b z nachylenia i przecięcia z osią y',
    ),
    prerequisites: ['kp.alg1.slope.intercept.form', 'kp.alg1.graph.slope.intercept'],
    successCriteria: L(
      'Student writes a linear equation in slope-intercept form given m and the y-intercept.',
      'El estudiante escribe una ecuación lineal en forma pendiente-intersección dados m y la intersección con y.',
      'Uczeń zapisuje równanie liniowe w postaci kierunkowej mając m i przecięcie z osią y.',
    ),
    misconceptions: L(
      [
        'Writing x = my + b instead of y = mx + b',
        'Putting the intercept next to x as if it were slope',
      ],
      [
        'Escribir x = my + b en lugar de y = mx + b',
        'Poner la intersección junto a x como si fuera pendiente',
      ],
      [
        'Zapisywanie x = my + b zamiast y = mx + b',
        'Umieszczanie przecięcia przy x jakby było nachyleniem',
      ],
    ),
    standards: [
      TX('A.2(B)', 'A.1(A)', 'A.1(D)'),
      CC('8.F.B.4', 'F-LE.A.2', 'A-CED.A.2'),
      CA('8.F.4'),
      FL('MA.912.AR.2.2'),
    ],
  },
  {
    id: 'kp.alg1.write.equation.point.slope',
    title: L(
      'Write linear equations from a point and slope (or two points)',
      'Escribir ecuaciones lineales desde un punto y pendiente (o dos puntos)',
      'Zapisywać równania liniowe z punktu i nachylenia (lub dwóch punktów)',
    ),
    prerequisites: ['kp.alg1.write.equation.slope.yint', 'kp.alg1.slope.intuition'],
    encompassing: ['kp.alg1.write.equation.slope.yint'],
    successCriteria: L(
      'Student finds slope between two points when needed, then builds y = mx + b using a known point to solve for b.',
      'El estudiante halla la pendiente entre dos puntos cuando hace falta, luego construye y = mx + b usando un punto conocido para hallar b.',
      'Uczeń wyznacza nachylenie między dwoma punktami w razie potrzeby, potem buduje y = mx + b używając znanego punktu do znalezienia b.',
    ),
    misconceptions: L(
      [
        'Using slope formula with swapped Δx/Δy',
        'Forgetting to solve for b after substituting a point',
      ],
      [
        'Usar la fórmula de pendiente con Δx/Δy intercambiados',
        'Olvidar resolver b después de sustituir un punto',
      ],
      [
        'Używanie wzoru na nachylenie z zamienionymi Δx/Δy',
        'Zapominanie o obliczeniu b po podstawieniu punktu',
      ],
    ),
    standards: [
      TX('A.2(C)', 'A.3(A)', 'A.1(B)'),
      CC('8.F.B.4', 'F-LE.A.2', 'A-CED.A.2'),
      CA('8.F.4'),
      FL('MA.912.AR.2.2'),
    ],
  },
  {
    id: 'kp.alg1.parallel.slope',
    title: L(
      'Recognize parallel lines by equal slopes',
      'Reconocer rectas paralelas por pendientes iguales',
      'Rozpoznawać proste równoległe po równych nachyleniach',
    ),
    prerequisites: ['kp.alg1.slope.intercept.form', 'kp.alg1.write.equation.slope.yint'],
    successCriteria: L(
      'Student explains that non-vertical parallel lines have equal slopes and writes a parallel line through a given point.',
      'El estudiante explica que rectas paralelas no verticales tienen pendientes iguales y escribe una paralela por un punto dado.',
      'Uczeń wyjaśnia, że nierównoległe do osi y proste równoległe mają równe nachylenia i zapisuje prostą równoległą przez dany punkt.',
    ),
    misconceptions: L(
      [
        'Thinking parallel lines must share the same y-intercept',
        'Confusing parallel (same slope) with perpendicular (negative reciprocal)',
      ],
      [
        'Pensar que las paralelas deben compartir la misma intersección con y',
        'Confundir paralelas (misma pendiente) con perpendiculares (recíproco negativo)',
      ],
      [
        'Myślenie, że równoległe muszą mieć to samo przecięcie z osią y',
        'Mylenie równoległych (to samo nachylenie) z prostopadłymi (ujemna odwrotność)',
      ],
    ),
    standards: [
      TX('A.2(E)', 'A.2(B)', 'A.1(D)'),
      CC('8.EE.B.6', 'G-GPE.B.5', 'F-LE.A.2'),
      CA('8.EE.6'),
      FL('MA.912.GR.1.1'),
    ],
  },
  {
    id: 'kp.alg1.systems.meaning',
    title: L(
      'Interpret a solution of a linear system',
      'Interpretar una solución de un sistema lineal',
      'Interpretować rozwiązanie układu równań liniowych',
    ),
    prerequisites: ['kp.alg1.graph.slope.intercept', 'kp.alg1.equation.meaning'],
    successCriteria: L(
      'Student states that a solution to a two-equation system is an ordered pair that satisfies both equations (graphically: intersection).',
      'El estudiante afirma que una solución de un sistema de dos ecuaciones es un par ordenado que satisface ambas (gráficamente: intersección).',
      'Uczeń stwierdza, że rozwiązanie układu dwóch równań to para uporządkowana spełniająca oba (graficznie: punkt przecięcia).',
    ),
    misconceptions: L(
      [
        'Thinking any point on one line solves the system',
        'Confusing “no solution” with “infinitely many solutions”',
      ],
      [
        'Pensar que cualquier punto de una recta resuelve el sistema',
        'Confundir “sin solución” con “infinitas soluciones”',
      ],
      [
        'Myślenie, że dowolny punkt jednej prostej rozwiązuje układ',
        'Mylenie „brak rozwiązań” z „nieskończenie wiele rozwiązań”',
      ],
    ),
    standards: [
      TX('A.2(I)', 'A.3(F)', 'A.1(D)'),
      CC('8.EE.C.8a', 'A-REI.C.6', 'A-REI.D.11'),
      CA('8.EE.8'),
      FL('MA.912.AR.1.1'),
    ],
  },
  {
    id: 'kp.alg1.systems.graphical',
    title: L(
      'Solve systems by graphing (intersection)',
      'Resolver sistemas graficando (intersección)',
      'Rozwiązywać układy przez rysowanie (przecięcie)',
    ),
    prerequisites: ['kp.alg1.systems.meaning', 'kp.alg1.graph.slope.intercept'],
    successCriteria: L(
      'Student estimates or identifies the intersection point of two graphed lines as the system solution when it exists.',
      'El estudiante estima o identifica el punto de intersección de dos rectas graficadas como solución del sistema cuando existe.',
      'Uczeń szacuje lub identyfikuje punkt przecięcia dwóch narysowanych prostych jako rozwiązanie układu, gdy istnieje.',
    ),
    misconceptions: L(
      [
        'Reading only the x- or only the y-coordinate of the intersection',
        'Assuming parallel-looking lines always intersect somewhere off the grid',
      ],
      [
        'Leer solo la coordenada x o solo la y de la intersección',
        'Asumir que rectas que parecen paralelas siempre se intersectan fuera de la cuadrícula',
      ],
      [
        'Odczytywanie tylko współrzędnej x lub tylko y przecięcia',
        'Zakładanie, że „prawie równoległe” zawsze przecinają się poza siatką',
      ],
    ),
    standards: [
      TX('A.3(F)', 'A.2(I)', 'A.1(C)'),
      CC('8.EE.C.8a', '8.EE.C.8b', 'A-REI.D.11'),
      CA('8.EE.8'),
      FL('MA.912.AR.1.2'),
    ],
  },
  {
    id: 'kp.alg1.systems.substitution',
    title: L(
      'Solve systems by substitution (intro)',
      'Resolver sistemas por sustitución (intro)',
      'Rozwiązywać układy metodą podstawiania (wstęp)',
    ),
    prerequisites: ['kp.alg1.systems.meaning', 'kp.alg1.solve.two.step'],
    successCriteria: L(
      'Student substitutes an isolated expression from one equation into the other, solves for one variable, then back-substitutes.',
      'El estudiante sustituye una expresión aislada de una ecuación en la otra, resuelve una variable y luego sustituye de vuelta.',
      'Uczeń podstawia wyizolowane wyrażenie z jednego równania do drugiego, rozwiązuje jedną zmienną, potem podstawia z powrotem.',
    ),
    misconceptions: L(
      [
        'Substituting into the same equation instead of the other',
        'Stopping after finding one variable and forgetting the pair',
      ],
      [
        'Sustituir en la misma ecuación en lugar de la otra',
        'Detenerse tras hallar una variable y olvidar el par',
      ],
      [
        'Podstawianie do tego samego równania zamiast do drugiego',
        'Zatrzymanie się po jednej zmiennej i zapominanie o parze',
      ],
    ),
    standards: [
      TX('A.5(C)', 'A.2(I)', 'A.1(B)'),
      CC('8.EE.C.8b', '8.EE.C.8c', 'A-REI.C.6'),
      CA('8.EE.8b'),
      FL('MA.912.AR.1.3'),
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

addKpsToExisting('TX', 'A.2(A)', ['kp.alg1.intercept.identify'])
addKpsToExisting('TX', 'A.3(A)', ['kp.alg1.write.equation.point.slope'])
addKpsToExisting('TX', 'A.1(D)', [
  'kp.alg1.slope.intercept.form',
  'kp.alg1.graph.slope.intercept',
  'kp.alg1.intercept.identify',
  'kp.alg1.write.equation.slope.yint',
  'kp.alg1.parallel.slope',
  'kp.alg1.systems.meaning',
])
addKpsToExisting('TX', 'A.1(B)', [
  'kp.alg1.write.equation.point.slope',
  'kp.alg1.systems.substitution',
])
addKpsToExisting('TX', 'A.1(A)', ['kp.alg1.write.equation.slope.yint'])
addKpsToExisting('CCSS', '8.F.B.4', [
  'kp.alg1.write.equation.slope.yint',
  'kp.alg1.write.equation.point.slope',
])
addKpsToExisting('CCSS', '8.EE.B.6', [
  'kp.alg1.slope.intercept.form',
  'kp.alg1.parallel.slope',
])
addKpsToExisting('CCSS', 'F-LE.A.2', [
  'kp.alg1.write.equation.slope.yint',
  'kp.alg1.write.equation.point.slope',
  'kp.alg1.parallel.slope',
])

ensureCode(
  'TX',
  'A.2(B)',
  L(
    'Write linear equations in two variables in various forms, including y = mx + b, given slope and y-intercept',
    'Escribir ecuaciones lineales en dos variables en varias formas, incluida y = mx + b, dados pendiente e intersección con y',
    'Zapisywać równania liniowe dwóch zmiennych w różnych postaciach, w tym y = mx + b, mając nachylenie i przecięcie z osią y',
  ),
  [
    'kp.alg1.slope.intercept.form',
    'kp.alg1.write.equation.slope.yint',
    'kp.alg1.parallel.slope',
  ],
)
ensureCode(
  'TX',
  'A.2(C)',
  L(
    'Write linear equations in two variables given a table of values, a graph, and a verbal description',
    'Escribir ecuaciones lineales en dos variables dadas una tabla, una gráfica y una descripción verbal',
    'Zapisywać równania liniowe dwóch zmiennych z tabeli, wykresu i opisu słownego',
  ),
  ['kp.alg1.write.equation.point.slope'],
)
ensureCode(
  'TX',
  'A.2(E)',
  L(
    'Write the equation of a line that contains a given point and is parallel to a given line',
    'Escribir la ecuación de una recta que contiene un punto dado y es paralela a una recta dada',
    'Zapisywać równanie prostej przechodzącej przez dany punkt i równoległej do danej prostej',
  ),
  ['kp.alg1.parallel.slope'],
)
ensureCode(
  'TX',
  'A.2(I)',
  L(
    'Write systems of two linear equations given a table of values, a graph, and a verbal description',
    'Escribir sistemas de dos ecuaciones lineales dados una tabla, una gráfica y una descripción verbal',
    'Zapisywać układy dwóch równań liniowych z tabeli, wykresu i opisu słownego',
  ),
  [
    'kp.alg1.systems.meaning',
    'kp.alg1.systems.graphical',
    'kp.alg1.systems.substitution',
  ],
)
ensureCode(
  'TX',
  'A.3(C)',
  L(
    'Graph linear functions on the coordinate plane and identify key features including x-intercept, y-intercept, zeros, and slope',
    'Graficar funciones lineales en el plano y identificar características clave: intersecciones, ceros y pendiente',
    'Rysować funkcje liniowe na płaszczyźnie i identyfikować cechy kluczowe: przecięcia, zera i nachylenie',
  ),
  [
    'kp.alg1.slope.intercept.form',
    'kp.alg1.graph.slope.intercept',
    'kp.alg1.intercept.identify',
  ],
)
ensureCode(
  'TX',
  'A.3(F)',
  L(
    'Graph systems of two linear equations in two variables on the coordinate plane and determine the solutions if they exist',
    'Graficar sistemas de dos ecuaciones lineales en dos variables y determinar las soluciones si existen',
    'Rysować układy dwóch równań liniowych dwóch zmiennych i wyznaczać rozwiązania, jeśli istnieją',
  ),
  ['kp.alg1.systems.meaning', 'kp.alg1.systems.graphical'],
)
ensureCode(
  'TX',
  'A.5(C)',
  L(
    'Solve systems of two linear equations with two variables for mathematical and real-world problems',
    'Resolver sistemas de dos ecuaciones lineales con dos variables en problemas matemáticos y del mundo real',
    'Rozwiązywać układy dwóch równań liniowych dwóch zmiennych w zadaniach matematycznych i rzeczywistych',
  ),
  ['kp.alg1.systems.substitution', 'kp.alg1.systems.graphical'],
)
ensureCode(
  'TX',
  'A.1(C)',
  L(
    'Determine tools, including real objects, manipulatives, technology, and techniques, including mental math, estimation, and number sense as appropriate',
    'Determinar herramientas y técnicas apropiadas, incluyendo estimación y sentido numérico',
    'Dobierać narzędzia i techniki, w tym szacowanie i wyczucie liczb',
  ),
  ['kp.alg1.graph.slope.intercept', 'kp.alg1.systems.graphical'],
)

ensureCode(
  'CCSS',
  '8.F.B.3',
  L(
    'Interpret the equation y = mx + b as defining a linear function whose graph is a straight line',
    'Interpretar la ecuación y = mx + b como una función lineal cuyo gráfico es una recta',
    'Interpretować równanie y = mx + b jako funkcję liniową o wykresie będącym prostą',
  ),
  [
    'kp.alg1.slope.intercept.form',
    'kp.alg1.graph.slope.intercept',
    'kp.alg1.intercept.identify',
  ],
)
ensureCode(
  'CCSS',
  '8.EE.B.6',
  L(
    'Use similar triangles to explain slope and derive y = mx + b',
    'Usar triángulos semejantes para explicar la pendiente y derivar y = mx + b',
    'Używać trójkątów podobnych do wyjaśnienia nachylenia i wyprowadzenia y = mx + b',
  ),
  ['kp.alg1.slope.intercept.form', 'kp.alg1.parallel.slope'],
)
ensureCode(
  'CCSS',
  'F-IF.C.7a',
  L(
    'Graph linear functions and show intercepts',
    'Graficar funciones lineales y mostrar intersecciones',
    'Rysować funkcje liniowe i pokazywać przecięcia',
  ),
  [
    'kp.alg1.slope.intercept.form',
    'kp.alg1.graph.slope.intercept',
    'kp.alg1.intercept.identify',
  ],
)
ensureCode(
  'CCSS',
  'A-REI.D.10',
  L(
    'Understand that the graph of an equation in two variables is the set of all its solutions',
    'Comprender que la gráfica de una ecuación en dos variables es el conjunto de todas sus soluciones',
    'Rozumieć, że wykres równania dwóch zmiennych to zbiór wszystkich jego rozwiązań',
  ),
  ['kp.alg1.graph.slope.intercept', 'kp.alg1.intercept.identify'],
)
ensureCode(
  'CCSS',
  'F-LE.A.2',
  L(
    'Construct linear and exponential functions given a graph, description, or two input-output pairs',
    'Construir funciones lineales y exponenciales dadas una gráfica, descripción o dos pares entrada-salida',
    'Konstruować funkcje liniowe i wykładnicze z wykresu, opisu lub dwóch par argument–wartość',
  ),
  [
    'kp.alg1.write.equation.slope.yint',
    'kp.alg1.write.equation.point.slope',
    'kp.alg1.parallel.slope',
  ],
)
ensureCode(
  'CCSS',
  'A-CED.A.2',
  L(
    'Create equations in two or more variables to represent relationships between quantities',
    'Crear ecuaciones en dos o más variables para representar relaciones entre cantidades',
    'Tworzyć równania dwóch lub więcej zmiennych reprezentujące zależności między wielkościami',
  ),
  ['kp.alg1.write.equation.slope.yint', 'kp.alg1.write.equation.point.slope'],
)
ensureCode(
  'CCSS',
  'G-GPE.B.5',
  L(
    'Prove the slope criteria for parallel and perpendicular lines and use them to solve problems',
    'Demostrar criterios de pendiente para paralelas y perpendiculares y usarlos para resolver problemas',
    'Udowadniać kryteria nachylenia dla równoległych i prostopadłych oraz stosować je w zadaniach',
  ),
  ['kp.alg1.parallel.slope'],
)
ensureCode(
  'CCSS',
  '8.EE.C.8a',
  L(
    'Understand that solutions to a system of two linear equations correspond to points of intersection',
    'Comprender que las soluciones de un sistema de dos ecuaciones lineales corresponden a puntos de intersección',
    'Rozumieć, że rozwiązania układu dwóch równań liniowych odpowiadają punktom przecięcia',
  ),
  ['kp.alg1.systems.meaning', 'kp.alg1.systems.graphical'],
)
ensureCode(
  'CCSS',
  '8.EE.C.8b',
  L(
    'Solve systems of two linear equations algebraically and estimate solutions by graphing',
    'Resolver sistemas de dos ecuaciones lineales algebraicamente y estimar soluciones graficando',
    'Rozwiązywać układy dwóch równań liniowych algebraicznie i szacować rozwiązania z wykresu',
  ),
  ['kp.alg1.systems.graphical', 'kp.alg1.systems.substitution'],
)
ensureCode(
  'CCSS',
  '8.EE.C.8c',
  L(
    'Solve real-world and mathematical problems leading to two linear equations in two variables',
    'Resolver problemas del mundo real y matemáticos que conduzcan a dos ecuaciones lineales en dos variables',
    'Rozwiązywać problemy rzeczywiste i matematyczne prowadzące do dwóch równań liniowych dwóch zmiennych',
  ),
  ['kp.alg1.systems.substitution'],
)
ensureCode(
  'CCSS',
  'A-REI.C.6',
  L(
    'Solve systems of linear equations exactly and approximately',
    'Resolver sistemas de ecuaciones lineales exacta y aproximadamente',
    'Rozwiązywać układy równań liniowych dokładnie i przybliżeniem',
  ),
  ['kp.alg1.systems.meaning', 'kp.alg1.systems.substitution'],
)
ensureCode(
  'CCSS',
  'A-REI.D.11',
  L(
    'Explain why the x-coordinates of the intersection points are solutions to f(x) = g(x)',
    'Explicar por qué las coordenadas x de los puntos de intersección son soluciones de f(x) = g(x)',
    'Wyjaśniać, dlaczego współrzędne x punktów przecięcia są rozwiązaniami f(x) = g(x)',
  ),
  ['kp.alg1.systems.meaning', 'kp.alg1.systems.graphical'],
)

existingStd.lessonCoverage['alg1-l07'] = [
  'A.3(C)',
  'A.2(B)',
  'A.2(A)',
  'A.1(C)',
  'A.1(D)',
  '8.F.B.3',
  '8.EE.B.6',
  'F-IF.C.7a',
  'A-REI.D.10',
]
existingStd.lessonCoverage['alg1-l08'] = [
  'A.2(B)',
  'A.2(C)',
  'A.2(E)',
  'A.3(A)',
  'A.1(A)',
  'A.1(B)',
  'A.1(D)',
  '8.F.B.4',
  'F-LE.A.2',
  'A-CED.A.2',
  '8.EE.B.6',
  'G-GPE.B.5',
]
existingStd.lessonCoverage['alg1-l09'] = [
  'A.2(I)',
  'A.3(F)',
  'A.5(C)',
  'A.1(B)',
  'A.1(C)',
  'A.1(D)',
  '8.EE.C.8a',
  '8.EE.C.8b',
  '8.EE.C.8c',
  'A-REI.C.6',
  'A-REI.D.11',
]

/* ─── Shared standards for items ─── */
const l7Form = [TX('A.3(C)', 'A.2(B)', 'A.1(D)'), CC('8.F.B.3', '8.EE.B.6', 'F-IF.C.7a')]
const l7Graph = [TX('A.3(C)', 'A.1(C)', 'A.1(D)'), CC('8.F.B.3', 'F-IF.C.7a', 'A-REI.D.10')]
const l7Int = [TX('A.3(C)', 'A.2(A)', 'A.1(D)'), CC('F-IF.C.7a', 'A-REI.D.10', '8.F.B.3')]

const l8Yint = [TX('A.2(B)', 'A.1(A)', 'A.1(D)'), CC('8.F.B.4', 'F-LE.A.2', 'A-CED.A.2')]
const l8Point = [TX('A.2(C)', 'A.3(A)', 'A.1(B)'), CC('8.F.B.4', 'F-LE.A.2', 'A-CED.A.2')]
const l8Par = [TX('A.2(E)', 'A.2(B)', 'A.1(D)'), CC('8.EE.B.6', 'G-GPE.B.5', 'F-LE.A.2')]

const l9Mean = [TX('A.2(I)', 'A.3(F)', 'A.1(D)'), CC('8.EE.C.8a', 'A-REI.C.6', 'A-REI.D.11')]
const l9Graph = [TX('A.3(F)', 'A.2(I)', 'A.1(C)'), CC('8.EE.C.8a', '8.EE.C.8b', 'A-REI.D.11')]
const l9Sub = [TX('A.5(C)', 'A.2(I)', 'A.1(B)'), CC('8.EE.C.8b', '8.EE.C.8c', 'A-REI.C.6')]

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
   LESSON 7 — Slope-intercept & graphing
   ═══════════════════════════════════════ */
const l7Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.slope.intercept.form',
    diff: 0.25,
    b: -1.1,
    prompt: L(
      'In slope-intercept form, which letter is the slope?',
      'En la forma pendiente-intersección, ¿qué letra es la pendiente?',
      'W postaci kierunkowej, która litera to nachylenie?',
    ),
    math: 'y = mx + b',
    choices0: L(
      ['m', 'b', 'y', 'x'],
      ['m', 'b', 'y', 'x'],
      ['m', 'b', 'y', 'x'],
    ),
    fc: L('m is the slope (rate of change).', 'm es la pendiente (tasa de cambio).', 'm to nachylenie (stopa zmian).'),
    fi: L('Remember y = mx + b: m = slope, b = y-intercept.', 'Recuerda y = mx + b: m = pendiente, b = intersección con y.', 'Pamiętaj y = mx + b: m = nachylenie, b = przecięcie z osią y.'),
    tags: ['swap_m_b'],
    stds: l7Form,
  },
  {
    id: 't02',
    kp: 'kp.alg1.graph.slope.intercept',
    diff: 0.3,
    b: -0.9,
    prompt: L(
      'To graph y = 2x − 1, where do you start?',
      'Para graficar y = 2x − 1, ¿dónde empiezas?',
      'Aby narysować y = 2x − 1, od czego zaczynasz?',
    ),
    math: 'y = 2x - 1',
    choices0: L(
      ['Plot (0, −1), then rise 2 / run 1', 'Plot (0, 2), then rise −1 / run 1', 'Plot (−1, 0), then rise 2 / run 1', 'Plot (2, −1) only'],
      ['Marca (0, −1), luego sube 2 / avanza 1', 'Marca (0, 2), luego sube −1 / avanza 1', 'Marca (−1, 0), luego sube 2 / avanza 1', 'Solo marca (2, −1)'],
      ['Zaznacz (0, −1), potem wzrost 2 / przebieg 1', 'Zaznacz (0, 2), potem wzrost −1 / przebieg 1', 'Zaznacz (−1, 0), potem wzrost 2 / przebieg 1', 'Tylko zaznacz (2, −1)'],
    ),
    fc: L('b = −1 is the y-intercept; m = 2 means rise 2, run 1.', 'b = −1 es la intersección con y; m = 2 significa subir 2, avanzar 1.', 'b = −1 to przecięcie z osią y; m = 2 oznacza wzrost 2, przebieg 1.'),
    fi: L('Start at the y-intercept (0, b), then apply rise/run from m.', 'Empieza en la intersección con y (0, b), luego aplica subida/avance de m.', 'Zacznij od przecięcia z osią y (0, b), potem zastosuj wzrost/przebieg z m.'),
    tags: ['wrong_intercept', 'run_rise_swap'],
    stds: l7Graph,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.slope.intercept.form',
    diff: 0.35,
    b: -0.6,
    prompt: L('What is the slope of y = −3x + 4?', '¿Cuál es la pendiente de y = −3x + 4?', 'Jakie jest nachylenie y = −3x + 4?'),
    math: 'y = -3x + 4',
    choices0: L(['−3', '4', '3', '−4'], ['−3', '4', '3', '−4'], ['−3', '4', '3', '−4']),
    latex: '-3',
    num: -3,
    fc: L('m = −3 (coefficient of x).', 'm = −3 (coeficiente de x).', 'm = −3 (współczynnik przy x).'),
    fi: L('In y = mx + b, slope is m = −3, not the constant 4.', 'En y = mx + b, la pendiente es m = −3, no la constante 4.', 'W y = mx + b nachylenie to m = −3, nie stała 4.'),
    tags: ['swap_m_b', 'drop_sign'],
    stds: l7Form,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.intercept.identify',
    diff: 0.35,
    b: -0.5,
    prompt: L('What is the y-intercept of y = (1/2)x − 5?', '¿Cuál es la intersección con y de y = (1/2)x − 5?', 'Jakie jest przecięcie z osią y dla y = (1/2)x − 5?'),
    math: 'y = \\frac{1}{2}x - 5',
    choices0: L(['−5', '1/2', '5', '0'], ['−5', '1/2', '5', '0'], ['−5', '1/2', '5', '0']),
    latex: '-5',
    num: -5,
    fc: L('b = −5, so the graph crosses the y-axis at (0, −5).', 'b = −5, así que la gráfica corta el eje y en (0, −5).', 'b = −5, więc wykres przecina oś y w (0, −5).'),
    fi: L('The y-intercept is b in y = mx + b — here b = −5.', 'La intersección con y es b en y = mx + b — aquí b = −5.', 'Przecięcie z osią y to b w y = mx + b — tu b = −5.'),
    tags: ['swap_m_b', 'drop_sign'],
    stds: l7Int,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.graph.slope.intercept',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'From (0, 3) with slope −1, which next point is on the line?',
      'Desde (0, 3) con pendiente −1, ¿qué siguiente punto está en la recta?',
      'Z (0, 3) przy nachyleniu −1, który następny punkt leży na prostej?',
    ),
    choices0: L(
      ['(1, 2)', '(1, 4)', '(−1, 2)', '(1, 3)'],
      ['(1, 2)', '(1, 4)', '(−1, 2)', '(1, 3)'],
      ['(1, 2)', '(1, 4)', '(−1, 2)', '(1, 3)'],
    ),
    fc: L('Slope −1 = rise −1 / run 1 → from (0, 3) to (1, 2).', 'Pendiente −1 = subir −1 / avanzar 1 → de (0, 3) a (1, 2).', 'Nachylenie −1 = wzrost −1 / przebieg 1 → z (0, 3) do (1, 2).'),
    fi: L('Negative slope: as x increases by 1, y decreases by 1.', 'Pendiente negativa: si x aumenta 1, y disminuye 1.', 'Ujemne nachylenie: gdy x rośnie o 1, y maleje o 1.'),
    tags: ['wrong_direction', 'run_rise_swap'],
    stds: l7Graph,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.slope.intercept.form',
    diff: 0.4,
    b: -0.2,
    prompt: L('Rewrite 2x + y = 7 in slope-intercept form.', 'Reescribe 2x + y = 7 en forma pendiente-intersección.', 'Zapisz 2x + y = 7 w postaci kierunkowej.'),
    math: '2x + y = 7',
    choices0: L(
      ['y = −2x + 7', 'y = 2x + 7', 'y = −2x − 7', 'x = −2y + 7'],
      ['y = −2x + 7', 'y = 2x + 7', 'y = −2x − 7', 'x = −2y + 7'],
      ['y = −2x + 7', 'y = 2x + 7', 'y = −2x − 7', 'x = −2y + 7'],
    ),
    latex: 'y = -2x + 7',
    fc: L('Subtract 2x: y = −2x + 7.', 'Resta 2x: y = −2x + 7.', 'Odejmij 2x: y = −2x + 7.'),
    fi: L('Isolate y: y = 7 − 2x = −2x + 7.', 'Aísla y: y = 7 − 2x = −2x + 7.', 'Wyizoluj y: y = 7 − 2x = −2x + 7.'),
    tags: ['sign_error', 'not_solved_for_y'],
    stds: l7Form,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.intercept.identify',
    diff: 0.45,
    b: 0,
    prompt: L(
      'For y = 3x − 6, what is the x-intercept?',
      'Para y = 3x − 6, ¿cuál es la intersección con x?',
      'Dla y = 3x − 6, jakie jest przecięcie z osią x?',
    ),
    math: 'y = 3x - 6',
    choices0: L(['2', '−6', '−2', '6'], ['2', '−6', '−2', '6'], ['2', '−6', '−2', '6']),
    latex: '2',
    num: 2,
    fc: L('Set y = 0: 0 = 3x − 6 → x = 2.', 'Pon y = 0: 0 = 3x − 6 → x = 2.', 'Ustaw y = 0: 0 = 3x − 6 → x = 2.'),
    fi: L('x-intercept: set y = 0 and solve for x. Do not report b.', 'Intersección con x: pon y = 0 y resuelve x. No reportes b.', 'Przecięcie z osią x: y = 0 i rozwiąż x. Nie podawaj b.'),
    tags: ['report_b', 'wrong_zero'],
    stds: l7Int,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.slope.intercept.form',
    diff: 0.4,
    b: -0.2,
    prompt: L('Slope and y-intercept of y = 5x?', '¿Pendiente e intersección con y de y = 5x?', 'Nachylenie i przecięcie z osią y dla y = 5x?'),
    math: 'y = 5x',
    choices0: L(
      ['m = 5, b = 0', 'm = 0, b = 5', 'm = 5, b = 5', 'm = −5, b = 0'],
      ['m = 5, b = 0', 'm = 0, b = 5', 'm = 5, b = 5', 'm = −5, b = 0'],
      ['m = 5, b = 0', 'm = 0, b = 5', 'm = 5, b = 5', 'm = −5, b = 0'],
    ),
    fc: L('y = 5x + 0 → m = 5, b = 0 (through the origin).', 'y = 5x + 0 → m = 5, b = 0 (pasa por el origen).', 'y = 5x + 0 → m = 5, b = 0 (przez początek układu).'),
    fi: L('Missing + b means b = 0.', 'Si falta + b, entonces b = 0.', 'Brak + b oznacza b = 0.'),
    tags: ['swap_m_b', 'assume_b_equals_m'],
    stds: l7Form,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.graph.slope.intercept',
    diff: 0.45,
    b: 0,
    prompt: L(
      'Which point is on y = −x + 4?',
      '¿Qué punto está en y = −x + 4?',
      'Który punkt leży na y = −x + 4?',
    ),
    math: 'y = -x + 4',
    choices0: L(
      ['(1, 3)', '(1, 5)', '(4, 0) is false? wait', '(2, 1)'],
      ['(1, 3)', '(1, 5)', '(0, −4)', '(2, 1)'],
      ['(1, 3)', '(1, 5)', '(0, −4)', '(2, 1)'],
    ),
    fc: L('When x = 1, y = −1 + 4 = 3.', 'Cuando x = 1, y = −1 + 4 = 3.', 'Gdy x = 1, y = −1 + 4 = 3.'),
    fi: L('Substitute x into the rule and check y.', 'Sustituye x en la regla y comprueba y.', 'Podstaw x do reguły i sprawdź y.'),
    tags: ['arithmetic_error', 'wrong_intercept'],
    stds: l7Graph,
  },
]

// Fix i02 EN distractor that had a bad string - rewrite cleanly in array below via patch after build
l7Specs[8].choices0 = L(
  ['(1, 3)', '(1, 5)', '(0, −4)', '(2, 1)'],
  ['(1, 3)', '(1, 5)', '(0, −4)', '(2, 1)'],
  ['(1, 3)', '(1, 5)', '(0, −4)', '(2, 1)'],
)

l7Specs.push(
  {
    id: 'i03',
    kp: 'kp.alg1.intercept.identify',
    diff: 0.45,
    b: 0.1,
    prompt: L('y-intercept of y = −(2/3)x + 1?', '¿Intersección con y de y = −(2/3)x + 1?', 'Przecięcie z osią y dla y = −(2/3)x + 1?'),
    math: 'y = -\\frac{2}{3}x + 1',
    choices0: L(['1', '−2/3', '−1', '2/3'], ['1', '−2/3', '−1', '2/3'], ['1', '−2/3', '−1', '2/3']),
    latex: '1',
    num: 1,
    fc: L('b = 1 → (0, 1).', 'b = 1 → (0, 1).', 'b = 1 → (0, 1).'),
    fi: L('Read the constant term b, not the slope −2/3.', 'Lee el término constante b, no la pendiente −2/3.', 'Odczytaj stałą b, nie nachylenie −2/3.'),
    tags: ['swap_m_b'],
    stds: l7Int,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.graph.slope.intercept',
    diff: 0.5,
    b: 0.2,
    prompt: L(
      'Line through (0, −2) with slope 3: which equation?',
      'Recta por (0, −2) con pendiente 3: ¿qué ecuación?',
      'Prosta przez (0, −2) o nachyleniu 3: które równanie?',
    ),
    choices0: L(
      ['y = 3x − 2', 'y = −2x + 3', 'y = 3x + 2', 'y = 2x − 3'],
      ['y = 3x − 2', 'y = −2x + 3', 'y = 3x + 2', 'y = 2x − 3'],
      ['y = 3x − 2', 'y = −2x + 3', 'y = 3x + 2', 'y = 2x − 3'],
    ),
    latex: 'y = 3x - 2',
    fc: L('m = 3 and b = −2 → y = 3x − 2.', 'm = 3 y b = −2 → y = 3x − 2.', 'm = 3 i b = −2 → y = 3x − 2.'),
    fi: L('(0, −2) is the y-intercept, so b = −2 with slope 3.', '(0, −2) es la intersección con y, así b = −2 con pendiente 3.', '(0, −2) to przecięcie z osią y, więc b = −2 przy nachyleniu 3.'),
    tags: ['swap_m_b', 'sign_error'],
    stds: l7Graph,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.slope.intercept.form',
    diff: 0.5,
    b: 0.25,
    prompt: L('Convert x − 4y = 8 to slope-intercept form.', 'Convierte x − 4y = 8 a forma pendiente-intersección.', 'Przekształć x − 4y = 8 do postaci kierunkowej.'),
    math: 'x - 4y = 8',
    choices0: L(
      ['y = \\frac{1}{4}x - 2', 'y = 4x - 8', 'y = -\\frac{1}{4}x - 2', 'y = \\frac{1}{4}x + 2'],
      ['y = \\frac{1}{4}x - 2', 'y = 4x - 8', 'y = -\\frac{1}{4}x - 2', 'y = \\frac{1}{4}x + 2'],
      ['y = \\frac{1}{4}x - 2', 'y = 4x - 8', 'y = -\\frac{1}{4}x - 2', 'y = \\frac{1}{4}x + 2'],
    ),
    latex: 'y = \\frac{1}{4}x - 2',
    fc: L('−4y = −x + 8 → y = (1/4)x − 2.', '−4y = −x + 8 → y = (1/4)x − 2.', '−4y = −x + 8 → y = (1/4)x − 2.'),
    fi: L('Solve carefully for y; divide every term by −4.', 'Resuelve con cuidado para y; divide cada término por −4.', 'Ostrożnie rozwiąż względem y; podziel każdy wyraz przez −4.'),
    tags: ['sign_error', 'divide_error'],
    stds: l7Form,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.intercept.identify',
    diff: 0.55,
    b: 0.35,
    prompt: L('x-intercept of y = −2x + 8?', '¿Intersección con x de y = −2x + 8?', 'Przecięcie z osią x dla y = −2x + 8?'),
    math: 'y = -2x + 8',
    choices0: L(['4', '8', '−4', '−2'], ['4', '8', '−4', '−2'], ['4', '8', '−4', '−2']),
    latex: '4',
    num: 4,
    fc: L('0 = −2x + 8 → 2x = 8 → x = 4.', '0 = −2x + 8 → 2x = 8 → x = 4.', '0 = −2x + 8 → 2x = 8 → x = 4.'),
    fi: L('Set y = 0; do not confuse with y-intercept 8.', 'Pon y = 0; no confundas con la intersección con y = 8.', 'Ustaw y = 0; nie myl z przecięciem z osią y = 8.'),
    tags: ['report_b', 'sign_error'],
    stds: l7Int,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.graph.slope.intercept',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'From (0, 1) with slope 1/2, a second point is…',
      'Desde (0, 1) con pendiente 1/2, un segundo punto es…',
      'Z (0, 1) przy nachyleniu 1/2 drugi punkt to…',
    ),
    choices0: L(
      ['(2, 2)', '(1, 2)', '(2, 0)', '(1/2, 1)'],
      ['(2, 2)', '(1, 2)', '(2, 0)', '(1/2, 1)'],
      ['(2, 2)', '(1, 2)', '(2, 0)', '(1/2, 1)'],
    ),
    fc: L('Rise 1 / run 2 → (0, 1) to (2, 2).', 'Subir 1 / avanzar 2 → de (0, 1) a (2, 2).', 'Wzrost 1 / przebieg 2 → z (0, 1) do (2, 2).'),
    fi: L('m = 1/2 means rise 1 when run is 2.', 'm = 1/2 significa subir 1 cuando el avance es 2.', 'm = 1/2 oznacza wzrost 1 przy przebiegu 2.'),
    tags: ['run_rise_swap', 'fraction_error'],
    stds: l7Graph,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.slope.intercept.form',
    diff: 0.55,
    b: 0.4,
    prompt: L('Which equation has slope 0 and y-intercept 5?', '¿Qué ecuación tiene pendiente 0 e intersección con y = 5?', 'Które równanie ma nachylenie 0 i przecięcie z osią y = 5?'),
    choices0: L(
      ['y = 5', 'y = 5x', 'x = 5', 'y = x + 5'],
      ['y = 5', 'y = 5x', 'x = 5', 'y = x + 5'],
      ['y = 5', 'y = 5x', 'x = 5', 'y = x + 5'],
    ),
    latex: 'y = 5',
    fc: L('Horizontal line: m = 0, y = 5.', 'Recta horizontal: m = 0, y = 5.', 'Prosta pozioma: m = 0, y = 5.'),
    fi: L('Slope 0 → horizontal line y = b.', 'Pendiente 0 → recta horizontal y = b.', 'Nachylenie 0 → prosta pozioma y = b.'),
    tags: ['vertical_vs_horizontal', 'nonzero_slope'],
    stds: l7Form,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.intercept.identify',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'A line crosses the y-axis at −3 and has slope 2. Equation?',
      'Una recta corta el eje y en −3 y tiene pendiente 2. ¿Ecuación?',
      'Prosta przecina oś y w −3 i ma nachylenie 2. Równanie?',
    ),
    choices0: L(
      ['y = 2x − 3', 'y = −3x + 2', 'y = 2x + 3', 'y = −2x − 3'],
      ['y = 2x − 3', 'y = −3x + 2', 'y = 2x + 3', 'y = −2x − 3'],
      ['y = 2x − 3', 'y = −3x + 2', 'y = 2x + 3', 'y = −2x − 3'],
    ),
    latex: 'y = 2x - 3',
    fc: L('m = 2, b = −3 → y = 2x − 3.', 'm = 2, b = −3 → y = 2x − 3.', 'm = 2, b = −3 → y = 2x − 3.'),
    fi: L('y-intercept −3 means b = −3, not the slope.', 'Intersección −3 significa b = −3, no la pendiente.', 'Przecięcie −3 oznacza b = −3, nie nachylenie.'),
    tags: ['swap_m_b', 'sign_error'],
    stds: l7Int,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.graph.slope.intercept',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Which describes the graph of y = −4x + 1?',
      '¿Qué describe la gráfica de y = −4x + 1?',
      'Co opisuje wykres y = −4x + 1?',
    ),
    math: 'y = -4x + 1',
    choices0: L(
      ['Steep negative slope; crosses y-axis at 1', 'Gentle positive slope; crosses at −4', 'Horizontal at y = 1', 'Steep positive slope; crosses at 1'],
      ['Pendiente negativa empinada; corta y en 1', 'Pendiente positiva suave; corta en −4', 'Horizontal en y = 1', 'Pendiente positiva empinada; corta en 1'],
      ['Strome ujemne nachylenie; przecina oś y w 1', 'Łagodne dodatnie; przecina w −4', 'Pozioma y = 1', 'Strome dodatnie; przecina w 1'],
    ),
    fc: L('|m| = 4 is steep and negative; b = 1.', '|m| = 4 es empinada y negativa; b = 1.', '|m| = 4 jest strome i ujemne; b = 1.'),
    fi: L('Negative m falls left-to-right; b is the y-intercept.', 'm negativa baja de izquierda a derecha; b es la intersección con y.', 'Ujemne m spada od lewej do prawej; b to przecięcie z osią y.'),
    tags: ['sign_of_slope', 'swap_m_b'],
    stds: l7Graph,
  },
)

const lesson07Items = buildItems('alg1-l07', l7Specs)
const lesson07 = {
  id: 'alg1-l07',
  courseId: 'algebra1',
  order: 7,
  title: L(
    'Slope-Intercept Form & Graphing Linear Equations',
    'Forma pendiente-intersección y graficar ecuaciones lineales',
    'Postać kierunkowa i rysowanie równań liniowych',
  ),
  knowledgePointIds: [
    'kp.alg1.slope.intercept.form',
    'kp.alg1.graph.slope.intercept',
    'kp.alg1.intercept.identify',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_7', unlockOnMastery: ['lesson_board_8'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will read m and b from y = mx + b, identify intercepts, and graph lines by plotting the y-intercept then using rise over run.',
        'Leerás m y b de y = mx + b, identificarás intersecciones y graficarás rectas marcando la intersección con y y usando subida sobre avance.',
        'Będziesz odczytywać m i b z y = mx + b, identyfikować przecięcia i rysować proste zaznaczając przecięcie z osią y, potem wzrost przez przebieg.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: y = mx + b and graphing', 'Enseñar: y = mx + b y graficar', 'Nauczanie: y = mx + b i rysowanie'),
      body: L(
        'Slope-intercept form is y = mx + b. Plot (0, b), then from there use slope as rise/run to find more points and draw the line.',
        'La forma pendiente-intersección es y = mx + b. Marca (0, b), luego usa la pendiente como subida/avance para más puntos y traza la recta.',
        'Postać kierunkowa to y = mx + b. Zaznacz (0, b), potem użyj nachylenia jako wzrost/przebieg, by znaleźć kolejne punkty i narysować prostą.',
      ),
      bodyMath: ['y = mx + b', 'y = 2x - 1', 'm = \\frac{\\text{rise}}{\\text{run}}'],
      itemIds: ['alg1-l07-t01', 'alg1-l07-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Extract m and b, rewrite into slope-intercept form, step along the slope, and find intercepts.',
        'Extrae m y b, reescribe a forma pendiente-intersección, avanza con la pendiente y halla intersecciones.',
        'Wyodrębnij m i b, przekształć do postaci kierunkowej, idź po nachyleniu i znajdź przecięcia.',
      ),
      itemIds: ['alg1-l07-g01', 'alg1-l07-g02', 'alg1-l07-g03', 'alg1-l07-g04', 'alg1-l07-g05'],
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
        'alg1-l07-i01',
        'alg1-l07-i02',
        'alg1-l07-i03',
        'alg1-l07-i04',
        'alg1-l07-i05',
        'alg1-l07-i06',
        'alg1-l07-i07',
        'alg1-l07-i08',
        'alg1-l07-i09',
        'alg1-l07-i10',
      ],
    },
  ],
  items: lesson07Items,
}

/* ═══════════════════════════════════════
   LESSON 8 — Writing equations / parallel
   ═══════════════════════════════════════ */
const l8Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.write.equation.slope.yint',
    diff: 0.25,
    b: -1.0,
    prompt: L(
      'Write the equation with slope 4 and y-intercept −1.',
      'Escribe la ecuación con pendiente 4 e intersección con y = −1.',
      'Zapisz równanie o nachyleniu 4 i przecięciu z osią y = −1.',
    ),
    choices0: L(
      ['y = 4x − 1', 'y = −1x + 4', 'y = 4x + 1', 'x = 4y − 1'],
      ['y = 4x − 1', 'y = −1x + 4', 'y = 4x + 1', 'x = 4y − 1'],
      ['y = 4x − 1', 'y = −1x + 4', 'y = 4x + 1', 'x = 4y − 1'],
    ),
    latex: 'y = 4x - 1',
    fc: L('Plug into y = mx + b → y = 4x − 1.', 'Sustituye en y = mx + b → y = 4x − 1.', 'Wstaw do y = mx + b → y = 4x − 1.'),
    fi: L('m goes with x; b is the constant term.', 'm va con x; b es el término constante.', 'm idzie z x; b to wyraz wolny.'),
    tags: ['swap_m_b', 'sign_error'],
    stds: l8Yint,
  },
  {
    id: 't02',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.35,
    b: -0.7,
    prompt: L(
      'A line has slope 2 and passes through (1, 5). What is b?',
      'Una recta tiene pendiente 2 y pasa por (1, 5). ¿Qué es b?',
      'Prosta ma nachylenie 2 i przechodzi przez (1, 5). Ile wynosi b?',
    ),
    choices0: L(['3', '5', '2', '7'], ['3', '5', '2', '7'], ['3', '5', '2', '7']),
    latex: '3',
    num: 3,
    fc: L('5 = 2(1) + b → b = 3. Equation y = 2x + 3.', '5 = 2(1) + b → b = 3. Ecuación y = 2x + 3.', '5 = 2(1) + b → b = 3. Równanie y = 2x + 3.'),
    fi: L('Substitute the point into y = mx + b and solve for b.', 'Sustituye el punto en y = mx + b y resuelve b.', 'Podstaw punkt do y = mx + b i oblicz b.'),
    tags: ['forgot_solve_b', 'use_x_as_b'],
    stds: l8Point,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.write.equation.slope.yint',
    diff: 0.35,
    b: -0.5,
    prompt: L('Equation: slope −1/2, y-intercept 6.', 'Ecuación: pendiente −1/2, intersección con y = 6.', 'Równanie: nachylenie −1/2, przecięcie z osią y = 6.'),
    choices0: L(
      ['y = -\\frac{1}{2}x + 6', 'y = 6x - \\frac{1}{2}', 'y = \\frac{1}{2}x + 6', 'y = -\\frac{1}{2}x - 6'],
      ['y = -\\frac{1}{2}x + 6', 'y = 6x - \\frac{1}{2}', 'y = \\frac{1}{2}x + 6', 'y = -\\frac{1}{2}x - 6'],
      ['y = -\\frac{1}{2}x + 6', 'y = 6x - \\frac{1}{2}', 'y = \\frac{1}{2}x + 6', 'y = -\\frac{1}{2}x - 6'],
    ),
    latex: 'y = -\\frac{1}{2}x + 6',
    fc: L('y = mx + b with m = −1/2 and b = 6.', 'y = mx + b con m = −1/2 y b = 6.', 'y = mx + b z m = −1/2 i b = 6.'),
    fi: L('Keep the negative on the slope; b is +6.', 'Mantén el negativo en la pendiente; b es +6.', 'Zachowaj minus przy nachyleniu; b to +6.'),
    tags: ['swap_m_b', 'drop_sign'],
    stds: l8Yint,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.4,
    b: -0.3,
    prompt: L('Slope through (0, 2) and (4, 10)?', '¿Pendiente por (0, 2) y (4, 10)?', 'Nachylenie przez (0, 2) i (4, 10)?'),
    choices0: L(['2', '4', '8', '1/2'], ['2', '4', '8', '1/2'], ['2', '4', '8', '1/2']),
    latex: '2',
    num: 2,
    fc: L('m = (10−2)/(4−0) = 8/4 = 2.', 'm = (10−2)/(4−0) = 8/4 = 2.', 'm = (10−2)/(4−0) = 8/4 = 2.'),
    fi: L('m = Δy/Δx, not Δx/Δy.', 'm = Δy/Δx, no Δx/Δy.', 'm = Δy/Δx, nie Δx/Δy.'),
    tags: ['dx_over_dy', 'arithmetic_error'],
    stds: l8Point,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.45,
    b: -0.1,
    prompt: L('Equation through (0, 2) and (4, 10)?', '¿Ecuación por (0, 2) y (4, 10)?', 'Równanie przez (0, 2) i (4, 10)?'),
    choices0: L(
      ['y = 2x + 2', 'y = 2x − 2', 'y = \\frac{1}{2}x + 2', 'y = 8x + 2'],
      ['y = 2x + 2', 'y = 2x − 2', 'y = \\frac{1}{2}x + 2', 'y = 8x + 2'],
      ['y = 2x + 2', 'y = 2x − 2', 'y = \\frac{1}{2}x + 2', 'y = 8x + 2'],
    ),
    latex: 'y = 2x + 2',
    fc: L('m = 2 and b = 2 (point (0, 2)) → y = 2x + 2.', 'm = 2 y b = 2 (punto (0, 2)) → y = 2x + 2.', 'm = 2 i b = 2 (punkt (0, 2)) → y = 2x + 2.'),
    fi: L('First find slope, then use the y-intercept when x = 0.', 'Primero halla pendiente, luego usa la intersección cuando x = 0.', 'Najpierw nachylenie, potem przecięcie gdy x = 0.'),
    tags: ['wrong_slope', 'sign_error'],
    stds: l8Point,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.parallel.slope',
    diff: 0.4,
    b: -0.2,
    prompt: L(
      'Which line is parallel to y = 3x − 1?',
      '¿Qué recta es paralela a y = 3x − 1?',
      'Która prosta jest równoległa do y = 3x − 1?',
    ),
    math: 'y = 3x - 1',
    choices0: L(
      ['y = 3x + 5', 'y = -3x − 1', 'y = \\frac{1}{3}x − 1', 'y = −\\frac{1}{3}x + 2'],
      ['y = 3x + 5', 'y = -3x − 1', 'y = \\frac{1}{3}x − 1', 'y = −\\frac{1}{3}x + 2'],
      ['y = 3x + 5', 'y = -3x − 1', 'y = \\frac{1}{3}x − 1', 'y = −\\frac{1}{3}x + 2'],
    ),
    latex: 'y = 3x + 5',
    fc: L('Parallel non-vertical lines share slope m = 3.', 'Las paralelas no verticales comparten pendiente m = 3.', 'Równoległe (nie pionowe) mają to samo nachylenie m = 3.'),
    fi: L('Same slope, different intercept → parallel; negative reciprocal → perpendicular.', 'Misma pendiente, distinta intersección → paralelas; recíproco negativo → perpendiculares.', 'To samo nachylenie, inne przecięcie → równoległe; ujemna odwrotność → prostopadłe.'),
    tags: ['perpendicular_confused', 'same_intercept_required'],
    stds: l8Par,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.parallel.slope',
    diff: 0.5,
    b: 0.1,
    prompt: L(
      'Line parallel to y = −2x + 7 through (0, 4)?',
      '¿Recta paralela a y = −2x + 7 por (0, 4)?',
      'Prosta równoległa do y = −2x + 7 przez (0, 4)?',
    ),
    choices0: L(
      ['y = −2x + 4', 'y = −2x + 7', 'y = 2x + 4', 'y = \\frac{1}{2}x + 4'],
      ['y = −2x + 4', 'y = −2x + 7', 'y = 2x + 4', 'y = \\frac{1}{2}x + 4'],
      ['y = −2x + 4', 'y = −2x + 7', 'y = 2x + 4', 'y = \\frac{1}{2}x + 4'],
    ),
    latex: 'y = -2x + 4',
    fc: L('Keep m = −2; new b = 4 → y = −2x + 4.', 'Mantén m = −2; nuevo b = 4 → y = −2x + 4.', 'Zachowaj m = −2; nowe b = 4 → y = −2x + 4.'),
    fi: L('Parallel → same slope; through (0, 4) → b = 4.', 'Paralela → misma pendiente; por (0, 4) → b = 4.', 'Równoległa → to samo nachylenie; przez (0, 4) → b = 4.'),
    tags: ['same_line', 'sign_error'],
    stds: l8Par,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.write.equation.slope.yint',
    diff: 0.4,
    b: -0.2,
    prompt: L('Slope 0, y-intercept −3. Equation?', 'Pendiente 0, intersección con y = −3. ¿Ecuación?', 'Nachylenie 0, przecięcie z osią y = −3. Równanie?'),
    choices0: L(
      ['y = −3', 'y = −3x', 'x = −3', 'y = x − 3'],
      ['y = −3', 'y = −3x', 'x = −3', 'y = x − 3'],
      ['y = −3', 'y = −3x', 'x = −3', 'y = x − 3'],
    ),
    latex: 'y = -3',
    fc: L('Horizontal line y = −3.', 'Recta horizontal y = −3.', 'Prosta pozioma y = −3.'),
    fi: L('m = 0 → y = b.', 'm = 0 → y = b.', 'm = 0 → y = b.'),
    tags: ['vertical_vs_horizontal'],
    stds: l8Yint,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.45,
    b: 0,
    prompt: L('Line: slope −3 through (2, 1). Find b.', 'Recta: pendiente −3 por (2, 1). Halla b.', 'Prosta: nachylenie −3 przez (2, 1). Znajdź b.'),
    choices0: L(['7', '1', '−5', '−3'], ['7', '1', '−5', '−3'], ['7', '1', '−5', '−3']),
    latex: '7',
    num: 7,
    fc: L('1 = −3(2) + b → 1 = −6 + b → b = 7.', '1 = −3(2) + b → 1 = −6 + b → b = 7.', '1 = −3(2) + b → 1 = −6 + b → b = 7.'),
    fi: L('y = mx + b → plug (2, 1) and solve for b.', 'y = mx + b → sustituye (2, 1) y resuelve b.', 'y = mx + b → podstaw (2, 1) i oblicz b.'),
    tags: ['forgot_solve_b', 'arithmetic_error'],
    stds: l8Point,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.5,
    b: 0.15,
    prompt: L('Equation: slope −3 through (2, 1).', 'Ecuación: pendiente −3 por (2, 1).', 'Równanie: nachylenie −3 przez (2, 1).'),
    choices0: L(
      ['y = −3x + 7', 'y = −3x + 1', 'y = 3x + 7', 'y = −3x − 7'],
      ['y = −3x + 7', 'y = −3x + 1', 'y = 3x + 7', 'y = −3x − 7'],
      ['y = −3x + 7', 'y = −3x + 1', 'y = 3x + 7', 'y = −3x − 7'],
    ),
    latex: 'y = -3x + 7',
    fc: L('b = 7 → y = −3x + 7.', 'b = 7 → y = −3x + 7.', 'b = 7 → y = −3x + 7.'),
    fi: L('After finding b = 7, write y = −3x + 7.', 'Tras hallar b = 7, escribe y = −3x + 7.', 'Po znalezieniu b = 7 zapisz y = −3x + 7.'),
    tags: ['forgot_solve_b', 'sign_error'],
    stds: l8Point,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.55,
    b: 0.3,
    prompt: L('Slope through (−1, 4) and (3, −4)?', '¿Pendiente por (−1, 4) y (3, −4)?', 'Nachylenie przez (−1, 4) i (3, −4)?'),
    choices0: L(['−2', '2', '−1/2', '8'], ['−2', '2', '−1/2', '8'], ['−2', '2', '−1/2', '8']),
    latex: '-2',
    num: -2,
    fc: L('m = (−4−4)/(3−(−1)) = (−8)/4 = −2.', 'm = (−4−4)/(3−(−1)) = (−8)/4 = −2.', 'm = (−4−4)/(3−(−1)) = (−8)/4 = −2.'),
    fi: L('Keep the order consistent: (y₂−y₁)/(x₂−x₁).', 'Mantén el orden: (y₂−y₁)/(x₂−x₁).', 'Zachowaj kolejność: (y₂−y₁)/(x₂−x₁).'),
    tags: ['order_swap', 'dx_over_dy'],
    stds: l8Point,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.55,
    b: 0.35,
    prompt: L('Equation through (−1, 4) and (3, −4)?', '¿Ecuación por (−1, 4) y (3, −4)?', 'Równanie przez (−1, 4) i (3, −4)?'),
    choices0: L(
      ['y = −2x + 2', 'y = −2x − 2', 'y = 2x + 2', 'y = −2x + 4'],
      ['y = −2x + 2', 'y = −2x − 2', 'y = 2x + 2', 'y = −2x + 4'],
      ['y = −2x + 2', 'y = −2x − 2', 'y = 2x + 2', 'y = −2x + 4'],
    ),
    latex: 'y = -2x + 2',
    fc: L('m = −2; 4 = −2(−1) + b → b = 2.', 'm = −2; 4 = −2(−1) + b → b = 2.', 'm = −2; 4 = −2(−1) + b → b = 2.'),
    fi: L('Use either point with m = −2 to solve for b.', 'Usa cualquiera de los puntos con m = −2 para hallar b.', 'Użyj dowolnego punktu z m = −2, by znaleźć b.'),
    tags: ['forgot_solve_b', 'sign_error'],
    stds: l8Point,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.parallel.slope',
    diff: 0.5,
    b: 0.25,
    prompt: L(
      'True about parallel non-vertical lines?',
      '¿Qué es cierto sobre rectas paralelas no verticales?',
      'Co jest prawdą o prostych równoległych (nie pionowych)?',
    ),
    choices0: L(
      ['They have equal slopes', 'They have equal y-intercepts', 'Their slopes multiply to −1', 'They always pass through the origin'],
      ['Tienen pendientes iguales', 'Tienen la misma intersección con y', 'Sus pendientes multiplican −1', 'Siempre pasan por el origen'],
      ['Mają równe nachylenia', 'Mają to samo przecięcie z osią y', 'Ich nachylenia mnożą się do −1', 'Zawsze przechodzą przez początek układu'],
    ),
    fc: L('Equal slopes; intercepts may differ.', 'Pendientes iguales; las intersecciones pueden diferir.', 'Równe nachylenia; przecięcia mogą się różnić.'),
    fi: L('Same slope ≠ same intercept. Product −1 is perpendicular.', 'Misma pendiente ≠ misma intersección. Producto −1 es perpendicular.', 'To samo nachylenie ≠ to samo przecięcie. Iloczyn −1 to prostopadłe.'),
    tags: ['same_intercept_required', 'perpendicular_confused'],
    stds: l8Par,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.parallel.slope',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'Parallel to y = (1/3)x − 2 through (3, 0)?',
      '¿Paralela a y = (1/3)x − 2 por (3, 0)?',
      'Równoległa do y = (1/3)x − 2 przez (3, 0)?',
    ),
    choices0: L(
      ['y = \\frac{1}{3}x − 1', 'y = \\frac{1}{3}x − 2', 'y = 3x − 1', 'y = -3x + 0'],
      ['y = \\frac{1}{3}x − 1', 'y = \\frac{1}{3}x − 2', 'y = 3x − 1', 'y = -3x + 0'],
      ['y = \\frac{1}{3}x − 1', 'y = \\frac{1}{3}x − 2', 'y = 3x − 1', 'y = -3x + 0'],
    ),
    latex: 'y = \\frac{1}{3}x - 1',
    fc: L('m = 1/3; 0 = (1/3)(3) + b → b = −1.', 'm = 1/3; 0 = (1/3)(3) + b → b = −1.', 'm = 1/3; 0 = (1/3)(3) + b → b = −1.'),
    fi: L('Keep slope 1/3; solve for b with point (3, 0).', 'Mantén pendiente 1/3; halla b con el punto (3, 0).', 'Zachowaj nachylenie 1/3; oblicz b z punktu (3, 0).'),
    tags: ['same_line', 'reciprocal_slope'],
    stds: l8Par,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.write.equation.slope.yint',
    diff: 0.5,
    b: 0.3,
    prompt: L(
      'A bike rental costs $8 plus $2 per hour. Cost C after h hours?',
      'Alquiler de bici: $8 más $2 por hora. ¿Costo C tras h horas?',
      'Wypożyczenie roweru: 8$ plus 2$ za godzinę. Koszt C po h godzinach?',
    ),
    choices0: L(
      ['C = 2h + 8', 'C = 8h + 2', 'C = 2h − 8', 'C = h + 10'],
      ['C = 2h + 8', 'C = 8h + 2', 'C = 2h − 8', 'C = h + 10'],
      ['C = 2h + 8', 'C = 8h + 2', 'C = 2h − 8', 'C = h + 10'],
    ),
    latex: 'C = 2h + 8',
    fc: L('Rate $2/h is slope; $8 fee is intercept.', 'Tasa $2/h es pendiente; cuota $8 es intersección.', 'Stawka 2$/h to nachylenie; opłata 8$ to przecięcie.'),
    fi: L('Constant fee is b; per-hour rate is m.', 'La cuota fija es b; la tarifa por hora es m.', 'Stała opłata to b; stawka godzinowa to m.'),
    tags: ['swap_m_b', 'context_swap'],
    stds: l8Yint,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.write.equation.point.slope',
    diff: 0.6,
    b: 0.5,
    prompt: L('Passes through (0, −5) with slope 4. Equation?', 'Pasa por (0, −5) con pendiente 4. ¿Ecuación?', 'Przechodzi przez (0, −5) z nachyleniem 4. Równanie?'),
    choices0: L(
      ['y = 4x − 5', 'y = −5x + 4', 'y = 4x + 5', 'y = −4x − 5'],
      ['y = 4x − 5', 'y = −5x + 4', 'y = 4x + 5', 'y = −4x − 5'],
      ['y = 4x − 5', 'y = −5x + 4', 'y = 4x + 5', 'y = −4x − 5'],
    ),
    latex: 'y = 4x - 5',
    fc: L('(0, −5) → b = −5 with m = 4.', '(0, −5) → b = −5 con m = 4.', '(0, −5) → b = −5 przy m = 4.'),
    fi: L('When the point is on the y-axis, b is that y-value.', 'Si el punto está en el eje y, b es ese valor de y.', 'Gdy punkt jest na osi y, b to ta wartość y.'),
    tags: ['swap_m_b', 'sign_error'],
    stds: l8Point,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.parallel.slope',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Which is NOT parallel to y = −x + 2?',
      '¿Cuál NO es paralela a y = −x + 2?',
      'Która NIE jest równoległa do y = −x + 2?',
    ),
    math: 'y = -x + 2',
    choices0: L(
      ['y = x − 5', 'y = −x', 'y = −x + 9', 'y = −1·x − 3'],
      ['y = x − 5', 'y = −x', 'y = −x + 9', 'y = −1·x − 3'],
      ['y = x − 5', 'y = −x', 'y = −x + 9', 'y = −1·x − 3'],
    ),
    latex: 'y = x - 5',
    fc: L('y = x − 5 has slope +1, not −1.', 'y = x − 5 tiene pendiente +1, no −1.', 'y = x − 5 ma nachylenie +1, nie −1.'),
    fi: L('Parallel requires the same slope −1.', 'Paralela requiere la misma pendiente −1.', 'Równoległość wymaga tego samego nachylenia −1.'),
    tags: ['sign_of_slope', 'perpendicular_confused'],
    stds: l8Par,
  },
]

const lesson08Items = buildItems('alg1-l08', l8Specs)
const lesson08 = {
  id: 'alg1-l08',
  courseId: 'algebra1',
  order: 8,
  title: L(
    'Writing Linear Equations & Parallel Lines',
    'Escribir ecuaciones lineales y rectas paralelas',
    'Zapisywanie równań liniowych i proste równoległe',
  ),
  knowledgePointIds: [
    'kp.alg1.write.equation.slope.yint',
    'kp.alg1.write.equation.point.slope',
    'kp.alg1.parallel.slope',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_8', unlockOnMastery: ['lesson_board_9'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will write y = mx + b from slope and intercept, from a point and slope or two points, and recognize parallel lines by equal slopes.',
        'Escribirás y = mx + b a partir de pendiente e intersección, de un punto y pendiente o dos puntos, y reconocerás paralelas por pendientes iguales.',
        'Będziesz zapisywać y = mx + b z nachylenia i przecięcia, z punktu i nachylenia lub dwóch punktów oraz rozpoznawać równoległe po równych nachyleniach.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: build equations & parallel slopes', 'Enseñar: construir ecuaciones y pendientes paralelas', 'Nauczanie: budowa równań i nachylenia równoległe'),
      body: L(
        'Given m and b, write y = mx + b. Given a point and slope, substitute to find b. Parallel lines share m but usually not b.',
        'Dados m y b, escribe y = mx + b. Dados un punto y pendiente, sustituye para hallar b. Las paralelas comparten m pero normalmente no b.',
        'Mając m i b, zapisz y = mx + b. Mając punkt i nachylenie, podstaw by znaleźć b. Równoległe mają to samo m, zwykle inne b.',
      ),
      bodyMath: ['y = mx + b', 'y_1 = m x_1 + b', 'm_{\\parallel} = m'],
      itemIds: ['alg1-l08-t01', 'alg1-l08-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Write equations from slope/intercept and points; identify and write parallel lines.',
        'Escribe ecuaciones desde pendiente/intersección y puntos; identifica y escribe paralelas.',
        'Zapisuj równania z nachylenia/przecięcia i punktów; rozpoznawaj i zapisuj równoległe.',
      ),
      itemIds: ['alg1-l08-g01', 'alg1-l08-g02', 'alg1-l08-g03', 'alg1-l08-g04', 'alg1-l08-g05'],
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
        'alg1-l08-i01',
        'alg1-l08-i02',
        'alg1-l08-i03',
        'alg1-l08-i04',
        'alg1-l08-i05',
        'alg1-l08-i06',
        'alg1-l08-i07',
        'alg1-l08-i08',
        'alg1-l08-i09',
        'alg1-l08-i10',
      ],
    },
  ],
  items: lesson08Items,
}

/* ═══════════════════════════════════════
   LESSON 9 — Systems intro
   ═══════════════════════════════════════ */
const l9Specs = [
  {
    id: 't01',
    kp: 'kp.alg1.systems.meaning',
    diff: 0.3,
    b: -1.0,
    prompt: L(
      'A solution of a system of two linear equations is…',
      'Una solución de un sistema de dos ecuaciones lineales es…',
      'Rozwiązanie układu dwóch równań liniowych to…',
    ),
    choices0: L(
      ['An ordered pair that makes both equations true', 'Any point on the first line only', 'The y-intercept of either line', 'The slope of both lines'],
      ['Un par ordenado que hace verdaderas ambas ecuaciones', 'Cualquier punto solo de la primera recta', 'La intersección con y de cualquiera', 'La pendiente de ambas rectas'],
      ['Para uporządkowana spełniająca oba równania', 'Dowolny punkt tylko pierwszej prostej', 'Przecięcie z osią y którejkolwiek', 'Nachylenie obu prostych'],
    ),
    fc: L('Both equations must be true — graphically the intersection.', 'Ambas ecuaciones deben ser verdaderas — gráficamente la intersección.', 'Oba równania muszą być prawdziwe — graficznie punkt przecięcia.'),
    fi: L('One line alone is not enough; the pair must satisfy both.', 'Una sola recta no basta; el par debe satisfacer ambas.', 'Jedna prosta nie wystarczy; para musi spełniać oba.'),
    tags: ['one_equation_only'],
    stds: l9Mean,
  },
  {
    id: 't02',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.35,
    b: -0.8,
    prompt: L(
      'If y = 2x and x + y = 9, substitute to find x.',
      'Si y = 2x y x + y = 9, sustituye para hallar x.',
      'Jeśli y = 2x i x + y = 9, podstaw by znaleźć x.',
    ),
    math: 'y = 2x,\\quad x + y = 9',
    choices0: L(['3', '9', '6', '2'], ['3', '9', '6', '2'], ['3', '9', '6', '2']),
    latex: '3',
    num: 3,
    fc: L('x + 2x = 9 → 3x = 9 → x = 3 (then y = 6).', 'x + 2x = 9 → 3x = 9 → x = 3 (luego y = 6).', 'x + 2x = 9 → 3x = 9 → x = 3 (potem y = 6).'),
    fi: L('Replace y with 2x in the second equation.', 'Reemplaza y por 2x en la segunda ecuación.', 'Zastąp y przez 2x w drugim równaniu.'),
    tags: ['sub_same_equation', 'stop_after_one_var'],
    stds: l9Sub,
  },
  {
    id: 'g01',
    kp: 'kp.alg1.systems.graphical',
    diff: 0.35,
    b: -0.5,
    prompt: L(
      'Two lines intersect at (2, −1). System solution?',
      'Dos rectas se cortan en (2, −1). ¿Solución del sistema?',
      'Dwie proste przecinają się w (2, −1). Rozwiązanie układu?',
    ),
    choices0: L(
      ['(2, −1)', '(−1, 2)', '(2, 1)', 'No solution'],
      ['(2, −1)', '(−1, 2)', '(2, 1)', 'Sin solución'],
      ['(2, −1)', '(−1, 2)', '(2, 1)', 'Brak rozwiązań'],
    ),
    fc: L('Intersection point is the unique solution when lines cross once.', 'El punto de intersección es la solución única cuando se cruzan una vez.', 'Punkt przecięcia to jedyne rozwiązanie przy jednym przecięciu.'),
    fi: L('Keep (x, y) order — do not swap coordinates.', 'Mantén el orden (x, y) — no intercambies coordenadas.', 'Zachowaj kolejność (x, y) — nie zamieniaj współrzędnych.'),
    tags: ['swap_xy', 'partial_read'],
    stds: l9Graph,
  },
  {
    id: 'g02',
    kp: 'kp.alg1.systems.meaning',
    diff: 0.4,
    b: -0.3,
    prompt: L(
      'Parallel distinct lines as a system mean…',
      'Rectas paralelas distintas como sistema significan…',
      'Różne proste równoległe jako układ oznaczają…',
    ),
    choices0: L(
      ['No solution', 'Infinitely many solutions', 'Exactly one solution', 'Solution at the origin only'],
      ['Sin solución', 'Infinitas soluciones', 'Exactamente una solución', 'Solo solución en el origen'],
      ['Brak rozwiązań', 'Nieskończenie wiele rozwiązań', 'Dokładnie jedno rozwiązanie', 'Rozwiązanie tylko w początku układu'],
    ),
    fc: L('Never meet → no ordered pair satisfies both.', 'Nunca se encuentran → ningún par satisface ambas.', 'Nigdy się nie spotykają → żadna para nie spełnia obu.'),
    fi: L('Same line → infinitely many; one intersection → one solution.', 'Misma recta → infinitas; una intersección → una solución.', 'Ta sama prosta → nieskończenie wiele; jedno przecięcie → jedno rozwiązanie.'),
    tags: ['inf_vs_none'],
    stds: l9Mean,
  },
  {
    id: 'g03',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.45,
    b: -0.1,
    prompt: L(
      'y = x − 1 and 2x + y = 5. Find y after solving.',
      'y = x − 1 y 2x + y = 5. Halla y tras resolver.',
      'y = x − 1 i 2x + y = 5. Znajdź y po rozwiązaniu.',
    ),
    math: 'y = x - 1,\\quad 2x + y = 5',
    choices0: L(['1', '2', '3', '0'], ['1', '2', '3', '0'], ['1', '2', '3', '0']),
    latex: '1',
    num: 1,
    fc: L('2x + (x − 1) = 5 → 3x = 6 → x = 2 → y = 1.', '2x + (x − 1) = 5 → 3x = 6 → x = 2 → y = 1.', '2x + (x − 1) = 5 → 3x = 6 → x = 2 → y = 1.'),
    fi: L('Substitute, solve for x, then back-substitute for y.', 'Sustituye, resuelve x, luego sustituye de vuelta para y.', 'Podstaw, rozwiąż x, potem podstaw z powrotem po y.'),
    tags: ['stop_after_one_var', 'arithmetic_error'],
    stds: l9Sub,
  },
  {
    id: 'g04',
    kp: 'kp.alg1.systems.graphical',
    diff: 0.45,
    b: 0,
    prompt: L(
      'Same line graphed twice (coinciding). Solutions?',
      'La misma recta graficada dos veces (coinciden). ¿Soluciones?',
      'Ta sama prosta narysowana dwa razy (zbieżne). Rozwiązania?',
    ),
    choices0: L(
      ['Infinitely many', 'None', 'Exactly one', 'Only (0, 0)'],
      ['Infinitas', 'Ninguna', 'Exactamente una', 'Solo (0, 0)'],
      ['Nieskończenie wiele', 'Żadnych', 'Dokładnie jedno', 'Tylko (0, 0)'],
    ),
    fc: L('Every point on the line satisfies both equations.', 'Todo punto de la recta satisface ambas ecuaciones.', 'Każdy punkt prostej spełnia oba równania.'),
    fi: L('Coinciding lines → infinitely many; parallel distinct → none.', 'Rectas coincidentes → infinitas; paralelas distintas → ninguna.', 'Zbieżne → nieskończenie wiele; różne równoległe → brak.'),
    tags: ['inf_vs_none'],
    stds: l9Graph,
  },
  {
    id: 'g05',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.5,
    b: 0.15,
    prompt: L(
      'x = 4 − y and 3x − y = 8. First step after substitute?',
      'x = 4 − y y 3x − y = 8. ¿Primer paso tras sustituir?',
      'x = 4 − y i 3x − y = 8. Pierwszy krok po podstawieniu?',
    ),
    choices0: L(
      ['3(4 − y) − y = 8', '3x − (4 − y) = 8', '3(4 − y) − x = 8', 'x − y = 8'],
      ['3(4 − y) − y = 8', '3x − (4 − y) = 8', '3(4 − y) − x = 8', 'x − y = 8'],
      ['3(4 − y) − y = 8', '3x − (4 − y) = 8', '3(4 − y) − x = 8', 'x − y = 8'],
    ),
    fc: L('Replace x in the second equation: 3(4 − y) − y = 8.', 'Reemplaza x en la segunda: 3(4 − y) − y = 8.', 'Zastąp x w drugim: 3(4 − y) − y = 8.'),
    fi: L('Substitute into the other equation, not back into the same one.', 'Sustituye en la otra ecuación, no en la misma.', 'Podstaw do drugiego równania, nie do tego samego.'),
    tags: ['sub_same_equation'],
    stds: l9Sub,
  },
  {
    id: 'i01',
    kp: 'kp.alg1.systems.meaning',
    diff: 0.4,
    b: -0.15,
    prompt: L(
      'Does (1, 2) solve { y = x + 1 ; y = 3x − 1 }?',
      '¿(1, 2) resuelve { y = x + 1 ; y = 3x − 1 }?',
      'Czy (1, 2) rozwiązuje { y = x + 1 ; y = 3x − 1 }?',
    ),
    math: 'y = x + 1,\\quad y = 3x - 1',
    choices0: L(
      ['Yes — both equations true', 'No — only the first is true', 'No — only the second is true', 'No — neither is true'],
      ['Sí — ambas verdaderas', 'No — solo la primera', 'No — solo la segunda', 'No — ninguna'],
      ['Tak — oba prawdziwe', 'Nie — tylko pierwsze', 'Nie — tylko drugie', 'Nie — żadne'],
    ),
    fc: L('2 = 1+1 and 2 = 3−1 — both hold.', '2 = 1+1 y 2 = 3−1 — ambas se cumplen.', '2 = 1+1 i 2 = 3−1 — oba zachodzą.'),
    fi: L('Check the candidate in both equations.', 'Comprueba el candidato en ambas ecuaciones.', 'Sprawdź kandydata w obu równaniach.'),
    tags: ['one_equation_only'],
    stds: l9Mean,
  },
  {
    id: 'i02',
    kp: 'kp.alg1.systems.graphical',
    diff: 0.45,
    b: 0.05,
    prompt: L(
      'Graphs cross at (−3, 4). Report the solution.',
      'Las gráficas se cruzan en (−3, 4). Reporta la solución.',
      'Wykresy przecinają się w (−3, 4). Podaj rozwiązanie.',
    ),
    choices0: L(
      ['(−3, 4)', '(4, −3)', '(3, −4)', 'No solution'],
      ['(−3, 4)', '(4, −3)', '(3, −4)', 'Sin solución'],
      ['(−3, 4)', '(4, −3)', '(3, −4)', 'Brak rozwiązań'],
    ),
    fc: L('Solution is the intersection (−3, 4).', 'La solución es la intersección (−3, 4).', 'Rozwiązanie to przecięcie (−3, 4).'),
    fi: L('Write (x, y) = (−3, 4), not swapped.', 'Escribe (x, y) = (−3, 4), sin intercambiar.', 'Zapisz (x, y) = (−3, 4), bez zamiany.'),
    tags: ['swap_xy'],
    stds: l9Graph,
  },
  {
    id: 'i03',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.5,
    b: 0.2,
    prompt: L('y = 5 − x and x + 2y = 8. Find x.', 'y = 5 − x y x + 2y = 8. Halla x.', 'y = 5 − x i x + 2y = 8. Znajdź x.'),
    math: 'y = 5 - x,\\quad x + 2y = 8',
    choices0: L(['2', '5', '3', '4'], ['2', '5', '3', '4'], ['2', '5', '3', '4']),
    latex: '2',
    num: 2,
    fc: L('x + 2(5 − x) = 8 → x + 10 − 2x = 8 → −x = −2 → x = 2.', 'x + 2(5 − x) = 8 → x + 10 − 2x = 8 → −x = −2 → x = 2.', 'x + 2(5 − x) = 8 → x + 10 − 2x = 8 → −x = −2 → x = 2.'),
    fi: L('Distribute carefully after substituting 5 − x for y.', 'Distribuye con cuidado tras sustituir 5 − x por y.', 'Ostrożnie rozdziel po podstawieniu 5 − x za y.'),
    tags: ['distribute_error', 'arithmetic_error'],
    stds: l9Sub,
  },
  {
    id: 'i04',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.5,
    b: 0.25,
    prompt: L('Same system: y = 5 − x, x + 2y = 8. Find y.', 'Mismo sistema: y = 5 − x, x + 2y = 8. Halla y.', 'Ten sam układ: y = 5 − x, x + 2y = 8. Znajdź y.'),
    choices0: L(['3', '2', '5', '1'], ['3', '2', '5', '1'], ['3', '2', '5', '1']),
    latex: '3',
    num: 3,
    fc: L('x = 2 → y = 5 − 2 = 3. Solution (2, 3).', 'x = 2 → y = 5 − 2 = 3. Solución (2, 3).', 'x = 2 → y = 5 − 2 = 3. Rozwiązanie (2, 3).'),
    fi: L('Back-substitute x into y = 5 − x.', 'Sustituye x de vuelta en y = 5 − x.', 'Podstaw x z powrotem do y = 5 − x.'),
    tags: ['stop_after_one_var'],
    stds: l9Sub,
  },
  {
    id: 'i05',
    kp: 'kp.alg1.systems.meaning',
    diff: 0.55,
    b: 0.35,
    prompt: L(
      'Does (0, 0) solve { y = 2x ; y = x + 1 }?',
      '¿(0, 0) resuelve { y = 2x ; y = x + 1 }?',
      'Czy (0, 0) rozwiązuje { y = 2x ; y = x + 1 }?',
    ),
    choices0: L(
      ['No — fails the second equation', 'Yes — both true', 'No — fails the first only', 'Yes — origin always works'],
      ['No — falla la segunda', 'Sí — ambas verdaderas', 'No — falla solo la primera', 'Sí — el origen siempre sirve'],
      ['Nie — nie spełnia drugiego', 'Tak — oba prawdziwe', 'Nie — nie spełnia tylko pierwszego', 'Tak — początek zawsze działa'],
    ),
    fc: L('0 = 2·0 true, but 0 = 0 + 1 false.', '0 = 2·0 verdad, pero 0 = 0 + 1 falso.', '0 = 2·0 prawda, ale 0 = 0 + 1 fałsz.'),
    fi: L('Both must hold; failing one means not a solution.', 'Ambas deben cumplirse; fallar una significa que no es solución.', 'Oba muszą zachodzić; niespełnienie jednego = nie rozwiązanie.'),
    tags: ['one_equation_only', 'origin_always'],
    stds: l9Mean,
  },
  {
    id: 'i06',
    kp: 'kp.alg1.systems.graphical',
    diff: 0.55,
    b: 0.4,
    prompt: L(
      'y = 2x + 1 and y = 2x − 4. How many solutions?',
      'y = 2x + 1 y y = 2x − 4. ¿Cuántas soluciones?',
      'y = 2x + 1 i y = 2x − 4. Ile rozwiązań?',
    ),
    math: 'y = 2x + 1,\\quad y = 2x - 4',
    choices0: L(['0', '1', '2', 'Infinitely many'], ['0', '1', '2', 'Infinitas'], ['0', '1', '2', 'Nieskończenie wiele']),
    latex: '0',
    num: 0,
    fc: L('Same slope, different intercepts → parallel → no solution.', 'Misma pendiente, distintas intersecciones → paralelas → sin solución.', 'To samo nachylenie, inne przecięcia → równoległe → brak rozwiązań.'),
    fi: L('Equal slopes with different b never intersect.', 'Pendientes iguales con distinto b nunca se cortan.', 'Równe nachylenia przy różnym b nigdy się nie przecinają.'),
    tags: ['inf_vs_none', 'count_wrong'],
    stds: l9Graph,
  },
  {
    id: 'i07',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.55,
    b: 0.45,
    prompt: L('x = y + 3 and 2x − y = 9. Find y.', 'x = y + 3 y 2x − y = 9. Halla y.', 'x = y + 3 i 2x − y = 9. Znajdź y.'),
    math: 'x = y + 3,\\quad 2x - y = 9',
    choices0: L(['3', '6', '0', '9'], ['3', '6', '0', '9'], ['3', '6', '0', '9']),
    latex: '3',
    num: 3,
    fc: L('2(y+3) − y = 9 → 2y + 6 − y = 9 → y = 3.', '2(y+3) − y = 9 → 2y + 6 − y = 9 → y = 3.', '2(y+3) − y = 9 → 2y + 6 − y = 9 → y = 3.'),
    fi: L('Substitute x = y + 3 into 2x − y = 9.', 'Sustituye x = y + 3 en 2x − y = 9.', 'Podstaw x = y + 3 do 2x − y = 9.'),
    tags: ['distribute_error', 'sub_same_equation'],
    stds: l9Sub,
  },
  {
    id: 'i08',
    kp: 'kp.alg1.systems.substitution',
    diff: 0.6,
    b: 0.5,
    prompt: L('Same system: find the solution pair (x, y).', 'Mismo sistema: halla el par solución (x, y).', 'Ten sam układ: znajdź parę (x, y).'),
    choices0: L(
      ['(6, 3)', '(3, 6)', '(9, 3)', '(3, 3)'],
      ['(6, 3)', '(3, 6)', '(9, 3)', '(3, 3)'],
      ['(6, 3)', '(3, 6)', '(9, 3)', '(3, 3)'],
    ),
    fc: L('y = 3 → x = 3 + 3 = 6 → (6, 3).', 'y = 3 → x = 3 + 3 = 6 → (6, 3).', 'y = 3 → x = 3 + 3 = 6 → (6, 3).'),
    fi: L('After y = 3, use x = y + 3 to get the ordered pair.', 'Tras y = 3, usa x = y + 3 para el par ordenado.', 'Po y = 3 użyj x = y + 3, by dostać parę.'),
    tags: ['swap_xy', 'stop_after_one_var'],
    stds: l9Sub,
  },
  {
    id: 'i09',
    kp: 'kp.alg1.systems.graphical',
    diff: 0.6,
    b: 0.5,
    prompt: L(
      'Best graphical estimate when lines cross between grid points near (1.5, 2)?',
      '¿Mejor estimación gráfica si se cruzan cerca de (1.5, 2)?',
      'Najlepsze szacowanie graficzne, gdy przecięcie blisko (1.5, 2)?',
    ),
    choices0: L(
      ['About (1.5, 2)', 'Exactly (0, 0)', 'No solution', 'Infinitely many'],
      ['Aprox. (1.5, 2)', 'Exactamente (0, 0)', 'Sin solución', 'Infinitas'],
      ['Około (1.5, 2)', 'Dokładnie (0, 0)', 'Brak rozwiązań', 'Nieskończenie wiele'],
    ),
    fc: L('Graphing can estimate; algebra confirms exact values.', 'Graficar estima; el álgebra confirma valores exactos.', 'Wykres szacuje; algebra potwierdza dokładne wartości.'),
    fi: L('Crossing once means one approximate intersection point.', 'Cruzarse una vez significa un punto de intersección aproximado.', 'Jedno przecięcie oznacza jeden przybliżony punkt.'),
    tags: ['estimate_vs_none'],
    stds: l9Graph,
  },
  {
    id: 'i10',
    kp: 'kp.alg1.systems.meaning',
    diff: 0.65,
    b: 0.55,
    prompt: L(
      'Why does intersection solve both equations?',
      '¿Por qué la intersección resuelve ambas ecuaciones?',
      'Dlaczego przecięcie rozwiązuje oba równania?',
    ),
    choices0: L(
      ['That point lies on both graphs, so it satisfies both', 'Intersection only fixes the slopes', 'Any nearby point also works', 'Graphs never share points'],
      ['Ese punto está en ambas gráficas, así satisface ambas', 'La intersección solo fija las pendientes', 'Cualquier punto cercano también sirve', 'Las gráficas nunca comparten puntos'],
      ['Ten punkt leży na obu wykresach, więc spełnia oba', 'Przecięcie tylko ustala nachylenia', 'Każdy pobliski punkt też działa', 'Wykresy nigdy nie dzielą punktów'],
    ),
    fc: L('A point on both lines is a common solution — A-REI.D.11 idea.', 'Un punto en ambas rectas es solución común — idea A-REI.D.11.', 'Punkt na obu prostych to wspólne rozwiązanie — idea A-REI.D.11.'),
    fi: L('Only the shared point(s) satisfy both equations at once.', 'Solo el/los punto(s) compartido(s) satisfacen ambas a la vez.', 'Tylko wspólny punkt (punkty) spełnia oba naraz.'),
    tags: ['nearby_ok', 'slope_only'],
    stds: l9Mean,
  },
]

const lesson09Items = buildItems('alg1-l09', l9Specs)
const lesson09 = {
  id: 'alg1-l09',
  courseId: 'algebra1',
  order: 9,
  title: L(
    'Systems of Two Linear Equations — Graph & Substitution',
    'Sistemas de dos ecuaciones lineales — gráfica y sustitución',
    'Układy dwóch równań liniowych — wykres i podstawianie',
  ),
  knowledgePointIds: [
    'kp.alg1.systems.meaning',
    'kp.alg1.systems.graphical',
    'kp.alg1.systems.substitution',
  ],
  masteryThreshold: 0.8,
  worldHook: { siteId: 'lesson_board_9', unlockOnMastery: ['lesson_board_10'] },
  sections: [
    {
      phase: 'objective',
      title: L('Learning objective', 'Objetivo de aprendizaje', 'Cel nauki'),
      body: L(
        'You will interpret system solutions as intersection points, estimate solutions from graphs, and solve simple systems by substitution.',
        'Interpretarás soluciones de sistemas como puntos de intersección, estimarás desde gráficas y resolverás sistemas simples por sustitución.',
        'Będziesz interpretować rozwiązania układów jako punkty przecięcia, szacować z wykresów i rozwiązywać proste układy przez podstawianie.',
      ),
    },
    {
      phase: 'teach',
      title: L('Teach: intersection & substitution', 'Enseñar: intersección y sustitución', 'Nauczanie: przecięcie i podstawianie'),
      body: L(
        'A solution satisfies both equations. Graphically it is where the lines meet. Algebraically, substitute an isolated expression into the other equation, then back-substitute.',
        'Una solución satisface ambas ecuaciones. Gráficamente es donde se encuentran las rectas. Algebraicamente, sustituye una expresión aislada en la otra ecuación y luego sustituye de vuelta.',
        'Rozwiązanie spełnia oba równania. Graficznie to miejsce spotkania prostych. Algebraicznie podstaw wyizolowane wyrażenie do drugiego równania, potem podstaw z powrotem.',
      ),
      bodyMath: ['y = mx + b', 'y = 2x,\\; x + y = 9', '(x, y) = (3, 6)'],
      itemIds: ['alg1-l09-t01', 'alg1-l09-t02'],
    },
    {
      phase: 'guided',
      title: L('Guided practice', 'Práctica guiada', 'Ćwiczenia z przewodnikiem'),
      body: L(
        'Classify solution counts from graphs, read intersections, and practice substitution steps.',
        'Clasifica el número de soluciones desde gráficas, lee intersecciones y practica pasos de sustitución.',
        'Klasyfikuj liczbę rozwiązań z wykresów, odczytuj przecięcia i ćwicz kroki podstawiania.',
      ),
      itemIds: ['alg1-l09-g01', 'alg1-l09-g02', 'alg1-l09-g03', 'alg1-l09-g04', 'alg1-l09-g05'],
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
        'alg1-l09-i01',
        'alg1-l09-i02',
        'alg1-l09-i03',
        'alg1-l09-i04',
        'alg1-l09-i05',
        'alg1-l09-i06',
        'alg1-l09-i07',
        'alg1-l09-i08',
        'alg1-l09-i09',
        'alg1-l09-i10',
      ],
    },
  ],
  items: lesson09Items,
}

/* ─── Write outputs ─── */
lesson06.worldHook.unlockOnMastery = ['lesson_board_7']

writeJson('knowledge-points.json', existingKpDoc)
writeJson('standards-index.json', existingStd)
writeJson('lesson-06.json', lesson06)
writeJson('lesson-07.json', lesson07)
writeJson('lesson-08.json', lesson08)
writeJson('lesson-09.json', lesson09)

function hist(lesson) {
  const h = [0, 0, 0, 0]
  for (const it of lesson.items) {
    if (it.correctIndex !== undefined) h[it.correctIndex]++
  }
  return h
}

const summary = {
  newKpIds: newKps.map((k) => k.id),
  lessons: [lesson07, lesson08, lesson09].map((l) => ({
    id: l.id,
    totalItems: l.items.length,
    teach: l.sections.find((s) => s.phase === 'teach')?.itemIds?.length ?? 0,
    guided: l.sections.find((s) => s.phase === 'guided')?.itemIds?.length ?? 0,
    independent: l.sections.find((s) => s.phase === 'independent')?.itemIds?.length ?? 0,
    siteId: l.worldHook.siteId,
    unlock: l.worldHook.unlockOnMastery,
    correctIndexHist: hist(l),
  })),
  l6Unlock: lesson06.worldHook.unlockOnMastery,
}
console.log(JSON.stringify(summary, null, 2))
