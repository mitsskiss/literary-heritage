import { NavLink } from "react-router-dom";
import PillNav from "./PillNav";
import StaggeredMenu from "./StaggeredMenu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Authors", href: "/authors" },
  { label: "Explore", href: "/explore" },
  { label: "Progress", href: "/progress" },
];

const mobileItems = navItems.map((item) => ({
  label: item.label,
  ariaLabel: `Go to ${item.label.toLowerCase()} page`,
  link: item.href,
}));

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__container">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__brand-mark" aria-hidden="true">
            LH
          </span>
          <span className="site-header__brand-copy">
            <span className="site-header__brand-title">Literary Heritage</span>
            <span className="site-header__brand-subtitle">
              Interactive Literary Platform
            </span>
          </span>
        </NavLink>

        <div className="site-header__desktop-nav">
          <PillNav
            items={navItems}
            baseColor="#163a35"
            pillColor="#f7f1e8"
            hoveredPillTextColor="#f7f1e8"
            pillTextColor="#163a35"
          />
        </div>

        <div className="site-header__mobile-nav">
          <StaggeredMenu
            position="right"
            items={mobileItems}
            socialItems={[]}
            displaySocials={false}
            displayItemNumbering
            menuButtonColor="#163a35"
            openMenuButtonColor="#163a35"
            changeMenuColorOnOpen
            colors={["#efe2cc", "#dcc7a0"]}
            accentColor="#2b6a61"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
