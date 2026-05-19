import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import "./Auth.css";

function Auth() {
  const { t } = useI18n();
  const { isConfigured, signIn, signUp, resendConfirmation } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const normalizedEmail = email.trim();
  const canResendConfirmation = Boolean(
    isConfigured && normalizedEmail && !isSubmitting && !isResending
  );

  const getAuthErrorMessage = (errorMessage = "") => {
    const normalized = errorMessage.toLowerCase();
    if (normalized.includes("invalid login credentials")) {
      return t("authInvalidCredentials");
    }
    if (normalized.includes("already registered") || normalized.includes("already exists")) {
      return t("authAlreadyRegistered");
    }
    return errorMessage;
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setIsError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const result =
        mode === "signin"
          ? await signIn({ email, password })
          : await signUp({ email, password, displayName });

      if (result.error) {
        setIsError(true);
        setMessage(getAuthErrorMessage(result.error.message));
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setMessage(t("authCheckEmail"));
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

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <section className="auth-page__intro">
          <p className="auth-page__eyebrow">{t("authEyebrow")}</p>
          <h1 className="auth-page__title">{t("authTitle")}</h1>
          <p className="auth-page__text">{t("authText")}</p>
        </section>

        <section className="auth-card">
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
              <div className="auth-card__tabs">
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
                    />
                  </label>
                ) : null}

                <label className="auth-card__field">
                  {t("email")}
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>

                <label className="auth-card__field">
                  {t("password")}
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </label>

                {message ? (
                  <p className={`auth-card__message ${isError ? "is-error" : ""}`}>
                    {message}
                  </p>
                ) : null}

                <button className="auth-card__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("pleaseWait")
                    : mode === "signin"
                      ? t("signIn")
                      : t("createAccount")}
                </button>

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
