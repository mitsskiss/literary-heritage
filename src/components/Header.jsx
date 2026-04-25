import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import PillNav from "./PillNav";
import StaggeredMenu from "./StaggeredMenu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Map", href: "/map" },
  { label: "Authors", href: "/authors" },
  { label: "Progress", href: "/progress" },
];

const mobileItems = navItems.map((item) => ({
  label: item.label,
  ariaLabel: `Go to ${item.label.toLowerCase()} page`,
  link: item.href,
}));

function Header() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;

      if (currentScrollY <= 16) {
        setIsHeaderHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 10 && currentScrollY > 120) {
        setIsHeaderHidden(true);
      } else if (delta < -8) {
        setIsHeaderHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header ${isHeaderHidden ? "is-hidden" : ""}`}>
      <div className="site-header__scrollline" aria-hidden="true" />
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
