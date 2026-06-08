import { useEffect, useMemo, useState } from "react";
import { I18nContext } from "./context";
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
  storyResultTranslations,
  storyTranslations,
  themeCollectionTranslations,
  themeLabels,
  ui,
  workMetadataTranslations,
  workTranslations,
} from "./translations";

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
  const dataLocale = base.locales?.[translated.lang] ?? {};
  const mergedTranslation = {
    ...dataLocale,
    ...translated,
  };

  return {
    ...base,
    ...mergedTranslation,
    canonicalTitle: base.title,
    canonicalAuthor: base.author,
    canonicalThemes: base.themes ?? [],
    themes:
      mergedTranslation.themes ??
      base.themes?.map((theme) => localizeLabel(theme, themeLabels, translated.lang)) ??
      base.themes,
    fragments: mergedTranslation.fragments
      ? mergeByIndex(base.fragments, mergedTranslation.fragments).map((fragment, index) => ({
          ...fragment,
          annotations: mergeByIndex(
            base.fragments[index]?.annotations,
            mergedTranslation.fragments[index]?.annotations
          ),
          reflection: {
            ...base.fragments[index]?.reflection,
            ...mergedTranslation.fragments[index]?.reflection,
            resonanceQuote: {
              ...base.fragments[index]?.reflection?.resonanceQuote,
              ...mergedTranslation.fragments[index]?.reflection?.resonanceQuote,
            },
          },
        }))
      : base.fragments,
  };
}

function mergeStory(base, translated = {}, resultTranslations = {}) {
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
              ...(resultTranslations[base.scenes[sceneIndex]?.id]?.[
                base.scenes[sceneIndex]?.choices?.[choiceIndex]?.id
              ] ?? {}),
            },
          })),
        }))
      : base.scenes,
  };
}

function localizeStoryForLanguage(story, language) {
  if (!story) return story;
  return mergeStory(
    story,
    storyTranslations[story.id]?.[language] ?? {},
    storyResultTranslations[story.id]?.[language] ?? {}
  );
}

function localizeLabel(value, dictionary, language) {
  if (language === defaultLanguage) return value;
  return dictionary[value]?.[language] ?? value;
}

function localizeObjectValue(value, language) {
  if (!value || typeof value !== "object") return value;
  return value[language] ?? value.en ?? value.ru ?? value.kk ?? "";
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
      return mergeWork(work, { ...(translated ?? {}), lang: language });
    };

    const localizeWorks = (works) => works.map(localizeWork);

    const localizeAuthor = (author) => {
      if (!author) return author;
      return {
        ...author,
        canonicalName: author.name,
        ...(author.locales?.[language] ?? {}),
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

    const localizeStory = (story) => localizeStoryForLanguage(story, language);

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
      canonicalFocusTheme: journey.focusTheme,
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

    const localizeMapMarker = (marker) => {
      const translated =
        mapMarkerTranslations[marker.id]?.[language] ??
        literaryTimelineTranslations[marker.id]?.[language] ??
        {};
      const localizedType = localizeObjectValue(marker.type, language);
      const localizedTitle = localizeObjectValue(marker.title, language);
      const localizedCity = localizeObjectValue(marker.city, language);
      const localizedRegion = localizeObjectValue(marker.region, language);
      const localizedDescription = localizeObjectValue(
        marker.description ?? marker.shortDescription,
        language
      );
      const localizedCategory = localizeMapCategory(marker.category, { label: localizedType });

      return {
        ...marker,
        name: localizedTitle ?? marker.name,
        city: localizedCity ?? marker.city,
        region: localizedRegion ?? marker.region,
        description: localizedDescription ?? marker.description,
        ...translated,
        canonicalType: localizedType,
        type: translated.type ?? localizedCategory.label ?? localizedType,
      };
    };

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
      localizeStoryInLanguage: localizeStoryForLanguage,
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
