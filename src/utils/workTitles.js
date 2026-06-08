const abaiTitleByLanguage = {
  en: "The Book of Words",
  ru: "Книга слов",
  kk: "Қара сөздер",
};

export function getWorkDisplayTitle(work, language = "en") {
  if (!work) return "";

  if (work.id === "abai-words") {
    return abaiTitleByLanguage[language] ?? abaiTitleByLanguage.en;
  }

  const title = String(work.title ?? "").trim();
  if (!title.includes(" / ")) return title;

  const [sourceTitle, translatedTitle] = title.split(" / ").map((part) => part.trim());
  if (language === "en") return translatedTitle || sourceTitle || title;
  if (language === "kk") return work.originalTitle || sourceTitle || translatedTitle || title;
  return sourceTitle || translatedTitle || title;
}
