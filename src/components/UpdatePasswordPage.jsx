import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Check, X } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Muito Fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="w-full mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColors[strength - 1] || ''}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className={`text-xs mt-1 ${strength > 2 ? 'text-green-600' : 'text-red-600'}`}>
        Força: {strengthLabels[strength - 1] || 'N/A'}
      </p>
    </div>
  );
};

const PasswordRequirements = ({ password }) => {
    const requirements = useMemo(() => [
        { text: 'Pelo menos 8 caracteres', regex: /.{8,}/ },
        { text: 'Uma letra maiúscula', regex: /[A-Z]/ },
        { text: 'Uma letra minúscula', regex: /[a-z]/ },
        { text: 'Um número', regex: /[0-9]/ },
        { text: 'Um caractere especial', regex: /[^a-zA-Z0-9]/ },
    ], []);

    return (
        <ul className="text-xs text-muted-foreground space-y-1 mt-2">
            {requirements.map((req, i) => (
                <li key={i} className="flex items-center">
                    {req.regex.test(password) ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                        <X className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    {req.text}
                </li>
            ))}
        </ul>
    );
};

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // The user is in the password recovery flow
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      setError("Sua senha não atende aos requisitos mínimos de segurança.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setError('');
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message || "Ocorreu um erro ao atualizar a senha.");
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: updateError.message,
      });
    } else {
      setMessage("Sua senha foi atualizada com sucesso! Você será redirecionado para o login.");
      toast({
        title: "Senha atualizada!",
        description: "Você já pode fazer login com sua nova senha.",
      });
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center py-12 px-4"
    >
      <Card className="w-[400px]">
        <form onSubmit={handlePasswordUpdate}>
          <CardHeader>
            <CardTitle>Redefinir Senha</CardTitle>
            <CardDescription>Digite sua nova senha abaixo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrengthMeter password={password} />
              <PasswordRequirements password={password} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-500">{message}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={loading || !!message} type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar Senha
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default UpdatePasswordPage;
