import { Activity, Brain, Heart, Moon } from "lucide-react";
import type React from "react";
import { AdvisorFeed } from "../components/AdvisorFeed";
import { BiomarkerRow } from "../components/BiomarkerRow";
import { InflammationGauge } from "../components/InflammationGauge";
import { KPICard } from "../components/KPICard";
import {
  advisorRecs,
  biomarkers,
  hrvHistory,
  inflammationDrivers,
  inflammationScore,
  latestWearable,
} from "../data/mockData";

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, style }) => (
  <div
    style={{
      background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
      border: "1px solid #243041",
      borderTop: "1px solid rgba(39,224,195,0.25)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      ...style,
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
        {title}
      </span>
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const SparkPath: React.FC = () => {
  const points = Array.from({ length: 30 }, (_, i) => {
    const v = 3.2 + Math.sin(i * 0.5) * 0.6;
    return { x: (i / 29) * 200, y: 32 - (v / 10) * 32 };
  });
  const d = points.reduce(
    (acc, pt, i) =>
      i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`,
    "",
  );
  return (
    <path
      d={d}
      fill="none"
      stroke="#27E0C3"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  );
};

export const Dashboard: React.FC = () => {
  const hrvVals = hrvHistory.map((h) => h.value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page title */}
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
          COMMAND CENTER
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#E8EEF6" }}>
          Biological Dashboard
        </h1>
        <div style={{ fontSize: 13, color: "#9AA8B8", marginTop: 2 }}>
          Last updated: {latestWearable.date} &nbsp;&middot;&nbsp; All systems
          nominal
        </div>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        <KPICard
          label="Heart Rate Variability"
          value={latestWearable.hrv}
          unit="ms"
          status="optimal"
          subtitle="14-day avg trending +13%"
          sparklineValues={hrvVals.slice(-12)}
          icon={<Heart size={14} />}
        />
        <KPICard
          label="Body Battery"
          value={latestWearable.bodyBattery}
          unit="%"
          status="optimal"
          subtitle="Fully recovered"
          icon={<Activity size={14} />}
        />
        <KPICard
          label="Sleep Score"
          value={latestWearable.sleepScore}
          status="optimal"
          subtitle={`${latestWearable.sleepDuration}h \u00b7 Deep ${latestWearable.deepSleepPct}%`}
          icon={<Moon size={14} />}
        />
        <KPICard
          label="Stress Level"
          value={latestWearable.stressLevel}
          subtitle="Low \u2014 Calm"
          status="optimal"
          icon={<Brain size={14} />}
        />
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Systemic Inflammation Score">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <InflammationGauge score={inflammationScore} size={220} />
              <div
                style={{ width: "100%", height: 1, background: "#243041" }}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#6F7F92",
                    letterSpacing: "0.08em",
                  }}
                >
                  30-DAY TREND
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#2FE6B7",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  &#x2193; -0.4 pts
                </span>
              </div>
              <svg
                role="img"
                aria-label="30-day inflammation trend"
                width="100%"
                height={32}
                viewBox="0 0 200 32"
                preserveAspectRatio="none"
              >
                <SparkPath />
              </svg>
            </div>
          </Card>

          <Card title="Inflammation Drivers (AI-Derived)">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {inflammationDrivers.map((d) => (
                <div key={d.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#9AA8B8" }}>
                      {d.name}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#E8EEF6",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {d.value}%
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: d.delta.startsWith("+")
                            ? "#2FE6B7"
                            : "#FF4D57",
                        }}
                      >
                        {d.delta}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "#243041",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${d.value}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #1FD6B8, #27E0C3)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center: Biomarkers */}
        <Card title="Lab Biomarker Status" style={{ alignSelf: "start" }}>
          <div>
            {biomarkers.slice(0, 5).map((m) => (
              <BiomarkerRow key={m.id} marker={m} />
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 11,
              color: "#6F7F92",
              textAlign: "center",
            }}
          >
            Last panel: {biomarkers[0].date}
          </div>
        </Card>

        {/* Right: AI Advisor */}
        <Card title="Core AI Advisor" style={{ alignSelf: "start" }}>
          <AdvisorFeed recs={advisorRecs.slice(0, 4)} />
        </Card>
      </div>
    </div>
  );
};
