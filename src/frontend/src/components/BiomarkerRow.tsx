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
    <div style={{ padding: "10px 0", borderBottom: "1px solid #1e2a38" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#E8EEF6" }}>
            {marker.name}
          </span>
          <span style={{ fontSize: 11, color: "#6F7F92", marginLeft: 8 }}>
            {marker.category}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              fontWeight: 600,
              color,
            }}
          >
            {marker.value}{" "}
            <span style={{ fontSize: 11, fontWeight: 400 }}>{marker.unit}</span>
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color,
              background: `${color}18`,
              padding: "2px 6px",
              borderRadius: 4,
              border: `1px solid ${color}30`,
            }}
          >
            {statusLabel[marker.status]}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            flex: 1,
            height: 4,
            background: "#243041",
            borderRadius: 2,
            overflow: "hidden",
          }}
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
        <span style={{ fontSize: 11, color: "#6F7F92", whiteSpace: "nowrap" }}>
          Optimal: {optimalLabel}
        </span>
      </div>
    </div>
  );
};
