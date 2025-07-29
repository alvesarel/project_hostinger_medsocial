import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { KeyRound, Save, ShieldCheck, LogIn, Building, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';

const stripeConfigFields = [
    { id: 'stripe_publishable_key', name: 'Stripe - Chave Publicável' },
    { id: 'stripe_secret_key', name: 'Stripe - Chave Secreta (para Webhooks)' },
    { id: 'stripe_webhook_secret', name: 'Stripe - Segredo do Webhook' },
    { id: 'stripe_price_plus_monthly', name: 'Stripe ID - Plus Mensal' },
    { id: 'stripe_price_plus_yearly', name: 'Stripe ID - Plus Anual' },
    { id: 'stripe_price_pro_monthly', name: 'Stripe ID - Pro Mensal' },
    { id: 'stripe_price_pro_yearly', name: 'Stripe ID - Pro Anual' },
    { id: 'stripe_price_ultra_monthly', name: 'Stripe ID - Ultra Mensal' },
    { id: 'stripe_price_ultra_yearly', name: 'Stripe ID - Ultra Anual' },
];

const AdminPanel = ({ userRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    setIsSuperAdmin(userRole === 'super-admin');
  }, [userRole]);

  const fetchKeys = useCallback(async () => {
    if (!user || userRole !== 'super-admin') {
        setLoading(false);
        return;
    };
    setLoading(true);

    try {
        let { data, error } = await supabase
          .from('platform_api_keys')
          .select('keys')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setApiKeys(data.keys || {});
        } else {
          const { data: insertData, error: insertError } = await supabase
            .from('platform_api_keys')
            .insert({ id: 1, keys: {} })
            .select('keys')
            .single();

          if (insertError) throw insertError;
          setApiKeys(insertData.keys || {});
        }
    } catch (error) {
      toast({ title: 'Erro ao buscar chaves da plataforma', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (user) {
      fetchKeys();
    } else {
      setLoading(false);
    }
  }, [user, fetchKeys]);

  const handleKeyChange = (keyId, value) => {
    setApiKeys(prev => ({ ...prev, [keyId]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user || !isSuperAdmin) {
      toast({ title: 'Acesso negado', description: 'Apenas super-administradores podem salvar.', variant: 'destructive'});
      return;
    }

    setSaving(true);
    const { error } = await supabase
        .from('platform_api_keys')
        .update({ keys: apiKeys, updated_at: new Date().toISOString() })
        .eq('id', 1);

    if (error) {
      toast({ title: 'Erro ao salvar chaves', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: 'Configurações Salvas!',
        description: `As configurações globais da plataforma foram salvas com sucesso.`,
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> Carregando painel...</div>;
  }

  if (!user) {
    return (
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 container mx-auto px-4 text-center"
      >
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Faça login para acessar o painel de administração.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')}><LogIn className="mr-2 h-4 w-4" />Ir para Login</Button>
          </CardContent>
        </Card>
      </motion.section>
    );
  }
  
  if (!isSuperAdmin) {
    return (
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 container mx-auto px-4 text-center"
      >
        <Card className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border-red-400">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-300">Acesso Negado</CardTitle>
            <CardDescription className="text-red-700 dark:text-red-400">Você não tem permissão para visualizar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-500">Esta área é reservada para super-administradores.</p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }


  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 container mx-auto px-4"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <KeyRound className="h-8 w-8" />
              Painel Super-Admin
            </CardTitle>
            <CardDescription>
              Gerencie as chaves de API globais da plataforma e configurações de pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border-l-4 bg-purple-50 dark:bg-purple-900/20 border-purple-400 text-purple-800 dark:text-purple-300">
              <Building className="inline-block h-5 w-5 mr-2" />
              <span className="font-semibold">Modo de Operação:</span> Super Administrador (Configurações Globais)
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 text-green-800 dark:text-green-300">
              <ShieldCheck className="inline-block h-5 w-5 mr-2" />
              <span className="font-semibold">Segurança:</span> Suas chaves são salvas de forma segura no banco de dados.
            </div>
            
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-xl flex items-center gap-2"><CreditCard />Configuração de Pagamentos (Stripe)</h3>
                <p className="text-sm text-muted-foreground">
                    Insira as chaves do Stripe para habilitar as assinaturas dos planos.
                </p>
                {stripeConfigFields.map(field => (
                  <div key={field.id}>
                      <Label htmlFor={field.id}>{field.name}</Label>
                      <Input
                        id={field.id}
                        type="text"
                        placeholder={`Cole sua chave/ID aqui`}
                        value={apiKeys[field.id] || ''}
                        onChange={(e) => handleKeyChange(field.id, e.target.value)}
                        className="mt-2"
                      />
                  </div>
                ))}
            </div>

            <Button onClick={handleSaveChanges} className="w-full text-lg py-6" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default AdminPanel;
