import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SleepNight } from "../data/mockData";
import { sleepNights } from "../data/mockData";

// Sort nights ascending by date
const nights: SleepNight[] = [...sleepNights].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
);

const STAGE_COLORS: Record<string, string> = {
  awake: "#FF4D57",
  rem: "#7B5EA7",
  light: "#3A6B8A",
  deep: "#27E0C3",
};

const STAGE_LABELS: Record<string, string> = {
  awake: "AWAKE",
  rem: "REM",
  light: "LIGHT",
  deep: "DEEP",
};

const STAGE_ORDER = ["awake", "rem", "light", "deep"];

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}

function bedtimeToMinutes(bedtime: string): number {
  const [h, m] = bedtime.split(":").map(Number);
  const base = h < 12 ? h + 24 : h;
  return base * 60 + m;
}

function minutesToClockLabel(absoluteMin: number): string {
  const h = Math.floor(absoluteMin / 60) % 24;
  const m = absoluteMin % 60;
  const period = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

const Hypnogram: React.FC<{ night: SleepNight }> = ({ night }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const PADDING_LEFT = 56;
  const PADDING_RIGHT = 16;
  const PADDING_TOP = 8;
  const ROW_HEIGHT = 40;
  const CHART_HEIGHT = ROW_HEIGHT * 4 + PADDING_TOP + 16;

  const bedStartMin = bedtimeToMinutes(night.bedtime);
  const totalMin = night.totalMinutes;
  const endMin = bedStartMin + totalMin;

  const firstHour = Math.ceil(bedStartMin / 60);
  const lastHour = Math.floor(endMin / 60);
  const hourTicks: number[] = [];
  for (let h = firstHour; h <= lastHour; h++) {
    hourTicks.push(h * 60);
  }

  const toX = useCallback(
    (min: number, width: number): number => {
      const chartW = width - PADDING_LEFT - PADDING_RIGHT;
      return PADDING_LEFT + ((min - bedStartMin) / totalMin) * chartW;
    },
    [bedStartMin, totalMin],
  );

  const toY = (stage: string): number => {
    const idx = STAGE_ORDER.indexOf(stage);
    return PADDING_TOP + idx * ROW_HEIGHT;
  };

  return (
    <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
      <svg
        width="100%"
        height={CHART_HEIGHT}
        style={{ display: "block", minWidth: 480 }}
        viewBox={`0 0 800 ${CHART_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Sleep hypnogram chart"
        role="img"
      >
        <title>Sleep Architecture Hypnogram</title>

        {/* Stage row backgrounds */}
        {STAGE_ORDER.map((stage, idx) => (
          <rect
            key={stage}
            x={PADDING_LEFT}
            y={PADDING_TOP + idx * ROW_HEIGHT}
            width={800 - PADDING_LEFT - PADDING_RIGHT}
            height={ROW_HEIGHT}
            fill={idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"}
          />
        ))}

        {/* Stage labels */}
        {STAGE_ORDER.map((stage, idx) => (
          <text
            key={stage}
            x={PADDING_LEFT - 8}
            y={PADDING_TOP + idx * ROW_HEIGHT + ROW_HEIGHT / 2 + 4}
            textAnchor="end"
            fontSize={10}
            fontFamily="'JetBrains Mono', monospace"
            fontWeight={600}
            letterSpacing="0.08em"
            fill={STAGE_COLORS[stage]}
          >
            {STAGE_LABELS[stage]}
          </text>
        ))}

        {/* Horizontal grid lines */}
        {STAGE_ORDER.map((stage) => {
          const idx = STAGE_ORDER.indexOf(stage);
          return (
            <line
              key={`grid-h-${stage}`}
              x1={PADDING_LEFT}
              y1={PADDING_TOP + idx * ROW_HEIGHT}
              x2={800 - PADDING_RIGHT}
              y2={PADDING_TOP + idx * ROW_HEIGHT}
              stroke="#1e2a38"
              strokeWidth={1}
            />
          );
        })}
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP + 4 * ROW_HEIGHT}
          x2={800 - PADDING_RIGHT}
          y2={PADDING_TOP + 4 * ROW_HEIGHT}
          stroke="#1e2a38"
          strokeWidth={1}
        />

        {/* Vertical hour tick lines + labels */}
        {hourTicks.map((tickMin) => {
          const x = toX(tickMin, 800);
          return (
            <g key={tickMin}>
              <line
                x1={x}
                y1={PADDING_TOP}
                x2={x}
                y2={PADDING_TOP + 4 * ROW_HEIGHT}
                stroke="#243041"
                strokeWidth={1}
                strokeDasharray="2 4"
              />
              <text
                x={x}
                y={PADDING_TOP + 4 * ROW_HEIGHT + 14}
                textAnchor="middle"
                fontSize={9}
                fontFamily="'JetBrains Mono', monospace"
                fill="#6F7F92"
              >
                {minutesToClockLabel(tickMin)}
              </text>
            </g>
          );
        })}

        {/* Sleep segments — keyed by start/stage for stability */}
        {night.segments.map((seg) => {
          const segAbsStart = bedStartMin + seg.startMin;
          const segAbsEnd = bedStartMin + seg.endMin;
          const x1 = toX(segAbsStart, 800);
          const x2 = toX(segAbsEnd, 800);
          const w = Math.max(1, x2 - x1);
          const y = toY(seg.stage);
          const color = STAGE_COLORS[seg.stage];
          return (
            <rect
              key={`${seg.stage}-${seg.startMin}`}
              x={x1}
              y={y + 2}
              width={w}
              height={ROW_HEIGHT - 4}
              fill={color}
              opacity={0.85}
              rx={2}
            />
          );
        })}

        {/* Left axis border */}
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={PADDING_LEFT}
          y2={PADDING_TOP + 4 * ROW_HEIGHT}
          stroke="#243041"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  badge?: string;
  badgeColor?: string;
}> = ({ label, value, unit, badge, badgeColor = "#27E0C3" }) => (
  <div
    style={{
      flex: "1 1 120px",
      padding: "14px 16px",
      background: "#141B24",
      border: "1px solid #243041",
      borderTop: "1px solid rgba(39,224,195,0.25)",
      borderRadius: 10,
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#6F7F92",
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: "#27E0C3",
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1,
      }}
    >
      {value}
      {unit && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "#9AA8B8",
            marginLeft: 3,
          }}
        >
          {unit}
        </span>
      )}
    </div>
    {badge && (
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: badgeColor,
          marginTop: 5,
          letterSpacing: "0.06em",
        }}
      >
        {badge}
      </div>
    )}
  </div>
);

const TREND_METRICS = [
  { key: "sleepScore", label: "Sleep Score", color: "#27E0C3" },
  { key: "deepPct", label: "Deep %", color: "#2DD4BF" },
  { key: "remPct", label: "REM %", color: "#7B5EA7" },
  { key: "lightPct", label: "Light %", color: "#3A6B8A" },
  { key: "durationH", label: "Duration (h)", color: "#F59E0B" },
  { key: "hrv", label: "HRV (ms)", color: "#EC4899" },
];

const tipStyle = {
  background: "#1A2330",
  border: "1px solid #243041",
  color: "#E8EEF6",
  fontSize: 12,
  fontFamily: "'JetBrains Mono', monospace",
};

const TrendsSection: React.FC = () => {
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(
    new Set(["sleepScore", "deepPct", "hrv"]),
  );

  const chartData = useMemo(
    () =>
      nights.map((n) => ({
        date: formatShortDate(n.date),
        sleepScore: n.sleepScore,
        deepPct: n.deepPct,
        remPct: n.remPct,
        lightPct: n.lightPct,
        durationH: Math.round((n.totalMinutes / 60) * 10) / 10,
        hrv: n.hrv,
      })),
    [],
  );

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
        border: "1px solid #243041",
        borderTop: "1px solid rgba(39,224,195,0.25)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e2a38" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#6F7F92",
            textTransform: "uppercase",
          }}
        >
          14-NIGHT TREND ANALYSIS
        </span>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {TREND_METRICS.map((m) => {
            const isActive = activeMetrics.has(m.key);
            return (
              <button
                type="button"
                key={m.key}
                data-ocid={`sleep.${m.key}.toggle`}
                onClick={() => toggleMetric(m.key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: `1px solid ${isActive ? m.color : "#243041"}`,
                  background: isActive ? `${m.color}22` : "transparent",
                  color: isActive ? m.color : "#6F7F92",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
          >
            <CartesianGrid stroke="#1e2a38" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{
                fill: "#6F7F92",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            <YAxis
              tick={{
                fill: "#6F7F92",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            <Tooltip contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9AA8B8" }} />
            {TREND_METRICS.filter((m) => activeMetrics.has(m.key)).map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 3, fill: m.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const SleepAnalysis: React.FC = () => {
  const [nightIdx, setNightIdx] = useState(nights.length - 1);
  const [showTrends, setShowTrends] = useState(false);

  const night = nights[nightIdx];
  const durationH = (night.totalMinutes / 60).toFixed(1);

  const scoreBadge = (score: number) => {
    if (score >= 88) return { text: "EXCELLENT", color: "#27E0C3" };
    if (score >= 75) return { text: "GOOD", color: "#2DD4BF" };
    if (score >= 60) return { text: "FAIR", color: "#F59E0B" };
    return { text: "POOR", color: "#FF4D57" };
  };

  const badge = scoreBadge(night.sleepScore);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div
          style={{
            fontSize: 11,
            color: "#6F7F92",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          SLEEP INTELLIGENCE
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#E8EEF6" }}>
          Sleep Architecture
        </h1>
      </div>

      {/* Night Navigator */}
      <div
        style={{
          background: "#141B24",
          border: "1px solid #243041",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            data-ocid="sleep.pagination_prev"
            onClick={() => setNightIdx((p) => Math.max(0, p - 1))}
            disabled={nightIdx === 0}
            style={{
              background: nightIdx === 0 ? "transparent" : "#1A2330",
              border: "1px solid #243041",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: nightIdx === 0 ? "default" : "pointer",
              color: nightIdx === 0 ? "#3A4A5A" : "#9AA8B8",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              transition: "all 0.15s",
            }}
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#E8EEF6",
                letterSpacing: "0.04em",
              }}
            >
              {formatDate(night.date)}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6F7F92",
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: 2,
              }}
            >
              {night.bedtime} → {night.wakeTime}
            </div>
          </div>

          <button
            type="button"
            data-ocid="sleep.pagination_next"
            onClick={() =>
              setNightIdx((p) => Math.min(nights.length - 1, p + 1))
            }
            disabled={nightIdx === nights.length - 1}
            style={{
              background:
                nightIdx === nights.length - 1 ? "transparent" : "#1A2330",
              border: "1px solid #243041",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: nightIdx === nights.length - 1 ? "default" : "pointer",
              color: nightIdx === nights.length - 1 ? "#3A4A5A" : "#9AA8B8",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              transition: "all 0.15s",
            }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Night dots */}
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {nights.map((n, i) => (
            <button
              type="button"
              key={n.date}
              data-ocid={`sleep.item.${i + 1}`}
              onClick={() => setNightIdx(i)}
              title={formatDate(n.date)}
              style={{
                width: i === nightIdx ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  i === nightIdx
                    ? "#27E0C3"
                    : n.sleepScore >= 85
                      ? "#2D4A5A"
                      : n.sleepScore >= 70
                        ? "#2A3A4A"
                        : "#1A2835",
                border: i === nightIdx ? "none" : "1px solid #243041",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Score quick-view */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: badge.color,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {night.sleepScore}
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: badge.color,
                letterSpacing: "0.1em",
              }}
            >
              {badge.text}
            </div>
            <div style={{ fontSize: 11, color: "#6F7F92" }}>SLEEP SCORE</div>
          </div>
        </div>
      </div>

      {/* Hypnogram */}
      <div
        style={{
          background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
          border: "1px solid #243041",
          borderTop: "1px solid rgba(39,224,195,0.25)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #1e2a38",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#6F7F92",
              textTransform: "uppercase",
            }}
          >
            Sleep Architecture — {formatDate(night.date)}
          </span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {STAGE_ORDER.map((stage) => (
              <div
                key={stage}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: STAGE_COLORS[stage],
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: "#9AA8B8",
                    letterSpacing: "0.06em",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 20px 20px" }}>
          <Hypnogram night={night} />
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard
          label="Sleep Score"
          value={night.sleepScore}
          badge={badge.text}
          badgeColor={badge.color}
        />
        <StatCard
          label="Duration"
          value={durationH}
          unit="h"
          badge={Number(durationH) >= 7 ? "OPTIMAL" : "SHORT"}
          badgeColor={Number(durationH) >= 7 ? "#27E0C3" : "#F59E0B"}
        />
        <StatCard
          label="Deep Sleep"
          value={night.deepPct}
          unit="%"
          badge={night.deepPct >= 20 ? "OPTIMAL" : "LOW"}
          badgeColor={night.deepPct >= 20 ? "#27E0C3" : "#F59E0B"}
        />
        <StatCard
          label="REM Sleep"
          value={night.remPct}
          unit="%"
          badge={night.remPct >= 20 ? "OPTIMAL" : "LOW"}
          badgeColor={night.remPct >= 20 ? "#27E0C3" : "#F59E0B"}
        />
        <StatCard
          label="HRV"
          value={night.hrv}
          unit="ms"
          badge={night.hrv >= 50 ? "STRONG" : "MODERATE"}
          badgeColor={night.hrv >= 50 ? "#27E0C3" : "#F59E0B"}
        />
        <StatCard
          label="Efficiency"
          value={night.efficiency}
          unit="%"
          badge={night.efficiency >= 90 ? "HIGH" : "NORMAL"}
          badgeColor={night.efficiency >= 90 ? "#27E0C3" : "#9AA8B8"}
        />
      </div>

      {/* Trends toggle */}
      <button
        type="button"
        data-ocid="sleep.trends.toggle"
        onClick={() => setShowTrends((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 20px",
          background: showTrends ? "rgba(39,224,195,0.08)" : "#141B24",
          border: `1px solid ${
            showTrends ? "rgba(39,224,195,0.4)" : "#243041"
          }`,
          borderRadius: 10,
          cursor: "pointer",
          color: showTrends ? "#27E0C3" : "#9AA8B8",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "all 0.2s",
        }}
      >
        {showTrends ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showTrends ? "Hide 14-Night Trends" : "Show 14-Night Trends"}
      </button>

      {showTrends && <TrendsSection />}
    </div>
  );
};
