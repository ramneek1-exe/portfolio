"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./AnimatedUnderline.module.css"; // Import CSS Module

interface AnimatedUnderlineProps {
  text: string;
  pathD?: string; // Optional prop for custom path
}

const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({
  text,
  pathD = "M0.218399 54.0566C57.8851 26.0566 210.018 -21.5434 357.218 12.0566", // Curve path

}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // --- REMOVE ballRef ---
  // const ballRef = useRef<SVGCircleElement | null>(null);
  const gradientRef = useRef<SVGLinearGradientElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // --- NEW: Separate looping animation for the gradient ---
      const gradientLoop = gsap.to(gradientRef.current, {
        attr: { gradientTransform: "translate(2,0)" }, // Move further for loop
        duration: 3, // Speed of the loop
        ease: "sine.inOut",
        repeat: -1, // Loop infinitely
        yoyo: true, // Go back and forth
        paused: true, // Start paused
      });
      // --- END NEW ---

      // Timeline for the initial draw-in animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          // --- NEW: Control the gradient loop ---
          onEnter: () => gradientLoop.play(), // Play loop when in view
          onLeaveBack: () => gradientLoop.pause(), // Pause if scrolling back up past start
          // Optional: Pause when scrolling completely out of view
          // onLeave: () => gradientLoop.pause(),
          // onEnterBack: () => gradientLoop.play(),
          // --- END NEW ---
        },
      });

      // Gradient shift during draw-in
      tl.to(
        gradientRef.current,
        { attr: { gradientTransform: "translate(1,0)" }, ease: "power1.inOut", duration: 1.5 },
        0
      );

      // Line drawing (as before)
      tl.fromTo(
        pathRef.current!,
        { drawSVG: "0%", autoAlpha: 0 },
        { drawSVG: "100%", autoAlpha: 1, duration: 1.5, ease: "power1.inOut" },
        0
      );

      // --- REMOVE ball animation ---
      // tl.to(
      //   ballRef.current,
      //   { /* ... ball animation config ... */ },
      //   0
      // );

    }, containerRef);

    return () => ctx.revert();

  }, [pathD]);

  return (
    <div ref={containerRef} className={styles.container}>
      <p className={styles.text}>{text}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 25" // Keep curve viewBox
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