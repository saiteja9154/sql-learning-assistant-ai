import React from 'react';
import { Menu, Plus, Award, Info, Sun, Moon, Terminal, Code } from 'lucide-react';

export default function Navbar({ 
  onClearChat, 
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
    <header className="sticky top-0 z-30 w-full h-13 border-b border-slate-200 dark:border-white/[0.07] bg-white/95 dark:bg-[#07080e]/95 backdrop-blur-xl flex-shrink-0">
      <div className="h-full px-3 sm:px-5 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            title={sidebarOpen ? "Close sidebar (Ctrl+H)" : "Open sidebar (Ctrl+H)"}
            aria-label="Toggle navigation menu"
          >
            <Menu size={17} />
          </button>

          <div className="flex items-center gap-2 select-none">
            <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 text-sm sm:text-[15px] tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">◈</span> SQLSense AI
            </span>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* New Chat */}
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.09] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer font-medium"
            title="Start new chat (Ctrl+N)"
          >
            <Plus size={13} className="text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
            <span className="hidden xs:inline">New Chat</span>
          </button>

          {/* Practice */}
          {onOpenPractice && (
            <button
              onClick={onOpenPractice}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
              title="Practice SQL (Ctrl+P)"
            >
              <Terminal size={13} className="text-indigo-600 dark:text-indigo-400" />
              <span>Practice</span>
            </button>
          )}

          {/* Quiz */}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
              title="Take SQL Quiz (Ctrl+Q)"
            >
              <Award size={13} className="text-cyan-600 dark:text-cyan-400" />
              <span>Quiz</span>
            </button>
          )}

          {/* Formatter */}
          {onOpenFormatter && (
            <button
              onClick={onOpenFormatter}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
              title="SQL Formatter (Ctrl+F)"
            >
              <Code size={13} className="text-purple-600 dark:text-purple-400" />
              <span>Formatter</span>
            </button>
          )}

          {/* Docs / About */}
          <button 
            onClick={onOpenAbout}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer"
            title="About & Topics (Ctrl+I)"
          >
            <Info size={15} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {themeMode === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
          </button>
        </div>

      </div>
    </header>
  );
}
