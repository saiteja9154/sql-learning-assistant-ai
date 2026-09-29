import React, { useEffect, useState } from 'react';
import { X, Layers, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../../apiConfig';

const FALLBACK_TOPICS = [
  "Create Table", "Insert", "Update", "Delete", "Truncate", "Drop",
  "Select", "Where", "Order By", "Group By", "Having", "Aggregate Functions",
  "Primary Key", "Foreign Key", "Inner Join", "Left Join", "Right Join", 
  "Full Join", "Cross Join", "Self Join", "Union", "Views",
  "Indexes", "Normalization", "Subqueries", "CTE", "Window Functions",
  "Transactions", "Stored Procedures", "Triggers"
];

export default function AboutModal({ isOpen, onClose, onSelectTopic }) {
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/about`)
        .then(res => res.json())
        .then(data => {
          if (data.supported_topics && data.supported_topics.length > 0) {
            setTopics(data.supported_topics);
          } else {
            setTopics(FALLBACK_TOPICS);
          }
        })
        .catch(() => {
          setTopics(FALLBACK_TOPICS);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTopics = topics.length > 0 ? topics : FALLBACK_TOPICS;
  const filteredTopics = currentTopics.filter(t => 
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0d101a] border border-slate-200 dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90dvh] text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#090c15]">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold">About SQLSense AI</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Core Info Highlights */}
          <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#0b0e18]/60">
            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                <div className="text-[11.5px] font-semibold mb-0.5">
                  Local System
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Zero external API dependencies.</p>
              </div>
              
              <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                <div className="text-[11.5px] font-semibold mb-0.5">
                  SQL Knowledge
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Curated schema & syntax reference.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                <div className="text-[11.5px] font-semibold mb-0.5">
                  Instant Tutor
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Explanations, queries & quizzes.</p>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                Supported Topics ({filteredTopics.length})
              </span>

              <div className="relative w-40">
                <Search size={11} className="absolute left-2.5 top-2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter topics..."
                  className="w-full bg-slate-50 dark:bg-[#080a12] border border-slate-200 dark:border-white/[0.08] rounded-lg pl-6 pr-2 py-1 text-[11px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {filteredTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSelectTopic) {
                      onSelectTopic(`Explain ${topic} in SQL with clear syntax, use cases, and an example query.`);
                      onClose();
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.04] hover:border-indigo-400 dark:hover:border-indigo-500/30 text-left transition-all group flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white truncate">
                    {topic}
                  </span>
                  <ArrowRight size={10} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
