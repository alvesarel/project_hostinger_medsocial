import React from 'react';
import { Input } from '@/components/ui/input';
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

const SocialLinksForm = ({ socialLinks, handleSocialChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-700">Redes Sociais</h3>
      <p className="text-sm text-muted-foreground">Adicione seus links para que a IA possa incluí-los no conteúdo gerado.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Instagram className="h-5 w-5 text-gray-500" />
          <Input placeholder="https://instagram.com/seu_usuario" value={socialLinks.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Facebook className="h-5 w-5 text-gray-500" />
          <Input placeholder="https://facebook.com/sua_pagina" value={socialLinks.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Linkedin className="h-5 w-5 text-gray-500" />
          <Input placeholder="https://linkedin.com/in/seu_perfil" value={socialLinks.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Twitter className="h-5 w-5 text-gray-500" />
          <Input placeholder="https://twitter.com/seu_usuario" value={socialLinks.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Youtube className="h-5 w-5 text-gray-500" />
          <Input placeholder="https://youtube.com/seu_canal" value={socialLinks.youtube} onChange={(e) => handleSocialChange('youtube', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default SocialLinksForm;
