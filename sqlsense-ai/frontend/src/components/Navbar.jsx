import React from 'react';
import { Menu, Plus, Award, Info, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  onClearChat, 
  hasMessages, 
  onOpenAbout, 
  onToggleSidebar, 
  sidebarOpen,
  themeMode,
  onToggleTheme,
  onOpenQuiz
}) {
  return (
    <header className="sticky top-0 z-30 w-full h-13 sm:h-14 border-b border-white/[0.06] bg-[#07080c]/85 backdrop-blur-xl">
      <div className="h-full px-2.5 sm:px-4 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium select-none">
              <span className="text-white font-bold flex items-center gap-1 font-display tracking-tight text-sm">
                <span className="text-indigo-400">◈</span> SQLSense
              </span>
            </div>

            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] sm:text-[10px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xs:inline font-mono">Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* New Chat Quick Button */}
          <button
            onClick={onClearChat}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.06] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Start new conversation"
          >
            <Plus size={13} className="text-indigo-400" />
            <span className="text-[11px] font-medium">New</span>
          </button>

          {/* Quick Quiz Mode Button */}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/20 text-cyan-300 transition-all cursor-pointer"
              title="Practice with SQL Quizzes"
            >
              <Award size={12} />
              <span className="text-[11px] font-medium">Quiz</span>
            </button>
          )}

          {/* Docs Trigger */}
          <button 
            onClick={onOpenAbout}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-white/[0.06] active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="About & SQL Topics"
          >
            <Info size={15} className="text-slate-300" />
            <span className="hidden md:inline ml-1 text-[11px] font-medium">Docs</span>
          </button>

          {/* Theme Visual Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl hover:bg-white/[0.06] active:scale-95 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Toggle theme style"
          >
            {themeMode === 'indigo' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

      </div>
    </header>
  );
}
