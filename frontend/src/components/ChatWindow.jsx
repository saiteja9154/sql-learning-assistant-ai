import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';

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

  // Monitor scroll position
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
      <div className="max-w-4xl mx-auto w-full flex flex-col pb-6 pt-2">
        {messages.map((message, index) => (
          <MessageItem 
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

        {/* Shimmering Animated Thinking Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full px-3 sm:px-6 py-4 flex justify-start"
          >
            <div className="flex gap-3 sm:gap-4 items-start">
              {/* Pulsing AI Emblem */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-glow-indigo flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                <div className="w-full h-full rounded-[11px] bg-[#070912] flex items-center justify-center text-indigo-300 text-xs font-bold">
                  ◈
                </div>
              </div>
              
              {/* Thinking Waveform Capsule */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] font-bold tracking-wide text-slate-300 font-display">
                    SQLSense AI
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono animate-pulse flex items-center gap-1">
                    <Sparkles size={10} />
                    Analyzing schema & syntax...
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#0e1120] border border-white/[0.08] rounded-2xl px-4 py-2.5 shadow-inner w-fit">
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
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => scrollToBottom(true)}
            className="sticky bottom-3 mx-auto z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0f1324]/95 border border-indigo-500/50 text-slate-200 text-xs shadow-glow-indigo hover:bg-[#161b34] transition-all backdrop-blur-md cursor-pointer active:scale-95"
          >
            <ArrowDown size={12} className="text-indigo-400 animate-bounce" />
            <span className="text-[11px] font-medium">Scroll to bottom</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
