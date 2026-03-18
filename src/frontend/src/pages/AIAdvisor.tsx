import type React from "react";
import { useState } from "react";
import { AdvisorFeed } from "../components/AdvisorFeed";
import { advisorRecs } from "../data/mockData";

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

const EmojiRating: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  emojis: string[];
}> = ({ label, value, onChange, emojis }) => (
  <div>
    <div
      style={{
        fontSize: 11,
        color: "#6F7F92",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      {emojis.map((e, i) => (
        <button
          type="button"
          // biome-ignore lint/suspicious/noArrayIndexKey: static emoji array
          key={i}
          onClick={() => onChange(i + 1)}
          style={{
            fontSize: 22,
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
            border: value === i + 1 ? "2px solid #27E0C3" : "2px solid #243041",
            background: value === i + 1 ? "rgba(39,224,195,0.1)" : "#141B24",
            filter: value === i + 1 ? "none" : "grayscale(80%)",
            transition: "all 0.15s",
          }}
        >
          {e}
        </button>
      ))}
    </div>
  </div>
);

export const AIAdvisor: React.FC = () => {
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [submitted, setSubmitted] = useState(false);

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
          AI MODULE
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#E8EEF6" }}>
          Core AI Advisor
        </h1>
        <div style={{ fontSize: 13, color: "#9AA8B8", marginTop: 2 }}>
          Rule-based intelligence correlating biomarkers and wearable telemetry
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <Card title={`Recommendations \u2014 ${advisorRecs.length} Active`}>
          <AdvisorFeed recs={advisorRecs} expanded />
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Daily check-in */}
          <Card title="Daily Check-In">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>&#x2713;</div>
                <div style={{ fontSize: 13, color: "#2FE6B7" }}>
                  Logged successfully
                </div>
                <div style={{ fontSize: 12, color: "#9AA8B8", marginTop: 4 }}>
                  Correlating with HRV data...
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMood(0);
                    setEnergy(0);
                  }}
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: "#9AA8B8",
                    background: "none",
                    border: "1px solid #243041",
                    padding: "6px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Log Again
                </button>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <EmojiRating
                  label="Mood"
                  value={mood}
                  onChange={setMood}
                  emojis={[
                    "\uD83D\uDE1E",
                    "\uD83D\uDE10",
                    "\uD83D\uDE42",
                    "\uD83D\uDE0A",
                    "\uD83E\uDD29",
                  ]}
                />
                <EmojiRating
                  label="Energy"
                  value={energy}
                  onChange={setEnergy}
                  emojis={[
                    "\uD83E\uDEAB",
                    "\uD83D\uDE34",
                    "\u26A1",
                    "\uD83D\uDD25",
                    "\uD83D\uDCAB",
                  ]}
                />
                <button
                  type="button"
                  disabled={!mood || !energy}
                  onClick={() => setSubmitted(true)}
                  style={{
                    padding: "10px",
                    borderRadius: 8,
                    cursor: mood && energy ? "pointer" : "not-allowed",
                    background: mood && energy ? "#27E0C3" : "#243041",
                    color: mood && energy ? "#0B0F14" : "#6F7F92",
                    fontWeight: 600,
                    fontSize: 13,
                    border: "none",
                    transition: "all 0.15s",
                  }}
                >
                  Submit Check-In
                </button>
              </div>
            )}
          </Card>

          {/* Signal summary */}
          <Card title="Signal Summary">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  label: "Alerts",
                  value: advisorRecs.filter((r) => r.category === "ALERT")
                    .length,
                  color: "#FF4D57",
                },
                {
                  label: "Insights",
                  value: advisorRecs.filter((r) => r.category === "INSIGHT")
                    .length,
                  color: "#27E0C3",
                },
                {
                  label: "Advice",
                  value: advisorRecs.filter((r) => r.category === "ADVICE")
                    .length,
                  color: "#F5A623",
                },
                {
                  label: "Focus Areas",
                  value: advisorRecs.filter((r) => r.category === "FOCUS")
                    .length,
                  color: "#9AA8B8",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#9AA8B8" }}>
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 18,
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
