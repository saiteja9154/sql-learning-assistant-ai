import React from 'react';
import { Menu, Plus, Award, Info, Sun, Moon, Terminal, Code } from 'lucide-react';

export default function Navbar({ 
  onClearChat, 
  hasMessages, 
  onOpenAbout, 
  onToggleSidebar, 
  sidebarOpen,
  themeMode,
  onToggleTheme,
  onOpenQuiz,
  onOpenPractice,
  onOpenFormatter
}) {
  return (
    <header className="sticky top-0 z-30 w-full h-14 border-b border-white/[0.07] bg-[#07080e]/90 backdrop-blur-2xl">
      <div className="h-full px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={sidebarOpen ? "Close sidebar (Ctrl+H)" : "Open sidebar (Ctrl+H)"}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-medium select-none">
              <span className="text-white font-bold flex items-center gap-1.5 font-display tracking-tight text-sm sm:text-base">
                <span className="text-indigo-400 text-sm">◈</span> SQLSense
              </span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">v2.0</span>
            </div>
          </div>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* New Chat Quick Button */}
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-white/[0.05] hover:bg-white/[0.09] active:scale-95 border border-white/[0.08] text-slate-200 hover:text-white transition-all cursor-pointer font-medium"
            title="Start new conversation (Ctrl+N)"
          >
            <Plus size={14} className="text-indigo-400 stroke-[2.5]" />
            <span className="hidden xs:inline">New Chat</span>
          </button>

          {/* Practice Challenges */}
          {onOpenPractice && (
            <button
              onClick={onOpenPractice}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 border border-indigo-500/25 text-indigo-300 hover:text-white transition-all cursor-pointer"
              title="Practice SQL Challenges (Ctrl+P)"
            >
              <Terminal size={12} className="text-indigo-400" />
              <span>Practice</span>
            </button>
          )}

          {/* Quiz Mode Button */}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/25 text-cyan-300 hover:text-white transition-all cursor-pointer"
              title="Test with SQL Quizzes (Ctrl+Q)"
            >
              <Award size={12} className="text-cyan-400" />
              <span>Quiz</span>
            </button>
          )}

          {/* Formatter Trigger */}
          {onOpenFormatter && (
            <button
              onClick={onOpenFormatter}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl bg-purple-500/10 hover:bg-purple-500/20 active:scale-95 border border-purple-500/25 text-purple-300 hover:text-white transition-all cursor-pointer"
              title="SQL Formatter & Beautifier (Ctrl+F)"
            >
              <Code size={12} className="text-purple-400" />
              <span>Formatter</span>
            </button>
          )}

          {/* Docs Trigger */}
          <button 
            onClick={onOpenAbout}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-white/[0.06] active:scale-95 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="About & Topics (Ctrl+I)"
          >
            <Info size={15} />
            <span className="hidden md:inline ml-1 text-xs">Docs</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl hover:bg-white/[0.06] active:scale-95 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Toggle theme styling"
          >
            {themeMode === 'indigo' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

      </div>
    </header>
  );
}
