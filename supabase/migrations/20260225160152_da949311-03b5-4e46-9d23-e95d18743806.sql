
-- =====================
-- 1. PROFILES TABLE
-- =====================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('farmer', 'buyer', 'admin')),
  verified BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- 2. LISTINGS TABLE
-- =====================
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  price_per_kg NUMERIC NOT NULL DEFAULT 0,
  size_category TEXT NOT NULL DEFAULT '500g-1kg',
  available_kg NUMERIC NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings" ON public.listings FOR SELECT USING (is_active = true);
CREATE POLICY "Farmers can insert own listings" ON public.listings FOR INSERT WITH CHECK (
  farmer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Farmers can update own listings" ON public.listings FOR UPDATE USING (
  farmer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Farmers can delete own listings" ON public.listings FOR DELETE USING (
  farmer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- 3. DISEASE ALERTS TABLE
-- =====================
CREATE TABLE public.disease_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('high', 'medium', 'low')),
  title TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT to_char(now(), 'Mon DD, YYYY'),
  region TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  actions TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.disease_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active alerts" ON public.disease_alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage alerts" ON public.disease_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Seed initial alerts
INSERT INTO public.disease_alerts (severity, title, date, region, description, actions) VALUES
('high', 'Streptococcus Outbreak — Western Kenya', 'Feb 20, 2026', 'Kisumu, Siaya, Homa Bay', 'Multiple farms reporting Streptococcus iniae infections. Symptoms include erratic swimming, eye cloudiness, and hemorrhaging.', ARRAY['Isolate affected fish immediately', 'Consult a veterinarian for antibiotic treatment', 'Increase aeration in all ponds', 'Avoid moving fish between farms']),
('medium', 'Columnaris Disease — Central Region', 'Feb 18, 2026', 'Nairobi, Kiambu, Thika', 'Reports of Flavobacterium columnare causing white lesions on skin and gills. Linked to recent temperature fluctuations.', ARRAY['Reduce stocking density', 'Maintain water temperature stability', 'Salt baths (15g/L for 20 min) can help', 'Improve water quality management']),
('low', 'Parasitic Infections — Coast Region', 'Feb 15, 2026', 'Mombasa, Kilifi', 'Mild trichodina and ichthyophthirius (white spot) infections observed. Generally manageable with proper treatment.', ARRAY['Use formalin baths as treatment', 'Increase water changes', 'Monitor fish behavior closely', 'Treat entire pond, not just affected fish']),
('medium', 'Aeromonas Infection Alert — Rift Valley', 'Feb 12, 2026', 'Nakuru, Eldoret, Baringo', 'Aeromonas hydrophila causing ulcerative disease. Often triggered by poor water quality and handling stress.', ARRAY['Minimize fish handling', 'Test and improve water quality', 'Use potassium permanganate for ponds', 'Vaccinate fingerlings where possible']);

-- =====================
-- 4. ORDERS TABLE
-- =====================
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity_kg NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'paid', 'cancelled')),
  pickup_location TEXT DEFAULT '',
  pickup_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT DEFAULT 'mpesa',
  payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (
  buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Farmers can view orders for their listings" ON public.orders FOR SELECT USING (
  farmer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (
  buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Farmers can update order status" ON public.orders FOR UPDATE USING (
  farmer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Buyers can cancel own orders" ON public.orders FOR UPDATE USING (
  buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
