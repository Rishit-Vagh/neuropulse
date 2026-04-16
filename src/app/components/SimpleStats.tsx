import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { label: 'Detection Accuracy', value: '99.4', suffix: '%', detail: 'Validated across 12k+ clinical trials', color: 'from-cyan-500 to-teal-500' },
  { label: 'Inference Speed', value: '18', suffix: 'ms', detail: 'Edge-optimized neural processing', color: 'from-blue-500 to-indigo-500' },
  { label: 'Regulatory Compliance', value: 'DISHA', suffix: '', detail: 'We do not store any of your X-ray data.', color: 'from-purple-500 to-pink-500' },
];

export const SimpleStats = () => {
  return (
    <section className="py-32 bg-white dark:bg-[#02010a] relative overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-cyan-500/5 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
            <span className="w-6 h-px bg-cyan-500" />
            Metrics
            <span className="w-6 h-px bg-cyan-500" />
          </span>
          <h2 className="text-4xl md:text-6xl font-semibold text-zinc-900 dark:text-white tracking-tighter">
            By The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Numbers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10 }}
              className="group relative p-10 bg-zinc-50 dark:bg-white/[0.02] backdrop-blur-3xl border border-zinc-200 dark:border-white/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)] dark:hover:shadow-[0_20px_60px_-15px_rgba(6,182,212,0.2)]"
            >
              {/* Gradient ring behind value */}
              <div className={`absolute top-6 right-6 w-28 h-28 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-150 transition-all duration-700 blur-xl`} />

              {/* Top gradient hover bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-6">{stat.label}</span>
                <div className="mb-4">
                  <span className={`text-6xl md:text-7xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${stat.color} group-hover:scale-105 transition-transform duration-500 inline-block`}>
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-3xl md:text-4xl font-semibold text-zinc-400 dark:text-zinc-500 ml-1">{stat.suffix}</span>
                  )}
                </div>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm font-light leading-relaxed max-w-[220px]">
                  {stat.detail}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-zinc-200 dark:border-white/10 rounded-tr-2xl group-hover:border-cyan-500/40 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
