import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand2, Palette, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

const BrandIdentityForm = ({ brandVoice, brandColors, handleInputChange, handleColorChange, profileData }) => {
  const [generatingVoice, setGeneratingVoice] = useState(false);
  const [generatingColors, setGeneratingColors] = useState(false);

  const handleGenerateVoice = async () => {
    setGeneratingVoice(true);
    try {
      const { data, error } = await supabase.functions.invoke('brand-voice-generator', {
        body: { profileInfo: profileData },
      });
      
      if (error) throw error;

      handleInputChange('brand_voice', data.brand_voice);
      toast({ title: 'Voz da Marca Gerada!', description: 'A IA criou uma nova voz para sua marca.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao gerar voz', description: error.message });
    } finally {
      setGeneratingVoice(false);
    }
  };

  const handleGenerateColors = async () => {
    if(!profileData.specialty) {
        toast({ variant: 'destructive', title: 'Especialidade necessária', description: 'Por favor, preencha sua especialidade para gerar cores.' });
        return;
    }
    setGeneratingColors(true);
    try {
        const { data, error } = await supabase.functions.invoke('color-palette-generator', {
            body: { specialty: profileData.specialty },
        });

        if (error) throw error;
        
        if(data.colors && data.colors.length === 3) {
            handleColorChange(0, data.colors[0]);
            handleColorChange(1, data.colors[1]);
            handleColorChange(2, data.colors[2]);
            toast({ title: 'Paleta de Cores Sugerida!', description: 'A IA criou uma nova paleta de cores para sua marca.' });
        } else {
            throw new Error("A resposta da IA não continha uma paleta de cores válida.");
        }

    } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao sugerir cores', description: error.message });
    } finally {
        setGeneratingColors(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Identidade da Marca</CardTitle>
        <CardDescription>Defina a voz e as cores da sua marca para guiar a IA na criação de conteúdo consistente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brand-voice">Voz da Marca</Label>
          <Textarea
            id="brand-voice"
            placeholder="Ex: Comunicando com clareza e empatia, foco em informações de saúde baseadas em evidências..."
            value={brandVoice}
            onChange={(e) => handleInputChange('brand_voice', e.target.value)}
            rows={4}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleGenerateVoice} disabled={generatingVoice}>
            {generatingVoice ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {generatingVoice ? 'Gerando...' : 'Gerar com IA'}
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Cores da Marca</Label>
          <div className="flex items-center gap-2">
            {brandColors.map((color, index) => (
              <div key={index} className="relative">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-12 h-12 p-1"
                />
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={handleGenerateColors} disabled={generatingColors}>
              {generatingColors ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
              {generatingColors ? 'Sugerindo...' : 'Sugerir Cores'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Selecione as cores primária, secundária e de destaque da sua marca.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandIdentityForm;
