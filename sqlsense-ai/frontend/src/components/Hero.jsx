import React from 'react';
import { Terminal, Code, Database, ArrowRight, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onPromptSelect }) {
  const promptCategories = [
    {
      category: "Core SQL Concepts",
      icon: Terminal,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
      prompts: [
        { label: "Explain INNER JOIN", query: "Explain INNER JOIN with a clear syntax example and sample output table." },
        { label: "How does GROUP BY work?", query: "How does GROUP BY work in SQL? Explain how it pairs with aggregate functions." },
        { label: "What is a CTE?", query: "What is a Common Table Expression (CTE) in SQL? How is it defined using WITH?" }
      ]
    },
    {
      category: "Interviews & Complex Queries",
      icon: Zap,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
      prompts: [
        { label: "Find the second highest salary", query: "Show me how to find the second highest salary in SQL using multiple approaches (subquery, CTE, DENSE_RANK)." },
        { label: "Explain Window Functions", query: "Explain Window Functions like ROW_NUMBER, RANK, and DENSE_RANK. How does PARTITION BY work?" },
        { label: "WHERE vs HAVING difference", query: "What is the difference between the WHERE and HAVING clauses? Give clear query examples." }
      ]
    },
    {
      category: "Schema & Performance",
      icon: Layers,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
      prompts: [
        { label: "Database Normalization (1NF-3NF)", query: "Explain database normalization (1NF, 2NF, 3NF) with a table transition example." },
        { label: "How Indexes speed up queries", query: "How do B-tree indexes speed up SQL queries and what are their trade-offs during INSERT/UPDATE?" },
        { label: "ACID in Transactions", query: "What are the ACID properties in database transactions? Provide a banking example." }
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto py-10 px-4 sm:px-6 z-10 select-none">
      
      {/* AI Visual Identity Orb / Indicator */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-6 flex items-center justify-center"
      >
        {/* Glowing atmospheric halo */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 blur-2xl pointer-events-none" />
        
        {/* Rotating technical ring */}
        <div className="w-16 h-16 rounded-full border border-indigo-500/30 border-dashed ai-orb-ring flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-purple-500/40" />
        </div>

        {/* Central glowing orb */}
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] ai-orb-pulse shadow-glow-indigo flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#090b14] flex items-center justify-center">
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-cyan-300">
              ◈
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 font-display"
      >
        SQL learning, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">without the boring part.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm sm:text-base text-slate-400 max-w-xl mb-8 leading-relaxed"
      >
        Ask anything about SQL. Learn concepts, explore queries, and test your knowledge with a developer-grade AI workspace.
      </motion.p>

      {/* Suggested Prompt Cards / Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left mb-6"
      >
        {promptCategories.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div 
              key={idx}
              className="glass-card p-4 rounded-2xl border border-white/[0.06] bg-[#0c0e17]/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg border ${group.color}`}>
                    <Icon size={14} />
                  </div>
                  <h2 className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                    {group.category}
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {group.prompts.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => onPromptSelect(p.query)}
                      className="group/btn w-full text-left text-xs text-slate-300 hover:text-white bg-white/[0.02] hover:bg-indigo-500/10 border border-white/[0.04] hover:border-indigo-500/30 rounded-xl px-3 py-2 transition-all duration-200 flex items-center justify-between active:scale-[0.98] cursor-pointer"
                    >
                      <span className="truncate pr-2">{p.label}</span>
                      <ArrowRight size={11} className="text-slate-500 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Micro Feature Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-white/[0.04] w-full max-w-2xl"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
          Keyless Local Engine
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1.5">
          <Database size={12} className="text-indigo-400" />
          30+ SQL Topics Loaded
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1.5">
          <Code size={12} className="text-purple-400" />
          Interactive Practice & Quizzes
        </span>
      </motion.div>

    </div>
  );
}
