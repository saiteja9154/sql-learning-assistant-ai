import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, RefreshCw, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormatterModal({ isOpen, onClose }) {
  const [rawSql, setRawSql] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleQuery = "select e.first_name, e.last_name, d.dept_name, sum(s.amount) as total_salary from employees e inner join departments d on e.dept_id = d.id left join salaries s on e.id = s.emp_id where e.status = 'active' and s.year = 2024 group by e.first_name, e.last_name, d.dept_name having sum(s.amount) > 50000 order by total_salary desc limit 10;";

  const handleFormat = () => {
    if (!rawSql.trim()) return;

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 
      'ORDER BY', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 
      'DELETE FROM', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN', 
      'FULL JOIN', 'JOIN', 'ON', 'UNION ALL', 'UNION', 
      'CREATE TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'CREATE VIEW', 'WITH'
    ];

    let clean = rawSql.replace(/\s+/g, ' ').trim();

    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, `\n${kw}`);
    });

    const lines = clean.split('\n');
    const indented = lines.map(line => {
      let trimmed = line.trim();
      if (!trimmed) return '';

      keywords.forEach(kw => {
        if (trimmed.toUpperCase().startsWith(kw)) {
          trimmed = kw + trimmed.substring(kw.length);
        }
      });

      return trimmed;
    });

    setFormattedSql(indented.filter(l => l !== '').join('\n'));
  };

  const handleCopy = () => {
    if (!formattedSql) return;
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setRawSql('');
    setFormattedSql('');
  };

  const handleLoadSample = () => {
    setRawSql(sampleQuery);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-3xl bg-[#0b0d16] border border-white/[0.09] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90dvh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#080a12]/70">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-display">SQL Query Formatter</h2>
                <p className="text-[11px] text-slate-400 font-mono">Clean indentation & keyword capitalization</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Toolbar */}
          <div className="px-5 py-2.5 border-b border-white/[0.06] bg-[#0a0c16]/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFormat}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-glow-indigo transition-all cursor-pointer active:scale-95"
              >
                <Sparkles size={12} />
                <span>Format SQL</span>
              </button>
              <button
                onClick={handleLoadSample}
                className="px-3 py-1.5 rounded-xl text-xs bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 border border-white/[0.06] transition-all cursor-pointer"
              >
                Load Sample
              </button>
            </div>

            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <RefreshCw size={11} />
              <span>Clear</span>
            </button>
          </div>

          {/* Dual Pane Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Raw Input Pane */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Input SQL Query
                </span>
                <span className="text-[10px] text-slate-600 font-mono">Raw</span>
              </div>
              <textarea
                value={rawSql}
                onChange={(e) => setRawSql(e.target.value)}
                placeholder="Paste unformatted SQL here (e.g. select a,b from c where d=1)..."
                rows={10}
                className="w-full flex-1 bg-[#080a12] border border-white/[0.09] focus:border-purple-500/50 rounded-xl p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none shadow-inner"
              />
            </div>

            {/* Formatted Output Pane */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-semibold uppercase text-indigo-400">
                  Formatted Output
                </span>
                {formattedSql && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full flex-1 bg-[#080a12] border border-white/[0.09] rounded-xl p-3.5 font-mono text-xs text-slate-200 overflow-y-auto scrollbar-thin shadow-inner relative">
                {formattedSql ? (
                  <pre className="!bg-transparent !p-0 !m-0 font-mono leading-relaxed text-slate-200 whitespace-pre-wrap">
                    {formattedSql}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                    Click "Format SQL" to beautify your query
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
