function MuraIcon({ children, className = "", title }) {
  return (
    <svg
      className={`mura-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function MuraBookmarkIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M7.5 4.75h9v14.5L12 16.4l-4.5 2.85V4.75Z" />
    </MuraIcon>
  );
}

export function MuraCollectionIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M6.5 6.25h9.25v12H6.5z" />
      <path d="M9.25 3.75h8.25v12" />
    </MuraIcon>
  );
}

export function MuraShareIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M8.75 12.35 15.2 8.7M8.75 12.35l6.45 3.55" />
      <circle cx="6.9" cy="12.35" r="1.9" />
      <circle cx="16.9" cy="7.75" r="1.9" />
      <circle cx="16.9" cy="16.25" r="1.9" />
    </MuraIcon>
  );
}

export function MuraSettingsIcon(props) {
  return (
    <MuraIcon {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4.75v2.1M12 17.15v2.1M6.88 6.88l1.48 1.48M15.64 15.64l1.48 1.48M4.75 12h2.1M17.15 12h2.1M6.88 17.12l1.48-1.48M15.64 8.36l1.48-1.48" />
    </MuraIcon>
  );
}

export function MuraArrowIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M6 12h11.5" />
      <path d="m13.5 7.8 4.2 4.2-4.2 4.2" />
    </MuraIcon>
  );
}

export default MuraIcon;
