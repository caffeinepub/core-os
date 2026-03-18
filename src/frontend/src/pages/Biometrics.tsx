import { ArrowRight } from "lucide-react";
import type React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  bodyBatteryHistory,
  hrvHistory,
  latestWearable,
  sleepNights,
} from "../data/mockData";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => (
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
        {title}
      </span>
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const tipStyle = {
  background: "#1A2330",
  border: "1px solid #243041",
  color: "#E8EEF6",
  fontSize: 12,
};

const stressData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  avg: [38, 45, 32, 28, 35, 22, 24][i],
  peak: [72, 85, 58, 54, 63, 40, 42][i],
}));

interface BiometricsProps {
  onNavigate?: (page: string) => void;
}

export const Biometrics: React.FC<BiometricsProps> = ({ onNavigate }) => {
  const lastNight = sleepNights[0]; // latest night

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
          WEARABLE TELEMETRY
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#E8EEF6" }}>
          Biometrics & Wearables
        </h1>
      </div>

      {/* Sync Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
        {[
          {
            name: "Garmin Connect",
            status: "LIVE",
            detail: "HRV · Body Battery · Sleep · Stress",
            color: "#2FE6B7",
          },
          {
            name: "Apple HealthKit",
            status: "SYNCED",
            detail: "ECG · VO2 Max · Resting HR",
            color: "#2FE6B7",
          },
        ].map((d) => (
          <div
            key={d.name}
            style={{
              padding: "14px 18px",
              background: "#141B24",
              border: "1px solid #243041",
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E8EEF6" }}>
                {d.name}
              </div>
              <div style={{ fontSize: 11, color: "#9AA8B8", marginTop: 2 }}>
                {d.detail}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(47,230,183,0.1)",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid rgba(47,230,183,0.3)",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: d.color,
                  boxShadow: `0 0 6px ${d.color}`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: d.color,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                {d.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
        <div className="md:col-span-2">
          <Card title="HRV — 30 Day Trend (ms)">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hrvHistory}>
                <CartesianGrid stroke="#1e2a38" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: "#6F7F92", fontSize: 11 }} />
                <YAxis
                  domain={[40, 75]}
                  tick={{ fill: "#6F7F92", fontSize: 11 }}
                />
                <Tooltip contentStyle={tipStyle} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#27E0C3"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#27E0C3" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Sleep Analysis compact card */}
        <div>
          <div
            style={{
              background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
              border: "1px solid #243041",
              borderTop: "1px solid rgba(39,224,195,0.25)",
              borderRadius: 12,
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #1e2a38",
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
                Sleep Analysis
              </span>
            </div>
            <div
              style={{
                padding: "16px 20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: lastNight.sleepScore >= 85 ? "#27E0C3" : "#F59E0B",
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1,
                }}
              >
                {lastNight.sleepScore}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "#6F7F92",
                    marginLeft: 6,
                  }}
                >
                  SCORE
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  {
                    label: "Deep Sleep",
                    value: `${lastNight.deepPct}%`,
                    color: "#27E0C3",
                  },
                  {
                    label: "REM Sleep",
                    value: `${lastNight.remPct}%`,
                    color: "#7B5EA7",
                  },
                  {
                    label: "Duration",
                    value: `${(lastNight.totalMinutes / 60).toFixed(1)}h`,
                    color: "#9AA8B8",
                  },
                  {
                    label: "HRV",
                    value: `${lastNight.hrv} ms`,
                    color: "#EC4899",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#6F7F92" }}>{row.label}</span>
                    <span
                      style={{
                        color: row.color,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                data-ocid="biometrics.sleep.button"
                onClick={() => onNavigate?.("sleep")}
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 14px",
                  background: "rgba(39,224,195,0.08)",
                  border: "1px solid rgba(39,224,195,0.3)",
                  borderRadius: 8,
                  cursor: onNavigate ? "pointer" : "default",
                  color: "#27E0C3",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  transition: "all 0.15s",
                }}
              >
                Open Sleep Analysis
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
        <Card title="Body Battery — Weekly">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bodyBatteryHistory}>
              <CartesianGrid stroke="#1e2a38" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#6F7F92", fontSize: 11 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#6F7F92", fontSize: 11 }}
              />
              <Tooltip contentStyle={tipStyle} />
              <Bar
                dataKey="value"
                fill="#27E0C3"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Stress Level — Weekly (Avg vs Peak)">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stressData}>
              <CartesianGrid stroke="#1e2a38" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#6F7F92", fontSize: 11 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#6F7F92", fontSize: 11 }}
              />
              <Tooltip contentStyle={tipStyle} />
              <Bar
                dataKey="avg"
                fill="#27E0C3"
                radius={[2, 2, 0, 0]}
                opacity={0.7}
                name="Avg"
              />
              <Bar
                dataKey="peak"
                fill="#FF4D57"
                radius={[2, 2, 0, 0]}
                opacity={0.5}
                name="Peak"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 12 }}>
        {[
          {
            label: "VO2 Max",
            value: latestWearable.vo2Max,
            unit: "mL/kg/min",
            status: "Excellent",
          },
          {
            label: "Resting HR",
            value: latestWearable.rhr,
            unit: "bpm",
            status: "Athletic",
          },
          {
            label: "Sleep Duration",
            value: latestWearable.sleepDuration,
            unit: "h avg",
            status: "Optimal",
          },
          {
            label: "Deep Sleep",
            value: latestWearable.deepSleepPct,
            unit: "%",
            status: "Good",
          },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              padding: "14px 16px",
              background: "#141B24",
              border: "1px solid #243041",
              borderTop: "1px solid rgba(39,224,195,0.2)",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#6F7F92",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#27E0C3",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {m.value}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#9AA8B8",
                  marginLeft: 4,
                }}
              >
                {m.unit}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#2FE6B7", marginTop: 4 }}>
              {m.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
