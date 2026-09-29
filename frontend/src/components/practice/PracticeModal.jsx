import React, { useState, useEffect } from 'react';
import { X, Check, Terminal, RefreshCw, AlertTriangle, Eye, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PracticeModal({ isOpen, onClose, initialQuery = '' }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [feedback, setFeedback] = useState(null); // { success: boolean, message: string }
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setUserQuery(initialQuery);
    }
  }, [initialQuery]);

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
      title: "1. High Earners",
      difficulty: "Easy",
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
      title: "2. Department Budget",
      difficulty: "Medium",
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
      title: "3. Dept Salary Averages",
      difficulty: "Hard",
      task: "Find the average salary for each department (dept_id). Group by dept_id and sort the results by average salary in descending order.",
      solution: "SELECT dept_id, AVG(salary) FROM Employees GROUP BY dept_id ORDER BY AVG(salary) DESC;",
      check: (query) => {
        const q = query.toUpperCase().replace(/\s+/g, ' ');
        const hasAvg = q.includes('AVG(SALARY)') || q.includes('AVG (SALARY)');
        const hasGroup = q.includes('GROUP BY DEPT_ID');
        const hasOrder = q.includes('ORDER BY') && (q.includes('AVG(SALARY) DESC') || q.includes('AVG (SALARY) DESC') || q.includes('DESC'));
        if (!hasAvg) return { success: false, message: "Use AVG(salary) to compute department averages." };
        if (!hasGroup) return { success: false, message: "Remember to GROUP BY dept_id." };
        if (!hasOrder) return { success: false, message: "Remember to sort with ORDER BY ... DESC." };
        return { success: true, message: "Outstanding! Your grouping and sorting query is 100% accurate." };
      }
    }
  ];

  const handleTestQuery = () => {
    if (!userQuery.trim()) {
      setFeedback({ success: false, message: "Please enter a SQL query before validating." });
      return;
    }
    const result = challenges[currentChallenge].check(userQuery);
    setFeedback(result);
  };

  const handleReset = () => {
    setUserQuery('');
    setFeedback(null);
    setShowSolution(false);
  };

  const handleSwitchChallenge = (index) => {
    setCurrentChallenge(index);
    setUserQuery('');
    setFeedback(null);
    setShowSolution(false);
  };

  if (!isOpen) return null;

  const challenge = challenges[currentChallenge];

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
          className="relative w-full max-w-2xl bg-white dark:bg-[#0d101a] border border-slate-200 dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90dvh] text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#090c15]">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold">SQL Practice</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Challenge Tabs */}
          <div className="px-4 sm:px-5 py-2 border-b border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#0b0e18] flex items-center gap-1.5 overflow-x-auto">
            {challenges.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleSwitchChallenge(idx)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentChallenge === idx
                    ? 'bg-slate-200 dark:bg-white/[0.12] text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin space-y-3.5">
            
            {/* Task Prompt Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                  Task
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-200 dark:border-indigo-500/20">
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 leading-relaxed">
                {challenge.task}
              </p>
            </div>

            {/* Schema Inspector */}
            <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-[#080a12] border border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1.5">
                <Database size={11} className="text-cyan-600 dark:text-cyan-400" />
                <span>Table: <strong className="text-slate-900 dark:text-slate-200">{mockSchema.tableName}</strong></span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {mockSchema.columns.map((col, cIdx) => (
                  <div key={cIdx} className="px-2 py-0.5 rounded bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-[11px] font-mono">
                    <span className="text-indigo-600 dark:text-indigo-300">{col.name}</span>
                    <span className="text-slate-500 ml-1">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">SQL Query:</span>
              </div>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="SELECT ... FROM Employees WHERE ..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-[#080a12] border border-slate-200 dark:border-white/[0.09] focus:border-indigo-500 rounded-xl p-3 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestQuery}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer active:scale-95"
                >
                  <Check size={12} />
                  <span>Run & Validate</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] transition-all cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>Reset</span>
                </button>
              </div>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Eye size={12} />
                <span>{showSolution ? 'Hide Solution' : 'Show Solution'}</span>
              </button>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  feedback.success
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}
              >
                {feedback.success ? (
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={14} className="text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold font-mono">
                    {feedback.success ? 'Success: ' : 'Issue: '}
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">{feedback.message}</span>
                </div>
              </div>
            )}

            {/* Solution Box */}
            {showSolution && (
              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                <div className="text-[11px] font-mono text-purple-400 font-medium mb-1">
                  Solution:
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-black/40 p-2 rounded overflow-x-auto">
                  <code>{challenge.solution}</code>
                </pre>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
