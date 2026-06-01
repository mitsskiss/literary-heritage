import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import "./PillNav.css";

function PillNav({
  items = [],
  className = "",
  baseColor = "#163a35",
  pillColor = "#f7f1e8",
  hoveredPillTextColor = "#f7f1e8",
  pillTextColor = "#163a35",
}) {
  const { t } = useI18n();
  return (
    <div
      className={`pill-nav-container ${className}`.trim()}
      style={{
        "--base": baseColor,
        "--pill-bg": pillColor,
        "--hover-text": hoveredPillTextColor,
        "--pill-text": pillTextColor,
      }}
    >
      <nav className="pill-nav" aria-label={t("desktopNavigation")}>
        <div className="pill-nav-items">
          <ul className="pill-list">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => `pill ${isActive ? "is-active" : ""}`}
                >
                  <span className="hover-circle" />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default PillNav;
