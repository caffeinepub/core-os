import type React from "react";

interface Props {
  score: number; // 0–10
  size?: number;
}

const getCategory = (score: number) => {
  if (score < 3) return { label: "OPTIMAL", color: "#2FE6B7" };
  if (score < 6) return { label: "MODERATE", color: "#F5A623" };
  return { label: "ALERT", color: "#FF4D57" };
};

export const InflammationGauge: React.FC<Props> = ({ score, size = 200 }) => {
  const cx = size / 2;
  const cy = size * 0.54;
  const r = size * 0.38;
  const sw = size * 0.072;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const polarToXY = (deg: number, radius: number) => ({
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy - radius * Math.sin(toRad(deg)),
  });

  const arc = (startDeg: number, endDeg: number, radius: number) => {
    const s = polarToXY(startDeg, radius);
    const e = polarToXY(endDeg, radius);
    const large = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };

  const scoreAngle = 180 - (Math.max(0, Math.min(10, score)) / 10) * 180;

  const cat = getCategory(score);

  const z1 = 180 - 3 * 18; // 126° — score 3
  const z2 = 180 - 6 * 18; // 72°  — score 6

  // Zone label positions — above the arc track
  const labelRadius = r + sw * 1.15;
  const optimalCenter = 153; // midpoint of 180°–126°
  const moderateCenter = 99; // midpoint of 126°–72°
  const alertCenter = 36; // midpoint of 72°–0°

  const optimalPt = polarToXY(optimalCenter, labelRadius);
  const moderatePt = polarToXY(moderateCenter, labelRadius);
  const alertPt = polarToXY(alertCenter, labelRadius);

  // Needle
  const tip = polarToXY(scoreAngle, r - sw * 0.1);
  const b1 = polarToXY(scoreAngle + 90, size * 0.032);
  const b2 = polarToXY(scoreAngle - 90, size * 0.032);

  // Score text
  const scoreY = cy + r * 0.34;
  const labelCatY = scoreY + size * 0.075;

  const viewH = size * 0.86;
  const fontSize = size * 0.046;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <svg
        role="img"
        aria-label={`Inflammation score: ${score.toFixed(1)} — ${cat.label}`}
        width={size}
        height={viewH}
        viewBox={`0 0 ${size} ${viewH}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="infGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background zone arcs */}
        <path
          d={arc(180, z1, r)}
          fill="none"
          stroke="#0f2e27"
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        <path
          d={arc(z1, z2, r)}
          fill="none"
          stroke="#2e2510"
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        <path
          d={arc(z2, 0, r)}
          fill="none"
          stroke="#2e0f12"
          strokeWidth={sw}
          strokeLinecap="butt"
        />

        {/* Zone tick dividers */}
        {[z1, z2].map((angle) => {
          const inner = polarToXY(angle, r - sw * 0.55);
          const outer = polarToXY(angle, r + sw * 0.55);
          return (
            <line
              key={angle}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#0d1720"
              strokeWidth={size * 0.012}
            />
          );
        })}

        {/* Zone labels above the arc */}
        <text
          x={optimalPt.x}
          y={optimalPt.y}
          fill="#2FE6B7"
          fontSize={fontSize}
          fontWeight={600}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.06em"
          opacity={0.9}
        >
          OPTIMAL
        </text>
        <text
          x={moderatePt.x}
          y={moderatePt.y}
          fill="#F5A623"
          fontSize={fontSize}
          fontWeight={600}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.06em"
          opacity={0.9}
        >
          MODERATE
        </text>
        <text
          x={alertPt.x}
          y={alertPt.y}
          fill="#FF4D57"
          fontSize={fontSize}
          fontWeight={600}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.06em"
          opacity={0.9}
        >
          ALERT
        </text>

        {/* Active fill arc */}
        <path
          d={arc(180, scoreAngle, r)}
          fill="none"
          stroke={cat.color}
          strokeWidth={sw * 0.55}
          strokeLinecap="round"
          filter="url(#infGlow)"
          opacity={0.92}
        />

        {/* Needle */}
        <polygon
          points={`${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${b1.x.toFixed(2)},${b1.y.toFixed(2)} ${b2.x.toFixed(2)},${b2.y.toFixed(2)}`}
          fill={cat.color}
          filter="url(#infGlow)"
        />
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.036}
          fill="#141B24"
          stroke={cat.color}
          strokeWidth={1.5}
        />

        {/* Score number */}
        <text
          x={cx}
          y={scoreY}
          fill={cat.color}
          fontSize={size * 0.2}
          fontWeight="700"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          filter="url(#infGlow)"
        >
          {score.toFixed(1)}
        </text>

        {/* Category label */}
        <text
          x={cx}
          y={labelCatY}
          fill={cat.color}
          fontSize={size * 0.052}
          textAnchor="middle"
          letterSpacing="0.1em"
          fontFamily="'JetBrains Mono', monospace"
          opacity={0.85}
        >
          {cat.label}
        </text>
      </svg>

      {/* Legend row */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { label: "OPTIMAL", range: "0–3", color: "#2FE6B7" },
          { label: "MODERATE", range: "3–6", color: "#F5A623" },
          { label: "ALERT", range: "6–10", color: "#FF4D57" },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <span style={{ color: z.color, fontSize: 10 }}>●</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.07em",
                color: z.color,
              }}
            >
              {z.label}
            </span>
            <span style={{ fontSize: 10, color: "#6F7F92" }}>{z.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
