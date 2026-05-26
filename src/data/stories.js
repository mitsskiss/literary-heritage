function getStatusTone(status = "") {
  const normalized = status.toLowerCase();

  if (normalized.startsWith("correct")) return "correct";
  if (normalized.includes("partially")) return "partial";
  return "incorrect";
}

function createSceneChoice(id, label, xp, status, explanation, characterInsight, canonNote) {
  return {
    id,
    label,
    xp,
    result: {
      status,
      explanation,
      characterInsight,
      canonNote,
      tone: getStatusTone(status),
      isCorrect: getStatusTone(status) === "correct",
    },
  };
}

function createKazakhChapter({
  id,
  workId,
  chapterTitle,
  tagline,
  estimatedMinutes = 10,
  completionXp = 36,
  scenes,
}) {
  return {
    id,
    workId,
    chapterNumber: 1,
    chapterTitle,
    shortTitle: chapterTitle,
    tagline,
    estimatedMinutes,
    completionXp,
    scenes,
  };
}

const manualChapterStories = [
  createKazakhChapter({
    id: "abai-words",
    workId: "abai-words",
    chapterTitle: "The Work of Learning",
    tagline: "Reflection, knowledge, and becoming human",
    scenes: [
      {
        id: "curiosity",
        sceneNumber: 1,
        title: "Scene 1 - The Beginning of Learning",
        context: [
          "Abai begins not with institutions, but with the inner movement of a human being toward curiosity.",
          "The desire to understand is the first sign that moral and intellectual growth are possible.",
        ],
        prompt: "What is curiosity doing in this passage?",
        choices: [
          createSceneChoice(
            "foundation",
            "A. It becomes the foundation of human growth.",
            12,
            "correct",
            "Curiosity is treated as the beginning of education and self-awareness.",
            "Learning begins as an ethical impulse. Curiosity is the first step toward becoming human.",
            "In Abai's prose, curiosity is connected to education, moral awareness, and the development of a thoughtful self."
          ),
          createSceneChoice(
            "distraction",
            "B. It distracts the person from practical life.",
            6,
            "partially correct",
            "Abai sees curiosity as necessary for meaningful development, not as a distraction.",
            "Practical life and inner growth are not opposites in this text.",
            "The Words of Abai repeatedly return to learning as a serious human task."
          ),
          createSceneChoice(
            "neutral",
            "C. It is neutral and not central to the text.",
            3,
            "not quite accurate",
            "Curiosity is one of the first signs of inner awakening.",
            "The text is deeply invested in the beginnings of consciousness and learning.",
            "Abai gives curiosity moral and intellectual weight."
          ),
        ],
      },
      {
        id: "discipline",
        sceneNumber: 2,
        title: "Scene 2 - Knowledge Requires Effort",
        context: [
          "Abai does not romanticize learning. Desire alone is not enough.",
          "Attention, repetition, and discipline become the practical shape of intellectual life.",
        ],
        prompt: "How does Abai frame the process of knowledge?",
        choices: [
          createSceneChoice(
            "effort",
            "A. Knowledge grows through repeated effort and discipline.",
            12,
            "correct",
            "The text treats learning as sustained practice, not a single moment of inspiration.",
            "Meaningful knowledge is built through repetition, discipline, and intention.",
            "Abai often links education to labor and self-shaping."
          ),
          createSceneChoice(
            "talent",
            "B. Knowledge comes mainly from natural talent.",
            6,
            "partially correct",
            "Abai places more emphasis on labor and persistence than on innate ability.",
            "Growth depends on steady work, not only on talent.",
            "The text points toward discipline as the deeper condition of learning."
          ),
          createSceneChoice(
            "luck",
            "C. Knowledge depends mostly on luck.",
            3,
            "not quite accurate",
            "This passage is about effort, attention, and inner discipline.",
            "A person must participate actively in the making of knowledge.",
            "Abai insists that learning requires responsibility."
          ),
        ],
      },
      {
        id: "responsibility",
        sceneNumber: 3,
        title: "Scene 3 - Knowledge and Character",
        context: [
          "For Abai, knowledge is incomplete if it does not shape character.",
          "The goal is transformation: the educated person should become more just, aware, and responsible.",
        ],
        prompt: "What is the final measure of learning here?",
        choices: [
          createSceneChoice(
            "character",
            "A. Whether it changes the person ethically.",
            14,
            "correct",
            "Knowledge matters because it transforms the self.",
            "Abai asks the reader to judge learning by its ethical effect.",
            "The Words of Abai repeatedly return to the idea that knowledge without moral use remains unfinished."
          ),
          createSceneChoice(
            "status",
            "B. Whether it increases social prestige.",
            7,
            "partially correct",
            "Status is secondary. Abai is more interested in the moral use of learning.",
            "Recognition from others is not the true goal of knowledge here.",
            "The text points beyond reputation toward conscience and responsibility."
          ),
          createSceneChoice(
            "memory",
            "C. Whether it helps memorize more facts.",
            3,
            "not quite accurate",
            "Facts matter less here than what knowledge does to conscience and character.",
            "Learning is valuable because it changes how one lives.",
            "Abai ties education to the shaping of the self."
          ),
        ],
      },
    ],
  }),
  createKazakhChapter({
    id: "auezov-abai-path",
    workId: "auezov-abai-path",
    chapterTitle: "Becoming a Voice",
    tagline: "Biography, steppe, and moral formation",
    estimatedMinutes: 12,
    completionXp: 40,
    scenes: [
      {
        id: "landscape",
        sceneNumber: 1,
        title: "Scene 1 - Landscape as Memory",
        context: [
          "Auezov does not treat the steppe as a background only.",
          "Landscape carries family, custom, conflict, and the pressure of historical time.",
        ],
        prompt: "Why does place matter in this route?",
        choices: [
          createSceneChoice(
            "memory",
            "A. It carries cultural memory and shapes the hero.",
            14,
            "correct",
            "The place is part of the moral and cultural world of the novel.",
            "Auezov shows that identity grows inside landscape, family, and public life.",
            "The Path of Abai uses place as a living archive of social memory."
          ),
          createSceneChoice(
            "decoration",
            "B. It is mostly decorative scenery.",
            4,
            "not quite accurate",
            "The landscape is too meaningful to be only decoration.",
            "The reader should notice how place guides interpretation.",
            "Auezov's prose often lets landscape carry historical and emotional weight."
          ),
          createSceneChoice(
            "escape",
            "C. It allows the hero to avoid society.",
            6,
            "partially correct",
            "Solitude exists, but the landscape more often connects the hero to society.",
            "The route is about relation, not escape.",
            "The novel links personal growth to communal life."
          ),
        ],
      },
    ],
  }),
  createKazakhChapter({
    id: "baitursynuly-masa",
    workId: "baitursynuly-masa",
    chapterTitle: "Language as Awakening",
    tagline: "Education, responsibility, and public voice",
    estimatedMinutes: 10,
    completionXp: 34,
    scenes: [
      {
        id: "language",
        sceneNumber: 1,
        title: "Scene 1 - The Call to Wake",
        context: [
          "Baitursynuly writes as a teacher, reformer, and public thinker.",
          "Language is not a tool only; it becomes a way to awaken attention and responsibility.",
        ],
        prompt: "What does language do here?",
        choices: [
          createSceneChoice(
            "awakening",
            "A. It awakens readers to education and responsibility.",
            12,
            "correct",
            "Language becomes an instrument of civic and cultural awakening.",
            "The reader sees how literacy and self-respect belong together.",
            "Baitursynuly's work joins literature, education, and national consciousness."
          ),
          createSceneChoice(
            "ornament",
            "B. It is only a beautiful ornament.",
            3,
            "not quite accurate",
            "Beauty matters, but the text is also practical, urgent, and public.",
            "The route asks the reader to notice the civic force of language.",
            "The writing uses style to call people toward action."
          ),
          createSceneChoice(
            "private",
            "C. It avoids public questions.",
            4,
            "not quite accurate",
            "The text is deeply public in purpose.",
            "Baitursynuly's voice addresses education and society.",
            "Language reform and literature meet in the same cultural task."
          ),
        ],
      },
    ],
  }),
  createKazakhChapter({
    id: "zhumabayev-batyr-bayan",
    workId: "zhumabayev-batyr-bayan",
    chapterTitle: "Heroic Memory",
    tagline: "Poetry, loyalty, and national imagination",
    estimatedMinutes: 9,
    completionXp: 32,
    scenes: [
      {
        id: "heroic",
        sceneNumber: 1,
        title: "Scene 1 - The Lyric Heroic Voice",
        context: [
          "Magzhan combines emotional intensity with historical imagination.",
          "The poem asks the reader to feel history as a living inner force.",
        ],
        prompt: "What gives the poem its power?",
        choices: [
          createSceneChoice(
            "emotion-history",
            "A. Emotion and history become inseparable.",
            12,
            "correct",
            "The poem makes historical memory lyrical and intimate.",
            "The reader sees that heroism is not only event, but feeling and sacrifice.",
            "Magzhan's poetic language turns memory into music and moral tension."
          ),
          createSceneChoice(
            "facts",
            "B. It works only as a list of facts.",
            3,
            "not quite accurate",
            "The poem is not documentary in that narrow sense.",
            "Its force comes from image, rhythm, and emotional meaning.",
            "The poem transforms history through lyric imagination."
          ),
          createSceneChoice(
            "distance",
            "C. It keeps the reader emotionally distant.",
            4,
            "not quite accurate",
            "The poem invites emotional involvement.",
            "The reader is meant to feel the cost of loyalty and loss.",
            "Magzhan's style is intense, musical, and inward."
          ),
        ],
      },
    ],
  }),
  createKazakhChapter({
    id: "seifullin-thorny-path",
    workId: "seifullin-thorny-path",
    chapterTitle: "History as Testimony",
    tagline: "Memory, upheaval, and civic courage",
    estimatedMinutes: 11,
    completionXp: 36,
    scenes: [
      {
        id: "testimony",
        sceneNumber: 1,
        title: "Scene 1 - Writing Through Change",
        context: [
          "Seifullin writes from inside a century of rupture and transformation.",
          "The text asks how literature can carry witness when history becomes unstable.",
        ],
        prompt: "Why does testimony matter here?",
        choices: [
          createSceneChoice(
            "witness",
            "A. It keeps personal and public memory from disappearing.",
            12,
            "correct",
            "Testimony gives history a human voice.",
            "The reader sees that literature can preserve experience under pressure.",
            "Seifullin's writing joins narrative, memory, and civic responsibility."
          ),
          createSceneChoice(
            "escape",
            "B. It lets the writer avoid history.",
            3,
            "not quite accurate",
            "The writing moves toward history, not away from it.",
            "The route asks the reader to confront memory directly.",
            "The text is shaped by public events and personal cost."
          ),
          createSceneChoice(
            "neutral",
            "C. It makes history emotionally neutral.",
            4,
            "not quite accurate",
            "The text is not neutral; it carries urgency and consequence.",
            "The reader should notice the human pressure inside events.",
            "Seifullin's route is a memory route, not a detached summary."
          ),
        ],
      },
    ],
  }),
];

export const chapterStoryLibrary = Object.fromEntries(
  manualChapterStories.map((story) => [story.id, story])
);

const storyBooks = Object.fromEntries(
  manualChapterStories.map((story) => [
    story.workId,
    {
      workId: story.workId,
      overview: story.tagline,
      chapterIds: [story.id],
    },
  ])
);

export function hasStoryMode(workId) {
  return Boolean(storyBooks[workId]);
}

export function getStoryById(id) {
  return chapterStoryLibrary[id] ?? null;
}

export function getChaptersByWorkId(workId) {
  const book = storyBooks[workId];

  if (!book) return [];

  return book.chapterIds
    .map((chapterId) => chapterStoryLibrary[chapterId])
    .filter(Boolean)
    .sort((left, right) => left.chapterNumber - right.chapterNumber);
}

export function getStoryBookByWorkId(workId) {
  const book = storyBooks[workId];

  if (!book) return null;

  const chapters = getChaptersByWorkId(workId);

  return {
    ...book,
    chapters,
    totalScenes: chapters.reduce((sum, chapter) => sum + chapter.scenes.length, 0),
    totalMinutes: chapters.reduce((sum, chapter) => sum + chapter.estimatedMinutes, 0),
    totalXp: chapters.reduce((sum, chapter) => sum + chapter.completionXp, 0),
  };
}

export function getStoryChapterByWorkAndNumber(workId, chapterNumber) {
  return (
    getChaptersByWorkId(workId).find(
      (chapter) => String(chapter.chapterNumber) === String(chapterNumber)
    ) ?? null
  );
}

export function getChapterPath(workId, chapterNumber) {
  return `/reading/${workId}/chapter/${chapterNumber}`;
}
