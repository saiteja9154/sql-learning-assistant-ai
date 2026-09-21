import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedPrompts({ onSelectPrompt }) {
  const suggestions = [
    "Difference between UNION and UNION ALL?",
    "Explain Window Functions with SUM(x) OVER()",
    "How to index a foreign key column?",
    "What is ACID property in Transactions?"
  ];

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 max-w-4xl mx-auto px-2 mb-2 select-none">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono pr-1">
        <Sparkles size={10} className="text-indigo-400" />
        <span>Try:</span>
      </div>
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(s)}
          className="text-[11px] bg-[#0e111d] hover:bg-[#161a2c] border border-white/[0.06] hover:border-indigo-500/30 rounded-lg px-2.5 py-1 text-slate-400 hover:text-white transition-all duration-150 active:scale-95 shadow-sm cursor-pointer truncate max-w-[280px]"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
