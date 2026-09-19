import React from 'react';
import { 
  Plus, Terminal, Award, Code, ChevronLeft, ChevronRight, 
  MessageSquare, Trash2, Info, Moon, Sun
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
      {/* Mobile Backdrop Overlay when sidebar is open */}
      <div 
        onClick={onToggle}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col glass-panel border-r border-white/[0.06] bg-[#090b12]/95 md:bg-[#080a10]/80 h-full transition-all duration-300 select-none ${
          isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header: Brand & Collapse */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-white/[0.06]">
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
                <span className="text-[9px] text-slate-500 font-mono tracking-tight">
                  v1.0 • Workspace
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] flex items-center justify-center shadow-glow-indigo">
                <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 font-bold text-xs">
                  ◈
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isOpen ? "Collapse Sidebar (Ctrl+H)" : "Expand Sidebar (Ctrl+H)"}
          >
            {isOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>

        {/* Action Controls Section */}
        <div className="p-3 flex flex-col gap-1.5 border-b border-white/[0.06]">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-glow-indigo transition-all duration-200 active:scale-[0.98] cursor-pointer"
            title="Start New Chat Session"
          >
            <Plus size={14} className="stroke-[2.5]" />
            {isOpen && <span>New Conversation</span>}
          </button>
          
          {/* Developer Tool Navs */}
          <button
            onClick={onOpenFormatter}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 text-xs rounded-lg hover:bg-white/[0.04] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="SQL Formatter & Beautifier (Ctrl+F)"
          >
            <div className="p-1 rounded-md bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Code size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>SQL Formatter</span>
                <span className="text-[10px] text-slate-500 font-mono">^F</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenPractice}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 text-xs rounded-lg hover:bg-white/[0.04] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="Interactive SQL Challenges (Ctrl+P)"
          >
            <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Terminal size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Practice Challenges</span>
                <span className="text-[10px] text-slate-500 font-mono">^P</span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenQuiz}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 text-xs rounded-lg hover:bg-white/[0.04] text-slate-300 hover:text-white transition-all group cursor-pointer"
            title="Take SQL Quiz (Ctrl+Q)"
          >
            <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Award size={13} />
            </div>
            {isOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Quiz Mode</span>
                <span className="text-[10px] text-slate-500 font-mono">^Q</span>
              </div>
            )}
          </button>
        </div>

        {/* History / Recent Queries List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
          {isOpen ? (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Recent Queries
                </span>
                {recentQuestions.length > 0 && (
                  <button 
                    onClick={onClearHistory}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Clear history"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {recentQuestions.length === 0 ? (
                <div className="text-[11px] text-slate-600 px-2 py-4 italic text-center">
                  No previous queries
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {recentQuestions.map((q, idx) => (
                    <div 
                      key={idx}
                      className="group/item flex items-center justify-between rounded-lg hover:bg-white/[0.04] px-2 py-1.5 transition-colors"
                    >
                      <button
                        onClick={() => onSelectQuestion(q)}
                        className="flex-1 flex items-center gap-2 text-xs text-slate-400 hover:text-slate-100 truncate text-left cursor-pointer"
                        title={q}
                      >
                        <MessageSquare size={11} className="text-slate-500 flex-shrink-0" />
                        <span className="truncate">{q}</span>
                      </button>
                      {onDeleteQuestion && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuestion(q);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all rounded hover:bg-white/[0.05]"
                          title="Remove from history"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-slate-700" title="History minimized" />
            </div>
          )}
        </div>

        {/* Bottom Dock: Engine Status, About, Theme */}
        <div className="p-2.5 border-t border-white/[0.06] bg-[#07080e]/90 flex flex-col gap-1.5">
          {isOpen ? (
            <>
              {/* Engine Status Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50 flex-shrink-0 animate-pulse" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-semibold text-slate-300 truncate">
                    Local SQL Engine
                  </span>
                  <span className="text-[9px] text-emerald-400/80 font-mono">
                    Keyless • 0ms Latency
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
                  <Info size={12} />
                  <span>About & Docs</span>
                </button>

                <button
                  onClick={onToggleTheme}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Toggle Theme Visual Style"
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
                title="About SQLSense AI"
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
