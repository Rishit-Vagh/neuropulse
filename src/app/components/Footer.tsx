import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="py-20 bg-zinc-50 dark:bg-[#02010a] border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-5 h-5 bg-cyan-500 rounded-full" />
              <span className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-900 dark:text-white">NeuroPulse</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed">
              Advancing medical intelligence through clinical-grade neural processing and zero-storage privacy standards.
            </p>
          </div>
          
          <div>
            <h4 className="text-zinc-900 dark:text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-8">Platform</h4>
            <ul className="space-y-4">
              {['Infrastructure', 'Edge Inference', 'Neural Core'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-500 dark:text-zinc-500 hover:text-cyan-500 text-[11px] font-medium tracking-wider uppercase transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 dark:text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Platform', id: 'platform' },
                { label: 'Clinical', id: 'clinical' },
                { label: 'Safety', id: 'safety' },
                { label: 'Neural Net', id: 'neural' },
              ].map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => onNavigate(item.id)}
                    className="text-zinc-500 dark:text-zinc-500 hover:text-cyan-500 text-[11px] font-medium tracking-wider uppercase transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 dark:text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-8">Contact</h4>
            <ul className="space-y-4">
              <li><a href="mailto:intelligence@neuropulse.ai" className="text-zinc-500 dark:text-zinc-500 hover:text-cyan-500 text-[11px] font-medium tracking-wider uppercase transition-colors">intelligence@neuropulse.ai</a></li>
              <li className="text-zinc-500 dark:text-zinc-500 text-[11px] font-medium tracking-wider uppercase leading-relaxed">
                Innovation Hub, Suite 402<br />
                Bangalore, KA 560001
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-zinc-200 dark:border-white/5 gap-8">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600">
            © 2026 NEUROPULSE AI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-10">
            {['Privacy Policy', 'Terms of Service', 'Clinical Disclosure'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 hover:text-cyan-500 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
