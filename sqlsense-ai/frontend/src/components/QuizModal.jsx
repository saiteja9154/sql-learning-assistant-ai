import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Award, Flame, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../apiConfig';

// Fallback questions in case of offline/network issues
const DEFAULT_QUESTIONS = {
  beginner: [
    {
      id: "b1",
      topic: "SELECT",
      difficulty: "beginner",
      question: "Which SQL keyword is used to retrieve distinct (unique) values from a table column?",
      options: ["UNIQUE", "DISTINCT", "DIFFERENT", "FILTER"],
      correctIndex: 1,
      explanation: "The DISTINCT keyword is placed immediately after SELECT to eliminate duplicate rows from the returned result set."
    },
    {
      id: "b2",
      topic: "WHERE",
      difficulty: "beginner",
      question: "Which operator is used to search for a specified pattern in a column using wildcards?",
      options: ["IN", "LIKE", "BETWEEN", "CONTAINS"],
      correctIndex: 1,
      explanation: "The LIKE operator is used in a WHERE clause with wildcards such as '%' (matches multiple characters) and '_' (matches single character)."
    },
    {
      id: "b3",
      topic: "ORDER BY",
      difficulty: "beginner",
      question: "What is the default sorting order when using the ORDER BY clause without specifying ASC or DESC?",
      options: ["Descending (DESC)", "Ascending (ASC)", "Random", "By primary key insertion order"],
      correctIndex: 1,
      explanation: "By default, ORDER BY sorts result sets in ascending order (ASC) if no order direction is explicitly given."
    },
    {
      id: "b4",
      topic: "DELETE vs TRUNCATE",
      difficulty: "beginner",
      question: "Which command removes ALL rows from a table, cannot have a WHERE clause, and resets identity counters?",
      options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"],
      correctIndex: 1,
      explanation: "TRUNCATE TABLE removes all rows at once without logging individual row deletions, resets identity seeds, and does not accept a WHERE clause."
    },
    {
      id: "b5",
      topic: "Primary Key",
      difficulty: "beginner",
      question: "Which statement regarding PRIMARY KEY constraints is TRUE?",
      options: [
        "A primary key column can accept a single NULL value.",
        "A primary key column must contain UNIQUE values and CANNOT be NULL.",
        "A table can have multiple primary keys defined separately.",
        "Primary keys are only allowed on numerical data types."
      ],
      correctIndex: 1,
      explanation: "A primary key uniquely identifies each record in a database table. It implicitly enforces both UNIQUE and NOT NULL constraints."
    },
    {
      id: "b6",
      topic: "Aggregate Functions",
      difficulty: "beginner",
      question: "What does the COUNT(*) function return?",
      options: [
        "Only rows that do not contain any NULL values.",
        "The total number of rows matching the query criteria, including NULLs.",
        "The sum of all integer columns in the table.",
        "The count of unique column names in the schema."
      ],
      correctIndex: 1,
      explanation: "COUNT(*) counts all rows returned by the query regardless of whether individual columns contain NULL values."
    }
  ],
  intermediate: [
    {
      id: "i1",
      topic: "Joins",
      difficulty: "intermediate",
      question: "What is the result of a LEFT JOIN if a row in the left table has no matching record in the right table?",
      options: [
        "The row is omitted from the final output.",
        "The row is included, with NULL values for all columns from the right table.",
        "The query fails with a foreign key violation error.",
        "The right table columns default to empty strings or 0."
      ],
      correctIndex: 1,
      explanation: "A LEFT JOIN returns all rows from the left table. For rows with no match in the right table, all columns from the right table are populated with NULL."
    },
    {
      id: "i2",
      topic: "GROUP BY & HAVING",
      difficulty: "intermediate",
      question: "What is the primary difference between the WHERE clause and the HAVING clause?",
      options: [
        "WHERE filters grouped data, while HAVING filters individual rows before grouping.",
        "WHERE filters rows before aggregation, while HAVING filters groups after aggregation.",
        "WHERE is used only with SELECT, while HAVING is used with UPDATE.",
        "There is no difference; they are interchangeable."
      ],
      correctIndex: 1,
      explanation: "WHERE filters rows before grouping/aggregations occur. HAVING filters the resulting aggregate groups (e.g. HAVING COUNT(*) > 5)."
    },
    {
      id: "i3",
      topic: "UNION vs UNION ALL",
      difficulty: "intermediate",
      question: "How does UNION differ from UNION ALL in performance and result set?",
      options: [
        "UNION keeps duplicate rows and is faster.",
        "UNION eliminates duplicate rows with a sorting step; UNION ALL keeps duplicates and is faster.",
        "UNION ALL can only combine queries from the exact same table name.",
        "UNION cannot be used with ORDER BY."
      ],
      correctIndex: 1,
      explanation: "UNION performs a distinct sort to eliminate duplicates between result sets, which adds performance overhead. UNION ALL simply concatenates sets."
    }
  ],
  advanced: [
    {
      id: "a1",
      topic: "Window Functions",
      difficulty: "advanced",
      question: "How does RANK() differ from DENSE_RANK() when encountering tied values?",
      options: [
        "RANK() skips subsequent rank numbers after ties; DENSE_RANK() assigns consecutive numbers without gaps.",
        "DENSE_RANK() skips rank numbers after ties; RANK() assigns consecutive numbers.",
        "RANK() can only operate on numerical data; DENSE_RANK() works on text.",
        "There is no difference in ranking output."
      ],
      correctIndex: 0,
      explanation: "RANK() leaves gaps (e.g., 1, 2, 2, 4) after duplicate values, whereas DENSE_RANK() assigns consecutive ranks without gaps (e.g., 1, 2, 2, 3)."
    },
    {
      id: "a2",
      topic: "CTEs",
      difficulty: "advanced",
      question: "What is a recursive Common Table Expression (CTE) primarily used for in SQL?",
      options: [
        "Querying hierarchical structures like org charts, graph trees, and bill of materials.",
        "Creating permanent database triggers that execute on insert.",
        "Bypassing table locks during multi-threaded bulk inserts.",
        "Encrypting column values with SHA-256."
      ],
      correctIndex: 0,
      explanation: "A recursive CTE references itself to iteratively traverse parent-child hierarchical trees, folder structures, or graph relationships."
    },
    {
      id: "a3",
      topic: "ACID Transactions",
      difficulty: "advanced",
      question: "Which ACID property guarantees that once a transaction commits, its changes survive system crashes and power failures?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correctIndex: 3,
      explanation: "Durability guarantees that committed transactions are permanently recorded in non-volatile storage (WAL / transaction logs)."
    }
  ]
};

export default function QuizModal({ isOpen, onClose }) {
  const [difficulty, setDifficulty] = useState('beginner');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS.beginner);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch questions from backend when difficulty changes or modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoading(true);
    fetch(`${API_URL}/quiz?difficulty=${difficulty}`)
      .then(res => {
        if (!res.ok) throw new Error("Backend query failed");
        return res.json();
      })
      .then(data => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions(DEFAULT_QUESTIONS[difficulty] || DEFAULT_QUESTIONS.beginner);
        }
      })
      .catch(() => {
        setQuestions(DEFAULT_QUESTIONS[difficulty] || DEFAULT_QUESTIONS.beginner);
      })
      .finally(() => {
        setIsLoading(false);
        resetQuizState();
      });
  }, [difficulty, isOpen]);

  const resetQuizState = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsCompleted(false);
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + (isCompleted ? 1 : 0)) / questions.length) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-[#0b0d16] border border-white/[0.09] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90dvh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#080a12]/70">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Award size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-display">SQL Knowledge Quiz</h2>
                <p className="text-[11px] text-slate-400 font-mono">Test concepts, queries & constraints</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Difficulty Tabs & Stats Bar */}
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#0a0c16]/50 flex flex-wrap items-center justify-between gap-3">
            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setDifficulty(lvl);
                  }}
                  className={`px-3 py-1 text-xs rounded-lg font-medium capitalize transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-indigo'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Streak & Score pill */}
            <div className="flex items-center gap-3 text-xs font-mono">
              {streak > 1 && (
                <div className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse">
                  <Flame size={13} className="fill-amber-400" />
                  <span>{streak} Streak!</span>
                </div>
              )}
              <div className="text-slate-400">
                Score: <span className="text-white font-bold">{score}</span>/{questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-1">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quiz Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw size={24} className="text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-400 font-mono">Loading questions...</span>
              </div>
            ) : isCompleted ? (
              /* Summary Completion Screen */
              <div className="py-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] shadow-glow-indigo mb-4 flex items-center justify-center">
                  <div className="w-full h-full rounded-[15px] bg-[#090b14] flex items-center justify-center text-indigo-300">
                    <Award size={28} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 font-display">Quiz Complete!</h3>
                <p className="text-xs text-slate-400 mb-6">
                  {score === questions.length 
                    ? "Perfect score! You've mastered these SQL concepts."
                    : score >= questions.length / 2
                    ? "Great job! Keep practicing to sharpen your query knowledge."
                    : "Good effort! Review the explanations and try again."}
                </p>

                <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
                  <div className="glass-card p-3 rounded-xl text-center">
                    <div className="text-lg font-bold text-white font-mono">{score}/{questions.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Final Score</div>
                  </div>
                  <div className="glass-card p-3 rounded-xl text-center">
                    <div className="text-lg font-bold text-indigo-400 font-mono">{Math.round((score / questions.length) * 100)}%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Accuracy</div>
                  </div>
                  <div className="glass-card p-3 rounded-xl text-center">
                    <div className="text-lg font-bold text-amber-400 font-mono">{maxStreak}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Max Streak</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetQuizState}
                    className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-glow-indigo transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-all cursor-pointer"
                  >
                    Close Workspace
                  </button>
                </div>
              </div>
            ) : (
              /* Active Question View */
              <div>
                {/* Question Metadata */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">
                    Question {currentIndex + 1} of {questions.length} • {currentQ.topic || 'SQL'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 uppercase font-mono">
                    {difficulty}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-semibold text-white mb-5 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="flex flex-col gap-2.5 mb-5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    
                    let btnClass = "bg-white/[0.02] border-white/[0.07] text-slate-300 hover:bg-white/[0.05] hover:border-white/[0.15]";
                    let letterClass = "bg-white/[0.06] text-slate-400";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-500/15 border-emerald-500/40 text-emerald-200";
                        letterClass = "bg-emerald-500 text-black font-bold";
                      } else if (isSelected) {
                        btnClass = "bg-rose-500/15 border-rose-500/40 text-rose-200";
                        letterClass = "bg-rose-500 text-white font-bold";
                      } else {
                        btnClass = "bg-white/[0.01] border-white/[0.04] text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-mono ${letterClass}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-xs sm:text-sm font-normal">{option}</span>
                        </div>
                        {isAnswered && (
                          <div>
                            {isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                            {!isCorrect && isSelected && <AlertCircle size={16} className="text-rose-400" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-5"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
                        <HelpCircle size={13} />
                        <span>Explanation</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {currentQ.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Controls */}
                <div className="flex items-center justify-end">
                  {isAnswered && (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-5 py-2 text-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-glow-indigo transition-all cursor-pointer active:scale-95"
                    >
                      <span>{currentIndex + 1 === questions.length ? 'View Results' : 'Next Question'}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
