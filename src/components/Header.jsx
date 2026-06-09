import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { useTheme } from "../theme/ThemeContext";
import AboutRail from "./AboutRail";
import { authors } from "../data/authors";
import { literaryEpochs } from "../data/epochs";
import { literaryWorldMarkers } from "../data/literaryWorldMap";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import {
  getAuthorsWithPortrait,
  getVisibleEpochs,
  getVisibleMapMarkers,
  getVisibleRoutes,
  getVisibleWorks,
} from "../utils/authorPortraits";


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
  const { isDark, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openLanguageMenu, setOpenLanguageMenu] = useState(null);
  const [highlightedResult, setHighlightedResult] = useState(0);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const sidebarLanguageRef = useRef(null);
  const mobileLanguageRef = useRef(null);
  
  const navItems = [
  { label: t("navHome"), href: "/", kind: "home" },
  { label: t("navWorks"), href: "/works", kind: "library" },
  { label: t("navAuthors"), href: "/authors", kind: "authors" },
  { label: t("landingEpochs"), href: "/epochs", kind: "epochs" },
  { label: t("navExplore"), href: "/explore", kind: "routes" },
  { label: t("navMap"), href: "/map", kind: "map" },
  { label: t("navProgress"), href: "/progress", kind: "progress" },
  { label: t("navAbout"), href: "/about", kind: "about" },
];

useEffect(() => {
  setIsMenuOpen(false);
  setIsSearchOpen(false);
  setOpenLanguageMenu(null);
  setIsAccountMenuOpen(false);
}, [location.pathname]);


  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen && !openLanguageMenu && !isAccountMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (isMenuOpen && !menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (isSearchOpen && !searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (
        openLanguageMenu &&
        !sidebarLanguageRef.current?.contains(event.target) &&
        !mobileLanguageRef.current?.contains(event.target)
      ) {
        setOpenLanguageMenu(null);
      }
      if (isAccountMenuOpen && !accountMenuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen, isSearchOpen, openLanguageMenu, isAccountMenuOpen]);

  useEffect(() => {
    if (!openLanguageMenu) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpenLanguageMenu(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openLanguageMenu]);

  const isRoutesSection = location.pathname === "/explore" || location.pathname.startsWith("/route/");
  const isAboutPage = location.pathname === "/about";

  useEffect(() => {
    document.documentElement.dataset.muraShell = isAboutPage ? "about" : "default";
    return () => {
      delete document.documentElement.dataset.muraShell;
    };
  }, [isAboutPage]);

  const localizedAuthors = useMemo(
    () => getAuthorsWithPortrait(localizeAuthors(authors)),
    [localizeAuthors]
  );
  const localizedWorks = useMemo(
    () => getVisibleWorks(localizeWorks(works), localizedAuthors),
    [localizedAuthors, localizeWorks]
  );
  const localizedRoutes = useMemo(
    () => getVisibleRoutes(localizeJourneys(readingRoutes), localizedWorks),
    [localizedWorks, localizeJourneys]
  );
  const visibleEpochs = useMemo(
    () => getVisibleEpochs(literaryEpochs, localizedWorks),
    [localizedWorks]
  );
  const localizedWorldMarkers = useMemo(
    () => getVisibleMapMarkers(literaryWorldMarkers.map(localizeMapMarker)),
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
          `${work.author} · ${work.description}`,
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
      ...visibleEpochs.map((epoch) =>
        makeResult(
          t("searchTypeEpoch"),
          epoch.title,
          `${epoch.years} · ${epoch.description}`,
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
          `${place.city} · ${place.description}`,
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
  }, [label, localizedAuthors, localizedRoutes, localizedWorks, localizedWorldMarkers, searchQuery, t, visibleEpochs]);

  useEffect(() => {
    setHighlightedResult(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(focusTimer);
  }, [isSearchOpen]);

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

  const runThemeToggle = (event) => {
    const nextTheme = isDark ? "light" : "dark";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 860,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <>
      <header className="site-header heritage-topbar">
        <div className="heritage-topbar__inner">
          <Link to="/" className="heritage-brand" aria-label="MURA">
            <BrandMark />
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
                data-nav={item.kind}
                className={({ isActive }) =>
                  isActive || (isRoutesSection && item.kind === "routes") ? "is-active" : ""
                }
              >
                <HeaderIcon kind={item.kind} />
                <span className="heritage-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mura-sidebar-controls" aria-label={t("language")}>
            <div className="mura-account-menu" ref={accountMenuRef}>
  <button
    type="button"
    className="mura-settings-button mura-profile-trigger"
    onClick={() => setIsAccountMenuOpen((current) => !current)}
    aria-label={t("profile")}
    aria-expanded={isAccountMenuOpen}
    aria-haspopup="menu"
  >
    <HeaderIcon kind="profile" />
  </button>

  {isAccountMenuOpen ? (
    <div className="mura-account-menu__panel" role="menu">
      <NavLink
        to="/profile"
        className="mura-account-menu__item"
        role="menuitem"
        onClick={() => setIsAccountMenuOpen(false)}
      >
        <HeaderIcon kind="profile" />
        <span>{t("profile")}</span>
      </NavLink>

      <NavLink
        to="/progress"
        className="mura-account-menu__item"
        role="menuitem"
        onClick={() => setIsAccountMenuOpen(false)}
      >
        <HeaderIcon kind="progress" />
        <span>{t("navProgress")}</span>
      </NavLink>

      <NavLink
        to="/admin"
        className="mura-account-menu__item"
        role="menuitem"
        onClick={() => setIsAccountMenuOpen(false)}
      >
        <HeaderIcon kind="admin" />
        <span>{t("navAdmin")}</span>
      </NavLink>
    </div>
  ) : null}
</div>
            <button
              type="button"
              className="heritage-theme"
              onClick={runThemeToggle}
              aria-label={isDark ? t("switchToLight") : t("switchToDark")}
              title={isDark ? t("switchToLight") : t("switchToDark")}
              data-theme-state={isDark ? "dark" : "light"}
            >
              <ThemeGlyph isDark={isDark} />
            </button>
            <LanguageDropdown
              rootRef={sidebarLanguageRef}
              language={language}
              languages={languages}
              isOpen={openLanguageMenu === "sidebar"}
              label={t("language")}
              onToggle={() =>
                setOpenLanguageMenu((current) => (current === "sidebar" ? null : "sidebar"))
              }
              onSelect={(nextLanguage) => {
                setLanguage(nextLanguage);
                setOpenLanguageMenu(null);
              }}
            />
          </div>

          <div className="heritage-tools">
            <div
              className={`heritage-search ${isSearchOpen || searchQuery ? "is-expanded" : ""}`}
              ref={searchRef}
            >
              <button
                type="button"
                className="heritage-search__trigger"
                onClick={() => setIsSearchOpen(true)}
                aria-label={t("globalSearch")}
                aria-expanded={isSearchOpen || Boolean(searchQuery)}
              >
                <SearchGlyph />
              </button>
              <label className="heritage-search__field">
                <input
                  ref={searchInputRef}
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
              {searchQuery ? (
                <button
                  type="button"
                  className="heritage-search__clear"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(true);
                  }}
                  aria-label={t("resetFilters")}
                >
                  <span aria-hidden="true">x</span>
                </button>
              ) : null}
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
          </div>
        </div>
      </header>

      <button
        type="button"
        className="mura-mobile-menu-toggle heritage-menu-toggle"
        onClick={() => setIsMenuOpen((current) => !current)}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
      >
        <MenuGlyph isOpen={isMenuOpen} />
      </button>

      {isAboutPage ? (
        <aside className="mura-right-panel" aria-label={t("navAbout")}>
          <div className="mura-right-panel__body">
            <AboutRail />
          </div>
        </aside>
      ) : null}
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
            {navItems.map((item) => (
              <NavLink key={`${item.href}-${item.kind}-mobile`} to={item.href} end={item.href === "/"} data-nav={item.kind}>
                <HeaderIcon kind={item.kind} />
                <span className="heritage-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="heritage-mobile-menu__settings">
            <button type="button" onClick={runThemeToggle}>
              {isDark ? t("lightMode") : t("darkMode")}
            </button>
            <LanguageDropdown
              rootRef={mobileLanguageRef}
              language={language}
              languages={languages}
              isOpen={openLanguageMenu === "mobile"}
              label={t("language")}
              onToggle={() =>
                setOpenLanguageMenu((current) => (current === "mobile" ? null : "mobile"))
              }
              onSelect={(nextLanguage) => {
                setLanguage(nextLanguage);
                setOpenLanguageMenu(null);
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function SettingsGlyph() {
  return (
    <span className="mura-settings-button__glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" />
        <path d="m4.7 10.2 1.6-.9.4-1.1-.6-1.8 1.8-1.4 1.6 1 1.2-.4L12 3.8h2l.5 1.8 1.2.4 1.6-1 1.8 1.4-.6 1.8.4 1.1 1.6.9v2.2l-1.6.9-.4 1.1.6 1.8-1.8 1.4-1.6-1-1.2.4-.5 1.8h-2l-.5-1.8-1.2-.4-1.6 1-1.8-1.4.6-1.8-.4-1.1-1.6-.9Z" />
      </svg>
    </span>
  );
}

function BrandMark() {
  return (
    <span className="heritage-brand__mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path className="heritage-brand__star-fill" d="M16 3.8 19.2 13l9 3-9 3L16 28.2 12.8 19l-9-3 9-3Z" />
        <path className="heritage-brand__star-line" d="M16 8.2v15.6" />
        <path className="heritage-brand__star-line" d="M8.2 16h15.6" />
        <circle cx="16" cy="16" r="2.2" />
      </svg>
    </span>
  );
}

function MenuGlyph({ isOpen }) {
  return (
    <span className="heritage-menu-toggle__glyph" aria-hidden="true" data-state={isOpen ? "open" : "closed"}>
      <svg viewBox="0 0 24 24" focusable="false">
        {isOpen ? (
          <>
            <path d="M6.2 6.2 17.8 17.8" />
            <path d="M17.8 6.2 6.2 17.8" />
          </>
        ) : (
          <>
            <path d="M4.5 7.2h15" />
            <path d="M8.5 12h11" />
            <path d="M4.5 16.8h15" />
          </>
        )}
      </svg>
    </span>
  );
}

function SearchGlyph() {
  return (
    <span className="heritage-search__glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="10.8" cy="10.8" r="6.4" />
        <path d="m16 16 4.1 4.1" />
      </svg>
    </span>
  );
}

function HeaderIcon({ kind }) {
  const icons = {
    home: (
      <>
        <path d="M3.5 10.5 12 3.8l8.5 6.7" />
        <path d="M6.3 9.8v9.7h11.4V9.8" />
        <path d="M10 19.5v-5h4v5" />
      </>
    ),
    library: (
      <>
        <path d="M5 5.2h5.4a3.4 3.4 0 0 1 3.4 3.4v11.2a3.4 3.4 0 0 0-3.4-3.4H5Z" />
        <path d="M13.8 8.6a3.4 3.4 0 0 1 3.4-3.4H22v11.2h-4.8a3.4 3.4 0 0 0-3.4 3.4Z" />
      </>
    ),
    authors: (
      <>
        <path d="M8.2 19.7a5 5 0 0 1 9.6 0" />
        <circle cx="13" cy="9" r="4" />
        <path d="M18.6 8.2a3.2 3.2 0 0 1 2.9 3.2" />
        <path d="M20.2 19.7a4.2 4.2 0 0 0-2-3.5" />
      </>
    ),
    epochs: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 6.5V12l3.8 2.4" />
        <path d="M4.8 4.8 7 3.2" />
        <path d="m17 3.2 2.2 1.6" />
      </>
    ),
    routes: (
      <>
        <path d="M5 18.5c4.5-8.7 9.8 5.3 15-6.8" />
        <circle cx="5" cy="18.5" r="2" />
        <circle cx="20" cy="11.7" r="2" />
      </>
    ),
    map: (
      <>
        <path d="M5 6.8 10.5 5l7 1.8L23 5v16.2l-5.5 1.8-7-1.8L5 23Z" />
        <path d="M10.5 5v16.2" />
        <path d="M17.5 6.8V23" />
      </>
    ),
    about: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 10.8v6" />
        <path d="M12 7.2h.01" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8.6" r="3.6" />
        <path d="M5.5 20a6.8 6.8 0 0 1 13 0" />
      </>
    ),
    progress: (
      <>
        <path d="M6 19V9" />
        <path d="M12 19V5" />
        <path d="M18 19v-7" />
      </>
    ),
    admin: (
  <>
    <path d="M12 3.8 19 7v5.4c0 4.2-2.8 7.2-7 8.8-4.2-1.6-7-4.6-7-8.8V7Z" />
    <path d="M9.3 12.2 11.2 14l3.7-4.2" />
  </>
  ),
  };

  return (
    <span className="heritage-nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {icons[kind] ?? icons.about}
      </svg>
    </span>
  );
}

function ThemeGlyph({ isDark }) {
  return (
    <span className="heritage-theme__glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.8v2.4" />
            <path d="M12 18.8v2.4" />
            <path d="m4.2 4.2 1.7 1.7" />
            <path d="m18.1 18.1 1.7 1.7" />
            <path d="M2.8 12h2.4" />
            <path d="M18.8 12h2.4" />
            <path d="m4.2 19.8 1.7-1.7" />
            <path d="m18.1 5.9 1.7-1.7" />
          </>
        ) : (
          <path d="M19 14.6A7.2 7.2 0 1 1 9.4 5a5.8 5.8 0 0 0 9.6 9.6Z" />
        )}
      </svg>
    </span>
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
  const activeShortLabel = activeLanguage?.shortLabel ?? language.toUpperCase();
  const handleSelectLanguage = (event, nextLanguage) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(nextLanguage);
  };

  return (
    <div className="heritage-language" ref={rootRef} data-current-language={language}>
      <button
        type="button"
        className="heritage-language__button"
        aria-label={`${label}: ${activeLanguage?.label ?? activeShortLabel}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="heritage-language__stack" aria-hidden="true">
          {activeShortLabel.split("").map((letter) => (
            <b key={`${activeShortLabel}-${letter}`}>{letter}</b>
          ))}
        </span>
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
              onPointerDown={(event) => handleSelectLanguage(event, item.code)}
              onClick={(event) => handleSelectLanguage(event, item.code)}
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
