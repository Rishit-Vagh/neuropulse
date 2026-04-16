import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Lock, Users } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Clinical-Grade Precision",
      description: "Validated by top-tier medical institutions across Asia for oncology and neurology.",
      gradient: "from-cyan-500 to-teal-500",
      iconColor: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      glow: "group-hover:shadow-cyan-500/20",
    },
    {
      icon: Activity,
      title: "Real-time Inference",
      description: "Process complex 3D DICOM imagery in milliseconds with our edge-optimized neural core.",
      gradient: "from-blue-500 to-indigo-500",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      icon: Lock,
      title: "Sovereign Privacy",
      description: "Full DISHA compliance. We ensure all patient data processing remains ephemeral and secure.",
      gradient: "from-purple-500 to-pink-500",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      glow: "group-hover:shadow-purple-500/20",
    },
    {
      icon: Users,
      title: "Physician Focused",
      description: "Intuitive glassmorphic UI designed to integrate seamlessly into daily clinical workflows.",
      gradient: "from-amber-500 to-orange-500",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      glow: "group-hover:shadow-amber-500/20",
    }
  ];

  return (
    <section id="features-section" className="py-32 bg-white dark:bg-[#02010a] transition-colors duration-500 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/3 rounded-full blur-[120px]" />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

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
            Capabilities
            <span className="w-6 h-px bg-cyan-500" />
          </span>
          <h2 className="text-4xl md:text-6xl font-semibold text-zinc-900 dark:text-white tracking-tighter mb-4">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">NeuroPulse</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-md mx-auto">
            Built for the future of medical diagnostics, designed for today's clinicians.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className={`group relative p-8 rounded-[32px] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden ${feature.glow} hover:shadow-2xl`}
            >
              {/* Gradient top accent */}
              <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              {/* Subtle gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-[32px]`} />

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
