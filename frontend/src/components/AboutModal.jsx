import React, { useEffect, useState } from 'react';
import { X, Layers, Database, Sparkles, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../apiConfig';

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

  const filteredTopics = (topics.length > 0 ? topics : fallbackTopics).filter(t => 
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
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-[#0b0d16] border border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#080a12]/70">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Layers size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-display">About SQLSense AI</h2>
                <p className="text-[11px] text-slate-400 font-mono">Local RAG engine & loaded documentation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Architecture Highlights */}
          <div className="p-5 border-b border-white/[0.06] bg-[#0a0c16]/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Keyless Architecture
                </div>
                <p className="text-[11px] text-slate-400">Zero external API dependencies or rate limits.</p>
              </div>
              
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                  <Database size={12} className="text-indigo-400" />
                  Local SQL Knowledge
                </div>
                <p className="text-[11px] text-slate-400">Curated Markdown docs with semantic scoring.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                  <Sparkles size={12} className="text-purple-400" />
                  Realtime Assistance
                </div>
                <p className="text-[11px] text-slate-400">Instant explanations, syntax, and practice.</p>
              </div>
            </div>
          </div>

          {/* Supported Topics Browser */}
          <div className="p-5 overflow-y-auto flex-1 scrollbar-thin">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 font-mono">
                <span>Loaded Topics ({filteredTopics.length})</span>
              </div>

              {/* Topic Search */}
              <div className="relative w-48">
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter topics..."
                  className="w-full bg-[#080a12] border border-white/[0.08] rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/40"
                />
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSelectTopic) {
                      onSelectTopic(`Explain ${topic} in SQL with clear syntax, use cases, and an example query.`);
                      onClose();
                    }
                  }}
                  className="p-2 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 border border-white/[0.05] hover:border-indigo-500/30 text-left transition-all group flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs text-slate-300 group-hover:text-white truncate font-medium">
                    {topic}
                  </span>
                  <ArrowRight size={11} className="text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
