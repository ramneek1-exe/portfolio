"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useEffect } from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const followerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const setCursorX = gsap.quickSetter(cursor, "x", "px");
    const setCursorY = gsap.quickSetter(cursor, "y", "px");
    const setFollowerX = gsap.quickSetter(follower, "x", "px");
    const setFollowerY = gsap.quickSetter(follower, "y", "px");

    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const speed = 0.5;

    const handleMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMove);

    const loop = () => {
      pos.x += (mouse.x - pos.x) * speed;
      pos.y += (mouse.y - pos.y) * speed;

      setCursorX(mouse.x);
      setCursorY(mouse.y);
      setFollowerX(pos.x);
      setFollowerY(pos.y);
    };

    gsap.ticker.add(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      gsap.ticker.remove(loop);
    };
  }, []);

  return (
    <>
      <span ref={cursorRef} className="custom-cursor" />
      <span ref={followerRef} className="custom-follower" />
    </>
  );
};

export default CustomCursor;