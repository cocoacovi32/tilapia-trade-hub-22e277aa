import { Search, MapPin, Phone, Star, Filter, Loader2, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ListingRow {
  id: string;
  price_per_kg: number;
  size_category: string;
  available_kg: number;
  description: string;
  farmer: {
    id: string;
    full_name: string;
    phone: string;
    location: string;
    verified: boolean;
  } | null;
}

const Marketplace = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>(["All"]);
  const [orderQty, setOrderQty] = useState<Record<string, number>>({});
  const [ordering, setOrdering] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase
        .from("listings")
        .select("*, farmer:profiles!listings_farmer_id_fkey(id, full_name, phone, location, verified)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      const rows = (data as ListingRow[]) || [];
      setListings(rows);
      const locs = [...new Set(rows.map((l) => l.farmer?.location).filter(Boolean))] as string[];
      setLocations(["All", ...locs]);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const filtered = listings.filter((l) => {
    const name = l.farmer?.full_name || "";
    const loc = l.farmer?.location || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || loc.toLowerCase().includes(search.toLowerCase());
    const matchLocation = selectedLocation === "All" || loc === selectedLocation;
    return matchSearch && matchLocation;
  });

  const placeOrder = async (listing: ListingRow) => {
    if (!profile) { toast.error("Please sign in to place an order"); return; }
    if (!listing.farmer) return;
    const qty = orderQty[listing.id] || 1;
    setOrdering(listing.id);

    const { error } = await supabase.from("orders").insert({
      listing_id: listing.id,
      buyer_id: profile.id,
      farmer_id: listing.farmer.id,
      quantity_kg: qty,
      total_price: qty * listing.price_per_kg,
      pickup_location: listing.farmer.location,
    });

    if (error) toast.error(error.message);
    else toast.success(`Order placed for ${qty}kg! Pay on pickup.`);
    setOrdering(null);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Tilapia Marketplace</h2>
        <p className="text-muted-foreground">Browse fresh tilapia listings from verified farmers across Kenya</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by farmer or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {locations.map((loc) => (
            <button key={loc} onClick={() => setSelectedLocation(loc)} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedLocation === loc ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {loc}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing) => (
            <div key={listing.id} className="bg-card rounded-2xl border p-5 shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-foreground">{listing.farmer?.full_name}</h3>
                    {listing.farmer?.verified && (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.farmer?.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-lg p-2.5 text-center">
                  <div className="text-xs text-muted-foreground">Price/kg</div>
                  <div className="font-heading font-bold text-foreground">KSh {listing.price_per_kg}</div>
                </div>
                <div className="bg-muted rounded-lg p-2.5 text-center">
                  <div className="text-xs text-muted-foreground">Size</div>
                  <div className="font-heading font-bold text-foreground text-sm">{listing.size_category}</div>
                </div>
                <div className="bg-muted rounded-lg p-2.5 text-center">
                  <div className="text-xs text-muted-foreground">Stock</div>
                  <div className="font-heading font-bold text-accent">{listing.available_kg}kg</div>
                </div>
              </div>

              {/* Order controls */}
              {profile && profile.role === "buyer" && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    min={1}
                    max={listing.available_kg}
                    value={orderQty[listing.id] || 1}
                    onChange={(e) => setOrderQty({ ...orderQty, [listing.id]: +e.target.value })}
                    className="w-20 px-3 py-2 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="kg"
                  />
                  <button
                    onClick={() => placeOrder(listing)}
                    disabled={ordering === listing.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-hero text-primary-foreground font-medium text-sm transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    {ordering === listing.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                    Order · KSh {((orderQty[listing.id] || 1) * listing.price_per_kg).toLocaleString()}
                  </button>
                </div>
              )}

              <a href={`tel:${listing.farmer?.phone?.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-muted text-foreground font-medium text-sm transition-all hover:bg-muted/80">
                <Phone className="w-4 h-4" />
                {listing.farmer?.phone}
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No listings found. Try adjusting your search.</p>
        </div>
      )}
    </section>
  );
};

export default Marketplace;
