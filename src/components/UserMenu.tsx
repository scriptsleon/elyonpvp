import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, Shield, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function UserMenu() {
  const { user, isAdmin, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={login}
        className="flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Přihlásit
      </Button>
    );
  }

  const avatarUrl = user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
      >
        <img
          src={avatarUrl}
          alt={user?.username}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 glass-strong rounded-lg overflow-hidden z-50"
            >
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user?.username}</span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary">Administrátor</span>
                  </div>
                )}
              </div>
              
              <div className="p-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Odhlásit se
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
