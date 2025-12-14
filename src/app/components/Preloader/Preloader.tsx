// src/app/components/Preloader/Preloader.tsx
'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete: () => void;
}

// --- HELPER: Color Interpolation ---
// Maps 0-100 to your WebGL Gradient palette
const interpolateColor = (progress: number) => {
    // Colors from your WebGL Shader:
    // 0%   = Deepest Purple: #0F0145 (rgb(15, 1, 69))
    // 50%  = Mid Blue:       #0A27B1 (rgb(10, 39, 177))
    // 100% = Bright Cyan:    #04D9FF (rgb(4, 217, 255))
    
    const start = { r: 15, g: 1, b: 69 };
    const mid   = { r: 10, g: 39, b: 177 };
    const end   = { r: 4, g: 217, b: 255 };

    let r, g, b;

    if (progress <= 50) {
        const t = progress / 50; // 0 to 1
        r = Math.round(start.r + (mid.r - start.r) * t);
        g = Math.round(start.g + (mid.g - start.g) * t);
        b = Math.round(start.b + (mid.b - start.b) * t);
    } else {
        const t = (progress - 50) / 50; // 0 to 1
        r = Math.round(mid.r + (end.r - mid.r) * t);
        g = Math.round(mid.g + (end.g - mid.g) * t);
        b = Math.round(mid.b + (end.b - mid.b) * t);
    }

    return `rgb(${r}, ${g}, ${b})`;
};

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const starHoleRef = useRef<SVGPathElement>(null);
  const starCoreRef = useRef<SVGPathElement>(null);
  const starGlowRef = useRef<HTMLDivElement>(null);
  
  const npmCommandRef = useRef<HTMLDivElement>(null);
  const npmStatusRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
           onComplete();
           gsap.set(containerRef.current, { display: 'none' });
        }
      });

      // 1. Initial State
      gsap.set([starHoleRef.current, starCoreRef.current, starGlowRef.current], { 
        transformOrigin: "center center", 
        scale: 1, 
        opacity: 1
      });
      
      gsap.set(starHoleRef.current, { 
        x: window.innerWidth / 2 - 40, 
        y: window.innerHeight / 2 - 40 
      });

      // Set initial bar color
      gsap.set(barRef.current, { 
          backgroundColor: interpolateColor(0),
          color: interpolateColor(0) // For box-shadow inheritance
      });

      // Initial npm text state
      gsap.set([npmCommandRef.current, npmStatusRef.current], { opacity: 1 });
      
      // Create separate timeline for typing animations (runs independently)
      const typingTl = gsap.timeline();
      const npmText = "npm install --save portfolio";
      const installingText = "Installing............. Done!";
      
      if (npmCommandRef.current) {
        npmCommandRef.current.textContent = "";
      }
      if (npmStatusRef.current) {
        npmStatusRef.current.textContent = "";
      }
      
      // Typing animations on separate timeline
      typingTl.to(npmCommandRef.current, {
        duration: 1.2,
        ease: "none",
        onUpdate: function() {
          const progress = this.progress();
          const currentLength = Math.floor(progress * npmText.length);
          if (npmCommandRef.current) {
            npmCommandRef.current.textContent = npmText.substring(0, currentLength) + (progress < 1 ? "_" : "");
          }
        }
      })
      .to(npmStatusRef.current, {
        duration: 1.0,
        ease: "none",
        onUpdate: function() {
          const progress = this.progress();
          const currentLength = Math.floor(progress * installingText.length);
          if (npmStatusRef.current) {
            npmStatusRef.current.textContent = installingText.substring(0, currentLength) + (progress < 1 ? "_" : "");
          }
        }
      }, 0.8);

      // 2. Random Steps
      let currentProgress = 0;
      const steps = [];
      const numberOfSteps = 4;
      
      for (let i = 0; i < numberOfSteps - 1; i++) {
        const remaining = 100 - currentProgress;
        const maxJump = remaining / (numberOfSteps - i) + 10;
        const minJump = 10;
        const jump = Math.floor(Math.random() * (maxJump - minJump + 1) + minJump);
        currentProgress += jump;
        steps.push(currentProgress);
      }
      steps.push(100);

      // 3. Build Timeline
      steps.forEach((step, index) => {
        const isLast = index === steps.length - 1;
        const duration = Math.random() * (0.8 - 0.4) + 0.4;
        
        // Calculate color for this step
        const nextColor = interpolateColor(step);

        // Bar Animation (Height + Color)
        tl.to(barRef.current, { 
            height: `${step}%`, 
            backgroundColor: nextColor,
            color: nextColor, // CSS variable or currentColor usage
            duration: duration, 
            ease: "power2.inOut" 
        }, index === 0 ? 0 : ">");

        // Text Counter
        tl.to(percentRef.current, {
          innerText: step,
          duration: duration,
          snap: { innerText: 1 },
          ease: "linear",
          onUpdate: function() {
              if (this.targets()[0]) this.targets()[0].innerHTML = Math.ceil(this.targets()[0].innerText) + "%";
          }
        }, "<");

        // Glow Pulse
        tl.to(starGlowRef.current, {
          scale: 1.5, 
          opacity: 0.5, 
          duration: 0.2,
          ease: "power1.out",
          yoyo: true,
          repeat: 1
        }, "<"); 

        if (!isLast) tl.to({}, { duration: 0.1 + Math.random() * 0.3 });
      });

      // 4. Reveal Sequence
      tl.addLabel("reveal");

      // Fade out Bar & Text & npm text
      tl.to([percentRef.current, wrapperRef.current, npmCommandRef.current, npmStatusRef.current], {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "reveal+=0.1");

      // Kill Glow
      tl.to(starGlowRef.current, {
        opacity: 0,
        scale: 2,
        duration: 0.5,
        ease: "power2.out"
      }, "reveal");

      // Expand Geometry
      const maxDimension = Math.max(window.innerWidth, window.innerHeight);
      const scaleFactor = (maxDimension / 80) * 6; 

      // Expand Mask
      tl.to(starHoleRef.current, {
        scale: scaleFactor,
        duration: 1.8,
        ease: "power4.inOut",
      }, "reveal+=0.2");

      // Expand Core
      tl.to(starCoreRef.current, {
        scale: scaleFactor,
        duration: 1.8,
        ease: "power4.inOut"
      }, "reveal+=0.2");
      
      // Fade out Core
      tl.to(starCoreRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, "reveal+=0.7");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const starPath = "M40 0 C40 26.6 53.3 40 80 40 C53.3 40 40 53.3 40 80 C40 53.3 26.6 40 0 40 C26.6 40 40 26.6 40 0 Z";

  return (
    <>
      <style jsx global>{`
        .custom-cursor, .custom-follower {
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `}</style>

      <div ref={containerRef} className={styles.container}>
        {/* 1. Mask */}
        <svg className={styles.overlaySvg} preserveAspectRatio="none">
          <defs>
            <mask id="star-mask">
              <rect width="100%" height="100%" fill="white" />
              <path ref={starHoleRef} d={starPath} fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#0B0B0B" mask="url(#star-mask)" />
        </svg>

        {/* 2. Glow */}
        <div className={styles.starGlow} ref={starGlowRef}>
           <svg viewBox="0 0 80 80" overflow="visible">
              <path d={starPath} fill="currentColor" />
           </svg>
        </div>

        {/* 3. Core */}
        <svg className={styles.starCore} viewBox="0 0 80 80" overflow="visible">
          <path ref={starCoreRef} d={starPath} fill="currentColor" />
        </svg>

        {/* 4. NPM Install Text */}
        <div className={styles.npmContainer}>
          <div ref={npmCommandRef} className={styles.npmText}></div>
          <div ref={npmStatusRef} className={styles.npmText}></div>
        </div>

        {/* 5. Stats */}
        <div ref={percentRef} className={styles.percentage}>0%</div>
        
        <div ref={wrapperRef} className={styles.progressWrapper}>
          <div ref={barRef} className={styles.progressBar}></div>
        </div>
      </div>
    </>
  );
}