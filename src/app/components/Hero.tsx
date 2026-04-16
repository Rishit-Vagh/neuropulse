import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate?: (page: string) => void;
}

export const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-white dark:bg-[#02010a] overflow-hidden transition-colors duration-500">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[900px] h-[900px] bg-cyan-500/20 dark:bg-cyan-500/15 rounded-full blur-[180px]"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-[140px]"
        />
      </div>

      {/* Animated Floating Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 dark:bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1 + Math.random(), 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-cyan-500">Next-Gen Intelligence</span>
          </motion.div>

          {/* Main Heading with Shimmer */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-10 leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="block text-zinc-900 dark:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
            >
              Intelligence
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
                WebkitTextStroke: '0px',
              }}
            >
              Without Limits.
            </motion.span>
          </h1>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <button onClick={() => onNavigate?.('login')} className="group relative px-12 py-4 rounded-full overflow-hidden shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all" />
              <span className="relative z-10 flex items-center gap-2 text-white text-sm font-bold tracking-widest uppercase">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} className="group relative px-12 py-4 rounded-full overflow-hidden transition-all active:scale-[0.98]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-full border border-zinc-300 dark:border-white/15 group-hover:border-cyan-500/50 transition-colors" />
              <span className="relative z-10 text-zinc-800 dark:text-zinc-200 text-sm font-bold tracking-widest uppercase group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Learn More
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-4xl px-6"
      >
        <div className="relative group perspective-[2000px]">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-t from-cyan-500/30 via-blue-500/10 to-transparent blur-[80px] opacity-40 group-hover:opacity-70 transition-all duration-700" />

          <div className="relative bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-3xl border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_rgba(6,182,212,0.15)] rotate-x-12 transform-gpu">
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20 pointer-events-none" />

            <ImageWithFallback
              src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1080"
              alt="AI X-Ray Medical Analysis"
              className="w-full h-auto aspect-video object-cover mix-blend-multiply dark:mix-blend-lighten opacity-80"
            />
            {/* Animated Scanning Beam */}
            <motion.div
              animate={{ top: ["-20%", "120%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent z-20 pointer-events-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Shimmer keyframe style */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};
