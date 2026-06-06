import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export function ScrollStackItem({ children, itemClassName = "", as = "div" }) {
  const Component = as;

  return <Component className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</Component>;
}

function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  disableBelow = 0,
  onStackComplete,
}) {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const [isDisabledByViewport, setIsDisabledByViewport] = useState(false);

  useEffect(() => {
    if (!disableBelow) {
      setIsDisabledByViewport(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${disableBelow - 1}px)`);
    const updateViewportState = () => setIsDisabledByViewport(mediaQuery.matches);

    updateViewportState();
    mediaQuery.addEventListener("change", updateViewportState);

    return () => mediaQuery.removeEventListener("change", updateViewportState);
  }, [disableBelow]);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePosition = useCallback((value, containerHeight) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }

    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    }

    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller?.scrollTop ?? 0,
      containerHeight: scroller?.clientHeight ?? window.innerHeight,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element) => {
      if (useWindowScroll) {
        let offset = 0;
        let node = element;

        while (node) {
          offset += node.offsetTop;
          node = node.offsetParent;
        }

        return offset;
      }

      return element.offsetTop;
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (isDisabledByViewport || !cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePosition(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePosition(scaleEndPosition, containerHeight);
    const endElement = scrollerRef.current?.querySelector(".scroll-stack-end");
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * index;
      const pinEnd = endElementTop - containerHeight / 2;
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;
      let blur = 0;

      if (blurAmount) {
        let topCardIndex = 0;

        for (let step = 0; step < cardsRef.current.length; step += 1) {
          const stepCardTop = getElementOffset(cardsRef.current[step]);
          const stepTriggerStart = stepCardTop - stackPositionPx - itemStackDistance * step;

          if (scrollTop >= stepTriggerStart) {
            topCardIndex = step;
          }
        }

        if (index < topCardIndex) {
          blur = Math.max(0, (topCardIndex - index) * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const nextTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };
      const previousTransform = lastTransformsRef.current.get(index);
      const hasChanged =
        !previousTransform ||
        Math.abs(previousTransform.translateY - nextTransform.translateY) > 0.1 ||
        Math.abs(previousTransform.scale - nextTransform.scale) > 0.001 ||
        Math.abs(previousTransform.rotation - nextTransform.rotation) > 0.1 ||
        Math.abs(previousTransform.blur - nextTransform.blur) > 0.1;

      if (hasChanged) {
        card.style.setProperty(
          "--scroll-stack-transform",
          `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`
        );
        card.style.filter = nextTransform.blur > 0 ? `blur(${nextTransform.blur}px)` : "";
        lastTransformsRef.current.set(index, nextTransform);
      }

      if (index === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;

        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    calculateProgress,
    getElementOffset,
    getScrollData,
    isDisabledByViewport,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePosition,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupScrollDriver = useCallback(() => {
    if (useWindowScroll) {
      const scheduleUpdate = () => {
        if (animationFrameRef.current) return;

        animationFrameRef.current = requestAnimationFrame(() => {
          animationFrameRef.current = null;
          handleScroll();
        });
      };

      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);

      return () => {
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
      };
    }

    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector(".scroll-stack-inner"),
      duration: 1.2,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientationHandler: true,
      normalizeWheel: true,
      wheelMultiplier: 1,
      touchInertiaMultiplier: 35,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertia: 0.6,
    });

    lenis.on("scroll", handleScroll);
    lenisRef.current = lenis;

    const raf = (time) => {
      lenisRef.current?.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };

    animationFrameRef.current = requestAnimationFrame(raf);

    return undefined;
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const cards = Array.from(scroller.querySelectorAll(".scroll-stack-card"));
    const transformsCache = lastTransformsRef.current;

    cardsRef.current = cards;

    if (isDisabledByViewport) {
      cards.forEach((card) => {
        card.style.marginBottom = "";
        card.style.willChange = "auto";
        card.style.transformOrigin = "";
        card.style.backfaceVisibility = "";
        card.style.removeProperty("--scroll-stack-transform");
        card.style.removeProperty("transform");
        card.style.removeProperty("-webkit-transform");
        card.style.filter = "";
        card.style.perspective = "";
        card.style.webkitPerspective = "";
      });

      return () => {
        cardsRef.current = [];
        transformsCache.clear();
      };
    }

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }

      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.setProperty("--scroll-stack-transform", "translateZ(0)");
      card.style.setProperty("transform", "var(--scroll-stack-transform, translateZ(0))", "important");
      card.style.setProperty("-webkit-transform", "var(--scroll-stack-transform, translateZ(0))", "important");
      card.style.perspective = "1000px";
      card.style.webkitPerspective = "1000px";
    });

    const cleanupScrollDriver = setupScrollDriver();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      lenisRef.current?.destroy();
      cleanupScrollDriver?.();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [isDisabledByViewport, itemDistance, setupScrollDriver, updateCardTransforms, useWindowScroll]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}

export default ScrollStack;
