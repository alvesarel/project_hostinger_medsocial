import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Veja a MedSocial AI em Ação</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Descubra como nossa plataforma pode transformar sua estratégia de conteúdo em menos de 2 minutos.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <PlayCircle className="mr-3 text-purple-600 h-8 w-8" />
            Demonstração Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center border">
            <video 
              className="w-full h-full rounded-lg"
              src="https://res.cloudinary.com/dbuj2u0xe/video/upload/v1721915995/Hostinger%20Horizons%20Demos/MedSocialAIDemo.mp4" 
              controls 
              autoPlay
              muted
              loop
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
        <p className="text-lg text-muted-foreground mb-6">Experimente você mesmo e veja a facilidade de criar conteúdo de alta qualidade.</p>
        <Button 
          size="lg" 
          onClick={() => navigate('/auth')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Começar Gratuitamente
        </Button>
      </div>
    </motion.div>
  );
};

export default DemoPage;
