import type React from "react";

interface Props {
  score: number; // 0–10
  size?: number;
}

const getCategory = (score: number) => {
  if (score < 3) return { label: "LOW — OPTIMAL", color: "#2FE6B7" };
  if (score < 6) return { label: "MODERATE", color: "#F5A623" };
  return { label: "HIGH — ALERT", color: "#FF4D57" };
};

export const InflammationGauge: React.FC<Props> = ({ score, size = 200 }) => {
  const cx = size / 2;
  const cy = size * 0.54; // pivot point — arc hangs below this
  const r = size * 0.38;
  const sw = size * 0.072; // stroke width

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Math convention: 0° = right, 90° = up
  // Gauge: 180° (left) = score 0, 0° (right) = score 10
  const polarToXY = (deg: number, radius: number) => ({
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy - radius * Math.sin(toRad(deg)),
  });

  // Draw arc from startDeg → endDeg (both in math degrees, going counter-clockwise)
  // sweep=0 in SVG = counter-clockwise when y-axis is flipped = draws the upper arc
  const arc = (startDeg: number, endDeg: number, radius: number) => {
    const s = polarToXY(startDeg, radius);
    const e = polarToXY(endDeg, radius);
    const large = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };

  // Score maps 0→180° (left) … 10→0° (right)
  const scoreAngle = 180 - (Math.max(0, Math.min(10, score)) / 10) * 180;

  const cat = getCategory(score);

  // Zone boundaries (in degrees)
  const z1 = 180 - 3 * 18; // score 3 → 126°
  const z2 = 180 - 6 * 18; // score 6 → 72°

  // Needle
  const tip = polarToXY(scoreAngle, r - sw * 0.1);
  const b1 = polarToXY(scoreAngle + 90, size * 0.032);
  const b2 = polarToXY(scoreAngle - 90, size * 0.032);

  // Labels below arc ends
  const lowPt = polarToXY(180, r);
  const highPt = polarToXY(0, r);
  const labelY = cy + sw * 0.6 + size * 0.062;

  // Score text sits below needle pivot
  const scoreY = cy + r * 0.34;
  const labelCatY = scoreY + size * 0.075;

  const viewH = size * 0.84;

  return (
    <svg
      role="img"
      aria-label={`Inflammation score: ${score.toFixed(1)} — ${cat.label}`}
      width={size}
      height={viewH}
      viewBox={`0 0 ${size} ${viewH}`}
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

      {/* ── Background zone arcs ── */}
      {/* Green zone: 180°→126° */}
      <path
        d={arc(180, z1, r)}
        fill="none"
        stroke="#0f2e27"
        strokeWidth={sw}
        strokeLinecap="butt"
      />
      {/* Orange zone: 126°→72° */}
      <path
        d={arc(z1, z2, r)}
        fill="none"
        stroke="#2e2510"
        strokeWidth={sw}
        strokeLinecap="butt"
      />
      {/* Red zone: 72°→0° */}
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

      {/* ── Active fill arc ── */}
      <path
        d={arc(180, scoreAngle, r)}
        fill="none"
        stroke={cat.color}
        strokeWidth={sw * 0.55}
        strokeLinecap="round"
        filter="url(#infGlow)"
        opacity={0.92}
      />

      {/* ── Needle ── */}
      <polygon
        points={`${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${b1.x.toFixed(2)},${b1.y.toFixed(2)} ${b2.x.toFixed(2)},${b2.y.toFixed(2)}`}
        fill={cat.color}
        filter="url(#infGlow)"
      />
      {/* Pivot dot */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.036}
        fill="#141B24"
        stroke={cat.color}
        strokeWidth={1.5}
      />

      {/* ── LOW / HIGH side labels ── */}
      <text
        x={lowPt.x - sw * 0.3}
        y={labelY}
        fill="#4A5A6A"
        fontSize={size * 0.052}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.04em"
      >
        LOW
      </text>
      <text
        x={highPt.x + sw * 0.3}
        y={labelY}
        fill="#4A5A6A"
        fontSize={size * 0.052}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.04em"
      >
        HIGH
      </text>

      {/* ── Score number ── */}
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

      {/* ── Category label ── */}
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
  );
};
