import fallbackCover from "../assets/logo.jpg";

export const adminContentStorageKey = "literary_admin_content_v1";
export const adminContentEventName = "literary-admin-content-change";

export const emptyAdminContent = {
  authors: [],
  works: [],
  chapters: [],
  translations: [],
};

const defaultChoice = (id, label, isCorrect = false) => ({
  id,
  label,
  xp: isCorrect ? 12 : 4,
  result: {
    status: isCorrect ? "Correct" : "Needs another look",
    explanation: isCorrect
      ? "This answer connects the scene with the main literary idea."
      : "This answer is possible, but it misses the strongest textual signal.",
    characterInsight: "The choice helps the reader notice how the character changes.",
    canonNote: "This idea can be traced in the original work through action, tone, or imagery.",
    tone: isCorrect ? "correct" : "partial",
    isCorrect,
  },
});

export function createBlankScene(sceneNumber = 1) {
  return {
    id: `scene-${Date.now()}-${sceneNumber}`,
    sceneNumber,
    title: `Scene ${sceneNumber}`,
    context: ["Add the reading context here."],
    prompt: "What should the reader understand in this moment?",
    choices: [
      defaultChoice("a", "A. Main interpretation", true),
      defaultChoice("b", "B. Partial interpretation"),
      defaultChoice("c", "C. Weak interpretation"),
    ],
  };
}

function splitList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeId(value, fallback = "item") {
  const slug = String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `${fallback}-${Date.now()}`;
}

function normalizeAuthor(author = {}) {
  const name = String(author.name ?? "").trim();
  return {
    id: normalizeId(author.id ?? name, "author"),
    name,
    image: String(author.image ?? "").trim(),
    period: String(author.period ?? "").trim(),
    description: String(author.description ?? "").trim(),
  };
}

function normalizeFragment(fragment = {}, index = 0) {
  return {
    id: normalizeId(fragment.id ?? `fragment-${index + 1}`, "fragment"),
    text: String(fragment.text ?? "").trim(),
    authorNote: String(fragment.authorNote ?? "").trim(),
    annotations: Array.isArray(fragment.annotations) ? fragment.annotations : [],
  };
}

function normalizeWork(work = {}) {
  const title = String(work.title ?? "").trim();
  const author = String(work.author ?? "").trim();
  return {
    id: normalizeId(work.id ?? title, "work"),
    title,
    author,
    canonicalAuthor: author,
    image: String(work.image ?? "").trim() || fallbackCover,
    year: Number(work.year) || "",
    themes: splitList(work.themes),
    description: String(work.description ?? "").trim(),
    type: String(work.type ?? "Work").trim(),
    period: String(work.period ?? "").trim(),
    mood: String(work.mood ?? "").trim(),
    readingTime: Number(work.readingTime) || 10,
    whyNow: String(work.whyNow ?? "").trim(),
    fragments: Array.isArray(work.fragments)
      ? work.fragments.map(normalizeFragment).filter((fragment) => fragment.text)
      : [],
  };
}

function normalizeScene(scene = {}, index = 0) {
  const sceneNumber = Number(scene.sceneNumber) || index + 1;
  const choices = Array.isArray(scene.choices) && scene.choices.length > 0
    ? scene.choices
    : createBlankScene(sceneNumber).choices;

  return {
    id: normalizeId(scene.id ?? `scene-${sceneNumber}`, "scene"),
    sceneNumber,
    title: String(scene.title ?? `Scene ${sceneNumber}`).trim(),
    context: Array.isArray(scene.context)
      ? scene.context.map(String).filter(Boolean)
      : String(scene.context ?? "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
    prompt: String(scene.prompt ?? "").trim(),
    choices: choices.map((choice, choiceIndex) => {
      const result = choice.result ?? {};
      const isCorrect = Boolean(result.isCorrect ?? choiceIndex === 0);
      return {
        id: normalizeId(choice.id ?? String.fromCharCode(97 + choiceIndex), "choice"),
        label: String(choice.label ?? "").trim(),
        xp: Number(choice.xp) || (isCorrect ? 12 : 4),
        result: {
          status: String(result.status ?? (isCorrect ? "Correct" : "Needs another look")).trim(),
          explanation: String(result.explanation ?? "").trim(),
          characterInsight: String(result.characterInsight ?? "").trim(),
          canonNote: String(result.canonNote ?? "").trim(),
          tone: result.tone ?? (isCorrect ? "correct" : "partial"),
          isCorrect,
        },
      };
    }),
  };
}

function normalizeChapter(chapter = {}) {
  const chapterNumber = Number(chapter.chapterNumber) || 1;
  const workId = normalizeId(chapter.workId, "work");
  const scenes = Array.isArray(chapter.scenes) && chapter.scenes.length > 0
    ? chapter.scenes.map(normalizeScene)
    : [createBlankScene(1)];

  return {
    id: normalizeId(chapter.id ?? `${workId}-chapter-${chapterNumber}`, "chapter"),
    workId,
    chapterNumber,
    chapterTitle: String(chapter.chapterTitle ?? `Chapter ${chapterNumber}`).trim(),
    shortTitle: String(chapter.shortTitle ?? chapter.chapterTitle ?? `Chapter ${chapterNumber}`).trim(),
    tagline: String(chapter.tagline ?? "").trim(),
    estimatedMinutes: Number(chapter.estimatedMinutes) || Math.max(8, scenes.length * 4),
    completionXp: Number(chapter.completionXp) || scenes.reduce((sum, scene) => {
      const maxChoice = Math.max(0, ...scene.choices.map((choice) => Number(choice.xp) || 0));
      return sum + maxChoice;
    }, 0),
    scenes,
  };
}

function normalizeTranslation(item = {}) {
  return {
    id: normalizeId(item.id ?? `${item.entityType}-${item.entityId}-${item.language}`, "translation"),
    entityType: item.entityType ?? "work",
    entityId: String(item.entityId ?? "").trim(),
    language: item.language ?? "ru",
    title: String(item.title ?? "").trim(),
    name: String(item.name ?? "").trim(),
    description: String(item.description ?? "").trim(),
    period: String(item.period ?? "").trim(),
    tagline: String(item.tagline ?? "").trim(),
  };
}

export function normalizeAdminContent(content = emptyAdminContent) {
  return {
    authors: (content.authors ?? []).map(normalizeAuthor).filter((author) => author.name),
    works: (content.works ?? []).map(normalizeWork).filter((work) => work.title && work.author),
    chapters: (content.chapters ?? []).map(normalizeChapter).filter((chapter) => chapter.workId),
    translations: (content.translations ?? [])
      .map(normalizeTranslation)
      .filter((item) => item.entityId && item.language),
  };
}

export function loadAdminContent() {
  if (typeof window === "undefined") return emptyAdminContent;

  try {
    const stored = window.localStorage.getItem(adminContentStorageKey);
    if (!stored) return emptyAdminContent;
    return normalizeAdminContent(JSON.parse(stored));
  } catch {
    return emptyAdminContent;
  }
}

export function saveAdminContent(content) {
  if (typeof window === "undefined") return;

  const normalized = normalizeAdminContent(content);
  window.localStorage.setItem(adminContentStorageKey, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(adminContentEventName, { detail: normalized }));
}

export function applyAdminTranslation(entity, translations, type, language) {
  if (!entity || language === "en") return entity;

  const translated = translations.find(
    (item) =>
      item.entityType === type &&
      item.entityId === (entity.id ?? entity.name) &&
      item.language === language
  );

  if (!translated) return entity;

  return {
    ...entity,
    title: translated.title || entity.title,
    name: translated.name || entity.name,
    description: translated.description || entity.description,
    period: translated.period || entity.period,
    tagline: translated.tagline || entity.tagline,
    chapterTitle: translated.title || entity.chapterTitle,
  };
}

export function mergeAdminAuthors(baseAuthors, content, language = "en") {
  const adminAuthors = content.authors.map((author) => ({
    ...author,
    canonicalName: author.name,
    image: author.image || fallbackCover,
  }));

  const byName = new Map(baseAuthors.map((author) => [author.canonicalName ?? author.name, author]));

  adminAuthors.forEach((author) => {
    byName.set(author.name, applyAdminTranslation(author, content.translations, "author", language));
  });

  return [...byName.values()];
}

export function mergeAdminWorks(baseWorks, content, language = "en") {
  const byId = new Map(baseWorks.map((work) => [work.id, work]));

  content.works.forEach((work) => {
    byId.set(
      work.id,
      applyAdminTranslation(
        {
          ...work,
          canonicalTitle: work.title,
          canonicalAuthor: work.author,
          image: work.image || fallbackCover,
        },
        content.translations,
        "work",
        language
      )
    );
  });

  return [...byId.values()];
}

export function getAdminStoryBookByWorkId(workId, content, language = "en") {
  const chapters = content.chapters
    .filter((chapter) => chapter.workId === workId)
    .sort((left, right) => left.chapterNumber - right.chapterNumber)
    .map((chapter) => applyAdminTranslation(chapter, content.translations, "chapter", language));

  if (chapters.length === 0) return null;

  return {
    workId,
    overview: "A custom reading route created in the admin panel.",
    chapters,
    totalScenes: chapters.reduce((sum, chapter) => sum + chapter.scenes.length, 0),
    totalMinutes: chapters.reduce((sum, chapter) => sum + chapter.estimatedMinutes, 0),
    totalXp: chapters.reduce((sum, chapter) => sum + chapter.completionXp, 0),
  };
}

export function getAdminStoryChapterByWorkAndNumber(workId, chapterNumber, content, language = "en") {
  return (
    getAdminStoryBookByWorkId(workId, content, language)?.chapters.find(
      (chapter) => String(chapter.chapterNumber) === String(chapterNumber)
    ) ?? null
  );
}
