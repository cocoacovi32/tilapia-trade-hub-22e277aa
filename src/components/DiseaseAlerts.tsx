import { AlertTriangle, ShieldAlert, Bug, Eye, Activity, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Alert {
  id: string;
  severity: string;
  title: string;
  date: string;
  region: string;
  description: string;
  actions: string[];
}

const severityStyles: Record<string, { bg: string; badge: string; icon: typeof AlertTriangle }> = {
  high: { bg: "border-destructive/30 bg-destructive/5", badge: "bg-destructive text-destructive-foreground", icon: ShieldAlert },
  medium: { bg: "border-warning/30 bg-warning/5", badge: "bg-warning text-warning-foreground", icon: AlertTriangle },
  low: { bg: "border-accent/30 bg-accent/5", badge: "bg-accent text-accent-foreground", icon: Bug },
};

const DiseaseAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("disease_alerts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setAlerts((data as Alert[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-destructive" />
          <h2 className="font-heading text-3xl font-bold text-foreground">Disease Alerts</h2>
        </div>
        <p className="text-muted-foreground">Stay informed about tilapia disease outbreaks across Kenya</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Active Alerts", value: alerts.length, color: "bg-gradient-hero text-primary-foreground" },
          { label: "High Severity", value: alerts.filter((a) => a.severity === "high").length, color: "bg-destructive text-destructive-foreground" },
          { label: "Regions Affected", value: [...new Set(alerts.flatMap((a) => a.region.split(", ")))].length, color: "bg-gradient-gold text-secondary-foreground" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-5 ${stat.color}`}>
            <div className="font-heading text-3xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const style = severityStyles[alert.severity] || severityStyles.low;
          const Icon = style.icon;
          return (
            <div key={alert.id} className={`rounded-2xl border-2 p-6 ${style.bg} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-foreground shrink-0" />
                  <h3 className="font-heading font-semibold text-foreground">{alert.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${style.badge}`}>{alert.severity}</span>
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
