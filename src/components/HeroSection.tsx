import { ArrowRight, Fish, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-tilapia.jpg";

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

const stats = [
  { icon: Fish, label: "Active Listings", value: "2,400+" },
  { icon: Users, label: "Farmers & Buyers", value: "1,200+" },
  { icon: TrendingUp, label: "Avg. Savings", value: "35%" },
];

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Tilapia fish farm in Kenya" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 text-secondary mb-6">
            <Fish className="w-4 h-4" />
            <span className="text-sm font-medium">Kenya's #1 Tilapia Marketplace</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            Fresh Tilapia,{" "}
            <span className="text-secondary">Direct</span> from
            Kenyan Farms
          </h1>

          <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
            Connect with verified tilapia farmers across Kenya. Get the freshest fish at fair prices — pay on pickup.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => onNavigate("marketplace")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-secondary-foreground font-heading font-semibold transition-all hover:shadow-elevated hover:scale-105"
            >
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("calculator")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-heading font-semibold hover:bg-primary-foreground/20 transition-all"
            >
              Price Calculator
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-heading font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
