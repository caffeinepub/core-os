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
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "biometrics", label: "Biometrics", icon: Activity },
  { id: "sleep", label: "Sleep Analysis", icon: Moon },
  { id: "labs", label: "Labs & Biomarkers", icon: FlaskConical },
  { id: "advisor", label: "AI Advisor", icon: Brain },
  { id: "protocols", label: "Protocols", icon: Shield },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 60,
          background: "#0d1218",
          borderBottom: "1px solid #243041",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9AA8B8",
            padding: 4,
            display: "flex",
          }}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Heart size={20} style={{ color: "#27E0C3" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            CORE-<span style={{ color: "#27E0C3" }}>OS</span>
          </span>
        </div>

        {/* Nav tabs */}
        <nav style={{ display: "flex", gap: 2, marginLeft: 24 }}>
          {["Dashboard", "Biometrics", "Labs", "AI Advisor", "Protocols"].map(
            (tab) => {
              const pageMap: Record<string, string> = {
                Dashboard: "dashboard",
                Biometrics: "biometrics",
                Labs: "labs",
                "AI Advisor": "advisor",
                Protocols: "protocols",
              };
              const page = pageMap[tab];
              const isActive = activePage === page;
              return (
                <button
                  type="button"
                  key={tab}
                  onClick={() => onNavigate(page)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#27E0C3" : "#9AA8B8",
                    borderBottom: isActive
                      ? "2px solid #27E0C3"
                      : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              );
            },
          )}
        </nav>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Zap size={14} style={{ color: "#27E0C3" }} />
          <span
            style={{
              fontSize: 11,
              color: "#27E0C3",
              letterSpacing: "0.1em",
              fontWeight: 500,
            }}
          >
            SYSTEM: OPERATIONAL
          </span>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA8B8",
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
              color: "#9AA8B8",
            }}
          >
            <Settings size={16} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              background: "#1A2330",
              borderRadius: 6,
              border: "1px solid #243041",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2FE6B7",
                boxShadow: "0 0 6px #2FE6B7",
              }}
            />
            <span style={{ fontSize: 12, color: "#9AA8B8" }}>Alex R.</span>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            style={{
              width: 220,
              background: "#0d1218",
              borderRight: "1px solid #243041",
              padding: "20px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#6F7F92",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 12px 8px",
                marginBottom: 4,
              }}
            >
              MODULES
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.id ||
                (item.id === "sleep" && activePage === "biometrics");
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() =>
                    onNavigate(item.id === "sleep" ? "biometrics" : item.id)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "none",
                    background: isActive
                      ? "rgba(39, 224, 195, 0.1)"
                      : "transparent",
                    color: isActive ? "#27E0C3" : "#9AA8B8",
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    textAlign: "left",
                    width: "100%",
                    boxShadow: isActive ? "inset 2px 0 0 #27E0C3" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}

            <div
              style={{
                marginTop: "auto",
                padding: "12px",
                borderTop: "1px solid #243041",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#6F7F92",
                  letterSpacing: "0.08em",
                }}
              >
                LAST SYNC
              </div>
              <div style={{ fontSize: 12, color: "#27E0C3", marginTop: 2 }}>
                Garmin {"\u2022"} 2 min ago
              </div>
              <div style={{ fontSize: 12, color: "#9AA8B8", marginTop: 1 }}>
                Apple Health {"\u2022"} 5 min ago
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {children}
          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 16,
              borderTop: "1px solid #243041",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "#6F7F92" }}>
              CORE-OS &copy; 2026 &nbsp;&middot;&nbsp;{" "}
              <span style={{ color: "#9AA8B8", cursor: "pointer" }}>
                Privacy
              </span>
              &nbsp;&middot;&nbsp;{" "}
              <span style={{ color: "#9AA8B8", cursor: "pointer" }}>
                Support
              </span>
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#27E0C3",
                letterSpacing: "0.08em",
              }}
            >
              &#x2B21; SYSTEM STATUS: OPERATIONAL
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};
