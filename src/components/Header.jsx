import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/useI18n";
import { useTheme } from "../theme/ThemeContext";
import { authors } from "../data/authors";
import { literaryEpochs } from "../data/epochs";
import { literaryWorldMarkers } from "../data/literaryWorldMap";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";

function Header() {
  const {
    language,
    languages,
    label,
    localizeAuthors,
    localizeJourneys,
    localizeMapMarker,
    localizeWorks,
    setLanguage,
    t,
  } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [highlightedResult, setHighlightedResult] = useState(0);
  const [localAvatar, setLocalAvatar] = useState("");
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const languageRef = useRef(null);
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
    setIsProfileOpen(false);
    setIsSearchOpen(false);
    setIsLanguageOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen && !isProfileOpen && !isSearchOpen && !isLanguageOpen) return undefined;

    const handlePointerDown = (event) => {
      if (isMenuOpen && !menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (isProfileOpen && !profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (isSearchOpen && !searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (isLanguageOpen && !languageRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isLanguageOpen, isMenuOpen, isProfileOpen, isSearchOpen]);

  useEffect(() => {
    if (!isLanguageOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLanguageOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLanguageOpen]);

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
  const localizedWorks = useMemo(() => localizeWorks(works), [localizeWorks]);
  const localizedAuthors = useMemo(() => localizeAuthors(authors), [localizeAuthors]);
  const localizedRoutes = useMemo(() => localizeJourneys(readingRoutes), [localizeJourneys]);
  const localizedWorldMarkers = useMemo(
    () => literaryWorldMarkers.map(localizeMapMarker),
    [localizeMapMarker]
  );

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const makeResult = (type, title, description, href, keywords = []) => ({
      type,
      title,
      description,
      href,
      haystack: [type, title, description, ...keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });

    const results = [
      ...localizedWorks.map((work) =>
        makeResult(
          t("searchTypeWork"),
          work.title,
          `${work.author} В· ${work.description}`,
          `/reading/${work.id}`,
          [work.originalTitle, work.period, work.genre, ...(work.themes ?? []), ...(work.canonicalThemes ?? [])]
        )
      ),
      ...localizedAuthors.map((author) =>
        makeResult(
          t("searchTypeAuthor"),
          author.name,
          author.description,
          `/author/${encodeURIComponent(author.canonicalName ?? author.name)}`,
          [author.period, author.years, ...(author.keyIdeas ?? []), ...(author.mainWorks ?? [])]
        )
      ),
      ...literaryEpochs.map((epoch) =>
        makeResult(
          t("searchTypeEpoch"),
          epoch.title,
          `${epoch.years} В· ${epoch.description}`,
          "/epochs",
          [epoch.id, ...(epoch.authors ?? []), ...(epoch.works ?? [])]
        )
      ),
      ...localizedRoutes.map((route) =>
        makeResult(
          t("searchTypeRoute"),
          route.title,
          route.subtitle ?? route.description,
          `/route/${route.id}`,
          [route.focusTheme, route.difficulty, ...(route.works ?? [])]
        )
      ),
      ...localizedWorldMarkers.map((place) =>
        makeResult(
          t("searchTypePlace"),
          place.name,
          `${place.city} В· ${place.description}`,
          "/map",
          [place.author, place.region, place.type]
        )
      ),
      ...Array.from(new Set(localizedWorks.flatMap((work) => work.themes ?? []))).map((theme) =>
        makeResult(
          t("searchTypeTheme"),
          theme,
          t("searchThemeDescription", { theme }),
          `/explore?theme=${encodeURIComponent(theme)}`,
          [label(theme)]
        )
      ),
      ...localizedWorks.flatMap((work) =>
        (work.fragments ?? []).map((fragment) =>
          makeResult(
            t("searchTypeQuote"),
            fragment.reflection?.resonanceQuote?.author ?? work.title,
            fragment.reflection?.resonanceQuote?.text ?? fragment.text,
            `/reading/${work.id}`,
            [work.author, work.title]
          )
        )
      ),
    ];

    return results
      .filter((result) => result.haystack.includes(normalizedQuery))
      .slice(0, 8);
  }, [label, localizedAuthors, localizedRoutes, localizedWorks, localizedWorldMarkers, searchQuery, t]);

  useEffect(() => {
    setHighlightedResult(0);
  }, [searchQuery]);

  const openSearchResult = (result = searchResults[highlightedResult]) => {
    if (!result) return;
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(result.href);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsSearchOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedResult((current) =>
        Math.min(current + 1, Math.max(searchResults.length - 1, 0))
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedResult((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openSearchResult();
    }
  };

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
            <div className="heritage-search" ref={searchRef}>
              <label className="heritage-search__field">
                <span className="heritage-icon heritage-icon--search" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t("globalSearchPlaceholder")}
                  aria-label={t("globalSearch")}
                />
              </label>
              {isSearchOpen && searchQuery.trim() ? (
                <div className="heritage-search__dropdown" role="listbox">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <button
                        key={`${result.type}-${result.href}-${index}`}
                        type="button"
                        className={highlightedResult === index ? "is-active" : ""}
                        onMouseEnter={() => setHighlightedResult(index)}
                        onClick={() => openSearchResult(result)}
                        role="option"
                        aria-selected={highlightedResult === index}
                      >
                        <small>{result.type}</small>
                        <strong>{result.title}</strong>
                        <span>{result.description}</span>
                      </button>
                    ))
                  ) : (
                    <p>{t("noResults")}</p>
                  )}
                </div>
              ) : null}
            </div>
            <LanguageDropdown
              rootRef={languageRef}
              language={language}
              languages={languages}
              isOpen={isLanguageOpen}
              label={t("language")}
              onToggle={() => setIsLanguageOpen((current) => !current)}
              onSelect={(nextLanguage) => {
                setLanguage(nextLanguage);
                setIsLanguageOpen(false);
              }}
            />
            <button
              type="button"
              className="heritage-theme"
              onClick={toggleTheme}
              aria-label={isDark ? t("switchToLight") : t("switchToDark")}
              title={isDark ? t("switchToLight") : t("switchToDark")}
              data-theme-state={isDark ? "dark" : "light"}
            >
              <span className="heritage-theme__glyph" aria-hidden="true" />
            </button>
            <div className="heritage-profile" ref={profileRef}>
              <button
                type="button"
                className="heritage-avatar"
                aria-label={t("profileMenu")}
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((current) => !current)}
              >
                {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt="" />
                ) : (
                  <span className="heritage-avatar__glyph" aria-hidden="true" />
                )}
              </button>
              {isProfileOpen ? (
                <div className="heritage-profile__menu">
                  <Link to="/profile">{t("profile")}</Link>
                  <Link to="/progress">{t("navProgress")}</Link>
                </div>
              ) : null}
            </div>
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
          <div className="heritage-mobile-menu__search">
            <label>
              <span>{t("globalSearch")}</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={t("globalSearchPlaceholder")}
              />
            </label>
            {searchQuery.trim() ? (
              <div className="heritage-mobile-menu__results">
                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <button
                      key={`${result.type}-${result.href}-${index}-mobile`}
                      type="button"
                      className={highlightedResult === index ? "is-active" : ""}
                      onMouseEnter={() => setHighlightedResult(index)}
                      onClick={() => openSearchResult(result)}
                    >
                      <small>{result.type}</small>
                      <strong>{result.title}</strong>
                      <span>{result.description}</span>
                    </button>
                  ))
                ) : (
                  <p>{t("noResults")}</p>
                )}
              </div>
            ) : null}
          </div>
          <nav>
            {[...navItems, { label: t("profile"), href: "/profile", kind: "profile" }, { label: t("navProgress"), href: "/progress", kind: "progress" }].map((item) => (
              <NavLink key={`${item.href}-${item.kind}-mobile`} to={item.href} end={item.href === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="heritage-mobile-menu__settings">
            <button type="button" onClick={toggleTheme}>
              {isDark ? t("lightMode") : t("darkMode")}
            </button>
            <LanguageDropdown
              rootRef={languageRef}
              language={language}
              languages={languages}
              isOpen={isLanguageOpen}
              label={t("language")}
              onToggle={() => setIsLanguageOpen((current) => !current)}
              onSelect={(nextLanguage) => {
                setLanguage(nextLanguage);
                setIsLanguageOpen(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function LanguageDropdown({
  rootRef,
  language,
  languages,
  isOpen,
  label,
  onToggle,
  onSelect,
}) {
  const activeLanguage = languages.find((item) => item.code === language) ?? languages[0];

  return (
    <div className="heritage-language" ref={rootRef} data-current-language={language}>
      <button
        type="button"
        className="heritage-language__button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{activeLanguage?.shortLabel ?? language.toUpperCase()}</span>
        <i aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="heritage-language__menu" role="listbox" aria-label={label}>
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === language}
              data-language={item.code}
              className={item.code === language ? "is-active" : ""}
              onClick={() => onSelect(item.code)}
            >
              <strong>{item.shortLabel}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Header;
