import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { RadioGroup } from '@/components/ui/radio-group';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import AnalysisResultCard from '@/components/generator/AnalysisResultCard';

const Step2_MarketAnalysis = ({ services, onBack, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysisResult(null);
    setSelectedTheme('');
    try {
      const { data, error } = await supabase.functions.invoke('perplexity-proxy', {
        body: { themes: services },
      });

      if (error) {
        throw error;
      }
      
      setAnalysisResult(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Análise de Mercado",
        description: error.message || "Não foi possível conectar com a IA. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = (theme) => {
    setSelectedTheme(theme);
  };
  
  const handleProceed = () => {
    if (!selectedTheme) {
      toast({
        variant: "destructive",
        title: "Nenhum tema selecionado",
        description: "Por favor, escolha um tema para continuar.",
      });
      return;
    }
    onComplete(selectedTheme);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Etapa 2: Análise de Relevância com IA</CardTitle>
          <CardDescription>
            Nossa IA irá analisar os serviços que você listou para identificar os temas com maior potencial de viralização e relevância para o seu público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analysisResult ? (
            <div className="text-center">
              <Button onClick={handleAnalyze} disabled={loading} size="lg">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />}
                {loading ? 'Analisando Mercado...' : 'Analisar Temas com IA'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 rounded-r-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300">Análise de Mercado Concluída!</h3>
                <p className="text-sm text-green-700 dark:text-green-400">{analysisResult.market_summary}</p>
              </div>

              <h4 className="font-semibold pt-4">Escolha o melhor tema para o seu post:</h4>
              <RadioGroup value={selectedTheme} onValueChange={handleSelection} className="space-y-2">
                {analysisResult.themes.map((theme, index) => (
                  <AnalysisResultCard 
                    key={index}
                    theme={theme}
                    onSelect={() => handleSelection(theme.theme)}
                    isSelected={selectedTheme === theme.theme}
                  />
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar (Etapa 1)
        </Button>
        <Button onClick={handleProceed} disabled={!selectedTheme}>
          {selectedTheme ? 'Confirmar Tema e Avançar' : 'Selecione um Tema'}
          {selectedTheme ? <Check className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default Step2_MarketAnalysis;
