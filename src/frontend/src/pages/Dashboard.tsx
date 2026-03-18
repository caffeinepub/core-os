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
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div
    className={`rounded-xl overflow-hidden ${className}`}
    style={{
      background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
      border: "1px solid #243041",
      borderTop: "1px solid rgba(39,224,195,0.25)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}
  >
    <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #1e2a38" }}>
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
    <div className="px-5 py-4">{children}</div>
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
    <div className="flex flex-col gap-5">
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
        <h1 className="text-2xl font-bold" style={{ color: "#E8EEF6" }}>
          Biological Dashboard
        </h1>
        <div className="text-sm mt-0.5" style={{ color: "#9AA8B8" }}>
          Last updated: {latestWearable.date} &nbsp;&middot;&nbsp; All systems
          nominal
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <Card title="Systemic Inflammation Score">
            <div className="flex flex-col items-center gap-3">
              <InflammationGauge score={inflammationScore} size={220} />
              <div className="w-full h-px" style={{ background: "#243041" }} />
              <div className="w-full flex justify-between items-center">
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
            <div className="flex flex-col gap-3">
              {inflammationDrivers.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12, color: "#9AA8B8" }}>
                      {d.name}
                    </span>
                    <div className="flex gap-2">
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
                    className="h-1 rounded overflow-hidden"
                    style={{ background: "#243041" }}
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
        <Card title="Lab Biomarker Status" className="col-span-1">
          <div>
            {biomarkers.slice(0, 5).map((m) => (
              <BiomarkerRow key={m.id} marker={m} />
            ))}
          </div>
          <div
            className="mt-3 text-center"
            style={{ fontSize: 11, color: "#6F7F92" }}
          >
            Last panel: {biomarkers[0].date}
          </div>
        </Card>

        {/* Right: AI Advisor */}
        <Card title="Core AI Advisor" className="col-span-1">
          <AdvisorFeed recs={advisorRecs.slice(0, 4)} />
        </Card>
      </div>
    </div>
  );
};
