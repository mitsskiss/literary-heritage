import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useProgressSync } from "../hooks/useProgressSync";
import { getAchievementDefinitions, getReadingStats } from "../lib/achievementRules";
import { authors } from "../data/authors";
import { works } from "../data/works";
import { getChapterPath, getChaptersByWorkId } from "../data/stories";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import "./Profile.css";

const CONTENT_LANGUAGE_KEY = "literary_heritage_content_language";
const MAX_AVATAR_SIZE = 900 * 1024;

const emptyProfileDraft = {
  displayName: "",
  bio: "",
  readingGoal: "",
  avatarDataUrl: "",
};

const localeByLanguage = {
  en: "en-US",
  ru: "ru-RU",
  kk: "kk-KZ",
};

const achievementCopy = {
  firstChapter: {
    titleKey: "profileDashboardAchievementFirstStep",
    subtitleKey: "profileDashboardAchievementTenWorks",
    icon: "book",
  },
  expert: {
    titleKey: "profileDashboardAchievementSteadyReader",
    subtitleKey: "profileDashboardAchievementSevenDays",
    icon: "flame",
  },
  literator: {
    titleKey: "profileDashboardAchievementSeeker",
    subtitleKey: "profileDashboardAchievementTwentyFiveWorks",
    icon: "star",
  },
  researcher: {
    titleKey: "profileDashboardAchievementDeepReader",
    subtitleKey: "profileDashboardAchievementFiftyWorks",
    icon: "target",
  },
  threeDay: {
    titleKey: "profileDashboardAchievementNearGoal",
    subtitleKey: "profileDashboardAchievementThreeDays",
    icon: "check",
  },
  weekKnowledge: {
    titleKey: "profileDashboardAchievementHeritageKeeper",
    subtitleKey: "profileDashboardAchievementFiveCollections",
    icon: "shield",
  },
  bookworm: {
    titleKey: "profileDashboardAchievementBookLover",
    subtitleKey: "profileDashboardAchievementFiveChapters",
    icon: "bookmark",
  },
  finalist: {
    titleKey: "profileDashboardAchievementRouteComplete",
    subtitleKey: "profileDashboardAchievementOneWork",
    icon: "route",
  },
};

function getEmailName(email = "") {
  return email.includes("@") ? email.split("@")[0] : email;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value, language = "en") {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(localeByLanguage[language] ?? "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAuthorImage(name) {
  return authors.find((author) => author.name === name)?.image ?? "";
}

function getChapterPercent(chapter, progress) {
  if (!chapter || !progress) return 0;
  if (progress.completed) return 100;

  const answeredCount = Math.max(
    Object.keys(progress.choices ?? {}).length,
    Object.keys(progress.quizzes ?? {}).length
  );
  const sceneIndex = Number(progress.currentSceneIndex ?? 0);
  const currentStep = Math.max(answeredCount, sceneIndex);
  const totalScenes = Math.max(chapter.scenes?.length ?? 1, 1);

  return Math.min(99, Math.round((currentStep / totalScenes) * 100));
}

function getAllChapters() {
  return works.flatMap((work) =>
    getChaptersByWorkId(work.id).map((chapter) => ({
      chapter,
      work,
    }))
  );
}

function ProfileCard({ className = "", children }) {
  return <section className={`mura-profile-card ${className}`}>{children}</section>;
}

function CardHeader({ title, to = null, action = null }) {
  return (
    <div className="mura-profile-card__header">
      <h2>{title}</h2>
      {to ? <Link to={to}>{action}</Link> : action ? <span>{action}</span> : null}
    </div>
  );
}

function Icon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.7,
    vectorEffect: "non-scaling-stroke",
  };
  const icons = {
    bell: (
      <>
        <path {...common} d="M8 3.2c-2.4 0-4 1.7-4 4.4v2.1l-1.1 2h10.2L12 9.7V7.6c0-2.7-1.6-4.4-4-4.4Z" />
        <path {...common} d="M6.4 13.2c.3.7.8 1.1 1.6 1.1s1.3-.4 1.6-1.1" />
      </>
    ),
    bookmark: <path {...common} d="M4.5 2.8h7v10.4L8 10.8l-3.5 2.4V2.8Z" />,
    book: (
      <>
        <path {...common} d="M2.7 3.4h4.1c.7 0 1.2.5 1.2 1.2v8.8c0-.7-.5-1.2-1.2-1.2H2.7V3.4Z" />
        <path {...common} d="M13.3 3.4H9.2c-.7 0-1.2.5-1.2 1.2v8.8c0-.7.5-1.2 1.2-1.2h4.1V3.4Z" />
      </>
    ),
    camera: (
      <>
        <path {...common} d="M5.3 5.3 6.2 4h3.6l.9 1.3h2.1v7H3.2v-7h2.1Z" />
        <circle {...common} cx="8" cy="8.8" r="2.1" />
      </>
    ),
    check: <path {...common} d="m3.3 8.3 3 3.1 6.4-6.8" />,
    chevron: <path {...common} d="m6 3.8 4.2 4.2L6 12.2" />,
    edit: (
      <>
        <path {...common} d="M4 11.7 11.1 4.6l1.3 1.3-7.1 7.1-2 .4.4-2Z" />
        <path {...common} d="m10.1 5.6 1.3 1.3" />
      </>
    ),
    flame: (
      <path {...common} d="M8.9 2.6c.2 2.3 3.2 3.1 3.2 6a4.1 4.1 0 0 1-8.2 0c0-1.9 1.1-3.4 2.6-4.6-.1 1.8.6 2.7 1.5 3.2.6-1.2.8-2.8.9-4.6Z" />
    ),
    list: (
      <>
        <path {...common} d="M6.2 4.2h6.1M6.2 8h6.1M6.2 11.8h6.1" />
        <path {...common} d="M3.5 4.2h.1M3.5 8h.1M3.5 11.8h.1" />
      </>
    ),
    lock: (
      <>
        <path {...common} d="M4.2 7h7.6v6.2H4.2V7Z" />
        <path {...common} d="M5.8 7V5.5a2.2 2.2 0 0 1 4.4 0V7" />
      </>
    ),
    logout: (
      <>
        <path {...common} d="M6.8 3.2H3.5v9.6h3.3" />
        <path {...common} d="M8.6 5.2 11.4 8l-2.8 2.8M11.4 8H5.8" />
      </>
    ),
    notes: (
      <>
        <path {...common} d="M4.2 2.9h7.6v10.2H4.2V2.9Z" />
        <path {...common} d="M6 5.5h4M6 8h4M6 10.5h2.2" />
      </>
    ),
    plus: <path {...common} d="M8 3.3v9.4M3.3 8h9.4" />,
    route: (
      <>
        <path {...common} d="M3.2 11.6c2.6 0 2.5-7.2 5-7.2s2.2 7.2 4.6 7.2" />
        <circle {...common} cx="3.2" cy="11.6" r="1" />
        <circle {...common} cx="12.8" cy="11.6" r="1" />
      </>
    ),
    settings: (
      <>
        <circle {...common} cx="8" cy="8" r="2" />
        <path {...common} d="M8 2.8v1.5M8 11.7v1.5M3.5 3.5l1.1 1.1M11.4 11.4l1.1 1.1M2.8 8h1.5M11.7 8h1.5M3.5 12.5l1.1-1.1M11.4 4.6l1.1-1.1" />
      </>
    ),
    shield: <path {...common} d="M8 2.7 12.2 4v3.5c0 2.8-1.5 4.8-4.2 5.8-2.7-1-4.2-3-4.2-5.8V4L8 2.7Z" />,
    star: <path {...common} d="m8 2.9 1.5 3.2 3.5.4-2.6 2.4.7 3.5L8 10.6l-3.1 1.8.7-3.5L3 6.5l3.5-.4L8 2.9Z" />,
    sync: (
      <>
        <path {...common} d="M12.2 5.2A4.7 4.7 0 0 0 4 4.5L2.8 5.8" />
        <path {...common} d="M2.8 3.4v2.4h2.4M3.8 10.8a4.7 4.7 0 0 0 8.2.7l1.2-1.3" />
        <path {...common} d="M13.2 12.6v-2.4h-2.4" />
      </>
    ),
    target: (
      <>
        <circle {...common} cx="8" cy="8" r="5.1" />
        <circle {...common} cx="8" cy="8" r="2.2" />
        <path {...common} d="M8 8h4.8" />
      </>
    ),
    user: (
      <>
        <circle {...common} cx="8" cy="5.8" r="2.4" />
        <path {...common} d="M3.7 13.2c.7-2.1 2.1-3.1 4.3-3.1s3.6 1 4.3 3.1" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {icons[name] ?? icons.book}
    </svg>
  );
}

function IconMark({ name }) {
  return (
    <span className="mura-profile-icon" aria-hidden="true">
      <Icon name={name} />
    </span>
  );
}

function ProfileCompletionRing({ value, label }) {
  return (
    <div
      className="mura-profile-ring"
      style={{ "--profile-ring-value": `${Math.max(0, Math.min(100, value))}%` }}
      aria-label={label}
    >
      <span>{value}%</span>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const reflectionsRef = useRef(null);
  const { language, languages, setLanguage, t, localizeWork } = useI18n();
  const { user, profile, signOut, updateProfile } = useAuth();
  const { isSyncing, syncNow } = useProgressSync();
  const {
    xp,
    level,
    streak,
    lives,
    storyProgress,
    completedStories,
    reflections,
    visitedMap,
    favorites,
    toggleFavorite,
    readingSessions,
    dailyActivity,
  } = useProgressStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftInfo, setDraftInfo] = useState(emptyProfileDraft);
  const [editorError, setEditorError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [contentLanguage, setContentLanguage] = useState("original_kk");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setContentLanguage(window.localStorage.getItem(CONTENT_LANGUAGE_KEY) || "original_kk");
  }, []);

  const accountInfo = useMemo(
    () => ({
      displayName: profile?.display_name?.trim() ?? "",
      bio: profile?.bio?.trim() ?? "",
      readingGoal: profile?.reading_goal?.trim() ?? "",
      avatarDataUrl: profile?.avatar_data_url ?? "",
      email: profile?.email || user?.email || "",
    }),
    [profile, user]
  );

  const readerName =
    accountInfo.displayName || getEmailName(accountInfo.email) || t("reader");
  const heroQuote = accountInfo.bio || t("profileDashboardQuote");
  const avatarDataUrl = accountInfo.avatarDataUrl;
  const allChapters = useMemo(() => getAllChapters(), []);
  const workById = useMemo(() => new Map(works.map((work) => [work.id, work])), []);

  const currentReading = useMemo(() => {
    const latestSession = [...(readingSessions ?? [])]
      .reverse()
      .map((session) => {
        const chapterMatch = allChapters.find(({ chapter }) => chapter.id === session.chapterId);
        if (chapterMatch) return chapterMatch;

        const work = workById.get(session.workId);
        const chapter = work ? getChaptersByWorkId(work.id)[0] : null;
        return work && chapter ? { work, chapter } : null;
      })
      .find(Boolean);

    const startedChapter = allChapters.find(
      ({ chapter }) => storyProgress[chapter.id] && !storyProgress[chapter.id]?.completed
    );

    const completedChapter = allChapters.find(({ chapter }) => storyProgress[chapter.id]);
    const fallbackChapter = allChapters[0] ?? null;
    const selected = latestSession ?? startedChapter ?? completedChapter ?? fallbackChapter;

    if (!selected) return null;

    const progress = storyProgress[selected.chapter.id] ?? null;
    const localizedWork = localizeWork(selected.work);

    return {
      work: selected.work,
      chapter: selected.chapter,
      localizedWork,
      percent: progress ? getChapterPercent(selected.chapter, progress) : 0,
      chapterHref: getChapterPath(selected.work.id, selected.chapter.chapterNumber),
      contentsHref: `/reading/${selected.work.id}`,
    };
  }, [allChapters, localizeWork, readingSessions, storyProgress, workById]);

  const currentWork = currentReading?.work ?? works[0];
  const currentWorkHref = currentReading?.contentsHref ?? (currentWork ? `/reading/${currentWork.id}` : "/works");
  const currentChapterHref = currentReading?.chapterHref ?? currentWorkHref ?? "/works";
  const isCurrentWorkSaved = favorites.some(
    (favorite) => favorite.type === "work" && favorite.id === currentWork?.id
  );

  const readingStats = getReadingStats(storyProgress, localizeWork);
  const hasReadingProgress = Object.keys(storyProgress ?? {}).length > 0;
  const completionChecks = [
    Boolean(accountInfo.displayName),
    Boolean(accountInfo.bio),
    Boolean(accountInfo.avatarDataUrl),
    Boolean(accountInfo.readingGoal),
    favorites.length > 0,
    hasReadingProgress,
    Object.keys(reflections ?? {}).length > 0,
  ];
  const profileCompletion = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100
  );

  const savedWorks = useMemo(
    () =>
      favorites
        .filter((favorite) => favorite.type === "work")
        .map((favorite) => {
          const work = workById.get(favorite.id);
          const localizedWork = work ? localizeWork(work) : null;

          return {
            id: favorite.id,
            title: localizedWork?.title || favorite.title,
            author: work?.author || favorite.subtitle || "MURA",
            image: work?.image,
            href: favorite.href || (work ? `/reading/${work.id}` : "/works"),
            isSuggestion: false,
          };
        })
        .slice(0, 4),
    [favorites, localizeWork, workById]
  );
  const savedWorkSuggestions = useMemo(
    () =>
      savedWorks.length
        ? []
        : works.slice(0, 4).map((work) => ({
            id: work.id,
            title: localizeWork(work).title,
            author: work.author,
            image: work.image,
            href: `/reading/${work.id}`,
            isSuggestion: true,
          })),
    [localizeWork, savedWorks.length]
  );

  const favoriteAuthors = useMemo(() => {
    const authorNames = [
      ...favorites
        .filter((favorite) => favorite.type === "work")
        .map((favorite) => workById.get(favorite.id)?.author || favorite.subtitle),
      ...(currentReading?.work?.author ? [currentReading.work.author] : []),
      ...completedStories
        .map((storyId) => allChapters.find(({ chapter }) => chapter.id === storyId)?.work?.author)
        .filter(Boolean),
      ...works.map((work) => work.author),
    ].filter(Boolean);

    return [...new Set(authorNames)].slice(0, 5).map((name) => ({
      name,
      href: `/author/${encodeURIComponent(name)}`,
      image: getAuthorImage(name),
    }));
  }, [allChapters, completedStories, currentReading, favorites, workById]);

  const visibleAchievements = useMemo(() => {
    const definitions = getAchievementDefinitions({
      xp,
      level,
      streak,
      storyProgress,
      reflections,
      visitedMap,
    });

    return [...definitions]
      .sort((left, right) => Number(right.unlocked) - Number(left.unlocked))
      .slice(0, 5)
      .map((achievement) => ({
        ...achievement,
        copy: achievementCopy[achievement.id] ?? {
          titleKey: "profileDashboardAchievement",
          subtitleKey: "profileDashboardHeritagePath",
          icon: "star",
        },
      }));
  }, [level, reflections, storyProgress, streak, visitedMap, xp]);

  const latestReflection = useMemo(() => {
    const entries = Object.entries(reflections ?? {});
    if (entries.length === 0) return null;

    const [id, text] = entries[entries.length - 1];
    return {
      id,
      text: String(text || ""),
      date: formatShortDate(id.split(":").at(-1), language) || t("profileDashboardFallbackDate"),
    };
  }, [language, reflections, t]);

  const recentActivities = useMemo(() => {
    const sessionRows = [...(readingSessions ?? [])].slice(-3).reverse().map((session) => {
      const work = workById.get(session.workId);
      const chapterMatch = allChapters.find(({ chapter }) => chapter.id === session.chapterId);
      const href = chapterMatch
        ? getChapterPath(chapterMatch.work.id, chapterMatch.chapter.chapterNumber)
        : work
          ? `/reading/${work.id}`
          : null;

      return {
        icon: "book",
        text: t("profileDashboardActivityContinuedWork", {
          title: work ? localizeWork(work).title : t("profileDashboardReadingFallback"),
        }),
        time: formatShortDate(session.createdAt, language),
        href,
      };
    });

    const favoriteRows = favorites.slice(0, 2).map((favorite) => ({
      icon: favorite.type === "author" ? "user" : "bookmark",
      text: t("profileDashboardActivitySavedItem", { title: favorite.title }),
      time: formatShortDate(favorite.savedAt, language),
      href:
        favorite.href ||
        (favorite.type === "author"
          ? `/author/${encodeURIComponent(favorite.id)}`
          : favorite.type === "work"
            ? `/reading/${favorite.id}`
            : favorite.type === "route"
              ? `/route/${favorite.id}`
              : "/progress"),
    }));

    const reflectionRows = Object.keys(reflections ?? {}).length
      ? [
          {
            icon: "notes",
            text: t("reflectionsSaved"),
            time: latestReflection?.date ?? "",
            onClick: () => scrollToReflections(),
          },
        ]
      : [];

    const activityRows =
      sessionRows.length || favoriteRows.length || reflectionRows.length
        ? [...sessionRows, ...favoriteRows, ...reflectionRows].slice(0, 5)
        : Object.entries(dailyActivity ?? {})
            .filter(([, activity]) => (activity?.minutes ?? 0) > 0 || (activity?.reads ?? 0) > 0)
            .slice(-1)
            .map(([date, activity]) => ({
              icon: "flame",
              text: t("profileDashboardDaysInRow", { count: activity.reads || activity.minutes || 1 }),
              time: formatShortDate(date, language),
            }));

    return activityRows;
  }, [
    allChapters,
    dailyActivity,
    favorites,
    language,
    latestReflection,
    localizeWork,
    readingSessions,
    reflections,
    t,
    workById,
  ]);

  const weeklyStreak = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(localeByLanguage[language] ?? "en-US", {
      weekday: "short",
    });

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const dateKey = getDateKey(date);
      const activity = dailyActivity?.[dateKey] ?? {};

      return {
        label: formatter.format(date),
        active: (activity.minutes ?? 0) > 0 || (activity.reads ?? 0) > 0,
      };
    });
  }, [dailyActivity, language]);

  const profileGoals = [
    {
      icon: "book",
      label: accountInfo.readingGoal || t("profileDashboardGoalReadMonthly"),
      done: Math.min(savedWorks.length, 10),
      total: 10,
    },
    {
      icon: "target",
      label: t("profileDashboardGoalDeepClassics"),
      done: Math.min(readingStats.startedWorks, 5),
      total: 5,
    },
    {
      icon: "route",
      label: t("profileDashboardGoalResearchRoute"),
      done: Math.min(readingStats.completedWorks, 3),
      total: 3,
    },
  ];

  const updateDraft = (field, value) => {
    setDraftInfo((current) => ({ ...current, [field]: value }));
  };

  const openEditor = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setDraftInfo({
      displayName: accountInfo.displayName,
      bio: accountInfo.bio,
      readingGoal: accountInfo.readingGoal,
      avatarDataUrl: accountInfo.avatarDataUrl,
    });
    setEditorError("");
    setProfileMessage("");
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setDraftInfo(emptyProfileDraft);
    setEditorError("");
    setIsEditorOpen(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditorError(t("photoTooLarge"));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setEditorError(t("photoTooLarge"));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateDraft("avatarDataUrl", String(reader.result));
      setEditorError("");
    };
    reader.readAsDataURL(file);
  };

  const savePersonalInfo = async (event) => {
    event.preventDefault();
    if (!user) {
      setEditorError(t("profileLocalText"));
      return;
    }

    const nextInfo = {
      display_name: draftInfo.displayName.trim(),
      bio: draftInfo.bio.trim(),
      reading_goal: draftInfo.readingGoal.trim(),
      avatar_data_url: draftInfo.avatarDataUrl,
    };

    setIsSavingProfile(true);
    setEditorError("");

    try {
      const { error } = await updateProfile(nextInfo);

      if (error) {
        setEditorError(error.message || t("profileSavedLocalOnly"));
        return;
      }

      setProfileMessage(t("profileSaved"));
      closeEditor();
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleCurrentWorkFavorite = () => {
    if (!currentWork) return;
    toggleFavorite({
      type: "work",
      id: currentWork.id,
      title: currentWork.title,
      subtitle: currentWork.author,
      href: `/reading/${currentWork.id}`,
    });
  };

  const scrollToReflections = () => {
    reflectionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const updateContentLanguage = (value) => {
    setContentLanguage(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONTENT_LANGUAGE_KEY, value);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const runProgressSync = async () => {
    if (!user || !syncNow) return;
    await syncNow();
  };

  if (!user) {
    return (
      <main className="mura-profile-page">
        <div className="mura-profile-shell">
          <section className="mura-profile-signed-out">
            <ProfileCard className="mura-profile-intro-card">
              <div className="mura-profile-intro">
                <p className="mura-profile-kicker">{t("profileDashboardProfile")}</p>
                <h1>{t("profileLocalTitle")}</h1>
                <p className="mura-profile-quote">{t("profileLocalText")}</p>
                <div className="mura-profile-signed-out-actions">
                  <Link to="/auth" className="mura-profile-primary-link">
                    <IconMark name="user" />
                    {t("profileDashboardSignIn")}
                  </Link>
                  <Link to="/works" className="mura-profile-secondary-link">
                    <IconMark name="book" />
                    {t("openAllWorks")}
                  </Link>
                </div>
              </div>
            </ProfileCard>
            <ProfileCard className="mura-profile-language-card">
              <CardHeader title={t("profileDashboardLanguagePreferences")} action="" />
              <label>
                <span>{t("profileDashboardPlatformLanguage")}</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </ProfileCard>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mura-profile-page">
      <div className="mura-profile-shell">
        <div className="mura-profile-layout">
          <div className="mura-profile-left-stack">
            <section className="mura-profile-hero" aria-label={t("profileDashboardOverviewLabel")}>
              <div className="mura-profile-avatar-panel">
                <div className="mura-profile-avatar" aria-hidden="true">
                  {avatarDataUrl ? (
                    <img src={avatarDataUrl} alt="" />
                  ) : (
                    <span>
                      <b>{readerName.slice(0, 1)}</b>
                    </span>
                  )}
                </div>
                <button type="button" onClick={openEditor} className="mura-profile-quiet-button">
                  <IconMark name="camera" />
                  {t("profileDashboardChangePhoto")}
                </button>
              </div>

              <ProfileCard className="mura-profile-intro-card">
                <div className="mura-profile-intro">
                  <p className="mura-profile-kicker">{t("profileDashboardProfile")}</p>
                  <h1>{readerName}</h1>
                  <p className="mura-profile-quote">&laquo;{heroQuote}&raquo;</p>

                  <div className="mura-profile-identity-grid">
                    <article>
                      <IconMark name="star" />
                      <span>{t("profileDashboardMembershipStatus")}</span>
                      <strong>{t("profileDashboardMuraSeeker")}</strong>
                      <small>{t("profileDashboardMemberSince")}</small>
                    </article>
                    <article>
                      <IconMark name="book" />
                      <span>{t("profileDashboardReaderType")}</span>
                      <strong>{t("profileDashboardReaderTypeValue")}</strong>
                      <small>{accountInfo.readingGoal || t("profileDashboardReaderTypeDetail")}</small>
                    </article>
                  </div>
                </div>
              </ProfileCard>

              <ProfileCard className="mura-profile-completion-card">
                <p>{t("profileDashboardProfileCompletion")}</p>
                <ProfileCompletionRing
                  value={profileCompletion}
                  label={t("profileDashboardCompletionAria", { value: profileCompletion })}
                />
                <span>{t("profileDashboardCompletionHint")}</span>
                <button type="button" onClick={openEditor}>
                  {t("profileDashboardCompleteProfile")}
                </button>
              </ProfileCard>
            </section>

            {profileMessage ? (
              <p className="mura-profile-message" role="status">
                {profileMessage}
              </p>
            ) : null}

            <div className="mura-profile-main-column">
              <ProfileCard className="mura-profile-current-card">
                <CardHeader
                  title={t("profileDashboardCurrentlyReading")}
                  to={currentChapterHref}
                  action={t("profileDashboardContinueReading")}
                />
                <div className="mura-profile-current">
                  <img src={currentWork?.image} alt="" />
                  <div>
                    <p>{currentReading?.localizedWork?.author ?? currentWork?.author}</p>
                    <h2>{currentReading?.localizedWork?.title ?? localizeWork(currentWork).title}</h2>
                    <span>{currentReading?.chapter?.chapterTitle ?? t("profileDashboardCurrentChapterFallback")}</span>
                    <div className="mura-profile-progress-line">
                      <i style={{ width: `${currentReading?.percent ?? 0}%` }} />
                    </div>
                    <strong>{currentReading?.percent ?? 0}%</strong>
                    <nav aria-label={t("profileDashboardReadingActionsLabel")}>
                      <Link to={currentWorkHref}>
                        <IconMark name="list" />
                        {t("profileDashboardContents")}
                      </Link>
                      <button
                        type="button"
                        className={isCurrentWorkSaved ? "is-active" : ""}
                        onClick={toggleCurrentWorkFavorite}
                        aria-pressed={isCurrentWorkSaved}
                      >
                        <IconMark name="bookmark" />
                        {t("profileDashboardBookmark")}
                      </button>
                      <button type="button" onClick={scrollToReflections}>
                        <IconMark name="notes" />
                        {t("profileDashboardNotes")}
                      </button>
                    </nav>
                  </div>
                </div>
              </ProfileCard>

              <ProfileCard className="mura-profile-authors-card">
                <CardHeader
                  title={t("profileDashboardFavoriteAuthors")}
                  to="/authors"
                  action={t("profileDashboardViewAll")}
                />
                <div className="mura-profile-author-list">
                  {favoriteAuthors.map((author) => (
                    <Link to={author.href} key={author.name}>
                      {author.image ? <img src={author.image} alt="" /> : <span>{author.name.slice(0, 1)}</span>}
                      <span>{author.name}</span>
                    </Link>
                  ))}
                  <Link to="/authors" className="is-add">
                    <IconMark name="plus" />
                    {t("profileDashboardAddMore")}
                  </Link>
                </div>
              </ProfileCard>

              <ProfileCard className="mura-profile-saved-card">
                <CardHeader
                  title={t("profileDashboardSavedWorks")}
                  to="/works"
                  action={t("profileDashboardViewAll")}
                />
                <div className="mura-profile-saved-works">
                  {[...savedWorks, ...savedWorkSuggestions].map((work) => (
                    <Link
                      to={work.href || "/works"}
                      key={`${work.id}-${work.isSuggestion ? "suggestion" : "saved"}`}
                      className={work.isSuggestion ? "is-suggestion" : ""}
                      aria-label={
                        work.isSuggestion
                          ? `${work.title} - ${t("suggestedBooks")}`
                          : work.title
                      }
                    >
                      <img src={work.image} alt="" />
                      <strong>{work.title}</strong>
                      <span>{work.isSuggestion ? t("suggestedBooks") : work.author}</span>
                    </Link>
                  ))}
                  <Link to="/works" className="is-add">
                    <IconMark name="plus" />
                    {t("profileDashboardAddMore")}
                  </Link>
                </div>
              </ProfileCard>

              <div className="mura-profile-lower-grid">
                <ProfileCard className="mura-profile-goals-card">
                  <CardHeader title={t("profileDashboardReadingGoals")} action="" />
                  <div className="mura-profile-goals">
                    {profileGoals.map((goal) => (
                      <article key={goal.label}>
                        <IconMark name={goal.icon} />
                        <div>
                          <span>{goal.label}</span>
                          <div className="mura-profile-progress-line">
                            <i style={{ width: `${Math.round((goal.done / goal.total) * 100)}%` }} />
                          </div>
                        </div>
                        <strong>
                          {goal.done} / {goal.total}
                        </strong>
                      </article>
                    ))}
                  </div>
                </ProfileCard>

                <ProfileCard className="mura-profile-achievements-card">
                  <CardHeader
                    title={t("profileDashboardAchievements")}
                    to="/progress"
                    action={t("profileDashboardViewAll")}
                  />
                  <div className="mura-profile-badges">
                    {visibleAchievements.map((achievement) => (
                      <article
                        className={achievement.unlocked ? "is-unlocked" : "is-locked"}
                        key={achievement.id}
                      >
                        <span>
                          <Icon name={achievement.unlocked ? achievement.copy.icon : "lock"} />
                        </span>
                        <strong>{t(achievement.copy.titleKey)}</strong>
                        <small>{t(achievement.copy.subtitleKey)}</small>
                      </article>
                    ))}
                  </div>
                </ProfileCard>

                <ProfileCard className="mura-profile-reflection-card">
                  <div id="profile-reflections" ref={reflectionsRef} />
                  <CardHeader
                    title={t("profileDashboardReflections")}
                    to="/progress"
                    action={t("profileDashboardViewAll")}
                  />
                  <blockquote className={latestReflection ? "" : "is-empty"}>
                    {latestReflection?.text || t("profileDashboardNoReflectionsYet")}
                  </blockquote>
                  <div>
                    <span>{latestReflection?.date ?? ""}</span>
                    <Link to="/progress" aria-label={t("profileDashboardEditReflection")}>
                      <IconMark name="edit" />
                    </Link>
                  </div>
                </ProfileCard>
              </div>
            </div>
          </div>

          <aside className="mura-profile-side-column">
            <ProfileCard className="mura-profile-activity-card">
              <CardHeader
                title={t("profileDashboardRecentActivity")}
                to="/progress"
                action={t("profileDashboardViewAll")}
              />
              <div className="mura-profile-activity-list">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const content = (
                      <>
                        <IconMark name={activity.icon} />
                        <div>
                          <strong>{activity.text}</strong>
                          {activity.time ? <span>{activity.time}</span> : null}
                        </div>
                      </>
                    );

                    if (activity.href) {
                      return (
                        <Link to={activity.href} key={`${activity.text}-${index}`}>
                          {content}
                        </Link>
                      );
                    }

                    if (activity.onClick) {
                      return (
                        <button type="button" onClick={activity.onClick} key={`${activity.text}-${index}`}>
                          {content}
                        </button>
                      );
                    }

                    return <article key={`${activity.text}-${index}`}>{content}</article>;
                  })
                ) : (
                  <article>
                    <IconMark name="notes" />
                    <div>
                      <strong>{t("profileDashboardNoRecentActivityYet")}</strong>
                    </div>
                  </article>
                )}
              </div>
            </ProfileCard>

            <ProfileCard className="mura-profile-week-card">
              <CardHeader
                title={t("profileDashboardWeeklyStreak")}
                action={t("profileDashboardDaysInRow", { count: streak })}
              />
              <div className="mura-profile-week">
                {weeklyStreak.map((day) => (
                  <span className={day.active ? "is-active" : ""} key={day.label}>
                    <i>{day.active ? <Icon name="check" /> : null}</i>
                    {day.label}
                  </span>
                ))}
              </div>
            </ProfileCard>

            <ProfileCard className="mura-profile-language-card">
              <CardHeader title={t("profileDashboardLanguagePreferences")} action="" />
              <label>
                <span>{t("profileDashboardPlatformLanguage")}</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t("profileDashboardContentLanguage")}</span>
                <select value={contentLanguage} onChange={(event) => updateContentLanguage(event.target.value)}>
                  <option value="original_kk">{t("profileDashboardContentKazakh")}</option>
                  <option value="original_ru">{t("profileDashboardContentRussian")}</option>
                  <option value="original_en">{t("profileDashboardContentEnglish")}</option>
                  <option value="original_only">{t("profileDashboardContentOriginal")}</option>
                </select>
              </label>
            </ProfileCard>

            <ProfileCard className="mura-profile-account-card">
              <CardHeader title={t("profileDashboardAccountSettings")} action="" />
              <button type="button" onClick={openEditor}>
                <IconMark name="edit" />
                <span>{t("profileDashboardEditPersonalDetails")}</span>
                <i>
                  <Icon name="chevron" />
                </i>
              </button>
              <button type="button" disabled>
                <IconMark name="shield" />
                <span>{t("profileDashboardPrivacySecurity")}</span>
                <i>
                  <Icon name="chevron" />
                </i>
              </button>
              <button type="button" disabled>
                <IconMark name="bell" />
                <span>{t("profileDashboardNotifications")}</span>
                <i>
                  <Icon name="chevron" />
                </i>
              </button>
              <button type="button" onClick={handleSignOut}>
                <IconMark name="logout" />
                <span>{t("profileDashboardLogOut")}</span>
                <i>
                  <Icon name="chevron" />
                </i>
              </button>
              <button type="button" onClick={runProgressSync} disabled={!syncNow || isSyncing}>
                <IconMark name="sync" />
                <span>{isSyncing ? t("pleaseWait") : t("profileDashboardSaveProgress")}</span>
                <i>
                  <Icon name="chevron" />
                </i>
              </button>
            </ProfileCard>

            <div className="mura-profile-mini-stats" aria-label={t("profileDashboardStatsLabel")}>
              <span>{t("profileDashboardLevelValue", { level })}</span>
              <span>{xp} XP</span>
              <span>{t("profileDashboardLivesValue", { lives })}</span>
              <span>{t("profileDashboardChaptersValue", { count: readingStats.completedChapters })}</span>
            </div>
          </aside>
        </div>
      </div>

      {isEditorOpen ? (
        <div className="mura-profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-editor-title">
          <div className="mura-profile-modal__panel">
            <div className="mura-profile-modal__header">
              <h2 id="profile-editor-title">{t("profileDashboardPersonalDetails")}</h2>
              <button type="button" onClick={closeEditor} aria-label={t("profileDashboardCancel")}>
                <Icon name="chevron" />
              </button>
            </div>
            <form onSubmit={savePersonalInfo} className="mura-profile-editor-form">
              <label>
                <span>{t("profileDashboardDisplayName")}</span>
                <input
                  value={draftInfo.displayName}
                  onChange={(event) => updateDraft("displayName", event.target.value)}
                  maxLength={48}
                  placeholder={getEmailName(accountInfo.email) || t("reader")}
                />
              </label>
              <label>
                <span>{t("profileDashboardBio")}</span>
                <textarea
                  value={draftInfo.bio}
                  onChange={(event) => updateDraft("bio", event.target.value)}
                  maxLength={180}
                  rows={3}
                  placeholder={t("profileDashboardQuote")}
                />
              </label>
              <label>
                <span>{t("profileDashboardReadingGoal")}</span>
                <input
                  value={draftInfo.readingGoal}
                  onChange={(event) => updateDraft("readingGoal", event.target.value)}
                  maxLength={80}
                  placeholder={t("profileDashboardGoalReadMonthly")}
                />
              </label>
              <label className="mura-profile-file">
                <span>{t("profileDashboardPhoto")}</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
              {editorError ? (
                <p className="mura-profile-editor-error" role="alert">
                  {editorError}
                </p>
              ) : null}
              <div className="mura-profile-editor__actions">
                <button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? t("pleaseWait") : t("profileDashboardSave")}
                </button>
                <button type="button" onClick={closeEditor} disabled={isSavingProfile}>
                  {t("profileDashboardCancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default Profile;
