import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, ArrowLeft } from 'lucide-react';

const Step3TextGeneration = ({
  selectedTheme,
  generationConfig,
  setGenerationConfig,
  availableTextModels,
  isLoading,
  loadingMessage,
  onGenerate,
  onBack,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Etapa 3: Geração de Texto</CardTitle>
        <CardDescription>Escolha o cérebro da sua criação para o tema <span className="font-bold text-primary">"{selectedTheme}"</span>.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Selecione o Modelo de IA para Texto</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {availableTextModels.map(model => (
              <Button key={model.id} variant={generationConfig.textModel === model.id ? 'default' : 'outline'} onClick={() => setGenerationConfig({ ...generationConfig, textModel: model.id })} className="flex justify-between w-full h-auto py-2 px-3">
                <div>
                  <p className="font-bold text-left">{model.name}</p>
                  <p className="text-xs text-left text-muted-foreground">{model.provider}</p>
                </div>
                <p className="text-sm font-semibold">{model.credits} créd.</p>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-4">
            <Button onClick={onBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button onClick={onGenerate} disabled={isLoading || !generationConfig.textModel} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingMessage || 'Gerando...'}</> : <>Gerar Texto e Avançar <FileText className="ml-2 h-4 w-4" /></>}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3TextGeneration;
