import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

function StaggeredMenu({
  position = "right",
  colors = ["#f0e8db", "#d8c7a8"],
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = true,
  className,
  menuButtonColor = "#163a35",
  openMenuButtonColor = "#163a35",
  accentColor = "#2b6a61",
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!plusH || !plusV || !icon || !textInner) return;

      const preLayers = Array.from(
        preLayersRef.current?.querySelectorAll(".sm-prelayer") ?? []
      );
      preLayerElsRef.current = preLayers;

      gsap.set(plusH, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(plusV, { rotate: 90, transformOrigin: "50% 50%" });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });

    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    const panelStart = 0.12;

    tl.to(
      itemEls,
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
      },
      panelStart + 0.12
    );

    if (socialTitle) {
      tl.to(socialTitle, { opacity: 1, duration: 0.4, ease: "power2.out" }, panelStart + 0.28);
    }

    if (socialLinks.length) {
      tl.to(
        socialLinks,
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.06 },
        panelStart + 0.34
      );
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (!tl) {
      busyRef.current = false;
      return;
    }
    tl.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    tl.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    busyRef.current = false;
  }, []);

  const animateIcon = useCallback((opening) => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }, []);

  const animateColor = useCallback(
    (opening) => {
      if (!toggleBtnRef.current) return;
      colorTweenRef.current?.kill();
      const targetColor = changeMenuColorOnOpen
        ? opening
          ? openMenuButtonColor
          : menuButtonColor
        : menuButtonColor;
      colorTweenRef.current = gsap.to(toggleBtnRef.current, {
        color: targetColor,
        duration: 0.28,
        ease: "power2.out",
      });
    },
    [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]
  );

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    const sequence = opening
      ? ["Menu", "Close", "Menu", "Close", "Close"]
      : ["Close", "Menu", "Close", "Menu", "Menu"];

    setTextLines(sequence);
    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((sequence.length - 1) / sequence.length) * 100;
    gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.72,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [animateColor, animateIcon, animateText, onMenuClose, onMenuOpen, playClose, playOpen]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [animateColor, animateIcon, animateText, onMenuClose, playClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return undefined;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnClickAway, closeMenu, open]);

  return (
    <div
      className={`${className ? `${className} ` : ""}staggered-menu-wrapper${
        isFixed ? " fixed-wrapper" : ""
      }`}
      style={{ "--sm-accent": accentColor }}
      data-position={position}
      data-open={open || undefined}
    >
      <button
        type="button"
        className="sm-overlay"
        aria-label="Close menu overlay"
        onClick={closeMenu}
      />

      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 2).map((color, index) => (
          <div key={index} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>

      <button
        ref={toggleBtnRef}
        className="sm-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={toggleMenu}
        type="button"
      >
        <span className="sm-toggle-textWrap" aria-hidden="true">
          <span ref={textInnerRef} className="sm-toggle-textInner">
            {textLines.map((line, index) => (
              <span className="sm-toggle-line" key={`${line}-${index}`}>
                {line}
              </span>
            ))}
          </span>
        </span>
        <span ref={iconRef} className="sm-icon" aria-hidden="true">
          <span ref={plusHRef} className="sm-icon-line" />
          <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
        </span>
      </button>

      <aside ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item, index) => (
              <li className="sm-panel-itemWrap" key={item.link}>
                <Link
                  className="sm-panel-item"
                  to={item.link}
                  aria-label={item.ariaLabel}
                  data-index={index + 1}
                  onClick={closeMenu}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {displaySocials && socialItems.length > 0 ? (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((item) => (
                  <li key={item.link} className="sm-socials-item">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export default StaggeredMenu;
