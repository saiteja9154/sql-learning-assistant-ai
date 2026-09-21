import React from 'react';
import { 
  Plus, Terminal, Award, Code, ChevronLeft, X,
  MessageSquare, Trash2, Info, Moon, Sun, BookOpen
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
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        onClick={onToggle}
        className={`fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col glass-panel border-r border-white/[0.06] bg-[#090b12]/98 md:bg-[#080a10]/90 h-[100dvh] transition-all duration-300 select-none ${
          isOpen ? 'w-72 sm:w-64 translate-x-0 shadow-2xl md:shadow-none' : 'w-0 -translate-x-full md:w-16 md:translate-x-0 overflow-hidden'
        }`}
      >
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-white/[0.06] flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 font-bold text-xs">
                  ◈
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-wider uppercase text-white font-display flex items-center gap-1.5">
                  SQLSense <span className="text-indigo-400">AI</span>
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  v1.0 • Workspace
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto hidden md:block">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] flex items-center justify-center shadow-glow-indigo">
                <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 font-bold text-xs">
                  ◈
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close sidebar"
            aria-label="Close sidebar"
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
        <div className="p-3 flex flex-col gap-1.5 border-b border-white/[0.06] flex-shrink-0">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-glow-indigo transition-all duration-200 active:scale-[0.98] cursor-pointer"
            title="Start New Chat Session"
          >
            <Plus size={14} className="stroke-[2.5]" />
            {isOpen && <span>New Chat</span>}
          </button>
          
          {/* Developer Tools */}
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
                <span className="text-[10px] text-slate-500 font-mono">Tool</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenPractice}
            className="w-full flex items-center gap-2.5 py-2 px-2.5 text-xs rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="Interactive SQL Practice"
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Terminal size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Practice Challenges</span>
                <span className="text-[10px] text-slate-500 font-mono">Mode</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenQuiz}
            className="w-full flex items-center gap-2.5 py-2 px-2.5 text-xs rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="Take SQL Quiz"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Award size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Quiz Mode</span>
                <span className="text-[10px] text-slate-500 font-mono">Quiz</span>
              </div>
            )}
          </button>
        </div>

        {/* History / Recent Queries List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin">
          {isOpen ? (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Recent Chats
                </span>
                {recentQuestions.length > 0 && (
                  <button 
                    onClick={onClearHistory}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer px-1 py-0.5"
                    title="Clear history"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {recentQuestions.length === 0 ? (
                <div className="text-[11px] text-slate-600 px-2 py-4 italic text-center">
                  No previous chats yet
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {recentQuestions.map((q, idx) => (
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
                          className="opacity-60 md:opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all rounded"
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
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
          )}
        </div>

        {/* Bottom Status & Info */}
        <div className="p-3 border-t border-white/[0.06] bg-[#07080e]/95 flex flex-col gap-1.5 flex-shrink-0">
          {isOpen ? (
            <>
              {/* Engine Status Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50 flex-shrink-0 animate-pulse" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-semibold text-slate-300 truncate">
                    Local SQL Engine Active
                  </span>
                  <span className="text-[9px] text-emerald-400/90 font-mono">
                    Keyless • Fast Response
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
                title="About"
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
