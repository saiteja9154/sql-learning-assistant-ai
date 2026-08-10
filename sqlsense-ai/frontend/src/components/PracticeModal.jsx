import React, { useState } from 'react';
import { X, Check, Code, HelpCircle, Terminal, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PracticeModal({ isOpen, onClose }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [feedback, setFeedback] = useState(null); // { success: boolean, message: string }
  const [showSolution, setShowSolution] = useState(false);

  const mockSchema = {
    tableName: "Employees",
    columns: [
      { name: "emp_id", type: "INT PRIMARY KEY" },
      { name: "first_name", type: "VARCHAR(50)" },
      { name: "last_name", type: "VARCHAR(50)" },
      { name: "dept_id", type: "INT" },
      { name: "salary", type: "DECIMAL(10,2)" }
    ]
  };

  const challenges = [
    {
      title: "Challenge 1: High Earners (Easy)",
      task: "Select the first_name, last_name, and salary of all employees earning more than $60,000.",
      solution: "SELECT first_name, last_name, salary FROM Employees WHERE salary > 60000;",
      check: (query) => {
        const q = query.toUpperCase().replace(/\s+/g, ' ');
        const hasSelect = q.includes('SELECT FIRST_NAME') && q.includes('LAST_NAME') && q.includes('SALARY');
        const hasFrom = q.includes('FROM EMPLOYEES');
        const hasWhere = q.includes('WHERE SALARY > 60000') || q.includes('WHERE SALARY>60000');
        if (!hasSelect) return { success: false, message: "Make sure you SELECT first_name, last_name, and salary." };
        if (!hasFrom) return { success: false, message: "Make sure you query FROM Employees." };
        if (!hasWhere) return { success: false, message: "Make sure to filter WHERE salary > 60000." };
        return { success: true, message: "Excellent! Your query satisfies the constraints perfectly." };
      }
    },
    {
      title: "Challenge 2: Department Budget (Medium)",
      task: "Calculate the total salary budget (sum of salaries) for department ID 101. Alias the sum as 'total_budget'.",
      solution: "SELECT SUM(salary) AS total_budget FROM Employees WHERE dept_id = 101;",
      check: (query) => {
        const q = query.toUpperCase().replace(/\s+/g, ' ');
        const hasSum = q.includes('SUM(SALARY)') || q.includes('SUM (SALARY)');
        const hasAlias = q.includes('AS TOTAL_BUDGET') || q.includes(' TOTAL_BUDGET');
        const hasFrom = q.includes('FROM EMPLOYEES');
        const hasWhere = q.includes('WHERE DEPT_ID = 101') || q.includes('WHERE DEPT_ID=101');
        if (!hasSum) return { success: false, message: "Use the SUM(salary) aggregate function." };
        if (!hasAlias) return { success: false, message: "Remember to alias the result as 'total_budget'." };
        if (!hasFrom) return { success: false, message: "Query FROM Employees." };
        if (!hasWhere) return { success: false, message: "Filter WHERE dept_id = 101." };
        return { success: true, message: "Brilliant! The aggregate query works correctly." };
      }
    },
    {
      title: "Challenge 3: Department Salary Averages (Hard)",
      task: "Find the average salary for each department (dept_id). Group by dept_id and sort the results by average salary in descending order.",
      solution: "SELECT dept_id, AVG(salary) FROM Employees GROUP BY dept_id ORDER BY AVG(salary) DESC;",
      check: (query) => {
        const q = query.toUpperCase().replace(/\s+/g, ' ');
        const hasGroup = q.includes('GROUP BY DEPT_ID') || q.includes('GROUP BY DEPT_ID');
        const hasAvg = q.includes('AVG(SALARY)') || q.includes('AVG (SALARY)');
        const hasOrder = q.includes('ORDER BY') && q.includes('DESC');
        if (!hasAvg) return { success: false, message: "Use AVG(salary) to find the average." };
        if (!hasGroup) return { success: false, message: "Make sure you include a GROUP BY dept_id clause." };
        if (!hasOrder) return { success: false, message: "Remember to sort with ORDER BY and use the DESC keyword." };
        return { success: true, message: "Fantastic work! You have mastered grouping and sorting aggregates." };
      }
    }
  ];

  const handleCheck = () => {
    if (!userQuery.trim()) return;
    const result = challenges[currentChallenge].check(userQuery);
    setFeedback(result);
  };

  const handleNext = () => {
    setUserQuery('');
    setFeedback(null);
    setShowSolution(false);
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(c => c + 1);
    } else {
      // Completed all
      setCurrentChallenge(0);
      onClose();
    }
  };

  const handleReset = () => {
    setCurrentChallenge(0);
    setUserQuery('');
    setFeedback(null);
    setShowSolution(false);
  };

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
            className="relative w-full max-w-4xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-blue-400" />
                <h2 className="text-lg font-bold text-slate-100">SQL Practice Console</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Split layout body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 min-h-[50vh] scrollbar-thin">
              
              {/* Column 1: Schema Reference Card */}
              <div className="flex flex-col gap-3 md:col-span-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Schema Reference
                </div>
                <div className="glass-card bg-slate-950/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 mb-3 font-semibold text-sm text-slate-200">
                    <Code size={15} className="text-blue-400" />
                    <span>Table: {mockSchema.tableName}</span>
                  </div>
                  <ul className="space-y-2 text-xs font-mono">
                    {mockSchema.columns.map((col, idx) => (
                      <li key={idx} className="flex justify-between border-b border-white/[0.03] pb-1.5 last:border-0 last:pb-0">
                        <span className="text-purple-300 font-medium">{col.name}</span>
                        <span className="text-slate-500">{col.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2 & 3: Challenge Console */}
              <div className="flex flex-col gap-4 md:col-span-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                  <span>SQL Challenge Console</span>
                  <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    CHALLENGE {currentChallenge + 1} OF {challenges.length}
                  </span>
                </div>

                {/* Challenge Task Box */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                  <h3 className="font-semibold text-sm text-slate-200">{challenges[currentChallenge].title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{challenges[currentChallenge].task}</p>
                </div>

                {/* Textarea Code Terminal */}
                <div className="flex-1 flex flex-col gap-2 min-h-[160px]">
                  <textarea
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Type your SQL query here (e.g. SELECT * FROM Employees)..."
                    className="flex-1 glass-input font-mono text-xs leading-relaxed resize-none p-4"
                  />
                </div>

                {/* Feedback Panel */}
                {feedback && (
                  <div 
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed font-light flex items-start gap-2.5 ${
                      feedback.success 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                    }`}
                  >
                    {feedback.success ? (
                      <Check size={14} className="flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                {/* Solution Reveal */}
                {showSolution && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 font-mono text-xs">
                    <span className="text-slate-500 font-sans font-semibold uppercase tracking-wider text-[10px]">Reference Solution</span>
                    <pre className="text-slate-300 select-text whitespace-pre-wrap">{challenges[currentChallenge].solution}</pre>
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-slate-950/40 flex justify-between gap-3 items-center">
              <button
                onClick={() => setShowSolution(s => !s)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium hover:bg-white/5 rounded-xl active:scale-95 duration-200"
              >
                <HelpCircle size={14} />
                <span>{showSolution ? "Hide Solution" : "Reveal Solution"}</span>
              </button>
              
              <div className="flex gap-3">
                {feedback?.success ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md active:scale-95 duration-200 cursor-pointer"
                  >
                    <span>{currentChallenge === challenges.length - 1 ? "Complete & Exit" : "Next Challenge"}</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleReset}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all active:scale-95 duration-200"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCheck}
                      disabled={!userQuery.trim()}
                      className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 duration-200 ${
                        userQuery.trim()
                          ? 'bg-gradient-to-r from-blue-500 to-brand-blue text-white shadow-glow-blue cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      Run Check
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
