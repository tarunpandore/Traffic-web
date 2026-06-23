"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  FileSearch,
  Map,
  Radar,
  Route,
  Search,
  ShieldAlert,
  Table2,
  Target,
  TimerReset,
  X
} from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";

type DashboardView = "identification" | "flow" | "enforcement";

const HOTSPOT_POINTS = [
  { name: "KR Market Junction", station: "Kalasipalya", violations: 1842, impact: 5824 },
  { name: "Silk Board Junction", station: "Madiwala", violations: 1650, impact: 5210 },
  { name: "Unnamed Hotspot #6", station: "Madiwala", violations: 1420, impact: 4260 },
  { name: "Richmond Circle", station: "Ashok Nagar", violations: 1105, impact: 3580 },
  { name: "Subbanna Junction", station: "Ulsoor", violations: 980, impact: 3120 },
  { name: "Unnamed Hotspot #12", station: "HSR Layout", violations: 854, impact: 2980 },
  { name: "Town Hall Spillover", station: "Kalasipalya", violations: 812, impact: 2710 },
  { name: "Unnamed Hotspot #29", station: "Indiranagar", violations: 720, impact: 2450 },
  { name: "Koramangala 80ft Road", station: "Koramangala", violations: 704, impact: 2320 },
  { name: "Unnamed Hotspot #45", station: "Koramangala", violations: 680, impact: 2180 },
  { name: "Double Road Crossing", station: "Ashok Nagar", violations: 890, impact: 1980 },
  { name: "BTM Layout Main Road", station: "Madiwala", violations: 620, impact: 1870 },
  { name: "MG Road Metro Edge", station: "Cubbon Park", violations: 598, impact: 1760 },
  { name: "Jayanagar 4th Block", station: "Jayanagar", violations: 566, impact: 1685 },
  { name: "Majestic Service Lane", station: "Upparpet", violations: 541, impact: 1595 },
  { name: "HSR Sector 7 Cut", station: "HSR Layout", violations: 520, impact: 1480 },
  { name: "Indiranagar 12th Main", station: "Indiranagar", violations: 488, impact: 1410 },
  { name: "Lalbagh Double Road", station: "Wilson Garden", violations: 462, impact: 1320 },
  { name: "Minor Lane Parkers", station: "Koramangala", violations: 640, impact: 1280 },
  { name: "Ulsoor Lake Approach", station: "Ulsoor", violations: 418, impact: 1195 }
];

const HOURLY_DATA = [
  2850, 2980, 3120, 3250, 3010, 2450, 1850, 1200, 680, 310, 120, 95,
  105, 115, 90, 110, 150, 280, 620, 1420, 1980, 2310, 2640, 2790
];

const JURISDICTION_IMPACT = [
  { station: "Madiwala", impact: 11340 },
  { station: "Kalasipalya", impact: 8534 },
  { station: "Koramangala", impact: 5780 },
  { station: "HSR Layout", impact: 4460 },
  { station: "Ashok Nagar", impact: 4105 },
  { station: "Indiranagar", impact: 3860 },
  { station: "Ulsoor", impact: 4315 },
  { station: "Jayanagar", impact: 1685 },
  { station: "Upparpet", impact: 1595 },
  { station: "Wilson Garden", impact: 1320 }
].sort((a, b) => b.impact - a.impact);

const TABS: { id: DashboardView; label: string; eyebrow: string; icon: React.ElementType }[] = [
  { id: "identification", label: "Illegal Parking Spots", eyebrow: "Goal 1", icon: Map },
  { id: "flow", label: "Traffic Flow Impact", eyebrow: "Goal 2", icon: Route },
  { id: "enforcement", label: "Targeted Enforcement", eyebrow: "Goal 3", icon: ShieldAlert }
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function impactClass(impact: number) {
  if (impact >= 4500) return "critical";
  if (impact >= 2500) return "high";
  if (impact >= 1500) return "medium";
  return "low";
}

function MethodologyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="methodology-backdrop" role="presentation" onClick={onClose}>
      <section className="methodology-modal" role="dialog" aria-modal="true" aria-labelledby="methodology-title" onClick={e => e.stopPropagation()}>
        <button className="icon-button methodology-close" type="button" aria-label="Close methodology" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="dashboard-kicker">
          <FileSearch size={13} />
          Spatial methodology
        </div>
        <h3 id="methodology-title">Strategic Logic</h3>
        <div className="methodology-grid">
          <article>
            <span>01</span>
            <h4>Input Filtering</h4>
            <p>We only analyze records where a parking violation has already been recorded, including Wrong Parking and No Parking. Every data point is a verified bad parking event.</p>
          </article>
          <article>
            <span>02</span>
            <h4>Density as Hotspot</h4>
            <p>Isolated incidents are treated as noise. When DBSCAN flags tightly packed violations within a 150 meter eps radius, it reveals a recurring operational hotspot.</p>
          </article>
          <article>
            <span>03</span>
            <h4>The Discovery</h4>
            <p>Many dense clusters occur at coordinates marked No Junction or unnamed in legacy records. Grouping these points exposes illegal parking zones that were previously invisible.</p>
          </article>
        </div>
        <div className="technical-note">
          <strong>Technical Note:</strong> Split 298k total Bengaluru violations into named junctions and untagged coordinates. Because reverse-geocoding for Bengaluru junction names was unreliable, DBSCAN isolated 309 high-density spatial clusters using standard GPS telemetry accuracy assumptions.
        </div>
      </section>
    </div>
  );
}

function ScatterPlot({ selectedName }: { selectedName: string }) {
  const maxCount = 2000;
  const maxImpact = 6000;
  return (
    <svg viewBox="0 0 720 360" className="dashboard-chart" role="img" aria-label="Severity correlation scatter plot">
      <defs>
        <linearGradient id="trendGlow" x1="0" x2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <line key={`h-${i}`} x1="70" x2="680" y1={60 + i * 70} y2={60 + i * 70} className="chart-grid-line" />
      ))}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={`v-${i}`} x1={70 + i * 152.5} x2={70 + i * 152.5} y1="50" y2="300" className="chart-grid-line" />
      ))}
      <line x1="70" y1="300" x2="680" y2="300" className="chart-axis-line" />
      <line x1="70" y1="50" x2="70" y2="300" className="chart-axis-line" />
      <line x1="82" y1="286" x2="660" y2="72" stroke="url(#trendGlow)" strokeWidth="5" strokeLinecap="round" />
      <line x1="82" y1="286" x2="660" y2="72" stroke="#fbbf24" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="8 8" />
      {HOTSPOT_POINTS.slice(0, 12).map(point => {
        const x = 70 + (point.violations / maxCount) * 610;
        const y = 300 - (point.impact / maxImpact) * 250;
        const selected = point.name === selectedName;
        return (
          <g key={point.name}>
            {selected && <circle cx={x} cy={y} r="19" fill="none" stroke="#fbbf24" strokeOpacity="0.65" strokeWidth="1.5" />}
            <circle cx={x} cy={y} r={selected ? 9 : 6} fill={selected ? "#fbbf24" : "#f43f5e"} opacity={selected ? 1 : 0.72} />
          </g>
        );
      })}
      <text x="70" y="332" className="chart-label">Raw Violation Count</text>
      <text x="26" y="55" className="chart-label" transform="rotate(-90 26 55)">Impact Score</text>
      <text x="650" y="326" className="chart-tick">2,000</text>
      <text x="18" y="60" className="chart-tick">6,000</text>
    </svg>
  );
}

function JurisdictionChart() {
  const maxImpact = Math.max(...JURISDICTION_IMPACT.map(item => item.impact));
  return (
    <div className="jurisdiction-chart">
      {JURISDICTION_IMPACT.map((item, index) => (
        <div className="jurisdiction-row" key={item.station}>
          <span>{index + 1}</span>
          <strong>{item.station}</strong>
          <div className="jurisdiction-bar-track">
            <div style={{ width: `${(item.impact / maxImpact) * 100}%` }} />
          </div>
          <em>{formatNumber(item.impact)}</em>
        </div>
      ))}
    </div>
  );
}

function HourlyHistogram() {
  const maxCount = Math.max(...HOURLY_DATA);
  return (
    <svg viewBox="0 0 760 220" className="histogram-chart" role="img" aria-label="Hourly density histogram">
      <line x1="40" y1="176" x2="730" y2="176" className="chart-axis-line" />
      {HOURLY_DATA.map((count, hour) => {
        const height = (count / maxCount) * 136;
        const x = 50 + hour * 28;
        const y = 176 - height;
        const isNight = hour <= 8 || hour >= 19;
        return (
          <g key={hour}>
            <rect
              x={x}
              y={y}
              width="16"
              height={height}
              rx="4"
              fill={isNight ? "#f43f5e" : "#334155"}
              opacity={isNight ? 0.92 : 0.48}
            />
            {hour % 3 === 0 && <text x={x - 2} y="200" className="chart-tick">{String(hour).padStart(2, "0")}</text>}
          </g>
        );
      })}
      <text x="50" y="24" className="chart-label">95.3% overnight concentration</text>
    </svg>
  );
}

export default function AnalysisDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("identification");
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [selectedJunction, setSelectedJunction] = useState(HOTSPOT_POINTS[0].name);
  const selected = useMemo(
    () => HOTSPOT_POINTS.find(point => point.name === selectedJunction) ?? HOTSPOT_POINTS[0],
    [selectedJunction]
  );

  return (
    <section className="analysis-dashboard" id="analysis">
      {methodologyOpen && <MethodologyModal onClose={() => setMethodologyOpen(false)} />}

      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-kicker">
              <Radar size={14} />
              Traffic intelligence center
            </div>
            <h2>Parking-Induced Congestion Analysis</h2>
          </div>
          <div className="dashboard-status">
            <span className="status-dot active" />
            Live analytical model
          </div>
        </header>

        <nav className="dashboard-tabs" aria-label="Analysis views">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={isActive ? "dashboard-tab active" : "dashboard-tab"}
                onClick={() => setActiveView(tab.id)}
              >
                <Icon size={17} />
                <span>{tab.eyebrow}</span>
                <strong>{tab.label}</strong>
              </button>
            );
          })}
        </nav>

        <div className="dashboard-view-stage">
          {activeView === "identification" && (
            <div className="dashboard-view identification-view">
              <div className="view-title-row">
                <div>
                  <div className="dashboard-kicker">
                    <Target size={13} />
                    Identification of illegal parking spots
                  </div>
                  <h3>Goal 1 - Identify Illegal Parking Hotspots</h3>
                </div>
                <button className="secondary-command" type="button" onClick={() => setMethodologyOpen(true)}>
                  View Methodology
                  <ChevronDown size={15} />
                </button>
              </div>

              <div className="dashboard-map-panel">
                <InteractiveMap scrollProgress={0.34} currentSlide={2} mapRevealStarted />
                <div className="map-panel-shade" />
                <aside className="floating-telemetry-panel">
                  <div className="dashboard-kicker">
                    <Activity size={12} />
                    System Telemetry
                  </div>
                  <dl>
                    <div><dt>Total records</dt><dd>298k</dd></div>
                    <div><dt>Untagged coords</dt><dd>~50%</dd></div>
                    <div><dt>DBSCAN eps</dt><dd>150m</dd></div>
                    <div><dt>Clusters isolated</dt><dd>309</dd></div>
                  </dl>
                </aside>
                <div className="map-layer-readout">
                  <span>Standard</span>
                  <span>Traffic</span>
                  <span>Transit</span>
                </div>
              </div>
            </div>
          )}

          {activeView === "flow" && (
            <div className="dashboard-view flow-view">
              <div className="view-title-row">
                <div>
                  <div className="dashboard-kicker">
                    <BarChart3 size={13} />
                    Quantifying traffic flow
                  </div>
                  <h3>Goal 2 - Quantify Traffic Flow Impact</h3>
                </div>
              </div>

              <div className="flow-grid">
                <article className="formula-card">
                  <span>Core Formula</span>
                  <div className="formula-line">
                    Impact Score = Violation Count x Severity Weight x Vehicle Size Weight
                  </div>
                  <p>Because direct, real-time congestion data was unavailable, violation characteristics are engineered as a proxy for road impedance.</p>
                </article>

                <article className="junction-card">
                  <label htmlFor="junction-select">
                    <Search size={14} />
                    Junction Search
                  </label>
                  <select id="junction-select" value={selectedJunction} onChange={event => setSelectedJunction(event.target.value)}>
                    {HOTSPOT_POINTS.slice(0, 12).map(point => (
                      <option key={point.name} value={point.name}>{point.name}</option>
                    ))}
                  </select>
                  <div className="junction-metrics">
                    <div><span>Impact Score</span><strong>{formatNumber(selected.impact)}</strong></div>
                    <div><span>Total Violations</span><strong>{formatNumber(selected.violations)}</strong></div>
                    <div><span>Jurisdiction</span><strong>{selected.station}</strong></div>
                  </div>
                </article>
              </div>

              <article className="chart-card severity-card">
                <div className="chart-card-header">
                  <div>
                    <span>Severity Correlation</span>
                    <h4>Counts vs Road-Width Displacement</h4>
                  </div>
                  <p>Heavy vehicles such as buses and trucks block 3x more capacity than standard passenger cars.</p>
                </div>
                <ScatterPlot selectedName={selected.name} />
              </article>
            </div>
          )}

          {activeView === "enforcement" && (
            <div className="dashboard-view enforcement-view">
              <div className="view-title-row">
                <div>
                  <div className="dashboard-kicker">
                    <ShieldAlert size={13} />
                    Actionable targeted enforcement
                  </div>
                  <h3>Goal 3 - Actionable Targeted Enforcement</h3>
                </div>
                <p>Move resource deployment from reactive patrolling to data-driven, preemptive tactical scheduling.</p>
              </div>

              <div className="enforcement-grid">
                <article className="table-card">
                  <div className="card-title-line">
                    <Table2 size={16} />
                    Top 20 Zones
                  </div>
                  <div className="zones-table-wrap">
                    <table className="zones-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Zone Name</th>
                          <th>Police Station</th>
                          <th>Total Violations</th>
                          <th>Impact Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HOTSPOT_POINTS.map((zone, index) => (
                          <tr key={zone.name}>
                            <td>#{index + 1}</td>
                            <td>{zone.name}</td>
                            <td>{zone.station}</td>
                            <td>{formatNumber(zone.violations)}</td>
                            <td><span className={`impact-pill ${impactClass(zone.impact)}`}>{formatNumber(zone.impact)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>

                <article className="chart-card jurisdiction-card-large">
                  <div className="card-title-line">
                    <BarChart3 size={16} />
                    Top 10 Jurisdictions by Congestion Impact
                  </div>
                  <JurisdictionChart />
                </article>
              </div>

              <article className="temporal-card">
                <div>
                  <div className="card-title-line">
                    <TimerReset size={16} />
                    Key Findings: Temporal Pattern
                  </div>
                  <p>Over 95.3% of total violations cluster overnight from 7:00 PM to 8:00 AM. Illegal parking acts as a permanent reduction in structural road capacity caused by overnight vehicle storage.</p>
                  <p>Daytime patrols miss this blockage. Enforcement should pivot to pre-rush hour clearing operations before 7:00 AM to reclaim full carriageway before the morning commute.</p>
                </div>
                <HourlyHistogram />
              </article>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
