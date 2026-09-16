import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Database, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';

export default function ChatWindow({ messages, isLoading, isStreaming }) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastMessageCountRef = useRef(messages.length);

  // Monitor user scroll position to avoid forcibly scrolling if reading history
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // Consider at bottom if within 80px
    setIsAtBottom(distanceFromBottom < 80);
  }, []);

  const scrollToBottom = (smooth = true) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    setIsAtBottom(true);
  };

  // Follow messages when generating or when new messages arrive
  useEffect(() => {
    if (!containerRef.current) return;

    const isNewUserMessage = messages.length > lastMessageCountRef.current && 
      messages[messages.length - 1]?.role === 'user';
    lastMessageCountRef.current = messages.length;

    // Force scroll to bottom on new user message or if already pinned to bottom
    if (isNewUserMessage || isAtBottom) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading, isStreaming, isAtBottom]);

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto w-full flex flex-col scrollbar-thin relative"
      style={{ scrollBehavior: 'auto' }}
    >
      <div className="flex-1 flex flex-col pb-4">
        {messages.map((message) => (
          <MessageItem 
            key={message.id || message.timestamp || Math.random()} 
            message={message} 
          />
        ))}

        {/* Loading / Thinking Animation State */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex w-full gap-4 py-6 px-4 md:px-6 bg-slate-900/30 backdrop-blur-xs border-b border-white/[0.03]"
          >
            <div className="max-w-4xl mx-auto flex w-full gap-4 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-brand-purple to-brand-blue text-white shadow-glow-purple">
                <Database size={16} />
              </div>
              
              {/* Thinking Indicator */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300 tracking-wider">SQLSENSE AI</span>
                  <span className="text-[11px] text-purple-400/80 font-normal italic animate-pulse">Thinking...</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 shadow-inner mt-1 w-fit">
                  <span className="w-2 h-2 rounded-full bg-brand-purple typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-brand-blue typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-brand-cyan typing-dot" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Scroll to Latest Button when user scrolled up */}
      <AnimatePresence>
        {!isAtBottom && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => scrollToBottom(true)}
            className="sticky bottom-4 mx-auto z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-purple/40 text-slate-200 text-xs shadow-glow-purple hover:bg-slate-800 transition-all backdrop-blur-md cursor-pointer active:scale-95"
          >
            <ArrowDown size={13} className="text-brand-purple animate-bounce" />
            <span>Latest message</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
