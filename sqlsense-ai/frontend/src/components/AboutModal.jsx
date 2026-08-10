import React, { useEffect, useState } from 'react';
import { X, Cpu, Database, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../apiConfig';

export default function AboutModal({ isOpen, onClose }) {
  const [topics, setTopics] = useState([]);
  
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/about`)
        .then(res => res.json())
        .then(data => {
          if (data.supported_topics) {
            setTopics(data.supported_topics);
          }
        })
        .catch(err => {
          // fallback if backend not running yet
          setTopics([
            "Select", "Where", "Group By", "Having", "Inner Join", "Left Join", 
            "Self Join", "Subqueries", "CTE", "Window Functions", "Normalization",
            "Indexes", "Transactions", "Stored Procedures", "Triggers"
          ]);
        });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-brand-purple" />
                <h2 className="text-lg font-bold text-slate-100">About SQLSense AI</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
              
              {/* Introduction */}
              <div>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  SQLSense AI is a professional-grade SQL learning assistant created for the <strong className="text-slate-100">K-Hub Senior Developer Intern Selection Task</strong>. It behaves as an expert database tutor, helping developers understand schemas, create complex joins, resolve query syntax issues, and prep for relational database interview questions.
                </p>
              </div>

              {/* RAG Readiness Info Card */}
              <div className="glass-card bg-brand-purple/5 border-brand-purple/20 flex gap-4 p-5 items-start">
                <div className="p-2.5 rounded-xl bg-brand-purple/10 text-brand-purple border border-brand-purple/10">
                  <Cpu size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 mb-1">RAG Architecture Ready</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    This project is designed modularly to easily integrate Retrieval-Augmented Generation (RAG) in the next phase. API service stubs are pre-wired, allowing you to pass real-time database schemas and documentation straight into the LLM context.
                  </p>
                </div>
              </div>

              {/* Supported SQL Topics */}
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <BookOpen size={16} className="text-brand-blue" />
                  <h3 className="text-sm font-semibold text-slate-200">Supported SQL Topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-900 border border-white/5 rounded-lg text-slate-300 select-none shadow-sm hover:border-brand-blue/30 transition-all duration-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Tech Stack */}
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <Database size={16} className="text-brand-cyan" />
                  <h3 className="text-sm font-semibold text-slate-200">Technologies Utilized</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-light text-slate-300">
                  <div className="flex flex-col p-3 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="font-semibold text-slate-100 mb-0.5">Frontend Stack</span>
                    <span>React, Vite, Tailwind CSS, Framer Motion, React Markdown, PrismJS</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="font-semibold text-slate-100 mb-0.5">Backend Stack</span>
                    <span>FastAPI, Python 3, Uvicorn, Google Generative AI (Gemini 1.5 Flash API)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950/40 border-t border-white/5 text-center text-[10px] text-slate-500 font-medium">
              SQLSense AI • Developed as Selection Task Submission
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
