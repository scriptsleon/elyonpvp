import { motion } from "framer-motion";
import { Shield, Users, Wrench, MessageSquare, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const positions = [
  {
    icon: Shield,
    title: "Administrátor",
    description: "Dohlížej na dodržování pravidel a pomáhej hráčům s problémy.",
    requirements: ["16+ let", "Aktivita min. 20h/týden", "Zkušenosti s FiveM"],
    status: "open",
  },
  {
    icon: Users,
    title: "Moderátor",
    description: "Spravuj chat a řeš menší konflikty mezi hráči.",
    requirements: ["15+ let", "Aktivita min. 15h/týden", "Komunikativnost"],
    status: "open",
  },
  {
    icon: Wrench,
    title: "Developer",
    description: "Vyvíjej nové scripty a vylepšuj herní zážitek.",
    requirements: ["Lua/JavaScript znalosti", "ESX/QBCore zkušenosti", "Portfolio"],
    status: "closed",
  },
  {
    icon: MessageSquare,
    title: "Support",
    description: "Odpovídej na dotazy hráčů na Discordu a webu.",
    requirements: ["14+ let", "Trpělivost", "Znalost serveru"],
    status: "open",
  },
];

const Recruitment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              <span className="text-gradient-gold">NÁBORY</span> DO TÝMU
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Staň se součástí Elyon Admin Teamu a pomoz nám vytvářet nejlepší FiveM zážitek
            </p>
          </motion.div>

          {/* Info Box */}
          <motion.div
            className="glass rounded-2xl p-8 mb-12 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-heading font-bold mb-4">
              Proč se přidat k nám?
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-heading font-bold text-gradient-gold">500+</div>
                <p className="text-sm text-muted-foreground">Aktivních hráčů</p>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-gradient-gold">24/7</div>
                <p className="text-sm text-muted-foreground">Server online</p>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-gradient-gold">15+</div>
                <p className="text-sm text-muted-foreground">Členů týmu</p>
              </div>
            </div>
          </motion.div>

          {/* Positions */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
                className={`glass rounded-2xl p-6 relative overflow-hidden ${
                  position.status === "closed" ? "opacity-60" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider ${
                      position.status === "open"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {position.status === "open" ? "Otevřeno" : "Uzavřeno"}
                  </span>
                </div>

                {/* Content */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <position.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-heading font-bold mb-2">
                      {position.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {position.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-xs font-heading uppercase tracking-wider text-primary mb-2">
                        Požadavky
                      </h4>
                      <ul className="space-y-1">
                        {position.requirements.map((req) => (
                          <li key={req} className="text-sm text-muted-foreground flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-primary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {position.status === "open" && (
                      <Button variant="outline" size="sm" className="w-full">
                        Podat přihlášku
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discord Note */}
          <motion.p
            className="text-center text-muted-foreground mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Po přihlášení přes Discord obdržíš formulář přímo na náš Discord server.
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Recruitment;
