"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Map, 
  ShieldAlert, 
  Clock, 
  Activity, 
  ArrowDown, 
  ChevronRight,
  Sliders,
  BellRing
} from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const solutionRef = useRef<HTMLDivElement>(null);

  // Monitor scroll positioning
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);

      // Determine active slide index for the sticky map part
      // We have 4 sticky screens (Intro, Spatial, Severity, Temporal) before scrolling into the Solution panel
      if (scrollTop < window.innerHeight) {
        setCurrentSlide(0);
      } else if (scrollTop >= window.innerHeight && scrollTop < window.innerHeight * 2) {
        setCurrentSlide(1);
      } else if (scrollTop >= window.innerHeight * 2 && scrollTop < window.innerHeight * 3) {
        setCurrentSlide(2);
      } else if (scrollTop >= window.innerHeight * 3 && scrollTop < window.innerHeight * 4) {
        setCurrentSlide(3);
      } else {
        setCurrentSlide(4);
      }

      // Check if solution section is in viewport to toggle light theme
      if (solutionRef.current) {
        const rect = solutionRef.current.getBoundingClientRect();
        // Transition theme when the solution container starts entering the viewport
        if (rect.top <= window.innerHeight * 0.5) {
          document.body.classList.add("light-theme");
        } else {
          document.body.classList.remove("light-theme");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("light-theme"); // cleanup
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Bar at the top */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      ></div>

      {/* Grid Network overlay */}
      <div className="grid-overlay" aria-hidden="true"></div>



      {/* Sticky map container pinned on background */}
      <div 
        className="sticky-map-wrapper"
        style={{
          opacity: currentSlide >= 4 ? 0.15 : 1,
          transition: "opacity 0.8s ease",
          pointerEvents: currentSlide >= 4 ? "none" : "auto"
        }}
      >
        <InteractiveMap scrollProgress={scrollProgress} currentSlide={currentSlide} />
      </div>

      {/* Scroll Container for narrative slides */}
      <main className="scroll-container">
        
        {/* Slide 0: Hero / Intro */}
        <section className={`scroll-section ${currentSlide === 0 ? "active-slide" : ""}`}>
          <div className="scroll-section-content telemetry-card">
            <div className="cockpit-label">
              <Activity size={12} color="var(--accent-yellow)" />
              <span>AURA SYSTEM INITIALIZATION</span>
            </div>
            <h1 className="cockpit-title" style={{ fontSize: "2rem" }}>
              AI-Driven <br />
              Parking Intelligence
            </h1>
            <p className="cockpit-desc" style={{ marginBottom: "1.5rem" }}>
              Congestion is not random. Utilizing spatial DBSCAN clustering and vehicle-displacement weights, we uncover the hidden blockages choking Bengaluru.
            </p>
            <div 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                fontFamily: "var(--font-jetbrains)", 
                fontSize: "0.75rem", 
                color: "var(--accent-yellow)",
                animation: "pulse 1.5s infinite"
              }}
            >
              <ArrowDown size={14} />
              SCROLL TO INITIATE SCAN
            </div>
          </div>
        </section>

        {/* Slide 1: Spatial Intelligence (DBSCAN) */}
        <section className={`scroll-section ${currentSlide === 1 ? "active-slide" : ""}`}>
          <div className="scroll-section-content telemetry-card highlight-yellow">
            <div className="cockpit-label">
              <Map size={12} color="var(--accent-yellow)" />
              <span>01 // SPATIAL CLUSTERING</span>
            </div>
            <h2 className="cockpit-title">
              Detecting Untagged Hotspots
            </h2>
            <p className="cockpit-desc" style={{ marginBottom: "1.5rem" }}>
              Standard traffic logs only register violations at named junctions. By running **DBSCAN Clustering**, we discovered <strong>309 recurring unnamed hotspots</strong> representing 50% of all chokepoints.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid var(--border-wireframe)", paddingTop: "1rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", color: "var(--text-muted)" }}>UNNAMED HOTSPOTS</div>
                <strong style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.5rem", color: "var(--accent-yellow)" }}>309 Zones</strong>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", color: "var(--text-muted)" }}>TELEMETRY ACCURACY</div>
                <strong style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.5rem", color: "var(--text-primary)" }}>98.4%</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 2: Severity Displacement Weighting */}
        <section className={`scroll-section ${currentSlide === 2 ? "active-slide" : ""}`}>
          <div className="scroll-section-content telemetry-card highlight-rose">
            <div className="cockpit-label">
              <ShieldAlert size={12} color="var(--accent-rose)" />
              <span>02 // ROAD WIDTH DISPLACEMENT</span>
            </div>
            <h2 className="cockpit-title">
              Beyond Raw Violation Counts
            </h2>
            <p className="cockpit-desc" style={{ marginBottom: "1.5rem" }}>
              Not all parking violations are equal. We calculate a weighted impact score multiplying violation type by vehicle size (e.g. Buses and Trucks block 3x more carriageway width than scooters).
            </p>
            
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "2px", border: "1px solid var(--border-wireframe)", fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", lineHeight: "1.5" }}>
              <span style={{ color: "var(--accent-rose)" }}>DISPLACEMENT FORMULA:</span>
              <br />
              <code style={{ color: "var(--text-primary)" }}>
                Score = Count × TypeWeight × SizeWeight
              </code>
            </div>
          </div>
        </section>

        {/* Slide 3: Operational Strategy (Overnight Peak Chart) */}
        <section className={`scroll-section ${currentSlide === 3 ? "active-slide" : ""}`} style={{ justifyContent: "flex-start" }}>
          <div className="scroll-section-content" style={{ maxWidth: "550px" }}>
            <StatsSection />
          </div>
        </section>

        {/* Slide 4: Solutions Grid (Scrolls in naturally, transitions to Light mode) */}
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
              
              {/* Project 1 */}
              <div className="project-card">
                <div className="project-icon">
                  <Clock size={20} />
                </div>
                <h3 className="project-card-title">Pre-Rush Hour Towing Schedule</h3>
                <p className="project-card-desc">
                  Enforcement dispatching targeted exclusively between <strong>5:00 AM and 7:30 AM</strong> to clear overnight chokepoints, restoring full carriageway width before the morning commute.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--accent-yellow)", fontFamily: "var(--font-jetbrains)", fontSize: "0.8rem", fontWeight: "bold" }}>
                  <span>SCHEDULER SERVICE</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Project 2 */}
              <div className="project-card">
                <div className="project-icon">
                  <BellRing size={20} />
                </div>
                <h3 className="project-card-title">Live Telemetry Alerting API</h3>
                <p className="project-card-desc">
                  Direct API integrations triggering automated alerts to local police jurisdictions (e.g. Madiwala PS, HSR Layout PS) when repeat offenders park in designated high-severity zones.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--accent-yellow)", fontFamily: "var(--font-jetbrains)", fontSize: "0.8rem", fontWeight: "bold" }}>
                  <span>DISPATCH SYSTEM</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Project 3 */}
              <div className="project-card">
                <div className="project-icon">
                  <Sliders size={20} />
                </div>
                <h3 className="project-card-title">GIS Congestion Simulator</h3>
                <p className="project-card-desc">
                  An interactive planning dashboard that allows urban developers to select hotspots on the map and simulate the percentage increase in vehicle flow velocity upon clearing them.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--accent-yellow)", fontFamily: "var(--font-jetbrains)", fontSize: "0.8rem", fontWeight: "bold" }}>
                  <span>SIMULATION TOOL</span>
                  <ChevronRight size={14} />
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer 
        style={{
          borderTop: "1px solid var(--border-wireframe)",
          padding: "3rem 0",
          background: "var(--bg-surface-lowest)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "0.8rem",
          textAlign: "center",
          position: "relative",
          zIndex: 20,
          transition: "background-color 0.8s ease, color 0.8s ease"
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            © 2026 AURA TRAFFIC PLATFORM. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#solutions" style={{ color: "inherit", textDecoration: "none" }}>SOLUTIONS</a>
            <a href="https://nextjs.org" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>NEXT.JS DOCS</a>
          </div>
        </div>
      </footer>
    </>
  );
}
