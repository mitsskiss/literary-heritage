import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { getAchievementDefinitions } from "../lib/achievementRules";
import { useProgressStore } from "../store/useProgressStore";
import "./AchievementNotifier.css";

const SEEN_ACHIEVEMENTS_KEY = "literary_heritage_seen_achievements";

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

  if (!activeAchievement) return null;

  return (
    <aside className="achievement-toast" role="status" aria-live="polite">
      <button
        type="button"
        className="achievement-toast__close"
        onClick={() => setActiveAchievement(null)}
        aria-label={t("close")}
      >
        Г—
      </button>
      <div className="achievement-toast__icon" aria-hidden="true">
        {activeAchievement.icon}
      </div>
      <div className="achievement-toast__content">
        <p>{t("achievementUnlocked")}</p>
        <h2>{t(`achievement_${activeAchievement.id}`)}</h2>
        <span>{t(`achievement_${activeAchievement.id}_desc`)}</span>
        <Link to="/profile">{t("viewAchievement")}</Link>
      </div>
    </aside>
  );
}

export default AchievementNotifier;
