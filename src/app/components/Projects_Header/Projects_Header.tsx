'use client';
// 1. Import useLayoutEffect
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects_Header.module.css';

gsap.registerPlugin(ScrollTrigger); 

const Projects_Header = () => {
  // 2. Add a ref for the main container
  const mainRef = useRef(null); 
  const projectsRef = useRef(null);
  const workRef = useRef(null);

  // Helper function (no changes)
  const splitText = (element: HTMLElement) => {
    const text = element.innerText;
    element.innerHTML = '';
    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
      return span;
    });
    return chars;
  };

  // 3. Change useEffect to useLayoutEffect
  useLayoutEffect(() => {
    
    // 4. Create a GSAP context scoped to the main container
    const ctx = gsap.context(() => {
      
      const animateText = (el: HTMLElement | null) => {
        if (!el) return;
        const chars = splitText(el);
        gsap.set(chars, { y: 80, opacity: 0 });
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          ease: 'circ.out',
          duration: 0.8,
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: 'center 80%',
            toggleActions: 'restart none none reverse',
          },
        });
      };

      animateText(projectsRef.current);
      animateText(workRef.current);

    }, mainRef); // <-- Scope the context here

    // 5. The cleanup is now safe and simple
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      
      // --- DEFENSIVE FIX ---
      // Only kill tweens if the element still exists
      if (projectsRef.current) {
        gsap.killTweensOf(projectsRef.current);
      }
      if (workRef.current) {
        gsap.killTweensOf(workRef.current);
      }
    };
  }, []);
  return (
    // 6. Apply the main ref to the component's root element
    <div ref={mainRef} className={styles.projectsHeader}>
      <div ref={projectsRef} className={styles.projects}>
        Projects
      </div>
      <i ref={workRef} className={styles.workInProgress}>
        Work in progress... Until then, enjoy my portfolio!
      </i>
    </div>
  );
};

export default Projects_Header;