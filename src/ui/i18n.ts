import type { Locale } from '../content/types'

export type I18nKey =
  | 'lesson.title'
  | 'lesson.solveFor'
  | 'lesson.submit'
  | 'lesson.close'
  | 'lesson.masteryGate'
  | 'lesson.masteryPassed'
  | 'lesson.continue'
  | 'lesson.retry'
  | 'lesson.answer'
  | 'progress.title'
  | 'progress.mastery'
  | 'progress.standardAlignment'
  | 'progress.alignmentMet'
  | 'progress.alignmentPending'
  | 'dig.move'
  | 'dig.fireLaser'
  | 'dig.unlocked'
  | 'hub.title'
  | 'hub.selectModule'
  | 'hub.algebra1'
  | 'hub.algebra2'
  | 'hub.trig'
  | 'hub.geometry'
  | 'hub.locked'
  | 'hub.playable'
  | 'hud.rank'
  | 'hud.score'
  | 'hud.progress'
  | 'hud.energy'
  | 'hud.health'
  | 'hud.trig'
  | 'locale.label'

const strings: Record<I18nKey, Record<Locale, string>> = {
  'lesson.title': {
    en: 'LESSON',
    es: 'LECCIÓN',
    pl: 'LEKCJA',
  },
  'lesson.solveFor': {
    en: 'SOLVE FOR X',
    es: 'RESUELVE PARA X',
    pl: 'ROZWIĄŻ X',
  },
  'lesson.submit': {
    en: 'SUBMIT',
    es: 'ENVIAR',
    pl: 'WYŚLIJ',
  },
  'lesson.close': {
    en: 'CLOSE',
    es: 'CERRAR',
    pl: 'ZAMKNIJ',
  },
  'lesson.masteryGate': {
    en: 'Need ≥80% mastery to proceed',
    es: 'Necesitas ≥80% de dominio para continuar',
    pl: 'Potrzebujesz ≥80% opanowania, aby kontynuować',
  },
  'lesson.masteryPassed': {
    en: 'Mastery gate passed!',
    es: '¡Puerta de dominio superada!',
    pl: 'Próg opanowania osiągnięty!',
  },
  'lesson.continue': {
    en: 'CONTINUE',
    es: 'CONTINUAR',
    pl: 'KONTYNUUJ',
  },
  'lesson.retry': {
    en: 'RETRY INDEPENDENT',
    es: 'REINTENTAR INDEPENDIENTE',
    pl: 'PONÓW SAMODZIELNE',
  },
  'lesson.answer': {
    en: 'YOUR ANSWER',
    es: 'TU RESPUESTA',
    pl: 'TWOJA ODPOWIEDŹ',
  },
  'progress.title': {
    en: 'PROGRESS REPORT',
    es: 'INFORME DE PROGRESO',
    pl: 'RAPORT POSTĘPÓW',
  },
  'progress.mastery': {
    en: 'MASTERY',
    es: 'DOMINIO',
    pl: 'OPANOWANIE',
  },
  'progress.standardAlignment': {
    en: 'STANDARD ALIGNMENT',
    es: 'ALINEACIÓN DE ESTÁNDARES',
    pl: 'ZGODNOŚĆ ZE STANDARDAMI',
  },
  'progress.alignmentMet': {
    en: 'MET',
    es: 'CUMPLIDO',
    pl: 'SPEŁNIONE',
  },
  'progress.alignmentPending': {
    en: 'IN PROGRESS',
    es: 'EN PROGRESO',
    pl: 'W TOKU',
  },
  'dig.move': {
    en: 'MOVE',
    es: 'MOVER',
    pl: 'RUCH',
  },
  'dig.fireLaser': {
    en: 'FIRE LASER',
    es: 'DISPARAR LÁSER',
    pl: 'STRZAŁ LASERA',
  },
  'dig.unlocked': {
    en: 'UNLOCKED',
    es: 'DESBLOQUEADO',
    pl: 'ODBLOKOWANO',
  },
  'hub.title': {
    en: 'MAIN HUB',
    es: 'CENTRO PRINCIPAL',
    pl: 'GŁÓWNY HUB',
  },
  'hub.selectModule': {
    en: 'SELECT MODULE:',
    es: 'SELECCIONA MÓDULO:',
    pl: 'WYBIERZ MODUŁ:',
  },
  'hub.algebra1': {
    en: 'ALGEBRA 1',
    es: 'ÁLGEBRA 1',
    pl: 'ALGEBRA 1',
  },
  'hub.algebra2': {
    en: 'ALGEBRA 2',
    es: 'ÁLGEBRA 2',
    pl: 'ALGEBRA 2',
  },
  'hub.trig': {
    en: 'TRIG',
    es: 'TRIG',
    pl: 'TRYG',
  },
  'hub.geometry': {
    en: 'GEOMETRY',
    es: 'GEOMETRÍA',
    pl: 'GEOMETRIA',
  },
  'hub.locked': {
    en: 'LOCKED',
    es: 'BLOQUEADO',
    pl: 'ZABLOKOWANE',
  },
  'hub.playable': {
    en: 'PLAY',
    es: 'JUGAR',
    pl: 'GRAJ',
  },
  'hud.rank': {
    en: 'RANK',
    es: 'RANGO',
    pl: 'RANGA',
  },
  'hud.score': {
    en: 'SCORE',
    es: 'PUNTAJE',
    pl: 'WYNIK',
  },
  'hud.progress': {
    en: 'PROGRESS',
    es: 'PROGRESO',
    pl: 'POSTĘP',
  },
  'hud.energy': {
    en: 'NRG',
    es: 'ENE',
    pl: 'ENE',
  },
  'hud.health': {
    en: 'HP',
    es: 'VID',
    pl: 'ZD',
  },
  'hud.trig': {
    en: 'TRIG',
    es: 'TRIG',
    pl: 'TRYG',
  },
  'locale.label': {
    en: 'EN',
    es: 'ES',
    pl: 'PL',
  },
}

export function t(key: I18nKey, locale: Locale): string {
  return strings[key][locale]
}
