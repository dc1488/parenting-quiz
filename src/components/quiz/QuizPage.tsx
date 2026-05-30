'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QUESTIONS, LIKERT_LABELS, CATEGORIES, CATEGORY_ICONS } from '@/lib/quiz-data';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface QuizPageProps {
  answers: Record<number, number>;
  onAnswer: (questionId: number, value: number) => void;
  onComplete: () => void;
  initialQuestion?: number;
}

export default function QuizPage({ answers, onAnswer, onComplete, initialQuestion = 0 }: QuizPageProps) {
  const [currentIndex, setCurrentIndex] = useState(initialQuestion);
  const [direction, setDirection] = useState(0); // -1 = backward, 1 = forward

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const progressValue = ((currentIndex + 1) / totalQuestions) * 100;

  // Get current category info
  const currentCategory = currentQuestion.category;
  const categoryLabel = CATEGORIES[currentCategory];
  const categoryIcon = CATEGORY_ICONS[currentCategory];

  // Get the range of questions in the current category
  const categoryQuestions = QUESTIONS.filter((q) => q.category === currentCategory);
  const questionInCategory = categoryQuestions.findIndex((q) => q.id === currentQuestion.id) + 1;

  const isAnswered = answers[currentQuestion.id] !== undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  const goNext = () => {
    if (isLastQuestion) return;
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleAnswer = (value: number) => {
    onAnswer(currentQuestion.id, value);
    // Auto-advance after a short delay
    setTimeout(() => {
      if (!isLastQuestion) {
        setDirection(1);
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
      }
    }, 400);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && isAnswered) goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isLastQuestion]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-warm-600">
              Pertanyaan {currentIndex + 1} dari {totalQuestions}
            </span>
            <span className="text-sm text-warm-500">
              {Math.round(progressValue)}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2 bg-warm-200 [&>[data-slot=progress-indicator]]:bg-warm-700" />
        </div>

        {/* Category badge */}
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-100 text-warm-700 text-sm font-medium">
            <span>{categoryIcon}</span>
            <span>{categoryLabel}</span>
            <span className="text-warm-400">·</span>
            <span className="text-warm-500">{questionInCategory}/{categoryQuestions.length}</span>
          </div>
        </motion.div>

        {/* Question card with animation */}
        <div className="flex-1 flex items-start justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full"
            >
              <Card className="border-warm-200 bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  {/* Question text */}
                  <h2 className="text-lg sm:text-xl font-semibold text-warm-900 mb-8 leading-relaxed text-center">
                    {currentQuestion.text}
                  </h2>

                  {/* Likert scale */}
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          answers[currentQuestion.id] === value
                            ? 'border-warm-600 bg-warm-50 shadow-sm'
                            : 'border-warm-150 bg-white hover:border-warm-300 hover:bg-warm-50/50'
                        }`}
                      >
                        {/* Number circle */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-200 ${
                            answers[currentQuestion.id] === value
                              ? 'bg-warm-700 text-white'
                              : 'bg-warm-100 text-warm-600'
                          }`}
                        >
                          {answers[currentQuestion.id] === value ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            value
                          )}
                        </div>
                        <span
                          className={`text-sm sm:text-base font-medium ${
                            answers[currentQuestion.id] === value
                              ? 'text-warm-900'
                              : 'text-warm-700'
                          }`}
                        >
                          {LIKERT_LABELS[value]}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 pb-4">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="border-warm-200 text-warm-700 hover:bg-warm-50 hover:text-warm-900"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Sebelumnya
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={onComplete}
              disabled={!allAnswered}
              className="bg-warm-800 hover:bg-warm-900 text-white shadow-md"
            >
              Lihat Hasil
              <Check className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={goNext}
              disabled={!isAnswered}
              className="border-warm-200 text-warm-700 hover:bg-warm-50 hover:text-warm-900"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
