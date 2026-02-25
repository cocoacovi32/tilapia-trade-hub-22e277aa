import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Edit2, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";

interface Listing {
  id: string;
  price_per_kg: number;
  size_category: string;
  available_kg: number;
  description: string;
  is_active: boolean;
}

const sizeOptions = ["300g-500g", "500g-1kg", "1kg+"];

const MyListings = () => {
  const { profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ price_per_kg: 450, size_category: "500g-1kg", available_kg: 100, description: "" });
  const [saving, setSaving] = useState(false);

  const fetchListings = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("farmer_id", profile.id)
      .order("created_at", { ascending: false });
    setListings((data as Listing[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("listings").update(form).eq("id", editing);
      if (error) toast.error(error.message);
      else toast.success("Listing updated!");
    } else {
      const { error } = await supabase.from("listings").insert({ ...form, farmer_id: profile.id });
      if (error) toast.error(error.message);
      else toast.success("Listing created!");
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ price_per_kg: 450, size_category: "500g-1kg", available_kg: 100, description: "" });
    fetchListings();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Listing removed"); fetchListings(); }
  };

  const startEdit = (l: Listing) => {
    setForm({ price_per_kg: l.price_per_kg, size_category: l.size_category, available_kg: l.available_kg, description: l.description || "" });
    setEditing(l.id);
    setShowForm(true);
  };

  if (profile?.role !== "farmer") {
    return (
      <section className="container mx-auto px-4 py-12 text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Farmer Access Only</h2>
        <p className="text-muted-foreground">Switch your account role to "Farmer" to create listings.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-1">My Listings</h2>
          <p className="text-muted-foreground">Manage your tilapia listings</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ price_per_kg: 450, size_category: "500g-1kg", available_kg: 100, description: "" }); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-hero text-primary-foreground font-medium text-sm">
          <Plus className="w-4 h-4" /> New Listing
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border p-6 shadow-card mb-8 space-y-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">{editing ? "Edit Listing" : "New Listing"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price/kg (KSh)</label>
              <input type="number" value={form.price_per_kg} onChange={(e) => setForm({ ...form, price_per_kg: +e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Size</label>
              <select value={form.size_category} onChange={(e) => setForm({ ...form, size_category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                {sizeOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Available (kg)</label>
              <input type="number" value={form.available_kg} onChange={(e) => setForm({ ...form, available_kg: +e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-hero text-primary-foreground font-medium text-sm disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium text-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No listings yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((l) => (
            <div key={l.id} className="bg-card rounded-2xl border p-5 shadow-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-heading font-bold text-xl text-foreground">KSh {l.price_per_kg}/kg</div>
                  <div className="text-sm text-muted-foreground">{l.size_category} · {l.available_kg}kg available</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.is_active ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {l.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {l.description && <p className="text-sm text-muted-foreground mb-4">{l.description}</p>}
              <div className="flex gap-2">
                <button onClick={() => startEdit(l)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(l.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyListings;
