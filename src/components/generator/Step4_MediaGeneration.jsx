import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileImage as ImageIcon, Video as VideoIcon, ArrowLeft } from 'lucide-react';
import { tierLevels } from '@/lib/models';

const Step4MediaGeneration = ({
  generatedContent,
  generationConfig,
  setGenerationConfig,
  availableImageModels,
  availableVideoModels,
  availableApiKeys,
  isLoading,
  loadingMessage,
  userPlan,
  onGenerateMedia,
  onBack,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
            <CardTitle>Resultado Final</CardTitle>
            <CardDescription>Seu conteúdo está pronto! Copie o texto e use as mídias geradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Texto Gerado</Label>
          <Textarea value={generatedContent.text} readOnly rows={12} className="bg-muted mt-2" />
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigator.clipboard.writeText(generatedContent.text)}>Copiar Texto</Button>
          <Button onClick={onBack} variant="outline" className="mt-4 w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar e Editar
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {tierLevels[userPlan] >= tierLevels.premium && (
          <Card>
            <CardHeader><CardTitle>Etapa 4: Geração de Imagem</CardTitle><CardDescription>Transforme seu texto em uma imagem de impacto.</CardDescription></CardHeader>
            <CardContent>
              <Label>Selecione o Modelo de IA para Imagem</Label>
              <div className="grid grid-cols-1 gap-2 my-2">
                {availableImageModels.map(model => {
                  const isEnabled = availableApiKeys.has(model.id);
                  return (
                    <Button key={model.id} variant={generationConfig.imageModel === model.id ? 'default' : 'outline'} onClick={() => setGenerationConfig({ ...generationConfig, imageModel: model.id })} className="flex justify-between w-full h-auto py-2 px-3" disabled={!isEnabled} title={!isEnabled ? 'Chave de API não configurada' : ''}>
                      <div><p className="font-bold text-left">{model.name}</p><p className="text-xs text-left text-muted-foreground">{model.provider}</p></div>
                      <p className="text-sm font-semibold">{model.credits} créd.</p>
                    </Button>
                  )
                })}
              </div>
              <Button onClick={() => onGenerateMedia('image')} disabled={isLoading || !generationConfig.imageModel} className="w-full">{isLoading && loadingMessage.includes('imagem') ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingMessage}</> : <><ImageIcon className="mr-2 h-4 w-4" /> Gerar Imagem</>}</Button>
              {generatedContent.imageUrl && <img src={generatedContent.imageUrl} alt="Imagem gerada por IA" className="mt-4 rounded-lg w-full" />}
            </CardContent>
          </Card>
        )}

        {tierLevels[userPlan] >= tierLevels.ultra && (
          <Card>
            <CardHeader><CardTitle>Etapa 5: Geração de Vídeo</CardTitle><CardDescription>Dê vida ao seu conteúdo com vídeo.</CardDescription></CardHeader>
            <CardContent>
              <Label>Selecione o Modelo de IA para Vídeo</Label>
              <div className="grid grid-cols-1 gap-2 my-2">
                {availableVideoModels.map(model => {
                  const isEnabled = availableApiKeys.has(model.id);
                  return (
                    <Button key={model.id} variant={generationConfig.videoModel === model.id ? 'default' : 'outline'} onClick={() => setGenerationConfig({ ...generationConfig, videoModel: model.id })} className="flex justify-between w-full h-auto py-2 px-3" disabled={!isEnabled} title={!isEnabled ? 'Chave de API não configurada' : ''}>
                      <div><p className="font-bold text-left">{model.name}</p><p className="text-xs text-left text-muted-foreground">{model.provider}</p></div>
                      <p className="text-sm font-semibold">{model.credits} créd.</p>
                    </Button>
                  )
                })}
              </div>
              <Button onClick={() => onGenerateMedia('video')} disabled={isLoading || !generationConfig.videoModel} className="w-full">{isLoading && loadingMessage.includes('vídeo') ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingMessage}</> : <><VideoIcon className="mr-2 h-4 w-4" /> Gerar Vídeo</>}</Button>
              {generatedContent.videoUrl && <div className="mt-4 rounded-lg bg-gray-900 aspect-video w-full flex items-center justify-center text-white"><a href={generatedContent.videoUrl} target="_blank" rel="noreferrer">Ver Vídeo Gerado</a></div>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Step4MediaGeneration;
