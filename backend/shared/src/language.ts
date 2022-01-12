export type Translations = {
  sv: string,
  en?: string,
}

export type Language = 'sv' | 'en'

export function chooseTranslation(
  translations: Translations,
  lang: Language,
  force: boolean,
): string | undefined {
  const translation = translations[lang];
  if (force) {
    return translation;
  }

  return translation ?? translations.sv;
}
