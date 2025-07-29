import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

const Step1Brainstorm = ({
  professionalInfo,
  setProfessionalInfo,
  isLoading,
  loadingMessage,
  onAnalysis,
  onSuggestServices,
}) => {
  const isSuggesting = isLoading && loadingMessage.includes('Sugerindo');
  const isAnalyzing = isLoading && loadingMessage.includes('Analisando');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Etapa 1: Brainstorm de Temas</CardTitle>
        <CardDescription>Nos diga sobre você e os temas que deseja abordar. Isso personaliza a IA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="profession">Profissão</Label>
          <Select onValueChange={(value) => setProfessionalInfo({ ...professionalInfo, profession: value })} value={professionalInfo.profession}>
            <SelectTrigger id="profession"><SelectValue placeholder="Selecione a profissão" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Médico">Médico</SelectItem>
              <SelectItem value="Dentista">Dentista</SelectItem>
              <SelectItem value="Fisioterapeuta">Fisioterapeuta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="specialty">Área de Atuação / Especialidade</Label>
          <Input id="specialty" placeholder="Ex: Dermatologia, Implantodontia" value={professionalInfo.specialty} onChange={e => setProfessionalInfo({ ...professionalInfo, specialty: e.target.value })} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="services">Temas para Conteúdo / Serviços</Label>
            <Button variant="outline" size="sm" onClick={onSuggestServices} disabled={isSuggesting || isAnalyzing}>
              {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-purple-500" />}
              Sugerir Temas
            </Button>
          </div>
          <Textarea id="services" placeholder="Liste os temas ou serviços que deseja abordar, um por linha." value={professionalInfo.services} onChange={e => setProfessionalInfo({ ...professionalInfo, services: e.target.value })} rows={5} />
        </div>
        <Button onClick={onAnalysis} className="w-full" disabled={isLoading || !professionalInfo.services}>
          {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingMessage}</> : <>Analisar Temas com IA <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step1Brainstorm;
