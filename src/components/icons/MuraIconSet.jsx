function MuraIcon({ children, className = "", title }) {
  return (
    <svg
      className={`mura-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
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

export function MuraPencilIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="m5 18.8 3.45-.7 9.4-9.4a2.05 2.05 0 0 0-2.9-2.9l-9.4 9.4L5 18.8Z" />
      <path d="m13.55 7.2 3.25 3.25" />
    </MuraIcon>
  );
}

export function MuraNoteIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M6.25 5.25h11.5v10.5H9l-2.75 3v-13.5Z" />
      <path d="M9.1 9.1h5.8M9.1 12.25h3.6" />
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

export function MuraBackIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M18 12H6.5" />
      <path d="m10.5 7.8-4.2 4.2 4.2 4.2" />
    </MuraIcon>
  );
}

export function MuraBookOpenIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M4.75 5.75h5.2c1.15 0 2.05.9 2.05 2.05v10.45c0-1.15-.9-2.05-2.05-2.05h-5.2V5.75Z" />
      <path d="M19.25 5.75h-5.2c-1.15 0-2.05.9-2.05 2.05v10.45c0-1.15.9-2.05 2.05-2.05h5.2V5.75Z" />
    </MuraIcon>
  );
}

export function MuraClockIcon(props) {
  return (
    <MuraIcon {...props}>
      <circle cx="12" cy="12" r="7.25" />
      <path d="M12 8.25v4.2l2.7 1.65" />
    </MuraIcon>
  );
}

export function MuraGlobeIcon(props) {
  return (
    <MuraIcon {...props}>
      <circle cx="12" cy="12" r="7.25" />
      <path d="M4.9 12h14.2M12 4.75c2.05 2.05 3.05 4.45 3.05 7.25S14.05 17.2 12 19.25M12 4.75C9.95 6.8 8.95 9.2 8.95 12s1 5.2 3.05 7.25" />
    </MuraIcon>
  );
}

export function MuraLayersIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="m12 4.75 7.25 3.95L12 12.65 4.75 8.7 12 4.75Z" />
      <path d="m6.2 12 5.8 3.15L17.8 12" />
      <path d="m6.2 15.35 5.8 3.15 5.8-3.15" />
    </MuraIcon>
  );
}

export function MuraLockIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M7.25 10.6h9.5v7.65h-9.5v-7.65Z" />
      <path d="M9.2 10.6V8.55a2.8 2.8 0 0 1 5.6 0v2.05" />
    </MuraIcon>
  );
}

export function MuraCheckIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="m5.75 12.5 4 4 8.5-9" />
    </MuraIcon>
  );
}

export function MuraQuoteIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M8.8 8.1c-1.55 1.1-2.35 2.45-2.35 4.05 0 1.25.78 2.1 1.95 2.1.98 0 1.75-.7 1.75-1.68 0-.82-.52-1.48-1.32-1.62.15-.8.6-1.45 1.35-1.98L8.8 8.1Z" />
      <path d="M16.2 8.1c-1.55 1.1-2.35 2.45-2.35 4.05 0 1.25.78 2.1 1.95 2.1.98 0 1.75-.7 1.75-1.68 0-.82-.52-1.48-1.32-1.62.15-.8.6-1.45 1.35-1.98L16.2 8.1Z" />
    </MuraIcon>
  );
}

export function MuraTargetIcon(props) {
  return (
    <MuraIcon {...props}>
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="12" cy="12" r="3.55" />
      <path d="M12 4.75v2M12 17.25v2M4.75 12h2M17.25 12h2" />
    </MuraIcon>
  );
}

export function MuraCalendarIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M6.25 5.75h11.5v12.5H6.25z" />
      <path d="M8.6 3.9v3M15.4 3.9v3M6.25 9.15h11.5" />
      <path d="M9.1 12.15h2.1M13.8 12.15h1.1M9.1 15h1.1M13.8 15h1.1" />
    </MuraIcon>
  );
}

export function MuraMapPinIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M18.2 10.2c0 4.55-6.2 9.05-6.2 9.05s-6.2-4.5-6.2-9.05a6.2 6.2 0 0 1 12.4 0Z" />
      <circle cx="12" cy="10.2" r="2.05" />
    </MuraIcon>
  );
}

export function MuraFeatherIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M19.1 4.9c-5.35.42-9.6 2.6-12.75 6.55-1.55 1.95-1.82 4.05-.78 6.3 2.22.45 4.3-.05 6.25-1.5 3.95-2.95 6.33-6.9 7.13-11.85" />
      <path d="M6.35 17.75c2.95-3.2 6.05-5.52 9.3-6.95" />
    </MuraIcon>
  );
}

export function MuraSparkIcon(props) {
  return (
    <MuraIcon {...props}>
      <path d="M12 3.85 14.05 9 19.2 12l-5.15 3L12 20.15 9.95 15 4.8 12l5.15-3L12 3.85Z" />
      <path d="M18.7 4.95v2.4M17.5 6.15h2.4M5.3 17.05v2.05M4.25 18.08h2.1" />
    </MuraIcon>
  );
}

export default MuraIcon;
