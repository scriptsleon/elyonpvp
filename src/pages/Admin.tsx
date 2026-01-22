import { useState, useEffect } from "react";
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
  Eye,
  Send,
  Loader2,
  RefreshCw,
  Check,
  X
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
import { useAuth } from "@/contexts/AuthContext";
import { 
  newsAPI, 
  recruitmentAPI, 
  settingsAPI, 
  discordAPI,
  News, 
  RecruitmentApplication 
} from "@/lib/api";

const Admin = () => {
  const { user } = useAuth();
  
  // News state
  const [news, setNews] = useState<News[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newNewsImage, setNewNewsImage] = useState("");
  
  // Applications state
  const [applications, setApplications] = useState<RecruitmentApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  
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
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadNews();
    loadApplications();
    loadSettings();
  }, []);

  const loadNews = async () => {
    try {
      setNewsLoading(true);
      const data = await newsAPI.getAll();
      setNews(data);
    } catch (error) {
      toast.error("Nepodařilo se načíst novinky");
      console.error(error);
    } finally {
      setNewsLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);
      const data = await recruitmentAPI.getAll();
      setApplications(data);
    } catch (error) {
      toast.error("Nepodařilo se načíst přihlášky");
      console.error(error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.getAll();
      const settingsObj: Record<string, string> = {};
      data.forEach(s => { settingsObj[s.setting_key] = s.setting_value; });
      
      setSettings(prev => ({
        ...prev,
        primaryColor: settingsObj.primaryColor || prev.primaryColor,
        backgroundColor: settingsObj.backgroundColor || prev.backgroundColor,
        fontFamily: settingsObj.fontFamily || prev.fontFamily,
        fontSize: settingsObj.fontSize || prev.fontSize,
        enableAnimations: settingsObj.enableAnimations === 'true',
        enableParticles: settingsObj.enableParticles === 'true',
        discordWebhook: settingsObj.discordWebhook || '',
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsLoading(true);
      await settingsAPI.bulkUpdate({
        primaryColor: settings.primaryColor,
        backgroundColor: settings.backgroundColor,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        enableAnimations: String(settings.enableAnimations),
        enableParticles: String(settings.enableParticles),
        discordWebhook: settings.discordWebhook,
      });
      toast.success("Nastavení bylo uloženo!");
    } catch (error) {
      toast.error("Nepodařilo se uložit nastavení");
      console.error(error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleAddNews = async () => {
    if (!newNewsTitle || !newNewsContent) {
      toast.error("Vyplň název a obsah novinky!");
      return;
    }
    
    try {
      await newsAPI.create({
        title: newNewsTitle,
        content: newNewsContent,
        image_url: newNewsImage || undefined,
        published: false,
      });
      
      setNewNewsTitle("");
      setNewNewsContent("");
      setNewNewsImage("");
      toast.success("Novinka přidána!");
      loadNews();
    } catch (error) {
      toast.error("Nepodařilo se přidat novinku");
      console.error(error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await newsAPI.delete(id);
      toast.success("Novinka smazána!");
      loadNews();
    } catch (error) {
      toast.error("Nepodařilo se smazat novinku");
      console.error(error);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await newsAPI.togglePublish(id);
      toast.success("Status publikace změněn!");
      loadNews();
    } catch (error) {
      toast.error("Nepodařilo se změnit status");
      console.error(error);
    }
  };

  const handleSendToDiscord = async (newsItem: News) => {
    try {
      await discordAPI.sendNewsWebhook(newsItem.id);
      toast.success(`Odesláno na Discord: ${newsItem.title}`);
    } catch (error) {
      toast.error("Nepodařilo se odeslat na Discord");
      console.error(error);
    }
  };

  const handleUpdateApplicationStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await recruitmentAPI.updateStatus(id, status);
      toast.success(`Přihláška ${status === 'approved' ? 'schválena' : 'zamítnuta'}!`);
      loadApplications();
    } catch (error) {
      toast.error("Nepodařilo se aktualizovat přihlášku");
      console.error(error);
    }
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
              Přihlášen jako: <span className="text-primary">{user?.username}</span>
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
                    <Label htmlFor="news-image">Obrázek URL (volitelné)</Label>
                    <Input 
                      id="news-image"
                      value={newNewsImage}
                      onChange={(e) => setNewNewsImage(e.target.value)}
                      placeholder="https://..."
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-primary">Seznam novinek</CardTitle>
                  <Button variant="outline" size="sm" onClick={loadNews} disabled={newsLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${newsLoading ? 'animate-spin' : ''}`} />
                    Obnovit
                  </Button>
                </CardHeader>
                <CardContent>
                  {newsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : news.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Žádné novinky</p>
                  ) : (
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
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString('cs-CZ')}
                              {item.author_name && ` • ${item.author_name}`}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${item.published ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                              {item.published ? 'Publikováno' : 'Koncept'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="icon" 
                              variant="outline"
                              onClick={() => handleTogglePublish(item.id)}
                              title={item.published ? 'Skrýt' : 'Publikovat'}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline"
                              onClick={() => handleSendToDiscord(item)}
                              title="Odeslat na Discord"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="destructive"
                              onClick={() => handleDeleteNews(item.id)}
                              title="Smazat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* RECRUITMENT TAB */}
            <TabsContent value="recruitment" className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Přijaté přihlášky</CardTitle>
                    <CardDescription>Správa náborových formulářů</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadApplications} disabled={applicationsLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${applicationsLoading ? 'animate-spin' : ''}`} />
                    Obnovit
                  </Button>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : applications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Žádné přihlášky</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 bg-background/50 rounded-lg border border-border/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {app.avatar && (
                                <img 
                                  src={`https://cdn.discordapp.com/avatars/${app.discord_id}/${app.avatar}.png`}
                                  alt={app.discord_username}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                              <div>
                                <h3 className="font-semibold text-foreground">{app.discord_username}</h3>
                                <p className="text-sm text-muted-foreground">Věk: {app.age} let</p>
                                <p className="text-sm text-muted-foreground">{app.experience}</p>
                              </div>
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
                              {app.status === 'pending' && (
                                <>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="text-success border-success hover:bg-success/10"
                                    onClick={() => handleUpdateApplicationStatus(app.id, 'approved')}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="text-destructive border-destructive hover:bg-destructive/10"
                                    onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          {app.motivation && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              <strong>Motivace:</strong> {app.motivation}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
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

              <Button 
                onClick={handleSaveSettings} 
                className="w-full" 
                size="lg"
                disabled={settingsLoading}
              >
                {settingsLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
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
