"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  MapPin,
  Activity,
  Search,
  Mic,
  User,
  Plus,
  Minus,
  Compass,
  Coffee,
  ShoppingBag,
  Hospital,
  Trees,
  Train,
  RotateCcw
} from "lucide-react";

export interface HotspotNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  count: number;
  impact: number;
  station: string;
  type: "named" | "unnamed";
  cx: number;
  cy: number;
}

interface POINode {
  id: string;
  name: string;
  type: "food" | "shopping" | "medical" | "park" | "transit";
  cx: number;
  cy: number;
  rating: number;
  details: string;
  color: string;
}

interface MetroStation {
  name: string;
  cx: number;
  cy: number;
  line: "purple" | "green";
}

interface BuildingBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MAP_NODES: HotspotNode[] = [
  { id: "h1", name: "BTP082 - KR Market Junction", lat: 12.9647, lon: 77.5768, count: 1842, impact: 5824, station: "Kalasipalya", type: "named", cx: 380, cy: 320 },
  { id: "h2", name: "Unnamed Hotspot #6 (Madiwala)", lat: 12.9224, lon: 77.6212, count: 1420, impact: 4260, station: "Madiwala", type: "unnamed", cx: 620, cy: 580 },
  { id: "h3", name: "BTP058 - Subbanna Junction", lat: 12.9734, lon: 77.6085, count: 980, impact: 3120, station: "Ulsoor", type: "named", cx: 520, cy: 260 },
  { id: "h4", name: "Unnamed Hotspot #12 (HSR Layout)", lat: 12.9116, lon: 77.6388, count: 854, impact: 2980, station: "HSR Layout", type: "unnamed", cx: 780, cy: 680 },
  { id: "h5", name: "BTP104 - Silk Board Junction", lat: 12.9176, lon: 77.6234, count: 1650, impact: 5210, station: "Madiwala", type: "named", cx: 640, cy: 630 },
  { id: "h6", name: "Unnamed Hotspot #29 (Indiranagar)", lat: 12.9625, lon: 77.6382, count: 720, impact: 2450, station: "Indiranagar", type: "unnamed", cx: 750, cy: 380 },
  { id: "h7", name: "BTP011 - Richmond Circle", lat: 12.9602, lon: 77.5975, count: 1105, impact: 3580, station: "Ashok Nagar", type: "named", cx: 480, cy: 390 },
  { id: "h8", name: "Unnamed Hotspot #45 (Koramangala)", lat: 12.9348, lon: 77.6189, count: 680, impact: 2180, station: "Koramangala", type: "unnamed", cx: 600, cy: 500 },
];

const POI_NODES: POINode[] = [
  { id: "p1", name: "The Hole in the Wall Cafe", type: "food", cx: 580, cy: 460, rating: 4.6, details: "Popular breakfast spot with American breakfast choices.", color: "#f97316" },
  { id: "p2", name: "Toit Brewpub", type: "food", cx: 730, cy: 260, rating: 4.5, details: "Legendary microbrewery known for its craft beers & wood-fired pizza.", color: "#f97316" },
  { id: "p3", name: "Nexus Mall Koramangala", type: "shopping", cx: 630, cy: 490, rating: 4.4, details: "Large retail mall offering global brands & multi-cuisine food court.", color: "#3b82f6" },
  { id: "p4", name: "St. John's Medical College", type: "medical", cx: 600, cy: 590, rating: 4.2, details: "Preeminent medical institution and hospital center.", color: "#ec4899" },
  { id: "p5", name: "Cubbon Park Central", type: "park", cx: 460, cy: 330, rating: 4.7, details: "Massive 300-acre green lung in the heart of Bengaluru.", color: "#22c55e" },
  { id: "p6", name: "KSR Bangalore Central Station", type: "transit", cx: 330, cy: 300, rating: 4.1, details: "Major railway station hub connecting South India.", color: "#14b8a6" },
  { id: "p7", name: "Third Wave Coffee Roasters", type: "food", cx: 770, cy: 230, rating: 4.4, details: "Artisanal coffee house & workspace.", color: "#f97316" },
  { id: "p8", name: "Apollo Clinics HSR", type: "medical", cx: 760, cy: 720, rating: 4.3, details: "Multi-specialty healthcare and diagnostic clinic.", color: "#ec4899" }
];

const METRO_STATIONS: MetroStation[] = [
  { name: "Majestic Interchange", cx: 380, cy: 300, line: "purple" },
  { name: "MG Road Station", cx: 520, cy: 300, line: "purple" },
  { name: "Indiranagar Station", cx: 750, cy: 300, line: "purple" },
  { name: "Trinity Station", cx: 620, cy: 300, line: "purple" },
  { name: "Mantri Square Station", cx: 380, cy: 220, line: "green" },
  { name: "Lalbagh Green Metro", cx: 300, cy: 500, line: "green" }
];

const METRO_PURPLE_PATH = "M 150 300 L 900 300";
const METRO_GREEN_PATH = "M 380 150 L 380 320 L 300 500 L 250 700";

// Generated once — buildings are static, never re-generated
const generateBuildings = (): BuildingBlock[] => {
  const buildings: BuildingBlock[] = [];
  const sectors = [
    { xMin: 550, xMax: 660, yMin: 410, yMax: 530 },
    { xMin: 700, xMax: 810, yMin: 210, yMax: 350 },
    { xMin: 700, xMax: 850, yMin: 630, yMax: 750 },
    { xMin: 310, xMax: 450, yMin: 250, yMax: 410 }
  ];
  let idCounter = 0;
  sectors.forEach(s => {
    for (let px = s.xMin; px < s.xMax; px += 24) {
      for (let py = s.yMin; py < s.yMax; py += 18) {
        if ((px + py) % 3 === 0) continue;
        buildings.push({ id: `b-${idCounter++}`, x: px + 2, y: py + 2, w: 12 + (px % 8), h: 9 + (py % 6) });
      }
    }
  });
  return buildings;
};

const BUILDINGS = generateBuildings();

const ROAD_HIGHWAYS = [
  { name: "Outer Ring Road (NH 44)", d: "M 100 700 C 300 680, 500 620, 640 630 C 780 640, 850 500, 900 100", speed: "slow" },
  { name: "Hosur Road Expressway", d: "M 380 100 L 380 320 L 480 390 L 620 580 L 640 630 L 700 800", speed: "slow" }
];

const ROAD_MAJORS = [
  { name: "Sarjapur Main Road", d: "M 620 580 L 780 680 L 950 720", speed: "moderate" },
  { name: "Indiranagar 100 Feet Road", d: "M 750 150 L 750 380 L 680 500", speed: "moderate" },
  { name: "MG Road", d: "M 300 300 L 900 300", speed: "fast" },
  { name: "Richmond Road", d: "M 300 390 L 480 390 L 600 390", speed: "slow" },
  { name: "Kanakapura Road / Double Road", d: "M 380 320 L 300 500 L 200 650", speed: "moderate" },
  { name: "Vidyaranyapura Arterial", d: "M 150 100 L 300 150 L 380 100", speed: "fast" },
  { name: "Jakkur Link Road", d: "M 380 100 L 500 80 L 520 220", speed: "fast" },
  { name: "Hennur Main Road", d: "M 520 220 L 650 150 L 700 80", speed: "moderate" },
  { name: "BTM Layout Main Road", d: "M 480 550 L 620 580 L 600 680", speed: "slow" }
];

const ROAD_MINORS = [
  "M 550 420 L 650 420", "M 550 450 L 650 450", "M 550 480 L 650 480", "M 550 510 L 650 510",
  "M 570 400 L 570 530", "M 600 400 L 600 530", "M 630 400 L 630 530",
  "M 700 220 L 800 220", "M 700 250 L 800 250", "M 700 280 L 800 280", "M 700 310 L 800 310",
  "M 720 200 L 720 340", "M 760 200 L 760 340", "M 780 200 L 780 340",
  "M 700 640 L 850 640", "M 700 670 L 850 670", "M 700 700 L 850 700", "M 700 730 L 850 730",
  "M 730 620 L 730 760", "M 770 620 L 770 760", "M 810 620 L 810 760",
  "M 320 280 L 450 280", "M 320 340 L 450 340", "M 320 370 L 450 370",
  "M 350 250 L 350 410", "M 410 250 L 410 410", "M 440 250 L 440 410",
  "M 380 320 L 520 260", "M 520 260 L 750 380", "M 600 500 L 620 580"
];

interface InteractiveMapProps {
  scrollProgress: number;
  currentSlide: number;
  mapRevealStarted: boolean;
}

export default function InteractiveMap({ scrollProgress, currentSlide, mapRevealStarted }: InteractiveMapProps) {
  const [hoveredNode, setHoveredNode] = useState<HotspotNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLayer, setActiveLayer] = useState<"standard" | "traffic" | "transit">("standard");
  const [manualZoom, setManualZoom] = useState(1.0);
  const [manualPan, setManualPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Capture reveal once — prevents CSS animation restarts on scroll re-renders
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!mapRevealStarted || revealed) return;

    const revealTimer = window.setTimeout(() => setRevealed(true), 0);
    return () => window.clearTimeout(revealTimer);
  }, [mapRevealStarted, revealed]);

  // Returns inline styles for staggered fade-in animations
  const revealAnim = (delayMs: number, durationMs = 750): React.CSSProperties => ({
    opacity: 0,
    ...(revealed && {
      animation: `fadeInMapEl ${durationMs}ms ease ${delayMs}ms forwards`,
    }),
  });

  const baseLat = 12.9255 + (scrollProgress * 0.05);
  const baseLon = 77.6186 - (scrollProgress * 0.03);
  const cursorPos = {
    x: parseFloat(baseLat.toFixed(4)),
    y: parseFloat(baseLon.toFixed(4))
  };

  const mapGridOpacity = currentSlide <= 1 ? 0.35 : currentSlide >= 5 ? 0.05 : 0.6;
  const roadsOpacity = currentSlide <= 1 ? 0.25 : currentSlide >= 5 ? 0.1 : 0.75;
  const namedNodesOpacity = currentSlide >= 3 ? 0.8 : currentSlide === 2 ? 0.3 : 0;
  const unnamedNodesOpacity = currentSlide >= 2 ? 0.9 : 0;

  // Scroll-driven camera
  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;
  if (currentSlide <= 1) {
    scale = 0.95 + (scrollProgress * 0.08);
  } else if (currentSlide === 2) {
    scale = 1.45; translateX = -120; translateY = -150;
  } else if (currentSlide === 3) {
    scale = 1.6; translateX = -180; translateY = -220;
  } else if (currentSlide === 4) {
    scale = 1.25; translateX = -60; translateY = -50;
  } else if (currentSlide >= 5) {
    scale = 0.8;
  }

  const finalScale = scale * manualZoom;
  const finalTranslateX = translateX + (manualPan.x / finalScale);
  const finalTranslateY = translateY + (manualPan.y / finalScale);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - manualPan.x, y: e.clientY - manualPan.y });
  }, [manualPan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setManualPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleZoomIn = () => setManualZoom(z => Math.min(z + 0.15, 3.0));
  const handleZoomOut = () => setManualZoom(z => Math.max(z - 0.15, 0.5));
  const handleReset = () => { setManualZoom(1.0); setManualPan({ x: 0, y: 0 }); setSearchQuery(""); };

  const renderPoiIcon = (type: string) => {
    switch (type) {
      case "food": return <Coffee size={10} color="#ffffff" style={{ display: "block" }} />;
      case "shopping": return <ShoppingBag size={10} color="#ffffff" style={{ display: "block" }} />;
      case "medical": return <Hospital size={10} color="#ffffff" style={{ display: "block" }} />;
      case "park": return <Trees size={10} color="#ffffff" style={{ display: "block" }} />;
      case "transit": return <Train size={10} color="#ffffff" style={{ display: "block" }} />;
      default: return <MapPin size={10} color="#ffffff" style={{ display: "block" }} />;
    }
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const getTrafficColor = (speed: string) => {
    if (activeLayer !== "traffic") return undefined;
    if (speed === "slow") return "var(--accent-rose)";
    if (speed === "moderate") return "var(--accent-yellow)";
    return "#10b981";
  };

  // Memoize building rects — purely static, never changes
  const buildingRects = useMemo(() => BUILDINGS.map(b => (
    <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} className="map-building" rx="1.5" />
  )), []);

  const hudOpacity = currentSlide === 0 || currentSlide >= 4 ? 0 : 1;

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Search HUD */}
      <div
        className="map-search-bar"
        style={{ opacity: hudOpacity, transition: "opacity 0.5s ease" }}
        onMouseDown={e => e.stopPropagation()}
      >
        <Search size={16} className="map-search-icon" />
        <input
          type="text"
          placeholder="Search hotspots, roads or POIs..."
          className="map-search-input"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <span title="Reset Map" style={{ display: "inline-flex", cursor: "pointer" }} onClick={handleReset}>
            <RotateCcw size={14} className="map-search-icon" style={{ marginRight: "4px" }} />
          </span>
        )}
        <Mic size={16} className="map-search-icon" />
        <div style={{ height: "16px", width: "1px", background: "var(--border-wireframe)" }} />
        <User size={16} className="map-search-icon" />
      </div>

      {/* Map Layers Widget */}
      <div
        className="map-layer-widget"
        style={{ opacity: hudOpacity, transition: "opacity 0.5s ease" }}
        onMouseDown={e => e.stopPropagation()}
      >
        {(["standard", "traffic", "transit"] as const).map(layer => (
          <button
            key={layer}
            className={`map-layer-btn ${activeLayer === layer ? "active" : ""}`}
            onClick={() => setActiveLayer(layer)}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Telemetry overlay */}
      <div
        style={{
          position: "absolute", top: "80px", right: "2rem", zIndex: 100,
          background: "rgba(10, 14, 23, 0.7)", backdropFilter: "blur(10px)",
          border: "1px solid var(--border-wireframe)", padding: "1rem",
          fontFamily: "var(--font-jetbrains)", fontSize: "0.75rem",
          borderRadius: "3px", pointerEvents: "none", width: "250px",
          opacity: hudOpacity, transition: "opacity 0.5s ease"
        }}
      >
        <div style={{ color: "var(--accent-yellow)", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Activity size={12} />
          SYSTEM TELEMETRY
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>RADAR SWEEP:</span><span style={{ color: "var(--text-primary)" }}>ONLINE</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>GIS.LATITUDE:</span><span style={{ color: "var(--text-primary)" }}>{cursorPos.x} N</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>GIS.LONGITUDE:</span><span style={{ color: "var(--text-primary)" }}>{cursorPos.y} E</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span>CLUSTER EPS:</span><span style={{ color: "var(--accent-blue)" }}>150 Meters</span>
        </div>
        <div style={{ borderTop: "1px solid var(--border-wireframe)", paddingTop: "0.5rem", color: "var(--text-muted)", fontSize: "0.7rem" }}>
          * DBSCAN cluster: min_samples=15
        </div>
      </div>

      {/* Hotspot info card — shown on hover */}
      {hoveredNode && (
        <div
          className="telemetry-card"
          style={{
            position: "absolute", top: "140px", left: "2rem", zIndex: 1000,
            width: "300px", background: "rgba(9, 13, 22, 0.95)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${hoveredNode.type === "unnamed" ? "var(--accent-rose)" : "var(--accent-yellow)"}`,
            boxShadow: hoveredNode.type === "unnamed"
              ? "0 10px 30px rgba(244,63,94,0.18)"
              : "0 10px 30px rgba(251,191,36,0.12)",
            borderRadius: "4px", padding: "1.25rem",
            pointerEvents: "none",
            opacity: hudOpacity, transition: "opacity 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <MapPin size={16} color={hoveredNode.type === "unnamed" ? "var(--accent-rose)" : "var(--accent-yellow)"} />
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-jetbrains)", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {hoveredNode.type === "unnamed" ? "DBSCAN Cluster Node" : "Tagged Road Junction"}
            </span>
          </div>
          <h4 style={{ fontSize: "1rem", fontWeight: 400, marginBottom: "0.75rem", color: "var(--text-primary)" }}>{hoveredNode.name}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", borderTop: "1px solid var(--border-wireframe)", paddingTop: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Violations:</span>
              <strong style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}>{hoveredNode.count}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Road Displacement:</span>
              <strong style={{ fontFamily: "var(--font-jetbrains)", color: hoveredNode.type === "unnamed" ? "var(--accent-rose)" : "var(--accent-yellow)" }}>
                {hoveredNode.impact} pts
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Jurisdiction:</span>
              <span style={{ color: "var(--text-primary)" }}>{hoveredNode.station} PS</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Coords:</span>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {hoveredNode.lat}, {hoveredNode.lon}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div
        className="map-zoom-widget"
        style={{ opacity: hudOpacity, transition: "opacity 0.5s ease" }}
        onMouseDown={e => e.stopPropagation()}
      >
        <button className="map-zoom-btn" onClick={handleZoomIn} title="Zoom In"><Plus size={16} /></button>
        <button className="map-zoom-btn" onClick={handleZoomOut} title="Zoom Out"><Minus size={16} /></button>
        <div style={{ height: "1px", background: "var(--border-wireframe)", margin: "0 4px" }} />
        <button className="map-zoom-btn" onClick={handleReset} title="Reset View"><Compass size={16} /></button>
      </div>

      {/* Traffic Legend */}
      <div
        className="map-legend-widget"
        style={{
          opacity: hudOpacity === 0 || activeLayer !== "traffic" ? 0 : 1,
          pointerEvents: activeLayer === "traffic" ? "auto" : "none",
          transition: "opacity 0.4s ease"
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="map-legend-title">Live Traffic Index</div>
        <div className="map-legend-bar" />
        <div className="map-legend-labels">
          <span>Fast</span><span>Moderate</span><span>Heavy</span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <svg
        className="map-svg"
        viewBox="0 0 1000 800"
        style={{
          willChange: "transform",
          transform: `scale(${finalScale}) translate(${finalTranslateX}px, ${finalTranslateY}px)`,
          transition: isDragging ? "none" : "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: isDragging ? "grabbing" : "grab"
        }}
      >
        {/* Grid */}
        <defs>
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-wireframe)" strokeWidth="0.5" opacity={mapGridOpacity} />
          </pattern>
        </defs>
        <rect width="1000" height="800" fill="url(#mapGrid)" />

        {/* WATER — no hover, no pointer events */}
        <g id="lakes" style={{ pointerEvents: "none", ...revealAnim(2000, 1000) }}>
          <path className="map-water" d="M 520 220 C 530 200, 560 190, 580 200 C 600 210, 620 200, 630 220 C 640 240, 620 260, 600 270 C 580 280, 550 270, 530 260 Z"><title>Ulsoor Lake</title></path>
          <path className="map-water" d="M 530 670 C 550 650, 580 660, 600 680 C 620 700, 610 730, 590 740 C 570 750, 540 730, 520 710 Z"><title>Madiwala Lake</title></path>
          <path className="map-water" d="M 820 570 C 850 540, 900 550, 930 580 C 950 600, 940 630, 900 640 C 860 650, 830 620, 810 590 Z"><title>Bellandur Lake</title></path>
          <path className="map-water" d="M 220 180 C 240 170, 270 175, 280 190 C 290 205, 275 220, 255 225 C 235 230, 215 210, 210 195 Z"><title>Sankey Tank</title></path>
        </g>

        {/* PARKS — no hover, no pointer events */}
        <g id="parks" style={{ pointerEvents: "none", ...revealAnim(2200, 1000) }}>
          <path className="map-park" d="M 420 340 C 440 310, 480 290, 510 320 C 530 340, 500 380, 470 390 C 445 400, 415 375, 410 355 Z"><title>Cubbon Park</title></path>
          <path className="map-park" d="M 400 480 C 430 460, 460 470, 470 495 C 480 520, 460 550, 430 560 C 400 570, 380 535, 385 505 Z"><title>Lalbagh Botanical Gardens</title></path>
          <path className="map-park" d="M 670 480 Q 690 460, 710 490 T 670 510 Z"><title>Koramangala Valley Park</title></path>
        </g>

        {/* BUILDINGS — static, no hover, no pointer events */}
        <g id="buildings" opacity={currentSlide >= 3 ? 0.3 : 0.6} style={{ pointerEvents: "none", ...revealAnim(2400, 800) }}>
          {buildingRects}
        </g>

        {/* ROADS */}
        <g opacity={roadsOpacity} style={{ transition: "opacity 0.8s ease" }}>
          {/* Minor streets — no hover */}
          <g id="minor-roads" style={{ pointerEvents: "none" }}>
            {ROAD_MINORS.map((d, i) => (
              <path key={i} d={d} fill="none" className="map-road-minor" strokeWidth="1.2"
                style={revealAnim(600 + i * 20)} />
            ))}
          </g>

          {/* Major roads — no road hover, traffic color only */}
          <g id="major-roads" style={{ pointerEvents: "none" }}>
            {ROAD_MAJORS.map((road, idx) => {
              const tc = getTrafficColor(road.speed);
              const matches = matchesSearch(road.name);
              return (
                <g key={road.name} style={revealAnim(300 + idx * 60)}>
                  <path
                    d={road.d}
                    fill="none"
                    className="map-road-major"
                    stroke={tc || "rgba(255,255,255,0.18)"}
                    strokeWidth="2.8"
                    opacity={matches ? 1 : 0.25}
                    style={{ transition: "stroke 0.4s ease, opacity 0.4s ease" }}
                  />
                </g>
              );
            })}
          </g>

          {/* Highways — no road hover, traffic color only */}
          <g id="highways" style={{ pointerEvents: "none" }}>
            {ROAD_HIGHWAYS.map((road, idx) => {
              const tc = getTrafficColor(road.speed);
              const matches = matchesSearch(road.name);
              return (
                <g key={road.name} style={revealAnim(idx * 100, 1000)}>
                  <path d={road.d} fill="none" className="map-road-highway-bg" strokeWidth="8.5" opacity={matches ? 1 : 0.25} />
                  <path d={road.d} fill="none" className="map-road-highway" stroke={tc || "var(--map-road-highway)"} strokeWidth="4.5" opacity={matches ? 1 : 0.25} style={{ transition: "stroke 0.4s ease" }} />
                  <path d={road.d} fill="none" stroke="#090D16" strokeWidth="0.8" strokeDasharray="2 3" opacity={matches ? 0.7 : 0.15} />
                </g>
              );
            })}
          </g>
        </g>

        {/* METRO TRANSIT LAYER — no hover on stations */}
        {activeLayer === "transit" && (
          <g id="transit-layer" style={{ pointerEvents: "none" }}>
            <path d={METRO_PURPLE_PATH} fill="none" className="map-metro-line-underlay" strokeWidth="5" />
            <path d={METRO_PURPLE_PATH} fill="none" className="map-metro-line" strokeWidth="2.5" style={{ stroke: "#a855f7" }} />
            <path d={METRO_GREEN_PATH} fill="none" className="map-metro-line-underlay" strokeWidth="5" />
            <path d={METRO_GREEN_PATH} fill="none" className="map-metro-line" strokeWidth="2.5" style={{ stroke: "#22c55e" }} />
            {METRO_STATIONS.map(station => (
              <g key={station.name}>
                <circle cx={station.cx} cy={station.cy} r="6" className="map-metro-station" style={{ stroke: station.line === "purple" ? "#a855f7" : "#22c55e" }} />
                <circle cx={station.cx} cy={station.cy} r="2" fill="#ffffff" />
                <text x={station.cx + 8} y={station.cy + 3} fill="var(--text-secondary)" fontFamily="var(--font-jetbrains)" fontSize="7" fontWeight="bold">
                  {station.name.replace(" Station", "").replace(" Interchange", " Interchange M")}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* HEAT HALOS */}
        {currentSlide >= 2 && currentSlide < 4 && (
          <g id="hotspot-halos" style={{ pointerEvents: "none" }}>
            {MAP_NODES.map(node => {
              const sf = node.impact / 5824;
              return (
                <circle
                  key={`halo-${node.id}`}
                  cx={node.cx} cy={node.cy}
                  r={30 + sf * 30}
                  fill={node.type === "unnamed" ? "rgba(244, 63, 94, 0.05)" : "rgba(251, 191, 36, 0.04)"}
                  stroke={node.type === "unnamed" ? "rgba(244, 63, 94, 0.15)" : "rgba(251, 191, 36, 0.12)"}
                  strokeWidth="1"
                  style={{ animation: "pulse 2.5s infinite ease-in-out" }}
                />
              );
            })}
          </g>
        )}

        {/* NAMED JUNCTION HOTSPOTS — hover effect kept */}
        <g opacity={namedNodesOpacity} style={{ transition: "opacity 0.6s ease" }}>
        <g id="named-nodes" style={revealAnim(3000)}>
          {MAP_NODES.filter(n => n.type === "named").map(node => {
            const matches = matchesSearch(node.name) || matchesSearch(node.station);
            const isHovered = hoveredNode?.id === node.id;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                opacity={matches ? 1 : 0.15}
              >
                {/* Outer glow — expands smoothly on hover */}
                <circle
                  cx={node.cx} cy={node.cy}
                  r={isHovered ? 11 : 8}
                  fill="var(--accent-yellow)"
                  opacity={isHovered ? 0.35 : 0.15}
                  style={{ transition: "r 0.2s ease, opacity 0.2s ease" }}
                />
                {/* Core dot */}
                <circle
                  cx={node.cx} cy={node.cy}
                  r={isHovered ? 6 : 4.5}
                  fill="var(--accent-yellow)"
                  stroke="#090D16"
                  strokeWidth="1.5"
                  style={{ transition: "r 0.2s ease" }}
                />
                <text
                  x={node.cx + 10} y={node.cy + 4}
                  fill="var(--text-secondary)"
                  fontFamily="var(--font-jetbrains)"
                  fontSize="9"
                  opacity={isHovered ? 1 : 0.75}
                  fontWeight={isHovered ? "bold" : "normal"}
                  style={{ pointerEvents: "none" }}
                >
                  {node.name.split("-")[1]?.trim() || node.name}
                </text>
              </g>
            );
          })}
        </g>
        </g>

        {/* DBSCAN UNNAMED HOTSPOTS — hover effect kept */}
        <g opacity={unnamedNodesOpacity} style={{ transition: "opacity 0.6s ease" }}>
        <g id="unnamed-nodes" style={revealAnim(3200)}>
          {MAP_NODES.filter(n => n.type === "unnamed").map(node => {
            const matches = matchesSearch(node.name) || matchesSearch(node.station);
            const isHovered = hoveredNode?.id === node.id;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                opacity={matches ? 1 : 0.15}
              >
                {/* Alert ring — expands smoothly on hover */}
                <circle
                  cx={node.cx} cy={node.cy}
                  r={isHovered ? 14 : 11}
                  fill="none"
                  stroke="var(--accent-rose)"
                  strokeWidth="1"
                  opacity={isHovered ? 0.6 : 0.3}
                  style={{ transition: "r 0.2s ease, opacity 0.2s ease" }}
                />
                {/* Outer glow */}
                <circle cx={node.cx} cy={node.cy} r="8" fill="var(--accent-rose)" opacity={isHovered ? 0.5 : 0.35} style={{ transition: "opacity 0.2s" }} />
                {/* Core dot */}
                <circle
                  cx={node.cx} cy={node.cy}
                  r={isHovered ? 6.5 : 5}
                  fill="var(--accent-rose)"
                  stroke="#090D16"
                  strokeWidth="1.5"
                  style={{ transition: "r 0.2s ease" }}
                />
                <text
                  x={node.cx + 10} y={node.cy + 4}
                  fill="var(--accent-rose)"
                  fontFamily="var(--font-jetbrains)"
                  fontSize="9"
                  fontWeight="bold"
                  opacity={isHovered ? 1 : 0.85}
                  style={{ pointerEvents: "none" }}
                >
                  {node.name.split("(")[0].trim()}
                </text>
              </g>
            );
          })}
        </g>
        </g>

        {/* POI MARKERS — no hover effect, static display only */}
        {currentSlide < 5 && (
          <g id="poi-nodes" style={{ pointerEvents: "none", ...revealAnim(3400) }}>
            {POI_NODES.map(poi => {
              const matches = matchesSearch(poi.name) || matchesSearch(poi.details);
              return (
                <g key={poi.id} opacity={matches ? 0.85 : 0.08}>
                  <circle cx={poi.cx} cy={poi.cy} r="8" fill={poi.color} stroke="#ffffff" strokeWidth="1" />
                  <foreignObject x={poi.cx - 6} y={poi.cy - 6} width="12" height="12" style={{ pointerEvents: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                      {renderPoiIcon(poi.type)}
                    </div>
                  </foreignObject>
                  {manualZoom >= 1.25 && (
                    <text x={poi.cx} y={poi.cy + 16} textAnchor="middle" className="map-poi-label" style={{ fontSize: "7.5px" }}>
                      {poi.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
