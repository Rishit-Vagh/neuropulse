import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, EyeOff, Lock, FileCheck } from 'lucide-react';

export const Safety = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#02010a] pt-32 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <span className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-6 block">Protocol</span>
          <h1 className="text-5xl md:text-7xl font-semibold text-zinc-900 dark:text-white tracking-tighter mb-8">Patient Trust.</h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Safety is not a feature, it's our foundation. We implement rigorous double-blind testing and transparent bias reporting for every model deployment.
          </p>
        </motion.div>

        <div className="space-y-6 mb-32">
          {[
            { icon: EyeOff, title: 'Anonymization at Source', desc: 'All PII is stripped locally before data ever reaches the neural processing layer.' },
            { icon: Lock, title: 'DISHA Compliance', desc: 'Strict adherence to Indian digital health standards ensures sovereignty and ownership of patient data.' },
            { icon: FileCheck, title: 'Audit Logs', desc: 'Immutable blockchain-verified access logs for every diagnostic query performed on the platform.' },
            { icon: ShieldCheck, title: 'Safety Interlocks', desc: 'AI results must be peer-confirmed by a human physician before clinical finalization.' }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-8 p-10 rounded-[40px] bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <item.icon className="w-8 h-8 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
