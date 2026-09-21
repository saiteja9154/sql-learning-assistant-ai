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
    setIsAtBottom(distanceFromBottom < 70);
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
      className="flex-1 overflow-y-auto w-full flex flex-col scrollbar-thin relative"
      style={{ scrollBehavior: 'auto' }}
    >
      <div className="flex-1 flex flex-col pb-6">
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full py-4 px-3 sm:px-6 bg-[#0a0c14]/40 border-y border-white/[0.02]"
          >
            <div className="max-w-4xl mx-auto flex gap-3.5 items-start">
              {/* AI Avatar */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-full h-full rounded-[7px] bg-[#090b14] flex items-center justify-center text-indigo-300 text-xs font-bold">
                  ◈
                </div>
              </div>
              
              {/* Thinking Indicator */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">SQLSense AI</span>
                  <span className="text-[10px] text-indigo-400 font-mono animate-pulse">Querying local engine...</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#0f121d] border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-inner mt-0.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-purple-500 typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
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
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            onClick={() => scrollToBottom(true)}
            className="sticky bottom-4 mx-auto z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101320]/90 border border-indigo-500/40 text-slate-200 text-xs shadow-glow-indigo hover:bg-[#161a2c] transition-all backdrop-blur-md cursor-pointer active:scale-95"
          >
            <ArrowDown size={12} className="text-indigo-400 animate-bounce" />
            <span className="text-[11px] font-medium">Scroll to bottom</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
