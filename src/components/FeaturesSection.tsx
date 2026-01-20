import { motion } from "framer-motion";
import { Crosshair, Skull, ShoppingCart, Calendar } from "lucide-react";
import featurePvp from "@/assets/feature-pvp.png";
import featurePve from "@/assets/feature-pve.png";
import featureMarketplace from "@/assets/feature-marketplace.png";

const features = [
  {
    icon: Crosshair,
    title: "PvP Boje",
    description: "Ultimátní souboje hráč proti hráči. Vybuduj si reputaci a staň se nejobávanějším bojovníkem na serveru.",
    image: featurePvp,
    color: "text-fire",
  },
  {
    icon: Skull,
    title: "PvE Zombie",
    description: "Zabíjej zombie, sbírej loot a peníze. Začni s pistolkou a postupně získej nejlepší výbavu.",
    image: featurePve,
    color: "text-zombie",
  },
  {
    icon: ShoppingCart,
    title: "MarketPlace",
    description: "Obchoduj s ostatními hráči na aukční síni. Prodávej zbraně, zdroje a vzácné předměty.",
    image: featureMarketplace,
    color: "text-primary",
  },
  {
    icon: Calendar,
    title: "Serverové Eventy",
    description: "Pravidelné události, soutěže a speciální mise. Získej exkluzivní odměny a bonusy.",
    image: null,
    color: "text-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient-gold">HERNÍ</span> MÓDY
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elyon nabízí jedinečnou kombinaci PvP a PvE zážitků. 
            Vyber si svou cestu k vítězství.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative glass rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Background Image */}
              {feature.image && (
                <div className="absolute inset-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-secondary ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground font-body text-lg flex-grow">
                  {feature.description}
                </p>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Activities */}
        <motion.div
          className="mt-16 glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-heading font-bold text-center mb-8">
            <span className="text-gradient-gold">DALŠÍ</span> AKTIVITY
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Sběr surovin", desc: "Prohledávej popelnice" },
              { title: "Výměna u NPC", desc: "Získej peníze a předměty" },
              { title: "Crafting", desc: "Vyráběj unikátní věci" },
              { title: "Mise", desc: "Plň úkoly pro odměny" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <h4 className="font-heading font-semibold text-primary mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
