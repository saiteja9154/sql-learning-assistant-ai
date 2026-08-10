import React from 'react';
import { Database, HelpCircle, RefreshCw, Cpu, Menu, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  onClearChat, 
  hasMessages, 
  onOpenAbout, 
  onToggleSidebar, 
  sidebarOpen,
  themeMode,
  onToggleTheme 
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Toggle and Brand */}
        <div className="flex items-center gap-3">
          {/* Sidebar menu toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200"
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <Menu size={18} />
          </button>

          {/* Logo brand */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue text-white shadow-glow-purple group-hover:scale-105 duration-300">
              <Database size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                SQLSense <span className="text-brand-purple">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                RAG Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Theme Visual Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900/40 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200"
            title="Toggle theme visual mode"
          >
            {themeMode === 'indigo' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* About Button */}
          <button 
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl font-medium border border-white/10 hover:border-white/20 bg-slate-900/40 text-slate-300 hover:text-white transition-all active:scale-95 duration-200"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Info</span>
          </button>

          {/* Reset/Clear Chat Button (visible only when there are messages) */}
          {hasMessages && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl font-semibold bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple hover:opacity-90 transition-all active:scale-95 duration-200"
              title="Reset conversation"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
