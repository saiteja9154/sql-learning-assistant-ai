import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowUp, Terminal, Zap, Layers, 
  HelpCircle, Code, Award, CheckCircle2, ChevronRight,
  Database, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ 
  onPromptSelect, 
  onOpenQuiz, 
  onOpenPractice, 
  onOpenFormatter,
  input,
  setInput,
  onSendMessage,
  isGenerating
}) {
  const [activeMode, setActiveMode] = useState('auto'); // 'auto' | 'explain' | 'optimize' | 'debug'
  const [greeting, setGreeting] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const heroTextareaRef = useRef(null);

  const placeholders = [
    "Ask anything: 'How to find the 2nd highest salary with CTE?'...",
    "Ask anything: 'Explain the difference between INNER and LEFT JOIN'...",
    "Ask anything: 'How do Window Functions work with PARTITION BY?'...",
    "Ask anything: 'Optimize a slow query with indexes and GROUP BY'...",
    "Ask anything: 'What is Database Normalization (1NF, 2NF, 3NF)?'...",
    "Ask anything: 'Debug this SQL: SELECT name, dept, AVG(salary) FROM emp'..."
  ];

  // Dynamic greeting based on user's current local hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  // Cycling placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // Prompt starter pills
  const promptPills = [
    {
      id: 'salary',
      category: 'Complex Query',
      tag: '⚡ Popular',
      title: '2nd Highest Salary',
      desc: 'CTE & DENSE_RANK approach',
      query: 'Show me how to find the second highest salary using CTE and DENSE_RANK in SQL with alternative approaches.',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300'
    },
    {
      id: 'joins',
      category: 'Fundamentals',
      tag: '🔗 Core',
      title: 'INNER vs LEFT JOIN',
      desc: 'Visual explanation with diagrams',
      query: 'Explain the difference between INNER JOIN and LEFT JOIN with syntax examples and sample result tables.',
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-300'
    },
    {
      id: 'window',
      category: 'Advanced SQL',
      tag: '📊 Analytics',
      title: 'Window Functions',
      desc: 'ROW_NUMBER, RANK & PARTITION',
      query: 'Explain Window Functions like ROW_NUMBER, RANK, and DENSE_RANK with practical PARTITION BY examples.',
      color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-300'
    },
    {
      id: 'groupby',
      category: 'Aggregation',
      tag: '⚙️ Logic',
      title: 'GROUP BY & HAVING',
      desc: 'Filtering aggregated rows',
      query: 'How does GROUP BY work with HAVING in SQL? Give a real-world aggregation filtering example.',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300'
    },
    {
      id: 'norm',
      category: 'Architecture',
      tag: '🧩 Design',
      title: 'Database Normalization',
      desc: '1NF, 2NF, 3NF explained simply',
      query: 'Explain database normalization from 1NF to 3NF with a step-by-step practical table transition example.',
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-300'
    },
    {
      id: 'index',
      category: 'Performance',
      tag: '🚀 Tuning',
      title: 'B-Tree Indexing',
      desc: 'Speed up slow queries',
      query: 'How do B-tree indexes speed up SQL queries and what are their trade-offs during INSERT/UPDATE operations?',
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-300'
    }
  ];

  const modes = [
    { id: 'auto', label: 'Smart Assistant', icon: Sparkles, color: 'text-indigo-400' },
    { id: 'explain', label: 'Explain Concept', icon: HelpCircle, color: 'text-purple-400' },
    { id: 'optimize', label: 'Optimize Query', icon: Zap, color: 'text-cyan-400' },
    { id: 'debug', label: 'Debug Error', icon: Code, color: 'text-rose-400' },
  ];

  const handleModeSelect = (modeId) => {
    setActiveMode(modeId);
    if (modeId === 'explain' && !input) {
      setInput('Explain the concept of: ');
    } else if (modeId === 'optimize' && !input) {
      setInput('Optimize this SQL query for high performance:\n\n');
    } else if (modeId === 'debug' && !input) {
      setInput('Debug this SQL error and fix the query:\n\n');
    }
    if (heroTextareaRef.current) {
      heroTextareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto py-4 sm:py-8 px-3 sm:px-6 z-10 w-full select-none">
      
      {/* Dynamic Animated AI Orb */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mb-5 flex items-center justify-center cursor-pointer group"
      >
        {/* Ambient Pulsing Halo */}
        <div className="absolute w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-600/35 via-purple-600/30 to-cyan-500/25 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
        
        {/* Outer Rotating Dashed Ring */}
        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border border-indigo-500/30 border-dashed ai-orb-ring flex items-center justify-center">
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-purple-500/30 border-dotted ai-orb-ring-reverse" />
        </div>

        {/* Central Glowing Spark Core */}
        <div className="absolute w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1.5px] ai-orb-pulse shadow-glow-indigo flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#080a12] flex items-center justify-center">
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-cyan-300 group-hover:rotate-180 transition-transform duration-500">
              ◈
            </span>
          </div>
        </div>
      </motion.div>

      {/* Header & Dynamic Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6 space-y-1.5"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{greeting} • Ready to code</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
          What SQL challenge can I <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">solve for you?</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Ask any database question, write complex queries, optimize bottlenecks, or walk through real interview challenges.
        </p>
      </motion.div>

      {/* Hero Centerpiece Chat Input Card (ChatGPT / Claude Style) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-2xl mb-6 text-left"
      >
        <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-[#0a0d18]/95 border border-white/[0.12] focus-within:border-indigo-500/70 focus-within:shadow-glow-indigo transition-all duration-300">
          
          {/* Mode Selector Chips */}
          <div className="flex items-center gap-1.5 pb-2.5 mb-2 border-b border-white/[0.05] overflow-x-auto no-scrollbar">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeSelect(m.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon size={12} className={m.color} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Input Area */}
          <div className="relative">
            <textarea
              ref={heroTextareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[placeholderIndex]}
              rows={2}
              disabled={isGenerating}
              className="w-full bg-transparent border-0 focus:outline-none px-1 text-slate-100 placeholder-slate-500 resize-none font-sans text-xs sm:text-sm leading-relaxed max-h-[140px] min-h-[50px] disabled:opacity-50"
            />
          </div>

          {/* Action Footer inside Input Capsule */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] mt-1">
            <div className="flex items-center gap-1.5">
              {onOpenPractice && (
                <button
                  onClick={onOpenPractice}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  title="Interactive SQL Practice"
                >
                  <Terminal size={11} className="text-indigo-400" />
                  <span className="hidden sm:inline">Practice Mode</span>
                </button>
              )}
              {onOpenQuiz && (
                <button
                  onClick={onOpenQuiz}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                  title="Take SQL Quiz"
                >
                  <Award size={11} className="text-cyan-400" />
                  <span className="hidden sm:inline">Quiz</span>
                </button>
              )}
              {onOpenFormatter && (
                <button
                  onClick={onOpenFormatter}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer"
                  title="SQL Formatter"
                >
                  <Code size={11} className="text-purple-400" />
                  <span className="hidden sm:inline">Formatter</span>
                </button>
              )}
            </div>

            {/* Send / Execute Button */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] text-slate-500 font-mono">
                Press ↵ Enter
              </span>
              <button
                onClick={() => onSendMessage(input)}
                disabled={isGenerating || !input.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  input.trim() && !isGenerating
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-glow-indigo hover:scale-105 active:scale-95'
                    : 'bg-white/[0.05] text-slate-500 cursor-not-allowed border border-white/[0.04]'
                }`}
                title="Send query"
              >
                <ArrowUp size={15} className={isGenerating ? 'animate-pulse' : 'stroke-[2.5]'} />
              </button>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Suggested Topic Starter Pills (Replacing bulky boxes) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full max-w-3xl"
      >
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap size={12} className="text-indigo-400" />
            Quick Exploration Starters
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Click any topic to ask instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-left">
          {promptPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => onPromptSelect(pill.query)}
              className="glass-card-interactive p-3 rounded-xl border border-white/[0.07] flex flex-col justify-between group/pill text-left cursor-pointer active:scale-[0.98] transition-all duration-200 hover:border-indigo-500/40"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium border bg-white/[0.02] border-white/[0.06] text-slate-300">
                    {pill.tag}
                  </span>
                  <ChevronRight size={12} className="text-slate-500 group-hover/pill:text-indigo-400 group-hover/pill:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-xs font-semibold text-white tracking-tight group-hover/pill:text-indigo-300 transition-colors">
                  {pill.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {pill.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
