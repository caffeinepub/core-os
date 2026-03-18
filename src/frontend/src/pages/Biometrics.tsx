import type React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  bodyBatteryHistory,
  hrvHistory,
  latestWearable,
} from "../data/mockData";

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
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

const sleepData = [
  { name: "Deep", value: latestWearable.deepSleepPct, color: "#27E0C3" },
  { name: "REM", value: latestWearable.remPct, color: "#7B5EA7" },
  { name: "Light", value: latestWearable.lightSleepPct, color: "#3A5A6A" },
  {
    name: "Awake",
    value:
      100 -
      latestWearable.deepSleepPct -
      latestWearable.remPct -
      latestWearable.lightSleepPct,
    color: "#243041",
  },
];

const stressData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  avg: [38, 45, 32, 28, 35, 22, 24][i],
  peak: [72, 85, 58, 54, 63, 40, 42][i],
}));

export const Biometrics: React.FC = () => (
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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <Card title="HRV — 30 Day Trend (ms)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hrvHistory}>
            <CartesianGrid stroke="#1e2a38" strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: "#6F7F92", fontSize: 11 }} />
            <YAxis domain={[40, 75]} tick={{ fill: "#6F7F92", fontSize: 11 }} />
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

      <Card title="Sleep Architecture">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <PieChart width={160} height={160}>
            <Pie
              data={sleepData}
              cx={80}
              cy={80}
              innerRadius={45}
              outerRadius={70}
              dataKey="value"
              strokeWidth={0}
            >
              {sleepData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {sleepData.map((d) => (
            <div
              key={d.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: d.color,
                  }}
                />
                <span style={{ color: "#9AA8B8" }}>{d.name}</span>
              </div>
              <span
                style={{
                  color: "#E8EEF6",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card title="Body Battery — Weekly">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={bodyBatteryHistory}>
            <CartesianGrid stroke="#1e2a38" strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: "#6F7F92", fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6F7F92", fontSize: 11 }} />
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
            <YAxis domain={[0, 100]} tick={{ fill: "#6F7F92", fontSize: 11 }} />
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
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
