import abaiCover from "../assets/authors/abai.jpg";
import auezovCover from "../assets/mura/portal-authors.jpg";
import seifullinCover from "../assets/mura/collection-prose.jpg";
import magzhanCover from "../assets/mura/collection-poetry.jpg";
import ilyasCover from "../assets/mura/collection-routes.jpg";

export const timelineBounds = {
  min: 1400,
  max: 2026,
  defaultYear: 1917,
};

export const literaryTimelineEntries = [
  {
    id: "oral-heritage-entry",
    year: 1450,
    type: "movement",
    title: "Oral heritage",
    description:
      "Epics, proverbs, songs, and storytelling preserve memory before the written archive.",
    image: ilyasCover,
    accent: "Folklore",
    ctaLabel: "Explore epoch",
    href: "/epochs",
    detailsTitle: "Oral heritage",
    detailsText:
      "Kazakh oral tradition carries ethics, genealogy, humor, grief, and the rhythm of nomadic life.",
    related: ["Folklore", "Epic memory", "Steppe culture"],
  },
  {
    id: "zhyrau-entry",
    year: 1700,
    type: "movement",
    title: "Zhyrau poetry",
    description:
      "Poets and singers shape public memory, counsel, courage, and historical imagination.",
    image: magzhanCover,
    accent: "Poetic voice",
    ctaLabel: "Explore epoch",
    href: "/epochs",
    detailsTitle: "Zhyrau poetry",
    detailsText:
      "The zhyrau tradition joins poetry, music, leadership, and communal reflection.",
    related: ["Song", "Counsel", "Memory"],
  },
  {
    id: "abai-author",
    year: 1845,
    type: "author",
    title: "Abai Kunanbayev",
    description:
      "A poet, thinker, and reforming voice who connected learning, conscience, and cultural renewal.",
    image: abaiCover,
    accent: "Kazakh Enlightenment",
    ctaLabel: "Explore author",
    href: "/author/Abai%20Kunanbayev",
    detailsTitle: "Abai Kunanbayev",
    detailsText:
      "Abai helps readers connect literary heritage with education, ethics, and the making of a thoughtful self.",
    related: ["Book of Words", "Poetry", "Moral education"],
  },
  {
    id: "alash-entry",
    year: 1911,
    type: "movement",
    title: "Alash and early XX century",
    description:
      "Literature becomes a language of education, nationhood, freedom, and responsibility.",
    image: magzhanCover,
    accent: "Alash",
    ctaLabel: "Start route",
    href: "/route/alash-voice",
    detailsTitle: "Alash and early XX century",
    detailsText:
      "Mirzhakyp Dulatuly and Saken Seifullin turn language, public thought, and historical memory into cultural action.",
    related: ["Masa", "Batyr Bayan", "Education"],
  },
  {
    id: "auezov-entry",
    year: 1942,
    type: "book",
    title: "The Path of Abai",
    description:
      "Mukhtar Auezov transforms Abai's life and epoch into a major literary memory of the nation.",
    image: auezovCover,
    accent: "Epic novel",
    ctaLabel: "Open work",
    href: "/reading/auezov-abai-path",
    detailsTitle: "The Path of Abai",
    detailsText:
      "The novel links biography, landscape, education, social change, and the moral growth of a people.",
    related: ["Mukhtar Auezov", "Abai", "XX century"],
  },
  {
    id: "soviet-entry",
    year: 1936,
    type: "movement",
    title: "Soviet Kazakh literature",
    description:
      "Writers explore modernization, repression, memory, and the pressure of historical change.",
    image: seifullinCover,
    accent: "Historical memory",
    ctaLabel: "Start route",
    href: "/route/memory-repression",
    detailsTitle: "Soviet Kazakh literature",
    detailsText:
      "Saken Seifullin and Ilyas Zhansugurov show how lyric beauty and civic tragedy can exist side by side.",
    related: ["Thorny Path", "Kulager", "Memory"],
  },
  {
    id: "modern-entry",
    year: 1991,
    type: "movement",
    title: "Independence and modern literature",
    description:
      "A new literary space revisits memory, identity, language, and contemporary responsibility.",
    image: ilyasCover,
    accent: "Modern Kazakhstan",
    ctaLabel: "Explore works",
    href: "/works",
    detailsTitle: "Independence and modern literature",
    detailsText:
      "Modern Kazakh writing continues the archive by connecting personal voice with national memory.",
    related: ["Identity", "Language", "Future"],
  },
];
