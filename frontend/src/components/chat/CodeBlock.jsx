import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Check, Copy, Play } from 'lucide-react';

export default function CodeBlock({ language = 'sql', value = '', onRunInPractice }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [value, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSQL = language.toLowerCase() === 'sql' || value.toUpperCase().includes('SELECT');

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.09] bg-slate-900 dark:bg-[#090b14] text-slate-100 font-mono text-[13px] shadow-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 dark:bg-[#0e111d] border-b border-slate-800 dark:border-white/[0.06] select-none text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-semibold tracking-wider text-slate-400 dark:text-slate-300 uppercase font-mono">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isSQL && onRunInPractice && (
            <button
              onClick={() => onRunInPractice(value)}
              className="flex items-center gap-1 py-1 px-2 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/10 hover:bg-indigo-500/30 dark:hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 dark:border-indigo-500/20 transition-all cursor-pointer text-[11px] active:scale-95"
              title="Test in Interactive Practice Arena"
            >
              <Play size={10} className="fill-indigo-400 text-indigo-400" />
              <span>Practice</span>
            </button>
          )}

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 py-1 px-2 rounded-lg bg-white/[0.06] dark:bg-white/[0.03] hover:bg-white/[0.12] dark:hover:bg-white/[0.07] text-slate-300 dark:text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin bg-slate-900/95 dark:bg-[#07080f]">
        <pre className="!bg-transparent !p-0 !m-0 !font-mono text-slate-100 dark:text-slate-200 leading-relaxed text-[12.5px] sm:text-[13px]">
          <code className={`language-${language}`}>{value}</code>
        </pre>
      </div>
    </div>
  );
}
