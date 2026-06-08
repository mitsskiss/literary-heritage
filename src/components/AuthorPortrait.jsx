import { useEffect, useRef, useState } from "react";

function localizeText(value, language) {
  if (!value || typeof value !== "object") return value;
  return value[language] ?? value.en ?? value.ru ?? value.kk ?? "";
}

function getInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AuthorPortrait({
  author,
  displayName,
  language = "en",
  className = "",
  loading = "lazy",
  showCredit = false,
}) {
  const name = displayName ?? author?.name ?? "";
  const primarySrc = author?.portrait || author?.image || author?.fallbackPortrait || "";
  const fallbackSrc = author?.fallbackPortrait || "";
  const [currentSrc, setCurrentSrc] = useState(primarySrc || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef(null);
  const alt = localizeText(author?.portraitAlt, language) || name;
  const source = author?.portraitSource;

  useEffect(() => {
    setCurrentSrc(primarySrc || fallbackSrc);
    setIsLoaded(false);
  }, [fallbackSrc, primarySrc]);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoaded(false);
      return;
    }
    setIsLoaded(true);
  };

  return (
    <>
      {currentSrc ? (
        <img
          ref={imageRef}
          src={currentSrc}
          alt={alt}
          className={`author-portrait-image ${isLoaded ? "is-loaded" : ""} ${className}`}
          style={author?.portraitPosition ? { objectPosition: author.portraitPosition } : undefined}
          loading={loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          data-author-portrait={author?.canonicalName ?? author?.name ?? name}
          data-portrait-source={source ?? ""}
        />
      ) : (
        <span className={`author-portrait-fallback ${className}`} aria-label={alt}>
          {getInitials(name)}
        </span>
      )}

      {showCredit && author?.portraitCredit ? (
        <p className="author-profile-portrait-credit">
          <span>Image:</span>{" "}
          {source && source.startsWith("http") ? (
            <a href={source} target="_blank" rel="noreferrer">
              {author.portraitCredit}
            </a>
          ) : (
            author.portraitCredit
          )}
        </p>
      ) : null}
    </>
  );
}

export default AuthorPortrait;
