import type React from "react";
import { useState } from "react";
import { Layout } from "./components/Layout";
import { AIAdvisor } from "./pages/AIAdvisor";
import { Biometrics } from "./pages/Biometrics";
import { Dashboard } from "./pages/Dashboard";
import { Labs } from "./pages/Labs";
import { Protocols } from "./pages/Protocols";
import { SleepAnalysis } from "./pages/SleepAnalysis";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "biometrics":
        return <Biometrics onNavigate={setActivePage} />;
      case "sleep":
        return <SleepAnalysis />;
      case "labs":
        return <Labs />;
      case "advisor":
        return <AIAdvisor />;
      case "protocols":
        return <Protocols />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}
