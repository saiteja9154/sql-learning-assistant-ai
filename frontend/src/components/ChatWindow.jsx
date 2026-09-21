import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';

export default function ChatWindow({ messages, isLoading, isStreaming, onAskTopic }) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastMessageCountRef = useRef(messages.length);

  // Monitor user scroll position
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom < 60);
  }, []);

  const scrollToBottom = (smooth = true) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    setIsAtBottom(true);
  };

  // Follow messages when generating or arriving
  useEffect(() => {
    if (!containerRef.current) return;

    const isNewUserMessage = messages.length > lastMessageCountRef.current && 
      messages[messages.length - 1]?.role === 'user';
    lastMessageCountRef.current = messages.length;

    if (isNewUserMessage || isAtBottom) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading, isStreaming, isAtBottom]);

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto w-full flex flex-col scrollbar-thin relative overscroll-contain"
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col pb-4 pt-1">
        {messages.map((message) => (
          <MessageItem 
            key={message.id || message.timestamp || Math.random()} 
            message={message} 
            onAskTopic={onAskTopic}
          />
        ))}

        {/* Loading / Searching Knowledge State */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="w-full px-2.5 sm:px-4 py-3 flex justify-start"
          >
            <div className="flex gap-2.5 sm:gap-3.5 items-start">
              {/* AI Avatar */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 text-[10px] sm:text-xs font-bold">
                  ◈
                </div>
              </div>
              
              {/* Thinking Indicator */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">SQLSense AI</span>
                  <span className="text-[9px] text-indigo-400 font-mono animate-pulse">Searching knowledge engine...</span>
                </div>
                
                <div className="flex items-center gap-1 bg-[#0f121d] border border-white/[0.08] rounded-xl px-3 py-2 shadow-inner w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Scroll to Latest Button */}
      <AnimatePresence>
        {!isAtBottom && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            onClick={() => scrollToBottom(true)}
            className="sticky bottom-2 mx-auto z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#101320]/95 border border-indigo-500/40 text-slate-200 text-xs shadow-glow-indigo hover:bg-[#161a2c] transition-all backdrop-blur-md cursor-pointer active:scale-95"
          >
            <ArrowDown size={11} className="text-indigo-400 animate-bounce" />
            <span className="text-[11px] font-medium">Scroll down</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
