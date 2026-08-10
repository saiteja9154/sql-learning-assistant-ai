import React, { useEffect, useRef } from 'react';
import { Database } from 'lucide-react';
import MessageItem from './MessageItem';

export default function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto w-full flex flex-col scrollbar-thin">
      <div className="flex-1 flex flex-col">
        {messages.map((message, idx) => (
          <MessageItem key={idx} message={message} />
        ))}

        {/* Loading / Typing Animation */}
        {isLoading && (
          <div className="flex w-full gap-4 py-6 px-4 md:px-6 bg-slate-900/30 backdrop-blur-xs border-b border-white/[0.03]">
            <div className="max-w-4xl mx-auto flex w-full gap-4 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-brand-purple to-brand-blue text-white shadow-glow-purple">
                <Database size={16} />
              </div>
              {/* Typing Dot Bubbles */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-300 tracking-wider">SQLSENSE AI</span>
                <div className="flex items-center gap-1.5 bg-slate-950/60 border border-white/5 rounded-2xl px-4 py-3 shadow-inner mt-1">
                  <span className="w-2 h-2 rounded-full bg-brand-purple typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-brand-blue typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-brand-cyan typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Anchor for Auto Scroll */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
