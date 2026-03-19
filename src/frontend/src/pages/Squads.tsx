import {
  ChevronUp,
  Copy,
  Crown,
  Dna,
  FlaskConical,
  Heart,
  Loader2,
  LogIn,
  Plus,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeaderboardMember {
  rank: number;
  alias: string;
  level: number;
  longevityScore: number;
  protocolStreak: number;
  weeklyDelta: number;
  isYou: boolean;
}

// ─── Demo data ────────────────────────────────────────────────────────────────
const SQUAD_NAME = "Biohacker Circle";

const leaderboard: LeaderboardMember[] = [
  {
    rank: 1,
    alias: "NovaBrain",
    level: 14,
    longevityScore: 847,
    protocolStreak: 52,
    weeklyDelta: 23,
    isYou: true,
  },
  {
    rank: 2,
    alias: "CyberSage",
    level: 12,
    longevityScore: 791,
    protocolStreak: 47,
    weeklyDelta: 18,
    isYou: false,
  },
  {
    rank: 3,
    alias: "NeoCortex",
    level: 11,
    longevityScore: 703,
    protocolStreak: 38,
    weeklyDelta: 12,
    isYou: false,
  },
  {
    rank: 4,
    alias: "QuantumPulse",
    level: 9,
    longevityScore: 621,
    protocolStreak: 29,
    weeklyDelta: 8,
    isYou: false,
  },
];

const scoreWeights = [
  {
    label: "Protocol Adherence",
    weight: 35,
    icon: <Shield size={14} />,
    color: "#27e0c3",
  },
  {
    label: "HRV / Recovery Score",
    weight: 25,
    icon: <Zap size={14} />,
    color: "#3B82F6",
  },
  {
    label: "Sleep Quality Score",
    weight: 20,
    icon: <Heart size={14} />,
    color: "#A855F7",
  },
  {
    label: "Inflammation (inverted)",
    weight: 20,
    icon: <FlaskConical size={14} />,
    color: "#F5A623",
  },
];

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export const Squads: React.FC = () => {
  const { actor } = useActor();
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [squadNameInput, setSquadNameInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleGenerateInvite = async () => {
    if (!actor) return;
    setIsGenerating(true);
    try {
      const code = await actor.generateInviteCode();
      setInviteCode(code);
      toast.success("Invite code generated!");
    } catch {
      toast.error("Failed to generate invite code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    toast.success("Copied to clipboard!");
  };

  const handleCreateSquad = () => {
    if (!squadNameInput.trim()) {
      toast.error("Please enter a squad name");
      return;
    }
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      toast.success(
        `Squad "${squadNameInput}" created! You're the Squad Leader.`,
      );
      setSquadNameInput("");
    }, 1200);
  };

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={14} style={{ color: "#F5A623" }} />;
    if (rank === 2) return <Trophy size={14} style={{ color: "#9AA8B8" }} />;
    if (rank === 3) return <Trophy size={14} style={{ color: "#CD7F32" }} />;
    return (
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: "var(--text-muted)",
          fontWeight: 600,
        }}
      >
        #{rank}
      </span>
    );
  };

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
          SOCIAL PERFORMANCE
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Longevity Squads
        </h1>
        <div
          className="text-sm mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Compete with your trusted circle — invite-only, alias-protected
          leaderboards
        </div>
      </div>

      {/* Auth gate notice */}
      {!isLoggedIn && (
        <div
          data-ocid="squads.auth.panel"
          className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid var(--border-glow)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 2,
              }}
            >
              Connect Identity to unlock Squad features
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Invite generation, squad creation, and live sync require
              authentication.
            </div>
          </div>
          <button
            type="button"
            data-ocid="squads.login.button"
            onClick={() => login()}
            disabled={isLoggingIn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              cursor: isLoggingIn ? "wait" : "pointer",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              opacity: isLoggingIn ? 0.7 : 1,
            }}
          >
            {isLoggingIn ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {isLoggingIn ? "Connecting..." : "Connect Identity"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My Squad Card */}
        <SectionCard title="My Squad">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "var(--accent-dim)",
                  border: "1px solid var(--border-glow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                <Users size={20} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {SQUAD_NAME}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  4 members • Private
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {leaderboard.map((m) => (
                <div
                  key={m.alias}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                  style={{
                    background: m.isYou
                      ? "var(--accent-dim)"
                      : "var(--surface-2)",
                    border: `1px solid ${m.isYou ? "var(--border-glow)" : "var(--border)"}`,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {rankIcon(m.rank)}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: m.isYou ? 700 : 400,
                      color: m.isYou ? "var(--accent)" : "var(--text-primary)",
                      flex: 1,
                    }}
                  >
                    {m.alias}
                    {m.isYou && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: "var(--accent)",
                          background: "var(--accent-dim)",
                          padding: "1px 5px",
                          borderRadius: 3,
                          marginLeft: 6,
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {m.longevityScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Score Formula Card */}
        <SectionCard title="Composite Longevity Score">
          <div className="flex flex-col gap-1 mb-3">
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Score normalised to{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                0 – 1000 pts
              </strong>{" "}
              using four weighted biomarkers.
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {scoreWeights.map((sw) => (
              <div key={sw.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: sw.color }}>{sw.icon}</span>
                    <span
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      {sw.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: sw.color,
                    }}
                  >
                    {sw.weight}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 5,
                    background: "var(--border)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${sw.weight * (100 / 35)}%`,
                      height: "100%",
                      background: sw.color,
                      borderRadius: 3,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Invite + Create */}
        <div className="flex flex-col gap-4">
          {/* Invite section */}
          <SectionCard title="Invite to Squad">
            <div className="flex flex-col gap-3">
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                Generate a one-time invite link for a trusted contact.
              </div>
              <button
                type="button"
                data-ocid="squads.invite.button"
                onClick={handleGenerateInvite}
                disabled={!isLoggedIn || isGenerating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 0",
                  background: isLoggedIn ? "var(--accent)" : "var(--surface-2)",
                  color: isLoggedIn ? "#fff" : "var(--text-muted)",
                  border: "none",
                  borderRadius: 7,
                  cursor:
                    isLoggedIn && !isGenerating ? "pointer" : "not-allowed",
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: isGenerating ? 0.7 : 1,
                  width: "100%",
                }}
              >
                {isGenerating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                {isLoggedIn ? "Generate Invite Code" : "Login to Generate"}
              </button>

              {inviteCode && (
                <div
                  data-ocid="squads.invite.panel"
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-glow)",
                  }}
                >
                  <code
                    style={{
                      flex: 1,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--accent)",
                      wordBreak: "break-all",
                    }}
                  >
                    {inviteCode}
                  </code>
                  <button
                    type="button"
                    data-ocid="squads.invite.copy.button"
                    onClick={handleCopyCode}
                    title="Copy invite code"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      flexShrink: 0,
                      padding: 4,
                    }}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Create squad section */}
          <SectionCard title="Create New Squad">
            <div className="flex flex-col gap-3">
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                Create an invite-only squad. You become the Squad Leader.
              </div>
              <input
                type="text"
                data-ocid="squads.create.input"
                placeholder="e.g. Marathon Prep Squad"
                value={squadNameInput}
                onChange={(e) => setSquadNameInput(e.target.value)}
                disabled={!isLoggedIn}
                onKeyDown={(e) => e.key === "Enter" && handleCreateSquad()}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  color: "var(--text-primary)",
                  fontSize: 13,
                  outline: "none",
                  cursor: isLoggedIn ? "text" : "not-allowed",
                }}
              />
              <button
                type="button"
                data-ocid="squads.create.button"
                onClick={handleCreateSquad}
                disabled={!isLoggedIn || isCreating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 0",
                  background: isLoggedIn
                    ? "var(--surface-2)"
                    : "var(--surface-2)",
                  color: isLoggedIn
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  border: `1px solid ${isLoggedIn ? "var(--border)" : "var(--border)"}`,
                  borderRadius: 7,
                  cursor: isLoggedIn && !isCreating ? "pointer" : "not-allowed",
                  fontSize: 13,
                  fontWeight: 600,
                  width: "100%",
                  opacity: isCreating ? 0.7 : 1,
                }}
              >
                {isCreating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Users size={14} />
                )}
                {isCreating ? "Creating..." : "Create Squad"}
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Full Leaderboard */}
      <SectionCard title={`${SQUAD_NAME} — Full Leaderboard`}>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "Rank",
                  "Alias",
                  "Level",
                  "Longevity Score",
                  "Protocol Streak",
                  "Weekly Δ",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "6px 12px",
                      textAlign: col === "Rank" ? "center" : "left",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((m, i) => (
                <tr
                  key={m.alias}
                  data-ocid={`squads.leaderboard.item.${i + 1}`}
                  style={{
                    borderBottom: "1px solid var(--divider)",
                    background: m.isYou ? "var(--accent-dim)" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      width: 48,
                    }}
                  >
                    {rankIcon(m.rank)}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: m.isYou ? 700 : 500,
                          color: m.isYou
                            ? "var(--accent)"
                            : "var(--text-primary)",
                        }}
                      >
                        {m.alias}
                      </span>
                      {m.isYou && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: "var(--accent)",
                            background: "var(--accent-dim)",
                            padding: "1px 5px",
                            borderRadius: 3,
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      Lv.{m.level}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 14,
                          fontWeight: 700,
                          color:
                            m.rank === 1
                              ? "var(--warning)"
                              : "var(--text-primary)",
                        }}
                      >
                        {m.longevityScore}
                      </span>
                      <span
                        style={{ fontSize: 10, color: "var(--text-muted)" }}
                      >
                        pts
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {m.protocolStreak}d
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div className="flex items-center gap-1">
                      <ChevronUp
                        size={12}
                        style={{ color: "var(--success)" }}
                      />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--success)",
                        }}
                      >
                        +{m.weeklyDelta}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Score methodology note */}
        <div
          className="mt-4 px-3 py-2.5 rounded-lg flex items-center gap-2"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
          }}
        >
          <Dna
            size={13}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Longevity Score = Protocol Adherence (35%) + HRV Score (25%) + Sleep
            Quality (20%) + Inflammation Index (20%), normalised to 1000 pts.
            Absolute biomarker values are never shared — only improvement
            deltas.
          </span>
        </div>
      </SectionCard>
    </div>
  );
};
