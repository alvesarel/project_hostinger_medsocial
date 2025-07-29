import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Lightbulb, DollarSign, Settings } from 'lucide-react';

const TechExplainedSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Economia de Tempo Incrível',
      description: 'Gere posts, legendas e scripts em minutos, não em horas. Foco no que realmente importa: seus pacientes.',
    },
    {
      icon: Star,
      title: 'Conteúdo Profissional e Relevante',
      description: 'Crie materiais de alta qualidade, alinhados às diretrizes médicas e odontológicas, que engajam seu público.',
    },
    {
      icon: Lightbulb,
      title: 'Liberdade Criativa e Autonomia',
      description: 'Tenha controle total sobre sua comunicação. A IA é sua ferramenta, você é o estrategista.',
    },
    {
      icon: DollarSign,
      title: 'Redução de Custos',
      description: 'Elimine a necessidade de agências caras e freelancers. Produza conteúdo de ponta com um investimento acessível.',
    },
    {
      icon: Settings,
      title: 'Facilidade Técnica',
      description: 'Interface intuitiva e sem complicações. Não precisa ser um expert em tecnologia para criar conteúdo impactante.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center gradient-text mb-4"
        >
          Por Que Escolher MedSocial AI?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto"
        >
          Transforme sua presença digital com inteligência e eficiência.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <benefit.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechExplainedSection;
