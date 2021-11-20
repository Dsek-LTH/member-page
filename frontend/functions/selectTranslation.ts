import { I18n } from "next-i18next";

export const selectTranslation = (
  i18n: I18n,
  swedish: string,
  english: string
) => {
  const isEnglish = i18n.language === "en";
  if (isEnglish && english) {
    return english;
  }
  return swedish;
};
