'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from './Bento_Header.module.css';

gsap.registerPlugin(ScrollTrigger);

const Bento_Header = () => {
  const firstTextRef = useRef<HTMLDivElement>(null);
  const secondTextRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 1. Manually hint the browser about incoming heavy filters
    if (firstTextRef.current) firstTextRef.current.style.willChange = "opacity, filter, transform";
    if (secondTextRef.current) secondTextRef.current.style.willChange = "opacity, filter, transform";

    const ctx = gsap.context(() => {
      // 2. Initial State with Blur
      if (firstTextRef.current) {
        gsap.set(firstTextRef.current, {
          opacity: 0,
          filter: "blur(2px)",
          y: 20,
          force3D: true,
        });
      }

      if (secondTextRef.current) {
        gsap.set(secondTextRef.current, {
          opacity: 0,
          filter: "blur(2px)",
          y: 20,
          force3D: true,
        });
      }

      // 3. Animate (Blur 2px -> 0.3px)
      if (firstTextRef.current) {
        gsap.to(firstTextRef.current, {
          opacity: 1,
          filter: "blur(0.3px)", // Keeping your requested blur
          y: 0,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: firstTextRef.current,
            start: "top bottom-=20%",
            end: "top top+=10%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          }
        });
      }

      if (secondTextRef.current) {
        gsap.to(secondTextRef.current, {
          opacity: 1,
          filter: "blur(0px)", // Fade to clear
          y: 0,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: secondTextRef.current,
            start: "top bottom-=20%",
            end: "50vh top+=50%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          }
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.bentoHeader}>
      <div ref={firstTextRef} className={styles.thingsIWork}>Things I work with...</div>
      <div ref={secondTextRef} className={styles.toMakeMagic}>to make magic happen!</div>
    </div>
  )
}

export default Bento_Header;