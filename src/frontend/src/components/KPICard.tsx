import type React from "react";

interface SparklineProps {
  values: number[];
}

const Sparkline: React.FC<SparklineProps> = ({ values }) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const h = 32;
  const w = 80;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      role="img"
      aria-label="sparkline"
      width={w}
      height={h}
      className="opacity-70"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="#27E0C3"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  status?: "optimal" | "suboptimal" | "alert" | "neutral";
  sparklineValues?: number[];
  icon?: React.ReactNode;
}

const statusColor: Record<string, string> = {
  optimal: "#2FE6B7",
  suboptimal: "#F5A623",
  alert: "#FF4D57",
  neutral: "#9AA8B8",
};

export const KPICard: React.FC<Props> = ({
  label,
  value,
  unit,
  subtitle,
  status = "neutral",
  sparklineValues,
  icon,
}) => {
  const color = statusColor[status];
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
        border: "1px solid #243041",
        borderTop: `1px solid ${color}40`,
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: `0 0 20px rgba(0,0,0,0.4), inset 0 1px 0 ${color}20`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#6F7F92",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {icon && <span style={{ color: "#6F7F92", opacity: 0.8 }}>{icon}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && <span style={{ fontSize: 13, color: "#9AA8B8" }}>{unit}</span>}
      </div>
      {sparklineValues && <Sparkline values={sparklineValues} />}
      {subtitle && (
        <span style={{ fontSize: 12, color: "#9AA8B8" }}>{subtitle}</span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 2,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            color,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};
