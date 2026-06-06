import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import kazakhstanMap from "../assets/mura/map-kazakhstan-v2.jpg";
import { literaryWorldMarkers, mapCategoryMeta } from "../data/literaryWorldMap";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import "./WorldMap.css";

function WorldMap() {
  const { t, localizeMapCategory, localizeMapMarker } = useI18n();
  const markMapVisited = useProgressStore((state) => state.markMapVisited);
  const [regionFilter, setRegionFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("zhidebai-abai");

  useEffect(() => {
    markMapVisited();
  }, [markMapVisited]);

  const localizedPlaces = useMemo(
    () => literaryWorldMarkers.map(localizeMapMarker),
    [localizeMapMarker]
  );
  const regions = [...new Set(localizedPlaces.map((place) => place.region))];
  const authors = [...new Set(localizedPlaces.map((place) => place.author))];
  const types = [...new Set(localizedPlaces.map((place) => place.type))];

  const visiblePlaces = useMemo(
    () =>
      localizedPlaces.filter(
        (place) =>
          (regionFilter === "all" || place.region === regionFilter) &&
          (authorFilter === "all" || place.author === authorFilter) &&
          (typeFilter === "all" || place.type === typeFilter)
      ),
    [authorFilter, localizedPlaces, regionFilter, typeFilter]
  );

  const selectedPlace =
    visiblePlaces.find((place) => place.id === selectedId) ?? visiblePlaces[0] ?? localizedPlaces[0];
  const relatedWorksCount = localizedPlaces.reduce(
    (sum, place) => sum + (Number(place.relatedWorks) || 0),
    0
  );
  const relatedAuthorsCount = localizedPlaces.reduce(
    (sum, place) => sum + (Number(place.relatedAuthors) || 0),
    0
  );

  const resetFilters = () => {
    setRegionFilter("all");
    setAuthorFilter("all");
    setTypeFilter("all");
    setSelectedId("zhidebai-abai");
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
              <span>{t("mapArchiveLayer")}</span>
              <strong>{visiblePlaces.length} {t("literaryPlaces")}</strong>
            </div>
            {visiblePlaces.map((place) => {
              const meta = localizeMapCategory(place.category, mapCategoryMeta[place.category] ?? mapCategoryMeta.museum);
              return (
                <button
                  type="button"
                  key={place.id}
                  className={`mura-map-marker ${selectedPlace?.id === place.id ? "is-selected" : ""}`}
                  style={{ left: `${place.position.x}%`, top: `${place.position.y}%`, "--marker": meta.color }}
                  onClick={() => setSelectedId(place.id)}
                  aria-label={t("openMarker", { name: place.name })}
                >
                  <span className="mura-map-marker__icon" aria-hidden="true">
                    <MapMarkerIcon category={place.category} />
                  </span>
                  <span className="mura-map-marker__tooltip" aria-hidden="true">
                    <strong>{place.city}</strong>
                    <small>{place.name}</small>
                    <em>{meta.label}</em>
                  </span>
                </button>
              );
            })}
          </div>

          {selectedPlace ? (
            <article className="mura-map-place">
              <img src={selectedPlace.image} alt="" />
              <div className="mura-map-place__content">
                <p
                  className="mura-map-place__region"
                  data-label={[selectedPlace.city, selectedPlace.region, selectedPlace.type].filter(Boolean).join(" - ")}
                >
                  {selectedPlace.city} · {selectedPlace.region} · {selectedPlace.type}
                </p>
                <h2>{selectedPlace.name}</h2>
                <p>{selectedPlace.description}</p>
                <dl className="mura-map-place__facts">
                  {(selectedPlace.facts ?? [
                    { labelKey: "placeFactAddress", value: selectedPlace.city },
                    { labelKey: "placeFactStatus", value: selectedPlace.years },
                    { labelKey: "navAuthors", value: selectedPlace.author },
                  ]).map((fact) => (
                    <div key={`${fact.labelKey}-${fact.value}`}>
                      <dt>{t(fact.labelKey)}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mura-map-place__stats">
                  <span>{selectedPlace.relatedWorks} {t("works").toLowerCase()}</span>
                  <span>{selectedPlace.relatedAuthors} {t("navAuthors").toLowerCase()}</span>
                  <span>{selectedPlace.relatedRoutes} {t("landingRoutes").toLowerCase()}</span>
                </div>
                <div className="mura-map-place__actions">
                  <Link to={`/route/${selectedPlace.routeId}`}>{t("openLiteraryRoute")}</Link>
                  <a href={selectedPlace.externalUrl} target="_blank" rel="noreferrer">
                    {t("openOnMap")}
                  </a>
                  {selectedPlace.referenceUrl ? (
                    <a href={selectedPlace.referenceUrl} target="_blank" rel="noreferrer">
                      {t("placeReference")}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
        </div>

        <aside className="mura-map-sidebar">
          <section>
            <h2>{t("routeFilters")}</h2>
            <MapSelect label={t("regions")} value={regionFilter} onChange={setRegionFilter} options={[{ value: "all", label: t("allRegions") }, ...regions.map((region) => ({ value: region, label: region }))]} />
            <MapSelect label={t("navAuthors")} value={authorFilter} onChange={setAuthorFilter} options={[{ value: "all", label: t("allAuthors") }, ...authors.map((author) => ({ value: author, label: author }))]} />
            <MapSelect label={t("placeType")} value={typeFilter} onChange={setTypeFilter} options={[{ value: "all", label: t("allPlaceTypes") }, ...types.map((type) => ({ value: type, label: type }))]} />
            <button type="button" onClick={resetFilters}>{t("resetFilters")}</button>
          </section>

          <section>
            <h2>{t("popularPlaces")}</h2>
            <div className="mura-map-popular">
              {localizedPlaces.slice(0, 5).map((place) => (
                <button
                  type="button"
                  key={place.id}
                  onClick={() => setSelectedId(place.id)}
                  aria-label={`${t("openMarker", { name: place.name })}. ${t("openOnMap")}: ${place.city}`}
                >
                  <img src={place.image} alt="" />
                  <span>
                    <strong>{place.name}</strong>
                    <small>{place.region}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="mura-map-stats">
        <article><strong>{localizedPlaces.length}</strong><span>{t("literaryPlaces")}</span></article>
        <article><strong>{regions.length}</strong><span>{t("regions")}</span></article>
        <article><strong>{relatedWorksCount}</strong><span>{t("relatedWorks")}</span></article>
        <article><strong>{relatedAuthorsCount}</strong><span>{t("navAuthors")}</span></article>
        <article><strong>{new Set(localizedPlaces.map((place) => place.routeId).filter(Boolean)).size}</strong><span>{t("landingRoutes")}</span></article>
      </section>
    </main>
  );
}

function MapSelect({ label, value, onChange, options }) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>{option.label}</option>
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
        <path d="M12 4.2 14.4 9l5.3.8-3.8 3.7.9 5.3L12 16.3l-4.8 2.5.9-5.3-3.8-3.7L9.6 9Z" />
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
    route: (
      <>
        <path d="M5.2 17.6c4.5-8.8 9.6 5.2 13.6-6.8" />
        <circle cx="5.2" cy="17.6" r="1.8" />
        <circle cx="18.8" cy="10.8" r="1.8" />
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
