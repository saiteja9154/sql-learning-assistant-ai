import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  User, Copy, Check, FileText, Sparkles, 
  ThumbsUp, ThumbsDown, RotateCcw, Volume2, VolumeX,
  Play, Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import CodeBlock from './CodeBlock';

export default function MessageItem({ 
  message, 
  onAskTopic, 
  onRegenerate,
  onRunInPractice 
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState(null); // 'like' | 'dislike' | null
  const [isSpeaking, setIsSpeaking] = useState(false);

  const copyFullResponse = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakToggle = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      // Clean markdown tags for clear speech synthesis
      const cleanText = message.content
        .replace(/```[\s\S]*?```/g, 'Code snippet omitted.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*#_~]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Custom Markdown renderer components
  const markdownComponents = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';
      const codeValue = String(children).replace(/\n$/, '');
      
      // Multi-line code block with syntax highlighter
      if (!inline && (lang || codeValue.includes('\n') || codeValue.toUpperCase().includes('SELECT'))) {
        return (
          <CodeBlock 
            language={lang || 'sql'} 
            value={codeValue} 
            onRunInPractice={onRunInPractice}
          />
        );
      }
      
      // Inline markdown file reference citations (e.g. `joins.md`, `window_functions.md`)
      if (inline && codeValue.endsWith('.md')) {
        return (
          <button 
            onClick={() => onAskTopic && onAskTopic(`Explain the topic related to ${codeValue}`)}
            className="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 rounded-md bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono transition-all cursor-pointer select-none align-baseline active:scale-95"
            title={`Explore knowledge file: ${codeValue}`}
          >
            <FileText size={11} className="text-indigo-400" />
            <span>{codeValue}</span>
          </button>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded-md bg-[#111422] border border-white/[0.08] text-indigo-300 font-mono text-[12px] font-normal" {...props}>
          {children}
        </code>
      );
    },
    // Database-style tables for query results and schema outputs
    table({ children }) {
      return (
        <div className="my-3 overflow-x-auto rounded-2xl border border-white/[0.09] shadow-glass bg-[#080a12] max-w-full scrollbar-thin">
          <table className="min-w-full divide-y divide-white/[0.08] text-[12px] sm:text-[13px] text-left">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-[#0f1220] font-medium text-slate-300 select-none">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody className="divide-y divide-white/[0.04] font-mono text-slate-300">{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>;
    },
    th({ children }) {
      return <th className="px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 font-mono">{children}</th>;
    },
    td({ children }) {
      return <td className="px-3.5 py-2 text-[11.5px] sm:text-[12.5px] whitespace-nowrap">{children}</td>;
    },
    // Headings
    h1({ children }) {
      return <h1 className="text-base sm:text-lg font-bold text-white mt-4 mb-2 tracking-tight font-display">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-sm sm:text-base font-semibold text-slate-100 mt-3.5 mb-2 tracking-tight">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xs sm:text-sm font-semibold text-indigo-300 mt-3 mb-1.5 border-l-2 border-indigo-500 pl-2.5">{children}</h3>;
    },
    p({ children }) {
      return <p className="text-[13px] sm:text-[14px] text-slate-200 leading-relaxed mb-2.5 last:mb-0 font-normal">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-5 my-2.5 text-[13px] sm:text-[14px] text-slate-200 space-y-1.5">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 my-2.5 text-[13px] sm:text-[14px] text-slate-200 space-y-1.5">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-3 border-indigo-500/70 pl-3 my-2.5 italic text-slate-300 bg-indigo-500/5 py-1.5 rounded-r-xl text-xs sm:text-sm">
          {children}
        </blockquote>
      );
    }
  };

  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full px-3 sm:px-6 py-3 sm:py-4 transition-colors ${
        isUser ? 'flex justify-end' : 'flex justify-start'
      }`}
    >
      {isUser ? (
        /* USER MESSAGE BUBBLE - Sleek Right-Aligned Capsule */
        <div className="flex flex-col items-end max-w-[90%] sm:max-w-[80%] group">
          <div className="chat-bubble-user px-4 py-3 sm:px-5 sm:py-3.5 text-[13.5px] sm:text-[14px] leading-relaxed break-words select-text">
            <p className="whitespace-pre-wrap m-0 font-normal">{message.content}</p>
          </div>
          
          <div className="flex items-center gap-2 mt-1 mr-1.5 text-[10px] text-slate-500 font-mono select-none">
            {formattedTime && <span>{formattedTime}</span>}
            <span>• You</span>
          </div>
        </div>
      ) : (
        /* ASSISTANT MESSAGE - Left-Aligned Conversational Card */
        <div className="flex gap-3 sm:gap-4 items-start max-w-full sm:max-w-4xl w-full">
          
          {/* AI Avatar with Glowing Aura */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0 mt-1">
            <div className="w-full h-full rounded-[11px] bg-[#070912] flex items-center justify-center text-indigo-300 text-xs font-bold">
              ◈
            </div>
          </div>

          {/* AI Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header Meta Bar */}
            <div className="flex items-center justify-between gap-2 mb-1.5 select-none">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-bold tracking-wide text-slate-200 font-display">
                  SQLSense AI
                </span>
                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                  Smart Engine
                </span>
                {formattedTime && (
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    {formattedTime}
                  </span>
                )}
              </div>

              {/* Quick Actions in Header */}
              <div className="flex items-center gap-1">
                <button
                  onClick={copyFullResponse}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-all text-[11px] cursor-pointer"
                  title="Copy full explanation"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Markdown Content Box */}
            <div className="chat-bubble-assistant p-4 sm:p-5 text-slate-200 shadow-glass">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-gradient-to-b from-indigo-400 via-purple-400 to-cyan-400 animate-pulse rounded-xs align-middle shadow-glow-indigo" />
                )}
              </div>
            </div>

            {/* Interactive Response Footer (Reaction & Controls) */}
            {!message.isStreaming && (
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1">
                {/* Left: Feedback Reactions & Audio */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setReaction(r => r === 'like' ? null : 'like')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                      reaction === 'like'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                    }`}
                    title="Helpful solution"
                  >
                    <ThumbsUp size={12} />
                  </button>

                  <button
                    onClick={() => setReaction(r => r === 'dislike' ? null : 'dislike')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                      reaction === 'dislike'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                    }`}
                    title="Needs improvement"
                  >
                    <ThumbsDown size={12} />
                  </button>

                  <button
                    onClick={handleSpeakToggle}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                      isSpeaking
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                    }`}
                    title={isSpeaking ? "Stop reading" : "Read response aloud"}
                  >
                    {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>

                  {onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors cursor-pointer text-xs"
                      title="Regenerate query"
                    >
                      <RotateCcw size={12} />
                      <span className="text-[10px] hidden sm:inline">Retry</span>
                    </button>
                  )}
                </div>

                {/* Right: Quick Action Hint */}
                <div className="text-[10px] text-slate-500 font-mono">
                  Verified Local Intelligence
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </motion.div>
  );
}
