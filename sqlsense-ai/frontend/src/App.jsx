import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Download, Code, Award, Terminal, LayoutList } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickActionCards from './components/QuickActionCards';
import ChatWindow from './components/ChatWindow';
import SuggestedPrompts from './components/SuggestedPrompts';
import AboutModal from './components/AboutModal';

// Components
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
  const [errorMessage, setErrorMessage] = useState(null);

  // States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'formatter' | 'quiz' | 'practice' | null
  const [themeMode, setThemeMode] = useState('indigo'); // 'indigo' | 'slate'

  // Ref to hold any running stream interval for clean cancellation
  const streamIntervalRef = useRef(null);

  // Load recent questions from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sqlsense_recent_queries');
    if (saved) {
      try {
        setRecentQuestions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent questions", e);
      }
    }
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleShortcuts = (e) => {
      // Esc closes all modals
      if (e.key === 'Escape') {
        setActiveModal(null);
        setIsAboutOpen(false);
      }
      
      // Ctrl combinations
      if (e.ctrlKey) {
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
      }
    };

    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, []);

  const isGenerating = isLoading || isStreaming;

  const handleSendMessage = async (textToSend) => {
    const query = textToSend.trim();
    if (!query || isGenerating) return;

    setErrorMessage(null);

    // Cancel any previous active streaming timer
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    // Update recent queries lists
    const updatedRecents = [query, ...recentQuestions.filter(q => q !== query)].slice(0, 8);
    setRecentQuestions(updatedRecents);
    localStorage.setItem('sqlsense_recent_queries', JSON.stringify(updatedRecents));

    // 1. Create and render user message immediately with a unique ID
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

      // 2. Ensure a short, natural thinking pause (350ms min) for realistic AI interaction
      const elapsed = Date.now() - startTime;
      const minThinkingTime = 380;
      if (elapsed < minThinkingTime) {
        await new Promise((resolve) => setTimeout(resolve, minThinkingTime - elapsed));
      }

      // 3. Transition from Thinking to Streaming/Typing reveal
      setIsLoading(false);
      setIsStreaming(true);

      const assistantMsgId = 'assistant-' + Date.now();

      // Append assistant message container with empty initial content
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true },
      ]);

      // 4. Adaptive Progressive Reveal
      // Balances smooth reading speed with instant responsive feel:
      // Short response: ~3 chars per 16ms
      // Medium response: ~8 chars per 16ms
      // Long response: ~18 chars per 16ms
      const len = fullReply.length;
      const chunkSize = len > 1200 ? 20 : len > 600 ? 10 : len > 200 ? 5 : 3;
      const tickInterval = 16;
      let currentIndex = 0;

      await new Promise((resolve) => {
        streamIntervalRef.current = setInterval(() => {
          currentIndex += chunkSize;

          if (currentIndex >= fullReply.length) {
            currentIndex = fullReply.length;
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;

            // Finalize completed message
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

      // Append clean error message
      setMessages((prev) => [
        ...prev,
        { 
          id: 'error-' + Date.now(),
          role: 'assistant', 
          content: `⚠️ **Connection Error**\n\nI couldn't reach the backend server to process your query.\n\n* **Is the FastAPI backend running?** Verify that the server is running on the expected host/port.\n* **Network status:** Check your browser connection.\n\nPlease refresh or try again.` 
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
    setErrorMessage(null);
    setIsLoading(false);
    setIsStreaming(false);
  };

  // Download Chat Log Utility
  const handleDownloadChat = () => {
    if (messages.length === 0) return;
    
    // Format conversation logs
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
    <div className={`min-h-screen flex bg-slate-950 font-sans text-slate-100 transition-colors duration-500 overflow-hidden ${
      themeMode === 'slate' ? 'selection:bg-slate-700 selection:text-white' : 'selection:bg-brand-purple/35 selection:text-white'
    }`}>
      
      {/* Collapsible Left Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        recentQuestions={recentQuestions}
        onSelectQuestion={handleSendMessage}
        onNewChat={handleClearChat}
        onOpenFormatter={() => setActiveModal('formatter')}
        onOpenQuiz={() => setActiveModal('quiz')}
        onOpenPractice={() => setActiveModal('practice')}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Dynamic Background Gradients Glows based on Theme mode selection */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
          themeMode === 'slate' 
            ? 'bg-gradient-to-tr from-slate-900/10 via-transparent to-slate-900/10' 
            : 'bg-[radial-gradient(circle_at_10%_20%,rgba(139,92,246,0.04)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.04)_0%,transparent_40%)]'
        }`} />

        {/* Top Navbar */}
        <Navbar 
          onClearChat={handleClearChat} 
          hasMessages={messages.length > 0} 
          onOpenAbout={() => setIsAboutOpen(true)} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode(t => t === 'indigo' ? 'slate' : 'indigo')}
        />

        {/* Messaging Logs scroll containers */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden relative z-10">
          {messages.length === 0 ? (
            /* Empty / Homepage State */
            <div className="flex-1 flex flex-col justify-center overflow-y-auto scrollbar-thin py-6">
              <Hero />
              
              {/* Quick Suggestion Cards Grid */}
              <QuickActionCards onCardSelect={handleSendMessage} />
            </div>
          ) : (
            /* Chat window message logs */
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/20 border-x border-white/[0.02] max-w-5xl mx-auto w-full overflow-hidden">
              <ChatWindow 
                messages={messages} 
                isLoading={isLoading} 
                isStreaming={isStreaming} 
              />
            </div>
          )}

          {/* Prompt Area fixed at bottom */}
          <div className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-md py-4 sm:py-6">
            <div className="max-w-4xl mx-auto w-full px-4 flex flex-col">
              
              {/* Floating Suggested Prompt Chips */}
              {messages.length > 0 && !isGenerating && (
                <SuggestedPrompts onSelectPrompt={handleSendMessage} />
              )}

              {/* Input container bubble */}
              <div className="relative glass-panel rounded-2xl p-1 bg-slate-900/40 focus-within:border-brand-purple/40 focus-within:shadow-glow-purple transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                  
                  {/* Prompt Textarea */}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isGenerating
                        ? "SQLSense AI is responding..."
                        : "Ask a SQL question (e.g., 'What is a composite primary key?' or 'Write a self join query')..."
                    }
                    rows={2}
                    disabled={isGenerating}
                    className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none px-4 py-3 text-slate-100 placeholder-slate-500 resize-none font-sans text-sm outline-none disabled:opacity-60"
                  />

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 px-4 py-2.5 sm:py-0 border-t sm:border-t-0 border-white/5">
                    {/* Log Downloads and shortcuts descriptors */}
                    <div className="flex items-center gap-2">
                      {messages.length > 0 && !isGenerating && (
                        <button
                          onClick={handleDownloadChat}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Download chat history"
                        >
                          <Download size={14} />
                        </button>
                      )}
                    </div>

                    {/* Submit Send Button */}
                    <button
                      onClick={() => handleSendMessage(input)}
                      disabled={isGenerating || !input.trim()}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all duration-200 ${
                        input.trim() && !isGenerating
                          ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple active:scale-95 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 opacity-70'
                      }`}
                    >
                      <span>{isStreaming ? 'Responding...' : isLoading ? 'Thinking...' : 'Send'}</span>
                      <Send size={12} className={isGenerating ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Shortcut labels disclaimer */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 font-light tracking-wide px-1">
                <span>SQLSense AI utilizes a local SQL Knowledge Engine. Instant, reliable SQL assistance.</span>
                <span className="hidden md:inline">Shortcuts: `Ctrl+F` Formatter • `Ctrl+H` Sidebar • `Ctrl+Q` Quiz • `Ctrl+P` Practice</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* About/Info Details Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Bonus Feature Panels Modals */}
      <FormatterModal isOpen={activeModal === 'formatter'} onClose={() => setActiveModal(null)} />
      <QuizModal isOpen={activeModal === 'quiz'} onClose={() => setActiveModal(null)} />
      <PracticeModal isOpen={activeModal === 'practice'} onClose={() => setActiveModal(null)} />
      
    </div>
  );
}
