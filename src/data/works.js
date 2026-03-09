import abaiCover from "../assets/works/abay.png";
import murakamiCover from "../assets/works/murakami.png";
import dostoevskyCover from "../assets/works/dostoevsky.png";
import camusCover from "../assets/works/camus.png";
import woolfCover from "../assets/works/woolf.png";

export const works = [
  {
    id: "abai-words",
    title: "Book of Words",
    author: "Abai Kunanbayev",
    image: abaiCover,
    year: 1890,
    themes: ["Identity", "Morality", "Knowledge", "Society"],
    description:
      "Philosophical reflections on human nature, education, and moral responsibility.",
    fragments: [
      {
        id: "abai-f1",
        text:
          "A human being is born with curiosity and the desire to understand the world.",
        authorNote:
          "Abai considers curiosity as a moral and intellectual foundation of human development, closely connected to education and self-awareness.",
        annotations: [
          {
            word: "curiosity",
            explanation:
              "A fundamental human trait that motivates learning and personal growth.",
          },
          {
            word: "understand",
            explanation:
              "The process of gaining knowledge and meaning from experience.",
          },
        ],
        reflection: {
          question: "What do you think drives curiosity most strongly?",
          options: [
            "The desire for knowledge",
            "Life experience",
            "Inner motivation",
          ],
          resonanceQuote: {
            text:
              "If a person does not strive for knowledge, his soul becomes empty.",
            author: "Abai Kunanbayev",
          },
        },
      },
    ],
  },

  {
    id: "murakami-identity",
    title: "Kafka on the Shore",
    author: "Haruki Murakami",
    image: murakamiCover,
    year: 2002,
    themes: ["Identity", "Society"],
    description:
      "A surreal exploration of identity, memory, and the inner world of the individual.",
    fragments: [
      {
        id: "murakami-f1",
        text:
          "Memories warm you up from the inside, but they also tear you apart.",
        authorNote:
          "Murakami often portrays memory as fragmented and ambiguous, shaping identity without offering certainty or stability.",
        annotations: [
          {
            word: "Memories",
            explanation:
              "Past experiences that influence identity and perception.",
          },
        ],
        reflection: {
          question: "How do memories affect personal identity?",
          options: [
            "They define who we are",
            "They influence us but do not define us",
            "They should be left behind",
          ],
          resonanceQuote: {
            text:
              "Sometimes fate is like a small sandstorm that keeps changing directions.",
            author: "Haruki Murakami",
          },
        },
      },
    ],
  },

  {
    id: "dostoevsky-crime",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    image: dostoevskyCover,
    year: 1942,
    themes: ["Morality", "Identity", "Society"],
    description:
      "A psychological novel exploring guilt, conscience, and moral responsibility.",
    fragments: [
      {
        id: "dostoevsky-f1",
        text:
          "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
        authorNote:
          "Dostoevsky presents suffering as a necessary stage in moral and spiritual awakening.",
        annotations: [
          {
            word: "suffering",
            explanation:
              "A psychological or emotional state caused by inner moral conflict.",
          },
        ],
        reflection: {
          question: "Is suffering necessary for moral growth?",
          options: ["Yes", "Sometimes", "No"],
          resonanceQuote: {
            text:
              "The darker the night, the brighter the stars.",
            author: "Fyodor Dostoevsky",
          },
        },
      },
    ],
  },

  {
    id: "camus-stranger",
    title: "The Stranger",
    author: "Albert Camus",
    image: camusCover,
    themes: ["Identity", "Morality"],
    description:
      "A philosophical novel examining the absurdity of existence and emotional detachment.",
    fragments: [
      {
        id: "camus-f1",
        text:
          "I opened myself to the gentle indifference of the world.",
        authorNote:
          "Camus uses emotional detachment to illustrate the concept of the absurd and the absence of inherent meaning.",
        annotations: [
          {
            word: "indifference",
            explanation:
              "A lack of emotional response reflecting existential detachment.",
          },
        ],
        reflection: {
          question: "How do you interpret indifference toward the world?",
          options: [
            "A form of freedom",
            "A defense mechanism",
            "A negative trait",
          ],
          resonanceQuote: {
            text:
              "The struggle itself is enough to fill a man's heart.",
            author: "Albert Camus",
          },
        },
      },
    ],
  },

  {
    id: "woolf-dalloway",
    title: "Mrs Dalloway",
    author: "Virginia Woolf",
    image: woolfCover,
    year: 1925,
    themes: ["Identity", "Society"],
    description:
      "An exploration of consciousness, time, and personal experience within society.",
    fragments: [
      {
        id: "woolf-f1",
        text:
          "She had the perpetual sense of being out, far out to sea and alone.",
        authorNote:
          "Woolf emphasizes inner experience and emotional isolation even within social environments.",
        annotations: [
          {
            word: "alone",
            explanation:
              "A feeling of isolation that may exist despite social presence.",
          },
        ],
        reflection: {
          question: "Can someone feel lonely while surrounded by others?",
          options: ["Yes", "Sometimes", "No"],
          resonanceQuote: {
            text:
              "For nothing was simply one thing.",
            author: "Virginia Woolf",
          },
        },
      },
    ],
  },
];