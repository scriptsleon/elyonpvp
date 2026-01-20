import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const allNews = [
  {
    id: 1,
    title: "Nový update v0.5 je zde!",
    excerpt: "Přidali jsme nové zbraně, lokace a vylepšený loot systém. Čeká vás mnoho překvapení včetně nových zombie typů a speciálních eventů.",
    content: "Plný obsah článku...",
    date: "2026-01-20",
    category: "Update",
    featured: true,
  },
  {
    id: 2,
    title: "Víkendový event: Double XP",
    excerpt: "Tento víkend získáváte dvojnásobné zkušenosti za všechny aktivity! Platí od pátku 18:00 do neděle 23:59.",
    content: "Plný obsah článku...",
    date: "2026-01-18",
    category: "Event",
    featured: false,
  },
  {
    id: 3,
    title: "Nábor do Admin Teamu",
    excerpt: "Hledáme nové členy do našeho týmu. Máš zkušenosti s FiveM a chceš pomáhat komunitě? Přihlas se!",
    content: "Plný obsah článku...",
    date: "2026-01-15",
    category: "Nábor",
    featured: false,
  },
  {
    id: 4,
    title: "Nová zombie zóna: Downtown",
    excerpt: "Otevřeli jsme novou nebezpečnou zónu v centru města. Vyšší riziko, lepší loot!",
    content: "Plný obsah článku...",
    date: "2026-01-12",
    category: "Update",
    featured: false,
  },
  {
    id: 5,
    title: "MarketPlace vylepšení",
    excerpt: "Přidali jsme filtrování, řazení a nové kategorie do MarketPlace.",
    content: "Plný obsah článku...",
    date: "2026-01-10",
    category: "Update",
    featured: false,
  },
];

const categories = ["Vše", "Update", "Event", "Nábor"];

const categoryColors: Record<string, string> = {
  Update: "bg-primary/20 text-primary",
  Event: "bg-accent/20 text-accent",
  Nábor: "bg-green-500/20 text-green-500",
};

const News = () => {
  const [activeCategory, setActiveCategory] = useState("Vše");

  const filteredNews = activeCategory === "Vše" 
    ? allNews 
    : allNews.filter(n => n.category === activeCategory);

  const featuredNews = filteredNews.find(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured);

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
              <span className="text-gradient-gold">NOVINKY</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nejnovější zprávy, updaty a události ze světa Elyon
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-heading text-sm uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "glass hover:bg-primary/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Featured Article */}
          {featuredNews && (
            <motion.article
              className="glass rounded-2xl p-8 mb-8 hover:border-glow-gold transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider ${categoryColors[featuredNews.category]}`}>
                      {featuredNews.category}
                    </span>
                    <span className="text-xs text-primary font-heading uppercase">⭐ Doporučené</span>
                  </div>
                  <h2 className="text-3xl font-heading font-bold mb-4 hover:text-primary transition-colors">
                    {featuredNews.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-4">
                    {featuredNews.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredNews.date).toLocaleDateString("cs-CZ")}</span>
                    </div>
                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-heading uppercase">
                      Číst více
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((news, index) => (
              <motion.article
                key={news.id}
                className="glass rounded-2xl overflow-hidden hover:border-glow-gold transition-all cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider mb-4 ${categoryColors[news.category]}`}>
                    {news.category}
                  </span>
                  <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(news.date).toLocaleDateString("cs-CZ")}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
