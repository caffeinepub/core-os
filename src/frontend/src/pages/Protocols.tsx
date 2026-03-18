import type React from "react";
import { useState } from "react";
import { type Protocol, protocols as defaultProtocols } from "../data/mockData";

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "#2FE6B7", bg: "rgba(47,230,183,0.1)" },
  paused: { color: "#F5A623", bg: "rgba(245,166,35,0.1)" },
  completed: { color: "#9AA8B8", bg: "rgba(154,168,184,0.1)" },
};

const categoryColor: Record<string, string> = {
  Exercise: "#27E0C3",
  Supplementation: "#7B5EA7",
  Hormesis: "#FF8C42",
  Metabolic: "#3B82F6",
  default: "#9AA8B8",
};

export const Protocols: React.FC = () => {
  const [protos, setProtos] = useState<Protocol[]>(defaultProtocols);
  const [filter, setFilter] = useState<
    "all" | "active" | "paused" | "completed"
  >("all");

  const filtered =
    filter === "all" ? protos : protos.filter((p) => p.status === filter);
  const counts = {
    all: protos.length,
    active: protos.filter((p) => p.status === "active").length,
    paused: protos.filter((p) => p.status === "paused").length,
    completed: protos.filter((p) => p.status === "completed").length,
  };

  const toggle = (id: string) => {
    setProtos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "paused" : "active" }
          : p,
      ),
    );
  };

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
          LONGEVITY MODULE
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#E8EEF6" }}>
          Longevity Protocols
        </h1>
        <div style={{ fontSize: 13, color: "#9AA8B8", marginTop: 2 }}>
          Evidence-based interventions for performance optimization
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["all", "active", "paused", "completed"] as const).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px",
              borderRadius: 6,
              cursor: "pointer",
              border:
                filter === f
                  ? "1px solid rgba(39,224,195,0.4)"
                  : "1px solid #243041",
              background: filter === f ? "rgba(39,224,195,0.08)" : "#141B24",
              color: filter === f ? "#27E0C3" : "#9AA8B8",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Protocol cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {filtered.map((p) => {
          const ss = statusStyle[p.status];
          const cc = categoryColor[p.category] || categoryColor.default;
          return (
            <div
              key={p.id}
              style={{
                background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
                border: "1px solid #243041",
                borderTop: `1px solid ${cc}40`,
                borderRadius: 12,
                padding: "18px 20px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      color: cc,
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: 4,
                      display: "block",
                    }}
                  >
                    {p.category}
                  </span>
                  <h3
                    style={{ fontSize: 15, fontWeight: 600, color: "#E8EEF6" }}
                  >
                    {p.title}
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: ss.color,
                      background: ss.bg,
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {p.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    style={{
                      fontSize: 11,
                      color: "#9AA8B8",
                      background: "none",
                      border: "1px solid #243041",
                      padding: "3px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {p.status === "active" ? "Pause" : "Resume"}
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#9AA8B8",
                  lineHeight: 1.6,
                  marginBottom: 10,
                }}
              >
                {p.description}
              </p>
              {p.notes && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#F5A623",
                    padding: "6px 10px",
                    background: "rgba(245,166,35,0.08)",
                    borderRadius: 6,
                    border: "1px solid rgba(245,166,35,0.2)",
                  }}
                >
                  &#x1F4CB; {p.notes}
                </div>
              )}
              <div style={{ fontSize: 11, color: "#6F7F92", marginTop: 10 }}>
                Started: {p.startDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
