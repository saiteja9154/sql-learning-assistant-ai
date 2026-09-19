import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Copy, Check, FileText } from 'lucide-react';
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
      if (!inline && lang) {
        return <CodeBlock language={lang} value={codeValue} />;
      }
      
      // Inline markdown file reference citations (e.g. `joins.md`, `window_functions.md`)
      if (inline && codeValue.endsWith('.md')) {
        return (
          <button 
            onClick={() => onAskTopic && onAskTopic(`Explain the topic related to ${codeValue}`)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-[11px] font-mono transition-all cursor-pointer select-none"
            title={`Referenced knowledge source: ${codeValue}`}
          >
            <FileText size={10} className="text-indigo-400" />
            <span>{codeValue}</span>
          </button>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded-md bg-[#0f121d] border border-white/[0.08] text-indigo-300 font-mono text-[12px] font-normal" {...props}>
          {children}
        </code>
      );
    },
    // Database-style tables for query results and schema outputs
    table({ children }) {
      return (
        <div className="my-3.5 overflow-x-auto rounded-xl border border-white/[0.08] shadow-glass bg-[#090b14] max-w-full scrollbar-thin">
          <table className="min-w-full divide-y divide-white/[0.08] text-[13px] text-left">
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
      return <th className="px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">{children}</th>;
    },
    td({ children }) {
      return <td className="px-3.5 py-2 text-[12px] whitespace-nowrap">{children}</td>;
    },
    // Headings
    h1({ children }) {
      return <h1 className="text-lg font-bold text-white mt-4 mb-2 tracking-tight">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-base font-semibold text-slate-100 mt-4 mb-2 tracking-tight">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-sm font-semibold text-indigo-300 mt-3.5 mb-1.5 border-l-2 border-indigo-500 pl-2.5">{children}</h3>;
    },
    p({ children }) {
      return <p className="text-[13.5px] text-slate-300 leading-relaxed mb-2.5 last:mb-0 font-normal">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-5 my-2.5 text-[13.5px] text-slate-300 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 my-2.5 text-[13.5px] text-slate-300 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-indigo-500/60 pl-3 my-2.5 italic text-slate-400 bg-indigo-500/5 py-1 rounded-r-lg">
          {children}
        </blockquote>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full py-4 px-3 sm:px-6 transition-colors ${
        isUser 
          ? 'bg-transparent' 
          : 'bg-[#0a0c14]/40 border-y border-white/[0.02]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex gap-3.5 items-start relative group">
        
        {/* Avatar / Visual Identity */}
        {isUser ? (
          <div className="w-7 h-7 rounded-lg bg-[#141724] border border-white/[0.08] flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
            <User size={14} />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 text-xs font-bold">
              ◈
            </div>
          </div>
        )}

        {/* Message Container */}
        <div className="flex-1 overflow-hidden min-w-0">
          
          {/* Header metadata */}
          <div className="flex items-center gap-2 mb-1 select-none">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              {isUser ? 'You' : 'SQLSense AI'}
            </span>
            {!isUser && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                Local Engine
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className={`prose prose-invert max-w-none ${
            isUser 
              ? 'bg-[#121522] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 text-slate-100 text-[13.5px] leading-relaxed shadow-sm w-fit max-w-[90%]' 
              : 'text-slate-200'
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap m-0 font-normal">{message.content}</p>
            ) : (
              <>
                <ReactMarkdown components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-gradient-to-b from-indigo-400 to-purple-400 animate-pulse rounded-xs align-middle shadow-glow-indigo" />
                )}
              </>
            )}
          </div>
        </div>

        {/* Copy Response Action Button (hover) */}
        {!isUser && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute right-0 top-0">
            <button
              onClick={copyFullResponse}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0f121e] hover:bg-[#161a29] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-[10px] cursor-pointer"
              title="Copy entire answer"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}
