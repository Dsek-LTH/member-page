const selectTranslation = (
  i18n: any,
  swedish: string,
  english: string,
) => {
  const isEnglish = i18n.language === 'en';
  if (isEnglish && english) {
    return english;
  }
  return swedish;
};

export default selectTranslation;
