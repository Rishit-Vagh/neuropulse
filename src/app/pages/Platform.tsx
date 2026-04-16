import React from 'react';
import { motion } from 'motion/react';
import { Layers, Zap, Shield, Cpu } from 'lucide-react';

export const Platform = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#02010a] pt-32 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <span className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-6 block">Infrastructure</span>
          <h1 className="text-5xl md:text-7xl font-semibold text-zinc-900 dark:text-white tracking-tighter mb-8">The NeuroPulse Framework.</h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            A unified stack for clinical AI. Combining high-performance computing with intuitive medical visualization to transform raw DICOM data into actionable insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {[
            { icon: Layers, title: 'Multi-Modal Processing', desc: 'Ingest MRI, CT, and Ultrasound data simultaneously for comprehensive anatomical mapping.' },
            { icon: Zap, title: 'Edge Inference', desc: 'Deploy models directly in clinical facilities for near-zero latency analysis during surgery.' },
            { icon: Shield, title: 'Secure Enclaves', desc: 'Patient data remains encrypted in memory during processing, satisfying DISHA requirements.' },
            { icon: Cpu, title: 'Neural Hardware', desc: 'Custom ASIC optimization for medical imaging workloads, reducing inference time to milliseconds.' }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5"
            >
              <feature.icon className="w-8 h-8 text-cyan-500 mb-8" />
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
