import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { KeyRound, Loader2, Save } from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import PasswordRequirements from './PasswordRequirements';

const PasswordUpdateForm = () => {
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^a-zA-Z0-9]/.test(newPassword)) {
      toast({
        variant: "destructive",
        title: "Senha fraca",
        description: "Sua senha não atende aos requisitos mínimos de segurança.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Senhas não coincidem', description: 'Por favor, verifique a confirmação da senha.' });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao atualizar senha', description: error.message });
    } else {
      toast({ title: 'Sucesso!', description: 'Sua senha foi alterada.' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setSaving(false);
  };

  return (
    <Card>
      <form onSubmit={handlePasswordUpdate}>
        <CardHeader>
          <CardTitle className="text-xl">Alterar Senha</CardTitle>
          <CardDescription>Para sua segurança, escolha uma senha forte.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new_password">Nova Senha</Label>
            <div className="mt-2">
              <Input id="new_password" type="password" placeholder="Digite a nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <PasswordStrengthMeter password={newPassword} />
            <PasswordRequirements password={newPassword} />
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
            <div className="mt-2">
              <Input id="confirm_password" type="password" placeholder="Repita a nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="secondary" disabled={saving} className="ml-auto">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordUpdateForm;
