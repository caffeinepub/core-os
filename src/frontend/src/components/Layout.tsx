import {
  Activity,
  Bell,
  Brain,
  FlaskConical,
  Heart,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Shield,
  Star,
  Sun,
  Swords,
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

// ─── Nav groups ───────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "HEALTH",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        shortLabel: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "biometrics",
        label: "Biometrics",
        shortLabel: "Biometrics",
        icon: Activity,
      },
      { id: "sleep", label: "Sleep Analysis", shortLabel: "Sleep", icon: Moon },
      {
        id: "labs",
        label: "Labs & Biomarkers",
        shortLabel: "Labs",
        icon: FlaskConical,
      },
    ],
  },
  {
    label: "INTEL",
    items: [
      {
        id: "advisor",
        label: "AI Advisor",
        shortLabel: "AI Advisor",
        icon: Brain,
      },
      {
        id: "protocols",
        label: "Protocols",
        shortLabel: "Protocols",
        icon: Shield,
      },
    ],
  },
  {
    label: "SOCIAL",
    items: [
      {
        id: "achievements",
        label: "Achievements",
        shortLabel: "Achievements",
        icon: Star,
      },
      {
        id: "squads",
        label: "Longevity Squads",
        shortLabel: "Squads",
        icon: Swords,
      },
    ],
  },
];

// Flat list for sidebar (keeps backward compat)
const navItems = NAV_GROUPS.flatMap((g) => g.items);

// Sidebar badge info per item
const SIDEBAR_BADGES: Record<string, string> = {
  achievements: "4 active",
  squads: "Rank #2",
};

// Demo XP data
const PLAYER_LEVEL = 12;
const XP_CURRENT = 2450;
const XP_NEXT = 3000;
const xpPct = Math.round((XP_CURRENT / XP_NEXT) * 100);

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({
  activePage,
  onNavigate,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isClinic = theme === "clinic";

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        transition: "background 0.25s",
      }}
    >
      {/* ── Header ── */}
      <header
        className="flex items-center px-4 gap-3 flex-shrink-0 z-50"
        style={{
          height: 60,
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--border)",
          boxShadow: isClinic ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center p-1 md:hidden"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Heart size={20} style={{ color: "var(--accent)" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
            }}
          >
            CORE-<span style={{ color: "var(--accent)" }}>OS</span>
          </span>
        </div>

        {/* ── Grouped nav tabs ── */}
        <nav
          className="flex items-center gap-0 overflow-x-auto ml-4 md:ml-6 flex-1"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className="flex items-center">
              {/* Vertical divider between groups */}
              {gi > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 28,
                    background: "var(--border)",
                    margin: "0 6px",
                    flexShrink: 0,
                    opacity: 0.7,
                  }}
                />
              )}

              {/* Group label */}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  padding: "0 6px",
                  flexShrink: 0,
                  display: "none", // hidden on small nav, shown via className below
                }}
                className="lg:inline"
              >
                {group.label}
              </span>

              {/* Tab buttons */}
              {group.items.map((tab) => {
                const isActive = activePage === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    data-ocid={`nav.${tab.id}.link`}
                    onClick={() => onNavigate(tab.id)}
                    className="flex items-center gap-1.5 flex-shrink-0"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 9px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? "var(--nav-active)"
                        : "var(--text-secondary)",
                      borderBottom: isActive
                        ? "2px solid var(--nav-active)"
                        : "2px solid transparent",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon
                      size={13}
                      style={{
                        color: isActive
                          ? "var(--nav-active)"
                          : "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    />
                    {tab.shortLabel}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Right section */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {/* XP / Level HUD */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md"
            style={{
              background: isClinic ? "#eef6ff" : "#0e1924",
              border: `1px solid ${isClinic ? "#bfdbfe" : "rgba(39,224,195,0.25)"}`,
            }}
            title={`Level ${PLAYER_LEVEL} — ${XP_CURRENT} / ${XP_NEXT} XP`}
          >
            <Zap size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.06em",
              }}
            >
              LV.{PLAYER_LEVEL}
            </span>
            <div
              style={{
                width: 52,
                height: 4,
                background: "var(--border)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                className="xp-bar-fill"
                style={{
                  width: `${xpPct}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, var(--accent), var(--accent-hover, var(--accent)))",
                  borderRadius: 2,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {XP_CURRENT}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            data-ocid="nav.theme.toggle"
            onClick={toggleTheme}
            title={
              isClinic ? "Switch to Command (Dark)" : "Switch to Clinic (Light)"
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: isClinic ? "#f1f5f9" : "#1a2330",
              border: `1px solid ${isClinic ? "#d1dce8" : "#2e3f52"}`,
              color: "var(--text-secondary)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              transition: "all 0.2s",
            }}
          >
            {isClinic ? (
              <Moon size={13} style={{ color: "var(--text-muted)" }} />
            ) : (
              <Sun size={13} style={{ color: "#f5a623" }} />
            )}
            <span style={{ color: "var(--text-secondary)" }}>
              {isClinic ? "CMD" : "LAB"}
            </span>
          </button>

          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <Bell size={16} />
          </button>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <Settings size={16} />
          </button>

          {/* User chip */}
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--success)",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Alex R.
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          className={`flex-shrink-0 flex flex-col gap-0.5 ${
            sidebarOpen ? "block" : "hidden"
          } md:flex`}
          style={{
            width: 220,
            background: "var(--header-bg)",
            borderRight: "1px solid var(--border)",
            padding: "16px 10px",
            transition: "background 0.25s",
          }}
        >
          {NAV_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 12 : 0 }}
            >
              {/* Group label */}
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "4px 12px 6px",
                  marginBottom: 2,
                }}
              >
                {group.label}
              </div>

              {/* Group items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const badge = SIDEBAR_BADGES[item.id];
                const isGameItem =
                  item.id === "achievements" || item.id === "squads";
                return (
                  <button
                    type="button"
                    key={item.id}
                    data-ocid={`sidebar.${item.id}.link`}
                    onClick={() => {
                      onNavigate(item.id);
                      setSidebarOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      border: "none",
                      background: isActive
                        ? "var(--sidebar-active-bg)"
                        : "transparent",
                      color: isActive
                        ? "var(--nav-active)"
                        : "var(--text-secondary)",
                      fontSize: 13,
                      fontWeight: isActive ? 500 : 400,
                      textAlign: "left",
                      width: "100%",
                      boxShadow: isActive
                        ? "var(--sidebar-active-shadow)"
                        : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon
                      size={15}
                      style={{
                        color: isActive
                          ? "var(--nav-active)"
                          : isGameItem
                            ? "var(--warning)"
                            : "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {badge && !isActive && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          color: isGameItem
                            ? "var(--warning)"
                            : "var(--accent)",
                          background: isGameItem
                            ? "var(--warning-dim)"
                            : "rgba(39,224,195,0.12)",
                          padding: "2px 5px",
                          borderRadius: 3,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Group separator */}
              {gi < NAV_GROUPS.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "10px 12px 0",
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          ))}

          {/* Sidebar XP display (mobile) */}
          <div
            className="md:hidden mx-3 mt-2 p-3 rounded-lg"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                LV.{PLAYER_LEVEL}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {XP_CURRENT} / {XP_NEXT} XP
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 4,
                background: "var(--border)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                className="xp-bar-fill"
                style={{
                  width: `${xpPct}%`,
                  height: "100%",
                  background: "var(--accent)",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "12px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
              }}
            >
              LAST SYNC
            </div>
            <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 2 }}>
              Garmin <span style={{ color: "var(--text-muted)" }}>|</span> 2 min
              ago
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginTop: 1,
              }}
            >
              Apple Health <span style={{ color: "var(--text-muted)" }}>|</span>{" "}
              5 min ago
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
          <div
            className="mt-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              CORE-OS &copy; {new Date().getFullYear()} &nbsp;&middot;&nbsp;{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                Built with caffeine.ai
              </a>
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--accent)",
                letterSpacing: "0.08em",
              }}
            >
              &#x2B21; SYSTEM: OPERATIONAL
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

// keep flat navItems export for any consumers
export { navItems };
