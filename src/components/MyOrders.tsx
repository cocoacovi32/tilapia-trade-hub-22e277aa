import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag, Loader2, CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  quantity_kg: number;
  total_price: number;
  status: string;
  pickup_location: string;
  pickup_date: string | null;
  payment_confirmed: boolean;
  created_at: string;
  listing: { price_per_kg: number; size_category: string } | null;
  farmer: { full_name: string; phone: string; location: string } | null;
  buyer: { full_name: string; phone: string } | null;
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-warning", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-primary", label: "Confirmed" },
  picked_up: { icon: Truck, color: "text-accent", label: "Picked Up" },
  paid: { icon: CheckCircle, color: "text-accent", label: "Paid" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
};

const MyOrders = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!profile) return;
    const isFarmer = profile.role === "farmer";
    const col = isFarmer ? "farmer_id" : "buyer_id";

    const { data } = await supabase
      .from("orders")
      .select(`
        *,
        listing:listings(price_per_kg, size_category),
        farmer:profiles!orders_farmer_id_fkey(full_name, phone, location),
        buyer:profiles!orders_buyer_id_fkey(full_name, phone)
      `)
      .eq(col, profile.id)
      .order("created_at", { ascending: false });

    setOrders((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [profile]);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status, payment_confirmed: status === "paid" }).eq("id", orderId);
    if (error) toast.error(error.message);
    else { toast.success(`Order ${status}`); fetchOrders(); }
  };

  if (!profile) return null;
  const isFarmer = profile.role === "farmer";

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-1">
          {isFarmer ? "Incoming Orders" : "My Orders"}
        </h2>
        <p className="text-muted-foreground">
          {isFarmer ? "Manage orders from buyers" : "Track your tilapia orders"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <div key={order.id} className="bg-card rounded-2xl border p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                    <div>
                      <span className="font-heading font-semibold text-foreground">
                        {order.quantity_kg}kg — KSh {order.total_price.toLocaleString()}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {isFarmer ? `Buyer: ${order.buyer?.full_name}` : `Farmer: ${order.farmer?.full_name} · ${order.farmer?.location}`}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg.color} bg-muted`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="bg-muted rounded-lg p-2.5 text-center">
                    <div className="text-xs text-muted-foreground">Payment</div>
                    <div className="font-medium text-sm text-foreground">{order.payment_confirmed ? "Confirmed ✓" : "On Pickup"}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-2.5 text-center">
                    <div className="text-xs text-muted-foreground">Contact</div>
                    <div className="font-medium text-sm text-foreground">{isFarmer ? order.buyer?.phone : order.farmer?.phone}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-2.5 text-center">
                    <div className="text-xs text-muted-foreground">Pickup</div>
                    <div className="font-medium text-sm text-foreground">{order.pickup_location || order.farmer?.location || "TBD"}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-2.5 text-center">
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="font-medium text-sm text-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Farmer actions */}
                {isFarmer && order.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(order.id, "confirmed")} className="flex-1 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium">Confirm</button>
                    <button onClick={() => updateStatus(order.id, "cancelled")} className="flex-1 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">Decline</button>
                  </div>
                )}
                {isFarmer && order.status === "confirmed" && (
                  <button onClick={() => updateStatus(order.id, "picked_up")} className="w-full py-2 rounded-xl bg-gradient-nature text-accent-foreground text-sm font-medium">Mark as Picked Up</button>
                )}
                {isFarmer && order.status === "picked_up" && (
                  <button onClick={() => updateStatus(order.id, "paid")} className="w-full py-2 rounded-xl bg-gradient-gold text-secondary-foreground text-sm font-medium">Confirm Payment Received</button>
                )}

                {/* Buyer cancel */}
                {!isFarmer && order.status === "pending" && (
                  <button onClick={() => updateStatus(order.id, "cancelled")} className="w-full py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">Cancel Order</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyOrders;
