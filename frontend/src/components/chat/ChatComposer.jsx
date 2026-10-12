import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ArrowUp, Square, Plus, Sparkles, HelpCircle, Zap, Code, 
  Terminal, Award, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONNECTOR_MODES = [
  {
    id: 'smart_assistant',
    label: 'Smart Assistant',
    shortLabel: 'Smart Assistant',
    icon: Sparkles,
    desc: 'General SQL answers & reasoning',
    color: 'text-indigo-400',
    chipBg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
  },
  {
    id: 'explain_concept',
    label: 'Explain Concept',
    shortLabel: 'Explain Concept',
    icon: HelpCircle,
    desc: 'Structured, simple educational breakdown',
    color: 'text-purple-400',
    chipBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
  },
  {
    id: 'optimize_query',
    label: 'Optimize Query',
    shortLabel: 'Optimize Query',
    icon: Zap,
    desc: 'Index suggestions & structural speed tuning',
    color: 'text-amber-400',
    chipBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
  },
  {
    id: 'debug_error',
    label: 'Debug Error',
    shortLabel: 'Debug Error',
    icon: Code,
    desc: 'Identify syntax mistakes & provide corrected SQL',
    color: 'text-rose-400',
    chipBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
  }
];

export default function ChatComposer({
  input,
  setInput,
  onSendMessage,
  isGenerating,
  onStopGeneration,
  activeMode = 'smart_assistant',
  onSelectMode,
  placeholder = "Ask SQLSense anything...",
  onOpenPractice,
  onOpenQuiz,
  onOpenFormatter,
  autoFocus = false,
  className = ""
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Auto-resize input textarea up to 160px
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(Math.max(el.scrollHeight, 40), 160);
    el.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isMenuOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSendMessage(input, activeMode);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isGenerating) {
      onStopGeneration?.();
    } else if (input.trim()) {
      onSendMessage(input, activeMode);
    }
  };

  const currentConnector = CONNECTOR_MODES.find(m => m.id === activeMode) || CONNECTOR_MODES[0];
  const isCustomConnectorActive = activeMode && activeMode !== 'smart_assistant';

  const handleSelectConnector = (modeId) => {
    onSelectMode?.(modeId);
    setIsMenuOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* Popover Connector Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-2.5 left-0 sm:left-2 z-50 w-72 sm:w-80 rounded-2xl p-1.5 shadow-2xl border bg-white dark:bg-[#0f121d] border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-slate-100 backdrop-blur-xl"
          >
            <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-white/[0.06] mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 font-mono">
                Add to conversation
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              {CONNECTOR_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleSelectConnector(mode.id)}
                    className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-900 dark:text-indigo-200 font-medium'
                        : 'hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className={`p-1 rounded-lg mt-0.5 ${mode.color} bg-black/[0.03] dark:bg-white/[0.05]`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{mode.label}</span>
                        {isSelected && <Check size={12} className="text-indigo-500" />}
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal font-normal">
                        {mode.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Tools Divider Section */}
            <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-white/[0.06] px-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono px-1">Quick Tools:</span>
              <div className="flex items-center gap-1">
                {onOpenPractice && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenPractice();
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="Practice Arena"
                  >
                    <Terminal size={12} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="text-[10.5px]">Practice</span>
                  </button>
                )}
                {onOpenQuiz && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenQuiz();
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="Quiz Mode"
                  >
                    <Award size={12} className="text-cyan-500 dark:text-cyan-400" />
                    <span className="text-[10.5px]">Quiz</span>
                  </button>
                )}
                {onOpenFormatter && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenFormatter();
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="SQL Formatter"
                  >
                    <Code size={12} className="text-purple-500 dark:text-purple-400" />
                    <span className="text-[10.5px]">Formatter</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Composer Capsule */}
      <form
        onSubmit={handleFormSubmit}
        className="relative bg-white dark:bg-[#0e111a] border border-slate-200 dark:border-white/[0.1] focus-within:border-indigo-500 dark:focus-within:border-indigo-500/70 rounded-2xl sm:rounded-3xl shadow-sm dark:shadow-md transition-all duration-150 flex flex-col p-2 sm:p-2.5"
      >
        {/* Selected Connector Chip (if active) */}
        {isCustomConnectorActive && (
          <div className="flex items-center gap-1 px-2 pt-1 pb-0.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentConnector.chipBg}`}>
              <currentConnector.icon size={12} className={currentConnector.color} />
              <span>{currentConnector.shortLabel}</span>
              <button
                type="button"
                onClick={() => !isGenerating && onSelectMode?.('smart_assistant')}
                disabled={isGenerating}
                className="hover:text-rose-500 dark:hover:text-rose-400 ml-0.5 p-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove connector (Return to Smart Assistant)"
              >
                <X size={11} />
              </button>
            </span>
          </div>
        )}

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isGenerating 
              ? "SQLSense AI is formulating response..." 
              : isCustomConnectorActive
              ? `Ask with ${currentConnector.label}...`
              : placeholder
          }
          disabled={isGenerating}
          rows={1}
          className="w-full bg-transparent border-0 focus:outline-none px-3 pt-1.5 pb-1 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none font-sans text-xs sm:text-[13.5px] leading-relaxed max-h-[160px] min-h-[40px] disabled:opacity-50"
        />

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-1 px-1 mt-0.5 border-t border-slate-100 dark:border-white/[0.04]">
          {/* Bottom Left: '+' Action/Connector Button */}
          <div className="flex items-center gap-1.5">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => !isGenerating && setIsMenuOpen(!isMenuOpen)}
              disabled={isGenerating}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isMenuOpen || isCustomConnectorActive
                  ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
              }`}
              title="Add action / connector (+)"
              aria-label="Add action / connector"
            >
              <Plus size={15} className={`transition-transform duration-150 ${isMenuOpen ? 'rotate-45' : ''}`} />
            </button>

            {/* Subtle active connector label on desktop */}
            {isCustomConnectorActive && (
              <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                mode: {currentConnector.id}
              </span>
            )}
          </div>

          {/* Bottom Right: Send or Stop Button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] text-slate-400 dark:text-slate-500 font-mono select-none">
              ↵ Enter
            </span>

            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 border border-rose-500/30 transition-all cursor-pointer active:scale-95"
                title="Stop formulating"
              >
                <Square size={11} className="fill-rose-500" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSendMessage(input, activeMode)}
                disabled={!input.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 cursor-pointer ${
                  input.trim()
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm hover:scale-105 active:scale-95'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/[0.04]'
                }`}
                title="Send query"
              >
                <ArrowUp size={14} className="stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
