import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import { useTheme } from "../theme/ThemeContext";

function Header() {
  const { language, languages, setLanguage, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const location = useLocation();
  const xp = useProgressStore((state) => state.xp);
  const lives = useProgressStore((state) => state.lives);
  const streak = useProgressStore((state) => state.streak);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localAvatar, setLocalAvatar] = useState("");
  const menuRef = useRef(null);
  const avatarDataUrl = profile?.avatar_data_url || localAvatar;

  const navItems = [
    { label: t("navHome"), href: "/", kind: "home" },
    { label: t("navWorks"), href: "/works", kind: "library" },
    { label: t("navAuthors"), href: "/authors", kind: "authors" },
    { label: t("landingEpochs"), href: "/epochs", kind: "epochs" },
    { label: t("navExplore"), href: "/explore", kind: "routes" },
    { label: t("navMap"), href: "/map", kind: "map" },
    { label: t("navAbout"), href: "/about", kind: "about" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const readLocalAvatar = () => {
      try {
        const saved = window.localStorage.getItem("literary_heritage_profile_details");
        const parsed = saved ? JSON.parse(saved) : null;
        setLocalAvatar(parsed?.avatarDataUrl || "");
      } catch {
        setLocalAvatar("");
      }
    };

    readLocalAvatar();
    window.addEventListener("storage", readLocalAvatar);
    return () => window.removeEventListener("storage", readLocalAvatar);
  }, []);

  const isRoutesSection = location.pathname === "/explore" || location.pathname.startsWith("/route/");

  return (
    <>
      <header className="site-header heritage-topbar">
        <div className="heritage-topbar__inner">
          <Link to="/" className="heritage-brand" aria-label="MURA">
            <span className="heritage-brand__mark" aria-hidden="true" />
            <span className="heritage-brand__copy">
              <strong>MURA</strong>
              <small>{t("brandSubtitle")}</small>
            </span>
          </Link>

          <nav className="heritage-topnav" aria-label={t("navigation")}>
            {navItems.map((item) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  isActive || (isRoutesSection && item.kind === "routes") ? "is-active" : ""
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="heritage-tools">
            <button type="button" className="heritage-icon-button" aria-label={t("searchArchive")}>
              <span className="heritage-icon heritage-icon--search" aria-hidden="true" />
            </button>
            <button type="button" className="heritage-icon-button" aria-label={t("notifications")}>
              <span className="heritage-icon heritage-icon--bell" aria-hidden="true" />
            </button>
            <NavLink to="/profile" className="heritage-avatar" aria-label={t("profile")}>
              {avatarDataUrl ? <img src={avatarDataUrl} alt="" /> : <span aria-hidden="true" />}
            </NavLink>
            <select
              className="heritage-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t("language")}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.shortLabel}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="heritage-theme"
              onClick={toggleTheme}
              aria-label={isDark ? t("switchToLight") : t("switchToDark")}
            >
              {isDark ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              className="heritage-menu-toggle"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen ? (
        <div className="heritage-mobile-menu" ref={menuRef}>
          <div className="heritage-mobile-menu__head">
            <strong>{t("brandTitle")}</strong>
            <button type="button" onClick={() => setIsMenuOpen(false)}>
              {t("close")}
            </button>
          </div>
          <nav>
            {[...navItems, { label: t("profile"), href: "/profile", kind: "profile" }, { label: t("navAdmin"), href: "/admin", kind: "admin" }].map((item) => (
              <NavLink key={`${item.href}-${item.kind}-mobile`} to={item.href} end={item.href === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="heritage-mobile-menu__settings">
            <button type="button" onClick={toggleTheme}>
              {isDark ? t("lightMode") : t("darkMode")}
            </button>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.shortLabel}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="heritage-status-strip" aria-label={t("headerProgress")}>
        <span>{xp} XP</span>
        <span>{lives} {t("lifeShort")}</span>
        <span>{streak} {t("daysShort")}</span>
      </div>
    </>
  );
}

export default Header;
