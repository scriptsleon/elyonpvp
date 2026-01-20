import { motion } from "framer-motion";
import { Calendar, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock news data - will be replaced with database
const newsItems = [
  {
    id: 1,
    title: "Nový update v0.5 je zde!",
    excerpt: "Přidali jsme nové zbraně, lokace a vylepšený loot systém. Čeká vás mnoho překvapení...",
    date: "2026-01-20",
    category: "Update",
  },
  {
    id: 2,
    title: "Víkendový event: Double XP",
    excerpt: "Tento víkend získáváte dvojnásobné zkušenosti za všechny aktivity!",
    date: "2026-01-18",
    category: "Event",
  },
  {
    id: 3,
    title: "Nábor do Admin Teamu",
    excerpt: "Hledáme nové členy do našeho týmu. Máš zkušenosti? Přihlas se!",
    date: "2026-01-15",
    category: "Nábor",
  },
];

const categoryColors: Record<string, string> = {
  Update: "bg-primary/20 text-primary",
  Event: "bg-accent/20 text-accent",
  Nábor: "bg-green-500/20 text-green-500",
};

const NewsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-2">
              <span className="text-gradient-gold">NOVINKY</span>
            </h2>
            <p className="text-muted-foreground">
              Nejnovější zprávy a aktualizace ze světa Elyon
            </p>
          </div>
          <Link to="/news">
            <Button variant="outline">
              Všechny novinky
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.map((news, index) => (
            <motion.article
              key={news.id}
              className="group glass rounded-2xl overflow-hidden hover:border-glow-gold transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Category Badge */}
              <div className="p-6 pb-0">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider ${categoryColors[news.category] || "bg-muted text-muted-foreground"}`}>
                  {news.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <p className="text-muted-foreground font-body mb-4 line-clamp-2">
                  {news.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(news.date).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-heading text-xs uppercase">
                    Číst více
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Discord Integration Preview */}
        <motion.div
          className="mt-16 glass rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-2xl font-heading font-bold mb-2">
              Připoj se na náš Discord!
            </h3>
            <p className="text-muted-foreground mb-4">
              Buď součástí komunity, sleduj novinky a účastni se diskuzí. 
              Přes 1,500+ členů online!
            </p>
          </div>
          <Button variant="hero" size="lg" className="flex-shrink-0">
            Připojit se
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
