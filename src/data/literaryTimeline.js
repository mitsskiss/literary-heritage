import abaiCover from "../assets/works/abay.png";
import murakamiCover from "../assets/works/murakami.png";
import dostoevskyCover from "../assets/works/dostoevsky.png";
import woolfCover from "../assets/works/woolf.png";
import abaiPortrait from "../assets/authors/abai.png";
import murakamiPortrait from "../assets/authors/murakami.png";
import camusPortrait from "../assets/authors/camus.png";

export const timelineBounds = {
  min: 1600,
  max: 2000,
  defaultYear: 1925,
};

export const literaryTimelineEntries = [
  {
    id: "realism-rise",
    year: 1820,
    type: "movement",
    title: "The Rise of Realism",
    description:
      "Literature turns toward social pressure, moral conflict, and the texture of everyday life.",
    image: dostoevskyCover,
    accent: "Russian Realism",
    ctaLabel: "Explore movement",
    href: "/authors",
    detailsTitle: "Russian Realism",
    detailsText:
      "Realism made the novel feel like a moral laboratory. It brought class, ethics, poverty, and human contradiction into the center of reading.",
    related: ["Fyodor Dostoevsky", "Moral conflict", "Urban modernity"],
  },
  {
    id: "abai-author",
    year: 1845,
    type: "author",
    title: "Abai Kunanbayev",
    description:
      "A poet, thinker, and reforming voice who connected learning, conscience, and cultural renewal.",
    image: abaiPortrait,
    accent: "Kazakh Enlightenment",
    ctaLabel: "Explore author",
    href: "/author/Abai%20Kunanbayev",
    detailsTitle: "Abai Kunanbayev",
    detailsText:
      "Abai's work helps younger readers connect literary heritage with education, ethics, and the making of a thoughtful self.",
    related: ["Book of Words", "Poetry", "Moral education"],
  },
  {
    id: "crime-book",
    year: 1866,
    type: "book",
    title: "Crime and Punishment",
    description:
      "A psychological descent into guilt, pride, and the impossible weight of moral justification.",
    image: dostoevskyCover,
    accent: "Novel",
    ctaLabel: "Explore",
    href: "/reading/dostoevsky-crime",
    detailsTitle: "Crime and Punishment",
    detailsText:
      "Dostoevsky's novel turns thought itself into drama. It remains intensely current because it asks whether intelligence can excuse harm.",
    related: ["1866", "Fyodor Dostoevsky", "Conscience"],
  },
  {
    id: "modernism-movement",
    year: 1910,
    type: "movement",
    title: "Modernism Opens the Inner World",
    description:
      "Time fragments, consciousness becomes central, and the page starts to feel like thought in motion.",
    image: woolfCover,
    accent: "Modernism",
    ctaLabel: "Explore movement",
    href: "/authors",
    detailsTitle: "Modernism",
    detailsText:
      "Modernist writing shifted attention from external action to perception, memory, and the instability of identity.",
    related: ["Virginia Woolf", "Interior monologue", "Time and memory"],
  },
  {
    id: "mrs-dalloway-book",
    year: 1925,
    type: "book",
    title: "Mrs Dalloway",
    description:
      "One day unfolds into an entire interior landscape shaped by memory, loneliness, and social performance.",
    image: woolfCover,
    accent: "Novel",
    ctaLabel: "Explore",
    href: "/reading/woolf-dalloway",
    detailsTitle: "Mrs Dalloway",
    detailsText:
      "Woolf shows how a modern life is built from subtle impressions, half-hidden grief, and the tension between public identity and private feeling.",
    related: ["Virginia Woolf", "1925", "Modernism"],
  },
  {
    id: "camus-author",
    year: 1942,
    type: "author",
    title: "Albert Camus",
    description:
      "A writer-philosopher who shaped how readers think about absurdity, freedom, and emotional distance.",
    image: camusPortrait,
    accent: "Existentialism",
    ctaLabel: "Explore author",
    href: "/author/Albert%20Camus",
    detailsTitle: "Albert Camus",
    detailsText:
      "Camus sits at the border of literature and philosophy, offering young readers a language for uncertainty without sentimentality.",
    related: ["The Stranger", "Absurdity", "Freedom"],
  },
  {
    id: "murakami-book",
    year: 2000,
    type: "book",
    title: "Kafka on the Shore",
    description:
      "A dreamlike route through memory, solitude, symbolic space, and the instability of selfhood.",
    image: murakamiCover,
    accent: "Contemporary novel",
    ctaLabel: "Explore",
    href: "/reading/murakami-identity",
    detailsTitle: "Kafka on the Shore",
    detailsText:
      "Murakami's fiction makes literary discovery feel immersive and open-ended, which is why it works so well as a storytelling gateway on the platform.",
    related: ["Haruki Murakami", "Identity", "Memory"],
  },
  {
    id: "murakami-author",
    year: 1980,
    type: "author",
    title: "Haruki Murakami",
    description:
      "A contemporary literary voice where music, memory, surrealism, and identity drift into one another.",
    image: murakamiPortrait,
    accent: "Contemporary Literature",
    ctaLabel: "Explore author",
    href: "/author/Haruki%20Murakami",
    detailsTitle: "Haruki Murakami",
    detailsText:
      "Murakami helps connect literary heritage with contemporary reading habits by creating emotionally open, atmospheric worlds.",
    related: ["Kafka on the Shore", "Dreamlike fiction", "Japan"],
  },
];
