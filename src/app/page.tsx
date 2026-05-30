'use client';

import { useState, useCallback } from 'react';
import LandingPage from '@/components/quiz/LandingPage';
import QuizPage from '@/components/quiz/QuizPage';
import SneakPeekPage from '@/components/quiz/SneakPeekPage';
import RegistrationPage from '@/components/quiz/RegistrationPage';
import ResultPage from '@/components/quiz/ResultPage';
import CommitmentPage from '@/components/quiz/CommitmentPage';
import { calculateResults, type QuizResult } from '@/lib/quiz-data';
import {
  saveAnswers,
  loadAnswers,
  loadCurrentQuestion,
  saveResult,
  loadResult,
  saveRegistration,
  loadRegistration,
  saveCommitment,
  loadCommitment,
  resetAllData,
  hasSavedProgress,
  hasRegistered,
  type RegistrationData,
} from '@/lib/storage';

type AppPage = 'landing' | 'quiz' | 'sneak-peek' | 'register' | 'result' | 'commitment';

interface InitialState {
  page: AppPage;
  answers: Record<number, number>;
  currentQuestion: number;
  result: QuizResult | null;
  commitment: string;
  registration: RegistrationData | null;
  hasProgress: boolean;
}

/**
 * Initialize state from localStorage (lazy initializer for useState)
 */
function getInitialState(): InitialState {
  if (typeof window === 'undefined') {
    return {
      page: 'landing',
      answers: {},
      currentQuestion: 0,
      result: null,
      commitment: '',
      registration: null,
      hasProgress: false,
    };
  }

  const savedAnswers = loadAnswers();
  const savedQuestion = loadCurrentQuestion();
  const savedResult = loadResult() as QuizResult | null;
  const savedCommitment = loadCommitment();
  const savedRegistration = loadRegistration();
  const progress = hasSavedProgress();
  const registered = hasRegistered();

  if (savedResult && registered) {
    return {
      page: savedCommitment ? 'commitment' : 'result',
      answers: savedAnswers,
      currentQuestion: savedQuestion,
      result: savedResult,
      commitment: savedCommitment,
      registration: savedRegistration,
      hasProgress: progress,
    };
  }

  if (savedResult && !registered) {
    return {
      page: 'register',
      answers: savedAnswers,
      currentQuestion: savedQuestion,
      result: savedResult,
      commitment: '',
      registration: null,
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
      registration: null,
      hasProgress: true,
    };
  }

  return {
    page: 'landing',
    answers: {},
    currentQuestion: 0,
    result: null,
    commitment: '',
    registration: null,
    hasProgress: false,
  };
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => getInitialState().page);
  const [answers, setAnswers] = useState<Record<number, number>>(() => getInitialState().answers);
  const [currentQuestion] = useState(() => getInitialState().currentQuestion);
  const [result, setResult] = useState<QuizResult | null>(() => getInitialState().result);
  const [commitment, setCommitment] = useState(() => getInitialState().commitment);
  const [registration, setRegistration] = useState<RegistrationData | null>(() => getInitialState().registration);
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

  // Handle quiz complete → show sneak peek
  const handleQuizComplete = useCallback(() => {
    const quizResult = calculateResults(answers);
    setResult(quizResult);
    saveResult(quizResult);
    setCurrentPage('sneak-peek');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers]);

  // Start quiz
  const handleStartQuiz = useCallback(() => {
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Go to registration from sneak peek
  const handleGoToRegister = useCallback(() => {
    setCurrentPage('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle registration submit → show full results
  const handleRegistrationSubmit = useCallback((data: RegistrationData) => {
    setRegistration(data);
    saveRegistration(data);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Go to commitment from results
  const handleGoToCommitment = useCallback(() => {
    setCurrentPage('commitment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save commitment
  const handleSaveCommitment = useCallback((text: string) => {
    setCommitment(text);
    saveCommitment(text);
  }, []);

  // Retake quiz
  const handleRetake = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    setRegistration(null);
    resetAllData();
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset everything
  const handleReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    setRegistration(null);
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
      {currentPage === 'sneak-peek' && result && (
        <SneakPeekPage result={result} onRegister={handleGoToRegister} />
      )}
      {currentPage === 'register' && (
        <RegistrationPage onSubmit={handleRegistrationSubmit} />
      )}
      {currentPage === 'result' && result && registration && (
        <ResultPage
          result={result}
          registration={registration}
          onRetake={handleRetake}
          onCommitment={handleGoToCommitment}
        />
      )}
      {currentPage === 'commitment' && result && registration && (
        <CommitmentPage
          result={result}
          registration={registration}
          commitment={commitment}
          onSaveCommitment={handleSaveCommitment}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
