"use client";
import React, { useLayoutEffect, useRef } from "react"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Bento.module.css";

const Bento = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bentoBoxRef = useRef<HTMLDivElement | null>(null); 
  
  const stRef = useRef<ScrollTrigger | null>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    const ctx = gsap.context(() => {
      const boxes = gsap.utils.toArray(`.${styles.frameParent} > div`, bentoBoxRef.current) as HTMLElement[];
      
      gsap.set(boxes, {
        x: 200,
        opacity: 0,
        force3D: true,
      });
      
      animRef.current = gsap.to(
        boxes,
        {
          x: 0,
          opacity: 1,
          rotationZ: 0,
          stagger: {
            each: 0.05,
            from: "start",
          },
          ease: "power2.out",
          duration: 1,
          paused: true 
        }
      );

      stRef.current = ScrollTrigger.create({
        trigger: containerRef.current, 
        start: "top 60%", 
        toggleActions: "play none none reverse", 
        animation: animRef.current, 
      });

    }, bentoBoxRef); 

    return () => {
      if (stRef.current) {
        stRef.current.kill();
        stRef.current = null;
      }
      if (animRef.current) {
        animRef.current.kill();
        animRef.current = null;
      }
      ctx.revert(); 
    };
  }, []); 

  return (
    <div 
      ref={containerRef} 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div ref={bentoBoxRef} className={styles.bentoBox}>
        <div className={styles.frameParent} data-gsap-group="1">
          <div className={styles.pythonWrapper}><div className={styles.python}>Python</div></div>
          <div className={styles.cWrapper}><div className={styles.python}>C++</div></div>
          <div className={styles.javascriptWrapper}><div className={styles.python}>JavaScript</div></div>
          <div className={styles.sqlWrapper}><div className={styles.python}>SQL</div></div>
          <div className={styles.typescriptWrapper}><div className={styles.python}>TypeScript</div></div>
        </div>

        <div className={styles.frameParent} data-gsap-group="2">
          <div className={styles.reactWrapper}><div className={styles.python}>React</div></div>
          <div className={styles.gitWrapper}><div className={styles.python}>Git</div></div>
          <div className={styles.jiraWrapper}><div className={styles.python}>Jira</div></div>
          <div className={styles.nextjsWrapper}><div className={styles.python}>Next.js</div></div>
          <div className={styles.figmaWrapper}><div className={styles.python}>Figma</div></div>
        </div>

        <div className={styles.frameParent} data-gsap-group="3">
          <div className={styles.oopWrapper}><div className={styles.python}>OOP</div></div>
          <div className={styles.agileWrapper}><div className={styles.python}>Agile</div></div>
          <div className={styles.dbmsWrapper}><div className={styles.python}>DBMS</div></div>
          <div className={styles.dsaWrapper}><div className={styles.python}>DSA</div></div>
          <div className={styles.uiuxWrapper}><div className={styles.python}>UI/UX</div></div>
        </div>
      </div>
    </div>
  );
};

export default Bento;