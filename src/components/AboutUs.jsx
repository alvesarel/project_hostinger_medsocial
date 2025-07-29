import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, HeartPulse, LineChart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-25"></div>
              <img
                className="relative rounded-lg shadow-2xl w-full h-auto"
                alt="Dra. Julieta sorrindo em seu consultório moderno"
               src="https://images.unsplash.com/photo-1617565980755-d57f254b0ba7" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-purple-600 font-semibold mb-2 block">Nossa História</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Da Frustração à Liberdade: A Jornada da <span className="gradient-text">Dra. Julieta</span> que Inspirou a MedSocial AI
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              A MedSocial AI nasceu da experiência real da Dra. Julieta, uma pediatra dedicada que se sentia invisível no mundo digital. Ela observava colegas com menos tempo e recursos atraindo pacientes através de estratégias de marketing digital, enquanto seu consultório, com anos de dedicação, lutava para expandir.
            </p>
            <p className="text-muted-foreground mb-8">
              Determinada a mudar essa realidade, Dra. Julieta decidiu aprender sobre marketing digital. Ela dedicou noites e fins de semana, testando diferentes abordagens e, por vezes, enfrentando desafios. Com persistência e criatividade, ela descobriu como transformar suas redes sociais em uma ferramenta poderosa de conexão com as famílias, conquistando não apenas mais pacientes, mas também a liberdade de gerenciar seu tempo e focar no que mais ama: cuidar da saúde e do bem-estar das crianças.
            </p>
            <p className="font-semibold text-foreground">
              Agora, a MedSocial AI encapsula todo esse aprendizado e sucesso em uma plataforma intuitiva, para que todo profissional da saúde possa trilhar o mesmo caminho de crescimento e liberdade, sem a necessidade de se tornar um especialista em marketing.
            </p>
          </motion.div>
        </div>

        <div className="text-center mt-24">
          <h2 className="text-3xl font-bold mb-4">Nossa Missão é o Seu Sucesso</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Acreditamos que todo profissional da saúde merece ser visto e valorizado. Nossa missão é fornecer as ferramentas para que você construa uma marca pessoal forte, conecte-se com seu público e alcance a independência profissional.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-6 rounded-lg text-center">
              <HeartPulse className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Foco no Paciente</h3>
              <p className="text-sm text-muted-foreground">Liberamos seu tempo para que você possa se dedicar ao que mais importa.</p>
            </Card>
            <Card className="p-6 rounded-lg text-center">
              <Lightbulb className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Inovação Contínua</h3>
              <p className="text-sm text-muted-foreground">Usamos a melhor IA para manter seu conteúdo sempre relevante.</p>
            </Card>
            <Card className="p-6 rounded-lg text-center">
              <LineChart className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Crescimento Acessível</h3>
              <p className="text-sm text-muted-foreground">Marketing digital de alta performance com baixo custo.</p>
            </Card>
            <Card className="p-6 rounded-lg text-center">
              <Zap className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Resultados Rápidos</h3>
              <p className="text-sm text-muted-foreground">Transforme sua presença online em semanas, não em anos.</p>
            </Card>
          </div>
        </div>

        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para Escrever sua Própria História de Sucesso?</h2>
            <p className="max-w-2xl mx-auto mb-8">
                Junte-se a centenas de profissionais que já estão transformando seus consultórios e suas vidas com a MedSocial AI.
            </p>
            <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/pricing')}
                className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-10 py-3 text-lg font-bold"
            >
                Ver Planos e Começar
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
