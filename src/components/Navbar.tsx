import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Users, Wifi, WifiOff } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import elyonLogo from "@/assets/elyon-logo.png";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";

// Public navigation links - Admin is NOT included (requires auth via UserMenu)
const navLinks = [
  { name: "Domů", path: "/" },
  { name: "Wikipedia", path: "/wiki" },
  { name: "Příkazy", path: "/commands" },
  { name: "Nábory", path: "/recruitment" },
  { name: "Novinky", path: "/news" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Mock server status - will be replaced with FiveM API
  const serverStatus = {
    online: true,
    players: 42,
    maxPlayers: 64,
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-strong py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              src={elyonLogo}
              alt="Elyon PvP"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="hidden sm:block">
              <span className="text-xl font-heading font-bold text-gradient-gold">
                ELYON
              </span>
              <span className="text-xs block text-muted-foreground font-body">
                PvP & PvE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 font-heading text-sm uppercase tracking-wider transition-all duration-300 rounded-md ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Server Status & User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Server Status Badge */}
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
              {serverStatus.online ? (
                <Wifi className="w-4 h-4 text-success" />
              ) : (
                <WifiOff className="w-4 h-4 text-destructive" />
              )}
              <span className="text-sm font-body">
                <span className={serverStatus.online ? "text-success" : "text-destructive"}>
                  {serverStatus.online ? "ONLINE" : "OFFLINE"}
                </span>
              </span>
              <div className="w-px h-4 bg-border" />
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-body text-foreground">
                {serverStatus.players}/{serverStatus.maxPlayers}
              </span>
            </div>

            {/* User Menu (Login/Profile) */}
            <UserMenu />

            <Button variant="connect" size="sm">
              Připojit se
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-strong mt-2 mx-4 rounded-lg overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 font-heading text-sm uppercase tracking-wider transition-all duration-300 rounded-md ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Server Status & User */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  {serverStatus.online ? (
                    <Wifi className="w-4 h-4 text-success" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm">
                    {serverStatus.players}/{serverStatus.maxPlayers} hráčů
                  </span>
                </div>
                <UserMenu />
              </div>
              
              <Button variant="connect" size="sm" className="mt-2">
                Připojit se
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
