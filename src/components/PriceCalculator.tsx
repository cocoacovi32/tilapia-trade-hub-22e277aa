import { Calculator, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";

const marketPrices: Record<string, { price: number; trend: "up" | "down" | "stable" }> = {
  Kisumu: { price: 450, trend: "up" },
  Nairobi: { price: 520, trend: "stable" },
  Mombasa: { price: 480, trend: "down" },
  Nakuru: { price: 460, trend: "up" },
  Eldoret: { price: 440, trend: "stable" },
  Thika: { price: 470, trend: "up" },
};

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-accent" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const PriceCalculator = () => {
  const [weight, setWeight] = useState(10);
  const [location, setLocation] = useState("Kisumu");
  const [quality, setQuality] = useState<"standard" | "premium">("standard");

  const basePrice = marketPrices[location]?.price || 450;
  const qualityMultiplier = quality === "premium" ? 1.25 : 1;
  const total = weight * basePrice * qualityMultiplier;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Price Calculator</h2>
        <p className="text-muted-foreground">Calculate tilapia prices based on current market rates across Kenya</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator */}
        <div className="bg-card rounded-2xl border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Calculator className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Estimate Your Cost</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {Object.keys(marketPrices).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Weight (kg): {weight}kg</label>
              <input
                type="range"
                min={1}
                max={500}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1kg</span>
                <span>500kg</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quality</label>
              <div className="flex gap-3">
                {(["standard", "premium"] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                      quality === q
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-xl p-5 mt-4">
              <div className="text-sm text-muted-foreground mb-1">Estimated Total</div>
              <div className="font-heading text-4xl font-bold text-foreground">
                KSh {total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                @ KSh {(basePrice * qualityMultiplier).toFixed(0)}/kg · {weight}kg · {quality}
              </div>
            </div>
          </div>
        </div>

        {/* Market Prices */}
        <div className="bg-card rounded-2xl border p-6 shadow-card">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-6">Current Market Prices (per kg)</h3>
          <div className="space-y-3">
            {Object.entries(marketPrices).map(([loc, data]) => (
              <div
                key={loc}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  loc === location ? "bg-primary/5 border border-primary/20" : "bg-muted"
                }`}
              >
                <div>
                  <div className="font-medium text-foreground">{loc}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendIcon trend={data.trend} />
                    <span className="capitalize">{data.trend}</span>
                  </div>
                </div>
                <div className="font-heading font-bold text-lg text-foreground">KSh {data.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
