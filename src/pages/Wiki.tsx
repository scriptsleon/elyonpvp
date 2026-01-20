import { motion } from "framer-motion";
import { Search, Book, Skull, ShoppingCart, Users, Crosshair } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const categories = [
  { icon: Book, name: "Začátečníci", count: 12 },
  { icon: Skull, name: "PvE & Zombie", count: 8 },
  { icon: Crosshair, name: "PvP Systém", count: 15 },
  { icon: ShoppingCart, name: "MarketPlace", count: 6 },
  { icon: Users, name: "Komunita", count: 4 },
];

const articles = [
  { title: "Jak začít hrát na Elyon", category: "Začátečníci", views: 1520 },
  { title: "Průvodce zombie zónami", category: "PvE & Zombie", views: 892 },
  { title: "Nejlepší zbraně pro PvP", category: "PvP Systém", views: 2340 },
  { title: "Jak obchodovat na MarketPlace", category: "MarketPlace", views: 654 },
  { title: "Sběr surovin a crafting", category: "Začátečníci", views: 1123 },
  { title: "Tipy pro přežití první hodiny", category: "Začátečníci", views: 1876 },
];

const Wiki = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              <span className="text-gradient-gold">WIKI</span>PÉDIE
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vše co potřebuješ vědět o hraní na Elyon PvP serveru
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Hledat v článcích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 glass rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-lg"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.name}
                className="glass rounded-xl p-4 text-center hover:border-primary/50 transition-all group"
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <cat.icon className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-heading font-semibold text-sm">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.count} článků</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-heading font-bold mb-6">
              <span className="text-gradient-gold">POPULÁRNÍ</span> ČLÁNKY
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, index) => (
                <motion.article
                  key={article.title}
                  className="glass rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-xs text-primary font-heading uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h3 className="font-heading font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {article.views.toLocaleString()} zobrazení
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wiki;
