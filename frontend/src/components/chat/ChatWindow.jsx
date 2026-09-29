import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ 
  messages, 
  isLoading, 
  isStreaming, 
  onAskTopic, 
  onRegenerate,
  onRunInPractice 
}) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastMessageCountRef = useRef(messages.length);
  const userScrolledUpRef = useRef(false);
  const rafIdRef = useRef(null);

  // Monitor scroll position
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < 70;
    setIsAtBottom(atBottom);
    userScrolledUpRef.current = !atBottom;
  }, []);

  const scrollToBottom = (smooth = true) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    setIsAtBottom(true);
    userScrolledUpRef.current = false;
  };

  // Auto-scroll logic: controlled & non-jumping
  useEffect(() => {
    if (!containerRef.current) return;

    const isNewMessage = messages.length > lastMessageCountRef.current;
    const isNewUserMessage = isNewMessage && messages[messages.length - 1]?.role === 'user';
    lastMessageCountRef.current = messages.length;

    // Always follow new user query immediately
    if (isNewUserMessage) {
      userScrolledUpRef.current = false;
      scrollToBottom(false);
      return;
    }

    // While streaming tokens, follow only if user is at bottom
    if (!userScrolledUpRef.current) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        if (containerRef.current && !userScrolledUpRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [messages, isLoading, isStreaming]);

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto w-full flex flex-col scrollbar-thin relative overscroll-contain px-3 sm:px-6"
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col pb-8 pt-3">
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id || message.timestamp || index} 
            message={message} 
            onAskTopic={onAskTopic}
            onRegenerate={
              index === messages.length - 1 && message.role === 'assistant' 
                ? () => onRegenerate(messages[index - 1]?.content) 
                : undefined
            }
            onRunInPractice={onRunInPractice}
          />
        ))}

        {/* Subtle Assistant Thinking Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full py-3 flex justify-start"
          >
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">◈</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121520] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 typing-dot" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Scroll to Latest Button */}
      <AnimatePresence>
        {!isAtBottom && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            onClick={() => scrollToBottom(true)}
            className="sticky bottom-3 mx-auto z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#141726]/95 border border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-200 text-xs shadow-lg hover:bg-slate-50 dark:hover:bg-[#1a1e32] transition-all backdrop-blur-md cursor-pointer active:scale-95"
          >
            <ArrowDown size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[11px] font-medium">Scroll to bottom</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
