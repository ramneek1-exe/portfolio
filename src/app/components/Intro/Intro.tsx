'use client'; // <-- Add "use client"
import React, { useLayoutEffect, useRef } from 'react'; // <-- Import useLayoutEffect
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import styles from './Intro.module.css';

// Register the plugin
gsap.registerPlugin(SplitText);

const Intro = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const splitRef = useRef<any>(null);

  // Use useLayoutEffect for all DOM manipulation
  useLayoutEffect(() => {
    // Create a GSAP context for safe cleanup
    const ctx = gsap.context(() => {
      // Clean up previous instances *if they exist*
      if (splitRef.current) {
        splitRef.current.revert();
      }

      // Create new SplitText instance
      splitRef.current = new SplitText(textRef.current, {
        type: "lines"
      });

      // Create ScrollTrigger animation
      gsap.from(splitRef.current.lines, {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }, textRef); // Scope the context to the component's root

    // We don't need the resize listener because ScrollTrigger.refresh()
    // will handle it automatically.

    return () => {
      ctx.revert(); // This will kill the animation and revert the SplitText
    };
  }, []); // Empty dependency array

  return (
    <div ref={textRef} className={styles.intro}>
      I'm a <span className={styles.italics}>Computer Science</span> student at the University of Lethbridge with a passion for creating intuitive, functional interfaces. From Python programs to React-powered web interfaces, I love turning complex problems into <span className={styles.italics}>elegant</span> digital solutions. I'm always exploring new ways to blend code, creativity, and user-centred design to build software that <span className={styles.italics}>actually</span> makes life easier!
    </div>
  );
};

export default Intro;