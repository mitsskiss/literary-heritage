import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import "./Auth.css";

const PASSWORD_MIN_LENGTH = 6;

function Auth() {
  const { t } = useI18n();
  const {
    authEvent,
    isConfigured,
    resetPassword,
    resendConfirmation,
    signIn,
    signUp,
    updatePassword,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const normalizedEmail = email.trim();
  const isPasswordUpdate = mode === "update-password";
  const needsPassword = mode !== "reset";
  const canResendConfirmation = Boolean(
    isConfigured && normalizedEmail && !isSubmitting && !isResending && mode !== "update-password"
  );

  const modeCopy = useMemo(
    () => ({
      signin: {
        eyebrow: t("authSignInEyebrow"),
        title: t("authSignInTitle"),
        text: t("authSignInText"),
        action: t("signIn"),
      },
      signup: {
        eyebrow: t("authSignUpEyebrow"),
        title: t("authSignUpTitle"),
        text: t("authSignUpText"),
        action: t("createAccount"),
      },
      reset: {
        eyebrow: t("authResetEyebrow"),
        title: t("authResetTitle"),
        text: t("authResetText"),
        action: t("sendResetLink"),
      },
      "update-password": {
        eyebrow: t("authNewPasswordEyebrow"),
        title: t("authNewPasswordTitle"),
        text: t("authNewPasswordText"),
        action: t("saveNewPassword"),
      },
    }),
    [t]
  );

  useEffect(() => {
    if (authEvent === "PASSWORD_RECOVERY") {
      setMode("update-password");
      setMessage(t("authReadyForNewPassword"));
      setIsError(false);
    }
  }, [authEvent, t]);

  useEffect(() => {
    const urlText = `${window.location.href}`.toLowerCase();
    if (urlText.includes("type=recovery") || urlText.includes("password_recovery")) {
      setMode("update-password");
    }
  }, []);

  const getAuthErrorMessage = (errorMessage = "") => {
    const normalized = errorMessage.toLowerCase();
    if (normalized.includes("invalid login credentials")) {
      return t("authInvalidCredentials");
    }
    if (normalized.includes("email not confirmed")) {
      return t("authEmailNotConfirmed");
    }
    if (normalized.includes("already registered") || normalized.includes("already exists")) {
      return t("authAlreadyRegistered");
    }
    if (normalized.includes("rate limit") || normalized.includes("too many")) {
      return t("authRateLimited");
    }
    return errorMessage;
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setIsError(false);
  };

  const validatePasswords = () => {
    if (!needsPassword) return true;
    if (password.length < PASSWORD_MIN_LENGTH) {
      setIsError(true);
      setMessage(t("authPasswordTooShort"));
      return false;
    }
    if ((mode === "signup" || isPasswordUpdate) && password !== confirmPassword) {
      setIsError(true);
      setMessage(t("authPasswordsDoNotMatch"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    if (!validatePasswords()) {
      setIsSubmitting(false);
      return;
    }

    try {
      let result;

      if (mode === "signin") {
        result = await signIn({ email: normalizedEmail, password });
      } else if (mode === "signup") {
        result = await signUp({ email: normalizedEmail, password, displayName });
      } else if (mode === "reset") {
        result = await resetPassword({ email: normalizedEmail });
      } else {
        result = await updatePassword({ password });
      }

      if (result.error) {
        setIsError(true);
        setMessage(getAuthErrorMessage(result.error.message));
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setMessage(t("authCheckEmail"));
        return;
      }

      if (mode === "reset") {
        setMessage(t("authResetEmailSent"));
        return;
      }

      if (mode === "update-password") {
        setMessage(t("authPasswordUpdated"));
        window.setTimeout(() => navigate("/profile"), 900);
        return;
      }

      navigate("/profile");
    } catch (error) {
      setIsError(true);
      setMessage(getAuthErrorMessage(error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!normalizedEmail) {
      setIsError(true);
      setMessage(t("authEnterEmailFirst"));
      return;
    }

    setIsResending(true);
    setMessage("");
    setIsError(false);

    try {
      const result = await resendConfirmation({ email: normalizedEmail });
      if (result.error) {
        setIsError(true);
        setMessage(getAuthErrorMessage(result.error.message));
        return;
      }

      setMessage(t("authConfirmationResent"));
    } catch (error) {
      setIsError(true);
      setMessage(getAuthErrorMessage(error.message));
    } finally {
      setIsResending(false);
    }
  };

  const currentCopy = modeCopy[mode];

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <section className="auth-page__intro">
          <p className="auth-page__eyebrow">{currentCopy.eyebrow}</p>
          <h1 className="auth-page__title">{currentCopy.title}</h1>
          <p className="auth-page__text">{currentCopy.text}</p>

          <div className="auth-feature-list" aria-label={t("authBenefitsLabel")}>
            <span>{t("authBenefitSync")}</span>
            <span>{t("authBenefitProgress")}</span>
            <span>{t("authBenefitSecure")}</span>
          </div>
        </section>

        <section className="auth-card" aria-labelledby="auth-card-title">
          {!isConfigured ? (
            <div className="auth-card__config">
              <p className="auth-card__message is-error">{t("authConfigMissing")}</p>
              <code>
                VITE_SUPABASE_URL=https://your-project-id.supabase.co{"\n"}
                VITE_SUPABASE_ANON_KEY=your-public-anon-key
              </code>
              <Link to="/progress" className="auth-card__link">
                {t("viewLocalProgress")}
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-card__header">
                <p>{currentCopy.eyebrow}</p>
                <h2 id="auth-card-title">{currentCopy.action}</h2>
              </div>

              <div className="auth-card__tabs" aria-label={t("authModeTabs")}>
                <button
                  type="button"
                  className={`auth-card__tab ${mode === "signin" ? "is-active" : ""}`}
                  onClick={() => switchMode("signin")}
                >
                  {t("signIn")}
                </button>
                <button
                  type="button"
                  className={`auth-card__tab ${mode === "signup" ? "is-active" : ""}`}
                  onClick={() => switchMode("signup")}
                >
                  {t("signUp")}
                </button>
              </div>

              <form className="auth-card__form" onSubmit={handleSubmit}>
                {mode === "signup" ? (
                  <label className="auth-card__field">
                    {t("displayName")}
                    <input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      autoComplete="name"
                      placeholder={t("displayNamePlaceholder")}
                    />
                  </label>
                ) : null}

                {!isPasswordUpdate ? (
                  <label className="auth-card__field">
                    {t("email")}
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      placeholder="name@email.com"
                    />
                  </label>
                ) : null}

                {needsPassword ? (
                  <label className="auth-card__field">
                    {isPasswordUpdate ? t("newPassword") : t("password")}
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={PASSWORD_MIN_LENGTH}
                      required
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      placeholder={t("passwordPlaceholder")}
                    />
                  </label>
                ) : null}

                {mode === "signup" || isPasswordUpdate ? (
                  <label className="auth-card__field">
                    {t("confirmPassword")}
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={PASSWORD_MIN_LENGTH}
                      required
                      autoComplete="new-password"
                      placeholder={t("confirmPasswordPlaceholder")}
                    />
                  </label>
                ) : null}

                {message ? (
                  <p className={`auth-card__message ${isError ? "is-error" : "is-success"}`}>
                    {message}
                  </p>
                ) : null}

                <button className="auth-card__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("pleaseWait") : currentCopy.action}
                </button>

                <div className="auth-card__secondary-actions">
                  {mode === "signin" ? (
                    <button type="button" onClick={() => switchMode("reset")}>
                      {t("forgotPassword")}
                    </button>
                  ) : null}

                  {mode === "reset" || isPasswordUpdate ? (
                    <button type="button" onClick={() => switchMode("signin")}>
                      {t("backToSignIn")}
                    </button>
                  ) : null}

                  {mode === "signup" ? (
                    <button type="button" onClick={() => switchMode("signin")}>
                      {t("alreadyHaveAccount")}
                    </button>
                  ) : null}
                </div>

                <button
                  className="auth-card__resend"
                  type="button"
                  disabled={!canResendConfirmation}
                  onClick={handleResendConfirmation}
                >
                  {isResending ? t("pleaseWait") : t("resendConfirmationEmail")}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Auth;
