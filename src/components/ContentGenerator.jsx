import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { apiService } from '@/services/apiService';
import { allTextModels, allImageModels, allVideoModels, tierLevels } from '@/lib/models';

import Step1Brainstorm from '@/components/generator/Step1_Brainstorm';
import Step2MarketAnalysis from '@/components/generator/Step2_MarketAnalysis';
import Step3TextGeneration from '@/components/generator/Step3_TextGeneration';
import Step4MediaGeneration from '@/components/generator/Step4_MediaGeneration';

const Step = ({ children, active }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: active ? 1 : 0.5, y: active ? 0 : 20 }}
    transition={{ duration: 0.5 }}
    style={{ display: active ? 'block' : 'none' }}
  >
    {children}
  </motion.div>
);

const ContentGenerator = ({ userPlan, credits, setCredits, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [professionalInfo, setProfessionalInfo] = useState({ profession: 'Médico', specialty: '', services: '' });
  const [marketAnalysis, setMarketAnalysis] = useState({ report: '', themes: [] });
  const [selectedTheme, setSelectedTheme] = useState('');
  const [generationConfig, setGenerationConfig] = useState({ textModel: '', imageModel: '', videoModel: '' });
  const [generatedContent, setGeneratedContent] = useState({ text: '', imageUrl: '', videoUrl: '' });
  const [availableApiKeys, setAvailableApiKeys] = useState(new Set());

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [modelsRes, profileRes] = await Promise.all([
          supabase.from('models').select('model_name, api_key'),
          supabase.from('profiles').select('specialty').eq('id', user.id).single()
        ]);

        if (modelsRes.error) console.error('Error fetching API keys:', modelsRes.error);
        else {
          const availableKeys = new Set(modelsRes.data.filter(item => item.api_key).map(item => item.model_name));
          setAvailableApiKeys(availableKeys);
        }

        if (profileRes.error && profileRes.error.code !== 'PGRST116') console.error('Error fetching profile specialty:', profileRes.error);
        else if (profileRes.data) {
          setProfessionalInfo(prev => ({ ...prev, specialty: profileRes.data.specialty || '' }));
        }
      } catch (error) {
        toast({ title: "Erro ao carregar dados", description: "Não foi possível buscar suas informações.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  const availableTextModels = useMemo(() => allTextModels.filter(m => tierLevels[m.tier] <= tierLevels[userPlan]), [userPlan]);
  const availableImageModels = useMemo(() => allImageModels.filter(m => tierLevels[m.tier] <= tierLevels[userPlan]), [userPlan]);
  const availableVideoModels = useMemo(() => allVideoModels.filter(m => tierLevels[m.tier] <= tierLevels[userPlan]), [userPlan]);

  const handleNextStep = () => setCurrentStep(s => s + 1);
  const handlePreviousStep = () => setCurrentStep(s => s - 1);

  const saveContentToDB = async (type, text, url, prompt) => {
    if (!user) return;
    const { error } = await supabase.from('generated_content').insert({
      user_id: user.id,
      content_type: type,
      content_text: text,
      content_url: url,
      prompt_details: prompt,
    });
    if (error) {
      console.error('Error saving content:', error);
      toast({ title: "Erro ao salvar conteúdo", description: "Não foi possível salvar este item no seu histórico.", variant: "destructive" });
    }
  };

  const executeApiCall = async (apiFunction, creditType, creditCost, loadingMsg, ...args) => {
    if (credits[creditType] < creditCost) {
      toast({ title: `Créditos de ${creditType} Insuficientes`, description: `Você precisa de ${creditCost} créditos.`, variant: "destructive" });
      return null;
    }
    setIsLoading(true);
    setLoadingMessage(loadingMsg);
    try {
      const result = await apiFunction(...args);
      setCredits(c => ({ ...c, [creditType]: c[creditType] - creditCost }));
      return result;
    } catch (error) {
      toast({ title: "Erro na Operação", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center gradient-text mb-2">Painel de Criação IA</h1>
        <p className="text-center text-muted-foreground mb-8">Siga as etapas para criar seu conteúdo de alta performance.</p>

        <Step active={currentStep === 1}>
          <Step1Brainstorm
            professionalInfo={professionalInfo}
            setProfessionalInfo={setProfessionalInfo}
            credits={credits}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            onAnalysis={async () => {
              if (!professionalInfo.services) {
                toast({ title: "Informações Incompletas", description: "Por favor, preencha os temas para conteúdo.", variant: "destructive" });
                return;
              }
              const analysisResult = await executeApiCall(apiService.performMarketResearch, 'text', 5, 'Analisando mercado com Perplexity...', professionalInfo.services);
              if (analysisResult) {
                setMarketAnalysis(analysisResult);
                toast({ title: "Análise de Mercado Concluída!", description: "Escolha o tema com maior potencial." });
                handleNextStep();
              }
            }}
            onSuggestServices={async () => {
              if (!professionalInfo.specialty) {
                toast({ title: "Especialidade Necessária", description: "Preencha sua Área de Atuação primeiro.", variant: "destructive" });
                return;
              }
              const suggestedServices = await executeApiCall(apiService.generateSuggestedServices, 'text', 1, 'Sugerindo temas...', professionalInfo.specialty);
              if (suggestedServices) {
                setProfessionalInfo(prev => ({ ...prev, services: suggestedServices }));
                toast({ title: "Sugestões geradas!", description: "Os temas foram preenchidos para você." });
              }
            }}
          />
        </Step>

        <Step active={currentStep === 2}>
          <Step2MarketAnalysis
            marketAnalysis={marketAnalysis}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        </Step>

        <Step active={currentStep === 3}>
          <Step3TextGeneration
            selectedTheme={selectedTheme}
            generationConfig={generationConfig}
            setGenerationConfig={setGenerationConfig}
            availableTextModels={availableTextModels}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            onBack={handlePreviousStep}
            onGenerate={async () => {
              const model = allTextModels.find(m => m.id === generationConfig.textModel);
              if (!model) {
                toast({ title: "Modelo não selecionado", description: "Por favor, escolha um modelo para gerar o texto.", variant: "destructive" });
                return;
              }
              const prompt = `Como um(a) ${professionalInfo.profession} especialista em ${professionalInfo.specialty}, crie um post para rede social sobre o seguinte tema: "${selectedTheme}".`;
              const text = await executeApiCall(apiService.generateContent, 'text', model.credits, 'Gerando texto com IA...', model, prompt);
              if (text) {
                setGeneratedContent(prev => ({ ...prev, text }));
                await saveContentToDB('text', text, null, { professionalInfo, generationConfig, selectedTheme });
                toast({ title: "Texto gerado com sucesso!", description: "Agora você pode gerar uma imagem ou vídeo." });
                handleNextStep();
              }
            }}
          />
        </Step>

        <Step active={currentStep === 4}>
          <Step4MediaGeneration
            generatedContent={generatedContent}
            generationConfig={generationConfig}
            setGenerationConfig={setGenerationConfig}
            availableImageModels={availableImageModels}
            availableVideoModels={availableVideoModels}
            availableApiKeys={availableApiKeys}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            userPlan={userPlan}
            onGenerateMedia={async (type) => {
              const isImage = type === 'image';
              const model = isImage
                ? allImageModels.find(m => m.id === generationConfig.imageModel)
                : allVideoModels.find(m => m.id === generationConfig.videoModel);

              if (!model) {
                toast({ title: "Modelo não selecionado", description: `Por favor, selecione um modelo de ${type}.`, variant: "destructive" });
                return;
              }
              
              const prompt = `Baseado no seguinte texto, crie uma ${type} visualmente atraente: "${generatedContent.text.substring(0, 200)}..."`;
              const url = await executeApiCall(isImage ? apiService.generateImage : apiService.generateVideo, isImage ? 'image' : 'video', model.credits, `Gerando ${type}...`, model, prompt);

              if (url) {
                setGeneratedContent(prev => ({ ...prev, [isImage ? 'imageUrl' : 'videoUrl']: url }));
                await saveContentToDB(type, generatedContent.text, url, { professionalInfo, generationConfig, mediaPrompt: prompt });
                toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} gerado com sucesso!` });
              }
            }}
            onBack={handlePreviousStep}
          />
        </Step>
      </div>
    </section>
  );
};

export default ContentGenerator;
