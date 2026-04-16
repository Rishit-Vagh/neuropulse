import React from 'react';
import { motion } from 'motion/react';
import { Network, Database, Cpu, Share2 } from 'lucide-react';

export const NeuralNetwork = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#02010a] pt-32 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <span className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-6 block">Architecture</span>
          <h1 className="text-5xl md:text-7xl font-semibold text-zinc-900 dark:text-white tracking-tighter mb-8">PulseCore Engine.</h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Our proprietary neural architecture is trained on the largest curated clinical dataset in Asia, featuring over 40 million high-resolution labeled images.
          </p>
        </motion.div>

        <div className="relative rounded-[60px] overflow-hidden bg-zinc-900 aspect-[16/9] mb-32 group">
          <img 
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=2000" 
            alt="Data Center" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-16 left-16 right-16">
            <h3 className="text-4xl font-bold text-white mb-4">40M+ Parameters</h3>
            <p className="text-zinc-400 max-w-xl">Optimized for sparse clinical data, allowing for high accuracy even with low-dose imaging samples.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
