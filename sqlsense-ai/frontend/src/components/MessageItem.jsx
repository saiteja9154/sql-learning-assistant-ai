import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Database, User, FileText, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import CodeBlock from './CodeBlock';

export default function MessageItem({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyFullResponse = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Customize markdown rendering to make elements look premium
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';
      const codeValue = String(children).replace(/\n$/, '');
      
      // If it is a block code with language, render custom CodeBlock
      if (!inline && lang) {
        return <CodeBlock language={lang} value={codeValue} />;
      }
      
      // OPTIMIZATION: If it is an inline code block referencing a file (e.g. joins.md),
      // render it as an interactive card pill for citations!
      if (inline && codeValue.endsWith('.md')) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-cyan-400 text-[11px] font-mono font-medium shadow-sm select-none hover:border-cyan-500/30 transition-all">
            <FileText size={11} className="text-cyan-400" />
            <span>{codeValue}</span>
          </span>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-purple-300 font-mono text-[13px] font-normal" {...props}>
          {children}
        </code>
      );
    },
    // Premium database-style tables for showing execution outputs
    table({ children }) {
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-white/10 shadow-lg bg-slate-900/20 max-w-full scrollbar-thin">
          <table className="min-w-full divide-y divide-white/10 text-[13px] text-left">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-slate-900/80 font-medium text-slate-300">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody className="divide-y divide-white/5">{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="hover:bg-white/[0.01] transition-colors">{children}</tr>;
    },
    th({ children }) {
      return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{children}</th>;
    },
    td({ children }) {
      return <td className="px-4 py-2.5 font-mono text-slate-300 font-normal whitespace-nowrap">{children}</td>;
    },
    // Customize header items
    h3({ children }) {
      return <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2.5 tracking-tight border-l-2 border-brand-purple pl-2.5">{children}</h3>;
    },
    p({ children }) {
      return <p className="text-[14px] text-slate-300 leading-relaxed font-light mb-3 last:mb-0">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-5 my-3 text-[14px] text-slate-300 font-light space-y-1.5">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 my-3 text-[14px] text-slate-300 font-light space-y-1.5">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex w-full gap-4 py-6 px-4 md:px-6 border-b border-white/[0.03] ${
        isUser ? 'bg-slate-900/10' : 'bg-slate-900/30 backdrop-blur-xs'
      }`}
    >
      <div className="max-w-4xl mx-auto flex w-full gap-4 items-start relative group">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white select-none ${
            isUser
              ? 'bg-slate-800 border border-white/10'
              : 'bg-gradient-to-tr from-brand-purple to-brand-blue shadow-glow-purple'
          }`}
        >
          {isUser ? <User size={16} /> : <Database size={16} />}
        </div>

        {/* Bubble Content */}
        <div className="flex-1 overflow-hidden pr-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              {isUser ? 'YOU' : 'SQLSENSE AI'}
            </span>
          </div>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Action button overlay (visible on hover) */}
        {!isUser && (
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={copyFullResponse}
              className="p-1.5 rounded-lg border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200 flex items-center gap-1.5"
              title="Copy entire response"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span className="text-[10px] font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
