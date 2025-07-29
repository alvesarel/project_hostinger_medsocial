import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-9 h-9 overflow-hidden"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: 20, opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, scale: 0.5, rotate: 90 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="absolute"
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};

export default ThemeToggle;
