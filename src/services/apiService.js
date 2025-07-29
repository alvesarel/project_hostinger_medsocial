import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';


const getApiKeyForModel = async (modelId) => {
  const { data, error } = await supabase
    .from('models')
    .select('api_key')
    .eq('model_name', modelId)
    .single();

  if (error || !data?.api_key) {
    console.error(`Error fetching API key for ${modelId}:`, error?.message);
    throw new Error(`API key for ${modelId} not found.`);
  }
  return data.api_key;
};

const getApiKeyForPlatform = async (platformName) => {
    const { data, error } = await supabase
        .from('models')
        .select('api_key')
        .eq('platform', platformName)
        .limit(1)
        .single();
    
    if (error || !data?.api_key) {
        console.error(`Error fetching API key for platform ${platformName}:`, error?.message);
        throw new Error(`Perplexity API key not found`);
    }
    return data.api_key;
};

const generateSuggestedServices = async (specialty) => {
  try {
    const apiKey = await getApiKeyForModel('gemini-flash');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Me de 5 ideias de temas para minha especialidade, sou ${specialty}. Retorne apenas os temas, um por linha.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.replace(/^- /gm, '').replace(/\* /gm, '').trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate suggestions from Gemini.");
  }
};

const generateContent = async (modelInfo, prompt) => {
  try {
    const apiKey = await getApiKeyForModel(modelInfo.id);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelInfo.id.replace('gemini-', 'gemini-1.5-') });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content with ${modelInfo.name}.`);
  }
};

const parsePerplexityResponse = (responseText) => {
    const reportMatch = responseText.match(/Relatório de Mercado:([\s\S]*?)Avaliação dos temas:/i);
    const report = reportMatch ? reportMatch[1].trim() : "Não foi possível extrair o relatório de mercado da resposta da IA.";

    const themeSection = responseText.split(/Avaliação dos temas:/i)[1] || '';
    const themeLines = themeSection.split('\n').filter(line => line.trim() !== '');

    const themes = themeLines.map(line => {
        const nameMatch = line.match(/^(?:\d+\.\s*)?["*]?([^(*]+)["*]?/);
        const ratingMatch = line.match(/\((\d)\/5\)/);
        
        if (nameMatch && ratingMatch) {
            return {
                name: nameMatch[1].trim(),
                rating: parseInt(ratingMatch[1], 10)
            };
        }
        return null;
    }).filter(Boolean);

    if (themes.length === 0) {
        return { report, themes: [{ name: "Não foi possível extrair temas.", rating: 0 }] };
    }

    return { report, themes };
};


const performMarketResearch = async (themes) => {
    try {
        const { data, error } = await supabase.functions.invoke('perplexity-proxy', {
            body: { themes },
        });

        if (error) {
            throw new Error(`Edge function error: ${error.message}`);
        }

        if (data.error) {
            throw new Error(`Perplexity API error from server: ${data.error}`);
        }

        const content = data.content;
        return parsePerplexityResponse(content);
    } catch(error) {
        console.error("Error invoking perplexity-proxy Edge Function:", error);
        throw new Error("Failed to get market research from Perplexity.");
    }
};

const generateImage = async (model, prompt) => {
    await getApiKeyForModel(model.id); // Check for key
    console.log("--- Iniciando Geração de Imagem ---", { model: model.name, prompt });
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `https://placehold.co/1080x1080/8b5cf6/ffffff?text=Imagem+Gerada\\npor+${model.name.replace(' ', '+')}`;
};

const generateVideo = async (model, prompt) => {
    await getApiKeyForModel(model.id); // Check for key
    console.log("--- Iniciando Geração de Vídeo ---", { model: model.name, prompt });
    await new Promise(resolve => setTimeout(resolve, 5000));
    return `https://placehold.co/1080x1920/6366f1/ffffff?text=Video+Gerado\\npor+${model.name.replace(' ', '+')}`;
};

export const apiService = {
  generateSuggestedServices,
  generateContent,
  performMarketResearch,
  generateImage,
  generateVideo,
};
