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
  <div className="flex flex-col">
    {recs.map((r) => {
      const s = catStyle[r.category];
      return (
        <div
          key={r.id}
          className="px-3 py-2.5"
          style={{ borderBottom: "1px solid #1e2a38" }}
        >
          <div className="flex flex-col gap-1.5">
            {/* Badge + timestamp row */}
            <div className="flex items-center justify-between gap-2">
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
                }}
              >
                {r.category}
              </span>
              <span
                className="text-xs flex-shrink-0"
                style={{ color: "#6F7F92" }}
              >
                {r.timestamp}
              </span>
            </div>

            {/* Title */}
            <div
              className="text-sm font-semibold leading-snug line-clamp-2"
              style={{ color: "#E8EEF6" }}
            >
              {r.title}
            </div>

            {/* Detail */}
            <div
              className="text-xs leading-relaxed"
              style={{ color: "#9AA8B8" }}
            >
              {r.detail}
            </div>

            {expanded && r.actions && (
              <ul className="mt-1 pl-4">
                {r.actions.map((a) => (
                  <li
                    key={a}
                    className="text-xs mb-1"
                    style={{ color: s.color }}
                  >
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    })}
  </div>
);
