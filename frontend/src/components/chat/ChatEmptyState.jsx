import React from 'react';
import BlurText from '../ui/BlurText';
import FadeContent from '../ui/FadeContent';
import ChatComposer from './ChatComposer';

export default function ChatEmptyState({
  input,
  setInput,
  onSendMessage,
  isGenerating,
  onStopGeneration,
  activeMode,
  onSelectMode,
  onOpenPractice,
  onOpenQuiz,
  onOpenFormatter
}) {
  const suggestions = [
    { label: "Explain INNER JOIN", query: "Explain INNER JOIN with a clear visual table diagram and query examples." },
    { label: "Second highest salary", query: "Show me how to find the second highest salary in SQL using multiple approaches (subquery, CTE, DENSE_RANK)." },
    { label: "Explain GROUP BY & HAVING", query: "How does GROUP BY work with HAVING in SQL? Explain with real-world filtering examples." },
    { label: "Window functions with PARTITION BY", query: "Explain Window Functions like ROW_NUMBER, RANK, and DENSE_RANK with PARTITION BY examples." },
    { label: "Database normalization (1NF-3NF)", query: "Explain database normalization from 1NF to 3NF with a step-by-step practical table transition example." },
    { label: "Index optimization trade-offs", query: "How do B-tree indexes speed up SQL queries and what are their trade-offs during INSERT/UPDATE operations?" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center my-auto px-3 sm:px-6 py-4 sm:py-6 text-center select-none">
      
      {/* Small SQLSense Brand Mark */}
      <div className="relative mb-2.5 flex items-center justify-center">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-xs">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            ◈
          </span>
        </div>
      </div>

      {/* BlurText Welcome Heading */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5 font-display">
        <BlurText
          text="How can I help with SQL?"
          delay={60}
          animateBy="words"
          direction="top"
          stepDuration={0.25}
          className="justify-center"
        />
      </h1>

      {/* FadeContent Supporting Description */}
      <FadeContent duration={0.4} delay={0.15} className="mb-5">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Ask a question, explain a concept, debug a query, or practice SQL.
        </p>
      </FadeContent>

      {/* Chat Composer */}
      <div className="w-full mb-4">
        <ChatComposer
          input={input}
          setInput={setInput}
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
          onStopGeneration={onStopGeneration}
          activeMode={activeMode}
          onSelectMode={onSelectMode}
          onOpenPractice={onOpenPractice}
          onOpenQuiz={onOpenQuiz}
          onOpenFormatter={onOpenFormatter}
          autoFocus={true}
        />
      </div>

      {/* Suggestion Chips */}
      <FadeContent duration={0.4} delay={0.25} className="w-full">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(s.query, activeMode)}
              className="text-[11px] sm:text-[11.5px] bg-slate-100 hover:bg-slate-200 dark:bg-[#10131d] dark:hover:bg-[#181c2b] active:scale-95 border border-slate-200 dark:border-white/[0.08] hover:border-indigo-400 dark:hover:border-indigo-500/40 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-full px-3 py-1.5 transition-all duration-150 cursor-pointer shadow-xs"
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </FadeContent>

    </div>
  );
}
