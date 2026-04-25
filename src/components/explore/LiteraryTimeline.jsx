import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  literaryTimelineEntries,
  timelineBounds,
} from "../../data/literaryTimeline";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function LiteraryTimeline() {
  const scrollerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const yearAnimationFrameRef = useRef(null);
  const displayYearRef = useRef(timelineBounds.defaultYear);
  const orderedEntries = useMemo(
    () =>
      [...literaryTimelineEntries].sort((left, right) => {
        if (left.year !== right.year) return left.year - right.year;
        return left.title.localeCompare(right.title);
      }),
    []
  );
  const [timelineYear, setTimelineYear] = useState(timelineBounds.defaultYear);
  const [displayYear, setDisplayYear] = useState(timelineBounds.defaultYear);
  const [selectedId, setSelectedId] = useState(
    orderedEntries.find((entry) => entry.year <= timelineBounds.defaultYear)?.id ??
      orderedEntries[0]?.id
  );

  const visibleEntries = useMemo(
    () => orderedEntries.filter((entry) => entry.year <= timelineYear),
    [orderedEntries, timelineYear]
  );

  const selectedEntry =
    visibleEntries.find((entry) => entry.id === selectedId) ??
    orderedEntries.find((entry) => entry.id === selectedId) ??
    visibleEntries[visibleEntries.length - 1] ??
    orderedEntries[0];

  useEffect(() => {
    if (
      !visibleEntries.some((entry) => entry.id === selectedId) &&
      visibleEntries.length
    ) {
      setSelectedId(visibleEntries[visibleEntries.length - 1].id);
    }
  }, [selectedId, visibleEntries]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (yearAnimationFrameRef.current) {
        cancelAnimationFrame(yearAnimationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    displayYearRef.current = displayYear;
  }, [displayYear]);

  useEffect(() => {
    if (yearAnimationFrameRef.current) {
      cancelAnimationFrame(yearAnimationFrameRef.current);
    }

    const startYear = displayYearRef.current;
    const targetYear = timelineYear;
    const distance = targetYear - startYear;

    if (distance === 0) return undefined;

    const duration = 460;
    const startTime = performance.now();

    const tick = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = easeOutCubic(progress);
      const nextYear = Math.round(startYear + distance * eased);

      setDisplayYear(nextYear);

      if (progress < 1) {
        yearAnimationFrameRef.current = requestAnimationFrame(tick);
      } else {
        yearAnimationFrameRef.current = null;
        setDisplayYear(targetYear);
      }
    };

    yearAnimationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (yearAnimationFrameRef.current) {
        cancelAnimationFrame(yearAnimationFrameRef.current);
      }
    };
  }, [timelineYear]);

  const animateScroller = (targetLeft) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startLeft = scroller.scrollLeft;
    const maxLeft = scroller.scrollWidth - scroller.clientWidth;
    const nextLeft = clamp(targetLeft, 0, Math.max(0, maxLeft));
    const distance = nextLeft - startLeft;
    const duration = 540;
    const startTime = performance.now();

    const tick = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = easeOutCubic(progress);

      scroller.scrollLeft = startLeft + distance * eased;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const centerEntry = (entryId) => {
    const scroller = scrollerRef.current;
    if (!scroller || !entryId) return;

    const element = scroller.querySelector(`[data-entry-id="${entryId}"]`);
    if (!element) return;

    const targetLeft =
      element.offsetLeft - scroller.clientWidth / 2 + element.clientWidth / 2;

    animateScroller(targetLeft);
  };

  useEffect(() => {
    if (!selectedEntry?.id) return;

    const timeoutId = window.setTimeout(() => {
      centerEntry(selectedEntry.id);
    }, 40);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [selectedEntry?.id]);

  const handleYearChange = (event) => {
    setTimelineYear(Number(event.target.value));
  };

  const moveSelection = (direction) => {
    const currentIndex = orderedEntries.findIndex((entry) => entry.id === selectedId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = clamp(safeIndex + direction, 0, orderedEntries.length - 1);
    const nextEntry = orderedEntries[nextIndex];

    if (!nextEntry) return;

    setSelectedId(nextEntry.id);
    setTimelineYear((currentYear) => {
      if (direction > 0) {
        return Math.max(currentYear, nextEntry.year);
      }

      return nextEntry.year;
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

        <div key={selectedEntry?.id} className="explore-timeline__panel">
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
          onClick={() => moveSelection(-1)}
          aria-label="Scroll timeline left"
        >
          ←
        </button>

        <div className="explore-timeline__yearControl">
          <div className="explore-timeline__yearLabels">
            <span>{timelineBounds.min}</span>
            <strong key={displayYear}>{displayYear}</strong>
            <span>{timelineBounds.max}</span>
          </div>
          <input
            className="explore-timeline__range"
            type="range"
            min={timelineBounds.min}
            max={timelineBounds.max}
            value={displayYear}
            onChange={handleYearChange}
            aria-label="Literary history timeline"
          />
        </div>

        <button
          type="button"
          className="explore-timeline__nav"
          onClick={() => moveSelection(1)}
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
                data-entry-id={entry.id}
                className={`explore-timeline__node ${
                  isUpper ? "is-upper" : "is-lower"
                } ${isSelected ? "is-selected" : ""}`}
                style={{ "--entry-delay": `${Math.min(index * 70, 420)}ms` }}
              >
                <div
                  className="explore-timeline__card"
                  onClick={() => setSelectedId(entry.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(entry.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
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
                    <Link
                      to={entry.href}
                      className="explore-timeline__cardAction"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {entry.ctaLabel}
                    </Link>
                  </div>
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
