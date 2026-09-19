import React, { useState } from 'react';
import { X, Check, Terminal, RefreshCw, AlertTriangle, Eye, Database } from 'lucide-react';
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
      title: "Challenge 2: Department Budget (Medium)",
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
      title: "Challenge 3: Department Salary Averages (Hard)",
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
      setFeedback({ success: false, message: "Please type a SQL query before validating." });
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
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-3xl bg-[#0b0d16] border border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#080a12]/70">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Terminal size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-display">SQL Practice Challenges</h2>
                <p className="text-[11px] text-slate-400 font-mono">Interactive query validation workspace</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Challenge Tabs */}
          <div className="px-5 py-2.5 border-b border-white/[0.06] bg-[#0a0c16]/50 flex items-center gap-2 overflow-x-auto">
            {challenges.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleSwitchChallenge(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentChallenge === idx
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-indigo font-semibold'
                    : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin space-y-4">
            
            {/* Task Prompt Box */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-semibold uppercase text-indigo-400 tracking-wider">
                  Challenge Task
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {challenge.task}
              </p>
            </div>

            {/* Schema Inspector */}
            <div className="p-3.5 rounded-xl bg-[#090b14] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2">
                <Database size={12} className="text-cyan-400" />
                <span>Schema: <strong className="text-slate-200">{mockSchema.tableName}</strong></span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockSchema.columns.map((col, cIdx) => (
                  <div key={cIdx} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] font-mono">
                    <span className="text-indigo-300 font-medium">{col.name}</span>
                    <span className="text-slate-500 ml-1.5">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <span className="font-mono text-[11px]">Your SQL Query:</span>
                <span className="text-[10px] text-slate-500 font-mono">Keywords in UPPERCASE recommended</span>
              </div>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="SELECT ... FROM Employees WHERE ..."
                rows={4}
                className="w-full bg-[#080a12] border border-white/[0.09] focus:border-indigo-500/50 rounded-xl p-3.5 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none shadow-inner"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestQuery}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-glow-indigo transition-all cursor-pointer active:scale-95"
                >
                  <Check size={13} />
                  <span>Run & Validate Query</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 border border-white/[0.06] transition-all cursor-pointer"
                  title="Clear editor"
                >
                  <RefreshCw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors cursor-pointer"
              >
                <Eye size={12} />
                <span>{showSolution ? 'Hide Solution' : 'Reveal Solution'}</span>
              </button>
            </div>

            {/* Validation Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  feedback.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.success ? (
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold font-mono">
                    {feedback.success ? 'Query Accepted' : 'Syntax / Logic Constraint Missing'}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 font-light">
                    {feedback.message}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Solution Box (if toggled) */}
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-[#090b14] border border-white/[0.08]"
              >
                <div className="text-[11px] font-mono text-purple-400 font-semibold mb-1">
                  Expected Solution:
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-black/40 p-2.5 rounded-lg overflow-x-auto">
                  <code>{challenge.solution}</code>
                </pre>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
