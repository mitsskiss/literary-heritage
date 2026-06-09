import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { getAchievementDefinitions } from "../lib/achievementRules";
import { useProgressStore } from "../store/useProgressStore";
import "./AchievementNotifier.css";

const SEEN_ACHIEVEMENTS_KEY = "literary_heritage_seen_achievements";

const achievementMarks = {
  firstChapter: (
    <>
      <path d="M15.25 4.25c-3.65 1.1-6.28 3.05-7.9 5.85-1.34 2.32-1.45 4.58-.32 6.78 2.24.02 4.3-.78 6.17-2.4 2.7-2.35 4.35-5.76 4.95-10.23" />
      <path d="M7.25 16.95c2.7-3.3 5.42-5.82 8.15-7.55" />
    </>
  ),
  expert: (
    <>
      <circle cx="12" cy="12" r="6.1" />
      <path d="M12 7.85v4.55l2.85 1.7" />
      <path d="M6.4 5.55 4.8 4.1M17.6 5.55l1.6-1.45" />
    </>
  ),
  literator: (
    <>
      <path d="M5.4 5.75h5.2c.86 0 1.4.54 1.4 1.4v11.1c0-.86-.54-1.4-1.4-1.4H5.4V5.75Z" />
      <path d="M18.6 5.75h-5.2c-.86 0-1.4.54-1.4 1.4v11.1c0-.86.54-1.4 1.4-1.4h5.2V5.75Z" />
      <path d="M8 9.2h2M14 9.2h2" />
    </>
  ),
  researcher: (
    <>
      <path d="M18.35 10.35c0 4.6-6.35 8.9-6.35 8.9s-6.35-4.3-6.35-8.9a6.35 6.35 0 0 1 12.7 0Z" />
      <circle cx="12" cy="10.35" r="2.15" />
    </>
  ),
  threeDay: (
    <>
      <path d="M6.1 7.1h11.8v10.8H6.1V7.1Z" />
      <path d="M8.6 4.9v3M15.4 4.9v3M6.1 10h11.8" />
      <path d="M9.3 13.1h.1M12 13.1h.1M14.7 13.1h.1M9.3 15.55h.1M12 15.55h.1" />
    </>
  ),
  weekKnowledge: (
    <>
      <path d="M12 4.45 14.15 9l4.95.62-3.62 3.42.92 4.91L12 15.55l-4.4 2.4.92-4.91L4.9 9.62 9.85 9 12 4.45Z" />
      <path d="M12 8.8v3.35" />
    </>
  ),
  bookworm: (
    <>
      <path d="M6.5 6.1h8.75a2.25 2.25 0 0 1 0 4.5H8.75a2.25 2.25 0 0 0 0 4.5h8.75" />
      <path d="M7.75 10.6h7.5M7.75 15.1h8.5M6.5 6.1v13.1" />
    </>
  ),
  finalist: (
    <>
      <path d="M7.3 5.6h9.4v5.6a4.7 4.7 0 0 1-9.4 0V5.6Z" />
      <path d="M7.3 8.15H4.95c0 2.8 1.5 4.45 3.5 4.75M16.7 8.15h2.35c0 2.8-1.5 4.45-3.5 4.75" />
      <path d="M12 15.9v2.55M9.6 18.45h4.8" />
    </>
  ),
};

function readSeenAchievements() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(SEEN_ACHIEVEMENTS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeSeenAchievements(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEEN_ACHIEVEMENTS_KEY, JSON.stringify(ids));
}

function AchievementNotifier() {
  const { t } = useI18n();
  const xp = useProgressStore((state) => state.xp);
  const level = useProgressStore((state) => state.level);
  const streak = useProgressStore((state) => state.streak);
  const storyProgress = useProgressStore((state) => state.storyProgress);
  const reflections = useProgressStore((state) => state.reflections);
  const visitedMap = useProgressStore((state) => state.visitedMap);
  const [queue, setQueue] = useState([]);
  const [activeAchievement, setActiveAchievement] = useState(null);
  const initializedRef = useRef(false);

  const progress = useMemo(
    () => ({
      xp,
      level,
      streak,
      storyProgress,
      reflections,
      visitedMap,
    }),
    [xp, level, streak, storyProgress, reflections, visitedMap]
  );

  const unlockedAchievements = useMemo(
    () =>
      getAchievementDefinitions(progress).filter(
        (achievement) => achievement.unlocked
      ),
    [progress]
  );

  useEffect(() => {
    const unlockedIds = unlockedAchievements.map((achievement) => achievement.id);
    const seenIds = readSeenAchievements();

    if (!initializedRef.current) {
      initializedRef.current = true;
      writeSeenAchievements(Array.from(new Set([...seenIds, ...unlockedIds])));
      return;
    }

    const newAchievements = unlockedAchievements.filter(
      (achievement) => !seenIds.includes(achievement.id)
    );

    if (newAchievements.length === 0) return;

    const nextSeen = Array.from(
      new Set([...seenIds, ...newAchievements.map((achievement) => achievement.id)])
    );
    writeSeenAchievements(nextSeen);
    setQueue((current) => [...current, ...newAchievements]);
  }, [unlockedAchievements]);

  useEffect(() => {
    if (activeAchievement || queue.length === 0) return;

    const [nextAchievement, ...rest] = queue;
    setActiveAchievement(nextAchievement);
    setQueue(rest);
  }, [activeAchievement, queue]);

  useEffect(() => {
    if (!activeAchievement) return undefined;

    const timerId = window.setTimeout(() => {
      setActiveAchievement(null);
    }, 5600);

    return () => window.clearTimeout(timerId);
  }, [activeAchievement]);

  useEffect(() => {
    if (!activeAchievement) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveAchievement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAchievement]);

  if (!activeAchievement) return null;

  const titleId = `achievement-title-${activeAchievement.id}`;

  return (
    <aside
      className="achievement-notifier"
      role="status"
      aria-live="polite"
      aria-labelledby={titleId}
      data-achievement={activeAchievement.id}
    >
      <div className="achievement-notifier__veil" aria-hidden="true" />
      <article className="achievement-card">
        <div className="achievement-card__medal" aria-hidden="true">
          <span className="achievement-card__burst" />
          <svg className="achievement-card__laurel" viewBox="0 0 120 52" focusable="false">
            <path d="M12 38c15 7 31 7 47-2M108 38c-15 7-31 7-47-2" />
            <path d="M19 33c-4-5-5-9-3-14M30 37c-2-6-1-10 3-14M101 33c4-5 5-9 3-14M90 37c2-6 1-10-3-14" />
          </svg>
          <svg className="achievement-card__icon" viewBox="0 0 24 24" focusable="false">
            {achievementMarks[activeAchievement.id] ?? achievementMarks.firstChapter}
          </svg>
        </div>

        <div className="achievement-card__content">
          <p className="achievement-card__eyebrow">{t("achievementUnlocked")}</p>
          <h2 id={titleId}>{t(`achievement_${activeAchievement.id}`)}</h2>
          <span>{t(`achievement_${activeAchievement.id}_desc`)}</span>
          <Link to="/profile" onClick={() => setActiveAchievement(null)}>
            {t("viewAchievement")}
          </Link>
        </div>

        <button
          type="button"
          className="achievement-card__close"
          onClick={() => setActiveAchievement(null)}
          aria-label={t("close")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
          </svg>
        </button>
      </article>
    </aside>
  );
}

export default AchievementNotifier;
