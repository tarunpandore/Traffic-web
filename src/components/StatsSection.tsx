"use client";

import React, { useState } from "react";
import { Clock, Award } from "lucide-react";

// Hourly distribution from notebook data
const HOURLY_DATA = [
  { hour: 0, count: 2850, isNight: true },
  { hour: 1, count: 2980, isNight: true },
  { hour: 2, count: 3120, isNight: true },
  { hour: 3, count: 3250, isNight: true },
  { hour: 4, count: 3010, isNight: true },
  { hour: 5, count: 2450, isNight: true },
  { hour: 6, count: 1850, isNight: true },
  { hour: 7, count: 1200, isNight: true },
  { hour: 8, count: 680, isNight: true },
  { hour: 9, count: 310, isNight: false },
  { hour: 10, count: 120, isNight: false },
  { hour: 11, count: 95, isNight: false },
  { hour: 12, count: 105, isNight: false },
  { hour: 13, count: 115, isNight: false },
  { hour: 14, count: 90, isNight: false },
  { hour: 15, count: 110, isNight: false },
  { hour: 16, count: 150, isNight: false },
  { hour: 17, count: 280, isNight: false },
  { hour: 18, count: 620, isNight: false },
  { hour: 19, count: 1420, isNight: true },
  { hour: 20, count: 1980, isNight: true },
  { hour: 21, count: 2310, isNight: true },
  { hour: 22, count: 2640, isNight: true },
  { hour: 23, count: 2790, isNight: true },
];

// Priority rank shifting (Count vs Impact) from combined dataset
const SCATTER_DATA = [
  { name: "KR Market Junction", count: 1842, impact: 5824, rankCount: 1, rankImpact: 1 },
  { name: "Silk Board Junction", count: 1650, impact: 5210, rankCount: 2, rankImpact: 2 },
  { name: "Unnamed Hotspot #6", count: 1420, impact: 4260, rankCount: 3, rankImpact: 3 },
  { name: "Richmond Circle", count: 1105, impact: 3580, rankCount: 4, rankImpact: 4 },
  { name: "Subbanna Junction", count: 980, impact: 3120, rankCount: 5, rankImpact: 5 },
  { name: "Unnamed Hotspot #12", count: 854, impact: 2980, rankCount: 6, rankImpact: 6 },
  { name: "Unnamed Hotspot #29", count: 720, impact: 2450, rankCount: 8, rankImpact: 7 },
  { name: "Unnamed Hotspot #45", count: 680, impact: 2180, rankCount: 9, rankImpact: 8 },
  { name: "Double Road Crossing", count: 890, impact: 1980, rankCount: 7, rankImpact: 9 }, // count was high, but low vehicle sizes (bikes) = dropped in impact rank!
  { name: "Minor Lane Parkers", count: 640, impact: 1280, rankCount: 10, rankImpact: 10 },
];

export default function StatsSection() {
  const [activeTab, setActiveTab] = useState<"temporal" | "severity">("temporal");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const maxCount = Math.max(...HOURLY_DATA.map(d => d.count));
  const maxScatterCount = 2000;
  const maxScatterImpact = 6000;

  return (
    <div className="telemetry-card" style={{ width: "100%" }}>
      {/* Tab Selectors */}
      <div 
        style={{ 
          display: "flex", 
          gap: "0.5rem", 
          borderBottom: "1px solid var(--border-wireframe)", 
          paddingBottom: "1rem", 
          marginBottom: "1rem" 
        }}
      >
        <button 
          onClick={() => setActiveTab("temporal")}
          style={{
            flex: 1,
            background: activeTab === "temporal" ? "rgba(255,255,255,0.05)" : "transparent",
            border: "1px solid",
            borderColor: activeTab === "temporal" ? "var(--accent-yellow)" : "var(--border-wireframe)",
            borderRadius: "2px",
            color: activeTab === "temporal" ? "var(--text-primary)" : "var(--text-muted)",
            padding: "0.6rem",
            fontSize: "0.8rem",
            fontFamily: "var(--font-jetbrains)",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease"
          }}
        >
          <Clock size={14} />
          TEMPORAL PATTERN
        </button>
        <button 
          onClick={() => setActiveTab("severity")}
          style={{
            flex: 1,
            background: activeTab === "severity" ? "rgba(255,255,255,0.05)" : "transparent",
            border: "1px solid",
            borderColor: activeTab === "severity" ? "var(--accent-rose)" : "var(--border-wireframe)",
            borderRadius: "2px",
            color: activeTab === "severity" ? "var(--text-primary)" : "var(--text-muted)",
            padding: "0.6rem",
            fontSize: "0.8rem",
            fontFamily: "var(--font-jetbrains)",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease"
          }}
        >
          <Award size={14} />
          SEVERITY CORRELATION
        </button>
      </div>

      {activeTab === "temporal" ? (
        <div>
          <div className="cockpit-label">
            <span>METRIC PROFILE: HOURLY DENSITY</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Violations cluster heavily overnight (<strong>7 PM - 8 AM</strong>), accounting for <strong>95.3%</strong> of total volume. Patrolling during peak business hours misses the structural blockage created by overnight storage.
          </p>

          {/* SVG Hourly Bar Chart */}
          <div style={{ position: "relative" }}>
            <svg viewBox="0 0 400 150" className="chart-container" style={{ height: "160px" }}>
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="390" y2="20" stroke="var(--border-wireframe)" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="30" y1="70" x2="390" y2="70" stroke="var(--border-wireframe)" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="30" y1="120" x2="390" y2="120" stroke="var(--border-wireframe)" strokeWidth="0.5" />

              {/* Y Axis Labels */}
              <text x="5" y="24" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">{maxCount}</text>
              <text x="5" y="74" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">{Math.floor(maxCount/2)}</text>
              <text x="5" y="124" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">0</text>

              {/* Bars */}
              {HOURLY_DATA.map((d, i) => {
                const width = 12;
                const gap = 3;
                const x = 35 + i * (width + gap);
                const height = (d.count / maxCount) * 100;
                const y = 120 - height;
                const isHovered = hoveredBar === i;

                return (
                  <rect
                    key={d.hour}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    className={`chart-bar ${d.isNight ? "highlight" : ""}`}
                    style={{
                      opacity: hoveredBar !== null && !isHovered ? 0.4 : 1,
                      cursor: "pointer"
                    }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                );
              })}

              {/* X Axis Hours Labels */}
              <text x="35" y="135" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">00:00</text>
              <text x="125" y="135" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">06:00</text>
              <text x="215" y="135" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">12:00</text>
              <text x="305" y="135" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">18:00</text>
              <text x="380" y="135" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">23:00</text>
            </svg>

            {/* Hover details */}
            {hoveredBar !== null && (
              <div 
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "rgba(9, 13, 22, 0.95)",
                  border: "1px solid var(--border-wireframe)",
                  padding: "0.4rem 0.6rem",
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.7rem",
                  borderRadius: "2px",
                  pointerEvents: "none"
                }}
              >
                <div>HOUR: {HOURLY_DATA[hoveredBar].hour}:00</div>
                <div style={{ color: HOURLY_DATA[hoveredBar].isNight ? "var(--accent-rose)" : "var(--text-primary)" }}>
                  COUNT: {HOURLY_DATA[hoveredBar].count}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="cockpit-label">
            <span>METRIC PROFILE: COUNTS VS DISPLACEMENT</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Raw violation frequency fails to proxy congestion. Our weighted impact score accounts for <strong>Road-Width Displacement</strong> (e.g. Buses/Trucks block 3x more capacity than cars).
          </p>

          {/* SVG Scatter Plot */}
          <div style={{ position: "relative" }}>
            <svg viewBox="0 0 400 150" className="chart-container" style={{ height: "160px" }}>
              {/* Grid lines */}
              <line x1="30" y1="20" x2="390" y2="20" stroke="var(--border-wireframe)" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="30" y1="120" x2="390" y2="120" stroke="var(--border-wireframe)" strokeWidth="0.5" />
              <line x1="30" y1="20" x2="30" y2="120" stroke="var(--border-wireframe)" strokeWidth="0.5" />
              <line x1="390" y1="20" x2="390" y2="120" stroke="var(--border-wireframe)" strokeWidth="0.5" strokeDasharray="2 2" />

              {/* Y Axis Labels (Impact) */}
              <text x="5" y="24" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">{maxScatterImpact}</text>
              <text x="5" y="124" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">0</text>
              <text x="35" y="15" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="6" transform="rotate(-90 20 15)" style={{ textAnchor: "end" }}>Congestion Impact</text>

              {/* X Axis Labels (Count) */}
              <text x="30" y="132" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">0</text>
              <text x="375" y="132" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="7">{maxScatterCount}</text>
              <text x="390" y="132" fill="var(--text-muted)" fontFamily="var(--font-jetbrains)" fontSize="6" style={{ textAnchor: "end" }}>Raw Violations</text>

              {/* Regression/Trend Line */}
              <line 
                x1="30" 
                y1="120" 
                x2="380" 
                y2="25" 
                stroke="rgba(255,255,255,0.06)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />

              {/* Scatter Points */}
              {SCATTER_DATA.map((d, i) => {
                // map coordinates
                const x = 30 + (d.count / maxScatterCount) * 350;
                const y = 120 - (d.impact / maxScatterImpact) * 100;
                const isHovered = hoveredPoint === i;
                const isOutlier = d.rankCount > d.rankImpact + 1; // dropped ranking due to low size weight

                return (
                  <g 
                    key={d.name}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {isHovered && (
                      <circle cx={x} cy={y} r="8" fill="none" stroke={isOutlier ? "var(--accent-yellow)" : "var(--accent-rose)"} strokeWidth="1" opacity="0.5" />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 5.5 : 4}
                      fill={isOutlier ? "var(--accent-yellow)" : "var(--accent-rose)"}
                      opacity={hoveredPoint !== null && !isHovered ? 0.3 : 1}
                      style={{ transition: "all 0.2s" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover details */}
            {hoveredPoint !== null && (
              <div 
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "rgba(9, 13, 22, 0.95)",
                  border: `1px solid ${SCATTER_DATA[hoveredPoint].rankCount > SCATTER_DATA[hoveredPoint].rankImpact + 1 ? "var(--accent-yellow)" : "var(--accent-rose)"}`,
                  padding: "0.5rem 0.75rem",
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.7rem",
                  borderRadius: "2px",
                  pointerEvents: "none",
                  width: "200px"
                }}
              >
                <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--border-wireframe)", paddingBottom: "0.25rem", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {SCATTER_DATA[hoveredPoint].name}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VIOLATIONS:</span>
                  <span>{SCATTER_DATA[hoveredPoint].count}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>IMPACT SCORE:</span>
                  <span style={{ color: "var(--accent-rose)" }}>{SCATTER_DATA[hoveredPoint].impact}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border-wireframe)", marginTop: "0.25rem", paddingTop: "0.25rem", color: "var(--accent-yellow)" }}>
                  <span>IMPACT RANK:</span>
                  <span>#{SCATTER_DATA[hoveredPoint].rankImpact}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
