"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MapPin, 
  Activity, 
  Search, 
  Mic, 
  User, 
  Plus, 
  Minus, 
  Compass, 
  Layers, 
  Coffee, 
  ShoppingBag, 
  Hospital, 
  Trees, 
  Train,
  Info,
  RotateCcw
} from "lucide-react";

interface HotspotNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  count: number;
  impact: number;
  station: string;
  type: "named" | "unnamed";
  cx: number; // mapped SVG coord
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

// Data extracted/inspired from Jupyter Notebook
const MAP_NODES: HotspotNode[] = [
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

// Procedural building footprint blocks
const generateBuildings = (): BuildingBlock[] => {
  const buildings: BuildingBlock[] = [];
  const sectors = [
    { xMin: 550, xMax: 660, yMin: 410, yMax: 530 }, // Koramangala
    { xMin: 700, xMax: 810, yMin: 210, yMax: 350 }, // Indiranagar
    { xMin: 700, xMax: 850, yMin: 630, yMax: 750 }, // HSR Layout
    { xMin: 310, xMax: 450, yMin: 250, yMax: 410 }  // CBD / Richmond
  ];
  
  let idCounter = 0;
  sectors.forEach(s => {
    for (let px = s.xMin; px < s.xMax; px += 24) {
      for (let py = s.yMin; py < s.yMax; py += 18) {
        // Skip sometimes to create random spacing and organic layout
        if ((px + py) % 3 === 0) continue;
        buildings.push({
          id: `b-${idCounter++}`,
          x: px + 2,
          y: py + 2,
          w: 12 + (px % 8),
          h: 9 + (py % 6)
        });
      }
    }
  });
  return buildings;
};

const BUILDINGS = generateBuildings();

// Detailed roads paths
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
  // Koramangala Grid
  "M 550 420 L 650 420", "M 550 450 L 650 450", "M 550 480 L 650 480", "M 550 510 L 650 510",
  "M 570 400 L 570 530", "M 600 400 L 600 530", "M 630 400 L 630 530",
  // Indiranagar Grid
  "M 700 220 L 800 220", "M 700 250 L 800 250", "M 700 280 L 800 280", "M 700 310 L 800 310",
  "M 720 200 L 720 340", "M 760 200 L 760 340", "M 780 200 L 780 340",
  // HSR Layout Grid
  "M 700 640 L 850 640", "M 700 670 L 850 670", "M 700 700 L 850 700", "M 700 730 L 850 730",
  "M 730 620 L 730 760", "M 770 620 L 770 760", "M 810 620 L 810 760",
  // CBD Grid
  "M 320 280 L 450 280", "M 320 340 L 450 340", "M 320 370 L 450 370",
  "M 350 250 L 350 410", "M 410 250 L 410 410", "M 440 250 L 440 410",
  // Connectors
  "M 380 320 L 520 260", "M 520 260 L 750 380", "M 600 500 L 620 580"
];

interface InteractiveMapProps {
  scrollProgress: number; // 0 to 1
  currentSlide: number;
}

export default function InteractiveMap({ scrollProgress, currentSlide }: InteractiveMapProps) {
  const [hoveredNode, setHoveredNode] = useState<HotspotNode | null>(null);
  const [hoveredPOI, setHoveredPOI] = useState<POINode | null>(null);
  const [hoveredRoadName, setHoveredRoadName] = useState<string | null>(null);
  
  // HUD states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLayer, setActiveLayer] = useState<"standard" | "traffic" | "transit">("standard");
  const [manualZoom, setManualZoom] = useState(1.0);
  const [manualPan, setManualPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate mock lat/long telemetry on the fly during render
  const baseLat = 12.9255 + (scrollProgress * 0.05);
  const baseLon = 77.6186 - (scrollProgress * 0.03);
  const cursorPos = { 
    x: parseFloat(baseLat.toFixed(4)), 
    y: parseFloat(baseLon.toFixed(4)) 
  };

  const mapGridOpacity = currentSlide === 0 ? 0.3 : currentSlide >= 4 ? 0.05 : 0.6;
  const roadsOpacity = currentSlide === 0 ? 0.1 : currentSlide >= 4 ? 0.1 : 0.75;
  const namedNodesOpacity = currentSlide >= 2 ? 0.8 : currentSlide === 1 ? 0.3 : 0;
  const unnamedNodesOpacity = currentSlide >= 1 ? 0.9 : 0;
  
  // Custom camera zoom/pan offsets controlled by scroll/slides
  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;

  if (currentSlide === 0) {
    scale = 0.9 + (scrollProgress * 0.1);
  } else if (currentSlide === 1) {
    scale = 1.45;
    translateX = -120;
    translateY = -150;
  } else if (currentSlide === 2) {
    scale = 1.6;
    translateX = -180;
    translateY = -220;
  } else if (currentSlide === 3) {
    scale = 1.25;
    translateX = -60;
    translateY = -50;
  } else if (currentSlide >= 4) {
    scale = 0.8;
    translateX = 0;
    translateY = 0;
  }

  // Multiply manual zoom & pan on top of default story layout
  const finalScale = scale * manualZoom;
  const finalTranslateX = translateX + (manualPan.x / finalScale);
  const finalTranslateY = translateY + (manualPan.y / finalScale);

  // Mouse drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - manualPan.x, y: e.clientY - manualPan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setManualPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setManualZoom(z => Math.min(z + 0.15, 3.0));
  const handleZoomOut = () => setManualZoom(z => Math.max(z - 0.15, 0.5));
  const handleReset = () => {
    setManualZoom(1.0);
    setManualPan({ x: 0, y: 0 });
    setSearchQuery("");
  };

  // POI Icons helper
  const renderPoiIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Coffee size={10} color="#ffffff" style={{ display: "block" }} />;
      case "shopping":
        return <ShoppingBag size={10} color="#ffffff" style={{ display: "block" }} />;
      case "medical":
        return <Hospital size={10} color="#ffffff" style={{ display: "block" }} />;
      case "park":
        return <Trees size={10} color="#ffffff" style={{ display: "block" }} />;
      case "transit":
        return <Train size={10} color="#ffffff" style={{ display: "block" }} />;
      default:
        return <MapPin size={10} color="#ffffff" style={{ display: "block" }} />;
    }
  };

  // Filter nodes & POIs based on search query
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Colors for traffic density
  const getTrafficColor = (speed: string) => {
    if (activeLayer !== "traffic") return undefined;
    switch (speed) {
      case "slow": return "var(--accent-rose)";
      case "moderate": return "var(--accent-yellow)";
      case "fast": return "#10b981";
      default: return undefined;
    }
  };

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
        style={{ opacity: currentSlide >= 4 ? 0 : 1 }}
        onMouseDown={e => e.stopPropagation()} // Prevent dragging from input click
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
        <div style={{ height: "16px", width: "1px", background: "var(--border-wireframe)" }}></div>
        <User size={16} className="map-search-icon" />
      </div>

      {/* Map Layers Widget */}
      <div 
        className="map-layer-widget" 
        style={{ opacity: currentSlide >= 4 ? 0 : 1 }}
        onMouseDown={e => e.stopPropagation()}
      >
        <button 
          className={`map-layer-btn ${activeLayer === "standard" ? "active" : ""}`}
          onClick={() => setActiveLayer("standard")}
        >
          Standard
        </button>
        <button 
          className={`map-layer-btn ${activeLayer === "traffic" ? "active" : ""}`}
          onClick={() => setActiveLayer("traffic")}
        >
          Traffic
        </button>
        <button 
          className={`map-layer-btn ${activeLayer === "transit" ? "active" : ""}`}
          onClick={() => setActiveLayer("transit")}
        >
          Transit
        </button>
      </div>

      {/* Top console telemetry overlay */}
      <div 
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          zIndex: 100,
          background: "rgba(10, 14, 23, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--border-wireframe)",
          padding: "1rem",
          fontFamily: "var(--font-jetbrains)",
          fontSize: "0.75rem",
          borderRadius: "3px",
          pointerEvents: "none",
          width: "250px",
          transition: "opacity 0.5s ease",
          opacity: currentSlide >= 4 ? 0 : 1
        }}
      >
        <div style={{ color: "var(--accent-yellow)", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Activity size={12} className="status-dot active" />
          SYSTEM TELEMETRY
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>RADAR SWEEP:</span>
          <span style={{ color: "var(--text-primary)" }}>ONLINE</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>GIS.LATITUDE:</span>
          <span style={{ color: "var(--text-primary)" }}>{cursorPos.x} N</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <span>GIS.LONGITUDE:</span>
          <span style={{ color: "var(--text-primary)" }}>{cursorPos.y} E</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span>CLUSTER EPS:</span>
          <span style={{ color: "var(--accent-blue)" }}>150 Meters</span>
        </div>
        {hoveredRoadName && (
          <div style={{ borderTop: "1px solid var(--border-wireframe)", paddingTop: "0.5rem", marginBottom: "0.5rem", color: "var(--accent-yellow)" }}>
            <span>ROAD: {hoveredRoadName.toUpperCase()}</span>
          </div>
        )}
        <div style={{ borderTop: hoveredRoadName ? "none" : "1px solid var(--border-wireframe)", paddingTop: hoveredRoadName ? 0 : "0.5rem", color: "var(--text-muted)", fontSize: "0.7rem" }}>
          * DBSCAN cluster: min_samples=15
        </div>
      </div>

      {/* Floating Detailed Place Card (Google Maps Style, left aligned) */}
      {(hoveredNode || hoveredPOI) && !searchQuery && (
        <div 
          className="telemetry-card"
          style={{
            position: "absolute",
            top: "90px",
            left: "2rem",
            zIndex: 1000,
            width: "320px",
            background: "rgba(9, 13, 22, 0.95)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${
              hoveredPOI 
                ? hoveredPOI.color 
                : hoveredNode?.type === "unnamed" 
                  ? "var(--accent-rose)" 
                  : "var(--accent-yellow)"
            }`,
            boxShadow: hoveredPOI 
              ? `0 10px 30px ${hoveredPOI.color}22`
              : hoveredNode?.type === "unnamed" 
                ? "0 10px 30px rgba(244,63,94,0.18)" 
                : "0 10px 30px rgba(251,191,36,0.12)",
            borderRadius: "4px",
            padding: "1.25rem",
            pointerEvents: "none",
            transition: "opacity 0.3s ease",
            opacity: currentSlide >= 4 ? 0 : 1
          }}
        >
          {hoveredPOI ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: "20px", 
                    height: "20px", 
                    borderRadius: "50%", 
                    background: hoveredPOI.color 
                  }}
                >
                  {renderPoiIcon(hoveredPOI.type)}
                </span>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-jetbrains)", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {hoveredPOI.type} POI
                </span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.4rem", color: "var(--text-primary)" }}>{hoveredPOI.name}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "var(--accent-yellow)", marginBottom: "0.75rem" }}>
                <span>★ {hoveredPOI.rating}</span>
                <span style={{ color: "var(--text-muted)" }}>(Local Guide Rating)</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4", borderTop: "1px solid var(--border-wireframe)", paddingTop: "0.6rem" }}>
                {hoveredPOI.details}
              </p>
            </>
          ) : hoveredNode ? (
            <>
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
            </>
          ) : null}
        </div>
      )}

      {/* Floating Zoom & Compass Controls */}
      <div 
        className="map-zoom-widget" 
        style={{ opacity: currentSlide >= 4 ? 0 : 1 }}
        onMouseDown={e => e.stopPropagation()}
      >
        <button className="map-zoom-btn" onClick={handleZoomIn} title="Zoom In">
          <Plus size={16} />
        </button>
        <button className="map-zoom-btn" onClick={handleZoomOut} title="Zoom Out">
          <Minus size={16} />
        </button>
        <div style={{ height: "1px", background: "var(--border-wireframe)", margin: "0 4px" }}></div>
        <button className="map-zoom-btn" onClick={handleReset} title="Reset View">
          <Compass size={16} className="animate-spin-slow" />
        </button>
      </div>

      {/* Traffic Legend Widget */}
      <div 
        className="map-legend-widget" 
        style={{ 
          opacity: currentSlide >= 4 || activeLayer !== "traffic" ? 0 : 1,
          pointerEvents: activeLayer === "traffic" ? "auto" : "none",
          transition: "opacity 0.4s ease"
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="map-legend-title">Live Traffic Index</div>
        <div className="map-legend-bar"></div>
        <div className="map-legend-labels">
          <span>Fast</span>
          <span>Moderate</span>
          <span>Heavy</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg 
        className="map-svg"
        viewBox="0 0 1000 800"
        style={{
          transition: isDragging ? "none" : "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: `scale(${finalScale}) translate(${finalTranslateX}px, ${finalTranslateY}px)`,
          cursor: isDragging ? "grabbing" : "grab"
        }}
      >
        {/* Spatial Grid overlay in SVG */}
        <defs>
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-wireframe)" strokeWidth="0.5" opacity={mapGridOpacity} style={{ transition: "opacity 0.8s ease" }} />
          </pattern>
        </defs>
        <rect width="1000" height="800" fill="url(#mapGrid)" />

        {/* ================= GEOGRAPHICAL LAYERS ================= */}
        
        {/* Water Bodies (Lakes) */}
        <g id="lakes">
          {/* Ulsoor Lake */}
          <path 
            className="map-water"
            d="M 520 220 C 530 200, 560 190, 580 200 C 600 210, 620 200, 630 220 C 640 240, 620 260, 600 270 C 580 280, 550 270, 530 260 Z"
          >
            <title>Ulsoor Lake</title>
          </path>
          {/* Madiwala Lake */}
          <path 
            className="map-water"
            d="M 530 670 C 550 650, 580 660, 600 680 C 620 700, 610 730, 590 740 C 570 750, 540 730, 520 710 Z"
          >
            <title>Madiwala Lake</title>
          </path>
          {/* Bellandur Lake */}
          <path 
            className="map-water"
            d="M 820 570 C 850 540, 900 550, 930 580 C 950 600, 940 630, 900 640 C 860 650, 830 620, 810 590 Z"
          >
            <title>Bellandur Lake</title>
          </path>
          {/* Sankey Tank */}
          <path 
            className="map-water"
            d="M 220 180 C 240 170, 270 175, 280 190 C 290 205, 275 220, 255 225 C 235 230, 215 210, 210 195 Z"
          >
            <title>Sankey Tank</title>
          </path>
        </g>

        {/* Green Spaces (Parks) */}
        <g id="parks">
          {/* Cubbon Park */}
          <path 
            className="map-park"
            d="M 420 340 C 440 310, 480 290, 510 320 C 530 340, 500 380, 470 390 C 445 400, 415 375, 410 355 Z"
          >
            <title>Cubbon Park</title>
          </path>
          {/* Lalbagh Botanical Gardens */}
          <path 
            className="map-park"
            d="M 400 480 C 430 460, 460 470, 470 495 C 480 520, 460 550, 430 560 C 400 570, 380 535, 385 505 Z"
          >
            <title>Lalbagh Botanical Gardens</title>
          </path>
          {/* Koramangala Valley Park */}
          <path 
            className="map-park"
            d="M 670 480 Q 690 460, 710 490 T 670 510 Z"
          >
            <title>Koramangala Valley Park</title>
          </path>
        </g>

        {/* Procedural Building Blocks */}
        <g id="buildings" opacity={currentSlide >= 3 ? 0.3 : 0.6}>
          {BUILDINGS.map(b => (
            <rect 
              key={b.id}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              className="map-building"
              rx="1.5"
            />
          ))}
        </g>


        {/* ================= STREETS & HIGHWAYS NETWORK ================= */}
        
        <g opacity={roadsOpacity} style={{ transition: "opacity 0.8s ease" }}>
          {/* Minor Street Grid Lines */}
          <g id="minor-roads">
            {ROAD_MINORS.map((d, index) => (
              <path 
                key={`minor-${index}`}
                d={d}
                fill="none"
                className="map-road-minor"
                strokeWidth="1.2"
              />
            ))}
          </g>

          {/* Major Arterial Roads */}
          <g id="major-roads">
            {ROAD_MAJORS.map((road) => {
              const matches = matchesSearch(road.name);
              const trafficColor = getTrafficColor(road.speed);
              return (
                <g key={road.name} onMouseEnter={() => setHoveredRoadName(road.name)} onMouseLeave={() => setHoveredRoadName(null)}>
                  {/* Hover Zone trigger */}
                  <path 
                    d={road.d} 
                    className="map-road-hover-zone"
                  />
                  {/* Rendered Road Path */}
                  <path 
                    d={road.d} 
                    fill="none" 
                    className="map-road-major" 
                    stroke={trafficColor || "rgba(255,255,255,0.18)"}
                    strokeWidth="2.8"
                    opacity={matches ? 1 : 0.25}
                    style={{ transition: "stroke 0.4s ease, opacity 0.4s ease" }}
                  />
                </g>
              );
            })}
          </g>

          {/* Highways (Dual Carriageway style) */}
          <g id="highways">
            {ROAD_HIGHWAYS.map((road) => {
              const matches = matchesSearch(road.name);
              const trafficColor = getTrafficColor(road.speed);
              return (
                <g key={road.name} onMouseEnter={() => setHoveredRoadName(road.name)} onMouseLeave={() => setHoveredRoadName(null)}>
                  {/* Hover Zone trigger */}
                  <path 
                    d={road.d} 
                    className="map-road-hover-zone"
                  />
                  {/* Underlay glow */}
                  <path 
                    d={road.d} 
                    fill="none" 
                    className="map-road-highway-bg" 
                    strokeWidth="8.5"
                    opacity={matches ? 1 : 0.25}
                  />
                  {/* Base dual lane outline */}
                  <path 
                    d={road.d} 
                    fill="none" 
                    className="map-road-highway" 
                    stroke={trafficColor || "var(--map-road-highway)"}
                    strokeWidth="4.5"
                    opacity={matches ? 1 : 0.25}
                    style={{ transition: "stroke 0.4s ease, opacity 0.4s ease" }}
                  />
                  {/* Central divider line */}
                  <path 
                    d={road.d} 
                    fill="none" 
                    stroke="#090D16" 
                    strokeWidth="0.8" 
                    strokeDasharray="2 3"
                    opacity={matches ? 0.7 : 0.15}
                  />
                </g>
              );
            })}
          </g>
        </g>


        {/* ================= METRO TRANSIT LAYER ================= */}
        
        {activeLayer === "transit" && (
          <g id="transit-layer" style={{ animation: "fadeIn 0.5s ease" }}>
            {/* Purple Line */}
            <path 
              d={METRO_PURPLE_PATH}
              fill="none"
              className="map-metro-line-underlay"
              strokeWidth="5"
            />
            <path 
              d={METRO_PURPLE_PATH}
              fill="none"
              className="map-metro-line"
              strokeWidth="2.5"
              style={{ stroke: "#a855f7" }}
            />
            
            {/* Green Line */}
            <path 
              d={METRO_GREEN_PATH}
              fill="none"
              className="map-metro-line-underlay"
              strokeWidth="5"
            />
            <path 
              d={METRO_GREEN_PATH}
              fill="none"
              className="map-metro-line"
              strokeWidth="2.5"
              style={{ stroke: "#22c55e" }}
            />

            {/* Station Markers */}
            {METRO_STATIONS.map((station) => (
              <g key={station.name} style={{ cursor: "pointer" }}>
                <circle 
                  cx={station.cx} 
                  cy={station.cy} 
                  r="6" 
                  className="map-metro-station"
                  style={{ stroke: station.line === "purple" ? "#a855f7" : "#22c55e" }}
                />
                <circle 
                  cx={station.cx} 
                  cy={station.cy} 
                  r="2" 
                  fill="#ffffff"
                />
                <text 
                  x={station.cx + 8} 
                  y={station.cy + 3} 
                  fill="var(--text-secondary)" 
                  fontFamily="var(--font-jetbrains)" 
                  fontSize="7" 
                  fontWeight="bold"
                >
                  {station.name.replace(" Station", "").replace(" Interchange", " Interchange M")}
                </text>
              </g>
            ))}
          </g>
        )}


        {/* ================= DYNAMIC TRAFFIC SEVERITY HEAT HALOS ================= */}
        
        {currentSlide >= 2 && currentSlide < 4 && (
          <g id="hotspot-halos" style={{ transition: "opacity 0.5s ease" }}>
            {MAP_NODES.map((node) => {
              const scaleFactor = node.impact / 5824;
              return (
                <circle 
                  key={`halo-${node.id}`}
                  cx={node.cx}
                  cy={node.cy}
                  r={30 + scaleFactor * 30}
                  fill={node.type === "unnamed" ? "rgba(244, 63, 94, 0.05)" : "rgba(251, 191, 36, 0.04)"}
                  stroke={node.type === "unnamed" ? "rgba(244, 63, 94, 0.15)" : "rgba(251, 191, 36, 0.12)"}
                  strokeWidth="1"
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                  className="animate-pulse"
                />
              );
            })}
          </g>
        )}


        {/* ================= INTERACTIVE HOTSPOT NODES ================= */}
        
        {/* Hotspot Nodes (Named Junctions) */}
        <g id="named-nodes" opacity={namedNodesOpacity} style={{ transition: "opacity 0.6s ease" }}>
          {MAP_NODES.filter(n => n.type === "named").map((node) => {
            const matches = matchesSearch(node.name) || matchesSearch(node.station);
            const isHovered = hoveredNode?.id === node.id;
            return (
              <g 
                key={node.id} 
                style={{ cursor: "pointer", transition: "opacity 0.3s" }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                opacity={matches ? 1 : 0.15}
              >
                {/* External glow dot */}
                <circle cx={node.cx} cy={node.cy} r="8" fill="var(--accent-yellow)" opacity={isHovered ? "0.6" : "0.3"} className={isHovered ? "animate-ping" : ""} style={{ transformOrigin: `${node.cx}px ${node.cy}px` }} />
                {/* Core interactive dot */}
                <circle 
                  cx={node.cx} 
                  cy={node.cy} 
                  r={isHovered ? "6" : "4.5"} 
                  fill="var(--accent-yellow)" 
                  stroke="#090D16" 
                  strokeWidth="1.5" 
                  style={{ transition: "r 0.2s, fill 0.2s" }}
                />
                <text 
                  x={node.cx + 10} 
                  y={node.cy + 4} 
                  fill="var(--text-secondary)" 
                  fontFamily="var(--font-jetbrains)" 
                  fontSize="9" 
                  opacity={isHovered ? "1" : "0.75"}
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {node.name.split("-")[1]?.trim() || node.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* DBSCAN Hotspots (Unnamed Hotspots) */}
        <g id="unnamed-nodes" opacity={unnamedNodesOpacity} style={{ transition: "opacity 0.6s ease" }}>
          {MAP_NODES.filter(n => n.type === "unnamed").map((node) => {
            const matches = matchesSearch(node.name) || matchesSearch(node.station);
            const isHovered = hoveredNode?.id === node.id;
            return (
              <g 
                key={node.id} 
                style={{ cursor: "pointer", transition: "opacity 0.3s" }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                opacity={matches ? 1 : 0.15}
              >
                {/* Pulsing Alert Ring */}
                <circle cx={node.cx} cy={node.cy} r="12" fill="none" stroke="var(--accent-rose)" strokeWidth="1" opacity={isHovered ? "0.8" : "0.4"} className="status-dot" style={{ animation: "pulse 1.8s infinite ease-in-out" }} />
                {/* Outer glow dot */}
                <circle cx={node.cx} cy={node.cy} r="8" fill="var(--accent-rose)" opacity={isHovered ? "0.6" : "0.4"} />
                {/* Core interactive dot */}
                <circle 
                  cx={node.cx} 
                  cy={node.cy} 
                  r={isHovered ? "6.5" : "5"} 
                  fill="var(--accent-rose)" 
                  stroke="#090D16" 
                  strokeWidth="1.5" 
                />
                {/* Tag identifier */}
                <text 
                  x={node.cx + 10} 
                  y={node.cy + 4} 
                  fill="var(--accent-rose)" 
                  fontFamily="var(--font-jetbrains)" 
                  fontSize="9" 
                  fontWeight="bold"
                  opacity={isHovered ? "1" : "0.85"}
                >
                  {node.name.split("(")[0].trim()}
                </text>
              </g>
            );
          })}
        </g>


        {/* ================= INTERACTIVE POINTS OF INTEREST (POIs) ================= */}
        
        {currentSlide < 4 && (
          <g id="poi-nodes">
            {POI_NODES.map((poi) => {
              const matches = matchesSearch(poi.name) || matchesSearch(poi.details);
              const isHovered = hoveredPOI?.id === poi.id;
              return (
                <g 
                  key={poi.id}
                  className="map-poi-group"
                  style={{ "--poi-color": poi.color } as React.CSSProperties}
                  onMouseEnter={() => setHoveredPOI(poi)}
                  onMouseLeave={() => setHoveredPOI(null)}
                  opacity={matches ? 1 : 0.1}
                >
                  {/* POI Marker Circle */}
                  <circle 
                    cx={poi.cx}
                    cy={poi.cy}
                    r="8"
                    fill={poi.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="map-poi-circle"
                  />
                  {/* POI Category Icon */}
                  <foreignObject 
                    x={poi.cx - 6} 
                    y={poi.cy - 6} 
                    width="12" 
                    height="12" 
                    style={{ pointerEvents: "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                      {renderPoiIcon(poi.type)}
                    </div>
                  </foreignObject>
                  
                  {/* POI Label (renders if zoomed in or hovered) */}
                  {(manualZoom >= 1.25 || isHovered) && (
                    <text 
                      x={poi.cx}
                      y={poi.cy + 16}
                      textAnchor="middle"
                      className="map-poi-label"
                      style={{ fontSize: isHovered ? "8.5px" : "7.5px", fontWeight: isHovered ? "bold" : 500 }}
                    >
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
