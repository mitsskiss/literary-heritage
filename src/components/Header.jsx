import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import PillNav from "./PillNav";
import StaggeredMenu from "./StaggeredMenu";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../theme/ThemeContext";

function Header() {
  const { language, languages, setLanguage, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const navItems = [
    { label: t("navHome"), href: "/" },
    { label: t("navExplore"), href: "/explore" },
    { label: t("navMap"), href: "/map" },
    { label: t("navAuthors"), href: "/authors" },
    { label: t("navProgress"), href: "/progress" },
    { label: t("profile"), href: "/profile" },
  ];
  const mobileItems = navItems.map((item) => ({
    label: item.label,
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
            items={navItems}
            baseColor="#163a35"
            pillColor="#f7f1e8"
            hoveredPillTextColor="#f7f1e8"
            pillTextColor="#163a35"
          />
        </div>

        <div className="site-header__mobile-nav">
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
            menuButtonColor="#163a35"
            openMenuButtonColor="#163a35"
            changeMenuColorOnOpen
            colors={["#efe2cc", "#dcc7a0"]}
            accentColor="#2b6a61"
          />
        </div>

        <div className="site-header__controls">
          <button
            type="button"
            className="site-header__themeToggle"
            onClick={toggleTheme}
            aria-label={isDark ? t("switchToLight") : t("switchToDark")}
            title={isDark ? t("switchToLight") : t("switchToDark")}
          >
            <span aria-hidden="true">{isDark ? "L" : "D"}</span>
            <span>{isDark ? t("lightMode") : t("darkMode")}</span>
          </button>

          <label className="site-header__language">
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
      </div>
    </header>
  );
}

export default Header;
