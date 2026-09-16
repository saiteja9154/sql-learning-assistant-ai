import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw, Award, BookOpen, Layers, Zap, Flame, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';
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
      explanation: "WHERE filters individual records before any grouping/aggregation occurs. HAVING filters groups produced by GROUP BY."
    },
    {
      id: "i3",
      topic: "Subqueries",
      difficulty: "intermediate",
      question: "What distinguishes a 'Correlated Subquery' from a standard nested subquery?",
      options: [
        "It executes only once for the entire query execution.",
        "It references columns from the outer query and re-evaluates for every candidate row.",
        "It can only be used inside the FROM clause.",
        "It is always faster than a JOIN operation."
      ],
      correctIndex: 1,
      explanation: "A correlated subquery references values from the outer query table, meaning it must be evaluated row-by-row for each row processed by the outer query."
    },
    {
      id: "i4",
      topic: "Normalization",
      difficulty: "intermediate",
      question: "Which Normal Form (NF) is satisfied when a table is in 1NF and all non-key columns are fully functionally dependent on the entire primary key (no partial dependencies)?",
      options: [
        "Second Normal Form (2NF)",
        "Third Normal Form (3NF)",
        "Boyce-Codd Normal Form (BCNF)",
        "Fourth Normal Form (4NF)"
      ],
      correctIndex: 0,
      explanation: "Second Normal Form (2NF) eliminates partial functional dependencies, ensuring every non-key attribute depends on the full composite primary key."
    },
    {
      id: "i5",
      topic: "Indexes",
      difficulty: "intermediate",
      question: "Why can a relational database table have only ONE Clustered Index?",
      options: [
        "Database engines enforce an artificial limit to save RAM.",
        "A clustered index defines the actual physical storage order of data rows on disk.",
        "Clustered indexes only work on VARCHAR columns.",
        "Multiple clustered indexes cause deadlock in single-threaded queries."
      ],
      correctIndex: 1,
      explanation: "Because a clustered index determines the physical sequence in which data pages and rows are stored on disk, data can only be physically sorted in one way."
    },
    {
      id: "i6",
      topic: "UNION vs UNION ALL",
      difficulty: "intermediate",
      question: "Why is UNION ALL typically faster in execution than UNION?",
      options: [
        "UNION ALL uses an in-memory cache while UNION writes to disk.",
        "UNION ALL returns all rows immediately without performing a duplicate sorting/deduplication step.",
        "UNION ALL skips type checking across result columns.",
        "UNION requires a foreign key relation between both queries."
      ],
      correctIndex: 1,
      explanation: "UNION runs an implicit DISTINCT sort to eliminate duplicate rows, which is CPU and memory intensive. UNION ALL returns rows without deduplication."
    }
  ],
  advanced: [
    {
      id: "a1",
      topic: "Window Functions",
      difficulty: "advanced",
      question: "What is the difference between RANK() and DENSE_RANK() when encountering tied values?",
      options: [
        "RANK() leaves no gaps in subsequent rank numbers; DENSE_RANK() skips ranks.",
        "RANK() assigns gaps in ranking sequence after ties; DENSE_RANK() produces consecutive rank numbers without gaps.",
        "RANK() requires an ORDER BY clause; DENSE_RANK() operates only with PARTITION BY.",
        "DENSE_RANK() only works with integer score columns."
      ],
      correctIndex: 1,
      explanation: "When ties occur (e.g. 1, 2, 2), RANK() skips the next number resulting in (1, 2, 2, 4), while DENSE_RANK() assigns consecutive numbers (1, 2, 2, 3)."
    },
    {
      id: "a2",
      topic: "CTE",
      difficulty: "advanced",
      question: "What is the mandatory structure of a Recursive Common Table Expression (Recursive CTE)?",
      options: [
        "Two SELECT queries joined by an INNER JOIN.",
        "An Anchor Member query combined with a Recursive Member query via UNION ALL.",
        "A WHILE loop statement wrapped around a temporary table.",
        "A stored procedure that calls itself recursively."
      ],
      correctIndex: 1,
      explanation: "A recursive CTE consists of an Anchor Member (base case) and a Recursive Member (recursive step referencing the CTE name), unified using UNION ALL with a termination condition."
    },
    {
      id: "a3",
      topic: "Window Functions",
      difficulty: "advanced",
      question: "Which window function allows you to access data from the preceding row without joining the table to itself?",
      options: ["LEAD()", "LAG()", "PREV()", "ROW_NUMBER()"],
      correctIndex: 1,
      explanation: "LAG() accesses data from a previous row at a specified offset within the partition. LEAD() accesses data from subsequent rows."
    },
    {
      id: "a4",
      topic: "Transactions",
      difficulty: "advanced",
      question: "Which ACID property guarantees that once a transaction has committed, its changes survive even in the event of a system crash or power outage?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correctIndex: 3,
      explanation: "Durability guarantees that committed transactions are permanently recorded in non-volatile storage (via transaction write-ahead logs) and survive system crashes."
    },
    {
      id: "a5",
      topic: "Triggers & Procedures",
      difficulty: "advanced",
      question: "Inside an AFTER UPDATE trigger in SQL, which pseudo-tables are available to inspect pre-update and post-update row values?",
      options: [
        "OLD and NEW (or DELETED and INSERTED)",
        "BEFORE and AFTER",
        "PREVIOUS and CURRENT",
        "TEMP_SOURCE and TEMP_TARGET"
      ],
      correctIndex: 0,
      explanation: "In standard SQL (and engines like PostgreSQL/MySQL/SQL Server), triggers use OLD/DELETED to read values before the update and NEW/INSERTED for the updated values."
    },
    {
      id: "a6",
      topic: "Performance & Execution",
      difficulty: "advanced",
      question: "What is an 'Index Scan' vs an 'Index Seek' in query execution plans?",
      options: [
        "An Index Scan navigates directly to specific rows using B-Tree keys, while an Index Seek traverses all leaf pages.",
        "An Index Seek uses the B-Tree structure to jump directly to qualifying rows; an Index Scan traverses all pages of the index.",
        "Index Seek is only possible on tables with fewer than 1000 rows.",
        "There is no difference; they are synonyms used by different database engines."
      ],
      correctIndex: 1,
      explanation: "An Index Seek leverages the B-Tree index hierarchy to pinpoint specific target rows efficiently (O(log N)), whereas an Index Scan reads through the entire index."
    }
  ]
};

const DIFFICULTY_CONFIG = {
  beginner: {
    label: "Beginner",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    borderActive: "border-emerald-500/50 bg-emerald-500/10",
    icon: Sparkles,
    iconColor: "text-emerald-400",
    description: "SQL fundamentals, SELECT, WHERE, CRUD, and basic filtering."
  },
  intermediate: {
    label: "Intermediate",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    borderActive: "border-blue-500/50 bg-blue-500/10",
    icon: Zap,
    iconColor: "text-blue-400",
    description: "Joins, grouping, HAVING, subqueries, and practical multi-table queries."
  },
  advanced: {
    label: "Advanced",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    borderActive: "border-purple-500/50 bg-purple-500/10",
    icon: Flame,
    iconColor: "text-purple-400",
    description: "CTEs, Window Functions, indexing, transactions, and query optimization."
  }
};

export default function QuizModal({ isOpen, onClose }) {
  // Phase state: 'select_difficulty' | 'in_quiz' | 'results'
  const [phase, setPhase] = useState('select_difficulty');
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [activeDifficulty, setActiveDifficulty] = useState('beginner');
  
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setPhase('select_difficulty');
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswers([]);
      setScore(0);
    }
  }, [isOpen]);

  const startQuiz = async (difficulty) => {
    const diff = difficulty || selectedDifficulty;
    setActiveDifficulty(diff);
    setIsLoadingQuestions(true);

    try {
      const res = await fetch(`${API_URL}/quiz?difficulty=${diff}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions);
        } else {
          setQuizQuestions(DEFAULT_QUESTIONS[diff] || DEFAULT_QUESTIONS.beginner);
        }
      } else {
        setQuizQuestions(DEFAULT_QUESTIONS[diff] || DEFAULT_QUESTIONS.beginner);
      }
    } catch (e) {
      setQuizQuestions(DEFAULT_QUESTIONS[diff] || DEFAULT_QUESTIONS.beginner);
    } finally {
      setIsLoadingQuestions(false);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswers([]);
      setScore(0);
      setPhase('in_quiz');
    }
  };

  const handleOptionSelect = (idx) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    const activeQ = quizQuestions[currentQuestion];
    if (!activeQ) return;

    const isCorrect = selectedOption === activeQ.correctIndex;
    const nextAnswers = [...answers, {
      questionIdx: currentQuestion,
      selectedIdx: selectedOption,
      isCorrect
    }];
    setAnswers(nextAnswers);

    if (isCorrect) {
      setScore(s => s + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedOption(null);
    } else {
      setPhase('results');
    }
  };

  const handleRetake = () => {
    startQuiz(activeDifficulty);
  };

  const handleChangeDifficulty = () => {
    setPhase('select_difficulty');
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers([]);
    setScore(0);
  };

  const diffConfig = DIFFICULTY_CONFIG[activeDifficulty] || DIFFICULTY_CONFIG.beginner;

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
            className="relative w-full max-w-xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-brand-purple" />
                <h2 className="text-lg font-bold text-slate-100">SQL Practice Quiz</h2>
                {phase !== 'select_difficulty' && (
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${diffConfig.badge}`}>
                    {diffConfig.label}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
              
              {/* PHASE 1: DIFFICULTY SELECTION */}
              {phase === 'select_difficulty' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">Choose Quiz Difficulty</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Select your skill level to test your knowledge against curated SQL topics.
                    </p>
                  </div>

                  {/* Difficulty Cards Grid */}
                  <div className="flex flex-col gap-3">
                    {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      const isSelected = selectedDifficulty === key;
                      return (
                        <div
                          key={key}
                          onClick={() => setSelectedDifficulty(key)}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? `${config.borderActive} shadow-sm`
                              : 'bg-slate-950/40 border-white/5 hover:bg-slate-900/60 hover:border-white/10'
                          }`}
                        >
                          <div className={`p-2 rounded-lg bg-slate-900 border border-white/5 mt-0.5 ${config.iconColor}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-100">{config.label}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-brand-purple bg-brand-purple/20' : 'border-slate-700'
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-brand-purple" />}
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PHASE 2: IN QUIZ */}
              {phase === 'in_quiz' && quizQuestions.length > 0 && (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold tracking-wider">
                    <span>QUESTION {currentQuestion + 1} OF {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% COMPLETE</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-brand-purple to-brand-blue h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Topic & Title */}
                  <div>
                    {quizQuestions[currentQuestion].topic && (
                      <span className="text-[10px] font-semibold text-brand-purple uppercase tracking-wider mb-1.5 inline-block">
                        Topic: {quizQuestions[currentQuestion].topic}
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-slate-200 leading-relaxed">
                      {quizQuestions[currentQuestion].question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="flex flex-col gap-3">
                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                          selectedOption === idx
                            ? 'bg-brand-purple/15 border-brand-purple/50 text-white shadow-glow-purple'
                            : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 text-slate-300 hover:text-slate-100'
                        }`}
                      >
                        <span>{option}</span>
                        <div 
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                            selectedOption === idx
                              ? 'border-brand-purple bg-brand-purple/30'
                              : 'border-slate-700'
                          }`}
                        >
                          {selectedOption === idx && <div className="w-2 h-2 rounded-full bg-brand-purple" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PHASE 3: RESULTS */}
              {phase === 'results' && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 text-brand-purple mb-4 animate-bounce">
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">Quiz Completed!</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-normal">
                      Difficulty: <strong className="text-slate-200 capitalize">{activeDifficulty}</strong> • You scored <strong className="text-brand-purple">{score}</strong> out of <strong className="text-slate-200">{quizQuestions.length}</strong> questions correctly ({Math.round((score / Math.max(quizQuestions.length, 1)) * 100)}%).
                    </p>
                  </div>

                  {/* Question Review */}
                  <div className="text-left space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Question Review</h4>
                    {quizQuestions.map((q, idx) => {
                      const userAns = answers.find(a => a.questionIdx === idx);
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-200 leading-normal">{q.question}</span>
                            {userAns?.isCorrect ? (
                              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                            ) : (
                              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-light">
                            <span className="font-semibold text-slate-300">Your Answer:</span> {q.options[userAns?.selectedIdx]}
                          </div>
                          {!userAns?.isCorrect && (
                            <div className="text-xs text-emerald-400 font-light">
                              <span className="font-semibold text-emerald-500">Correct Answer:</span> {q.options[q.correctIndex]}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-500 leading-relaxed font-light bg-slate-900/40 p-2 rounded-lg mt-1 border border-white/5">
                            <strong>Note:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="p-4 border-t border-white/5 bg-slate-950/40 flex items-center justify-between gap-3">
              {phase === 'select_difficulty' && (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all active:scale-95 duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => startQuiz(selectedDifficulty)}
                    disabled={isLoadingQuestions}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple hover:opacity-95 transition-all active:scale-95 duration-200 cursor-pointer"
                  >
                    <span>Start {DIFFICULTY_CONFIG[selectedDifficulty]?.label} Quiz</span>
                    <ArrowRight size={13} />
                  </button>
                </>
              )}

              {phase === 'in_quiz' && (
                <>
                  <button
                    onClick={handleChangeDifficulty}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={13} />
                    <span>Change Level</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 duration-200 ${
                      selectedOption !== null
                        ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </button>
                </>
              )}

              {phase === 'results' && (
                <div className="w-full flex items-center justify-between gap-3">
                  <button
                    onClick={handleChangeDifficulty}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all active:scale-95 duration-200 cursor-pointer"
                  >
                    Change Difficulty
                  </button>
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple hover:opacity-95 transition-all active:scale-95 duration-200 cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
