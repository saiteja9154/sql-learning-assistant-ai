import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ChatEmptyState from './components/chat/ChatEmptyState';
import ChatWindow from './components/chat/ChatWindow';
import ChatComposer from './components/chat/ChatComposer';
import SuggestedPrompts from './components/SuggestedPrompts';
import AboutModal from './components/about/AboutModal';
import Sidebar from './components/sidebar/Sidebar';
import FormatterModal from './components/formatter/FormatterModal';
import QuizModal from './components/quiz/QuizModal';
import PracticeModal from './components/practice/PracticeModal';
import API_URL from './apiConfig';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState('smart_assistant'); // 'smart_assistant' | 'explain_concept' | 'optimize_query' | 'debug_error'
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Layout & Theme States
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'formatter' | 'quiz' | 'practice' | null
  const [practiceInitialCode, setPracticeInitialCode] = useState('');
  
  // Persistent Light/Dark Theme
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sqlsense_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  const streamIntervalRef = useRef(null);

  // Sync theme to document element class & LocalStorage
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('sqlsense_theme', themeMode);
  }, [themeMode]);

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
      if (e.key === 'Escape') {
        setActiveModal(null);
        setIsAboutOpen(false);
      }
      
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

  const handleStopGeneration = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: false })));
  };

  const handleSendMessage = async (textToSend, modeToSend) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query || isGenerating) return;

    const requestMode = modeToSend || activeMode || 'smart_assistant';

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
    const updatedRecents = [query, ...recentQuestions.filter(q => q !== query)].slice(0, 20);
    setRecentQuestions(updatedRecents);
    localStorage.setItem('sqlsense_recent_queries', JSON.stringify(updatedRecents));

    // Append user message
    const userMsgId = 'user-' + Date.now();
    const userMessage = { 
      id: userMsgId, 
      role: 'user', 
      content: query, 
      mode: requestMode,
      timestamp: new Date() 
    };

    setInput('');
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: query,
          mode: requestMode 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const fullReply = data.reply || "No response generated.";

      setIsLoading(false);
      setIsStreaming(true);

      const assistantMsgId = 'assistant-' + Date.now();

      setMessages((prev) => [
        ...prev,
        { 
          id: assistantMsgId, 
          role: 'assistant', 
          content: '', 
          mode: requestMode,
          isStreaming: true, 
          timestamp: new Date() 
        },
      ]);

      // Optimized progressive typing reveal (batched for high responsiveness)
      const len = fullReply.length;
      const chunkSize = len > 1200 ? 32 : len > 600 ? 20 : len > 200 ? 12 : 8;
      const tickInterval = 24;
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
          content: `⚠️ **Connection Notice**\n\nI couldn't reach the backend server.\n\n* **Check Service:** Ensure the backend server is running.\n* **Network status:** Check your connection.\n\nPlease try sending your query again.`,
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
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

  // Run in practice mode from code block
  const handleRunInPractice = (code) => {
    setPracticeInitialCode(code);
    setActiveModal('practice');
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

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full flex bg-slate-50 dark:bg-[#07090e] font-sans text-slate-900 dark:text-slate-100 overflow-hidden relative selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:bg-indigo-500/30 dark:selection:text-white">
      
      {/* Sidebar / Mobile Drawer */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        recentQuestions={recentQuestions}
        onSelectQuestion={(q) => {
          handleSendMessage(q, activeMode);
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
        onToggleTheme={toggleTheme}
      />

      {/* Main Conversational Workspace */}
      <div className="flex-1 flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden relative min-w-0">
        
        {/* Top Navbar */}
        <Navbar 
          onClearChat={handleClearChat} 
          onDownloadChat={handleDownloadChat}
          onOpenAbout={() => setIsAboutOpen(true)} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onOpenQuiz={() => setActiveModal('quiz')}
          onOpenPractice={() => setActiveModal('practice')}
          onOpenFormatter={() => setActiveModal('formatter')}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
          {messages.length === 0 ? (
            /* Conversational Empty Welcome State */
            <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col items-center justify-center p-3 sm:p-6">
              <ChatEmptyState 
                input={input}
                setInput={setInput}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                onStopGeneration={handleStopGeneration}
                activeMode={activeMode}
                onSelectMode={setActiveMode}
                onOpenPractice={() => setActiveModal('practice')}
                onOpenQuiz={() => setActiveModal('quiz')}
                onOpenFormatter={() => setActiveModal('formatter')}
              />
            </div>
          ) : (
            /* Active Message Stream */
            <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
              <ChatWindow 
                messages={messages} 
                isLoading={isLoading} 
                isStreaming={isStreaming} 
                onAskTopic={(topic) => handleSendMessage(topic, activeMode)}
                onRegenerate={(query) => handleSendMessage(query, activeMode)}
                onRunInPractice={handleRunInPractice}
              />
            </div>
          )}

          {/* Bottom Chat Composer Bar (when conversation is active) */}
          {messages.length > 0 && (
            <footer className="w-full bg-gradient-to-t from-slate-50 via-slate-50/95 dark:from-[#07090e] dark:via-[#07090e]/95 to-transparent pt-2 pb-3 border-t border-slate-200 dark:border-white/[0.04]">
              <div className="max-w-3xl mx-auto w-full px-3 sm:px-6 flex flex-col">
                
                {/* Follow-up Suggestion Chips */}
                {!isGenerating && (
                  <SuggestedPrompts onSelectPrompt={(prompt) => handleSendMessage(prompt, activeMode)} />
                )}

                {/* Reusable ChatComposer with Connector Support */}
                <ChatComposer
                  input={input}
                  setInput={setInput}
                  onSendMessage={handleSendMessage}
                  isGenerating={isGenerating}
                  onStopGeneration={handleStopGeneration}
                  activeMode={activeMode}
                  onSelectMode={setActiveMode}
                  onOpenPractice={() => setActiveModal('practice')}
                  onOpenQuiz={() => setActiveModal('quiz')}
                  onOpenFormatter={() => setActiveModal('formatter')}
                />

                {/* Keyboard Shortcuts Hint */}
                <div className="mt-1.5 hidden sm:flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1 select-none">
                  <span>SQLSense AI • Local Intelligence</span>
                  <span className="text-slate-400 dark:text-slate-500">
                    <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300">Ctrl+F</kbd> Formatter • <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300">Ctrl+P</kbd> Practice • <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300">Ctrl+Q</kbd> Quiz
                  </span>
                </div>

              </div>
            </footer>
          )}
        </main>

      </div>

      {/* Feature Modals */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
        onSelectTopic={(topic) => handleSendMessage(topic, activeMode)}
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
        onClose={() => {
          setActiveModal(null);
          setPracticeInitialCode('');
        }} 
        initialQuery={practiceInitialCode}
      />
      
    </div>
  );
}
