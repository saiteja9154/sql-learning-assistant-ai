import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormatterModal({ isOpen, onClose }) {
  const [rawSql, setRawSql] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!rawSql.trim()) return;

    // Capitalized SQL keywords array
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 
      'ORDER BY', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 
      'DELETE FROM', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 
      'ON', 'UNION', 'UNION ALL', 'CROSS JOIN', 'FULL OUTER JOIN', 
      'CREATE TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'CREATE VIEW', 'WITH'
    ];

    // 1. Clean extra spaces
    let clean = rawSql.replace(/\s+/g, ' ').trim();

    // 2. Put newlines before primary commands
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, `\n${kw}`);
    });

    // 3. Align indents
    const lines = clean.split('\n');
    const indented = lines.map(line => {
      let trimmed = line.trim();
      if (!trimmed) return '';

      // Force keywords to uppercase
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-brand-purple" />
                <h2 className="text-lg font-bold text-slate-100">SQL Query Formatter</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Split layout body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 min-h-[40vh] scrollbar-thin">
              
              {/* Raw Input Column */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span>Raw SQL Input</span>
                  <button 
                    onClick={handleClear} 
                    className="hover:text-slate-300 transition-colors flex items-center gap-1 active:scale-95 duration-200"
                  >
                    <RefreshCw size={11} />
                    <span>Clear</span>
                  </button>
                </div>
                <textarea
                  value={rawSql}
                  onChange={(e) => setRawSql(e.target.value)}
                  placeholder="Paste raw/unformatted SQL here (e.g. select e.emp_id,e.first_name,d.dept_name from employees e join departments d on e.dept_id=d.dept_id where salary > 50000)..."
                  className="flex-1 min-h-[300px] glass-input resize-none font-mono text-sm leading-relaxed"
                />
              </div>

              {/* Formatted Output Column */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span>Formatted SQL Output</span>
                  {formattedSql && (
                    <button
                      onClick={handleCopy}
                      className="hover:text-slate-300 transition-colors flex items-center gap-1 active:scale-95 duration-200"
                    >
                      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      <span className={copied ? "text-green-400 font-medium" : ""}>
                        {copied ? "Copied!" : "Copy Output"}
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex-1 min-h-[300px] bg-slate-950/70 border border-white/5 rounded-xl p-4 overflow-auto scrollbar-thin">
                  {formattedSql ? (
                    <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap select-text leading-relaxed">
                      {formattedSql}
                    </pre>
                  ) : (
                    <span className="text-slate-600 font-mono text-xs italic block p-2">
                      Formatted query will display here...
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Footer containing Format Button */}
            <div className="p-4 border-t border-white/5 bg-slate-950/40 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all active:scale-95 duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFormat}
                disabled={!rawSql.trim()}
                className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 duration-200 ${
                  rawSql.trim()
                    ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                Format SQL
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
