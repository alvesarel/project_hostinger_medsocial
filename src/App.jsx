import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContentGenerator from '@/components/ContentGenerator';
import PricingSection from '@/components/PricingSection';
import TechExplainedSection from '@/components/TechExplainedSection';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import AuthPage from '@/components/AuthPage';
import AuthCallbackPage from '@/components/AuthCallbackPage';
import AuthConfirmPage from '@/components/AuthConfirmPage';
import DemoPage from '@/components/DemoPage';
import AboutUs from '@/components/AboutUs';
import ProfileSettings from '@/components/ProfileSettings';
import UpdatePasswordPage from '@/components/UpdatePasswordPage';
import MyContentPage from '@/components/MyContentPage';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  
  const [userProfile, setUserProfile] = useState({
    plan: 'basic',
    credits: { text: 10, image: 0, video: 0 },
    role: 'user',
    username: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setUserProfile({
        plan: 'basic',
        credits: { text: 10, image: 0, video: 0 },
        role: 'user',
        username: ''
      });
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('plan, credits, role, username, full_name')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      toast({ title: "Erro ao carregar perfil", variant: "destructive" });
    } else if (data) {
      setUserProfile({
        plan: data.plan || 'basic',
        credits: data.credits || { text: 10, image: 0, video: 0 },
        role: data.role || 'user',
        username: data.username || ''
      });
      if (!data.full_name && location.pathname !== '/profile-settings' && !location.pathname.startsWith('/auth')) {
        toast({
          title: "Complete seu perfil!",
          description: "Por favor, preencha seus dados para uma melhor experiência."
        });
        navigate('/profile-settings');
      }
    }
    setProfileLoading(false);
  }, [user, navigate, location.pathname]);


  useEffect(() => {
    fetchProfile();
  }, [user, fetchProfile]);

  const handleSetCredits = async (newCredits) => {
    setUserProfile(prev => ({...prev, credits: newCredits}));
    if(user){
      await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
    }
  };

  const isLoading = authLoading || (user && profileLoading);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-xl bg-background text-foreground">
        <Loader2 className="mr-4 h-8 w-8 animate-spin" />
        Carregando...
      </div>
    );
  }
  
  const noHeaderFooterRoutes = ['/auth', '/update-password', '/auth-callback', '/auth/confirm'];
  const showHeaderFooter = !noHeaderFooterRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300", theme)}>
      <Helmet>
        <title>MedSocial AI - Geração de Conteúdo IA para Profissionais</title>
        <meta name="description" content="Plataforma de IA para criação de conteúdo de redes sociais. Gere posts, imagens e vídeos com os melhores modelos de IA do mercado." />
      </Helmet>
      
      {showHeaderFooter && <Header 
        userPlan={userProfile.plan}
        credits={userProfile.credits}
        userRole={userProfile.role}
      />}
      
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero onGetStarted={() => navigate(user ? '/generator' : '/auth')} />
              <PricingSection/>
              <TechExplainedSection />
            </>
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth-callback" element={<AuthCallbackPage />} />
          <Route path="/auth/confirm" element={<AuthConfirmPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/generator" element={
            user ? (
              <ContentGenerator 
                userPlan={userProfile.plan}
                credits={userProfile.credits}
                setCredits={handleSetCredits}
                user={user}
              />
            ) : (
              <div className="py-20 container mx-auto px-4 text-center">
                <p>Por favor, faça login para acessar o gerador de conteúdo.</p>
                <Button onClick={() => navigate('/auth')} className="mt-4">Ir para Login</Button>
              </div>
            )
          } />
          <Route path="/my-content" element={
            user ? (
              <MyContentPage />
            ) : (
              <div className="py-20 container mx-auto px-4 text-center">
                <p>Por favor, faça login para acessar seus conteúdos.</p>
                <Button onClick={() => navigate('/auth')} className="mt-4">Ir para Login</Button>
              </div>
            )
          } />
          <Route path="/pricing" element={<PricingSection/>} />
          <Route path="/admin" element={<AdminPanel userRole={userProfile.role} />} />
          <Route path="/profile-settings" element={
            user ? (
              <ProfileSettings username={userProfile.username} />
            ) : (
              <div className="py-20 container mx-auto px-4 text-center">
                <p>Por favor, faça login para acessar as configurações do perfil.</p>
                <Button onClick={() => navigate('/auth')} className="mt-4">Ir para Login</Button>
              </div>
            )
          } />
        </Routes>
      </main>
      
      {showHeaderFooter && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
