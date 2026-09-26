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

  const lineCount = value.split('\n').length;
  const isSQL = language.toLowerCase() === 'sql' || value.toUpperCase().includes('SELECT');

  return (
    <div className="relative my-3 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#070911] shadow-glass font-mono text-[13px] group/code">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0c0f1d] border-b border-white/[0.07] select-none text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase font-mono ml-1.5">
            {language}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            • {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isSQL && onRunInPractice && (
            <button
              onClick={() => onRunInPractice(value)}
              className="flex items-center gap-1 py-1 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/25 transition-all cursor-pointer text-[11px] active:scale-95"
              title="Test in Interactive Practice Arena"
            >
              <Play size={10} className="fill-indigo-400 text-indigo-400" />
              <span>Try in Practice</span>
            </button>
          )}

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
            title="Copy code snippet"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin bg-[#06080e]/90">
        <pre className="!bg-transparent !p-0 !m-0 !font-mono text-slate-200 leading-relaxed text-[12.5px] sm:text-[13px]">
          <code className={`language-${language}`}>{value}</code>
        </pre>
      </div>
    </div>
  );
}
