import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Newspaper, 
  Users, 
  Palette, 
  Type, 
  Sparkles,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data for news
const mockNews = [
  { id: 1, title: "Velká aktualizace PvE zón!", content: "Přidali jsme 5 nových zombie zón...", date: "2026-01-20", published: true },
  { id: 2, title: "Nový Marketplace systém", content: "Aukční síň je nyní dostupná...", date: "2026-01-19", published: true },
  { id: 3, title: "Víkendový event", content: "Double XP a loot tento víkend!", date: "2026-01-18", published: false },
];

// Mock data for recruitment applications
const mockApplications = [
  { id: 1, discord: "Player123#1234", age: 22, experience: "2 roky na FiveM serverech", status: "pending" },
  { id: 2, discord: "GamerPro#5678", age: 19, experience: "Admin na 3 serverech", status: "approved" },
  { id: 3, discord: "NewPlayer#9012", age: 17, experience: "Začátečník", status: "rejected" },
];

const Admin = () => {
  const [news, setNews] = useState(mockNews);
  const [applications] = useState(mockApplications);
  const [editingNews, setEditingNews] = useState<typeof mockNews[0] | null>(null);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  
  // Settings state
  const [settings, setSettings] = useState({
    primaryColor: "#d4a853",
    backgroundColor: "#0a0a0a",
    fontFamily: "DynaPuff",
    fontSize: "16",
    enableAnimations: true,
    enableParticles: true,
    discordWebhook: "",
  });

  const handleSaveSettings = () => {
    // TODO: Connect to your database
    toast.success("Nastavení bylo uloženo! (Mock - připoj DB)");
  };

  const handleAddNews = () => {
    if (!newNewsTitle || !newNewsContent) {
      toast.error("Vyplň název a obsah novinky!");
      return;
    }
    const newItem = {
      id: Date.now(),
      title: newNewsTitle,
      content: newNewsContent,
      date: new Date().toISOString().split('T')[0],
      published: false,
    };
    setNews([newItem, ...news]);
    setNewNewsTitle("");
    setNewNewsContent("");
    toast.success("Novinka přidána! (Mock - připoj DB)");
  };

  const handleDeleteNews = (id: number) => {
    setNews(news.filter(n => n.id !== id));
    toast.success("Novinka smazána!");
  };

  const handlePublishNews = (id: number) => {
    setNews(news.map(n => n.id === id ? { ...n, published: !n.published } : n));
    toast.success("Status publikace změněn!");
  };

  const handleSendToDiscord = (newsItem: typeof mockNews[0]) => {
    if (!settings.discordWebhook) {
      toast.error("Nastav Discord Webhook URL v nastavení!");
      return;
    }
    // TODO: Connect to your Discord webhook
    toast.success(`Odesláno na Discord: ${newsItem.title} (Mock)`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-heading font-bold text-primary flex items-center gap-3">
              <Settings className="w-10 h-10" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2">
              Správa webu, novinek a náborů
            </p>
          </motion.div>

          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Novinky
              </TabsTrigger>
              <TabsTrigger value="recruitment" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Nábory
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Nastavení
              </TabsTrigger>
            </TabsList>

            {/* NEWS TAB */}
            <TabsContent value="news" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Přidat novinku</CardTitle>
                  <CardDescription>Vytvoř novou novinku a odešli ji na Discord</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="news-title">Název</Label>
                    <Input 
                      id="news-title"
                      value={newNewsTitle}
                      onChange={(e) => setNewNewsTitle(e.target.value)}
                      placeholder="Název novinky..."
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="news-content">Obsah</Label>
                    <Textarea 
                      id="news-content"
                      value={newNewsContent}
                      onChange={(e) => setNewNewsContent(e.target.value)}
                      placeholder="Obsah novinky..."
                      className="bg-background/50 min-h-[120px]"
                    />
                  </div>
                  <Button onClick={handleAddNews} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat novinku
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Seznam novinek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {news.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                          <span className={`text-xs px-2 py-1 rounded ${item.published ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                            {item.published ? 'Publikováno' : 'Koncept'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handlePublishNews(item.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleSendToDiscord(item)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive"
                            onClick={() => handleDeleteNews(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RECRUITMENT TAB */}
            <TabsContent value="recruitment" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Přijaté přihlášky</CardTitle>
                  <CardDescription>Správa náborových formulářů</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-background/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{app.discord}</h3>
                            <p className="text-sm text-muted-foreground">Věk: {app.age} let</p>
                            <p className="text-sm text-muted-foreground">{app.experience}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              app.status === 'approved' ? 'bg-success/20 text-success' :
                              app.status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                              'bg-primary/20 text-primary'
                            }`}>
                              {app.status === 'approved' ? 'Schváleno' :
                               app.status === 'rejected' ? 'Zamítnuto' : 'Čeká'}
                            </span>
                            <Button size="sm" variant="outline" className="text-success border-success hover:bg-success/10">
                              Schválit
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                              Zamítnout
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Barvy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="primary-color">Hlavní barva</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="primary-color"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="w-16 h-10 p-1"
                        />
                        <Input 
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="flex-1 bg-background/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bg-color">Barva pozadí</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="bg-color"
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                          className="w-16 h-10 p-1"
                        />
                        <Input 
                          value={settings.backgroundColor}
                          onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                          className="flex-1 bg-background/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Type className="w-5 h-5" />
                      Typografie
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="font-family">Font</Label>
                      <Select 
                        value={settings.fontFamily}
                        onValueChange={(value) => setSettings({...settings, fontFamily: value})}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DynaPuff">DynaPuff</SelectItem>
                          <SelectItem value="Orbitron">Orbitron</SelectItem>
                          <SelectItem value="Rajdhani">Rajdhani</SelectItem>
                          <SelectItem value="Press Start 2P">Press Start 2P</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="font-size">Velikost písma (px)</Label>
                      <Input 
                        id="font-size"
                        type="number"
                        value={settings.fontSize}
                        onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Animace
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-animations">Povolit animace</Label>
                      <Switch 
                        id="enable-animations"
                        checked={settings.enableAnimations}
                        onCheckedChange={(checked) => setSettings({...settings, enableAnimations: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-particles">Povolit částice</Label>
                      <Switch 
                        id="enable-particles"
                        checked={settings.enableParticles}
                        onCheckedChange={(checked) => setSettings({...settings, enableParticles: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Discord Integrace
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="discord-webhook">Webhook URL</Label>
                      <Input 
                        id="discord-webhook"
                        value={settings.discordWebhook}
                        onChange={(e) => setSettings({...settings, discordWebhook: e.target.value})}
                        placeholder="https://discord.com/api/webhooks/..."
                        className="bg-background/50"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={handleSaveSettings} className="w-full" size="lg">
                <Save className="w-5 h-5 mr-2" />
                Uložit nastavení
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
