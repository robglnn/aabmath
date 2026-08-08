import katex from 'katex'

/** True when a choice/prompt string likely contains LaTeX markup. */
export function containsLatex(text: string): boolean {
  return /\\|\$/.test(text)
}

/** Strip common inline delimiters before KaTeX render. */
export function normalizeLatex(text: string): string {
  const trimmed = text.trim()
  const paren = trimmed.match(/^\\\((.+)\\\)$/)
  if (paren) return paren[1]
  const dollar = trimmed.match(/^\$(.+)\$$/)
  if (dollar) return dollar[1]
  return trimmed
}

/** Render KaTeX into a target element; returns whether render succeeded. */
export function renderKatex(target: HTMLElement, latex: string, displayMode = true): boolean {
  try {
    katex.render(latex, target, {
      displayMode,
      throwOnError: false,
      trust: false,
    })
    return true
  } catch {
    target.textContent = latex
    return false
  }
}

/** Render an MC choice label — KaTeX inline when LaTeX is present, else plain text. */
export function renderChoiceLabel(target: HTMLElement, label: string): void {
  target.textContent = ''
  if (containsLatex(label)) {
    renderKatex(target, normalizeLatex(label), false)
  } else {
    target.textContent = label
  }
}
