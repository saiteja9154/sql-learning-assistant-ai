import React from 'react';
import { Terminal, Zap, Layers, ArrowRight, Award, Code, Sparkles, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onPromptSelect, onOpenQuiz }) {
  const quickCategories = [
    {
      category: "Core Concepts",
      icon: Terminal,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      prompts: [
        { label: "Explain INNER vs LEFT JOIN", query: "Explain the difference between INNER JOIN and LEFT JOIN with syntax examples." },
        { label: "How GROUP BY & HAVING work", query: "How does GROUP BY work with HAVING in SQL? Give a real-world aggregation example." },
      ]
    },
    {
      category: "Complex Queries",
      icon: Zap,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      prompts: [
        { label: "Find 2nd Highest Salary", query: "Show me how to find the second highest salary using CTE and DENSE_RANK in SQL." },
        { label: "Explain Window Functions", query: "Explain Window Functions like ROW_NUMBER, RANK, and DENSE_RANK with PARTITION BY." },
      ]
    },
    {
      category: "Database Design",
      icon: Layers,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      prompts: [
        { label: "Database Normalization (1NF-3NF)", query: "Explain database normalization from 1NF to 3NF with a practical table example." },
        { label: "How Indexes speed up queries", query: "How do B-tree indexes speed up SQL queries and what are their trade-offs during INSERT/UPDATE?" },
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto py-4 sm:py-8 px-2 sm:px-4 z-10 select-none">
      
      {/* AI Visual Orb */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-4 sm:mb-5 flex items-center justify-center"
      >
        <div className="absolute w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 blur-xl pointer-events-none" />
        
        <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-indigo-500/30 border-dashed ai-orb-ring flex items-center justify-center">
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border border-purple-500/40" />
        </div>

        <div className="absolute w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] ai-orb-pulse shadow-glow-indigo flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#090b14] flex items-center justify-center">
            <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
              ◈
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-display"
      >
        Master SQL, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">concept by concept.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-xs sm:text-sm text-slate-400 max-w-md mb-5 sm:mb-6 leading-relaxed"
      >
        Ask any SQL question, get instant syntax solutions, query walkthroughs, and practice problems.
      </motion.p>

      {/* Starter Prompts Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full text-left mb-5"
      >
        {quickCategories.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div 
              key={idx}
              className="glass-card p-3 rounded-2xl border border-white/[0.06] bg-[#0c0e17]/70 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg border ${group.color}`}>
                  <Icon size={13} />
                </div>
                <h2 className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">
                  {group.category}
                </h2>
              </div>

              <div className="flex flex-col gap-1.5">
                {group.prompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => onPromptSelect(p.query)}
                    className="w-full text-left text-xs text-slate-300 hover:text-white bg-white/[0.02] hover:bg-indigo-500/15 border border-white/[0.04] hover:border-indigo-500/30 rounded-xl px-2.5 py-2 transition-all duration-150 flex items-center justify-between active:scale-[0.98] cursor-pointer group/btn"
                  >
                    <span className="truncate pr-1.5">{p.label}</span>
                    <ArrowRight size={11} className="text-slate-500 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Feature Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex flex-wrap items-center justify-center gap-3 text-[10px] sm:text-[11px] text-slate-500 pt-2 border-t border-white/[0.04] w-full"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
          Keyless Local Engine
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1.5">
          <Database size={11} className="text-indigo-400" />
          30+ Topics
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1.5">
          <Code size={11} className="text-purple-400" />
          Real-time Queries
        </span>
      </motion.div>

    </div>
  );
}
