import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useProgressSync } from "../hooks/useProgressSync";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import "./Profile.css";

function Profile() {
  const { t, localizeAchievement } = useI18n();
  const { user, profile, signOut, isConfigured } = useAuth();
  const { isSyncing, lastSyncedAt, syncNow } = useProgressSync();
  const { xp, level, streak, lives, achievements } = useProgressStore();

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <section className="profile-hero">
          <div>
            <p className="profile-hero__eyebrow">
              {user ? t("accountMode") : t("localMode")}
            </p>
            <h1 className="profile-hero__title">{t("profileTitle")}</h1>
            <p className="profile-hero__text">
              {user
                ? `${t("signedInAs")} ${profile?.display_name || user.email}`
                : t("notSignedIn")}{" "}
              {t("profileText")}
            </p>
          </div>

          <div className="profile-hero__actions">
            {user ? (
              <>
                <button
                  type="button"
                  className="profile-button"
                  onClick={syncNow}
                  disabled={isSyncing}
                >
                  {isSyncing ? t("pleaseWait") : t("syncNow")}
                </button>
                <button
                  type="button"
                  className="profile-button is-secondary"
                  onClick={signOut}
                >
                  {t("signOut")}
                </button>
              </>
            ) : (
              <Link to="/auth" className="profile-button">
                {isConfigured ? t("signIn") : t("createAccount")}
              </Link>
            )}
          </div>
        </section>

        <section className="profile-grid">
          <article className="profile-card">
            <p className="profile-card__label">XP</p>
            <h2 className="profile-card__value">{xp}</h2>
          </article>
          <article className="profile-card">
            <p className="profile-card__label">{t("level")}</p>
            <h2 className="profile-card__value">{level}</h2>
          </article>
          <article className="profile-card">
            <p className="profile-card__label">{t("streak")}</p>
            <h2 className="profile-card__value">{streak}</h2>
          </article>
          <article className="profile-card">
            <p className="profile-card__label">{t("lives")}</p>
            <h2 className="profile-card__value">{lives}</h2>
          </article>
        </section>

        <section className="profile-section">
          <h2>{t("achievements")}</h2>
          <div className="profile-badges">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <span key={achievement}>{localizeAchievement(achievement)}</span>
              ))
            ) : (
              <span>{t("finishFirstChapter")}</span>
            )}
          </div>
        </section>

        <section className="profile-section">
          <h2>{t("lastSynced")}</h2>
          <p>
            {lastSyncedAt
              ? new Date(lastSyncedAt).toLocaleString()
              : t("neverSynced")}
          </p>
        </section>
      </div>
    </main>
  );
}

export default Profile;
