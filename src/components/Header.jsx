import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { LayoutDashboard, LogOut, Settings, User, FileText, Gem, Crown, Zap, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

const Header = ({ userPlan, credits, userRole }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Você saiu com sucesso!" });
      navigate('/');
    }
  };

  const planIcons = {
    basic: <Sparkles className="h-4 w-4 text-gray-500" />,
    plus: <Zap className="h-4 w-4 text-blue-500" />,
    pro: <Gem className="h-4 w-4 text-purple-500" />,
    ultra: <Crown className="h-4 w-4 text-amber-500" />,
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <img  alt="MedSocial AI Logo" class="h-8 w-8" src="https://images.unsplash.com/photo-1696041752094-1be601b7053f" />
            <span className="inline-block font-bold text-lg">MedSocial AI</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link to="/generator" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Gerador</Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Preços</Link>
            <Link to="/about-us" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Sobre Nós</Link>
            <Link to="/demo" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Demonstração</Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt="Avatar do usuário" />
                    <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground flex items-center">
                      {planIcons[userPlan]}
                      <span className="ml-1 capitalize">{userPlan}</span>
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between items-center"><span><Sparkles className="inline mr-1 h-3 w-3"/>Texto:</span> <span>{credits.text}</span></div>
                  <div className="flex justify-between items-center"><span><ImageIcon className="inline mr-1 h-3 w-3"/>Imagem:</span> <span>{credits.image}</span></div>
                  <div className="flex justify-between items-center"><span><Video className="inline mr-1 h-3 w-3"/>Vídeo:</span> <span>{credits.video}</span></div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile-settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-content')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Meus Conteúdos</span>
                </DropdownMenuItem>
                {userRole === 'super-admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Painel Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/auth')}>
              Entrar / Cadastrar
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
