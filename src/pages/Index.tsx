import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Marketplace from "@/components/Marketplace";
import PriceCalculator from "@/components/PriceCalculator";
import FarmTips from "@/components/FarmTips";
import DiseaseAlerts from "@/components/DiseaseAlerts";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HeroSection onNavigate={setActiveTab} />;
      case "marketplace":
        return <Marketplace />;
      case "calculator":
        return <PriceCalculator />;
      case "tips":
        return <FarmTips />;
      case "alerts":
        return <DiseaseAlerts />;
      default:
        return <HeroSection onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">{renderContent()}</main>
      <Footer />
    </div>
  );
};

export default Index;
