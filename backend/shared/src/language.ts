export type Translations = {
  sv: string,
  en?: string | null,
}

export type Language = 'sv' | 'en'

export function chooseTranslation(
  translations: Translations,
  lang: Language,
  force: boolean,
): string | undefined {
  const translation = translations[lang];
  if (force) {
    return translation ?? undefined;
  }

  return translation ?? translations.sv;
}
