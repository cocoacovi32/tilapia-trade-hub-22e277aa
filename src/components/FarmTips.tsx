import { Droplets, Thermometer, Utensils, Home, Shield, TrendingUp } from "lucide-react";

const tips = [
  {
    icon: Droplets,
    title: "Water Quality Management",
    category: "Essential",
    color: "ocean",
    content: [
      "Maintain pH between 6.5-8.5 for optimal growth",
      "Test dissolved oxygen levels daily — keep above 5mg/L",
      "Change 10-20% of pond water weekly",
      "Use aeration systems during hot seasons",
    ],
  },
  {
    icon: Utensils,
    title: "Feeding Best Practices",
    category: "Nutrition",
    color: "secondary",
    content: [
      "Feed 2-3% of total fish body weight per day",
      "Split feeding into 2-3 sessions daily",
      "Use high-protein feeds (30-35%) for fingerlings",
      "Reduce feed during cold weather or low oxygen",
    ],
  },
  {
    icon: Thermometer,
    title: "Temperature Control",
    category: "Environment",
    color: "accent",
    content: [
      "Optimal range: 25°C - 30°C for fastest growth",
      "Use shade nets during extreme heat",
      "Deep ponds (1.5m+) maintain more stable temperatures",
      "Monitor morning temperatures — coldest point of day",
    ],
  },
  {
    icon: Home,
    title: "Pond Construction Tips",
    category: "Infrastructure",
    color: "primary",
    content: [
      "Recommended size: 300-500 m² for beginners",
      "Ideal depth: 1.0-1.5 meters",
      "Include inlet and outlet pipes for water flow",
      "Line with clay or HDPE liner to prevent seepage",
    ],
  },
  {
    icon: Shield,
    title: "Biosecurity Measures",
    category: "Health",
    color: "destructive",
    content: [
      "Quarantine new fish for 2 weeks before adding to pond",
      "Disinfect equipment between ponds",
      "Install bird nets to prevent predator access",
      "Keep records of all fish movements and treatments",
    ],
  },
  {
    icon: TrendingUp,
    title: "Maximizing Profit",
    category: "Business",
    color: "secondary",
    content: [
      "Harvest at 300-500g for best market price in Kenya",
      "Sell directly to consumers for 40% higher margins",
      "Stagger stocking to have continuous harvests",
      "Value-add: sell smoked or filleted tilapia",
    ],
  },
];

const colorMap: Record<string, string> = {
  ocean: "bg-ocean/10 text-ocean",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
};

const iconBgMap: Record<string, string> = {
  ocean: "bg-gradient-hero",
  secondary: "bg-gradient-gold",
  accent: "bg-gradient-nature",
  primary: "bg-gradient-hero",
  destructive: "bg-destructive",
};

const FarmTips = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Farm Management Tips</h2>
        <p className="text-muted-foreground">Expert advice to help you raise healthy, profitable tilapia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tips.map((tip) => (
          <div key={tip.title} className="bg-card rounded-2xl border p-6 shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${iconBgMap[tip.color]} flex items-center justify-center`}>
                <tip.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{tip.title}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[tip.color]}`}>
                  {tip.category}
                </span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {tip.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FarmTips;
