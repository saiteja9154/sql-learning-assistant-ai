import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'formatter' | 'quiz' | 'practice' | null
  const [themeMode, setThemeMode] = useState('indigo'); // 'indigo' | 'slate'

  const streamIntervalRef = useRef(null);
  const textareaRef = useRef(null);

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
    const userMessage = { id: userMsgId, role: 'user', content: query };

    setInput('');
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
      const minThinkingTime = 320;
      if (elapsed < minThinkingTime) {
        await new Promise((resolve) => setTimeout(resolve, minThinkingTime - elapsed));
      }

      setIsLoading(false);
      setIsStreaming(true);

      const assistantMsgId = 'assistant-' + Date.now();

      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true },
      ]);

      // Progressive reveal
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
      setErrorMessage("Could not connect to backend server.");
      
      setIsLoading(false);
      setIsStreaming(false);

      setMessages((prev) => [
        ...prev,
        { 
          id: 'error-' + Date.now(),
          role: 'assistant', 
          content: `⚠️ **Connection Error**\n\nI couldn't reach the local backend server.\n\n* **Is the FastAPI backend active?** Ensure the backend is running on the configured host/port.\n* **Network status:** Check your local connection.\n\nPlease try sending your message again.` 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
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
    <div className={`h-screen flex bg-[#06070a] font-sans text-slate-100 overflow-hidden ${
      themeMode === 'slate' ? 'selection:bg-slate-700 selection:text-white' : 'selection:bg-indigo-500/30 selection:text-white'
    }`}>
      
      {/* Collapsible Left Developer Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        recentQuestions={recentQuestions}
        onSelectQuestion={handleSendMessage}
        onDeleteQuestion={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        onNewChat={handleClearChat}
        onOpenFormatter={() => setActiveModal('formatter')}
        onOpenQuiz={() => setActiveModal('quiz')}
        onOpenPractice={() => setActiveModal('practice')}
        onOpenAbout={() => setIsAboutOpen(true)}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(t => t === 'indigo' ? 'slate' : 'indigo')}
      />

      {/* Main Workspace Page Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        
        {/* Subtle Atmospheric Gradients */}
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
        />

        {/* Main Canvas / Chat Workspace */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden relative z-10">
          {messages.length === 0 ? (
            /* AI Assistant Landing State */
            <div className="flex-1 flex flex-col justify-center overflow-y-auto scrollbar-thin py-6">
              <Hero onPromptSelect={handleSendMessage} />
            </div>
          ) : (
            /* Conversation Stream Window */
            <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full overflow-hidden">
              <ChatWindow 
                messages={messages} 
                isLoading={isLoading} 
                isStreaming={isStreaming} 
                onAskTopic={handleSendMessage}
              />
            </div>
          )}

          {/* Prompt Dock Area */}
          <div className="w-full border-t border-white/[0.06] bg-[#07080d]/80 backdrop-blur-xl py-3.5 sm:py-4">
            <div className="max-w-3xl mx-auto w-full px-3 sm:px-4 flex flex-col">
              
              {/* Contextual Suggested Prompt Chips */}
              {messages.length > 0 && !isGenerating && (
                <SuggestedPrompts onSelectPrompt={handleSendMessage} />
              )}

              {/* Developer Query Input Box */}
              <div className="relative glass-panel rounded-2xl p-1 bg-[#0b0d18]/80 border border-white/[0.08] focus-within:border-indigo-500/50 focus-within:shadow-glow-indigo transition-all duration-200">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end">
                  
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isGenerating
                        ? "SQLSense AI is formulating response..."
                        : "Ask a SQL question (e.g., 'Explain Window Functions' or 'Write a self join query')..."
                    }
                    rows={2}
                    disabled={isGenerating}
                    className="flex-1 bg-transparent border-0 focus:outline-none px-3.5 py-2.5 text-slate-100 placeholder-slate-500 resize-none font-sans text-xs sm:text-sm outline-none disabled:opacity-50"
                  />

                  {/* Actions & Submit Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 px-3 py-2 sm:py-2 border-t sm:border-t-0 border-white/[0.04]">
                    {/* Send Button */}
                    <button
                      onClick={() => handleSendMessage(input)}
                      disabled={isGenerating || !input.trim()}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        input.trim() && !isGenerating
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-indigo active:scale-95'
                          : 'bg-white/[0.04] text-slate-500 cursor-not-allowed border border-white/[0.04]'
                      }`}
                    >
                      <span>{isStreaming ? 'Generating...' : isLoading ? 'Thinking...' : 'Send'}</span>
                      <Send size={12} className={isGenerating ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Meta & Keyboard Shortcuts */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wide px-1 select-none">
                <span className="truncate">Keyless SQL Knowledge Engine • Fast & Offline Ready</span>
                <span className="hidden md:inline text-slate-600">
                  Shortcuts: <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">Ctrl+F</kbd> Formatter • <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">Ctrl+Q</kbd> Quiz • <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">Ctrl+P</kbd> Practice
                </span>
              </div>

            </div>
          </div>
        </div>

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
