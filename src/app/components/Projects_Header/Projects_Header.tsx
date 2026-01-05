'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects_Header.module.css';

gsap.registerPlugin(ScrollTrigger); 

const Projects_Header = () => {
  const mainRef = useRef(null); 
  const projectsRef = useRef(null);
  const workRef = useRef(null);

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

  useLayoutEffect(() => {
    
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

    }, mainRef);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      
      if (projectsRef.current) {
        gsap.killTweensOf(projectsRef.current);
      }
      if (workRef.current) {
        gsap.killTweensOf(workRef.current);
      }
    };
  }, []);
  return (
    <div ref={mainRef} className={styles.projectsHeader}>
      <div ref={projectsRef} className={styles.projects}>
        Projects
      </div>
      <i ref={workRef} className={styles.workInProgress}>
        Work in progress... Until then, enjoy some of my pictures!
      </i>
    </div>
  );
};

export default Projects_Header;