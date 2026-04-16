import React from 'react';
import { motion } from 'motion/react';
import { Heart, Brain, Activity, Stethoscope } from 'lucide-react';

export const Clinical = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#02010a] pt-32 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <span className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-6 block">Diagnostics</span>
          <h1 className="text-5xl md:text-7xl font-semibold text-zinc-900 dark:text-white tracking-tighter mb-8">Medical Excellence.</h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Built by clinicians, for clinicians. Our algorithms are validated against gold-standard biopsy results and long-term longitudinal studies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Brain, title: 'Neurology', detail: 'Early detection of glial markers and volumetric atrophy analysis for Alzheimer’s pathways.' },
            { icon: Heart, title: 'Cardiology', detail: 'Automated EF calculation and wall motion abnormality detection from echocardiograms.' },
            { icon: Activity, title: 'Oncology', detail: 'Radiomic profiling of solid tumors to predict response to immunotherapy treatments.' }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] border border-zinc-200 dark:border-white/10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-cyan-500/5 flex items-center justify-center mb-8">
                <item.icon className="w-10 h-10 text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-light text-sm leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
