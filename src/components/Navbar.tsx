import { Fish, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const tabs = [
    { id: "home", label: "Home" },
    { id: "marketplace", label: "Marketplace" },
    { id: "calculator", label: "Price Calculator" },
    { id: "tips", label: "Farm Tips" },
    { id: "alerts", label: "Disease Alerts" },
    ...(user && profile?.role === "farmer" ? [{ id: "my-listings", label: "My Listings" }] : []),
    ...(user ? [{ id: "orders", label: "Orders" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onTabChange("home")} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Fish className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground">
              Tilapia<span className="text-gradient-hero">Hub</span> KE
            </span>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
            {user ? (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{profile?.full_name || "User"}</span>
                </div>
                <button onClick={signOut} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => onTabChange("auth")} className="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-hero text-primary-foreground text-sm font-medium">
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { onTabChange(tab.id); setMobileOpen(false); }} className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {tab.label}
              </button>
            ))}
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-muted">
                Sign Out ({profile?.full_name})
              </button>
            ) : (
              <button onClick={() => { onTabChange("auth"); setMobileOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-hero text-primary-foreground">
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
