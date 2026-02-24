import { AlertTriangle, ShieldAlert, Bug, Eye, Activity } from "lucide-react";

const alerts = [
  {
    id: 1,
    severity: "high",
    title: "Streptococcus Outbreak — Western Kenya",
    date: "Feb 20, 2026",
    region: "Kisumu, Siaya, Homa Bay",
    description: "Multiple farms reporting Streptococcus iniae infections. Symptoms include erratic swimming, eye cloudiness, and hemorrhaging.",
    actions: ["Isolate affected fish immediately", "Consult a veterinarian for antibiotic treatment", "Increase aeration in all ponds", "Avoid moving fish between farms"],
  },
  {
    id: 2,
    severity: "medium",
    title: "Columnaris Disease — Central Region",
    date: "Feb 18, 2026",
    region: "Nairobi, Kiambu, Thika",
    description: "Reports of Flavobacterium columnare causing white lesions on skin and gills. Linked to recent temperature fluctuations.",
    actions: ["Reduce stocking density", "Maintain water temperature stability", "Salt baths (15g/L for 20 min) can help", "Improve water quality management"],
  },
  {
    id: 3,
    severity: "low",
    title: "Parasitic Infections — Coast Region",
    date: "Feb 15, 2026",
    region: "Mombasa, Kilifi",
    description: "Mild trichodina and ichthyophthirius (white spot) infections observed. Generally manageable with proper treatment.",
    actions: ["Use formalin baths as treatment", "Increase water changes", "Monitor fish behavior closely", "Treat entire pond, not just affected fish"],
  },
  {
    id: 4,
    severity: "medium",
    title: "Aeromonas Infection Alert — Rift Valley",
    date: "Feb 12, 2026",
    region: "Nakuru, Eldoret, Baringo",
    description: "Aeromonas hydrophila causing ulcerative disease. Often triggered by poor water quality and handling stress.",
    actions: ["Minimize fish handling", "Test and improve water quality", "Use potassium permanganate for ponds", "Vaccinate fingerlings where possible"],
  },
];

const severityStyles: Record<string, { bg: string; badge: string; icon: typeof AlertTriangle }> = {
  high: { bg: "border-destructive/30 bg-destructive/5", badge: "bg-destructive text-destructive-foreground", icon: ShieldAlert },
  medium: { bg: "border-warning/30 bg-warning/5", badge: "bg-warning text-warning-foreground", icon: AlertTriangle },
  low: { bg: "border-accent/30 bg-accent/5", badge: "bg-accent text-accent-foreground", icon: Bug },
};

const DiseaseAlerts = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-destructive" />
          <h2 className="font-heading text-3xl font-bold text-foreground">Disease Alerts</h2>
        </div>
        <p className="text-muted-foreground">Stay informed about tilapia disease outbreaks across Kenya</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Active Alerts", value: alerts.length, color: "bg-gradient-hero text-primary-foreground" },
          { label: "High Severity", value: alerts.filter((a) => a.severity === "high").length, color: "bg-destructive text-destructive-foreground" },
          { label: "Regions Affected", value: 8, color: "bg-gradient-gold text-secondary-foreground" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-5 ${stat.color}`}>
            <div className="font-heading text-3xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const style = severityStyles[alert.severity];
          const Icon = style.icon;
          return (
            <div key={alert.id} className={`rounded-2xl border-2 p-6 ${style.bg} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-foreground shrink-0" />
                  <h3 className="font-heading font-semibold text-foreground">{alert.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${style.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="text-sm text-muted-foreground">{alert.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <Eye className="w-3.5 h-3.5" />
                Affected: {alert.region}
              </div>

              <p className="text-sm text-foreground/80 mb-4">{alert.description}</p>

              <div>
                <div className="text-sm font-semibold text-foreground mb-2">Recommended Actions:</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alert.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DiseaseAlerts;
