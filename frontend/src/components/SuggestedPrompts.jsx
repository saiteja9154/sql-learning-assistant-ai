import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedPrompts({ onSelectPrompt }) {
  const suggestions = [
    "Difference between UNION and UNION ALL?",
    "Explain Window Functions with SUM(x) OVER()",
    "How to index a foreign key column?",
    "What is ACID property in Transactions?",
    "Write a recursive CTE example"
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 px-0.5 py-1 mb-1 select-none">
      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 flex-shrink-0 pr-1">
        <Sparkles size={11} className="text-indigo-600 dark:text-indigo-400" />
        <span className="hidden xs:inline">Follow-up:</span>
      </div>
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(s)}
          className="text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-[#111420] dark:hover:bg-[#181c2d] active:bg-slate-300 dark:active:bg-[#1e2338] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-full px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-95 cursor-pointer flex-shrink-0 whitespace-nowrap"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
