'use client';

import dynamic from "next/dynamic";

import styles from "./page.module.css";

import { useState, useEffect } from "react"; // <--- Import hooks

import Hero from "./components/Hero/Hero";
import Intro from "./components/Intro/Intro";
import Bento_Header from "./components/Bento_Header/Bento_Header";
import Bento from "./components/Bento/Bento";
import WE_Header from "./components/WE_Header/WE_Header";
import WE from "./components/WE/WE";
import Projects_Header from "./components/Projects_Header/Projects_Header";
import GlitchText from "./components/ReactiveGlitchFooter/GlitchText/GlitchText";
import GradientBlinds from "./components/ReactiveGlitchFooter/GradientBlinds/GradientBlinds";
import Contact from "./components/Contact/Contact";
import ScrollVelocityText from "./components/ScrollVelocityText/ScrollVelocityText";
import Preloader from "./components/Preloader/Preloader";

export default function Home() {

  const FlipBookGallery = dynamic(
    () => import('./components/FlipBookGallery/FlipBookGallery'),
    {
      ssr: false,
      loading: () => <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading gallery...</div>
      </div>
    }
  );

  // 1. STATE FOR LOADING
  const [isLoading, setIsLoading] = useState(true);

  // 2. LOCK SCROLL WHILE LOADING
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      // If using Lenis/ScrollSmoother, they usually respect overflow:hidden on body, 
      // but sometimes you might need window.scrollTo(0,0) to ensure we start at top.
      window.scrollTo(0,0);
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  return (
    <>
      {/* 3. THE PRELOADER */}
      {/* We keep it in the DOM until it finishes its internal animation */}
      {/* Passing handleComplete to unlock scroll */}
      {isLoading && (
         <Preloader onComplete={() => setIsLoading(false)} />
      )}
      <div className={styles.page}>
            <main className={styles.main}>
              <Hero />
              <Intro />
            <Bento_Header />
            <Bento />
            <ScrollVelocityText
              texts={['Computer Science ⟡ ', 'Lethbridge CA ⚲ ']} 
              velocity={100} 
              className="custom-scroll-text"
            />
            <WE_Header />
            <WE />
            <Projects_Header />
              <FlipBookGallery />
            <Contact />
              <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                {/* Background layer */}
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  zIndex: 1,
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #181818 40%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, #181818 40%)'
                }}>
                  <GradientBlinds
                    gradientColors={['#00e5ff', '#0077ff', '#001f4d', '#0a0a1a']}
                    noise={0.2}
                    angle={-30}
                  />
                </div>

                {/* Copyright notice */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 3,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Geist, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  letterSpacing: '0.025em'
                }}>
                  © {new Date().getFullYear()} Ramneek Singh
                </div>
                
                {/* Text layer */}
                <div style={{ 
                  position: 'absolute', 
                  // left: '50%',
                  bottom: 0,
                  transform: 'translateY(45%)',
                  inset: 0, 
                  zIndex: 2, 
                  pointerEvents: 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <GlitchText text="Ramneek" />
                </div>
              </div>
          </main>
          <footer className="w-full bg-black py-8">
          </footer>
        </div>
    </>
  );
}