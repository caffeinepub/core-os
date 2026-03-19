import type React from "react";
import { useState } from "react";

interface Props {
  score: number; // 0–10
  size?: number;
  delta?: number; // trend delta, e.g. -0.4
}

const getCategory = (score: number) => {
  if (score < 3) return { label: "OPTIMAL", color: "#2FE6B7" };
  if (score < 6) return { label: "MODERATE", color: "#F5A623" };
  return { label: "ALERT", color: "#FF4D57" };
};

const ZONE_INFO = [
  {
    label: "OPTIMAL",
    range: "0–3",
    color: "#2FE6B7",
    description:
      "Anti-aging zone. Chronic inflammation suppressed. Associated with longevity and disease prevention.",
  },
  {
    label: "MODERATE",
    range: "3–6",
    color: "#F5A623",
    description:
      "Elevated. Monitor closely. Intervention via diet, sleep, and stress reduction recommended.",
  },
  {
    label: "ALERT",
    range: "6–10",
    color: "#FF4D57",
    description:
      "High systemic inflammation. Active health risk. Consult clinician and review protocol stack.",
  },
];

export const InflammationGauge: React.FC<Props> = ({
  score,
  size = 200,
  delta = -0.4,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

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

  const z1 = 180 - 3 * 18;
  const z2 = 180 - 6 * 18;

  const labelRadius = r + sw * 1.15;
  const optimalPt = polarToXY(153, labelRadius);
  const moderatePt = polarToXY(99, labelRadius);
  const alertPt = polarToXY(36, labelRadius);

  // Fixed: needle tip pulled back so it doesn't touch the arc
  const tip = polarToXY(scoreAngle, r - sw * 0.72);
  const b1 = polarToXY(scoreAngle + 90, size * 0.032);
  const b2 = polarToXY(scoreAngle - 90, size * 0.032);

  const scoreY = cy + r * 0.34;
  const labelCatY = scoreY + size * 0.075;

  const viewH = size * 0.86;
  const fontSize = size * 0.046;

  const trendSign = delta >= 0 ? "+" : "";
  const trendColor = delta <= 0 ? "#2FE6B7" : "#FF4D57";

  return (
    <div
      className="flex flex-col items-center gap-3 w-full"
      style={{ position: "relative" }}
    >
      {/* Gauge SVG — hover/click toggles tooltip */}
      <button
        type="button"
        style={{
          position: "relative",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
        }}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onClick={() => setTooltipVisible((v) => !v)}
        aria-label="Show inflammation score details"
      >
        <svg
          role="img"
          aria-label={`Inflammation score: ${score.toFixed(1)} — ${cat.label}`}
          width={size}
          height={viewH}
          viewBox={`0 0 ${size} ${viewH}`}
          style={{ overflow: "visible", display: "block" }}
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

          {/* Zone labels */}
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

        {/* Hover indicator ring */}
        {tooltipVisible && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        )}
      </button>

      {/* Rich tooltip panel */}
      {tooltipVisible && (
        <div
          style={{
            position: "absolute",
            top: viewH + 8,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            width: 320,
            borderRadius: 10,
            background: "var(--card-gradient, #0d1720)",
            border: `1px solid ${cat.color}40`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${cat.color}20`,
            padding: "14px 16px",
            pointerEvents: "none",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--text-muted, #6F7F92)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Systemic Inflammation Score
          </div>

          {/* What it measures */}
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary, #9FB3C8)",
              lineHeight: 1.55,
              marginBottom: 10,
              borderBottom: "1px solid var(--border, rgba(255,255,255,0.07))",
              paddingBottom: 10,
            }}
          >
            A composite inflammation index derived from{" "}
            <strong style={{ color: "var(--text-primary, #E8F0F7)" }}>
              hs-CRP, IL-6, white blood cell count, HRV variability,
            </strong>{" "}
            and{" "}
            <strong style={{ color: "var(--text-primary, #E8F0F7)" }}>
              sleep quality score
            </strong>
            .
          </p>

          {/* Current reading */}
          <div
            className="flex items-center justify-between"
            style={{
              marginBottom: 10,
              padding: "8px 10px",
              borderRadius: 6,
              background: `${cat.color}12`,
              border: `1px solid ${cat.color}30`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted, #6F7F92)",
                  letterSpacing: "0.08em",
                  marginBottom: 2,
                }}
              >
                CURRENT SCORE
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: cat.color,
                  lineHeight: 1,
                }}
              >
                {score.toFixed(1)}
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted, #6F7F92)",
                    marginLeft: 4,
                  }}
                >
                  / 10
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted, #6F7F92)",
                  letterSpacing: "0.08em",
                  marginBottom: 2,
                }}
              >
                7-DAY TREND
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 16,
                  fontWeight: 700,
                  color: trendColor,
                }}
              >
                {trendSign}
                {delta.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Zone breakdown */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--text-muted, #6F7F92)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Zone Reference
          </div>
          <div className="flex flex-col gap-1.5">
            {ZONE_INFO.map((z) => {
              const isActive = cat.label === z.label;
              return (
                <div
                  key={z.label}
                  style={{
                    borderRadius: 6,
                    padding: "7px 10px",
                    background: isActive ? `${z.color}14` : "transparent",
                    border: `1px solid ${isActive ? `${z.color}40` : "transparent"}`,
                    transition: "all 0.15s",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: z.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        color: z.color,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {z.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted, #6F7F92)",
                        marginLeft: "auto",
                      }}
                    >
                      {z.range}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: z.color,
                          background: `${z.color}18`,
                          padding: "1px 5px",
                          borderRadius: 3,
                          letterSpacing: "0.06em",
                        }}
                      >
                        YOU ARE HERE
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary, #9FB3C8)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {z.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Hover hint */}
      <div
        style={{
          fontSize: 10,
          color: "var(--text-muted, #6F7F92)",
          letterSpacing: "0.06em",
          textAlign: "center",
          marginTop: -4,
        }}
      >
        hover or tap for score breakdown
      </div>
    </div>
  );
};
