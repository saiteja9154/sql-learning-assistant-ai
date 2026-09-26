import React, { useState } from 'react';
import { 
  Plus, Terminal, Award, Code, ChevronLeft, X,
  MessageSquare, Trash2, Info, Moon, Sun, BookOpen, Search
} from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  recentQuestions, 
  onSelectQuestion, 
  onDeleteQuestion,
  onClearHistory,
  onNewChat,
  onOpenFormatter, 
  onOpenQuiz, 
  onOpenPractice,
  onOpenAbout,
  themeMode,
  onToggleTheme
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = recentQuestions.filter((q) =>
    q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        onClick={onToggle}
        className={`fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col glass-panel border-r border-white/[0.07] bg-[#07080f]/98 md:bg-[#07080e]/95 h-[100dvh] transition-all duration-300 select-none ${
          isOpen ? 'w-72 sm:w-68 translate-x-0 shadow-2xl md:shadow-none' : 'w-0 -translate-x-full md:w-16 md:translate-x-0 overflow-hidden'
        }`}
      >
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-white/[0.07] flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full rounded-[7px] bg-[#070912] flex items-center justify-center text-indigo-300 font-bold text-xs">
                  ◈
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-wider uppercase text-white font-display flex items-center gap-1.5">
                  SQLSense <span className="text-indigo-400">AI</span>
                </span>
                <span className="text-[9.5px] text-slate-500 font-mono">
                  Conversational Workspace
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto hidden md:block">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] flex items-center justify-center shadow-glow-indigo">
                <div className="w-full h-full rounded-[7px] bg-[#070912] flex items-center justify-center text-indigo-300 font-bold text-xs">
                  ◈
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <>
                <ChevronLeft size={16} className="hidden md:block" />
                <X size={16} className="md:hidden" />
              </>
            ) : (
              <ChevronLeft size={16} className="rotate-180" />
            )}
          </button>
        </div>

        {/* Action Controls Section */}
        <div className="p-3 flex flex-col gap-1.5 border-b border-white/[0.07] flex-shrink-0">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-glow-indigo transition-all duration-200 active:scale-[0.98] cursor-pointer"
            title="Start New Chat (Ctrl+N)"
          >
            <div className="flex items-center gap-2">
              <Plus size={15} className="stroke-[2.5]" />
              {isOpen && <span>New Chat</span>}
            </div>
            {isOpen && (
              <span className="text-[10px] opacity-70 font-mono px-1.5 py-0.5 rounded bg-black/20">
                Ctrl+N
              </span>
            )}
          </button>
          
          {/* Tools Navigation */}
          <button
            onClick={onOpenPractice}
            className="w-full flex items-center gap-2.5 py-2 px-2.5 text-xs rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="Practice SQL Challenges"
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Terminal size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Practice Challenges</span>
                <span className="text-[10px] text-indigo-400 font-mono">Arena</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenQuiz}
            className="w-full flex items-center gap-2.5 py-2 px-2.5 text-xs rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="SQL Quiz Challenges"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Award size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Quiz Mode</span>
                <span className="text-[10px] text-cyan-400 font-mono">Quiz</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenFormatter}
            className="w-full flex items-center gap-2.5 py-2 px-2.5 text-xs rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="SQL Formatter & Beautifier"
          >
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Code size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>SQL Formatter</span>
                <span className="text-[10px] text-purple-400 font-mono">Tool</span>
              </div>
            )}
          </button>
        </div>

        {/* History / Recent Queries List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin">
          {isOpen ? (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Recent Chats
                </span>
                {recentQuestions.length > 0 && (
                  <button 
                    onClick={onClearHistory}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer px-1 py-0.5"
                    title="Clear chat history"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* History Search if more than 4 items */}
              {recentQuestions.length > 4 && (
                <div className="relative mb-2 px-1">
                  <Search size={11} className="absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter history..."
                    className="w-full bg-[#05060b] border border-white/[0.07] focus:border-indigo-500/50 rounded-lg pl-7 pr-2 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              )}
              
              {recentQuestions.length === 0 ? (
                <div className="text-[11px] text-slate-500 px-2 py-6 italic text-center">
                  No previous conversations yet
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredHistory.map((q, idx) => (
                    <div 
                      key={idx}
                      className="group/item flex items-center justify-between rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] px-2.5 py-2 transition-colors"
                    >
                      <button
                        onClick={() => onSelectQuestion(q)}
                        className="flex-1 flex items-center gap-2 text-xs text-slate-300 hover:text-white truncate text-left cursor-pointer"
                        title={q}
                      >
                        <MessageSquare size={12} className="text-slate-500 flex-shrink-0" />
                        <span className="truncate">{q}</span>
                      </button>
                      {onDeleteQuestion && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuestion(q);
                          }}
                          className="opacity-60 md:opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all rounded cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pt-3">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
          )}
        </div>

        {/* Bottom Status & Info */}
        <div className="p-3 border-t border-white/[0.07] bg-[#06070d]/95 flex flex-col gap-1.5 flex-shrink-0">
          {isOpen ? (
            <>
              {/* Engine Status Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50 flex-shrink-0 animate-pulse" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-semibold text-slate-300 truncate">
                    SQLSense Engine Active
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">
                    Local Intelligence • Online
                  </span>
                </div>
              </div>

              {/* Utility Nav Controls */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <button
                  onClick={onOpenAbout}
                  className="flex-1 flex items-center gap-1.5 py-1.5 px-2 text-[11px] rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Architecture & Topics"
                >
                  <BookOpen size={12} />
                  <span>About & Topics</span>
                </button>

                <button
                  onClick={onToggleTheme}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Toggle Visual Theme"
                >
                  {themeMode === 'indigo' ? <Moon size={13} /> : <Sun size={13} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onOpenAbout}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 transition-colors"
                title="About & Topics"
              >
                <Info size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
