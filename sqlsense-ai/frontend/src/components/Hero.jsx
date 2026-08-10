import React from 'react';
import { Sparkles, Terminal, Code, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Sparkle Tagline Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/5 shadow-glow-purple text-xs text-brand-purple font-medium mb-6 backdrop-blur-md"
      >
        <Sparkles size={12} className="fill-brand-purple" />
        <span>K-Hub Senior Intern Selection Project</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
      >
        SQLSense <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent font-black">AI</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg sm:text-xl text-slate-400 leading-relaxed font-normal mb-10 max-w-2xl"
      >
        Your Intelligent SQL Learning Assistant. Master relational databases, practice interviews, construct complex queries, and solve syntax errors with an expert AI tutor.
      </motion.p>

      {/* Quick Value Props Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left"
      >
        <div className="glass-card flex items-start gap-3 bg-slate-900/20">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm mb-1">Interactive Tutor</h3>
            <p className="text-xs text-slate-400 leading-normal">Explain syntax, concepts, window functions, and normalization simply.</p>
          </div>
        </div>

        <div className="glass-card flex items-start gap-3 bg-slate-900/20">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
            <Code size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm mb-1">Query Generator</h3>
            <p className="text-xs text-slate-400 leading-normal">Request query creation, optimized joins, subqueries, and views on the fly.</p>
          </div>
        </div>

        <div className="glass-card flex items-start gap-3 bg-slate-900/20">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm mb-1">RAG Extensible</h3>
            <p className="text-xs text-slate-400 leading-normal">Built modularly with API stubs to fetch real database schemas in the next phase.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
