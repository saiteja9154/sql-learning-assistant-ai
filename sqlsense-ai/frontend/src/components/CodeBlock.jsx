import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ language = 'sql', value = '' }) {
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

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-white/[0.09] bg-[#090b14] shadow-glass font-mono text-[13px] group/code">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0e111d] border-b border-white/[0.06] select-none text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono ml-1.5">
            {language}
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            ({lineCount} {lineCount === 1 ? 'line' : 'lines'})
          </span>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
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
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin">
        <pre className="!bg-transparent !p-0 !m-0 !font-mono text-slate-200 leading-relaxed">
          <code className={`language-${language}`}>{value}</code>
        </pre>
      </div>
    </div>
  );
}
