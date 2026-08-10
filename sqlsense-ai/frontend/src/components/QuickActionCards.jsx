import React from 'react';
import { HelpCircle, GitPullRequest, Award, Settings, Compass, HelpCircle as HelpIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickActionCards({ onCardSelect }) {
  const cards = [
    {
      title: "Explain INNER JOIN",
      description: "How does it filter and combine rows from multiple tables?",
      icon: GitPullRequest,
      color: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/10 hover:border-purple-500/30",
      query: "Explain INNER JOIN in detail with examples"
    },
    {
      title: "WHERE vs HAVING",
      description: "What is the crucial difference in filtering group metrics?",
      icon: HelpCircle,
      color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/10 hover:border-blue-500/30",
      query: "What is the difference between WHERE and HAVING? Explain with examples."
    },
    {
      title: "Second Highest Salary",
      description: "Common SQL interview question solved in multiple ways.",
      icon: Award,
      color: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/10 hover:border-cyan-500/30",
      query: "Show me how to find the second highest salary in SQL using multiple approaches (subquery, CTE, LIMIT, DENSE_RANK)."
    },
    {
      title: "Window Functions",
      description: "Learn ROW_NUMBER, RANK, DENSE_RANK, and PARTITION BY.",
      icon: Settings,
      color: "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/10 hover:border-indigo-500/30",
      query: "Explain Window Functions like ROW_NUMBER, RANK, and DENSE_RANK. What is the PARTITION BY clause?"
    },
    {
      title: "Database Normalization",
      description: "Understand 1NF, 2NF, 3NF and why database design matters.",
      icon: Compass,
      color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30",
      query: "Explain database normalization forms (1NF, 2NF, 3NF) with a simple relational table transition example."
    },
    {
      title: "Practice Query Generation",
      description: "Ask the AI tutor to construct a complex mock scenario query.",
      icon: HelpIcon,
      color: "from-pink-500/20 to-pink-600/5 text-pink-400 border-pink-500/10 hover:border-pink-500/30",
      query: "Generate a practice SQL quiz with 3 questions ranging from Easy to Hard. Include sample tables."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.4
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto px-4 mt-4 mb-16"
    >
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={idx}
            variants={item}
            onClick={() => onCardSelect(card.query)}
            className={`glass-panel bg-gradient-to-br ${card.color} glass-panel-hover rounded-2xl cursor-pointer p-5 flex flex-col justify-between hover:scale-[1.02] active:scale-98 transition-all duration-300`}
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="font-semibold text-slate-200 text-sm tracking-tight">{card.title}</span>
                <div className="p-2 rounded-lg bg-slate-950/40">
                  <IconComponent size={16} />
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{card.description}</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
              <span>Ask assistant</span>
              <span>→</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
