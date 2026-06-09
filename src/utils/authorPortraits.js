export const EXCLUDED_AUTHOR_NAMES = new Set(["Akhmet Baitursynuly"]);

export const EXCLUDED_WORK_IDS = new Set([
  "baitursynuly-masa",
  "baitursynuly-forty-fables",
]);

export function isExcludedAuthorName(name) {
  return EXCLUDED_AUTHOR_NAMES.has(name);
}

export function isExcludedWorkId(id) {
  return EXCLUDED_WORK_IDS.has(id);
}

export function hasRealAuthorPortrait(author) {
  if (!author) return false;

  const source = String(author.portraitSource ?? "");
  const credit = String(author.portraitCredit ?? "").toLowerCase();
  const portrait = author.portrait ?? author.image;

  if (!portrait) return false;
  if (source.startsWith("local:mura-placeholder")) return false;
  if (credit.includes("placeholder")) return false;

  return true;
}

export function getAuthorsWithPortrait(authors = []) {
  return authors.filter(
    (author) =>
      hasRealAuthorPortrait(author) &&
      !isExcludedAuthorName(author.canonicalName ?? author.name)
  );
}

export function createAuthorPortraitNameSet(authors = []) {
  return new Set(
    getAuthorsWithPortrait(authors).flatMap((author) =>
      [author.name, author.canonicalName].filter(Boolean)
    )
  );
}

export function getVisibleWorks(works = [], authors = []) {
  const authorNames = createAuthorPortraitNameSet(authors);

  return works.filter((work) => {
    const authorName = work.canonicalAuthor ?? work.author;
    return !isExcludedWorkId(work.id) && authorNames.has(authorName);
  });
}

export function getVisibleRoutes(routes = [], visibleWorks = []) {
  const visibleWorkIds = new Set(visibleWorks.map((work) => work.id));

  return routes
    .map((route) => ({
      ...route,
      works: (route.works ?? []).filter((workId) => visibleWorkIds.has(workId)),
      steps: (route.steps ?? []).filter(
        (step) => !step.workId || visibleWorkIds.has(step.workId)
      ),
    }))
    .filter((route) => route.works.length > 0);
}

export function getVisibleEpochs(epochs = [], visibleWorks = []) {
  const visibleWorkIds = new Set(visibleWorks.map((work) => work.id));

  return epochs
    .map((epoch) => ({
      ...epoch,
      authors: (epoch.authors ?? []).filter((author) => !isExcludedAuthorName(author)),
      works: (epoch.works ?? []).filter((workId) => visibleWorkIds.has(workId)),
    }));
}

export function getVisibleMapMarkers(markers = []) {
  return markers.filter((marker) => !isExcludedAuthorName(marker.author));
}
