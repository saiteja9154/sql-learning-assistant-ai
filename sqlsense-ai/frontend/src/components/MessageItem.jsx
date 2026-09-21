import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CodeBlock from './CodeBlock';

export default function MessageItem({ message, onAskTopic }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyFullResponse = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Markdown renderer components
  const markdownComponents = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';
      const codeValue = String(children).replace(/\n$/, '');
      
      // Multi-line code block with syntax highlighter
      if (!inline && (lang || codeValue.includes('\n') || codeValue.toUpperCase().includes('SELECT'))) {
        return <CodeBlock language={lang || 'sql'} value={codeValue} />;
      }
      
      // Inline markdown file reference citations (e.g. `joins.md`, `window_functions.md`)
      if (inline && codeValue.endsWith('.md')) {
        return (
          <button 
            onClick={() => onAskTopic && onAskTopic(`Explain the topic related to ${codeValue}`)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 my-0.5 rounded-md bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono transition-all cursor-pointer select-none align-baseline active:scale-95"
            title={`Explore knowledge file: ${codeValue}`}
          >
            <FileText size={10} className="text-indigo-400" />
            <span>{codeValue}</span>
          </button>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded-md bg-[#131624] border border-white/[0.08] text-indigo-300 font-mono text-[12px] font-normal" {...props}>
          {children}
        </code>
      );
    },
    // Database-style tables for query results and schema outputs
    table({ children }) {
      return (
        <div className="my-2.5 sm:my-3.5 overflow-x-auto rounded-xl border border-white/[0.08] shadow-glass bg-[#090b14] max-w-full scrollbar-thin">
          <table className="min-w-full divide-y divide-white/[0.08] text-[12px] sm:text-[13px] text-left">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-[#0e111d] font-medium text-slate-300 select-none">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody className="divide-y divide-white/[0.04] font-mono text-slate-300">{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>;
    },
    th({ children }) {
      return <th className="px-2.5 sm:px-3.5 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">{children}</th>;
    },
    td({ children }) {
      return <td className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[12px] whitespace-nowrap">{children}</td>;
    },
    // Headings
    h1({ children }) {
      return <h1 className="text-base sm:text-lg font-bold text-white mt-3 mb-1.5 tracking-tight font-display">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-sm sm:text-base font-semibold text-slate-100 mt-3 mb-1.5 tracking-tight">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-xs sm:text-sm font-semibold text-indigo-300 mt-2.5 mb-1 border-l-2 border-indigo-500 pl-2">{children}</h3>;
    },
    p({ children }) {
      return <p className="text-[13px] sm:text-[13.5px] text-slate-300 leading-relaxed mb-2 last:mb-0 font-normal">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-4 sm:pl-5 my-2 text-[13px] sm:text-[13.5px] text-slate-300 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-4 sm:pl-5 my-2 text-[13px] sm:text-[13.5px] text-slate-300 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-indigo-500/60 pl-2.5 my-2 italic text-slate-400 bg-indigo-500/5 py-1 rounded-r-lg text-xs sm:text-sm">
          {children}
        </blockquote>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full px-2.5 sm:px-4 py-2.5 sm:py-3 transition-colors ${
        isUser ? 'flex justify-end' : 'flex justify-start'
      }`}
    >
      {isUser ? (
        /* USER MESSAGE BUBBLE - Sleek Right-Aligned Speech Capsule */
        <div className="flex flex-col items-end max-w-[88%] sm:max-w-[78%]">
          <div className="chat-bubble-user px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-sm leading-relaxed break-words shadow-sm select-text">
            <p className="whitespace-pre-wrap m-0 font-normal">{message.content}</p>
          </div>
          <span className="text-[9px] text-slate-500 font-mono mt-1 mr-1 select-none">
            You
          </span>
        </div>
      ) : (
        /* ASSISTANT MESSAGE - Left-Aligned Native Chatbot Card */
        <div className="flex gap-2.5 sm:gap-3.5 items-start max-w-full sm:max-w-4xl w-full">
          {/* AI Avatar */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 text-[10px] sm:text-xs font-bold">
              ◈
            </div>
          </div>

          {/* AI Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header / Meta Bar */}
            <div className="flex items-center justify-between gap-2 mb-1 select-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase font-mono">
                  SQLSense AI
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  Local Engine
                </span>
              </div>

              {/* Copy Full Response Button */}
              <button
                onClick={copyFullResponse}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-all text-[10px] cursor-pointer"
                title="Copy entire response"
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-invert max-w-none text-slate-200 text-[13px] sm:text-[13.5px]">
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-gradient-to-b from-indigo-400 to-purple-400 animate-pulse rounded-xs align-middle shadow-glow-indigo" />
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
