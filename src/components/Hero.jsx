import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-card/80 rounded-full px-4 py-2 mb-6 border">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Powered by Claude Opus 4 & Perplexity AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Conteúdo de Redes Sociais</span>
              <br />
              <span className="text-foreground">para Profissionais da Saúde</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gere posts, legendas e scripts personalizados para Instagram, Facebook, TikTok e LinkedIn. 
              Baseado em pesquisas de mercado em tempo real e otimizado para o público brasileiro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Começar Gratuitamente
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/demo')}
                className="border-2 border-border hover:border-primary px-8 py-3 text-lg font-semibold"
              >
                Ver Demonstração
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/20">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-foreground mb-2">Pesquisa de Mercado</h3>
              <p className="text-sm text-muted-foreground">Análise automática de tendências com Perplexity AI</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/20">
              <Users className="h-8 w-8 text-purple-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-foreground mb-2">Público Brasileiro</h3>
              <p className="text-sm text-muted-foreground">Conteúdo otimizado para médicos e dentistas no Brasil</p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/20">
              <Zap className="h-8 w-8 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-foreground mb-2">IA Avançada</h3>
              <p className="text-sm text-muted-foreground">Claude Opus 4 para geração de conteúdo premium</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
    </section>
  );
};

export default Hero;
