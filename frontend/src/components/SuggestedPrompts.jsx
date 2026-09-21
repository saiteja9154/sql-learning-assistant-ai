import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedPrompts({ onSelectPrompt }) {
  const suggestions = [
    "Difference between UNION and UNION ALL?",
    "Explain Window Functions with SUM(x) OVER()",
    "How to index a foreign key column?",
    "What is ACID property in Transactions?",
    "Write a CTE example"
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 px-1 py-1 mb-1.5 select-none touch-pan-x">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex-shrink-0 pr-1">
        <Sparkles size={11} className="text-indigo-400" />
        <span className="hidden xs:inline">Suggestions:</span>
      </div>
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(s)}
          className="text-[11px] bg-[#0e111d] hover:bg-[#161a2c] active:bg-[#1c2138] border border-white/[0.08] hover:border-indigo-500/40 rounded-full px-3 py-1 text-slate-300 hover:text-white transition-all duration-150 active:scale-95 shadow-xs cursor-pointer flex-shrink-0 whitespace-nowrap"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
