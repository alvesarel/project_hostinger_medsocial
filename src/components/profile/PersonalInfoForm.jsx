import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, Briefcase, FileText } from 'lucide-react';

const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const PersonalInfoForm = ({ profileData, handleInputChange, userEmail, username }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-700">Informações Pessoais e de Contato</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="full_name">Nome Completo</Label>
          <div className="flex items-center gap-3 mt-2">
            <User className="h-5 w-5 text-gray-500" />
            <Input id="full_name" placeholder="Seu nome completo" value={profileData.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="specialty">Especialidade</Label>
          <div className="flex items-center gap-3 mt-2">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <Input id="specialty" placeholder="Ex: Cardiologista, Nutricionista" value={profileData.specialty} onChange={(e) => handleInputChange('specialty', e.target.value)} />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="professional_registration">Registro Profissional</Label>
          <div className="flex items-center gap-3 mt-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <Input className="flex-grow" id="professional_registration" placeholder="Número do seu registro" value={profileData.professional_registration} onChange={(e) => handleInputChange('professional_registration', e.target.value)} />
            <Select onValueChange={(value) => handleInputChange('professional_registration_uf', value)} value={profileData.professional_registration_uf}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                {ufs.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <div className="flex items-center gap-3 mt-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <Input id="phone" placeholder="(XX) XXXXX-XXXX" value={profileData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Switch id="display_phone" checked={profileData.display_phone} onCheckedChange={(checked) => handleInputChange('display_phone', checked)} />
            <Label htmlFor="display_phone" className="text-sm font-normal text-muted-foreground">Permitir exibição nas legendas</Label>
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-3 mt-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <Input id="email" value={userEmail} readOnly disabled className="cursor-not-allowed" />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Switch id="display_email" checked={profileData.display_email} onCheckedChange={(checked) => handleInputChange('display_email', checked)} />
            <Label htmlFor="display_email" className="text-sm font-normal text-muted-foreground">Permitir exibição nas legendas</Label>
          </div>
        </div>
        <div>
          <Label htmlFor="username">Nome de usuário</Label>
          <div className="flex items-center gap-3 mt-2">
            <User className="h-5 w-5 text-gray-500" />
            <Input id="username" value={username} readOnly disabled className="cursor-not-allowed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
