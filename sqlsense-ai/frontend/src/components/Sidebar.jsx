import React from 'react';
import { 
  History, Terminal, Award, BookOpen, ChevronLeft, ChevronRight, 
  Plus, MessageSquare, Code, Compass, Info 
} from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  recentQuestions, 
  onSelectQuestion, 
  onNewChat,
  onOpenFormatter, 
  onOpenQuiz, 
  onOpenPractice,
  onOpenAbout
}) {
  return (
    <aside 
      className={`glass-panel border-r border-white/5 h-screen flex flex-col transition-all duration-300 z-40 select-none ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Top Brand / Toggle Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-slate-950/20">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-brand-purple" />
            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SQLSense Tools
            </span>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors mx-auto active:scale-95 duration-200"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Action Controls Section */}
      <div className="p-3 flex flex-col gap-2 border-b border-white/5">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs rounded-xl bg-gradient-to-tr from-brand-purple/20 to-brand-blue/20 hover:from-brand-purple/35 hover:to-brand-blue/35 text-white border border-brand-purple/30 transition-all font-medium active:scale-95 duration-200"
          title="New Chat Session"
        >
          <Plus size={14} />
          {isOpen && <span>New Chat</span>}
        </button>
        
        {/* SQL Formatter Button */}
        <button
          onClick={onOpenFormatter}
          className="w-full flex items-center gap-3 py-2 px-3 text-xs rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all font-medium active:scale-95 duration-200"
          title="SQL Query Formatter"
        >
          <Code size={14} className="text-purple-400" />
          {isOpen && <span>SQL Formatter</span>}
        </button>

        {/* Practice Mode Button */}
        <button
          onClick={onOpenPractice}
          className="w-full flex items-center gap-3 py-2 px-3 text-xs rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all font-medium active:scale-95 duration-200"
          title="Interactive SQL Practice"
        >
          <Terminal size={14} className="text-blue-400" />
          {isOpen && <span>Practice Challenges</span>}
        </button>

        {/* Quiz Mode Button */}
        <button
          onClick={onOpenQuiz}
          className="w-full flex items-center gap-3 py-2 px-3 text-xs rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all font-medium active:scale-95 duration-200"
          title="Take SQL Quiz"
        >
          <Award size={14} className="text-cyan-400" />
          {isOpen && <span>Quiz Mode</span>}
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin space-y-4">
        {isOpen && (
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <History size={10} />
              <span>Recent Questions</span>
            </div>
            
            {recentQuestions.length === 0 ? (
              <div className="text-[11px] text-slate-600 px-2 py-4 italic">
                No recent queries.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {recentQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectQuestion(q)}
                    className="w-full flex items-center gap-2 py-1.5 px-2 text-xs rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] text-left truncate transition-colors duration-200"
                    title={q}
                  >
                    <MessageSquare size={11} className="flex-shrink-0 text-slate-500" />
                    <span className="truncate">{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info / About trigger at bottom */}
      <div className="p-3 border-t border-white/5 bg-slate-950/20 flex flex-col gap-1.5">
        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-3 py-2 px-3 text-xs rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all font-medium active:scale-95 duration-200"
          title="About SQLSense AI"
        >
          <Info size={14} className="text-slate-400" />
          {isOpen && <span>About / Logs</span>}
        </button>
      </div>
    </aside>
  );
}
