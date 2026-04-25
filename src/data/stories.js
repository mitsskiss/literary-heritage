import kafkaOnTheShoreRaw from "./kafka-on-the-shore.txt?raw";

function normalizeImportedText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/вЂ™s/g, "'s")
    .replace(/вЂ™/g, "'")
    .replace(/вЂ”/g, "—")
    .replace(/вЂњ/g, '"')
    .replace(/вЂќ/g, '"')
    .replace(/в†’/g, "→")
    .replace(/Â/g, "")
    .trim();
}

function toParagraphs(block) {
  return block
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
    .filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getStatusTone(status = "") {
  const normalized = status.toLowerCase();

  if (normalized.startsWith("correct")) return "correct";
  if (normalized.includes("partially")) return "partial";
  return "incorrect";
}

function parseLabeledFields(section) {
  const fields = {};
  const fieldRegex = /\*\*([^*]+):\*\*\s*([\s\S]*?)(?=\n\n\*\*[^*]+:\*\*|$)/g;
  let match = fieldRegex.exec(section);

  while (match) {
    fields[match[1].trim()] = match[2].replace(/\n+/g, " ").trim();
    match = fieldRegex.exec(section);
  }

  return fields;
}

function parseChoiceResult(sceneBlock, letter) {
  const answerRegex = new RegExp(
    `## If the user chose ${letter}\\n\\n([\\s\\S]*?)(?=\\n---\\n\\n## If the user chose|\\n---\\n\\n## What happens next after the answer|$)`
  );
  const answerMatch = sceneBlock.match(answerRegex);

  if (!answerMatch) {
    return {
      status: "Interpretation saved",
      explanation: "",
      characterInsight: "",
      canonNote: "",
      tone: "partial",
      isCorrect: false,
      xp: 0,
    };
  }

  const fields = parseLabeledFields(answerMatch[1]);
  const status = fields.Result ?? "Interpretation saved";
  const xp = Number((fields.Reward ?? "").match(/\+?(\d+)/)?.[1] ?? 0);

  return {
    status,
    explanation: fields.Explanation ?? "",
    characterInsight:
      fields["How this helps the reader understand the character"] ?? "",
    canonNote: fields["How it appears in the original work"] ?? "",
    tone: getStatusTone(status),
    isCorrect: getStatusTone(status) === "correct",
    xp,
  };
}

function parseKafkaChapterScenes(workId, chapterNumber, chapterBlock) {
  const sceneRegex = /^## Scene\s+(\d+)\.\s+(.+)$/gm;
  const sceneMatches = [...chapterBlock.matchAll(sceneRegex)];

  return sceneMatches.map((sceneMatch, sceneIndex) => {
    const sceneStart = sceneMatch.index;
    const sceneEnd =
      sceneIndex + 1 < sceneMatches.length
        ? sceneMatches[sceneIndex + 1].index
        : chapterBlock.length;
    const sceneBlock = chapterBlock.slice(sceneStart, sceneEnd);

    const contextMatch = sceneBlock.match(
      /### Context\s+([\s\S]*?)\n### Question/
    );
    const questionMatch = sceneBlock.match(
      /### Question\s+([\s\S]*?)\n### Options/
    );
    const optionsBlock =
      sceneBlock.match(/### Options\s+([\s\S]*?)\n---\n\n# Answer Logic/)?.[1] ??
      "";
    const optionMatches = [...optionsBlock.matchAll(/\*\*([A-Z])\.\*\*\s+(.+)$/gm)];

    return {
      id: `${workId}-chapter-${chapterNumber}-scene-${sceneMatch[1]}`,
      sceneNumber: Number(sceneMatch[1]),
      title: `Scene ${sceneMatch[1]} — ${sceneMatch[2].trim()}`,
      context: toParagraphs(contextMatch?.[1] ?? ""),
      prompt: (questionMatch?.[1] ?? "").replace(/\n+/g, " ").trim(),
      choices: optionMatches.map((optionMatch) => {
        const result = parseChoiceResult(sceneBlock, optionMatch[1]);

        return {
          id: optionMatch[1].toLowerCase(),
          label: `${optionMatch[1]}. ${optionMatch[2].trim()}`,
          xp: result.xp,
          result,
        };
      }),
    };
  });
}

function parseKafkaOnTheShoreStories(rawText) {
  const text = normalizeImportedText(rawText);
  const chapterRegex = /^# Chapter\s+(\d+)\.\s+(.+)$/gm;
  const chapterMatches = [...text.matchAll(chapterRegex)];

  return chapterMatches.map((chapterMatch, chapterIndex) => {
    const chapterStart = chapterMatch.index;
    const chapterEnd =
      chapterIndex + 1 < chapterMatches.length
        ? chapterMatches[chapterIndex + 1].index
        : text.length;
    const chapterBlock = text.slice(chapterStart, chapterEnd);
    const chapterNumber = Number(chapterMatch[1]);
    const chapterTitle = chapterMatch[2].trim();
    const chapterId = `murakami-identity-chapter-${chapterNumber}`;
    const scenes = parseKafkaChapterScenes("murakami-identity", chapterNumber, chapterBlock);

    return {
      id: chapterId,
      workId: "murakami-identity",
      chapterNumber,
      chapterTitle,
      shortTitle: chapterTitle,
      tagline: scenes[0]?.prompt ?? "A guided literary chapter",
      estimatedMinutes: Math.max(8, scenes.length * 4),
      completionXp: scenes.reduce((sum, scene) => {
        const highestChoiceXp = Math.max(
          0,
          ...scene.choices.map((choice) => choice.xp)
        );

        return sum + highestChoiceXp;
      }, 0),
      scenes,
    };
  });
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

const manualChapterStories = [
  {
    id: "dostoevsky-crime",
    workId: "dostoevsky-crime",
    chapterNumber: 3,
    chapterTitle: "The Burden of Conscience",
    shortTitle: "The Burden of Conscience",
    tagline: "Moral choice and consequence",
    estimatedMinutes: 12,
    completionXp: 40,
    scenes: [
      {
        id: "threshold",
        sceneNumber: 1,
        title: "Scene 1 — The Thought Before Action",
        context: [
          "Raskolnikov has not acted yet, but the idea itself has already begun to reshape him.",
          "The tension of the scene comes from his attempt to justify a violent act through abstract theory and personal pride.",
        ],
        prompt: "What makes this moment dangerous?",
        choices: [
          createSceneChoice(
            "idea",
            "A. The idea is becoming more important than conscience.",
            12,
            "correct",
            "Dostoevsky shows how abstract theories can become more persuasive than lived moral feeling.",
            "Raskolnikov's tragedy begins before the crime itself. The deeper crisis is the moment he starts trusting theory more than conscience.",
            "In the novel, the crime is built out of inner argument, feverish rationalization, and spiritual confusion rather than sudden impulse."
          ),
          createSceneChoice(
            "poverty",
            "B. Only poverty pushes him toward the edge.",
            6,
            "partially correct",
            "Poverty matters, but the novel is more interested in how thought and pride turn suffering into moral permission.",
            "The reader sees that material hardship alone does not explain the collapse. The danger lies in how the character interprets suffering.",
            "Dostoevsky keeps material pressure present, but he turns the moral debate inside the mind into the real battleground."
          ),
          createSceneChoice(
            "chance",
            "C. It is mostly chance, not a deep internal conflict.",
            3,
            "not quite accurate",
            "Chance surrounds the plot, but this scene is fundamentally about inner justification and the collapse of ethical boundaries.",
            "This answer helps clarify that the novel is never casual about violence. A deep moral fracture is already underway.",
            "The original text is deliberate and psychologically dense here, not accidental or random."
          ),
        ],
      },
      {
        id: "aftershock",
        sceneNumber: 2,
        title: "Scene 2 — After the Act",
        context: [
          "The expected clarity never comes. Instead of triumph, the mind becomes fractured and feverish.",
          "Dostoevsky turns guilt into atmosphere: suspicion, confusion, and isolation begin to surround every movement.",
        ],
        prompt: "How does the novel treat punishment here?",
        choices: [
          createSceneChoice(
            "inner",
            "A. Punishment begins inside the mind before the law arrives.",
            12,
            "correct",
            "Psychological punishment starts immediately, long before any formal judgment.",
            "The scene reveals that punishment starts within the character himself. Guilt becomes a psychological prison long before society can name the crime.",
            "In the original novel, the aftermath is full of delirium, fear, and disorientation. External danger matters, but the internal collapse matters more."
          ),
          createSceneChoice(
            "external",
            "B. Punishment matters only when society reacts.",
            6,
            "partially correct",
            "The external world matters, but Dostoevsky makes the inner collapse the first and deepest consequence.",
            "The reader sees that judgment in this novel is not postponed until the courtroom. It begins within the conscience.",
            "The law eventually matters, but the text makes fear, guilt, and self-alienation arrive first."
          ),
          createSceneChoice(
            "none",
            "C. There is almost no punishment until the ending.",
            3,
            "not quite accurate",
            "The novel insists that punishment starts almost at once through fear, guilt, and self-alienation.",
            "This helps reveal how quickly the character begins to unravel. Consequence is psychological before it is legal.",
            "Dostoevsky does not delay punishment; he lets it fill the atmosphere almost immediately."
          ),
        ],
      },
      {
        id: "confession",
        sceneNumber: 3,
        title: "Scene 3 — Toward Confession",
        context: [
          "The final movement is not only about crime. It is about whether truth can become the first step toward moral repair.",
          "Confession is painful because it demands the collapse of the false self that tried to stand above others.",
        ],
        prompt: "Why does confession matter in this story?",
        choices: [
          createSceneChoice(
            "renewal",
            "A. It opens the possibility of renewal through truth.",
            14,
            "correct",
            "The novel treats confession not as a simple ending, but as the beginning of moral reconstruction.",
            "Confession marks the first honest movement away from pride and toward responsibility.",
            "Dostoevsky treats confession not as a neat resolution, but as the painful beginning of spiritual change."
          ),
          createSceneChoice(
            "escape",
            "B. It is only a practical escape from anxiety.",
            7,
            "partially correct",
            "Relief matters, but the novel gives confession a spiritual and ethical weight beyond comfort.",
            "The reader begins to see that truth is not just therapeutic here. It is morally necessary.",
            "The ending carries emotional relief, but also the burden of responsibility and moral rebirth."
          ),
          createSceneChoice(
            "defeat",
            "C. It means the story ends in complete defeat only.",
            3,
            "not quite accurate",
            "The ending is painful, but Dostoevsky leaves space for transformation rather than pure defeat.",
            "This helps the reader notice that suffering does not close the story entirely. It can also open the way to change.",
            "The text refuses a simple victory or defeat model and moves toward uneasy renewal."
          ),
        ],
      },
    ],
  },
  {
    id: "abai-words",
    workId: "abai-words",
    chapterNumber: 1,
    chapterTitle: "The Work of Learning",
    shortTitle: "The Work of Learning",
    tagline: "Reflection, knowledge, and becoming human",
    estimatedMinutes: 10,
    completionXp: 36,
    scenes: [
      {
        id: "curiosity",
        sceneNumber: 1,
        title: "Scene 1 — The Beginning of Learning",
        context: [
          "Abai begins not with institutions, but with the inner movement of the human being toward curiosity.",
          "The desire to understand is not accidental. It is the first sign that moral and intellectual growth are possible.",
        ],
        prompt: "What is curiosity doing in this passage?",
        choices: [
          createSceneChoice(
            "foundation",
            "A. It becomes the foundation of human growth.",
            12,
            "correct",
            "Curiosity is treated as the beginning of education and self-awareness, not as a minor trait.",
            "This scene shows that learning begins as an ethical impulse. Curiosity is the beginning of becoming human.",
            "In Abai's prose, curiosity is closely connected to education, moral awareness, and the development of a thoughtful self."
          ),
          createSceneChoice(
            "distraction",
            "B. It distracts the person from practical life.",
            6,
            "partially correct",
            "Abai would disagree. He sees curiosity as necessary for meaningful development.",
            "The reader starts to see that practical life and inner growth are not opposites here.",
            "The Words of Abai repeatedly return to learning as a serious human task, not a distraction."
          ),
          createSceneChoice(
            "neutral",
            "C. It is emotionally neutral and not central to the text.",
            3,
            "not quite accurate",
            "Curiosity is one of the first signs of inner awakening in this passage.",
            "This helps clarify that the text is deeply invested in the beginnings of consciousness and learning.",
            "Abai gives curiosity moral and intellectual weight rather than treating it as background detail."
          ),
        ],
      },
      {
        id: "discipline",
        sceneNumber: 2,
        title: "Scene 2 — Knowledge Requires Effort",
        context: [
          "Abai does not romanticize learning. He insists that desire alone is not enough.",
          "Attention, repetition, and discipline become the practical shape of intellectual life.",
        ],
        prompt: "How does Abai frame the process of knowledge?",
        choices: [
          createSceneChoice(
            "effort",
            "A. Knowledge grows through repeated effort and discipline.",
            12,
            "correct",
            "The text treats learning as a sustained practice, not a single moment of inspiration.",
            "The passage reminds the reader that meaningful knowledge is built through repetition, discipline, and intention.",
            "Abai often links education to labor. To know something well is to return to it, test it, and shape the self through it."
          ),
          createSceneChoice(
            "talent",
            "B. Knowledge comes mainly from natural talent.",
            6,
            "partially correct",
            "Abai places more emphasis on labor and persistence than on innate ability.",
            "The reader sees that growth is not reserved for the gifted alone. It depends on steady work.",
            "The text repeatedly points toward discipline rather than talent as the deeper condition of learning."
          ),
          createSceneChoice(
            "luck",
            "C. Knowledge depends mostly on luck and circumstance.",
            3,
            "not quite accurate",
            "Circumstances matter, but this passage is clearly about effort, attention, and inner discipline.",
            "This helps the reader distinguish social limitation from intellectual passivity.",
            "Abai insists that a person must participate actively in the making of knowledge."
          ),
        ],
      },
      {
        id: "responsibility",
        sceneNumber: 3,
        title: "Scene 3 — Knowledge and Character",
        context: [
          "For Abai, knowledge is incomplete if it does not shape character.",
          "The goal is not accumulation, but transformation: the educated person should become more just, more aware, and more responsible.",
        ],
        prompt: "What is the final measure of learning here?",
        choices: [
          createSceneChoice(
            "character",
            "A. Whether it changes the person ethically.",
            14,
            "correct",
            "Knowledge matters because it transforms the self, not because it decorates it.",
            "Abai asks the reader to judge learning by its ethical effect. Education matters when it deepens responsibility and sharpens conscience.",
            "The Words of Abai repeatedly return to the idea that knowledge without moral use remains unfinished."
          ),
          createSceneChoice(
            "status",
            "B. Whether it increases social prestige.",
            7,
            "partially correct",
            "Status is secondary. Abai is more interested in the moral use of learning.",
            "The reader sees that recognition from others is not the true goal of knowledge here.",
            "The text points beyond reputation and toward conscience, judgment, and responsibility."
          ),
          createSceneChoice(
            "memory",
            "C. Whether it helps a person memorize more facts.",
            3,
            "not quite accurate",
            "Facts matter less here than what knowledge does to the person's conscience and character.",
            "This helps clarify that learning is valuable because it changes how one lives, not only what one remembers.",
            "Abai ties education to the shaping of the self rather than to accumulation alone."
          ),
        ],
      },
    ],
  },
];

const kafkaChapterStories = parseKafkaOnTheShoreStories(kafkaOnTheShoreRaw);

export const chapterStoryLibrary = Object.fromEntries(
  [...manualChapterStories, ...kafkaChapterStories].map((story) => [story.id, story])
);

const storyBooks = {
  "abai-words": {
    workId: "abai-words",
    overview:
      "A guided reading chapter that turns Abai's prose into a reflective learning path about curiosity, effort, and responsibility.",
    chapterIds: ["abai-words"],
  },
  "dostoevsky-crime": {
    workId: "dostoevsky-crime",
    overview:
      "A concentrated chapter route through conscience, guilt, and confession, designed as an interpretive sequence rather than a summary.",
    chapterIds: ["dostoevsky-crime"],
  },
  "murakami-identity": {
    workId: "murakami-identity",
    overview:
      "A multi-chapter story route through escape, memory, symbolic space, and the shifting borders between reality and inner life.",
    chapterIds: kafkaChapterStories.map((story) => story.id),
  },
};

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
    totalMinutes: chapters.reduce(
      (sum, chapter) => sum + chapter.estimatedMinutes,
      0
    ),
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

