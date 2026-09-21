import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, Sparkles, Plus, Menu } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatWindow from './components/ChatWindow';
import SuggestedPrompts from './components/SuggestedPrompts';
import AboutModal from './components/AboutModal';
import Sidebar from './components/Sidebar';
import FormatterModal from './components/FormatterModal';
import QuizModal from './components/QuizModal';
import PracticeModal from './components/PracticeModal';
import API_URL from './apiConfig';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Layout & Feature States
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'formatter' | 'quiz' | 'practice' | null
  const [themeMode, setThemeMode] = useState('indigo'); // 'indigo' | 'slate'

  const streamIntervalRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize input textarea to fit text naturally without clumsy scrollbars
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(Math.max(el.scrollHeight, 40), 120);
    el.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  // Load recent questions from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sqlsense_recent_queries');
    if (saved) {
      try {
        setRecentQuestions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent queries", e);
      }
    }
  }, []);

  // Cleanup active stream on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleShortcuts = (e) => {
      // Esc closes all active modals
      if (e.key === 'Escape') {
        setActiveModal(null);
        setIsAboutOpen(false);
      }
      
      // Ctrl / Cmd combinations
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          setSidebarOpen(prev => !prev);
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setActiveModal('formatter');
        }
        if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          setIsAboutOpen(true);
        }
        if (e.key.toLowerCase() === 'q') {
          e.preventDefault();
          setActiveModal('quiz');
        }
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setActiveModal('practice');
        }
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          handleClearChat();
        }
      }
    };

    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, []);

  const isGenerating = isLoading || isStreaming;

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isGenerating) return;

    // On mobile, close sidebar if open
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Cancel any previous active streaming interval
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    // Update recent queries in state & LocalStorage
    const updatedRecents = [query, ...recentQuestions.filter(q => q !== query)].slice(0, 10);
    setRecentQuestions(updatedRecents);
    localStorage.setItem('sqlsense_recent_queries', JSON.stringify(updatedRecents));

    // Append user message
    const userMsgId = 'user-' + Date.now();
    const userMessage = { id: userMsgId, role: 'user', content: query, timestamp: new Date() };

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const fullReply = data.reply || "No response generated.";

      // Natural thinking pause
      const elapsed = Date.now() - startTime;
      const minThinkingTime = 280;
      if (elapsed < minThinkingTime) {
        await new Promise((resolve) => setTimeout(resolve, minThinkingTime - elapsed));
      }

      setIsLoading(false);
      setIsStreaming(true);

      const assistantMsgId = 'assistant-' + Date.now();

      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true, timestamp: new Date() },
      ]);

      // Progressive typing reveal
      const len = fullReply.length;
      const chunkSize = len > 1200 ? 20 : len > 600 ? 12 : len > 200 ? 6 : 3;
      const tickInterval = 16;
      let currentIndex = 0;

      await new Promise((resolve) => {
        streamIntervalRef.current = setInterval(() => {
          currentIndex += chunkSize;

          if (currentIndex >= fullReply.length) {
            currentIndex = fullReply.length;
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: fullReply, isStreaming: false }
                  : msg
              )
            );
            setIsStreaming(false);
            resolve();
          } else {
            const partialText = fullReply.slice(0, currentIndex);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: partialText, isStreaming: true }
                  : msg
              )
            );
          }
        }, tickInterval);
      });

    } catch (error) {
      console.error('Failed to query backend:', error);
      setIsLoading(false);
      setIsStreaming(false);

      setMessages((prev) => [
        ...prev,
        { 
          id: 'error-' + Date.now(),
          role: 'assistant', 
          content: `⚠️ **Connection Error**\n\nI couldn't reach the backend server.\n\n* **Check Render Backend:** Ensure the service is active and ` + "`VITE_API_URL`" + ` is configured.\n* **Network status:** Check your internet connection.\n\nPlease try sending your message again.`,
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter without Shift (on desktop)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleClearChat = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setMessages([]);
    setInput('');
    setIsLoading(false);
    setIsStreaming(false);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteHistoryItem = (itemToDelete) => {
    const updated = recentQuestions.filter(q => q !== itemToDelete);
    setRecentQuestions(updated);
    localStorage.setItem('sqlsense_recent_queries', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setRecentQuestions([]);
    localStorage.removeItem('sqlsense_recent_queries');
  };

  // Download Chat Log Utility
  const handleDownloadChat = () => {
    if (messages.length === 0) return;
    
    const textLog = messages.map(msg => {
      const roleName = msg.role === 'user' ? 'USER' : 'SQLSENSE AI';
      return `[${roleName}]\n${msg.content}\n\n==================================================\n`;
    }).join('\n');
    
    const blob = new Blob([textLog], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sqlsense_chat_log_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-[100dvh] max-h-[100dvh] w-full flex bg-[#06070a] font-sans text-slate-100 overflow-hidden relative ${
      themeMode === 'slate' ? 'selection:bg-slate-700 selection:text-white' : 'selection:bg-indigo-500/30 selection:text-white'
    }`}>
      
      {/* Collapsible Left Developer Sidebar / Mobile Drawer */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        recentQuestions={recentQuestions}
        onSelectQuestion={(q) => {
          handleSendMessage(q);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onDeleteQuestion={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        onNewChat={handleClearChat}
        onOpenFormatter={() => {
          setActiveModal('formatter');
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onOpenQuiz={() => {
          setActiveModal('quiz');
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onOpenPractice={() => {
          setActiveModal('practice');
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onOpenAbout={() => {
          setIsAboutOpen(true);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(t => t === 'indigo' ? 'slate' : 'indigo')}
      />

      {/* Main Chatbot Workspace Area */}
      <div className="flex-1 flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden relative min-w-0">
        
        {/* Subtle Atmospheric Gradient */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
          themeMode === 'slate' 
            ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),rgba(255,255,255,0))]' 
            : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.08),rgba(255,255,255,0))]'
        }`} />

        {/* Top Navbar */}
        <Navbar 
          onClearChat={handleClearChat} 
          hasMessages={messages.length > 0} 
          onDownloadChat={handleDownloadChat}
          onOpenAbout={() => setIsAboutOpen(true)} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode(t => t === 'indigo' ? 'slate' : 'indigo')}
          onOpenQuiz={() => setActiveModal('quiz')}
        />

        {/* Chat Stream / Landing Screen */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
          {messages.length === 0 ? (
            /* AI Assistant Mobile Landing View */
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 sm:px-4 py-3 sm:py-6 flex flex-col">
              <Hero onPromptSelect={handleSendMessage} onOpenQuiz={() => setActiveModal('quiz')} />
            </div>
          ) : (
            /* Authentic Chatbot Message Stream */
            <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
              <ChatWindow 
                messages={messages} 
                isLoading={isLoading} 
                isStreaming={isStreaming} 
                onAskTopic={handleSendMessage}
              />
            </div>
          )}

          {/* Bottom Floating Chat Input Capsule */}
          <footer className="w-full bg-gradient-to-t from-[#06070a] via-[#06070a]/95 to-transparent pt-2 pb-safe border-t border-white/[0.04]">
            <div className="max-w-3xl mx-auto w-full px-2.5 sm:px-4 flex flex-col">
              
              {/* Contextual Suggested Prompt Chips */}
              {messages.length > 0 && !isGenerating && (
                <SuggestedPrompts onSelectPrompt={handleSendMessage} />
              )}

              {/* Chat Input Capsule */}
              <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-[#0c0e18]/90 border border-white/[0.09] focus-within:border-indigo-500/60 focus-within:shadow-glow-indigo transition-all duration-200">
                <div className="flex items-end gap-1.5 sm:gap-2">
                  
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isGenerating
                        ? "Formulating SQL solution..."
                        : "Ask any SQL question or query..."
                    }
                    rows={1}
                    disabled={isGenerating}
                    className="flex-1 bg-transparent border-0 focus:outline-none px-2.5 sm:px-3 py-1.5 text-slate-100 placeholder-slate-500 resize-none font-sans text-[13px] sm:text-sm leading-relaxed max-h-[120px] min-h-[38px] disabled:opacity-50"
                  />

                  {/* Circular Gradient Send Button */}
                  <button
                    onClick={() => handleSendMessage(input)}
                    disabled={isGenerating || !input.trim()}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${
                      input.trim() && !isGenerating
                        ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-glow-indigo hover:scale-105 active:scale-95'
                        : 'bg-white/[0.05] text-slate-500 cursor-not-allowed border border-white/[0.04]'
                    }`}
                    title="Send query"
                  >
                    <ArrowUp size={16} className={isGenerating ? 'animate-pulse' : 'stroke-[2.5]'} />
                  </button>
                </div>
              </div>

              {/* Footer Meta & Keyboard Shortcuts */}
              <div className="mt-1.5 hidden sm:flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wide px-1 select-none">
                <span className="truncate">SQLSense AI • Keyless Intelligent Assistant</span>
                <span className="text-slate-600">
                  <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">Ctrl+F</kbd> Formatter • <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">Ctrl+Q</kbd> Quiz
                </span>
              </div>

            </div>
          </footer>
        </main>

      </div>

      {/* Feature Modals */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
        onSelectTopic={handleSendMessage}
      />
      <FormatterModal 
        isOpen={activeModal === 'formatter'} 
        onClose={() => setActiveModal(null)} 
      />
      <QuizModal 
        isOpen={activeModal === 'quiz'} 
        onClose={() => setActiveModal(null)} 
      />
      <PracticeModal 
        isOpen={activeModal === 'practice'} 
        onClose={() => setActiveModal(null)} 
      />
      
    </div>
  );
}
