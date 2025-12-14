'use client';

import React, { useRef, useLayoutEffect, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollVelocityText.module.css';

// We ONLY need ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- Helper Hook (Unchanged from original) ---
function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [ref]);

  return width;
}

// --- Prop Interfaces (Cleaned up) ---
interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string; // This is for the <span>
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string; // This is for the <span>
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

// --- GSAP-Powered VelocityText Component (Replicates Framer Logic) ---
function VelocityText({
  children,
  baseVelocity = 100,
  className = '', 
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller', 
  parallaxStyle,
  scrollerStyle,
}: VelocityTextProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  // 1. Get the width of a SINGLE span (like 'copyRef' in original)
  const spanRef = useRef<HTMLSpanElement>(null);
  const spanWidth = useElementWidth(spanRef);

  // 2. Refs to store our animation state (like 'baseX' and 'directionFactor')
  const xPos = useRef(0);
  const direction = useRef(1); // Start at 1, like Framer
  const velocityFactor = useRef(0); // This will be updated by ScrollTrigger

  useLayoutEffect(() => {
    if (!scrollerRef.current || spanWidth === 0) return;

    // 3. Create the GSAP wrap function (like original)
    //    We wrap from -spanWidth to 0, just like the Framer example
    const wrap = gsap.utils.wrap(-spanWidth, 0);

    // 4. Create a performant 'quickSetter' to set the 'x' property
    const xSetter = gsap.quickSetter(scrollerRef.current, "x", "px");

    // 5. Create a ScrollTrigger to get smoothed velocity (replaces useVelocity)
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      // onUpdate is the correct callback
      onUpdate: (self) => {
        // self.getVelocity() is GSAP's smoothed velocity
        const v = self.getVelocity(); 
        
        // --- THIS IS THE KEY ---
        // We must replicate the Framer 'useTransform' logic.
        // It maps a *signed* velocity.
        // If v = 1000, mappedV = 5. If v = -1000, mappedV = -5.
        const mappedV = gsap.utils.mapRange(
          velocityMapping.input[0], // 0
          velocityMapping.input[1], // 1000
          velocityMapping.output[0], // 0
          velocityMapping.output[1], // 5
          v // The raw, signed velocity
        );
        velocityFactor.current = mappedV;
        
        // Update direction based on scroll (like Framer)
        if (v < 0) {
          direction.current = -1;
        } else if (v > 0) {
          direction.current = 1;
        }
      },
    });

    // 6. Create the animation loop (replaces useAnimationFrame)
    const onTick = (time: number, deltaTime: number) => {
      // 7. Calculate 'moveBy' (same as Framer logic)
      const deltaSeconds = deltaTime / 1000;
      let moveBy = direction.current * baseVelocity * deltaSeconds;
      moveBy += direction.current * moveBy * velocityFactor.current;
      
      // 8. Update our x-position ref
      xPos.current += moveBy;

      // 9. Wrap the position (same as Framer logic)
      const wrappedX = wrap(xPos.current);

      // 10. Set the position with the performant quickSetter
      xSetter(wrappedX);
    };

    gsap.ticker.add(onTick);

    // Cleanup
    return () => {
      trigger.kill();
      gsap.ticker.remove(onTick);
    };
  }, [baseVelocity, velocityMapping, spanWidth]); // Re-run if spanWidth changes

  // Create the spans (only one set, NOT duplicated)
  const spans: ReactNode[] = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={className} key={i} ref={i === 0 ? spanRef : null}>
        {children}
      </span>
    );
  }

  // --- Layout (Matches Framer: one div with spans) ---
  return (
    <div className={parallaxClassName} style={parallaxStyle}>
      <div
        // 1. We apply the module's .scroller style (for flex)
        // 2. We apply the user's scrollerClassName prop
        className={`${styles.scroller} ${scrollerClassName}`} 
        style={scrollerStyle}
        ref={scrollerRef}
      >
        {spans}
      </div>
    </div>
  );
}

// --- Main Component (Unchanged) ---
export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 100,
  className = '', 
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  parallaxStyle,
  scrollerStyle
}) => {
  return (
    <section>
      {texts.map((text: string, index: number) => (
        <VelocityText
          key={index}
          className={className} 
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName} 
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;