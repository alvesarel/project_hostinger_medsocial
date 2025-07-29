import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, FileText, FileImage, Video, Download, Trash2, AlertTriangle } from 'lucide-react';

const MyContentPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchContent = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar conteúdos',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDownload = (item) => {
    if (item.content_type === 'text') {
      const blob = new Blob([item.content_text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medsocial_texto_${item.id.substring(0, 8)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      window.open(item.content_url, '_blank');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('generated_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== id));
      toast({ title: 'Conteúdo excluído com sucesso!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: error.message,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'text': return <FileText className="h-6 w-6 text-blue-500" />;
      case 'image': return <FileImage className="h-6 w-6 text-purple-500" />;
      case 'video': return <Video className="h-6 w-6 text-green-500" />;
      default: return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Meus Conteúdos - MedSocial AI</title>
        <meta name="description" content="Visualize e gerencie todo o conteúdo que você gerou com a MedSocial AI." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-5xl mx-auto">
          <CardHeader className="px-0">
            <CardTitle className="text-3xl font-bold gradient-text">Meus Conteúdos Gerados</CardTitle>
            <CardDescription>Aqui está o histórico de todo o conteúdo que você criou. Textos e imagens expiram em 30 dias, vídeos em 7 dias.</CardDescription>
          </CardHeader>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-4 text-lg">Carregando seu histórico...</p>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold text-foreground">Nenhum conteúdo encontrado</h3>
              <p className="mt-1 text-muted-foreground">Você ainda não gerou nenhum conteúdo. Comece agora!</p>
              <Button className="mt-6" onClick={() => window.location.href = '/generator'}>Ir para o Gerador</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">{getIcon(item.content_type)}</div>
                    <div className="flex-grow">
                      <p className="font-semibold capitalize">{item.content_type}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.content_type === 'text' ? item.content_text : item.content_url}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Criado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}>
                        {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default MyContentPage;
