import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle, CheckCircle, MailWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const AuthConfirmPage = () => {
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const errorDescription = params.get('error_description');

        if (errorDescription) {
            if (errorDescription.includes('already been confirmed')) {
                setStatus('already_confirmed');
            } else if (errorDescription.includes('expired')) {
                setStatus('expired');
                const email = new URLSearchParams(window.location.search).get('email');
                if (email) setResendEmail(email);
            } else {
                setStatus('error');
                setError(errorDescription);
            }
        } else if (accessToken) {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    setStatus('success');
                    setTimeout(() => navigate('/profile-settings'), 3000);
                }
            });
        } else {
            setStatus('error');
            setError('Link de confirmação inválido ou ausente.');
        }

    }, [location, navigate]);
    
    const handleResendConfirmation = async () => {
        if (!resendEmail) {
            toast({ variant: 'destructive', title: 'Email não encontrado', description: 'Não foi possível encontrar o email para reenviar a confirmação.' });
            return;
        }

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: resendEmail,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/confirm`,
            }
        });

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao reenviar', description: error.message });
        } else {
            toast({ title: 'Email de confirmação reenviado!', description: `Verifique a sua caixa de entrada em ${resendEmail}.` });
            setStatus('resend_success');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                        <h1 className="text-2xl font-semibold">Verificando sua conta...</h1>
                        <p className="text-gray-600 mt-2">Isso levará apenas um momento.</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h1 className="text-2xl font-semibold">Email confirmado com sucesso!</h1>
                        <p className="text-gray-600 mt-2">Bem-vindo(a) à MedSocial AI! Redirecionando para completar seu perfil...</p>
                    </>
                );
            case 'already_confirmed':
                return (
                    <>
                        <MailWarning className="h-12 w-12 text-blue-500 mb-4" />
                        <h1 className="text-2xl font-semibold">Conta já confirmada</h1>
                        <p className="text-gray-600 mt-2">Seu email já foi verificado. Você pode fazer o login agora.</p>
                        <Button onClick={() => navigate('/auth')} className="mt-4">Ir para o Login</Button>
                    </>
                );
            case 'expired':
                return (
                    <>
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                        <h1 className="text-2xl font-semibold">Link de confirmação expirado</h1>
                        <p className="text-gray-600 mt-2">O seu link de confirmação expirou. Por favor, solicite um novo.</p>
                        <Button onClick={handleResendConfirmation} className="mt-4">Reenviar email de confirmação</Button>
                    </>
                );
             case 'resend_success':
                return (
                    <>
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h1 className="text-2xl font-semibold">Email Reenviado!</h1>
                        <p className="text-gray-600 mt-2">Verifique sua caixa de entrada para o novo link de confirmação.</p>
                        <Button onClick={() => navigate('/')} className="mt-4">Voltar para a Página Inicial</Button>
                    </>
                );
            case 'error':
            default:
                return (
                    <>
                        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                        <h1 className="text-2xl font-semibold">Ocorreu um erro</h1>
                        <p className="text-gray-600 mt-2">{error || 'Não foi possível verificar seu email. Por favor, tente novamente.'}</p>
                        <Button onClick={() => navigate('/')} className="mt-4">Voltar para a Página Inicial</Button>
                    </>
                );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Card className="w-[450px] text-center">
                <CardHeader>
                    <CardTitle>Confirmação de Conta</CardTitle>
                    <CardDescription>MedSocial AI</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6">
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthConfirmPage;
