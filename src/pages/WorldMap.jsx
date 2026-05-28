import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import kazakhstanMap from "../assets/mura/map-kazakhstan-v2.png";
import { literaryWorldMarkers, mapCategoryMeta } from "../data/literaryWorldMap";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import "./WorldMap.css";

function WorldMap() {
  const { t } = useI18n();
  const markMapVisited = useProgressStore((state) => state.markMapVisited);
  const [regionFilter, setRegionFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("zhidebai-abai");

  useEffect(() => {
    markMapVisited();
  }, [markMapVisited]);

  const regions = [...new Set(literaryWorldMarkers.map((place) => place.region))];
  const authors = [...new Set(literaryWorldMarkers.map((place) => place.author))];
  const types = [...new Set(literaryWorldMarkers.map((place) => place.type))];

  const visiblePlaces = useMemo(
    () =>
      literaryWorldMarkers.filter(
        (place) =>
          (regionFilter === "all" || place.region === regionFilter) &&
          (authorFilter === "all" || place.author === authorFilter) &&
          (typeFilter === "all" || place.type === typeFilter)
      ),
    [authorFilter, regionFilter, typeFilter]
  );

  const selectedPlace =
    visiblePlaces.find((place) => place.id === selectedId) ?? visiblePlaces[0] ?? literaryWorldMarkers[0];

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
              <button type="button">+</button>
              <button type="button">-</button>
              <button type="button">{t("center")}</button>
            </div>
            {visiblePlaces.map((place) => {
              const meta = mapCategoryMeta[place.category] ?? mapCategoryMeta.museum;
              return (
                <button
                  type="button"
                  key={place.id}
                  className={`mura-map-marker ${selectedPlace?.id === place.id ? "is-selected" : ""}`}
                  style={{ left: `${place.position.x}%`, top: `${place.position.y}%`, "--marker": meta.color }}
                  onClick={() => setSelectedId(place.id)}
                  aria-label={t("openMarker", { name: place.name })}
                >
                  <span aria-hidden="true" />
                  <strong>{place.city}</strong>
                  <small>{place.name}</small>
                </button>
              );
            })}
          </div>

          {selectedPlace ? (
            <article className="mura-map-place">
              <img src={selectedPlace.image} alt="" />
              <div className="mura-map-place__content">
                <p className="mura-map-place__region">
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
              {literaryWorldMarkers.slice(0, 5).map((place) => (
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
        <article><strong>{literaryWorldMarkers.length * 6}+</strong><span>{t("literaryPlaces")}</span></article>
        <article><strong>{regions.length}+</strong><span>{t("regions")}</span></article>
        <article><strong>100+</strong><span>{t("relatedWorks")}</span></article>
        <article><strong>30+</strong><span>{t("navAuthors")}</span></article>
        <article><strong>5</strong><span>{t("landingRoutes")}</span></article>
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

export default WorldMap;
