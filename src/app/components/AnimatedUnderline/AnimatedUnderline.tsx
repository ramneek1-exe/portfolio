"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./AnimatedUnderline.module.css";

interface AnimatedUnderlineProps {
  text: string;
  pathD?: string;
}

const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({
  text,
  pathD = "M0.218399 54.0566C57.8851 26.0566 210.018 -21.5434 357.218 12.0566",

}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gradientRef = useRef<SVGLinearGradientElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      const gradientLoop = gsap.to(gradientRef.current, {
        attr: { gradientTransform: "translate(2,0)" },
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => gradientLoop.play(),
          onLeaveBack: () => gradientLoop.pause(),
        },
      });

      tl.to(
        gradientRef.current,
        { attr: { gradientTransform: "translate(1,0)" }, ease: "power1.inOut", duration: 1.5 },
        0
      );

      tl.fromTo(
        pathRef.current!,
        { drawSVG: "0%", autoAlpha: 0 },
        { drawSVG: "100%", autoAlpha: 1, duration: 1.5, ease: "power1.inOut" },
        0
      );


    }, containerRef);

    return () => ctx.revert();

  }, [pathD]);

  return (
    <div ref={containerRef} className={styles.container}>
      <p className={styles.text}>{text}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 25"
        className={styles.svg}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="underlineGradient"
            ref={gradientRef}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            {/* Your desired gradient colors */}
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="25%" stopColor="#0077ff" />
            <stop offset="50%" stopColor="#0077ff" />
            <stop offset="100%" stopColor="#0a0a1a" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          style={{ visibility: "hidden" }}
          className={styles.line}
          d={pathD}
          stroke="url(#underlineGradient)"
          fill="none"
        />
        {/* --- REMOVE circle element --- */}
        {/* <circle ref={ballRef} ... /> */}
      </svg>
    </div>
  );
};

export default AnimatedUnderline;