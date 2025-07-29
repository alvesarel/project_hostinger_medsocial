import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordStrengthMeter from '@/components/profile/PasswordStrengthMeter';
import PasswordRequirements from '@/components/profile/PasswordRequirements';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.01,35.836,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      toast({ title: "Login realizado com sucesso!" });
      navigate('/generator');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais.",
      });
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      toast({
        variant: "destructive",
        title: "Senha fraca",
        description: "Sua senha não atende aos requisitos mínimos de segurança.",
      });
      return;
    }
    setLoading(true);
    
    const { error } = await signUp(email, password, {
      emailRedirectTo: `${window.location.origin}/auth/confirm`
    });

    if (!error) {
       setShowConfirmationMessage(true);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Em breve!",
      description: "A autenticação com Google será implementada futuramente.",
    });
  };

  const handlePasswordResetRequest = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email necessário",
        description: "Por favor, insira seu email no campo acima para redefinir a senha.",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha ao enviar email",
        description: "Ocorreu um erro. Verifique o e-mail e tente novamente.",
      });
    } else {
      toast({
        title: "Email de redefinição enviado!",
        description: "Verifique sua caixa de entrada para o link de redefinição de senha.",
      });
    }
  };

  const testUsers = [
    { email: 'basic@test.com', label: 'Usuário Teste (Basic)' },
    { email: 'plus@test.com', label: 'Usuário Teste (Plus)' },
    { email: 'premium@test.com', label: 'Usuário Teste (Premium)' },
    { email: 'ultra@test.com', label: 'Usuário Teste (Ultra)' },
    { email: 'superadmin@test.com', label: 'Usuário Teste (Super Admin)' },
  ];

  const handleTestLogin = async (testEmail) => {
    setLoading(true);
    setEmail(testEmail); // Pre-fill email for user to see
    setPassword('Password123!'); // Pre-fill password (common for test users)
    const { error } = await signIn(testEmail, 'Password123!');
    if (!error) {
      toast({ title: `Login como ${testEmail} realizado com sucesso!` });
      navigate('/generator');
    }
    setLoading(false);
  };

  if (showConfirmationMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center py-12 px-4"
      >
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Confirme seu e-mail</CardTitle>
            <CardDescription>Enviamos um link de confirmação para {email}. Por favor, verifique sua caixa de entrada e spam.</CardDescription>
          </CardHeader>
          <CardFooter>
             <Button className="w-full" onClick={() => navigate('/')}>Voltar para o Início</Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Cadastrar</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <form onSubmit={handleSignIn}>
              <CardHeader>
                <CardTitle>Bem-vindo de volta!</CardTitle>
                <CardDescription>Acesse sua conta para continuar criando.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                  <GoogleIcon />
                  Entrar com Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input id="email-signin" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Senha</Label>
                  <Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={setRememberMe} />
                        <Label htmlFor="remember-me" className="text-sm font-normal">Lembrar de mim</Label>
                    </div>
                    <Button variant="link" type="button" className="p-0 h-auto text-sm" onClick={handlePasswordResetRequest}>
                        Esqueceu a senha?
                    </Button>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button className="w-full" disabled={loading} type="submit">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <form onSubmit={handleSignUp}>
              <CardHeader>
                <CardTitle>Crie sua conta</CardTitle>
                <CardDescription>Comece a gerar conteúdo em segundos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
                  <GoogleIcon />
                  Cadastrar com Google
                </Button>
                 <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou cadastre com email</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Senha</Label>
                  <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  <PasswordStrengthMeter password={password} />
                  <PasswordRequirements password={password} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password-signup">Confirmar Senha</Label>
                  <Input id="confirm-password-signup" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={loading} type="submit">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cadastrar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Temporary Test Users Section for Debugging */}
      <Card className="w-[400px] mt-8 bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700">
        <CardHeader>
          <CardTitle className="text-amber-700 dark:text-amber-200">Usuários de Teste (Debugging)</CardTitle>
          <CardDescription className="text-amber-600 dark:text-amber-300">
            Clique para logar rapidamente. <br /> (Senha para todos: <code className="font-bold">Password123!</code>)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {testUsers.map((user, index) => (
            <Button
              key={index}
              variant="secondary"
              className="w-full justify-start text-left"
              onClick={() => handleTestLogin(user.email)}
              disabled={loading}
            >
              {loading && email === user.email ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {user.label} <span className="ml-auto text-muted-foreground text-xs">{user.email}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthPage;
