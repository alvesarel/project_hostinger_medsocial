import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page is now a generic callback handler. 
    // It might be used for OAuth logins (Google) or other flows.
    // The onAuthStateChange listener in AuthContext will handle the session
    // and App.jsx will redirect based on user state.
    
    // A small delay gives onAuthStateChange time to fire and update the user state.
    const timer = setTimeout(() => {
      // If the user is logged in, they will be redirected by logic in App.jsx
      // If not, we can send them to the pricing page as a default.
      toast({
        title: "Login bem-sucedido!",
        description: "Você será redirecionado em breve.",
      });
      navigate('/pricing'); 
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800">Finalizando autenticação...</h1>
      <p className="text-gray-600 mt-2">Estamos preparando tudo para você. Redirecionando...</p>
    </div>
  );
};

export default AuthCallbackPage;
