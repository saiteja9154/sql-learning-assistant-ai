import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw, Award, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizModal({ isOpen, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions = [
    {
      question: "Which keyword is used to filter result groups returned by a GROUP BY clause?",
      options: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"],
      correctIndex: 1,
      explanation: "The HAVING clause filters groups created by the GROUP BY clause, whereas WHERE filters individual rows before aggregation occurs."
    },
    {
      question: "What is the primary difference between UNION and UNION ALL?",
      options: [
        "UNION ALL deletes duplicate rows, while UNION retains them.",
        "UNION deletes duplicate rows, while UNION ALL retains them.",
        "UNION joins tables vertically, while UNION ALL joins tables horizontally.",
        "There is no difference between them."
      ],
      correctIndex: 1,
      explanation: "UNION performs a sorting and deduplication pass to remove duplicates, which is slower. UNION ALL returns all rows immediately including duplicates."
    },
    {
      question: "Can a database table contain multiple clustered indexes?",
      options: [
        "Yes, as many as columns in the table.",
        "No, a table can only have one clustered index.",
        "Yes, up to a maximum of 3.",
        "Yes, if they are defined on primary keys."
      ],
      correctIndex: 1,
      explanation: "A clustered index defines the physical sorting order of rows on disk. Since data can only be physically sorted in one way, a table is restricted to exactly one clustered index."
    },
    {
      question: "Which normalization form requires that there are no transitive dependencies between non-key attributes?",
      options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
      correctIndex: 2,
      explanation: "Third Normal Form (3NF) requires that the schema is in 2NF and has no transitive dependencies (i.e. non-key columns cannot depend on other non-key columns)."
    },
    {
      question: "What is the result of using COUNT(column_name) on a column containing NULL values?",
      options: [
        "It counts all rows including the NULL values.",
        "It throws a compile-time SQL syntax error.",
        "It ignores the NULL values and counts only non-null values.",
        "It counts NULL values as 0."
      ],
      correctIndex: 2,
      explanation: "COUNT(column_name) counts only records containing non-null values in that specific field. If you need to count all rows including nulls, use COUNT(*)."
    }
  ];

  const handleOptionSelect = (idx) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === quizQuestions[currentQuestion].correctIndex;
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
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
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
            className="relative w-full max-w-xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-cyan-400" />
                <h2 className="text-lg font-bold text-slate-100">SQL Practice Quiz</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all active:scale-95 duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
              {!showResults ? (
                /* Quiz Question View */
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold tracking-wider">
                    <span>QUESTION {currentQuestion + 1} OF {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% COMPLETE</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Title */}
                  <h3 className="text-base font-semibold text-slate-200 leading-relaxed">
                    {quizQuestions[currentQuestion].question}
                  </h3>

                  {/* Options List */}
                  <div className="flex flex-col gap-3">
                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] ${
                          selectedOption === idx
                            ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400'
                            : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 text-slate-300 hover:text-slate-200'
                        }`}
                      >
                        <span>{option}</span>
                        <div 
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedOption === idx
                              ? 'border-cyan-400 bg-cyan-400/20'
                              : 'border-slate-600'
                          }`}
                        >
                          {selectedOption === idx && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Results View */
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 text-cyan-400 mb-4 animate-bounce">
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">Quiz Completed!</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-normal">
                      You scored <strong className="text-cyan-400">{score}</strong> out of <strong className="text-slate-200">{quizQuestions.length}</strong> questions correctly ({Math.round((score / quizQuestions.length) * 100)}%).
                    </p>
                  </div>

                  {/* Detailed question-by-question review */}
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

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-slate-950/40 flex justify-between gap-3">
              {showResults ? (
                <button
                  onClick={handleReset}
                  className="mx-auto flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-tr from-cyan-500/20 to-brand-blue/20 hover:from-cyan-500/35 hover:to-brand-blue/35 border border-cyan-400/30 text-white transition-all active:scale-95 duration-200"
                >
                  <RefreshCw size={13} />
                  <span>Retake Quiz</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all active:scale-95 duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 duration-200 ${
                      selectedOption !== null
                        ? 'bg-gradient-to-r from-cyan-500 to-brand-blue text-white shadow-glow-cyan cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next Question"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
