import React from 'react';
import { Menu, RefreshCw, Download, Info, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  onClearChat, 
  hasMessages, 
  onDownloadChat,
  onOpenAbout, 
  onToggleSidebar, 
  sidebarOpen,
  themeMode,
  onToggleTheme 
}) {
  return (
    <header className="sticky top-0 z-30 w-full h-14 border-b border-white/[0.06] bg-[#07080c]/80 backdrop-blur-xl">
      <div className="h-full px-3.5 sm:px-5 flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Context Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <Menu size={16} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium select-none">
              <span className="text-white font-semibold flex items-center gap-1 font-display">
                <span className="text-indigo-400">◈</span> SQLSense
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">Workspace</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>RAG Engine Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex items-center gap-2">
          {/* Download Conversation */}
          {hasMessages && onDownloadChat && (
            <button
              onClick={onDownloadChat}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Export Conversation Log (.txt)"
            >
              <Download size={14} />
            </button>
          )}

          {/* Theme Visual Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Toggle Visual Theme"
          >
            {themeMode === 'indigo' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Info / Docs Trigger */}
          <button 
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Info size={13} className="text-indigo-400" />
            <span className="hidden sm:inline text-[11px] font-medium">Docs</span>
          </button>

          {/* Reset / New Session */}
          {hasMessages && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium bg-white/[0.05] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 transition-all cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw size={11} />
              <span className="hidden sm:inline text-[11px]">Reset</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
