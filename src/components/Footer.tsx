import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import elyonLogo from "@/assets/elyon-logo.png";

const footerLinks = {
  navigation: [
    { name: "Domů", path: "/" },
    { name: "Wikipedia", path: "/wiki" },
    { name: "Příkazy", path: "/commands" },
    { name: "Nábory", path: "/recruitment" },
  ],
  community: [
    { name: "Discord", path: "#" },
    { name: "Novinky", path: "/news" },
    { name: "Forum", path: "#" },
    { name: "Pravidla", path: "#" },
  ],
  support: [
    { name: "Podpora", path: "#" },
    { name: "FAQ", path: "#" },
    { name: "Reporty", path: "#" },
    { name: "Kontakt", path: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={elyonLogo} alt="Elyon" className="h-12 w-auto" />
              <div>
                <span className="text-2xl font-heading font-bold text-gradient-gold">
                  ELYON
                </span>
                <span className="text-xs block text-muted-foreground">
                  PvP & PvE FiveM Server
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground font-body max-w-sm">
              Ultimátní FiveM PvP a PvE zážitek. Přežij zombie apokalypsu, 
              bojuj s ostatními hráči a staň se legendou.
            </p>

            {/* Server Connect */}
            <div className="mt-6 glass rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Připoj se:</p>
              <code className="text-primary font-heading text-lg">
                connect elyon.fivem.cz
              </code>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-gradient-gold">
              NAVIGACE
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-gradient-gold">
              KOMUNITA
            </h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-gradient-gold">
              PODPORA
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Elyon PvP. Všechna práva vyhrazena.
          </p>
          <p className="text-sm text-muted-foreground">
            Vytvořeno s ❤️ pro FiveM komunitu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
