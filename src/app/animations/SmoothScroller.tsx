"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // 1. SAFETY: Kill any existing ScrollSmoother instances to prevent duplicates
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.kill();
    }

    // 2. Create a fresh instance
    ScrollSmoother.create({
      smooth: 1.5, // Adjust your smoothness
      effects: true,
      normalizeScroll: false, // Helps with touch devices/jitter
      ignoreMobileResize: true,
    });
    return () => {
      // 3. Cleanup on unmount
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