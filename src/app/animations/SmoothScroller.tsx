"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.kill();
    }

    ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
      normalizeScroll: false,
      ignoreMobileResize: true,
    });
    return () => {
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.kill();
      }
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}