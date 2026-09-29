import React, { useState } from 'react';
import { 
  Plus, Terminal, Award, Code, ChevronLeft, X,
  Info, Moon, Sun, BookOpen, Search
} from 'lucide-react';
import AnimatedList from '../ui/AnimatedList';

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  recentQuestions = [], 
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
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#090b13] text-slate-800 dark:text-slate-100 h-[100dvh] transition-all duration-200 select-none ${
          isOpen ? 'w-64 translate-x-0 shadow-xl md:shadow-none' : 'w-0 -translate-x-full md:w-16 md:translate-x-0 overflow-hidden'
        }`}
      >
        {/* Top Header */}
        <div className="h-13 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-white/[0.07] flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                <span className="font-bold text-xs">◈</span>
              </div>
              <span className="font-semibold text-xs tracking-tight text-slate-900 dark:text-white font-sans">
                SQLSense AI
              </span>
            </div>
          ) : (
            <div className="mx-auto hidden md:block">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center text-white">
                <span className="font-bold text-xs">◈</span>
              </div>
            </div>
          )}

          <button 
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
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

        {/* Action Navigation */}
        <div className="p-2.5 flex flex-col gap-1 border-b border-slate-200 dark:border-white/[0.07] flex-shrink-0">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between py-2 px-3 text-xs rounded-xl bg-white dark:bg-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.1] active:bg-slate-200 dark:active:bg-white/[0.12] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-white/[0.08] shadow-2xs dark:shadow-none transition-all duration-150 cursor-pointer"
            title="New Chat (Ctrl+N)"
          >
            <div className="flex items-center gap-2">
              <Plus size={14} className="text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              {isOpen && <span>New Chat</span>}
            </div>
            {isOpen && (
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                Ctrl+N
              </span>
            )}
          </button>
          
          {/* Quick Tools */}
          <button
            onClick={onOpenPractice}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 text-xs rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
            title="Practice Mode (Ctrl+P)"
          >
            <Terminal size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            {isOpen && <span>Practice</span>}
          </button>

          <button
            onClick={onOpenQuiz}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 text-xs rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
            title="Quiz Mode (Ctrl+Q)"
          >
            <Award size={14} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
            {isOpen && <span>Quiz</span>}
          </button>

          <button
            onClick={onOpenFormatter}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 text-xs rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
            title="SQL Formatter (Ctrl+F)"
          >
            <Code size={14} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
            {isOpen && <span>Formatter</span>}
          </button>
        </div>

        {/* History / Recent Chats with AnimatedList */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {isOpen ? (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Recent Chats
                </span>
                {recentQuestions.length > 0 && (
                  <button 
                    onClick={onClearHistory}
                    className="text-[10px] text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Clear history"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* History Search */}
              {recentQuestions.length > 4 && (
                <div className="relative mb-2 px-1">
                  <Search size={11} className="absolute left-3 top-2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search history..."
                    className="w-full bg-white dark:bg-[#05060b] border border-slate-200 dark:border-white/[0.07] focus:border-indigo-500/50 rounded-md pl-6 pr-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                  />
                </div>
              )}

              {/* AnimatedList for Recent Chats */}
              <AnimatedList
                items={filteredHistory}
                onItemSelect={onSelectQuestion}
                onItemDelete={onDeleteQuestion}
                emptyText="No previous chats"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-2.5 border-t border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#07080f] flex flex-col gap-1 flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={onOpenAbout}
                className="flex items-center gap-2 py-1 px-2 text-[11.5px] rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="About SQLSense & Topics"
              >
                <BookOpen size={13} />
                <span>About & Topics</span>
              </button>

              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {themeMode === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={onOpenAbout}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
