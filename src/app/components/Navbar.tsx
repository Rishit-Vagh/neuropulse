import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  current: string;
}

export const Navbar = ({ onNavigate, current }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navItems = [
    { label: 'Platform', id: 'platform' },
    { label: 'Clinical', id: 'clinical' },
    { label: 'Safety', id: 'safety' },
    { label: 'Neural Network', id: 'neural' },
  ];

  return (
    <motion.nav
      animate={{
        backgroundColor: isScrolled ? (theme === 'dark' ? 'rgba(3, 2, 19, 0.8)' : 'rgba(255, 255, 255, 0.8)') : 'rgba(0,0,0,0)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        borderBottom: isScrolled ? (theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0,0,0,0.05)') : '1px solid rgba(0,0,0,0)',
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500"
    >
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => onNavigate('home')}
      >
        <div className="relative">
          <div className="w-5 h-5 bg-cyan-500 rounded-full animate-pulse blur-[2px]" />
          <div className="absolute inset-0 w-5 h-5 bg-cyan-400 rounded-full" />
        </div>
        <span className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-900 dark:text-white">NeuroPulse</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)}
            className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-colors
              ${current === item.id ? 'text-cyan-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-cyan-400'}
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-500 dark:text-zinc-400"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => onNavigate('login')}
          className="relative group px-6 py-2"
        >
          <div className="absolute inset-0 bg-zinc-900 dark:bg-white/5 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-500/10 rounded-full border border-zinc-200 dark:border-white/10 transition-all duration-300" />
          <span className="relative text-[11px] font-bold tracking-widest uppercase text-white dark:text-white group-hover:text-white dark:group-hover:text-cyan-400 transition-colors">
            Get Access
          </span>
        </button>
      </div>
    </motion.nav>
  );
};
