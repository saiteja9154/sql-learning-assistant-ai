import React, { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, Check, FileText, ThumbsUp, ThumbsDown, 
  RotateCcw, Volume2, VolumeX 
} from 'lucide-react';
import CodeBlock from './CodeBlock';

const ChatMessage = memo(function ChatMessage({ 
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
      // Clean markdown tags for natural speech synthesis
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

  // Custom Markdown renderer components with Light & Dark support
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
      
      // Inline markdown file reference citations (e.g. `joins.md`, `windowfunctions.md`)
      if (inline && codeValue.endsWith('.md')) {
        return (
          <button 
            onClick={() => onAskTopic && onAskTopic(`Explain the topic related to ${codeValue}`)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 my-0.5 rounded bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono transition-all cursor-pointer align-baseline"
            title={`Explore knowledge file: ${codeValue}`}
          >
            <FileText size={10} className="text-indigo-600 dark:text-indigo-400" />
            <span>{codeValue}</span>
          </button>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161a28] border border-slate-200 dark:border-white/[0.08] text-indigo-600 dark:text-indigo-300 font-mono text-[12px]" {...props}>
          {children}
        </code>
      );
    },
    table({ children }) {
      return (
        <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#080a12] max-w-full scrollbar-thin shadow-xs">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/[0.08] text-[12px] sm:text-[13px] text-left">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-slate-50 dark:bg-[#0f1220] font-medium text-slate-700 dark:text-slate-300 select-none">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] font-mono text-slate-800 dark:text-slate-300">{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">{children}</tr>;
    },
    th({ children }) {
      return <th className="px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">{children}</th>;
    },
    td({ children }) {
      return <td className="px-3.5 py-2 text-[11.5px] sm:text-[12.5px] whitespace-nowrap">{children}</td>;
    },
    h1({ children }) {
      return <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2 tracking-tight font-display">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mt-3.5 mb-2 tracking-tight">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 mt-3 mb-1.5">{children}</h3>;
    },
    p({ children }) {
      return <p className="text-[13px] sm:text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed mb-2.5 last:mb-0 font-normal">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-5 my-2 text-[13px] sm:text-[14px] text-slate-800 dark:text-slate-200 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 my-2 text-[13px] sm:text-[14px] text-slate-800 dark:text-slate-200 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-indigo-500 pl-3 my-2.5 italic text-slate-700 dark:text-slate-300 bg-indigo-50/50 dark:bg-indigo-500/5 py-1 rounded-r-lg text-xs sm:text-sm">
          {children}
        </blockquote>
      );
    }
  };

  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`w-full py-2.5 sm:py-3 transition-colors ${
        isUser ? 'flex justify-end' : 'flex justify-start'
      }`}
    >
      {isUser ? (
        /* USER MESSAGE */
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="rounded-2xl rounded-br-xs px-4 py-2.5 text-[13.5px] leading-relaxed bg-indigo-600 text-white dark:bg-[#1a2238] dark:text-slate-100 border border-indigo-500 dark:border-white/[0.08] shadow-xs select-text">
            <p className="whitespace-pre-wrap m-0">{message.content}</p>
          </div>
          {formattedTime && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 mr-1 select-none">
              {formattedTime}
            </span>
          )}
        </div>
      ) : (
        /* ASSISTANT MESSAGE */
        <div className="flex gap-3 items-start max-w-full w-full">
          {/* AI Avatar */}
          <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">◈</span>
          </div>

          {/* AI Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1 select-none">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-200">
                  SQLSense AI
                </span>
                {formattedTime && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                    {formattedTime}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={copyFullResponse}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all text-[11px] cursor-pointer"
                  title="Copy full response"
                >
                  {copied ? (
                    <>
                      <Check size={11} className="text-emerald-500 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Markdown Body */}
            <div className="text-slate-800 dark:text-slate-200 leading-relaxed">
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-500 dark:bg-indigo-400 animate-pulse rounded-xs align-middle" />
              )}
            </div>

            {/* Response Footer Controls */}
            {!message.isStreaming && (
              <div className="flex items-center gap-1.5 mt-2 select-none">
                <button
                  onClick={() => setReaction(r => r === 'like' ? null : 'like')}
                  className={`p-1 rounded transition-colors cursor-pointer text-xs ${
                    reaction === 'like'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp size={12} />
                </button>

                <button
                  onClick={() => setReaction(r => r === 'dislike' ? null : 'dislike')}
                  className={`p-1 rounded transition-colors cursor-pointer text-xs ${
                    reaction === 'dislike'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                  title="Needs improvement"
                >
                  <ThumbsDown size={12} />
                </button>

                <button
                  onClick={handleSpeakToggle}
                  className={`p-1 rounded transition-colors cursor-pointer text-xs ${
                    isSpeaking
                      ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 animate-pulse'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                  title={isSpeaking ? "Stop reading" : "Read aloud"}
                >
                  {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>

                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 p-1 rounded text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
                    title="Regenerate answer"
                  >
                    <RotateCcw size={12} />
                    <span className="text-[10px] hidden sm:inline">Retry</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
});

export default ChatMessage;
