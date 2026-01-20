import { motion } from "framer-motion";
import { Search, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const commandCategories = [
  {
    name: "Základní",
    commands: [
      { cmd: "/help", desc: "Zobrazí seznam příkazů" },
      { cmd: "/spawn", desc: "Teleportuje tě na spawn" },
      { cmd: "/tpa [hráč]", desc: "Požádá hráče o teleport" },
      { cmd: "/home", desc: "Teleportuje domů" },
      { cmd: "/sethome", desc: "Nastaví domov" },
    ],
  },
  {
    name: "Ekonomika",
    commands: [
      { cmd: "/money", desc: "Zobrazí tvůj zůstatek" },
      { cmd: "/pay [hráč] [částka]", desc: "Pošle peníze hráči" },
      { cmd: "/shop", desc: "Otevře obchod" },
      { cmd: "/sell", desc: "Prodá předměty v ruce" },
      { cmd: "/market", desc: "Otevře MarketPlace" },
    ],
  },
  {
    name: "PvP & PvE",
    commands: [
      { cmd: "/stats", desc: "Zobrazí tvé statistiky" },
      { cmd: "/leaderboard", desc: "Žebříček hráčů" },
      { cmd: "/bounty [hráč] [částka]", desc: "Vypsání odměny na hlavu" },
      { cmd: "/zombies", desc: "Info o zombie zónách" },
      { cmd: "/events", desc: "Seznam aktivních eventů" },
    ],
  },
  {
    name: "Komunikace",
    commands: [
      { cmd: "/msg [hráč] [zpráva]", desc: "Soukromá zpráva" },
      { cmd: "/r [zpráva]", desc: "Odpověď na poslední zprávu" },
      { cmd: "/report [hráč]", desc: "Nahlásit hráče" },
      { cmd: "/discord", desc: "Odkaz na Discord" },
    ],
  },
];

const Commands = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredCategories = commandCategories.map((cat) => ({
    ...cat,
    commands: cat.commands.filter(
      (c) =>
        c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.commands.length > 0);

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
              <span className="text-gradient-gold">PŘÍKAZY</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seznam všech dostupných příkazů na serveru
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Hledat příkaz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 glass rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-lg"
              />
            </div>
          </motion.div>

          {/* Commands */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredCategories.map((category, catIndex) => (
              <motion.div
                key={category.name}
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * catIndex }}
              >
                <h2 className="text-xl font-heading font-bold text-gradient-gold mb-4">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.commands.map((command) => (
                    <div
                      key={command.cmd}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg group hover:bg-secondary transition-colors"
                    >
                      <div>
                        <code className="text-primary font-heading text-sm">
                          {command.cmd}
                        </code>
                        <p className="text-sm text-muted-foreground mt-1">
                          {command.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => copyCommand(command.cmd)}
                        className="p-2 rounded-lg hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Kopírovat"
                      >
                        {copiedCmd === command.cmd ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Commands;
