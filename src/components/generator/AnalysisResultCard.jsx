import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const RatingStars = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const AnalysisResultCard = ({ theme, onSelect, isSelected }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="w-full">
      <Card className={`transition-all ${isSelected ? 'border-primary shadow-lg' : 'border-border'}`}>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <RadioGroupItem value={theme.theme} id={`theme-${theme.theme}`} checked={isSelected} onClick={() => onSelect(theme.theme)} />
              <Label htmlFor={`theme-${theme.theme}`} className="cursor-pointer">
                <CardTitle className="text-lg">{theme.theme}</CardTitle>
              </Label>
            </div>
            <RatingStars rating={theme.rating} />
          </div>
        </CardHeader>
        <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Ver Análise
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><TrendingUp />Análise de Relevância</DialogTitle>
                  <DialogDescription>
                    Análise detalhada sobre o potencial do tema "{theme.theme}".
                  </DialogDescription>
                </DialogHeader>
                <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto py-4">
                    <React.Fragment>
                        {theme.reasoning.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </React.Fragment>
                </div>
              </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisResultCard;
