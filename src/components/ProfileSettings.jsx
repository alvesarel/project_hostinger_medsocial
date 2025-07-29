import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Save, Loader2 } from 'lucide-react';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import SocialLinksForm from '@/components/profile/SocialLinksForm';
import BrandIdentityForm from '@/components/profile/BrandIdentityForm';
import PasswordUpdateForm from '@/components/profile/PasswordUpdateForm';

const ProfileSettings = ({ username }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    full_name: '',
    specialty: '',
    phone: '',
    professional_registration: '',
    professional_registration_uf: '',
    display_phone: false,
    display_email: false,
    social_links: { instagram: '', facebook: '', linkedin: '', twitter: '', youtube: '' },
    brand_voice: '',
    brand_colors: ['#667eea', '#764ba2', '#ffffff'],
  });

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, specialty, phone, display_phone, display_email, social_links, brand_voice, brand_colors, professional_registration, professional_registration_uf')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfileData(prev => ({
          ...prev,
          username: data.username || '',
          full_name: data.full_name || '',
          specialty: data.specialty || '',
          phone: data.phone || '',
          professional_registration: data.professional_registration || '',
          professional_registration_uf: data.professional_registration_uf || '',
          display_phone: data.display_phone || false,
          display_email: data.display_email || false,
          social_links: data.social_links || prev.social_links,
          brand_voice: data.brand_voice || '',
          brand_colors: data.brand_colors || prev.brand_colors,
        }));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar perfil',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setProfileData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value },
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...profileData.brand_colors];
    newColors[index] = value;
    setProfileData(prev => ({ ...prev, brand_colors: newColors }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          specialty: profileData.specialty,
          phone: profileData.phone,
          professional_registration: profileData.professional_registration,
          professional_registration_uf: profileData.professional_registration_uf,
          display_phone: profileData.display_phone,
          display_email: profileData.display_email,
          social_links: profileData.social_links,
          brand_voice: profileData.brand_voice,
          brand_colors: profileData.brand_colors,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Seu perfil foi atualizado.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> Carregando configurações...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Configurações do Perfil - MedSocial AI</title>
        <meta name="description" content="Gerencie as configurações do seu perfil, redes sociais e identidade da marca." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-3xl font-bold gradient-text">Configurações do Perfil</CardTitle>
                <CardDescription>Personalize sua experiência e o conteúdo gerado pela IA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <PersonalInfoForm 
                  profileData={profileData}
                  handleInputChange={handleInputChange}
                  userEmail={user.email}
                  username={username}
                />
                <SocialLinksForm 
                  socialLinks={profileData.social_links}
                  handleSocialChange={handleSocialChange}
                />
                <BrandIdentityForm
                  brandVoice={profileData.brand_voice}
                  brandColors={profileData.brand_colors}
                  handleInputChange={handleInputChange}
                  handleColorChange={handleColorChange}
                  profileData={profileData}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving} className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                   {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <PasswordUpdateForm />
        </div>
      </motion.div>
    </>
  );
};

export default ProfileSettings;
