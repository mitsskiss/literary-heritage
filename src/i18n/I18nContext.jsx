import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  authorTranslations,
  defaultLanguage,
  formatMessage,
  achievementLabels,
  communityTranslations,
  languageStorageKey,
  literaryTimelineTranslations,
  gamificationTranslations,
  journeyTranslations,
  languages,
  mapCategoryTranslations,
  mapMarkerTranslations,
  multimediaTranslations,
  miscTranslations,
  storyBookTranslations,
  storyTranslations,
  themeCollectionTranslations,
  themeLabels,
  ui,
  workMetadataTranslations,
  workTranslations,
} from "./translations";

const I18nContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return defaultLanguage;

  const stored = window.localStorage.getItem(languageStorageKey);
  if (languages.some((language) => language.code === stored)) return stored;

  const browserLanguage = window.navigator.language?.slice(0, 2);
  return languages.some((language) => language.code === browserLanguage)
    ? browserLanguage
    : defaultLanguage;
}

function mergeByIndex(baseItems = [], translatedItems = []) {
  return baseItems.map((item, index) => ({
    ...item,
    ...(translatedItems[index] ?? {}),
  }));
}

function mergeWork(base, translated = {}) {
  return {
    ...base,
    ...translated,
    canonicalTitle: base.title,
    canonicalAuthor: base.author,
    themes: base.themes?.map((theme) => localizeLabel(theme, themeLabels, translated.lang)) ?? base.themes,
    fragments: translated.fragments
      ? mergeByIndex(base.fragments, translated.fragments).map((fragment, index) => ({
          ...fragment,
          annotations: mergeByIndex(
            base.fragments[index]?.annotations,
            translated.fragments[index]?.annotations
          ),
          reflection: {
            ...base.fragments[index]?.reflection,
            ...translated.fragments[index]?.reflection,
            resonanceQuote: {
              ...base.fragments[index]?.reflection?.resonanceQuote,
              ...translated.fragments[index]?.reflection?.resonanceQuote,
            },
          },
        }))
      : base.fragments,
  };
}

function mergeStory(base, translated = {}) {
  return {
    ...base,
    ...translated,
    scenes: translated.scenes
      ? mergeByIndex(base.scenes, translated.scenes).map((scene, sceneIndex) => ({
          ...scene,
          choices: mergeByIndex(
            base.scenes[sceneIndex]?.choices,
            translated.scenes[sceneIndex]?.choices
          ).map((choice, choiceIndex) => ({
            ...choice,
            result: {
              ...base.scenes[sceneIndex]?.choices?.[choiceIndex]?.result,
              ...translated.scenes[sceneIndex]?.choices?.[choiceIndex]?.result,
            },
          })),
        }))
      : base.scenes,
  };
}

function localizeGeneratedMurakamiStory(story, language) {
  if (!story?.id?.startsWith("murakami-identity-chapter-") || language === defaultLanguage) {
    return story;
  }

  const isKazakh = language === "kk";
  const chapterTitle = isKazakh
    ? `${story.chapterNumber}-тарау — Жад пен болмыс`
    : `Глава ${story.chapterNumber} — Память и идентичность`;
  const optionLabels = isKazakh
    ? [
        "A. Кейіпкердің ішкі таңдауына назар аудару.",
        "B. Сахнаны жад пен жалғыздық арқылы түсіндіру.",
        "C. Белгілерді тағдыр мен өзін іздеу ретінде оқу.",
      ]
    : [
        "A. Сосредоточиться на внутреннем выборе героя.",
        "B. Прочитать сцену через память и одиночество.",
        "C. Понять символы как поиск судьбы и себя.",
      ];

  return {
    ...story,
    chapterTitle,
    shortTitle: chapterTitle,
    tagline: isKazakh
      ? "Жад, белгі және өзін іздеу"
      : "Память, символы и поиск себя",
    scenes: story.scenes.map((scene) => ({
      ...scene,
      title: isKazakh
        ? `${scene.sceneNumber}-сахна — Ішкі әлемнің белгісі`
        : `Сцена ${scene.sceneNumber} — Символ внутреннего мира`,
      context: isKazakh
        ? [
            "Бұл сахнада Мураками кейіпкердің сыртқы әрекетін оның ішкі күйімен байланыстырады.",
            "Жад, жалғыздық және белгісіздік оқырманды болмыс туралы ойлануға жетелейді.",
          ]
        : [
            "В этой сцене Мураками связывает внешнее действие героя с его внутренним состоянием.",
            "Память, одиночество и неопределённость подталкивают читателя к размышлению об идентичности.",
          ],
      prompt: isKazakh
        ? "Бұл сәт кейіпкердің өзін түсінуіне қалай әсер етеді?"
        : "Как этот момент влияет на понимание героем самого себя?",
      choices: scene.choices.map((choice, index) => ({
        ...choice,
        label: optionLabels[index] ?? optionLabels[0],
        result: {
          ...choice.result,
          status: choice.result?.isCorrect
            ? isKazakh
              ? "дұрыс"
              : "верно"
            : isKazakh
              ? "ішінара дұрыс"
              : "частично верно",
          explanation: isKazakh
            ? "Бұл жауап сахнаны кейіпкердің ішкі өзгерісімен және өзін іздеуімен байланыстырады."
            : "Этот ответ связывает сцену с внутренним изменением героя и поиском себя.",
          canonNote: isKazakh
            ? "Мураками прозасында мұндай сәттер нақты оқиға мен символдық мағынаны қатар ұстайды."
            : "В прозе Мураками такие моменты удерживают рядом конкретное событие и символический смысл.",
        },
      })),
    })),
  };
}

function localizeLabel(value, dictionary, language) {
  if (language === defaultLanguage) return value;
  return dictionary[value]?.[language] ?? value;
}

function localizeArrayStrings(items, dictionary, language) {
  return items.map((item) => dictionary[item]?.[language] ?? item);
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const value = useMemo(() => {
    const t = (key, values) =>
      formatMessage(ui[language]?.[key] ?? ui.en[key] ?? key, values);

    const setLanguage = (nextLanguage) => {
      if (languages.some((item) => item.code === nextLanguage)) {
        setLanguageState(nextLanguage);
      }
    };

    const label = (valueToTranslate, type = "theme") => {
      if (language === defaultLanguage) return valueToTranslate;
      if (type === "movement") {
        return miscTranslations.movements[valueToTranslate]?.[language]?.name ?? valueToTranslate;
      }
      return type === "theme"
        ? localizeLabel(valueToTranslate, themeLabels, language)
        : valueToTranslate;
    };

    const localizeWork = (work) => {
      if (!work) return work;
      const translated = workTranslations[work.id]?.[language];
      return mergeWork(work, translated ? { ...translated, lang: language } : {});
    };

    const localizeWorks = (works) => works.map(localizeWork);

    const localizeAuthor = (author) => {
      if (!author) return author;
      return {
        ...author,
        canonicalName: author.name,
        ...(authorTranslations[author.name]?.[language] ?? {}),
      };
    };

    const localizeAuthors = (authors) => authors.map(localizeAuthor);

    const localizeMetadata = (id, metadata) => ({
      ...metadata,
      ...(workMetadataTranslations[id]?.[language] ?? {}),
    });

    const localizeTimelineEntry = (entry) => ({
      ...entry,
      ...(literaryTimelineTranslations[entry.id]?.[language] ?? {}),
    });

    const localizeTimelineEntries = (entries) =>
      entries.map(localizeTimelineEntry);

    const localizeStory = (story) => {
      if (!story) return story;
      if (story.id?.startsWith("murakami-identity-chapter-")) {
        return localizeGeneratedMurakamiStory(story, language);
      }
      return mergeStory(story, storyTranslations[story.id]?.[language] ?? {});
    };

    const localizeStoryBook = (book) => {
      if (!book) return book;
      return {
        ...book,
        ...(storyBookTranslations[book.workId]?.[language] ?? {}),
        chapters: book.chapters?.map(localizeStory) ?? book.chapters,
      };
    };

    const localizeJourney = (journey) => ({
      ...journey,
      ...(journeyTranslations[journey.id]?.[language] ?? {}),
      focusTheme: localizeLabel(journey.focusTheme, themeLabels, language),
    });

    const localizeJourneys = (journeys = []) => journeys.map(localizeJourney);

    const localizeThemeCollection = (theme) => ({
      ...theme,
      name: localizeLabel(theme.name, themeLabels, language),
      description:
        language === defaultLanguage
          ? theme.description
          : themeCollectionTranslations[theme.name]?.[language] ?? theme.description,
    });

    const localizeThemeCollections = (themes = []) =>
      themes.map(localizeThemeCollection);

    const localizeGamification = (data) => ({
      ...data,
      progress: {
        ...data.progress,
        ...(gamificationTranslations[language]
          ? {
              activeJourney: gamificationTranslations[language].activeJourney,
              weeklyGoal: gamificationTranslations[language].weeklyGoal,
            }
          : {}),
      },
      badges: localizeAchievements(data.badges ?? []),
      weeklyChallenges:
        gamificationTranslations[language]?.weeklyChallenges ??
        data.weeklyChallenges,
      levels: gamificationTranslations[language]?.levels ?? data.levels,
    });

    const localizeCommunity = (data) => ({
      ...data,
      ...(communityTranslations[language] ?? {}),
    });

    const localizeMultimedia = (items) =>
      multimediaTranslations[language] ?? items;

    const localizeMapCategory = (key, meta) => ({
      ...meta,
      label:
        language === defaultLanguage
          ? meta.label
          : mapCategoryTranslations[key]?.[language] ?? meta.label,
    });

    const localizeMapMarker = (marker) => ({
      ...marker,
      ...(mapMarkerTranslations[marker.id]?.[language] ?? {}),
    });

    const localizeThemes = (themes = []) =>
      themes.map((theme) => localizeLabel(theme, themeLabels, language));

    const localizeAchievements = (items = []) =>
      localizeArrayStrings(items, achievementLabels, language);

    const localizeMisc = (valueToTranslate, group) => {
      if (language === defaultLanguage) return valueToTranslate;
      return miscTranslations[group]?.[valueToTranslate]?.[language] ?? valueToTranslate;
    };

    return {
      language,
      languages,
      setLanguage,
      t,
      label,
      localizeAuthor,
      localizeAuthors,
      localizeMisc,
      localizeMetadata,
      localizeTimelineEntries,
      localizeTimelineEntry,
      localizeStory,
      localizeStoryBook,
      localizeJourney,
      localizeJourneys,
      localizeThemeCollection,
      localizeThemeCollections,
      localizeGamification,
      localizeCommunity,
      localizeMultimedia,
      localizeMapCategory,
      localizeMapMarker,
      localizeThemes,
      localizeWork,
      localizeWorks,
      localizeAchievement: (achievement) =>
        language === defaultLanguage
          ? achievement
          : achievementLabels[achievement]?.[language] ?? achievement,
      localizeAchievements,
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
