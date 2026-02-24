import { Fish } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background/70 py-10 mt-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Fish className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-background">TilapiaHub KE</span>
        </div>
        <p className="text-sm text-center">Connecting Kenyan tilapia farmers with buyers. Pay on pickup. 🇰🇪</p>
        <p className="text-sm">© 2026 TilapiaHub KE</p>
      </div>
    </div>
  </footer>
);

export default Footer;
