import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Gem, Crown, Sparkles, BrainCircuit, Search, Image, Video, CreditCard, Loader2, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const plans = {
  monthly: [
    { id: 'plus', name: 'Plus', price: 99, priceId: '', icon: Zap, description: 'Para quem está começando a impulsionar as redes.', credits: { text: 200, image: 0, video: 0 }, features: [{ text: '200 créditos de texto/mês', icon: Sparkles }, { text: 'Modelos de Texto (Claude Haiku, Gemini Pro)', icon: BrainCircuit }, { text: 'Pesquisa de Mercado (Perplexity)', icon: Search }, { text: 'Geração de Legendas e Hashtags', icon: CheckCircle }], color: 'blue' },
    { id: 'pro', name: 'Pro', price: 199, priceId: '', popular: true, icon: Gem, description: 'O plano ideal para profissionais que buscam crescimento.', credits: { text: 300, image: 150, video: 0 }, features: [{ text: '300 créditos de texto/mês', icon: Sparkles }, { text: '150 créditos de imagem/mês', icon: Image }, { text: 'Modelos Avançados (Claude Sonnet, GPT-4)', icon: BrainCircuit }, { text: 'Pesquisa de Mercado (Perplexity)', icon: Search }, { text: 'Geração de Imagens e Carrosséis', icon: Image }], color: 'purple' },
    { id: 'ultra', name: 'Ultra', price: 499, priceId: '', icon: Crown, description: 'Para agências e clínicas que precisam de escala máxima.', credits: { text: 1000, image: 500, video: 20 }, features: [{ text: '1000 créditos de texto/mês', icon: Sparkles }, { text: '500 créditos de imagem/mês', icon: Image }, { text: '20 créditos de vídeo/mês', icon: Video }, { text: 'Modelos Premium (Claude Opus, GPT-4 Turbo)', icon: BrainCircuit }, { text: 'Geração de Vídeos com IA', icon: Video }, { text: 'Pesquisa Avançada + PubMed', icon: Search }], color: 'amber' },
  ],
  yearly: [
    { id: 'plus', name: 'Plus Anual', price: 99 * 12 * 0.7, priceId: '', icon: Zap, description: 'Economize 30% com o plano anual.', credits: { text: 200, image: 0, video: 0 }, features: [{ text: '200 créditos de texto/mês', icon: Sparkles }, { text: 'Modelos de Texto (Claude Haiku, Gemini Pro)', icon: BrainCircuit }, { text: 'Pesquisa de Mercado (Perplexity)', icon: Search }, { text: 'Geração de Legendas e Hashtags', icon: CheckCircle }], color: 'blue' },
    { id: 'pro', name: 'Pro Anual', price: 199 * 12 * 0.7, priceId: '', popular: true, icon: Gem, description: 'Economize 30% com o plano anual.', credits: { text: 300, image: 150, video: 0 }, features: [{ text: '300 créditos de texto/mês', icon: Sparkles }, { text: '150 créditos de imagem/mês', icon: Image }, { text: 'Modelos Avançados (Claude Sonnet, GPT-4)', icon: BrainCircuit }, { text: 'Pesquisa de Mercado (Perplexity)', icon: Search }, { text: 'Geração de Imagens e Carrosséis', icon: Image }], color: 'purple' },
    { id: 'ultra', name: 'Ultra Anual', price: 499 * 12 * 0.7, priceId: '', icon: Crown, description: 'Economize 30% com o plano anual.', credits: { text: 1000, image: 500, video: 20 }, features: [{ text: '1000 créditos de texto/mês', icon: Sparkles }, { text: '500 créditos de imagem/mês', icon: Image }, { text: '20 créditos de vídeo/mês', icon: Video }, { text: 'Modelos Premium (Claude Opus, GPT-4 Turbo)', icon: BrainCircuit }, { text: 'Geração de Vídeos com IA', icon: Video }, { text: 'Pesquisa Avançada + PubMed', icon: Search }], color: 'amber' },
  ]
};

let stripePromise;

const PricingCard = ({ plan, onPlanSelect, popular, billingCycle }) => {
    const colorVariants = {
        blue: { bg: 'from-blue-500 to-blue-600', ring: 'ring-blue-500', text: 'text-blue-600', popular: 'bg-blue-600' },
        purple: { bg: 'from-purple-500 to-purple-600', ring: 'ring-purple-500', text: 'text-purple-600', popular: 'bg-purple-600' },
        amber: { bg: 'from-amber-500 to-amber-600', ring: 'ring-amber-500', text: 'text-amber-600', popular: 'bg-amber-600' },
    };
    const cardColor = colorVariants[plan.color] || colorVariants.blue;
    const priceDisplay = billingCycle === 'yearly' ? (plan.price / 12).toFixed(2) : plan.price.toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className={`h-full flex flex-col ${popular ? `border-purple-500 border-2 shadow-2xl scale-105` : 'shadow-lg'} relative`}>
        {popular && <div className={`absolute -top-4 right-4 ${cardColor.popular} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}><Star className="h-3 w-3" />MAIS POPULAR</div>}
        <CardHeader className="items-center pb-4">
            <div className={`p-3 rounded-full bg-gradient-to-br ${cardColor.bg} text-white`}><plan.icon className="h-8 w-8" /></div>
            <CardTitle className="text-2xl font-bold mt-4">{plan.name.replace(' Anual', '')}</CardTitle>
            <CardDescription className="text-center text-sm px-4">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-6">
          <div className="text-center mb-6">
            <span className="text-4xl font-bold">R${priceDisplay.replace('.',',')}</span>
            <span className="text-lg font-normal text-muted-foreground">/mês</span>
            {billingCycle === 'yearly' && <p className="text-sm text-green-600 font-semibold">Cobrado anualmente (R$ {plan.price.toFixed(2).replace('.',',')})</p>}
          </div>
          <ul className="space-y-3 text-muted-foreground mb-6 flex-grow">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <feature.icon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${cardColor.text}`} />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => onPlanSelect(plan)} className={`w-full mt-4 bg-gradient-to-r ${cardColor.bg} hover:brightness-110 text-lg py-6`} disabled={!plan.priceId}>
            {!plan.priceId ? 'Indisponível' : <><CreditCard className="mr-2 h-5 w-5" />Assinar {plan.name.replace(' Anual', '')}</>}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ComparisonTable = () => {
    const features = [
      { name: 'Créditos de Texto', basic: '10/mês', plus: '200/mês', pro: '300/mês', ultra: '1000/mês' },
      { name: 'Modelos de Texto Básicos', basic: true, plus: true, pro: true, ultra: true },
      { name: 'Modelos de Texto Avançados', basic: false, plus: false, pro: true, ultra: true },
      { name: 'Modelos de Texto Premium', basic: false, plus: false, pro: false, ultra: true },
      { name: 'Créditos de Imagem', basic: '0', plus: '0', pro: '150/mês', ultra: '500/mês' },
      { name: 'Geração de Carrosséis', basic: false, plus: false, pro: true, ultra: true },
      { name: 'Créditos de Vídeo', basic: '0', plus: '0', pro: '0', ultra: '20/mês' },
      { name: 'Pesquisa de Mercado', basic: false, plus: true, pro: true, ultra: true },
      { name: 'Pesquisa Avançada + PubMed', basic: false, plus: false, pro: false, ultra: true },
      { name: 'Suporte Prioritário', basic: false, plus: false, pro: false, ultra: true },
    ];
  
    return (
      <div className="mt-20">
        <h3 className="text-3xl font-bold text-center mb-8 gradient-text">Compare os Planos em Detalhes</h3>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-sm text-left text-muted-foreground bg-card">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 font-semibold text-card-foreground">Recursos</th>
                <th className="px-6 py-4 font-semibold text-center text-card-foreground">Básico</th>
                <th className="px-6 py-4 font-semibold text-center text-blue-500">Plus</th>
                <th className="px-6 py-4 font-semibold text-center text-purple-500">Pro</th>
                <th className="px-6 py-4 font-semibold text-center text-amber-500">Ultra</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-border hover:bg-accent">
                  <td className="px-6 py-4 font-medium text-card-foreground">{feature.name}</td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.basic === 'boolean' ? 
                      feature.basic ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      : feature.basic}
                  </td>
                  <td className="px-6 py-4 text-center">
                  {typeof feature.plus === 'boolean' ? 
                      feature.plus ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      : feature.plus}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-purple-500">
                  {typeof feature.pro === 'boolean' ? 
                      feature.pro ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      : feature.pro}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-amber-500">
                  {typeof feature.ultra === 'boolean' ? 
                      feature.ultra ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      : feature.ultra}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


const PricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [configuredPlans, setConfiguredPlans] = useState(plans);
  const [stripeKey, setStripeKey] = useState(null);

  useEffect(() => {
    const fetchStripeConfig = async () => {
        const { data, error } = await supabase
            .from('platform_api_keys')
            .select('keys')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching Stripe config:', error);
            toast({ title: "Erro ao carregar configuração de pagamento.", variant: "destructive" });
            return;
        }

        const keys = data?.keys || {};
        if (keys.stripe_publishable_key) {
            setStripeKey(keys.stripe_publishable_key);
            stripePromise = loadStripe(keys.stripe_publishable_key);
        }

        const updatedPlans = {
            monthly: plans.monthly.map(p => ({ ...p, priceId: keys[`stripe_price_${p.id}_monthly`] || '' })),
            yearly: plans.yearly.map(p => ({ ...p, priceId: keys[`stripe_price_${p.id}_yearly`] || '' }))
        };
        setConfiguredPlans(updatedPlans);
    };

    fetchStripeConfig();
  }, []);

  const handlePlanSelect = async (plan) => {
    if (!user) {
      toast({ title: "Ação necessária", description: "Faça login ou crie uma conta para assinar." });
      navigate('/auth');
      return;
    }
    if (!stripePromise || !plan.priceId) {
      toast({ title: "Pagamento Indisponível", description: "O sistema de pagamento não está configurado. Por favor, contate o suporte.", variant: "destructive"});
      return;
    }

    setLoading(true);
    
    try {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: plan.priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/generator?plan_upgraded=${plan.id}`,
            cancelUrl: `${window.location.origin}/pricing`,
            clientReferenceId: user.id
        });

        if (error) {
            toast({ title: "Erro no Checkout", description: error.message, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Não foi possível iniciar o checkout.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {loading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Loader2 className="h-16 w-16 text-white animate-spin" />
          </div>
        )}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text">Planos Flexíveis para Cada Etapa da sua Jornada</h2>
          <p className="mt-4 text-lg text-muted-foreground">Do profissional autônomo à grande clínica, temos o plano perfeito para impulsionar sua presença digital.</p>
        </div>
        
        <div className="flex justify-center items-center space-x-4 mb-12">
            <Label htmlFor="billing-cycle" className={billingCycle === 'monthly' ? 'font-bold' : ''}>Mensal</Label>
            <Switch 
                id="billing-cycle"
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <Label htmlFor="billing-cycle" className={billingCycle === 'yearly' ? 'font-bold' : ''}>Anual</Label>
            <div className="bg-green-100 text-green-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Economize 30%</div>
        </div>

        {!stripeKey && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 rounded-r-lg">
            <p className="font-bold">Aviso ao Administrador:</p>
            <p>O sistema de pagamento (Stripe) não está configurado. Por favor, insira a Chave Publicável e os IDs de Preço no <a href="/admin" className="underline font-semibold">Painel de Administração</a> para ativar os botões de assinatura.</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {configuredPlans[billingCycle].map((plan) => (
            <PricingCard key={plan.id} plan={plan} onPlanSelect={handlePlanSelect} popular={plan.popular} billingCycle={billingCycle} />
          ))}
        </div>
        <div className="text-center mt-12 text-foreground bg-card p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Comece a Explorar com o Plano Básico!</h3>
            <p className="text-muted-foreground mb-4">Teste nossa plataforma com 10 créditos de texto mensais, sem nenhum custo. Quando estiver pronto para mais, faça o upgrade a qualquer momento.</p>
            <Button onClick={() => navigate('/auth')} variant="outline" size="lg">Começar de Graça <Sparkles className="ml-2 h-4 w-4" /></Button>
        </div>

        <ComparisonTable />

      </div>
    </section>
  );
};

export default PricingSection;
