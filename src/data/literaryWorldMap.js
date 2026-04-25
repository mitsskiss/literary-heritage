import { works } from "./works";

const bookOrigins = {
  "dostoevsky-crime": {
    year: 1866,
    years: "1865-1866",
    category: "classics",
    country: "Russia",
    city: "Saint Petersburg",
    position: { x: 56.7, y: 30.5 },
    originNote:
      "Written in Saint Petersburg and first published serially in 1866.",
    context:
      "A psychological journey through guilt, poverty, conscience, and the question of whether any idea can justify violence.",
    sourceLabel: "Publication: 1866",
  },
  "woolf-dalloway": {
    year: 1925,
    years: "1925",
    category: "novels",
    country: "United Kingdom",
    city: "London",
    position: { x: 46.6, y: 31.8 },
    originNote:
      "Published in 1925 and built around one day in London after World War I.",
    context:
      "A modernist portrait of memory, time, social performance, and the private life hidden inside ordinary movement.",
    sourceLabel: "Publication: 1925",
  },
  "camus-stranger": {
    year: 1942,
    years: "1942",
    category: "philosophy",
    country: "Algeria / France",
    city: "Algiers context",
    position: { x: 48.8, y: 45.4 },
    originNote:
      "Published in France in 1942; its central world is French Algeria and Algiers.",
    context:
      "A spare, unsettling story about emotional detachment, judgment, absurdity, and the pressure to perform meaning.",
    sourceLabel: "Publication: 1942",
  },
  "abai-words": {
    year: 1890,
    years: "1890-1898",
    category: "philosophy",
    country: "Kazakhstan",
    city: "Semey region",
    position: { x: 64.3, y: 35.4 },
    originNote:
      "A cycle of philosophical prose reflections written across the 1890s.",
    context:
      "Abai turns literature into ethical self-education: knowledge, responsibility, character, and cultural renewal.",
    sourceLabel: "Written: 1890-1898",
  },
  "murakami-identity": {
    year: 2002,
    years: "2002",
    category: "novels",
    country: "Japan",
    city: "Tokyo / Takamatsu",
    position: { x: 79.5, y: 40.2 },
    originNote:
      "First published in Japan in 2002.",
    context:
      "A dreamlike coming-of-age novel where fate, memory, music, and myth reshape the border between inner and outer life.",
    sourceLabel: "Publication: 2002",
  },
};

export const mapCategoryMeta = {
  novels: {
    label: "Novels",
    color: "#5274ff",
  },
  poetry: {
    label: "Poetry",
    color: "#e95d4f",
  },
  drama: {
    label: "Drama",
    color: "#43a96f",
  },
  philosophy: {
    label: "Philosophy",
    color: "#8c67df",
  },
  classics: {
    label: "Classics",
    color: "#d79a22",
  },
};

export const literaryWorldMarkers = works
  .map((work) => {
    const details = bookOrigins[work.id];

    if (!details) return null;

    return {
      id: work.id,
      workId: work.id,
      name: work.title,
      author: work.author,
      image: work.image,
      themes: work.themes,
      description: work.description,
      startYear: details.year,
      endYear: 2025,
      ...details,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.startYear - b.startYear);

export const mapBounds = {
  minYear: 1600,
  maxYear: 2025,
  defaultYear: 2025,
};
