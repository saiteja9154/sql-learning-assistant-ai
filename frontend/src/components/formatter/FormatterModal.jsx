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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#0d101a] border border-slate-200 dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90dvh] text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#090c15]">
            <div className="flex items-center gap-2">
              <Code size={16} className="text-purple-600 dark:text-purple-400" />
              <h2 className="text-sm font-semibold">SQL Formatter</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Toolbar */}
          <div className="px-4 sm:px-5 py-2 border-b border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#0b0e18] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFormat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Format SQL</span>
              </button>
              <button
                onClick={handleLoadSample}
                className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] transition-all cursor-pointer"
              >
                Load Sample
              </button>
            </div>

            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RefreshCw size={11} />
              <span>Clear</span>
            </button>
          </div>

          {/* Dual Pane */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Input Pane */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                Input SQL:
              </span>
              <textarea
                value={rawSql}
                onChange={(e) => setRawSql(e.target.value)}
                placeholder="Paste unformatted SQL query here..."
                rows={9}
                className="w-full flex-1 bg-slate-50 dark:bg-[#080a12] border border-slate-200 dark:border-white/[0.09] focus:border-purple-500 rounded-xl p-3 font-mono text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Output Pane */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                  Formatted Output:
                </span>
                {formattedSql && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
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
              <div className="w-full flex-1 bg-slate-50 dark:bg-[#080a12] border border-slate-200 dark:border-white/[0.09] rounded-xl p-3 font-mono text-xs text-slate-900 dark:text-slate-200 overflow-y-auto scrollbar-thin">
                {formattedSql ? (
                  <pre className="!bg-transparent !p-0 !m-0 font-mono leading-relaxed text-slate-900 dark:text-slate-200 whitespace-pre-wrap">
                    {formattedSql}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs italic py-8">
                    Formatted query will appear here
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
