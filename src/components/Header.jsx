import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import PillNav from "./PillNav";
import StaggeredMenu from "./StaggeredMenu";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import { useTheme } from "../theme/ThemeContext";

function Header() {
  const { language, languages, setLanguage, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const xp = useProgressStore((state) => state.xp);
  const lives = useProgressStore((state) => state.lives);
  const streak = useProgressStore((state) => state.streak);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const navItems = [
    { label: t("navHome"), href: "/", icon: "⌂" },
    { label: t("navExplore"), href: "/explore", icon: "□" },
    { label: t("navMap"), href: "/map", icon: "◇" },
    { label: t("navAuthors"), href: "/authors", icon: "✎" },
    { label: t("navProgress"), href: "/progress", icon: "↯" },
  ];
  const menuItems = [...navItems, { label: t("profile"), href: "/profile", icon: "○" }];
  const desktopNavItems = navItems.map((item) => ({
    ...item,
    label: `${item.icon} ${item.label}`,
  }));
  const mobileItems = menuItems.map((item) => ({
    label: `${item.icon} ${item.label}`,
    ariaLabel: t("goToPage", { page: item.label.toLowerCase() }),
    link: item.href,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;

      if (currentScrollY <= 16) {
        setIsHeaderHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 10 && currentScrollY > 120) {
        setIsHeaderHidden(true);
      } else if (delta < -8) {
        setIsHeaderHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header ${isHeaderHidden ? "is-hidden" : ""}`}>
      <div className="site-header__scrollline" aria-hidden="true" />
      <div className="site-header__container">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__brand-mark" aria-hidden="true">
            LH
          </span>
          <span className="site-header__brand-copy">
            <span className="site-header__brand-title">{t("brandTitle")}</span>
            <span className="site-header__brand-subtitle">
              {t("brandSubtitle")}
            </span>
          </span>
        </NavLink>

        <div className="site-header__desktop-nav">
          <PillNav
            items={desktopNavItems}
            baseColor="var(--brand)"
            pillColor="var(--surface-strong)"
            hoveredPillTextColor="var(--brand-contrast)"
            pillTextColor="var(--brand)"
          />
        </div>

        <div className="site-header__controls">
          <div className="site-header__quickStats" aria-label={t("headerProgress")}>
            <span className="is-xp" title={t("totalXp")}>
              <strong>{xp}</strong>
              XP
            </span>
            <span className="is-lives" title={t("lives")}>
              <strong>{lives}</strong>
              {t("lifeShort")}
            </span>
            <span className="is-streak" title={t("daysInRow")}>
              <strong>{streak}</strong>
              {t("daysShort")}
            </span>
          </div>

          <NavLink
            to="/profile"
            className="site-header__profileLink"
            aria-label={t("profile")}
            title={t("profile")}
          >
            <span aria-hidden="true" />
          </NavLink>

          <StaggeredMenu
            position="right"
            items={mobileItems}
            menuText={t("menu")}
            closeText={t("close")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
            socialItems={[]}
            displaySocials={false}
            displayItemNumbering
            menuButtonColor="var(--brand)"
            openMenuButtonColor="var(--brand)"
            changeMenuColorOnOpen
            colors={["var(--palette-secondary)", "var(--palette-primary)"]}
            accentColor="var(--accent-strong)"
          >
            <div className="site-header__menuSettings">
              <div className="site-header__menuSetting">
                <span>{t("theme")}</span>
                <button
                  type="button"
                  className="site-header__themeToggle"
                  onClick={toggleTheme}
                  aria-label={isDark ? t("switchToLight") : t("switchToDark")}
                >
                  <span aria-hidden="true">{isDark ? "L" : "D"}</span>
                  <span>{isDark ? t("lightMode") : t("darkMode")}</span>
                </button>
              </div>

              <label className="site-header__menuSetting">
                <span>{t("language")}</span>
                <select
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
              </label>
            </div>
          </StaggeredMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
