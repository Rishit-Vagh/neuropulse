import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const Scanner = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <section id="scanner-section" ref={containerRef} className="relative py-40 bg-white dark:bg-[#02010a] overflow-hidden transition-colors duration-500">
      {/* Gradient Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/8 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div style={{ y }} className="space-y-12">
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold"
              >
                <span className="w-8 h-px bg-cyan-500" />
                Deep Analysis
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-semibold text-zinc-900 dark:text-white tracking-tighter leading-[0.9]"
              >
                Neural Heatmap <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Visualization.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-zinc-500 dark:text-zinc-400 font-light max-w-lg leading-relaxed"
              >
                Our PulseCore engine decodes medical imagery layer by layer, identifying micro-calcifications and neural anomalies with human-surpassing accuracy.
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Sensitivity', value: '98.2%', color: 'from-cyan-500 to-blue-500' },
                { label: 'FPR Rate', value: '0.04%', color: 'from-blue-500 to-purple-500' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="group relative p-8 rounded-[30px] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 overflow-hidden hover:border-cyan-500/30 transition-all"
                >
                  {/* Gradient top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ scale }}
            className="relative aspect-square rounded-[60px] overflow-hidden group shadow-2xl"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=2000"
              alt="Neural Scanner"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
            {/* Holographic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,1,10,0.5)_100%)]" />

            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-cyan-500/20 rounded-full border-dashed pointer-events-none"
            />
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-px h-16 bg-cyan-400/40 mx-auto" />
                <div className="w-16 h-px bg-cyan-400/40 -mt-8 -ml-8" />
              </motion.div>
            </div>

            {/* Live Decoding Panel */}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Live Decoding</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase">Active</span>
                </div>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </section>
  );
};
