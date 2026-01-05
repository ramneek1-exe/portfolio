'use client';

import React, { useRef, useLayoutEffect, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollVelocityText.module.css';

gsap.registerPlugin(ScrollTrigger);

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

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string;
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
  className?: string;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

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
  
  const spanRef = useRef<HTMLSpanElement>(null);
  const spanWidth = useElementWidth(spanRef);

  const xPos = useRef(0);
  const direction = useRef(1);
  const velocityFactor = useRef(0);

  useLayoutEffect(() => {
    if (!scrollerRef.current || spanWidth === 0) return;

    const wrap = gsap.utils.wrap(-spanWidth, 0);

    const xSetter = gsap.quickSetter(scrollerRef.current, "x", "px");

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const v = self.getVelocity(); 
        
        const mappedV = gsap.utils.mapRange(
          velocityMapping.input[0],
          velocityMapping.input[1],
          velocityMapping.output[0],
          velocityMapping.output[1],
          v
        );
        velocityFactor.current = mappedV;
        
        if (v < 0) {
          direction.current = -1;
        } else if (v > 0) {
          direction.current = 1;
        }
      },
    });

    const onTick = (time: number, deltaTime: number) => {
      const deltaSeconds = deltaTime / 1000;
      let moveBy = direction.current * baseVelocity * deltaSeconds;
      moveBy += direction.current * moveBy * velocityFactor.current;
      
      xPos.current += moveBy;

      const wrappedX = wrap(xPos.current);

      xSetter(wrappedX);
    };

    gsap.ticker.add(onTick);

    return () => {
      trigger.kill();
      gsap.ticker.remove(onTick);
    };
  }, [baseVelocity, velocityMapping, spanWidth]);

  const spans: ReactNode[] = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={className} key={i} ref={i === 0 ? spanRef : null}>
        {children}
      </span>
    );
  }

  return (
    <div className={parallaxClassName} style={parallaxStyle}>
      <div
        className={`${styles.scroller} ${scrollerClassName}`} 
        style={scrollerStyle}
        ref={scrollerRef}
      >
        {spans}
      </div>
    </div>
  );
}

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