import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  literaryTimelineEntries,
  timelineBounds,
} from "../../data/literaryTimeline";

function LiteraryTimeline() {
  const scrollerRef = useRef(null);
  const [timelineYear, setTimelineYear] = useState(timelineBounds.defaultYear);
  const [selectedId, setSelectedId] = useState(
    literaryTimelineEntries.find(
      (entry) => entry.year <= timelineBounds.defaultYear
    )?.id ?? literaryTimelineEntries[0]?.id
  );

  const visibleEntries = useMemo(
    () =>
      literaryTimelineEntries.filter((entry) => entry.year <= timelineYear),
    [timelineYear]
  );

  const selectedEntry =
    visibleEntries.find((entry) => entry.id === selectedId) ??
    literaryTimelineEntries.find((entry) => entry.id === selectedId) ??
    visibleEntries[visibleEntries.length - 1] ??
    literaryTimelineEntries[0];

  useEffect(() => {
    if (!visibleEntries.some((entry) => entry.id === selectedId) && visibleEntries.length) {
      setSelectedId(visibleEntries[visibleEntries.length - 1].id);
    }
  }, [selectedId, visibleEntries]);

  const handleYearChange = (event) => {
    setTimelineYear(Number(event.target.value));
  };

  const scrollTimeline = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.72, 420),
      behavior: "smooth",
    });
  };

  return (
    <section className="explore-timeline">
      <div className="explore-timeline__top">
        <div className="explore-timeline__copy">
          <p className="explore-timeline__eyebrow">Storytelling Literary Timeline</p>
          <h2 className="explore-timeline__title">
            Move through literary history like a guided product journey.
          </h2>
          <p className="explore-timeline__subtitle">
            Books, authors, and literary movements appear as a curated route
            rather than a static archive. Slide across time and open the works
            that matter at each moment.
          </p>
        </div>

        <div className="explore-timeline__panel">
          <p className="explore-timeline__panelLabel">Focused entry</p>
          <h3 className="explore-timeline__panelTitle">
            {selectedEntry?.detailsTitle}
          </h3>
          <p className="explore-timeline__panelText">
            {selectedEntry?.detailsText}
          </p>

          <div className="explore-timeline__panelMeta">
            {selectedEntry?.related?.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <Link
            to={selectedEntry?.href ?? "/explore"}
            className="explore-timeline__panelAction"
          >
            {selectedEntry?.ctaLabel ?? "Explore"}
          </Link>
        </div>
      </div>

      <div className="explore-timeline__controls">
        <button
          type="button"
          className="explore-timeline__nav"
          onClick={() => scrollTimeline(-1)}
          aria-label="Scroll timeline left"
        >
          ←
        </button>

        <div className="explore-timeline__yearControl">
          <div className="explore-timeline__yearLabels">
            <span>{timelineBounds.min}</span>
            <strong>{timelineYear}</strong>
            <span>{timelineBounds.max}</span>
          </div>
          <input
            className="explore-timeline__range"
            type="range"
            min={timelineBounds.min}
            max={timelineBounds.max}
            value={timelineYear}
            onChange={handleYearChange}
            aria-label="Literary history timeline"
          />
        </div>

        <button
          type="button"
          className="explore-timeline__nav"
          onClick={() => scrollTimeline(1)}
          aria-label="Scroll timeline right"
        >
          →
        </button>
      </div>

      <div className="explore-timeline__viewport" ref={scrollerRef}>
        <div className="explore-timeline__track">
          <div className="explore-timeline__line" aria-hidden="true" />

          {visibleEntries.map((entry, index) => {
            const isUpper = index % 2 === 0;
            const isSelected = selectedEntry?.id === entry.id;

            return (
              <article
                key={entry.id}
                className={`explore-timeline__node ${
                  isUpper ? "is-upper" : "is-lower"
                } ${isSelected ? "is-selected" : ""}`}
              >
                <button
                  type="button"
                  className="explore-timeline__card"
                  onClick={() => setSelectedId(entry.id)}
                >
                  <div
                    className="explore-timeline__cardVisual"
                    style={{ backgroundImage: `url(${entry.image})` }}
                  >
                    <div className="explore-timeline__cardShade" />
                    <span className="explore-timeline__type">{entry.type}</span>
                  </div>

                  <div className="explore-timeline__cardBody">
                    <p className="explore-timeline__cardYear">{entry.year}</p>
                    <h3 className="explore-timeline__cardTitle">{entry.title}</h3>
                    <p className="explore-timeline__cardText">{entry.description}</p>
                    <span className="explore-timeline__cardAction">
                      {entry.ctaLabel}
                    </span>
                  </div>
                </button>

                <div className="explore-timeline__pin" aria-hidden="true">
                  <span />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LiteraryTimeline;
