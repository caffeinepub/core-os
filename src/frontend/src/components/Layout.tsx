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

const headerTabs = [
  { label: "Dashboard", page: "dashboard" },
  { label: "Biometrics", page: "biometrics" },
  { label: "Sleep", page: "sleep" },
  { label: "Labs", page: "labs" },
  { label: "AI Advisor", page: "advisor" },
  { label: "Protocols", page: "protocols" },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <header
        className="flex items-center px-4 gap-3 flex-shrink-0 z-50"
        style={{
          height: 60,
          background: "#0d1218",
          borderBottom: "1px solid #243041",
        }}
      >
        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center p-1 md:hidden"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9AA8B8",
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
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

        {/* Nav tabs — scrollable on mobile */}
        <nav
          className="flex gap-0.5 overflow-x-auto ml-4 md:ml-6 flex-1"
          style={{ scrollbarWidth: "none" }}
        >
          {headerTabs.map((tab) => {
            const isActive = activePage === tab.page;
            return (
              <button
                type="button"
                key={tab.page}
                data-ocid={`nav.${tab.page}.link`}
                onClick={() => onNavigate(tab.page)}
                className="flex-shrink-0"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#27E0C3" : "#9AA8B8",
                  borderBottom: isActive
                    ? "2px solid #27E0C3"
                    : "2px solid transparent",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right actions — hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <Zap size={14} style={{ color: "#27E0C3" }} />
          <span
            className="hidden md:inline"
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
            className="flex items-center gap-2 px-2.5 py-1 rounded"
            style={{ background: "#1A2330", border: "1px solid #243041" }}
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 flex flex-col gap-1 ${sidebarOpen ? "block" : "hidden"} md:flex`}
          style={{
            width: 220,
            background: "#0d1218",
            borderRight: "1px solid #243041",
            padding: "20px 12px",
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
            const isActive = activePage === item.id;
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
              Garmin <span style={{ color: "#4A5A6A" }}>|</span> 2 min ago
            </div>
            <div style={{ fontSize: 12, color: "#9AA8B8", marginTop: 1 }}>
              Apple Health <span style={{ color: "#4A5A6A" }}>|</span> 5 min ago
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
          {/* Footer */}
          <div
            className="mt-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            style={{ borderTop: "1px solid #243041" }}
          >
            <span style={{ fontSize: 11, color: "#6F7F92" }}>
              CORE-OS &copy; {new Date().getFullYear()} &nbsp;&middot;&nbsp;{" "}
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
