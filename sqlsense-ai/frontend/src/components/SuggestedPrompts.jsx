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
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 max-w-4xl mx-auto px-4 mb-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none pr-1">
        <Sparkles size={11} className="text-brand-purple fill-brand-purple/20" />
        <span>Try asking:</span>
      </div>
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(s)}
          className="text-xs bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-brand-purple/30 rounded-full px-3 py-1 text-slate-400 hover:text-slate-200 transition-all duration-200 active:scale-95 shadow-sm"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
