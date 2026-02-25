import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Marketplace from "@/components/Marketplace";
import PriceCalculator from "@/components/PriceCalculator";
import FarmTips from "@/components/FarmTips";
import DiseaseAlerts from "@/components/DiseaseAlerts";
import MyListings from "@/components/MyListings";
import MyOrders from "@/components/MyOrders";
import Auth from "@/pages/Auth";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuth();

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
      case "my-listings":
        return user ? <MyListings /> : <Auth onSuccess={() => setActiveTab("my-listings")} />;
      case "orders":
        return user ? <MyOrders /> : <Auth onSuccess={() => setActiveTab("orders")} />;
      case "auth":
        return <Auth onSuccess={() => setActiveTab("home")} />;
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
