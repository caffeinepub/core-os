import { Progress } from "@/components/ui/progress";
import {
  Battery,
  CheckCircle,
  Clock,
  Dna,
  Flame,
  FlaskConical,
  Lock,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BadgeProgress {
  current: number;
  target: number;
  unit: string;
}

interface BadgeData {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress?: BadgeProgress;
}

interface ChallengeData {
  id: string;
  label: string;
  progress: number;
  target: number;
  unit: string;
  xpReward: number;
  icon: React.ReactNode;
}

interface StreakData {
  label: string;
  days: number;
  status: "active" | "broken" | "completed";
}

interface XpSource {
  label: string;
  xp: number;
  weight: number;
  color: string;
}

// ─── Demo data ────────────────────────────────────────────────────────────────
const LEVEL = 12;
const XP_CURRENT = 2450;
const XP_NEXT = 3000;
const XP_TOTAL = 14250;

const badges: BadgeData[] = [
  {
    id: "inflammation_opt",
    label: "Inflammation Optimized",
    description: "hs-CRP below 1.0 for 30 days",
    icon: <Flame size={20} />,
    unlocked: true,
    xpReward: 500,
    rarity: "epic",
  },
  {
    id: "deep_sleeper",
    label: "Deep Sleeper",
    description: "8h+ sleep streak for 14 nights",
    icon: <Battery size={20} />,
    unlocked: true,
    xpReward: 300,
    rarity: "rare",
  },
  {
    id: "biohacker",
    label: "Biohacker",
    description: "Uploaded 5+ blood lab reports",
    icon: <FlaskConical size={20} />,
    unlocked: true,
    xpReward: 250,
    rarity: "rare",
  },
  {
    id: "early_adopter",
    label: "Early Adopter",
    description: "Joined CORE-OS in the first wave",
    icon: <Star size={20} />,
    unlocked: true,
    xpReward: 150,
    rarity: "common",
  },
  {
    id: "hrv_champion",
    label: "HRV Champion",
    description: "30-day HRV stability maintained",
    icon: <Zap size={20} />,
    unlocked: false,
    xpReward: 500,
    rarity: "epic",
    progress: { current: 14, target: 30, unit: "days" },
  },
  {
    id: "protocol_master",
    label: "Protocol Master",
    description: "90-day unbroken protocol streak",
    icon: <Shield size={20} />,
    unlocked: false,
    xpReward: 1000,
    rarity: "legendary",
    progress: { current: 47, target: 90, unit: "days" },
  },
  {
    id: "squad_leader",
    label: "Squad Leader",
    description: "Created your first Longevity Squad",
    icon: <Users size={20} />,
    unlocked: false,
    xpReward: 400,
    rarity: "rare",
    progress: { current: 0, target: 1, unit: "squads created" },
  },
  {
    id: "longevity_pioneer",
    label: "Longevity Pioneer",
    description: "Composite Longevity Score above 800",
    icon: <Dna size={20} />,
    unlocked: false,
    xpReward: 1500,
    rarity: "legendary",
    progress: { current: 680, target: 800, unit: "longevity score" },
  },
];

const challenges: ChallengeData[] = [
  {
    id: "protocol_streak",
    label: "7-Day Protocol Streak",
    progress: 5,
    target: 7,
    unit: "days",
    xpReward: 200,
    icon: <Shield size={14} />,
  },
  {
    id: "hrv_stability",
    label: "HRV Stability Challenge",
    progress: 14,
    target: 30,
    unit: "days",
    xpReward: 500,
    icon: <Zap size={14} />,
  },
  {
    id: "hsCRP_target",
    label: "hs-CRP Below 1.0",
    progress: 1,
    target: 3,
    unit: "consecutive panels",
    xpReward: 350,
    icon: <FlaskConical size={14} />,
  },
  {
    id: "sleep_score",
    label: "Sleep Score ≥ 85 for 10 Nights",
    progress: 6,
    target: 10,
    unit: "nights",
    xpReward: 300,
    icon: <Battery size={14} />,
  },
];

const streaks: StreakData[] = [
  { label: "Protocol Adherence", days: 47, status: "active" },
  { label: "HRV Target Hit", days: 22, status: "active" },
  { label: "Sleep Target", days: 15, status: "active" },
  { label: "Lab Upload Streak", days: 8, status: "active" },
  { label: "Daily Check-in", days: 63, status: "active" },
];

const XP_SOURCES: XpSource[] = [
  { label: "Protocol Streaks", xp: 8200, weight: 35, color: "var(--accent)" },
  { label: "HRV Target Days", xp: 3100, weight: 25, color: "var(--warning)" },
  { label: "Sleep Quality Nights", xp: 1800, weight: 20, color: "#3B82F6" },
  {
    label: "Biomarker Improvements",
    xp: 1150,
    weight: 20,
    color: "var(--success)",
  },
];

const rarityColors: Record<
  string,
  { bg: string; border: string; label: string; text: string; glow: string }
> = {
  common: {
    bg: "rgba(154,168,184,0.08)",
    border: "rgba(154,168,184,0.25)",
    label: "#9AA8B8",
    text: "#9AA8B8",
    glow: "rgba(154,168,184,0.35)",
  },
  rare: {
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.3)",
    label: "#3B82F6",
    text: "#60A5FA",
    glow: "rgba(59,130,246,0.4)",
  },
  epic: {
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.3)",
    label: "#A855F7",
    text: "#C084FC",
    glow: "rgba(168,85,247,0.4)",
  },
  legendary: {
    bg: "rgba(245,166,35,0.08)",
    border: "rgba(245,166,35,0.3)",
    label: "#F5A623",
    text: "#FBB040",
    glow: "rgba(245,166,35,0.45)",
  },
};

const statusStyle: Record<string, { color: string; label: string }> = {
  active: { color: "var(--success)", label: "ACTIVE" },
  broken: { color: "var(--alert-red)", label: "BROKEN" },
  completed: { color: "var(--text-muted)", label: "DONE" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div
    className={`rounded-xl overflow-hidden ${className}`}
    style={{
      background: "var(--card-gradient)",
      border: "1px solid var(--border)",
      borderTop: "1px solid var(--card-border-top)",
      boxShadow: "var(--card-shadow)",
    }}
  >
    <div
      className="px-5 py-3.5"
      style={{ borderBottom: "1px solid var(--divider)" }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

// Badge card with hover effects
const BadgeCard: React.FC<{ badge: BadgeData; index: number }> = ({
  badge,
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  const rc = rarityColors[badge.rarity];
  const prog = badge.progress;
  const progPct = prog ? Math.round((prog.current / prog.target) * 100) : 0;

  return (
    <div
      key={badge.id}
      data-ocid={`achievements.badge.item.${index + 1}`}
      className="rounded-lg p-3 flex flex-col items-center gap-2 text-center relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: badge.unlocked ? rc.bg : "var(--surface-2)",
        border: `1px solid ${
          hovered ? rc.label : badge.unlocked ? rc.border : "var(--border)"
        }`,
        opacity: badge.unlocked ? 1 : 0.72,
        cursor: "default",
        transition: "all 0.18s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 6px 20px ${rc.glow}, 0 0 0 1px ${rc.label}40`
          : "none",
      }}
    >
      {!badge.unlocked && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            color: "var(--text-muted)",
          }}
        >
          <Lock size={10} />
        </div>
      )}
      {badge.unlocked && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            color: "var(--success)",
          }}
        >
          <CheckCircle size={10} />
        </div>
      )}

      {/* Icon circle */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: badge.unlocked ? `${rc.label}18` : "var(--border)",
          color: badge.unlocked ? rc.label : "var(--text-muted)",
          transition: "all 0.18s",
        }}
      >
        {badge.icon}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: badge.unlocked ? "var(--text-primary)" : "var(--text-muted)",
          lineHeight: 1.3,
        }}
      >
        {badge.label}
      </div>

      {/* Description — always visible */}
      <div
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          lineHeight: 1.45,
          textAlign: "center",
        }}
      >
        {badge.description}
      </div>

      {/* Rarity pill */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: rc.label,
          textTransform: "uppercase",
        }}
      >
        {badge.rarity}
      </div>

      {/* XP reward */}
      <div
        style={{
          fontSize: 10,
          color: badge.unlocked ? "var(--warning)" : "var(--text-muted)",
        }}
      >
        +{badge.xpReward} XP
      </div>

      {/* Locked badge progress bar */}
      {!badge.unlocked && prog && (
        <div style={{ width: "100%", marginTop: 2 }}>
          <div
            style={{
              width: "100%",
              height: 4,
              background: "var(--border)",
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 3,
            }}
          >
            <div
              style={{
                width: `${progPct}%`,
                height: "100%",
                background: rc.label,
                borderRadius: 2,
                transition: "width 0.3s",
                opacity: 0.85,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 9,
              color: rc.label,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              textAlign: "center",
            }}
          >
            {prog.current}/{prog.target} {prog.unit}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const Achievements: React.FC = () => {
  const xpPct = Math.round((XP_CURRENT / XP_NEXT) * 100);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalXpFromSources = XP_SOURCES.reduce((s, x) => s + x.xp, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          GAMIFICATION MODULE
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Performance Core
        </h1>
        <div
          className="text-sm mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Track your longevity milestones, active challenges, and earned badges
        </div>

        {/* XP system context */}
        <div
          className="mt-3 px-3 py-2 rounded-lg inline-flex items-start gap-2"
          style={{
            background: "rgba(39,224,195,0.06)",
            border: "1px solid rgba(39,224,195,0.18)",
          }}
        >
          <Zap
            size={13}
            style={{ color: "var(--accent)", marginTop: 1, flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: "var(--accent)" }}>Health-XP</strong> is
            earned through protocol adherence, measurable biomarker
            improvements, and wearable performance targets — not activity
            counts.
          </span>
        </div>
      </div>

      {/* XP Overview + Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XP Card */}
        <div
          data-ocid="achievements.panel"
          className="md:col-span-2 rounded-xl p-5"
          style={{
            background: "var(--card-gradient)",
            border: "1px solid var(--border)",
            borderTop: "1px solid var(--card-border-top)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Current Rank
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 36,
                    fontWeight: 700,
                    color: "var(--accent)",
                    lineHeight: 1,
                  }}
                >
                  LV.{LEVEL}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  Bioptimizer
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                TOTAL XP EARNED
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--warning)",
                }}
              >
                {XP_TOTAL.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-2 flex justify-between">
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Progress to Level {LEVEL + 1}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "var(--accent)",
              }}
            >
              {XP_CURRENT} / {XP_NEXT} XP
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 8,
              background: "var(--border)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              className="xp-bar-fill"
              style={{
                width: `${xpPct}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, var(--accent), var(--warning))",
                borderRadius: 4,
                boxShadow: "0 0 8px var(--accent-glow)",
              }}
            />
          </div>
          <div
            className="flex gap-4 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--divider)" }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                BADGES EARNED
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {unlockedCount}
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  /{badges.length}
                </span>
              </div>
            </div>
            <div
              style={{
                width: 1,
                height: 36,
                background: "var(--border)",
                alignSelf: "center",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                ACTIVE CHALLENGES
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {challenges.length}
              </div>
            </div>
            <div
              style={{
                width: 1,
                height: 36,
                background: "var(--border)",
                alignSelf: "center",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                LONGEST STREAK
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--success)",
                }}
              >
                63d
              </div>
            </div>
          </div>
        </div>

        {/* Next level preview */}
        <div
          className="rounded-xl p-5 flex flex-col justify-between"
          style={{
            background: "var(--card-gradient)",
            border: "1px solid var(--border)",
            borderTop: "1px solid var(--card-border-top)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Next Milestone
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Level 13: Longevity Architect
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Unlock squad creation, advanced analytics overlays, and the
              Protocol Master challenge.
            </div>
          </div>
          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              XP needed
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--warning)",
              }}
            >
              {XP_NEXT - XP_CURRENT} XP
            </div>
          </div>
        </div>
      </div>

      {/* Active Challenges */}
      <SectionCard title="Active Challenges">
        <div className="flex flex-col gap-4">
          {challenges.map((ch, i) => {
            const pct = Math.round((ch.progress / ch.target) * 100);
            return (
              <div
                key={ch.id}
                data-ocid={`achievements.challenge.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{ color: "var(--accent)" }}>{ch.icon}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {ch.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {ch.progress}/{ch.target} {ch.unit}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--warning)",
                        background: "var(--warning-dim)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        letterSpacing: "0.05em",
                      }}
                    >
                      +{ch.xpReward} XP
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 6,
                    background: "var(--border)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="xp-bar-fill"
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background:
                        pct >= 80
                          ? "var(--success)"
                          : pct >= 40
                            ? "var(--accent)"
                            : "var(--warning)",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    marginTop: 3,
                    textAlign: "right",
                  }}
                >
                  {pct}% complete
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Badge Collection */}
      <SectionCard
        title={`Badge Collection — ${unlockedCount} / ${badges.length} Earned`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {badges.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} index={i} />
          ))}
        </div>
      </SectionCard>

      {/* Streak Log */}
      <SectionCard title="Active Streak Log">
        <div className="flex flex-col gap-2">
          {streaks.map((s, i) => {
            const st = statusStyle[s.status];
            return (
              <div
                key={s.label}
                data-ocid={`achievements.streak.item.${i + 1}`}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Clock size={13} style={{ color: st.color }} />
                  <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color: st.color,
                    }}
                  >
                    {s.days}d
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: st.color,
                      background: `${st.color}14`,
                      padding: "2px 6px",
                      borderRadius: 3,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* XP Source Breakdown */}
      <SectionCard title="XP Source Breakdown">
        <div className="flex flex-col gap-3">
          {XP_SOURCES.map((src) => {
            const barPct = Math.round((src.xp / totalXpFromSources) * 100);
            return (
              <div key={src.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {src.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: src.color,
                        fontWeight: 700,
                      }}
                    >
                      {src.xp.toLocaleString()} XP
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        padding: "1px 6px",
                        borderRadius: 3,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {src.weight}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 6,
                    background: "var(--border)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${barPct}%`,
                      height: "100%",
                      background: src.color,
                      borderRadius: 3,
                      opacity: 0.9,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div
            className="flex items-center justify-between pt-3 mt-1"
            style={{ borderTop: "1px solid var(--divider)" }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Total Earned
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--warning)",
              }}
            >
              {totalXpFromSources.toLocaleString()} XP
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
