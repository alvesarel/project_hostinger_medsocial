import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold gradient-text">MedSocial AI</span>
            </div>
            <p className="text-muted-foreground text-sm">Potencializando profissionais da saúde com conteúdo de IA de alta performance.</p>
          </div>
          
          <div>
            <p className="font-semibold text-foreground mb-4">Navegação</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Início</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Preços</Link></li>
              <li><Link to="/generator" className="text-muted-foreground hover:text-primary">Gerador de Conteúdo</Link></li>
              <li><Link to="/demo" className="text-muted-foreground hover:text-primary">Demonstração</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-4">Empresa</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about-us" className="text-muted-foreground hover:text-primary">Sobre Nós</Link></li>
              <li><span className="text-muted-foreground/50 cursor-not-allowed">Carreiras</span></li>
              <li><span className="text-muted-foreground/50 cursor-not-allowed">Imprensa</span></li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-foreground mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground/50 cursor-not-allowed">Termos de Serviço</span></li>
              <li><span className="text-muted-foreground/50 cursor-not-allowed">Política de Privacidade</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MedSocial AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
