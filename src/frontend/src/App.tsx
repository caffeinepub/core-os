import type React from "react";
import { useState } from "react";
import { Layout } from "./components/Layout";
import { AIAdvisor } from "./pages/AIAdvisor";
import { Biometrics } from "./pages/Biometrics";
import { Dashboard } from "./pages/Dashboard";
import { Labs } from "./pages/Labs";
import { Protocols } from "./pages/Protocols";

const pages: Record<string, React.FC> = {
  dashboard: Dashboard,
  biometrics: Biometrics,
  labs: Labs,
  advisor: AIAdvisor,
  protocols: Protocols,
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <PageComponent />
    </Layout>
  );
}
