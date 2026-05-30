'use client';

import { useState, useCallback } from 'react';
import LandingPage from '@/components/quiz/LandingPage';
import QuizPage from '@/components/quiz/QuizPage';
import ResultPage from '@/components/quiz/ResultPage';
import CommitmentPage from '@/components/quiz/CommitmentPage';
import { calculateResults, type QuizResult } from '@/lib/quiz-data';
import {
  saveAnswers,
  loadAnswers,
  loadCurrentQuestion,
  saveResult,
  loadResult,
  saveCommitment,
  loadCommitment,
  resetAllData,
  hasSavedProgress,
} from '@/lib/storage';

type AppPage = 'landing' | 'quiz' | 'result' | 'commitment';

interface InitialState {
  page: AppPage;
  answers: Record<number, number>;
  currentQuestion: number;
  result: QuizResult | null;
  commitment: string;
  hasProgress: boolean;
}

/**
 * Helper to initialize state from localStorage (lazy initializer for useState)
 * Only runs on client during first render
 */
function getInitialState(): InitialState {
  if (typeof window === 'undefined') {
    return {
      page: 'landing',
      answers: {},
      currentQuestion: 0,
      result: null,
      commitment: '',
      hasProgress: false,
    };
  }

  const savedAnswers = loadAnswers();
  const savedQuestion = loadCurrentQuestion();
  const savedResult = loadResult() as QuizResult | null;
  const savedCommitment = loadCommitment();
  const progress = hasSavedProgress();

  if (savedResult) {
    return {
      page: savedCommitment ? 'commitment' : 'result',
      answers: savedAnswers,
      currentQuestion: savedQuestion,
      result: savedResult,
      commitment: savedCommitment,
      hasProgress: progress,
    };
  }

  if (progress) {
    return {
      page: 'landing',
      answers: savedAnswers,
      currentQuestion: savedQuestion,
      result: null,
      commitment: '',
      hasProgress: true,
    };
  }

  return {
    page: 'landing',
    answers: {},
    currentQuestion: 0,
    result: null,
    commitment: '',
    hasProgress: false,
  };
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => getInitialState().page);
  const [answers, setAnswers] = useState<Record<number, number>>(() => getInitialState().answers);
  const [currentQuestion] = useState(() => getInitialState().currentQuestion);
  const [result, setResult] = useState<QuizResult | null>(() => getInitialState().result);
  const [commitment, setCommitment] = useState(() => getInitialState().commitment);
  const [hasProgress] = useState(() => getInitialState().hasProgress);

  // Handle quiz answer
  const handleAnswer = useCallback(
    (questionId: number, value: number) => {
      setAnswers((prev) => {
        const updated = { ...prev, [questionId]: value };
        saveAnswers(updated);
        return updated;
      });
    },
    []
  );

  // Handle quiz complete
  const handleQuizComplete = useCallback(() => {
    setAnswers((currentAnswers) => {
      const quizResult = calculateResults(currentAnswers);
      setResult(quizResult);
      saveResult(quizResult);
      setCurrentPage('result');
      return currentAnswers;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Start quiz
  const handleStartQuiz = useCallback(() => {
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Retake quiz
  const handleRetake = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    resetAllData();
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Go to commitment page
  const handleGoToCommitment = useCallback(() => {
    setCurrentPage('commitment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save commitment
  const handleSaveCommitment = useCallback((text: string) => {
    setCommitment(text);
    saveCommitment(text);
  }, []);

  // Reset everything
  const handleReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    resetAllData();
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'landing' && (
        <LandingPage onStart={handleStartQuiz} hasProgress={hasProgress} />
      )}
      {currentPage === 'quiz' && (
        <QuizPage
          answers={answers}
          onAnswer={handleAnswer}
          onComplete={handleQuizComplete}
          initialQuestion={currentQuestion}
        />
      )}
      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onRetake={handleRetake}
          onCommitment={handleGoToCommitment}
        />
      )}
      {currentPage === 'commitment' && result && (
        <CommitmentPage
          result={result}
          commitment={commitment}
          onSaveCommitment={handleSaveCommitment}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
