"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap,
  Map,
  ShieldAlert,
  Clock,
  Activity,
  ArrowDown,
  ChevronRight,
  Sliders,
  BellRing,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import SplashScreen from "@/components/SplashScreen";
import AnalysisDashboard from "@/components/AnalysisDashboard";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mapRevealStarted, setMapRevealStarted] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const solutionRef = useRef<HTMLDivElement>(null);

  const handleRevealStart = useCallback(() => setMapRevealStarted(true), []);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  // Monitor scroll positioning — only active after splash is done
  useEffect(() => {
    if (!splashDone) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);

      // Determine active slide index
      // Slide 0: Spacer (Clean map reveal)
      // Slide 1: Hero / Intro
      // Slide 2: Spatial Clustering
      // Slide 3: Severity Displacement
      // Slide 4: Interactive Analysis Dashboard
      // Slide 5: Data-Driven Enforcement Solutions
      if (scrollTop < window.innerHeight * 0.75) {
        setCurrentSlide(0);
      } else if (scrollTop >= window.innerHeight * 0.75 && scrollTop < window.innerHeight * 1.75) {
        setCurrentSlide(1);
      } else if (scrollTop >= window.innerHeight * 1.75 && scrollTop < window.innerHeight * 2.75) {
        setCurrentSlide(2);
      } else if (scrollTop >= window.innerHeight * 2.75 && scrollTop < window.innerHeight * 3.75) {
        setCurrentSlide(3);
      } else if (scrollTop >= window.innerHeight * 3.75 && scrollTop < window.innerHeight * 5.8) {
        setCurrentSlide(4);
      } else {
        setCurrentSlide(5);
      }

      // Toggle light theme when solution section enters view
      if (solutionRef.current) {
        const rect = solutionRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.55) {
          document.body.classList.add("light-theme");
        } else {
          document.body.classList.remove("light-theme");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("light-theme");
    };
  }, [splashDone]);

  return (
    <>
      {/* Cinematic splash screen — black → logo → fade out */}
      <SplashScreen
        onRevealStart={handleRevealStart}
        onComplete={handleSplashComplete}
      />

      {/* Scroll Progress Bar at very top */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      />

      {/* Grid Network overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      {/* Sticky map pinned in background */}
      <div
        className="sticky-map-wrapper"
        style={{
          opacity: currentSlide >= 4 ? 0.06 : 1,
          transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: currentSlide >= 4 ? "none" : "auto"
        }}
      >
        <InteractiveMap
          scrollProgress={scrollProgress}
          currentSlide={currentSlide}
          mapRevealStarted={mapRevealStarted}
        />
      </div>

      {/* Scroll Container for narrative slides */}
      <main className="scroll-container">

        {/* Slide 0: Spacer (Pure map reveal on splash complete) */}
        <section
          className={`scroll-section ${splashDone && currentSlide === 0 ? "active-slide" : ""}`}
          style={{ justifyContent: "center", alignItems: "flex-end", paddingBottom: "7vh" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.72rem",
              color: "var(--accent-yellow)",
              letterSpacing: "0.15em",
              opacity: splashDone && currentSlide === 0 ? 0.85 : 0,
              transform: splashDone && currentSlide === 0 ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 1s ease, transform 1s ease",
              pointerEvents: "none"
            }}
          >
            <span style={{ textShadow: "0 0 10px rgba(251,191,36,0.3)" }}>SCROLL TO DEPLOY HUD</span>
            <ArrowDown size={14} style={{ animation: "pulse 1.5s infinite" }} />
          </div>
        </section>

        {/* Slide 1: Hero / Intro */}
        <section className={`scroll-section ${splashDone && currentSlide === 1 ? "active-slide" : ""}`}>
          <div className="scroll-section-content telemetry-card">
            <div className="cockpit-label">
              <Activity size={11} color="var(--accent-yellow)" />
              <span>TraffiX // ENGINE ACTIVE</span>
            </div>
            <h1 className="cockpit-title" style={{ fontSize: "2.4rem", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
              AI-Driven Parking
            </h1>
            <h1 className="cockpit-title" style={{ fontSize: "2.4rem", letterSpacing: "-0.03em", marginBottom: "1.2rem", opacity: 0.5 }}>
              Intelligence
            </h1>
            <p className="cockpit-desc" style={{ marginBottom: "1.75rem", fontSize: "0.9rem" }}>
              Congestion is not random. Using spatial DBSCAN clustering and vehicle-displacement weights, we surface the hidden blockages choking Bengaluru's arterial network.
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "1.2rem",
              marginTop: "0.5rem"
            }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.72rem",
                  color: "var(--accent-yellow)",
                  letterSpacing: "0.1em",
                  animation: "pulse 1.5s infinite"
                }}
              >
                <ArrowDown size={13} />
                SCROLL TO EXPLORE
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                BENGALURU, IND
              </div>
            </div>
          </div>
        </section>

        {/* Slide 2: Spatial Intelligence (DBSCAN) */}
        <section className={`scroll-section ${currentSlide === 2 ? "active-slide" : ""}`}>
          <div className="scroll-section-content telemetry-card highlight-yellow">
            <div className="cockpit-label">
              <Map size={11} color="var(--accent-yellow)" />
              <span>01 // SPATIAL CLUSTERING</span>
            </div>
            <h2 className="cockpit-title">
              Detecting Untagged Hotspots
            </h2>
            <p className="cockpit-desc" style={{ marginBottom: "1.5rem" }}>
              Standard traffic logs only register violations at named junctions. By running DBSCAN Clustering, we discovered <strong>309 recurring unnamed hotspots</strong> representing 50% of all chokepoints.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.2rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>UNNAMED HOTSPOTS</div>
                <strong style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.5rem", color: "var(--accent-yellow)" }}>309 Zones</strong>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>TELEMETRY ACCURACY</div>
                <strong style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.5rem", color: "var(--text-primary)" }}>98.4%</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Severity Displacement Weighting */}
        <section className={`scroll-section ${currentSlide === 3 ? "active-slide" : ""}`}>
          <div className="scroll-section-content telemetry-card highlight-rose">
            <div className="cockpit-label">
              <ShieldAlert size={11} color="var(--accent-rose)" />
              <span>02 // ROAD WIDTH DISPLACEMENT</span>
            </div>
            <h2 className="cockpit-title">
              Beyond Raw Violation Counts
            </h2>
            <p className="cockpit-desc" style={{ marginBottom: "1.5rem" }}>
              Not all parking violations are equal. We calculate a weighted impact score multiplying violation type by vehicle size (e.g. Buses and Trucks block 3x more carriageway width than scooters).
            </p>

            <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem 1.25rem", borderRadius: "6px", border: "1px solid rgba(244,63,94,0.15)", fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem", lineHeight: "1.6" }}>
              <span style={{ color: "var(--accent-rose)", letterSpacing: "0.08em" }}>DISPLACEMENT FORMULA</span>
              <br />
              <code style={{ color: "var(--text-primary)", fontSize: "0.85rem", letterSpacing: "-0.01em" }}>
                Score = Count × TypeWeight × SizeWeight
              </code>
              <br />
              <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>Where Bus/Truck SizeWeight = 3.0, Scooter = 0.5</span>
            </div>
          </div>
        </section>

        {/* Slide 4: Interactive Dashboard (Analysis Dashboard) */}
        <section className={`scroll-section-dashboard ${currentSlide === 4 ? "active-dashboard" : ""}`} style={{ zIndex: 30, position: "relative" }}>
          <AnalysisDashboard />
        </section>

        {/* Slide 5: Solutions Grid */}
        <div ref={solutionRef} className="solution-container" id="solutions">
          <div className="container">
            <div className="solution-header">
              <div className="solution-badge">
                <Activity size={12} />
                Enforcement Strategy
              </div>
              <h2 className="solution-title">Data-Driven Congestion Mitigation</h2>
              <p className="solution-desc">
                By shifting resource allocation from reactive daytime patrolling to targeted overnight and early-morning interventions, we restore road capacity before traffic starts.
              </p>
            </div>

            <div className="solution-grid">
              <div className="project-card">
                <div className="project-icon"><Clock size={18} /></div>
                <h3 className="project-card-title">Pre-Rush Hour Towing Schedule</h3>
                <p className="project-card-desc">
                  Enforcement dispatching targeted exclusively between <strong>5:00 AM and 7:30 AM</strong> to clear overnight chokepoints, restoring full carriageway width before the morning commute.
                </p>
                <div className="project-card-footer">
                  <Zap size={12} />
                  <span>SCHEDULER SERVICE</span>
                  <ChevronRight size={12} style={{ marginLeft: "auto" }} />
                </div>
              </div>

              <div className="project-card">
                <div className="project-icon"><BellRing size={18} /></div>
                <h3 className="project-card-title">Live Telemetry Alerting API</h3>
                <p className="project-card-desc">
                  Direct API integrations triggering automated alerts to local police jurisdictions (e.g. Madiwala PS, HSR Layout PS) when repeat offenders park in designated high-severity zones.
                </p>
                <div className="project-card-footer">
                  <Activity size={12} />
                  <span>DISPATCH SYSTEM</span>
                  <ChevronRight size={12} style={{ marginLeft: "auto" }} />
                </div>
              </div>

              <div className="project-card">
                <div className="project-icon"><Sliders size={18} /></div>
                <h3 className="project-card-title">GIS Congestion Simulator</h3>
                <p className="project-card-desc">
                  An interactive planning dashboard that allows urban developers to select hotspots on the map and simulate the percentage increase in vehicle flow velocity upon clearing them.
                </p>
                <div className="project-card-footer">
                  <Map size={12} />
                  <span>SIMULATION TOOL</span>
                  <ChevronRight size={12} style={{ marginLeft: "auto" }} />
                </div>
              </div>
            </div>

            {/* Reimagined Minimalist Footer Card (Sloth-Style) */}
            <div className="reimagined-footer-card">
              <div className="footer-card-logo-wrap">
                <Activity size={20} color="var(--accent-yellow)" style={{ filter: "drop-shadow(0 0 4px rgba(251,191,36,0.3))" }} />
              </div>
              <h3 className="footer-card-title">Unclog Bengaluru's streets today.</h3>
              <p className="footer-card-subtitle">
                Deploy predictive enforcement schedules, simulate road width displacement impact, and integrate real-time telemetry alerts.
              </p>
              
              <div className="footer-card-buttons">
                <button type="button" className="footer-card-btn-outline" onClick={() => window.location.href = "#analysis"}>
                  <Sliders size={14} />
                  View Simulator
                </button>
                <button type="button" className="footer-card-btn-solid">
                  Deploy TraffiX
                </button>
              </div>

              <div className="footer-card-divider" />

              <div className="footer-card-bottom">
                <div className="footer-card-socials">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
                    <Twitter size={16} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                </div>
                <div className="footer-card-copyright">
                  Copyright 2026 © TraffiX
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </>
  );
}
