import type React from "react";
import type { AdvisorRecommendation } from "../data/mockData";

const catStyle: Record<string, { color: string; bg: string; border: string }> =
  {
    ALERT: {
      color: "#FF4D57",
      bg: "rgba(255,77,87,0.1)",
      border: "rgba(255,77,87,0.3)",
    },
    INSIGHT: {
      color: "#27E0C3",
      bg: "rgba(39,224,195,0.1)",
      border: "rgba(39,224,195,0.3)",
    },
    ADVICE: {
      color: "#F5A623",
      bg: "rgba(245,166,35,0.1)",
      border: "rgba(245,166,35,0.3)",
    },
    FOCUS: {
      color: "#9AA8B8",
      bg: "rgba(154,168,184,0.1)",
      border: "rgba(154,168,184,0.3)",
    },
  };

interface Props {
  recs: AdvisorRecommendation[];
  expanded?: boolean;
}

export const AdvisorFeed: React.FC<Props> = ({ recs, expanded = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {recs.map((r) => {
      const s = catStyle[r.category];
      return (
        <div
          key={r.id}
          style={{
            padding: expanded ? "14px 16px" : "10px 12px",
            borderBottom: "1px solid #1e2a38",
            background: "transparent",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: s.color,
                background: s.bg,
                border: `1px solid ${s.border}`,
                padding: "2px 5px",
                borderRadius: 3,
                whiteSpace: "nowrap",
                marginTop: 2,
              }}
            >
              {r.category}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#E8EEF6",
                  marginBottom: 3,
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#9AA8B8",
                  lineHeight: 1.5,
                }}
              >
                {expanded
                  ? r.detail
                  : `${r.detail.slice(0, 90)}${r.detail.length > 90 ? "..." : ""}`}
              </div>
              {expanded && r.actions && (
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {r.actions.map((a) => (
                    <li
                      key={a}
                      style={{
                        fontSize: 12,
                        color: s.color,
                        marginBottom: 3,
                      }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span
              style={{ fontSize: 11, color: "#6F7F92", whiteSpace: "nowrap" }}
            >
              {r.timestamp}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);
