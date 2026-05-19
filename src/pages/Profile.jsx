import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useProgressSync } from "../hooks/useProgressSync";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../theme/ThemeContext";
import {
  getAchievementDefinitions,
  getReadingStats,
} from "../lib/achievementRules";
import { useProgressStore } from "../store/useProgressStore";
import "./Profile.css";

const XP_PER_LEVEL = 120;
const PROFILE_STORAGE_KEY = "literary_heritage_profile_details";
const PROFILE_SETTINGS_KEY = "literary_heritage_user_settings";
const MAX_AVATAR_SIZE = 900 * 1024;

const emptyPersonalInfo = {
  displayName: "",
  bio: "",
  readingGoal: "",
  avatarDataUrl: "",
};

const emptyUserSettings = {
  notifications: true,
  personalizedContent: true,
  readingInterests: "",
};

function formatTemplate(template, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  );
}

function Profile() {
  const { language, languages, setLanguage, t, localizeWork } = useI18n();
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut, isConfigured, updateProfile } = useAuth();
  const { isSyncing, lastSyncedAt, syncNow } = useProgressSync();
  const {
    xp,
    level,
    streak,
    lives,
    storyProgress,
    reflections,
    visitedMap,
    favorites,
  } = useProgressStore();
  const [personalInfo, setPersonalInfo] = useState(emptyPersonalInfo);
  const [draftInfo, setDraftInfo] = useState(emptyPersonalInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [userSettings, setUserSettings] = useState(emptyUserSettings);
  const [draftSettings, setDraftSettings] = useState(emptyUserSettings);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPersonalInfo({ ...emptyPersonalInfo, ...parsed });
        setDraftInfo({ ...emptyPersonalInfo, ...parsed });
      } catch {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }

    const savedSettings = window.localStorage.getItem(PROFILE_SETTINGS_KEY);

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setUserSettings({ ...emptyUserSettings, ...parsed });
        setDraftSettings({ ...emptyUserSettings, ...parsed });
      } catch {
        window.localStorage.removeItem(PROFILE_SETTINGS_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!profile) return;

    const nextInfo = {
      displayName: profile.display_name ?? "",
      bio: profile.bio ?? "",
      readingGoal: profile.reading_goal ?? "",
      avatarDataUrl: profile.avatar_data_url ?? "",
    };

    setPersonalInfo((current) => {
      const hasLocalDetails = Object.values(current).some(Boolean);
      return hasLocalDetails ? current : nextInfo;
    });
    setDraftInfo((current) => {
      const hasLocalDetails = Object.values(current).some(Boolean);
      return hasLocalDetails ? current : nextInfo;
    });
  }, [profile]);

  const readerName =
    personalInfo.displayName || profile?.display_name || user?.email || t("reader");
  const { rows, completedChapters, startedWorks, completedWorks } =
    getReadingStats(storyProgress, localizeWork);
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const levelPercent = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelXp) / XP_PER_LEVEL) * 100))
  );
  const xpToNextLevel = Math.max(0, nextLevelXp - xp);

  const achievements = getAchievementDefinitions({
    xp,
    level,
    streak,
    storyProgress,
    reflections,
    visitedMap,
  });
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  const activeRows = rows.filter((row) => row.started || row.completed > 0);
  const visibleRows = activeRows.length > 0 ? activeRows : rows.slice(0, 3);
  const aboutLines = useMemo(
    () =>
      [
        personalInfo.bio,
        personalInfo.readingGoal
          ? `${t("readingGoal")}: ${personalInfo.readingGoal}`
          : "",
      ].filter(Boolean),
    [personalInfo.bio, personalInfo.readingGoal, t]
  );

  const updateDraft = (field, value) => {
    setDraftInfo((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      setProfileMessage(t("photoTooLarge"));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateDraft("avatarDataUrl", String(reader.result));
      setProfileMessage("");
    };
    reader.readAsDataURL(file);
  };

  const openEditor = () => {
    setDraftInfo(personalInfo);
    setIsEditing(true);
    setProfileMessage("");
  };

  const savePersonalInfo = async (event) => {
    event.preventDefault();

    const nextInfo = {
      displayName: draftInfo.displayName.trim(),
      bio: draftInfo.bio.trim(),
      readingGoal: draftInfo.readingGoal.trim(),
      avatarDataUrl: draftInfo.avatarDataUrl,
    };

    setPersonalInfo(nextInfo);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextInfo));
    window.dispatchEvent(new Event("storage"));
    setIsEditing(false);
    setProfileMessage(t("profileSaved"));

    if (user) {
      const { error } = await updateProfile({
        display_name: nextInfo.displayName,
        bio: nextInfo.bio,
        reading_goal: nextInfo.readingGoal,
        avatar_data_url: nextInfo.avatarDataUrl,
      });

      if (error) {
        setProfileMessage(t("profileSavedLocalOnly"));
      }
    }
  };

  const updateDraftSettings = (field, value) => {
    setDraftSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveUserSettings = (event) => {
    event.preventDefault();

    const nextSettings = {
      notifications: Boolean(draftSettings.notifications),
      personalizedContent: Boolean(draftSettings.personalizedContent),
      readingInterests: draftSettings.readingInterests.trim(),
    };

    setUserSettings(nextSettings);
    window.localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(nextSettings));
    setProfileMessage(t("settingsSaved"));
  };

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <header className="profile-topbar">
          <Link className="profile-topbar__back" to="/">
            ‹
          </Link>
          <div>
            <p className="profile-topbar__title">{t("myProfile")}</p>
            <p className="profile-topbar__mode">
              {user ? `${t("signedInAs")} ${readerName}` : t("localMode")}
            </p>
          </div>
        </header>

        <section className="profile-hero-card">
          <div className="profile-avatar" aria-hidden="true">
            {personalInfo.avatarDataUrl ? (
              <img src={personalInfo.avatarDataUrl} alt="" />
            ) : (
              <span />
            )}
          </div>

          <div className="profile-hero-card__content">
            <div className="profile-identity">
              <h1>{readerName}</h1>
              <div className="profile-level-row">
                <span className="profile-level-pill">
                  {formatTemplate(t("levelValue"), { level })}
                </span>
                  <span>{xp} XP</span>
                </div>
              {aboutLines.length > 0 ? (
                <div className="profile-about">
                  {aboutLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="profile-level-progress">
              <div className="profile-progress-meta">
                <span>{t("levelProgress")}</span>
                <span>
                  {formatTemplate(t("xpToNextLevel"), {
                    count: xpToNextLevel,
                    level: level + 1,
                  })}
                </span>
              </div>
              <div className="profile-progress-track">
                <span style={{ width: `${levelPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <button type="button" className="profile-action" onClick={openEditor}>
              {t("editProfile")}
            </button>
            {user ? (
              <>
                <button
                  type="button"
                  className="profile-action is-secondary"
                  onClick={syncNow}
                  disabled={isSyncing}
                >
                  {isSyncing ? t("pleaseWait") : t("syncNow")}
                </button>
                <button
                  type="button"
                  className="profile-action is-secondary"
                  onClick={signOut}
                >
                  {t("signOut")}
                </button>
              </>
            ) : (
              <Link className="profile-action is-secondary" to="/auth">
                {isConfigured ? t("signIn") : t("createAccount")}
              </Link>
            )}
          </div>
        </section>

        {profileMessage ? (
          <p className="profile-message" role="status">
            {profileMessage}
          </p>
        ) : null}

        {isEditing ? (
          <section className="profile-panel profile-editor">
            <div className="profile-section-heading">
              <h2>{t("editProfile")}</h2>
            </div>

            <form className="profile-editor__form" onSubmit={savePersonalInfo}>
              <div className="profile-editor__avatar">
                <div className="profile-avatar is-editing" aria-hidden="true">
                  {draftInfo.avatarDataUrl ? (
                    <img src={draftInfo.avatarDataUrl} alt="" />
                  ) : (
                    <span />
                  )}
                </div>
                <div className="profile-editor__avatar-actions">
                  <label className="profile-file-button">
                    {t("uploadPhoto")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  {draftInfo.avatarDataUrl ? (
                    <button
                      type="button"
                      className="profile-link-button"
                      onClick={() => updateDraft("avatarDataUrl", "")}
                    >
                      {t("removePhoto")}
                    </button>
                  ) : null}
                </div>
              </div>

              <label className="profile-field">
                <span>{t("profileName")}</span>
                <input
                  value={draftInfo.displayName}
                  onChange={(event) => updateDraft("displayName", event.target.value)}
                  placeholder={t("reader")}
                  maxLength={48}
                />
              </label>

              <label className="profile-field">
                <span>{t("profileBio")}</span>
                <textarea
                  value={draftInfo.bio}
                  onChange={(event) => updateDraft("bio", event.target.value)}
                  maxLength={180}
                  rows={3}
                />
              </label>

              <label className="profile-field">
                <span>{t("readingGoal")}</span>
                <input
                  value={draftInfo.readingGoal}
                  onChange={(event) => updateDraft("readingGoal", event.target.value)}
                  maxLength={80}
                />
              </label>

              <div className="profile-editor__buttons">
                <button type="submit" className="profile-action">
                  {t("saveProfile")}
                </button>
                <button
                  type="button"
                  className="profile-action is-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <section className="profile-panel profile-settings-panel">
          <div className="profile-section-heading">
            <div>
              <h2>{t("profileSettings")}</h2>
              <p>{t("profileSettingsText")}</p>
            </div>
          </div>

          <form className="profile-settings-form" onSubmit={saveUserSettings}>
            <label className="profile-field">
              <span>{t("preferredLanguage")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="profile-field">
              <span>{t("preferredTheme")}</span>
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
              >
                <option value="light">{t("lightMode")}</option>
                <option value="dark">{t("darkMode")}</option>
              </select>
            </label>

            <label className="profile-toggle-row">
              <input
                type="checkbox"
                checked={draftSettings.notifications}
                onChange={(event) => updateDraftSettings("notifications", event.target.checked)}
              />
              <span>
                <strong>{t("notifications")}</strong>
                <small>
                  {draftSettings.notifications ? t("notificationsOn") : t("notificationsOff")}
                </small>
              </span>
            </label>

            <label className="profile-toggle-row">
              <input
                type="checkbox"
                checked={draftSettings.personalizedContent}
                onChange={(event) =>
                  updateDraftSettings("personalizedContent", event.target.checked)
                }
              />
              <span>
                <strong>{t("personalizedContent")}</strong>
                <small>{t("recommendedNext")}</small>
              </span>
            </label>

            <label className="profile-field is-wide">
              <span>{t("readingInterests")}</span>
              <input
                value={draftSettings.readingInterests}
                onChange={(event) => updateDraftSettings("readingInterests", event.target.value)}
                placeholder={t("interestsPlaceholder")}
                maxLength={120}
              />
            </label>

            <button type="submit" className="profile-action">
              {t("saveSettings")}
            </button>
          </form>
        </section>

        <section className="profile-stat-grid" aria-label={t("yourStatistics")}>
          <article className="profile-stat-card">
            <span className="profile-stat-card__icon is-gold">☆</span>
            <strong>{xp}</strong>
            <small>{t("totalXp")}</small>
          </article>
          <article className="profile-stat-card">
            <span className="profile-stat-card__icon is-amber">⌁</span>
            <strong>{streak}</strong>
            <small>{t("daysInRow")}</small>
          </article>
          <article className="profile-stat-card">
            <span className="profile-stat-card__icon is-rose">♡</span>
            <strong>{lives}/5</strong>
            <small>{t("lives")}</small>
          </article>
          <article className="profile-stat-card">
            <span className="profile-stat-card__icon is-blue">□</span>
            <strong>{completedChapters}</strong>
            <small>{t("chaptersPassed")}</small>
          </article>
        </section>

        <section className="profile-panel">
          <div className="profile-section-heading">
            <h2>
              <span aria-hidden="true">♕</span>
              {t("achievements")}
            </h2>
            <span>{unlockedCount}/{achievements.length}</span>
          </div>

          <div className="profile-achievements">
            {achievements.map((achievement) => (
              <article
                className={`profile-achievement ${
                  achievement.unlocked ? "is-unlocked" : "is-locked"
                }`}
                key={achievement.id}
              >
                <span className="profile-achievement__icon">
                  {achievement.unlocked ? achievement.icon : "□"}
                </span>
                <strong>{t(`achievement_${achievement.id}`)}</strong>
                <small>{t(`achievement_${achievement.id}_desc`)}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-panel">
          <div className="profile-section-heading">
            <h2>
              <span aria-hidden="true">☆</span>
              {t("favorites")}
            </h2>
            <span>{favorites.length}</span>
          </div>

          {favorites.length > 0 ? (
            <div className="profile-favorites">
              {favorites.slice(0, 8).map((favorite) => (
                <Link
                  className="profile-favorite-card"
                  to={favorite.href || "/profile"}
                  key={`${favorite.type}-${favorite.id}`}
                >
                  <small>{t(`favorite_${favorite.type}`)}</small>
                  <strong>{favorite.title}</strong>
                  {favorite.subtitle ? <span>{favorite.subtitle}</span> : null}
                </Link>
              ))}
            </div>
          ) : (
            <p className="profile-empty-note">{t("noFavoritesYet")}</p>
          )}
        </section>

        <section className="profile-panel">
          <div className="profile-section-heading">
            <h2>
              <span aria-hidden="true">□</span>
              {t("readingHistory")}
            </h2>
          </div>

          <div className="profile-reading-list">
            {visibleRows.map((row) => (
              <article className="profile-reading-row" key={row.id}>
                <img src={row.image} alt="" />
                <div>
                  <strong>{row.title}</strong>
                  <span>
                    {formatTemplate(t("chaptersDoneShort"), {
                      done: row.completed,
                      total: row.total,
                    })}
                  </span>
                  <div className="profile-progress-track is-small">
                    <span style={{ width: `${row.percent}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-summary-card">
          <h2>
            <span aria-hidden="true">↯</span>
            {t("yourStatistics")}
          </h2>
          <div className="profile-summary-card__grid">
            <div>
              <strong>{startedWorks}</strong>
              <span>{t("started")}</span>
            </div>
            <div>
              <strong>{completedWorks}</strong>
              <span>{t("finished")}</span>
            </div>
            <div>
              <strong>{completedChapters}</strong>
              <span>{t("chapters")}</span>
            </div>
          </div>
        </section>

        <p className="profile-sync-note">
          {t("lastSynced")}:{" "}
          {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : t("neverSynced")}
        </p>
      </div>
    </main>
  );
}

export default Profile;
