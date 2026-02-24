import { Search, MapPin, Phone, Star, Filter } from "lucide-react";
import { useState } from "react";

const listings = [
  { id: 1, name: "John Ochieng", location: "Kisumu", phone: "+254 712 345 678", rating: 4.8, price: 450, size: "500g-1kg", available: 200, verified: true },
  { id: 2, name: "Mary Wanjiku", location: "Nairobi", phone: "+254 723 456 789", rating: 4.6, price: 480, size: "300g-500g", available: 150, verified: true },
  { id: 3, name: "Peter Kamau", location: "Mombasa", phone: "+254 734 567 890", rating: 4.9, price: 420, size: "1kg+", available: 300, verified: false },
  { id: 4, name: "Grace Akinyi", location: "Nakuru", phone: "+254 745 678 901", rating: 4.7, price: 460, size: "500g-1kg", available: 180, verified: true },
  { id: 5, name: "David Mwangi", location: "Eldoret", phone: "+254 756 789 012", rating: 4.5, price: 440, size: "300g-500g", available: 250, verified: true },
  { id: 6, name: "Faith Njeri", location: "Thika", phone: "+254 767 890 123", rating: 4.4, price: 470, size: "1kg+", available: 120, verified: false },
];

const locations = ["All", "Kisumu", "Nairobi", "Mombasa", "Nakuru", "Eldoret", "Thika"];

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const filtered = listings.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchLocation = selectedLocation === "All" || l.location === selectedLocation;
    return matchSearch && matchLocation;
  });

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
          <input
            type="text"
            placeholder="Search by farmer or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedLocation === loc
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((listing) => (
          <div key={listing.id} className="bg-card rounded-2xl border p-5 shadow-card hover:shadow-elevated transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-foreground">{listing.name}</h3>
                  {listing.verified && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">Verified</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.location}
                </div>
              </div>
              <div className="flex items-center gap-1 text-secondary">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">{listing.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-muted rounded-lg p-2.5 text-center">
                <div className="text-xs text-muted-foreground">Price/kg</div>
                <div className="font-heading font-bold text-foreground">KSh {listing.price}</div>
              </div>
              <div className="bg-muted rounded-lg p-2.5 text-center">
                <div className="text-xs text-muted-foreground">Size</div>
                <div className="font-heading font-bold text-foreground text-sm">{listing.size}</div>
              </div>
              <div className="bg-muted rounded-lg p-2.5 text-center">
                <div className="text-xs text-muted-foreground">Stock</div>
                <div className="font-heading font-bold text-accent">{listing.available}kg</div>
              </div>
            </div>

            <a
              href={`tel:${listing.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-hero text-primary-foreground font-medium text-sm transition-all hover:opacity-90"
            >
              <Phone className="w-4 h-4" />
              Contact Farmer
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No listings found. Try adjusting your search.</p>
        </div>
      )}
    </section>
  );
};

export default Marketplace;
