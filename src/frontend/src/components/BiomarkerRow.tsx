import type React from "react";
import type { Biomarker } from "../data/mockData";

const statusColor: Record<string, string> = {
  optimal: "#2FE6B7",
  suboptimal: "#F5A623",
  alert: "#FF4D57",
};

const statusLabel: Record<string, string> = {
  optimal: "OPTIMAL",
  suboptimal: "SUBOPTIMAL",
  alert: "ALERT",
};

interface Props {
  marker: Biomarker;
}

export const BiomarkerRow: React.FC<Props> = ({ marker }) => {
  const color = statusColor[marker.status];
  const barPct = Math.min(
    100,
    (marker.value / (marker.optimalMax * 1.3)) * 100,
  );
  const optimalLabel =
    marker.optimalMin > 0
      ? `${marker.optimalMin}\u2013${marker.optimalMax} ${marker.unit}`
      : `< ${marker.optimalMax} ${marker.unit}`;

  return (
    <div className="py-2.5" style={{ borderBottom: "1px solid #1e2a38" }}>
      {/* Top row: name/category + value/badge — wraps on narrow */}
      <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium" style={{ color: "#E8EEF6" }}>
            {marker.name}
          </span>
          <span style={{ fontSize: 11, color: "#6F7F92" }}>
            {marker.category}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 600,
              color,
            }}
          >
            {marker.value}{" "}
            <span style={{ fontSize: 11, fontWeight: 400 }}>{marker.unit}</span>
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color,
              background: `${color}18`,
              padding: "2px 5px",
              borderRadius: 4,
              border: `1px solid ${color}30`,
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel[marker.status]}
          </span>
        </div>
      </div>

      {/* Bottom row: bar + optimal label stacked */}
      <div className="flex flex-col gap-1">
        <div
          className="h-1 rounded overflow-hidden"
          style={{ background: "#243041" }}
        >
          <div
            style={{
              width: `${barPct}%`,
              height: "100%",
              background: `linear-gradient(90deg, #1FD6B8, ${color})`,
              borderRadius: 2,
              boxShadow: `0 0 6px ${color}60`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <span className="truncate" style={{ fontSize: 10, color: "#6F7F92" }}>
          Optimal: {optimalLabel}
        </span>
      </div>
    </div>
  );
};
