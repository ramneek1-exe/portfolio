'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  desktopImage: string;
  mobileImage: string;
  mobileAlt?: string;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    slug: 'deadliner',
    title: 'Deadliner',
    description:
      'An AI-powered deadline extractor that parses course syllabi and automatically populates your calendar — so you never miss a due date again.',
    tech: ['Next.js', 'React', 'TypeScript', 'OpenAI API', 'Tailwind CSS'],
    desktopImage: '/projects/deadliner-macbook.jpeg',
    mobileImage: '/projects/deadliner-iphone.jpeg',
    liveUrl: 'https://deadliner.net',
    githubUrl: 'https://github.com/ramneek1-exe/deadliner',
  },
  {
    slug: 'sector4',
    title: 'Sector 4',
    description:
      'A natural language interface over F1 telemetry that turns practice-session data into ML-backed race pace predictions, with explanations grounded in the model’s own feature attributions.',
    tech: ['Next.js', 'Python', 'scikit-learn', 'Claude API', 'TypeScript'],
    desktopImage: '/projects/sector4-macbook.jpeg',
    mobileImage: '/projects/sector4-iphone.jpeg',
    mobileAlt: 'Sector 4 helmet glyph',
    liveUrl: 'https://sector4.net',
    githubUrl: 'https://github.com/ramneek1-exe/sector4',
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isTouch = () => window.matchMedia('(pointer: coarse)').matches;

  useGSAP(() => {
    if (isTouch()) return;

    const cards = cardRefs.current.filter(Boolean);

    gsap.set(cards, { opacity: 0, y: 50 });
    gsap.set(phoneRefs.current.filter(Boolean), { x: 60, opacity: 0 });

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
  }, { scope: sectionRef });

  const handleMouseEnter = (index: number, cardEl: HTMLDivElement) => {
    if (isTouch()) return;

    gsap.to(cardEl, {
      boxShadow: '0 0 40px rgba(4,217,255,0.25)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const phoneEl = phoneRefs.current[index];
    if (phoneEl) {
      gsap.to(phoneEl, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = (index: number, cardEl: HTMLDivElement) => {
    if (isTouch()) return;

    gsap.to(cardEl, {
      boxShadow: '0 0 0px rgba(4,217,255,0)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const phoneEl = phoneRefs.current[index];
    if (phoneEl) {
      gsap.to(phoneEl, { x: 60, opacity: 0, duration: 0.4, ease: 'power2.in' });
    }
  };

  return (
    <div ref={sectionRef} className={styles.projectsSection}>
      <div className={styles.cardsGrid}>
        {projects.map((project, index) => (
          <div
            key={project.slug}
            ref={(el) => { cardRefs.current[index] = el; }}
            className={styles.card}
            onMouseEnter={(e) => handleMouseEnter(index, e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(index, e.currentTarget)}
          >
            <div className={styles.mockupContainer}>
              <img
                src={project.desktopImage}
                alt={`${project.title} on MacBook`}
                className={styles.macbookMockup}
              />
              <div
                ref={(el) => { phoneRefs.current[index] = el; }}
                className={styles.iphoneWrapper}
              >
                <img
                  src={project.mobileImage}
                  alt={project.mobileAlt ?? `${project.title} on iPhone`}
                  className={styles.iphoneMockup}
                />
              </div>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.projectTitle}>{project.title}</h2>
              <p className={styles.projectDescription}>{project.description}</p>

              <div className={styles.techStack}>
                {project.tech.map((tag) => (
                  <span key={tag} className={styles.techTag}>{tag}</span>
                ))}
              </div>

              <div className={styles.cardLinks}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkPrimary}
                  >
                    Live Site ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkSecondary}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
