import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import literaryMapImage from "../assets/map/map.png";
import {
  literaryWorldMarkers,
  mapBounds,
  mapCategoryMeta,
} from "../data/literaryWorldMap";
import "./WorldMap.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function WorldMap() {
  const [selectedYear, setSelectedYear] = useState(mapBounds.defaultYear);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState(null);

  const visibleMarkers = useMemo(
    () => literaryWorldMarkers.filter((marker) => marker.startYear <= selectedYear),
    [selectedYear]
  );

  useEffect(() => {
    if (!selectedMarkerId) return;

    const selectedIsVisible = visibleMarkers.some(
      (marker) => marker.id === selectedMarkerId
    );

    if (!selectedIsVisible) {
      setSelectedMarkerId(null);
    }
  }, [selectedMarkerId, visibleMarkers]);

  const selectedMarker =
    visibleMarkers.find((marker) => marker.id === selectedMarkerId) ?? null;

  const handlePointerDown = (event) => {
    setDragState({
      startX: event.clientX,
      startY: event.clientY,
      initialX: pan.x,
      initialY: pan.y,
    });
  };

  const handlePointerMove = (event) => {
    if (!dragState) return;

    const nextX = dragState.initialX + (event.clientX - dragState.startX);
    const nextY = dragState.initialY + (event.clientY - dragState.startY);

    setPan({
      x: clamp(nextX, -180, 180),
      y: clamp(nextY, -120, 120),
    });
  };

  const handlePointerUp = () => {
    setDragState(null);
  };

  const changeZoom = (direction) => {
    setZoom((current) => clamp(current + direction * 0.12, 0.84, 1.6));
  };

  const closePanel = () => {
    setSelectedMarkerId(null);
  };

  const closePanelFromControl = (event) => {
    event.stopPropagation();
    closePanel();
  };

  return (
    <main className="world-map-page">
      <div className="world-map-page__container">
        <section className="world-map-shell">
          <header className="world-map-shell__top">
            <div className="world-map-shell__copy">
              <h1 className="world-map-shell__title">Literary World Map</h1>
              <p className="world-map-shell__subtitle">
                See where project books were written or published. Move the year
                slider to show entries by time.
              </p>
            </div>

            <div className="world-map-shell__legend" aria-label="Category legend">
              {Object.entries(mapCategoryMeta).map(([key, meta]) => (
                <div key={key} className="world-map-shell__legendItem">
                  <span
                    className="world-map-shell__legendDot"
                    style={{ "--legend-color": meta.color }}
                  />
                  <span>{meta.label}</span>
                </div>
              ))}
            </div>
          </header>

          <div className="world-map-layout" onClick={closePanel}>
            <section className="world-map-canvasWrap">
              <div className="world-map-canvasControls">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    changeZoom(1);
                  }}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    changeZoom(-1);
                  }}
                  aria-label="Zoom out"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  aria-label="Reset map view"
                >
                  Center
                </button>
              </div>

              <div
                className="world-map-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                role="presentation"
              >
                <div
                  className="world-map-stage"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    "--map-image": `url(${literaryMapImage})`,
                  }}
                >
                  <div className="world-map-stage__map" aria-hidden="true" />
                  <div className="world-map-stage__grid" aria-hidden="true" />

                  {literaryWorldMarkers.map((marker) => {
                    const meta = mapCategoryMeta[marker.category];
                    const isHovered = hoveredMarkerId === marker.id;
                    const isSelected = selectedMarkerId === marker.id;
                    const isVisible = marker.startYear <= selectedYear;

                    return (
                      <button
                        key={marker.id}
                        type="button"
                        className={[
                          "world-map-marker",
                          isVisible ? "is-visible" : "is-hidden",
                          isSelected ? "is-selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{
                          left: `${marker.position.x}%`,
                          top: `${marker.position.y}%`,
                          "--marker-color": meta.color,
                        }}
                        onMouseEnter={() => setHoveredMarkerId(marker.id)}
                        onMouseLeave={() => setHoveredMarkerId(null)}
                        onFocus={() => setHoveredMarkerId(marker.id)}
                        onBlur={() => setHoveredMarkerId(null)}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (isVisible) setSelectedMarkerId(marker.id);
                        }}
                        disabled={!isVisible}
                        aria-label={`Open ${marker.name}`}
                      >
                        <span className="world-map-marker__book" aria-hidden="true">
                          <span />
                        </span>
                        <span className="world-map-marker__pin" aria-hidden="true" />
                        {isVisible && (isHovered || isSelected) && (
                          <span className="world-map-marker__tooltip">
                            <strong>{marker.name}</strong>
                            <span>{marker.years}</span>
                            <span>{marker.author}</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="world-map-timeline" onClick={(event) => event.stopPropagation()}>
                <div className="world-map-timeline__labels">
                  <span>{mapBounds.minYear}</span>
                  <strong key={selectedYear}>{selectedYear}</strong>
                  <span>{mapBounds.maxYear}</span>
                </div>
                <input
                  className="world-map-timeline__input"
                  type="range"
                  min={mapBounds.minYear}
                  max={mapBounds.maxYear}
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                  aria-label="Literary timeline"
                />
              </div>
            </section>

            {selectedMarker && (
              <aside
                className="world-map-panel"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="world-map-panel__close"
                  onClick={closePanelFromControl}
                  aria-label="Close book panel"
                >
                  x
                </button>
                <div
                  className="world-map-panel__portrait"
                  style={{ backgroundImage: `url(${selectedMarker.image})` }}
                />
                <div className="world-map-panel__body">
                  <p className="world-map-panel__eyebrow">
                    {selectedMarker.country} | {selectedMarker.sourceLabel}
                  </p>
                  <h2 className="world-map-panel__title">{selectedMarker.name}</h2>
                  <p className="world-map-panel__author">{selectedMarker.author}</p>
                  <p className="world-map-panel__bio">{selectedMarker.description}</p>
                  <p className="world-map-panel__bio">{selectedMarker.context}</p>

                  <div className="world-map-panel__meta">
                    <span>{mapCategoryMeta[selectedMarker.category].label}</span>
                    <span>{selectedMarker.city}</span>
                  </div>

                  <div className="world-map-panel__works">
                    <p className="world-map-panel__worksLabel">Book info</p>
                    <ul>
                      <li>{selectedMarker.originNote}</li>
                      <li>{selectedMarker.themes.join(", ")}</li>
                    </ul>
                  </div>

                  <Link
                    to={`/reading/${selectedMarker.workId}`}
                    className="world-map-panel__action"
                  >
                    Open book
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default WorldMap;
