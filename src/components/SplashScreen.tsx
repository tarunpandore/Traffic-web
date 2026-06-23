"use client";

import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface SplashScreenProps {
  onRevealStart: () => void;
  onComplete: () => void;
}

export default function SplashScreen({ onRevealStart, onComplete }: SplashScreenProps) {
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(0.96);
  const [screenOpacity, setScreenOpacity] = useState(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during splash
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Step 1: Fade in TraffiX logo
    const fadeInLogoTimer = setTimeout(() => {
      setLogoOpacity(1);
      setLogoScale(1.0);
    }, 150);

    // Step 2: Fade out logo
    const fadeOutLogoTimer = setTimeout(() => {
      setLogoOpacity(0);
      setLogoScale(1.04);
    }, 1600);

    // Step 3: Fade out black screen and trigger map route reveal
    const fadeScreenTimer = setTimeout(() => {
      setScreenOpacity(0);
      onRevealStart();
    }, 2200);

    // Step 4: Complete and unlock scroll
    const completeTimer = setTimeout(() => {
      setIsDone(true);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(fadeInLogoTimer);
      clearTimeout(fadeOutLogoTimer);
      clearTimeout(fadeScreenTimer);
      clearTimeout(completeTimer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [onRevealStart, onComplete]);

  if (isDone) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: screenOpacity,
        transition: "opacity 1.3s cubic-bezier(0.25, 1, 0.5, 1)",
        pointerEvents: screenOpacity > 0 ? "all" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transition: "opacity 1.0s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* Glow halo behind logo */}
        <div
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
            animation: "pulse 2s infinite ease-in-out",
          }}
        />

        <Activity size={32} color="#fbbf24" style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.4))" }} />
        
        <div
          style={{
            fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
            fontSize: "1.2rem",
            fontWeight: 500,
            letterSpacing: "0.45em",
            color: "#fbbf24",
            textTransform: "uppercase",
            marginTop: "0.5rem",
            paddingLeft: "0.45em", /* Center letters with letterSpacing */
            filter: "drop-shadow(0 0 10px rgba(251,191,36,0.2))",
          }}
        >
          TraffiX
        </div>
      </div>
    </div>
  );
}
