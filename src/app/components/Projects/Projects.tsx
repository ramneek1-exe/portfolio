'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const iphoneRef  = useRef<HTMLDivElement>(null);
  const deadlinerCardRef = useRef<HTMLDivElement>(null);
  const comingSoonCardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = [deadlinerCardRef.current, comingSoonCardRef.current].filter(Boolean);

    gsap.set(cards, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
        });
      },
    });

    if (iphoneRef.current) {
      gsap.set(iphoneRef.current, { x: 60, opacity: 0 });
    }
  }, { scope: sectionRef });

  const handleCardMouseEnter = (cardEl: HTMLDivElement) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    gsap.to(cardEl, {
      boxShadow: '0 0 40px rgba(4,217,255,0.25)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleCardMouseLeave = (cardEl: HTMLDivElement) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    gsap.to(cardEl, {
      boxShadow: '0 0 0px rgba(4,217,255,0)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleDeadlinerMouseEnter = (cardEl: HTMLDivElement) => {
    handleCardMouseEnter(cardEl);
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (iphoneRef.current) {
      gsap.to(iphoneRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  const handleDeadlinerMouseLeave = (cardEl: HTMLDivElement) => {
    handleCardMouseLeave(cardEl);
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (iphoneRef.current) {
      gsap.to(iphoneRef.current, {
        x: 60,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      });
    }
  };

  return (
    <div ref={sectionRef} className={styles.projectsSection}>
      <div className={styles.cardsGrid}>
        {/* Deadliner Card */}
        <div
          ref={deadlinerCardRef}
          className={styles.card}
          onMouseEnter={(e) => handleDeadlinerMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => handleDeadlinerMouseLeave(e.currentTarget)}
        >
          <div className={styles.mockupContainer}>
            <img
              src="/projects/deadliner-macbook.jpeg"
              alt="Deadliner on MacBook"
              className={styles.macbookMockup}
            />
            <div ref={iphoneRef} className={styles.iphoneWrapper}>
              <img
                src="/projects/deadliner-iphone.jpeg"
                alt="Deadliner on iPhone"
                className={styles.iphoneMockup}
              />
            </div>
          </div>

          <div className={styles.cardBody}>
            <h2 className={styles.projectTitle}>Deadliner</h2>
            <p className={styles.projectDescription}>
              An AI-powered deadline extractor that parses course syllabi and automatically
              populates your calendar — so you never miss a due date again.
            </p>

            <div className={styles.techStack}>
              {['Next.js', 'React', 'TypeScript', 'OpenAI API', 'Tailwind CSS'].map((tag) => (
                <span key={tag} className={styles.techTag}>{tag}</span>
              ))}
            </div>

            <div className={styles.cardLinks}>
              <a
                href="https://deadliner.net"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkPrimary}
              >
                Live Site ↗
              </a>
              <a
                href="https://github.com/ramneek1-exe/deadliner"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkSecondary}
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div
          ref={comingSoonCardRef}
          className={styles.cardComingSoon}
          onMouseEnter={(e) => handleCardMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
        >
          <span className={styles.comingSoonLabel}>Coming Soon</span>
          <span className={styles.comingSoonTitle}>Next Project</span>
        </div>
      </div>
    </div>
  );
};

export default Projects;
