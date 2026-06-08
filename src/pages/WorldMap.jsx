import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import kazakhstanMap from "../assets/mura/map-kazakhstan-v2.jpg";
import { literaryWorldMarkers, mapCategoryMeta } from "../data/literaryWorldMap";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import "./WorldMap.css";

const KAZAKHSTAN_BOUNDS = {
  west: 46.3,
  east: 87.4,
  north: 55.5,
  south: 40.4,
};

const MARKER_SAFE_BOUNDS = {
  minX: 8.75,
  maxX: 90.5,
  minY: 12.5,
  maxY: 87.5,
};

const mapCopy = {
  en: {
    layer: "Literary map layer",
    filtersTitle: "Map filters",
    featuredTitle: "Featured places",
    significance: "Historical significance",
    authors: "Related authors",
    works: "Related works",
    routes: "Routes",
    source: "Source",
    details: "Details",
    openRoute: "Open route",
    relatedWorks: "Related works",
    openExternal: "Open on map",
    noResults: "No places match the selected filters.",
  },
  ru: {
    layer: "Литературная карта",
    filtersTitle: "Фильтры карты",
    featuredTitle: "Избранные места",
    coordinates: "Координаты",
    authors: "Связанные авторы",
    works: "Связанные произведения",
    routes: "Маршруты",
    source: "Источник",
    details: "Подробнее",
    openRoute: "Открыть маршрут",
    relatedWorks: "Связанные произведения",
    openExternal: "Открыть на карте",
    noResults: "Нет мест для выбранных фильтров.",
  },
  kk: {
    layer: "Әдеби карта",
    filtersTitle: "Карта сүзгілері",
    featuredTitle: "Таңдаулы орындар",
    coordinates: "Координаттар",
    authors: "Байланысты авторлар",
    works: "Байланысты шығармалар",
    routes: "Маршруттар",
    source: "Дереккөз",
    details: "Толығырақ",
    openRoute: "Маршрутты ашу",
    relatedWorks: "Байланысты шығармалар",
    openExternal: "Картадан ашу",
    noResults: "Таңдалған сүзгілерге сәйкес орын жоқ.",
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampMarkerPosition(position) {
  return {
    x: clamp(position.x, MARKER_SAFE_BOUNDS.minX, MARKER_SAFE_BOUNDS.maxX),
    y: clamp(position.y, MARKER_SAFE_BOUNDS.minY, MARKER_SAFE_BOUNDS.maxY),
  };
}

function projectCoordinates(coordinates) {
  const x =
    ((coordinates.lng - KAZAKHSTAN_BOUNDS.west) /
      (KAZAKHSTAN_BOUNDS.east - KAZAKHSTAN_BOUNDS.west)) *
    100;
  const y =
    ((KAZAKHSTAN_BOUNDS.north - coordinates.lat) /
      (KAZAKHSTAN_BOUNDS.north - KAZAKHSTAN_BOUNDS.south)) *
    100;

  return clampMarkerPosition({ x, y });
}

function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getDisplayPositions(places) {
  const groups = [];

  places.forEach((place) => {
    const matchingGroup = groups.find((group) => getDistance(group.center, place.position) < 3.8);

    if (matchingGroup) {
      matchingGroup.places.push(place);
      matchingGroup.center = {
        x:
          matchingGroup.places.reduce((sum, item) => sum + item.position.x, 0) /
          matchingGroup.places.length,
        y:
          matchingGroup.places.reduce((sum, item) => sum + item.position.y, 0) /
          matchingGroup.places.length,
      };
      return;
    }

    groups.push({ center: place.position, places: [place] });
  });

  const positions = new Map();

  groups.forEach((group) => {
    if (group.places.length === 1) {
      positions.set(group.places[0].id, {
        ...clampMarkerPosition(group.places[0].position),
        groupSize: 1,
      });
      return;
    }

    const radius = clamp(2.1 + group.places.length * 0.28, 2.4, 4.2);
    const startAngle = group.places.length === 2 ? -Math.PI * 0.15 : -Math.PI / 2;

    group.places.forEach((place, index) => {
      const angle = startAngle + (index * Math.PI * 2) / group.places.length;
      positions.set(place.id, {
        ...clampMarkerPosition({
          x: group.center.x + Math.cos(angle) * radius,
          y: group.center.y + Math.sin(angle) * radius,
        }),
        groupSize: group.places.length,
      });
    });
  });

  return positions;
}

function getLocalized(value, language) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] ?? value.en ?? value.ru ?? value.kk ?? "";
}

function localizeLinkedItems(items = [], language, key = "name") {
  return items.map((item) => ({
    ...item,
    label: getLocalized(item[key] ?? item.label ?? item.title, language),
  }));
}

function escapeSvgText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createImagePlaceholder(place) {
  const title = escapeSvgText(place.titleLabel ?? place.name ?? "Literary place");
  const location = escapeSvgText(place.locationLabel ?? "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
      <defs>
        <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#f7eedf"/>
          <stop offset="1" stop-color="#decba9"/>
        </linearGradient>
        <radialGradient id="glow" cx="72%" cy="20%" r="65%">
          <stop offset="0" stop-color="#d1a04b" stop-opacity=".35"/>
          <stop offset="1" stop-color="#0d3f35" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="760" fill="url(#paper)"/>
      <rect width="1200" height="760" fill="url(#glow)"/>
      <path d="M160 560c170-150 260-195 405-120 88 45 160 52 250-8 62-42 124-58 202-36" fill="none" stroke="#8e6a30" stroke-width="12" stroke-linecap="round" opacity=".22"/>
      <circle cx="220" cy="225" r="72" fill="none" stroke="#0c4a3f" stroke-width="10" opacity=".22"/>
      <path d="M220 132v186M128 225h184" stroke="#0c4a3f" stroke-width="10" stroke-linecap="round" opacity=".18"/>
      <text x="96" y="608" fill="#0b3f36" font-family="Georgia, serif" font-size="52" font-weight="600">${title}</text>
      <text x="96" y="664" fill="#8b6326" font-family="Arial, sans-serif" font-size="27" font-weight="700">${location}</text>
      <text x="96" y="704" fill="#536b61" font-family="Arial, sans-serif" font-size="23">Photo source unavailable</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function handleImageFallback(event, place) {
  if (event.currentTarget.dataset.fallbackApplied === "true") return;
  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.src = createImagePlaceholder(place);
}

function WorldMap() {
  const { t, language, localizeMapCategory } = useI18n();
  const markMapVisited = useProgressStore((state) => state.markMapVisited);
  const [regionFilter, setRegionFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("abai-museum-semey");
  const [focusedId, setFocusedId] = useState("");
  const ui = mapCopy[language] ?? mapCopy.en;

  useEffect(() => {
    markMapVisited();
  }, [markMapVisited]);

  useEffect(() => {
    if (!focusedId) return undefined;
    const timer = window.setTimeout(() => setFocusedId(""), 900);
    return () => window.clearTimeout(timer);
  }, [focusedId]);

  const localizedPlaces = useMemo(
    () =>
      literaryWorldMarkers.map((place) => {
        const categoryMeta = localizeMapCategory(
          place.category,
          mapCategoryMeta[place.category] ?? mapCategoryMeta.museum
        );
        const position = projectCoordinates(place.coordinates);
        const cityLabel = getLocalized(place.city, language);
        const regionLabel = getLocalized(place.region, language);

        return {
          ...place,
          titleLabel: getLocalized(place.title, language),
          regionLabel,
          cityLabel,
          locationLabel: [cityLabel, regionLabel].filter(Boolean).join(", "),
          typeLabel: getLocalized(place.type, language),
          shortDescriptionLabel: getLocalized(place.shortDescription, language),
          fullDescriptionLabel: getLocalized(place.fullDescription, language),
          significanceLabel: getLocalized(place.significance, language),
          imageAltLabel: getLocalized(place.imageAlt, language),
          relatedAuthorItems: localizeLinkedItems(place.relatedAuthors, language, "name"),
          relatedWorkItems: localizeLinkedItems(place.relatedWorks, language, "title"),
          routeItems: localizeLinkedItems(place.routeLinks, language, "label"),
          markerColor: categoryMeta.color,
          categoryLabel: categoryMeta.label,
          position,
        };
      }),
    [language, localizeMapCategory]
  );

  const regionOptions = useMemo(() => {
    const values = new Map();
    localizedPlaces.forEach((place) => values.set(place.regionId, place.regionLabel));
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [localizedPlaces]);

  const authorOptions = useMemo(() => {
    const values = new Map();
    localizedPlaces.forEach((place) => {
      place.relatedAuthorItems.forEach((author) => values.set(author.id, author.label));
    });
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [localizedPlaces]);

  const typeOptions = useMemo(() => {
    const values = new Map();
    localizedPlaces.forEach((place) => values.set(place.category, place.typeLabel));
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [localizedPlaces]);

  const visiblePlaces = useMemo(
    () =>
      localizedPlaces.filter(
        (place) =>
          (regionFilter === "all" || place.regionId === regionFilter) &&
          (authorFilter === "all" ||
            place.relatedAuthorItems.some((author) => author.id === authorFilter)) &&
          (typeFilter === "all" || place.category === typeFilter)
      ),
    [authorFilter, localizedPlaces, regionFilter, typeFilter]
  );

  useEffect(() => {
    if (!visiblePlaces.length) {
      if (selectedId) setSelectedId("");
      return;
    }

    if (!visiblePlaces.some((place) => place.id === selectedId)) {
      setSelectedId(visiblePlaces[0].id);
    }
  }, [selectedId, visiblePlaces]);

  const visibleDisplayPlaces = useMemo(() => {
    const displayPositions = getDisplayPositions(visiblePlaces);
    return visiblePlaces.map((place) => ({
      ...place,
      displayPosition: displayPositions.get(place.id) ?? { ...place.position, groupSize: 1 },
    }));
  }, [visiblePlaces]);

  const selectedPlace = visibleDisplayPlaces.find((place) => place.id === selectedId) ?? null;
  const featuredPlaces = visibleDisplayPlaces.slice(0, 6);

  const selectPlace = (placeId) => {
    setSelectedId(placeId);
    setFocusedId(placeId);
  };

  const resetFilters = () => {
    setRegionFilter("all");
    setAuthorFilter("all");
    setTypeFilter("all");
    selectPlace("abai-museum-semey");
  };

  return (
    <main className="world-map-page">
      <section className="mura-map-hero">
        <p className="heritage-kicker">{t("navMap")}</p>
        <h1>{t("mapTitle")}</h1>
        <p>{t("mapSubtitle")}</p>
      </section>

      <section className="mura-map-layout">
        <div className="mura-map-board">
          <div className="mura-map-canvas" style={{ backgroundImage: `url(${kazakhstanMap})` }}>
            <div className="mura-map-controls">
              <span>{ui.layer}</span>
              <strong data-testid="map-place-count">
                {visiblePlaces.length} {t("literaryPlaces")}
              </strong>
            </div>

            {visibleDisplayPlaces.map((place) => (
              <button
                type="button"
                key={place.id}
                className={`mura-map-marker ${selectedPlace?.id === place.id ? "is-selected" : ""} ${focusedId === place.id ? "is-focused" : ""}`}
                style={{
                  left: `${place.displayPosition.x}%`,
                  top: `${place.displayPosition.y}%`,
                  "--marker": place.markerColor,
                }}
                onClick={() => selectPlace(place.id)}
                aria-label={t("openMarker", { name: place.titleLabel })}
                aria-pressed={selectedPlace?.id === place.id}
                data-testid="map-marker"
                data-place-id={place.id}
                data-group-size={place.displayPosition.groupSize}
                data-real-lat={place.coordinates.lat}
                data-real-lng={place.coordinates.lng}
              >
                <span className="mura-map-marker__icon" aria-hidden="true">
                  <MapMarkerIcon category={place.category} />
                </span>
                <span className="mura-map-marker__tooltip" aria-hidden="true">
                  <strong>{place.titleLabel}</strong>
                  <span>{place.locationLabel}</span>
                  <em>{place.typeLabel}</em>
                  <small>{place.shortDescriptionLabel}</small>
                </span>
              </button>
            ))}

            {visiblePlaces.length === 0 ? <p className="mura-map-empty">{ui.noResults}</p> : null}
          </div>

          {selectedPlace ? (
            <article className="mura-map-place" key={selectedPlace.id} data-testid="selected-place">
              <figure className="mura-map-place__media">
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.imageAltLabel}
                  loading="lazy"
                  style={{ objectPosition: selectedPlace.imagePosition ?? "center" }}
                  onError={(event) => handleImageFallback(event, selectedPlace)}
                />
                <figcaption>
                  <span>{selectedPlace.imageCredit}</span>
                  {selectedPlace.sourceUrl ? (
                    <a href={selectedPlace.sourceUrl} target="_blank" rel="noreferrer">
                      {ui.source}
                    </a>
                  ) : null}
                </figcaption>
              </figure>
              <div className="mura-map-place__content">
                <div className="mura-map-place__meta">
                  <p className="mura-map-place__region">{selectedPlace.locationLabel}</p>
                  <span>{selectedPlace.typeLabel}</span>
                </div>
                <h2>{selectedPlace.titleLabel}</h2>
                <p>{selectedPlace.fullDescriptionLabel}</p>

                {selectedPlace.significanceLabel ? (
                  <section className="mura-map-place__note" data-testid="selected-place-significance">
                    <h3>{ui.significance ?? mapCopy.en.significance}</h3>
                    <p>{selectedPlace.significanceLabel}</p>
                  </section>
                ) : null}

                <MapLinkGroup title={ui.authors} items={selectedPlace.relatedAuthorItems} />
                <MapLinkGroup title={ui.works} items={selectedPlace.relatedWorkItems} />
                <MapLinkGroup title={ui.routes} items={selectedPlace.routeItems} />

                <div className="mura-map-place__actions">
                  {selectedPlace.sourceUrl ? (
                    <a href={selectedPlace.sourceUrl} target="_blank" rel="noreferrer">
                      {ui.details}
                    </a>
                  ) : null}
                  {selectedPlace.routeItems[0]?.href ? (
                    <Link to={selectedPlace.routeItems[0].href}>{ui.openRoute}</Link>
                  ) : null}
                  {selectedPlace.relatedWorkItems[0]?.href ? (
                    <Link to={selectedPlace.relatedWorkItems[0].href}>{ui.relatedWorks}</Link>
                  ) : null}
                  {selectedPlace.mapUrl ? (
                    <a href={selectedPlace.mapUrl} target="_blank" rel="noreferrer">
                      {ui.openExternal}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
        </div>

        <aside className="mura-map-sidebar">
          <section>
            <h2>{ui.filtersTitle}</h2>
            <MapSelect
              label={t("regions")}
              value={regionFilter}
              onChange={setRegionFilter}
              options={[{ value: "all", label: t("allRegions") }, ...regionOptions]}
            />
            <MapSelect
              label={t("navAuthors")}
              value={authorFilter}
              onChange={setAuthorFilter}
              options={[{ value: "all", label: t("allAuthors") }, ...authorOptions]}
            />
            <MapSelect
              label={t("placeType")}
              value={typeFilter}
              onChange={setTypeFilter}
              options={[{ value: "all", label: t("allPlaceTypes") }, ...typeOptions]}
            />
            <button type="button" onClick={resetFilters}>
              {t("resetFilters")}
            </button>
          </section>

          <section>
            <h2>{ui.featuredTitle}</h2>
            <div className="mura-map-popular">
              {featuredPlaces.length ? (
                featuredPlaces.map((place) => (
                  <button
                    type="button"
                    key={place.id}
                    className={selectedPlace?.id === place.id ? "is-selected" : ""}
                    onClick={() => selectPlace(place.id)}
                    aria-label={`${t("openMarker", { name: place.titleLabel })}: ${place.locationLabel}`}
                    aria-pressed={selectedPlace?.id === place.id}
                    data-testid="featured-place"
                    data-place-id={place.id}
                  >
                    <img
                      src={place.imageUrl}
                      alt={place.imageAltLabel}
                      loading="lazy"
                      style={{ objectPosition: place.imagePosition ?? "center" }}
                      onError={(event) => handleImageFallback(event, place)}
                    />
                    <span>
                      <strong>{place.titleLabel}</strong>
                      <small>{place.locationLabel}</small>
                      <i>{place.typeLabel}</i>
                      <em>{place.shortDescriptionLabel}</em>
                    </span>
                  </button>
                ))
              ) : (
                <p className="mura-map-sidebar__empty">{ui.noResults}</p>
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function MapLinkGroup({ title, items }) {
  if (!items?.length) return null;

  return (
    <div className="mura-map-place__links">
      <h3>{title}</h3>
      <div>
        {items.map((item) =>
          item.href ? (
            <Link key={`${title}-${item.id}`} to={item.href}>
              {item.label}
            </Link>
          ) : (
            <span key={`${title}-${item.id}`}>{item.label}</span>
          )
        )}
      </div>
    </div>
  );
}

function MapSelect({ label, value, onChange, options }) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MapMarkerIcon({ category }) {
  const icons = {
    museum: (
      <>
        <path d="M4.5 9.2 12 5l7.5 4.2" />
        <path d="M6.2 9.4h11.6" />
        <path d="M7.4 18.8h9.2" />
        <path d="M8.5 9.4v9.4" />
        <path d="M12 9.4v9.4" />
        <path d="M15.5 9.4v9.4" />
      </>
    ),
    memorial: (
      <>
        <path d="M12 3.8v16.4" />
        <path d="M7.2 8.2h9.6" />
        <path d="M8.4 20.2h7.2" />
        <path d="M6.4 14.2c2.8-1.4 5.4-1.4 7.8 0 1.1.6 2.1.8 3.4.3" />
      </>
    ),
    archive: (
      <>
        <path d="M5.2 7.8h13.6v11H5.2Z" />
        <path d="M7.1 5.2h9.8l1.9 2.6H5.2Z" />
        <path d="M9 11.2h6" />
        <path d="M9 14.4h4.8" />
      </>
    ),
    library: (
      <>
        <path d="M5.2 5.7h5.3a3 3 0 0 1 3 3v10.1H8.3a3.1 3.1 0 0 0-3.1 3Z" />
        <path d="M13.5 8.7a3 3 0 0 1 3-3h3.3v16a3.1 3.1 0 0 0-3.1-3h-3.2Z" />
        <path d="M8 9h2.8" />
        <path d="M16.2 9h2" />
      </>
    ),
    route: (
      <>
        <path d="M5.2 17.6c4.5-8.8 9.6 5.2 13.6-6.8" />
        <circle cx="5.2" cy="17.6" r="1.8" />
        <circle cx="18.8" cy="10.8" r="1.8" />
      </>
    ),
    city: (
      <>
        <path d="M5.3 19.2V8.4l4-2.3 4 2.3v10.8" />
        <path d="M13.3 19.2v-7.1l3.3-1.9 3.1 1.9v7.1" />
        <path d="M8.2 10.4h1.6" />
        <path d="M8.2 13.4h1.6" />
        <path d="M16 14h1.2" />
      </>
    ),
    spiritual: (
      <>
        <path d="M12 4.2c2.9 2 4.4 4.1 4.4 6.5a4.4 4.4 0 0 1-8.8 0C7.6 8.3 9.1 6.2 12 4.2Z" />
        <path d="M12 14.8v5" />
        <path d="M8 19.8h8" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" focusable="false">
      {icons[category] ?? icons.museum}
    </svg>
  );
}

export default WorldMap;
